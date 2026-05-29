// @ts-nocheck
// Temporary disable check - install dependencies with pnpm install first

// Supported input file types for CHD conversion
export type InputFileType = "iso" | "bin" | "cue" | "gdi" | "chd";

export type ConversionType =
  | "iso-to-chd"
  | "bin-cue-to-chd"
  | "gdi-to-chd"
  | "chd-to-iso"
  | "chd-to-bin";

// Supported output formats
export type OutputFormat = "chd" | "iso" | "bin";

// Job status in the conversion queue
export type JobStatus =
  | "pending"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

// Represents a file to be converted
export interface InputFile {
  path: string;
  type: InputFileType;
  size: number;
  name: string;
}

// Represents an item in the conversion queue
export interface QueueItem {
  id: string;
  inputFiles: InputFile[];
  conversionType: ConversionType;
  outputPath: string;
  status: JobStatus;
  progress: number;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// Compression levels for CHD output
export type CompressionLevel = "none" | "fast" | "normal" | "best";

// Options for CHD conversion
export interface CHDConversionOptions {
  compressionLevel: CompressionLevel;
  hunkSize?: number;
  outputDirectory?: string;
  overwriteExisting?: boolean;
  verifyOutput?: boolean;
}

// Generic conversion options (can be extended for other formats)
export interface ConversionOptions {
  chd?: CHDConversionOptions;
}

// Result of a conversion operation
export interface ConversionResult {
  success: boolean;
  outputPath?: string;
  outputSize?: number;
  error?: string;
  logs?: string[];
  duration?: number;
}

// Progress update from conversion process
export interface ProgressUpdate {
  jobId: string;
  progress: number;
  currentHunk?: number;
  totalHunks?: number;
  bytesProcessed?: number;
  totalBytes?: number;
  speed?: number;
}

// Error information from failed conversion
export interface ConversionError {
  code: string;
  message: string;
  details?: string;
  recoverable: boolean;
}

// Log entry for conversion operations
export interface LogEntry {
  timestamp: Date;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  jobId?: string;
}

// User preferences
export interface UserPreferences {
  defaultOutputDirectory: string;
  defaultCompressionLevel: CompressionLevel;
  autoVerifyOutput: boolean;
  theme: "dark" | "light" | "system";
  language: string;
  showNotifications: boolean;
  concurrentJobs: number;
}

// Platform-specific information
export interface PlatformInfo {
  os: "windows" | "macos" | "linux";
  arch: "x64" | "arm64";
  binaryPath: string;
}

// Validation result for input files
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  file: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  file: string;
}

// CHD metadata
export interface CHDMetadata {
  hunksize: number;
  totalhunks: number;
  compression: string;
  inputbytes: number;
  outputbytes: number;
  mapoffset: number;
  dataoffset: number;
}

// Event types for process manager
export type ProcessEventType =
  | "progress"
  | "complete"
  | "error"
  | "cancelled"
  | "paused"
  | "resumed";

export interface ProcessEvent {
  type: ProcessEventType;
  jobId: string;
  data?: ProgressUpdate | ConversionResult | { error: string };
}

// File extension utilities
export const INPUT_EXTENSIONS: Record<InputFileType, string[]> = {
  iso: [".iso"],
  bin: [".bin"],
  cue: [".cue"],
  gdi: [".gdi"],
  chd: [".chd"],
};

export const SUPPORTED_EXTENSIONS = Object.values(INPUT_EXTENSIONS).flat();

// Detect file type from extension
export function detectFileType(filename: string): InputFileType | null {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  for (const [type, extensions] of Object.entries(INPUT_EXTENSIONS)) {
    if (extensions.includes(ext)) {
      return type as InputFileType;
    }
  }
  return null;
}

// Generate unique ID for queue items
export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Sanitize filename for safe filesystem operations
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[<>:"/\\|?*]/g, "_").trim();
}

// Format file size to human readable string
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// Format duration in seconds to human readable string
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
