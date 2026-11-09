import dotenv from 'dotenv';
dotenv.config();

export const PAYPAL_CONFIG = {
  clientId: process.env.PAYPAL_CLIENT_ID || 'sandbox_client_id_placeholder',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'sandbox_secret_placeholder',
  baseUrl: process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com',
  isSandbox: true,
};
