/**
 * mcp-alipayplus 使用示例
 * 演示如何在项目中引用和使用 Alipay+ API schemas
 */

// 1. 引用 API schemas
const paySchema = require('./schemas/pay.json');
const userPaySchema = require('./schemas/userInitiatedPay.json');
const apiIndex = require('./schemas/index.json');

// 2. 引用签名验证功能 (可选)
// const { verifySignature, generateSignature } = require('./payment_with_signature');

console.log('=== mcp-alipayplus 使用示例 ===\n');

// 3. 显示所有可用的 API
console.log('📋 可用的 API 列表:');
apiIndex.apis.forEach(api => {
    console.log(`  - ${api.name} (${api.direction})`);
});

console.log(`\n📊 统计信息:`);
console.log(`  - 总计 API: ${apiIndex.total_apis}`);
console.log(`  - 支付 API: ${apiIndex.categories.payment.count}`);
console.log(`  - 授权 API: ${apiIndex.categories.auth.count}`);
console.log(`  - Webhook: ${apiIndex.webhooks.count}`);
console.log(`  - 客户端 API: ${apiIndex.client_apis.count}`);

// 4. 验证请求数据示例
function validatePaymentRequest(data, schema) {
    console.log('\n🔍 验证支付请求数据...');
    
    // 检查必需字段
    if (!schema.params) {
        console.log('⚠️ Schema 缺少参数定义');
        return false;
    }
    
    const requiredFields = Object.keys(schema.params).filter(key => schema.params[key].required);
    for (const fieldName of requiredFields) {
        if (!data[fieldName]) {
            console.log(`❌ 缺少必需字段: ${fieldName}`);
            return false;
        }
    }
    
    console.log('✅ 请求数据验证通过');
    return true;
}

// 5. 模拟请求数据
const samplePaymentData = {
    paymentRequestId: 'pay_' + Date.now(),
    paymentAmount: {
        currency: 'MYR',
        value: '100.00'
    },
    payToAmount: {
        currency: 'MYR',
        value: '100.00'
    },
    order: {
        referenceOrderId: 'order_' + Date.now(),
        orderAmount: {
            currency: 'MYR',
            value: '100.00'
        },
        orderDescription: 'Test payment'
    },
    paymentMethod: {
        paymentMethodType: 'ALIPAY_CN'
    },
    paymentFactor: {
        isInStorePayment: true,
        needSurcharge: false,
        isPaymentEvaluation: false,
        isCashierPayment: false,
        isAgreementPayment: false,
        inStorePaymentScenario: 'PaymentCode'
    },
    acquirerId: 'test_acquirer',
    pspId: 'test_psp'
};

// 6. 验证示例数据
validatePaymentRequest(samplePaymentData, paySchema);

// 7. 签名验证示例
console.log('\n🔐 签名验证示例...');
const mockHeaders = {
    'client-id': 'test_client_id',
    'request-time': new Date().toISOString(),
    'signature': 'mock_signature'
};

console.log('📄 请求头信息:');
Object.entries(mockHeaders).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
});

// 8. 动态创建 API 处理器示例
console.log('\n🚀 动态 API 处理器示例:');

const apiHandlers = {};

// 为每个 API 创建处理器
apiIndex.apis.forEach(api => {
    try {
        const schema = require(`./schemas/${api.file}`);
        
        apiHandlers[api.name] = {
            name: api.name,
            direction: api.direction,
            category: api.category,
            validate: (data) => validatePaymentRequest(data, schema),
            process: async (data) => {
                console.log(`处理 ${api.name} 请求...`);
                // 这里可以添加具体的处理逻辑
                return { success: true, message: `${api.name} 处理成功` };
            }
        };
    } catch (error) {
        console.log(`⚠️ 无法加载 ${api.name} schema:`, error.message);
    }
});

console.log(`已创建 ${Object.keys(apiHandlers).length} 个 API 处理器`);

// 9. 使用示例
async function processApiRequest(apiName, data) {
    console.log(`\n🔄 处理 ${apiName} 请求...`);
    
    const handler = apiHandlers[apiName];
    if (!handler) {
        console.log(`❌ 未找到 ${apiName} 处理器`);
        return;
    }
    
    // 验证数据
    if (!handler.validate(data)) {
        console.log(`❌ ${apiName} 数据验证失败`);
        return;
    }
    
    // 处理请求
    const result = await handler.process(data);
    console.log(`✅ ${apiName} 处理结果:`, result);
    return result;
}

// 10. 测试支付请求处理
processApiRequest('pay', samplePaymentData);

// 11. 显示使用建议
console.log('\n💡 使用建议:');
console.log('  1. 将此项目作为 git submodule 引入你的项目');
console.log('  2. 根据需要引用特定的 API schema 文件');
console.log('  3. 使用提供的签名验证功能确保安全性');
console.log('  4. 参考 USAGE_GUIDE.md 了解更多集成方式');
console.log('  5. 使用 npm scripts 进行 schema 验证和统计');

console.log('\n🔗 相关资源:');
console.log('  - GitHub: https://github.com/shenshutao/mcp-alipayplus');
console.log('  - Alipay+ 官方文档: https://docs.alipayplus.com/');
console.log('  - 使用指南: ./USAGE_GUIDE.md'); 