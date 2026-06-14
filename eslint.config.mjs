// eslint.config.mjs
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import es5Plugin from 'eslint-plugin-es5';
import { fixupPluginRules } from '@eslint/compat';

const projectGlobals = {
    WEBGL_RENDERER: 'writable',
    CANVAS_RENDERER: 'writable',
    Phaser: 'writable',
    process: 'writable',
    ActiveXObject: 'writable'
};

const es5Rules = {
    'es5/no-arrow-functions': 'error',
    'es5/no-binary-and-octal-literals': 'error',
    'es5/no-block-scoping': 'error',
    'es5/no-classes': 'error',
    'es5/no-computed-properties': 'error',
    'es5/no-default-parameters': 'error',
    'es5/no-destructuring': 'error',
    'es5/no-for-of': 'error',
    'es5/no-generators': 'error',
    'es5/no-modules': 'error',
    'es5/no-object-super': 'error',
    'es5/no-rest-parameters': 'error',
    'es5/no-shorthand-properties': 'error',
    'es5/no-spread': 'error',
    'es5/no-template-literals': 'error',
    'es5/no-typeof-symbol': 'error',
    'es5/no-unicode-code-point-escape': 'error',
    'es5/no-unicode-regex': 'error'
};

const phaserRules = {
    'no-cond-assign': [ 'error', 'except-parens' ],
    'no-duplicate-case': [ 'error' ],
    'no-unused-vars': [ 'error', { args: 'none', caughtErrors: 'none' } ],

    'accessor-pairs': 'error',
    curly: 'error',
    eqeqeq: [ 'error', 'smart' ],
    'no-alert': 'error',
    'no-caller': 'error',
    'no-console': [ 'error', { allow: [ 'warn', 'log' ] } ],
    'no-floating-decimal': 'error',
    'no-invalid-this': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-redeclare': 'error',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    yoda: [ 'error', 'never' ],

    'array-bracket-spacing': [ 'error', 'always' ],
    'block-spacing': [ 'error', 'always' ],
    'brace-style': [ 'error', 'allman', { allowSingleLine: true } ],
    camelcase: 'error',
    'comma-dangle': [ 'error', 'never' ],
    'comma-style': [ 'error', 'last' ],
    'computed-property-spacing': [ 'error', 'never' ],
    'consistent-this': [ 'error', '_this' ],
    'eol-last': [ 'error' ],
    'func-call-spacing': [ 'error', 'never' ],
    indent: [ 'error', 4, { SwitchCase: 1 } ],
    'key-spacing': [ 'error', { beforeColon: false, afterColon: true } ],
    'keyword-spacing': [ 'error', { after: true } ],
    'linebreak-style': [ 'off' ],
    'lines-around-comment': [
        'error',
        {
            beforeBlockComment: true,
            afterBlockComment: false,
            beforeLineComment: true,
            afterLineComment: false,
            allowBlockStart: true,
            allowBlockEnd: false,
            allowObjectStart: true,
            allowArrayStart: true
        }
    ],
    'new-parens': 'error',
    'no-constant-condition': 'off',
    'no-array-constructor': 'error',
    'no-lonely-if': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-plusplus': 'off',
    'no-prototype-builtins': 'off',
    'no-trailing-spaces': [
        'error',
        {
            skipBlankLines: true,
            ignoreComments: true
        }
    ],
    'no-underscore-dangle': 'off',
    'no-whitespace-before-property': 'error',
    'object-curly-newline': [
        'error',
        {
            multiline: true,
            minProperties: 0,
            consistent: true
        }
    ],
    'one-var-declaration-per-line': [ 'error', 'initializations' ],
    'quote-props': [ 'error', 'as-needed' ],
    quotes: [ 'error', 'single' ],
    'semi-spacing': [ 'error', { before: false, after: true } ],
    semi: [ 'error', 'always' ],
    'space-before-blocks': 'error',
    'space-before-function-paren': 'error',
    'space-in-parens': [ 'error', 'never' ],
    'space-infix-ops': [ 'error', { int32Hint: true } ],
    'wrap-regex': 'error',
    'spaced-comment': [
        'error',
        'always',
        {
            block: {
                balanced: true,
                exceptions: [ '*', '!' ]
            }
        }
    ],
    'no-irregular-whitespace': [ 'error', { skipComments: true } ],
    'no-extra-semi': 'error',
    'no-useless-assignment': 'off',
    'no-constant-binary-expression': 'off'
};

export default defineConfig([
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'coverage/**',
            'src/phaser-esm.js',
            'src/phaser-arcade-physics.js',
            'src/physics/matter-js/lib/**',
            'src/physics/matter-js/poly-decomp/**',
            'src/polyfills/**',
            'src/renderer/webgl/shaders/**',
            'src/geom/polygon/Earcut.js',
            'src/utils/array/StableSort.js',
            'src/utils/object/Extend.js',
            'src/structs/RTree.js',
            'plugins/spine/dist/**',
            'plugins/spine/src/runtimes/**',
            'scripts/**'
        ]
    },

    js.configs.recommended,

    {
        files: [ '**/*.js' ],

        languageOptions: {
            ecmaVersion: 6,
            sourceType: 'commonjs',
            globals: {
                ...globals.browser,
                ...globals.es2015,
                ...globals.commonjs,
                ...projectGlobals
            }
        },

        plugins: {
            es5: fixupPluginRules(es5Plugin)
        },

        rules: {
            ...es5Rules,
            ...phaserRules
        }
    }
]);
