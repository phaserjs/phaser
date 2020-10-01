/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Box3 = require('../math/Box3');
var BufferAttribute = require('./BufferAttribute');
var Class = require('../../utils/Class');
var Sphere = require('../math/Sphere');

var geometryId = 1;

var Geometry = new Class({

    initialize:

    function Geometry ()
    {
        this.id = geometryId++;

        /**
         * This hashmap has an id the name of the attribute to be set and as value the buffer to set it to.
         * Rather than accessing this property directly, use `addAttribute` and `getAttribute` to access attributes of this geometry.
         */
        this.attributes = {};

        /**
         * Hashmap of Attributes Array for morph targets.
         */
        this.morphAttributes = {};

        /**
         * Allows for vertices to be re-used across multiple triangles; this is called using "indexed triangles" and each triangle is associated with the indices of three vertices.
         * This attribute therefore stores the index of each vertex for each triangular face.
         * If this attribute is not set, the renderer assumes that each three contiguous positions represent a single triangle.
         * @type {BufferAttribute}
         */
        this.index = null;

        /**
         * Bounding box for the bufferGeometry, which can be calculated with `computeBoundingBox`.
         * @type {Box3}
         */
        this.boundingBox = new Box3();

        /**
         * Bounding sphere for the bufferGeometry, which can be calculated with `computeBoundingSphere`.
         * @type {Sphere}
         */
        this.boundingSphere = new Sphere();

        /**
         * Split the geometry into groups, each of which will be rendered in a separate WebGL draw call. This allows an array of materials to be used with the geometry.
         * Each group is an object of the form:
         * { start: Integer, count: Integer, materialIndex: Integer }
         */
        this.groups = [];

        /**
         * A version number, incremented every time the attribute object or index object changes to mark VAO drity.
         */
        this.version = 0;

        this.sceneProperties = {
            created: false,
            attributes: {},
            vaos: {}
        };
    },

    /**
     * Adds an attribute to this geometry.
     * Use this rather than the attributes property.
     * @param {string} name
     * @param {BufferAttribute|InterleavedBufferAttribute} attribute
     */
    addAttribute: function (name, attribute)
    {
        this.attributes[name] = attribute;
    },

    /**
     * Returns the attribute with the specified name.
     * @return {BufferAttribute|InterleavedBufferAttribute}
     */
    getAttribute: function (name)
    {
        return this.attributes[name];
    },

    /**
     * Removes the attribute with the specified name.
     */
    removeAttribute: function (name)
    {
        delete this.attributes[name];
    },

    /**
     * Set the index buffer.
     * @param {Array|BufferAttribute} index
     */
    setIndex: function (index)
    {
        if (Array.isArray(index))
        {
            this.index = new BufferAttribute(new Uint16Array(index), 1);
        }
        else
        {
            this.index = index;
        }
    },

    /**
     * Adds a group to this geometry; see the groups for details.
     * @param {number} start
     * @param {number} count
     * @param {number} materialIndex
     */
    addGroup: function (start, count, materialIndex)
    {
        this.groups.push({
            start: start,
            count: count,
            materialIndex: materialIndex !== undefined ? materialIndex : 0
        });
    },

    /**
     * Clears all groups.
     */
    clearGroups: function ()
    {
        this.groups = [];
    },

    /**
     * Computes bounding box of the geometry, updating `boundingBox`.
     * Bounding boxes aren't computed by default. They need to be explicitly computed.
     */
    computeBoundingBox: function ()
    {
        var position = this.attributes['a_Position'] || this.attributes['position'];

        if (position.isInterleavedBufferAttribute)
        {
            var data = position.data;

            this.boundingBox.setFromArray(data.array, data.stride);
        }
        else
        {
            this.boundingBox.setFromArray(position.array, position.size);
        }
    },

    /**
     * Computes bounding sphere of the geometry, updating `boundingSphere`.
     *
     * Bounding spheres aren't computed by default. They need to be explicitly computed.
     */
    computeBoundingSphere: function ()
    {
        var position = this.attributes['a_Position'] || this.attributes['position'];

        if (position.isInterleavedBufferAttribute)
        {
            var data = position.data;

            this.boundingSphere.setFromArray(data.array, data.stride);
        }
        else
        {
            this.boundingSphere.setFromArray(position.array, position.size);
        }
    },

    /**
     * Disposes the object from memory.
     * You need to call this when you want the BufferGeometry removed while the application is running.
     */
    dispose: function ()
    {
        //  TODO
    }

});

module.exports = Geometry;
