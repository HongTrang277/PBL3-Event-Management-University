import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaChartBar, FaCheckCircle, FaTimesCircle, FaUserCheck, FaStar, FaTrophy, FaFileExport, FaLightbulb } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { getMockFacultyUnionStatistics } from '../services/mockStatisticsFacultyUnion';

const COLORS = ['#4F8EF7', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background: #f7fafc;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #003652;
  font-family: 'DM Sans', sans-serif;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #fff;
  font-size: 1rem;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #003652;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #005b96; }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

const CardTitle = styled.div`
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #003652;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.25rem;
  min-height: 320px;
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.25rem;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 0.75rem 0.5rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  th {
    background: #f1f5f9;
    font-weight: 600;
    color: #003652;
  }
  tr:hover {
    background: #f3f4f6;
  }
`;

const ComparisonSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const RankingTableWrapper = styled.div`
  flex: 1;
  min-width: 320px;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.25rem;
`;

const SuggestionBox = styled.div`
  flex: 1;
  min-width: 320px;
  background: #fef9c3;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SuggestionTitle = styled.div`
  font-weight: 700;
  color: #b45309;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export default function StatisticsFacultyYouthUnion() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ time: 'Năm nay', topic: 'Tất cả', status: 'Tất cả' });

  useEffect(() => {
    setLoading(true);
    getMockFacultyUnionStatistics().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <MainContent>Đang tải thống kê...</MainContent>;

  const { summary, topicDistribution, statusDistribution, eventList, rankingTable, suggestions, filters: filterOptions } = data;

  // Lọc eventList theo filter (mock, thực tế sẽ filter sâu hơn)
  const filteredEvents = eventList.filter(evt =>
    (filters.topic === 'Tất cả' || evt.topic === filters.topic) &&
    (filters.status === 'Tất cả' || evt.status === filters.status)
  );

  return (
    <MainContent>
      <Header>
        <Title>Thống kê Liên Chi đoàn</Title>
        <FilterRow>
          <Select value={filters.time} onChange={e => setFilters(f => ({ ...f, time: e.target.value }))}>
            {filterOptions.time.map(opt => <option key={opt}>{opt}</option>)}
          </Select>
          <Select value={filters.topic} onChange={e => setFilters(f => ({ ...f, topic: e.target.value }))}>
            {filterOptions.topic.map(opt => <option key={opt}>{opt}</option>)}
          </Select>
          <Select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            {filterOptions.status.map(opt => <option key={opt}>{opt}</option>)}
          </Select>
          <ExportButton><FaFileExport /> Xuất PDF</ExportButton>
          <ExportButton><FaFileExport /> Xuất Excel</ExportButton>
        </FilterRow>
      </Header>
      <SummaryGrid>
        <SummaryCard><CardTitle><FaChartBar /> Tổng sự kiện</CardTitle><CardValue>{summary.totalEvents}</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaCheckCircle color="#22c55e" /> Đã tổ chức</CardTitle><CardValue>{summary.organized}</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaUserCheck color="#0ea5e9" /> Đăng ký</CardTitle><CardValue>{summary.totalRegistered}</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaUserCheck color="#6366f1" /> Tham gia</CardTitle><CardValue>{summary.totalParticipated}</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaStar color="#fbbf24" /> Đánh giá TB</CardTitle><CardValue>{summary.avgRating}</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaCheckCircle color="#16a34a" /> Tỷ lệ thành công</CardTitle><CardValue>{summary.successRate}%</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaCheckCircle color="#f59e42" /> Tỷ lệ phê duyệt lần đầu</CardTitle><CardValue>{summary.firstApprovalRate}%</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaChartBar color="#f472b6" /> Phản hồi tích cực</CardTitle><CardValue>{summary.positiveFeedback}%</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaTrophy color="#facc15" /> Điểm xếp hạng</CardTitle><CardValue>{summary.rankingScore}</CardValue></SummaryCard>
        <SummaryCard><CardTitle><FaTrophy color="#facc15" /> Vị trí xếp hạng</CardTitle><CardValue>{summary.rankingPosition}/{summary.totalFaculties}</CardValue></SummaryCard>
      </SummaryGrid>
      <ChartsSection>
        <ChartCard>
          <h3>Phân bố sự kiện theo chủ đề</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={topicDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {topicDistribution.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard>
          <h3>Trạng thái sự kiện</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4F8EF7" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsSection>
      <TableWrapper>
        <h3>Chi tiết sự kiện</h3>
        <StyledTable>
          <thead>
            <tr>
              <th>Tên sự kiện</th>
              <th>Ngày</th>
              <th>Chủ đề</th>
              <th>Trạng thái</th>
              <th>Đăng ký</th>
              <th>Tham gia</th>
              <th>Tỷ lệ tham gia</th>
              <th>Đánh giá TB</th>
              <th>Phản hồi tích cực</th>
              <th>Phê duyệt lần đầu</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(evt => (
              <tr key={evt.id}>
                <td>{evt.name}</td>
                <td>{evt.date}</td>
                <td>{evt.topic}</td>
                <td>{evt.status}</td>
                <td>{evt.registered}</td>
                <td>{evt.participated}</td>
                <td>{evt.participationRate ? evt.participationRate + '%' : '-'}</td>
                <td>{evt.avgRating ? evt.avgRating : '-'}</td>
                <td>{evt.positiveFeedback ? evt.positiveFeedback + '%' : '-'}</td>
                <td>{evt.firstApproval === true ? '✔️' : evt.firstApproval === false ? '❌' : '-'}</td>
                <td><a href="#" style={{color:'#2563eb', fontWeight:600}}>Xem</a></td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
      <ComparisonSection>
        <RankingTableWrapper>
          <h3>Bảng xếp hạng Liên Chi đoàn</h3>
          <StyledTable>
            <thead>
              <tr>
                <th>STT</th>
                <th>Liên Chi đoàn</th>
                <th>Điểm</th>
                <th>Vị trí</th>
              </tr>
            </thead>
            <tbody>
              {rankingTable.map((row, idx) => (
                <tr key={row.faculty} style={row.position === summary.rankingPosition ? {background:'#e0f2fe', fontWeight:700} : {}}>
                  <td>{row.position}</td>
                  <td>{row.faculty}</td>
                  <td>{row.score}</td>
                  <td>{row.position}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </RankingTableWrapper>
        <SuggestionBox>
          <SuggestionTitle><FaLightbulb color="#facc15" /> Gợi ý cải thiện</SuggestionTitle>
          <ul style={{margin:0, paddingLeft:'1.2em'}}>
            {suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </SuggestionBox>
      </ComparisonSection>
    </MainContent>
  );
} 