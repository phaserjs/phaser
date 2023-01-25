/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GenerateGridVerts = require('../../geom/mesh/GenerateGridVerts');
var IntegerToRGB = require('../../display/color/IntegerToRGB');
var Mesh = require('../mesh/Mesh');
var UUID = require('../../utils/string/UUID');

/**
 * @classdesc
 * Experimental
 *
 * @class Plane
 * @extends Phaser.GameObjects.Mesh
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Plane = new Class({

    Extends: Mesh,

    initialize:

    function Plane (scene, x, y, texture, frame, width, height, tile)
    {
        if (!texture) { texture = '__DEFAULT'; }
        if (width === undefined) { width = 8; }
        if (height === undefined) { height = 8; }
        if (tile === undefined) { tile = false; }

        Mesh.call(this, scene, x, y, texture, frame);

        var flipY = false;

        if (tile)
        {
            flipY = true;
        }

        GenerateGridVerts({
            mesh: this,
            widthSegments: width,
            heightSegments: height,
            isOrtho: false,
            tile: tile,
            flipY: flipY
        });

        this.type = 'Plane';

        this.hideCCW = false;

        this._checkerboard = null;

        this.setSizeToFrame();
        this.setViewHeight();

        // this.modelRotation.x = -0.75;
    },

    setSizeToFrame: function ()
    {
        this.setPerspective(this.width / this.frame.width, this.height / this.frame.height);

        if (this._checkerboard && this._checkerboard !== this.texture)
        {
            this.removeCheckerboard();
        }
    },

    setViewHeight: function (value)
    {
        if (value === undefined) { value = this.frame.height; }

        var vFOV = this.fov * (Math.PI / 180);

        this.viewPosition.z = (this.height / value) / (Math.tan(vFOV / 2));

        this.dirtyCache[10] = 1;
    },

    createCheckerboard: function (color1, color2, alpha1, alpha2, height)
    {
        if (color1 === undefined) { color1 = 0xffffff; }
        if (color2 === undefined) { color2 = 0x0000ff; }
        if (alpha1 === undefined) { alpha1 = 255; }
        if (alpha2 === undefined) { alpha2 = 255; }
        if (height === undefined) { height = 128; }

        var gl = this.scene.sys.renderer.gl;

        var glTexture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(gl.TEXTURE_2D, glTexture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        //  Let's assume 16x16 for our texture size and 8x8 cell size

        var c1 = IntegerToRGB(color1);
        var c2 = IntegerToRGB(color2);

        var colors = [];

        for (var h = 0; h < 16; h++)
        {
            for (var w = 0; w < 16; w++)
            {
                if ((h < 8 && w < 8) || (h > 7 && w > 7))
                {
                    colors.push(c1.r, c1.g, c1.b, alpha1);
                }
                else
                {
                    colors.push(c2.r, c2.g, c2.b, alpha2);
                }
            }
        }

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(colors));

        glTexture.isAlphaPremultiplied = true;
        glTexture.isRenderTexture = false;
        glTexture.width = 16;
        glTexture.height = 16;

        var texture = this.scene.sys.textures.addGLTexture(UUID(), glTexture, 16, 16);

        this.removeCheckerboard();

        this._checkerboard = texture;

        gl.bindTexture(gl.TEXTURE_2D, null);

        this.setTexture(texture);

        this.setSizeToFrame();

        this.setViewHeight(height);

        return this;
    },

    uvScroll: function (x, y)
    {
        var faces = this.faces;

        for (var i = 0; i < faces.length; i++)
        {
            faces[i].scrollUV(x, y);
        }
    },

    uvScale: function (x, y)
    {
        var faces = this.faces;

        for (var i = 0; i < faces.length; i++)
        {
            faces[i].scaleUV(x, y);
        }
    },

    removeCheckerboard: function ()
    {
        if (this._checkerboard)
        {
            this._checkerboard.destroy();

            this._checkerboard = null;
        }
    },

    /**
     * Handles the pre-destroy step for the Plane, which removes the vertices and debug callbacks.
     *
     * @method Phaser.GameObjects.Plane#preDestroy
     * @private
     * @since 3.60.0
     */
    preDestroy: function ()
    {
        this.clear();
        this.removeCheckerboard();

        this.debugCallback = null;
        this.debugGraphic = null;
    }

});

module.exports = Plane;
