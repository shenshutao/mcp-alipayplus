# Alipay+ Payment Schema

这个项目包含了基于 [Alipay+ API 文档](https://docs.alipayplus.com/alipayplus/alipayplus/api_mpp/pay?role=MPP&product=Payment1&version=1.5.9) 的支付接口 schema 定义和示例代码。

## 📋 Overview

这个项目包含了 **12 个 Alipay+ API** 的完整 MCP 兼容 schema 定义，涵盖了支付和授权相关的所有核心功能。

### 🔄 接口分类

#### 支付相关接口 (8个)
- **Webhook 接口 (3个)**：`pay`、`notifyPayment`、`refund`
- **客户端接口 (5个)**：`userInitiatedPay`、`inquiryPayment`、`cancelPayment`、`getPaymentCode`、`prepare`

#### 授权相关接口 (4个)
- **Webhook 接口 (2个)**：`authNotify`、`consultUnbinding`
- **客户端接口 (2个)**：`applyToken`、`cancelToken`

### 🚀 接口方向说明
- **Alipay+ → MPP**：Alipay+ 调用 MPP 的 webhook 端点
- **MPP → Alipay+**：MPP 主动调用 Alipay+ 的 API 端点

## 🔧 Schema 特性

### ✅ 完整的 API 定义
- **12 个核心接口**：涵盖支付和授权完整流程
- **双向接口支持**：Webhook 和 Client API 完整覆盖
- **详细参数规范**：包含必需和可选字段，类型验证
- **响应格式定义**：标准化的成功和错误响应
- **错误处理规范**：详细的错误代码和解决方案

### ✅ 签名验证支持
- **RSA256 签名算法**：符合 Alipay+ 官方标准
- **完整签名流程**：包含签名生成和验证示例
- **Content_To_Be_Signed**：标准化的签名内容构造
- **测试验证工具**：内置签名测试和验证功能

### ✅ MCP 兼容性
这个 schema 集合完全兼容 **Model Context Protocol (MCP)**，支持：
- **AI 工具集成**：作为 MCP 工具的接口定义
- **代码自动生成**：基于 schema 生成客户端代码
- **API 文档生成**：自动化文档和测试用例生成
- **验证和测试**：请求/响应数据的自动验证

## 📂 文件结构

```
mcp_test/
├── schemas/
│   ├── index.json            # 所有接口的索引和汇总
│   ├── pay.json              # 支付处理接口 (Alipay+ → MPP)
│   ├── userInitiatedPay.json # 用户扫码支付接口 (MPP → Alipay+)
│   ├── notifyPayment.json    # 支付结果通知接口 (Alipay+ → MPP)
│   ├── inquiryPayment.json   # 支付查询接口 (MPP → Alipay+)
│   ├── cancelPayment.json    # 取消支付接口 (MPP → Alipay+)
│   ├── refund.json           # 退款处理接口 (Alipay+ → MPP)
│   ├── getPaymentCode.json   # 获取支付码接口 (MPP → Alipay+)
│   ├── prepare.json          # 预处理支付接口 (MPP → Alipay+)
│   ├── applyToken.json       # 申请授权令牌接口 (MPP → Alipay+)
│   ├── cancelToken.json      # 取消授权令牌接口 (MPP → Alipay+)
│   ├── authNotify.json       # 授权状态通知接口 (Alipay+ → MPP)
│   └── consultUnbinding.json # 解绑咨询接口 (Alipay+ → MPP)
├── payment_example.js        # 基础支付示例
├── payment_simple.js         # 简化版支付示例
├── payment_with_signature.js # 包含签名验证的支付示例
├── signature_test.js         # 签名功能测试
└── package.json             # 项目配置
```

## 🚀 使用方法

### 1. 安装依赖
```bash
npm install
```

### 2. 运行示例
```bash
# 基础示例
npm start

# 简化版示例
npm run simple

# 带签名验证的示例
npm run signature

# 测试签名功能
npm run test
```

### 3. Schema 管理
```bash
# 查看所有接口列表
npm run schema:list

# 验证所有 schema 文件
npm run schema:validate

# 显示 schema 统计信息
npm run schema:stats
```

## 🔐 签名验证

该 schema 包含完整的签名验证规范：

### Content_To_Be_Signed 格式
```
POST /your-payment-endpoint
<Client-Id>.<Request-Time>.<Request-Body>
```

### 必需的 HTTP Headers
- `Client-Id`: MPP 客户端标识符
- `Request-Time`: ISO 8601 格式的请求时间
- `Signature`: RSA256 签名，格式为 `algorithm=RSA256,keyVersion=0,signature=<generated_signature>`

## 🌟 MCP 支持

这个 `pay.json` schema 支持 MCP 的以下特性：

### 1. 工具定义
可以作为 MCP 工具的 schema 定义，让 AI 模型理解如何处理 Alipay+ 支付请求

### 2. 代码生成
基于 schema 可以自动生成：
- 请求处理函数
- 数据验证逻辑
- 签名验证代码
- 错误处理逻辑

### 3. 集成示例
```javascript
// MCP 工具集成示例
const paymentSchema = require('./schemas/pay.json');

// 使用 schema 验证请求
function validatePaymentRequest(request) {
  // 根据 schema 验证请求参数
  // 返回验证结果
}

// 生成签名
function generateSignature(request) {
  // 根据 schema 中的签名规范生成签名
  // 返回签名字符串
}
```

## 📚 API 参考

### 🔗 完整接口列表

| 接口名 | 方向 | 类型 | 描述 |
|--------|------|------|------|
| `pay` | Alipay+ → MPP | Webhook | 处理支付请求 |
| `userInitiatedPay` | MPP → Alipay+ | Client | 用户扫码支付 |
| `notifyPayment` | Alipay+ → MPP | Webhook | 支付结果通知 |
| `inquiryPayment` | MPP → Alipay+ | Client | 查询支付状态 |
| `cancelPayment` | MPP → Alipay+ | Client | 取消支付订单 |
| `refund` | Alipay+ → MPP | Webhook | 处理退款请求 |
| `getPaymentCode` | MPP → Alipay+ | Client | 获取支付码 |
| `prepare` | MPP → Alipay+ | Client | 预处理支付订单 |
| `applyToken` | MPP → Alipay+ | Client | 申请授权令牌 |
| `cancelToken` | MPP → Alipay+ | Client | 取消授权令牌 |
| `authNotify` | Alipay+ → MPP | Webhook | 授权状态通知 |
| `consultUnbinding` | Alipay+ → MPP | Webhook | 解绑咨询 |

### 🔑 通用签名验证

所有接口都需要 RSA256 签名验证，包含以下 Headers：

| Header | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `Client-Id` | string | ✅ | MPP 客户端ID |
| `Request-Time` | string | ✅ | ISO 8601 时间戳 |
| `Signature` | string | ✅ | RSA256 签名 |

### 📋 标准响应格式

```json
{
  "result": {
    "resultCode": "SUCCESS",
    "resultStatus": "S",
    "resultMessage": "Operation completed successfully"
  },
  "additionalData": "..."
}
```

## 🔗 相关链接

- [Alipay+ API 文档](https://docs.alipayplus.com/alipayplus/alipayplus/api_mpp/pay?role=MPP&product=Payment1&version=1.5.9)
- [Alipay+ 签名验证文档](https://docs.alipayplus.com/alipayplus/alipayplus/api_mpp/signature?role=MPP&product=Payment1&version=1.5.9)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [项目完成总结](./PROJECT_SUMMARY.md)

## 📝 许可证

本项目遵循 ISC 许可证。

---

**🎉 这个项目包含了完整的 Alipay+ API schema 集合，100% 兼容 MCP，可以直接用于 AI 工具集成和代码生成！** 