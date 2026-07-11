# Material Studio 首页生产蓝图 v0.6

本文件把商业规格转换成首页可执行的内容和交互结构。它不是视觉稿，也不包含前端实现。

## 页面目标

1. 五秒内完成品牌和产品认知。
2. 让访客进入产品系统、应用、Material Studio 或项目支持。
3. 在请求样品和报价之前提供足够的产品与信任证据。

## 首屏顺序

### 01 Hero

**H1**  
Composite surfaces engineered for complete spaces.

**Subhead**  
Coordinated wall, wet-area, ceiling, decking and integrated door systems for hospitality, residential and commercial projects.

**Primary CTA** Explore Systems  
**Secondary CTA** Open Material Studio  
**Tertiary CTA** Request Project Support

**视觉要求**

- 一张真实、完整、可解释的空间应用图。
- 不在 Hero 放完整编辑器。
- 不显示内部工程指标或 demo 标记。
- Hero 图片必须有明确产品系统关联。

### 02 System Navigator

七张卡：Wall、Wet Area、Door–Wall–Cabinet、Outdoor Decking、Ceiling、Trim & Accessories、Aroma Layer。

每张卡包含：

- 系统名称
- 一句话价值
- 主要应用
- Explore System

### 03 Material Studio Preview

**Headline** Preview materials in an architectural context.  
**Body** Compare material, profile and finish on a verified project surface, then save the exact configuration for samples and specification support.

**交互限制**

- 只展示已验收的 Golden Wall。
- 默认展示一个商业上合理的方案，不以过亮白板作为首屏默认。
- 控件不超过 Material、Profile、Finish、Compare。
- 规格和高级参数进入详情层。

**CTA** Open Full Studio / Request This Sample

### 04 Applications

Hospitality、Residential、Retail、Office、Wet Area、Outdoor。

每张应用卡连接到：相关系统、项目案例、推荐产品和资料。

### 05 Why the System Works

四个可验证的价值点：

- Coordinated surfaces and profiles
- Installation and trim compatibility
- Project specification support
- Documented quality and testing

禁止使用无报告支持的性能结论。

### 06 Project Evidence

展示 3–6 个真实案例。若尚无成熟项目资料，宁可减少数量，也不使用虚构客户和数字。

### 07 Technology & Quality

展示生产、质量检查、结构和测试文件入口。每个证据链接到明确对象。

### 08 Resources

Catalogue、Technical Data、Installation、CAD/BIM、Test Reports、Warranty & Care。

### 09 Conversion

四个意图卡：

- Request a Sample
- Ask for a Project Quote
- Speak to Technical Support
- Become a Distributor

每个 CTA 使用不同字段和路由，不共用一个泛化联系表单。

### 10 Footer

- Systems
- Applications
- Resources
- Company
- Contact
- Privacy / Cookies / Terms
- Social / Region / Language（真实可用时）

## 客户可见文案替换表

| 当前原型 | 生产版处理 |
|---|---|
| Golden Wall System | Material Studio / Featured Wall System |
| Replace the wall. Nothing else moves. | 可作为模块副标题，不作为公司级定位 |
| Outside-wall invariant | 删除 |
| 0 modified pixels | 删除 |
| Verified by regression test | 删除 |
| Scene-aligned demo | 删除 |
| demo code | 替换为真实产品代码；未确认时不显示 |
| Specification only | 展示真实规格和可选范围 |

## 首页验收

- 1366×768 首屏能看到 H1、价值、主 CTA 和系统或 Material Studio 的下一入口。
- 正文不以 8–9px 作为常规字号。
- 所有导航均有真实目标页面或暂不发布。
- 所有 CTA 有可追踪事件和后端终点。
- Material Studio 加载失败时，首页仍能浏览其他商业内容。
