import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { format, isWithinInterval, startOfDay, endOfDay, subDays } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Sale } from '../types';
import { supabase } from '../lib/supabaseClient';
import SalesFilter, { FilterOptions } from './SalesFilter';
import SaleForm from './SaleForm';

interface SalesListProps {
  sales: Sale[];
  onUpdate: () => void;
}

const SalesList = ({ sales: initialSales, onUpdate }: SalesListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filteredSales, setFilteredSales] = useState<Sale[]>(initialSales);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: 'all',
    status: 'all',
    sortBy: 'sale_date',
    sortOrder: 'desc',
  });
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [deleteConfirmSale, setDeleteConfirmSale] = useState<Sale | null>(null);

  useEffect(() => {
    applyFilters(initialSales, filters);
  }, [initialSales, filters]);

  const applyFilters = (sales: Sale[], filters: FilterOptions) => {
    let result = [...sales];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (sale) =>
          sale.customer_name.toLowerCase().includes(searchLower) ||
          sale.seller_name.toLowerCase().includes(searchLower) ||
          sale.imei.toLowerCase().includes(searchLower) ||
          sale.device_name.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = startOfDay(today);
          break;
        case 'week':
          startDate = subDays(today, 7);
          break;
        case 'month':
          startDate = subDays(today, 30);
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }

      result = result.filter((sale) =>
        isWithinInterval(new Date(sale.sale_date), {
          start: startDate,
          end: endOfDay(today),
        })
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((sale) => sale.status === filters.status);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'sale_date':
          comparison = new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime();
          break;
        case 'total_amount':
          comparison = b.total_amount - a.total_amount;
          break;
        case 'customer_name':
          comparison = a.customer_name.localeCompare(b.customer_name);
          break;
        case 'seller_name':
          comparison = a.seller_name.localeCompare(b.seller_name);
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredSales(result);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleMarkAsPaid = async (saleId: number) => {
    const { error } = await supabase
      .from('sales')
      .update({ status: 'paid', remaining_amount: 0 })
      .eq('id', saleId);

    if (!error) {
      onUpdate();
    }
  };

  const handleEditClick = (sale: Sale) => {
    setEditingSale(sale);
  };

  const handleEditClose = () => {
    setEditingSale(null);
  };

  const handleEditComplete = () => {
    setEditingSale(null);
    onUpdate();
  };

  const handleDeleteClick = (sale: Sale) => {
    setDeleteConfirmSale(sale);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmSale) {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', deleteConfirmSale.id);

      if (!error) {
        onUpdate();
        setDeleteConfirmSale(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmSale(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box>
      <SalesFilter onFilterChange={handleFilterChange} />
      
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              {!isMobile && <TableCell>Vendedor</TableCell>}
              {!isMobile && <TableCell>Aparelho</TableCell>}
              <TableCell align="right">Valor Total</TableCell>
              <TableCell align="right">Restante</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {format(new Date(sale.sale_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{sale.customer_name}</TableCell>
                {!isMobile && <TableCell>{sale.seller_name}</TableCell>}
                {!isMobile && (
                  <TableCell>
                    <Typography variant="body2" color="text.primary">
                      {sale.device_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      IMEI: {sale.imei}
                    </Typography>
                  </TableCell>
                )}
                <TableCell align="right">
                  {formatCurrency(sale.total_amount)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(sale.remaining_amount)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={sale.status === 'pending' ? 'Pendente' : 'Pago'}
                    color={sale.status === 'pending' ? 'warning' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {sale.status === 'pending' && (
                      <Tooltip title="Marcar como pago">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => handleMarkAsPaid(sale.id)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Editar venda">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(sale)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir venda">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(sale)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredSales.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma venda encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Sale Dialog */}
      <Dialog 
        open={!!editingSale} 
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Editar Venda</DialogTitle>
        <DialogContent>
          {editingSale && (
            <Box sx={{ pt: 2 }}>
              <SaleForm
                onSaleComplete={handleEditComplete}
                editingSale={editingSale}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmSale}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a venda para o cliente{' '}
            <strong>{deleteConfirmSale?.customer_name}</strong>?
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesList; 