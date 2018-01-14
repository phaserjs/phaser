var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../components');
var DynamicTilemapLayerRender = require('./DynamicTilemapLayerRender');
var TilemapComponents = require('../components');

var DynamicTilemapLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.RenderTarget,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        DynamicTilemapLayerRender
    ],

    initialize:

    /**
     * A DynamicTilemapLayer is a game object that renders LayerData from a Tilemap. A
     * DynamicTilemapLayer can only render tiles from a single tileset.
     *
     * A DynamicTilemapLayer trades some speed for being able to apply powerful effects. Unlike a
     * StaticTilemapLayer, you can apply per-tile effects like tint or alpha, and you can change the
     * tiles in a DynamicTilemapLayer. Use this over a StaticTilemapLayer when you need those
     * features.
     *
     * @class DynamicTilemapLayer
     * @constructor
     *
     * @param {Scene} scene - [description]
     * @param {Tilemap} tilemap - The Tilemap this layer is a part of.
     * @param {integer} layerIndex - The index of the LayerData associated with this layer.
     * @param {Tileset} tileset - The tileset used to render the tiles in this layer.
     * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
     * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
     */
    function DynamicTilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        GameObject.call(this, scene, 'DynamicTilemapLayer');

        /**
         * Used internally by physics system to perform fast type checks.
         * @property {boolean} isTilemap
         * @readonly
         */
        this.isTilemap = true;

        /**
         * The Tilemap that this layer is a part of.
         * @property {Tilemap} map
         */
        this.map = tilemap;

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

        this.setAlpha(this.layer.alpha);
        this.setTexture(tileset.image.key);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(this.layer.tileWidth * this.layer.width, this.layer.tileHeight * this.layer.height);
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
     * See component documentation.
     *
     * @return {this}
     */
    copy: function (srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces)
    {
        TilemapComponents.Copy(srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, this.layer);
        return this;
    },

    /**
    * Destroys this DynamicTilemapLayer and removes its link to the associated LayerData.
    *
    * @method Phaser.TilemapLayer#destroy
    */
    destroy: function ()
    {
        // Uninstall this layer only if it is still installed on the LayerData object
        if (this.layer.tilemapLayer === this)
        {
            this.layer.tilemapLayer = undefined;
        }
        this.map = undefined;
        this.layer = undefined;
        this.tileset = undefined;
        this.culledTiles.length = 0;
        GameObject.prototype.destroy.call(this);
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    fill: function (index, tileX, tileY, width, height, recalculateFaces)
    {
        TilemapComponents.Fill(index, tileX, tileY, width, height, recalculateFaces, this.layer);
        return this;
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
    getTilesWithinShape: function (shape, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, this.layer);
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
     * @return {Tile}
     */
    putTileAt: function (tile, tileX, tileY, recalculateFaces)
    {
        return TilemapComponents.PutTileAt(tile, tileX, tileY, recalculateFaces, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile}
     */
    putTileAtWorldXY: function (tile, worldX, worldY, recalculateFaces, camera)
    {
        return TilemapComponents.PutTileAtWorldXY(tile, worldX, worldY, recalculateFaces, camera, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    putTilesAt: function (tilesArray, tileX, tileY, recalculateFaces)
    {
        TilemapComponents.PutTilesAt(tilesArray, tileX, tileY, recalculateFaces, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    randomize: function (tileX, tileY, width, height, indexes)
    {
        TilemapComponents.Randomize(tileX, tileY, width, height, indexes, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {Tile}
     */
    removeTileAt: function (tileX, tileY, replaceWithNull, recalculateFaces)
    {
        return TilemapComponents.RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, this.layer);
    },

    /**
     * See component documentation.
     *
     * @return {Tile}
     */
    removeTileAtWorldXY: function (worldX, worldY, replaceWithNull, recalculateFaces, camera)
    {
        return TilemapComponents.RemoveTileAtWorldXY(worldX, worldY, replaceWithNull, recalculateFaces, camera, this.layer);
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
    replaceByIndex: function (findIndex, newIndex, tileX, tileY, width, height)
    {
        TilemapComponents.ReplaceByIndex(findIndex, newIndex, tileX, tileY, width, height, this.layer);
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
    setTileLocationCallback: function (tileX, tileY, width, height, callback, callbackContext)
    {
        TilemapComponents.SetTileLocationCallback(tileX, tileY, width, height, callback, callbackContext, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    shuffle: function (tileX, tileY, width, height)
    {
        TilemapComponents.Shuffle(tileX, tileY, width, height, this.layer);
        return this;
    },

    /**
     * See component documentation.
     *
     * @return {this}
     */
    swapByIndex: function (indexA, indexB, tileX, tileY, width, height)
    {
        TilemapComponents.SwapByIndex(indexA, indexB, tileX, tileY, width, height, this.layer);
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
     * @return {this}
     */
    weightedRandomize: function (tileX, tileY, width, height, weightedIndexes)
    {
        TilemapComponents.WeightedRandomize(tileX, tileY, width, height, weightedIndexes, this.layer);
        return this;
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
     * @return {Vector}
     */
    worldToTileXY: function (worldX, worldY, snapToFloor, point, camera)
    {
        return TilemapComponents.WorldToTileXY(worldX, worldY, snapToFloor, point, camera, this.layer);
    }

});

module.exports = DynamicTilemapLayer;
