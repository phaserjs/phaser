/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var CONST = require('../../renderer/webgl/pipelines/const');
var GameObject = require('../GameObject');
var GameObjectEvents = require('../events');
var Layer3DCamera = require('./Layer3DCamera');
var Layer3DLight = require('./Layer3DLight');
var Layer3DRender = require('./Layer3DRender');
var Model = require('../../geom/mesh/Model');
var RGB = require('../../display/RGB');

/**
 * @classdesc
 * A Layer3D Game Object.
 *
 * The Mesh object is WebGL only and does not have a Canvas counterpart.
 *
 * TODO - Finish this.
 *
 * @class Layer3D
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.50.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 */
var Layer3D = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        Components.Size,
        Layer3DRender
    ],

    initialize:

    function Layer3D (scene, x, y)
    {
        GameObject.call(this, scene, 'Layer3D');

        /**
         * A Camera which can be used to control the view of the models being managed
         * by this Layer3D. It will default to have an fov of 45 and be positioned at 0, 0, -10,
         * with a near of 0.01 and far of 1000. You can change all of these by using the
         * methods and properties available on the `Layer3DCamera` class.
         *
         * @name Phaser.GameObjects.Layer3D#camera
         * @type {Phaser.GameObjects.Layer3DCamera}
         * @since 3.50.0
         */
        this.camera = new Layer3DCamera(this, 45, 0, 0, -10, 0.01, 1000);

        /**
         * An ambient light source for the entire Layer3D scene and all models it is rendering.
         *
         * It is created at a position of 0, -100, 0 with full ambient, diffuse and specular
         * values. You can change all of these by using the methods and properties
         * available on the `Layer3DLight` class.
         *
         * @name Phaser.GameObjects.Layer3D#light
         * @type {Phaser.GameObjects.Layer3DLight}
         * @since 3.50.0
         */
        this.light = new Layer3DLight(this, 0, 100, 0);

        /**
         * The color of the fog.
         *
         * By default it is 0,0,0, which is black.
         *
         * @name Phaser.GameObjects.Layer3D#fogColor
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.fogColor = new RGB();

        /**
         * The minimum distance from which fog starts to affect objects closer than it.
         *
         * @name Phaser.GameObjects.Layer3D#fogNear
         * @type {number}
         * @since 3.50.0
         */
        this.fogNear = 0;

        /**
         * The maximum distance from which fog starts to affect objects further than it.
         *
         * @name Phaser.GameObjects.Layer3D#fogFar
         * @type {number}
         * @since 3.50.0
         */
        this.fogFar = Infinity;

        /**
         * An array of model instances that have been created in this Layer3D.
         *
         * This array can be sorted, by your own functions, to control model rendering order.
         *
         * @name Phaser.GameObjects.Layer3D#models
         * @type {Phaser.Geom.Mesh.Model[]}
         * @since 3.50.0
         */
        this.models = [];

        /**
         * Internal cached value.
         *
         * @name Phaser.GameObjects.Layer3D#_prevWidth
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this._prevWidth = 0;

        /**
         * Internal cached value.
         *
         * @name Phaser.GameObjects.Layer3D#_prevHeight
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this._prevHeight = 0;

        var renderer = scene.sys.renderer;

        this.setPosition(x, y);
        this.setSize(renderer.width, renderer.height);
        this.initPipeline(CONST.MESH_PIPELINE);

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

    /**
     * Removes all models from this Layer3D, calling `destroy` on each one of them.
     *
     * @method Phaser.GameObjects.Layer3D#clearModels
     * @since 3.50.0
     */
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
     * This method creates a new blank Model instance and adds it to this Layer3D.
     *
     * You still need to tell it how many vertices it's going to contain in total, but you can
     * populate the vertex data at a later stage after calling this. It won't try to render
     * while it has no vertices.
     *
     * @method Phaser.GameObjects.Layer3D#addModel
     * @since 3.50.0
     *
     * @param {number} verticesCount - The total number of vertices this model can contain.
     * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this model will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this model is rendering with. Ensure your UV data also matches this frame.
     * @param {number} [x=0] - The x position of the Model.
     * @param {number} [y=0] - The y position of the Model.
     * @param {number} [z=0] - The z position of the Model.
     *
     * @return {Phaser.Geom.Mesh.Model} The model instance that was created.
     */
    addModel: function (verticesCount, texture, frame, x, y, z)
    {
        var model = new Model(this, verticesCount, texture, frame, x, y, z);

        this.models.push(model);

        return model;
    },

    /**
     * This method creates a new Model based on a loaded triangulated Wavefront OBJ.
     *
     * The obj file should have been loaded via OBJFile:
     *
     * ```javascript
     * this.load.obj(key, url, [ flipUV ]);
     * ```
     *
     * Then use the key it was loaded under in this method.
     *
     * If the model has a texture, you must provide it as the second parameter.
     *
     * The model is then added to this Layer3D. A single Layer3D can contain multiple models
     * without impacting each other. Equally, multiple models can all share the same base OBJ
     * data.
     *
     * Make sure your 3D package has triangulated the model data prior to exporting it.
     *
     * You can scale the model data during import, which will set the new 'base' scale for the model.
     *
     * You can also offset the models generated vertex positions via the `originX`, `originY` and `originZ`
     * parameters, which will change the rotation origin of the model. The model itself can be positioned,
     * rotated and scaled independantly of these settings, so don't use them to position the model, just
     * use them to offset the base values.
     *
     * @method Phaser.GameObjects.Layer3D#addModelFromOBJ
     * @since 3.50.0
     *
     * @param {string} key - The key of the data in the OBJ Cache to create the model from.
     * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this model will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this model is rendering with. Ensure your UV data also matches this frame.
     * @param {number} [scale=1] - An amount to scale the model data by during creation.
     * @param {number} [originX=0] - The x origin of the model vertices during creation.
     * @param {number} [originY=0] - The y origin of the model vertices during creation.
     * @param {number} [originZ=0] - The z origin of the model vertices during creation.
     *
     * @return {Phaser.Geom.Mesh.Model|Phaser.Geom.Mesh.Model[]} The Model instance that was created. If the OBJ contained multiple models then an array of Model instances is returned.
     */
    addModelFromOBJ: function (key, texture, frame, scale, originX, originY, originZ)
    {
        var model = [];
        var data = this.scene.sys.cache.obj.get(key);

        if (data)
        {
            model = this.addModelFromData(data, texture, frame, scale, originX, originY, originZ);
        }

        return (model.length === 1) ? model[0] : model;
    },

    /**
     * This method creates a new Model based on the parsed triangulated model data.
     *
     * The data should have been parsed in advance via a function such as `ParseObj`:
     *
     * ```javascript
     * const data = Phaser.Geom.Mesh.ParseObj(rawData, flipUV);
     *
     * Layer3D.addModelFromData(data, texture, frame);
     * ```
     *
     * If the model has a texture, you must provide it as the second parameter.
     *
     * The model is then added to this Layer3D. A single Layer3D can contain multiple models
     * without impacting each other. Equally, multiple models can all share the same base OBJ
     * data.
     *
     * Make sure your 3D package has triangulated the model data prior to exporting it.
     *
     * You can scale the model data during import, which will set the new 'base' scale for the model.
     *
     * You can also offset the models generated vertex positions via the `originX`, `originY` and `originZ`
     * parameters, which will change the rotation origin of the model. The model itself can be positioned,
     * rotated and scaled independantly of these settings, so don't use them to position the model, just
     * use them to offset the base values.
     *
     * @method Phaser.GameObjects.Layer3D#addModelFromData
     * @since 3.50.0
     *
     * @param {array} data - The parsed model data.
     * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this model will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this model is rendering with. Ensure your UV data also matches this frame.
     * @param {number} [scale=1] - An amount to scale the model data by during creation.
     * @param {number} [originX=0] - The x origin of the model vertices during creation.
     * @param {number} [originY=0] - The y origin of the model vertices during creation.
     * @param {number} [originZ=0] - The z origin of the model vertices during creation.
     *
     * @return {Phaser.Geom.Mesh.Model|Phaser.Geom.Mesh.Model[]} The Model instance that was created. If the data contained multiple models then an array of Model instances is returned.
     */
    addModelFromData: function (data, texture, frame, scale, originX, originY, originZ)
    {
        if (scale === undefined) { scale = 1; }
        if (originX === undefined) { originX = 0; }
        if (originY === undefined) { originY = 0; }
        if (originZ === undefined) { originZ = 0; }

        var results = [];

        // if (material)
        // {
        //     material = this.parseOBJMaterial(material);
        // }

        for (var m = 0; m < data.models.length; m++)
        {
            var modelData = data.models[m];

            var vertices = modelData.vertices;
            var textureCoords = modelData.textureCoords;
            var normals = modelData.vertexNormals;
            var faces = modelData.faces;

            var model = this.addModel(faces.length * 3, texture, frame);

            var defaultUV1 = { u: 0, v: 1 };
            var defaultUV2 = { u: 0, v: 0 };
            var defaultUV3 = { u: 1, v: 1 };

            for (var i = 0; i < faces.length; i++)
            {
                var face = faces[i];

                //  {textureCoordsIndex: 0, vertexIndex: 16, vertexNormalIndex: 16}
                var v1 = face.vertices[0];
                var v2 = face.vertices[1];
                var v3 = face.vertices[2];

                //  {x: 0.19509, y: 0.980785, z: 0}
                var m1 = vertices[v1.vertexIndex];
                var m2 = vertices[v2.vertexIndex];
                var m3 = vertices[v3.vertexIndex];

                var n1 = normals[v1.vertexNormalIndex];
                var n2 = normals[v2.vertexNormalIndex];
                var n3 = normals[v3.vertexNormalIndex];

                var t1 = v1.textureCoordsIndex;
                var t2 = v2.textureCoordsIndex;
                var t3 = v3.textureCoordsIndex;

                var uv1 = (t1 === -1) ? defaultUV1 : textureCoords[t1];
                var uv2 = (t2 === -1) ? defaultUV2 : textureCoords[t2];
                var uv3 = (t3 === -1) ? defaultUV3 : textureCoords[t3];

                // var color = 0xffffff;

                // if (material && face.material !== '' && material[face.material])
                // {
                //     color = material[face.material];
                // }

                model.addVertex(originX + m1.x * scale, originY + m1.y * scale, originZ + m1.z * scale, uv1.u, uv1.v, n1.x, n1.y, n1.z);
                model.addVertex(originX + m2.x * scale, originY + m2.y * scale, originZ + m2.z * scale, uv2.u, uv2.v, n2.x, n2.y, n2.z);
                model.addVertex(originX + m3.x * scale, originY + m3.y * scale, originZ + m3.z * scale, uv3.u, uv3.v, n3.x, n3.y, n3.z);
            }

            results.push(model);
        }

        return results;
    },

    /**
     * This method creates a new Model based on the given triangulated vertices arrays.
     *
     * Adds vertices to this model by parsing the given arrays.
     *
     * This method will take vertex data in one of two formats, based on the `containsZ` parameter.
     *
     * If your vertex data are `x`, `y` pairs, then `containsZ` should be `false` (this is the default)
     *
     * If your vertex data is groups of `x`, `y` and `z` values, then the `containsZ` parameter must be true.
     *
     * The `uvs` parameter is a numeric array consisting of `u` and `v` pairs.
     * The `normals` parameter is a numeric array consisting of `x`, `y` vertex normal values and, if `containsZ` is true, `z` values as well.
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
     * Layer3D.addModelFromVertices(vertices, uvs, indicies);
     * ```
     *
     * You cannot add more vertices to a model than the total specified when the model was created.
     * If you need to clear all vertices first, call `Model.resetVertices`.
     *
     * @method Phaser.GameObjects.Layer3D#addModelFromVertices
     * @since 3.50.0
     *
     * @param {number[]} vertices - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true`.
     * @param {number[]} uvs - The UVs pairs array.
     * @param {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
     * @param {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
     * @param {boolean} [containsZ=false] - Does the vertices data include a `z` component?
     * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture the model will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture the model is rendering with.
     *
     * @return {Phaser.Geom.Mesh.Model} The Model instance that was created.
     */
    addModelFromVertices: function (vertices, uvs, normals, indicies, containsZ, texture, frame)
    {
        var isIndexed = (Array.isArray(indicies) && indicies.length > 0);

        var verticesCount = (isIndexed) ? indicies.length : vertices.length;

        if (!isIndexed)
        {
            verticesCount /= 2;
        }

        var model = this.addModel(verticesCount, texture, frame, 0, 0, 0);

        model.addVertices(vertices, uvs, normals, indicies, containsZ);

        return model;
    },

    /**
     * Sets the fog values for this Layer3D, including the fog color and the near and
     * far distance values.
     *
     * By default, fog effects all models in this layer.
     *
     * If you do not wish to have a fog effect, see the `disableFog` method.
     *
     * @method Phaser.GameObjects.Layer3D#setFog
     * @since 3.50.0
     *
     * @param {number} red - The red color component of the fog. A value between 0 and 1.
     * @param {number} green - The green color component of the fog. A value between 0 and 1.
     * @param {number} blue - The blue color component of the fog. A value between 0 and 1.
     * @param {number} [near] - The 'near' value of the fog.
     * @param {number} [far] - The 'far' value of the fog, beyond which objects are 'fogged' out.
     *
     * @return {this} This Layer3D Game Object.
     */
    setFog: function (red, green, blue, near, far)
    {
        if (near === undefined) { near = this.fogNear; }
        if (far === undefined) { far = this.fogFar; }

        this.fogColor.set(red, green, blue);

        this.fogNear = near;
        this.fogFar = far;

        return this;
    },

    /**
     * Disables fog for this Layer3D and all models it renders.
     *
     * To re-enable fog, just call `setFog` and provide new color, near and far values.
     *
     * @method Phaser.GameObjects.Layer3D#disableFog
     * @since 3.50.0
     *
     * @return {this} This Layer3D Game Object.
     */
    disableFog: function ()
    {
        this.fogFar = Infinity;

        return this;
    },

    /**
     * The Layer3D update loop.
     *
     * @method Phaser.GameObjects.Layer3D#preUpdate
     * @protected
     * @since 3.50.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        var width = this.width;
        var height = this.height;

        var camera = this.camera;

        if (camera.dirtyProjection || width !== this._prevWidth || height !== this._prevHeight)
        {
            camera.updateProjectionMatrix(width, height);

            this._prevWidth = width;
            this._prevHeight = height;
        }

        var models = this.models;

        for (var i = 0; i < models.length; i++)
        {
            var model = models[i];

            if (model.visible)
            {
                model.preUpdate(time, delta);
            }
        }
    },

    /**
     * Resets all of the dirty cache values this Layer3D object uses.
     *
     * This is called automatically at the end of the render step.
     *
     * @method Phaser.GameObjects.Layer3D#resetDirtyFlags
     * @protected
     * @since 3.50.0
     */
    resetDirtyFlags: function ()
    {
        this.camera.dirtyView = false;
        this.camera.dirtyProjection = false;

        this.light.ambient.dirty = false;
        this.light.diffuse.dirty = false;
        this.light.specular.dirty = false;

        this.fogColor.dirty = false;
    },

    /**
     * The destroy step for this Layer3D, which removes all models, destroys the camera and
     * nulls external references.
     *
     * @method Phaser.GameObjects.Layer3D#preDestroy
     * @private
     * @since 3.50.0
     */
    preDestroy: function ()
    {
        this.clearModels();

        this.camera.destroy();
        this.light.destroy();

        this.camera = null;
        this.light = null;
    }

});

module.exports = Layer3D;
