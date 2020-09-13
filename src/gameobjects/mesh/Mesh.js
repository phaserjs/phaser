/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var GameObjectEvents = require('../events');
var MeshRender = require('./MeshRender');

/**
 * @classdesc
 * A Mesh Game Object.
 *
 * The Mesh object is WebGL only and does not have a Canvas counterpart.
 *
 * The Mesh origin is always 0.5 x 0.5 and cannot be changed.
 *
 * @class Mesh
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
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
 * @param {number[]} uvs - An array containing the uv data for this Mesh.
 * @param {number[]} [indicies] - An array containing the vertex indicies for this Mesh.
 * @param {number|number[]} [colors] - An array containing the color data for this Mesh.
 * @param {number|number[]} [alphas] - An array containing the alpha data for this Mesh.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Mesh = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
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

    function Mesh (scene, x, y, vertices, uvs, indicies, colors, alphas, texture, frame)
    {
        GameObject.call(this, scene, 'Mesh');

        /**
         * The Animation State of this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#anims
         * @type {Phaser.Animation.AnimationState}
         * @since 3.50.0
         */
        this.anims = new AnimationState(this);

        /**
         * An array containing the vertices data for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#vertices
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertices;

        /**
         * An array containing the uv data for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#uv
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.uv;

        /**
         * An array containing the color data for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#colors
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.colors;

        /**
         * An array containing the alpha data for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#alphas
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.alphas;

        /**
         * The tint fill mode.
         *
         * 0 = An additive tint (the default), where vertices colors are blended with the texture.
         * 1 = A fill tint, where the vertices colors replace the texture, but respects texture alpha.
         * 2 = A complete tint, where the vertices colors replace the texture, including alpha, entirely.
         *
         * @name Phaser.GameObjects.Mesh#tintFill
         * @type {integer}
         * @since 3.11.0
         */
        this.tintFill = 0;

        /**
         * You can optionally choose to render the vertices of this Mesh to a Graphics instance.
         *
         * Achieve this by setting the `debugCallback` and the `debugGraphic` properties.
         *
         * You can do this in a single call via the `Mesh.setDebug` method, which will use the
         * built-in debug function. You can also set it to your own callback. The callback
         * will be invoked _once per render_ and sent the following parameters:
         *
         * `debugCallback(src, meshLength, verts)`
         *
         * `src` is the Mesh instance being debugged.
         * `meshLength` is the number of mesh vertices in total.
         * `verts` is an array of the translated vertex coordinates.
         *
         * To disable rendering, set this property back to `null`.
         *
         * @name Phaser.GameObjects.Mesh#debugCallback
         * @type {function}
         * @since 3.50.0
         */
        this.debugCallback = null;

        /**
         * The Graphics instance that the debug vertices will be drawn to, if `setDebug` has
         * been called.
         *
         * @name Phaser.GameObjects.Mesh#debugGraphic
         * @type {Phaser.GameObjects.Graphics}
         * @since 3.50.0
         */
        this.debugGraphic = null;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setVertices(vertices, uvs, indicies, colors, alphas);
        this.initPipeline();

        this.on(GameObjectEvents.ADDED_TO_SCENE, this.addedToScene, this);
        this.on(GameObjectEvents.REMOVED_FROM_SCENE, this.removedFromScene, this);
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    setVertices: function (vertices, uvs, indicies, colors, alphas)
    {
        if (colors === undefined) { colors = 0xffffff; }
        if (alphas === undefined) { alphas = 1; }

        if (vertices.length !== uvs.length)
        {
            throw new Error('Mesh - vertices and uv count not equal');
        }

        if (Array.isArray(indicies))
        {
            var verticesFull = [];
            var uvsFull = [];

            for (var i = 0; i < indicies.length; i++)
            {
                var index = indicies[i] * 2;

                verticesFull.push(vertices[index], vertices[index + 1]);
                uvsFull.push(uvs[index], uvs[index + 1]);
            }

            vertices = verticesFull;
            uvs = uvsFull;
        }

        var halfVerts = Math.floor(vertices.length / 2);

        if (!Array.isArray(colors))
        {
            var tempColor = colors;

            colors = [];

            for (var c = 0; c < halfVerts; c++)
            {
                colors.push(tempColor);
            }
        }

        if (!Array.isArray(alphas))
        {
            var tempAlpha = alphas;

            alphas = [];

            for (var a = 0; a < halfVerts; a++)
            {
                alphas.push(tempAlpha);
            }
        }

        this.vertices = new Float32Array(vertices);
        this.uv = new Float32Array(uvs);
        this.colors = new Uint32Array(colors);
        this.alphas = new Float32Array(alphas);

        return this;
    },

    /**
     * This method enables rendering of the Mesh vertices to the given Graphics instance.
     *
     * If you enable this feature, you **must** call `Graphics.clear()` in your Scene `update`,
     * otherwise the Graphics instance you provide to debug will fill-up with draw calls,
     * eventually crashing the browser. This is not done automatically to allow you to debug
     * draw multiple Mesh objects to a single Graphics instance.
     *
     * The Mesh class has a built-in debug rendering callback `Mesh.renderDebugVerts`, however
     * you can also provide your own callback to be used instead. Do this by setting the `callback` parameter.
     *
     * The callback is invoked _once per render_ and sent the following parameters:
     *
     * `callback(src, meshLength, verts)`
     *
     * `src` is the Mesh instance being debugged.
     * `meshLength` is the number of mesh vertices in total.
     * `verts` is an array of the translated vertex coordinates.
     *
     * If using your own callback you do not have to provide a Graphics instance to this method.
     *
     * To disable debug rendering, to either your own callback or the built-in one, call this method
     * with no arguments.
     *
     * @method Phaser.GameObjects.Mesh#setDebug
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.Graphics} [graphic] - The Graphic instance to render to if using the built-in callback.
     * @param {function} [callback] - The callback to invoke during debug render. Leave as undefined to use the built-in callback.
     *
     * @return {this} This Game Object instance.
     */
    setDebug: function (graphic, callback)
    {
        this.debugGraphic = graphic;

        if (!graphic && !callback)
        {
            this.debugCallback = null;
        }
        else if (!callback)
        {
            this.debugCallback = this.renderDebugVerts;
        }
        else
        {
            this.debugCallback = callback;
        }

        return this;
    },

    /**
     * The Mesh update loop.
     *
     * @method Phaser.GameObjects.Mesh#preUpdate
     * @protected
     * @since 3.50.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);
    },

    /**
     * The built-in Mesh vertices debug rendering method.
     *
     * See `Mesh.setDebug` for more details.
     *
     * @method Phaser.GameObjects.Mesh#renderDebugVerts
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.Mesh} src - The Mesh object being rendered.
     * @param {integer} meshLength - The number of vertices in the mesh.
     * @param {number[]} verts - An array of translated vertex coordinates.
     */
    renderDebugVerts: function (src, meshLength, verts)
    {
        var graphic = src.debugGraphic;

        for (var i = 0; i < meshLength; i += 6)
        {
            var x0 = verts[i + 0];
            var y0 = verts[i + 1];
            var x1 = verts[i + 2];
            var y1 = verts[i + 3];
            var x2 = verts[i + 4];
            var y2 = verts[i + 5];

            graphic.strokeTriangle(x0, y0, x1, y1, x2, y2);
        }
    },

    /**
     * Handles the pre-destroy step for the Mesh, which removes the Animation component and typed arrays.
     *
     * @method Phaser.GameObjects.Mesh#preDestroy
     * @private
     * @since 3.50.0
     */
    preDestroy: function ()
    {
        this.anims.destroy();

        this.anims = undefined;

        this.vertices = null;
        this.uv = null;
        this.colors = null;
        this.alphas = null;

        this.debugCallback = null;
        this.debugGraphic = null;
    }

});

module.exports = Mesh;
