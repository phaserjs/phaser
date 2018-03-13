/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = {

    /**
     * Phaser Release Version
     * 
     * @name Phaser.VERSION
     * @type {string}
     * @since 3.0.0
     */
    VERSION: '3.3.0',

    BlendModes: require('./renderer/BlendModes'),

    ScaleModes: require('./renderer/ScaleModes'),

    /**
     * AUTO Detect Renderer.
     * 
     * @name Phaser.AUTO
     * @type {integer}
     * @since 3.0.0
     */
    AUTO: 0,

    /**
     * Canvas Renderer.
     * 
     * @name Phaser.CANVAS
     * @type {integer}
     * @since 3.0.0
     */
    CANVAS: 1,

    /**
     * WebGL Renderer.
     * 
     * @name Phaser.WEBGL
     * @type {integer}
     * @since 3.0.0
     */
    WEBGL: 2,

    /**
     * Headless Renderer.
     * 
     * @name Phaser.HEADLESS
     * @type {integer}
     * @since 3.0.0
     */
    HEADLESS: 3,

    /**
     * In Phaser the value -1 means 'forever' in lots of cases, this const allows you to use it instead
     * to help you remember what the value is doing in your code.
     * 
     * @name Phaser.FOREVER
     * @type {integer}
     * @since 3.0.0
     */
    FOREVER: -1,

    /**
     * Direction constant.
     * 
     * @name Phaser.NONE
     * @type {integer}
     * @since 3.0.0
     */
    NONE: 4,

    /**
     * Direction constant.
     * 
     * @name Phaser.UP
     * @type {integer}
     * @since 3.0.0
     */
    UP: 5,

    /**
     * Direction constant.
     * 
     * @name Phaser.DOWN
     * @type {integer}
     * @since 3.0.0
     */
    DOWN: 6,

    /**
     * Direction constant.
     * 
     * @name Phaser.LEFT
     * @type {integer}
     * @since 3.0.0
     */
    LEFT: 7,

    /**
     * Direction constant.
     * 
     * @name Phaser.RIGHT
     * @type {integer}
     * @since 3.0.0
     */
    RIGHT: 8

};

module.exports = CONST;
