'use client'
import { useIsMobile } from '@/hooks/use-mobile';
import { ChartProps } from '@/lib/types';
import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

export default function MarketCapChart({ data, title = "Market Cap Trend (24h)" }: ChartProps) {
    const isMobile = useIsMobile();

    const option = useMemo(() => {
        const timestamps = data.map(item => {
            const date = new Date(item[0]);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        });

        const marketCaps = data.map(item => item[1]);

        // Calculate min and max for dynamic Y-axis scaling
        const minCap = Math.min(...marketCaps);
        const maxCap = Math.max(...marketCaps);
        const capRange = maxCap - minCap;

        // Add 2% padding to top and bottom
        const padding = capRange * 0.02;

        return {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const cap = parseFloat(params[0].value).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    });
                    return `${params[0].axisValue}<br/>Market Cap: ${cap}`;
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
                    interval: Math.floor(timestamps.length / 6) // Show ~6 labels
                }
            },
            yAxis: {
                type: 'value',
                min: minCap - padding,
                max: maxCap + padding,
                splitNumber: 8,
                scale: true,
                axisLabel: {
                    formatter: (value: number) => {
                        // Format large numbers (billions/millions)
                        if (value >= 1e9) {
                            return `₹${(value / 1e9).toFixed(1)}B`;
                        } else if (value >= 1e6) {
                            return `₹${(value / 1e6).toFixed(1)}M`;
                        }
                        return value.toLocaleString('en-IN', {
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
                    name: 'Market Cap',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'lttb',
                    lineStyle: {
                        color: '#8b5cf6',
                        width: 2
                    },
                    itemStyle: {
                        color: '#8b5cf6'
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
                                    color: 'rgba(139, 92, 246, 0.6)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(139, 92, 246, 0.1)'
                                }
                            ]
                        }
                    },
                    data: marketCaps
                }
            ]
        };
    }, [data, title]);

    return (
        <ReactECharts
            option={option}
            style={{ height: isMobile ? '100%' : '500px', width: '100%', minHeight: '300px' }}
            className="h-75 sm:h-100 md:h-112.5 lg:h-125"
            notMerge={true}
            lazyUpdate={true}
        />
    );
}
