/// <reference path="Animations.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="Game.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="geom/Rectangle.ts" />
/// <reference path="geom/Point.ts" />

class Sprite extends GameObject {

    constructor(game: Game, x?: number = 0, y?: number = 0, key?: string = null) {

        super(game, x, y);

        this._texture = null;

        this.animations = new Animations(this._game, this);

        if (key !== null)
        {
            this.loadGraphic(key);
        }
        else
        {
            this.bounds.width = 16;
            this.bounds.height = 16;
        }

    }

    private _texture;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    public animations: Animations;

    //  local rendering related temp vars to help avoid gc spikes
    private _sx: number = 0;
    private _sy: number = 0;
    private _sw: number = 0;
    private _sh: number = 0;
    private _dx: number = 0;
    private _dy: number = 0;
    private _dw: number = 0;
    private _dh: number = 0;

    public loadGraphic(key: string): Sprite {

        if (this._game.cache.isSpriteSheet(key) == false)
        {
            this._texture = this._game.cache.getImage(key);
            this.bounds.width = this._texture.width;
            this.bounds.height = this._texture.height;
        }
        else
        {
            this._texture = this._game.cache.getImage(key);
            this.animations.loadFrameData(this._game.cache.getFrameData(key));
        }

        return this;

    }

    public makeGraphic(width: number, height: number, color: number = 0xffffffff): Sprite {

        this._texture = null;
        this.width = width;
        this.height = height;

        return this;
    }

    public inCamera(camera: Rectangle): bool {

        if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
        {
            this._dx = this.bounds.x - (camera.x * this.scrollFactor.x);
            this._dy = this.bounds.y - (camera.y * this.scrollFactor.x);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;

            return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
        }
        else
        {
            return camera.overlap(this.bounds);
        }

    }

    public postUpdate() {

        this.animations.update();

        super.postUpdate();

    }

    public set frame(value?: number) {
        this.animations.frame = value;
    }

    public get frame(): number {
        return this.animations.frame;
    }

    public render(camera:Camera, cameraOffsetX: number, cameraOffsetY: number): bool {

        //  Render checks
        if (this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.inCamera(camera.worldView) == false)
        {
            return false;
        }

        //  Alpha
        if (this.alpha !== 1)
        {
            var globalAlpha = this._game.stage.context.globalAlpha;
            this._game.stage.context.globalAlpha = this.alpha;
        }

        //if (this.flip === true)
        //{
        //	this.context.save();
        //	this.context.translate(game.canvas.width, 0);
        //	this.context.scale(-1, 1);
        //}

        this._sx = 0;
        this._sy = 0;
        this._sw = this.bounds.width;
        this._sh = this.bounds.height;
        this._dx = cameraOffsetX + (this.bounds.x - camera.worldView.x);
        this._dy = cameraOffsetY + (this.bounds.y - camera.worldView.y);
        this._dw = this.bounds.width * this.scale.x;
        this._dh = this.bounds.height * this.scale.y;

        if (this.animations.currentFrame)
        {
            this._sx = this.animations.currentFrame.x;
            this._sy = this.animations.currentFrame.y;

            if (this.animations.currentFrame.trimmed)
            {
                this._dx += this.animations.currentFrame.spriteSourceSizeX;
                this._dy += this.animations.currentFrame.spriteSourceSizeY;
            }
        }

        //	Apply camera difference
        if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
        {
            this._dx -= (camera.worldView.x * this.scrollFactor.x);
            this._dy -= (camera.worldView.y * this.scrollFactor.y);
        }

        //	Rotation
        if (this.angle !== 0)
        {
            this._game.stage.context.save();
            this._game.stage.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));
            this._game.stage.context.rotate(this.angle * (Math.PI / 180));
            this._dx = -(this._dw / 2);
            this._dy = -(this._dh / 2);
        }

        this._sx = Math.round(this._sx);
        this._sy = Math.round(this._sy);
        this._sw = Math.round(this._sw);
        this._sh = Math.round(this._sh);
        this._dx = Math.round(this._dx);
        this._dy = Math.round(this._dy);
        this._dw = Math.round(this._dw);
        this._dh = Math.round(this._dh);

        //  Debug test
        //this._game.stage.context.fillStyle = 'rgba(255,0,0,0.3)';
        //this._game.stage.context.fillRect(this._dx, this._dy, this._dw, this._dh);

        if (this._texture != null)
        {
            this._game.stage.context.drawImage(
                this._texture,	    //	Source Image
                this._sx, 			//	Source X (location within the source image)
                this._sy, 			//	Source Y
                this._sw, 			//	Source Width
                this._sh, 			//	Source Height
                this._dx, 			//	Destination X (where on the canvas it'll be drawn)
                this._dy, 			//	Destination Y
                this._dw, 			//	Destination Width (always same as Source Width unless scaled)
                this._dh			//	Destination Height (always same as Source Height unless scaled)
            );
        }
        else
        {
            this._game.stage.context.fillStyle = 'rgb(255,255,255)';
            this._game.stage.context.fillRect(this._dx, this._dy, this._dw, this._dh);
        }

        //if (this.flip === true || this.rotation !== 0)
        if (this.rotation !== 0)
        {
            this._game.stage.context.translate(0, 0);
            this._game.stage.context.restore();
        }

        if (globalAlpha > -1)
        {
            this._game.stage.context.globalAlpha = globalAlpha;
        }

        return true;

    }

    public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

        this._game.stage.context.fillStyle = color;
        this._game.stage.context.fillText('Sprite: ' + this.name + ' (' + this.bounds.width + ' x ' + this.bounds.height + ')', x, y);
        this._game.stage.context.fillText('x: ' + this.bounds.x.toFixed(1) + ' y: ' + this.bounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
        this._game.stage.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
        this._game.stage.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);

    }

}