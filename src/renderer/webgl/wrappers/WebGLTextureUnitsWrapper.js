/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @classdesc
 * A wrapper for the WebGLRenderingContext's texture units.
 * It tracks which textures are bound to which units, and provides
 * binding utilities.
 *
 * @class WebGLTextureUnitsWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 */
var WebGLTextureUnitsWrapper = new Class({

    initialize:

    function WebGLTextureUnitsWrapper (renderer)
    {
        /**
         * The WebGLRenderer instance that owns this wrapper.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureUnitsWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The list of texture units available to the WebGLRenderingContext.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureUnitsWrapper#units
         * @type {Array<Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper|null>}
         * @since 4.0.0
         */
        this.units = [];

        /**
         * List of the indexes of available texture units.
         * Used in setting uniforms.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLTextureUnitsWrapper#unitIndices
         * @type {number[]}
         * @since 4.0.0
         */
        this.unitIndices = [];

        this.init();
    },

    /**
     * Initializes the texture units to `null`. The active texture unit
     * will be 0 after this runs.
     *
     * This populates every texture unit with a 1x1 texture.
     * This stops WebGL errors on MacOS.
     * These textures are not wrapped, and are not intended to be used,
     * so the texture units are recorded as null.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLTextureUnitsWrapper#init
     * @since 4.0.0
     */
    init: function ()
    {
        var gl = this.renderer.gl;

        this.units.length = 0;
        this.unitIndices.length = 0;

        // Create a reusable 1x1 texture for all units.
        var tempTexture = gl.createTexture();
        for (var unit = this.renderer.maxTextures - 1; unit >= 0; unit--)
        {
            // Leave the units undefined, so they can be set to null.
            this.units[unit] = undefined;
            this.renderer.glWrapper.updateBindingsActiveTexture({
                bindings:
                {
                    activeTexture: unit
                }
            });
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);

            // Enumerate the texture units.
            this.unitIndices[unit] = unit;
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([ 0, 0, 255, 255 ]));
    },

    /**
     * Binds a texture to a texture unit.
     *
     * This will change the active texture unit to the given unit,
     * unless `forceActive` is false.
     *
     * This should be the only way to bind a texture to a unit.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLTextureUnitsWrapper#bind
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper|null} texture - The texture to bind, or null to unbind the unit.
     * @param {number} unit - The texture unit to bind the texture to.
     * @param {boolean} [force=false] - If true, it will bind the texture even if it is already bound.
     * @param {boolean} [forceActive=true] - If true, it will change the active texture unit to the given unit even if it is already active. Otherwise, it will only change the active texture unit if it is not already active.
     */
    bind: function (texture, unit, force, forceActive)
    {
        var needsBind = this.units[unit] !== texture;
        if (force || (forceActive !== false) || needsBind)
        {
            this.renderer.glWrapper.updateBindingsActiveTexture({
                bindings:
                {
                    activeTexture: unit
                }
            }, force);
        }
        if (!needsBind && !force) { return; }
        this.units[unit] = texture;
        var glTexture = texture ? texture.webGLTexture : null;
        var gl = this.renderer.gl;
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
    },

    /**
     * Set specific texture units to specific textures.
     *
     * The active texture unit may change to accommodate the bindings.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLTextureUnitsWrapper#bindUnits
     * @since 4.0.0
     * @param {Array<Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper|null|undefined>} textures - The textures to bind. Null values will be unbound. Undefined values will be skipped.
     * @param {boolean} [force=false] - If true, it will bind all textures, even if they are already bound.
     */
    bindUnits: function (textures, force)
    {
        var length = Math.min(textures.length, this.renderer.maxTextures);
        for (var i = length - 1; i >= 0; i--)
        {
            if (textures[i] !== undefined)
            {
                this.bind(textures[i], i, force, false);
            }
        }
    },

    unbindTexture: function (texture)
    {
        for (var i = this.units.length - 1; i >= 0; i--)
        {
            if (this.units[i] === texture)
            {
                this.bind(null, i, true, false);
            }
        }
    },

    /**
     * Unbinds all textures from all texture units.
     * This will change the active texture unit to 0.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLTextureUnitsWrapper#unbindAllUnits
     * @since 4.0.0
     */
    unbindAllUnits: function ()
    {
        for (var i = this.units.length - 1; i >= 0; i--)
        {
            this.bind(null, i, true, false);
        }
    }
});

module.exports = WebGLTextureUnitsWrapper;
