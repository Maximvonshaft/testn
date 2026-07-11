# Material Studio 商业生产级官网设计规格 v0.6

**状态：** 设计规格，待业务确认后进入实施计划  
**日期：** 2026-07-11  
**关联：** Issue #17；Golden Wall 原型 Issue #15 / Draft PR #16  
**范围：** 商业定位、客户旅程、信息架构、内容治理、产品数据、转化、信任、技术生产化与发布验收

---

## 1. 产品定义

Material Studio 官网不是“产品目录加一张互动图”，也不是“全屏材料编辑器”。它是一个面向全球 B2B 项目客户的商业决策系统：

```text
品牌定位
+ 产品系统导航
+ 空间材料预览
+ 项目与技术证据
+ 资料获取
+ 询盘与销售路由
+ 可运营的内容和数据后台
```

### 1.1 商业北极星

> **Composite Surface Systems for Commercial and Residential Spaces**  
> 面向商业及住宅空间的复合表面系统。

公司对外不是泛化的 PVC/WPC 板材供应商，而是提供可组合、可安装、可交付、可支持项目落地的空间表面系统。

### 1.2 核心产品系统

1. Wall Systems
2. Wet Area Systems
3. Door–Wall–Cabinet Systems
4. Outdoor Decking
5. Ceiling Systems
6. Trim & Accessories
7. Aroma Layer

### 1.3 官网的四个商业目标

1. 在五秒内说明公司是谁、提供什么、服务谁。
2. 让不同客户快速进入与其决策任务匹配的路径。
3. 用可验证的产品、项目、技术和工厂证据建立信任。
4. 把浏览行为转换为可跟踪、可分配、可跟进的商业线索。

### 1.4 明确非目标

- 首页不是完整编辑器。
- 不在客户界面展示 regression test、0 modified pixels、demo code 等内部研发语言。
- 不允许配置工厂无法生产的材料、Profile、尺寸或应用组合。
- 不制造认证、性能、产能、质保或 SKU。
- Golden Wall 建筑落位未验收前，不扩展 Floor、Ceiling、Trim、Door-Wall 渲染。

---

## 2. 目标客户与决策任务

### 2.1 建筑师 / 室内设计师

**要完成的任务：** 找到合适的材料和系统，验证空间效果，获取规格、颜色、节点、CAD/BIM、样品。  
**核心证据：** 材质真实性、系统兼容性、技术资料、项目案例。  
**主 CTA：** Open Material Studio / Download Specification / Request Sample。

### 2.2 酒店、住宅及商业项目业主

**要完成的任务：** 判断方案是否适合项目、是否有质量和交付保障、预算和周期是否可控。  
**核心证据：** 项目案例、质量体系、交付流程、质保和项目支持。  
**主 CTA：** Talk to Project Team / Ask for Quote。

### 2.3 承包商 / 安装商

**要完成的任务：** 确认安装方法、基层要求、收边节点、损耗、工具、维护。  
**核心证据：** 安装指南、节点图、配件、培训和现场支持。  
**主 CTA：** Download Installation Guide / Request Technical Support。

### 2.4 经销商 / 进口商

**要完成的任务：** 判断产品线、市场适配、利润空间、起订量、包装、区域合作和销售支持。  
**核心证据：** 产品体系、包装物流、市场资料、经销支持政策。  
**主 CTA：** Become a Distributor / Request Commercial Catalogue。

### 2.5 OEM / ODM 采购团队

**要完成的任务：** 判断工厂能力、质量一致性、定制边界、打样、产能、交期、付款与出口能力。  
**核心证据：** 工厂、工艺、质量检查、实验室、包装、审厂资料。  
**主 CTA：** Submit OEM/ODM Enquiry / Book Factory Review。

---

## 3. 品牌与信息表达

### 3.1 品牌承诺

**核心承诺：** 用一套完整、协调、可实施的表面系统，帮助项目团队更快完成材料选择和空间落地。

### 3.2 消息层级

#### 公司级

- What: Composite Surface Systems
- For whom: Hospitality, residential and commercial projects
- Value: Coordinated materials, profiles, installation and project support
- Proof: Projects, technical data, quality evidence, factory capability

#### 产品级

- 系统解决什么空间问题
- 可用材料 / Profile / 规格
- 适用和不适用范围
- 安装与收边方法
- 可下载资料
- 样品与项目支持

#### Material Studio 级

- Preview materials in an architectural context
- Compare material, profile and finish
- Save a project configuration
- Request the exact sample and specification package

### 3.3 禁止的客户可见表达

- Demo code
- Scene-aligned demo
- Exact plane
- Outside-wall invariant
- 0 modified pixels
- Verified by regression test
- 未经证据支持的绝对性能声明

内部质量证据保留在 QA、Release Note 和后台，不进入销售首屏。

---

## 4. 信息架构

### 4.1 一级导航

```text
Home
Systems
Material Studio
Projects
Technology & Quality
Resources
About
Contact
```

### 4.2 Systems

```text
Systems
├── Wall Systems
├── Wet Area Systems
├── Door–Wall–Cabinet
├── Outdoor Decking
├── Ceiling Systems
├── Trim & Accessories
└── Aroma Layer
```

### 4.3 Resources

```text
Resources
├── Catalogues
├── Technical Data Sheets
├── Installation Guides
├── CAD / BIM
├── Test Reports
├── Warranty & Care
└── Sample Request
```

### 4.4 用户路径

#### 设计师路径

Home → Systems / Material Studio → 配置方案 → 下载规格 / 申请样品 → 项目线索

#### 项目业主路径

Home → Project Applications → Projects → Technology & Quality → Ask for Quote

#### 经销商路径

Home → Systems → Factory & Supply → Distributor Programme → 商业线索

#### 承包商路径

System Detail → Installation → Trim & Accessories → Technical Support

---

## 5. 首页结构

首页必须服务商业理解和下一步决策，Material Studio 作为差异化模块嵌入其中。

### 5.1 Section 1 — Hero

**目标：** 五秒内说明公司、产品和客户价值。  
**推荐文案：**

> **Composite surfaces engineered for complete spaces.**  
> Coordinated wall, wet-area, ceiling, decking and integrated door systems for hospitality, residential and commercial projects.

**CTA：**

- Explore Systems
- Open Material Studio
- Request Project Support

**视觉：** 高质量空间应用图，不在 Hero 内堆叠复杂编辑器控件。

### 5.2 Section 2 — Product System Navigator

七个产品系统卡片。每张卡必须展示：应用场景、系统价值、入口，而非只放产品照片。

### 5.3 Section 3 — Material Studio Preview

展示一处已经通过建筑落位验收的 Golden Wall 交互。

客户可见功能：

- 选择材料
- 选择 Profile
- 选择 Finish
- 对比原始与配置结果
- 保存方案
- 下载规格
- 申请对应样品

禁止展示内部测试指标。

### 5.4 Section 4 — Applications

- Hospitality
- Residential
- Retail
- Office
- Bathroom / Wet Area
- Outdoor

每个入口连接到有真实内容的场景页或案例集合。

### 5.5 Section 5 — System Technology

以结构图和安装节点解释：基材、表面层、Profile、收边、连接方式、适用基层。

### 5.6 Section 6 — Trust & Quality

只展示有证据的内容：

- 生产流程
- 质量检查点
- 测试报告
- 认证
- 包装与装柜
- 项目支持

若证据未准备，不显示数字或结论，使用“Documentation available on request”也必须有可提供的文件。

### 5.7 Section 7 — Projects

每个案例至少包含：

- 国家 / 城市
- 项目类型
- 使用系统
- 材料与 Profile
- 面积（有依据时）
- 客户问题
- 解决方案
- 施工或完工图

### 5.8 Section 8 — Resources

突出 Catalogue、TDS、Installation、CAD/BIM、Test Report、Warranty。

### 5.9 Section 9 — Conversion

按意图分流：

- Request Sample
- Ask for Quote
- Talk to Project Team
- Become a Distributor

---

## 6. Material Studio 产品规则

### 6.1 正式角色

Material Studio 是“空间化产品选择器”，不是通用图像编辑器。它必须连接真实产品数据和真实销售流程。

### 6.2 Golden Wall 建筑真实性标准

一个配置状态只有满足全部要求才可发布：

1. 材质只影响批准的建筑面。
2. 顶部有真实收口或暗缝。
3. 底部有踢脚、收边或落地阴影。
4. 左右边界存在可解释的压边、退缝或厚度关系。
5. 纹理比例与板材规格一致。
6. Profile 的宽度、凹槽和阴影与真实产品一致。
7. 材质受场景环境光、阴影和反射影响。
8. 无明显镜像、重复纹理和发光屏效果。
9. Desktop、Tablet、Mobile 保持同一几何关系。
10. 原图与配置图可在同一坐标系中对比。

### 6.3 配置兼容性

前端不得自由组合所有选项。配置由 Compatibility Matrix 控制：

```text
System
→ Material
→ Colour / Pattern
→ Profile
→ Finish
→ Thickness
→ Width / Height
→ Application
→ Installation Method
```

每个组合必须有 `available / unavailable / made-to-order / evidence-required` 状态。

### 6.4 配置代码

正式配置代码必须来自产品主数据，不允许前端临时拼接“demo code”。代码至少能唯一定位：系统、材料、花色、Profile、Finish、尺寸和版本。

---

## 7. 内容与证据治理

### 7.1 声明分类

| 类型 | 示例 | 发布规则 |
|---|---|---|
| 已验证事实 | 尺寸、厚度、测试等级 | 必须关联来源文件和版本 |
| 营销描述 | 温暖木纹、柔和哑光 | 不可伪装成测试结论 |
| 适用建议 | 适合酒店客房墙面 | 需产品和安装负责人确认 |
| 待验证 | 防火、VOC、抗菌、户外耐候 | 不得公开发布为事实 |

### 7.2 内容责任

- Product Owner：产品名称、结构、规格、兼容性
- Quality Owner：测试、认证、报告有效期
- Commercial Owner：MOQ、交期、区域供应、经销政策
- Brand Owner：文案、图片、案例和发布一致性
- Web Admin：权限、审核、版本和回滚

### 7.3 证据对象

每项证据应记录：标题、类型、适用产品、签发机构、报告编号、签发日期、有效期、文件、公开级别、负责人、复核日期。

---

## 8. 商业转化与 CRM

### 8.1 CTA 数据要求

所有表单至少记录：

- Request type
- Name
- Company
- Email / Phone
- Country
- Customer role
- Project type
- Project area
- Purchase timeline
- Selected system / configuration
- Source page
- UTM / campaign
- Consent and privacy version

### 8.2 路由

```text
Lead submitted
→ validation / anti-spam
→ CRM record
→ country + customer-type routing
→ assigned owner
→ confirmation email
→ SLA timer
→ status and outcome tracking
```

### 8.3 基本 SLA

- 自动确认：提交后立即
- 工作日首次响应：由商业团队定义，网站显示可兑现的承诺
- 未分配线索：进入异常队列
- 重复线索：合并而不是静默丢弃

---

## 9. 视觉系统

### 9.1 原则

- 高端感来自比例、空间、材料真实性和内容克制，不只是黑金配色。
- 正文优先可读性，辅助文字不得以 8–9px 作为常规产品信息字号。
- 交互控件最小触控尺寸 44×44px。
- 对比度满足 WCAG 2.2 AA 的基本要求。
- 摄影和渲染图使用统一色温、镜头语言和后期标准。

### 9.2 设计令牌

正式实施需定义：颜色、字体、字号、行高、间距、圆角、阴影、动效、断点、层级和状态。

### 9.3 Material Studio 视觉规则

- 中心场景是主视觉，不被过多标签和技术徽章污染。
- 控件分层：Material → Profile → Finish → Specification。
- 高级参数按需展开，不在首屏同时出现。
- Original / Configured 对比必须清楚但不遮挡空间。

---

## 10. 技术生产架构

### 10.1 推荐栈

```text
Next.js 或 Astro
+ Headless CMS
+ Product Data Service
+ Object Storage / CDN
+ CRM Integration
+ Analytics / Consent Management
+ Error Monitoring
+ CI/CD + Preview + Rollback
```

### 10.2 前端要求

- SSR/SSG 支持 SEO
- 响应式图片和 AVIF/WebP
- 路由级代码拆分
- 关键资源预加载
- 错误边界和降级
- 无障碍键盘操作
- 浏览器兼容矩阵

### 10.3 后端要求

- 服务端表单验证
- CSRF / spam / rate limit
- CRM 重试和幂等
- 审计日志
- 数据保留与删除策略
- 机密配置不进入前端

### 10.4 发布要求

- HTTPS、CDN、正式域名
- Preview / Staging / Production
- 自动化测试
- 性能预算
- 错误监控和报警
- 可回滚部署
- 数据和内容备份

---

## 11. SEO、性能、无障碍与安全

### 11.1 SEO

- 每个产品系统和应用有独立可索引页面
- 结构化数据：Organization、Product、Article、Breadcrumb、FAQ（真实内容）
- Canonical、sitemap、robots、Open Graph
- 图片 alt 和语义标题层级

### 11.2 性能预算

生产目标：

- LCP ≤ 2.5s（75th percentile）
- INP ≤ 200ms
- CLS ≤ 0.1
- 首屏关键 JS 严格控制
- Material Studio 非首屏资源延迟加载

### 11.3 无障碍

- WCAG 2.2 AA 基线
- 键盘可操作
- 可见焦点
- 表单错误可读
- 不仅依赖颜色表达状态
- Reduced Motion 支持

### 11.4 安全与隐私

- CSP、HSTS、X-Content-Type-Options、Referrer Policy
- 表单限流和反自动化
- 隐私政策和同意记录
- Cookie 分类管理
- 最小化收集个人数据

---

## 12. 分阶段实施边界

### Phase A — 商业与内容基线

- 品牌定位和消息层级
- Sitemap
- 页面模板
- 产品数据和证据治理
- CTA / CRM 合约

### Phase B — Homepage Production Shell

- Hero
- Systems
- Applications
- Trust
- Projects
- Resources
- Conversion
- Material Studio 预览占位

### Phase C — Golden Wall Production Module

- 重做建筑收口和材质真实性
- 接入真实产品兼容性和代码
- 保存、分享、下载和样品链路

### Phase D — Content and Operations

- CMS
- 产品页
- 项目页
- 技术资料
- 多语言和内容审核

### Phase E — Production Release

- CRM、Analytics、SEO、Accessibility、Security、Monitoring
- 多浏览器 / 多设备验收
- Staging 和回滚演练

---

## 13. 发布验收门槛

### 13.1 商业

- 5 秒内可识别公司、产品和主 CTA
- 每个主要客户类型有明确路径
- 所有 CTA 有真实终点和责任人

### 13.2 内容

- 不存在 demo code、测试术语或虚假导航
- 公开声明均有证据或被移除
- 产品组合经过兼容性校验

### 13.3 视觉

- Golden Wall 无悬浮、超高、发光屏和边界冲突
- 文字在标准笔记本和手机上可读
- 所有页面符合统一设计系统

### 13.4 技术

- Core Web Vitals 达标
- 无严重可访问性错误
- 表单、CRM 和邮件链路通过端到端测试
- 错误监控和回滚可用
- 安全头、隐私和同意流程通过检查

---

## 14. 当前原型的决策

1. 保留当前黑金高端方向，但提高正文可读性。
2. 保留 Material / Profile / Finish 的核心交互。
3. 删除客户可见的内部 QA 文案。
4. Golden Wall 继续作为单一黄金样板，但必须重做顶部、底部、左右收口、环境光和纹理比例。
5. 当前本地 Python + JSONL 只保留为开发工具，不进入生产架构。
6. 不在该规格确认前继续堆叠更多场景或表面。

---

## 15. 规格自审结果

- 无未完成占位符。
- 未验证的工厂事实没有被写成公开声明。
- 商业目标、信息架构、数据、转化和技术边界一致。
- 范围可独立形成一个实施计划，不与 Golden Wall 图像资产修复混为一个不可审查任务。
