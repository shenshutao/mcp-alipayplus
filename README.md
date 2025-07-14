# Alipay+ MCP Schema Collection

> **⚠️ 免责声明 / Disclaimer**
> 
> - 🚧 **非官方项目** - 这是一个社区驱动的非官方项目，不隶属于蚂蚁集团或 Alipay+
> - 📋 **Draft 版本** - 当前为草案版本，Schema 定义可能随官方文档更新而变化
> - 🔍 **仅供参考** - 请以 [Alipay+ 官方文档](https://docs.alipayplus.com/) 为准
> - 🛡️ **生产环境使用需谨慎** - 建议在生产环境使用前进行充分测试和验证
> 
> ---
> 
> - 🚧 **Unofficial Project** - This is an unofficial community-driven project, not affiliated with Ant Group or Alipay+
> - 📋 **Draft Version** - Current draft version, schema definitions may change with official documentation updates
> - 🔍 **For Reference Only** - Please refer to [official Alipay+ documentation](https://docs.alipayplus.com/) as the authoritative source
> - 🛡️ **Use with Caution in Production** - Thorough testing and validation recommended before production use

完整的 Alipay+ API MCP 兼容 schema 集合，包含 12 个核心接口和完整文档。

## 📋 项目概述

这个项目提供了基于 [Alipay+ 官方 API 文档](https://docs.alipayplus.com/alipayplus/alipayplus/api_mpp/pay?role=MPP&product=Payment1&version=1.5.9) 的完整 MCP 兼容 schema 定义，涵盖支付和授权相关的所有核心功能。

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

### ✅ MCP 兼容性
这个 schema 集合完全兼容 **Model Context Protocol (MCP)**，支持：
- **AI 工具集成**：作为 MCP 工具的接口定义
- **代码自动生成**：基于 schema 生成客户端代码
- **API 文档生成**：自动化文档和测试用例生成
- **验证和测试**：请求/响应数据的自动验证

## 📂 文件结构

```
mcp-alipayplus/
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
├── example-usage.js          # 完整使用示例
├── USAGE_GUIDE.md           # 详细使用指南
├── package.json             # 项目配置
└── README.md               # 项目说明
```

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 运行示例
```bash
# 查看使用示例
npm run example

# 验证所有 schema
npm run schema:validate

# 查看项目统计
npm run schema:stats
```

## 💻 在 Cursor 和 VS Code 中使用 MCP

### Cursor 配置

1. **安装 MCP 扩展**：
   - 在 Cursor 中打开扩展商店
   - 搜索并安装 "MCP Client" 或相关的 MCP 扩展

2. **配置 MCP 设置**：
   创建或编辑 `.cursor/mcp-config.json` 文件：
   ```json
   {
     "mcpServers": {
       "alipayplus": {
         "command": "node",
         "args": ["./mcp-alipayplus/example-usage.js"],
         "env": {
           "NODE_ENV": "development"
         }
       }
     },
     "tools": [
       {
         "name": "alipayplus-pay",
         "schema": "./mcp-alipayplus/schemas/pay.json"
       },
       {
         "name": "alipayplus-user-pay",
         "schema": "./mcp-alipayplus/schemas/userInitiatedPay.json"
       }
     ]
   }
   ```

3. **在 Cursor 中使用**：
   - 重启 Cursor
   - 打开命令面板 (Cmd+Shift+P)
   - 输入 "MCP: Load Tools"
   - 选择 Alipay+ 相关工具

### VS Code 配置

1. **安装 MCP 扩展**：
   ```bash
   code --install-extension mcp-tools.mcp-client
   ```

2. **配置工作区设置**：
   在 `.vscode/settings.json` 中添加：
   ```json
   {
     "mcp.tools": {
       "alipayplus": {
         "path": "./mcp-alipayplus",
         "schemas": [
           "schemas/pay.json",
           "schemas/userInitiatedPay.json",
           "schemas/notifyPayment.json"
         ],
         "autoload": true
       }
     }
   }
   ```

3. **创建 MCP 任务**：
   在 `.vscode/tasks.json` 中添加：
   ```json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "label": "MCP: Validate Alipay+ Schemas",
         "type": "shell",
         "command": "npm",
         "args": ["run", "schema:validate"],
         "group": "build",
         "presentation": {
           "echo": true,
           "reveal": "always",
           "focus": false,
           "panel": "shared"
         }
       }
     ]
   }
   ```

### 通用 MCP 配置

创建 `mcp.config.js` 文件用于动态配置：
```javascript
const fs = require('fs');
const path = require('path');

// 动态加载所有 schema
const schemasDir = path.join(__dirname, 'schemas');
const schemas = fs.readdirSync(schemasDir)
  .filter(file => file.endsWith('.json') && file !== 'index.json')
  .map(file => ({
    name: file.replace('.json', ''),
    path: path.join(schemasDir, file),
    schema: require(path.join(schemasDir, file))
  }));

module.exports = {
  name: 'alipayplus-mcp',
  version: '1.0.0',
  description: 'Alipay+ API MCP Tools',
  tools: schemas.map(schema => ({
    name: `alipayplus-${schema.name}`,
    description: schema.schema.description,
    inputSchema: {
      type: 'object',
      properties: schema.schema.parameters.reduce((props, param) => {
        props[param.name] = {
          type: param.type,
          description: param.description,
          required: param.required
        };
        return props;
      }, {})
    },
       handler: async (args) => {
     // 处理请求
     return {
       success: true,
       data: args,
       timestamp: new Date().toISOString()
     };
   }
  }))
};
```

## 📖 使用文档

- **详细使用指南**：查看 [USAGE_GUIDE.md](./USAGE_GUIDE.md)
- **API 参考**：查看 `schemas/` 目录下的各个 JSON 文件

## 🧪 测试和验证

### 验证 Schema 文件
```bash
# 验证所有 schema 语法
npm run schema:validate

# 查看详细统计信息
npm run schema:stats

# 列出所有 API
npm run schema:list
```

## 🔗 相关资源

- **GitHub 仓库**：https://github.com/shenshutao/mcp-alipayplus
- **Alipay+ 官方文档**：https://docs.alipayplus.com/
- **MCP 协议规范**：https://modelcontextprotocol.io/
- **问题反馈**：https://github.com/shenshutao/mcp-alipayplus/issues

## 📊 统计信息

- ✅ **总计 API**：12 个
- ✅ **支付 API**：8 个
- ✅ **授权 API**：4 个
- ✅ **Webhook 接口**：5 个
- ✅ **客户端 API**：7 个
- ✅ **MCP 兼容性**：100%
- 🚧 **版本状态**：Draft v0.1.0

## 📄 许可证

本项目采用 ISC 许可证，详情请查看 [LICENSE](LICENSE) 文件。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来完善这个项目。在提交代码前，请确保：

1. 运行 `npm run schema:validate` 验证所有 schema
2. 更新相关文档

## ⚠️ 重要说明

### 项目性质
- **非官方项目**：本项目为社区开发者根据公开文档整理的非官方实现
- **Draft 版本**：当前版本为草案状态，随时可能根据官方文档更新而调整
- **学习参考**：主要用于学习和开发参考，不建议直接用于生产环境

### 使用建议
- 📖 **优先参考官方文档**：任何冲突以 [Alipay+ 官方文档](https://docs.alipayplus.com/) 为准
- 🧪 **充分测试**：在生产环境使用前请进行全面测试
- 🔄 **定期更新**：建议定期检查官方文档更新并同步本项目
- 💬 **社区反馈**：发现问题请及时通过 Issues 反馈

### 法律声明
- 本项目不代表蚂蚁集团、Alipay+ 或任何官方立场
- 使用本项目产生的任何问题由使用者自行承担
- 本项目遵循开源协议，欢迎贡献和改进

---

**如果这个项目对您有帮助，请给个 ⭐️ Star！** 