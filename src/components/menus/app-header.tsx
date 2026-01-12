'use client'

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "../ui/sidebar";
import { Toggle } from "../ui/toggle";
import { Moon, Sun } from "lucide-react";

export function AppHeader() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

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
        </header>
    )
}