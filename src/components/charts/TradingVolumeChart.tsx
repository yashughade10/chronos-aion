import { useIsMobile } from '@/hooks/use-mobile';
import { ChartProps } from '@/lib/types'
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react'

export default function TradingVolumeChart({ data, title = "Trading Volume (24h)" }: ChartProps) {
    const isMobile = useIsMobile();

    const option = useMemo(() => {
        const timestamps = data.map(item => {
            const date = new Date(item[0]);
            return date.toLocaleDateString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        })

        const prices = data.map(item => item[1]);

        // Calculate min and max for dynamic Y-axis scaling
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;

        // Add 2% padding to top and bottom
        const padding = priceRange * 0.02;

        return {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const price = parseFloat(params[0].value).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    return `${params[0].axisValue}<br/>Volume: ${price}`;
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
                boundaryGap: true,
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
                splitNumber: 6,
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
                    name: 'Volume',
                    type: 'bar',
                    barMaxWidth: 20,
                    itemStyle: {
                        color: '#10b981',
                        borderRadius: [4, 4, 0, 0]
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#059669'
                        }
                    },
                    data: prices
                }
            ]
        }
    }, [data, title])

    return (
        <ReactECharts
            option={option}
            style={{ height: isMobile ? '100%' : '500px', width: '100%', minHeight: '300px' }}
            className="h-75 sm:h-100 md:h-112.5 lg:h-125"
            notMerge={true}
            lazyUpdate={true}
        />
    )
}
