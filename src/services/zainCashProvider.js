// Zain Cash Payment Provider
class ZainCashProvider {
  constructor() {
    // Use fallback values for development
    this.apiKey = import.meta.env.VITE_ZAIN_CASH_API_KEY || 'demo_api_key';
    this.merchantId = import.meta.env.VITE_ZAIN_CASH_MERCHANT_ID || 'demo_merchant_id';
    this.secret = import.meta.env.VITE_ZAIN_CASH_SECRET || 'demo_secret';
    this.baseUrl = 'https://api.zaincash.iq';
  }

  async createPayment({ amount, orderId, phoneNumber, description }) {
    try {
      // For demo purposes, simulate payment creation
      console.log('Creating Zain Cash payment:', {
        amount,
        orderId,
        phoneNumber,
        description
      });

      // Simulate API response for demo
      const mockResponse = {
        id: `demo_${Date.now()}`,
        paymentUrl: `zaincash://payment?transaction=demo_${Date.now()}&msisdn=${phoneNumber}`,
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      };

      // In production, this would be an actual API call:
      /*
      const amountInFils = amount * 1000;
      
      const response = await fetch(`${this.baseUrl}/v2/merchant/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          amount: amountInFils,
          serviceType: 'PAYMENT',
          merchantId: this.merchantId,
          orderId: orderId.toString(),
          description: description || `دفع للطلب #${orderId}`,
          phoneNumber: phoneNumber,
          redirectUrl: `${window.location.origin}/payment/zain-cash/success`,
          failureRedirectUrl: `${window.location.origin}/payment/zain-cash/failure`,
          webhookUrl: `${window.location.origin}/api/payment/zain-cash/webhook`
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'فشل إنشاء عملية الدفع');
      }

      return {
        transactionId: data.id,
        paymentUrl: data.paymentUrl || this.generateDeepLink(data.id, phoneNumber),
        expiresAt: data.expiresAt
      };
      */

      return {
        transactionId: mockResponse.id,
        paymentUrl: mockResponse.paymentUrl,
        expiresAt: mockResponse.expiresAt
      };
    } catch (error) {
      console.error('Zain Cash payment error:', error);
      throw new Error('فشل في الاتصال بـ Zain Cash');
    }
  }

  generateDeepLink(transactionId, phoneNumber) {
    // Zain Cash deep link format
    return `zaincash://payment?transaction=${transactionId}&msisdn=${phoneNumber}`;
  }

  async verifyPayment(transactionId) {
    try {
      // For demo purposes, simulate successful payment verification
      

      // Simulate API response for demo
      const mockVerification = {
        success: true,
        status: 'SUCCESS',
        amount: 1000, // Mock amount
        transactionId: transactionId,
        verifiedAt: new Date()
      };

      // In production, this would be an actual API call:
      /*
      const response = await fetch(`${this.baseUrl}/v2/merchant/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const data = await response.json();
      
      return {
        success: data.status === 'SUCCESS',
        status: data.status,
        amount: data.amount / 1000, // Convert back to IQD
        transactionId: data.id,
        verifiedAt: new Date()
      };
      */

      return mockVerification;
    } catch (error) {
      console.error('Zain Cash verification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if Zain Cash app is installed
  isZainCashAppInstalled() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 2000);

      window.addEventListener('blur', () => {
        clearTimeout(timeout);
        resolve(true);
      });

      // Try to open the deep link
      window.location.href = 'zaincash://';
    });
  }

  // Redirect to payment
  async redirectToPayment(paymentIntent, phoneNumber) {
    // For demo purposes, just show an alert
    
    
    // In production, this would check if app is installed and redirect accordingly
    /*
    const isAppInstalled = await this.isZainCashAppInstalled();
    
    if (isAppInstalled) {
      // Use deep link if app is installed
      window.location.href = paymentIntent.paymentUrl;
    } else {
      // Redirect to web payment or app store
      if (paymentIntent.paymentUrl.startsWith('http')) {
        window.location.href = paymentIntent.paymentUrl;
      } else {
        // Redirect to app store
        window.location.href = 'https://play.google.com/store/apps/details?id=com.zaincash';
      }
    }
    */

    // For demo, show a message
    alert('في بيئة التطوير: سيتم توجيهك إلى تطبيق Zain Cash لإتمام الدفع');
    
    // Simulate successful payment for demo
    setTimeout(() => {
      window.location.href = `/payment/zain-cash/success?token=${paymentIntent.transactionId}&orderId=demo_order`;
    }, 2000);
  }
}

export default ZainCashProvider;
