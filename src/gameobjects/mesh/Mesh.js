/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var GameObjectEvents = require('../events');
var GetCalcMatrix = require('../GetCalcMatrix');
var MeshRender = require('./MeshRender');
var MeshCamera = require('./MeshCamera');
var MeshLight = require('./MeshLight');
var Model = require('../../geom/mesh/Model');
var CONST = require('../../renderer/webgl/pipelines/const');

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
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
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
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        Components.Size,
        MeshRender
    ],

    initialize:

    function Mesh (scene, x, y, texture, frame, vertices, uvs, indicies, colors, alphas)
    {
        GameObject.call(this, scene, 'Mesh');

        /**
         * A Camera which can be used to control the view of the models being managed
         * by this Mesh. It will default to have an fov of 45 and be positioned at 0, 0, -10,
         * with a near of 0.01 and far of 1000. You can change all of these by using the
         * methods and properties available on the `MeshCamera` class.
         *
         * @name Phaser.GameObjects.Mesh#camera
         * @type {Phaser.GameObjects.MeshCamera}
         * @since 3.50.0
         */
        this.camera = new MeshCamera(45, 0, 0, -10, 0.01, 1000);

        /**
         * TODO
         *
         * @name Phaser.GameObjects.Mesh#light
         * @type {Phaser.GameObjects.MeshLight}
         * @since 3.50.0
         */
        this.light = new MeshLight();

        this.fogColor = { r: 0, g: 0, b: 0 };
        this.fogNear = 0;
        this.fogFar = Infinity;

        /**
         * An array of Model instances that have been created in this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#models
         * @type {Phaser.Geom.Mesh.Model[]}
         * @since 3.50.0
         */
        this.models = [];

        /**
         * Internal cached value.
         *
         * @name Phaser.GameObjects.Mesh#_prevWidth
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this._prevWidth = 0;

        /**
         * Internal cached value.
         *
         * @name Phaser.GameObjects.Mesh#_prevHeight
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this._prevHeight = 0;

        var renderer = scene.sys.renderer;

        this.setPosition(x, y);
        this.setSize(renderer.width, renderer.height);
        this.initPipeline(CONST.MESH_PIPELINE);

        if (vertices)
        {
            this.addModelFromVertices(vertices, uvs, indicies, texture, frame, colors, alphas);
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

    /**
     * Removes all Models from this Mesh, calling `destroy` on each one of them.
     *
     * @method Phaser.GameObjects.Mesh#clearModels
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
     * This method creates a new blank Model instance and adds it to this Mesh.
     *
     * @method Phaser.GameObjects.Mesh#addModel
     * @since 3.50.0
     *
     * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this model will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this model is rendering with. Ensure your UV data also matches this frame.
     * @param {number} [x=0] - The x position of the Model.
     * @param {number} [y=0] - The y position of the Model.
     * @param {number} [z=0] - The z position of the Model.
     *
     * @return {Phaser.Geom.Mesh.Model} The Model instance that was created.
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
     * The model is then added to this Mesh. A single Mesh can contain multiple models
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
     * @method Phaser.GameObjects.Mesh#addModelFromOBJ
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
     * Mesh.addModelFromData(data, texture, frame);
     * ```
     *
     * If the model has a texture, you must provide it as the second parameter.
     *
     * The model is then added to this Mesh. A single Mesh can contain multiple models
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
     * @method Phaser.GameObjects.Mesh#addModelFromData
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
     * Mesh.addModelFromVertices(vertices, uvs, indicies);
     * ```
     *
     * Vertices must be provided as x/y pairs, there is no `z` component used in this call. For that, please see
     * `addModelFromData` instead.
     *
     * @method Phaser.GameObjects.Mesh#addModelFromVertices
     * @since 3.50.0
     *
     * @param {number[]} vertices - The vertices array.
     * @param {number[]} uvs - The UVs array.
     * @param {number[]} [indicies] - Optional vertex indicies array.
     * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this model will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this model is rendering with.
     * @param {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
     * @param {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
     *
     * @return {Phaser.Geom.Mesh.Model} The Model instance that was created.
     */
    addModelFromVertices: function (vertices, uvs, indicies, texture, frame, colors, alphas)
    {
        var model = this.addModel(texture, frame, 0, 0, 0);

        model.addVertices(vertices, uvs, indicies, colors, alphas);

        return model;
    },

    /**
     * Return an array of Models from this Mesh that intersect with the given coordinates.
     *
     * The given position is translated through the matrix of this Mesh and the given Camera,
     * before being compared against the model vertices.
     *
     * If more than one model intersects, they will all be returned in the array, but the array will
     * be depth sorted first, so the first element will always be that closest to the camera.
     *
     * @method Phaser.GameObjects.Mesh#getModelAt
     * @since 3.50.0
     *
     * @param {number} x - The x position to check against.
     * @param {number} y - The y position to check against.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The camera to pass the coordinates through. If not given, the default Scene Camera is used.
     *
     * @return {Phaser.Geom.Mesh.Model[]} An array of Models objects that intersect with the given point, ordered by depth.
     */
    getModelAt: function (x, y, camera)
    {
        if (camera === undefined) { camera = this.scene.sys.cameras.main; }

        var results = [];

        var models = this.models;

        var calcMatrix = GetCalcMatrix(this.mesh, camera).calc;

        for (var i = 0; i < models.length; i++)
        {
            var model = models[i];

            if (model.visible)
            {
                var faces = model.getFaceAt(x, y, camera, calcMatrix);

                if (faces.length > 0)
                {
                    results.push({ model: model, faces: faces });
                }
            }
        }

        return results;
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
        var width = this.width;
        var height = this.height;

        var camera = this.camera;

        /*
        if (camera.dirty || width !== this._prevWidth || height !== this._prevHeight)
        {
            //  Mesh has resized, flow that down to the Camera
            camera.update(width, height);

            this._prevWidth = width;
            this._prevHeight = height;
        }
        */

        camera.update(width, height);

        var models = this.models;

        for (var i = 0; i < models.length; i++)
        {
            var model = models[i];

            if (model.visible)
            {
                model.preUpdate(time, delta, camera, width, height);
            }
        }

        camera.dirty = false;
    },

    /**
     * The destroy step for the Mesh, which removes all models, destroys the camera and
     * nulls references.
     *
     * @method Phaser.GameObjects.Mesh#preDestroy
     * @private
     * @since 3.50.0
     */
    preDestroy: function ()
    {
        this.clearModels();

        this.camera.destroy();

        this.camera = null;
    }

});

module.exports = Mesh;
