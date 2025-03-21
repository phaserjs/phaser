/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * A Tileset is a combination of a single image containing the tiles and a container for data about
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
 * @param {object} [tileData={}] - Data stored per tile. These typically are created in Tiled when editing a tileset, e.g. from Tiled's tile collision editor or terrain editor.
 * @param {object} [tileOffset={x: 0, y: 0}] - Tile texture drawing offset.
 */
var Tileset = new Class({

    initialize:

    function Tileset (name, firstgid, tileWidth, tileHeight, tileMargin, tileSpacing, tileProperties, tileData, tileOffset)
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
         * Controls the drawing offset from the tile origin.
         * Defaults to 0x0, no offset.
         *
         * @name Phaser.Tilemaps.Tileset#tileOffset
         * @type {Phaser.Math.Vector2}
         * @since 3.60.0
         */
        this.tileOffset = new Vector2();

        if (tileOffset !== undefined)
        {
            this.tileOffset.set(tileOffset.x, tileOffset.y);
        }

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
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
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

        /**
         * The number of frames above which a tile is considered to have
         * many animation frames. This is used to optimize rendering.
         * If a tile has fewer frames than this, frames are searched using
         * a linear search. If a tile has more, frames are searched using
         * a binary search.
         *
         * @name Phaser.Tilemaps.Tileset#animationSearchThreshold
         * @type {number}
         * @since 4.0.0
         * @default 64
         */
        this.animationSearchThreshold = 64;

        /**
         * The maximum length of any animation in this tileset, in frames.
         * This is used internally to optimize rendering.
         * It is updated when `createAnimationDataTexture` is called.
         *
         * @name Phaser.Tilemaps.Tileset#maxAnimationLength
         * @type {number}
         * @readonly
         * @since 4.0.0
         */
        this.maxAnimationLength = 0;

        /**
         * The texture containing the animation data for this tileset, if any.
         * This is used by `TilemapGPULayer` to animate tiles.
         *
         * This will be created when `createAnimationDataTexture` is called.
         * Once created, it will be updated when `updateTileData` is called.
         *
         * Each texel stores a 32-bit number.
         * The first set of texels consists of pairs of numbers,
         * describing the total duration and starting index of an animation.
         * The second set of texels are the targets of these indices, also in pairs,
         * describing the duration and actual index of each frame in the animation.
         *
         * @name Phaser.Tilemaps.Tileset#_animationDataTexture
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @private
         */
        this._animationDataTexture = null;

        /**
         * The map from tile index to animation data index.
         * This is used to quickly find the animation data for a tile.
         * This is created when `createAnimationDataTexture` is called.
         * Once created, it will be updated when `updateTileData` is called.
         *
         * @name Phaser.Tilemaps.Tileset#_animationDataIndexMap
         * @type {?Map<number, number>}
         * @private
         */
        this._animationDataIndexMap = null;
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
     * Returns the ID of the tile to use, given a base tile and time,
     * according to the tile's animation properties.
     *
     * If the tile is not animated, this method returns the base tile ID.
     *
     * @method Phaser.Tilemaps.Tileset#getAnimatedTileId
     * @since 4.0.0
     * @param {number} tileIndex - The unique id of the tile across all tilesets in the map.
     * @param {number} milliseconds - The current time in milliseconds.
     * @return {?number} The tile ID to use, or null if the tile is not contained in this tileset.
     */
    getAnimatedTileId: function (tileIndex, milliseconds)
    {
        if (!this.containsTileIndex(tileIndex)) { return null; }

        var animData = this.getTileData(tileIndex);

        if (!(animData && animData.animation)) { return tileIndex; }

        milliseconds = milliseconds % animData.animationDuration;
        var anim = animData.animation;
        var frame = null;

        // Binary search.

        var low = 0;
        var high = anim.length - 1;
        var mid = 0;
        var startTime = 0;

        while (low <= high)
        {
            mid = (low + high) >>> 1;
            frame = anim[mid];
            startTime = frame.startTime;

            if (startTime <= milliseconds && startTime + frame.duration > milliseconds)
            {
                return frame.tileid + this.firstgid;
            }

            if (startTime < milliseconds)
            {
                low = mid + 1;
            }
            else
            {
                high = mid - 1;
            }
        }

        return null;
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

        var frame = texture.get();

        var bounds = texture.getFrameBounds();

        this.glTexture = frame.source.glTexture;

        if (frame.width > bounds.width || frame.height > bounds.height)
        {
            this.updateTileData(frame.width, frame.height);
        }
        else
        {
            this.updateTileData(bounds.width, bounds.height, bounds.x, bounds.y);
        }

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
     * Sets the tile margin and spacing and updates the tile data (rows, columns, etc.).
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
     * @param {number} [offsetX=0] - The x offset in the source texture where the tileset starts.
     * @param {number} [offsetY=0] - The y offset in the source texture where the tileset starts.
     *
     * @return {Phaser.Tilemaps.Tileset} This Tileset object.
     */
    updateTileData: function (imageWidth, imageHeight, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = 0; }

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

        var tx = this.tileMargin + offsetX;
        var ty = this.tileMargin + offsetY;

        for (var y = 0; y < this.rows; y++)
        {
            for (var x = 0; x < this.columns; x++)
            {
                this.texCoordinates.push({ x: tx, y: ty });
                tx += this.tileWidth + this.tileSpacing;
            }

            tx = this.tileMargin + offsetX;
            ty += this.tileHeight + this.tileSpacing;
        }

        // Update the animation data texture.
        if (this._animationDataTexture)
        {
            this.createAnimationDataTexture();
        }

        return this;
    },

    /**
     * Get or create the texture containing the animation data for this tileset.
     * This is used by `TilemapGPULayer` to animate tiles.
     *
     * @method Phaser.Tilemaps.Tileset#getAnimationDataTexture
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer to use.
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The animation data texture.
     */
    getAnimationDataTexture: function (renderer)
    {
        if (!this._animationDataTexture)
        {
            this.createAnimationDataTexture(renderer);
        }

        return this._animationDataTexture;
    },

    /**
     * Get or create the map from tile index to animation data index.
     * This is used by `TilemapGPULayer` to animate tiles.
     *
     * @method Phaser.Tilemaps.Tileset#getAnimationDataIndexMap
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer to use.
     * @return {Map<number, number>} The map from tile index to animation data index.
     */
    getAnimationDataIndexMap: function (renderer)
    {
        if (!this._animationDataIndexMap)
        {
            this.createAnimationDataTexture(renderer);
        }

        return this._animationDataIndexMap;
    },

    /**
     * Creates a new WebGLTexture for the tileset's animation data.
     *
     * @method Phaser.Tilemaps.Tileset#createAnimationDataTexture
     * @since 4.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer to use.
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The new WebGLTexture.
     */
    createAnimationDataTexture: function (renderer)
    {
        var tileData = this.tileData;
        var total = this.total;

        var animations = [];
        var animFrames = [];
        var indexToAnimMap = new Map();

        var maxLength = 0;

        for (var i = 0; i < total; i++)
        {
            var tileDatum = tileData[i];

            if (tileDatum && tileDatum.animation)
            {
                var animation = tileDatum.animation;
                var animationDuration = tileDatum.animationDuration;

                // This index maps to an animation, not a single tile.
                indexToAnimMap.set(i, animations.length);

                // This animation points to a run of frames.
                animations.push([ animationDuration, animFrames.length ]);

                // The run of frames stores the duration and the actual index.
                for (var j = 0; j < animation.length; j++)
                {
                    var frame = animation[j];
                    animFrames.push([ frame.duration, frame.tileid ]);
                }

                // Store the maximum length of any animation.
                maxLength = Math.max(maxLength, animation.length);
            }
        }

        var totalTuples = animations.length + animFrames.length;

        if (totalTuples > 4096 * 4096 / 2)
        {
            throw new Error('Tileset.animationDataTexture: too many animations - total number of animations plus animation frames is max 8388608, got ' + (totalTuples));
        }

        var size = totalTuples * 2;
        var width = Math.min(size, 4096);
        var height = Math.ceil(size / 4096);

        var u32 = new Uint32Array(width * height);
        var offset = 0;

        var animLen = animations.length;

        for (i = 0; i < animLen; i++)
        {
            animation = animations[i];
            var duration = animation[0];
            var index = animation[1];
            u32[offset++] = duration;

            // Store the index as an offset from the start of the animation frames.
            // Double the index to account for the 2x 32-bit values per entry.
            u32[offset++] = (index + animLen) * 2;
        }

        for (i = 0; i < animFrames.length; i++)
        {
            frame = animFrames[i];
            var frameDuration = frame[0];
            var frameIndex = frame[1];
            u32[offset++] = frameDuration;
            u32[offset++] = frameIndex;
        }

        // Create or update the animation data texture.
        if (this.animationDataTexture)
        {
            this.animationDataTexture.destroy();
        }

        var u8 = new Uint8Array(u32.buffer);
        this._animationDataTexture = renderer.createUint8ArrayTexture(u8, width, height, false, true);
        this._animationDataIndexMap = indexToAnimMap;
        this.maxAnimationLength = maxLength;
    }

});

module.exports = Tileset;
