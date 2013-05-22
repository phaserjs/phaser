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
         *Sprite constructor
         * Instantiates a new camera at the specified location, with the specified size and zoom level.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param id {number} Unique identity.
         * @param x {number} X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
         * @param y {number} Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
         * @param width {number} The width of the camera display in pixels.
         * @param height {number} The height of the camera display in pixels.
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

        /**
         * Local private reference to Game.
         */
        private _game: Game;

        private _clip: bool = false;
        private _stageX: number;
        private _stageY: number;
        private _rotation: number = 0;
        private _target: Sprite = null;
        private _sx: number = 0;
        private _sy: number = 0;

        /**
         * Camera "follow" style preset: camera has no deadzone, just tracks the focus object directly.
         * @type {number}
         */
        public static STYLE_LOCKON: number = 0;

        /**
         * Camera "follow" style preset: camera deadzone is narrow but tall.
         * @type {number}
         */
        public static STYLE_PLATFORMER: number = 1;

        /**
         * Camera "follow" style preset: camera deadzone is a medium-size square around the focus object.
         * @type {number}
         */
        public static STYLE_TOPDOWN: number = 2;

        /**
         * Camera "follow" style preset: camera deadzone is a small square around the focus object.
         * @type {number}
         */
        public static STYLE_TOPDOWN_TIGHT: number = 3;

        /**
         * Identity of this camera.
         */
        public ID: number;

        /**
         * Camera view rectangle in world coordinate.
         * @type {Rectangle}
         */
        public worldView: Rectangle;

        /**
         * How many sprites will be rendered by this camera.
         * @type {number}
         */
        public totalSpritesRendered: number;

        /**
         * Scale factor of the camera.
         * @type {MicroPoint}
         */
        public scale: MicroPoint = new MicroPoint(1, 1);

        /**
         * Scrolling factor.
         * @type {MicroPoint}
         */
        public scroll: MicroPoint = new MicroPoint(0, 0);

        /**
         * Camera bounds.
         * @type {Rectangle}
         */
        public bounds: Rectangle = null;

        /**
         * Sprite moving inside this rectangle will not cause camera moving.
         * @type {Rectangle}
         */
        public deadzone: Rectangle = null;

        //  Camera Border
        public disableClipping: bool = false;

        /**
         * Whether render border of this camera or not. (default is false)
         * @type {boolean}
         */
        public showBorder: bool = false;

        /**
         * Color of border of this camera. (in css color string)
         * @type {string}
         */
        public borderColor: string = 'rgb(255,255,255)';

        /**
         * Whether the camera background is opaque or not. If set to true the Camera is filled with
         * the value of Camera.backgroundColor every frame.
         * @type {boolean}
         */
        public opaque: bool = false;

        /**
         * Clears the camera every frame using a canvas clearRect call (default to true).
         * Note that this erases anything below the camera as well, so do not use it in conjuction with a camera
         * that uses alpha or that needs to be able to manage opacity. Equally if Camera.opaque is set to true
         * then set Camera.clear to false to save rendering time.
         * By default the Stage will clear itself every frame, so be sure not to double-up clear calls.
         * @type {boolean}
         */
        public clear: bool = false;

        /**
         * Background color in css color string.
         * @type {string}
         */
        private _bgColor: string = 'rgb(0,0,0)';

        /**
         * Background texture to be rendered if background is visible.
         */
        private _bgTexture;

        /**
         * Background texture repeat style. (default is 'repeat')
         * @type {string}
         */
        private _bgTextureRepeat: string = 'repeat';

        //  Camera Shadow
        /**
         * Render camera shadow or not. (default is false)
         * @type {boolean}
         */
        public showShadow: bool = false;

        /**
         * Color of shadow, in css color string.
         * @type {string}
         */
        public shadowColor: string = 'rgb(0,0,0)';

        /**
         * Blur factor of shadow.
         * @type {number}
         */
        public shadowBlur: number = 10;

        /**
         * Offset of the shadow from camera's position.
         * @type {MicroPoint}
         */
        public shadowOffset: MicroPoint = new MicroPoint(4, 4);

        /**
         * Whether this camera visible or not. (default is true)
         * @type {boolean}
         */
        public visible: bool = true;

        /**
         * Alpha of the camera. (everything rendered to this camera will be affected)
         * @type {number}
         */
        public alpha: number = 1;

        /**
         * The x position of the current input event in world coordinates.
         * @type {number}
         */
        public inputX: number = 0;

        /**
         * The y position of the current input event in world coordinates.
         * @type {number}
         */
        public inputY: number = 0;

        /**
         * Effects manager.
         * @type {FXManager}
         */
        public fx: FXManager;

        /**
         * Tells this camera object what sprite to track.
         * @param target {Sprite} The object you want the camera to track. Set to null to not follow anything.
         * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
         */
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

        /**
         * Move the camera focus to this location instantly.
         * @param x {number} X position.
         * @param y {number} Y position.
         */
        public focusOnXY(x: number, y: number) {

            x += (x > 0) ? 0.0000001 : -0.0000001;
            y += (y > 0) ? 0.0000001 : -0.0000001;

            this.scroll.x = Math.round(x - this.worldView.halfWidth);
            this.scroll.y = Math.round(y - this.worldView.halfHeight);

        }

        /**
         * Move the camera focus to this location instantly.
         * @param point {any} Point you want to focus.
         */
        public focusOn(point) {

            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            this.scroll.x = Math.round(point.x - this.worldView.halfWidth);
            this.scroll.y = Math.round(point.y - this.worldView.halfHeight);

        }

        /**
         * Specify the boundaries of the world or where the camera is allowed to move.
         *
         * @param x      {number} The smallest X value of your world (usually 0).
         * @param y      {number} The smallest Y value of your world (usually 0).
         * @param width  {number} The largest X value of your world (usually the world width).
         * @param height {number} The largest Y value of your world (usually the world height).
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

        /**
         * Update focusing and scrolling.
         */
        public update() {

            this.fx.preUpdate();

            if (this._target !== null)
            {
                if (this.deadzone == null)
                {
                    this.focusOnXY(this._target.x, this._target.y);
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

        /**
         * Draw background, shadow, effects, and objects if this is visible.
         */
        public render() {

            if (this.visible === false || this.alpha < 0.1)
            {
                return;
            }

            if (this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1)
            {
                this._game.stage.context.save();
            }

            //  It may be safer/quicker to just save the context every frame regardless (needs testing on mobile - sucked on Android 2.x)
            //this._game.stage.context.save();

            this.fx.preRender(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);

            if (this.alpha !== 1)
            {
                this._game.stage.context.globalAlpha = this.alpha;
            }

            this._sx = this._stageX;
            this._sy = this._stageY;

            //  Shadow
            if (this.showShadow == true)
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

            if (this.clear == true)
            {
                this._game.stage.context.clearRect(this._sx, this._sy, this.worldView.width, this.worldView.height);
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
            if (this.showShadow == true)
            {
                this._game.stage.context.shadowBlur = 0;
                this._game.stage.context.shadowOffsetX = 0;
                this._game.stage.context.shadowOffsetY = 0;
            }

            this.fx.render(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);

            //  Clip the camera so we don't get sprites appearing outside the edges
            if (this._clip == true && this.disableClipping == false)
            {
                this._game.stage.context.beginPath();
                this._game.stage.context.rect(this._sx, this._sy, this.worldView.width, this.worldView.height);
                this._game.stage.context.closePath();
                this._game.stage.context.clip();
            }

            this._game.world.group.render(this, this._sx, this._sy);

            if (this.showBorder == true)
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

            if (this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1)
            {
                this._game.stage.context.restore();
            }

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

        /**
         * Set camera background texture.
         * @param key {string} Asset key of the texture.
         * @param [repeat] {string} what kind of repeat will this texture used for background.
         */
        public setTexture(key: string, repeat?: string = 'repeat') {

            this._bgTexture = this._game.stage.context.createPattern(this._game.cache.getImage(key), repeat);
            this._bgTextureRepeat = repeat;

        }

        /**
         * Set position of this camera.
         * @param x {number} X position.
         * @param y {number} Y position.
         */
        public setPosition(x: number, y: number) {

            this._stageX = x;
            this._stageY = y;

            this.checkClip();

        }

        /**
         * Give this camera a new size.
         * @param width {number} Width of new size.
         * @param height {number} Height of new size.
         */
        public setSize(width: number, height: number) {

            this.worldView.width = width;
            this.worldView.height = height;
            this.checkClip();

        }

        /**
         * Render debug infos. (including id, position, rotation, scrolling factor, bounds and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
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