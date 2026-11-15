/**
 * Compresso - Application Store
 * Developer: @seltux (Telegram: @seltux)
 * License: Full Lifetime License to @seltux
 */

import { create } from 'zustand';
import { DEFAULT_CONFIG } from './compressionEngine.js';
import { PRESETS } from './presets.js';

const INITIAL_STATE = {
  isRunning: false,
  files: [],
  config: DEFAULT_CONFIG,
  preset: PRESETS[0],
  isHoveringTitleBar: false,
  selectedFileIds: [],
  settingsIsOpen: false,
  reCompressFileIds: [],
  isPinned: false,
  onboardingCompleted: true,
  hasPaid: true, // Full Lifetime License enabled for @seltux (no watermarks or restrictions)
  hasDismissedGettingStarted: true,
  didLoginDuringOnboarding: true,
  pendingActionsAfterLogin: [],
  lastVersion: null,
  seenWhatsNewVersion: null
};

export const useAppStore = create((set, get) => ({
  ...INITIAL_STATE,

  setFiles: (files) => set({ files }),
  
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  
  clearAllFiles: () => set({ files: [] }),
  
  clearFileWithId: (id) => set((state) => ({
    files: state.files.filter((f) => f.id !== id)
  })),

  setFileStatus: (id, status) => set((state) => ({
    files: state.files.map((f) => (f.id === id ? { ...f, status } : f))
  })),

  updateFileProgress: (id, progress) => set((state) => ({
    files: state.files.map((f) => (f.id === id ? { ...f, progress } : f))
  })),

  setOptimizeConfig: (config) => set({ config }),
  
  setPreset: (preset) => set({ preset, config: preset.config }),
  
  setIsRunning: (isRunning) => set({ isRunning }),
  
  setIsPinned: (isPinned) => set({ isPinned }),
  
  setSelectedFileIds: (selectedFileIds) => set({ selectedFileIds }),
  
  toggleSettings: () => set((state) => ({ settingsIsOpen: !state.settingsIsOpen })),
  
  setHasPaid: (hasPaid) => set({ hasPaid }),
  
  queueFileForRecompress: (id) => set((state) => ({
    reCompressFileIds: [...state.reCompressFileIds, id]
  })),
  
  removeFileFromRecompressQueue: (id) => set((state) => ({
    reCompressFileIds: state.reCompressFileIds.filter((x) => x !== id)
  })),

  setTrims: (fileId, trimStart, trimEnd) => set((state) => ({
    files: state.files.map((p) =>
      p.id === fileId
        ? {
            ...p,
            overrideConfig: {
              ...p.overrideConfig,
              trimStart: trimStart === 0 ? undefined : trimStart,
              trimEnd: trimEnd === 1 ? undefined : trimEnd
            }
          }
        : p
    )
  })),

  reset: () => set(INITIAL_STATE)
}));
