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
import { AnimatePresence, motion } from "framer-motion";

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
        <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="p-4 md:p-6"
        >
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
            >
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">Crypto Details</h1>
                    <p className="text-sm md:text-base text-gray-600">Viewing cryptocurrency: {id}</p>
                </div>
                <div className="w-full sm:w-auto">
                    {inWatchList ? (
                        <Button onClick={handleRemoveFromWatchlist} variant="outline" className="w-full sm:w-auto">
                            <BellOff className="mr-2 h-4 w-4" />
                            Remove from Watchlist
                        </Button>
                    ) : (
                        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
                            <Bell className="mr-2 h-4 w-4" />
                            Add to Watchlist
                        </Button>
                    )}
                </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="w-full lg:w-[75%]">
                    <div className="space-y-6 md:space-y-10 my-6 md:my-10">
                        <AnimatePresence mode="wait" key={`price-${id}`}>
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
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6 md:space-y-10 my-6 md:my-10">
                        <AnimatePresence mode="wait" key={`volume-${id}`}>
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
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6 md:space-y-10 my-6 md:my-10">
                        <AnimatePresence mode="wait" key={`marketcap-${id}`}>
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
                        </AnimatePresence>
                    </div>
                </div>

                <div className="w-full lg:w-[25%]">
                    <div className="lg:sticky lg:top-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="border rounded-lg p-4 shadow-sm"
                        >
                            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Search History</h2>
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {history.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            className="p-2 md:p-3 rounded-md cursor-pointer border border-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-1 md:mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-xs md:text-sm truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</p>
                                                </div>
                                                <span className="text-xs text-gray-400 ml-2 shrink-0">{item.id}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AddToWatchlistDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleAddToWatchlist}
                cryptoName={id.toUpperCase()}
            />
        </motion.div>
    );
}