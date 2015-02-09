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
            from: '!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.p2=e():"undefined"!=typeof global?global.p2=e():"undefined"!=typeof self&&(self.p2=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){',
            to: '!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(\'p2\', (function() { return this.p2 = e(); })()):"undefined"!=typeof window?window.p2=e():"undefined"!=typeof global?self.p2=e():"undefined"!=typeof self&&(self.p2=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){'
        }]
    },

    docs: {
        src: ['docs/index.html'],
        dest: 'docs/index.html',
        replacements: [
            {
                from: /<p><img src="http:\/\/www.phaser.io\/images\/github\/welcome-div2.png" alt="div"><\/p>/g,
                to: ''
            },
            {
                from: /<p><img src="http:\/\/www.phaser.io\/images\/github\/div.png" alt="div"><\/p>/g,
                to: ''
            },
            {
                from: /&lt;div align=&quot;center&quot;&gt;&lt;img src=&quot;http:\/\/phaser.io\/images\/github\/news.jpg&quot;&gt;&lt;\/div&gt;/g,
                to: ''
            },
            {
                from: /&lt;div align=&quot;center&quot;&gt;&lt;img src=&quot;http:\/\/phaser.io\/images\/github\/books.jpg&quot;&gt;&lt;\/div&gt;/g,
                to: ''
            },
            {
                from: /&lt;div align=&quot;center&quot;&gt;&lt;img src=&quot;http:\/\/phaser.io\/images\/github\/books.jpg&quot;&gt;&lt;\/div&gt;/g,
                to: ''
            },
            {
                from: /(<p><img src="http:\/\/www\.phaser\.io\/images\/phaser2)[\s\S]*(<li><a href="#license">License<\/a><\/li>\s<\/ul>)/g,
                to: ''
            },
            {
                from: /(<!--<h1 class="page-title">Index<\/h1>-->)[\s\S]*(<\/section>\s*<\/div>\s*<div class="clearfix"><\/div>\s*<footer>)/g,
                to: '</article></div><div class="clearfix"></div><footer>'
            },
            {
                from: /(<p>&lt;).*(&gt;<\/p>)/g,
                to: ''
            },
            {
                from: '<a href="http://phaser.io/images/github/shot1a.jpg">![Game</a>][game1]',
                to: '<img src="http://phaser.io/images/github/shot1a.jpg">'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot2a.jpg">![Game</a>][game2]',
                to: '<img src="http://phaser.io/images/github/shot2a.jpg"><br>'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot3a.jpg">![Game</a>][game3]',
                to: '<img src="http://phaser.io/images/github/shot3a.jpg">'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot4a.jpg">![Game</a>][game4]',
                to: '<img src="http://phaser.io/images/github/shot4a.jpg"><br>'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot5b.jpg">![Game</a>][game5]',
                to: '<img src="http://phaser.io/images/github/shot5b.jpg">'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot6b.jpg">![Game</a>][game6]',
                to: '<img src="http://phaser.io/images/github/shot6b.jpg">'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot7b.jpg">![Game</a>][game7]',
                to: '<img src="http://phaser.io/images/github/shot7b.jpg"><br>'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot8.jpg">![Game</a>][game8]',
                to: '<img src="http://phaser.io/images/github/shot8.jpg">'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot9.jpg">![Game</a>][game9]',
                to: '<img src="http://phaser.io/images/github/shot9.jpg"><br>'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot10.jpg">![Game</a>][game10]',
                to: '<img src="http://phaser.io/images/github/shot10.jpg">'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot11.jpg">![Game</a>][game11]',
                to: '<img src="http://phaser.io/images/github/shot11.jpg"><br>'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot12.jpg">![Game</a>][game12]',
                to: '<img src="http://phaser.io/images/github/shot12.jpg">'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot13.jpg">![Game</a>][game13]',
                to: '<img src="http://phaser.io/images/github/shot13.jpg">'
            },
            {
                from: '<a href="http://phaser.io/images/github/shot14.jpg">![Game</a>]<a href="http://www.tempalabs.com/works/gattai/">game14</a>',
                to: '<img src="http://phaser.io/images/github/shot14.jpg">'
            }
        ]
    },

    phasertsdefheader: {
        src: ['typescript/phaser.comments.d.ts'],
        dest: 'typescript/phaser.comments.d.ts',
        replacements: [{
            from: 'path="pixi.d.ts"',
            to: 'path="pixi.comments.d.ts"'
        }]
    }
};
