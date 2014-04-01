//  If we've updated pixi or p2 then their UMD wrappers will be wrong, this will fix it:
module.exports = {
    pixi: {
        src: ['src/pixi/Outro.js'],
        dest: 'src/pixi/Outro.js',
        replacements: [{
            from: "define(PIXI);",
            to: "define('PIXI', (function() { return root.PIXI = PIXI; })() );"
        }]
    },

    p2: {
        src: ['src/physics/p2/p2.js'],
        dest: 'src/physics/p2/p2.js',
        replacements: [{
            from: '!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.p2=e():"undefined"!=typeof global?self.p2=e():"undefined"!=typeof self&&(self.p2=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){',
            to: '!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(\'p2\', (function() { return this.p2 = e(); })()):"undefined"!=typeof window?window.p2=e():"undefined"!=typeof global?self.p2=e():"undefined"!=typeof self&&(self.p2=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){'
        }]
    }
};
