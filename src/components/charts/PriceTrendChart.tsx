'use client'
import { ChartProps } from '@/lib/types';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

export default function PriceTrendChart({ data, title = "Price Trend (24h)" }: ChartProps) {
    const option = useMemo(() => {

        const timestamps = data.map(item => {
            const date = new Date(item[0]);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        });

        const prices = data.map(item => item[1]);

        // Calculate min and max for dynamic Y-axis scaling
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;

        // Add 2% padding to top and bottom
        const padding = priceRange * 0.02;

        return {
            title: {
                text: title,
                left: 'left',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const price = parseFloat(params[0].value).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    return `${params[0].axisValue}<br/>Price: ${price}`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: timestamps,
                axisLabel: {
                    rotate: 45,
                    interval: Math.floor(timestamps.length / 10) // Show approx 10 labels
                }
            },
            yAxis: {
                type: 'value',
                min: minPrice - padding,
                max: maxPrice + padding,
                splitNumber: 8,
                scale: true,
                axisLabel: {
                    formatter: (value: number) => {
                        return value.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        });
                    }
                }
            },
            series: [
                {
                    name: 'Price',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'lttb',
                    itemStyle: {
                        color: '#3b82f6'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(59, 130, 246, 0.5)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(59, 130, 246, 0.05)'
                                }
                            ]
                        }
                    },
                    data: prices
                }
            ]
        };
    }, [data, title]);

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-100 flex items-center justify-center border rounded-lg">
                <p className="text-gray-500">No price data available</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <ReactECharts
                option={option}
                style={{ height: '500px', width: '100%' }}
                notMerge={true}
                lazyUpdate={true}
            />
        </div>
    );
}
