import { eventService, facultyService, registrationService, CategoryService} from '../services/api';
// src/pages/StatisticsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import _ from 'lodash';


// --- Animation Keyframes ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- Styled Components (Cải tiến với animation và giao diện hiện đại hơn) ---

const PageWrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 800;
  font-family: 'DM Sans', sans-serif;
  color: #111827; /* text-gray-900 */
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 2.25rem; /* text-4xl */
  }
`;

const Section = styled.section`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
  border: 1px solid #f3f4f6;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem; /* text-2xl */
  line-height: 1.75rem;
  font-weight: 700;
  color: #1f2937; /* text-gray-800 */
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 1.5rem;
  margin-top: 0;
  border-bottom: 2px solid #3b82f6; /* primary-color */
  padding-bottom: 0.5rem;
  display: inline-block;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${(props) => props.color || '#3b82f6'};
    opacity: 0.8;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    &:before {
      opacity: 1;
      height: 6px;
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563; /* text-gray-600 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
`;

const CardValue = styled.p`
  margin-top: 0.5rem;
  font-size: 2.25rem; /* text-4xl */
  font-weight: 800;
  color: #111827; /* text-gray-900 */
  margin-bottom: 0;
  line-height: 1;
`;

const ChartContainer = styled.div`
  height: 22rem; /* h-88 */
  margin-top: 2rem;
  @media (min-width: 768px) {
    height: 26rem; /* md:h-104 */
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 2rem;
`;

const StyledTable = styled.table`
  min-width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
`;

const Thead = styled.thead`
  background-color: #f9fafb;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease-in-out;

  ${(props) =>
    props.highlight &&
    `
    background-color: #eff6ff;
    font-weight: 600;
  `}

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Th = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.center { text-align: center; }
  &.right { text-align: right; }
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;

  &.rank {
    font-weight: 700;
    color: #1d4ed8;
  }
  &.faculty-name {
    font-weight: 600;
    color: #1f2937;
  }
  &.center { text-align: center; }
  &.right { text-align: right; }
`;

const StatusContainer = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #4b5563;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  margin-top: 2rem;
`;

// --- Recharts Config ---
const PIE_COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#6366f1'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 3) return null; // Ẩn label quá nhỏ

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// --- Component ---

const StatisticsPage = () => {
    const [statsData, setStatsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Đang khởi tạo thống kê...');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataAndProcess = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // 1. Fetch all required data in parallel
                setLoadingMessage('Đang tải dữ liệu sự kiện, khoa, và đăng ký...');
                const [events, faculties, registrations, categories] = await Promise.all([
                    eventService.getAllEvents(),
                    facultyService.getAllFaculties(),
                    registrationService.getAllRegistrations(),
                    CategoryService.getAllCategories(),
                ]);

                // Validate data
                if (!Array.isArray(events) || !Array.isArray(faculties) || !Array.isArray(registrations) || !Array.isArray(categories)) {
                    throw new Error("Dữ liệu trả về từ API không hợp lệ.");
                }

                setLoadingMessage('Đang xử lý và tổng hợp dữ liệu...');

                // 2. Process data
                // Summary Stats
                const totalEvents = events.length;
                const totalRegistrations = registrations.length;
                const totalCapacity = _.sumBy(events, e => e.capacity || 0);
                const overallAvgParticipation = totalCapacity > 0 ? (totalRegistrations / totalCapacity) * 100 : 0;

                const summary = {
                    totalEvents,
                    totalRegistrations,
                    overallAvgParticipation,
                };

                // Event Type Distribution
                const eventTypeDistribution = _.chain(events)
                    .flatMap(event => event.tagsList || event.tags || [])
                    .countBy()
                    .map((value, name) => ({ name, value }))
                    .sortBy('value')
                    .reverse()
                    .value();

                // Faculty Ranking
                const facultyStats = {};
                faculties.forEach(f => {
                    facultyStats[f.facultyId] = {
                        name: f.facultyName,
                        eventsHosted: 0,
                        totalRegistered: 0,
                        totalCapacity: 0,
                    };
                });
                
                events.forEach(event => {
                    const hostId = event.hostId;
                    if (facultyStats[hostId]) {
                        facultyStats[hostId].eventsHosted += 1;
                        facultyStats[hostId].totalCapacity += (event.capacity || 0);
                    }
                });

                registrations.forEach(reg => {
                    const event = events.find(e => e.eventId === reg.eventId);
                    if (event && facultyStats[event.hostId]) {
                        facultyStats[event.hostId].totalRegistered += 1;
                    }
                });

                const facultyRanking = _.chain(facultyStats)
                    .map((stats, facultyId) => ({
                        ...stats,
                        facultyId,
                        avgParticipation: stats.totalCapacity > 0 ? (stats.totalRegistered / stats.totalCapacity) * 100 : 0,
                    }))
                    .orderBy(['totalRegistered', 'eventsHosted'], ['desc', 'desc'])
                    .value();


                setStatsData({
                    summary,
                    eventTypeDistribution,
                    facultyRanking,
                });

            } catch (err) {
                console.error("Error processing statistics data:", err);
                setError(err.message || 'Không thể tải và xử lý dữ liệu thống kê.');
            } finally {
                setIsLoading(false);
                setLoadingMessage('');
            }
        };

        fetchDataAndProcess();
    }, []);

    const topFacultiesData = useMemo(() => {
        if (!statsData) return [];
        return statsData.facultyRanking.slice(0, 10);
    }, [statsData]);

    if (isLoading) {
        return <StatusContainer>{loadingMessage}</StatusContainer>;
    }

    if (error) {
        return <StatusContainer style={{ color: '#dc2626' }}>Lỗi: {error}</StatusContainer>;
    }

    if (!statsData) {
        return <StatusContainer>Không có dữ liệu thống kê để hiển thị.</StatusContainer>;
    }

    return (
        <PageWrapper>
            <Title>Thống kê & Thi đua Liên chi đoàn</Title>

            {/* 1. Section Tổng quan */}
            <StatsGrid>
                <StatCard color="#3b82f6">
                    <CardTitle>Tổng số sự kiện</CardTitle>
                    <CardValue>{statsData.summary.totalEvents}</CardValue>
                </StatCard>
                <StatCard color="#10b981">
                    <CardTitle>Tổng lượt đăng ký</CardTitle>
                    <CardValue>{statsData.summary.totalRegistrations.toLocaleString('vi-VN')}</CardValue>
                </StatCard>
                <StatCard color="#f97316">
                    <CardTitle>Tỷ lệ tham gia trung bình</CardTitle>
                    <CardValue>{statsData.summary.overallAvgParticipation.toFixed(1)}%</CardValue>
                </StatCard>
            </StatsGrid>

            {/* 2. Section Thi đua Liên chi đoàn */}
            <Section>
                <SectionTitle>Thi đua Liên chi đoàn (Top 10)</SectionTitle>
                <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topFacultiesData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                tick={{ fontSize: 11, fill: '#4b5563' }}
                                height={80}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#3b82f6"
                                tick={{ fontSize: 11 }}
                                label={{ value: 'Lượt đăng ký', angle: -90, position: 'insideLeft', fill: '#3b82f6', dx: -15 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#10b981"
                                tick={{ fontSize: 11 }}
                                label={{ value: 'Số sự kiện', angle: -90, position: 'insideRight', fill: '#10b981', dx: 15 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                formatter={(value, name, props) => [`${value.toLocaleString ? value.toLocaleString('vi-VN') : value}`, name]}
                            />
                            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                            <Bar yAxisId="left" dataKey="totalRegistered" fill="#3b82f6" name="Tổng Lượt Đăng ký" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="eventsHosted" fill="#10b981" name="Số Sự kiện Tổ chức" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                <TableWrapper>
                    <StyledTable>
                        <Thead>
                            <tr>
                                <Th className="center">Hạng</Th>
                                <Th>Khoa / Đơn vị</Th>
                                <Th className="right">Sự kiện tổ chức</Th>
                                <Th className="right">Tổng Đăng ký</Th>
                                <Th className="right">Tổng Sức chứa</Th>
                                <Th className="right">Tham gia TB (%)</Th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {statsData.facultyRanking.map((faculty, index) => (
                                <Tr key={faculty.facultyId} highlight={index < 3}>
                                    <Td className="center rank">#{index + 1}</Td>
                                    <Td className="faculty-name">{faculty.name}</Td>
                                    <Td className="right">{faculty.eventsHosted.toLocaleString('vi-VN')}</Td>
                                    <Td className="right">{faculty.totalRegistered.toLocaleString('vi-VN')}</Td>
                                    <Td className="right">{faculty.totalCapacity.toLocaleString('vi-VN')}</Td>
                                    <Td className="right">{faculty.avgParticipation.toFixed(1)}%</Td>
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
                                    outerRadius="85%"
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {statsData.eventTypeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} sự kiện`, name]} />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Section>
            )}
        </PageWrapper>
    );
};

export default StatisticsPage;