// DRAGO X Protocol - Frontend API Integration Client

// Auto-normalize API URL: handles both "https://domain.com" and "https://domain.com/api", with or without trailing slash
const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

/**
 * Helper to handle HTTP requests with standardized JSON responses and error logging
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[DRAGO X API] Request failed for ${endpoint}:`, err.message);
    throw err;
  }
}

export const dragoApi = {
  // 1. Health & Protocol Status
  async getHealth() {
    return request('/health');
  },

  // 2. Global Trade Registry (Companies)
  async getCompanies(query = {}) {
    const params = new URLSearchParams(query).toString();
    return request(`/companies${params ? `?${params}` : ''}`);
  },

  async registerCompany(companyData) {
    return request('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  // 3. E-Commerce OS Product Catalog
  async getProducts(query = {}) {
    const params = new URLSearchParams(query).toString();
    return request(`/products${params ? `?${params}` : ''}`);
  },

  async publishProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // 4. Trade Execution (RFQs & Orders)
  async createRfq(rfqData) {
    return request('/trade/rfqs', {
      method: 'POST',
      body: JSON.stringify(rfqData),
    });
  },

  async submitQuote(quoteData) {
    return request('/trade/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  },

  async acceptQuoteAndSettle(orderData) {
    return request('/trade/orders/accept-quote', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getRecentOrders() {
    return request('/trade/orders');
  },

  async updateOrderStatus(orderId, updateData) {
    return request(`/trade/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // 5. Cloudflare R2 Object Storage (Certificates, Photos, Vouchers)
  async getStorageStatus() {
    return request('/storage/status');
  },

  async getPresignedUrl({ filename, contentType, folder = 'documents' }) {
    return request('/storage/presigned-url', {
      method: 'POST',
      body: JSON.stringify({ filename, contentType, folder }),
    });
  },

  async uploadFileToR2(file, folder = 'documents') {
    const presigned = await this.getPresignedUrl({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      folder,
    });

    if (presigned?.data?.uploadUrl) {
      await fetch(presigned.data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      });

      return {
        success: true,
        publicUrl: presigned.data.publicUrl,
        key: presigned.data.key,
        name: file.name,
      };
    }

    throw new Error('Presigned URL generation failed');
  },
};

