import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
    name: 'friends-of-all',
    title: 'Friends of All Salon',
    projectId: '71cj8uqf',
    dataset: 'production',
    plugins: [structureTool(), visionTool()],
    schema: {
        types: schemaTypes
    }
});
