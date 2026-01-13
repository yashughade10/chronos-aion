'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AddToWatchlistDialogProps } from "@/lib/types";

export default function AddToWatchlistDialog({
    open,
    onOpenChange,
    onConfirm,
    cryptoName
}: AddToWatchlistDialogProps) {
    const [threshold, setThreshold] = useState<string>("5");
    const [error, setError] = useState<string>("");

    const handleConfirm = () => {
        const value = parseFloat(threshold);

        if (isNaN(value) || value <= 0) {
            setError("Please enter a valid percentage greater than 0");
            return;
        }

        if (value > 100) {
            setError("Percentage cannot exceed 100%");
            return;
        }

        onConfirm(value);
        setThreshold("5"); // Reset to default
        setError("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add {cryptoName} to Watchlist</DialogTitle>
                    <DialogDescription>
                        Set a price change threshold. You'll be alerted when the price changes by more than this percentage.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <label className="text-sm font-medium mb-2 block">
                        Threshold Percentage (%)
                    </label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={threshold}
                        onChange={(e) => {
                            setThreshold(e.target.value);
                            setError("");
                        }}
                        placeholder="e.g., 5"
                    />
                    {error && (
                        <p className="text-sm text-red-500 mt-1">{error}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        Example: If you set 5%, you'll be notified when the price changes by more than 5%.
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        Add to Watchlist
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
