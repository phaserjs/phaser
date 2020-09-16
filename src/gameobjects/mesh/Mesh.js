/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var Components = require('../components');
var Face = require('../../geom/mesh/Face');
var GameObject = require('../GameObject');
var GameObjectEvents = require('../events');
var Matrix4 = require('../../math/Matrix4');
var MeshRender = require('./MeshRender');
var Model = require('../../geom/mesh/Model');
var Vertex = require('../../geom/mesh/Vertex');
var Vector3 = require('../../math/Vector3');

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
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {number[]} [vertices] - An array containing the vertices data for this Mesh.
 * @param {number[]} [uvs] - An array containing the uv data for this Mesh.
 * @param {number[]} [indicies] - An array containing the vertex indicies for this Mesh.
 * @param {number|number[]} [colors=0xffffff] - An array containing the color data for this Mesh.
 * @param {number|number[]} [alphas=1] - An array containing the alpha data for this Mesh.
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

    function Mesh (scene, x, y, texture, frame, vertices, uvs, indicies, colors, alphas)
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

        this.camera = {
            fov: 0.8,
            near: 0.01,
            far: 1000,
            position: new Vector3(0, 0, -10),
            target: new Vector3(0, 0, 0)
        };

        this.models = [];

        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();

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
        this.initPipeline();

        if (vertices)
        {
            this.addVertices(vertices, uvs, indicies, colors, alphas);
        }

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

    clearModels: function ()
    {
        var models = this.models;

        for (var i = 0; i < models.length; i++)
        {
            models[i].destroy();
        }

        this.models = [];
    },

    /**
     * This method will add the model data from a loaded triangulated Wavefront OBJ file to this Mesh.
     *
     * The obj should have been loaded via the OBJFile:
     *
     * ```javascript
     * this.load.obj(key, url);
     * ```
     *
     * Then use the key it was loaded under in this call.
     *
     * Multiple Mesh objects can use the same model data without impacting on each other.
     *
     * Make sure your 3D package has triangulated the model data prior to exporting it.
     *
     * You may add multiple models to a single Mesh, although they will act as one when
     * moved or rotated. You can scale the model data, should it be too small (or large) to visualize.
     * You can also offset the model via the `x`, `y` and `z` parameters.
     *
     * @method Phaser.GameObjects.Mesh#addOBJ
     * @since 3.50.0
     *
     * @param {string} key - The key of the model data in the OBJ Cache to add to this Mesh.
     * @param {number} [scale=1] - An amount to scale the model data by. Use this if the model has exported too small, or large, to see.
     * @param {number} [x=0] - Offset the model x position by this amount.
     * @param {number} [y=0] - Offset the model y position by this amount.
     * @param {number} [z=0] - Offset the model z position by this amount.
     *
     * @return {Phaser.GameObjects.Model} The Model instance that was created.
     */
    addOBJ: function (key, scale, x, y, z)
    {
        var model;
        var data = this.scene.sys.cache.obj.get(key);

        if (data)
        {
            model = this.addModelData(data, scale, x, y, z);
        }

        return model;
    },

    addModel: function (x, y, z)
    {
        var model = new Model(x, y, z);

        this.models.push(model);

        return model;
    },

    /**
     * This method will add parsed triangulated OBJ model data to this Mesh.
     *
     * The obj should have been parsed in advance via the ParseObj function:
     *
     * ```javascript
     * var data = Phaser.Geom.ParseObj(rawData, flipUV);
     *
     * Mesh.addModel(data);
     * ```
     *
     * Multiple Mesh objects can use the same model data without impacting on each other.
     *
     * Make sure your 3D package has triangulated the model data prior to exporting it.
     *
     * You may add multiple models to a single Mesh, although they will act as one when
     * moved or rotated. You can scale the model data, should it be too small (or large) to visualize.
     * You can also offset the model via the `x`, `y` and `z` parameters.
     *
     * @method Phaser.GameObjects.Mesh#addModelData
     * @since 3.50.0
     *
     * @param {array} data - The parsed model data array.
     * @param {number} [scale=1] - An amount to scale the model data by. Use this if the model has exported too small, or large, to see.
     * @param {number} [x=0] - Offset the model x position by this amount.
     * @param {number} [y=0] - Offset the model y position by this amount.
     * @param {number} [z=0] - Offset the model z position by this amount.
     *
     * @return {this} This Mesh Game Object.
     */
    addModelData: function (data, scale, x, y, z)
    {
        if (scale === undefined) { scale = 1; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (z === undefined) { z = 0; }

        var results = [];

        for (var m = 0; m < data.models.length; m++)
        {
            var model = this.addModel(x, y, z);

            var modelData = data.models[m];

            var vertices = modelData.vertices;
            var textureCoords = modelData.textureCoords;
            var faces = modelData.faces;

            for (var i = 0; i < faces.length; i++)
            {
                var face = faces[i];

                var v1 = face.vertices[0];
                var v2 = face.vertices[1];
                var v3 = face.vertices[2];

                var m1 = vertices[v1.vertexIndex];
                var m2 = vertices[v2.vertexIndex];
                var m3 = vertices[v3.vertexIndex];

                var t1 = v1.textureCoordsIndex;
                var t2 = v2.textureCoordsIndex;
                var t3 = v3.textureCoordsIndex;

                var uv1 = (t1 === -1) ? { u: 0, v: 1 } : textureCoords[t1];
                var uv2 = (t2 === -1) ? { u: 0, v: 0 } : textureCoords[t2];
                var uv3 = (t3 === -1) ? { u: 1, v: 1 } : textureCoords[t3];

                var vert1 = model.addVertex(x + m1.x * scale, y + m1.y * scale, z + m1.z * scale, uv1.u, uv1.v);
                var vert2 = model.addVertex(x + m2.x * scale, y + m2.y * scale, z + m2.z * scale, uv2.u, uv2.v);
                var vert3 = model.addVertex(x + m3.x * scale, y + m3.y * scale, z + m3.z * scale, uv3.u, uv3.v);

                model.addFace(vert1, vert2, vert3);
            }

            results.push(model);
        }

        return results;
    },

    /**
     * Adds new vertices to this Mesh by parsing the given arrays.
     *
     * The `vertices` parameter is a numeric array consisting of `x` and `y` pairs.
     * The `uvs` parameter is a numeric array consisting of `u` and `v` pairs.
     * The `indicies` parameter is an optional array that, if given, is an indexed list of vertices to be added.
     *
     * The following example will create a 256 x 256 sized quad using an index array:
     *
     * ```javascript
     * const vertices = [
     *   -128, 128,
     *   128, 128,
     *   -128, -128,
     *   128, -128
     * ];
     *
     * const uvs = [
     *   0, 1,
     *   1, 1,
     *   0, 0,
     *   1, 0
     * ];
     *
     * const indices = [ 0, 2, 1, 2, 3, 1 ];
     *
     * Mesh.addVertices(vertices, uvs, indicies);
     * ```
     *
     * Vertices must be provided as x/y pairs, there is no `z` component used in this call. For that, please see
     * `addModel` instead.
     *
     * @method Phaser.GameObjects.Mesh#addVertices
     * @since 3.50.0
     *
     * @param {number[]} vertices - The vertices array.
     * @param {number[]} uvs - The UVs array.
     * @param {number[]} [indicies] - Optional vertex indicies array.
     * @param {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
     * @param {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
     *
     * @return {this} This Mesh Game Object.
     */
    addVertices: function (vertices, uvs, indicies, colors, alphas)
    {
        if (colors === undefined) { colors = 0xffffff; }
        if (alphas === undefined) { alphas = 1; }

        if (vertices.length !== uvs.length)
        {
            throw new Error('Mesh - vertices and uv count not equal');
        }

        var i;
        var vert;
        var verts = this.vertices;
        var faces = this.faces;

        var isColorArray = Array.isArray(colors);
        var isAlphaArray = Array.isArray(alphas);

        if (Array.isArray(indicies) && indicies.length > 0)
        {
            for (i = 0; i < indicies.length; i++)
            {
                var index = indicies[i] * 2;

                vert = new Vertex(
                    vertices[index],
                    vertices[index + 1],
                    0,
                    uvs[index],
                    uvs[index + 1],
                    (isColorArray) ? colors[i] : colors,
                    (isAlphaArray) ? alphas[i] : alphas
                );

                verts.push(vert);
            }
        }
        else
        {
            var colorIndex = 0;

            for (i = 0; i < vertices.length; i += 2)
            {
                vert = new Vertex(
                    vertices[i],
                    vertices[i + 1],
                    0,
                    uvs[i],
                    uvs[i + 1],
                    (isColorArray) ? colors[colorIndex] : colors,
                    (isAlphaArray) ? alphas[colorIndex] : alphas
                );

                verts.push(vert);

                colorIndex++;
            }
        }

        for (i = 0; i < verts.length; i += 3)
        {
            var vert1 = verts[i];
            var vert2 = verts[i + 1];
            var vert3 = verts[i + 2];

            var face = new Face(vert1, vert2, vert3);

            faces.push(face);
        }

        return this;
    },

    /**
     * Return an array of Face objects from this Mesh that intersect with the given coordinates.
     *
     * The given position is translated through the matrix of this Mesh and the given Camera,
     * before being compared against the vertices.
     *
     * If more than one Face intersects, they will all be returned in the array, but the array will
     * be depth sorted first, so the first element will always be that closest to the camera.
     *
     * @method Phaser.GameObjects.Mesh#getFaceAt
     * @since 3.50.0
     *
     * @param {number} x - The x position to check against.
     * @param {number} y - The y position to check against.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The camera to pass the coordinates through. If not give, the default Scene Camera is used.
     *
     * @return {Phaser.GameObjects.Face[]} An array of Face objects that intersect with the given point, ordered by depth.
     */
    getModelAt: function (x, y, camera)
    {
        if (camera === undefined) { camera = this.scene.sys.cameras.main; }

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

        var renderer = this.scene.sys.renderer;
        var width = renderer.width;
        var height = renderer.height;

        var camera = this.camera;
        var models = this.models;
        var viewMatrix = this.viewMatrix;
        var projectionMatrix = this.projectionMatrix;

        viewMatrix.lookAt(camera.position, camera.target, Vector3.UP);

        projectionMatrix.perspective(camera.fov, width / height, camera.near, camera.far);

        for (var i = 0; i < models.length; i++)
        {
            models[i].update(viewMatrix, projectionMatrix, width, height);
        }
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
     * @param {number[]} verts - An array of translated vertex coordinates.
     */
    renderDebugVerts: function (src, verts)
    {
        var graphic = src.debugGraphic;

        for (var i = 0; i < verts.length; i += 6)
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

        this.clearModels();

        this.debugCallback = null;
        this.debugGraphic = null;
    }

});

module.exports = Mesh;
