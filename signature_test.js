const crypto = require('crypto');

/**
 * 生成RSA密钥对用于测试
 */
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  
  return { publicKey, privateKey };
}

/**
 * 生成Alipay+签名
 */
function generateSignature(httpMethod, requestUri, clientId, requestTime, requestBody, privateKey) {
  const contentToBeSigned = `${httpMethod} ${requestUri}\n${clientId}.${requestTime}.${requestBody}`;
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(contentToBeSigned, 'utf8');
  const signature = sign.sign(privateKey, 'base64');
  
  return `algorithm=RSA256,keyVersion=0,signature=${signature}`;
}

/**
 * 验证签名是否正确
 */
function verifySignature(httpMethod, requestUri, clientId, requestTime, requestBody, signatureString, publicKey) {
  try {
    // 提取签名部分
    const signatureMatch = signatureString.match(/signature=([^,]+)/);
    if (!signatureMatch) {
      throw new Error('Invalid signature format');
    }
    
    const signature = signatureMatch[1];
    
    // 重新构造Content_To_Be_Signed
    const contentToBeSigned = `${httpMethod} ${requestUri}\n${clientId}.${requestTime}.${requestBody}`;
    
    // 验证签名
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(contentToBeSigned, 'utf8');
    return verify.verify(publicKey, signature, 'base64');
  } catch (error) {
    console.error('Signature verification error:', error.message);
    return false;
  }
}

// 测试函数
function testSignature() {
  console.log('🔐 Testing Alipay+ signature generation...\n');
  
  // 生成测试密钥对
  const { publicKey, privateKey } = generateKeyPair();
  
  // 测试数据
  const testData = {
    httpMethod: 'POST',
    requestUri: '/alipayplus/payment/pay',
    clientId: 'test_client_id',
    requestTime: '1703825400000',
    requestBody: JSON.stringify({
      paymentRequestId: 'pay_test_123',
      paymentAmount: {
        currency: 'MYR',
        value: '100.00'
      },
      order: {
        referenceOrderId: 'order_test_123',
        orderAmount: {
          currency: 'MYR',
          value: '100.00'
        },
        orderDescription: 'Test order'
      },
      paymentMethod: {
        paymentMethodType: 'ALIPAY_PLUS'
      }
    })
  };
  
  // 生成签名
  const signature = generateSignature(
    testData.httpMethod,
    testData.requestUri,
    testData.clientId,
    testData.requestTime,
    testData.requestBody,
    privateKey
  );
  
  // 验证签名
  const isValid = verifySignature(
    testData.httpMethod,
    testData.requestUri,
    testData.clientId,
    testData.requestTime,
    testData.requestBody,
    signature,
    publicKey
  );
  
  // 输出结果
  console.log('📋 Test Data:');
  console.log('HTTP Method:', testData.httpMethod);
  console.log('Request URI:', testData.requestUri);
  console.log('Client ID:', testData.clientId);
  console.log('Request Time:', testData.requestTime);
  console.log('Request Body:', testData.requestBody);
  console.log();
  
  console.log('📝 Content to be signed:');
  console.log(`${testData.httpMethod} ${testData.requestUri}\n${testData.clientId}.${testData.requestTime}.${testData.requestBody}`);
  console.log();
  
  console.log('🔑 Generated Signature:');
  console.log(signature);
  console.log();
  
  console.log('✅ Signature Verification:');
  console.log('Is Valid:', isValid ? '✅ PASS' : '❌ FAIL');
  console.log();
  
  if (isValid) {
    console.log('🎉 Signature generation and verification successful!');
  } else {
    console.log('❌ Signature generation or verification failed!');
  }
  
  return { signature, isValid };
}

// 导出测试函数
module.exports = {
  testSignature,
  generateSignature,
  verifySignature,
  generateKeyPair
};

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  testSignature();
} 