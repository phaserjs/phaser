/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Rectangle = require('../rectangle/Rectangle');
var Vector2 = require('../../math/Vector2');

/**
 * Returns the length of the line.
 *
 * @ignore
 * @private
 *
 * @param {number} x1 - The x1 coordinate.
 * @param {number} y1 - The y1 coordinate.
 * @param {number} x2 - The x2 coordinate.
 * @param {number} y2 - The y2 coordinate.
 *
 * @return {number} The length of the line.
 */
function GetLength (x1, y1, x2, y2)
{
    var x = x1 - x2;
    var y = y1 - y2;
    var magnitude = (x * x) + (y * y);

    return Math.sqrt(magnitude);
}

/**
 * @classdesc
 * A Face Geometry Object.
 *
 * A Face is used by the Mesh Game Object. A Mesh consists of one, or more, faces that are
 * used to render the Mesh Game Objects in WebGL.
 *
 * A Face consists of 3 Vertex instances, for the 3 corners of the face and methods to help
 * you modify and test them.
 *
 * @class Face
 * @memberof Phaser.Geom.Mesh
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Mesh.Vertex} vertex1 - The first vertex of the Face.
 * @param {Phaser.Geom.Mesh.Vertex} vertex2 - The second vertex of the Face.
 * @param {Phaser.Geom.Mesh.Vertex} vertex3 - The third vertex of the Face.
 */
var Face = new Class({

    initialize:

    function Face (vertex1, vertex2, vertex3)
    {
        /**
         * The first vertex in this Face.
         *
         * @name Phaser.Geom.Mesh.Face#vertex1
         * @type {Phaser.Geom.Mesh.Vertex}
         * @since 3.50.0
         */
        this.vertex1 = vertex1;

        /**
         * The second vertex in this Face.
         *
         * @name Phaser.Geom.Mesh.Face#vertex2
         * @type {Phaser.Geom.Mesh.Vertex}
         * @since 3.50.0
         */
        this.vertex2 = vertex2;

        /**
         * The third vertex in this Face.
         *
         * @name Phaser.Geom.Mesh.Face#vertex3
         * @type {Phaser.Geom.Mesh.Vertex}
         * @since 3.50.0
         */
        this.vertex3 = vertex3;

        /**
         * The bounds of this Face.
         *
         * Be sure to call the `Face.updateBounds` method _before_ using this property.
         *
         * @name Phaser.Geom.Mesh.Face#bounds
         * @type {Phaser.Geom.Rectangle}
         * @since 3.50.0
         */
        this.bounds = new Rectangle();

        /**
         * The face inCenter. Do not access directly, instead use the `getInCenter` method.
         *
         * @name Phaser.Geom.Mesh.Face#_inCenter
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.50.0
         */
        this._inCenter = new Vector2();
    },

    /**
     * Calculates and returns the in-center position of this Face.
     *
     * @method Phaser.Geom.Mesh.Face#getInCenter
     * @since 3.50.0
     *
     * @param {boolean} [local=true] Return the in center from the un-transformed vertex positions (`true`), or transformed? (`false`)
     *
     * @return {Phaser.Math.Vector2} A Vector2 containing the in center position of this Face.
     */
    getInCenter: function (local)
    {
        if (local === undefined) { local = true; }

        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        var v1x;
        var v1y;

        var v2x;
        var v2y;

        var v3x;
        var v3y;

        if (local)
        {
            v1x = v1.x;
            v1y = v1.y;

            v2x = v2.x;
            v2y = v2.y;

            v3x = v3.x;
            v3y = v3.y;
        }
        else
        {
            v1x = v1.vx;
            v1y = v1.vy;

            v2x = v2.vx;
            v2y = v2.vy;

            v3x = v3.vx;
            v3y = v3.vy;
        }

        var d1 = GetLength(v3x, v3y, v2x, v2y);
        var d2 = GetLength(v1x, v1y, v3x, v3y);
        var d3 = GetLength(v2x, v2y, v1x, v1y);

        var p = d1 + d2 + d3;

        return this._inCenter.set(
            (v1x * d1 + v2x * d2 + v3x * d3) / p,
            (v1y * d1 + v2y * d2 + v3y * d3) / p
        );
    },

    /**
     * Checks if the given coordinates are within this Face.
     *
     * You can optionally provide a transform matrix. If given, the Face vertices
     * will be transformed first, before being checked against the coordinates.
     *
     * @method Phaser.Geom.Mesh.Face#contains
     * @since 3.50.0
     *
     * @param {number} x - The horizontal position to check.
     * @param {number} y - The vertical position to check.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [calcMatrix] - Optional transform matrix to apply to the vertices before comparison.
     *
     * @return {boolean} `true` if the coordinates lay within this Face, otherwise `false`.
     */
    contains: function (x, y, calcMatrix)
    {
        var vertex1 = this.vertex1;
        var vertex2 = this.vertex2;
        var vertex3 = this.vertex3;

        var v1x = vertex1.vx;
        var v1y = vertex1.vy;

        var v2x = vertex2.vx;
        var v2y = vertex2.vy;

        var v3x = vertex3.vx;
        var v3y = vertex3.vy;

        if (calcMatrix)
        {
            var a = calcMatrix.a;
            var b = calcMatrix.b;
            var c = calcMatrix.c;
            var d = calcMatrix.d;
            var e = calcMatrix.e;
            var f = calcMatrix.f;

            v1x = vertex1.vx * a + vertex1.vy * c + e;
            v1y = vertex1.vx * b + vertex1.vy * d + f;

            v2x = vertex2.vx * a + vertex2.vy * c + e;
            v2y = vertex2.vx * b + vertex2.vy * d + f;

            v3x = vertex3.vx * a + vertex3.vy * c + e;
            v3y = vertex3.vx * b + vertex3.vy * d + f;
        }

        var t0x = v3x - v1x;
        var t0y = v3y - v1y;

        var t1x = v2x - v1x;
        var t1y = v2y - v1y;

        var t2x = x - v1x;
        var t2y = y - v1y;

        var dot00 = (t0x * t0x) + (t0y * t0y);
        var dot01 = (t0x * t1x) + (t0y * t1y);
        var dot02 = (t0x * t2x) + (t0y * t2y);
        var dot11 = (t1x * t1x) + (t1y * t1y);
        var dot12 = (t1x * t2x) + (t1y * t2y);

        //  Compute barycentric coordinates
        var bc = ((dot00 * dot11) - (dot01 * dot01));
        var inv = (bc === 0) ? 0 : (1 / bc);
        var u = ((dot11 * dot02) - (dot01 * dot12)) * inv;
        var v = ((dot00 * dot12) - (dot01 * dot02)) * inv;

        return (u >= 0 && v >= 0 && (u + v < 1));
    },

    /**
     * Checks if the vertices in this Face are orientated counter-clockwise, or not.
     *
     * It checks the transformed position of the vertices, not the local one.
     *
     * @method Phaser.Geom.Mesh.Face#isCounterClockwise
     * @since 3.50.0
     *
     * @param {number} z - The z-axis value to test against. Typically the `Mesh.modelPosition.z`.
     *
     * @return {boolean} `true` if the vertices in this Face run counter-clockwise, otherwise `false`.
     */
    isCounterClockwise: function (z)
    {
        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        var d = (v2.vx - v1.vx) * (v3.vy - v1.vy) - (v2.vy - v1.vy) * (v3.vx - v1.vx);

        return (z <= 0) ? d >= 0 : d < 0;
    },

    /**
     * Loads the data from this Vertex into the given Typed Arrays.
     *
     * @method Phaser.Geom.Mesh.Face#load
     * @since 3.50.0
     *
     * @param {Float32Array} F32 - A Float32 Array to insert the position, UV and unit data in to.
     * @param {Uint32Array} U32 - A Uint32 Array to insert the color and alpha data in to.
     * @param {number} offset - The index of the array to insert this Vertex to.
     * @param {number} textureUnit - The texture unit currently in use.
     * @param {number} tintEffect - The tint effect to use.
     *
     * @return {number} The new vertex index array offset.
     */
    load: function (F32, U32, offset, textureUnit, tintEffect)
    {
        offset = this.vertex1.load(F32, U32, offset, textureUnit, tintEffect);
        offset = this.vertex2.load(F32, U32, offset, textureUnit, tintEffect);
        offset = this.vertex3.load(F32, U32, offset, textureUnit, tintEffect);

        return offset;
    },

    /**
     * Transforms all Face vertices by the given matrix, storing the results in their `vx`, `vy` and `vz` properties.
     *
     * @method Phaser.Geom.Mesh.Face#transformCoordinatesLocal
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} transformMatrix - The transform matrix to apply to this vertex.
     * @param {number} width - The width of the parent Mesh.
     * @param {number} height - The height of the parent Mesh.
     * @param {number} cameraZ - The z position of the MeshCamera.
     *
     * @return {this} This Face instance.
     */
    transformCoordinatesLocal: function (transformMatrix, width, height, cameraZ)
    {
        this.vertex1.transformCoordinatesLocal(transformMatrix, width, height, cameraZ);
        this.vertex2.transformCoordinatesLocal(transformMatrix, width, height, cameraZ);
        this.vertex3.transformCoordinatesLocal(transformMatrix, width, height, cameraZ);

        return this;
    },

    /**
     * Updates the bounds of this Face, based on the translated values of the vertices.
     *
     * Call this method prior to accessing the `Face.bounds` property.
     *
     * @method Phaser.Geom.Mesh.Face#updateBounds
     * @since 3.50.0
     *
     * @return {this} This Face instance.
     */
    updateBounds: function ()
    {
        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        var bounds = this.bounds;

        bounds.x = Math.min(v1.vx, v2.vx, v3.vx);
        bounds.y = Math.min(v1.vy, v2.vy, v3.vy);
        bounds.width = Math.max(v1.vx, v2.vx, v3.vx) - bounds.x;
        bounds.height = Math.max(v1.vy, v2.vy, v3.vy) - bounds.y;

        return this;
    },

    /**
     * Checks if this Face is within the view of the given Camera.
     *
     * This method is called in the `MeshWebGLRenderer` function. It performs the following tasks:
     *
     * First, the `Vertex.update` method is called on each of the vertices. This populates them
     * with the new translated values, updating their `tx`, `ty` and `ta` properties.
     *
     * Then it tests to see if this face is visible due to the alpha values, if not, it returns.
     *
     * After this, if `hideCCW` is set, it calls `isCounterClockwise` and returns if not.
     *
     * Finally, it will update the `Face.bounds` based on the newly translated vertex values
     * and return the results of an intersection test between the bounds and the camera world view
     * rectangle.
     *
     * @method Phaser.Geom.Mesh.Face#isInView
     * @since 3.50.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to check against.
     * @param {boolean} hideCCW - Test the counter-clockwise orientation of the verts?
     * @param {number} z - The Cameras z position, used in the CCW test.
     * @param {number} alpha - The alpha of the parent object.
     * @param {number} a - The parent transform matrix data a component.
     * @param {number} b - The parent transform matrix data b component.
     * @param {number} c - The parent transform matrix data c component.
     * @param {number} d - The parent transform matrix data d component.
     * @param {number} e - The parent transform matrix data e component.
     * @param {number} f - The parent transform matrix data f component.
     * @param {boolean} roundPixels - Round the vertex position or not?
     *
     * @return {boolean} `true` if this Face can be seen by the Camera.
     */
    isInView: function (camera, hideCCW, z, alpha, a, b, c, d, e, f, roundPixels)
    {
        this.update(alpha, a, b, c, d, e, f, roundPixels);

        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        //  Alpha check first
        if (v1.ta <= 0 && v2.ta <= 0 && v3.ta <= 0)
        {
            return false;
        }

        //  CCW check
        if (hideCCW && !this.isCounterClockwise(z))
        {
            return false;
        }

        //  Bounds check
        var bounds = this.bounds;

        bounds.x = Math.min(v1.tx, v2.tx, v3.tx);
        bounds.y = Math.min(v1.ty, v2.ty, v3.ty);
        bounds.width = Math.max(v1.tx, v2.tx, v3.tx) - bounds.x;
        bounds.height = Math.max(v1.ty, v2.ty, v3.ty) - bounds.y;

        var cr = camera.x + camera.width;
        var cb = camera.y + camera.height;

        if (bounds.width <= 0 || bounds.height <= 0 || camera.width <= 0 || camera.height <= 0)
        {
            return false;
        }

        return !(bounds.right < camera.x || bounds.bottom < camera.y || bounds.x > cr || bounds.y > cb);
    },

    /**
     * Calls the `Vertex.update` method on each of the vertices. This populates them
     * with the new translated values, updating their `tx`, `ty` and `ta` properties.
     *
     * @method Phaser.Geom.Mesh.Face#update
     * @since 3.60.0
     *
     * @param {number} alpha - The alpha of the parent object.
     * @param {number} a - The parent transform matrix data a component.
     * @param {number} b - The parent transform matrix data b component.
     * @param {number} c - The parent transform matrix data c component.
     * @param {number} d - The parent transform matrix data d component.
     * @param {number} e - The parent transform matrix data e component.
     * @param {number} f - The parent transform matrix data f component.
     * @param {boolean} roundPixels - Round the vertex position or not?
     */
    update: function (alpha, a, b, c, d, e, f, roundPixels)
    {
        this.vertex1.update(a, b, c, d, e, f, roundPixels, alpha);
        this.vertex2.update(a, b, c, d, e, f, roundPixels, alpha);
        this.vertex3.update(a, b, c, d, e, f, roundPixels, alpha);

        return this;
    },

    /**
     * Translates the vertices of this Face by the given amounts.
     *
     * The actual vertex positions are adjusted, not their transformed position.
     *
     * Therefore, this updates the vertex data directly.
     *
     * @method Phaser.Geom.Mesh.Face#translate
     * @since 3.50.0
     *
     * @param {number} x - The amount to horizontally translate by.
     * @param {number} [y=0] - The amount to vertically translate by.
     *
     * @return {this} This Face instance.
     */
    translate: function (x, y)
    {
        if (y === undefined) { y = 0; }

        var v1 = this.vertex1;
        var v2 = this.vertex2;
        var v3 = this.vertex3;

        v1.x += x;
        v1.y += y;

        v2.x += x;
        v2.y += y;

        v3.x += x;
        v3.y += y;

        return this;
    },

    /**
     * The x coordinate of this Face, based on the in center position of the Face.
     *
     * @name Phaser.Geom.Mesh.Face#x
     * @type {number}
     * @since 3.50.0
     */
    x: {

        get: function ()
        {
            return this.getInCenter().x;
        },

        set: function (value)
        {
            var current = this.getInCenter();

            this.translate(value - current.x, 0);
        }

    },

    /**
     * The y coordinate of this Face, based on the in center position of the Face.
     *
     * @name Phaser.Geom.Mesh.Face#y
     * @type {number}
     * @since 3.50.0
     */
    y: {

        get: function ()
        {
            return this.getInCenter().y;
        },

        set: function (value)
        {
            var current = this.getInCenter();

            this.translate(0, value - current.y);
        }

    },

    /**
     * Set the alpha value of this Face.
     *
     * Each vertex is given the same value. If you need to adjust the alpha on a per-vertex basis
     * then use the `Vertex.alpha` property instead.
     *
     * When getting the alpha of this Face, it will return an average of the alpha
     * component of all three vertices.
     *
     * @name Phaser.Geom.Mesh.Face#alpha
     * @type {number}
     * @since 3.50.0
     */
    alpha: {

        get: function ()
        {
            var v1 = this.vertex1;
            var v2 = this.vertex2;
            var v3 = this.vertex3;

            return (v1.alpha + v2.alpha + v3.alpha) / 3;
        },

        set: function (value)
        {
            this.vertex1.alpha = value;
            this.vertex2.alpha = value;
            this.vertex3.alpha = value;
        }

    },

    /**
     * The depth of this Face, which is an average of the z component of all three vertices.
     *
     * The depth is calculated based on the transformed z value, not the local one.
     *
     * @name Phaser.Geom.Mesh.Face#depth
     * @type {number}
     * @readonly
     * @since 3.50.0
     */
    depth: {

        get: function ()
        {
            var v1 = this.vertex1;
            var v2 = this.vertex2;
            var v3 = this.vertex3;

            return (v1.vz + v2.vz + v3.vz) / 3;
        }

    },

    /**
     * Destroys this Face and nulls the references to the vertices.
     *
     * @method Phaser.Geom.Mesh.Face#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.vertex1 = null;
        this.vertex2 = null;
        this.vertex3 = null;
    }

});

module.exports = Face;
