'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainerProps } from "@/lib/types";

export default function ChartContainer({
    title,
    isLoading = false,
    error = null,
    isEmpty = false,
    emptyMessage = "No data available",
    children,
    className = "",
    headerActions
}: ChartContainerProps) {

    if (isLoading) {
        return (
            <div className={`border rounded-lg p-6 shadow-sm ${className}`}>
                {title && (
                    <div className="mb-4">
                        <Skeleton className="h-6 w-48" />
                    </div>
                )}
                <Skeleton className="h-100 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`border rounded-lg p-6 shadow-sm ${className}`}>
                {title && (
                    <h3 className="text-lg font-semibold mb-4">{title}</h3>
                )}
                <div className="h-100 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 font-medium mb-2">Error loading chart</p>
                        <p className="text-sm text-gray-500">{error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className={`border rounded-lg p-6 shadow-sm ${className}`}>
                {title && (
                    <h3 className="text-lg font-semibold mb-4">{title}</h3>
                )}
                <div className="h-100 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`border rounded-lg p-6 shadow-sm ${className}`}>
            {(title || headerActions) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="text-lg font-semibold">{title}</h3>}
                    {headerActions && <div>{headerActions}</div>}
                </div>
            )}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
