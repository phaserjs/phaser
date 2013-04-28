/// <reference path="../Game.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="../system/TilemapLayer.ts" />
/// <reference path="../system/Tile.ts" />

/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
*/

module Phaser {

    export class Tilemap extends GameObject {

        constructor(game: Game, key: string, mapData: string, format: number, resizeWorld: bool = true, tileWidth?: number = 0, tileHeight?: number = 0) {

            super(game);

            this.isGroup = false;

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
                this._game.world.setSize(this.currentLayer.widthInPixels, this.currentLayer.heightInPixels, true);
            }

        }

        public static FORMAT_CSV: number = 0;
        public static FORMAT_TILED_JSON: number = 1;

        public tiles : Tile[];
        public layers : TilemapLayer[];
        public currentLayer: TilemapLayer;
        public collisionLayer: TilemapLayer;
        public mapFormat: number;

        public update() {
        }

        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number) {

            if (this.cameraBlacklist.indexOf(camera.ID) == -1)
            {
                //  Loop through the layers
                for (var i = 0; i < this.layers.length; i++)
                {
                    this.layers[i].render(camera, cameraOffsetX, cameraOffsetY);
                }
            }

        }

        private parseCSV(data: string, key: string, tileWidth: number, tileHeight: number) {

            var layer: TilemapLayer = new TilemapLayer(this._game, this, key, Tilemap.FORMAT_CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);

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

        private parseTiledJSON(data: string, key: string) {

            //  Trim any rogue whitespace from the data
            data = data.trim();

            var json = JSON.parse(data);

            for (var i = 0; i < json.layers.length; i++)
            {
                var layer: TilemapLayer = new TilemapLayer(this._game, this, key, Tilemap.FORMAT_TILED_JSON, json.layers[i].name, json.tilewidth, json.tileheight);
                
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

        private generateTiles(qty:number) {

            for (var i = 0; i < qty; i++)
            {
                this.tiles.push(new Tile(this._game, this, i, this.currentLayer.tileWidth, this.currentLayer.tileHeight));
            }

        }

        public get widthInPixels(): number {
            return this.currentLayer.widthInPixels;
        }

        public get heightInPixels(): number {
            return this.currentLayer.heightInPixels;
        }

        //  Tile Collision

        public setCollisionRange(start: number, end: number, collision?:number = Collision.ANY, resetCollisions: bool = false) {

            for (var i = start; i < end; i++)
            {
                this.tiles[i].setCollision(collision, resetCollisions);
            }

        }

        public setCollisionByIndex(values:number[], collision?:number = Collision.ANY, resetCollisions: bool = false) {

            for (var i = 0; i < values.length; i++)
            {
                this.tiles[values[i]].setCollision(collision, resetCollisions);
            }

        }

        //  Tile Management

        public getTile(x: number, y: number, layer?: number = 0):Tile {

            return this.tiles[this.layers[layer].getTileIndex(x, y)];

        }

        public getTileFromWorldXY(x: number, y: number, layer?: number = 0):Tile {

            return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];

        }

        public getTileFromInputXY(layer?: number = 0):Tile {

            return this.tiles[this.layers[layer].getTileFromWorldXY(this._game.input.worldX, this._game.input.worldY)];

        }

        public getTileOverlaps(object: GameObject) {

            return this.currentLayer.getTileOverlaps(object);

        }

        //  COLLIDE
        public collide(objectOrGroup = null, callback = null): bool {

            if (objectOrGroup == null)
            {
                objectOrGroup = this._game.world.group;
            }

            //  Group?
            if (objectOrGroup.isGroup == false)
            {
                return this.collideGameObject(objectOrGroup);
            }
            else
            {
                objectOrGroup.forEachAlive(this, this.collideGameObject, true);
            }

            return true;

        }

        public collideGameObject(object: GameObject): bool {

            if (object == this) { return false; }

            if (object.immovable == false && object.exists == true && object.allowCollisions != Collision.NONE)
            {
                return this.collisionLayer.getTileOverlaps(object);
            }
            else
            {
                return false;
            }

        }


        //  Set current layer
        //  Set layer order?
        //  Get block of tiles
        //  Swap tiles around
        //  Delete tiles of certain type
        //  Erase tiles


    }

}