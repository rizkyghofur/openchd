// @ts-nocheck
// Temporary disable check - install dependencies with pnpm install first

import type { ConversionOptions, ConversionResult, QueueItem } from "./index";

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

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
