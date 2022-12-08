/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var DegToRad = require('../../math/DegToRad');
var Face = require('../../geom/mesh/Face');
var GameObject = require('../GameObject');
var GenerateVerts = require('../../geom/mesh/GenerateVerts');
var GenerateObjVerts = require('../../geom/mesh/GenerateObjVerts');
var GetCalcMatrix = require('../GetCalcMatrix');
var Matrix4 = require('../../math/Matrix4');
var MeshRender = require('./MeshRender');
var StableSort = require('../../utils/array/StableSort');
var Vector3 = require('../../math/Vector3');
var Vertex = require('../../geom/mesh/Vertex');

/**
 * @classdesc
 * A Mesh Game Object.
 *
 * The Mesh Game Object allows you to render a group of textured vertices and manipulate
 * the view of those vertices, such as rotation, translation or scaling.
 *
 * Support for generating mesh data from grids, model data or Wavefront OBJ Files is included.
 *
 * Although you can use this to render 3D objects, its primary use is for displaying more complex
 * Sprites, or Sprites where you need fine-grained control over the vertex positions in order to
 * achieve special effects in your games. Note that rendering still takes place using Phaser's
 * orthographic camera (after being transformed via `projectionMesh`, see `setPerspective`,
 * `setOrtho`, and `panZ` methods). As a result, all depth and face tests are done in an eventually
 * orthographic space.
 *
 * The rendering process will iterate through the faces of this Mesh and render out each face
 * that is considered as being in view of the camera. No depth buffer is used, and because of this,
 * you should be careful not to use model data with too many vertices, or overlapping geometry,
 * or you'll probably encounter z-depth fighting. The Mesh was designed to allow for more advanced
 * 2D layouts, rather than displaying 3D objects, even though it can do this to a degree.
 *
 * In short, if you want to remake Crysis, use a 3D engine, not a Mesh. However, if you want
 * to easily add some small fun 3D elements into your game, or create some special effects involving
 * vertex warping, this is the right object for you. Mesh data becomes part of the WebGL batch,
 * just like standard Sprites, so doesn't introduce any additional shader overhead. Because
 * the Mesh just generates vertices into the WebGL batch, like any other Sprite, you can use all of
 * the common Game Object components on a Mesh too, such as a custom pipeline, mask, blend mode
 * or texture.
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
 * @param {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {number[]} [vertices] - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true` (but see note).
 * @param {number[]} [uvs] - The UVs pairs array.
 * @param {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
 * @param {boolean} [containsZ=false] - Does the vertices data include a `z` component? Note: If not, it will be assumed `z=0`, see method `panZ` or `setOrtho`.
 * @param {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
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

    function Mesh (scene, x, y, texture, frame, vertices, uvs, indicies, containsZ, normals, colors, alphas)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (texture === undefined) { texture = '__WHITE'; }

        GameObject.call(this, scene, 'Mesh');

        /**
         * An array containing the Face instances belonging to this Mesh.
         *
         * A Face consists of 3 Vertex objects.
         *
         * This array is populated during calls such as `addVertices` or `addOBJ`.
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
         * @name Phaser.GameObjects.Mesh#modelPosition
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
         * @name Phaser.GameObjects.Mesh#modelScale
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.modelScale = new Vector3(1, 1, 1);

        /**
         * A Vector3 containing the 3D rotation of the vertices in this Mesh.
         *
         * The values should be given in radians, i.e. to rotate the vertices by 90
         * degrees you can use `modelRotation.x = Phaser.Math.DegToRad(90)`.
         *
         * Modifying the components of this property will allow you to rotate
         * the vertices within the Mesh. This happens in the `preUpdate` phase,
         * where each vertex is transformed using the view and projection matrices.
         *
         * Changing this property will impact all vertices being rendered by this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#modelRotation
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.modelRotation = new Vector3();

        /**
         * An internal cache, used to compare position, rotation, scale and face data
         * each frame, to avoid math calculations in `preUpdate`.
         *
         * Cache structure = position xyz | rotation xyz | scale xyz | face count | view | ortho
         *
         * @name Phaser.GameObjects.Mesh#dirtyCache
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this.dirtyCache = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

        /**
         * The transformation matrix for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#transformMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.transformMatrix = new Matrix4();

        /**
         * The view position for this Mesh.
         *
         * Use the methods`panX`, `panY` and `panZ` to adjust the view.
         *
         * @name Phaser.GameObjects.Mesh#viewPosition
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.viewPosition = new Vector3();

        /**
         * The view matrix for this Mesh.
         *
         * @name Phaser.GameObjects.Mesh#viewMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.viewMatrix = new Matrix4();

        /**
         * The projection matrix for this Mesh.
         *
         * Update it with the `setPerspective` or `setOrtho` methods.
         *
         * @name Phaser.GameObjects.Mesh#projectionMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.projectionMatrix = new Matrix4();

        /**
         * How many faces were rendered by this Mesh Game Object in the last
         * draw? This is reset in the `preUpdate` method and then incremented
         * each time a face is drawn. Note that in multi-camera Scenes this
         * value may exceed that found in `Mesh.getFaceCount` due to
         * cameras drawing the same faces more than once.
         *
         * @name Phaser.GameObjects.Mesh#totalRendered
         * @type {number}
         * @readonly
         * @since 3.50.0
         */
        this.totalRendered = 0;

        /**
         * Internal cache var for the total number of faces rendered this frame.
         *
         * See `totalRendered` instead for the actual value.
         *
         * @name Phaser.GameObjects.Mesh#totalFrame
         * @type {number}
         * @private
         * @since 3.50.0
         */
        this.totalFrame = 0;

        /**
         * By default, the Mesh will check to see if its model or view transform has
         * changed each frame and only recalculate the vertex positions if they have.
         *
         * This avoids lots of additional math in the `preUpdate` step when not required.
         *
         * However, if you are performing per-Face or per-Vertex manipulation on this Mesh,
         * such as tweening a Face, or moving it without moving the rest of the Mesh,
         * then you may need to disable the dirty cache in order for the Mesh to re-render
         * correctly. You can toggle this property to do that. Please note that leaving
         * this set to `true` will cause the Mesh to recalculate the position of every single
         * vertex in it, every single frame. So only really do this if you know you
         * need it.
         *
         * @name Phaser.GameObjects.Mesh#ignoreDirtyCache
         * @type {boolean}
         * @since 3.50.0
         */
        this.ignoreDirtyCache = false;

        var renderer = scene.sys.renderer;

        this.setPosition(x, y);
        this.setTexture(texture, frame);
        this.setSize(renderer.width, renderer.height);
        this.initPipeline();

        this.setPerspective(renderer.width, renderer.height);

        if (vertices)
        {
            this.addVertices(vertices, uvs, indicies, containsZ, normals, colors, alphas);
        }
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
     * As the default `panZ` value is 0, vertices with `z=0` (the default) need special care or else they will not display as they are behind the camera.
     * Consider using `mesh.panZ(mesh.height / (2 * Math.tan(Math.PI / 16)))`, which will interpret vertex geometry 1:1 with pixel geometry (or see `setOrtho`).
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
     * Builds a new perspective projection matrix from the given values.
     *
     * These are also the initial projection matrix & parameters for `Mesh` (and see `panZ` for more discussion).
     *
     * See also `setOrtho`.
     *
     * @method Phaser.GameObjects.Mesh#setPerspective
     * @since 3.50.0
     *
     * @param {number} width - The width of the projection matrix. Typically the same as the Mesh and/or Renderer.
     * @param {number} height - The height of the projection matrix. Typically the same as the Mesh and/or Renderer.
     * @param {number} [fov=45] - The field of view, in degrees.
     * @param {number} [near=0.01] - The near value of the view.
     * @param {number} [far=1000] - The far value of the view.
     */
    setPerspective: function (width, height, fov, near, far)
    {
        if (fov === undefined) { fov = 45; }
        if (near === undefined) { near = 0.01; }
        if (far === undefined) { far = 1000; }

        this.projectionMatrix.perspective(DegToRad(fov), width / height, near, far);

        this.dirtyCache[10] = 1;
        this.dirtyCache[11] = 0;

        return this;
    },

    /**
     * Builds a new orthographic projection matrix from the given values.
     *
     * If using this mode you will often need to set `Mesh.hideCCW` to `false` as well.
     *
     * By default, calling this method with no parameters will set the scaleX value to
     * match the renderer's aspect ratio. If you would like to render vertex positions 1:1
     * to pixel positions, consider calling as `mesh.setOrtho(mesh.width, mesh.height)`.
     *
     * See also `setPerspective`.
     *
     * @method Phaser.GameObjects.Mesh#setOrtho
     * @since 3.50.0
     *
     * @param {number} [scaleX=1] - The default horizontal scale in relation to the Mesh / Renderer dimensions.
     * @param {number} [scaleY=1] - The default vertical scale in relation to the Mesh / Renderer dimensions.
     * @param {number} [near=-1000] - The near value of the view.
     * @param {number} [far=1000] - The far value of the view.
     */
    setOrtho: function (scaleX, scaleY, near, far)
    {
        if (scaleX === undefined) { scaleX = this.scene.sys.renderer.getAspectRatio(); }
        if (scaleY === undefined) { scaleY = 1; }
        if (near === undefined) { near = -1000; }
        if (far === undefined) { far = 1000; }

        this.projectionMatrix.ortho(-scaleX, scaleX, -scaleY, scaleY, near, far);

        this.dirtyCache[10] = 1;
        this.dirtyCache[11] = 1;

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
     * @method Phaser.GameObjects.Mesh#addVerticesFromObj
     * @since 3.50.0
     *
     * @param {string} key - The key of the model data in the OBJ Cache to add to this Mesh.
     * @param {number} [scale=1] - An amount to scale the model data by. Use this if the model has exported too small, or large, to see.
     * @param {number} [x=0] - Translate the model x position by this amount.
     * @param {number} [y=0] - Translate the model y position by this amount.
     * @param {number} [z=0] - Translate the model z position by this amount.
     * @param {number} [rotateX=0] - Rotate the model on the x axis by this amount, in radians.
     * @param {number} [rotateY=0] - Rotate the model on the y axis by this amount, in radians.
     * @param {number} [rotateZ=0] - Rotate the model on the z axis by this amount, in radians.
     * @param {boolean} [zIsUp=true] - Is the z axis up (true), or is y axis up (false)?
     *
     * @return {this} This Mesh Game Object.
     */
    addVerticesFromObj: function (key, scale, x, y, z, rotateX, rotateY, rotateZ, zIsUp)
    {
        var data = this.scene.sys.cache.obj.get(key);
        var parsedData;

        if (data)
        {
            parsedData = GenerateObjVerts(data, this, scale, x, y, z, rotateX, rotateY, rotateZ, zIsUp);
        }

        if (!parsedData || parsedData.verts.length === 0)
        {
            console.warn('Mesh.addVerticesFromObj data empty:', key);
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
     * @return {number} The difference between the depths of each Face.
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
     * Adds new vertices to this Mesh by parsing the given data.
     *
     * This method will take vertex data in one of two formats, based on the `containsZ` parameter.
     *
     * If your vertex data are `x`, `y` pairs, then `containsZ` should be `false` (this is the default, and will result in `z=0` for each vertex).
     *
     * If your vertex data is groups of `x`, `y` and `z` values, then the `containsZ` parameter must be true.
     *
     * The `uvs` parameter is a numeric array consisting of `u` and `v` pairs.
     *
     * The `normals` parameter is a numeric array consisting of `x`, `y` vertex normal values and, if `containsZ` is true, `z` values as well.
     *
     * The `indicies` parameter is an optional array that, if given, is an indexed list of vertices to be added.
     *
     * The `colors` parameter is an optional array, or single value, that if given sets the color of each vertex created.
     *
     * The `alphas` parameter is an optional array, or single value, that if given sets the alpha of each vertex created.
     *
     * When providing indexed data it is assumed that _all_ of the arrays are indexed, not just the vertices.
     *
     * The following example will create a 256 x 256 sized quad using an index array:
     *
     * ```javascript
     * let mesh = new Mesh(this);  // Assuming `this` is a scene!
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
     * mesh.addVertices(vertices, uvs, indicies);
     * // Note: Otherwise the added points will be "behind" the camera! This value will project vertex `x` & `y` values 1:1 to pixel values.
     * mesh.hideCCW = false;
     * mesh.setOrtho(mesh.width, mesh.height);
     * ```
     *
     * If the data is not indexed, it's assumed that the arrays all contain sequential data.
     *
     * @method Phaser.GameObjects.Mesh#addVertices
     * @since 3.50.0
     *
     * @param {number[]} vertices - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true`.
     * @param {number[]} uvs - The UVs pairs array.
     * @param {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
     * @param {boolean} [containsZ=false] - Does the vertices data include a `z` component? If not, it will be assumed `z=0`, see methods `panZ` or `setOrtho`.
     * @param {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
     * @param {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
     * @param {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
     *
     * @return {this} This Mesh Game Object.
     */
    addVertices: function (vertices, uvs, indicies, containsZ, normals, colors, alphas)
    {
        var result = GenerateVerts(vertices, uvs, indicies, containsZ, normals, colors, alphas);

        if (result)
        {
            this.faces = this.faces.concat(result.faces);
            this.vertices = this.vertices.concat(result.vertices);
        }
        else
        {
            console.warn('Mesh.addVertices data empty or invalid');
        }

        this.dirtyCache[9] = -1;

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
     * The Mesh class has a built-in debug rendering callback `Mesh.renderDebug`, however
     * you can also provide your own callback to be used instead. Do this by setting the `callback` parameter.
     *
     * The callback is invoked _once per render_ and sent the following parameters:
     *
     * `callback(src, faces)`
     *
     * `src` is the Mesh instance being debugged.
     * `faces` is an array of the Faces that were rendered.
     *
     * You can get the final drawn vertex position from a Face object like this:
     *
     * ```javascript
     * let face = faces[i];
     *
     * let x0 = face.vertex1.tx;
     * let y0 = face.vertex1.ty;
     * let x1 = face.vertex2.tx;
     * let y1 = face.vertex2.ty;
     * let x2 = face.vertex3.tx;
     * let y2 = face.vertex3.ty;
     *
     * graphic.strokeTriangle(x0, y0, x1, y1, x2, y2);
     * ```
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
            this.debugCallback = this.renderDebug;
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
     * The Mesh update loop. The following takes place in this method:
     *
     * First, the `totalRendered` and `totalFrame` properties are set.
     *
     * If the view matrix of this Mesh isn't dirty, and the model position, rotate or scale properties are
     * all clean, then the method returns at this point.
     *
     * Otherwise, if the viewPosition is dirty (i.e. from calling a method like `panZ`), then it will
     * refresh the viewMatrix.
     *
     * After this, a new transformMatrix is built and it then iterates through all Faces in this
     * Mesh, calling `transformCoordinatesLocal` on all of them. Internally, this updates every
     * vertex, calculating its new transformed position, based on the new transform matrix.
     *
     * Finally, the faces are depth sorted.
     *
     * @method Phaser.GameObjects.Mesh#preUpdate
     * @protected
     * @since 3.50.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function ()
    {
        this.totalRendered = this.totalFrame;
        this.totalFrame = 0;

        var dirty = this.dirtyCache;

        if (!this.ignoreDirtyCache && !dirty[10] && !this.isDirty())
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

        var faces = this.faces;

        for (var i = 0; i < faces.length; i++)
        {
            faces[i].transformCoordinatesLocal(transformMatrix, width, height, z);
        }

        this.depthSort();
    },

    /**
     * The built-in Mesh debug rendering method.
     *
     * See `Mesh.setDebug` for more details.
     *
     * @method Phaser.GameObjects.Mesh#renderDebug
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.Mesh} src - The Mesh object being rendered.
     * @param {Phaser.Geom.Mesh.Face[]} faces - An array of Faces.
     */
    renderDebug: function (src, faces)
    {
        var graphic = src.debugGraphic;

        for (var i = 0; i < faces.length; i++)
        {
            var face = faces[i];

            var x0 = face.vertex1.tx;
            var y0 = face.vertex1.ty;
            var x1 = face.vertex2.tx;
            var y1 = face.vertex2.ty;
            var x2 = face.vertex3.tx;
            var y2 = face.vertex3.ty;

            graphic.strokeTriangle(x0, y0, x1, y1, x2, y2);
        }
    },

    /**
     * Handles the pre-destroy step for the Mesh, which removes the vertices and debug callbacks.
     *
     * @method Phaser.GameObjects.Mesh#preDestroy
     * @private
     * @since 3.50.0
     */
    preDestroy: function ()
    {
        this.clear();

        this.debugCallback = null;
        this.debugGraphic = null;
    },

    /**
     * Clears all tint values associated with this Game Object.
     *
     * Immediately sets the color values back to 0xffffff on all vertices,
     * which results in no visible change to the texture.
     *
     * @method Phaser.GameObjects.Mesh#clearTint
     * @webglOnly
     * @since 3.60.0
     *
     * @return {this} This Game Object instance.
     */
    clearTint: function ()
    {
        return this.setTint();
    },

    /**
     * Sets an additive tint on all vertices of this Mesh Game Object.
     *
     * The tint works by taking the pixel color values from the Game Objects texture, and then
     * multiplying it by the color value of the tint.
     *
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property to set all colors at once.
     *
     * To remove a tint call `clearTint`.
     *
     * @method Phaser.GameObjects.Mesh#setTint
     * @webglOnly
     * @since 3.60.0
     *
     * @param {number} [tint=0xffffff] - The tint being applied to all vertices of this Mesh Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setTint: function (tint)
    {
        if (tint === undefined) { tint = 0xffffff; }

        var vertices = this.vertices;

        for (var i = 0; i < vertices.length; i++)
        {
            vertices[i].color = tint;
        }

        return this;
    },

    /**
     * The tint value being applied to the whole of the Game Object.
     * This property is a setter-only.
     *
     * @method Phaser.GameObjects.Mesh#tint
     * @type {number}
     * @webglOnly
     * @since 3.60.0
     */
    tint: {

        set: function (value)
        {
            this.setTint(value);
        }
    }
});

module.exports = Mesh;
