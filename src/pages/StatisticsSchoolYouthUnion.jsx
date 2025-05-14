import React, { useState, useEffect } from 'react';
import { getStatisticsData } from '../services/mockData';
import styled, { keyframes } from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Cell,
  LineChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

// Enhanced Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: ${props => props.theme.colors.base200};
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}20, ${props => props.theme.colors.secondary}20);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 3rem 0;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.baseContent}90;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.base100}80;
  padding: 0.75rem;
  border-radius: 1rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.a`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.baseContent};
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.base300};
    transform: translateY(-2px);
  }
`;

const FilterSection = styled.div`
  background-color: ${props => props.theme.colors.base100};
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
`;

const FilterTitle = styled.div`
  padding: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}10, ${props => props.theme.colors.secondary}10);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}20, ${props => props.theme.colors.secondary}20);
  }
`;

const FilterContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 250px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.baseContent};
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.base300};
  border-radius: 0.75rem;
  background-color: ${props => props.theme.colors.base100};
  min-width: 250px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  background-color: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.baseContent};
  border: 2px solid ${props => props.primary ? 'transparent' : props.theme.colors.base300};
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.base200};
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.base100}, ${props => props.theme.colors.base200});
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.75rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.baseContent};
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 2.25rem;
  font-weight: bold;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
`;

const StatDesc = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.baseContent}90;
  line-height: 1.5;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChartCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.base100}, ${props => props.theme.colors.base200});
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.75rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.25rem;
  color: ${props => props.theme.colors.baseContent};
`;

const ChartContainer = styled.div`
  height: 320px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const TableCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.base100}, ${props => props.theme.colors.base200});
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.75rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  animation: ${fadeIn} 0.5s ease-out;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1.25rem;
  background-color: ${props => props.theme.colors.base200};
  font-weight: 600;
  color: ${props => props.theme.colors.baseContent};
  border-bottom: 2px solid ${props => props.theme.colors.base300};
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.base200}50;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.base300}30;
    transform: scale(1.01);
  }
`;

const TableCell = styled.td`
  padding: 1.25rem;
  border-bottom: 1px solid ${props => props.theme.colors.base300};
  transition: all 0.3s ease;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.warning}, ${props => props.theme.colors.warning}80);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 2s infinite;
`;

const ProgressBar = styled.progress`
  width: 100%;
  height: 0.75rem;
  border-radius: 1rem;
  background-color: ${props => props.theme.colors.base200};
  border: none;
  
  &::-webkit-progress-bar {
    background-color: ${props => props.theme.colors.base200};
    border-radius: 1rem;
  }
  
  &::-webkit-progress-value {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    border-radius: 1rem;
    transition: width 0.3s ease;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.base100}, ${props => props.theme.colors.base200});
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: ${slideIn} 0.3s ease-out;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.baseContent};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatisticsSchoolYouthUnion = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStatisticsData();
        setStatistics(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to fetch statistics data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle time range change
  const handleTimeRangeChange = (e) => {
    setSelectedTimeRange(e.target.value);
    // TODO: Implement time range filtering
  };

  // Handle faculty selection
  const handleFacultySelection = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedFaculties(selected);
    // TODO: Implement faculty filtering
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setSelectedTimeRange('month');
    setSelectedFaculties([]);
    // TODO: Reset other filters
  };

  // Handle filter apply
  const handleFilterApply = () => {
    // TODO: Implement filter logic
    console.log('Applying filters:', {
      timeRange: selectedTimeRange,
      faculties: selectedFaculties
    });
  };

  if (loading) {
    return (
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div style={{ 
          backgroundColor: 'var(--error)', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.5rem', height: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </Container>
    );
  }

  // Kiểm tra dữ liệu trước khi render chart/table
  if (!statistics || !statistics.eventTypeDistribution || !statistics.facultyRanking) {
    return <div className="flex items-center justify-center min-h-screen text-error">Dữ liệu thống kê không hợp lệ hoặc đang tải!</div>;
  }

  // Prepare data for charts
  const eventStatusData = {
    labels: ['Đã tổ chức', 'Đang chờ phê duyệt', 'Bị từ chối'],
    datasets: [
      {
        data: [statistics.eventStatus?.completed || 0, statistics.eventStatus?.pending || 0, statistics.eventStatus?.rejected || 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)', // green
          'rgba(234, 179, 8, 0.7)',  // yellow
          'rgba(239, 68, 68, 0.7)',  // red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const eventTypeData = {
    labels: (statistics.eventTypeDistribution || []).map(t => t.name),
    datasets: [
      {
        data: (statistics.eventTypeDistribution || []).map(t => t.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Thống kê hoạt động Đoàn trường</HeaderTitle>
        <Subtitle>Tổng quan về các hoạt động và sự kiện toàn trường</Subtitle>
        <TabsContainer>
          <Tab active>Tổng quan</Tab>
          <Tab>Liên chi đoàn</Tab>
          <Tab>Sự kiện</Tab>
          <Tab>Báo cáo</Tab>
        </TabsContainer>
      </Header>

      <FilterSection>
        <FilterTitle>
          Bộ lọc thống kê
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </FilterTitle>
        <FilterContent>
          <FormControl>
            <Label>Thời gian</Label>
            <Select value={selectedTimeRange} onChange={handleTimeRangeChange}>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </Select>
          </FormControl>

          <FormControl>
            <Label>Chủ đề</Label>
            <Select>
              <option value="all">Tất cả</option>
              <option value="academic">Học thuật</option>
              <option value="sports">Thể thao</option>
              <option value="cultural">Văn nghệ</option>
            </Select>
          </FormControl>

          <FormControl>
            <Label>Liên chi đoàn</Label>
            <Select multiple value={selectedFaculties} onChange={handleFacultySelection}>
              {statistics.facultyRanking.map(faculty => (
                <option key={faculty.name} value={faculty.name}>{faculty.name}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <Label>Trạng thái</Label>
            <Select>
              <option value="all">Tất cả</option>
              <option value="completed">Đã tổ chức</option>
              <option value="pending">Chờ phê duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </Select>
          </FormControl>

          <ButtonGroup>
            <Button primary onClick={handleFilterApply}>Áp dụng</Button>
            <Button onClick={handleFilterReset}>Reset</Button>
          </ButtonGroup>
        </FilterContent>
      </FilterSection>

      <StatsGrid>
        <StatCard>
          <StatTitle>Tổng số sự kiện</StatTitle>
          <StatValue>{statistics.totalEvents}</StatValue>
          <StatDesc>
            {statistics.eventStatus?.completed || 0} đã tổ chức
            <br />
            {statistics.eventStatus?.pending || 0} chờ phê duyệt
            <br />
            {statistics.eventStatus?.rejected || 0} bị từ chối
          </StatDesc>
        </StatCard>

        <StatCard>
          <StatTitle>Tỷ lệ tham gia</StatTitle>
          <StatValue>{statistics.avgParticipation}%</StatValue>
          <StatDesc>
            <ProgressBar value={statistics.avgParticipation} max="100" />
          </StatDesc>
        </StatCard>

        <StatCard>
          <StatTitle>Đánh giá trung bình</StatTitle>
          <StatValue>{statistics.avgRating.toFixed(1)}</StatValue>
          <StatDesc>trên 5 sao</StatDesc>
        </StatCard>

        <StatCard>
          <StatTitle>Tỷ lệ thành công</StatTitle>
          <StatValue>{statistics.successRate}%</StatValue>
          <StatDesc>Sự kiện đạt ≥ 4 sao</StatDesc>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Phân bố trạng thái sự kiện</ChartTitle>
          <ChartContainer>
            <Pie data={eventStatusData} options={{ maintainAspectRatio: false }} />
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Phân bố theo chủ đề</ChartTitle>
          <ChartContainer>
            <Pie data={eventTypeData} options={{ maintainAspectRatio: false }} />
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>

      <TableCard>
        <ChartTitle>Xếp hạng Liên chi đoàn</ChartTitle>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <TableHeader>Xếp hạng</TableHeader>
                <TableHeader>Liên chi đoàn</TableHeader>
                <TableHeader>Điểm tổng hợp</TableHeader>
                <TableHeader>Số sự kiện</TableHeader>
                <TableHeader>Tỷ lệ tham gia</TableHeader>
                <TableHeader>Đánh giá</TableHeader>
                <TableHeader>Hành động</TableHeader>
              </tr>
            </thead>
            <tbody>
              {statistics.facultyRanking.map((faculty, index) => (
                <TableRow key={faculty.name} style={index < 3 ? { backgroundColor: 'var(--warning-bg)' } : {}}>
                  <TableCell>
                    {index < 3 ? (
                      <Badge>{index + 1}</Badge>
                    ) : (
                      index + 1
                    )}
                  </TableCell>
                  <TableCell>{faculty.name}</TableCell>
                  <TableCell>{faculty.totalScore.toFixed(1)}</TableCell>
                  <TableCell>{faculty.eventsHosted}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {faculty.avgParticipation}%
                      <ProgressBar value={faculty.avgParticipation} max="100" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[1,2,3,4,5].map((star) => (
                        <input 
                          key={star}
                          type="radio" 
                          checked={star <= Math.round(faculty.avgRating)} 
                          readOnly 
                          style={{ 
                            appearance: 'none',
                            width: '1rem',
                            height: '1rem',
                            background: star <= Math.round(faculty.avgRating) ? 'var(--warning)' : 'var(--base-300)',
                            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                          }}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button primary>Chi tiết</Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </TableCard>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <Button primary onClick={() => setShowExportModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Xuất báo cáo
        </Button>
      </div>

      {showExportModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Xuất báo cáo</ModalTitle>
            <FormControl>
              <Label>Định dạng</Label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <span>PDF</span>
                  <input type="radio" name="format" />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <span>Excel</span>
                  <input type="radio" name="format" />
                </label>
              </div>
            </FormControl>
            <FormControl style={{ marginTop: '1rem' }}>
              <Label>Nội dung</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <span>Tổng quan</span>
                  <input type="checkbox" />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <span>Xếp hạng</span>
                  <input type="checkbox" />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <span>Chi tiết Liên chi đoàn</span>
                  <input type="checkbox" />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <span>Biểu đồ</span>
                  <input type="checkbox" />
                </label>
              </div>
            </FormControl>
            <ModalActions>
              <Button primary>Xuất</Button>
              <Button onClick={() => setShowExportModal(false)}>Hủy</Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default StatisticsSchoolYouthUnion; 