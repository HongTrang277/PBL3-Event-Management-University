// src/pages/StatisticsPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStatisticsData } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Styled Components ---
const PageContainer = styled.div`
  padding: 24px;
  background-color: #f5f6fa;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatTitle = styled.h3`
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
`;

const StatSubValue = styled.div`
  font-size: 14px;
  color: #95a5a6;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-height: 400px;
`;

const ChartTitle = styled.h3`
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 16px;
`;

const RankingTable = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  color: #2c3e50;
  white-space: nowrap;
`;

const RankCell = styled(Td)`
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  width: 60px;
`;

const FacultyCell = styled(Td)`
  font-weight: 500;
  min-width: 200px;
`;

const ScoreCell = styled(Td)`
  text-align: right;
  font-weight: 500;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.color || '#e9ecef'};
  color: ${props => props.textColor || '#2c3e50'};
  margin-left: 8px;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const StatisticsPage = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getStatisticsData();
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDuration = (hours) => {
        if (hours < 1) return `${Math.round(hours * 60)} phút`;
        return `${Math.round(hours)} giờ`;
    };

    const calculateScore = (faculty) => {
        const registrationScore = faculty.totalRegistered * 0.4;
        const attendanceScore = faculty.totalAttendance * 0.3;
        const eventScore = faculty.eventsHosted * 50;
        const participationScore = faculty.avgParticipation * 0.15;
        const attendanceRateScore = faculty.avgAttendance * 0.15;

        return Math.round(registrationScore + attendanceScore + eventScore + participationScore + attendanceRateScore);
    };

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1:
                return { color: '#FFD700', textColor: '#000000', text: '🥇' };
            case 2:
                return { color: '#C0C0C0', textColor: '#000000', text: '🥈' };
            case 3:
                return { color: '#CD7F32', textColor: '#FFFFFF', text: '🥉' };
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <Header>
                    <Title>Bảng Thống Kê Sự Kiện</Title>
                    <Subtitle>Đang tải dữ liệu thống kê...</Subtitle>
                </Header>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Đang tải...
                </div>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Header>
                    <Title>Bảng Thống Kê Sự Kiện</Title>
                    <Subtitle>Lỗi khi tải dữ liệu</Subtitle>
                </Header>
                <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                    {error}
                </div>
            </PageContainer>
        );
    }

    if (!statistics) {
        return (
            <PageContainer>
                <Header>
                    <Title>Bảng Thống Kê Sự Kiện</Title>
                    <Subtitle>Không có dữ liệu thống kê</Subtitle>
                </Header>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Hiện không có dữ liệu thống kê.
                </div>
            </PageContainer>
        );
    }

    const sortedFaculties = [...statistics.facultyRanking]
        .map(faculty => ({
            ...faculty,
            score: calculateScore(faculty)
        }))
        .sort((a, b) => b.score - a.score)
        .map((faculty, index) => ({
            ...faculty,
            rank: index + 1
        }));

    return (
        <PageContainer>
            <Header>
                <Title>Bảng Thống Kê Sự Kiện</Title>
                <Subtitle>Tổng quan về hiệu suất và sự tham gia của các sự kiện</Subtitle>
            </Header>

            <StatsGrid>
                <StatCard>
                    <StatTitle>Tổng Số Sự Kiện</StatTitle>
                    <StatValue>{statistics.summary.totalEvents}</StatValue>
                    <StatSubValue>Sự kiện đang hoạt động</StatSubValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Tổng Số Đăng Ký</StatTitle>
                    <StatValue>{statistics.summary.totalRegistrations.toLocaleString()}</StatValue>
                    <StatSubValue>Trên tất cả sự kiện</StatSubValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Tổng Số Tham Gia</StatTitle>
                    <StatValue>{statistics.summary.totalAttendance.toLocaleString()}</StatValue>
                    <StatSubValue>Người tham gia thực tế</StatSubValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Tỷ Lệ Đăng Ký Trung Bình</StatTitle>
                    <StatValue>{statistics.summary.overallAvgParticipation.toFixed(1)}%</StatValue>
                    <StatSubValue>Tỷ lệ đăng ký</StatSubValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Tỷ Lệ Tham Gia Trung Bình</StatTitle>
                    <StatValue>{statistics.summary.overallAvgAttendance.toFixed(1)}%</StatValue>
                    <StatSubValue>Của người đăng ký</StatSubValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Thời Gian Duyệt Trung Bình</StatTitle>
                    <StatValue>{formatDuration(statistics.summary.avgApprovalTime)}</StatValue>
                    <StatSubValue>Thời gian duyệt sự kiện</StatSubValue>
                </StatCard>
                <StatCard>
                    <StatTitle>Thời Lượng Trung Bình</StatTitle>
                    <StatValue>{formatDuration(statistics.summary.avgEventDuration)}</StatValue>
                    <StatSubValue>Mỗi sự kiện</StatSubValue>
                </StatCard>
            </StatsGrid>

            <RankingTable>
                <ChartTitle>Bảng Xếp Hạng Liên Chi Đoàn</ChartTitle>
                <Table>
                    <thead>
                        <tr>
                            <Th>Xếp hạng</Th>
                            <Th>Liên Chi Đoàn</Th>
                            <Th>Số sự kiện</Th>
                            <Th>Đăng ký</Th>
                            <Th>Tham gia</Th>
                            <Th>Tỷ lệ đăng ký</Th>
                            <Th>Tỷ lệ tham gia</Th>
                            <Th>Điểm</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFaculties.map((faculty) => {
                            const badge = getRankBadge(faculty.rank);
                            return (
                                <tr key={faculty.name}>
                                    <RankCell>
                                        {faculty.rank}
                                        {badge && <Badge color={badge.color} textColor={badge.textColor}>{badge.text}</Badge>}
                                    </RankCell>
                                    <FacultyCell>{faculty.name}</FacultyCell>
                                    <Td>{faculty.eventsHosted}</Td>
                                    <Td>{faculty.totalRegistered.toLocaleString()}</Td>
                                    <Td>{faculty.totalAttendance.toLocaleString()}</Td>
                                    <Td>{faculty.avgParticipation.toFixed(1)}%</Td>
                                    <Td>{faculty.avgAttendance.toFixed(1)}%</Td>
                                    <ScoreCell>{faculty.score.toLocaleString()}</ScoreCell>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </RankingTable>

            <ChartsContainer>
                <ChartCard>
                    <ChartTitle>Thống Kê Sự Kiện Theo Tháng</ChartTitle>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={statistics.monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="eventCount" name="Số sự kiện" fill="#8884d8" />
                            <Bar dataKey="registrationCount" name="Số đăng ký" fill="#82ca9d" />
                            <Bar dataKey="attendanceCount" name="Số tham gia" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard>
                    <ChartTitle>Hiệu Suất Liên Chi Đoàn</ChartTitle>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={statistics.facultyRanking}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalRegistered" name="Số đăng ký" fill="#8884d8" />
                            <Bar dataKey="totalAttendance" name="Số tham gia" fill="#82ca9d" />
                            <Bar dataKey="eventsHosted" name="Số sự kiện" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard>
                    <ChartTitle>Phân Bố Loại Sự Kiện</ChartTitle>
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={statistics.eventTypeDistribution}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {statistics.eventTypeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard>
                    <ChartTitle>Hiệu Suất Theo Loại Sự Kiện</ChartTitle>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={statistics.eventTypeDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="registrations" name="Số đăng ký" fill="#8884d8" />
                            <Bar dataKey="attendance" name="Số tham gia" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </ChartsContainer>
        </PageContainer>
    );
};

export default StatisticsPage;