/// <reference path="../_definitions.ts" />

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

            width = this.game.math.clamp(width, this.game.stage.width, 1);
            height = this.game.math.clamp(height, this.game.stage.height, 1);

            //  The view into the world we wish to render (by default the full game world size)
            //  The size of this Rect is the same as screenView, but the values are all in world coordinates instead of screen coordinates
            this.worldView = new Rectangle(0, 0, width, height);

            //  The rect of the area being rendered in stage/screen coordinates
            this.screenView = new Rectangle(x, y, width, height);

            this.plugins = new PluginManager(this.game, this);

            this.transform = new Phaser.Components.TransformManager(this);
            this.texture = new Phaser.Display.Texture(this);

            //  We create a hidden canvas for our camera the size of the game (we use the screenView to clip the render to the camera size)
            this.texture.canvas = <HTMLCanvasElement> document.createElement('canvas');
            this.texture.canvas.width = width;
            this.texture.canvas.height = height;
            this.texture.context = this.texture.canvas.getContext('2d');

            //  Handy proxies
            this.scale = this.transform.scale;
            this.alpha = this.texture.alpha;
            this.origin = this.transform.origin;
            this.crop = this.texture.crop;

        }

        private _target: Sprite = null;

        /**
         * Local reference to Game.
         */
        public game: Phaser.Game;

        /**
         * The PluginManager for the Game
         * @type {PluginManager}
         */
        public plugins: PluginManager;

        /**
         * Optional texture used in the background of the Camera.
         */
        public texture: Phaser.Display.Texture;

        /**
         * The transform component.
         */
        public transform: Phaser.Components.TransformManager;

        /**
        * The scale of the Sprite. A value of 1 is original scale. 0.5 is half size. 2 is double the size.
        * This is a reference to Sprite.transform.scale
        */
        public scale: Phaser.Vec2;

        /**
         * The crop rectangle allows you to control which part of the sprite texture is rendered without distorting it.
         * Set to null to disable, set to a Phaser.Rectangle object to control the region that will be rendered, anything outside the rectangle is ignored.
         * This is a reference to Sprite.texture.crop
         * @type {Phaser.Rectangle}
         */
        public crop: Phaser.Rectangle;

        /**
        * The origin of the Sprite around which rotation and positioning takes place.
        * This is a reference to Sprite.transform.origin
        */
        public origin: Phaser.Vec2;

        /**
        * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
        */
        public set alpha(value: number) {
            this.texture.alpha = value;
        }

        /**
        * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
        */
        public get alpha(): number {
            return this.texture.alpha;
        }

        /**
         * Identity of this camera.
         */
        public ID: number;

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
        public modified: boolean = false;

        /**
         * Sprite moving inside this Rectangle will not cause camera moving.
         * @type {Rectangle}
         */
        public deadzone: Rectangle = null;

        /**
         * Whether this camera is visible or not. (default is true)
         * @type {boolean}
         */
        public visible: boolean = true;

        /**
         * The z value of this Camera. Cameras are rendered in z-index order by the Renderer.
         */
        public z: number = -1;

        /**
        * Hides an object from this Camera. Hidden objects are not rendered.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should ignore.
        */
        public hide(object) {

            object.texture.hideFromCamera(this);

        }

        /**
        * Returns true if the object is hidden from this Camera.
        *
        * @param object {Sprite/Group} The object to check.
        */
        public isHidden(object): boolean {
            return object.texture.isHidden(this);
        }

        /**
        * Un-hides an object previously hidden to this Camera.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should display.
        */
        public show(object) {

            object.texture.showToCamera(this);

        }

        /**
         * Tells this camera object what sprite to track.
         * @param target {Sprite} The object you want the camera to track. Set to null to not follow anything.
         * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
         */
        public follow(target: Sprite, style: number = Phaser.Types.CAMERA_FOLLOW_LOCKON) {

            this._target = target;

            var helper: number;

            switch (style)
            {
                case Phaser.Types.CAMERA_FOLLOW_PLATFORMER:
                    var w: number = this.width / 8;
                    var h: number = this.height / 3;
                    this.deadzone = new Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_TOPDOWN:
                    helper = Math.max(this.width, this.height) / 4;
                    this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_TOPDOWN_TIGHT:
                    helper = Math.max(this.width, this.height) / 8;
                    this.deadzone = new Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_LOCKON:
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

            this.plugins.preUpdate();

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

            this.worldView.floor();

            this.plugins.update();

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
                    this.worldView.x = this.worldBounds.right - this.width;
                }

                if (this.worldView.y < this.worldBounds.top)
                {
                    this.worldView.y = this.worldBounds.top;
                }

                if (this.worldView.y > this.worldBounds.bottom - this.height)
                {
                    this.worldView.y = this.worldBounds.bottom - this.height;
                }
            }

            this.worldView.floor();

            this.plugins.postUpdate();

        }

        /**
         * Destroys this camera, associated FX and removes itself from the CameraManager.
         */
        public destroy() {

            this.game.world.cameras.removeCamera(this.ID);
            this.plugins.destroy();
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

            if (value !== this.texture.canvas.width)
            {
                this.texture.canvas.width = value;
            }

        }

        public set height(value: number) {

            this.screenView.height = value;
            this.worldView.height = value;

            if (value !== this.texture.canvas.height)
            {
                this.texture.canvas.height = value;
            }

        }

        public setPosition(x: number, y: number) {

            this.screenView.x = x;
            this.screenView.y = y;

        }

        public setSize(width: number, height: number) {

            this.screenView.width = width * this.transform.scale.x;
            this.screenView.height = height * this.transform.scale.y;
            this.worldView.width = width;
            this.worldView.height = height;

            if (width !== this.texture.canvas.width)
            {
                this.texture.canvas.width = width;
            }

            if (height !== this.texture.canvas.height)
            {
                this.texture.canvas.height = height;
            }

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

    }

}