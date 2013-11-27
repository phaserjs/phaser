/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Tile set is a combination of an image containing the tiles and collision data per tile.
*
* @class Phaser.Tileset
* @constructor
* @param {Image} image - The Image object from the Cache.
* @param {string} key - The key of the tileset in the cache.
* @param {number} tileWidth - The width of the tile in pixels.
* @param {number} tileHeight - The height of the tile in pixels.
* @param {number} [tileMargin] - The margin around the tiles in the sheet.
* @param {number} [tileSpacing] - The spacing between the tiles in the sheet.
*/
Phaser.Tileset = function (image, key, tileWidth, tileHeight, tileMargin, tileSpacing) {

    if (typeof tileMargin === "undefined") { tileMargin = 0; }
    if (typeof tileSpacing === "undefined") { tileSpacing = 0; }

    /**
    * @property {string} key - The cache ID.
    */
    this.key = key;

    /**
    * @property {object} image - The image used for rendering.
    */
    this.image = image;

    /**
    * @property {number} tileWidth - The width of a tile in pixels.
    */
    this.tileWidth = tileWidth;

    /**
    * @property {number} tileHeight - The height of a tile in pixels.
    */
    this.tileHeight = tileHeight;

    /**
    * @property {number} tileMargin - The margin around the tiles in the sheet.
    */
    this.margin = tileMargin;

    /**
    * @property {number} tileSpacing - The margin around the tiles in the sheet.
    */
    this.spacing = tileSpacing;

    /**
    * @property {array} tiles - An array of the tile collision data.
    */
    this.tiles = [];

}

Phaser.Tileset.prototype = {

    /**
    * Adds a Tile into this set.
    *
    * @method Phaser.Tileset#addTile
    * @param {Phaser.Tile} tile - The tile to add to this set.
    */
    addTile: function (tile) {

        this.tiles.push(tile);

        return tile;

    },

    /**
    * Gets a Tile from this set.
    *
    * @method Phaser.Tileset#getTile
    * @param {number} index - The index of the tile within the set.
    * @return {Phaser.Tile} The tile.
    */
    getTile: function (index) {

        if (this.tiles[index])
        {
            return this.tiles[index];
        }

        return null;

    },

    /**
    * Sets tile spacing and margins.
    *
    * @method Phaser.Tileset#setSpacing
    * @param {number} [tileMargin] - The margin around the tiles in the sheet.
    * @param {number} [tileSpacing] - The spacing between the tiles in the sheet.
    */
    setSpacing: function (margin, spacing) {

        this.tileMargin = margin;
        this.tileSpacing = spacing;

    },

    /**
    * Checks if the tile at the given index can collide.
    *
    * @method Phaser.Tileset#canCollide
    * @param {number} index - The index of the tile within the set.
    * @return {boolean} True or false depending on the tile collision or null if no tile was found at the given index.
    */
    canCollide: function (index) {

        if (this.tiles[index])
        {
            return this.tiles[index].collideNone;
        }

        return null;

    },

    /**
    * Checks if the tile at the given index exists.
    *
    * @method Phaser.Tileset#checkTileIndex
    * @param {number} index - The index of the tile within the set.
    * @return {boolean} True if a tile exists at the given index otherwise false.
    */
    checkTileIndex: function (index) {

        return (this.tiles[index]);

    },

    /**
    * Sets collision values on a range of tiles in the set.
    *
    * @method Phaser.Tileset#setCollisionRange
    * @param {number} start - The index to start setting the collision data on.
    * @param {number} stop - The index to stop setting the collision data on.
    * @param {boolean} left - Should the tile collide on the left?
    * @param {boolean} right - Should the tile collide on the right?
    * @param {boolean} up - Should the tile collide on the top?
    * @param {boolean} down - Should the tile collide on the bottom?
    */
    setCollisionRange: function (start, stop, left, right, up, down) {

        if (this.tiles[start] && this.tiles[stop] && start < stop)
        {
            for (var i = start; i <= stop; i++)
            {
                this.tiles[i].setCollision(left, right, up, down);
            }
        }

    },

    /**
    * Sets collision values on a tile in the set.
    *
    * @method Phaser.Tileset#setCollision
    * @param {number} index - The index of the tile within the set.
    * @param {boolean} left - Should the tile collide on the left?
    * @param {boolean} right - Should the tile collide on the right?
    * @param {boolean} up - Should the tile collide on the top?
    * @param {boolean} down - Should the tile collide on the bottom?
    */
    setCollision: function (index, left, right, up, down) {

        if (this.tiles[index])
        {
            this.tiles[index].setCollision(left, right, up, down);
        }

    }

}

/**
* @name Phaser.Tileset#total
* @property {number} total - The total number of tiles in this Tileset.
* @readonly
*/
Object.defineProperty(Phaser.Tileset.prototype, "total", {

    get: function () {
        return this.tiles.length;
    }

});
