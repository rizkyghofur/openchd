// @ts-nocheck
// Temporary disable check - install dependencies with pnpm install first
// File extension utilities
export const INPUT_EXTENSIONS = {
    iso: [".iso"],
    bin: [".bin"],
    cue: [".cue"],
    gdi: [".gdi"],
    chd: [".chd"],
};
export const SUPPORTED_EXTENSIONS = Object.values(INPUT_EXTENSIONS).flat();
// Detect file type from extension
export function detectFileType(filename) {
    const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
    for (const [type, extensions] of Object.entries(INPUT_EXTENSIONS)) {
        if (extensions.includes(ext)) {
            return type;
        }
    }
    return null;
}
// Generate unique ID for queue items
export function generateJobId() {
    return `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
// Sanitize filename for safe filesystem operations
export function sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*]/g, "_").trim();
}
// Format file size to human readable string
export function formatFileSize(bytes) {
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
export function formatDuration(seconds) {
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
