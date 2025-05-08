# 📁 项目目录结构说明（基于 Feature 模块化架构）

本项目采用 **Feature-Oriented Modular Architecture** 架构，所有业务相关内容归类至 `features/` 下，确保模块内高内聚、模块间低耦合，提升可维护性、可扩展性和团队协作效率。

---

## 📁 /src — 主应用源码目录

```plaintext
src/
├── assets/            # 项目静态资源（如图片、字体）
├── components/        # 全局复用 UI 组件（Button、Table、Modal 等）
├── features/          # 核心业务模块，按领域拆分
├── layout/            # 布局组件（如侧边栏、顶部导航）
├── lib/               # 通用工具库（如 axios 实例、form hooks）
├── pages/             # 顶层页面路由（通常懒加载 features）
├── store/             # 全局状态管理（如主题、多语言、权限）
├── types/             # 全局通用类型定义（如 UserType, RoleType）
├── utils/             # 零散实用函数（如格式化时间、金额）
└── main.tsx           # 应用入口文件
```

---

## 📁 /features — 业务模块（强内聚）

```plaintext
features/
├── quotation/                     # 询价模块
│   ├── api/                       # 请求封装（如 useQuotationAPI）
│   ├── components/                # 模块内部可复用组件
│   ├── modals/                    # 模块相关弹窗（如编辑、报价）
│   ├── pages/                     # 模块页面（用于挂载路由）
│   ├── store/                     # 状态管理（如 useQuotationStore）
│   ├── types/                     # 模块专属类型定义
│   └── index.ts                   # 可选导出模块统一出口
│
├── customer/                     # 客户管理模块
│   ├── ...
│
├── order/                        # 订单管理模块
│   ├── ...
│
└── ...                           # 其他业务模块
```

---

## 📁 /components — 全局可复用组件

```plaintext
components/
├── BaseButton.tsx
├── DataTable.tsx
├── ConfirmDialog.tsx
└── ...
```

特点：

- 与任何特定业务无关
- 封装常用 UI 元素
- 被多个 feature 调用

---

## 📁 /layout — 应用布局组件

```plaintext
layout/
├── DashboardLayout.tsx
├── AuthLayout.tsx
└── PageHeader.tsx
```

---

## 📁 /lib — 基础工具库

```plaintext
lib/
├── axios.ts              # axios 实例和拦截器
├── formSchema.ts         # 公共表单校验规则
├── hooks/                # 通用 Hook
│   └── useDebounce.ts
└── ...
```

---

## 📁 /pages — 页面路由入口（懒加载 feature 页面）

```plaintext
pages/
├── index.tsx             # 重定向或主页
├── quotation.tsx         # 懒加载 features/quotation/pages
├── customer.tsx
└── ...
```

---

## 📁 /store — 全局状态（项目范围）

```plaintext
store/
├── themeStore.ts         # 主题切换
├── languageStore.ts      # 多语言
├── authStore.ts          # 登录状态
└── ...
```

---

## 📁 /types — 全局通用类型定义

```plaintext
types/
├── user.ts               # UserType, RoleType 等
├── permission.ts
└── ...
```

---

## 📁 /utils — 通用工具函数

```plaintext
utils/
├── formatDate.ts
├── formatCurrency.ts
├── downloadFile.ts
└── ...
```

---

## 📁 /assets — 项目静态资源

```plaintext
assets/
├── images/
│   └── logo.png
├── fonts/
├── icons/
└── ...
```

---

## ✅ 模块内结构说明（以 quotation 为例）

```plaintext
features/quotation/
├── pages/QuotationListPage.tsx           # 询价列表
├── pages/QuotationDetailPage.tsx         # 询价详情
├── modals/QuotationCreateModal.tsx       # 创建询价弹窗
├── modals/QuotationEditModal.tsx         # 编辑询价弹窗
├── modals/QuotationQuoteModal.tsx        # 填写报价弹窗
├── components/QuotePrices.tsx            # 报价阶梯组件
├── components/AdditionalFees.tsx         # 附加费用表单
├── api/quotation.api.ts                  # 所有 API 请求封装
├── store/quotation.store.ts              # Zustand 或 Redux slice
└── types/quotation.types.ts              # 询价相关类型定义
```

---

## 🧩 开发建议

- 所有组件优先归属到所在 feature 中
- 跨模块可复用组件才放到 `/components`
- 强制每个 feature 自带自己的 `store/`、`types/`、`api/`、`components/`，即使目前内容很少
- 模块类型定义不要污染全局 `types/`，避免命名冲突

---
