/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

var BufferAttribute = new Class({

    initialize:

    function BufferAttribute (array, size, normalized)
    {
        /**
         * The array holding data stored in the buffer.
         * @type {TypedArray}
         */
        this.array = array;

        /**
         * The length of vectors that are being stored in the array.
         * @type {Integer}
         */
        this.size = size;

        /**
         * Stores the array's length divided by the size.
         * If the buffer is storing a 3-component vector (such as a position, normal, or color), then this will count the number of such vectors stored.
         * @type {Integer}
         */
        this.count = array !== undefined ? array.length / size : 0;

        /**
         * Indicates how the underlying data in the buffer maps to the values in the GLSL shader code.
         * See the constructor above for details.
         * @type {boolean}
         */
        this.normalized = normalized === true;

        /**
         * Whether the buffer is dynamic or not.
         * If false, the GPU is informed that contents of the buffer are likely to be used often and not change often.
         * This corresponds to the gl.STATIC_DRAW flag.
         * If true, the GPU is informed that contents of the buffer are likely to be used often and change often.
         * This corresponds to the gl.DYNAMIC_DRAW flag.
         * @type {boolean}
         * @default false
         */
        this.dynamic = false;

        /**
         * Object containing:
         * offset: Default is 0. Position at whcih to start update.
         * count: Default is -1, which means don't use update ranges.
         * This can be used to only update some components of stored vectors (for example, just the component related to color).
         */
        this.updateRange = { offset: 0, count: -1 };

        /**
         * A version number, incremented every time the data changes.
         * @type {Integer}
         * @default 0
         */
        this.version = 0;
    },

    setArray: function (array)
    {
        this.count = array !== undefined ? array.length / this.size : 0;

        this.array = array;

        //  inc version?

        return this;
    }

    //  copy / clone?

});

module.exports = BufferAttribute;
