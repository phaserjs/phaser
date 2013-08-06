/// <reference path="../Game.ts" />
/// <reference path="../math/Vec2.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../animation/AnimationManager.ts" />
/// <reference path="../input/InputHandler.ts" />
/// <reference path="../display/Texture.ts" />
/// <reference path="TransformManager.ts" />
/// <reference path="Events.ts" />
/// <reference path="../physics/arcade/Body.ts" />

/**
* Phaser - Sprite
*/

module Phaser {

    export class Sprite implements IGameObject {

        /**
         * Create a new <code>Sprite</code>.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param [x] {number} the initial x position of the sprite.
         * @param [y] {number} the initial y position of the sprite.
         * @param [key] {string} Key of the graphic you want to load for this sprite.
         */
        constructor(game: Game, x?: number = 0, y?: number = 0, key?: string = null, frame? = null) {

            this.game = game;
            this.type = Phaser.Types.SPRITE;

            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;

            this.x = x;
            this.y = y;
            this.z = -1;
            this.group = null;
            this.name = '';

            this.events = new Phaser.Components.Events(this);
            this.animations = new Phaser.Components.AnimationManager(this);
            this.input = new Phaser.Components.InputHandler(this);
            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);

            if (key !== null)
            {
                this.texture.loadImage(key, false);
            }
            else
            {
                this.texture.opaque = true;
            }

            if (frame !== null)
            {
                if (typeof frame == 'string')
                {
                    this.frameName = frame;
                }
                else
                {
                    this.frame = frame;
                }
            }

            this.worldView = new Rectangle(x, y, this.width, this.height);
            this.cameraView = new Rectangle(x, y, this.width, this.height);

            this.transform.setCache();

            this.outOfBounds = false;
            this.outOfBoundsAction = Phaser.Types.OUT_OF_BOUNDS_PERSIST;

            //  Handy proxies
            this.scale = this.transform.scale;
            this.alpha = this.texture.alpha;
            this.origin = this.transform.origin;
            this.crop = this.texture.crop;

        }

        /**
         * Reference to the main game object
         */
        public game: Game;

        /**
         * The type of game object.
         */
        public type: number;

        /**
         * The name of game object.
         */
        public name: string;

        /**
         * The Group this Sprite belongs to.
         */
        public group: Group;

        /**
         * Controls if both <code>update</code> and render are called by the core game loop.
         */
        public exists: bool;

        /**
         * Controls if <code>update()</code> is automatically called by the core game loop.
         */
        public active: bool;

        /**
         * Controls if this Sprite is rendered or skipped during the core game loop.
         */
        public visible: bool;

        /**
         * A useful state for many game objects. Kill and revive both flip this switch.
         */
        public alive: bool;

        /**
         * Is the Sprite out of the world bounds or not?
         */
        public outOfBounds: bool;

        /**
         * The action to be taken when the sprite is fully out of the world bounds
         * Defaults to Phaser.Types.OUT_OF_BOUNDS_PERSIST
         */
        public outOfBoundsAction: number;

        /**
         * Sprite physics body.
         */
        public body: Phaser.Physics.Body = null;

        /**
         * The texture used to render the Sprite.
         */
        public texture: Phaser.Display.Texture;

        /**
         * The Sprite transform component.
         */
        public transform: Phaser.Components.TransformManager;

        /**
         * The Input component
         */
        public input: Phaser.Components.InputHandler;

        /**
         * The Events component
         */
        public events: Phaser.Components.Events;

        /**
         * This manages animations of the sprite. You can modify animations through it. (see AnimationManager)
         * @type AnimationManager
         */
        public animations: Phaser.Components.AnimationManager;

        /**
         * A Rectangle that defines the size and placement of the Sprite in the game world,
         * after taking into consideration both scrollFactor and scaling.
         */
        public worldView: Phaser.Rectangle;

        /**
         * A Rectangle that maps to the placement of this sprite with respect to a specific Camera.
         * This value is constantly updated and modified during the internal render pass, it is not meant to be accessed directly.
         */
        public cameraView: Phaser.Rectangle;

        /**
         * A local tween variable. Used by the TweenManager when setting a tween on this sprite or a property of it.
         */
        public tween: Phaser.Tween;

        /**
         * A boolean representing if the Sprite has been modified in any way via a scale, rotate, flip or skew.
         */
        public modified: bool = false;

        /**
         * x value of the object.
         */
        public x: number = 0;

        /**
         * y value of the object.
         */
        public y: number = 0;

        /**
         * z order value of the object.
         */
        public z: number = -1;

        /**
         * Render iteration counter
         */
        public renderOrderID: number = 0;

        /**
        * The rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        */
        public get rotation(): number {
            return this.transform.rotation;
        }

        /**
        * Set the rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        * The value is automatically wrapped to be between 0 and 360.
        */
        public set rotation(value: number) {

            this.transform.rotation = this.game.math.wrap(value, 360, 0);

            if (this.body)
            {
                //this.body.angle = this.game.math.degreesToRadians(this.game.math.wrap(value, 360, 0));
            }

        }

        /**
        * Brings this Sprite to the top of its current Group, if set.
        */
        public bringToTop() {

            if (this.group)
            {
                this.group.bringToTop(this);
            }

        }

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
        * Set the animation frame by frame number.
        */
        public set frame(value: number) {
            this.animations.frame = value;
        }

        /**
        * Get the animation frame number.
        */
        public get frame(): number {
            return this.animations.frame;
        }

        /**
        * Set the animation frame by frame name.
        */
        public set frameName(value: string) {
            this.animations.frameName = value;
        }

        /**
        * Get the animation frame name.
        */
        public get frameName(): string {
            return this.animations.frameName;
        }

        public set width(value: number) {
            this.transform.scale.x = value / this.texture.width;
        }

        public get width(): number {
            return this.texture.width * this.transform.scale.x;
        }

        public set height(value: number) {
            this.transform.scale.y = value / this.texture.height;
        }

        public get height(): number {
            return this.texture.height * this.transform.scale.y;
        }

        /**
         * Pre-update is called right before update() on each object in the game loop.
         */
        public preUpdate() {

            this.transform.update();

            if (this.transform.scrollFactor.x != 1 && this.transform.scrollFactor.x != 0)
            {
                this.worldView.x = (this.x * this.transform.scrollFactor.x) - (this.width * this.transform.origin.x);
            }
            else
            {
                this.worldView.x = this.x - (this.width * this.transform.origin.x);
            }

            if (this.transform.scrollFactor.y != 1 && this.transform.scrollFactor.y != 0)
            {
                this.worldView.y = (this.y * this.transform.scrollFactor.y) - (this.height * this.transform.origin.y);
            }
            else
            {
                this.worldView.y = this.y - (this.height * this.transform.origin.y);
            }

            this.worldView.width = this.width;
            this.worldView.height = this.height;

            if (this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY))
            {
                this.modified = true;
            }

        }

        /**
         * Override this function to update your sprites position and appearance.
         */
        public update() {
        }

        /**
         * Automatically called after update() by the game loop for all 'alive' objects.
         */
        public postUpdate() {

            this.animations.update();

            this.checkBounds();

            if (this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false)
            {
                this.modified = false;
            }

        }

        private checkBounds() {

            if (Phaser.RectangleUtils.intersects(this.worldView, this.game.world.bounds))
            {
                this.outOfBounds = false;
            }
            else
            {
                if (this.outOfBounds == false)
                {
                    this.events.onOutOfBounds.dispatch(this);
                }

                this.outOfBounds = true;

                if (this.outOfBoundsAction == Phaser.Types.OUT_OF_BOUNDS_KILL)
                {
                    this.kill();
                }
                else if (this.outOfBoundsAction == Phaser.Types.OUT_OF_BOUNDS_DESTROY)
                {
                    this.destroy();
                }
            }

        }

        /**
         * Clean up memory.
         */
        public destroy() {

            this.input.destroy();

        }

        /**
         * Handy for "killing" game objects.
         * Default behavior is to flag them as nonexistent AND dead.
         * However, if you want the "corpse" to remain in the game,
         * like to animate an effect or whatever, you should override this,
         * setting only alive to false, and leaving exists true.
         */
        public kill(removeFromGroup:bool = false) {

            this.alive = false;
            this.exists = false;

            if (removeFromGroup && this.group)
            {
                this.group.remove(this);
            }

            this.events.onKilled.dispatch(this);

        }

        /**
         * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
         * In practice, this is most often called by <code>Object.reset()</code>.
         */
        public revive() {

            this.alive = true;
            this.exists = true;

            this.events.onRevived.dispatch(this);

        }

    }

}