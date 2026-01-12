'use client'
import PriceTrendChart from "@/components/charts/PriceTrendChart";
import MarketCapChart from "@/components/charts/MarketCapChart";
import { fetchMarketData } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";
import TradingVolumeChart from "@/components/charts/TradingVolumeChart";
import { getHistoryFromLocalStorage } from "@/lib/local-storage";
import { CryptoHistoryItem } from "@/lib/types";
import { formatTimeAgo } from "@/lib/time-utils";

export default function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [history, setHistory] = useState<CryptoHistoryItem[]>([]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['crypto-market-data', id],
        queryFn: () => fetchMarketData(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        // refetchInterval: 30000, // Poll every 30 seconds (for testing)
    })

    useEffect(() => {
        const historyData = getHistoryFromLocalStorage();
        setHistory(historyData);
    }, []);

    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4 text-red-500">Error loading data</h1>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Crypto Details</h1>
            <p className="mb-6 text-gray-600">Viewing cryptocurrency: {id}</p>

            <div className="flex gap-2">
                <div className=" w-[75%]">
                    <div className="space-y-10 my-10">
                        {data?.prices && data.prices.length > 0 && (
                            <PriceTrendChart data={data.prices} title={`${id.toUpperCase()} Price Trend (24h)`} />
                        )}
                    </div>

                    <div className="space-y-10 my-10">
                        {data?.total_volumes && data.total_volumes.length > 0 && (
                            <TradingVolumeChart data={data.total_volumes} title={`${id.toUpperCase()} Trading Volume (24h)`} />
                        )}
                    </div>

                    <div className="space-y-10 my-10">
                        {data?.market_caps && data.market_caps.length > 0 && (
                            <MarketCapChart data={data.market_caps} title={`${id.toUpperCase()} Market Cap Trend (24h)`} />
                        )}
                    </div>
                </div>

                <div className="w-[25%]">
                    <div className="sticky top-6">
                        <div className="border rounded-lg p-4  shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Search History</h2>
                            <div className="space-y-2">
                                {history.map((item) => (
                                    <div key={item.id} className="p-3 rounded-md cursor-pointer border border-gray-100 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-medium text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{item.id}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}