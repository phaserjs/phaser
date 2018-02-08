var Class = require('../../utils/Class');
var Components = require('../../gameobjects/components');
var DynamicTilemapLayerRender = require('./DynamicTilemapLayerRender');
var GameObject = require('../../gameobjects/GameObject');
var TilemapComponents = require('../components');

/**
 * @classdesc
 * A DynamicTilemapLayer is a game object that renders LayerData from a Tilemap. A
 * DynamicTilemapLayer can only render tiles from a single tileset.
 *
 * A DynamicTilemapLayer trades some speed for being able to apply powerful effects. Unlike a
 * StaticTilemapLayer, you can apply per-tile effects like tint or alpha, and you can change the
 * tiles in a DynamicTilemapLayer. Use this over a StaticTilemapLayer when you need those
 * features.
 *
 * @class DynamicTilemapLayer
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 * 
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.Size
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
var DynamicTilemapLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.Size,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        DynamicTilemapLayerRender
    ],

    initialize:

    function DynamicTilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        GameObject.call(this, scene, 'DynamicTilemapLayer');

        /**
         * Used internally by physics system to perform fast type checks.
         * 
         * @name Phaser.Tilemaps.DynamicTilemapLayer#isTilemap
         * @type {boolean}
         * @readOnly
         * @since 3.0.0
         */
        this.isTilemap = true;

        /**
         * The Tilemap that this layer is a part of.
         * 
         * @name Phaser.Tilemaps.DynamicTilemapLayer#tilemap
         * @type {Phaser.Tilemaps.Tilemap}
         * @since 3.0.0
         */
        this.tilemap = tilemap;

        /**
         * The index of the LayerData associated with this layer.
         * 
         * @name Phaser.Tilemaps.DynamicTilemapLayer#layerIndex
         * @type {integer}
         * @since 3.0.0
         */
        this.layerIndex = layerIndex;

        /**
         * The LayerData associated with this layer. LayerData can only be associated with one
         * tilemap layer.
         * 
         * @name Phaser.Tilemaps.DynamicTilemapLayer#layer
         * @type {Phaser.Tilemaps.LayerData}
         * @since 3.0.0
         */
        this.layer = tilemap.layers[layerIndex];

        this.layer.tilemapLayer = this; // Link the LayerData with this static tilemap layer

        /**
         * The Tileset associated with this layer. A tilemap layer can only render from one Tileset.
         * 
         * @name Phaser.Tilemaps.DynamicTilemapLayer#tileset
         * @type {Phaser.Tilemaps.Tileset}
         * @since 3.0.0
         */
        this.tileset = tileset;

        /**
         * Used internally with the canvas render. This holds the tiles that are visible within the
         * camera.
         * 
         * @name Phaser.Tilemaps.DynamicTilemapLayer#culledTiles
         * @type {array}
         * @since 3.0.0
         */
        this.culledTiles = [];

        this.setAlpha(this.layer.alpha);
        this.setPosition(x, y);
        this.setOrigin();
        this.setSize(this.layer.tileWidth * this.layer.width, this.layer.tileHeight * this.layer.height);

        this.initPipeline('TextureTintPipeline');
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#calculateFacesAt
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    calculateFacesAt: function (tileX, tileY)
    {
        TilemapComponents.CalculateFacesAt(tileX, tileY, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#calculateFacesWithin
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    calculateFacesWithin: function (tileX, tileY, width, height)
    {
        TilemapComponents.CalculateFacesWithin(tileX, tileY, width, height, this.layer);
        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#createFromTiles
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Sprite[]}
     */
    createFromTiles: function (indexes, replacements, spriteConfig, scene, camera)
    {
        return TilemapComponents.CreateFromTiles(indexes, replacements, spriteConfig, scene, camera, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#cull
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    cull: function (camera)
    {
        return TilemapComponents.CullTiles(this.layer, camera, this.culledTiles);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#copy
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    copy: function (srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces)
    {
        TilemapComponents.Copy(srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Destroys this DynamicTilemapLayer and removes its link to the associated LayerData.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#destroy
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
        this.culledTiles.length = 0;

        GameObject.prototype.destroy.call(this);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#fill
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    fill: function (index, tileX, tileY, width, height, recalculateFaces)
    {
        TilemapComponents.Fill(index, tileX, tileY, width, height, recalculateFaces, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#filterTiles
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    filterTiles: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FilterTiles(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#findByIndex
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    findByIndex: function (findIndex, skip, reverse)
    {
        return TilemapComponents.FindByIndex(findIndex, skip, reverse, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#findTile
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile|null}
     */
    findTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FindTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#forEachTile
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    forEachTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTileAt
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    getTileAt: function (tileX, tileY, nonNull)
    {
        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTileAtWorldXY
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    getTileAtWorldXY: function (worldX, worldY, nonNull, camera)
    {
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTilesWithin
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithin: function (tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTilesWithinShape
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithinShape: function (shape, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTilesWithinWorldXY
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithinWorldXY: function (worldX, worldY, width, height, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinWorldXY(worldX, worldY, width, height, filteringOptions, camera, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#hasTileAt
     * @since 3.0.0
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
     * @method Phaser.Tilemaps.DynamicTilemapLayer#hasTileAtWorldXY
     * @since 3.0.0
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
     * @method Phaser.Tilemaps.DynamicTilemapLayer#putTileAt
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    putTileAt: function (tile, tileX, tileY, recalculateFaces)
    {
        return TilemapComponents.PutTileAt(tile, tileX, tileY, recalculateFaces, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#putTileAtWorldXY
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    putTileAtWorldXY: function (tile, worldX, worldY, recalculateFaces, camera)
    {
        return TilemapComponents.PutTileAtWorldXY(tile, worldX, worldY, recalculateFaces, camera, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#putTilesAt
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    putTilesAt: function (tilesArray, tileX, tileY, recalculateFaces)
    {
        TilemapComponents.PutTilesAt(tilesArray, tileX, tileY, recalculateFaces, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#randomize
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    randomize: function (tileX, tileY, width, height, indexes)
    {
        TilemapComponents.Randomize(tileX, tileY, width, height, indexes, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#removeTileAt
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    removeTileAt: function (tileX, tileY, replaceWithNull, recalculateFaces)
    {
        return TilemapComponents.RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#removeTileAtWorldXY
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    removeTileAtWorldXY: function (worldX, worldY, replaceWithNull, recalculateFaces, camera)
    {
        return TilemapComponents.RemoveTileAtWorldXY(worldX, worldY, replaceWithNull, recalculateFaces, camera, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#renderDebug
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    renderDebug: function (graphics, styleConfig)
    {
        TilemapComponents.RenderDebug(graphics, styleConfig, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#replaceByIndex
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    replaceByIndex: function (findIndex, newIndex, tileX, tileY, width, height)
    {
        TilemapComponents.ReplaceByIndex(findIndex, newIndex, tileX, tileY, width, height, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollision
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollision: function (indexes, collides, recalculateFaces)
    {
        TilemapComponents.SetCollision(indexes, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollisionBetween
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollisionBetween: function (start, stop, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionBetween(start, stop, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollisionByProperty
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollisionByProperty: function (properties, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByProperty(properties, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollisionByExclusion
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollisionByExclusion: function (indexes, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByExclusion(indexes, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollisionFromCollisionGroup
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollisionFromCollisionGroup: function (collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionFromCollisionGroup(collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setTileIndexCallback
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setTileIndexCallback: function (indexes, callback, callbackContext)
    {
        TilemapComponents.SetTileIndexCallback(indexes, callback, callbackContext, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setTileLocationCallback
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setTileLocationCallback: function (tileX, tileY, width, height, callback, callbackContext)
    {
        TilemapComponents.SetTileLocationCallback(tileX, tileY, width, height, callback, callbackContext, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#shuffle
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    shuffle: function (tileX, tileY, width, height)
    {
        TilemapComponents.Shuffle(tileX, tileY, width, height, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#swapByIndex
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    swapByIndex: function (indexA, indexB, tileX, tileY, width, height)
    {
        TilemapComponents.SwapByIndex(indexA, indexB, tileX, tileY, width, height, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#tileToWorldX
     * @since 3.0.0
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
     * @method Phaser.Tilemaps.DynamicTilemapLayer#tileToWorldY
     * @since 3.0.0
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
     * @method Phaser.Tilemaps.DynamicTilemapLayer#tileToWorldXY
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector2}
     */
    tileToWorldXY: function (tileX, tileY, point, camera)
    {
        return TilemapComponents.TileToWorldXY(tileX, tileY, point, camera, this.layer);
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#weightedRandomize
     * @since 3.0.0
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    weightedRandomize: function (tileX, tileY, width, height, weightedIndexes)
    {
        TilemapComponents.WeightedRandomize(tileX, tileY, width, height, weightedIndexes, this.layer);

        return this;
    },

    /**
     * See component documentation.
     * 
     * @method Phaser.Tilemaps.DynamicTilemapLayer#worldToTileX
     * @since 3.0.0
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
     * @method Phaser.Tilemaps.DynamicTilemapLayer#worldToTileXY
     * @since 3.0.0
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
     * @method Phaser.Tilemaps.DynamicTilemapLayer#worldToTileXY
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector2}
     */
    worldToTileXY: function (worldX, worldY, snapToFloor, point, camera)
    {
        return TilemapComponents.WorldToTileXY(worldX, worldY, snapToFloor, point, camera, this.layer);
    }

});

module.exports = DynamicTilemapLayer;
