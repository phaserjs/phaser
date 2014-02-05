/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Tile set is a combination of an image containing the tiles and collision data per tile.
* You should not normally instantiate this class directly.
*
* @class Phaser.Tileset
* @constructor
* @param {string} name - The name of the tileset in the map data.
* @param {number} firstgid - The Tiled firstgid value.
* @param {number} width - Width of each tile in pixels.
* @param {number} height - Height of each tile in pixels.
* @param {number} margin - The amount of margin around the tilesheet.
* @param {number} spacing - The amount of spacing between each tile in the sheet.
* @param {object} properties - Tileset properties.
*/
Phaser.Tileset = function (name, firstgid, width, height, margin, spacing, properties) {

    /**
    * @property {string} name - The name of the Tileset.
    */
    this.name = name;

    /**
    * @property {number} firstgid - The Tiled firstgid value.
    * @default
    */
    this.firstgid = firstgid;

    /**
    * @property {number} tileWidth - The width of a tile in pixels.
    */
    this.tileWidth = width;

    /**
    * @property {number} tileHeight - The height of a tile in pixels.
    */
    this.tileHeight = height;

    /**
    * @property {number} tileMargin - The margin around the tiles in the sheet.
    */
    this.tileMargin = margin;

    /**
    * @property {number} tileSpacing - The margin around the tiles in the sheet.
    */
    this.tileSpacing = spacing;

    /**
    * @property {object} properties - Tileset specific properties (typically defined in the Tiled editor).
    */
    this.properties = properties;

    /**
    * @property {object} tilePproperties - Tile specific properties (typically defined in the Tiled editor).
    */
    // this.tileProperties = {};

    /**
    * @property {object} image - The image used for rendering. This is a reference to the image stored in Phaser.Cache.
    */
    this.image = null;

    /**
    * @property {number} rows - The number of rows in the tile sheet.
    */
    this.rows = 0;

    /**
    * @property {number} columns - The number of columns in the tile sheet.
    */
    this.columns = 0;

    /**
    * @property {number} total - The total number of tiles in the tilesheet.
    */
    this.total = 0;

};

Phaser.Tileset.prototype = {

    /**
    * Gets a Tile from this set.
    *
    * @method Phaser.Tileset#getTile
    * @param {number} index - The index of the tile within the set.
    * @return {object} The tile object.
    getTile: function (index) {

        return this.tiles[index];

    },
    */

    /**
    * Gets a Tile from this set.
    *
    * @method Phaser.Tileset#getTileX
    * @param {number} index - The index of the tile within the set.
    * @return {object} The tile object.
    getTileX: function (index) {

        return this.tiles[index][0];

    },
    */

    /**
    * Gets a Tile from this set.
    *
    * @method Phaser.Tileset#getTileY
    * @param {number} index - The index of the tile within the set.
    * @return {object} The tile object.
    getTileY: function (index) {

        return this.tiles[index][1];

    },
    */

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
    * Checks if the tile at the given index exists.
    *
    * @method Phaser.Tileset#checkTileIndex
    * @param {number} index - The index of the tile within the set.
    * @return {boolean} True if a tile exists at the given index otherwise false.
    checkTileIndex: function (index) {

        return (this.tiles[index]);

    }
    */

};

Phaser.Tileset.prototype.constructor = Phaser.Tileset;
