'use client'

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "../ui/sidebar";
import { Toggle } from "../ui/toggle";
import { Moon, Sun, Radio } from "lucide-react";
import { useLiveSyncStore } from "@/stores/live-sync-store";

export function AppHeader() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const { isLiveSync, toggleLiveSync } = useLiveSyncStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="flex py-4 shrink-0 items-center justify-between gap-2 px-4 border-b">
                <SidebarTrigger />
                <div className="w-10 h-5" />
            </header>
        );
    }

    return (
        <header className="flex py-3 shrink-0 items-center justify-between gap-2 px-4 border-b">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 mr-4">
                    <span className="text-sm text-gray-600">Start Live Tracking</span>
                    <Toggle
                        pressed={isLiveSync}
                        onPressedChange={toggleLiveSync}
                        aria-label="Toggle live sync"
                        className="data-[state=on]:bg-green-500 data-[state=on]:text-white"
                    >
                        <Radio className="h-4 w-4" />
                    </Toggle>
                    {isLiveSync && (
                        <span className="text-xs text-green-600 font-medium">Active</span>
                    )}
                </div>
                <Toggle
                    pressed={theme === 'dark'}
                    onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Moon className="h-4 w-4" />
                    ) : (
                        <Sun className="h-4 w-4" />
                    )}
                </Toggle>
            </div>
        </header>
    )
}