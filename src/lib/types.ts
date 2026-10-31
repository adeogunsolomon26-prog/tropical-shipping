export type Booking = {
  id: string | number;
  user_id?: string | null;
  name?: string;
  email?: string;
  origin?: string;
  destination?: string;
  cargo_description?: string | null;
  notes?: string | null;
  amount?: number;
  status?: string;
  payment_status?: string;
  payment_method?: string | null;
  payment_reference?: string | null;
  payer_name?: string | null;
  reject_reason?: string | null;
  tracking_number?: string | null;
  container?: string | null;
  pickup_date?: string | null;
  pickup_notes?: string | null;
  proof_url?: string | null;
    requested_method?: string | null;
  customer_handle?: string | null;
  payment_instructions?: string | null;
  details_requested_at?: string | null;
}