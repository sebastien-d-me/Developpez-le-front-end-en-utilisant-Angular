export interface ChartResponsiveInterface {
    breakpoint: number;
    options: {
        chart: {
            height: number;
            width: number;
        }
    }
}

export interface ChartOptionsInterface {
    dataPointIndex: number;
    series: [];
    seriesIndex: number;
    w: {
        globals: {
            labels: string[]
        }
    };
}