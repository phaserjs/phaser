/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
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

        this.type = 'Plane';

        /**
         * The Animation State component of this Sprite.
         *
         * This component provides features to apply animations to this Sprite.
         * It is responsible for playing, loading, queuing animations for later playback,
         * mixing between animations and setting the current animation frame to this Sprite.
         *
         * @name Phaser.GameObjects.Sprite#anims
         * @type {Phaser.Animations.AnimationState}
         * @since 3.0.0
         */
        this.anims = new AnimationState(this);

        this._gridWidth = width;
        this._gridHeight = height;
        this._gridTile = tile;
        this._checkerboard = null;

        this.hideCCW = false;

        this.setGridSize(width, height, tile);
        this.setSizeToFrame(false);
        this.setViewHeight();
    },

    /**
     * Update this Sprite's animations.
     *
     * @method Phaser.GameObjects.Sprite#preUpdate
     * @protected
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        Mesh.prototype.preUpdate.call(this, time, delta);

        this.anims.update(time, delta);
    },

    setGridSize: function (width, height, tile)
    {
        if (width === undefined) { width = 8; }
        if (height === undefined) { height = 8; }
        if (tile === undefined) { tile = false; }

        var flipY = false;

        if (tile)
        {
            flipY = true;
        }

        this.clear();

        GenerateGridVerts({
            mesh: this,
            widthSegments: width,
            heightSegments: height,
            isOrtho: false,
            tile: tile,
            flipY: flipY
        });

        return this;
    },

    setSizeToFrame: function (resetUV)
    {
        if (resetUV === undefined) { resetUV = true; }

        this.setPerspective(this.width / this.frame.width, this.height / this.frame.height);

        if (this._checkerboard && this._checkerboard !== this.texture)
        {
            this.removeCheckerboard();
        }

        //  Reset UV coordinates if frame has changed
        if (!resetUV)
        {
            return;
        }

        var gridX = this._gridWidth;
        var gridY = this._gridHeight;

        var verts = this.vertices;
        var frame = this.frame;

        var frameU0 = frame.u0;
        var frameU1 = frame.u1;
        var frameV0 = frame.v0;
        var frameV1 = frame.v1;

        var x;
        var y;
        var i = 0;

        if (this._gridTile)
        {
            //  flipY
            frameV0 = frame.v1;
            frameV1 = frame.v0;

            for (y = 0; y < gridY; y++)
            {
                for (x = 0; x < gridX; x++)
                {
                    verts[i++].setUVs(frameU0, frameV1);
                    verts[i++].setUVs(frameU0, frameV0);
                    verts[i++].setUVs(frameU1, frameV1);
                    verts[i++].setUVs(frameU0, frameV0);
                    verts[i++].setUVs(frameU1, frameV0);
                    verts[i++].setUVs(frameU1, frameV1);
                }
            }
        }
        else
        {
            var gridX1 = gridX + 1;
            var gridY1 = gridY + 1;

            var frameU = frameU1 - frameU0;
            var frameV = frameV1 - frameV0;

            var uvs = [];

            for (y = 0; y < gridY1; y++)
            {
                for (x = 0; x < gridX1; x++)
                {
                    var tu = frameU0 + frameU * (x / gridX);
                    var tv = frameV0 + frameV * (y / gridY);

                    uvs.push(tu, tv);
                }
            }

            for (y = 0; y < gridY; y++)
            {
                for (x = 0; x < gridX; x++)
                {
                    var a = (x + gridX1 * y) * 2;
                    var b = (x + gridX1 * (y + 1)) * 2;
                    var c = ((x + 1) + gridX1 * (y + 1)) * 2;
                    var d = ((x + 1) + gridX1 * y) * 2;

                    verts[i++].setUVs(uvs[a], uvs[a + 1]);
                    verts[i++].setUVs(uvs[b], uvs[b + 1]);
                    verts[i++].setUVs(uvs[d], uvs[d + 1]);
                    verts[i++].setUVs(uvs[b], uvs[b + 1]);
                    verts[i++].setUVs(uvs[c], uvs[c + 1]);
                    verts[i++].setUVs(uvs[d], uvs[d + 1]);
                }
            }
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

    removeCheckerboard: function ()
    {
        if (this._checkerboard)
        {
            this._checkerboard.destroy();

            this._checkerboard = null;
        }
    },

    play: function (key, ignoreIfPlaying)
    {
        return this.anims.play(key, ignoreIfPlaying);
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

        this.anims.destroy();

        this.anims = undefined;

        this.debugCallback = null;
        this.debugGraphic = null;
    }

});

module.exports = Plane;
