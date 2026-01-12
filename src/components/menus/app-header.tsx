'use client'

import { SidebarTrigger } from "../ui/sidebar";

export function AppHeader() {
    return (
        <header className="flex py-3 shrink-0 items-center justify-between gap-2 px-4 border-b">
            <SidebarTrigger />
        </header>
    )
}