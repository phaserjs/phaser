/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../../gameobjects/components');
var CONST = require('../../const');
var GameObject = require('../../gameobjects/GameObject');
var StaticTilemapLayerRender = require('./StaticTilemapLayerRender');
var TilemapComponents = require('../components');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @classdesc
 * A Static Tilemap Layer is a Game Object that renders LayerData from a Tilemap when used in combination
 * with one, or more, Tilesets.
 *
 * A Static Tilemap Layer is optimized for rendering speed over flexibility. You cannot apply per-tile
 * effects like tint or alpha, or change the tiles or tilesets the layer uses.
 * 
 * Use a Static Tilemap Layer instead of a Dynamic Tilemap Layer when you don't need tile manipulation features.
 *
 * @class StaticTilemapLayer
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.Tilemaps
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
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {integer} layerIndex - The index of the LayerData associated with this layer.
 * @param {(string|string[]|Phaser.Tilemaps.Tileset|Phaser.Tilemaps.Tileset[])} tileset - The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
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
         * @readonly
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

        // Link the LayerData with this static tilemap layer
        this.layer.tilemapLayer = this;

        /**
         * The Tileset/s associated with this layer.
         * 
         * As of Phaser 3.14 this property is now an array of Tileset objects, previously it was a single reference.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#tileset
         * @type {Phaser.Tilemaps.Tileset[]}
         * @since 3.0.0
         */
        this.tileset = [];

        /**
         * Used internally by the Canvas renderer.
         * This holds the tiles that are visible within the camera in the last frame.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#culledTiles
         * @type {array}
         * @since 3.0.0
         */
        this.culledTiles = [];

        /**
         * Canvas only.
         * 
         * You can control if the Cameras should cull tiles before rendering them or not.
         * By default the camera will try to cull the tiles in this layer, to avoid over-drawing to the renderer.
         *
         * However, there are some instances when you may wish to disable this, and toggling this flag allows
         * you to do so. Also see `setSkipCull` for a chainable method that does the same thing.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#skipCull
         * @type {boolean}
         * @since 3.12.0
         */
        this.skipCull = false;

        /**
         * Canvas only.
         * 
         * The total number of tiles drawn by the renderer in the last frame.
         * 
         * This only works when rending with Canvas.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#tilesDrawn
         * @type {integer}
         * @readonly
         * @since 3.12.0
         */
        this.tilesDrawn = 0;

        /**
         * Canvas only.
         * 
         * The total number of tiles in this layer. Updated every frame.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#tilesTotal
         * @type {integer}
         * @readonly
         * @since 3.12.0
         */
        this.tilesTotal = this.layer.width * this.layer.height;

        /**
         * Canvas only.
         * 
         * The amount of extra tiles to add into the cull rectangle when calculating its horizontal size.
         *
         * See the method `setCullPadding` for more details.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#cullPaddingX
         * @type {integer}
         * @default 1
         * @since 3.12.0
         */
        this.cullPaddingX = 1;

        /**
         * Canvas only.
         * 
         * The amount of extra tiles to add into the cull rectangle when calculating its vertical size.
         *
         * See the method `setCullPadding` for more details.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#cullPaddingY
         * @type {integer}
         * @default 1
         * @since 3.12.0
         */
        this.cullPaddingY = 1;

        /**
         * Canvas only.
         * 
         * The callback that is invoked when the tiles are culled.
         *
         * By default it will call `TilemapComponents.CullTiles` but you can override this to call any function you like.
         *
         * It will be sent 3 arguments:
         *
         * 1. The Phaser.Tilemaps.LayerData object for this Layer
         * 2. The Camera that is culling the layer. You can check its `dirty` property to see if it has changed since the last cull.
         * 3. A reference to the `culledTiles` array, which should be used to store the tiles you want rendered.
         *
         * See the `TilemapComponents.CullTiles` source code for details on implementing your own culling system.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#cullCallback
         * @type {function}
         * @since 3.12.0
         */
        this.cullCallback = TilemapComponents.CullTiles;

        /**
         * A reference to the renderer.
         * 
         * @name Phaser.Tilemaps.StaticTilemapLayer#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @private
         * @since 3.0.0
         */
        this.renderer = scene.sys.game.renderer;

        /**
         * An array of vertex buffer objects, used by the WebGL renderer.
         * 
         * As of Phaser 3.14 this property is now an array, where each element maps to a Tileset instance. Previously it was a single instance.
         * 
         * @name Phaser.Tilemaps.StaticTilemapLayer#vertexBuffer
         * @type {WebGLBuffer[]}
         * @private
         * @since 3.0.0
         */
        this.vertexBuffer = [];

        /**
         * An array of ArrayBuffer objects, used by the WebGL renderer.
         * 
         * As of Phaser 3.14 this property is now an array, where each element maps to a Tileset instance. Previously it was a single instance.
         * 
         * @name Phaser.Tilemaps.StaticTilemapLayer#bufferData
         * @type {ArrayBuffer[]}
         * @private
         * @since 3.0.0
         */
        this.bufferData = [];

        /**
         * An array of Float32 Array objects, used by the WebGL renderer.
         * 
         * As of Phaser 3.14 this property is now an array, where each element maps to a Tileset instance. Previously it was a single instance.
         * 
         * @name Phaser.Tilemaps.StaticTilemapLayer#vertexViewF32
         * @type {Float32Array[]}
         * @private
         * @since 3.0.0
         */
        this.vertexViewF32 = [];

        /**
         * An array of Uint32 Array objects, used by the WebGL renderer.
         * 
         * As of Phaser 3.14 this property is now an array, where each element maps to a Tileset instance. Previously it was a single instance.
         * 
         * @name Phaser.Tilemaps.StaticTilemapLayer#vertexViewU32
         * @type {Uint32Array[]}
         * @private
         * @since 3.0.0
         */
        this.vertexViewU32 = [];

        /**
         * An array of booleans, used by the WebGL renderer.
         * 
         * As of Phaser 3.14 this property is now an array, where each element maps to a Tileset instance. Previously it was a single boolean.
         * 
         * @name Phaser.Tilemaps.StaticTilemapLayer#dirty
         * @type {boolean[]}
         * @private
         * @since 3.0.0
         */
        this.dirty = [];

        /**
         * An array of integers, used by the WebGL renderer.
         * 
         * As of Phaser 3.14 this property is now an array, where each element maps to a Tileset instance. Previously it was a single integer.
         * 
         * @name Phaser.Tilemaps.StaticTilemapLayer#vertexCount
         * @type {integer[]}
         * @private
         * @since 3.0.0
         */
        this.vertexCount = [];

        /**
         * The rendering (draw) order of the tiles in this layer.
         * 
         * The default is 0 which is 'right-down', meaning it will draw the tiles starting from the top-left,
         * drawing to the right and then moving down to the next row.
         * 
         * The draw orders are:
         * 
         * 0 = right-down
         * 1 = left-down
         * 2 = right-up
         * 3 = left-up
         * 
         * This can be changed via the `setRenderOrder` method.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#_renderOrder
         * @type {integer}
         * @default 0
         * @private
         * @since 3.12.0
         */
        this._renderOrder = 0;

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#_tempMatrix
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.14.0
         */
        this._tempMatrix = new TransformMatrix();

        /**
         * An array holding the mapping between the tile indexes and the tileset they belong to.
         *
         * @name Phaser.Tilemaps.StaticTilemapLayer#gidMap
         * @type {Phaser.Tilemaps.Tileset[]}
         * @since 3.14.0
         */
        this.gidMap = [];

        this.setTilesets(tileset);
        this.setAlpha(this.layer.alpha);
        this.setPosition(x, y);
        this.setOrigin();
        this.setSize(tilemap.tileWidth * this.layer.width, tilemap.tileHeight * this.layer.height);

        this.updateVBOData();

        this.initPipeline('TextureTintPipeline');

        if (scene.sys.game.config.renderType === CONST.WEBGL)
        {
            scene.sys.game.renderer.onContextRestored(function ()
            {
                this.updateVBOData();
            }, this);
        }
    },

    /**
     * Populates the internal `tileset` array with the Tileset references this Layer requires for rendering.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setTilesets
     * @private
     * @since 3.14.0
     * 
     * @param {(string|string[]|Phaser.Tilemaps.Tileset|Phaser.Tilemaps.Tileset[])} tileset - The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
     */
    setTilesets: function (tilesets)
    {
        var gidMap = [];
        var setList = [];
        var map = this.tilemap;

        if (!Array.isArray(tilesets))
        {
            tilesets = [ tilesets ];
        }

        for (var i = 0; i < tilesets.length; i++)
        {
            var tileset = tilesets[i];

            if (typeof tileset === 'string')
            {
                tileset = map.getTileset(tileset);
            }

            if (tileset)
            {
                setList.push(tileset);

                var s = tileset.firstgid;

                for (var t = 0; t < tileset.total; t++)
                {
                    gidMap[s + t] = tileset;
                }
            }
        }

        this.gidMap = gidMap;
        this.tileset = setList;
    },

    /**
     * Prepares the VBO data arrays for population by the `upload` method.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#updateVBOData
     * @private
     * @since 3.14.0
     *
     * @return {this} This Tilemap Layer object.
     */
    updateVBOData: function ()
    {
        for (var i = 0; i < this.tileset.length; i++)
        {
            this.dirty[i] = true;
            this.vertexCount[i] = 0;
            this.vertexBuffer[i] = null;
            this.bufferData[i] = null;
            this.vertexViewF32[i] = null;
            this.vertexViewU32[i] = null;
        }

        return this;
    },

    /**
     * Upload the tile data to a VBO.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#upload
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to render to.
     * @param {integer} tilesetIndex - The tileset index.
     *
     * @return {Phaser.Tilemaps.StaticTilemapLayer} This Tilemap Layer object.
     */
    upload: function (camera, tilesetIndex)
    {
        var renderer = this.renderer;
        var gl = renderer.gl;

        var pipeline = renderer.pipelines.TextureTintPipeline;

        if (this.dirty[tilesetIndex])
        {
            var tileset = this.tileset[tilesetIndex];
            var mapWidth = this.layer.width;
            var mapHeight = this.layer.height;
            var width = tileset.image.source[0].width;
            var height = tileset.image.source[0].height;
            var mapData = this.layer.data;
            var tile;
            var row;
            var col;
            var renderOrder = this._renderOrder;
            var minTileIndex = tileset.firstgid;
            var maxTileIndex = tileset.firstgid + tileset.total;
    
            var vertexBuffer = this.vertexBuffer[tilesetIndex];
            var bufferData = this.bufferData[tilesetIndex];
            var vOffset = -1;
            var bufferSize = (mapWidth * mapHeight) * pipeline.vertexSize * 6;

            this.vertexCount[tilesetIndex] = 0;
    
            if (bufferData === null)
            {
                bufferData = new ArrayBuffer(bufferSize);

                this.bufferData[tilesetIndex] = bufferData;

                this.vertexViewF32[tilesetIndex] = new Float32Array(bufferData);
                this.vertexViewU32[tilesetIndex] = new Uint32Array(bufferData);
            }
    
            if (renderOrder === 0)
            {
                //  right-down
        
                for (row = 0; row < mapHeight; row++)
                {
                    for (col = 0; col < mapWidth; col++)
                    {
                        tile = mapData[row][col];
        
                        if (!tile || tile.index < minTileIndex || tile.index > maxTileIndex || !tile.visible)
                        {
                            continue;
                        }
    
                        vOffset = this.batchTile(vOffset, tile, tileset, width, height, camera, tilesetIndex);
                    }
                }
            }
            else if (renderOrder === 1)
            {
                //  left-down
        
                for (row = 0; row < mapHeight; row++)
                {
                    for (col = mapWidth - 1; col >= 0; col--)
                    {
                        tile = mapData[row][col];
        
                        if (!tile || tile.index < minTileIndex || tile.index > maxTileIndex || !tile.visible)
                        {
                            continue;
                        }
    
                        vOffset = this.batchTile(vOffset, tile, tileset, width, height, camera, tilesetIndex);
                    }
                }
            }
            else if (renderOrder === 2)
            {
                //  right-up
        
                for (row = mapHeight - 1; row >= 0; row--)
                {
                    for (col = 0; col < mapWidth; col++)
                    {
                        tile = mapData[row][col];
        
                        if (!tile || tile.index < minTileIndex || tile.index > maxTileIndex || !tile.visible)
                        {
                            continue;
                        }
    
                        vOffset = this.batchTile(vOffset, tile, tileset, width, height, camera, tilesetIndex);
                    }
                }
            }
            else if (renderOrder === 3)
            {
                //  left-up
        
                for (row = mapHeight - 1; row >= 0; row--)
                {
                    for (col = mapWidth - 1; col >= 0; col--)
                    {
                        tile = mapData[row][col];
        
                        if (!tile || tile.index < minTileIndex || tile.index > maxTileIndex || !tile.visible)
                        {
                            continue;
                        }
    
                        vOffset = this.batchTile(vOffset, tile, tileset, width, height, camera, tilesetIndex);
                    }
                }
            }
        
            this.dirty[tilesetIndex] = false;
    
            if (vertexBuffer === null)
            {
                vertexBuffer = renderer.createVertexBuffer(bufferData, gl.STATIC_DRAW);
    
                this.vertexBuffer[tilesetIndex] = vertexBuffer;
            }
            else
            {
                renderer.setVertexBuffer(vertexBuffer);
    
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, bufferData);
            }
        }

        return this;
    },

    /**
     * Add a single tile into the batch.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#batchTile
     * @private
     * @since 3.12.0
     *
     * @param {integer} vOffset - The vertex offset.
     * @param {any} tile - The tile being rendered.
     * @param {any} tileset - The tileset being used for rendering.
     * @param {integer} width - The width of the tileset image in pixels.
     * @param {integer} height - The height of the tileset image in pixels.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera the layer is being rendered with.
     * @param {integer} tilesetIndex - The tileset index.
     *
     * @return {integer} The new vOffset value.
     */
    batchTile: function (vOffset, tile, tileset, width, height, camera, tilesetIndex)
    {
        var texCoords = tileset.getTileTextureCoordinates(tile.index);

        if (!texCoords)
        {
            return vOffset;
        }

        var tileWidth = tileset.tileWidth;
        var tileHeight = tileset.tileHeight;

        var halfTileWidth = tileWidth / 2;
        var halfTileHeight = tileHeight / 2;

        var u0 = texCoords.x / width;
        var v0 = texCoords.y / height;
        var u1 = (texCoords.x + tileWidth) / width;
        var v1 = (texCoords.y + tileHeight) / height;

        var matrix = this._tempMatrix;

        var x = -halfTileWidth;
        var y = -halfTileHeight;

        if (tile.flipX)
        {
            tileWidth *= -1;
            x += tileset.tileWidth;
        }

        if (tile.flipY)
        {
            tileHeight *= -1;
            y += tileset.tileHeight;
        }

        var xw = x + tileWidth;
        var yh = y + tileHeight;

        matrix.applyITRS(halfTileWidth + tile.pixelX, halfTileHeight + tile.pixelY, tile.rotation, 1, 1);

        var tint = Utils.getTintAppendFloatAlpha(0xffffff, camera.alpha * this.alpha * tile.alpha);

        var tx0 = matrix.getX(x, y);
        var ty0 = matrix.getY(x, y);

        var tx1 = matrix.getX(x, yh);
        var ty1 = matrix.getY(x, yh);

        var tx2 = matrix.getX(xw, yh);
        var ty2 = matrix.getY(xw, yh);

        var tx3 = matrix.getX(xw, y);
        var ty3 = matrix.getY(xw, y);

        if (camera.roundPixels)
        {
            tx0 = Math.round(tx0);
            ty0 = Math.round(ty0);

            tx1 = Math.round(tx1);
            ty1 = Math.round(ty1);

            tx2 = Math.round(tx2);
            ty2 = Math.round(ty2);

            tx3 = Math.round(tx3);
            ty3 = Math.round(ty3);
        }

        var vertexViewF32 = this.vertexViewF32[tilesetIndex];
        var vertexViewU32 = this.vertexViewU32[tilesetIndex];

        vertexViewF32[++vOffset] = tx0;
        vertexViewF32[++vOffset] = ty0;
        vertexViewF32[++vOffset] = u0;
        vertexViewF32[++vOffset] = v0;
        vertexViewF32[++vOffset] = 0;
        vertexViewU32[++vOffset] = tint;

        vertexViewF32[++vOffset] = tx1;
        vertexViewF32[++vOffset] = ty1;
        vertexViewF32[++vOffset] = u0;
        vertexViewF32[++vOffset] = v1;
        vertexViewF32[++vOffset] = 0;
        vertexViewU32[++vOffset] = tint;

        vertexViewF32[++vOffset] = tx2;
        vertexViewF32[++vOffset] = ty2;
        vertexViewF32[++vOffset] = u1;
        vertexViewF32[++vOffset] = v1;
        vertexViewF32[++vOffset] = 0;
        vertexViewU32[++vOffset] = tint;

        vertexViewF32[++vOffset] = tx0;
        vertexViewF32[++vOffset] = ty0;
        vertexViewF32[++vOffset] = u0;
        vertexViewF32[++vOffset] = v0;
        vertexViewF32[++vOffset] = 0;
        vertexViewU32[++vOffset] = tint;

        vertexViewF32[++vOffset] = tx2;
        vertexViewF32[++vOffset] = ty2;
        vertexViewF32[++vOffset] = u1;
        vertexViewF32[++vOffset] = v1;
        vertexViewF32[++vOffset] = 0;
        vertexViewU32[++vOffset] = tint;

        vertexViewF32[++vOffset] = tx3;
        vertexViewF32[++vOffset] = ty3;
        vertexViewF32[++vOffset] = u1;
        vertexViewF32[++vOffset] = v0;
        vertexViewF32[++vOffset] = 0;
        vertexViewU32[++vOffset] = tint;

        this.vertexCount[tilesetIndex] += 6;

        return vOffset;
    },

    /**
     * Sets the rendering (draw) order of the tiles in this layer.
     * 
     * The default is 'right-down', meaning it will order the tiles starting from the top-left,
     * drawing to the right and then moving down to the next row.
     * 
     * The draw orders are:
     * 
     * 0 = right-down
     * 1 = left-down
     * 2 = right-up
     * 3 = left-up
     * 
     * Setting the render order does not change the tiles or how they are stored in the layer,
     * it purely impacts the order in which they are rendered.
     * 
     * You can provide either an integer (0 to 3), or the string version of the order.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setRenderOrder
     * @since 3.12.0
     *
     * @param {(integer|string)} renderOrder - The render (draw) order value. Either an integer between 0 and 3, or a string: 'right-down', 'left-down', 'right-up' or 'left-up'.
     *
     * @return {this} This Tilemap Layer object.
     */
    setRenderOrder: function (renderOrder)
    {
        var orders = [ 'right-down', 'left-down', 'right-up', 'left-up' ];

        if (typeof renderOrder === 'string')
        {
            renderOrder = orders.indexOf(renderOrder);
        }

        if (renderOrder >= 0 && renderOrder < 4)
        {
            this._renderOrder = renderOrder;

            for (var i = 0; i < this.tileset.length; i++)
            {
                this.dirty[i] = true;
            }
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
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
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
     * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} spriteConfig - The config object to pass into the Sprite creator (i.e.
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
        return this.cullCallback(this.layer, camera, this.culledTiles);
    },

    /**
     * Canvas only.
     * 
     * You can control if the Cameras should cull tiles before rendering them or not.
     * By default the camera will try to cull the tiles in this layer, to avoid over-drawing to the renderer.
     *
     * However, there are some instances when you may wish to disable this.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setSkipCull
     * @since 3.12.0
     *
     * @param {boolean} [value=true] - Set to `true` to stop culling tiles. Set to `false` to enable culling again.
     *
     * @return {this} This Tilemap Layer object.
     */
    setSkipCull: function (value)
    {
        if (value === undefined) { value = true; }

        this.skipCull = value;

        return this;
    },

    /**
     * Canvas only.
     * 
     * When a Camera culls the tiles in this layer it does so using its view into the world, building up a
     * rectangle inside which the tiles must exist or they will be culled. Sometimes you may need to expand the size
     * of this 'cull rectangle', especially if you plan on rotating the Camera viewing the layer. Do so
     * by providing the padding values. The values given are in tiles, not pixels. So if the tile width was 32px
     * and you set `paddingX` to be 4, it would add 32px x 4 to the cull rectangle (adjusted for scale)
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#setCullPadding
     * @since 3.12.0
     *
     * @param {integer} [paddingX=1] - The amount of extra horizontal tiles to add to the cull check padding.
     * @param {integer} [paddingY=1] - The amount of extra vertical tiles to add to the cull check padding.
     *
     * @return {this} This Tilemap Layer object.
     */
    setCullPadding: function (paddingX, paddingY)
    {
        if (paddingX === undefined) { paddingX = 1; }
        if (paddingY === undefined) { paddingY = 1; }

        this.cullPaddingX = paddingX;
        this.cullPaddingY = paddingY;

        return this;
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
     * @param {integer} [tileX=0] - The left most tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {integer} [tileY=0] - The topmost tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
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
     * @param {integer} [tileX=0] - The leftmost tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {integer} [tileY=0] - The topmost tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
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
     * @param {integer} [tileX=0] - The leftmost tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {integer} [tileY=0] - The topmost tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
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
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
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
     * @param {integer} [tileX=0] - The leftmost tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [tileY=0] - The topmost tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} [width=max width based on tileX] - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} [height=max height based on tileY] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
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
     * @param {number} worldX - The leftmost tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {number} worldY - The topmost tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {number} width - How many tiles wide from the `tileX` index the area will be.
     * @param {number} height - How many tiles high from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when factoring in which tiles to return.
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
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
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
     * @param {integer} tileX - X position to get the tile from in tile coordinates.
     * @param {integer} tileY - Y position to get the tile from in tile coordinates.
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
     * @param {number} worldX - The X coordinate of the world position.
     * @param {number} worldY - The Y coordinate of the world position.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
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
     * @param {Phaser.Types.Tilemaps.StyleConfig} styleConfig - An object specifying the colors to use for the debug drawing.
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
     * @param {integer} tileX - The leftmost tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} tileY - The topmost tile index (in tile coordinates) to use as the origin of the area.
     * @param {integer} width - How many tiles wide from the `tileX` index the area will be.
     * @param {integer} height - How many tiles tall from the `tileY` index the area will be.
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
     * @param {integer} tileX - The X coordinate, in tile coordinates.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the world values from the tile index.
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
     * @param {integer} tileY - The Y coordinate, in tile coordinates.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the world values from the tile index.
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
     * @param {integer} tileX - The X coordinate, in tile coordinates.
     * @param {integer} tileY - The Y coordinate, in tile coordinates.
     * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given, a new Vector2 is created.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the world values from the tile index.
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
     * @param {number} worldX - The X coordinate, in world pixels.
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.]
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
     * @param {number} worldY - The Y coordinate, in world pixels.
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
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
     * @param {number} worldX - The X coordinate, in world pixels.
     * @param {number} worldY - The Y coordinate, in world pixels.
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given, a new Vector2 is created.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {Phaser.Math.Vector2}
     */
    worldToTileXY: function (worldX, worldY, snapToFloor, point, camera)
    {
        return TilemapComponents.WorldToTileXY(worldX, worldY, snapToFloor, point, camera, this.layer);
    },

    /**
     * Destroys this StaticTilemapLayer and removes its link to the associated LayerData.
     *
     * @method Phaser.Tilemaps.StaticTilemapLayer#destroy
     * @since 3.0.0
     * 
     * @param {boolean} [removeFromTilemap=true] - Remove this layer from the parent Tilemap?
     */
    destroy: function (removeFromTilemap)
    {
        if (removeFromTilemap === undefined) { removeFromTilemap = true; }

        // Uninstall this layer only if it is still installed on the LayerData object
        if (this.layer.tilemapLayer === this)
        {
            this.layer.tilemapLayer = undefined;
        }

        if (removeFromTilemap)
        {
            this.tilemap.removeLayer(this);
        }

        this.tilemap = undefined;
        this.layer = undefined;
        this.culledTiles.length = 0;
        this.cullCallback = null;

        for (var i = 0; i < this.tileset.length; i++)
        {
            this.dirty[i] = true;
            this.vertexCount[i] = 0;
            this.vertexBuffer[i] = null;
            this.bufferData[i] = null;
            this.vertexViewF32[i] = null;
            this.vertexViewU32[i] = null;
        }

        this.gidMap = [];
        this.tileset = [];

        GameObject.prototype.destroy.call(this);
    }

});

module.exports = StaticTilemapLayer;
