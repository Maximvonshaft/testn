import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID is required to run or build AQUASTONE Studio.');
}

export default defineConfig({
  name: 'aquastone',
  title: 'AQUASTONE Content Studio',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
