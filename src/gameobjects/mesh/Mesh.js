/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var MeshRender = require('./MeshRender');
var NOOP = require('../../utils/NOOP');

/**
 * @classdesc
 * A Mesh Game Object.
 *
 * @class Mesh
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number[]} vertices - An array containing the vertices data for this Mesh.
 * @param {number[]} uv - An array containing the uv data for this Mesh.
 * @param {number[]} colors - An array containing the color data for this Mesh.
 * @param {number[]} alphas - An array containing the alpha data for this Mesh.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Mesh = new Class({

    Extends: GameObject,

    Mixins: [
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        MeshRender
    ],

    initialize:

    function Mesh (scene, x, y, vertices, uv, colors, alphas, texture, frame)
    {
        GameObject.call(this, scene, 'Mesh');

        if (vertices.length !== uv.length)
        {
            throw new Error('Mesh Vertex count must match UV count');
        }

        var verticesUB = (vertices.length / 2) | 0;

        if (colors.length > 0 && colors.length < verticesUB)
        {
            throw new Error('Mesh Color count must match Vertex count');
        }

        if (alphas.length > 0 && alphas.length < verticesUB)
        {
            throw new Error('Mesh Alpha count must match Vertex count');
        }

        var i;

        if (colors.length === 0)
        {
            for (i = 0; i < verticesUB; ++i)
            {
                colors[i] = 0xFFFFFF;
            }
        }

        if (alphas.length === 0)
        {
            for (i = 0; i < verticesUB; ++i)
            {
                alphas[i] = 1.0;
            }
        }

        /**
         * An array containing the vertices data for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#vertices
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertices = new Float32Array(vertices);

        /**
         * An array containing the uv data for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#uv
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.uv = new Float32Array(uv);

        /**
         * An array containing the color data for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#colors
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.colors = new Uint32Array(colors);

        /**
         * An array containing the alpha data for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#alphas
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.alphas = new Float32Array(alphas);

        /**
         * Fill or additive mode used when blending the color values?
         * 
         * @name Phaser.GameObjects.Mesh#tintFill
         * @type {boolean}
         * @default false
         * @since 3.11.0
         */
        this.tintFill = false;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.initPipeline();
    },

    /**
     * This method is left intentionally empty and does not do anything.
     * It is retained to allow a Mesh or Quad to be added to a Container.
     * 
     * @method Phaser.GameObjects.Mesh#setAlpha
     * @since 3.17.0
     */
    setAlpha: NOOP

});

module.exports = Mesh;
