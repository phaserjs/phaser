/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Global consts.
 * 
 * @ignore
 */

var CONST = {

    /**
     * Phaser Release Version
     * 
     * @name Phaser.VERSION
     * @readonly
     * @type {string}
     * @since 3.0.0
     */
    VERSION: '3.16.2',

    BlendModes: require('./renderer/BlendModes'),

    ScaleModes: require('./renderer/ScaleModes'),

    /**
     * AUTO Detect Renderer.
     * 
     * @name Phaser.AUTO
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    AUTO: 0,

    /**
     * Canvas Renderer.
     * 
     * @name Phaser.CANVAS
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    CANVAS: 1,

    /**
     * WebGL Renderer.
     * 
     * @name Phaser.WEBGL
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    WEBGL: 2,

    /**
     * Headless Renderer.
     * 
     * @name Phaser.HEADLESS
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    HEADLESS: 3,

    /**
     * In Phaser the value -1 means 'forever' in lots of cases, this const allows you to use it instead
     * to help you remember what the value is doing in your code.
     * 
     * @name Phaser.FOREVER
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    FOREVER: -1,

    /**
     * Direction constant.
     * 
     * @name Phaser.NONE
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    NONE: 4,

    /**
     * Direction constant.
     * 
     * @name Phaser.UP
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    UP: 5,

    /**
     * Direction constant.
     * 
     * @name Phaser.DOWN
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    DOWN: 6,

    /**
     * Direction constant.
     * 
     * @name Phaser.LEFT
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    LEFT: 7,

    /**
     * Direction constant.
     * 
     * @name Phaser.RIGHT
     * @readonly
     * @type {integer}
     * @since 3.0.0
     */
    RIGHT: 8

};

module.exports = CONST;
