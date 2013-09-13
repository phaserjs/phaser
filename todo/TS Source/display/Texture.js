var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Display - Texture
    *
    * The Texture being used to render the object (Sprite, Group background, etc). Either Image based on a DynamicTexture.
    */
    (function (Display) {
        var Texture = (function () {
            /**
            * Creates a new Texture component
            * @param parent The object using this Texture to render.
            * @param key An optional Game.Cache key to load an image from
            */
            function Texture(parent) {
                /**
                * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
                */
                this.imageTexture = null;
                /**
                * Reference to the DynamicTexture that is used as the texture for the Sprite.
                * @type {DynamicTexture}
                */
                this.dynamicTexture = null;
                /**
                * The load status of the texture image.
                * @type {bool}
                */
                this.loaded = false;
                /**
                * Whether the texture background is opaque or not. If set to true the object is filled with
                * the value of Texture.backgroundColor every frame. Normally you wouldn't enable this but
                * for some effects it can be handy.
                * @type {bool}
                */
                this.opaque = false;
                /**
                * The Background Color of the Sprite if Texture.opaque is set to true.
                * Given in css color string format, i.e. 'rgb(0,0,0)' or '#ff0000'.
                * @type {string}
                */
                this.backgroundColor = 'rgb(255,255,255)';
                /**
                * You can set a globalCompositeOperation that will be applied before the render method is called on this Sprite.
                * This is useful if you wish to apply an effect like 'lighten'.
                * If this value is set it will call a canvas context save and restore before and after the render pass, so use it sparingly.
                * Set to null to disable.
                */
                this.globalCompositeOperation = null;
                /**
                * Controls if the Sprite is rendered rotated or not.
                * If renderRotation is false then the object can still rotate but it will never be rendered rotated.
                * @type {bool}
                */
                this.renderRotation = true;
                /**
                * Flip the graphic horizontally (defaults to false)
                * @type {bool}
                */
                this.flippedX = false;
                /**
                * Flip the graphic vertically (defaults to false)
                * @type {bool}
                */
                this.flippedY = false;
                /**
                * Is the texture a DynamicTexture?
                * @type {bool}
                */
                this.isDynamic = false;
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
                this._blacklist = 0;
            }
            Texture.prototype.hideFromCamera = /**
            * Hides an object from this Camera. Hidden objects are not rendered.
            *
            * @param object {Camera} The camera this object should ignore.
            */
            function (camera) {
                if(this.isHidden(camera) == false) {
                    this.cameraBlacklist.push(camera.ID);
                    this._blacklist++;
                }
            };
            Texture.prototype.isHidden = /**
            * Returns true if this texture is hidden from rendering to the given camera, otherwise false.
            */
            function (camera) {
                if(this._blacklist && this.cameraBlacklist.indexOf(camera.ID) !== -1) {
                    return true;
                }
                return false;
            };
            Texture.prototype.showToCamera = /**
            * Un-hides an object previously hidden to this Camera.
            * The object must implement a public cameraBlacklist property.
            *
            * @param object {Sprite/Group} The object this camera should display.
            */
            function (camera) {
                if(this.isHidden(camera)) {
                    this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
                    this._blacklist--;
                }
            };
            Texture.prototype.setTo = /**
            * Updates the texture being used to render the Sprite.
            * Called automatically by SpriteUtils.loadTexture and SpriteUtils.loadDynamicTexture.
            */
            function (image, dynamic) {
                if (typeof image === "undefined") { image = null; }
                if (typeof dynamic === "undefined") { dynamic = null; }
                if(dynamic) {
                    this.isDynamic = true;
                    this.dynamicTexture = dynamic;
                    this.texture = this.dynamicTexture.canvas;
                } else {
                    this.isDynamic = false;
                    this.imageTexture = image;
                    this.texture = this.imageTexture;
                    this._width = image.width;
                    this._height = image.height;
                }
                this.loaded = true;
                return this.parent;
            };
            Texture.prototype.loadImage = /**
            * Sets a new graphic from the game cache to use as the texture for this Sprite.
            * The graphic can be SpriteSheet or Texture Atlas. If you need to use a DynamicTexture see loadDynamicTexture.
            * @param key {string} Key of the graphic you want to load for this sprite.
            * @param clearAnimations {bool} If this Sprite has a set of animation data already loaded you can choose to keep or clear it with this bool
            * @param updateBody {bool} Update the physics body dimensions to match the newly loaded texture/frame?
            */
            function (key, clearAnimations, updateBody) {
                if (typeof clearAnimations === "undefined") { clearAnimations = true; }
                if (typeof updateBody === "undefined") { updateBody = true; }
                if(clearAnimations && this.parent['animations'] && this.parent['animations'].frameData !== null) {
                    this.parent.animations.destroy();
                }
                if(this.game.cache.getImage(key) !== null) {
                    this.setTo(this.game.cache.getImage(key), null);
                    this.cacheKey = key;
                    if(this.game.cache.isSpriteSheet(key) && this.parent['animations']) {
                        this.parent.animations.loadFrameData(this.parent.game.cache.getFrameData(key));
                    } else {
                        if(updateBody && this.parent['body']) {
                            this.parent.body.bounds.width = this.width;
                            this.parent.body.bounds.height = this.height;
                        }
                    }
                }
            };
            Texture.prototype.loadDynamicTexture = /**
            * Load a DynamicTexture as its texture.
            * @param texture {DynamicTexture} The texture object to be used by this sprite.
            */
            function (texture) {
                if(this.parent.animations.frameData !== null) {
                    this.parent.animations.destroy();
                }
                this.setTo(null, texture);
                this.parent.texture.width = this.width;
                this.parent.texture.height = this.height;
            };
            Object.defineProperty(Texture.prototype, "width", {
                get: /**
                * The width of the texture. If an animation it will be the frame width, not the width of the sprite sheet.
                * If using a DynamicTexture it will be the width of the dynamic texture itself.
                * @type {number}
                */
                function () {
                    if(this.isDynamic) {
                        return this.dynamicTexture.width;
                    } else {
                        return this._width;
                    }
                },
                set: function (value) {
                    this._width = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Texture.prototype, "height", {
                get: /**
                * The height of the texture. If an animation it will be the frame height, not the height of the sprite sheet.
                * If using a DynamicTexture it will be the height of the dynamic texture itself.
                * @type {number}
                */
                function () {
                    if(this.isDynamic) {
                        return this.dynamicTexture.height;
                    } else {
                        return this._height;
                    }
                },
                set: function (value) {
                    this._height = value;
                },
                enumerable: true,
                configurable: true
            });
            return Texture;
        })();
        Display.Texture = Texture;        
    })(Phaser.Display || (Phaser.Display = {}));
    var Display = Phaser.Display;
})(Phaser || (Phaser = {}));
