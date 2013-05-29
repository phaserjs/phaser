/// <reference path="../../Game.ts" />
/// <reference path="../../gameobjects/DynamicTexture.ts" />
/// <reference path="../../utils/SpriteUtils.ts" />

/**
* Phaser - Components - Texture
*
* The Texture being used to render the Sprite. Either Image based on a DynamicTexture.
*/

module Phaser.Components {

    export class Texture {

        constructor(parent: Sprite, key?: string = '') {

            this._game = parent.game;
            this._sprite = parent;

            this.canvas = parent.game.stage.canvas;
            this.context = parent.game.stage.context;
            this.alpha = 1;
            this.flippedX = false;
            this.flippedY = false;

            if (key !== null)
            {
                this.cacheKey = key;
                this.loadImage(key);
            }

        }

        /**
         * 
         */
        private _game: Game;

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        private _sprite: Sprite;

        /**
         * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
         */
        private _imageTexture = null;

        /**
         * Reference to the DynamicTexture that is used as the texture for the Sprite.
         * @type {DynamicTexture}
         */
        private _dynamicTexture: DynamicTexture = null;

        /**
        * The status of the texture image.
        * @type {boolean}
        */
        public loaded: bool = false;

        /**
        * Opacity of the Sprite texture where 1 is opaque and 0 is fully transparent.
        * @type {number}
        */
        public alpha: number;

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
         * Updates the texture being used to render the Sprite.
         * Called automatically by SpriteUtils.loadTexture and SpriteUtils.loadDynamicTexture.
         */
        public setTo(image = null, dynamic?: DynamicTexture = null): Sprite {

            if (dynamic)
            {
                this._dynamicTexture = dynamic;
                this.texture = this._dynamicTexture.canvas;
            }
            else
            {
                this._imageTexture = image;
                this.texture = this._imageTexture;
            }

            this.loaded = true;

            return this._sprite;

        }

        /**
         * Sets a new graphic from the game cache to use as the texture for this Sprite.
         * The graphic can be SpriteSheet or Texture Atlas. If you need to use a DynamicTexture see loadDynamicTexture.
         * @param key {string} Key of the graphic you want to load for this sprite.
         * @param clearAnimations {boolean} If this Sprite has a set of animation data already loaded you can choose to keep or clear it with this boolean
         * @return {Sprite} Sprite instance itself.
         */
        public loadImage(key: string, clearAnimations: bool = true) {

            if (clearAnimations && this._sprite.animations.frameData !== null)
            {
                this._sprite.animations.destroy();
            }

            if (this._game.cache.getImage(key) !== null)
            {
                this.setTo(this._game.cache.getImage(key), null);

                if (this._game.cache.isSpriteSheet(key))
                {
                    this._sprite.animations.loadFrameData(this._sprite.game.cache.getFrameData(key));
                }
                else
                {
                    this._sprite.frameBounds.width = this.width;
                    this._sprite.frameBounds.height = this.height;
                }
            }

        }

        /**
         * Load a DynamicTexture as its texture.
         * @param texture {DynamicTexture} The texture object to be used by this sprite.
         * @return {Sprite} Sprite instance itself.
         */
        public loadDynamicTexture(texture: DynamicTexture) {

            if (this._sprite.animations.frameData !== null)
            {
                this._sprite.animations.destroy();
            }

            this.setTo(null, texture);
            this._sprite.frameBounds.width = this.width;
            this._sprite.frameBounds.height = this.height;

        }

        /**
         * Getter only. The width of the texture.
         * @type {number}
         */
        public get width(): number {

            if (this._dynamicTexture)
            {
                return this._dynamicTexture.width;
            }
            else
            {
                return this._imageTexture.width;
            }
        }

        /**
         * Getter only. The height of the texture.
         * @type {number}
         */
        public get height(): number {

            if (this._dynamicTexture)
            {
                return this._dynamicTexture.height;
            }
            else
            {
                return this._imageTexture.height;
            }

        }

    }

}