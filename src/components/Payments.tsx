import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  Fade,
  LinearProgress,
  Avatar,
  Divider,
} from '@mui/material';
import { format, isSameDay, isBefore, startOfDay, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Sale } from '../types';

interface PaymentsProps {
  sales: Sale[];
  onMarkAsPaid: (saleId: number) => void;
}

interface PaymentGroup {
  date: Date;
  sales: Sale[];
  totalAmount: number;
}

type PaymentStatus = 'late' | 'today' | 'upcoming';

const Payments = ({ sales, onMarkAsPaid }: PaymentsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const paymentGroups = useMemo(() => {
    const today = startOfDay(new Date());
    const pendingSales = sales.filter(sale => sale.status === 'pending');
    
    // Group sales by payment_due_date
    const groups = pendingSales.reduce((acc: PaymentGroup[], sale) => {
      const dueDate = startOfDay(new Date(sale.payment_due_date));
      const existingGroup = acc.find(group => isSameDay(group.date, dueDate));

      if (existingGroup) {
        existingGroup.sales.push(sale);
        existingGroup.totalAmount += sale.remaining_amount;
      } else {
        acc.push({
          date: dueDate,
          sales: [sale],
          totalAmount: sale.remaining_amount,
        });
      }

      return acc;
    }, []);

    // Sort groups by date
    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sales]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPaymentStatus = (date: Date): PaymentStatus => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return 'late';
    if (isSameDay(date, today)) return 'today';
    return 'upcoming';
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'late':
        return theme.palette.error;
      case 'today':
        return theme.palette.warning;
      case 'upcoming':
        return theme.palette.primary;
    }
  };

  const getStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case 'late':
        return 'Atrasado';
      case 'today':
        return 'Hoje';
      case 'upcoming':
        return 'Em dia';
    }
  };

  const getDaysRemaining = (date: Date) => {
    const today = startOfDay(new Date());
    const days = differenceInDays(date, today);
    if (days < 0) return `${Math.abs(days)} dias atrasado`;
    if (days === 0) return 'Vence hoje';
    return `${days} dias restantes`;
  };

  const PaymentCard = ({ group }: { group: PaymentGroup }) => {
    const status = getStatusColor(getPaymentStatus(group.date));
    const statusLabel = getStatusLabel(getPaymentStatus(group.date));
    const daysRemaining = getDaysRemaining(group.date);

    return (
      <Fade in timeout={500}>
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'grey.200',
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              {/* Header */}
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: status.main, fontWeight: 600 }}
                    >
                      {format(group.date, "dd 'de' MMMM", { locale: ptBR })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {group.sales.length} pagamento{group.sales.length > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Chip
                    label={statusLabel}
                    size="small"
                    sx={{
                      bgcolor: status[100],
                      color: status.main,
                      fontWeight: 500,
                    }}
                  />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon sx={{ color: status.main, fontSize: '0.875rem' }} />
                  <Typography variant="caption" sx={{ color: status.main, fontWeight: 500 }}>
                    {daysRemaining}
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              {/* Total Amount */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: status[50],
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: `linear-gradient(45deg, ${status.light}, ${status.main})`,
                  }}
                />
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: status.main,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <AttachMoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color={status.main}>
                      Total a Receber
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ color: status.main, fontWeight: 600 }}
                    >
                      {formatCurrency(group.totalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Sales List */}
              <Stack spacing={2}>
                {group.sales.map((sale, index) => (
                  <Zoom in style={{ transitionDelay: `${index * 100}ms` }} key={sale.id}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.100',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          bgcolor: 'grey.100',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: theme.palette.primary[100],
                                  color: theme.palette.primary.main,
                                }}
                              >
                                <PersonIcon fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {sale.customer_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Cliente
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                          <Tooltip title="Marcar como pago">
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: theme.palette.success[100],
                                color: theme.palette.success.main,
                                '&:hover': {
                                  bgcolor: theme.palette.success[200],
                                },
                              }}
                              onClick={() => onMarkAsPaid(sale.id)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PhoneAndroidIcon color="action" fontSize="small" />
                              <Typography variant="caption" color="text.secondary">
                                {sale.device_name}
                              </Typography>
                            </Stack>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              color={status.main}
                              sx={{ fontWeight: 500 }}
                            >
                              {formatCurrency(sale.remaining_amount)}
                            </Typography>
                          </Box>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={(sale.down_payment / sale.total_amount) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              bgcolor: status.main,
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  </Zoom>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stack spacing={3}>
        <Box sx={{ px: { xs: 2, sm: 0 } }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Pagamentos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os pagamentos pendentes e mantenha o controle das suas vendas
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 0 } }}>
          <Grid container spacing={3}>
            {paymentGroups.map((group) => (
              <Grid item xs={12} md={6} lg={4} key={group.date.toISOString()}>
                <PaymentCard group={group} />
              </Grid>
            ))}

            {paymentGroups.length === 0 && (
              <Grid item xs={12}>
                <Fade in timeout={500}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'grey.300',
                    }}
                  >
                    <Stack spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: theme.palette.success[100],
                          color: theme.palette.success.main,
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" color="text.primary">
                          Tudo em Dia!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Não há pagamentos pendentes no momento
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Fade>
              </Grid>
            )}
          </Grid>
        </Box>
      </Stack>

      {/* Floating Action Button for Mobile */}
      {isMobile && paymentGroups.length > 0 && (
        <Zoom in>
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: theme.zIndex.fab,
            }}
          >
            <AttachMoneyIcon />
          </Fab>
        </Zoom>
      )}
    </Box>
  );
};

export default Payments; 