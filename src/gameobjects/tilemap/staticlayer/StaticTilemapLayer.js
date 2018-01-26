var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../components');
var StaticTilemapLayerRender = require('./StaticTilemapLayerRender');
var TilemapComponents = require('../components');

var StaticTilemapLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.ScaleMode,
        Components.Size,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        StaticTilemapLayerRender
    ],

    initialize:

    /**
     * A StaticTilemapLayer is a game object that renders LayerData from a Tilemap. A
     * StaticTilemapLayer can only render tiles from a single tileset.
     *
     * A StaticTilemapLayer is optimized for speed over flexibility. You cannot apply per-tile
     * effects like tint or alpha. You cannot change the tiles in a StaticTilemapLayer. Use this
     * over a DynamicTilemapLayer when you don't need either of those features.
     *
     * @class StaticTilemapLayer
     * @constructor
     *
     * @param {Scene} scene - [description]
     * @param {Tilemap} tilemap - The Tilemap this layer is a part of.
     * @param {integer} layerIndex - The index of the LayerData associated with this layer.
     * @param {Tileset} tileset - The tileset used to render the tiles in this layer.
     * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
     * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
     */
    function StaticTilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        GameObject.call(this, scene, 'StaticTilemapLayer');

        /**
         * Used internally by physics system to perform fast type checks.
         * @property {boolean} isTilemap
         * @readonly
         */
        this.isTilemap = true;

        /**
         * The Tilemap that this layer is a part of.
         * @property {Tilemap} tilemap
         */
        this.tilemap = tilemap;

        /**
         * The index of the LayerData associated with this layer.
         * @property {integer} layerIndex
         */
        this.layerIndex = layerIndex;

        /**
         * The LayerData associated with this layer. LayerData can only be associated with one
         * tilemap layer.
         * @property {LayerData} layerIndex
         */
        this.layer = tilemap.layers[layerIndex];
        this.layer.tilemapLayer = this; // Link the LayerData with this static tilemap layer

        /**
         * The Tileset associated with this layer. A tilemap layer can only render from one Tileset.
         * @property {Tileset} tileset
         */
        this.tileset = tileset;

        /**
         * Used internally with the canvas render. This holds the tiles that are visible within the
         * camera.
         * @property {Tileset} culledTiles
         */
        this.culledTiles = [];

        this.vertexBuffer = null;
        this.renderer = scene.sys.game.renderer;
        this.bufferData = null;
        this.vertexViewF32 = null;
        this.vertexViewU32 = null;

        this.dirty = true;
        this.vertexCount = 0;

        this.setAlpha(this.layer.alpha);
        this.setPosition(x, y);
        this.setOrigin();
        this.setSize(this.layer.tileWidth * this.layer.width, this.layer.tileHeight * this.layer.height);
        this.renderer.onContextRestored(this.contextRestore, this);
    },

    /**
     * @return {this}
     */
    contextRestore: function (renderer)
    {
        this.dirty = true;
        this.vertexBuffer = null;
        return this;
    },

    /**
     * Upload the tile data to a VBO.
     *
     * @return {this}
     */
    upload: function (camera)
    {
        var tileset = this.tileset;
        var mapWidth = this.layer.width;
        var mapHeight = this.layer.height;
        var width = tileset.image.get().width;
        var height = tileset.image.get().height;
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
                var tint = 0xffffffff;

                if (bufferData === null)
                {
                    bufferData = new ArrayBuffer(bufferSize);
                    this.bufferData = bufferData;
                    this.vertexViewF32 = new Float32Array(bufferData);
                    this.vertexViewU32 = new Uint32Array(bufferData);
                }

                vertexViewF32 = this.vertexViewF32;
                vertexViewU32 = this.vertexViewU32;

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

                        // Inset UV coordinates by 0.5px to prevent tile bleeding
                        var u0 = (texCoords.x + 0.5) / width;
                        var v0 = (texCoords.y + 0.5) / height;
                        var u1 = (texCoords.x + tile.width - 0.5) / width;
                        var v1 = (texCoords.y + tile.height - 0.5) / height;

                        var tx0 = tx;
                        var ty0 = ty;
                        var tx1 = tx;
                        var ty1 = tyh;
                        var tx2 = txw;
                        var ty2 = tyh;
                        var tx3 = txw;
                        var ty3 = ty;

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

                if (this.vertexBuffer === null)
                {
                    this.vertexBuffer = renderer.createVertexBuffer(bufferData, gl.STATIC_DRAW);
                }
                else
                {
                    renderer.setVertexBuffer(this.vertexBuffer);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 0, bufferData);
                }
            }

            pipeline.modelIdentity();
            pipeline.modelTranslate(this.x - (camera.scrollX * this.scrollFactorX), this.y - (camera.scrollY * this.scrollFactorY), 0.0);
            pipeline.viewLoad2D(camera.matrix.matrix);
        }

        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    calculateFacesWithin: function (tileX, tileY, width, height)
    {
        TilemapComponents.CalculateFacesWithin(tileX, tileY, width, height, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {Sprite[]}
     */
    createFromTiles: function (indexes, replacements, spriteConfig, scene, camera)
    {
        return TilemapComponents.CreateFromTiles(indexes, replacements, spriteConfig, scene, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile[]}
     */
    cull: function (camera)
    {
        return TilemapComponents.CullTiles(this.layer, camera, this.culledTiles);
    },


    /**
    * Destroys this StaticTilemapLayer and removes its link to the associated LayerData.
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
     * See component documentation.
     *
     * @return {Tile}
     */
    findByIndex: function (findIndex, skip, reverse)
    {
        return TilemapComponents.FindByIndex(findIndex, skip, reverse, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile|null}
     */
    findTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FindTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile[]}
     */
    filterTiles: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FilterTiles(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    forEachTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {Tile}
     */
    getTileAt: function (tileX, tileY, nonNull)
    {
        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile}
     */
    getTileAtWorldXY: function (worldX, worldY, nonNull, camera)
    {
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile[]}
     */
    getTilesWithin: function (tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile[]}
     */
    getTilesWithinWorldXY: function (worldX, worldY, width, height, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinWorldXY(worldX, worldY, width, height, filteringOptions, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile[]}
     */
    getTilesWithinShape: function (shape, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {boolean}
     */
    hasTileAt: function (tileX, tileY)
    {
        return TilemapComponents.HasTileAt(tileX, tileY, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {boolean}
     */
    hasTileAtWorldXY: function (worldX, worldY, camera)
    {
        return TilemapComponents.HasTileAtWorldXY(worldX, worldY, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    renderDebug: function (graphics, styleConfig)
    {
        TilemapComponents.RenderDebug(graphics, styleConfig, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    setCollision: function (indexes, collides, recalculateFaces)
    {
        TilemapComponents.SetCollision(indexes, collides, recalculateFaces, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    setCollisionBetween: function (start, stop, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionBetween(start, stop, collides, recalculateFaces, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    setCollisionByProperty: function (properties, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByProperty(properties, collides, recalculateFaces, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    setCollisionByExclusion: function (indexes, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByExclusion(indexes, collides, recalculateFaces, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    setTileIndexCallback: function (indexes, callback, callbackContext)
    {
        TilemapComponents.SetTileIndexCallback(indexes, callback, callbackContext, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    setCollisionFromCollisionGroup: function (collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionFromCollisionGroup(collides, recalculateFaces, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    setTileLocationCallback: function (tileX, tileY, width, height, callback, callbackContext)
    {
        TilemapComponents.SetTileLocationCallback(tileX, tileY, width, height, callback, callbackContext, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {number}
     */
    tileToWorldX: function (tileX, camera)
    {
        return TilemapComponents.TileToWorldX(tileX, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {number}
     */
    tileToWorldY: function (tileY, camera)
    {
        return TilemapComponents.TileToWorldY(tileY, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Vector2}
     */
    tileToWorldXY: function (tileX, tileY, point, camera)
    {
        return TilemapComponents.TileToWorldXY(tileX, tileY, point, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {number}
     */
    worldToTileX: function (worldX, snapToFloor, camera)
    {
        return TilemapComponents.WorldToTileX(worldX, snapToFloor, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {number}
     */
    worldToTileY: function (worldY, snapToFloor, camera)
    {
        return TilemapComponents.WorldToTileY(worldY, snapToFloor, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Vector2}
     */
    worldToTileXY: function (worldX, worldY, snapToFloor, point, camera)
    {
        return TilemapComponents.WorldToTileXY(worldX, worldY, snapToFloor, point, camera, this.layer);
    }

});

module.exports = StaticTilemapLayer;
