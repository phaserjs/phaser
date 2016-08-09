/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Tile set is a combination of an image containing the tiles and collision data per tile.
*
* Tilesets are normally created automatically when Tiled data is loaded.
*
* @class Phaser.Tileset
* @constructor
* @param {string} name - The name of the tileset in the map data.
* @param {integer} firstgid - The first tile index this tileset contains.
* @param {integer} [width=32] - Width of each tile (in pixels).
* @param {integer} [height=32] - Height of each tile (in pixels).
* @param {integer} [margin=0] - The margin around all tiles in the sheet (in pixels).
* @param {integer} [spacing=0] - The spacing between each tile in the sheet (in pixels).
* @param {object} [properties={}] - Custom Tileset properties.
*/
Phaser.Tileset = function (name, firstgid, width, height, margin, spacing, properties) {

    if (width === undefined || width <= 0) { width = 32; }
    if (height === undefined || height <= 0) { height = 32; }
    if (margin === undefined) { margin = 0; }
    if (spacing === undefined) { spacing = 0; }

    /**
    * The name of the Tileset.
    * @property {string} name
    */
    this.name = name;

    /**
    * The Tiled firstgid value.
    * This is the starting index of the first tile index this Tileset contains.
    * @property {integer} firstgid
    */
    this.firstgid = firstgid | 0;

    /**
    * The width of each tile (in pixels).
    * @property {integer} tileWidth
    * @readonly
    */
    this.tileWidth = width | 0;

    /**
    * The height of each tile (in pixels).
    * @property {integer} tileHeight
    * @readonly
    */
    this.tileHeight = height | 0;

    /**
    * The margin around the tiles in the sheet (in pixels).
    * Use `setSpacing` to change.
    * @property {integer} tileMarge
    * @readonly
    */
    // Modified internally
    this.tileMargin = margin | 0;

    /**
    * The spacing between each tile in the sheet (in pixels).
    * Use `setSpacing` to change.
    * @property {integer} tileSpacing
    * @readonly
    */
    this.tileSpacing = spacing | 0;

    /**
    * Tileset-specific properties that are typically defined in the Tiled editor.
    * @property {object} properties
    */
    this.properties = properties || {};

    /**
    * The cached image that contains the individual tiles. Use {@link Phaser.Tileset.setImage setImage} to set.
    * @property {?object} image
    * @readonly
    */
    // Modified internally
    this.image = null;

    /**
    * The number of tile rows in the the tileset.
    * @property {integer}
    * @readonly
    */
    // Modified internally
    this.rows = 0;

    /**
    * The number of tile columns in the tileset.
    * @property {integer} columns
    * @readonly
    */
    // Modified internally
    this.columns = 0;

    /**
    * The total number of tiles in the tileset.
    * @property {integer} total
    * @readonly
    */
    // Modified internally
    this.total = 0;

    /**
    * The look-up table to specific tile image offsets.
    * The coordinates are interlaced such that it is [x0, y0, x1, y1 .. xN, yN] and the tile with the index of firstgid is found at indices 0/1.
    * @property {integer[]} drawCoords
    * @private
    */
    this.drawCoords = [];

};

Phaser.Tileset.prototype = {

    /**
    * Draws a tile from this Tileset at the given coordinates on the context.
    *
    * @method Phaser.Tileset#draw
    * @public
    * @param {CanvasRenderingContext2D} context - The context to draw the tile onto.
    * @param {number} x - The x coordinate to draw to.
    * @param {number} y - The y coordinate to draw to.
    * @param {integer} index - The index of the tile within the set to draw.
    */
    draw: function (context, x, y, index) {

        //  Correct the tile index for the set and bias for interlacing
        var coordIndex = (index - this.firstgid) << 1;

        if (coordIndex >= 0 && (coordIndex + 1) < this.drawCoords.length)
        {
            context.drawImage(
                this.image,
                this.drawCoords[coordIndex],
                this.drawCoords[coordIndex + 1],
                this.tileWidth,
                this.tileHeight,
                x,
                y,
                this.tileWidth,
                this.tileHeight
            );
        }

    },

    /**
    * Returns true if and only if this tileset contains the given tile index.
    *
    * @method Phaser.Tileset#containsTileIndex
    * @public
    * @return {boolean} True if this tileset contains the given index.
    */
    containsTileIndex: function (tileIndex) {

        return (
            tileIndex >= this.firstgid &&
            tileIndex < (this.firstgid + this.total)
        );

    },

    /**
    * Set the image associated with this Tileset and update the tile data.
    *
    * @method Phaser.Tileset#setImage
    * @public
    * @param {Image} image - The image that contains the tiles.
    */
    setImage: function (image) {

        this.image = image;
        this.updateTileData(image.width, image.height);
       
    },

    /**
    * Sets tile spacing and margins.
    *
    * @method Phaser.Tileset#setSpacing
    * @public
    * @param {integer} [margin=0] - The margin around the tiles in the sheet (in pixels).
    * @param {integer} [spacing=0] - The spacing between the tiles in the sheet (in pixels).
    */
    setSpacing: function (margin, spacing) {

        this.tileMargin = margin | 0;
        this.tileSpacing = spacing | 0;

        if (this.image)
        {
            this.updateTileData(this.image.width, this.image.height);
        }

    },

    /**
    * Updates tile coordinates and tileset data.
    *
    * @method Phaser.Tileset#updateTileData
    * @private
    * @param {integer} imageWidth - The (expected) width of the image to slice.
    * @param {integer} imageHeight - The (expected) height of the image to slice.
    */
    updateTileData: function (imageWidth, imageHeight) {

        // May be fractional values
        var rowCount = (imageHeight - this.tileMargin * 2 + this.tileSpacing) / (this.tileHeight + this.tileSpacing);
        var colCount = (imageWidth - this.tileMargin * 2 + this.tileSpacing) / (this.tileWidth + this.tileSpacing);

        if (rowCount % 1 !== 0 || colCount % 1 !== 0)
        {
            console.warn("Phaser.Tileset - " + this.name + " image tile area is not an even multiple of tile size");
        }

        // In Tiled a tileset image that is not an even multiple of the tile dimensions
        // is truncated - hence the floor when calculating the rows/columns.
        rowCount = Math.floor(rowCount);
        colCount = Math.floor(colCount);

        if ((this.rows && this.rows !== rowCount) || (this.columns && this.columns !== colCount))
        {
            console.warn("Phaser.Tileset - actual and expected number of tile rows and columns differ");
        }

        this.rows = rowCount;
        this.columns = colCount;
        this.total = rowCount * colCount;

        this.drawCoords.length = 0;

        var tx = this.tileMargin;
        var ty = this.tileMargin;

        for (var y = 0; y < this.rows; y++)
        {
            for (var x = 0; x < this.columns; x++)
            {
                this.drawCoords.push(tx);
                this.drawCoords.push(ty);
                tx += this.tileWidth + this.tileSpacing;
            }

            tx = this.tileMargin;
            ty += this.tileHeight + this.tileSpacing;
        }

    }

};

Phaser.Tileset.prototype.constructor = Phaser.Tileset;
