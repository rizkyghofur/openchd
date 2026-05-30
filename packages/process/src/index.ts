// @ts-nocheck
// Temporary disable check - install dependencies with pnpm install first

import {
  ConversionOptions,
  ConversionResult,
  PlatformInfo,
  QueueItem,
} from "@openchd/shared";
import { ChildProcess, spawn } from "child_process";
import { EventEmitter } from "events";
import { existsSync, readFileSync, writeFileSync, readdirSync, chmodSync } from "fs";
import { join, dirname } from "path";

interface RunningJob {
  process: ChildProcess;
  item: QueueItem;
  startTime: number;
  logs: string[];
}

export class ProcessManager extends EventEmitter {
  private queue: QueueItem[] = [];
  private runningJobs: Map<string, RunningJob> = new Map();
  private maxConcurrentJobs: number = 1;
  private platformInfo: PlatformInfo;

  constructor(maxConcurrentJobs: number = 1) {
    super();
    this.maxConcurrentJobs = maxConcurrentJobs;
    this.platformInfo = this.detectPlatform();
  }

  private detectPlatform(): PlatformInfo {
    const currentPlatform = process.platform;
    const currentArch = process.arch;
    const os: PlatformInfo["os"] =
      currentPlatform === "win32"
        ? "windows"
        : currentPlatform === "darwin"
          ? "macos"
          : "linux";
    const arch: PlatformInfo["arch"] = currentArch === "x64" ? "x64" : "arm64";

    return {
      os,
      arch,
      binaryPath: this.getBinaryPath(os, arch),
    };
  }

  private getBinaryPath(
    os: PlatformInfo["os"],
    arch: PlatformInfo["arch"],
  ): string {
    const binaryName = os === "windows" ? "chdman.exe" : "chdman";
    const osFolder = os === "windows" ? "windows" : os === "macos" ? "macos" : "linux";

    // Helper to apply chmod +x on non-windows platforms
    const makeExecutable = (filePath: string): string => {
      if (os !== "windows" && existsSync(filePath)) {
        try {
          chmodSync(filePath, 0o755);
        } catch (e) {
          // Ignored
        }
      }
      return filePath;
    };

    // 1. Cek lokasi di Development Mode / Node Modules (di-download otomatis lewat package @emmercm/chdman)
    const npmPlatform = os === "macos" ? "darwin" : os === "windows" ? "win32" : "linux";
    const npmArch = arch === "arm64" ? "arm64" : "x64";
    const packageName = `@emmercm/chdman-${npmPlatform}-${npmArch}`;

    // Cek di folder node_modules workspace root
    const nodeModulesPath = join(__dirname, "../../../node_modules", packageName, "dist", binaryName);
    if (existsSync(nodeModulesPath)) {
      return makeExecutable(nodeModulesPath);
    }

    // Cek di folder node_modules package internal
    const internalNodeModulesPath = join(__dirname, "../node_modules", packageName, "dist", binaryName);
    if (existsSync(internalNodeModulesPath)) {
      return makeExecutable(internalNodeModulesPath);
    }

    // 2. Cek lokasi di Development Mode lokal (/assets/binaries)
    const devPath = join(__dirname, "../../../assets/binaries", osFolder, binaryName);
    if (existsSync(devPath)) {
      return makeExecutable(devPath);
    }

    // 3. Cek lokasi di Production Mode (didistribusikan bersama berkas resources Electron app)
    if (process.resourcesPath) {
      // Cek dengan format subfolder spesifik platform-arch yang kita package via extraResources
      const prodArchFolder = `${osFolder}-${arch}`;
      const prodPathWithArch = join(process.resourcesPath, "assets/binaries", prodArchFolder, binaryName);
      if (existsSync(prodPathWithArch)) {
        return makeExecutable(prodPathWithArch);
      }

      // Fallback ke format lama tanpa arch
      const prodPath = join(process.resourcesPath, "assets/binaries", osFolder, binaryName);
      if (existsSync(prodPath)) {
        return makeExecutable(prodPath);
      }
    }

    // 4. Fallback ke chdman global di PATH jika tidak ada binary bawaan
    return binaryName;
  }

  public async startConversion(
    item: QueueItem,
    options: ConversionOptions,
  ): Promise<ConversionResult> {
    // Add to internal queue if not already present
    if (!this.queue.some((q) => q.id === item.id)) {
      this.queue.push(item);
    }
    const startTime = Date.now();
    const logs: string[] = [];

    try {
      const args = this.buildArgs(item, options);
      const binaryPath = this.platformInfo.binaryPath;

      logs.push(`Starting conversion: ${binaryPath} ${args.join(" ")}`);

      const result = await this.executeChdman(binaryPath, args, item.id, logs);

      return {
        ...result,
        duration: (Date.now() - startTime) / 1000,
        logs,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logs.push(`Error: ${errorMessage}`);

      return {
        success: false,
        error: errorMessage,
        logs,
        duration: (Date.now() - startTime) / 1000,
      };
    }
  }

  private buildArgs(item: QueueItem, options: ConversionOptions): string[] {
    const args: string[] = [];
    const chdOptions = options?.chd;

    switch (item.conversionType) {
      case "iso-to-chd":
        args.push("createcd");
        args.push("--input", item.inputFiles[0].path);
        args.push("--output", item.outputPath);
        break;

      case "bin-cue-to-chd":
        args.push("createcd");
        args.push("--input", item.inputFiles[0].path);
        args.push("--output", item.outputPath);
        break;

      case "gdi-to-chd":
        args.push("createdvd");
        args.push("--input", item.inputFiles[0].path);
        args.push("--output", item.outputPath);
        break;

      case "chd-to-iso":
        args.push("extractcd");
        args.push("--input", item.inputFiles[0].path);
        args.push("--output", item.outputPath);
        break;

      case "chd-to-bin":
        args.push("extractcd");
        args.push("--input", item.inputFiles[0].path);
        args.push("--output", item.outputPath);
        break;

      default:
        throw new Error(`Unsupported conversion type: ${item.conversionType}`);
    }

    const isCreate = ["iso-to-chd", "bin-cue-to-chd", "gdi-to-chd"].includes(item.conversionType);

    if (isCreate) {
      // Add compression level
      if (
        chdOptions?.compressionLevel &&
        chdOptions.compressionLevel !== "normal"
      ) {
        const compressionMap: Record<string, string> = {
          none: "none",
          fast: "fast",
          normal: "zlib",
          best: "zlib+",
        };
        args.push(
          "--compress",
          compressionMap[chdOptions.compressionLevel] || "zlib",
        );
      }

      // Add hunk size if specified
      if (chdOptions?.hunkSize) {
        args.push("--hunksize", String(chdOptions.hunkSize));
      }
    }

    // Force overwrite existing files if overwriteExisting is true
    if (chdOptions?.overwriteExisting) {
      args.push("--force");
    }

    return args;
  }

  private executeChdman(
    binaryPath: string,
    args: string[],
    jobId: string,
    logs: string[],
  ): Promise<ConversionResult> {
    return new Promise((resolve) => {
      const childProcess = spawn(binaryPath, args, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      this.runningJobs.set(jobId, {
        process: childProcess,
        item: this.queue.find((q) => q.id === jobId)!,
        startTime: Date.now(),
        logs,
      });

      let output = "";
      let errorOutput = "";

      childProcess.stdout?.on("data", (data: Buffer) => {
        const text = data.toString();
        output += text;
        logs.push(text);

        // Parse progress from chdman output
        const progress = this.parseProgress(text);
        if (progress !== null) {
          this.emit("progress", jobId, progress);
        }
      });

      childProcess.stderr?.on("data", (data: Buffer) => {
        const text = data.toString();
        logs.push(text);

        // Parse progress from chdman output (chdman progress is printed to stderr)
        const progress = this.parseProgress(text);
        if (progress !== null) {
          this.emit("progress", jobId, progress);
        } else {
          // If it's a real error and not progress/hunk info, record it
          if (!text.includes("hunk") && !text.includes("%") && text.trim().length > 0) {
            errorOutput += text;
          }
        }
      });

      childProcess.on("close", (code: number | null) => {
        this.runningJobs.delete(jobId);

        if (code === 0) {
          this.emit("complete", jobId, {
            success: true,
            outputPath: this.queue.find((q) => q.id === jobId)?.outputPath,
          });

          resolve({
            success: true,
            outputPath: this.queue.find((q) => q.id === jobId)?.outputPath,
            logs,
          });
        } else {
          const errorMsg = errorOutput || `Process exited with code ${code}`;
          this.emit("error", jobId, errorMsg);

          resolve({
            success: false,
            error: errorMsg,
            logs,
          });
        }
      });

      childProcess.on("error", (error: Error) => {
        this.runningJobs.delete(jobId);
        const errorMsg = error.message;
        logs.push(`[ERROR] ${errorMsg}`);

        this.emit("error", jobId, errorMsg);

        resolve({
          success: false,
          error: errorMsg,
          logs,
        });
      });
    });
  }

  private parseProgress(text: string): number | null {
    const hunkMatch = text.match(/hunk (\d+) of (\d+)/i);
    if (hunkMatch) {
      const current = parseInt(hunkMatch[1], 10);
      const total = parseInt(hunkMatch[2], 10);
      return (current / total) * 100;
    }

    const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
    if (percentMatch) {
      return parseFloat(percentMatch[1]);
    }

    return null;
  }

  public async addToQueue(item: QueueItem): Promise<void> {
    this.queue.push(item);
  }

  public async addToQueueBatch(items: QueueItem[]): Promise<void> {
    this.queue.push(...items);
  }

  public getQueue(): QueueItem[] {
    return [...this.queue];
  }

  public async clearQueue(): Promise<void> {
    this.queue = this.queue.filter((item) => item.status === "running");
  }

  public async cancelConversion(jobId: string): Promise<void> {
    const runningJob = this.runningJobs.get(jobId);
    if (runningJob) {
      runningJob.process.kill("SIGTERM");
      this.runningJobs.delete(jobId);

      const item = this.queue.find((q) => q.id === jobId);
      if (item) {
        item.status = "cancelled";
        item.completedAt = new Date();
      }

      this.emit("cancelled", jobId);
    }
  }

  public async pauseConversion(jobId: string): Promise<void> {
    const runningJob = this.runningJobs.get(jobId);
    if (runningJob) {
      runningJob.process.kill("SIGSTOP");

      const item = this.queue.find((q) => q.id === jobId);
      if (item) {
        item.status = "paused";
      }

      this.emit("paused", jobId);
    }
  }

  public async resumeConversion(jobId: string): Promise<void> {
    const runningJob = this.runningJobs.get(jobId);
    if (runningJob) {
      runningJob.process.kill("SIGCONT");

      const item = this.queue.find((q) => q.id === jobId);
      if (item) {
        item.status = "running";
      }

      this.emit("resumed", jobId);
    }
  }

  public killAll(): void {
    for (const [jobId, runningJob] of this.runningJobs) {
      runningJob.process.kill("SIGTERM");
      this.runningJobs.delete(jobId);

      const item = this.queue.find((q) => q.id === jobId);
      if (item) {
        item.status = "cancelled";
        item.completedAt = new Date();
      }
    }
  }

  public getRunningJobs(): string[] {
    return Array.from(this.runningJobs.keys());
  }

  public getChdInfo(chdPath: string): Promise<any> {
    return new Promise((resolve) => {
      const binaryPath = this.platformInfo.binaryPath;
      const childProcess = spawn(binaryPath, ["info", "--input", chdPath]);
      let output = "";
      childProcess.stdout?.on("data", (data) => {
        output += data.toString();
      });
      childProcess.stderr?.on("data", (data) => {
        output += data.toString();
      });
      childProcess.on("close", () => {
        // Parse chdman info output
        const info: any = {};
        const versionMatch = output.match(/version:\s*(\d+)/i);
        const bytesMatch = output.match(/logical bytes:\s*([\d,]+)/i);
        const hunkMatch = output.match(/hunk size:\s*([\d,]+)/i);
        const hunksMatch = output.match(/total hunks:\s*([\d,]+)/i);
        const compressionMatch = output.match(/compression:\s*([^\r\n]+)/i);
        const ratioMatch = output.match(/ratio:\s*([\d.]+%)/i);

        if (versionMatch) info.version = versionMatch[1];
        if (bytesMatch) info.logicalSize = bytesMatch[1];
        if (hunkMatch) info.hunkSize = hunkMatch[1];
        if (hunksMatch) info.totalHunks = hunksMatch[1];
        if (compressionMatch) info.compression = compressionMatch[1].trim();
        if (ratioMatch) info.ratio = ratioMatch[1];

        resolve(info);
      });
      childProcess.on("error", () => {
        resolve({});
      });
    });
  }

  public async validateCueFile(cuePath: string): Promise<any> {
    try {
      const cueDir = dirname(cuePath);
      const cueContent = readFileSync(cuePath, "utf-8");
      
      // Find all FILE "..." lines
      const fileLines = cueContent.match(/FILE\s+["']?([^"'\r\n]+)["']?\s+BINARY/gi) || [];
      const referencedFiles: string[] = [];
      
      for (const line of fileLines) {
        const match = line.match(/FILE\s+["']?([^"'\r\n]+)["']?\s+BINARY/i);
        if (match) {
          referencedFiles.push(match[1]);
        }
      }
      
      const missingFiles: string[] = [];
      const suggestions: Record<string, string> = {};
      
      // Get all files in directory for case-insensitive suggestion
      const dirFiles = readdirSync(cueDir);
      
      for (const refFile of referencedFiles) {
        const fullPath = join(cueDir, refFile);
        if (!existsSync(fullPath)) {
          missingFiles.push(refFile);
          
          // Try to find a file with the same name but different case
          const lowerRef = refFile.toLowerCase();
          const matchFile = dirFiles.find((f) => f.toLowerCase() === lowerRef);
          if (matchFile) {
            suggestions[refFile] = matchFile;
          }
        }
      }
      
      return {
        valid: missingFiles.length === 0,
        missingFiles,
        suggestions: Object.keys(suggestions).length > 0 ? suggestions : undefined,
      };
    } catch (e) {
      return { valid: true, missingFiles: [] }; // Safe fallback
    }
  }

  public async fixCueFile(cuePath: string, corrections: Record<string, string>): Promise<void> {
    try {
      let cueContent = readFileSync(cuePath, "utf-8");
      for (const [wrongName, correctName] of Object.entries(corrections)) {
        // Escape wrongName for regex
        const escaped = wrongName.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(escaped, "g");
        cueContent = cueContent.replace(regex, correctName);
      }
      writeFileSync(cuePath, cueContent, "utf-8");
    } catch (e) {
      // Ignored
    }
  }

  public getPlatformInfo(): PlatformInfo {
    return { ...this.platformInfo };
  }
}

export { ProcessManager as default };
