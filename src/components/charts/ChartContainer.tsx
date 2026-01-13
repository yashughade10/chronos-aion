'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainerProps } from "@/lib/types";
import { motion } from "framer-motion";

// Animation variants for chart container
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: "easeIn" as const
        }
    }
};

// Animation variants for chart content
const contentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const,
            delay: 0.1
        }
    }
};

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
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={`border rounded-lg p-6 shadow-sm ${className}`}
            >
                {title && (
                    <div className="mb-4">
                        <Skeleton className="h-6 w-48" />
                    </div>
                )}
                <Skeleton className="h-100 w-full" />
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className={`border rounded-lg p-6 shadow-sm ${className}`}
            >
                {title && (
                    <h3 className="text-lg font-semibold mb-4">{title}</h3>
                )}
                <div className="h-100 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <p className="text-red-500 font-medium mb-2">Error loading chart</p>
                        <p className="text-sm text-gray-500">{error.message}</p>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    if (isEmpty) {
        return (
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className={`border rounded-lg p-6 shadow-sm ${className}`}
            >
                {title && (
                    <h3 className="text-lg font-semibold mb-4">{title}</h3>
                )}
                <div className="h-100 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500"
                    >
                        {emptyMessage}
                    </motion.p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className={`border rounded-lg p-6 shadow-sm ${className}`}
        >
            {(title || headerActions) && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between mb-4"
                >
                    {title && <h3 className="text-lg font-semibold">{title}</h3>}
                    {headerActions && <div>{headerActions}</div>}
                </motion.div>
            )}
            <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="w-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
