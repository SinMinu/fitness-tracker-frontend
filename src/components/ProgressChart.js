import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const ProgressChart = ({ goalName, progress }) => {
    const data = {
        labels: ['Achieved', 'Remaining'],
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: ['#4caf50', '#ddd'],
                hoverBackgroundColor: ['#66bb6a', '#e0e0e0'],
            },
        ],
    };

    return (
        <div className="progress-chart">
            <h3>{goalName}</h3>
            <Doughnut data={data} />
        </div>
    );
};

export default ProgressChart;
