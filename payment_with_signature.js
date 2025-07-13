const axios = require('axios');
const crypto = require('crypto');

/**
 * 生成Alipay+签名
 * @param {string} httpMethod - HTTP方法 (POST)
 * @param {string} requestUri - 请求URI
 * @param {string} clientId - MPP客户端ID
 * @param {string} requestTime - 请求时间戳
 * @param {string} requestBody - 请求体JSON字符串
 * @param {string} privateKey - RSA私钥
 * @returns {string} 签名字符串
 */
function generateSignature(httpMethod, requestUri, clientId, requestTime, requestBody, privateKey) {
  // 构造Content_To_Be_Signed
  const contentToBeSigned = `${httpMethod} ${requestUri}\n${clientId}.${requestTime}.${requestBody}`;
  
  // 使用RSA256算法生成签名
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(contentToBeSigned, 'utf8');
  const signature = sign.sign(privateKey, 'base64');
  
  // 返回完整的签名格式
  return `algorithm=RSA256,keyVersion=0,signature=${signature}`;
}

/**
 * 调用支付接口 - 包含签名验证
 */
async function initiatePaymentWithSignature({
  clientId,
  privateKey,
  apiBaseUrl = 'https://your-api-endpoint.com',
  paymentData
}) {
  try {
    const requestUri = '/alipayplus/payment/pay';
    const httpMethod = 'POST';
    const requestTime = Date.now().toString();
    
    // 构造请求体
    const requestBody = JSON.stringify(paymentData);
    
    // 生成签名
    const signature = generateSignature(
      httpMethod,
      requestUri,
      clientId,
      requestTime,
      requestBody,
      privateKey
    );
    
    // 配置请求
    const config = {
      method: 'POST',
      url: `${apiBaseUrl}${requestUri}`,
      headers: {
        'Client-Id': clientId,
        'Request-Time': requestTime,
        'Signature': signature,
        'Content-Type': 'application/json',
      },
      data: paymentData
    };

    console.log('Request headers:', config.headers);
    console.log('Request body:', requestBody);
    console.log('Content to be signed:', `${httpMethod} ${requestUri}\n${clientId}.${requestTime}.${requestBody}`);

    // 发送请求
    const response = await axios(config);
    
    // 处理成功响应
    console.log('Payment initiated successfully:');
    console.log('Payment ID:', response.data.paymentId);
    console.log('Result:', response.data.result);
    
    return response.data;
    
  } catch (error) {
    // 错误处理
    if (error.response) {
      console.error('Payment failed:', error.response.data);
      console.error('Status:', error.response.status);
      
      // 根据错误类型提供解决方案
      switch (error.response.data.errorCode) {
        case 'INVALID_REQUEST':
          console.error('Solution: Ensure required fields are present');
          break;
        case 'UNAUTHORIZED':
          console.error('Solution: Check Client-Id and signature');
          break;
        case 'INVALID_SIGNATURE':
          console.error('Solution: Verify signature generation and private key');
          break;
        case 'ORDER_NOT_FOUND':
          console.error('Solution: Check referenceOrderId');
          break;
        default:
          console.error('Unknown error occurred');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    
    throw error;
  }
}

// 使用示例
async function example() {
  // 示例配置（需要替换为实际值）
  const config = {
    clientId: 'YOUR_CLIENT_ID', // 替换为实际的MPP客户端ID
    privateKey: `-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_CONTENT
-----END PRIVATE KEY-----`, // 替换为实际的RSA私钥
    apiBaseUrl: 'https://your-api-endpoint.com',
    paymentData: {
      paymentRequestId: 'pay_' + Date.now(),
      
      paymentAmount: {
        currency: 'MYR',
        value: '100.00'
      },
      
      order: {
        referenceOrderId: 'order_' + Date.now(),
        orderAmount: {
          currency: 'MYR',
          value: '100.00'
        },
        orderDescription: 'Sample product purchase'
      },
      
      paymentMethod: {
        paymentMethodType: 'ALIPAY_PLUS'
      },
      
      env: {
        terminalType: 'WEB',
        osType: 'WINDOWS',
        clientIp: '192.168.1.1'
      }
    }
  };

  try {
    const result = await initiatePaymentWithSignature(config);
    console.log('Payment process completed:', result);
  } catch (error) {
    console.error('Payment process failed:', error.message);
  }
}

// 运行示例
example();

// 导出函数
module.exports = {
  initiatePaymentWithSignature,
  generateSignature
}; 