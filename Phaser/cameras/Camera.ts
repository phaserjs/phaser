/// <reference path="../Game.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../math/Vec2.ts" />
/// <reference path="../components/camera/CameraFX.ts" />
/// <reference path="../components/Texture.ts" />
/// <reference path="../components/Transform.ts" />
/// <reference path="../gameobjects/Sprite.ts" />

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

            this.game = game;

            this.ID = id;
            this.z = id;

            //  The view into the world we wish to render (by default the full game world size)
            //  The size of this Rect is the same as screenView, but the values are all in world coordinates instead of screen coordinates
            this.worldView = new Rectangle(0, 0, width, height);

            //  The rect of the area being rendered in stage/screen coordinates
            this.screenView = new Rectangle(x, y, width, height);

            this.fx = new CameraFX(this.game, this);

            this.transform = new Phaser.Components.Transform(this);
            this.texture = new Phaser.Components.Texture(this);

            this.texture.opaque = false;

            this.checkClip();

        }

        private _target: Sprite = null;

        /**
         * Local private reference to Game.
         */
        public game: Game;

        /**
         * Optional texture used in the background of the Camera.
         */
        public texture: Phaser.Components.Texture;

        /**
         * The transform component.
         */
        public transform: Phaser.Components.Transform;

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
         * Controls if this camera is clipped or not when rendering. You shouldn't usually set this value directly.
         */
        public clip: bool = false;

        /**
         * Camera view Rectangle in world coordinate.
         * @type {Rectangle}
         */
        public worldView: Rectangle;

        /**
         * Visible / renderable area (changes if the camera resizes/moves around the stage)
         * @type {Rectangle}
         */
        public screenView: Rectangle;

        /**
         * Camera worldBounds.
         * @type {Rectangle}
         */
        public worldBounds: Rectangle = null;

        /**
         * A boolean representing if the Camera has been modified in any way via a scale, rotate, flip or skew.
         */
        public modified: bool = false;

        /**
         * Sprite moving inside this Rectangle will not cause camera moving.
         * @type {Rectangle}
         */
        public deadzone: Rectangle = null;

        /**
         * Disable the automatic camera canvas clipping when Camera is non-Stage sized.
         * @type {Boolean}
         */
        public disableClipping: bool = false;

        /**
         * Whether this camera is visible or not. (default is true)
         * @type {boolean}
         */
        public visible: bool = true;

        /**
         * The z value of this Camera. Cameras are rendered in z-index order by the Renderer.
         */
        public z: number = -1;

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
                object.texture['cameraBlacklist'].push(this.ID);
            }

        }

        /**
        * Returns true if the object is hidden from this Camera.
        *
        * @param object {Sprite/Group} The object to check.
        */
        public isHidden(object): bool {
            return (object.texture['cameraBlacklist'] && object.texture['cameraBlacklist'].length > 0 && object.texture['cameraBlacklist'].indexOf(this.ID) == -1);
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
                object.texture['cameraBlacklist'].slice(object.texture['cameraBlacklist'].indexOf(this.ID), 1);
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

            this.worldView.x = Math.round(x - this.worldView.halfWidth);
            this.worldView.y = Math.round(y - this.worldView.halfHeight);

        }

        /**
         * Move the camera focus to this location instantly.
         * @param point {any} Point you want to focus.
         */
        public focusOn(point) {

            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            this.worldView.x = Math.round(point.x - this.worldView.halfWidth);
            this.worldView.y = Math.round(point.y - this.worldView.halfHeight);

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

            if (this.worldBounds == null)
            {
                this.worldBounds = new Rectangle;
            }

            this.worldBounds.setTo(x, y, width, height);

            this.worldView.x = x;
            this.worldView.y = y;

            this.update();
        }

        /**
         * Update focusing and scrolling.
         */
        public update() {

            if (this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY))
            {
                this.modified = true;
            }

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

                    if (this.worldView.x > edge)
                    {
                        this.worldView.x = edge;
                    }

                    edge = targetX + this._target.width - this.deadzone.x - this.deadzone.width;

                    if (this.worldView.x < edge)
                    {
                        this.worldView.x = edge;
                    }

                    edge = targetY - this.deadzone.y;

                    if (this.worldView.y > edge)
                    {
                        this.worldView.y = edge;
                    }

                    edge = targetY + this._target.height - this.deadzone.y - this.deadzone.height;

                    if (this.worldView.y < edge)
                    {
                        this.worldView.y = edge;
                    }
                }

            }

            //  Make sure we didn't go outside the cameras worldBounds
            if (this.worldBounds !== null)
            {
                if (this.worldView.x < this.worldBounds.left)
                {
                    this.worldView.x = this.worldBounds.left;
                }

                if (this.worldView.x > this.worldBounds.right - this.width)
                {
                    this.worldView.x = (this.worldBounds.right - this.width) + 1;
                }

                if (this.worldView.y < this.worldBounds.top)
                {
                    this.worldView.y = this.worldBounds.top;
                }

                if (this.worldView.y > this.worldBounds.bottom - this.height)
                {
                    this.worldView.y = (this.worldBounds.bottom - this.height) + 1;
                }
            }

        }

        /**
         * Update focusing and scrolling.
         */
        public postUpdate() {

            if (this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false)
            {
                this.modified = false;
            }

            //  Make sure we didn't go outside the cameras worldBounds
            if (this.worldBounds !== null)
            {
                if (this.worldView.x < this.worldBounds.left)
                {
                    this.worldView.x = this.worldBounds.left;
                }

                if (this.worldView.x > this.worldBounds.right - this.width)
                {
                    this.worldView.x = (this.worldBounds.right - this.width) + 1;
                }

                if (this.worldView.y < this.worldBounds.top)
                {
                    this.worldView.y = this.worldBounds.top;
                }

                if (this.worldView.y > this.worldBounds.bottom - this.height)
                {
                    this.worldView.y = (this.worldBounds.bottom - this.height) + 1;
                }
            }

            this.fx.postUpdate();

        }

        /**
         * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this.game.stage.context.fillStyle = color;
            this.game.stage.context.fillText('Camera ID: ' + this.ID + ' (' + this.screenView.width + ' x ' + this.screenView.height + ')', x, y);
            this.game.stage.context.fillText('X: ' + this.screenView.x + ' Y: ' + this.screenView.y + ' rotation: ' + this.transform.rotation, x, y + 14);
            this.game.stage.context.fillText('World X: ' + this.worldView.x + ' World Y: ' + this.worldView.y + ' W: ' + this.worldView.width + ' H: ' + this.worldView.height + ' R: ' + this.worldView.right + ' B: ' + this.worldView.bottom, x, y + 28);
            this.game.stage.context.fillText('ScreenView X: ' + this.screenView.x + ' Y: ' + this.screenView.y + ' W: ' + this.screenView.width + ' H: ' + this.screenView.height, x, y + 42);

            if (this.worldBounds)
            {
                this.game.stage.context.fillText('Bounds: ' + this.worldBounds.width + ' x ' + this.worldBounds.height, x, y + 56);
            }

        }

        /**
         * Destroys this camera, associated FX and removes itself from the CameraManager.
         */
        public destroy() {

            this.game.world.cameras.removeCamera(this.ID);
            this.fx.destroy();
        }

        public get x(): number {
            return this.worldView.x;
        }

        public get y(): number {
            return this.worldView.y;
        }

        public set x(value: number) {
            this.worldView.x = value;
        }

        public set y(value: number) {
            this.worldView.y = value;
        }

        public get width(): number {
            return this.screenView.width;
        }

        public get height(): number {
            return this.screenView.height;
        }

        public set width(value: number) {
            this.screenView.width = value;
            this.worldView.width = value;
        }

        public set height(value: number) {
            this.screenView.height = value;
            this.worldView.height = value;
        }

        public setPosition(x: number, y: number) {
            this.screenView.x = x;
            this.screenView.y = y;
            this.checkClip();
        }

        public setSize(width: number, height: number) {
            this.screenView.width = width * this.transform.scale.x;
            this.screenView.height = height * this.transform.scale.y;
            this.worldView.width = width;
            this.worldView.height = height;
            this.checkClip();
        }

        /**
        * The angle of the Camera in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        */
        public get rotation(): number {
            return this.transform.rotation;
        }

        /**
        * Set the angle of the Camera in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        * The value is automatically wrapped to be between 0 and 360.
        */
        public set rotation(value: number) {
            this.transform.rotation = this.game.math.wrap(value, 360, 0);
        }

        private checkClip() {

            if (this.screenView.x != 0 || this.screenView.y != 0 || this.screenView.width < this.game.stage.width || this.screenView.height < this.game.stage.height)
            {
                this.clip = true;
            }
            else
            {
                this.clip = false;
            }

        }

    }

}