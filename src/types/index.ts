export interface Sale {
  id: number;
  seller_name: string;
  customer_name: string;
  device_name: string;
  imei: string;
  sale_date: string;
  down_payment: number;
  total_amount: number;
  remaining_amount: number;
  payment_due_date: string;
  status: 'pending' | 'paid';
  created_at: string;
  updated_at?: string;
}

export interface SalesSummary {
  total_sales: number;
  devices_sold: number;
  total_received: number;
  total_pending: number;
} 