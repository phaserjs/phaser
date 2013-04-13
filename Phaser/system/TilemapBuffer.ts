/// <reference path="../Game.ts" />
/// <reference path="../GameObject.ts" />
/// <reference path="../Tilemap.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="Camera.ts" />

/**
* A Tilemap Buffer
* 
* @author	Richard Davey
*/
class TilemapBuffer {

    constructor(game: Game, camera:Camera, tilemap:Tilemap, texture, tileOffsets) {

        //console.log('New TilemapBuffer created for Camera ' + camera.ID);

        this._game = game;
        this.camera = camera;
        this._tilemap = tilemap;
        this._texture = texture;
        this._tileOffsets = tileOffsets;

        //this.createCanvas();

    }

    private _game: Game;
    private _tilemap: Tilemap;
    private _texture;
    private _tileOffsets;

    private _startX: number = 0;
    private _maxX: number = 0;
    private _startY: number = 0;
    private _maxY: number = 0;
    private _tx: number = 0;
    private _ty: number = 0;
    private _dx: number = 0;
    private _dy: number = 0;
    private _oldCameraX: number = 0;
    private _oldCameraY: number = 0;
    private _dirty: bool = true;
    private _columnData;

    public camera: Camera;
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;

    private createCanvas() {

        this.canvas = <HTMLCanvasElement> document.createElement('canvas');
        this.canvas.width = this._game.stage.width;
        this.canvas.height = this._game.stage.height;
        this.context = this.canvas.getContext('2d');

    }

    public update() {

        /*
        if (this.camera.worldView.x !== this._oldCameraX || this.camera.worldView.y !== this._oldCameraY)
        {
            this._dirty = true;
        }

        this._oldCameraX = this.camera.worldView.x;
        this._oldCameraY = this.camera.worldView.y;
        */

    }

    public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

        this._game.stage.context.fillStyle = color;
        this._game.stage.context.fillText('TilemapBuffer', x, y);
        this._game.stage.context.fillText('startX: ' + this._startX + ' endX: ' + this._maxX, x, y + 14);
        this._game.stage.context.fillText('startY: ' + this._startY + ' endY: ' + this._maxY, x, y + 28);
        this._game.stage.context.fillText('dx: ' + this._dx + ' dy: ' + this._dy, x, y + 42);
        this._game.stage.context.fillText('Dirty: ' + this._dirty, x, y + 56);
    
    }

    public render(dx, dy): bool {

        /*
        if (this._dirty == false)
        {
            this._game.stage.context.drawImage(this.canvas, 0, 0);

            return true;
        }
        */

        //  Work out how many tiles we can fit into our camera and round it up for the edges
        this._maxX = this._game.math.ceil(this.camera.width / this._tilemap.tileWidth) + 1;
        this._maxY = this._game.math.ceil(this.camera.height / this._tilemap.tileHeight) + 1;

        //  And now work out where in the tilemap the camera actually is
        this._startX = this._game.math.floor(this.camera.worldView.x / this._tilemap.tileWidth);
        this._startY = this._game.math.floor(this.camera.worldView.y / this._tilemap.tileHeight);

        //  Tilemap bounds check
        if (this._startX < 0)
        {
            this._startX = 0;
        }

        if (this._startY < 0)
        {
            this._startY = 0;
        }

        if (this._startX + this._maxX > this._tilemap.widthInTiles)
        {
            this._startX = this._tilemap.widthInTiles - this._maxX;
        }

        if (this._startY + this._maxY > this._tilemap.heightInTiles)
        {
            this._startY = this._tilemap.heightInTiles - this._maxY;
        }

        //  Finally get the offset to avoid the blocky movement
        this._dx = dx;
        this._dy = dy;

        this._dx += -(this.camera.worldView.x - (this._startX * this._tilemap.tileWidth));
        this._dy += -(this.camera.worldView.y - (this._startY * this._tilemap.tileHeight));

        this._tx = this._dx;
        this._ty = this._dy;

        for (var row = this._startY; row < this._startY + this._maxY; row++)
        {
            this._columnData = this._tilemap.mapData[row];

            for (var tile = this._startX; tile < this._startX + this._maxX; tile++)
            {
                if (this._tileOffsets[this._columnData[tile]])
                {
                    //this.context.drawImage(
                    this._game.stage.context.drawImage(
                        this._texture,	                                // Source Image
                        this._tileOffsets[this._columnData[tile]].x,    // Source X (location within the source image)
                        this._tileOffsets[this._columnData[tile]].y,    // Source Y
                        this._tilemap.tileWidth, 	                    //	Source Width
                        this._tilemap.tileHeight, 	                    //	Source Height
                        this._tx, 	    	                            //	Destination X (where on the canvas it'll be drawn)
                        this._ty,	    	                            //	Destination Y
                        this._tilemap.tileWidth, 	                    //	Destination Width (always same as Source Width unless scaled)
                        this._tilemap.tileHeight	                    //	Destination Height (always same as Source Height unless scaled)
                    );

                    this._tx += this._tilemap.tileWidth;
                }
            }

            this._tx = this._dx;
            this._ty += this._tilemap.tileHeight;

        }

        //this._game.stage.context.drawImage(this.canvas, 0, 0);
        //console.log('dirty cleaned');
        //this._dirty = false;

        return true;

    }

}
