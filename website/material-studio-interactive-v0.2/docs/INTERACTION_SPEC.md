# Interaction Specification

## Surface selection

Selecting a surface:

- highlights the corresponding spatial region
- applies the current texture to that region
- updates the current scheme summary
- keeps only relevant visitor-facing parameters visible

## Pattern

Changes the visible material pattern and the configuration code.

## Profile

Selects the panel shape/profile. In the MVP it changes profile state and configuration code; production v0.3 should render a perspective-aware relief or use pre-rendered profile variants.

## Tone

Adjusts the visual temperature of the scene and selected surface.

## Finish

Controls overlay opacity and highlight behavior for matte, satin and soft-gloss states.

## Aroma

Controls:

- aroma visual motif
- atmosphere animation intensity
- scheme summary
- configuration code

Aroma may be disabled with `None`.

## Dimension

Controls the panel dimension included in the scheme and specification output.

## Modes

### Design
Standard surface composition.

### Layer
Darkens the scene and presents the material layer stack.

### Install
Plays a simplified align-lock-finish sequence.

### Aroma
Emphasizes the selected aroma atmosphere layer.

## Conversion actions

- Save scheme: browser localStorage
- Request sample: lead form dialog
- Download spec: client-side JSON export
- Ask for quote: project enquiry dialog
- Copy code: clipboard
