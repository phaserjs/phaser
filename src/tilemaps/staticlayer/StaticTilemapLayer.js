/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../../gameobjects/components');
var CONST = require('../../const');
var GameObject = require('../../gameobjects/GameObject');
var StaticTilemapLayerRender = require('./StaticTilemapLayerRender');
var TilemapComponents = require('../components');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @classdesc
 * A StaticTilemapLayer is a game object that renders LayerData from a Tilemap. A
 * StaticTilemapLayer can only render tiles from a single tileset.
 *
 * A StaticTilemapLayer is optimized for speed over flexibility. You cannot apply per-tile
 * effects like tint or alpha. You cannot change the tiles in a StaticTilemapLayer. Use this
 * over a DynamicTilemapLayer when you don't need either of those features.
 *
 * @class StaticTilemapLayer
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {integer} layerIndex - The index of the LayerData associated with this layer.
 * @param {Phaser.Tilemaps.Tileset} tileset - The tileset used to render the tiles in this layer.
 * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
 * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
 */
var StaticTilemapLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        StaticTilemapLayerRender
    ],

    initialize:

    function StaticTilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        GameObject.call(this, scene, 'StaticTilemapLayer');

        /**
         * Used internally by physics system to perform fast type checks.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#isTilemap
         * @type {boolean}
         * @readOnly
         * @since 3.0.0
         */
        this.isTilemap = true;

        /**
         * The Tilemap that this layer is a part of.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#tilemap
         * @type {Phaser.Tilemaps.Tilemap}
         * @since 3.0.0
         */
        this.tilemap = tilemap;

        /**
         * The index of the LayerData associated with this layer.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#layerIndex
         * @type {integer}
         * @since 3.0.0
         */
        this.layerIndex = layerIndex;

        /**
         * The LayerData associated with this layer. LayerData can only be associated with one
         * tilemap layer.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#layer
         * @type {Phaser.Tilemaps.LayerData}
         * @since 3.0.0
         */
        this.layer = tilemap.layers[layerIndex];

        this.layer.tilemapLayer = this; // Link the LayerData with this static tilemap layer

        /**
         * The Tileset associated with this layer. A tilemap layer can only render from one Tileset.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#tileset
         * @type {Phaser.Tilemaps.Tileset}
         * @since 3.0.0
         */
        this.tileset = tileset;

        /**
         * Used internally with the canvas render. This holds the tiles that are visible within the
         * camera.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#culledTiles
         * @type {array}
         * @since 3.0.0
         */
        this.culledTiles = [];

        /**
         * @name Phaser.Tilemaps.StaticTilemapLayer#vertexBuffer
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this.vertexBuffer = null;

        /**
         * @name Phaser.Tilemaps.StaticTilemapLayer#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @private
         * @since 3.0.0
         */
        this.renderer = scene.sys.game.renderer;

        /**
         * @name Phaser.Tilemaps.StaticTilemapLayer#bufferData
         * @type {ArrayBuffer}
         * @private
         * @since 3.0.0
         */
        this.bufferData = null;

        /**
         * @name Phaser.Tilemaps.StaticTilemapLayer#vertexViewF32
         * @type {Float32Array}
         * @private
         * @since 3.0.0
         */
        this.vertexViewF32 = null;

        /**
         * @name Phaser.Tilemaps.StaticTilemapLayer#vertexViewU32
         * @type {Uint32Array}
         * @private
         * @since 3.0.0
         */
        this.vertexViewU32 = null;

        /**
         * @name Phaser.Tilemaps.StaticTilemapLayer#dirty
         * @type {boolean}
         * @private
         * @since 3.0.0
         */
        this.dirty = true;

        /**
         * @name Phaser.Tilemaps.StaticTilemapLayer#vertexCount
         * @type {integer}
         * @private
         * @since 3.0.0
         */
        this.vertexCount = 0;

        this.setAlpha(this.layer.alpha);
        this.setPosition(x, y);
        this.setOrigin();
        this.setSize(this.layer.tileWidth * this.layer.width, this.layer.tileHeight * this.layer.height);

        this.initPipeline('TextureTintPipeline');

        if (scene.sys.game.config.renderType === CONST.WEBGL)
        {
            scene.sys.game.renderer.onContextRestored(function ()
            {
                this.dirty = true;
                this.vertexBuffer = null;
            }, this);
        }
    },

    /**
     * Upload the tile data to a VBO.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#upload
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to render to.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    upload: function (camera)
    {
        var tileset = this.tileset;
        var mapWidth = this.layer.width;
        var mapHeight = this.layer.height;
        var width = tileset.image.source[0].width;
        var height = tileset.image.source[0].height;
        var mapData = this.layer.data;
        var renderer = this.renderer;
        var tile;
        var row;
        var col;
        var texCoords;

        if (renderer.gl)
        {
            var pipeline = renderer.pipelines.TextureTintPipeline;

            if (this.dirty)
            {
                var gl = renderer.gl;
                var vertexBuffer = this.vertexBuffer;
                var bufferData = this.bufferData;
                var voffset = 0;
                var vertexCount = 0;
                var bufferSize = (mapWidth * mapHeight) * pipeline.vertexSize * 6;

                if (bufferData === null)
                {
                    bufferData = new ArrayBuffer(bufferSize);
                    this.bufferData = bufferData;
                    this.vertexViewF32 = new Float32Array(bufferData);
                    this.vertexViewU32 = new Uint32Array(bufferData);
                }

                var vertexViewF32 = this.vertexViewF32;
                var vertexViewU32 = this.vertexViewU32;

                for (row = 0; row < mapHeight; ++row)
                {
                    for (col = 0; col < mapWidth; ++col)
                    {
                        tile = mapData[row][col];
                        if (tile === null || tile.index === -1) { continue; }

                        var tx = tile.pixelX;
                        var ty = tile.pixelY;
                        var txw = tx + tile.width;
                        var tyh = ty + tile.height;

                        texCoords = tileset.getTileTextureCoordinates(tile.index);
                        if (texCoords === null) { continue; }

                        var u0 = texCoords.x / width;
                        var v0 = texCoords.y / height;
                        var u1 = (texCoords.x + tile.width) / width;
                        var v1 = (texCoords.y + tile.height) / height;

                        var tx0 = tx;
                        var ty0 = ty;
                        var tx1 = tx;
                        var ty1 = tyh;
                        var tx2 = txw;
                        var ty2 = tyh;
                        var tx3 = txw;
                        var ty3 = ty;
                        var tint = Utils.getTintAppendFloatAlpha(0xffffff, this.alpha * tile.alpha);

                        vertexViewF32[voffset + 0] = tx0;
                        vertexViewF32[voffset + 1] = ty0;
                        vertexViewF32[voffset + 2] = u0;
                        vertexViewF32[voffset + 3] = v0;
                        vertexViewU32[voffset + 4] = tint;
                        vertexViewF32[voffset + 5] = tx1;
                        vertexViewF32[voffset + 6] = ty1;
                        vertexViewF32[voffset + 7] = u0;
                        vertexViewF32[voffset + 8] = v1;
                        vertexViewU32[voffset + 9] = tint;
                        vertexViewF32[voffset + 10] = tx2;
                        vertexViewF32[voffset + 11] = ty2;
                        vertexViewF32[voffset + 12] = u1;
                        vertexViewF32[voffset + 13] = v1;
                        vertexViewU32[voffset + 14] = tint;
                        vertexViewF32[voffset + 15] = tx0;
                        vertexViewF32[voffset + 16] = ty0;
                        vertexViewF32[voffset + 17] = u0;
                        vertexViewF32[voffset + 18] = v0;
                        vertexViewU32[voffset + 19] = tint;
                        vertexViewF32[voffset + 20] = tx2;
                        vertexViewF32[voffset + 21] = ty2;
                        vertexViewF32[voffset + 22] = u1;
                        vertexViewF32[voffset + 23] = v1;
                        vertexViewU32[voffset + 24] = tint;
                        vertexViewF32[voffset + 25] = tx3;
                        vertexViewF32[voffset + 26] = ty3;
                        vertexViewF32[voffset + 27] = u1;
                        vertexViewF32[voffset + 28] = v0;
                        vertexViewU32[voffset + 29] = tint;

                        voffset += 30;
                        vertexCount += 6;
                    }
                }

                this.vertexCount = vertexCount;
                this.dirty = false;
                if (vertexBuffer === null)
                {
                    vertexBuffer = renderer.createVertexBuffer(bufferData, gl.STATIC_DRAW);
                    this.vertexBuffer = vertexBuffer;
                }
                else
                {
                    renderer.setVertexBuffer(vertexBuffer);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 0, bufferData);
                }
            }

            pipeline.modelIdentity();
            pipeline.modelTranslate(this.x - (camera.scrollX * this.scrollFactorX), this.y - (camera.scrollY * this.scrollFactorY), 0.0);
            pipeline.modelScale(this.scaleX, this.scaleY, 1.0);
            pipeline.viewLoad2D(camera.matrix.matrix);
        }

        return this;
    },

    /**
     * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
     * faces are used internally for optimizing collisions against tiles. This method is mostly used
     * internally to optimize recalculating faces when only one tile has been changed.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#calculateFacesAt
     * @since 3.0.0
     *
     * @param {integer} tileX - The x coordinate.
     * @param {integer} tileY - The y coordinate.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    calculateFacesAt: function (tileX, tileY)
    {
        TilemapComponents.CalculateFacesAt(tileX, tileY, this.layer);

        return this;
    },

    /**
     * Calculates interesting faces within the rectangular area specified (in tile coordinates) of the
     * layer. Interesting faces are used internally for optimizing collisions against tiles. This method
     * is mostly used internally.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#calculateFacesWithin
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    calculateFacesWithin: function (tileX, tileY, width, height)
    {
        TilemapComponents.CalculateFacesWithin(tileX, tileY, width, height, this.layer);

        return this;
    },

    /**
     * Creates a Sprite for every object matching the given tile indexes in the layer. You can
     * optionally specify if each tile will be replaced with a new tile after the Sprite has been
     * created. This is useful if you want to lay down special tiles in a level that are converted to
     * Sprites, but want to replace the tile itself with a floor tile or similar once converted.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#createFromTiles
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - The tile index, or array of indexes, to create Sprites from.
     * @param {(integer|array)} replacements - The tile index, or array of indexes, to change a converted
     * tile to. Set to `null` to leave the tiles unchanged. If an array is given, it is assumed to be a
     * one-to-one mapping with the indexes array.
     * @param {object} spriteConfig - The config object to pass into the Sprite creator (i.e.
     * scene.make.sprite).
     * @param {Phaser.Scene} [scene=scene the map is within] - The Scene to create the Sprites within.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when determining the world XY
     *
     * @return {Phaser.GameObjects.Sprite[]} An array of the Sprites that were created.
     */
    createFromTiles: function (indexes, replacements, spriteConfig, scene, camera)
    {
        return TilemapComponents.CreateFromTiles(indexes, replacements, spriteConfig, scene, camera, this.layer);
    },

    /**
     * Returns the tiles in the given layer that are within the cameras viewport.
     * This is used internally.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#cull
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    cull: function (camera)
    {
        return TilemapComponents.CullTiles(this.layer, camera, this.culledTiles);
    },

    /**
     * Destroys this StaticTilemapLayer and removes its link to the associated LayerData.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        // Uninstall this layer only if it is still installed on the LayerData object
        if (this.layer.tilemapLayer === this)
        {
            this.layer.tilemapLayer = undefined;
        }

        this.tilemap = undefined;
        this.layer = undefined;
        this.tileset = undefined;

        GameObject.prototype.destroy.call(this);
    },

    /**
     * Searches the entire map layer for the first tile matching the given index, then returns that Tile
     * object. If no match is found, it returns null. The search starts from the top-left tile and
     * continues horizontally until it hits the end of the row, then it drops down to the next column.
     * If the reverse boolean is true, it scans starting from the bottom-right corner traveling up to
     * the top-left.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#findByIndex
     * @since 3.0.0
     *
     * @param {integer} index - The tile index value to search for.
     * @param {integer} [skip=0] - The number of times to skip a matching tile before returning.
     * @param {boolean} [reverse=false] - If true it will scan the layer in reverse, starting at the
     * bottom-right. Otherwise it scans from the top-left.
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    findByIndex: function (findIndex, skip, reverse)
    {
        return TilemapComponents.FindByIndex(findIndex, skip, reverse, this.layer);
    },

    /**
     * Find the first tile in the given rectangular area (in tile coordinates) of the layer that
     * satisfies the provided testing function. I.e. finds the first tile for which `callback` returns
     * true. Similar to Array.prototype.find in vanilla JS.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#findTile
     * @since 3.0.0
     *
     * @param {function} callback - The callback. Each tile in the given area will be passed to this
     * callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide
     * on at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     *
     * @return {?Phaser.Tilemaps.Tile}
     */
    findTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FindTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
     * filter callback function. Any tiles that pass the filter test (i.e. where the callback returns
     * true) will returned as a new array. Similar to Array.prototype.Filter in vanilla JS.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#filterTiles
     * @since 3.0.0
     *
     * @param {function} callback - The callback. Each tile in the given area will be passed to this
     * callback as the first and only parameter. The callback should return true for tiles that pass the
     * filter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide
     * on at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    filterTiles: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FilterTiles(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
     * callback. Similar to Array.prototype.forEach in vanilla JS.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#forEachTile
     * @since 3.0.0
     *
     * @param {function} callback - The callback. Each tile in the given area will be passed to this
     * callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide
     * on at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    forEachTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);

        return this;
    },

    /**
     * Gets a tile at the given tile coordinates from the given layer.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#getTileAt
     * @since 3.0.0
     *
     * @param {integer} tileX - X position to get the tile from (given in tile units, not pixels).
     * @param {integer} tileY - Y position to get the tile from (given in tile units, not pixels).
     * @param {boolean} [nonNull=false] - If true getTile won't return null for empty tiles, but a Tile
     * object with an index of -1.
     *
     * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates were invalid.
     */
    getTileAt: function (tileX, tileY, nonNull)
    {
        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, this.layer);
    },

    /**
     * Gets a tile at the given world coordinates from the given layer.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#getTileAtWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - X position to get the tile from (given in pixels)
     * @param {number} worldY - Y position to get the tile from (given in pixels)
     * @param {boolean} [nonNull=false] - If true, function won't return null for empty tiles, but a Tile
     * object with an index of -1.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates
     * were invalid.
     */
    getTileAtWorldXY: function (worldX, worldY, nonNull, camera)
    {
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, this.layer);
    },

    /**
     * Gets the tiles in the given rectangular area (in tile coordinates) of the layer.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#getTilesWithin
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on
     * at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithin: function (tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * Gets the tiles in the given rectangular area (in world coordinates) of the layer.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#getTilesWithinWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - [description]
     * @param {number} worldY - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on
     * at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithinWorldXY: function (worldX, worldY, width, height, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinWorldXY(worldX, worldY, width, height, filteringOptions, camera, this.layer);
    },

    /**
     * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
     * Line, Rectangle or Triangle. The shape should be in world coordinates.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#getTilesWithinShape
     * @since 3.0.0
     *
     * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on
     * at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithinShape: function (shape, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, this.layer);
    },

    /**
     * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
     * false if there is no tile or if the tile at that location has an index of -1.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#hasTileAt
     * @since 3.0.0
     *
     * @param {integer} tileX - [description]
     * @param {integer} tileY - [description]
     *
     * @return {boolean}
     */
    hasTileAt: function (tileX, tileY)
    {
        return TilemapComponents.HasTileAt(tileX, tileY, this.layer);
    },

    /**
     * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
     * false if there is no tile or if the tile at that location has an index of -1.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#hasTileAtWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - [description]
     * @param {number} worldY - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {boolean}
     */
    hasTileAtWorldXY: function (worldX, worldY, camera)
    {
        return TilemapComponents.HasTileAtWorldXY(worldX, worldY, camera, this.layer);
    },

    /**
     * Draws a debug representation of the layer to the given Graphics. This is helpful when you want to
     * get a quick idea of which of your tiles are colliding and which have interesting faces. The tiles
     * are drawn starting at (0, 0) in the Graphics, allowing you to place the debug representation
     * wherever you want on the screen.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#renderDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The target Graphics object to draw upon.
     * @param {object} styleConfig - An object specifying the colors to use for the debug drawing.
     * @param {?Color} [styleConfig.tileColor=blue] - Color to use for drawing a filled rectangle at
     * non-colliding tile locations. If set to null, non-colliding tiles will not be drawn.
     * @param {?Color} [styleConfig.collidingTileColor=orange] - Color to use for drawing a filled
     * rectangle at colliding tile locations. If set to null, colliding tiles will not be drawn.
     * @param {?Color} [styleConfig.faceColor=grey] - Color to use for drawing a line at interesting
     * tile faces. If set to null, interesting tile faces will not be drawn.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    renderDebug: function (graphics, styleConfig)
    {
        TilemapComponents.RenderDebug(graphics, styleConfig, this.layer);

        return this;
    },

    /**
     * Sets collision on the given tile or tiles within a layer by index. You can pass in either a
     * single numeric index or an array of indexes: [2, 3, 15, 20]. The `collides` parameter controls if
     * collision will be enabled (true) or disabled (false).
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setCollision
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    setCollision: function (indexes, collides, recalculateFaces)
    {
        TilemapComponents.SetCollision(indexes, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets collision on a range of tiles in a layer whose index is between the specified `start` and
     * `stop` (inclusive). Calling this with a start value of 10 and a stop value of 14 would set
     * collision for tiles 10, 11, 12, 13 and 14. The `collides` parameter controls if collision will be
     * enabled (true) or disabled (false).
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setCollisionBetween
     * @since 3.0.0
     *
     * @param {integer} start - The first index of the tile to be set for collision.
     * @param {integer} stop - The last index of the tile to be set for collision.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    setCollisionBetween: function (start, stop, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionBetween(start, stop, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets collision on the tiles within a layer by checking tile properties. If a tile has a property
     * that matches the given properties object, its collision flag will be set. The `collides`
     * parameter controls if collision will be enabled (true) or disabled (false). Passing in
     * `{ collides: true }` would update the collision flag on any tiles with a "collides" property that
     * has a value of true. Any tile that doesn't have "collides" set to true will be ignored. You can
     * also use an array of values, e.g. `{ types: ["stone", "lava", "sand" ] }`. If a tile has a
     * "types" property that matches any of those values, its collision flag will be updated.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setCollisionByProperty
     * @since 3.0.0
     *
     * @param {object} properties - An object with tile properties and corresponding values that should
     * be checked.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    setCollisionByProperty: function (properties, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByProperty(properties, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets collision on all tiles in the given layer, except for tiles that have an index specified in
     * the given array. The `collides` parameter controls if collision will be enabled (true) or
     * disabled (false).
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setCollisionByExclusion
     * @since 3.0.0
     *
     * @param {integer[]} indexes - An array of the tile indexes to not be counted for collision.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    setCollisionByExclusion: function (indexes, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByExclusion(indexes, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets a global collision callback for the given tile index within the layer. This will affect all
     * tiles on this layer that have the same index. If a callback is already set for the tile index it
     * will be replaced. Set the callback to null to remove it. If you want to set a callback for a tile
     * at a specific location on the map then see setTileLocationCallback.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setTileIndexCallback
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes to have a
     * collision callback set for.
     * @param {function} callback - The callback that will be invoked when the tile is collided with.
     * @param {object} callbackContext - The context under which the callback is called.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    setTileIndexCallback: function (indexes, callback, callbackContext)
    {
        TilemapComponents.SetTileIndexCallback(indexes, callback, callbackContext, this.layer);

        return this;
    },

    /**
     * Sets collision on the tiles within a layer by checking each tiles collision group data
     * (typically defined in Tiled within the tileset collision editor). If any objects are found within
     * a tiles collision group, the tile's colliding information will be set. The `collides` parameter
     * controls if collision will be enabled (true) or disabled (false).
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setCollisionFromCollisionGroup
     * @since 3.0.0
     *
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    setCollisionFromCollisionGroup: function (collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionFromCollisionGroup(collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets a collision callback for the given rectangular area (in tile coordinates) within the layer.
     * If a callback is already set for the tile index it will be replaced. Set the callback to null to
     * remove it.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setTileLocationCallback
     * @since 3.0.0
     *
     * @param {integer} tileX - [description]
     * @param {integer} tileY - [description]
     * @param {integer} width - [description]
     * @param {integer} height - [description]
     * @param {function} callback - The callback that will be invoked when the tile is collided with.
     * @param {object} [callbackContext] - The context under which the callback is called.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    setTileLocationCallback: function (tileX, tileY, width, height, callback, callbackContext)
    {
        TilemapComponents.SetTileLocationCallback(tileX, tileY, width, height, callback, callbackContext, this.layer);

        return this;
    },

    /**
     * Converts from tile X coordinates (tile units) to world X coordinates (pixels), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#tileToWorldX
     * @since 3.0.0
     *
     * @param {integer} tileX - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {number}
     */
    tileToWorldX: function (tileX, camera)
    {
        return TilemapComponents.TileToWorldX(tileX, camera, this.layer);
    },

    /**
     * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#tileToWorldY
     * @since 3.0.0
     *
     * @param {integer} tileY - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {number}
     */
    tileToWorldY: function (tileY, camera)
    {
        return TilemapComponents.TileToWorldY(tileY, camera, this.layer);
    },

    /**
     * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
     * layers position, scale and scroll. This will return a new Vector2 object or update the given
     * `point` object.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#tileToWorldXY
     * @since 3.0.0
     *
     * @param {integer} tileX - [description]
     * @param {integer} tileY - [description]
     * @param {Phaser.Math.Vector2} [point] - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Math.Vector2}
     */
    tileToWorldXY: function (tileX, tileY, point, camera)
    {
        return TilemapComponents.TileToWorldXY(tileX, tileY, point, camera, this.layer);
    },

    /**
     * Converts from world X coordinates (pixels) to tile X coordinates (tile units), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#worldToTileX
     * @since 3.0.0
     *
     * @param {number} worldX - [description]
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {number}
     */
    worldToTileX: function (worldX, snapToFloor, camera)
    {
        return TilemapComponents.WorldToTileX(worldX, snapToFloor, camera, this.layer);
    },

    /**
     * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#worldToTileY
     * @since 3.0.0
     *
     * @param {number} worldY - [description]
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {number}
     */
    worldToTileY: function (worldY, snapToFloor, camera)
    {
        return TilemapComponents.WorldToTileY(worldY, snapToFloor, camera, this.layer);
    },

    /**
     * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
     * layers position, scale and scroll. This will return a new Vector2 object or update the given
     * `point` object.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#worldToTileXY
     * @since 3.0.0
     *
     * @param {number} worldX - [description]
     * @param {number} worldY - [description]
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Math.Vector2} [point] - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Math.Vector2}
     */
    worldToTileXY: function (worldX, worldY, snapToFloor, point, camera)
    {
        return TilemapComponents.WorldToTileXY(worldX, worldY, snapToFloor, point, camera, this.layer);
    }

});

module.exports = StaticTilemapLayer;
