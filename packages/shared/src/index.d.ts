export type InputFileType = "iso" | "bin" | "cue" | "gdi" | "chd";
export type ConversionType = "iso-to-chd" | "bin-cue-to-chd" | "gdi-to-chd" | "chd-to-iso" | "chd-to-bin";
export type OutputFormat = "chd" | "iso" | "bin";
export type JobStatus = "pending" | "running" | "paused" | "completed" | "failed" | "cancelled";
export interface InputFile {
    path: string;
    type: InputFileType;
    size: number;
    name: string;
}
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
export type CompressionLevel = "none" | "fast" | "normal" | "best";
export interface CHDConversionOptions {
    compressionLevel: CompressionLevel;
    hunkSize?: number;
    outputDirectory?: string;
    overwriteExisting?: boolean;
    verifyOutput?: boolean;
}
export interface ConversionOptions {
    chd?: CHDConversionOptions;
}
export interface ConversionResult {
    success: boolean;
    outputPath?: string;
    outputSize?: number;
    error?: string;
    logs?: string[];
    duration?: number;
}
export interface ProgressUpdate {
    jobId: string;
    progress: number;
    currentHunk?: number;
    totalHunks?: number;
    bytesProcessed?: number;
    totalBytes?: number;
    speed?: number;
}
export interface ConversionError {
    code: string;
    message: string;
    details?: string;
    recoverable: boolean;
}
export interface LogEntry {
    timestamp: Date;
    level: "info" | "warning" | "error" | "debug";
    message: string;
    jobId?: string;
}
export interface UserPreferences {
    defaultOutputDirectory: string;
    defaultCompressionLevel: CompressionLevel;
    autoVerifyOutput: boolean;
    theme: "dark" | "light" | "system";
    language: string;
    showNotifications: boolean;
    concurrentJobs: number;
}
export interface PlatformInfo {
    os: "windows" | "macos" | "linux";
    arch: "x64" | "arm64";
    binaryPath: string;
}
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
export interface CHDMetadata {
    hunksize: number;
    totalhunks: number;
    compression: string;
    inputbytes: number;
    outputbytes: number;
    mapoffset: number;
    dataoffset: number;
}
export type ProcessEventType = "progress" | "complete" | "error" | "cancelled" | "paused" | "resumed";
export interface ProcessEvent {
    type: ProcessEventType;
    jobId: string;
    data?: ProgressUpdate | ConversionResult | {
        error: string;
    };
}
export declare const INPUT_EXTENSIONS: Record<InputFileType, string[]>;
export declare const SUPPORTED_EXTENSIONS: string[];
export declare function detectFileType(filename: string): InputFileType | null;
export declare function generateJobId(): string;
export declare function sanitizeFilename(filename: string): string;
export declare function formatFileSize(bytes: number): string;
export declare function formatDuration(seconds: number): string;
//# sourceMappingURL=index.d.ts.map