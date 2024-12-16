import { useEffect, useState, useCallback, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { Sale, SalesSummary } from './types';
import {
  Header,
  SaleForm,
  SalesList,
  Dashboard,
  PWAPrompt,
  Payments,
} from './components';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      '50': '#eff6ff',
      '100': '#dbeafe',
      '200': '#bfdbfe',
    },
    secondary: {
      main: '#db2777',
      light: '#ec4899',
      dark: '#be185d',
      '50': '#fdf2f8',
      '100': '#fce7f3',
      '200': '#fbcfe8',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
      '50': '#ecfdf5',
      '100': '#d1fae5',
      '200': '#a7f3d0',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      '50': '#fef2f2',
      '100': '#fee2e2',
      '200': '#fecaca',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1e293b',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1e293b',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1e293b',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1e293b',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1e293b',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1e293b',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#475569',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#475569',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#1e293b',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#475569',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#dbeafe',
            color: '#2563eb',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: '#fce7f3',
            color: '#db2777',
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: '#d1fae5',
            color: '#059669',
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: '#fef3c7',
            color: '#d97706',
          },
          '&.MuiChip-colorError': {
            backgroundColor: '#fee2e2',
            color: '#dc2626',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc',
          color: '#475569',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
  },
});

function AppContent() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<SalesSummary>({
    total_sales: 0,
    devices_sold: 0,
    total_received: 0,
    total_pending: 0,
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('sale_date', { ascending: false });

    if (error) {
      console.error('Error fetching sales:', error);
      return;
    }

    if (data) {
      setSales(data);
      calculateSummary(data);
    }
  };

  const handleMarkAsPaid = useCallback(async (saleId: number) => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({ 
          status: 'paid', 
          remaining_amount: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', saleId);

      if (error) {
        console.error('Error marking sale as paid:', error);
        return;
      }

      // Refresh sales data after successful update
      await fetchSales();
    } catch (error) {
      console.error('Error in handleMarkAsPaid:', error);
    }
  }, []);

  const calculateSummary = useCallback((salesData: Sale[]) => {
    const summary = salesData.reduce(
      (acc, sale) => {
        acc.total_sales += sale.total_amount;
        acc.devices_sold += 1;
        acc.total_received += sale.down_payment;
        acc.total_pending += sale.status === 'pending' ? sale.remaining_amount : 0;
        return acc;
      },
      { total_sales: 0, devices_sold: 0, total_received: 0, total_pending: 0 }
    );
    setSummary(summary);
  }, []);

  const pendingSales = useMemo(() => sales.filter(sale => sale.status === 'pending'), [sales]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100vw',
      maxWidth: '100%',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
      <Header pendingSales={pendingSales} />
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          width: '100%',
          maxWidth: '100%',
          height: '100%',
          overflow: 'auto',
          px: { xs: 0, sm: 2, md: 3 },
          py: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard sales={sales} summary={summary} />} />
          <Route
            path="/sales/new"
            element={<SaleForm onSaleComplete={fetchSales} />}
          />
          <Route
            path="/sales"
            element={<SalesList sales={sales} onUpdate={fetchSales} />}
          />
          <Route
            path="/payments"
            element={<Payments sales={sales} onMarkAsPaid={handleMarkAsPaid} />}
          />
        </Routes>
      </Box>
      <PWAPrompt />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/payjoy">
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
