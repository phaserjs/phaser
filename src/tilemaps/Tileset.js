/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * A Tileset is a combination of an image containing the tiles and a container for data about
 * each tile.
 *
 * @class Tileset
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {string} name - The name of the tileset in the map data.
 * @param {number} firstgid - The first tile index this tileset contains.
 * @param {number} [tileWidth=32] - Width of each tile (in pixels).
 * @param {number} [tileHeight=32] - Height of each tile (in pixels).
 * @param {number} [tileMargin=0] - The margin around all tiles in the sheet (in pixels).
 * @param {number} [tileSpacing=0] - The spacing between each tile in the sheet (in pixels).
 * @param {object} [tileProperties={}] - Custom properties defined per tile in the Tileset.
 * These typically are custom properties created in Tiled when editing a tileset.
 * @param {object} [tileData={}] - Data stored per tile. These typically are created in Tiled
 * when editing a tileset, e.g. from Tiled's tile collision editor or terrain editor.
 */
var Tileset = new Class({

    initialize:

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
         *
         * @name Phaser.Tilemaps.Tileset#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = name;

        /**
         * The starting index of the first tile index this Tileset contains.
         *
         * @name Phaser.Tilemaps.Tileset#firstgid
         * @type {number}
         * @since 3.0.0
         */
        this.firstgid = firstgid;

        /**
         * The width of each tile (in pixels). Use setTileSize to change.
         *
         * @name Phaser.Tilemaps.Tileset#tileWidth
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.tileWidth = tileWidth;

        /**
         * The height of each tile (in pixels). Use setTileSize to change.
         *
         * @name Phaser.Tilemaps.Tileset#tileHeight
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.tileHeight = tileHeight;

        /**
         * The margin around the tiles in the sheet (in pixels). Use `setSpacing` to change.
         *
         * @name Phaser.Tilemaps.Tileset#tileMargin
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.tileMargin = tileMargin;

        /**
         * The spacing between each the tile in the sheet (in pixels). Use `setSpacing` to change.
         *
         * @name Phaser.Tilemaps.Tileset#tileSpacing
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.tileSpacing = tileSpacing;

        /**
         * Tileset-specific properties per tile that are typically defined in the Tiled editor in the
         * Tileset editor.
         *
         * @name Phaser.Tilemaps.Tileset#tileProperties
         * @type {object}
         * @since 3.0.0
         */
        this.tileProperties = tileProperties;

        /**
         * Tileset-specific data per tile that are typically defined in the Tiled editor, e.g. within
         * the Tileset collision editor. This is where collision objects and terrain are stored.
         *
         * @name Phaser.Tilemaps.Tileset#tileData
         * @type {object}
         * @since 3.0.0
         */
        this.tileData = tileData;

        /**
         * The cached image that contains the individual tiles. Use setImage to set.
         *
         * @name Phaser.Tilemaps.Tileset#image
         * @type {?Phaser.Textures.Texture}
         * @readonly
         * @since 3.0.0
         */
        this.image = null;

        /**
         * The gl texture used by the WebGL renderer.
         *
         * @name Phaser.Tilemaps.Tileset#glTexture
         * @type {?WebGLTexture}
         * @readonly
         * @since 3.11.0
         */
        this.glTexture = null;

        /**
         * The number of tile rows in the the tileset.
         *
         * @name Phaser.Tilemaps.Tileset#rows
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.rows = 0;

        /**
         * The number of tile columns in the tileset.
         *
         * @name Phaser.Tilemaps.Tileset#columns
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.columns = 0;

        /**
         * The total number of tiles in the tileset.
         *
         * @name Phaser.Tilemaps.Tileset#total
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.total = 0;

        /**
         * The look-up table to specific tile image texture coordinates (UV in pixels). Each element
         * contains the coordinates for a tile in an object of the form {x, y}.
         *
         * @name Phaser.Tilemaps.Tileset#texCoordinates
         * @type {object[]}
         * @readonly
         * @since 3.0.0
        */
        this.texCoordinates = [];
    },

    /**
     * Get a tiles properties that are stored in the Tileset. Returns null if tile index is not
     * contained in this Tileset. This is typically defined in Tiled under the Tileset editor.
     *
     * @method Phaser.Tilemaps.Tileset#getTileProperties
     * @since 3.0.0
     *
     * @param {number} tileIndex - The unique id of the tile across all tilesets in the map.
     *
     * @return {?(object|undefined)}
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
     * @method Phaser.Tilemaps.Tileset#getTileData
     * @since 3.0.0
     *
     * @param {number} tileIndex - The unique id of the tile across all tilesets in the map.
     *
     * @return {?object|undefined}
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
     * @method Phaser.Tilemaps.Tileset#getTileCollisionGroup
     * @since 3.0.0
     *
     * @param {number} tileIndex - The unique id of the tile across all tilesets in the map.
     *
     * @return {?object}
     */
    getTileCollisionGroup: function (tileIndex)
    {
        var data = this.getTileData(tileIndex);

        return (data && data.objectgroup) ? data.objectgroup : null;
    },

    /**
     * Returns true if and only if this Tileset contains the given tile index.
     *
     * @method Phaser.Tilemaps.Tileset#containsTileIndex
     * @since 3.0.0
     *
     * @param {number} tileIndex - The unique id of the tile across all tilesets in the map.
     *
     * @return {boolean}
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
     * @method Phaser.Tilemaps.Tileset#getTileTextureCoordinates
     * @since 3.0.0
     *
     * @param {number} tileIndex - The unique id of the tile across all tilesets in the map.
     *
     * @return {?object} Object in the form { x, y } representing the top-left UV coordinate
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
     * @method Phaser.Tilemaps.Tileset#setImage
     * @since 3.0.0
     *
     * @param {Phaser.Textures.Texture} texture - The image that contains the tiles.
     *
     * @return {Phaser.Tilemaps.Tileset} This Tileset object.
     */
    setImage: function (texture)
    {
        this.image = texture;

        this.glTexture = texture.get().source.glTexture;

        this.updateTileData(this.image.source[0].width, this.image.source[0].height);

        return this;
    },

    /**
     * Sets the tile width & height and updates the tile data (rows, columns, etc.).
     *
     * @method Phaser.Tilemaps.Tileset#setTileSize
     * @since 3.0.0
     *
     * @param {number} [tileWidth] - The width of a tile in pixels.
     * @param {number} [tileHeight] - The height of a tile in pixels.
     *
     * @return {Phaser.Tilemaps.Tileset} This Tileset object.
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
     * @method Phaser.Tilemaps.Tileset#setSpacing
     * @since 3.0.0
     *
     * @param {number} [margin] - The margin around the tiles in the sheet (in pixels).
     * @param {number} [spacing] - The spacing between the tiles in the sheet (in pixels).
     *
     * @return {Phaser.Tilemaps.Tileset} This Tileset object.
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
     * @method Phaser.Tilemaps.Tileset#updateTileData
     * @since 3.0.0
     *
     * @param {number} imageWidth - The (expected) width of the image to slice.
     * @param {number} imageHeight - The (expected) height of the image to slice.
     *
     * @return {Phaser.Tilemaps.Tileset} This Tileset object.
     */
    updateTileData: function (imageWidth, imageHeight)
    {
        var rowCount = (imageHeight - this.tileMargin * 2 + this.tileSpacing) / (this.tileHeight + this.tileSpacing);
        var colCount = (imageWidth - this.tileMargin * 2 + this.tileSpacing) / (this.tileWidth + this.tileSpacing);

        if (rowCount % 1 !== 0 || colCount % 1 !== 0)
        {
            console.warn('Image tile area not tile size multiple in: ' + this.name);
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
