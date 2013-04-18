/// <reference path="../Game.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="../system/Tile.ts" />
/// <reference path="../system/TilemapBuffer.ts" />

/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapBuffer for each camera in the world.
*/

module Phaser {

    export class Tilemap extends GameObject {

        constructor(game: Game, key: string, mapData: string, format: number, tileWidth?: number = 0, tileHeight?: number = 0) {

            super(game);

            this._texture = this._game.cache.getImage(key);
            this._tilemapBuffers = [];

            this.isGroup = false;

            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Rectangle();
            this.mapFormat = format;

            switch (format)
            {
                case Tilemap.FORMAT_CSV:
                    this.parseCSV(game.cache.getText(mapData));
                    break;

                case Tilemap.FORMAT_TILED_JSON:
                    this.parseTiledJSON(game.cache.getText(mapData));
                    break;
            }

            this.parseTileOffsets();
            this.createTilemapBuffers();

        }

        private _texture;
        private _tileOffsets;
        private _tilemapBuffers: TilemapBuffer[];
        private _dx: number = 0;
        private _dy: number = 0;

        public static FORMAT_CSV: number = 0;
        public static FORMAT_TILED_JSON: number = 1;

        public mapData;
        public mapFormat: number;
        public boundsInTiles: Rectangle;

        public tileWidth: number;
        public tileHeight: number;

        public widthInTiles: number = 0;
        public heightInTiles: number = 0;

        public widthInPixels: number = 0;
        public heightInPixels: number = 0;

        //  How many extra tiles to draw around the edge of the screen (for fast scrolling games, or to optimise mobile performance try increasing this)
        //  The number is the amount of extra tiles PER SIDE, so a value of 10 would be (10 tiles + screen size + 10 tiles)
        public tileBoundary: number = 10;

        private parseCSV(data: string) {

            //console.log('parseMapData');

            this.mapData = [];

            //  Trim any rogue whitespace from the data
            data = data.trim();

            var rows = data.split("\n");
            //console.log('rows', rows);

            for (var i = 0; i < rows.length; i++)
            {
                var column = rows[i].split(",");
                //console.log('column', column);
                var output = [];

                if (column.length > 0)
                {
                    //  Set the width based on the first row
                    if (this.widthInTiles == 0)
                    {
                        //  Maybe -1?
                        this.widthInTiles = column.length;
                    }

                    //  We have a new row of tiles
                    this.heightInTiles++;

                    //  Parse it
                    for (var c = 0; c < column.length; c++)
                    {
                        output[c] = parseInt(column[c]);
                    }

                    this.mapData.push(output);
                }

            }

            //console.log('final map array');
            //console.log(this.mapData);

            if (this.widthInTiles > 0)
            {
                this.widthInPixels = this.tileWidth * this.widthInTiles;
            }

            if (this.heightInTiles > 0)
            {
                this.heightInPixels = this.tileHeight * this.heightInTiles;
            }

            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);

        }

        private parseTiledJSON(data: string) {

            //console.log('parseTiledJSON');

            this.mapData = [];

            //  Trim any rogue whitespace from the data
            data = data.trim();

            //  We ought to change this soon, so we have layer support, but for now let's just get it working
            var json = JSON.parse(data);

            //  Right now we assume no errors at all with the parsing (safe I know)
            this.tileWidth = json.tilewidth;
            this.tileHeight = json.tileheight;

            //  Parse the first layer only
            this.widthInTiles = json.layers[0].width;
            this.heightInTiles = json.layers[0].height;
            this.widthInPixels = this.widthInTiles * this.tileWidth;
            this.heightInPixels = this.heightInTiles * this.tileHeight;
            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);

            //console.log('width in tiles', this.widthInTiles);
            //console.log('height in tiles', this.heightInTiles);
            //console.log('width in px', this.widthInPixels);
            //console.log('height in px', this.heightInPixels);

            //  Now let's get the data

            var c = 0;
            var row;

            for (var i = 0; i < json.layers[0].data.length; i++)
            {
                if (c == 0)
                {
                    row = [];
                }

                row.push(json.layers[0].data[i]);

                c++;

                if (c == this.widthInTiles)
                {
                    this.mapData.push(row);
                    c = 0;
                }
            }

            //console.log('mapData');
            //console.log(this.mapData);

        }

        public getMapSegment(area: Rectangle) {
        }

        private createTilemapBuffers() {

            var cams = this._game.world.getAllCameras();

            for (var i = 0; i < cams.length; i++)
            {
                this._tilemapBuffers[cams[i].ID] = new TilemapBuffer(this._game, cams[i], this, this._texture, this._tileOffsets);
            }

        }

        private parseTileOffsets() {

            this._tileOffsets = [];

            var i = 0;

            if (this.mapFormat == Tilemap.FORMAT_TILED_JSON)
            {
                //  For some reason Tiled counts from 1 not 0
                this._tileOffsets[0] = null;
                i = 1;
            }

            for (var ty = 0; ty < this._texture.height; ty += this.tileHeight)
            {
                for (var tx = 0; tx < this._texture.width; tx += this.tileWidth)
                {
                    this._tileOffsets[i] = { x: tx, y: ty };
                    i++;
                }
            }

        }

        /*
        //  Use a Signal?
        public addTilemapBuffers(camera:Camera) {
    
            console.log('added new camera to tilemap');
            this._tilemapBuffers[camera.ID] = new TilemapBuffer(this._game, camera, this, this._texture, this._tileOffsets);
    
        }
        */

        public update() {

            //  Check if any of the cameras have scrolled far enough for us to need to refresh a TilemapBuffer
            this._tilemapBuffers[0].update();

        }

        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {
            this._tilemapBuffers[0].renderDebugInfo(x, y, color);
        }

        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool {

            if (this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1)
            {
                return false;
            }

            this._dx = cameraOffsetX + (this.bounds.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.y - camera.worldView.y);

            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);

            if (this._tilemapBuffers[camera.ID])
            {
                //this._tilemapBuffers[camera.ID].render(this._dx, this._dy);
                this._tilemapBuffers[camera.ID].render(cameraOffsetX, cameraOffsetY);
            }

            return true;

        }

    }

}