import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { addDays } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Sale } from '../types';

interface SaleFormProps {
  onSaleComplete: () => void;
  editingSale?: Sale;
}

const SaleForm = ({ onSaleComplete, editingSale }: SaleFormProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    seller_name: '',
    customer_name: '',
    device_name: '',
    imei: '',
    sale_date: new Date().toISOString().split('T')[0],
    down_payment: '',
    total_amount: '',
  });

  useEffect(() => {
    if (editingSale) {
      setFormData({
        seller_name: editingSale.seller_name,
        customer_name: editingSale.customer_name,
        device_name: editingSale.device_name,
        imei: editingSale.imei,
        sale_date: editingSale.sale_date.split('T')[0],
        down_payment: editingSale.down_payment.toString(),
        total_amount: editingSale.total_amount.toString(),
      });
    }
  }, [editingSale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const remaining_amount = Number(formData.total_amount) - Number(formData.down_payment);
    const payment_due_date = addDays(new Date(formData.sale_date), 8).toISOString();

    const saleData = {
      ...formData,
      down_payment: Number(formData.down_payment),
      total_amount: Number(formData.total_amount),
      remaining_amount,
      payment_due_date,
      status: 'pending' as const,
    };

    let error;

    if (editingSale) {
      // Update existing sale
      const { error: updateError } = await supabase
        .from('sales')
        .update(saleData)
        .eq('id', editingSale.id);
      error = updateError;
    } else {
      // Insert new sale
      const { error: insertError } = await supabase
        .from('sales')
        .insert([saleData]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving sale:', error);
      return;
    }

    onSaleComplete();
    if (!editingSale) {
      navigate('/sales');
    }
  };

  const inputProps = {
    sx: {
      '& .MuiOutlinedInput-root': {
        bgcolor: 'background.paper',
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 2,
          },
        },
      },
    },
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mb: 3,
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          {editingSale ? 'Editar Venda' : 'Nova Venda'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Seção de Pessoas */}
            <Grid item xs={12}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 2,
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Informações Pessoais
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Nome do Vendedor"
                    name="seller_name"
                    value={formData.seller_name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                      ...inputProps,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Nome do Cliente"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                      ...inputProps,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Seção do Aparelho */}
            <Grid item xs={12}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 2,
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Informações do Aparelho
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Nome do Aparelho"
                    name="device_name"
                    value={formData.device_name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneAndroidIcon color="action" />
                        </InputAdornment>
                      ),
                      ...inputProps,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="IMEI"
                    name="imei"
                    value={formData.imei}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <QrCodeIcon color="action" />
                        </InputAdornment>
                      ),
                      ...inputProps,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Seção Financeira */}
            <Grid item xs={12}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 2,
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Informações Financeiras
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    type="date"
                    label="Data da Venda"
                    name="sale_date"
                    value={formData.sale_date}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon color="action" />
                        </InputAdornment>
                      ),
                      ...inputProps,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Valor da Entrada"
                    name="down_payment"
                    value={formData.down_payment}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon color="action" />
                        </InputAdornment>
                      ),
                      ...inputProps,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Valor Total"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon color="action" />
                        </InputAdornment>
                      ),
                      ...inputProps,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => editingSale ? onSaleComplete() : navigate(-1)}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    maxWidth: 200,
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    maxWidth: 200,
                  }}
                >
                  {editingSale ? 'Salvar Alterações' : 'Registrar Venda'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default SaleForm; 