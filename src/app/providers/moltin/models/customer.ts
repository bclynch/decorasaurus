import { Timestamps } from './cart';

export interface MoltinCustomer {
  customer_id: string;
  expires: number;
  id: string;
  token: string;
  type: string;
}

export interface MoltinAddress {
  city: string;
  company_name: string;
  country: string;
  county: string;
  first_name: string;
  id: string;
  instructions: string;
  last_name: string;
  line_1: string;
  line_2: string;
  links: {
    self: string;
  };
  meta: Timestamps;
  name: string;
  phone_number: string;
  postcode: string;
  type: 'address';
}
