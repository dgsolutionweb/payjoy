import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';

export interface FilterOptions {
  search: string;
  dateRange: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SalesFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const SalesFilter = ({ onFilterChange }: SalesFilterProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: 'all',
    status: 'all',
    sortBy: 'sale_date',
    sortOrder: 'desc',
  });

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearSearch = () => {
    handleFilterChange('search', '');
  };

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case 'today':
        return 'Hoje';
      case 'week':
        return 'Última Semana';
      case 'month':
        return 'Último Mês';
      default:
        return 'Todo Período';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'paid':
        return 'Pago';
      default:
        return 'Todos';
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2, sm: 3 },
        mb: 3,
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            placeholder="Buscar por cliente, vendedor, IMEI..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Período</InputLabel>
            <Select
              value={filters.dateRange}
              label="Período"
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon color="action" sx={{ ml: 1 }} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Todo Período</MenuItem>
              <MenuItem value="today">Hoje</MenuItem>
              <MenuItem value="week">Última Semana</MenuItem>
              <MenuItem value="month">Último Mês</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon color="action" sx={{ ml: 1 }} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="paid">Pago</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={filters.sortBy}
              label="Ordenar por"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon color="action" sx={{ ml: 1 }} />
                </InputAdornment>
              }
            >
              <MenuItem value="sale_date">Data</MenuItem>
              <MenuItem value="total_amount">Valor</MenuItem>
              <MenuItem value="customer_name">Cliente</MenuItem>
              <MenuItem value="seller_name">Vendedor</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {(filters.search || filters.dateRange !== 'all' || filters.status !== 'all') && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {filters.search && (
                <Chip
                  label={`Busca: ${filters.search}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.dateRange !== 'all' && (
                <Chip
                  label={`Período: ${getDateRangeLabel(filters.dateRange)}`}
                  onDelete={() => handleFilterChange('dateRange', 'all')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.status !== 'all' && (
                <Chip
                  label={`Status: ${getStatusLabel(filters.status)}`}
                  onDelete={() => handleFilterChange('status', 'all')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default SalesFilter; 