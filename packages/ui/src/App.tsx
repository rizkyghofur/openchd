// @ts-nocheck
// Temporary disable check - install dependencies with pnpm install first

import { ConversionOptions, QueueItem, ConversionType } from "@openchd/shared";
import React, { useCallback, useEffect, useState } from "react";
import appIcon from "./app_icon.png";

// Styles for the premium application
const styles = {
  app: {
    height: "100vh",
    backgroundColor: "#080c14", // Ultra-dark rich deep space blue background
    color: "#f1f5f9", // Cool white slate
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  header: {
    padding: "16px 40px",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0) 100%)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold" as const,
    fontSize: "16px",
    color: "white",
    boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)",
  },
  title: {
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    margin: 0,
    background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  main: {
    padding: "20px 40px",
    maxWidth: "1240px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box" as const,
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  tabs: {
    display: "flex",
    gap: "6px",
    marginBottom: "16px",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    padding: "4px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    width: "fit-content",
  },
  tab: {
    padding: "6px 14px",
    cursor: "pointer",
    fontWeight: "600" as const,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "12.5px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  activeTab: {
    color: "white",
    backgroundColor: "rgba(33, 150, 243, 0.15)",
    boxShadow: "0 0 10px rgba(33, 150, 243, 0.1)",
    border: "1px solid rgba(33, 150, 243, 0.3)",
  },
  dropZone: {
    border: "1.5px dashed rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "12px 20px",
    textAlign: "left" as const,
    marginBottom: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "16px",
  },
  dropZoneHover: {
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.12)",
    transform: "translateY(-1px)",
  },
  uploadIconCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "16px",
    transition: "all 0.3s ease",
    flexShrink: 0,
  },
  queue: {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(16px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100px",
    marginBottom: "20px",
  },
  queueHeader: {
    padding: "14px 24px",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    fontWeight: "bold" as const,
    fontSize: "12px",
    letterSpacing: "0.8px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  queueItemsList: {
    overflowY: "auto" as const,
    flex: 1,
  },
  queueItem: {
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "background-color 0.2s ease",
  },
  progressBar: {
    height: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: "3px",
    overflow: "hidden",
    marginTop: "10px",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
    borderRadius: "3px",
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0 8px rgba(139, 92, 246, 0.5)",
  },
  button: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: "600" as const,
    fontSize: "12px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  buttonPrimary: {
    backgroundColor: "#3b82f6",
    color: "white",
    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
  },
  buttonDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  buttonSecondary: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    color: "#94a3b8",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    color: "#e2e8f0",
    marginRight: "10px",
    fontSize: "12.5px",
    cursor: "pointer",
    outline: "none",
  },
  emptyState: {
    padding: "40px 20px",
    textAlign: "center" as const,
    color: "#64748b",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  statusCompleted: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
    boxShadow: "0 0 10px rgba(16, 185, 129, 0.05)",
  },
  statusRunning: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#f59e0b",
    animation: "pulse 2s infinite ease-in-out",
  },
  statusFailed: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
  },
  statusPending: {
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    color: "#94a3b8",
  },
  statusCancelled: {
    backgroundColor: "rgba(100, 116, 139, 0.1)",
    color: "#64748b",
  },
};

export function App(): React.ReactElement {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [autoOpenFolder, setAutoOpenFolder] = useState(false);
  const [historyLog, setHistoryLog] = useState<any[]>([]);
  const [notifiedJobs, setNotifiedJobs] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"compress" | "extract">("compress");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<
    "none" | "fast" | "normal" | "best"
  >("normal");
  const [defaultExtractFormat, setDefaultExtractFormat] = useState<
    "chd-to-iso" | "chd-to-bin"
  >("chd-to-bin");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // CHD Metadata & CUE Validation states
  const [chdMetadata, setChdMetadata] = useState<Record<string, any>>({});
  const [cueErrors, setCueErrors] = useState<Record<string, string[]>>({});
  const [cueSuggestions, setCueSuggestions] = useState<Record<string, Record<string, string>>>({});
  const [outputDirectory, setOutputDirectory] = useState<string | null>(null);

  const getOutputFilePath = (inputPath: string, extension: string, customDir: string | null) => {
    const filename = inputPath.split(/[/\\]/).pop() || "";
    const baseName = filename.replace(/\.[^.]+$/, "");
    if (customDir) {
      const isWindows = inputPath.includes("\\");
      const separator = isWindows ? "\\" : "/";
      return `${customDir}${customDir.endsWith(separator) ? "" : separator}${baseName}${extension}`;
    } else {
      return inputPath.replace(/\.[^.]+$/, extension);
    }
  };

  const handleSelectOutputDirectory = async () => {
    const dir = await window.electron.dialog.selectDirectory();
    if (dir) {
      setOutputDirectory(dir);
      setQueue((prev) =>
        prev.map((q) => {
          if (q.status !== "pending") return q;
          const ext = q.conversionType === "chd-to-iso" ? ".iso" : 
                      q.conversionType === "chd-to-bin" ? ".cue" : ".chd";
          return {
            ...q,
            outputPath: getOutputFilePath(q.inputFiles[0].path, ext, dir),
          };
        })
      );
    }
  };

  const handleResetOutputDirectory = () => {
    setOutputDirectory(null);
    setQueue((prev) =>
      prev.map((q) => {
        if (q.status !== "pending") return q;
        const ext = q.conversionType === "chd-to-iso" ? ".iso" : 
                    q.conversionType === "chd-to-bin" ? ".cue" : ".chd";
        return {
          ...q,
          outputPath: getOutputFilePath(q.inputFiles[0].path, ext, null),
        };
      })
    );
  };

  // Request Notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Monitor batch completion to trigger notification and auto-open folder
  useEffect(() => {
    const activeFiltered = getFilteredQueue();
    if (activeFiltered.length === 0) return;

    const runningJobs = activeFiltered.filter((q) => q.status === "running");
    const completedOrFailedJobs = activeFiltered.filter((q) => ["completed", "failed", "cancelled"].includes(q.status));
    
    if (runningJobs.length === 0 && completedOrFailedJobs.length > 0) {
      const unnotifiedFinished = completedOrFailedJobs.filter((q) => !notifiedJobs.includes(q.id));
      
      if (unnotifiedFinished.length > 0) {
        const newIds = unnotifiedFinished.map((q) => q.id);
        setNotifiedJobs((prev) => [...prev, ...newIds]);

        // Trigger Notification
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          new Notification("OpenCHD Batch Complete", {
            body: `Successfully processed ${unnotifiedFinished.length} conversion job(s).`,
            icon: appIcon
          });
        }

        // Trigger Auto-open Folder
        if (autoOpenFolder) {
          const firstJob = unnotifiedFinished[0];
          if (firstJob && firstJob.outputPath) {
            const separator = firstJob.outputPath.includes("\\") ? "\\" : "/";
            const folderPath = firstJob.outputPath.substring(0, firstJob.outputPath.lastIndexOf(separator));
            window.electron.shell.openPath(folderPath);
          }
        }
      }
    }
  }, [queue, notifiedJobs, autoOpenFolder, activeTab]);

  // Real-time re-render timer for active speeds & ETAs
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for conversion progress events
  useEffect(() => {
    const unsubscribeProgress = window.electron.on.progress(
      ({ jobId, progress }) => {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === jobId ? { ...item, progress, status: "running" } : item,
          ),
        );
      },
    );

    const unsubscribeComplete = window.electron.on.complete(({ jobId }) => {
      setQueue((prev) => {
        const item = prev.find((q) => q.id === jobId);
        if (item) {
          setHistoryLog((h) => [
            {
              id: jobId,
              name: item.inputFiles[0].name,
              size: item.inputFiles[0].size,
              conversionType: item.conversionType,
              completedAt: new Date(),
              outputPath: item.outputPath,
              status: "completed"
            },
            ...h
          ]);
        }
        return prev.map((q) =>
          q.id === jobId ? { ...q, progress: 100, status: "completed" } : q
        );
      });
      setSelectedIds((prev) => prev.filter((id) => id !== jobId));
    });

    const unsubscribeError = window.electron.on.error(({ jobId, error }) => {
      setQueue((prev) => {
        const item = prev.find((q) => q.id === jobId);
        if (item) {
          setHistoryLog((h) => [
            {
              id: jobId,
              name: item.inputFiles[0].name,
              size: item.inputFiles[0].size,
              conversionType: item.conversionType,
              completedAt: new Date(),
              outputPath: item.outputPath,
              status: "failed",
              error
            },
            ...h
          ]);
        }
        return prev.map((q) =>
          q.id === jobId ? { ...q, status: "failed", error } : q
        );
      });
    });

    return () => {
      unsubscribeProgress();
      unsubscribeComplete();
      unsubscribeError();
    };
  }, []);

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  // Filter queue by active tab
  const getFilteredQueue = () => {
    if (activeTab === "compress") {
      return queue.filter((item) =>
        ["iso-to-chd", "bin-cue-to-chd", "gdi-to-chd"].includes(item.conversionType)
      );
    } else {
      return queue.filter((item) =>
        ["chd-to-iso", "chd-to-bin"].includes(item.conversionType)
      );
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    addFilesToQueue(files);
  }, [activeTab, defaultExtractFormat, outputDirectory]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    addFilesToQueue(files);
  }, [activeTab, defaultExtractFormat, outputDirectory]);

  const addFilesToQueue = (files: File[]) => {
    for (const file of files) {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      
      if (activeTab === "compress") {
        if (ext === ".chd") continue;

        let conversionType: ConversionType = "iso-to-chd";
        if (ext === ".cue" || ext === ".bin") {
          conversionType = "bin-cue-to-chd";
        } else if (ext === ".gdi") {
          conversionType = "gdi-to-chd";
        }

        const newItem: QueueItem = {
          id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          inputFiles: [
            {
              path: file.path,
              type: ext.slice(1) as any,
              size: file.size,
              name: file.name,
            },
          ],
          conversionType,
          outputPath: getOutputFilePath(file.path, ".chd", outputDirectory),
          status: "pending",
          progress: 0,
          createdAt: new Date(),
        };

        setQueue((prev) => [...prev, newItem]);

        // Auto-validate CUE file
        if (ext === ".cue") {
          window.electron.cue.validate(file.path).then((result) => {
            if (!result.valid) {
              setCueErrors((prev) => ({ ...prev, [newItem.id]: result.missingFiles }));
              if (result.suggestions) {
                setCueSuggestions((prev) => ({ ...prev, [newItem.id]: result.suggestions }));
              }
              // Set job status as broken / failed immediately to warn user
              setQueue((prev) =>
                prev.map((q) => (q.id === newItem.id ? { ...q, status: "failed", error: "Broken CUE: Missing Bin files" } : q))
              );
            }
          });
        }
      } else {
        if (ext !== ".chd") continue;

        const newExt = defaultExtractFormat === "chd-to-iso" ? ".iso" : ".cue";

        const newItem: QueueItem = {
          id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          inputFiles: [
            {
              path: file.path,
              type: "chd",
              size: file.size,
              name: file.name,
            },
          ],
          conversionType: defaultExtractFormat,
          outputPath: getOutputFilePath(file.path, newExt, outputDirectory),
          status: "pending",
          progress: 0,
          createdAt: new Date(),
        };

        setQueue((prev) => [...prev, newItem]);

        // Fetch CHD metadata
        window.electron.chd.info(file.path).then((info) => {
          if (info && Object.keys(info).length > 0) {
            setChdMetadata((prev) => ({ ...prev, [newItem.id]: info }));
          }
        });
      }
    }
  };

  const handleStartConversion = useCallback(async () => {
    const activeFiltered = getFilteredQueue();
    
    // Do not run conversions for items that are broken CUEs unless fixed
    const selectedPendingInTab = activeFiltered.filter(
      (q) => selectedIds.includes(q.id) && q.status === "pending" && !cueErrors[q.id]
    );
    const hasSelection = selectedPendingInTab.length > 0;
    
    const itemsToConvert = hasSelection 
      ? selectedPendingInTab 
      : activeFiltered.filter((q) => q.status === "pending" && !cueErrors[q.id]);

    if (itemsToConvert.length === 0) return;

    // Concurrency limit = 3
    const CONCURRENCY_LIMIT = 3;
    const pool = [...itemsToConvert];

    const workers = Array(Math.min(CONCURRENCY_LIMIT, pool.length))
      .fill(null)
      .map(async () => {
        while (pool.length > 0) {
          const item = pool.shift();
          if (!item) break;

          const options: ConversionOptions = {
            chd: {
              compressionLevel,
              overwriteExisting: true,
              verifyOutput: true,
            },
          };

          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? { ...q, status: "running", startedAt: new Date() }
                : q
            )
          );

          await window.electron.convert.start(item, options);
        }
      });

    await Promise.all(workers);
  }, [queue, activeTab, compressionLevel, selectedIds, cueErrors]);

  const handleCancelItem = useCallback(async (jobId: string) => {
    await window.electron.convert.cancel(jobId);
    setQueue((prev) =>
      prev.map((item) =>
        item.id === jobId ? { ...item, status: "cancelled" } : item,
      ),
    );
  }, []);

  const handleClearCompleted = () => {
    const activeFilteredIds = getFilteredQueue()
      .filter((item) => item.status === "completed" || item.status === "failed" || item.status === "cancelled")
      .map((item) => item.id);

    setQueue((prev) => prev.filter((item) => !activeFilteredIds.includes(item.id)));
    setSelectedIds((prev) => prev.filter((id) => !activeFilteredIds.includes(id)));
  };

  const handleToggleSelectAll = () => {
    const filteredIds = getFilteredQueue().map((item) => item.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleClearSelected = () => {
    setQueue((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  const handleApplyFormatToSelected = (format: "chd-to-iso" | "chd-to-bin") => {
    const ext = format === "chd-to-iso" ? ".iso" : ".cue";
    setQueue((prev) =>
      prev.map((q) =>
        selectedIds.includes(q.id) && q.status === "pending"
          ? {
              ...q,
              conversionType: format,
              outputPath: q.inputFiles[0].path.replace(/\.chd$/i, ext),
            }
          : q
      )
    );
  };

  // Get real-time process statistics (speed & dynamic ETA estimation)
  const getRunningStats = (item: QueueItem) => {
    if (item.status !== "running" || !item.startedAt) return null;
    const elapsedSeconds = (currentTime - new Date(item.startedAt).getTime()) / 1000;
    if (elapsedSeconds <= 1.5) return "Estimating...";

    // File size in MB
    const totalMB = item.inputFiles[0].size / (1024 * 1024);
    const processedMB = totalMB * (item.progress / 100);
    const speedMBs = processedMB / elapsedSeconds;

    const speedStr = speedMBs.toFixed(1) + " MB/s";

    if (item.progress <= 0) return `${speedStr} • Estimating...`;

    const estimatedTotalSeconds = (elapsedSeconds / item.progress) * 100;
    const remainingSeconds = Math.max(0, Math.ceil(estimatedTotalSeconds - elapsedSeconds));

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.ceil(remainingSeconds % 60);
    const etaStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    return `${speedStr} • Remaining: ${etaStr}`;
  };

  const formatItemSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + " " + sizes[i];
  };

  const getBatchProgressStats = () => {
    const activeFiltered = getFilteredQueue();
    if (activeFiltered.length === 0) return null;

    const totalJobs = activeFiltered.length;
    const runningJobs = activeFiltered.filter((q) => q.status === "running");
    const completedJobs = activeFiltered.filter((q) => q.status === "completed");
    const failedJobs = activeFiltered.filter((q) => q.status === "failed");
    const pendingJobs = activeFiltered.filter((q) => q.status === "pending");

    if (runningJobs.length === 0 && completedJobs.length === 0 && failedJobs.length === 0) {
      return null;
    }

    let totalProgressSum = 0;
    activeFiltered.forEach((q) => {
      if (q.status === "completed") totalProgressSum += 100;
      else if (q.status === "running") totalProgressSum += q.progress;
    });
    const overallProgress = Math.round(totalProgressSum / totalJobs);

    let speedStr = "";
    let etaStr = "Estimating...";
    if (runningJobs.length > 0) {
      let totalElapsed = 0;
      let totalProcessedMB = 0;
      let totalRemainingMB = 0;
      
      runningJobs.forEach((item) => {
        if (!item.startedAt) return;
        const elapsed = (currentTime - new Date(item.startedAt).getTime()) / 1000;
        if (elapsed > 1.5) {
          const totalMB = item.inputFiles[0].size / (1024 * 1024);
          const processedMB = totalMB * (item.progress / 100);
          totalElapsed += elapsed;
          totalProcessedMB += processedMB;
          totalRemainingMB += (totalMB - processedMB);
        }
      });

      if (totalElapsed > 0 && totalProcessedMB > 0) {
        const avgSpeed = totalProcessedMB / (totalElapsed / runningJobs.length);
        speedStr = `${avgSpeed.toFixed(1)} MB/s`;
        
        pendingJobs.forEach((item) => {
          totalRemainingMB += item.inputFiles[0].size / (1024 * 1024);
        });

        const totalEtaSeconds = Math.ceil(totalRemainingMB / avgSpeed);
        const minutes = Math.floor(totalEtaSeconds / 60);
        const seconds = Math.ceil(totalEtaSeconds % 60);
        etaStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      }
    }

    return {
      totalJobs,
      runningCount: runningJobs.length,
      completedCount: completedJobs.length,
      failedCount: failedJobs.length,
      pendingCount: pendingJobs.length,
      overallProgress,
      speedStr,
      etaStr
    };
  };

  const filteredQueue = getFilteredQueue();
  const pendingCount = filteredQueue.filter((q) => q.status === "pending" && !cueErrors[q.id]).length;
  
  const selectedPendingCount = filteredQueue.filter(
    (q) => selectedIds.includes(q.id) && q.status === "pending" && !cueErrors[q.id]
  ).length;

  const allFilteredSelected = filteredQueue.length > 0 && filteredQueue.every((item) => selectedIds.includes(item.id));
  const hasAnySelected = filteredQueue.some((item) => selectedIds.includes(item.id));

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.titleContainer}>
          <img src={appIcon} style={{ width: "32px", height: "32px", borderRadius: "8px", boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)", objectFit: "cover" }} alt="OpenCHD Logo" />
          <h1 style={styles.title}>OpenCHD</h1>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Compress Settings */}
          {activeTab === "compress" && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", marginRight: "8px", fontWeight: "600" }}>Compression:</span>
              <select
                style={styles.select}
                value={compressionLevel}
                onChange={(e) =>
                  setCompressionLevel(e.target.value as typeof compressionLevel)
                }
              >
                <option value="none">No Compression</option>
                <option value="fast">Fast (zlib-fast)</option>
                <option value="normal">Normal (zlib-medium)</option>
                <option value="best">Best (zlib-high)</option>
              </select>
            </div>
          )}

          {/* Global/Default Extract Settings */}
          {activeTab === "extract" && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8", marginRight: "8px", fontWeight: "600" }}>Default Format:</span>
              <select
                style={styles.select}
                value={defaultExtractFormat}
                onChange={(e) => {
                  const newFormat = e.target.value as any;
                  setDefaultExtractFormat(newFormat);
                  
                  const newExt = newFormat === "chd-to-iso" ? ".iso" : ".cue";
                  setQueue((prev) =>
                    prev.map((q) =>
                      ["chd-to-iso", "chd-to-bin"].includes(q.conversionType) && q.status === "pending"
                        ? {
                            ...q,
                            conversionType: newFormat,
                            outputPath: q.inputFiles[0].path.replace(/\.chd$/i, newExt),
                          }
                        : q
                    )
                  );
                }}
              >
                <option value="chd-to-bin">BIN/CUE (.bin/.cue)</option>
                <option value="chd-to-iso">ISO (.iso)</option>
              </select>
            </div>
          )}

          {historyLog.length > 0 && (
            <button
              style={{
                ...styles.button,
                ...styles.buttonSecondary,
                padding: "6px 12px",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                backgroundColor: "rgba(139, 92, 246, 0.05)",
                color: "#c084fc"
              }}
              onClick={() => setShowHistoryModal(true)}
            >
              📜 History ({historyLog.length})
            </button>
          )}
        </div>
      </header>

      <main style={styles.main}>
        {/* TABS MENU */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "compress" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("compress")}
          >
            Compress to CHD
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "extract" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("extract")}
          >
            Extract CHD
          </button>
        </div>

        {/* DROPZONE */}
        <div
          style={{
            ...styles.dropZone,
            ...(isDragOver ? styles.dropZoneHover : {}),
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            type="file"
            id="file-input"
            multiple
            accept={activeTab === "compress" ? ".iso,.bin,.cue,.gdi" : ".chd"}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <div style={{
            ...styles.uploadIconCircle,
            ...(isDragOver ? { borderColor: "#3b82f6", color: "#3b82f6", backgroundColor: "rgba(59, 130, 246, 0.05)" } : {})
          }}>
            📥
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>
              {activeTab === "compress"
                ? "Drag & drop disc images here, or click to browse"
                : "Drag & drop CHD files here, or click to browse"}
            </p>
            <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "12px", fontWeight: 500 }}>
              {activeTab === "compress"
                ? "Supports ISO, BIN/CUE, and GDI files"
                : "Converts CHD back to ISO or BIN/CUE format"}
            </p>
          </div>
        </div>

        {/* OUTPUT DIRECTORY SELECTION BAR */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "10px",
          marginBottom: "16px",
          fontSize: "12.5px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
            <span style={{ color: "#64748b", fontWeight: "600", flexShrink: 0 }}>📁 Save to:</span>
            <span style={{
              color: outputDirectory ? "#e2e8f0" : "#94a3b8",
              fontWeight: "600",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {outputDirectory ? outputDirectory : "Default (same folder as source files)"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#94a3b8", userSelect: "none", marginRight: "6px" }}>
              <input
                type="checkbox"
                checked={autoOpenFolder}
                onChange={(e) => setAutoOpenFolder(e.target.checked)}
                style={{ cursor: "pointer", accentColor: "#3b82f6", width: "14px", height: "14px" }}
              />
              <span>Open folder when finished</span>
            </label>
            {outputDirectory && (
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  padding: "4px 8px",
                  fontSize: "11px",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  backgroundColor: "rgba(239, 68, 68, 0.05)",
                  color: "#ef4444"
                }}
                onClick={handleResetOutputDirectory}
              >
                Reset to Default
              </button>
            )}
            <button
              style={{
                ...styles.button,
                ...styles.buttonSecondary,
                padding: "4px 10px",
                fontSize: "11px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                backgroundColor: "rgba(59, 130, 246, 0.05)",
                color: "#3b82f6"
              }}
              onClick={handleSelectOutputDirectory}
            >
              Choose Folder...
            </button>
          </div>
        </div>

        {/* BATCH PROGRESS CARD */}
        {(() => {
          const stats = getBatchProgressStats();
          if (!stats) return null;
          return (
            <div style={{
              backgroundColor: "rgba(33, 150, 243, 0.04)",
              border: "1px solid rgba(33, 150, 243, 0.15)",
              borderRadius: "12px",
              padding: "14px 20px",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#3b82f6", display: "flex", alignItems: "center", gap: "6px" }}>
                  ⚡ BATCH PROCESSING STATUS ({stats.completedCount}/{stats.totalJobs} finished)
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>
                  {stats.runningCount > 0 ? `Active: ${stats.speedStr} • Remaining: ${stats.etaStr}` : "All tasks complete"}
                </span>
              </div>
              <div style={{
                height: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderRadius: "3px",
                overflow: "hidden",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)"
              }}>
                <div style={{
                  height: "100%",
                  width: `${stats.overallProgress}%`,
                  background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)",
                  borderRadius: "3px",
                  boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
                  transition: "width 0.4s ease-out"
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", fontWeight: "600" }}>
                <span>Overall: {stats.overallProgress}%</span>
                <span>
                  {stats.runningCount} Running • {stats.pendingCount} Pending • {stats.failedCount} Failed
                </span>
              </div>
            </div>
          );
        })()}

        {/* BULK ACTIONS / QUEUE ACTIONS */}
        {filteredQueue.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={handleToggleSelectAll}
              >
                <span style={{ fontSize: "14px" }}>{allFilteredSelected ? "☑" : "☐"}</span>
                {allFilteredSelected ? "Deselect All" : "Select All"}
              </button>
              
              {hasAnySelected && (
                <>
                  <button
                    style={{ ...styles.button, ...styles.buttonDanger }}
                    onClick={handleClearSelected}
                  >
                    🗑️ Clear Selected ({selectedIds.length})
                  </button>

                  {activeTab === "extract" && (
                    <>
                      <button
                        style={{ ...styles.button, ...styles.buttonSecondary }}
                        onClick={() => handleApplyFormatToSelected("chd-to-bin")}
                      >
                        📂 Set BIN/CUE
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.buttonSecondary }}
                        onClick={() => handleApplyFormatToSelected("chd-to-iso")}
                      >
                        📀 Set ISO
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={handleClearCompleted}
              >
                🧹 Clear Finished
              </button>
              
              <button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={handleStartConversion}
                disabled={selectedPendingCount === 0 && pendingCount === 0}
              >
                ⚡ {selectedPendingCount > 0 
                  ? `Process Selected (${selectedPendingCount})`
                  : `Process All (${pendingCount} pending)`
                }
              </button>
            </div>
          </div>
        )}

        {/* QUEUE LIST */}
        {filteredQueue.length > 0 ? (
          <div style={styles.queue}>
            <div style={styles.queueHeader}>
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={handleToggleSelectAll}
                style={{ marginRight: "14px", width: "16px", height: "16px", cursor: "pointer", accentColor: "#3b82f6" }}
              />
              <span>
                {activeTab === "compress" ? "COMPRESSION BATCH QUEUE" : "EXTRACTION BATCH QUEUE"} ({filteredQueue.length} files)
              </span>
            </div>
            <div style={styles.queueItemsList}>
              {filteredQueue.map((item) => (
                <div key={item.id} style={{
                  ...styles.queueItem,
                  backgroundColor: selectedIds.includes(item.id) ? "rgba(59, 130, 246, 0.02)" : "transparent"
                }}>
                  <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    {/* Select Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id]
                        );
                      }}
                      style={{ marginRight: "18px", width: "18px", height: "18px", cursor: "pointer", accentColor: "#3b82f6" }}
                    />

                    <div style={{ flex: 1, paddingRight: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: "700", fontSize: "14.5px", color: "#f8fafc" }}>
                          {item.inputFiles[0].name}
                        </span>
                        <span style={{ fontSize: "11.5px", color: "#475569", fontWeight: "600" }}>
                          ({formatItemSize(item.inputFiles[0].size)})
                        </span>
                        
                        {/* Floating glowing status badge */}
                        <span style={{
                          ...styles.badge,
                          ...(item.status === "completed" ? styles.statusCompleted :
                               item.status === "running" ? styles.statusRunning :
                               item.status === "failed" ? styles.statusFailed :
                               item.status === "cancelled" ? styles.statusCancelled :
                               styles.statusPending)
                        }}>
                          {item.status === "running" ? "⏳ processing" : item.status}
                        </span>
                      </div>

                      {/* CHD Metadata reader display */}
                      {activeTab === "extract" && chdMetadata[item.id] && (
                        <div style={{ display: "flex", gap: "10px", fontSize: "11.5px", color: "#64748b", marginTop: "5px", fontWeight: "600" }}>
                          <span>💽 Format: {chdMetadata[item.id].compression}</span>
                          <span>•</span>
                          <span>Ratio: {chdMetadata[item.id].ratio}</span>
                          <span>•</span>
                          <span>Hunks: {chdMetadata[item.id].totalHunks} (Hunk Size: {formatItemSize(parseInt(chdMetadata[item.id].hunkSize || "0"))})</span>
                        </div>
                      )}

                      {/* Speed & ETA updates */}
                      {item.status === "running" && (
                        <div style={{ fontSize: "12.5px", color: "#f59e0b", fontWeight: "600", marginTop: "6px" }}>
                          ⚡ {getRunningStats(item)}
                        </div>
                      )}

                      {/* Individual extraction format setting */}
                      {activeTab === "extract" && item.status === "pending" ? (
                        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Output Format:</span>
                          <select
                            style={{ ...styles.select, padding: "2px 6px", fontSize: "12px", marginRight: 0 }}
                            value={item.conversionType}
                            onChange={(e) => {
                              const newType = e.target.value as any;
                              const newExt = newType === "chd-to-iso" ? ".iso" : ".cue";
                              setQueue((prev) =>
                                prev.map((q) =>
                                  q.id === item.id
                                    ? {
                                        ...q,
                                        conversionType: newType,
                                        outputPath: q.inputFiles[0].path.replace(/\.chd$/i, newExt),
                                      }
                                    : q
                                )
                              );
                            }}
                          >
                            <option value="chd-to-bin">BIN/CUE (.bin/.cue)</option>
                            <option value="chd-to-iso">ISO (.iso)</option>
                          </select>
                        </div>
                      ) : (
                        item.status !== "running" && !cueErrors[item.id] && (
                          <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px", fontWeight: "500" }}>
                            {item.conversionType.replace("-", " → ").toUpperCase()}
                          </div>
                        )
                      )}

                      {/* CUE Validation warning Box and Suggestions */}
                      {activeTab === "compress" && cueErrors[item.id] && (
                        <div style={{
                          fontSize: "12px",
                          color: "#ef4444",
                          marginTop: "8px",
                          backgroundColor: "rgba(239, 68, 68, 0.04)",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: "1px solid rgba(239, 68, 68, 0.12)",
                          display: "flex",
                          flexDirection: "column" as const,
                          gap: "6px"
                        }}>
                          <span style={{ fontWeight: "700" }}>⚠️ Broken CUE file! Referenced BIN tracks not found:</span>
                          {cueErrors[item.id].map((missing) => (
                            <div key={missing} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", paddingLeft: "8px", flexWrap: "wrap", gap: "6px" }}>
                              <span>• {missing}</span>
                              {cueSuggestions[item.id]?.[missing] && (
                                <button
                                  style={{
                                    padding: "2px 8px",
                                    fontSize: "10.5px",
                                    borderRadius: "4px",
                                    border: "1px solid rgba(16, 185, 129, 0.3)",
                                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                                    color: "#10b981",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                  }}
                                  onClick={async () => {
                                    const correctName = cueSuggestions[item.id][missing];
                                    await window.electron.cue.fix(item.inputFiles[0].path, { [missing]: correctName });
                                    
                                    // Re-validate CUE file
                                    const result = await window.electron.cue.validate(item.inputFiles[0].path);
                                    if (result.valid) {
                                      setCueErrors((prev) => {
                                        const next = { ...prev };
                                        delete next[item.id];
                                        return next;
                                      });
                                      setCueSuggestions((prev) => {
                                        const next = { ...prev };
                                        delete next[item.id];
                                        return next;
                                      });
                                      // Reset status to pending
                                      setQueue((prev) =>
                                        prev.map((q) => (q.id === item.id ? { ...q, status: "pending", error: undefined } : q))
                                      );
                                    } else {
                                      setCueErrors((prev) => ({ ...prev, [item.id]: result.missingFiles }));
                                    }
                                  }}
                                >
                                  Auto-Fix (use {cueSuggestions[item.id][missing]})
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Glowing modern progress bar */}
                      {item.status === "running" && (
                        <div style={styles.progressBar}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${item.progress}%`,
                            }}
                          />
                        </div>
                      )}
                      {item.error && !cueErrors[item.id] && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#ef4444",
                            marginTop: "6px",
                            fontWeight: "500",
                            backgroundColor: "rgba(239, 68, 68, 0.05)",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid rgba(239, 68, 68, 0.1)"
                          }}
                        >
                          ⚠️ {item.error}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {item.status === "completed" && (
                      <button
                        style={{
                          ...styles.button,
                          ...styles.buttonSecondary,
                          padding: "6px 10px",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          backgroundColor: "rgba(16, 185, 129, 0.05)",
                          color: "#10b981"
                        }}
                        onClick={() => window.electron.shell.showItemInFolder(item.outputPath)}
                        title="Show in Finder/Explorer"
                      >
                        📂 Show in Folder
                      </button>
                    )}
                    {item.status === "running" && (
                      <button
                        style={{ ...styles.button, ...styles.buttonDanger }}
                        onClick={() => handleCancelItem(item.id)}
                      >
                        🛑 Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ ...styles.queue, ...styles.emptyState }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "10px" }}>📁</span>
            {activeTab === "compress"
              ? "No files in compression queue. Drop files to compress."
              : "No files in extraction queue. Drop CHD files to extract."}
          </div>
        )}
      </main>

      {showHistoryModal && (
        <div style={styles.aboutOverlay} onClick={() => setShowHistoryModal(false)}>
          <div style={{
            ...styles.aboutCard,
            width: "560px",
            maxHeight: "80vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px", flexShrink: 0 }}>
              <h2 style={{ ...styles.aboutTitle, fontSize: "20px" }}>📜 Activity History & Logs</h2>
              {historyLog.length > 0 && (
                <button
                  style={{
                    ...styles.button,
                    ...styles.buttonDanger,
                    padding: "4px 8px",
                    fontSize: "11px"
                  }}
                  onClick={() => setHistoryLog([])}
                >
                  Clear History
                </button>
              )}
            </div>

            <div style={{
              overflowY: "auto",
              flex: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingRight: "4px"
            }}>
              {historyLog.length === 0 ? (
                <div style={{ padding: "40px", color: "#64748b", fontSize: "13px" }}>
                  No historical conversion records found.
                </div>
              ) : (
                historyLog.map((log) => (
                  <div key={log.id} style={{
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    textAlign: "left"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{ fontWeight: "700", fontSize: "13px", color: "#f8fafc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {log.name}
                      </span>
                      <span style={{
                        ...styles.badge,
                        ...(log.status === "completed" ? styles.statusCompleted : styles.statusFailed),
                        fontSize: "10px"
                      }}>
                        {log.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "#64748b" }}>
                      <span>Format: {log.conversionType.toUpperCase()} • Size: {formatItemSize(log.size)}</span>
                      <span>{new Date(log.completedAt).toLocaleTimeString()}</span>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid rgba(255,255,255,0.02)",
                      paddingTop: "6px",
                      marginTop: "4px"
                    }}>
                      <span style={{ fontSize: "11px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: "10px" }}>
                        Out: {log.outputPath}
                      </span>
                      <button
                        style={{
                          ...styles.button,
                          ...styles.buttonSecondary,
                          padding: "2px 6px",
                          fontSize: "10px",
                          border: "1px solid rgba(255,255,255,0.08)"
                        }}
                        onClick={() => {
                          const logTxt = `JOB LOG:\nFile: ${log.name}\nSize: ${formatItemSize(log.size)}\nType: ${log.conversionType}\nStatus: ${log.status}\nOutput: ${log.outputPath}\nCompleted At: ${new Date(log.completedAt).toISOString()}${log.error ? `\nError: ${log.error}` : ""}`;
                          navigator.clipboard.writeText(logTxt);
                        }}
                      >
                        📋 Copy Log
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              style={{
                ...styles.button,
                ...styles.buttonPrimary,
                padding: "8px 24px",
                borderRadius: "8px",
                alignSelf: "center",
                cursor: "pointer",
                marginTop: "8px",
                flexShrink: 0
              }}
              onClick={() => setShowHistoryModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
