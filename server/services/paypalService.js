import { PAYPAL_CONFIG } from '../config/paypal.js';

class PayPalService {
  constructor() {
    this.clientId = PAYPAL_CONFIG.clientId;
    this.clientSecret = PAYPAL_CONFIG.clientSecret;
    this.baseUrl = PAYPAL_CONFIG.baseUrl;
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

  isConfigured() {
    return (
      Boolean(this.clientId) &&
      Boolean(this.clientSecret) &&
      this.clientId !== 'sandbox_client_id_placeholder' &&
      this.clientSecret !== 'sandbox_secret_placeholder' &&
      !this.clientId.includes('YOUR_SANDBOX') &&
      !this.clientSecret.includes('YOUR_SANDBOX')
    );
  }

  /**
   * Fetch OAuth 2.0 Access Token from PayPal Sandbox
   */
  async getAccessToken() {
    if (!this.isConfigured()) {
      return 'simulated_paypal_access_token';
    }

    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal OAuth failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    return this.accessToken;
  }

  /**
   * Create PayPal Order for a Milestone
   */
  async createOrder({ milestoneId, amount, currency = 'USD', title = 'Milestone Payment' }) {
    // If real credentials are not supplied, simulate order for instant prototype testing
    if (!this.isConfigured()) {
      const simOrderId = `SANDBOX-ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      return {
        id: simOrderId,
        status: 'CREATED',
        simulated: true,
        links: [
          {
            href: `https://www.sandbox.paypal.com/checkoutnow?token=${simOrderId}`,
            rel: 'approve',
            method: 'GET',
          },
        ],
      };
    }

    const accessToken = await this.getAccessToken();
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: milestoneId.toString(),
          description: title.substring(0, 127),
          amount: {
            currency_code: currency,
            value: Number(amount).toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'MilestoneMate',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payments/success`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payments/cancel`,
      },
    };

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`PayPal Create Order failed: ${data.message || JSON.stringify(data)}`);
    }

    return data;
  }

  /**
   * Capture PayPal Order
   */
  async captureOrder(orderId) {
    if (!this.isConfigured() || orderId.startsWith('SANDBOX-ORDER-')) {
      const simCaptureId = `SANDBOX-CAP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      return {
        id: simCaptureId,
        status: 'COMPLETED',
        simulated: true,
        orderId: orderId,
        seller_receivable_breakdown: {
          gross_amount: { value: '100.00', currency_code: 'USD' },
        },
      };
    }

    const accessToken = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`PayPal Capture Order failed: ${data.message || JSON.stringify(data)}`);
    }

    return data;
  }

  /**
   * Verify Webhook Event (optional enhancement)
   */
  async verifyWebhookSignature({ webhookId, headers, body }) {
    if (!this.isConfigured()) return true;

    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          auth_algo: headers['paypal-auth-algo'],
          cert_url: headers['paypal-cert-url'],
          transmission_id: headers['paypal-transmission-id'],
          transmission_sig: headers['paypal-transmission-sig'],
          transmission_time: headers['paypal-transmission-time'],
          webhook_id: webhookId,
          webhook_event: body,
        }),
      });
      const result = await response.json();
      return result.verification_status === 'SUCCESS';
    } catch {
      return false;
    }
  }
}

export default new PayPalService();
