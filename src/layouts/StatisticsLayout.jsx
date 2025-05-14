import React from 'react';
import { Outlet } from 'react-router-dom';
import StatisticsSidebar from '../components/features/Navigation/MainNav/StatisticsSidebar';

const StatisticsLayout = ({ type }) => {
    return (
        <div style={{ display: 'flex' }}>
            <StatisticsSidebar type={type} />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
        </div>
    );
};

export default StatisticsLayout; 