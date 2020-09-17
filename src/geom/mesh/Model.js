/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var Components = require('../../gameobjects/components');
var Face = require('./Face');
var GetCalcMatrix = require('../../gameobjects/GetCalcMatrix');
var Matrix4 = require('../../math/Matrix4');
var StableSort = require('../../utils/array/StableSort');
var Vector3 = require('../../math/Vector3');
var Vertex = require('./Vertex');
var WrapAngle = require('../../math/angle/Wrap');

/**
 * @classdesc
 * A Model Game Object.
 *
 * @class Model
 * @memberof Phaser.Geom.Mesh
 * @constructor
 * @since 3.50.0
 */
var Model = new Class({

    Mixins: [
        Components.AlphaSingle,
        Components.Size,
        Components.Texture,
        Components.Visible
    ],

    initialize:

    function Model (mesh, texture, frame, x, y, z)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (z === undefined) { z = 0; }

        this.mesh = mesh;

        this.scene = mesh.scene;

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
         * This array is populated during the `setVertices` method.
         *
         * @name Phaser.Geom.Mesh.Model#faces
         * @type {Phaser.Geom.Mesh.Face[]}
         * @since 3.50.0
         */
        this.faces = [];

        /**
         * An array containing Vertex instances. One instance per vertex in this Mesh.
         *
         * This array is populated during the `setVertices` method.
         *
         * @name Phaser.Geom.Mesh.Model#vertices
         * @type {Phaser.Geom.Mesh.Vertex[]}
         * @since 3.50.0
         */
        this.vertices = [];

        /**
         * The tint fill mode.
         *
         * `false` = An additive tint (the default), where vertices colors are blended with the texture.
         * `true` = A fill tint, where the vertices colors replace the texture, but respects texture alpha.
         *
         * @name Phaser.Geom.Mesh.Model#tintFill
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.tintFill = false;

        /**
         * When rendering, skip any Face that isn't counter clockwise?
         *
         * Enable this to hide backward-facing Faces during rendering.
         * Disable it to render all Faces.
         *
         * @name Phaser.Geom.Mesh.Model#hideCCW
         * @type {boolean}
         * @since 3.50.0
         */
        this.hideCCW = true;

        this.drawDebug = true;

        this.position = new Vector3(x, y, z);
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);

        this.dirtyCache = [ x, y, z, 0, 0, 0, 1, 1, 1, 0 ];

        this.transformMatrix = new Matrix4();

        if (!texture)
        {
            texture = this.scene.sys.textures.get('__WHITE');
        }

        this.setTexture(texture, frame);

        this.setSizeToFrame();
    },

    emit: function ()
    {
        this.mesh.emit.call(arguments);
    },

    /**
     * Iterates and destroys all current Faces in this Mesh, if any.
     * Then resets the Face and Vertices arrays.
     *
     * @method Phaser.Geom.Mesh.Model#clearVertices
     * @since 3.50.0
     *
     * @return {this} This Mesh Game Object.
     */
    clearVertices: function ()
    {
        this.faces.forEach(function (face)
        {
            face.destroy();
        });

        this.faces = [];
        this.vertices = [];

        return this;
    },

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

    preUpdate: function (time, delta, camera, width, height)
    {
        this.anims.update(time, delta);

        if (!camera.dirty && !this.isDirty())
        {
            //  If neither the camera or the model is dirty, we can bail out and save lots of math
            return;
        }

        var transformMatrix = this.transformMatrix;

        transformMatrix.setWorldMatrix(this.rotation, this.position, this.scale, camera.viewMatrix, camera.projectionMatrix);

        var vertices = this.vertices;

        for (var i = 0; i < vertices.length; i++)
        {
            vertices[i].transformCoordinatesLocal(transformMatrix, width, height);
        }

        this.depthSort();
    },

    /**
     * Returns the total number of Faces in this Mesh Game Object.
     *
     * @method Phaser.Geom.Mesh.Model#getFaceCount
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
     * @method Phaser.Geom.Mesh.Model#getVertexCount
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
     * @method Phaser.Geom.Mesh.Model#getFace
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
     * @method Phaser.Geom.Mesh.Model#getFaceAt
     * @since 3.50.0
     *
     * @param {number} x - The x position to check against.
     * @param {number} y - The y position to check against.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The camera to pass the coordinates through. If not given, the default Scene Camera is used.
     *
     * @return {Phaser.Geom.Mesh.Face[]} An array of Face objects that intersect with the given point, ordered by depth.
     */
    getFaceAt: function (x, y, camera, calcMatrix)
    {
        if (camera === undefined) { camera = this.scene.sys.cameras.main; }
        if (calcMatrix === undefined) { calcMatrix = GetCalcMatrix(this.mesh, camera).calc; }

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
     * Runs a depth sort across all Faces in this Mesh, comparing their averaged depth.
     *
     * This is called automatically if you use any of the `rotate` methods, but you can
     * also invoke it to sort the Faces should you manually position them.
     *
     * @method Phaser.Geom.Mesh.Model#depthSort
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
     * Compare the depth of two Faces.
     *
     * @method Phaser.Geom.Mesh.Model#sortByDepth
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
     * Adds a new Vertex into the vertices array of this Mesh.
     *
     * Just adding a vertex isn't enough to render it. You need to also
     * make it part of a Face, with 3 Vertex instances per Face.
     *
     * @method Phaser.Geom.Mesh.Model#addVertex
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
     * @method Phaser.Geom.Mesh.Model#addFace
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

        return face;
    },

    /**
     * Adds new vertices to this Model by parsing the given arrays.
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
     * Rotates all vertices of this Mesh around the X axis by the amount given.
     *
     * It then runs a depth sort on the faces before returning.
     *
     * @method Phaser.Geom.Mesh.Model#rotateVerticesX
     * @since 3.50.0
     *
     * @param {number} theta - The amount to rotate by in radians.
     *
     * @return {this} This Mesh Game Object.
     */
    rotateVerticesX: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);

        var verts = this.vertices;

        for (var n = 0; n < verts.length; n++)
        {
            var vert = verts[n];
            var y = vert.y;
            var z = vert.z;

            vert.y = y * tc - z * ts;
            vert.z = z * tc + y * ts;
        }

        return this.depthSort();
    },

    /**
     * Rotates all vertices of this Mesh around the Y axis by the amount given.
     *
     * It then runs a depth sort on the faces before returning.
     *
     * @method Phaser.Geom.Mesh.Model#rotateVerticesY
     * @since 3.50.0
     *
     * @param {number} theta - The amount to rotate by in radians.
     *
     * @return {this} This Mesh Game Object.
     */
    rotateVerticesY: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);

        var verts = this.vertices;

        for (var n = 0; n < verts.length; n++)
        {
            var vert = verts[n];
            var x = vert.x;
            var z = vert.z;

            vert.x = x * tc - z * ts;
            vert.z = z * tc + x * ts;
        }

        return this.depthSort();
    },

    /**
     * Rotates all vertices of this Mesh around the Z axis by the amount given.
     *
     * It then runs a depth sort on the faces before returning.
     *
     * @method Phaser.Geom.Mesh.Model#rotateVerticesZ
     * @since 3.50.0
     *
     * @param {number} theta - The amount to rotate by in radians.
     *
     * @return {this} This Mesh Game Object.
     */
    rotateVerticesZ: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);

        var verts = this.vertices;

        for (var n = 0; n < verts.length; n++)
        {
            var vert = verts[n];
            var x = vert.x;
            var y = vert.y;

            vert.x = x * tc - y * ts;
            vert.y = y * tc + x * ts;
        }

        return this.depthSort();
    },

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

    rotationX: {

        get: function ()
        {
            return this.rotation.x;
        },

        set: function (value)
        {
            this.rotation.x = WrapAngle(value);
        }

    },

    rotationY: {

        get: function ()
        {
            return this.rotation.y;
        },

        set: function (value)
        {
            this.rotation.y = WrapAngle(value);
        }

    },

    rotationZ: {

        get: function ()
        {
            return this.rotation.z;
        },

        set: function (value)
        {
            this.rotation.z = WrapAngle(value);
        }

    },

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
     * Destroys this Model, all of its Faces, Vertices and references.
     *
     * @method Phaser.Geom.Mesh.Model#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.clearVertices();

        this.anims.destroy();

        this.mesh = null;
        this.scene = null;
        this.anims = null;
        this.position = null;
        this.rotation = null;
        this.scale = null;
        this.transformMatrix = null;
    }

});

module.exports = Model;
