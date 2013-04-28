/// <reference path="../Game.ts" />

/**
* Phaser - TilemapLayer
*
* A Tilemap Layer. Tiled format maps can have multiple overlapping layers.
*/

module Phaser {

    export class TilemapLayer {

        constructor(game: Game, parent:Tilemap, key: string, mapFormat: number, name: string, tileWidth: number, tileHeight: number) {

            this._game = game;
            this._parent = parent;

            this.name = name;
            this.mapFormat = mapFormat;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Rectangle();
            //this.scrollFactor = new MicroPoint(1, 1);

            this.mapData = [];
            this._texture = this._game.cache.getImage(key);

        }

        private _game: Game;
        private _parent: Tilemap;
        private _texture;
        private _tileOffsets;
        private _startX: number = 0;
        private _startY: number = 0;
        private _maxX: number = 0;
        private _maxY: number = 0;
        private _tx: number = 0;
        private _ty: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _oldCameraX: number = 0;
        private _oldCameraY: number = 0;
        private _columnData;

        private _tempTileX: number;
        private _tempTileY: number;
        private _tempTileW: number;
        private _tempTileH: number;

        public name: string;
        public alpha: number = 1;
        public exists: bool = true;
        public visible: bool = true;
        //public scrollFactor: MicroPoint;
        public orientation: string;
        public properties: {};

        public mapData;
        public mapFormat: number;
        public boundsInTiles: Rectangle;

        public tileWidth: number;
        public tileHeight: number;

        public widthInTiles: number = 0;
        public heightInTiles: number = 0;

        public widthInPixels: number = 0;
        public heightInPixels: number = 0;

        public tileMargin: number = 0;
        public tileSpacing: number = 0;

        public getTileFromWorldXY(x: number, y: number): number {

            x = this._game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this._game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;

            return this.getTileIndex(x, y);

        }

        public getTileOverlaps(object: GameObject) {

            //  If the object is outside of the world coordinates then abort the check (tilemap has to exist within world bounds)
            if (object.bounds.x < 0 || object.bounds.x > this.widthInPixels || object.bounds.y < 0 || object.bounds.bottom > this.heightInPixels)
            {
                return;
            }

            //  What tiles do we need to check against?
            this._tempTileX = this._game.math.snapToFloor(object.bounds.x, this.tileWidth) / this.tileWidth;
            this._tempTileY = this._game.math.snapToFloor(object.bounds.y, this.tileHeight) / this.tileHeight;
            this._tempTileW = (this._game.math.snapToCeil(object.bounds.width, this.tileWidth) + this.tileWidth) / this.tileWidth;
            this._tempTileH = (this._game.math.snapToCeil(object.bounds.height, this.tileHeight) + this.tileHeight) / this.tileHeight;

            //  Loop through the tiles we've got and check overlaps accordingly
            var tiles = this.getTileBlock(this._tempTileX, this._tempTileY, this._tempTileW, this._tempTileH);

            Collision.TILE_OVERLAP = false;

            for (var r = 0; r < tiles.length; r++)
            {
                if (tiles[r].tile.allowCollisions != Collision.NONE)
                {
                    Collision.separateTile(object, tiles[r].x * this.tileWidth, tiles[r].y * this.tileHeight, this.tileWidth, this.tileHeight, tiles[r].tile.mass, tiles[r].tile.collideLeft, tiles[r].tile.collideRight, tiles[r].tile.collideUp, tiles[r].tile.collideDown);
                }
            }

            return Collision.TILE_OVERLAP;

        }

        public getTileBlock(x: number, y: number, width: number, height: number) {

            if (x < 0)
            {
                x = 0;
            }

            if (y < 0)
            {
                y = 0;
            }

            if (width > this.widthInTiles)
            {
                width = this.widthInTiles;
            }

            if (height > this.heightInTiles)
            {
                height = this.heightInTiles;
            }

            var output = [];

            for (var ty = y; ty < y + height; ty++)
            {
                for (var tx = x; tx < x + width; tx++)
                {
                    if (this.mapData[ty] && this.mapData[ty][tx])
                    {
                        output.push({ x: tx, y: ty, tile: this._parent.tiles[this.mapData[ty][tx]] });
                    }
                }
            }

            return output;

        }

        public getTileIndex(x: number, y: number): number {

            if (y >= 0 && y < this.mapData.length)
            {
                if (x >= 0 && x < this.mapData[y].length)
                {
                    return this.mapData[y][x];
                }
            }
            
            return null;

        }

        public addColumn(column) {

            var data = [];

            for (var c = 0; c < column.length; c++)
            {
                data[c] = parseInt(column[c]);
            }

            if (this.widthInTiles == 0)
            {
                this.widthInTiles = data.length;
                this.widthInPixels = this.widthInTiles * this.tileWidth;
            }

            this.mapData.push(data);

            this.heightInTiles++;
            this.heightInPixels += this.tileHeight;

        }

        public updateBounds() {

            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);

            //console.log('layer bounds', this.boundsInTiles);

        }

        public parseTileOffsets():number {

            this._tileOffsets = [];

            var i = 0;

            if (this.mapFormat == Tilemap.FORMAT_TILED_JSON)
            {
                //  For some reason Tiled counts from 1 not 0
                this._tileOffsets[0] = null;
                i = 1;
            }

            for (var ty = this.tileMargin; ty < this._texture.height; ty += (this.tileHeight + this.tileSpacing))
            {
                for (var tx = this.tileMargin; tx < this._texture.width; tx += (this.tileWidth + this.tileSpacing))
                {
                    this._tileOffsets[i] = { x: tx, y: ty };
                    i++;
                }
            }

            return this._tileOffsets.length;

        }

        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('TilemapLayer: ' + this.name, x, y);
            this._game.stage.context.fillText('startX: ' + this._startX + ' endX: ' + this._maxX, x, y + 14);
            this._game.stage.context.fillText('startY: ' + this._startY + ' endY: ' + this._maxY, x, y + 28);
            this._game.stage.context.fillText('dx: ' + this._dx + ' dy: ' + this._dy, x, y + 42);

        }

        public render(camera: Camera, dx, dy): bool {

            if (this.visible === false || this.alpha < 0.1)
            {
                return false;
            }

            //  Work out how many tiles we can fit into our camera and round it up for the edges
            this._maxX = this._game.math.ceil(camera.width / this.tileWidth) + 1;
            this._maxY = this._game.math.ceil(camera.height / this.tileHeight) + 1;

            //  And now work out where in the tilemap the camera actually is
            this._startX = this._game.math.floor(camera.worldView.x / this.tileWidth);
            this._startY = this._game.math.floor(camera.worldView.y / this.tileHeight);

            //  Tilemap bounds check
            if (this._startX < 0)
            {
                this._startX = 0;
            }

            if (this._startY < 0)
            {
                this._startY = 0;
            }

            if (this._maxX > this.widthInTiles)
            {
                this._maxX = this.widthInTiles;
            }

            if (this._maxY > this.heightInTiles)
            {
                this._maxY = this.heightInTiles;
            }

            if (this._startX + this._maxX > this.widthInTiles)
            {
                this._startX = this.widthInTiles - this._maxX;
            }

            if (this._startY + this._maxY > this.heightInTiles)
            {
                this._startY = this.heightInTiles - this._maxY;
            }

            //  Finally get the offset to avoid the blocky movement
            this._dx = dx;
            this._dy = dy;

            this._dx += -(camera.worldView.x - (this._startX * this.tileWidth));
            this._dy += -(camera.worldView.y - (this._startY * this.tileHeight));

            this._tx = this._dx;
            this._ty = this._dy;

            //	Apply camera difference
            /*
            if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
            {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            */

            //  Alpha
            if (this.alpha !== 1)
            {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }

            for (var row = this._startY; row < this._startY + this._maxY; row++)
            {
                this._columnData = this.mapData[row];

                for (var tile = this._startX; tile < this._startX + this._maxX; tile++)
                {
                    if (this._tileOffsets[this._columnData[tile]])
                    {
                        this._game.stage.context.drawImage(
                            this._texture,	                                //  Source Image
                            this._tileOffsets[this._columnData[tile]].x,    //  Source X (location within the source image)
                            this._tileOffsets[this._columnData[tile]].y,    //  Source Y
                            this.tileWidth, 	                            //	Source Width
                            this.tileHeight, 	                            //	Source Height
                            this._tx, 	    	                            //	Destination X (where on the canvas it'll be drawn)
                            this._ty,	    	                            //	Destination Y
                            this.tileWidth, 	                            //	Destination Width (always same as Source Width unless scaled)
                            this.tileHeight	                                //	Destination Height (always same as Source Height unless scaled)
                        );
                    
                    }

                    this._tx += this.tileWidth;

                }

                this._tx = this._dx;
                this._ty += this.tileHeight;

            }

            if (globalAlpha > -1)
            {
                this._game.stage.context.globalAlpha = globalAlpha;
            }

            return true;

        }


    }
}