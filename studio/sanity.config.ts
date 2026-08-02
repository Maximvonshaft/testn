import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'replace-me';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'aquastone',
  title: 'AQUASTONE Content Studio',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
