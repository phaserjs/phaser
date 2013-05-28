/// <reference path="../core/Point.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="../core/Vec2.ts" />
/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="../Game.ts" />
/// <reference path="../components/camera/CameraFX.ts" />

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
            this.scaledX = x;
            this.scaledY = x;
            this.fx = new CameraFX(this._game, this);

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
        //private _sx: number = 0;
        //private _sy: number = 0;

        public scaledX: number;
        public scaledY: number;

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
         * Scale factor of the camera.
         * @type {Vec2}
         */
        public scale: Vec2 = new Vec2(1, 1);

        /**
         * Scrolling factor.
         * @type {MicroPoint}
         */
        public scroll: Vec2 = new Vec2(0, 0);

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

        /**
         * Disable the automatic camera canvas clipping when Camera is non-Stage sized.
         * @type {Boolean}
         */
        public disableClipping: bool = false;

        /**
         * Whether the camera background is opaque or not. If set to true the Camera is filled with
         * the value of Camera.backgroundColor every frame. Normally you wouldn't enable this if the
         * Camera is the full Stage size, as the Stage.backgroundColor has the same effect. But for
         * multiple or mini cameras it can be very useful.
         * @type {boolean}
         */
        public opaque: bool = false;

        /**
         * The Background Color of the camera in css color string format, i.e. 'rgb(0,0,0)' or '#ff0000'.
         * Not used if the Camera.opaque property is false.
         * @type {string}
         */
        public backgroundColor: string = 'rgb(0,0,0)';

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
         * @type {CameraFX}
         */
        public fx: CameraFX;

        /**
        * Hides an object from this Camera. Hidden objects are not rendered.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should ignore.
        */
        public hide(object) {

            if (this.isHidden(object) == false)
            {
                object['cameraBlacklist'].push(this.ID);
            }

        }

        /**
        * Returns true if the object is hidden from this Camera.
        *
        * @param object {Sprite/Group} The object to check.
        */
        public isHidden(object): bool {

            if (object['cameraBlacklist'] && object['cameraBlacklist'].length > 0 && object['cameraBlacklist'].indexOf(this.ID) == -1)
            {
                return true;
            }

            return false;

        }

        /**
        * Un-hides an object previously hidden to this Camera.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should display.
        */
        public show(object) {

            if (this.isHidden(object) == true)
            {
                object['cameraBlacklist'].slice(object['cameraBlacklist'].indexOf(this.ID), 1);
            }

        }

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
         * Camera preRender
         */
        public preRender() {

            if (this.visible === false || this.alpha < 0.1)
            {
                return;
            }

            if (this._rotation !== 0 || this._clip || this.scale.x !== 1 || this.scale.y !== 1)
            {
                this._game.stage.context.save();
            }

            this.fx.preRender(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);

            if (this.alpha !== 1)
            {
                this._game.stage.context.globalAlpha = this.alpha;
            }

            this.scaledX = this._stageX;
            this.scaledY = this._stageY;

            //  Scale on
            if (this.scale.x !== 1 || this.scale.y !== 1)
            {
                this._game.stage.context.scale(this.scale.x, this.scale.y);
                this.scaledX = this.scaledX / this.scale.x;
                this.scaledY = this.scaledY / this.scale.y;
            }

            //  Rotation - translate to the mid-point of the camera
            if (this._rotation !== 0)
            {
                this._game.stage.context.translate(this.scaledX + this.worldView.halfWidth, this.scaledY + this.worldView.halfHeight);
                this._game.stage.context.rotate(this._rotation * (Math.PI / 180));

                // now shift back to where that should actually render
                this._game.stage.context.translate(-(this.scaledX + this.worldView.halfWidth), -(this.scaledY + this.worldView.halfHeight));
            }

            //  Background
            if (this.opaque)
            {
                this._game.stage.context.fillStyle = this.backgroundColor;
                this._game.stage.context.fillRect(this.scaledX, this.scaledY, this.worldView.width, this.worldView.height);
            }

            this.fx.render(this, this._stageX, this._stageY, this.worldView.width, this.worldView.height);

            //  Clip the camera so we don't get sprites appearing outside the edges
            if (this._clip == true && this.disableClipping == false)
            {
                this._game.stage.context.beginPath();
                this._game.stage.context.rect(this.scaledX, this.scaledY, this.worldView.width, this.worldView.height);
                this._game.stage.context.closePath();
                this._game.stage.context.clip();
            }

        }

        /**
         * Camera postRender
         */
        public postRender() {

            //  Scale off
            if (this.scale.x !== 1 || this.scale.y !== 1)
            {
                this._game.stage.context.scale(1, 1);
            }

            this.fx.postRender(this, this.scaledX, this.scaledY, this.worldView.width, this.worldView.height);

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

        /**
         * Destroys this camera, associated FX and removes itself from the CameraManager.
         */
        public destroy() {

            this._game.world.cameras.removeCamera(this.ID);
            this.fx.destroy();
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