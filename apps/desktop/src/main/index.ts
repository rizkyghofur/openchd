// @ts-nocheck
// Temporary disable check - install dependencies with pnpm install first

import { ProcessManager } from "@openchd/process";
import { ConversionOptions, QueueItem } from "@openchd/shared";
import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import { join } from "path";

const processManager = new ProcessManager();
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    minWidth: 900,
    minHeight: 650,
    title: "OpenCHD",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  if (
    process.env.NODE_ENV === "development" ||
    process.env.VITE_DEV_SERVER_URL
  ) {
    mainWindow.loadURL(
      process.env.VITE_DEV_SERVER_URL || "http://localhost:5173",
    );
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function setupIPC(): void {
  ipcMain.handle("shell:openPath", async (_event, folderPath: string) => {
    return shell.openPath(folderPath);
  });

  ipcMain.handle("shell:showItemInFolder", async (_event, filePath: string) => {
    shell.showItemInFolder(filePath);
  });

  ipcMain.handle("dialog:selectDirectory", async () => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
      title: "Select Output Directory",
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });
  ipcMain.handle(
    "convert:start",
    async (_event, item: QueueItem, options: ConversionOptions) => {
      return processManager.startConversion(item, options);
    },
  );

  ipcMain.handle("convert:cancel", async (_event, jobId: string) => {
    return processManager.cancelConversion(jobId);
  });

  ipcMain.handle("convert:pause", async (_event, jobId: string) => {
    return processManager.pauseConversion(jobId);
  });

  ipcMain.handle("convert:resume", async (_event, jobId: string) => {
    return processManager.resumeConversion(jobId);
  });

  ipcMain.handle("queue:get", async () => {
    return processManager.getQueue();
  });

  ipcMain.handle("queue:clear", async () => {
    return processManager.clearQueue();
  });

  ipcMain.handle("chd:info", async (_event, chdPath: string) => {
    return processManager.getChdInfo(chdPath);
  });

  ipcMain.handle("cue:validate", async (_event, cuePath: string) => {
    return processManager.validateCueFile(cuePath);
  });

  ipcMain.handle("cue:fix", async (_event, cuePath: string, corrections: Record<string, string>) => {
    return processManager.fixCueFile(cuePath, corrections);
  });

  processManager.on("progress", (jobId: string, progress: number) => {
    mainWindow?.webContents.send("conversion:progress", { jobId, progress });
  });

  processManager.on(
    "complete",
    (
      jobId: string,
      result: { success: boolean; outputPath?: string; error?: string },
    ) => {
      mainWindow?.webContents.send("conversion:complete", { jobId, ...result });
    },
  );

  processManager.on("error", (jobId: string, error: string) => {
    mainWindow?.webContents.send("conversion:error", { jobId, error });
  });
}

app.whenReady().then(() => {
  setupIPC();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    processManager.killAll();
    app.quit();
  }
});

app.on("before-quit", () => {
  processManager.killAll();
});
