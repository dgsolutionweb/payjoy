import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  Card,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sale } from '../types';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface PaymentReminderProps {
  sales: Sale[];
  onClose?: () => void;
}

const PaymentReminder = ({ sales, onClose }: PaymentReminderProps) => {
  const [open, setOpen] = useState(true);
  const [todayPayments, setTodayPayments] = useState<Sale[]>([]);
  const [nextPayment, setNextPayment] = useState<Sale | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (sales.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      
      const todayPayments = sales.filter(
        (sale) => 
          sale.status === 'pending' &&
          sale.payment_due_date.split('T')[0] === today
      );

      const futurePayments = sales.filter(
        (sale) =>
          sale.status === 'pending' &&
          sale.payment_due_date.split('T')[0] > today
      ).sort((a, b) => 
        new Date(a.payment_due_date).getTime() - new Date(b.payment_due_date).getTime()
      );

      setTodayPayments(todayPayments);
      setNextPayment(futurePayments[0] || null);
    }
  }, [sales]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const PaymentCard = ({ sale, type }: { sale: Sale; type: 'today' | 'next' }) => {
    const isToday = type === 'today';
    const color = isToday ? 'error' : 'warning';

    return (
      <Card
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: theme.palette[color]['200'],
          borderRadius: 2,
          background: `linear-gradient(45deg, ${theme.palette[color]['100']}, ${theme.palette.background.paper})`,
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette[color].main,
                  width: 32,
                  height: 32,
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="subtitle2" color={`${color}.main`}>
                {isToday ? 'Vence Hoje' : 'Próximo Vencimento'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(sale.payment_due_date), "dd 'de' MMMM", { locale: ptBR })}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.main',
                width: 40,
                height: 40,
                boxShadow: 1,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Cliente
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {sale.customer_name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'background.paper',
                color: 'secondary.main',
                width: 40,
                height: 40,
                boxShadow: 1,
              }}
            >
              <PhoneAndroidIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Aparelho
              </Typography>
              <Typography variant="subtitle1">
                {sale.device_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                IMEI: {sale.imei}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'background.paper',
                color: 'success.main',
                width: 40,
                height: 40,
                boxShadow: 1,
              }}
            >
              <AttachMoneyIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Valor Pendente
              </Typography>
              <Typography 
                variant="h6" 
                color={`${color}.main`}
                sx={{ fontWeight: 600 }}
              >
                {formatCurrency(sale.remaining_amount)}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Card>
    );
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          margin: isMobile ? 0 : 2,
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: { xs: 2, sm: 3 },
          background: `linear-gradient(135deg, ${theme.palette.primary['100']}, ${theme.palette.background.paper})`,
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <NotificationsIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">
            Lembretes de Pagamento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {todayPayments.length > 0
              ? `${todayPayments.length} pagamento${todayPayments.length > 1 ? 's' : ''} para hoje`
              : 'Próximos vencimentos'}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          onClick={handleClose}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          {todayPayments.length > 0 && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'error.main',
                }}
              >
                <CalendarTodayIcon fontSize="small" />
                Pagamentos para Hoje
              </Typography>
              <Stack spacing={2}>
                {todayPayments.map((sale) => (
                  <PaymentCard key={sale.id} sale={sale} type="today" />
                ))}
              </Stack>
            </Box>
          )}

          {nextPayment && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'warning.main',
                }}
              >
                <CalendarTodayIcon fontSize="small" />
                Próximo Vencimento
              </Typography>
              <PaymentCard sale={nextPayment} type="next" />
            </Box>
          )}

          {!todayPayments.length && !nextPayment && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Não há pagamentos pendentes no momento
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          background: theme.palette.grey[50],
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleClose}
          sx={{
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentReminder; 