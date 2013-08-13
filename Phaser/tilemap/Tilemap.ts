/// <reference path="../_definitions.ts" />

/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
*/

module Phaser {

    export class Tilemap {

        /**
         * Tilemap constructor
         * Create a new <code>Tilemap</code>.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param key {string} Asset key for this map.
         * @param mapData {string} Data of this map. (a big 2d array, normally in csv)
         * @param format {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
         * @param resizeWorld {bool} Resize the world bound automatically based on this tilemap?
         * @param tileWidth {number} Width of tiles in this map.
         * @param tileHeight {number} Height of tiles in this map.
         */
        constructor(game: Game, key: string, mapData: string, format: number, resizeWorld: bool = true, tileWidth: number = 0, tileHeight: number = 0) {

            this.game = game;
            this.type = Phaser.Types.TILEMAP;

            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;

            this.z = -1;
            this.group = null;
            this.name = '';

            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);

            this.tiles = [];
            this.layers = [];

            this.mapFormat = format;

            switch (format)
            {
                case Tilemap.FORMAT_CSV:
                    this.parseCSV(game.cache.getText(mapData), key, tileWidth, tileHeight);
                    break;

                case Tilemap.FORMAT_TILED_JSON:
                    this.parseTiledJSON(game.cache.getText(mapData), key);
                    break;
            }

            if (this.currentLayer && resizeWorld)
            {
                this.game.world.setSize(this.currentLayer.widthInPixels, this.currentLayer.heightInPixels, true);
            }

        }

        private _tempCollisionData;

        /**
         * Reference to the main game object
         */
        public game: Phaser.Game;

        /**
         * The type of game object.
         */
        public type: number;

        /**
         * The name of game object.
         */
        public name: string;

        /**
         * The Group this Sprite belongs to.
         */
        public group: Group;

        /**
         * Controls if both <code>update</code> and render are called by the core game loop.
         */
        public exists: bool;

        /**
         * Controls if <code>update()</code> is automatically called by the core game loop.
         */
        public active: bool;

        /**
         * Controls if this Sprite is rendered or skipped during the core game loop.
         */
        public visible: bool;

        /**
         * A useful state for many game objects. Kill and revive both flip this switch.
         */
        public alive: bool;

        /**
         * The texture used to render the Sprite.
         */
        public texture: Phaser.Display.Texture;

        /**
         * The Sprite transform component.
         */
        public transform: Phaser.Components.TransformManager;

        /**
         * z order value of the object.
         */
        public z: number = -1;

        /**
         * Render iteration counter
         */
        public renderOrderID: number = 0;

        /**
         * Tilemap data format enum: CSV.
         * @type {number}
         */
        public static FORMAT_CSV: number = 0;

        /**
         * Tilemap data format enum: Tiled JSON.
         * @type {number}
         */
        public static FORMAT_TILED_JSON: number = 1;

        /**
         * Array contains tile objects of this map.
         * @type {Tile[]}
         */
        public tiles: Phaser.Tile[];

        /**
         * Array contains tilemap layer objects of this map.
         * @type {TilemapLayer[]}
         */
        public layers : Phaser.TilemapLayer[];

        /**
         * Current tilemap layer.
         * @type {TilemapLayer}
         */
        public currentLayer: Phaser.TilemapLayer;

        /**
         * The tilemap layer for collision.
         * @type {TilemapLayer}
         */
        public collisionLayer: Phaser.TilemapLayer;

        /**
         * Tilemap collision callback.
         * @type {function}
         */
        public collisionCallback = null;

        /**
         * Context for the collision callback called with.
         */
        public collisionCallbackContext;

        /**
         * Format of this tilemap data. Available values: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
         * @type {number}
         */
        public mapFormat: number;

        /**
         * Parset csv map data and generate tiles.
         * @param data {string} CSV map data.
         * @param key {string} Asset key for tileset image.
         * @param tileWidth {number} Width of its tile.
         * @param tileHeight {number} Height of its tile.
         */
        private parseCSV(data: string, key: string, tileWidth: number, tileHeight: number) {

            var layer: TilemapLayer = new TilemapLayer(this, 0, key, Tilemap.FORMAT_CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);

            //  Trim any rogue whitespace from the data
            data = data.trim();

            var rows = data.split("\n");

            for (var i = 0; i < rows.length; i++)
            {
                var column = rows[i].split(",");

                if (column.length > 0)
                {
                    layer.addColumn(column);
                }
            }

            layer.updateBounds();

            var tileQuantity = layer.parseTileOffsets();

            this.currentLayer = layer;
            this.collisionLayer = layer;

            this.layers.push(layer);

            this.generateTiles(tileQuantity);

        }

        /**
         * Parse JSON map data and generate tiles.
         * @param data {string} JSON map data.
         * @param key {string} Asset key for tileset image.
         */
        private parseTiledJSON(data: string, key: string) {

            //  Trim any rogue whitespace from the data
            data = data.trim();

            var json = JSON.parse(data);

            for (var i = 0; i < json.layers.length; i++)
            {
                var layer: TilemapLayer = new TilemapLayer(this, i, key, Tilemap.FORMAT_TILED_JSON, json.layers[i].name, json.tilewidth, json.tileheight);

                //  Check it's a data layer
                if (!json.layers[i].data)
                {
                    continue;
                }

                layer.alpha = json.layers[i].opacity;
                layer.visible = json.layers[i].visible;
                layer.tileMargin = json.tilesets[0].margin;
                layer.tileSpacing = json.tilesets[0].spacing;

                var c = 0;
                var row;

                for (var t = 0; t < json.layers[i].data.length; t++)
                {
                    if (c == 0)
                    {
                        row = [];
                    }

                    row.push(json.layers[i].data[t]);

                    c++;

                    if (c == json.layers[i].width)
                    {
                        layer.addColumn(row);
                        c = 0;
                    }
                }

                layer.updateBounds();

                var tileQuantity = layer.parseTileOffsets();

                this.currentLayer = layer;
                this.collisionLayer = layer;

                this.layers.push(layer);

            }

            this.generateTiles(tileQuantity);

        }

        /**
         * Create tiles of given quantity.
         * @param qty {number} Quentity of tiles to be generated.
         */
        private generateTiles(qty:number) {

            for (var i = 0; i < qty; i++)
            {
                this.tiles.push(new Phaser.Tile(this.game, this, i, this.currentLayer.tileWidth, this.currentLayer.tileHeight));
            }

        }

        public get widthInPixels(): number {
            return this.currentLayer.widthInPixels;
        }

        public get heightInPixels(): number {
            return this.currentLayer.heightInPixels;
        }

        //  Tile Collision

        /**
         * Set callback to be called when this tilemap collides.
         * @param context {object} Callback will be called with this context.
         * @param callback {function} Callback function.
         */
        public setCollisionCallback(context, callback) {

            this.collisionCallbackContext = context;
            this.collisionCallback = callback;

        }

        /**
         * Set collision configs of tiles in a range index.
         * @param start {number} First index of tiles.
         * @param end {number} Last index of tiles.
         * @param collision {number} Bit field of flags. (see Tile.allowCollision)
         * @param resetCollisions {bool} Reset collision flags before set.
         * @param separateX {bool} Enable seprate at x-axis.
         * @param separateY {bool} Enable seprate at y-axis.
         */
        public setCollisionRange(start: number, end: number, collision:number = Types.ANY, resetCollisions: bool = false, separateX: bool = true, separateY: bool = true) {

            for (var i = start; i < end; i++)
            {
                this.tiles[i].setCollision(collision, resetCollisions, separateX, separateY);
            }

        }

        /**
         * Set collision configs of tiles with given index.
         * @param values {number[]} Index array which contains all tile indexes. The tiles with those indexes will be setup with rest parameters.
         * @param collision {number} Bit field of flags. (see Tile.allowCollision)
         * @param resetCollisions {bool} Reset collision flags before set.
         * @param separateX {bool} Enable seprate at x-axis.
         * @param separateY {bool} Enable seprate at y-axis.
         */
        public setCollisionByIndex(values:number[], collision:number = Types.ANY, resetCollisions: bool = false, separateX: bool = true, separateY: bool = true) {

            for (var i = 0; i < values.length; i++)
            {
                this.tiles[values[i]].setCollision(collision, resetCollisions, separateX, separateY);
            }

        }

        //  Tile Management

        /**
         * Get the tile by its index.
         * @param value {number} Index of the tile you want to get.
         * @return {Tile} The tile with given index.
         */
        public getTileByIndex(value: number): Phaser.Tile {

            if (this.tiles[value])
            {
                return this.tiles[value];
            }

            return null;

        }

        /**
         * Get the tile located at specific position and layer.
         * @param x {number} X position of this tile located.
         * @param y {number} Y position of this tile located.
         * @param [layer] {number} layer of this tile located.
         * @return {Tile} The tile with specific properties.
         */
        public getTile(x: number, y: number, layer: number = this.currentLayer.ID): Phaser.Tile {

            return this.tiles[this.layers[layer].getTileIndex(x, y)];

        }

        /**
         * Get the tile located at specific position (in world coordinate) and layer. (thus you give a position of a point which is within the tile)
         * @param x {number} X position of the point in target tile.
         * @param x {number} Y position of the point in target tile.
         * @param [layer] {number} layer of this tile located.
         * @return {Tile} The tile with specific properties.
         */
        public getTileFromWorldXY(x: number, y: number, layer: number = this.currentLayer.ID): Phaser.Tile {

            return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];

        }

        /**
         * Gets the tile underneath the Input.x/y position
         * @param layer The layer to check, defaults to 0
         * @returns {Tile}
         */
        public getTileFromInputXY(layer: number = this.currentLayer.ID): Phaser.Tile {

            return this.tiles[this.layers[layer].getTileFromWorldXY(this.game.input.worldX, this.game.input.worldY)];

        }

        /**
         * Get tiles overlaps the given object.
         * @param object {GameObject} Tiles you want to get that overlaps this.
         * @return {array} Array with tiles information. (Each contains x, y and the tile.)
         */
        public getTileOverlaps(object: Phaser.Sprite) {

            return this.currentLayer.getTileOverlaps(object);

        }

        //  COLLIDE
        /**
         * Check whether this tilemap collides with the given game object or group of objects.
         * @param objectOrGroup {function} Target object of group you want to check.
         * @param callback {function} This is called if objectOrGroup collides the tilemap.
         * @param context {object} Callback will be called with this context.
         * @return {bool} Return true if this collides with given object, otherwise return false.
         */
        public collide(objectOrGroup = null, callback = null, context = null) {

            if (callback !== null && context !== null)
            {
                this.collisionCallback = callback;
                this.collisionCallbackContext = context;
            }

            if (objectOrGroup == null)
            {
                objectOrGroup = this.game.world.group;
            }

            //  Group?
            if (objectOrGroup.isGroup == false)
            {
                this.collideGameObject(objectOrGroup);
            }
            else
            {
                objectOrGroup.forEachAlive(this, this.collideGameObject, true);
            }

        }

        /**
         * Check whether this tilemap collides with the given game object.
         * @param object {GameObject} Target object you want to check.
         * @return {bool} Return true if this collides with given object, otherwise return false.
         */
        public collideGameObject(object: Phaser.Sprite): bool {

            if (object.body.type == Types.BODY_DYNAMIC && object.exists == true && object.body.allowCollisions != Types.NONE)
            {
                this._tempCollisionData = this.collisionLayer.getTileOverlaps(object);

                if (this.collisionCallback !== null && this._tempCollisionData.length > 0)
                {
                    this.collisionCallback.call(this.collisionCallbackContext, object, this._tempCollisionData);
                }

                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * Set a tile to a specific layer.
         * @param x {number} X position of this tile.
         * @param y {number} Y position of this tile.
         * @param index {number} The index of this tile type in the core map data.
         * @param [layer] {number} which layer you want to set the tile to.
         */
        public putTile(x: number, y: number, index: number, layer: number = this.currentLayer.ID) {

            this.layers[layer].putTile(x, y, index);

        }

        public destroy() {

            this.texture = null;
            this.transform = null;

            this.tiles.length = 0;
            this.layers.length = 0;

        }

    }

}