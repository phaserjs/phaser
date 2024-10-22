/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Mask Filter Controller.
 *
 * This filter controller manages a mask effect.
 *
 * A mask uses a texture to hide parts of an input.
 * It multiplies the color and alpha of the input
 * by the alpha of the mask in the corresponding texel.
 *
 * Masks can be inverted, which switches what they hide and what they show.
 *
 * Masks can use either a texture or a GameObject.
 * If a GameObject is used, the mask will render the GameObject
 * to a DynamicTexture and use that.
 * The mask will automatically update when the GameObject changes,
 * unless the `autoUpdate` flag is set to `false`.
 *
 * When the mask filter is used as an internal filter,
 * the mask will match the object/view being filtered.
 * This is useful for creating effects that follow the object,
 * such as effects intended to match an animated sprite.
 *
 * When the mask filter is used as an external filter,
 * the mask will match the context of the camera.
 * This is useful for creating effects that cover the entire view.
 *
 * A Mask effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * const texture = 'MyMask';
 *
 * camera.filters.internal.addMask(texture);
 * camera.filters.external.addMask(texture);
 * ```
 *
 * @class Mask
 * @memberof Phaser.Filters
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {string|Phaser.GameObjects.GameObject} [mask='__WHITE'] - The source of the mask. This can be a unique string-based key of the texture to use for the mask, which must exist in the Texture Manager. Or it can be a GameObject, in which case the mask will render the GameObject to a DynamicTexture and use that.
 * @param {boolean} [invert=false] - Whether to invert the mask.
 */
var Mask = new Class({
    Extends: Controller,

    initialize: function Mask (camera, mask, invert)
    {
        if (mask === undefined) { mask = '__WHITE'; }
        if (invert === undefined) { invert = false; }

        Controller.call(this, camera, 'FilterMask');

        /**
         * The underlying texture used for the mask.
         *
         * @name Phaser.Filters.Mask#glTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 3.90.0
         */
        this.glTexture;

        /**
         * The dynamic texture used for the mask.
         * This is only set if the mask is a GameObject.
         *
         * @name Phaser.Filters.Mask#_dynamicTexture
         * @type {Phaser.Textures.DynamicTexture}
         * @private
         * @since 3.90.0
         * @default null
         */
        this._dynamicTexture = null;

        /**
         * The GameObject used for the mask.
         * This is only set if the mask is a GameObject.
         *
         * @name Phaser.Filters.Mask#maskGameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.90.0
         * @default null
         */
        this.maskGameObject = null;

        /**
         * Whether to invert the mask.
         * An inverted mask switches what it hides and what it shows.
         *
         * @name Phaser.Filters.Mask#invert
         * @type {boolean}
         * @since 3.90.0
         * @default false
         */
        this.invert = invert;

        /**
         * Whether the mask should automatically update.
         * This only applies when the mask is a GameObject.
         * If `false`, the mask will not change even if the GameObject changes.
         *
         * @name Phaser.Filters.Mask#autoUpdate
         * @type {boolean}
         * @since 3.90.0
         * @default true
         */
        this.autoUpdate = true;

        /**
         * Whether the mask needs updating, once.
         * This only applies when the mask is a GameObject.
         * If `true`, the mask will be updated before the next render.
         * This is automatically set to `true` when the mask is a GameObject,
         * but it turns off after the mask is updated.
         *
         * @name Phaser.Filters.Mask#needsUpdate
         * @type {boolean}
         * @since 3.90.0
         * @default false
         */
        this.needsUpdate = false;

        if (typeof mask === 'string')
        {
            this.setTexture(mask);
        }
        else
        {
            this.setGameObject(mask);
        }
    },

    /**
     * Updates the DynamicTexture for the mask.
     * The DynamicTexture is created or resized if necessary.
     * This is called automatically during rendering
     * when the mask is a GameObject
     * and the `needsUpdate` or `autoUpdate` flags are set.
     * It should not be called directly.
     *
     * @method Phaser.Filters.Mask#updateDynamicTexture
     * @since 3.90.0
     * @param {number} width - The width of the DynamicTexture.
     * @param {number} height - The height of the DynamicTexture
     */
    updateDynamicTexture: function (width, height)
    {
        var gameObject = this.maskGameObject;

        if (!gameObject)
        {
            return;
        }

        var textureManager = this.camera.scene.sys.textures;

        if (!this._dynamicTexture)
        {
            this._dynamicTexture = textureManager.addDynamicTexture('', width, height);
        }
        else if (this._dynamicTexture.width !== width || this._dynamicTexture.height !== height)
        {
            this._dynamicTexture.setSize(width, height);
        }
        else
        {
            this._dynamicTexture.clear();
        }
        
        this.glTexture = this._dynamicTexture.get().glTexture;

        // Draw the GameObject to the DynamicTexture.
        this._dynamicTexture.draw(gameObject);
        this._dynamicTexture.render();

        this.needsUpdate = false;
    },

    /**
     * Sets the GameObject used for the mask.
     *
     * @method Phaser.Filters.Mask#setGameObject
     * @since 3.90.0
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject to use for the mask.
     * @returns {this} This Filter Controller.
     */
    setGameObject: function (gameObject)
    {
        this.maskGameObject = gameObject;
        this.needsUpdate = true;

        // `_dynamicTexture` will be generated at render time,
        // using the camera of the current context.
        // The camera which owns this filter is only the correct camera
        // if this filter is being used as an internal filter.

        return this;
    },

    /**
     * Sets the texture used for the mask.
     *
     * @method Phaser.Filters.Mask#setTexture
     * @since 3.90.0
     * @param {string} [texture='__WHITE'] - The unique string-based key of the texture to use for displacement, which must exist in the Texture Manager.
     * @returns {this} This Filter Controller.
     */
    setTexture: function (texture)
    {
        var phaserTexture = this.camera.scene.sys.textures.getFrame(texture);

        if (phaserTexture)
        {
            this.maskGameObject = null;
            this.glTexture = phaserTexture.glTexture;
        }

        return this;
    },

    destroy: function ()
    {
        if (this._dynamicTexture)
        {
            this._dynamicTexture.destroy();
        }

        this.maskGameObject = null;
        this._dynamicTexture = null;

        Controller.prototype.destroy.call(this);
    }
});

module.exports = Mask;
