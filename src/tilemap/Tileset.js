/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
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

    if (typeof width === 'undefined' || width <= 0) { width = 32; }
    if (typeof height === 'undefined' || height <= 0) { height = 32; }
    if (typeof margin === 'undefined') { margin = 0; }
    if (typeof spacing === 'undefined') { spacing = 0; }

    /**
    * The name of the Tileset.
    * @member {string}
    */
    this.name = name;

    /**
    * The Tiled firstgid value.
    * This is the starting index of the first tile index this Tileset contains.
    * @member {integer}
    */
    this.firstgid = firstgid | 0;

    /**
    * The width of each tile (in pixels).
    * @member {integer}
    */
    this.tileWidth = width | 0;

    /**
    * The height of each tile (in pixels).
    * @member {integer}
    */
    this.tileHeight = height | 0;

    /**
    * The margin around the tiles in the sheet (in pixels).
    * @member {integer}
    */
    this.tileMargin = margin | 0;

    /**
    * The spacing between each tile in the sheet (in pixels).
    * @member {integer}
    */
    this.tileSpacing = spacing | 0;

    /**
    * Tileset-specific properties that are typically defined in the Tiled editor.
    * @member {object}
    */
    this.properties = properties || {};

    /**
    * The cached image that contains the individual tiles. Use `setImage` to set.
    * @member {?object}
    */
    // Modified internally
    this.image = null;

    /**
    * The number of rows in the tile sheet.
    * @member {integer}
    * @readonly
    */
    // Modified internally
    this.rows = 0;

    /**
    * The number of columns in the sheet.
    * @member {integer}
    * @readonly
    */
    // Modified internally
    this.columns = 0;

    /**
    * The total number of tiles in the sheet.
    * @member {integer}
    * @readonly
    */
    // Modified internally
    this.total = 0;

    /**
    * The look-up table to specific tile image offsets.
    * The coordinates are interlaced such that it is [x0, y0, x1, y1 .. xN, yN] and the tile with the index of firstgid is found at indices 0/1.
    * @member {integer[]}
    * @private
    */
    this.drawCoords = [];

};

Phaser.Tileset.prototype = {

    /**
    * Draws a tile from this Tileset at the given coordinates on the context.
    *
    * @method Phaser.Tileset#draw
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
    * @public
    * @return {boolean} True if this tileset contains the given index.
    */
    containsTileIndex: function (tileIndex)
    {

        return (
            tileIndex >= this.firstgid &&
            tileIndex < (this.firstgid + this.total)
        );

    },

    /**
    * Set the image associated with this Tileset and update the tile data.
    *
    * @public
    * @param {Image} image - The image that contains the tiles.
    */
    setImage: function (image) {

        this.image = image;
        this.updateTileData();
       
    },

    /**
    * Sets tile spacing and margins.
    *
    * @public
    * @param {integer} tileMargin - The margin around the tiles in the sheet (in pixels).
    * @param {integer} tileSpacing - The spacing between the tiles in the sheet (in pixels).
    */
    setSpacing: function (margin, spacing) {

        this.tileMargin = margin | 0;
        this.tileSpacing = spacing | 0;

        this.updateTileData();

    },

    /**
    * Updates tile coordinates and tileset data.
    *    
    * @protected
    */
    updateTileData: function () {

        this.rows = Math.round((image.height - this.tileMargin) / (this.tileHeight + this.tileSpacing));
        this.columns = Math.round((image.width - this.tileMargin) / (this.tileWidth + this.tileSpacing));
        this.total = this.rows * this.columns;

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
