'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"
import { fetchCryptoList } from "@/services/api"
import { CryptoCurrency } from "@/lib/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { saveToHistoryToLocalStorage } from "@/lib/local-storage"

export function AppSidebar() {
    const pathname = usePathname();

    const { data = [], isLoading, error } = useQuery<CryptoCurrency[]>({
        queryKey: ['crypto-list'],
        queryFn: fetchCryptoList,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const handleClick = (item: CryptoCurrency) => {
        saveToHistoryToLocalStorage(item.id, item.name);
    }

    return (
        <Sidebar>
            <SidebarHeader className="border-b px-6 py-4">
                <div className="flex items-center justify-center">
                    <h1 className="text-xl font-bold">Chronos</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data?.map((item: CryptoCurrency) => {
                                const isActive = pathname === `/crypto/${item.id}`;
                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link
                                                href={`/crypto/${item.id}`}
                                                onClick={() => handleClick(item)}
                                            >
                                                <img src={item.image} alt={item.name} className="w-5 h-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar >
    )
}