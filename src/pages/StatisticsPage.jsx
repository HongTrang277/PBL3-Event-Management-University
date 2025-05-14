// src/pages/StatisticsPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStatisticsData } from '../services/mockData'; // Đảm bảo đường dẫn đúng
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import _ from 'lodash';

// --- Styled Components ---

const PageWrapper = styled.div`
    /* container mx-auto p-4 md:p-6 space-y-8 */
    width: 100%;
    max-width: 1280px; /* Example max-width */
    margin-left: auto;
    margin-right: auto;
    padding: 1rem; /* p-4 */
    & > * + * {
        margin-top: 2rem; /* space-y-8 */
    }

    @media (min-width: 768px) { /* md */
        padding: 1.5rem; /* md:p-6 */
    }
`;

const Title = styled.h1`
    /* text-2xl md:text-3xl font-bold font-dm-sans text-gray-800 */
    font-size: 1.5rem; /* text-2xl */
    line-height: 2rem;
    font-weight: 700; /* font-bold */
    font-family: 'DM Sans', sans-serif; /* font-dm-sans */
    color: #1f2937; /* text-gray-800 */
    margin-bottom: 0; /* Reset default margin */

    @media (min-width: 768px) { /* md */
        font-size: 1.875rem; /* md:text-3xl */
        line-height: 2.25rem;
    }
`;

const Section = styled.section`
    /* bg-white p-6 rounded-lg shadow space-y-6 */
    background-color: #ffffff;
    padding: 1.5rem; /* p-6 */
    border-radius: 0.5rem; /* rounded-lg */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow */
    & > * + * {
        margin-top: 1.5rem; /* space-y-6 */
    }
`;

const SectionTitle = styled.h2`
    /* text-xl font-semibold text-gray-700 font-dm-sans mb-4 */
    font-size: 1.25rem; /* text-xl */
    line-height: 1.75rem;
    font-weight: 600; /* font-semibold */
    color: #374151; /* text-gray-700 */
    font-family: 'DM Sans', sans-serif; /* font-dm-sans */
    margin-bottom: 1rem; /* mb-4 */
    margin-top: 0; /* Reset default */
`;

const StatsGrid = styled.div`
    /* grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 */
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1rem; /* gap-4 */

    @media (min-width: 640px) { /* sm */
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (min-width: 1024px) { /* lg */
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
`;

const StatCard = styled.div`
    /* bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow */
    /* Adjusted since parent is Section */
    background-color: #f9fafb; /* Lighter bg for contrast within Section */
    padding: 1.5rem; /* p-6 */
    border-radius: 0.5rem; /* rounded-lg */
    border: 1px solid #e5e7eb; /* Add subtle border */
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-md */
    }
`;

const CardTitle = styled.h3`
    /* text-sm font-medium text-gray-500 uppercase */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    font-weight: 500; /* font-medium */
    color: #6b7280; /* text-gray-500 */
    text-transform: uppercase;
    margin: 0;
`;

const CardValue = styled.p`
    /* mt-1 text-3xl font-semibold text-gray-900 */
    margin-top: 0.25rem; /* mt-1 */
    font-size: 1.875rem; /* text-3xl */
    line-height: 2.25rem;
    font-weight: 600; /* font-semibold */
    color: #111827; /* text-gray-900 */
    margin-bottom: 0;
`;

const ChartContainer = styled.div`
    height: 20rem; /* h-80 */
    @media (min-width: 768px) { /* md */
        height: 24rem; /* md:h-96 */
    }
`;

const TableWrapper = styled.div`
    overflow-x: auto;
    margin-top: 1.5rem; /* mt-6 */
`;

const StyledTable = styled.table`
    min-width: 100%;
    border-collapse: collapse; /* Use collapse for cleaner lines */
    /* divide-y divide-gray-200 */
     td, th {
        border-bottom: 1px solid #e5e7eb; /* divide-gray-200 */
    }
    th {
         border-top: 1px solid #e5e7eb; /* Add top border for header */
    }

`;

const Thead = styled.thead`
    background-color: #f9fafb; /* bg-gray-50 */
`;

const Tbody = styled.tbody`
    background-color: #ffffff;
     /* divide-y handled by StyledTable */
`;

const Tr = styled.tr`
    ${(props) => props.highlight && `background-color: #fefce8;`} /* bg-yellow-50 */
    &:hover {
         background-color: #f3f4f6; /* Subtle hover */
    }
`;

const Th = styled.th`
    /* px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider */
    padding: 0.75rem 1.5rem; /* px-6 py-3 */
    text-align: left;
    font-size: 0.75rem; /* text-xs */
    line-height: 1rem;
    font-weight: 500; /* font-medium */
    color: #6b7280; /* text-gray-500 */
    text-transform: uppercase;
    letter-spacing: 0.05em; /* tracking-wider */

    &.center { text-align: center; }
`;

const Td = styled.td`
    /* px-6 py-4 whitespace-nowrap text-sm */
    padding: 1rem 1.5rem; /* px-6 py-4 */
    white-space: nowrap;
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    color: #374151; /* text-gray-700 - Adjusted base text color */

    &.font-medium { font-weight: 500; } /* font-medium */
    &.text-gray-900 { color: #111827; }
    &.text-gray-500 { color: #6b7280; }
    &.center { text-align: center; }
`;

const StatusContainer = styled.div`
    text-align: center;
    padding: 2.5rem 0; /* py-10 */
`;

const ErrorStatusContainer = styled(StatusContainer)`
    color: #dc2626; /* text-red-600 */
`;


// --- Recharts Config ---

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19D4FF'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent * 100 < 5) return null;

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
            {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
    );
};

// --- Component ---

const StatisticsPage = () => {
    const [statsData, setStatsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getStatisticsData();
                setStatsData(response.data);
            } catch (err) {
                setError(err.message || 'Không thể tải dữ liệu thống kê.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <StatusContainer>Đang tải dữ liệu thống kê...</StatusContainer>;
    }

    if (error) {
        return <ErrorStatusContainer>Lỗi: {error}</ErrorStatusContainer>;
    }

    if (!statsData) {
        return <StatusContainer>Không có dữ liệu thống kê để hiển thị.</StatusContainer>;
    }

    const topFacultiesData = statsData.facultyRanking.slice(0, 10);

    return (
        <PageWrapper>
            <Title>Thống kê & Thi đua Liên chi đoàn</Title>

            {/* 1. Section Tổng quan */}
            <StatsGrid>
                <StatCard>
                    <CardTitle>Tổng số sự kiện</CardTitle>
                    <CardValue>{statsData.summary.totalEvents}</CardValue>
                </StatCard>
                <StatCard>
                    <CardTitle>Tổng lượt đăng ký (Mô phỏng)</CardTitle>
                    <CardValue>{statsData.summary.totalRegistrations.toLocaleString('vi-VN')}</CardValue>
                </StatCard>
                <StatCard>
                    <CardTitle>Tỷ lệ tham gia trung bình</CardTitle>
                    <CardValue>{statsData.summary.overallAvgParticipation.toFixed(1)}%</CardValue>
                </StatCard>
            </StatsGrid>

            {/* 2. Section Thi đua Liên chi đoàn */}
            <Section>
                <SectionTitle>Thi đua Liên chi đoàn (Top 10)</SectionTitle>
                {/* Biểu đồ cột */}
                <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topFacultiesData}
                            margin={{ top: 5, right: 5, left: 0, bottom: 45 }} // Adjust margins
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis
                                dataKey="name"
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                                tick={{ fontSize: 10 }}
                                height={60} // Ensure space for slanted labels
                            />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 10 }} label={{ value: 'Lượt đăng ký', angle: -90, position: 'insideLeft', fill: '#8884d8', fontSize: 12, dx: -10 }}/>
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 10 }} label={{ value: 'Số sự kiện', angle: -90, position: 'insideRight', fill: '#82ca9d', fontSize: 12, dx: 10 }}/>
                            <Tooltip formatter={(value, name, props) => [`${value.toLocaleString ? value.toLocaleString('vi-VN') : value}`, props.payload.name]}/>
                            <Legend verticalAlign="top" wrapperStyle={{fontSize: "12px", paddingBottom: '10px'}}/>
                            <Bar yAxisId="left" dataKey="totalRegistered" fill="#8884d8" name="Tổng lượt đăng ký" />
                            <Bar yAxisId="right" dataKey="eventsHosted" fill="#82ca9d" name="Số sự kiện tổ chức" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
                {/* Bảng xếp hạng chi tiết */}
                <TableWrapper>
                    <StyledTable>
                        <Thead>
                            <tr>
                                <Th>Hạng</Th>
                                <Th>Khoa / Đơn vị</Th>
                                <Th className="center">Sự kiện tổ chức</Th>
                                <Th className="center">Tổng Đăng ký</Th>
                                <Th className="center">Tổng Sức chứa</Th>
                                <Th className="center">Tham gia TB (%)</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {statsData.facultyRanking.map((faculty, index) => (
                                <Tr key={faculty.name} highlight={index < 3}>
                                    <Td className="font-medium text-gray-900">{index + 1}</Td>
                                    <Td className="font-medium text-gray-900">{faculty.name}</Td>
                                    <Td className="text-gray-500 center">{faculty.eventsHosted}</Td>
                                    <Td className="text-gray-500 center">{faculty.totalRegistered.toLocaleString('vi-VN')}</Td>
                                    <Td className="text-gray-500 center">{faculty.totalCapacity.toLocaleString('vi-VN')}</Td>
                                    <Td className="text-gray-500 center">{faculty.avgParticipation.toFixed(1)}%</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </StyledTable>
                </TableWrapper>
            </Section>

            {/* 3. Section Phân bố loại sự kiện */}
            {statsData.eventTypeDistribution && statsData.eventTypeDistribution.length > 0 && (
                <Section>
                    <SectionTitle>Phân bố theo Thể loại sự kiện</SectionTitle>
                    <ChartContainer>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statsData.eventTypeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius="80%"
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {statsData.eventTypeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} sự kiện`, name]}/>
                                <Legend iconType="circle" wrapperStyle={{fontSize: "12px"}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Section>
            )}

        </PageWrapper>
    );
};

export default StatisticsPage;