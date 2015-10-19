/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* An Image Collection is a special tileset containing mulitple images, with no slicing into each image.
*
* Image Collections are normally created automatically when Tiled data is loaded.
*
* @class Phaser.ImageCollection
* @constructor
* @param {string} name - The name of the image collection in the map data.
* @param {integer} firstgid - The first image index this image collection contains.
* @param {integer} [width=32] - Width of widest image (in pixels).
* @param {integer} [height=32] - Height of tallest image (in pixels).
* @param {integer} [margin=0] - The margin around all images in the collection (in pixels).
* @param {integer} [spacing=0] - The spacing between each image in the collection (in pixels).
* @param {object} [properties={}] - Custom Image Collection properties.
*/
Phaser.ImageCollection = function (name, firstgid, width, height, margin, spacing, properties) {

    if (width === undefined || width <= 0) { width = 32; }
    if (height === undefined || height <= 0) { height = 32; }
    if (margin === undefined) { margin = 0; }
    if (spacing === undefined) { spacing = 0; }

    /**
    * The name of the Image Collection.
    * @property {string} name
    */
    this.name = name;

    /**
    * The Tiled firstgid value.
    * This is the starting index of the first image index this Image Collection contains.
    * @property {integer} firstgid
    */
    this.firstgid = firstgid | 0;

    /**
    * The width of the widest image (in pixels).
    * @property {integer} imageWidth
    * @readonly
    */
    this.imageWidth = width | 0;

    /**
    * The height of the tallest image (in pixels).
    * @property {integer} imageHeight
    * @readonly
    */
    this.imageHeight = height | 0;

    /**
    * The margin around the images in the collection (in pixels).
    * Use `setSpacing` to change.
    * @property {integer} imageMarge
    * @readonly
    */
    // Modified internally
    this.imageMargin = margin | 0;

    /**
    * The spacing between each image in the collection (in pixels).
    * Use `setSpacing` to change.
    * @property {integer} imageSpacing
    * @readonly
    */
    this.imageSpacing = spacing | 0;

    /**
    * Image Collection-specific properties that are typically defined in the Tiled editor.
    * @property {object} properties
    */
    this.properties = properties || {};

    /**
    * The cached images that are a part of this collection.
    * @property {array} images
    * @readonly
    */
    // Modified internally
    this.images = [];

    /**
    * The total number of images in the image collection.
    * @property {integer} total
    * @readonly
    */
    // Modified internally
    this.total = 0;
};

Phaser.ImageCollection.prototype = {

    /**
    * Returns true if and only if this image collection contains the given image index.
    *
    * @method Phaser.ImageCollection#containsImageIndex
    * @param {integer} imageIndex - The image index to search for.
    * @return {boolean} True if this Image Collection contains the given index.
    */
    containsImageIndex: function (imageIndex) {

        return (
            imageIndex >= this.firstgid &&
            imageIndex < (this.firstgid + this.total)
        );

    },

    /**
    * Add an image to this Image Collection.
    *
    * @method Phaser.ImageCollection#addImage
    * @param {integer} gid - The gid of the image in the Image Collection.
    * @param {string} image - The the key of the image in the Image Collection and in the cache.
    */
    addImage: function (gid, image) {

        this.images.push({ gid: gid, image: image });
        this.total++;

    }

};

Phaser.ImageCollection.prototype.constructor = Phaser.ImageCollection;
