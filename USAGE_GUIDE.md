# 如何在其他项目中使用 mcp-alipayplus

这个指南将详细介绍如何在不同类型的项目中引用和使用 `mcp-alipayplus` 项目。

## 🚀 快速开始

### 方式一：Git Submodule（推荐）

```bash
# 在你的项目根目录中
cd your-project
git submodule add https://github.com/shenshutao/mcp-alipayplus.git mcp-alipayplus
git submodule init
git submodule update
```

### 方式二：直接克隆

```bash
# 克隆到你的项目目录
git clone https://github.com/shenshutao/mcp-alipayplus.git
cd mcp-alipayplus
```

### 方式三：下载压缩包

```bash
# 下载并解压
wget https://github.com/shenshutao/mcp-alipayplus/archive/main.zip
unzip main.zip
```

## 💻 在不同项目中的使用方式

### 1. Node.js 项目中使用

#### 安装依赖
```bash
npm install axios  # 如果需要 HTTP 请求功能
```

#### 引用 Schema
```javascript
// 引用单个 API schema
const paySchema = require('./mcp-alipayplus/schemas/pay.json');
const userPaySchema = require('./mcp-alipayplus/schemas/userInitiatedPay.json');

// 引用所有 API 索引
const apiIndex = require('./mcp-alipayplus/schemas/index.json');

// 遍历所有 API
apiIndex.apis.forEach(api => {
    console.log(`API: ${api.name}`);
    console.log(`文件: ${api.file}`);
    console.log(`类型: ${api.type}`);
});
```

#### 使用签名验证
```javascript
// 引用签名验证功能
const { verifySignature, generateSignature } = require('./mcp-alipayplus/payment_with_signature');

// 验证请求签名
const isValid = verifySignature(requestData, headers);
if (!isValid) {
    throw new Error('签名验证失败');
}
```

### 2. Express.js 项目中使用

```javascript
const express = require('express');
const { verifySignature } = require('./mcp-alipayplus/payment_with_signature');
const paySchema = require('./mcp-alipayplus/schemas/pay.json');

const app = express();

// 支付 Webhook 端点
app.post('/alipayplus/payment/pay', (req, res) => {
    // 验证签名
    if (!verifySignature(req.body, req.headers)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // 验证请求数据格式
    if (!validatePaymentRequest(req.body, paySchema)) {
        return res.status(400).json({ error: 'Invalid request format' });
    }
    
    // 处理支付请求
    // ...
    
    res.json({ success: true });
});

function validatePaymentRequest(data, schema) {
    // 根据 schema 验证请求数据
    // 可以使用 joi、ajv 等验证库
    return true;
}
```

### 3. MCP 客户端中使用

```javascript
// MCP 客户端配置
const mcpConfig = {
    tools: []
};

// 动态加载所有 API 作为 MCP 工具
const apiIndex = require('./mcp-alipayplus/schemas/index.json');

apiIndex.apis.forEach(api => {
    const schema = require(`./mcp-alipayplus/schemas/${api.file}`);
    
    mcpConfig.tools.push({
        name: api.name,
        description: schema.description,
        inputSchema: schema.parameters,
        handler: async (params) => {
            // 处理 API 调用
            return await handleApiCall(api.name, params);
        }
    });
});

async function handleApiCall(apiName, params) {
    // 根据 API 类型决定处理方式
    if (apiName === 'pay') {
        // 处理支付请求
        return await processPayment(params);
    } else if (apiName === 'userInitiatedPay') {
        // 调用 Alipay+ API
        return await callAlipayPlusApi(apiName, params);
    }
    // ... 其他 API 处理
}
```

### 4. Python 项目中使用

```python
import json
import os

# 加载 schema
def load_schema(schema_name):
    schema_path = f"mcp-alipayplus/schemas/{schema_name}.json"
    with open(schema_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 使用示例
pay_schema = load_schema('pay')
user_pay_schema = load_schema('userInitiatedPay')

# 验证请求数据
def validate_payment_request(data):
    schema = load_schema('pay')
    required_fields = [param['name'] for param in schema['parameters'] if param['required']]
    
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    return True

# Flask 应用示例
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/alipayplus/payment/pay', methods=['POST'])
def handle_payment():
    try:
        # 验证请求格式
        validate_payment_request(request.json)
        
        # 处理支付逻辑
        # ...
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
```

### 5. 在 Docker 项目中使用

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 MCP schema
COPY mcp-alipayplus ./mcp-alipayplus

# 复制应用代码
COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./mcp-alipayplus:/app/mcp-alipayplus:ro
    environment:
      - NODE_ENV=production
```

## 🛠️ 高级用法

### 1. 动态 API 路由生成

```javascript
const express = require('express');
const apiIndex = require('./mcp-alipayplus/schemas/index.json');

const app = express();

// 根据 schema 动态生成路由
apiIndex.apis.forEach(api => {
    const schema = require(`./mcp-alipayplus/schemas/${api.file}`);
    
    if (api.direction === 'Alipay+ → MPP') {
        // 创建 webhook 端点
        app.post(`/alipayplus/${api.category}/${api.name}`, (req, res) => {
            handleWebhook(api.name, req, res, schema);
        });
    }
});

function handleWebhook(apiName, req, res, schema) {
    // 通用 webhook 处理逻辑
    console.log(`Processing ${apiName} webhook`);
    // 验证签名、处理请求等
}
```

### 2. 自动化测试用例生成

```javascript
const apiIndex = require('./mcp-alipayplus/schemas/index.json');

// 为每个 API 生成测试用例
apiIndex.apis.forEach(api => {
    const schema = require(`./mcp-alipayplus/schemas/${api.file}`);
    
    describe(`${api.name} API`, () => {
        it('should validate required parameters', () => {
            const requiredParams = schema.parameters.filter(p => p.required);
            // 生成测试数据和断言
        });
        
        it('should handle successful response', () => {
            // 基于 schema 的成功响应测试
        });
        
        it('should handle error responses', () => {
            // 基于 schema 的错误响应测试
        });
    });
});
```

### 3. OpenAPI 规范生成

```javascript
const apiIndex = require('./mcp-alipayplus/schemas/index.json');

function generateOpenAPISpec() {
    const spec = {
        openapi: '3.0.0',
        info: {
            title: 'Alipay+ API',
            version: '1.5.9'
        },
        paths: {}
    };
    
    apiIndex.apis.forEach(api => {
        const schema = require(`./mcp-alipayplus/schemas/${api.file}`);
        
        // 转换为 OpenAPI 格式
        spec.paths[`/${api.category}/${api.name}`] = {
            post: {
                summary: schema.description,
                requestBody: {
                    content: {
                        'application/json': {
                            schema: convertToOpenAPISchema(schema.parameters)
                        }
                    }
                }
            }
        };
    });
    
    return spec;
}
```

## 📋 最佳实践

### 1. 版本管理
```bash
# 更新 submodule 到最新版本
git submodule update --remote mcp-alipayplus

# 锁定特定版本
cd mcp-alipayplus
git checkout v1.0.0
cd ..
git add mcp-alipayplus
git commit -m "Lock mcp-alipayplus to v1.0.0"
```

### 2. 环境配置
```javascript
// config.js
const config = {
    alipayplus: {
        schemaPath: process.env.MCP_SCHEMA_PATH || './mcp-alipayplus/schemas',
        signatureVerification: process.env.ENABLE_SIGNATURE_VERIFICATION === 'true',
        publicKey: process.env.ALIPAYPLUS_PUBLIC_KEY
    }
};

module.exports = config;
```

### 3. 错误处理
```javascript
const { verifySignature } = require('./mcp-alipayplus/payment_with_signature');

function createApiHandler(schemaName) {
    return async (req, res) => {
        try {
            const schema = require(`./mcp-alipayplus/schemas/${schemaName}.json`);
            
            // 验证签名
            if (!verifySignature(req.body, req.headers)) {
                return res.status(401).json({
                    error: 'SIGNATURE_INVALID',
                    message: 'Request signature verification failed'
                });
            }
            
            // 处理请求
            const result = await processRequest(schemaName, req.body);
            res.json(result);
            
        } catch (error) {
            console.error(`Error processing ${schemaName}:`, error);
            res.status(500).json({
                error: 'INTERNAL_ERROR',
                message: 'Internal server error'
            });
        }
    };
}
```

## 🔧 工具脚本

### 1. Schema 验证脚本
```bash
# 验证所有 schema 文件
npm run schema:validate

# 查看项目统计
npm run schema:stats

# 列出所有 API
npm run schema:list
```

### 2. 自定义验证脚本
```javascript
// validate-schemas.js
const fs = require('fs');
const path = require('path');

const schemaDir = './mcp-alipayplus/schemas';
const schemas = fs.readdirSync(schemaDir).filter(f => f.endsWith('.json'));

schemas.forEach(file => {
    try {
        const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, file), 'utf8'));
        
        // 验证必需字段
        if (!schema.name || !schema.description || !schema.parameters) {
            console.error(`❌ ${file}: Missing required fields`);
            return;
        }
        
        // 验证 MCP 兼容性
        if (!schema.mcp_compatible) {
            console.warn(`⚠️ ${file}: Not MCP compatible`);
        }
        
        console.log(`✅ ${file}: Valid`);
    } catch (error) {
        console.error(`❌ ${file}: ${error.message}`);
    }
});
```

## 📞 技术支持

如果在使用过程中遇到问题，请：

1. 查看 [项目文档](https://github.com/shenshutao/mcp-alipayplus)
2. 检查 [Issues](https://github.com/shenshutao/mcp-alipayplus/issues)
3. 参考 [Alipay+ 官方文档](https://docs.alipayplus.com/)

## 📄 许可证

此项目基于 ISC 许可证开源，详情请参阅 LICENSE 文件。 