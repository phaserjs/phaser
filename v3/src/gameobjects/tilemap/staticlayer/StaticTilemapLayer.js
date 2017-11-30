var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../components');
var CONST = require('../../../renderer/webgl/renderers/tilemaprenderer/const');
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
        Components.RenderTarget,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
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

        this.vbo = null;
        this.gl = scene.sys.game.renderer.gl ? scene.sys.game.renderer.gl : null;
        this.tilemapRenderer = scene.sys.game.renderer.tilemapRenderer ? scene.sys.game.renderer.tilemapRenderer : null;
        this.resourceManager = this.gl ? scene.sys.game.renderer.resourceManager : null;
        this.bufferData = null;

        this.dirty = true;
        this.vertexCount = 0;

        this.setTexture(tileset.image.key);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.setSize(this.layer.tileWidth * this.layer.width, this.layer.tileHeight * this.layer.height);

        this.skipIndexZero = false;

        scene.sys.game.renderer.addContextRestoredCallback(this.contextRestore.bind(this));
    },

    /**
     * @return {this}
     */
    contextRestore: function (renderer)
    {
        this.tileTexture = null;
        this.dirty = true;
        this.vbo = null;
        this.gl = renderer.gl;
        this.tilemapRenderer = renderer.tilemapRenderer;
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
        var tileWidth = this.layer.tileWidth;
        var tileHeight = this.layer.tileHeight;
        var width = this.texture.source[0].width;
        var height = this.texture.source[0].height;
        var mapData = this.layer.data;

        var tile;
        var row;
        var col;
        var texCoords;

        if (this.gl)
        {
            if (this.dirty)
            {
                var gl = this.gl;
                var vbo = this.vbo;
                var bufferData = this.bufferData;
                var bufferF32;
                var voffset = 0;
                var vertexCount = 0;

                if (this.vbo === null)
                {
                    vbo = this.resourceManager.createBuffer(gl.ARRAY_BUFFER, (4 * 6 * (mapWidth * mapHeight)) * 4, gl.STATIC_DRAW);

                    vbo.addAttribute(this.tilemapRenderer.shader.getAttribLocation('a_position'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0);
                    vbo.addAttribute(this.tilemapRenderer.shader.getAttribLocation('a_tex_coord'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 8);

                    bufferData = this.bufferData = new ArrayBuffer((4 * 6 * (mapWidth * mapHeight)) * 4);

                    this.vbo = vbo;

                    vbo.bind();
                }

                bufferF32 = new Float32Array(bufferData);

                for (row = 0; row < mapHeight; ++row)
                {
                    for (col = 0; col < mapWidth; ++col)
                    {
                        tile = mapData[row][col];
                        if (tile === null || (tile.index <= 0 && this.skipIndexZero)) { continue; }

                        var tx = col * tileWidth;
                        var ty = row * tileHeight;
                        var txw = tx + tileWidth;
                        var tyh = ty + tileHeight;

                        texCoords = tileset.getTileTextureCoordinates(tile.index);
                        if (texCoords === null) { continue; }

                        // Inset UV coordinates by 0.5px to prevent tile bleeding
                        var u0 = (texCoords.x + 0.5) / width;
                        var v0 = (texCoords.y + 0.5) / height;
                        var u1 = (texCoords.x + tileWidth - 0.5) / width;
                        var v1 = (texCoords.y + tileHeight - 0.5) / height;

                        var tx0 = tx;
                        var ty0 = ty;
                        var tx1 = tx;
                        var ty1 = tyh;
                        var tx2 = txw;
                        var ty2 = tyh;
                        var tx3 = txw;
                        var ty3 = ty;

                        bufferF32[voffset + 0] = tx0;
                        bufferF32[voffset + 1] = ty0;
                        bufferF32[voffset + 2] = u0;
                        bufferF32[voffset + 3] = v0;

                        bufferF32[voffset + 4] = tx1;
                        bufferF32[voffset + 5] = ty1;
                        bufferF32[voffset + 6] = u0;
                        bufferF32[voffset + 7] = v1;

                        bufferF32[voffset + 8] = tx2;
                        bufferF32[voffset + 9] = ty2;
                        bufferF32[voffset + 10] = u1;
                        bufferF32[voffset + 11] = v1;

                        bufferF32[voffset + 12] = tx0;
                        bufferF32[voffset + 13] = ty0;
                        bufferF32[voffset + 14] = u0;
                        bufferF32[voffset + 15] = v0;

                        bufferF32[voffset + 16] = tx2;
                        bufferF32[voffset + 17] = ty2;
                        bufferF32[voffset + 18] = u1;
                        bufferF32[voffset + 19] = v1;

                        bufferF32[voffset + 20] = tx3;
                        bufferF32[voffset + 21] = ty3;
                        bufferF32[voffset + 22] = u1;
                        bufferF32[voffset + 23] = v0;

                        voffset += 24;
                        vertexCount += 6;
                    }
                }

                this.vertexCount = vertexCount;

                vbo.updateResource(bufferData, 0);

                this.dirty = false;
            }

            var renderer = this.tilemapRenderer;

            renderer.shader.setConstantFloat2(renderer.scrollLocation, camera.scrollX, camera.scrollY);
            renderer.shader.setConstantFloat2(renderer.scrollFactorLocation, this.scrollFactorX, this.scrollFactorY);
            renderer.shader.setConstantFloat2(renderer.tilemapPositionLocation, this.x, this.y);

            var cmat = camera.matrix.matrix;

            renderer.shader.setConstantMatrix3x3(
                renderer.cameraTransformLocation,
                [
                    cmat[0], cmat[1], 0.0,
                    cmat[2], cmat[3], 0.0,
                    cmat[4], cmat[5], 1.0
                ]
            );
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
        this.map = undefined;
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

module.exports = StaticTilemapLayer;
