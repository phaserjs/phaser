/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Texture = require('./Texture');

/**
 * @classdesc
 * [description]
 *
 * @class CanvasTexture
 * @extends Phaser.Textures.Texture
 * @memberOf Phaser.Textures
 * @constructor
 * @since 3.6.1
 *
 * @param {Phaser.Textures.TextureManager} manager - A reference to the Texture Manager this Texture belongs to.
 * @param {string} key - The unique string-based key of this Texture.
 * @param {HTMLCanvasElement} source - The source that is used to create the texture. Usually an Image, but can also be a Canvas.
 * @param {number} [width] - The width of the Texture. This is optional and automatically derived from the source images.
 * @param {number} [height] - The height of the Texture. This is optional and automatically derived from the source images.
 */
var CanvasTexture = new Class({

    Extends: Texture,

    initialize:

    function CanvasTexture (manager, key, source, width, height)
    {
        Texture.call(this, manager, key, source, width, height);

        this._texture = this.frames['__BASE'].source;

        this.canvas = this._texture.image;

        this.context = this.canvas.getContext('2d');

        this.width = width;

        this.height = height;
    },

    /**
     * This should be called manually if you are running under WebGL.
     * It will refresh the WebGLTexture from the Canvas source. Only call this if you know that the
     * canvas has changed, as there is a significant GPU texture allocation cost involved in doing so.
     *
     * @method Phaser.Textures.CanvasTexture#refresh
     * @since 3.6.1
     *
     * @return {Phaser.Textures.CanvasTexture} This CanvasTexture.
     */
    refresh: function ()
    {
        this._texture.update();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.CanvasTexture#getCanvas
     * @since 3.6.1
     *
     * @return {HTMLCanvasElement} The Canvas DOM element this texture is using.
     */
    getCanvas: function ()
    {
        return this.canvas;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.CanvasTexture#getContext
     * @since 3.6.1
     *
     * @return {HTMLCanvasElement} The Canvas DOM element this texture is using.
     */
    getContext: function ()
    {
        return this.context;
    },

});

module.exports = CanvasTexture;
