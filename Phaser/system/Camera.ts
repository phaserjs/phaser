/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="../Game.ts" />

/**
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position, size, scale and rotation and renders only those objects
* within its field of view. The game automatically creates a single Stage sized camera on boot, but it can be changed and
* additional cameras created via the CameraManager.
*/

module Phaser {

    export class Camera {

        /**
        * Instantiates a new camera at the specified location, with the specified size and zoom level.
        * 
        * @param X			X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param Y			Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param Width		The width of the camera display in pixels.
        * @param Height	The height of the camera display in pixels.
        * @param Zoom		The initial zoom level of the camera.  A zoom level of 2 will make all pixels display at 2x resolution.
        */
        constructor(game: Game, id: number, x: number, y: number, width: number, height: number) {

            this._game = game;

            this.ID = id;
            this._stageX = x;
            this._stageY = y;
            this.fx = new FXManager(this._game, this);

            //  The view into the world canvas we wish to render
            this.worldView = new Rectangle(0, 0, width, height);

            this.checkClip();

        }

        private _game: Game;

        private _clip: bool = false;
        private _stageX: number;
        private _stageY: number;
        private _rotation: number = 0;
        private _target: Sprite = null;
        private _sx: number = 0;
        private _sy: number = 0;

        public static STYLE_LOCKON: number = 0;
        public static STYLE_PLATFORMER: number = 1;
        public static STYLE_TOPDOWN: number = 2;
        public static STYLE_TOPDOWN_TIGHT: number = 3;

        public ID: number;
        public worldView: Rectangle;
        public totalSpritesRendered: number;
        public scale: MicroPoint = new MicroPoint(1, 1);
        public scroll: MicroPoint = new MicroPoint(0, 0);
        public bounds: Rectangle = null;
        public deadzone: Rectangle = null;

        //  Camera Border
        public disableClipping: bool = false;
        public showBorder: bool = false;
        public borderColor: string = 'rgb(255,255,255)';

        //  Camera Background Color
        public opaque: bool = true;
        private _bgColor: string = 'rgb(0,0,0)';
        private _bgTexture;
        private _bgTextureRepeat: string = 'repeat';

        //  Camera Shadow
        public showShadow: bool = false;
        public shadowColor: string = 'rgb(0,0,0)';
        public shadowBlur: number = 10;
        public shadowOffset: MicroPoint = new MicroPoint(4, 4);

        public visible: bool = true;
        public alpha: number = 1;

        //  The x/y position of the current input event in world coordinates
        public inputX: number = 0;
        public inputY: number = 0;

        public fx: FXManager;

        public follow(target: Sprite, style?: number = Camera.STYLE_LOCKON) {

            this._target = target;

            var helper: number;

            switch (style)
            {
                case Camera.STYLE_PLATFORMER:
                    var w: number = this.width / 8;
                    var h: number = this.height / 3;
                    this.deadzone = new Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                    break;
                case Camera.STYLE_TOPDOWN:
                    helper = Math.max(this.width, this.height) / 4;
                    this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Camera.STYLE_TOPDOWN_TIGHT:
                    helper = Math.max(this.width, this.height) / 8;
                    this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Camera.STYLE_LOCKON:
                default:
                    this.deadzone = null;
                    break;
            }

        }

        public focusOnXY(x: number, y: number) {

            x += (x > 0) ? 0.0000001 : -0.0000001;
            y += (y > 0) ? 0.0000001 : -0.0000001;

            this.scroll.x = Math.round(x - this.worldView.halfWidth);
            this.scroll.y = Math.round(y - this.worldView.halfHeight);

        }

        public focusOn(point) {

            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            this.scroll.x = Math.round(point.x - this.worldView.halfWidth);
            this.scroll.y = Math.round(point.y - this.worldView.halfHeight);

        }

        /**
         * Specify the boundaries of the world or where the camera is allowed to move.
         * 
         * @param	x				The smallest X value of your world (usually 0).
         * @param	y				The smallest Y value of your world (usually 0).
         * @param	width			The largest X value of your world (usually the world width).
         * @param	height			The largest Y value of your world (usually the world height).
         */
        public setBounds(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {

            if (this.bounds == null)
            {
                this.bounds = new Rectangle();
            }

            this.bounds.setTo(x, y, width, height);

            this.scroll.setTo(0, 0);

            this.update();
        }

        public update() {

            this.fx.preUpdate();

            if (this._target !== null)
            {
                if (this.deadzone == null)
                {
                    this.focusOnXY(this._target.x + this._target.origin.x, this._target.y + this._target.origin.y);
                }
                else
                {
                    var edge: number;
                    var targetX: number = this._target.x + ((this._target.x > 0) ? 0.0000001 : -0.0000001);
                    var targetY: number = this._target.y + ((this._target.y > 0) ? 0.0000001 : -0.0000001);

                    edge = targetX - this.deadzone.x;

                    if (this.scroll.x > edge)
                    {
                        this.scroll.x = edge;
                    }

                    edge = targetX + this._target.width - this.deadzone.x - this.deadzone.width;

                    if (this.scroll.x < edge)
                    {
                        this.scroll.x = edge;
                    }

                    edge = targetY - this.deadzone.y;

                    if (this.scroll.y > edge)
                    {
                        this.scroll.y = edge;
                    }

                    edge = targetY + this._target.height - this.deadzone.y - this.deadzone.height;

                    if (this.scroll.y < edge)
                    {
                        this.scroll.y = edge;
                    }
                }

            }

            //  Make sure we didn't go outside the cameras bounds
            if (this.bounds !== null)
            {
                if (this.scroll.x < this.bounds.left)
                {
                    this.scroll.x = this.bounds.left;
                }

                if (this.scroll.x > this.bounds.right - this.width)
                {
                    this.scroll.x = (this.bounds.right - this.width) + 1;
                }

                if (this.scroll.y < this.bounds.top)
                {
                    this.scroll.y = this.bounds.top;
                }

                if (this.scroll.y > this.bounds.bottom - this.height)
                {
                    this.scroll.y = (this.bounds.bottom - this.height) + 1;
                }
            }

            this.worldView.x = this.scroll.x;
            this.worldView.y = this.scroll.y;

            //  Input values
            this.inputX = this.worldView.x + this._game.input.x;
            this.inputY = this.worldView.y + this._game.input.y;

            this.fx.postUpdate();

        }

        public render() {

            if (this.visible === false || this.alpha < 0.1)
            {
                return;
            }

            //if (this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1)
            //{
            //this._game.stage.context.save();
            //}

            //  It may be safer/quicker to just save the context every frame regardless (needs testing on mobile)
            this._game.stage.context.save();

            this.fx.preRender(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);

            if (this.alpha !== 1)
            {
                this._game.stage.context.globalAlpha = this.alpha;
            }

            this._sx = this._stageX;
            this._sy = this._stageY;

            //  Shadow
            if (this.showShadow)
            {
                this._game.stage.context.shadowColor = this.shadowColor;
                this._game.stage.context.shadowBlur = this.shadowBlur;
                this._game.stage.context.shadowOffsetX = this.shadowOffset.x;
                this._game.stage.context.shadowOffsetY = this.shadowOffset.y;
            }

            //  Scale on
            if (this.scale.x !== 1 || this.scale.y !== 1)
            {
                this._game.stage.context.scale(this.scale.x, this.scale.y);
                this._sx = this._sx / this.scale.x;
                this._sy = this._sy / this.scale.y;
            }

            //  Rotation - translate to the mid-point of the camera
            if (this._rotation !== 0)
            {
                this._game.stage.context.translate(this._sx + this.worldView.halfWidth, this._sy + this.worldView.halfHeight);
                this._game.stage.context.rotate(this._rotation * (Math.PI / 180));

                // now shift back to where that should actually render
                this._game.stage.context.translate(-(this._sx + this.worldView.halfWidth), -(this._sy + this.worldView.halfHeight));
            }

            //  Background
            if (this.opaque == true)
            {
                if (this._bgTexture)
                {
                    this._game.stage.context.fillStyle = this._bgTexture;
                    this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                }
                else
                {
                    this._game.stage.context.fillStyle = this._bgColor;
                    this._game.stage.context.fillRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                }
            }

            //  Shadow off
            if (this.showShadow)
            {
                this._game.stage.context.shadowBlur = 0;
                this._game.stage.context.shadowOffsetX = 0;
                this._game.stage.context.shadowOffsetY = 0;
            }

            this.fx.render(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);

            //  Clip the camera so we don't get sprites appearing outside the edges
            if (this._clip && this.disableClipping == false)
            {
                this._game.stage.context.beginPath();
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.closePath();
                this._game.stage.context.clip();
            }

            this._game.world.group.render(this, this._sx, this._sy);

            if (this.showBorder)
            {
                this._game.stage.context.strokeStyle = this.borderColor;
                this._game.stage.context.lineWidth = 1;
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.stroke();
            }

            //  Scale off
            if (this.scale.x !== 1 || this.scale.y !== 1)
            {
                this._game.stage.context.scale(1, 1);
            }

            this.fx.postRender(this, this._sx, this._sy, this.worldView.width, this.worldView.height);

            if (this._rotation !== 0 || (this._clip && this.disableClipping == false))
            {
                this._game.stage.context.translate(0, 0);
            }

            this._game.stage.context.restore();

            if (this.alpha !== 1)
            {
                this._game.stage.context.globalAlpha = 1;
            }

        }

        public set backgroundColor(color: string) {

            this._bgColor = color;

        }

        public get backgroundColor(): string {
            return this._bgColor;
        }

        public setTexture(key: string, repeat?: string = 'repeat') {

            this._bgTexture = this._game.stage.context.createPattern(this._game.cache.getImage(key), repeat);
            this._bgTextureRepeat = repeat;

        }

        public setPosition(x: number, y: number) {

            this._stageX = x;
            this._stageY = y;

            this.checkClip();

        }

        public setSize(width: number, height: number) {

            this.worldView.width = width;
            this.worldView.height = height;
            this.checkClip();

        }

        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this._game.stage.context.fillStyle = color;
            this._game.stage.context.fillText('Camera ID: ' + this.ID + ' (' + this.worldView.width + ' x ' + this.worldView.height + ')', x, y);
            this._game.stage.context.fillText('X: ' + this._stageX + ' Y: ' + this._stageY + ' Rotation: ' + this._rotation, x, y + 14);
            this._game.stage.context.fillText('World X: ' + this.scroll.x.toFixed(1) + ' World Y: ' + this.scroll.y.toFixed(1), x, y + 28);

            if (this.bounds)
            {
                this._game.stage.context.fillText('Bounds: ' + this.bounds.width + ' x ' + this.bounds.height, x, y + 56);
            }

        }

        public get x(): number {
            return this._stageX;
        }

        public set x(value: number) {
            this._stageX = value;
            this.checkClip();
        }

        public get y(): number {
            return this._stageY;
        }

        public set y(value: number) {
            this._stageY = value;
            this.checkClip();
        }

        public get width(): number {
            return this.worldView.width;
        }

        public set width(value: number) {

            if (value > this._game.stage.width)
            {
                value = this._game.stage.width;
            }

            this.worldView.width = value;
            this.checkClip();
        }

        public get height(): number {
            return this.worldView.height;
        }

        public set height(value: number) {

            if (value > this._game.stage.height)
            {
                value = this._game.stage.height;
            }

            this.worldView.height = value;
            this.checkClip();
        }

        public get rotation(): number {
            return this._rotation;
        }

        public set rotation(value: number) {
            this._rotation = this._game.math.wrap(value, 360, 0);
        }

        private checkClip() {

            if (this._stageX !== 0 || this._stageY !== 0 || this.worldView.width < this._game.stage.width || this.worldView.height < this._game.stage.height)
            {
                this._clip = true;
            }
            else
            {
                this._clip = false;
            }

        }

    }

}