/// <reference path="../Game.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="../system/TilemapLayer.ts" />

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

            this._layers = [];

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

        private _layers : TilemapLayer[];

        public static FORMAT_CSV: number = 0;
        public static FORMAT_TILED_JSON: number = 1;

        public currentLayer: TilemapLayer;
        public mapFormat: number;

        public update() {
        }

        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number) {

            if (this.cameraBlacklist.indexOf(camera.ID) == -1)
            {
                //  Loop through the layers
                for (var i = 0; i < this._layers.length; i++)
                {
                    this._layers[i].render(camera, cameraOffsetX, cameraOffsetY);
                }
            }

        }

        private parseCSV(data: string, key: string, tileWidth: number, tileHeight: number) {

            var layer: TilemapLayer = new TilemapLayer(this._game, key, Tilemap.FORMAT_CSV, 'TileLayerCSV' + this._layers.length.toString(), tileWidth, tileHeight);

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

            this.currentLayer = layer;

            this._layers.push(layer);

        }

        private parseTiledJSON(data: string, key: string) {

            //  Trim any rogue whitespace from the data
            data = data.trim();

            var json = JSON.parse(data);

            for (var i = 0; i < json.layers.length; i++)
            {
                var layer: TilemapLayer = new TilemapLayer(this._game, key, Tilemap.FORMAT_TILED_JSON, json.layers[i].name, json.tilewidth, json.tileheight);
                
                layer.alpha = json.layers[i].opacity;
                layer.visible = json.layers[i].visible;

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

                this.currentLayer = layer;

                this._layers.push(layer);

            }

        }

        public get widthInPixels(): number {
            return this.currentLayer.widthInPixels;
        }

        public get heightInPixels(): number {
            return this.currentLayer.heightInPixels;
        }

        //  Set current layer
        //  Set layer order?
        //  Get tile from x/y
        //  Get block of tiles
        //  Swap tiles around
        //  Delete tiles of certain type
        //  Erase tiles


    }

}