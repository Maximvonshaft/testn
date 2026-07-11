# Material Studio 内容与产品数据模型 v0.6

## 1. System

```yaml
id: stable-id
slug: wall-systems
name: Wall Systems
short_value: string
long_description: rich-text
applications: [application-id]
materials: [material-id]
profiles: [profile-id]
installation_methods: [installation-id]
compatible_trims: [trim-id]
resources: [resource-id]
claims: [claim-id]
status: draft|review|published|retired
owner: user-id
revision: integer
```

## 2. Material

```yaml
id: stable-id
official_code: string
name: string
family: wood|stone|solid|metal|other
pattern: string
base_material: string
tone: warm|neutral|cool
finish_options: [finish-id]
compatible_profiles: [profile-id]
compatible_systems: [system-id]
applications_allowed: [application-id]
applications_not_allowed: [application-id]
image_assets: [asset-id]
technical_properties: [property-value]
claims: [claim-id]
sample_available: boolean
status: draft|review|published|retired
```

## 3. Profile

```yaml
id: stable-id
official_code: string
name: string
geometry:
  width_mm: number
  depth_mm: number
  pitch_mm: number|null
  drawing_asset: asset-id
compatible_materials: [material-id]
compatible_systems: [system-id]
installation_methods: [installation-id]
status: draft|review|published|retired
```

## 4. Product Variant / Sellable Configuration

```yaml
id: stable-id
sku: string
system_id: system-id
material_id: material-id
profile_id: profile-id
finish_id: finish-id
colour_id: colour-id
thickness_mm: number
width_mm: number
height_mm: number
availability: standard|made-to-order|unavailable
markets: [country-code]
moq: evidence-required commercial field
lead_time: evidence-required commercial field
packaging_id: packaging-id
revision: integer
```

## 5. Compatibility Rule

```yaml
id: stable-id
system_id: system-id
conditions:
  material_ids: []
  profile_ids: []
  finish_ids: []
  dimensions: []
  applications: []
result: available|made-to-order|unavailable|evidence-required
reason_customer_visible: string
internal_note: string
owner: user-id
```

## 6. Project Case

```yaml
id: stable-id
slug: string
title: string
country: country-code
city: string|null
project_type: hospitality|residential|retail|office|wet-area|outdoor
systems: [system-id]
variants: [variant-id]
area_m2: number|null
challenge: rich-text
solution: rich-text
outcome: rich-text
images: [asset-id]
permission_status: approved|restricted
published_at: datetime
```

## 7. Claim

```yaml
id: stable-id
statement: string
claim_type: technical|commercial|marketing|application
scope: [system-id|material-id|variant-id]
evidence_ids: [evidence-id]
public_status: approved|internal-only|blocked
owner: user-id
review_date: date
```

## 8. Evidence

```yaml
id: stable-id
type: certification|test-report|factory-record|quality-procedure|warranty
issuer: string
reference_number: string
issue_date: date
expiry_date: date|null
scope: [system-id|material-id|variant-id]
file_asset: asset-id
public_level: public|on-request|internal
owner: user-id
```

## 9. Resource

```yaml
id: stable-id
type: catalogue|tds|installation|cad|bim|test-report|warranty|care
language: locale
markets: [country-code]
related_objects: [id]
file_asset: asset-id
version: string
published_at: datetime
review_date: date
```

## 10. Material Studio Scene

```yaml
id: stable-id
name: string
application: application-id
base_asset: asset-id
surfaces:
  - id: feature-wall
    geometry_version: string
    allowed_systems: [system-id]
    allowed_variants: [variant-id]
    default_variant: variant-id
    render_assets: [render-state-id]
status: draft|qa|published|retired
```

## 11. Render State

```yaml
id: stable-id
scene_id: scene-id
surface_id: feature-wall
variant_id: variant-id
asset: asset-id
geometry_version: string
lighting_version: string
qa:
  boundary_pass: boolean
  construction_pass: boolean
  texture_scale_pass: boolean
  mobile_pass: boolean
approved_by: user-id
approved_at: datetime
```

## 12. Lead

```yaml
id: uuid
request_type: sample|quote|technical-support|distributor|oem-odm
contact:
  name: string
  company: string
  email: string
  phone: string|null
  country: country-code
role: string
project:
  type: string|null
  area_m2: number|null
  purchase_timeline: string|null
configuration:
  scene_id: string|null
  surface_id: string|null
  variant_id: string|null
  configuration_code: string|null
source:
  page_url: string
  referrer: string|null
  utm: object
consent:
  accepted: boolean
  privacy_version: string
routing:
  assigned_team: string|null
  assigned_owner: string|null
  status: new|assigned|contacted|qualified|closed
created_at: datetime
```

## 数据治理规则

1. `official_code`、SKU 和技术属性只能由产品负责人发布。
2. Claim 没有批准证据时，前端不得展示。
3. Scene Render State 必须引用 Product Variant，不能只引用视觉名称。
4. 兼容性规则是配置器的唯一真相来源。
5. 资源文件必须有版本、语言、关联对象和复核日期。
6. 删除或退役产品不能破坏历史项目和线索记录。
