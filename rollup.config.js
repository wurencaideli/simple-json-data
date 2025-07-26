import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import packageJson from './package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function resolvePath(path_) {
    return path.join(__dirname, path_);
}

const name = 'simple-json-data';
const version = packageJson.version;
const banner = `/*!
 * simple-json-data v${version}
 * Copyright ${new Date().getFullYear()} wuzhanggui https://github.com/wurencaideli
 * Licensed under MIT
 */
`;

export default {
    input: resolvePath('./src/simple-json-data.ts'),
    output: [
        {
            file: resolvePath(`./dist/${name}.esm.js`),
            format: 'esm',
            sourcemap: true,
            banner,
        },
        {
            file: resolvePath(`./dist/${name}.cjs.js`),
            format: 'cjs',
            sourcemap: true,
            banner,
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json', declaration: true }),
        terser(),
    ],
};
