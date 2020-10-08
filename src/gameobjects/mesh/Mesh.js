/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var Components = require('../components');
var DegToRad = require('../../math/DegToRad');
var Face = require('../../geom/mesh/Face');
var GameObject = require('../GameObject');
var GameObjectEvents = require('../events');
var GetCalcMatrix = require('../GetCalcMatrix');
var GetFastValue = require('../../utils/object/GetFastValue');
var Matrix4 = require('../../math/Matrix4');
var Vector3 = require('../../math/Vector3');
var MeshRender = require('./MeshRender');
var StableSort = require('../../utils/array/StableSort');
var Vertex = require('../../geom/mesh/Vertex');

/**
 * @classdesc
 * A Mesh Game Object.
 *
 * The Mesh Game Object allows you to render a group of textured vertices and perform basic manipulation
 * of those vertices, such as rotation, translation or scaling.
 *
 * Support for generating mesh data from grids, model data or Wavefront OBJ Files is included.
 *
 * Although you can use this to render 3D objects, its primary use is for displaying more complex
 * Sprites, or Sprites where you need fine-grained control over the vertices in order to
 * achieve special effects in your games. Note that rendering still takes place using Phasers
 * orthographic camera. As a result, all depth and face tests are done in orthographic space.
 * The rendering process will iterate through the faces of this Mesh and render out each vertex
 * within that is considered as being counter-clockwise. Because of this you should be careful
 * not to use model data with too many vertices.
 *
 * In short, if you want to remake Crysis, use a 3D engine, not a Mesh. However, if you want
 * to easily add some small fun 3D elements into your game, or create some special effects involving
 * vertex warping, this is the right object for you. Mesh data becomes part of the WebGL batch,
 * just like standard Sprites, so doesn't introduce any additional shader overhead.
 *
 * Note that the Mesh object is WebGL only and does not have a Canvas counterpart.
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
 * @param {number[]} [indicies] - An optional array containing the vertex indicies for this Mesh. If the data isn't index, pass `null`.
 * @param {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @param {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
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
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (texture === undefined) { texture = '__WHITE'; }

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
         * An array containing the Face instances belonging to this Mesh.
         *
         * A Face consists of 3 Vertex objects.
         *
         * This array is populated during calls such as `addFace` or `addOBJ`.
         *
         * @name Phaser.GameObjects.Mesh#faces
         * @type {Phaser.Geom.Mesh.Face[]}
         * @since 3.50.0
         */
        this.faces = [];

        /**
         * An array containing Vertex instances. One instance per vertex in this Mesh.
         *
         * This array is populated during calls such as `addVertex` or `addOBJ`.
         *
         * @name Phaser.GameObjects.Mesh#vertices
         * @type {Phaser.Geom.Mesh.Vertex[]}
         * @since 3.50.0
         */
        this.vertices = [];

        /**
         * The tint fill mode.
         *
         * `false` = An additive tint (the default), where vertices colors are blended with the texture.
         * `true` = A fill tint, where the vertex colors replace the texture, but respects texture alpha.
         *
         * @name Phaser.GameObjects.Mesh#tintFill
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.tintFill = false;

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
         * Please note that high vertex count Meshes will struggle to debug properly.
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

        /**
         * When rendering, skip any Face that isn't counter clockwise?
         *
         * Enable this to hide backward-facing Faces during rendering.
         *
         * Disable it to render all Faces.
         *
         * @name Phaser.GameObjects.Mesh#hideCCW
         * @type {boolean}
         * @since 3.50.0
         */
        this.hideCCW = true;

        /**
         * A Vector3 containing the 3D position of the vertices in this Mesh.
         *
         * Modifying the components of this property will allow you to reposition where
         * the vertices are rendered within the Mesh. This happens in the `preUpdate` phase,
         * where each vertex is transformed using the view and projection matrices.
         *
         * Changing this property will impact all vertices being rendered by this Mesh.
         *
         * You can also adjust the 'view' by using the `pan` methods.
         *
         * @name Phaser.Geom.Mesh.Model#modelPosition
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.modelPosition = new Vector3();

        /**
         * A Vector3 containing the 3D scale of the vertices in this Mesh.
         *
         * Modifying the components of this property will allow you to scale
         * the vertices within the Mesh. This happens in the `preUpdate` phase,
         * where each vertex is transformed using the view and projection matrices.
         *
         * Changing this property will impact all vertices being rendered by this Mesh.
         *
         * @name Phaser.Geom.Mesh.Model#modelScale
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.modelScale = new Vector3(1, 1, 1);

        /**
         * A Vector3 containing the 3D rotation of the vertices in this Mesh.
         *
         * Modifying the components of this property will allow you to rotate
         * the vertices within the Mesh. This happens in the `preUpdate` phase,
         * where each vertex is transformed using the view and projection matrices.
         *
         * Changing this property will impact all vertices being rendered by this Mesh.
         *
         * @name Phaser.Geom.Mesh.Model#modelRotation
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.modelRotation = new Vector3();

        /**
         * An internal cache, used to compare position, rotation, scale and face data
         * each frame, to avoid math calculations in `preUpdate`.
         *
         * Cache structure = position xyz | rotation xyz | scale xyz | face count | view
         *
         * @name Phaser.Geom.Mesh.Model#dirtyCache
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this.dirtyCache = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

        /**
         * The transformation matrix for this Mesh.
         *
         * @name Phaser.Geom.Mesh.Model#transformMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.transformMatrix = new Matrix4();

        /**
         * The view position for this Mesh.
         *
         * Use the methods`panX`, `panY` and `panZ` to adjust the view.
         *
         * @name Phaser.Geom.Mesh.Model#viewPosition
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.viewPosition = new Vector3();

        /**
         * The view matrix for this Mesh.
         *
         * @name Phaser.Geom.Mesh.Model#viewMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.viewMatrix = new Matrix4();

        /**
         * The projection matrix for this Mesh.
         *
         * Update it with the `updateProjectionMatix` method.
         *
         * @name Phaser.Geom.Mesh.Model#projectionMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.projectionMatrix = new Matrix4();

        var renderer = scene.sys.renderer;

        this.setPosition(x, y);
        this.setTexture(texture, frame);
        this.setSize(renderer.width, renderer.height);
        this.initPipeline();

        this.updateProjectionMatrix(renderer.width, renderer.height, 45, 0.01, 1000);

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

    /**
     * Translates the view position of this Mesh on the x axis by the given amount.
     *
     * @method Phaser.GameObjects.Mesh#panX
     * @since 3.50.0
     *
     * @param {number} v - The amount to pan by.
     */
    panX: function (v)
    {
        this.viewPosition.addScale(Vector3.LEFT, v);

        this.dirtyCache[10] = 1;

        return this;
    },

    /**
     * Translates the view position of this Mesh on the y axis by the given amount.
     *
     * @method Phaser.GameObjects.Mesh#panY
     * @since 3.50.0
     *
     * @param {number} v - The amount to pan by.
     */
    panY: function (v)
    {
        this.viewPosition.y += Vector3.DOWN.y * v;

        this.dirtyCache[10] = 1;

        return this;
    },

    /**
     * Translates the view position of this Mesh on the z axis by the given amount.
     *
     * @method Phaser.GameObjects.Mesh#panZ
     * @since 3.50.0
     *
     * @param {number} v - The amount to pan by.
     */
    panZ: function (amount)
    {
        this.viewPosition.z += amount;

        this.dirtyCache[10] = 1;

        return this;
    },

    /**
     * Builds a new projection matrix from the given values.
     *
     * @method Phaser.GameObjects.Mesh#updateProjectionMatrix
     * @since 3.50.0
     *
     * @param {number} width - The width of the renderer.
     * @param {number} height - The height of the renderer.
     * @param {number} [fov=45] - The field of view, in degrees.
     * @param {number} [near=0.01] - The near value of the view.
     * @param {number} [fofarv=1000] - The far value of the view.
     */
    updateProjectionMatrix: function (width, height, fov, near, far)
    {
        if (fov === undefined) { fov = 45; }
        if (near === undefined) { near = 0.01; }
        if (far === undefined) { far = 1000; }

        this.projectionMatrix.perspective(DegToRad(fov), width / height, near, far);

        this.dirtyCache[10] = 1;

        return this;
    },

    /**
     * Iterates and destroys all current Faces in this Mesh, then resets the
     * `faces` and `vertices` arrays.
     *
     * @method Phaser.GameObjects.Mesh#clear
     * @since 3.50.0
     *
     * @return {this} This Mesh Game Object.
     */
    clear: function ()
    {
        this.faces.forEach(function (face)
        {
            face.destroy();
        });

        this.faces = [];
        this.vertices = [];

        return this;
    },

    /**
     * This method will add the data from a triangulated Wavefront OBJ model file to this Mesh.
     *
     * The data should have been loaded via the OBJFile:
     *
     * ```javascript
     * this.load.obj(key, url);
     * ```
     *
     * Then use the same `key` as the first parameter to this method.
     *
     * Multiple Mesh Game Objects can use the same model data without impacting on each other.
     *
     * Make sure your 3D package has triangulated the model data prior to exporting it.
     *
     * You can add multiple models to a single Mesh, although they will act as one when
     * moved or rotated. You can scale the model data, should it be too small, or too large, to see.
     * You can also offset the vertices of the model via the `x`, `y` and `z` parameters.
     *
     * If you wish to add OBJ data to this Mesh without loading it, you can call the `Mesh.addModel` method directly.
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
     * @return {this} This Mesh Game Object.
     */
    addOBJ: function (key, scale, x, y, z)
    {
        var data = this.scene.sys.cache.obj.get(key);

        if (data)
        {
            this.addModel(data, scale, x, y, z);
        }

        return this;
    },

    /**
     * Creates a grid based on the given configuration object and adds it to this Mesh.
     *
     * The size of the grid is given in pixels. An example configuration may be:
     *
     * `{ width: 256, height: 256, widthSegments: 2, heightSegments: 2, tile: true }`
     *
     * This will create a grid Mesh 256 x 256 pixels in size, split into 2x2 segments, with
     * the texture tiling across the cells.
     *
     * You can optionally split the grid into segments both vertically and horizontally. This will
     * generate two faces per grid segment as a result.
     *
     * The `tile` parameter allows you to control if the tile will repeat across the grid
     * segments, or be displayed in full.
     *
     * You may add multiple grids to a single Mesh, although they will act as one when
     * moved or rotated. You can offset the grid via the `x` and `y` properties.
     *
     * UV coordinates are generated based on the currently set texture `Frame` of this Mesh. For
     * example, if this Mesh is using a full texture, the UVs will be in the range 0 to 1. If it's
     * using a frame from a texture, such as from a texture atlas, the UVs will be generated within
     * the range of that frame.
     *
     * @method Phaser.GameObjects.Mesh#addGrid
     * @since 3.50.0
     *
     * @param {Phaser.Types.GameObjects.Mesh.MeshGridConfig} config - A Grid configuration object.
     *
     * @return {this} This Mesh Game Object.
     */
    addGrid: function (config)
    {
        var width = GetFastValue(config, 'width', 128);
        var height = GetFastValue(config, 'height', width);
        var widthSegments = GetFastValue(config, 'widthSegments', 1);
        var heightSegments = GetFastValue(config, 'heightSegments', 1);
        var posX = GetFastValue(config, 'x', 0);
        var posY = GetFastValue(config, 'y', 0);
        var colors = GetFastValue(config, 'colors', 0xffffff);
        var alphas = GetFastValue(config, 'alphas', 1);
        var tile = GetFastValue(config, 'tile', false);

        var halfWidth = width / 2;
        var halfHeight = height / 2;

        var gridX = Math.floor(widthSegments);
        var gridY = Math.floor(heightSegments);

        var gridX1 = gridX + 1;
        var gridY1 = gridY + 1;

        var segmentWidth = width / gridX;
        var segmentHeight = height / gridY;

        var uvs = [];
        var vertices = [];
        var indices = [];

        var ix;
        var iy;

        var frame = this.frame;

        var frameU0 = frame.u0;
        var frameU1 = frame.u1;

        var frameV0 = frame.v0;
        var frameV1 = frame.v1;

        var frameU = frameU1 - frameU0;
        var frameV = frameV1 - frameV0;

        var tv;
        var tu;

        for (iy = 0; iy < gridY1; iy++)
        {
            var y = posY + (iy * segmentHeight - halfHeight);

            for (ix = 0; ix < gridX1; ix++)
            {
                var x = posX + (ix * segmentWidth - halfWidth);

                vertices.push(x, -y);

                if (!tile)
                {
                    tu = frameU0 + frameU * (ix / gridX);
                    tv = frameV0 + frameV * (1 - (iy / gridY));

                    uvs.push(tu, tv);
                }
            }
        }

        var tiledVertices = [];

        for (iy = 0; iy < gridY; iy++)
        {
            for (ix = 0; ix < gridX; ix++)
            {
                var a = ix + gridX1 * iy;
                var b = ix + gridX1 * (iy + 1);
                var c = (ix + 1) + gridX1 * (iy + 1);
                var d = (ix + 1) + gridX1 * iy;

                if (!tile)
                {
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
                else
                {
                    a *= 2;
                    b *= 2;
                    c *= 2;
                    d *= 2;

                    tiledVertices.push(
                        vertices[a], vertices[a + 1],
                        vertices[b], vertices[b + 1],
                        vertices[d], vertices[d + 1],

                        vertices[b], vertices[b + 1],
                        vertices[c], vertices[c + 1],
                        vertices[d], vertices[d + 1]
                    );

                    uvs.push(
                        frameU0, frameV1,
                        frameU0, frameV0,
                        frameU1, frameV1,

                        frameU0, frameV0,
                        frameU1, frameV0,
                        frameU1, frameV1
                    );
                }
            }
        }

        if (tile)
        {
            return this.addVertices(tiledVertices, uvs, null, colors, alphas);
        }
        else
        {
            return this.addVertices(vertices, uvs, indices, colors, alphas);
        }
    },

    /**
     * This method will add parsed triangulated OBJ model data to this Mesh.
     *
     * The obj should have been parsed in advance via the ParseObj function:
     *
     * ```javascript
     * var data = Phaser.Geom.Mesh.ParseObj(rawData, flipUV);
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
     * @method Phaser.GameObjects.Mesh#addModel
     * @since 3.50.0
     *
     * @param {Phaser.Types.Geom.Mesh.OBJData} data - The parsed OBJ model data.
     * @param {number} [scale=1] - An amount to scale the model data by. Use this if the model has exported too small, or large, to see.
     * @param {number} [x=0] - Offset the model x position by this amount.
     * @param {number} [y=0] - Offset the model y position by this amount.
     * @param {number} [z=0] - Offset the model z position by this amount.
     *
     * @return {this} This Mesh Game Object.
     */
    addModel: function (data, scale, x, y, z)
    {
        if (scale === undefined) { scale = 1; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (z === undefined) { z = 0; }

        var materials = data.materials;

        for (var m = 0; m < data.models.length; m++)
        {
            var model = data.models[m];

            var vertices = model.vertices;
            var textureCoords = model.textureCoords;
            var faces = model.faces;

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

                var color = 0xffffff;

                if (face.material !== '' && materials[face.material])
                {
                    color = materials[face.material];
                }

                var vert1 = this.addVertex(x + m1.x * scale, y + m1.y * scale, z + m1.z * scale, uv1.u, uv1.v, color);
                var vert2 = this.addVertex(x + m2.x * scale, y + m2.y * scale, z + m2.z * scale, uv2.u, uv2.v, color);
                var vert3 = this.addVertex(x + m3.x * scale, y + m3.y * scale, z + m3.z * scale, uv3.u, uv3.v, color);

                this.addFace(vert1, vert2, vert3);
            }
        }

        return this;
    },

    /**
     * Compare the depth of two Faces.
     *
     * @method Phaser.GameObjects.Mesh#sortByDepth
     * @since 3.50.0
     *
     * @param {Phaser.Geom.Mesh.Face} faceA - The first Face.
     * @param {Phaser.Geom.Mesh.Face} faceB - The second Face.
     *
     * @return {integer} The difference between the depths of each Face.
     */
    sortByDepth: function (faceA, faceB)
    {
        return faceA.depth - faceB.depth;
    },

    /**
     * Runs a depth sort across all Faces in this Mesh, comparing their averaged depth.
     *
     * This is called automatically if you use any of the `rotate` methods, but you can
     * also invoke it to sort the Faces should you manually position them.
     *
     * @method Phaser.GameObjects.Mesh#depthSort
     * @since 3.50.0
     *
     * @return {this} This Mesh Game Object.
     */
    depthSort: function ()
    {
        StableSort(this.faces, this.sortByDepth);

        return this;
    },

    /**
     * Adds a new Vertex into the vertices array of this Mesh.
     *
     * Just adding a vertex isn't enough to render it. You need to also
     * make it part of a Face, with 3 Vertex instances per Face.
     *
     * @method Phaser.GameObjects.Mesh#addVertex
     * @since 3.50.0
     *
     * @param {number} x - The x position of the vertex.
     * @param {number} y - The y position of the vertex.
     * @param {number} z - The z position of the vertex.
     * @param {number} u - The UV u coordinate of the vertex.
     * @param {number} v - The UV v coordinate of the vertex.
     * @param {number} [color=0xffffff] - The color value of the vertex.
     * @param {number} [alpha=1] - The alpha value of the vertex.
     *
     * @return {this} This Mesh Game Object.
     */
    addVertex: function (x, y, z, u, v, color, alpha)
    {
        var vert = new Vertex(x, y, z, u, v, color, alpha);

        this.vertices.push(vert);

        return vert;
    },

    /**
     * Adds a new Face into the faces array of this Mesh.
     *
     * A Face consists of references to 3 Vertex instances, which must be provided.
     *
     * @method Phaser.GameObjects.Mesh#addFace
     * @since 3.50.0
     *
     * @param {Phaser.Geom.Mesh.Vertex} vertex1 - The first vertex of the Face.
     * @param {Phaser.Geom.Mesh.Vertex} vertex2 - The second vertex of the Face.
     * @param {Phaser.Geom.Mesh.Vertex} vertex3 - The third vertex of the Face.
     *
     * @return {this} This Mesh Game Object.
     */
    addFace: function (vertex1, vertex2, vertex3)
    {
        var face = new Face(vertex1, vertex2, vertex3);

        this.faces.push(face);

        this.dirtyCache[9] = -1;

        return face;
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
            console.warn('Mesh vertices and uv count not equal');

            return this;
        }

        var i;
        var newVerts = [];

        var isColorArray = Array.isArray(colors);
        var isAlphaArray = Array.isArray(alphas);

        if (Array.isArray(indicies) && indicies.length > 0)
        {
            for (i = 0; i < indicies.length; i++)
            {
                var index = indicies[i] * 2;

                newVerts.push(this.addVertex(
                    vertices[index],
                    vertices[index + 1],
                    0,
                    uvs[index],
                    uvs[index + 1],
                    (isColorArray) ? colors[i] : colors,
                    (isAlphaArray) ? alphas[i] : alphas
                ));
            }
        }
        else
        {
            var colorIndex = 0;

            for (i = 0; i < vertices.length; i += 2)
            {
                newVerts.push(this.addVertex(
                    vertices[i],
                    vertices[i + 1],
                    0,
                    uvs[i],
                    uvs[i + 1],
                    (isColorArray) ? colors[colorIndex] : colors,
                    (isAlphaArray) ? alphas[colorIndex] : alphas
                ));

                colorIndex++;
            }
        }

        for (i = 0; i < newVerts.length; i += 3)
        {
            var vert1 = newVerts[i];
            var vert2 = newVerts[i + 1];
            var vert3 = newVerts[i + 2];

            this.addFace(vert1, vert2, vert3);
        }

        return this;
    },

    /**
     * Returns the total number of Faces in this Mesh Game Object.
     *
     * @method Phaser.GameObjects.Mesh#getFaceCount
     * @since 3.50.0
     *
     * @return {number} The number of Faces in this Mesh Game Object.
     */
    getFaceCount: function ()
    {
        return this.faces.length;
    },

    /**
     * Returns the total number of Vertices in this Mesh Game Object.
     *
     * @method Phaser.GameObjects.Mesh#getVertexCount
     * @since 3.50.0
     *
     * @return {number} The number of Vertices in this Mesh Game Object.
     */
    getVertexCount: function ()
    {
        return this.vertices.length;
    },

    /**
     * Returns the Face at the given index in this Mesh Game Object.
     *
     * @method Phaser.GameObjects.Mesh#getFace
     * @since 3.50.0
     *
     * @param {number} index - The index of the Face to get.
     *
     * @return {Phaser.Geom.Mesh.Face} The Face at the given index, or `undefined` if index out of range.
     */
    getFace: function (index)
    {
        return this.faces[index];
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
     * @return {Phaser.Geom.Mesh.Face[]} An array of Face objects that intersect with the given point, ordered by depth.
     */
    getFaceAt: function (x, y, camera)
    {
        if (camera === undefined) { camera = this.scene.sys.cameras.main; }

        var calcMatrix = GetCalcMatrix(this, camera).calc;

        var faces = this.faces;
        var results = [];

        for (var i = 0; i < faces.length; i++)
        {
            var face = faces[i];

            if (face.contains(x, y, calcMatrix))
            {
                results.push(face);
            }
        }

        return StableSort(results, this.sortByDepth);
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
     * Checks if the transformation data in this mesh is dirty.
     *
     * This is used internally by the `preUpdate` step to determine if the vertices should
     * be recalculated or not.
     *
     * @method Phaser.GameObjects.Mesh#isDirty
     * @since 3.50.0
     *
     * @return {boolean} Returns `true` if the data of this mesh is dirty, otherwise `false`.
     */
    isDirty: function ()
    {
        var position = this.modelPosition;
        var rotation = this.modelRotation;
        var scale = this.modelScale;
        var dirtyCache = this.dirtyCache;

        var px = position.x;
        var py = position.y;
        var pz = position.z;

        var rx = rotation.x;
        var ry = rotation.y;
        var rz = rotation.z;

        var sx = scale.x;
        var sy = scale.y;
        var sz = scale.z;

        var faces = this.getFaceCount();

        var pxCached = dirtyCache[0];
        var pyCached = dirtyCache[1];
        var pzCached = dirtyCache[2];

        var rxCached = dirtyCache[3];
        var ryCached = dirtyCache[4];
        var rzCached = dirtyCache[5];

        var sxCached = dirtyCache[6];
        var syCached = dirtyCache[7];
        var szCached = dirtyCache[8];

        var fCached = dirtyCache[9];

        dirtyCache[0] = px;
        dirtyCache[1] = py;
        dirtyCache[2] = pz;

        dirtyCache[3] = rx;
        dirtyCache[4] = ry;
        dirtyCache[5] = rz;

        dirtyCache[6] = sx;
        dirtyCache[7] = sy;
        dirtyCache[8] = sz;

        dirtyCache[9] = faces;

        return (
            pxCached !== px || pyCached !== py || pzCached !== pz ||
            rxCached !== rx || ryCached !== ry || rzCached !== rz ||
            sxCached !== sx || syCached !== sy || szCached !== sz ||
            fCached !== faces
        );
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

        var dirty = this.dirtyCache;

        if (!dirty[10] && !this.isDirty())
        {
            //  If neither the view or the mesh is dirty we can bail out and save lots of math
            return;
        }

        var width = this.width;
        var height = this.height;

        var viewMatrix = this.viewMatrix;
        var viewPosition = this.viewPosition;

        if (dirty[10])
        {
            viewMatrix.identity();
            viewMatrix.translate(viewPosition);
            viewMatrix.invert();

            dirty[10] = 0;
        }

        var transformMatrix = this.transformMatrix;

        transformMatrix.setWorldMatrix(
            this.modelRotation,
            this.modelPosition,
            this.modelScale,
            this.viewMatrix,
            this.projectionMatrix
        );

        var z = viewPosition.z;

        var vertices = this.vertices;

        for (var i = 0; i < vertices.length; i++)
        {
            vertices[i].transformCoordinatesLocal(transformMatrix, width, height, z);
        }

        this.depthSort();
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
        this.clear();

        this.anims.destroy();

        this.anims = null;
        this.debugCallback = null;
        this.debugGraphic = null;
    }

});

module.exports = Mesh;
