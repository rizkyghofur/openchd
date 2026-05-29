# 💿 OpenCHD

A breathtaking, high-performance cross-platform desktop GUI frontend for `chdman`, designed to simplify CHD conversion workflows for retro gaming and preservation communities. Built from the ground up to eliminate terminal complexity while preserving the maximum capabilities of the MAME `chdman` engine.

OpenCHD features an ultra-premium glassmorphic dark theme, instant Drag & Drop, native OS shell controls, smart queue validation, and batch multi-threaded scheduling.

---

## ✨ Features

OpenCHD encapsulates a rich suite of desktop-first features to offer an unmatched, state-of-the-art disc conversion tool:

### ⚡ Batch Conversion Engine
* **Disc to CHD Compression**: Batch convert `.iso`, `.cue` / `.bin`, and `.gdi` files into pristine compressed `.chd` files.
* **CHD Extraction**: Seamlessly extract `.chd` back into original `.iso` or `.cue`/`.bin` formats.
* **Smart Queue & Scheduling**: Queue multiple tasks simultaneously. OpenCHD schedules conversions with a highly efficient multi-worker concurrency model.
* **Dynamic Speeds & Aggregated ETAs**: Displays real-time speeds in `MB/s` alongside a true collective remaining ETA that continuously adapts based on processed sizes and remaining queue weights.

### 📁 Advanced Filesystem & Shell Integrations
* **Custom Output Destination**: Save conversions to their source directories (default) or select a custom folder globally.
* **Auto-Open Destination Folder**: Toggle **Open folder when finished** to automatically launch Finder (macOS) or File Explorer (Windows) highlighting your output folder upon batch completion.
* **Direct File Highlighting ("Show in Folder")**: Completed tasks display a native `📂 Show in Folder` shortcut to immediately reveal and highlight the generated file in your OS file manager.

### 🛡️ Smart Cue Validation & Auto-Repair
* **Track Integrity Analyzer**: Automatically parses and validates `.cue` files upon drag-and-drop, verifying that all referenced `.bin` files exist on the filesystem.
* **Dynamic Corrections Engine**: Detects mismatched or broken track filenames and offers a one-click **Auto-Fix** correction box utilizing advanced matching algorithms to instantly repair your CUE sheet.

### 📊 Real-Time Metadata Reader
* **Interactive Hunk Analyzer**: Automatically reads CHD headers upon loading.
* **Details Displayer**: Visually presents compression codecs (zlib, lzma, etc.), precise compression ratios, hunk counts, and hunk size properties inside the queue items.

### 📜 Comprehensive Activity Logs
* **Persistent Session History**: A dedicated log overlay presenting historical logs of completed and failed tasks.
* **Detailed Job Diagnostics**: Includes precise completion timestamps, file sizes, execution speeds, and output paths.
* **One-Click Clipboard Export**: Click `📋 Copy Log` on any task to copy a perfectly formatted diagnostic log snippet for debugging, sharing, or preservation notes.

### 🔔 System Desktop Notifications
* **Background Worker Completion Alerts**: Seamlessly dispatches native HTML5 OS desktop alerts on batch completion, letting you minimize the application and focus elsewhere.

---

## 🛠️ Tech Stack

OpenCHD uses a modern, robust, and highly-optimized desktop monorepo stack:
* **Electron** — Cross-platform native application hosting & OS shell bridge.
* **React & TypeScript** — Highly modular, type-safe, and interactive user interface.
* **Vite** — Breathtakingly fast bundler and hot-module development server.
* **TurboRepo & PNPM** — Clean, high-performance monorepo workspace management.
* **TypeScript Process Layer** — Node.js child-process architecture wrapped safely to prevent command-injection vulnerabilities.

---

## 📂 Project Architecture

```
openchd/
├── apps/
│   └── desktop/        # Electron native main process, preload scripts, and window config
├── packages/
│   ├── core/           # Core conversion schedulers & chdman child-process engines
│   ├── process/        # Advanced path handlers, metadata parsers, and CUE validation
│   ├── shared/         # Type definitions, job interfaces, and generic utilities
│   └── ui/             # High-fidelity React UI and glassmorphic components
└── assets/
    └── binaries/       # Platform-specific native chdman binary manager
```

---

## 🚀 Getting Started & Local Setup

Follow these steps to set up, build, and run the development environment on your local system:

### 📋 Prerequisites
* **Node.js** >= `20.0.0`
* **PNPM** >= `9.0.0` (Run `npm i -g pnpm` to install globally if not present, or use the local pnpm binary).
* **OS Platform** — macOS (Apple Silicon / Intel), Windows, or Linux.

### 📦 Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/openchd.git
   cd openchd
   ```

2. **Install Dependencies**:
   Ensure all package workspaces are correctly linked:
   ```bash
   pnpm install
   ```

3. **Build Core & UI Workspaces**:
   Run the monorepo build pipeline to compile shared types, process modules, and UI packages:
   ```bash
   pnpm build
   ```

4. **Launch the Desktop App (Development Mode)**:
   This will spin up the Vite HMR renderer server and launch the native Electron wrapper with DevTools pre-enabled:
   ```bash
   pnpm dev
   # or
   npm start
   ```

5. **Package into Native Installers (Production)**:
   Compile the workspaces and bundle the desktop application into platform-specific installers (e.g. `.dmg` for macOS, `.exe` for Windows, or `.AppImage` for Linux) inside the `apps/desktop/out/` directory:
   ```bash
   ./node_modules/.bin/pnpm package
   ```

---

## 💡 How to Use OpenCHD

1. **Choose Your Mode**:
   * Use **Compress to CHD** to pack raw disc formats (`.iso`, `.bin/.cue`, `.gdi`) into compressed CHD archives.
   * Use **Extract CHD** to restore `.chd` files back into high-compatibility `.iso` or `.bin/.cue` sets.

2. **Drop Your Files**:
   * Drag one or multiple disc files directly onto the dropzone, or click anywhere inside the dashed border to open the native OS file selection browser.

3. **Customize Output (Optional)**:
   * By default, OpenCHD places conversions in the exact folder of your source files.
   * To change this globally, click **Choose Folder...** on the save bar to select a custom destination, and check **Open folder when finished** if you want your file explorer to pop up when the batch is done.

4. **Run Conversions**:
   * Click **⚡ Process All** (or select checkboxes and click **⚡ Process Selected**) to kickstart the multi-threaded converter.
   * Sit back and monitor overall batch progress and ETAs! You can safely minimize the app; OpenCHD will notify you through system alerts once the queue is fully cleared.

5. **Access Your Output & Logs**:
   * Click `📂 Show in Folder` next to completed items to immediately locate your new files.
   * Click the `📜 History` button in the header to review active session summaries or copy formatted conversion diagnostics.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
