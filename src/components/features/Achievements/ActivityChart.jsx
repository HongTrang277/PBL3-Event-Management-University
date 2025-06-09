// src/components/features/Achievements/ActivityChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const ActivityChart = ({ data }) => {
    const options = {
        chart: {
            id: 'activity-chart',
            toolbar: { show: false },
        },
        xaxis: {
            categories: data.map(d => d.period),
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '14px',
                },
            },
        },
        yaxis: {
            title: {
                text: 'Số sự kiện tham gia',
                style: {
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: 600,
                },
            },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        tooltip: {
            x: { format: 'dd/MM/yy HH:mm' }
        },
    };

    const series = [{
        name: 'Hoạt động',
        data: data.map(d => d.count),
    }];

    return (
        <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Chart options={options} series={series} type="area" height={350} />
        </div>
    );
};

export default ActivityChart;