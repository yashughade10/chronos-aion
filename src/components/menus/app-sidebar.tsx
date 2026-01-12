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

export function AppSidebar() {

    const { data = [], isLoading, error } = useQuery<CryptoCurrency[]>({
        queryKey: ['crypto-list'],
        queryFn: fetchCryptoList,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

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
                            {data?.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild>
                                        <div>
                                            <img src={item.image} alt={item.name} width={24} height={24} />
                                            <span>{item.name}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}