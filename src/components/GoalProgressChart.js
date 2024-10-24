import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function GoalProgressChart({ goalProgress }) {
    const data = {
        labels: goalProgress.map((goal) => goal.goalDescription),
        datasets: [
            {
                label: '진행률 (%)',
                data: goalProgress.map((goal) => goal.progress),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: '진행률 (%)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: '목표',
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <h3>목표 진행 차트</h3>
            <Bar data={data} options={options} />
        </div>
    );
}

export default GoalProgressChart;
