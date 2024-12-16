import { useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { format, startOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Sale, SalesSummary } from '../types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface DashboardProps {
  sales: Sale[];
  summary: SalesSummary;
}

const Dashboard = ({ sales, summary }: DashboardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Prepare data for charts
  const chartData = useMemo(() => {
    // Get last 30 days of data
    const last30Days = eachDayOfInterval({
      start: startOfMonth(new Date()),
      end: new Date(),
    });

    const dailySales = last30Days.map(date => {
      const daySales = sales.filter(sale => 
        isSameDay(new Date(sale.sale_date), date)
      );

      return {
        date: format(date, 'dd/MM'),
        total: daySales.reduce((sum, sale) => sum + sale.total_amount, 0),
        quantity: daySales.length,
      };
    });

    // Status distribution for pie chart
    const statusData = [
      {
        name: 'Pagos',
        value: sales.filter(sale => sale.status === 'paid').length,
      },
      {
        name: 'Pendentes',
        value: sales.filter(sale => sale.status === 'pending').length,
      },
    ];

    // Top selling devices
    const deviceSales = sales.reduce((acc, sale) => {
      acc[sale.device_name] = (acc[sale.device_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topDevices = Object.entries(deviceSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Top sellers
    const sellerSales = sales.reduce((acc, sale) => {
      acc[sale.seller_name] = (acc[sale.seller_name] || 0) + sale.total_amount;
      return acc;
    }, {} as Record<string, number>);

    const topSellers = Object.entries(sellerSales)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      dailySales,
      statusData,
      topDevices,
      topSellers,
    };
  }, [sales]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            bgcolor: `${color}.100`,
            color: `${color}.main`,
            p: 1,
            borderRadius: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total em Vendas"
            value={formatCurrency(summary.total_sales)}
            icon={<AttachMoneyIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aparelhos Vendidos"
            value={summary.devices_sold}
            icon={<PhoneAndroidIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Recebido"
            value={formatCurrency(summary.total_received)}
            icon={<TrendingUpIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Pendente"
            value={formatCurrency(summary.total_pending)}
            icon={<AccountBalanceWalletIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Sales Trend */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tendência de Vendas
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData.dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    interval={isMobile ? 2 : 1}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Valor Total"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} sm={6} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Status das Vendas
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.statusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? theme.palette.success.main : theme.palette.warning.main}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Devices */}
        <Grid item xs={12} sm={6} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Aparelhos Mais Vendidos
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData.topDevices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="quantity"
                    name="Quantidade"
                    fill={theme.palette.primary.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Sellers */}
        <Grid item xs={12} sm={6} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Ranking de Vendedores
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData.topSellers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    name="Total em Vendas"
                    fill={theme.palette.secondary.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 