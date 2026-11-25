import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * vitest の設定。
 * tsconfig.json の paths（@/* → ./*）と同じ別名をテストでも使えるようにする。
 */
export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./', import.meta.url)),
        },
    },
});
