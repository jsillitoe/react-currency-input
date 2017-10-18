import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import peerDeps from 'rollup-plugin-peer-deps-external';

const format = process.env.NODE_ENV;
const isUmd = format === 'umd';
const file = `lib/react-currency-input.${isUmd ? 'min' : format}.js`

const config = {
    input: './src/index.js',
    name: 'react-currency-input',
    sourcemap: true,
    output: {
        file,
        format,
    },
    plugins: [
        peerDeps(),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        buble({
            objectAssign: 'Object.assign',
            exclude: ['node_modules/**'],
        }),
        commonjs(),
    ],
};

isUmd && config.plugins.push(uglify(), filesize());

export default config;
