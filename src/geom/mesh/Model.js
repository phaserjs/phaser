/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Face = require('./Face');
var GetCalcMatrix = require('../../gameobjects/GetCalcMatrix');
var Matrix4 = require('../../math/Matrix4');
var StableSort = require('../../utils/array/StableSort');
var Vector3 = require('../../math/Vector3');
var Vertex = require('./Vertex');

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

    initialize:

    function Model (mesh, x, y, z)
    {
        this.mesh = mesh;

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

        this.position = new Vector3(x, y, z);
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);

        this.visible = true;
        this.alpha = 1;

        this.transformMatrix = new Matrix4();
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

    update: function (viewMatrix, projectionMatrix, width, height)
    {
        var transformMatrix = this.transformMatrix;

        transformMatrix.setWorldMatrix(this.rotation, this.position, this.scale, viewMatrix, projectionMatrix);

        var faces = this.faces;

        for (var f = 0; f < faces.length; f++)
        {
            var face = faces[f];

            face.vertex1.transformCoordinatesLocal(transformMatrix, width, height);
            face.vertex2.transformCoordinatesLocal(transformMatrix, width, height);
            face.vertex3.transformCoordinatesLocal(transformMatrix, width, height);
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
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The camera to pass the coordinates through. If not give, the default Scene Camera is used.
     *
     * @return {Phaser.Geom.Mesh.Face[]} An array of Face objects that intersect with the given point, ordered by depth.
     */
    getFaceAt: function (x, y, camera)
    {
        if (camera === undefined) { camera = this.scene.sys.cameras.main; }

        var calcMatrix = GetCalcMatrix(this.mesh, camera).calc;

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
     * Rotates all vertices of this Mesh around the X axis by the amount given.
     *
     * It then runs a depth sort on the faces before returning.
     *
     * @method Phaser.Geom.Mesh.Model#rotateX
     * @since 3.50.0
     *
     * @param {number} theta - The amount to rotate by in radians.
     *
     * @return {this} This Mesh Game Object.
     */
    rotateX: function (theta)
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
     * @method Phaser.Geom.Mesh.Model#rotateY
     * @since 3.50.0
     *
     * @param {number} theta - The amount to rotate by in radians.
     *
     * @return {this} This Mesh Game Object.
     */
    rotateY: function (theta)
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
     * @method Phaser.Geom.Mesh.Model#rotateZ
     * @since 3.50.0
     *
     * @param {number} theta - The amount to rotate by in radians.
     *
     * @return {this} This Mesh Game Object.
     */
    rotateZ: function (theta)
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

    /**
     * Destroys this Model, all of its Faces, Vertices and references.
     *
     * @method Phaser.Geom.Mesh.Model#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        //  TODO
    }

});

module.exports = Model;
