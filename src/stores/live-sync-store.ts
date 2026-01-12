import { LiveSyncState } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLiveSyncStore = create<LiveSyncState>()(
    persist(
        (set) => ({
            isLiveSync: false,
            toggleLiveSync: () => set((state) => ({ isLiveSync: !state.isLiveSync })),
            setLiveSync: (value) => set({ isLiveSync: value }),
        }),
        {
            name: 'live-sync-storage',
        }
    )
);
