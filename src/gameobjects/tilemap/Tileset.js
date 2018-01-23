var Class = require('../../utils/Class');

var Tileset = new Class({

    initialize:

    /**
     * A Tileset is a combination of an image containing the tiles and a container for data about
     * each tile.
     *
     * @class Tileset
     * @constructor
     *
     * @param {string} name - The name of the tileset in the map data.
     * @param {integer} firstgid - The first tile index this tileset contains.
     * @param {integer} [tileWidth=32] - Width of each tile (in pixels).
     * @param {integer} [tileHeight=32] - Height of each tile (in pixels).
     * @param {integer} [tileMargin=0] - The margin around all tiles in the sheet (in pixels).
     * @param {integer} [tileSpacing=0] - The spacing between each tile in the sheet (in pixels).
     * @param {object} [tileProperties={}] - Custom properties defined per tile in the Tileset.
     * These typically are custom properties created in Tiled when editing a tileset.
     * @param {object} [tileData={}] - Data stored per tile. These typically are created in Tiled
     * when editing a tileset, e.g. from Tiled's tile collision editor or terrain editor.
     */
    function Tileset (name, firstgid, tileWidth, tileHeight, tileMargin, tileSpacing, tileProperties, tileData)
    {
        if (tileWidth === undefined || tileWidth <= 0) { tileWidth = 32; }
        if (tileHeight === undefined || tileHeight <= 0) { tileHeight = 32; }
        if (tileMargin === undefined) { tileMargin = 0; }
        if (tileSpacing === undefined) { tileSpacing = 0; }
        if (tileProperties === undefined) { tileProperties = {}; }
        if (tileData === undefined) { tileData = {}; }

        /**
         * The name of the Tileset.
         * @property {string} name
         */
        this.name = name;

        /**
         * The starting index of the first tile index this Tileset contains.
         * @property {integer} firstgid
         */
        this.firstgid = firstgid;

        /**
         * The width of each tile (in pixels). Use setTileSize to change.
         * @property {integer} tileWidth
         * @readonly
         */
        this.tileWidth = tileWidth;

        /**
         * The height of each tile (in pixels). Use setTileSize to change.
         * @property {integer} tileHeight
         * @readonly
         */
        this.tileHeight = tileHeight;

        /**
         * The margin around the tiles in the sheet (in pixels). Use `setSpacing` to change.
         * @property {integer} tileMargin
         * @readonly
         */
        this.tileMargin = tileMargin;

        /**
         * The spacing between each the tile in the sheet (in pixels). Use `setSpacing` to change.
         * @property {integer} tileSpacing
         * @readonly
         */
        this.tileSpacing = tileSpacing;

        /**
        * Tileset-specific properties per tile that are typically defined in the Tiled editor in the
        * Tileset editor.
        * @property {object} tileProperties
        */
        this.tileProperties = tileProperties;

        /**
        * Tileset-specific data per tile that are typically defined in the Tiled editor, e.g. within
        * the Tilset collision editor. This is where collision objects and terrain are stored.
        * @property {object} tileData
        */
        this.tileData = tileData;

        /**
         * The cached image that contains the individual tiles. Use setImage to set.
         * @property {Texture|null} image
         * @readonly
         */
        this.image = null;

        /**
         * The number of tile rows in the the tileset.
         * @property {integer} rows
         * @readonly
         */
        this.rows = 0;

        /**
         * The number of tile columns in the tileset.
         * @property {integer} columns
         * @readonly
         */
        this.columns = 0;

        /**
         * The total number of tiles in the tileset.
         * @property {integer} total
         * @readonly
         */
        this.total = 0;

        /**
         * The look-up table to specific tile image texture coordinates (UV in pixels). Each element
         * contains the coordinates for a tile in an object of the form {x, y}.
         * @property {object[]} texCoordinates
         * @readonly
        */
        this.texCoordinates = [];
    },

    /**
     * Get a tile's properties that are stored in the Tileset. Returns null if tile index is not
     * contained in this Tileset. This is typically defined in Tiled under the Tileset editor.
     *
     * @param {integer} tileIndex - The unique id of the tile across all tilesets in the map.
     * @returns {object|undefined|null}
     */
    getTileProperties: function (tileIndex)
    {
        if (!this.containsTileIndex(tileIndex)) { return null; }
        return this.tileProperties[tileIndex - this.firstgid];
    },

    /**
     * Get a tile's data that is stored in the Tileset. Returns null if tile index is not contained
     * in this Tileset. This is typically defined in Tiled and will contain both Tileset collision
     * info and terrain mapping.
     *
     * @param {integer} tileIndex - The unique id of the tile across all tilesets in the map.
     * @returns {object|undefined|null}
     */
    getTileData: function (tileIndex)
    {
        if (!this.containsTileIndex(tileIndex)) { return null; }
        return this.tileData[tileIndex - this.firstgid];
    },

    /**
     * Get a tile's collision group that is stored in the Tileset. Returns null if tile index is not
     * contained in this Tileset. This is typically defined within Tiled's tileset collision editor.
     *
     * @param {integer} tileIndex - The unique id of the tile across all tilesets in the map.
     * @returns {object|null}
     */
    getTileCollisionGroup: function (tileIndex)
    {
        var data = this.getTileData(tileIndex);
        return (data && data.objectgroup) ? data.objectgroup : null;
    },


    /**
     * Returns true if and only if this Tileset contains the given tile index.
     *
     * @param {integer} tileIndex - The unique id of the tile across all tilesets in the map.
     * @returns {boolean}
     */
    containsTileIndex: function (tileIndex)
    {
        return (
            tileIndex >= this.firstgid &&
            tileIndex < (this.firstgid + this.total)
        );
    },

    /**
     * Returns the texture coordinates (UV in pixels) in the Tileset image for the given tile index.
     * Returns null if tile index is not contained in this Tileset.
     *
     * @param {integer} tileIndex - The unique id of the tile across all tilesets in the map.
     * @returns {object|null} Object in the form { x, y } representing the top-left UV coordinate
     * within the Tileset image.
     */
    getTileTextureCoordinates: function (tileIndex)
    {
        if (!this.containsTileIndex(tileIndex)) { return null; }
        return this.texCoordinates[tileIndex - this.firstgid];
    },

    /**
     * Sets the image associated with this Tileset and updates the tile data (rows, columns, etc.).
     *
     * @param {Texture} texture - The image that contains the tiles.
     * @returns {this}
     */
    setImage: function (texture)
    {
        this.image = texture;
        this.updateTileData(this.image.source[0].width, this.image.source[0].height);
        return this;
    },

    /**
     * Sets the tile width & height and updates the tile data (rows, columns, etc.).
     *
     * @param {integer} [tileWidth] - The width of a tile in pixels.
     * @param {integer} [tileHeight] - The height of a tile in pixels.
     * @returns {this}
     */
    setTileSize: function (tileWidth, tileHeight)
    {
        if (tileWidth !== undefined) { this.tileWidth = tileWidth; }
        if (tileHeight !== undefined) { this.tileHeight = tileHeight; }

        if (this.image)
        {
            this.updateTileData(this.image.source[0].width, this.image.source[0].height);
        }

        return this;
    },

    /**
     * Sets the tile margin & spacing and updates the tile data (rows, columns, etc.).
     *
     * @param {integer} [margin] - The margin around the tiles in the sheet (in pixels).
     * @param {integer} [spacing] - The spacing between the tiles in the sheet (in pixels).
     * @returns {this}
     */
    setSpacing: function (margin, spacing)
    {
        if (margin !== undefined) { this.tileMargin = margin; }
        if (spacing !== undefined) { this.tileSpacing = spacing; }

        if (this.image)
        {
            this.updateTileData(this.image.source[0].width, this.image.source[0].height);
        }

        return this;
    },

    /**
     * Updates tile texture coordinates and tileset data.
     *
     * @param {integer} imageWidth - The (expected) width of the image to slice.
     * @param {integer} imageHeight - The (expected) height of the image to slice.
     * @returns {this}
     */
    updateTileData: function (imageWidth, imageHeight)
    {
        var rowCount = (imageHeight - this.tileMargin * 2 + this.tileSpacing) / (this.tileHeight + this.tileSpacing);
        var colCount = (imageWidth - this.tileMargin * 2 + this.tileSpacing) / (this.tileWidth + this.tileSpacing);

        if (rowCount % 1 !== 0 || colCount % 1 !== 0)
        {
            console.warn('Tileset ' + this.name + ' image tile area is not an even multiple of tile size');
        }

        // In Tiled a tileset image that is not an even multiple of the tile dimensions is truncated
        // - hence the floor when calculating the rows/columns.
        rowCount = Math.floor(rowCount);
        colCount = Math.floor(colCount);

        this.rows = rowCount;
        this.columns = colCount;

        // In Tiled, "empty" spaces in a tileset count as tiles and hence count towards the gid
        this.total = rowCount * colCount;

        this.texCoordinates.length = 0;

        var tx = this.tileMargin;
        var ty = this.tileMargin;

        for (var y = 0; y < this.rows; y++)
        {
            for (var x = 0; x < this.columns; x++)
            {
                this.texCoordinates.push({ x: tx, y: ty });
                tx += this.tileWidth + this.tileSpacing;
            }

            tx = this.tileMargin;
            ty += this.tileHeight + this.tileSpacing;
        }

        return this;
    }
});

module.exports = Tileset;
