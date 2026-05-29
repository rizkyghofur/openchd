// @ts-nocheck
// Temporary disable check - install dependencies with pnpm install first

import type {
  ConversionOptions,
  ConversionResult,
  QueueItem,
} from "@openchd/shared";
import { contextBridge, ipcRenderer } from "electron";

export interface ElectronAPI {
  convert: {
    start: (
      item: QueueItem,
      options: ConversionOptions,
    ) => Promise<ConversionResult>;
    cancel: (jobId: string) => Promise<void>;
    pause: (jobId: string) => Promise<void>;
    resume: (jobId: string) => Promise<void>;
  };
  queue: {
    get: () => Promise<QueueItem[]>;
    clear: () => Promise<void>;
  };
  chd: {
    info: (chdPath: string) => Promise<any>;
  };
  cue: {
    validate: (cuePath: string) => Promise<any>;
    fix: (cuePath: string, corrections: Record<string, string>) => Promise<void>;
  };
  dialog: {
    selectDirectory: () => Promise<string | null>;
  };
  shell: {
    openPath: (folderPath: string) => Promise<string>;
    showItemInFolder: (filePath: string) => Promise<void>;
  };
  on: {
    progress: (
      callback: (data: { jobId: string; progress: number }) => void,
    ) => () => void;
    complete: (
      callback: (data: { jobId: string } & ConversionResult) => void,
    ) => () => void;
    error: (
      callback: (data: { jobId: string; error: string }) => void,
    ) => () => void;
  };
}

const electronAPI: ElectronAPI = {
  convert: {
    start: (item, options) =>
      ipcRenderer.invoke("convert:start", item, options),
    cancel: (jobId) => ipcRenderer.invoke("convert:cancel", jobId),
    pause: (jobId) => ipcRenderer.invoke("convert:pause", jobId),
    resume: (jobId) => ipcRenderer.invoke("convert:resume", jobId),
  },
  queue: {
    get: () => ipcRenderer.invoke("queue:get"),
    clear: () => ipcRenderer.invoke("queue:clear"),
  },
  chd: {
    info: (chdPath) => ipcRenderer.invoke("chd:info", chdPath),
  },
  cue: {
    validate: (cuePath) => ipcRenderer.invoke("cue:validate", cuePath),
    fix: (cuePath, corrections) => ipcRenderer.invoke("cue:fix", cuePath, corrections),
  },
  dialog: {
    selectDirectory: () => ipcRenderer.invoke("dialog:selectDirectory"),
  },
  shell: {
    openPath: (folderPath) => ipcRenderer.invoke("shell:openPath", folderPath),
    showItemInFolder: (filePath) => ipcRenderer.invoke("shell:showItemInFolder", filePath),
  },
  on: {
    progress: (callback) => {
      const handler = (
        _event: Electron.IpcRendererEvent,
        data: { jobId: string; progress: number },
      ) => callback(data);
      ipcRenderer.on("conversion:progress", handler);
      return () => ipcRenderer.removeListener("conversion:progress", handler);
    },
    complete: (callback) => {
      const handler = (
        _event: Electron.IpcRendererEvent,
        data: { jobId: string } & ConversionResult,
      ) => callback(data);
      ipcRenderer.on("conversion:complete", handler);
      return () => ipcRenderer.removeListener("conversion:complete", handler);
    },
    error: (callback) => {
      const handler = (
        _event: Electron.IpcRendererEvent,
        data: { jobId: string; error: string },
      ) => callback(data);
      ipcRenderer.on("conversion:error", handler);
      return () => ipcRenderer.removeListener("conversion:error", handler);
    },
  },
};

contextBridge.exposeInMainWorld("electron", electronAPI);

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
