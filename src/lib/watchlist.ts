'use client';

import { WatchlistItem } from "./types";

const WATCHLIST_KEY = 'crypto-watchlist';

export const getWatchlist = (): Record<string, WatchlistItem> => {
    if (typeof window === 'undefined') return {};

    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (!stored) return {};

    try {
        return JSON.parse(stored);
    } catch {
        return {};
    }
};

export const addToWatchlist = (id: string, name: string, threshold: number, currentPrice: number): void => {
    const watchlist = getWatchlist();

    watchlist[id] = {
        id,
        name,
        threshold,
        lastPrice: currentPrice,
        addedAt: new Date().toISOString()
    };

    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

export const removeFromWatchlist = (id: string): void => {
    const watchlist = getWatchlist();
    delete watchlist[id];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

export const updateWatchlistPrice = (id: string, newPrice: number): boolean => {
    const watchlist = getWatchlist();
    const item = watchlist[id];

    if (!item) return false;

    const priceChange = Math.abs((newPrice - item.lastPrice) / item.lastPrice * 100);
    const shouldAlert = priceChange >= item.threshold;

    // Update the last price
    item.lastPrice = newPrice;
    watchlist[id] = item;
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));

    return shouldAlert;
};

export const isInWatchlist = (id: string): boolean => {
    const watchlist = getWatchlist();
    return id in watchlist;
};

export const getWatchlistItem = (id: string): WatchlistItem | null => {
    const watchlist = getWatchlist();
    return watchlist[id] || null;
};
