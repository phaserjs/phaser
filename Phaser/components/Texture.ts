/// <reference path="../Game.ts" />
/// <reference path="../gameobjects/DynamicTexture.ts" />
/// <reference path="../utils/SpriteUtils.ts" />

/**
* Phaser - Components - Texture
*
* The Texture being used to render the object (Sprite, Group background, etc). Either Image based on a DynamicTexture.
*/

module Phaser.Components {

    export class Texture {

        /**
         * Creates a new Texture component
         * @param parent The object using this Texture to render.
         * @param key An optional Game.Cache key to load an image from
         */
        constructor(parent) {

            this.game = parent.game;
            this.parent = parent;

            this.canvas = parent.game.stage.canvas;
            this.context = parent.game.stage.context;
            this.alpha = 1;
            this.flippedX = false;
            this.flippedY = false;

            this._width = 16;
            this._height = 16;

            this.cameraBlacklist = [];

        }

        /**
         * Private _width - use the width getter/setter instead
         */
        private _width: number;

        /**
         * Private _height - use the height getter/setter instead
         */
        private _height: number;

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

        /**
         * Reference to the parent object (Sprite, Group, etc)
         */
        public parent;

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        public imageTexture = null;

        /**
         * Reference to the DynamicTexture that is used as the texture for the Sprite.
         * @type {DynamicTexture}
         */
        public dynamicTexture: DynamicTexture = null;

        /**
        * The load status of the texture image.
        * @type {boolean}
        */
        public loaded: bool = false;

        /**
         * An Array of Cameras to which this texture won't render
         * @type {Array}
         */
        public cameraBlacklist: number[];

        /**
         * Whether the texture background is opaque or not. If set to true the object is filled with
         * the value of Texture.backgroundColor every frame. Normally you wouldn't enable this but
         * for some effects it can be handy.
         * @type {boolean}
         */
        public opaque: bool = false;

        /**
        * Opacity of the Sprite texture where 1 is opaque (default) and 0 is fully transparent.
        * @type {number}
        */
        public alpha: number;

        /**
         * The Background Color of the Sprite if Texture.opaque is set to true.
         * Given in css color string format, i.e. 'rgb(0,0,0)' or '#ff0000'.
         * @type {string}
         */
        public backgroundColor: string = 'rgb(255,255,255)';

        /**
         * You can set a globalCompositeOperation that will be applied before the render method is called on this Sprite.
         * This is useful if you wish to apply an effect like 'lighten'.
         * If this value is set it will call a canvas context save and restore before and after the render pass, so use it sparingly.
         * Set to null to disable.
         */
        public globalCompositeOperation: string = null;

        /**
        * A reference to the Canvas this Sprite renders to.
        * @type {HTMLCanvasElement}
        */
        public canvas: HTMLCanvasElement;

        /**
        * A reference to the Canvas Context2D this Sprite renders to.
        * @type {CanvasRenderingContext2D}
        */
        public context: CanvasRenderingContext2D;

        /**
         * The Cache key used for the Image Texture.
         */
        public cacheKey: string;

        /**
         * The Texture being used to render the Sprite. Either an Image Texture from the Cache or a DynamicTexture.
         */
        public texture;

        /**
         * Controls if the Sprite is rendered rotated or not.
         * If renderRotation is false then the object can still rotate but it will never be rendered rotated.
         * @type {boolean}
         */
        public renderRotation: bool = true;

        /**
         * The direction the animation frame is facing (can be Phaser.Types.RIGHT, LEFT, UP, DOWN).
         * Very useful when hooking animation to Sprite directions.
         */
        public facing: number;

        /**
         * Flip the graphic horizontally (defaults to false)
         * @type {boolean}
         */
        public flippedX: bool = false;

        /**
         * Flip the graphic vertically (defaults to false)
         * @type {boolean}
         */
        public flippedY: bool = false;

        /**
         * Is the texture a DynamicTexture?
         * @type {boolean}
         */
        public isDynamic: bool = false;

        /**
         * The crop rectangle allows you to control which part of the sprite texture is rendered without distorting it.
         * Set to null to disable, set to a Phaser.Rectangle object to control the region that will be rendered, anything outside the rectangle is ignored.
         * @type {Phaser.Rectangle}
         */
        public crop: Phaser.Rectangle;

        /**
         * Updates the texture being used to render the Sprite.
         * Called automatically by SpriteUtils.loadTexture and SpriteUtils.loadDynamicTexture.
         */
        public setTo(image = null, dynamic?: DynamicTexture = null) {

            if (dynamic)
            {
                this.isDynamic = true;
                this.dynamicTexture = dynamic;
                this.texture = this.dynamicTexture.canvas;
            }
            else
            {
                this.isDynamic = false;
                this.imageTexture = image;
                this.texture = this.imageTexture;
                this._width = image.width;
                this._height = image.height;
            }

            this.loaded = true;

            return this.parent;

        }

        /**
         * Sets a new graphic from the game cache to use as the texture for this Sprite.
         * The graphic can be SpriteSheet or Texture Atlas. If you need to use a DynamicTexture see loadDynamicTexture.
         * @param key {string} Key of the graphic you want to load for this sprite.
         * @param clearAnimations {boolean} If this Sprite has a set of animation data already loaded you can choose to keep or clear it with this boolean
         * @param updateBody {boolean} Update the physics body dimensions to match the newly loaded texture/frame?
         */
        public loadImage(key: string, clearAnimations?: bool = true, updateBody?: bool = true) {

            if (clearAnimations && this.parent['animations'] && this.parent['animations'].frameData !== null)
            {
                this.parent.animations.destroy();
            }

            if (this.game.cache.getImage(key) !== null)
            {
                this.setTo(this.game.cache.getImage(key), null);
                this.cacheKey = key;

                if (this.game.cache.isSpriteSheet(key) && this.parent['animations'])
                {
                    this.parent.animations.loadFrameData(this.parent.game.cache.getFrameData(key));
                }
                else
                {
                    if (updateBody && this.parent['body'])
                    {
                        this.parent.body.bounds.width = this.width;
                        this.parent.body.bounds.height = this.height;
                    }
                }
            }

        }

        /**
         * Load a DynamicTexture as its texture.
         * @param texture {DynamicTexture} The texture object to be used by this sprite.
         */
        public loadDynamicTexture(texture: DynamicTexture) {

            if (this.parent.animations.frameData !== null)
            {
                this.parent.animations.destroy();
            }

            this.setTo(null, texture);
            this.parent.texture.width = this.width;
            this.parent.texture.height = this.height;

        }

        public set width(value: number) {
            this._width = value;
        }

        public set height(value: number) {
            this._height = value;
        }

        /**
         * The width of the texture. If an animation it will be the frame width, not the width of the sprite sheet.
         * If using a DynamicTexture it will be the width of the dynamic texture itself.
         * @type {number}
         */
        public get width(): number {

            if (this.isDynamic)
            {
                return this.dynamicTexture.width;
            }
            else
            {
                return this._width;
            }
        }

        /**
         * The height of the texture. If an animation it will be the frame height, not the height of the sprite sheet.
         * If using a DynamicTexture it will be the height of the dynamic texture itself.
         * @type {number}
         */
        public get height(): number {

            if (this.isDynamic)
            {
                return this.dynamicTexture.height;
            }
            else
            {
                return this._height;
            }

        }

    }

}