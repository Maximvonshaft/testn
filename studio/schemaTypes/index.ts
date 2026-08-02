import { defineArrayMember, defineField, defineType } from 'sanity';

const localizedText = defineType({
  name: 'localizedText', title: 'Localized text', type: 'object', fields: [
    defineField({ name: 'en', title: 'English', type: 'text' }),
    defineField({ name: 'de', title: 'German', type: 'text' }),
    defineField({ name: 'fr', title: 'French', type: 'text' }),
    defineField({ name: 'cnr', title: 'Montenegrin', type: 'text' }),
  ],
});

const material = defineType({
  name: 'materialFinish', title: 'Material finish', type: 'document', fields: [
    defineField({ name: 'name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (rule) => rule.required() }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: 'description', type: 'localizedText' }),
    defineField({ name: 'products', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'productSystem' }] })] }),
  ],
});

const productSystem = defineType({
  name: 'productSystem', title: 'Product system', type: 'document', fields: [
    defineField({ name: 'name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (rule) => rule.required() }),
    defineField({ name: 'title', type: 'localizedText' }),
    defineField({ name: 'description', type: 'localizedText' }),
    defineField({ name: 'desktopScene', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'mobileScene', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'materials', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'materialFinish' }] })] }),
  ],
});

const technicalDocument = defineType({
  name: 'technicalDocument', title: 'Technical document', type: 'document', fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'documentType', type: 'string', options: { list: ['TDS', 'DoP', 'EPD', 'Test report', 'Installation guide', 'Other'] } }),
    defineField({ name: 'productCode', type: 'string' }),
    defineField({ name: 'markets', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'file', type: 'file', validation: (rule) => rule.required() }),
    defineField({ name: 'verifiedAt', type: 'datetime' }),
  ],
});

const project = defineType({
  name: 'project', title: 'Project', type: 'document', fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'summary', type: 'localizedText' }),
    defineField({ name: 'images', type: 'array', of: [defineArrayMember({ type: 'image', options: { hotspot: true } })] }),
    defineField({ name: 'systems', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'productSystem' }] })] }),
    defineField({ name: 'publishApproved', type: 'boolean', initialValue: false }),
  ],
});

const siteCopy = defineType({
  name: 'siteCopy', title: 'Site copy', type: 'document', fields: [
    defineField({ name: 'locale', type: 'string', options: { list: ['en', 'de', 'fr', 'cnr'] }, validation: (rule) => rule.required() }),
    defineField({ name: 'meta', type: 'object', fields: [defineField({ name: 'title', type: 'string' }), defineField({ name: 'description', type: 'text' })] }),
    defineField({ name: 'editorNotes', type: 'text', description: 'Publishing requires business and technical verification.' }),
  ],
});

export const schemaTypes = [localizedText, material, productSystem, technicalDocument, project, siteCopy];
