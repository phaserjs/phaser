/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var Components = require('../../gameobjects/components');
var Matrix4 = require('../../math/Matrix4');
var Quaternion = require('../../math/Quaternion');
var RGB = require('../../layer3d/math/RGB');
var Vector3 = require('../../math/Vector3');

/**
 * @classdesc
 * A 3D Model.
 *
 * @class Model
 * @memberof Phaser.Geom.Mesh
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.Layer3D} layer - A reference to the Layer3D instance that this model belongs to.
 * @param {number} verticesCount - The total number of vertices this model can contain.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this model will use to render with, as stored in the Texture Manager.
 * @param {string|integer} [frame] - An optional frame from the Texture this model is rendering with. Ensure your UV data also matches this frame.
 * @param {number} [x=0] - The x position of the Model.
 * @param {number} [y=0] - The y position of the Model.
 * @param {number} [z=0] - The z position of the Model.
 */
var Model = new Class({

    Mixins: [
        Components.AlphaSingle,
        Components.Size,
        Components.Texture,
        Components.Visible
    ],

    initialize:

    function Model (layer, verticesCount, texture, frame, x, y, z)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (z === undefined) { z = 0; }

        /**
         * The Layer3D instance this model belongs to.
         *
         * A model can only belong to a single Layer3D instance.
         *
         * You should consider this property as being read-only. You cannot move a
         * model to another Layer3D by simply changing it.
         *
         * @name Phaser.Geom.Mesh.Model#layer
         * @type {Phaser.GameObjects.Layer3D}
         * @since 3.50.0
         */
        this.layer = layer;

        /**
         * A reference to the Scene to which this the Layer3D Object which owns this model belongs.
         *
         * You should consider this property as being read-only. You cannot move a
         * Game Object to another Scene by simply changing it.
         *
         * @name Phaser.Geom.Mesh.Model#scene
         * @type {Phaser.Scene}
         * @since 3.50.0
         */
        this.scene = layer.scene;

        /**
         * The Animation State of this Model.
         *
         * @name Phaser.Geom.Mesh.Model#anims
         * @type {Phaser.Animation.AnimationState}
         * @since 3.50.0
         */
        this.anims = new AnimationState(this);

        /**
         * The size of a single vertex, in bytes.
         *
         * The total of all 8 attributes * bytes size.
         *
         * @name Phaser.Geom.Mesh.Model#vertexSize
         * @type {number}
         * @since 3.50.0
         */
        this.vertexSize = 32;

        /**
         * The total number of vertices the ArrayBuffer in this model can hold.
         *
         * @name Phaser.Geom.Mesh.Model#maxVertexCount
         * @type {number}
         * @since 3.50.0
         */
        this.maxVertexCount = verticesCount;

        /**
         * The total number of vertices currently added to this model.
         *
         * @name Phaser.Geom.Mesh.Model#vertexCount
         * @type {number}
         * @since 3.50.0
         */
        this.vertexCount = 0;

        /**
         * An ArrayBuffer that contains the GPU byte data for this model.
         *
         * The size of the buffer is set to `verticesCount * vertexSize` when
         * this model is created and cannot be changed without resetting the vertices.
         *
         * @name Phaser.Geom.Mesh.Model#vertexData
         * @type {ArrayBuffer}
         * @since 3.50.0
         */
        this.vertexData;

        /**
         * A Float32 View into the Array Buffer.
         *
         * @name Phaser.Geom.Mesh.Model#vertexViewF32
         * @type {Float32Array}
         * @since 3.50.0
         */
        this.vertexViewF32;

        /**
         * A Vector3 containing the position of this model in 3D space.
         *
         * @name Phaser.Geom.Mesh.Model#position
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.position = new Vector3(x, y, z);

        /**
         * A Vector3 containing the scale of this model in 3D space.
         *
         * @name Phaser.Geom.Mesh.Model#scale
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.scale = new Vector3(1, 1, 1);

        /**
         * A Quaternion containing the rotation of this model in 3D space.
         *
         * @name Phaser.Geom.Mesh.Model#position
         * @type {Phaser.Math.Quaternion}
         * @since 3.50.0
         */
        this.rotation = new Quaternion();

        /**
         * An RGB object containing the ambient material color of this model.
         *
         * You can adjust the ambient material color by calling the methods
         * on this object and changing its properties.
         *
         * Remember that all color values should be specified in the range
         * of 0 to 1.
         *
         * @name Phaser.Geom.Mesh.Model#ambient
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.ambient = new RGB(1, 1, 1);

        /**
         * An RGB object containing the diffuse material color of this model.
         *
         * You can adjust the diffuse material color by calling the methods
         * on this object and changing its properties.
         *
         * Remember that all color values should be specified in the range
         * of 0 to 1.
         *
         * @name Phaser.Geom.Mesh.Model#diffuse
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.diffuse = new RGB(1, 1, 1);

        /**
         * An RGB object containing the specular material color of this model.
         *
         * You can adjust the specular material color by calling the methods
         * on this object and changing its properties.
         *
         * Remember that all color values should be specified in the range
         * of 0 to 1.
         *
         * @name Phaser.Geom.Mesh.Model#specular
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.specular = new RGB(1, 1, 1);

        /**
         * The material shine value of this model.
         *
         * Default to 0.25. Keep this value in the range 0 to 1.
         *
         * @name Phaser.Geom.Mesh.Model#ambient
         * @type {number}
         * @default 0.25
         * @since 3.50.0
         */
        this.shine = 0.25;

        /**
         * A Matrix4 containing the transformed normal values for this model.
         *
         * You should consider this Matrix as being read-only. Its values are
         * repopulated during `Model.preUpdate` as required.
         *
         * @name Phaser.Geom.Mesh.Model#normalMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.normalMatrix = new Matrix4();

        /**
         * A Matrix4 containing the transform matrix for this model.
         *
         * You should consider this Matrix as being read-only. Its values are
         * repopulated during `Model.preUpdate` as required.
         *
         * @name Phaser.Geom.Mesh.Model#transformMatrix
         * @type {Phaser.Math.Matrix4}
         * @since 3.50.0
         */
        this.transformMatrix = new Matrix4();

        /**
         * The culling mode used by this Model during rendering.
         *
         * Specifies whether front or back facing polygons are candidates
         * for culling. The default value is `gl.BACK`. Possible values are:
         *
         * `gl.FRONT` (1028)
         * `gl.BACK` (1029)
         * `gl.FRONT_AND_BACK` (1032)
         *
         * @name Phaser.Geom.Mesh.Model#cullMode
         * @type {GLenum}
         * @since 3.50.0
         */
        this.cullMode = 1029;

        /**
         * An internal cache, used to compare position, rotation, scale and verts data
         * each frame, to avoid math calculates in `preUpdate`.
         *
         * cache structure = position | rotation | scale | verts count
         *
         * @name Phaser.Geom.Mesh.Model#dirtyCache
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this.dirtyCache = [ x, y, z, 0, 0, 0, 1, 1, 1, 1, 0 ];

        if (!texture)
        {
            texture = this.scene.sys.textures.get('__WHITE');
        }

        this.setTexture(texture, frame);

        this.setSizeToFrame();

        this.resetVertices(verticesCount);
    },

    /**
     * Calls each of the listeners registered for a given event.
     *
     * This is a proxy for the Layer3D `emit` method.
     *
     * @method Phaser.Geom.Mesh.Model#emit
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     * @param {...*} [args] - Additional arguments that will be passed to the event handler.
     *
     * @return {boolean} `true` if the event had listeners, else `false`.
     */
    emit: function ()
    {
        return this.layer.emit.call(arguments);
    },

    /**
     * Checks all of the current model values against the `dirtyCache` to see if the
     * normal and transform matrices need updating.
     *
     * @method Phaser.Geom.Mesh.Model#isDirty
     * @since 3.50.0
     *
     * @return {boolean} Returns `true` if any of the model values are dirty, otherwise `false`.
     */
    isDirty: function ()
    {
        var position = this.position;
        var rotation = this.rotation;
        var scale = this.scale;

        var dirtyCache = this.dirtyCache;

        var px = position.x;
        var py = position.y;
        var pz = position.z;

        var rx = rotation.x;
        var ry = rotation.y;
        var rz = rotation.z;
        var rw = rotation.w;

        var sx = scale.x;
        var sy = scale.y;
        var sz = scale.z;

        var vertices = this.vertexCount;

        var pxCached = dirtyCache[0];
        var pyCached = dirtyCache[1];
        var pzCached = dirtyCache[2];

        var rxCached = dirtyCache[3];
        var ryCached = dirtyCache[4];
        var rzCached = dirtyCache[5];
        var rwCached = dirtyCache[6];

        var sxCached = dirtyCache[7];
        var syCached = dirtyCache[8];
        var szCached = dirtyCache[9];

        var vCached = dirtyCache[10];

        dirtyCache[0] = px;
        dirtyCache[1] = py;
        dirtyCache[2] = pz;

        dirtyCache[3] = rx;
        dirtyCache[4] = ry;
        dirtyCache[5] = rz;
        dirtyCache[6] = rw;

        dirtyCache[7] = sx;
        dirtyCache[8] = sy;
        dirtyCache[9] = sz;

        dirtyCache[10] = vertices;

        return (
            pxCached !== px || pyCached !== py || pzCached !== pz ||
            rxCached !== rx || ryCached !== ry || rzCached !== rz || rwCached !== rw ||
            sxCached !== sx || syCached !== sy || szCached !== sz ||
            vCached !== vertices
        );
    },

    /**
     * Internal update handler. Advances any animations that are set on the model and,
     * if the model data is dirty, recalculates the transform and normal matrices.
     *
     * This method is called automatically by the `Layer3D` to which this model belongs.
     *
     * @method Phaser.Geom.Mesh.Model#preUpdate
     * @since 3.50.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);

        //  If the model isn't dirty we can bail out and save lots of math
        if (this.isDirty())
        {
            var normalMatrix = this.normalMatrix;
            var transformMatrix = this.transformMatrix;

            //  TODO - Merge scale into this op
            transformMatrix.fromRotationTranslation(this.rotation, this.position);
            transformMatrix.scale(this.scale);

            normalMatrix.copy(transformMatrix);
            normalMatrix.invert();
            normalMatrix.transpose();
        }
    },

    /**
     * Returns the total number of Faces _currently added_ to this model.
     *
     * Models in Phaser 3 must always be triangulated, so this value is the same as
     * `vertexCount / 3`.
     *
     * @method Phaser.Geom.Mesh.Model#getFaceCount
     * @since 3.50.0
     *
     * @return {number} The number of Faces in this Model.
     */
    getFaceCount: function ()
    {
        return this.vertexCount / 3;
    },

    /**
     * Gets the Vertex at the given offset from this models data.
     *
     * Be aware that the returned Vertex is untranslated, so will need transforming if you wish
     * to use its coordinates in world space.
     *
     * @method Phaser.Geom.Mesh.Model#getVertex
     * @since 3.50.0
     *
     * @param {number} index - The index of the vertex to get. Cannot be negative, or exceed `Model.vertexCount`.
     *
     * @return {Phaser.Types.GameObjects.Vertex} A Vertex object.
     */
    getVertex: function (index)
    {
        var vertexViewF32 = this.vertexViewF32;

        //  8 = attribute count (number of items added into the view below)
        var vertexOffset = (index * 8) - 1;

        var x = vertexViewF32[++vertexOffset];
        var y = vertexViewF32[++vertexOffset];
        var z = vertexViewF32[++vertexOffset];
        var normalX = vertexViewF32[++vertexOffset];
        var normalY = vertexViewF32[++vertexOffset];
        var normalZ = vertexViewF32[++vertexOffset];
        var u = vertexViewF32[++vertexOffset];
        var v = vertexViewF32[++vertexOffset];

        return { x: x, y: y, z: z, u: u, v: v, normalX: normalX, normalY: normalY, normalZ: normalZ, alpha: 1 };
    },

    /**
     * Returns the Face at the given index in this model.
     *
     * A face comprises of 3 vertices.
     *
     * Be aware that the Face vertices are untranslated, so will need transforming if you wish
     * to use their coordinates in world space.
     *
     * @method Phaser.Geom.Mesh.Model#getFace
     * @since 3.50.0
     *
     * @param {number} index - The index of the Face to get. Make sure the index is in range.
     *
     * @return {Phaser.Types.GameObjects.Face} The Face at the given index.
     */
    getFace: function (index)
    {
        var offset = index * 3;

        var v1 = this.getVertex(offset);
        var v2 = this.getVertex(offset + 1);
        var v3 = this.getVertex(offset + 2);
        var ccw = (v2.x - v1.x) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.x - v1.x) >= 0;

        return { vertex1: v1, vertex2: v2, vertex3: 3, isCounterClockwise: ccw };
    },

    /**
     * Resets the data in this model, clearing the `vertexData` ArrayBuffer and
     * setting it to the new max count given.
     *
     * @method Phaser.Geom.Mesh.Model#resetVertices
     * @since 3.50.0
     *
     * @param {number} verticesCount - The total number of vertices this model can contain.
     */
    resetVertices: function (verticesCount)
    {
        this.vertexData = new ArrayBuffer(verticesCount * this.vertexSize);
        this.vertexViewF32 = new Float32Array(this.vertexData);
        this.vertexCount = 0;
        this.maxVertexCount = verticesCount;

        return this;
    },

    /**
     * Updates all values of the vertex at the given index.
     *
     * Ensure that the index is in range.
     *
     * @method Phaser.Geom.Mesh.Model#updateVertex
     * @since 3.50.0
     *
     * @param {number} index - The index of the vertex to update.
     * @param {number} x - The x position of the vertex.
     * @param {number} y - The y position of the vertex.
     * @param {number} z - The z position of the vertex.
     * @param {number} u - The UV u coordinate of the vertex.
     * @param {number} v - The UV v coordinate of the vertex.
     * @param {number} normalX - The x normal of the vertex.
     * @param {number} normalY - The y normal of the vertex.
     * @param {number} normalZ - The z normal of the vertex.
     */
    updateVertex: function (index, x, y, z, u, v, normalX, normalY, normalZ)
    {
        var vertexViewF32 = this.vertexViewF32;

        //  8 = attribute count
        var vertexOffset = (index * 8) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewF32[++vertexOffset] = z;
        vertexViewF32[++vertexOffset] = normalX;
        vertexViewF32[++vertexOffset] = normalY;
        vertexViewF32[++vertexOffset] = normalZ;
        vertexViewF32[++vertexOffset] = u;
        vertexViewF32[++vertexOffset] = v;
    },

    /**
     * Adds a new vertex to this model and increments the `vertexCount` by one.
     *
     * You cannot add more vertices to this model than the total specified when the model was created.
     * If you need to clear all vertices first, call `Model.resetVertices`.
     *
     * @method Phaser.Geom.Mesh.Model#addVertex
     * @since 3.50.0
     *
     * @param {number} x - The x position of the vertex.
     * @param {number} y - The y position of the vertex.
     * @param {number} z - The z position of the vertex.
     * @param {number} u - The UV u coordinate of the vertex.
     * @param {number} v - The UV v coordinate of the vertex.
     * @param {number} normalX - The x normal of the vertex.
     * @param {number} normalY - The y normal of the vertex.
     * @param {number} normalZ - The z normal of the vertex.
     */
    addVertex: function (x, y, z, u, v, normalX, normalY, normalZ)
    {
        if (this.vertexCount < this.maxVertexCount)
        {
            this.updateVertex(this.vertexCount, x, y, z, u, v, normalX, normalY, normalZ);

            this.vertexCount++;
        }
    },

    /**
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
     * Model.addVertices(vertices, uvs, indicies);
     * ```
     *
     * You cannot add more vertices to this model than the total specified when the model was created.
     * If you need to clear all vertices first, call `Model.resetVertices`.
     *
     * @method Phaser.Geom.Mesh.Model#addVertices
     * @since 3.50.0
     *
     * @param {number[]} vertices - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true`.
     * @param {number[]} uvs - The UVs pairs array.
     * @param {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
     * @param {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
     * @param {boolean} [containsZ=false] - Does the vertices data include a `z` component?
     */
    addVertices: function (vertices, uvs, normals, indicies, containsZ)
    {
        if (containsZ === undefined) { containsZ = false; }

        if (vertices.length !== uvs.length)
        {
            throw new Error('Model vertices and uv count not equal');
        }

        var i;
        var x;
        var y;
        var z;
        var u;
        var v;
        var normalX;
        var normalY;
        var normalZ;
        var iInc = (containsZ) ? 3 : 2;

        if (Array.isArray(indicies) && indicies.length > 0)
        {
            for (i = 0; i < indicies.length; i++)
            {
                var index = indicies[i] * iInc;

                x = vertices[index];
                y = vertices[index + 1];
                z = (containsZ) ? vertices[index + 2] : 0;
                u = uvs[index];
                v = uvs[index + 1];
                normalX = 0;
                normalY = 0;
                normalZ = 0;

                if (normals)
                {
                    normalX = normals[index];
                    normalY = normals[index + 1];
                    normalZ = (containsZ) ? normals[index + 2] : 0;
                }

                this.addVertex(
                    x, y, z,
                    u, v,
                    normalX, normalY, normalZ
                );
            }
        }
        else
        {
            for (i = 0; i < vertices.length; i += iInc)
            {
                x = vertices[i];
                y = vertices[i + 1];
                z = (containsZ) ? vertices[i + 2] : 0;
                u = uvs[i];
                v = uvs[i + 1];
                normalX = 0;
                normalY = 0;
                normalZ = 0;

                if (normals)
                {
                    normalX = normals[i];
                    normalY = normals[i + 1];
                    normalZ = (containsZ) ? normals[i + 2] : 0;
                }

                this.addVertex(
                    x, y, z,
                    u, v,
                    normalX, normalY, normalZ
                );
            }
        }
    },

    /**
     * Rotates this model along the x axis by the given amount.
     *
     * This method works by calling the `rotateX` method of the `rotation` quaternion of this model.
     *
     * @method Phaser.Geom.Mesh.Model#rotateX
     * @since 3.50.0
     *
     * @param {number} rad - The amount, in radians, to rotate the model by.
     *
     * @return {this} This model instance.
     */
    rotateX: function (rad)
    {
        this.rotation.rotateX(rad);

        return this;
    },

    /**
     * Rotates this model along the y axis by the given amount.
     *
     * This method works by calling the `rotateY` method of the `rotation` quaternion of this model.
     *
     * @method Phaser.Geom.Mesh.Model#rotateY
     * @since 3.50.0
     *
     * @param {number} rad - The amount, in radians, to rotate the model by.
     *
     * @return {this} This model instance.
     */
    rotateY: function (rad)
    {
        this.rotation.rotateY(rad);

        return this;
    },

    /**
     * Rotates this model along the z axis by the given amount.
     *
     * This method works by calling the `rotateZ` method of the `rotation` quaternion of this model.
     *
     * @method Phaser.Geom.Mesh.Model#rotateZ
     * @since 3.50.0
     *
     * @param {number} rad - The amount, in radians, to rotate the model by.
     *
     * @return {this} This model instance.
     */
    rotateZ: function (rad)
    {
        this.rotation.rotateZ(rad);

        return this;
    },

    setPosition: function (x, y, z)
    {
        this.position.set(x, y, z);

        return this;
    },

    setScale: function (x, y, z)
    {
        this.scale.set(x, y, z);

        return this;
    },

    /**
     * The x position of this model in 3D space.
     *
     * @name Phaser.Geom.Mesh.Model#x
     * @type {number}
     * @since 3.50.0
     */
    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    /**
     * The y position of this model in 3D space.
     *
     * @name Phaser.Geom.Mesh.Model#y
     * @type {number}
     * @since 3.50.0
     */
    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    /**
     * The z position of this model in 3D space.
     *
     * @name Phaser.Geom.Mesh.Model#z
     * @type {number}
     * @since 3.50.0
     */
    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
        }

    },

    /**
     * The x scale of this model in 3D space.
     *
     * @name Phaser.Geom.Mesh.Model#scaleX
     * @type {number}
     * @since 3.50.0
     */
    scaleX: {

        get: function ()
        {
            return this.scale.x;
        },

        set: function (value)
        {
            this.scale.x = value;
        }

    },

    /**
     * The y scale of this model in 3D space.
     *
     * @name Phaser.Geom.Mesh.Model#scaleY
     * @type {number}
     * @since 3.50.0
     */
    scaleY: {

        get: function ()
        {
            return this.scale.y;
        },

        set: function (value)
        {
            this.scale.y = value;
        }

    },

    /**
     * The z scale of this model in 3D space.
     *
     * @name Phaser.Geom.Mesh.Model#scaleZ
     * @type {number}
     * @since 3.50.0
     */
    scaleZ: {

        get: function ()
        {
            return this.scale.z;
        },

        set: function (value)
        {
            this.scale.z = value;
        }

    },

    /**
     * Destroys this Model instance, all of its vertex data and references.
     *
     * Calling this method will not remove it from any parent Layer3D, so be sure to do that first,
     * prior to calling `destroy`.
     *
     * If a Layer3D object is destroyed, this is the method that is called on all of its models.
     *
     * @method Phaser.Geom.Mesh.Model#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.anims.destroy();

        this.layer = null;
        this.scene = null;
        this.anims = null;

        this.vertexData = null;
        this.vertexViewF32 = null;

        this.position = null;
        this.scale = null;
        this.rotation = null;

        this.ambient = null;
        this.diffuse = null;
        this.specular = null;

        this.normalMatrix = null;
        this.transformMatrix = null;
    }

});

module.exports = Model;
