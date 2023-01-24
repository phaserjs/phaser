/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Mesh = require('../mesh/Mesh');
var GenerateGridVerts = require('../../geom/mesh/GenerateGridVerts');
var Between = require('../../math/Between');
var DegToRad = require('../../math/DegToRad');

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
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 */
var Plane = new Class({

    Extends: Mesh,

    initialize:

    function Plane (scene, x, y, texture, width, height)
    {
        Mesh.call(this, scene, x, y, texture);

        GenerateGridVerts({
            mesh: this,
            widthSegments: width,
            heightSegments: height,
            isOrtho: false,
            tile: false,
            flipY: false
        });

        this.type = 'Plane';

        this.hideCCW = false;

        //  TODO

        //  Set width/height and grid size in constructor (width/height = texture size)
        //  Use uvScale for tiling
        //  Functions for x rotation to fixed angles

        // this.modelRotation.x = -0.75;

        //  works for equal sized images?

        //  fov = 45 = 0.7853981633974483

        this.setPerspective(800 / 98, 600 / 167);

        // this.setPerspective(800/128, 600/128);
        // this.setPerspective(800/256, 600/256);

        //  98 x 167 (ratio? 0.5868)
        // this.panZ(8.75);

        // this.panZ(167 / (2 * Math.tan(DegToRad(45))));
        // this.panZ((167/98) / (0.5 * Math.tan(DegToRad(45 / 2))));
        // this.panZ(((167 / 98) / 2) / (1 * Math.tan(DegToRad(45 / 2))) * 2);

        var aspect = 600 / 800; // 0.75
        var fov = 0.7853981633974483; // 45
        var dist = 8.75;

        this.panZ((167 / 2) / (Math.tan(fov / 2) + dist));

        //  128x128 (with perspective 128)
        // this.panZ(11.3);

        //  256x256
        // this.panZ(5.65);

        // this.check();

        // this.width = 256;
        // this.height = 256;

        //  renderer height
        // this.panZ(600 / (1 * Math.tan(Math.PI / 2)));
    },

    check: function (color1, color2)
    {
        if (color1 === undefined) { color1 = 0xffffff; }
        if (color2 === undefined) { color2 = 0x0000ff; }

        var gl = this.scene.sys.renderer.gl;

        var glTexture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0);

        gl.bindTexture(gl.TEXTURE_2D, glTexture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        //  Let's assume 16x16 for our texture size and 8x8 cell size

        var colors = [];

        for (var h = 0; h < 16; h++)
        {
            for (var w = 0; w < 16; w++)
            {
                if ((h < 8 && w < 8) || (h > 7 && w > 7))
                {
                    colors.push(255, 255, 255, 255);
                }
                else
                {
                    colors.push(0, 0, 255, 255);
                }
            }
        }

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(colors));

        glTexture.isAlphaPremultiplied = true;
        glTexture.isRenderTexture = false;
        glTexture.width = 16;
        glTexture.height = 16;

        var texture = this.scene.sys.textures.addGLTexture('plane', glTexture, 16, 16);

        gl.bindTexture(gl.TEXTURE_2D, null);

        this.setTexture(texture);

        return texture;
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
    }

});

module.exports = Plane;
