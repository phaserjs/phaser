/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * An Image Collection is a special Tile Set containing multiple images, with no slicing into each image.
 *
 * Image Collections are normally created automatically when Tiled data is loaded.
 *
 * @class ImageCollection
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {string} name - The name of the image collection in the map data.
 * @param {number} firstgid - The first image index this image collection contains.
 * @param {number} [width=32] - Width of widest image (in pixels).
 * @param {number} [height=32] - Height of tallest image (in pixels).
 * @param {number} [margin=0] - The margin around all images in the collection (in pixels).
 * @param {number} [spacing=0] - The spacing between each image in the collection (in pixels).
 * @param {object} [properties={}] - Custom Image Collection properties.
 */
var ImageCollection = new Class({

    initialize:

    function ImageCollection (name, firstgid, width, height, margin, spacing, properties)
    {
        if (width === undefined || width <= 0) { width = 32; }
        if (height === undefined || height <= 0) { height = 32; }
        if (margin === undefined) { margin = 0; }
        if (spacing === undefined) { spacing = 0; }

        /**
         * The name of the Image Collection.
         *
         * @name Phaser.Tilemaps.ImageCollection#name
         * @type {string}
         * @since 3.0.0
        */
        this.name = name;

        /**
         * The Tiled firstgid value.
         * This is the starting index of the first image index this Image Collection contains.
         *
         * @name Phaser.Tilemaps.ImageCollection#firstgid
         * @type {number}
         * @since 3.0.0
         */
        this.firstgid = firstgid | 0;

        /**
         * The width of the widest image (in pixels).
         *
         * @name Phaser.Tilemaps.ImageCollection#imageWidth
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.imageWidth = width | 0;

        /**
         * The height of the tallest image (in pixels).
         *
         * @name Phaser.Tilemaps.ImageCollection#imageHeight
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.imageHeight = height | 0;

        /**
         * The margin around the images in the collection (in pixels).
         * Use `setSpacing` to change.
         *
         * @name Phaser.Tilemaps.ImageCollection#imageMarge
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.imageMargin = margin | 0;

        /**
         * The spacing between each image in the collection (in pixels).
         * Use `setSpacing` to change.
         *
         * @name Phaser.Tilemaps.ImageCollection#imageSpacing
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.imageSpacing = spacing | 0;

        /**
         * Image Collection-specific properties that are typically defined in the Tiled editor.
         *
         * @name Phaser.Tilemaps.ImageCollection#properties
         * @type {object}
         * @since 3.0.0
         */
        this.properties = properties || {};

        /**
         * The cached images that are a part of this collection.
         *
         * @name Phaser.Tilemaps.ImageCollection#images
         * @type {array}
         * @readonly
         * @since 3.0.0
         */
        this.images = [];

        /**
         * The total number of images in the image collection.
         *
         * @name Phaser.Tilemaps.ImageCollection#total
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.total = 0;
    },

    /**
     * Returns true if and only if this image collection contains the given image index.
     *
     * @method Phaser.Tilemaps.ImageCollection#containsImageIndex
     * @since 3.0.0
     *
     * @param {number} imageIndex - The image index to search for.
     *
     * @return {boolean} True if this Image Collection contains the given index.
     */
    containsImageIndex: function (imageIndex)
    {
        return (imageIndex >= this.firstgid && imageIndex < (this.firstgid + this.total));
    },

    /**
     * Add an image to this Image Collection.
     *
     * @method Phaser.Tilemaps.ImageCollection#addImage
     * @since 3.0.0
     *
     * @param {number} gid - The gid of the image in the Image Collection.
     * @param {string} image - The the key of the image in the Image Collection and in the cache.
     *
     * @return {Phaser.Tilemaps.ImageCollection} This ImageCollection object.
     */
    addImage: function (gid, image)
    {
        this.images.push({ gid: gid, image: image });
        this.total++;

        return this;
    }

});

module.exports = ImageCollection;
