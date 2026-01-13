'use client'
import PriceTrendChart from "@/components/charts/PriceTrendChart";
import MarketCapChart from "@/components/charts/MarketCapChart";
import ChartContainer from "@/components/charts/ChartContainer";
import { fetchMarketData } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";
import TradingVolumeChart from "@/components/charts/TradingVolumeChart";
import AddToWatchlistDialog from "@/components/AddToWatchlistDialog";
import { getHistoryFromLocalStorage } from "@/lib/local-storage";
import { CryptoHistoryItem } from "@/lib/types";
import { formatTimeAgo } from "@/lib/time-utils";
import { useLiveSyncStore } from "@/stores/live-sync-store";
import { addToWatchlist, getWatchlistItem, isInWatchlist, removeFromWatchlist, updateWatchlistPrice } from "@/lib/watchlist";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";

export default function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [history, setHistory] = useState<CryptoHistoryItem[]>([]);
    const [inWatchList, setInWatchList] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { isLiveSync } = useLiveSyncStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['crypto-market-data', id],
        queryFn: () => fetchMarketData(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: isLiveSync ? 5000 : false, // Poll every 5 seconds when live sync is on
    })

    useEffect(() => {
        const historyData = getHistoryFromLocalStorage();
        setHistory(historyData);

        // Check if the current crypto is in the watchlist
        setInWatchList(isInWatchlist(id));
    }, [id]);

    // Monitoring price change
    useEffect(() => {
        if (!data?.prices || data.prices.length === 0) return;

        const watchlistItem = getWatchlistItem(id);
        if (!watchlistItem) return;

        const currentPrice = data.prices[data.prices.length - 1][1];

        // check if we should alert the user
        const shouldAlert = updateWatchlistPrice(id, currentPrice);

        if (shouldAlert) {
            const priceChange = Math.abs((currentPrice - watchlistItem.lastPrice) / watchlistItem.lastPrice * 100);
            const direction = currentPrice > watchlistItem.lastPrice ? 'increased' : 'decreased';

            toast.warning(`Price Alert: ${id.toUpperCase()}`, {
                description: `Price ${direction} by ${priceChange.toFixed(2)}% (Threshold: ${watchlistItem.threshold}%)`,
                duration: 5000,
            });
        }
    }, [data, id]);

    // This function adds item to watchlist
    const handleAddToWatchlist = (threshold: number) => {
        if (!data?.prices || data.prices.length === 0) {
            toast.error("Cannot add to watchlist", {
                description: "No price data available."
            });
            return;
        }

        const currentPrice = data.prices[data.prices.length - 1][1];
        addToWatchlist(id, id.toUpperCase(), threshold, currentPrice);
        setInWatchList(true);
        setDialogOpen(false);

        toast.success('Added to Watchlist', {
            description: `You'll be notified when ${id.toUpperCase()} price changes by more than ${threshold}%`
        });
    }

    // This function removes item from watchlist
    const handleRemoveFromWatchlist = () => {
        removeFromWatchlist(id);
        setInWatchList(false);

        toast.info('Removed from Watchlist', {
            description: `${id.toUpperCase()} has been removed from your watchlist.`
        });
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Crypto Details</h1>
                    <p className="text-gray-600">Viewing cryptocurrency: {id}</p>
                </div>
                <div>
                    {inWatchList ? (
                        <Button onClick={handleRemoveFromWatchlist} variant="outline">
                            <BellOff className="mr-2 h-4 w-4" />
                            Remove from Watchlist
                        </Button>
                    ) : (
                        <Button onClick={() => setDialogOpen(true)}>
                            <Bell className="mr-2 h-4 w-4" />
                            Add to Watchlist
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <div className=" w-[75%]">
                    <div className="space-y-10 my-10">
                        <ChartContainer
                            title={`${id.toUpperCase()} Price Trend (24h)`}
                            isLoading={isLoading}
                            error={error}
                            isEmpty={!data?.prices || data.prices.length === 0}
                            emptyMessage="No price data available"
                        >
                            {data?.prices && data.prices.length > 0 && (
                                <PriceTrendChart data={data.prices} />
                            )}
                        </ChartContainer>
                    </div>

                    <div className="space-y-10 my-10">
                        <ChartContainer
                            title={`${id.toUpperCase()} Trading Volume (24h)`}
                            isLoading={isLoading}
                            error={error}
                            isEmpty={!data?.total_volumes || data.total_volumes.length === 0}
                            emptyMessage="No volume data available"
                        >
                            {data?.total_volumes && data.total_volumes.length > 0 && (
                                <TradingVolumeChart data={data.total_volumes} />
                            )}
                        </ChartContainer>
                    </div>

                    <div className="space-y-10 my-10">
                        <ChartContainer
                            title={`${id.toUpperCase()} Market Cap Trend (24h)`}
                            isLoading={isLoading}
                            error={error}
                            isEmpty={!data?.market_caps || data.market_caps.length === 0}
                            emptyMessage="No market cap data available"
                        >
                            {data?.market_caps && data.market_caps.length > 0 && (
                                <MarketCapChart data={data.market_caps} />
                            )}
                        </ChartContainer>
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

            <AddToWatchlistDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleAddToWatchlist}
                cryptoName={id.toUpperCase()}
            />
        </div>
    );
}