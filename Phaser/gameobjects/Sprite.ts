/// <reference path="../Game.ts" />
/// <reference path="../AnimationManager.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="../system/Camera.ts" />

/**
* Phaser - Sprite
*
* The Sprite GameObject is an extension of the core GameObject that includes support for animation and dynamic textures.
* It's probably the most used GameObject of all.
*/

module Phaser {

    export class Sprite extends GameObject {

        /**
         * Sprite constructor
         * Create a new <code>Sprite</code>.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param [x] {number} the initial x position of the sprite.
         * @param [y] {number} the initial y position of the sprite.
         * @param [key] {string} Key of the graphic you want to load for this sprite.
         */
        constructor(game: Game, x?: number = 0, y?: number = 0, key?: string = null) {

            super(game, x, y);

            this._texture = null;

            this.animations = new AnimationManager(this._game, this);

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

        /**
         * Texture of this sprite to be rendered.
         */
        private _texture;

        /**
         * Texture of this sprite is DynamicTexture? (default to false)
         * @type {boolean}
         */
        private _dynamicTexture: bool = false;

        //  local rendering related temp vars to help avoid gc spikes
        private _sx: number = 0;
        private _sy: number = 0;
        private _sw: number = 0;
        private _sh: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;

        /**
         * This manages animations of the sprite. You can modify animations though it. (see AnimationManager)
         * @type AnimationManager
         */
        public animations: AnimationManager;

        /**
         * Render bound of this sprite for debugging? (default to false)
         * @type {boolean}
         */
        public renderDebug: bool = false;

        /**
         * Color of the Sprite when no image is present. Format is a css color string.
         * @type {string}
         */
        public fillColor: string = 'rgb(255,255,255)';

        /**
         * Color of bound when render debug. (see renderDebug) Format is a css color string.
         * @type {string}
         */
        public renderDebugColor: string = 'rgba(0,255,0,0.5)';

        /**
         * Color of points when render debug. (see renderDebug) Format is a css color string.
         * @type {string}
         */
        public renderDebugPointColor: string = 'rgba(255,255,255,1)';

        /**
         * Flip the graphic vertically? (default to false)
         * @type {boolean}
         */
        public flipped: bool = false;

        /**
         * Load graphic for this sprite. (graphic can be SpriteSheet of Texture)
         * @param key {string} Key of the graphic you want to load for this sprite.
         * @return {Sprite} Sprite instance itself.
         */
        public loadGraphic(key: string): Sprite {

            if (this._game.cache.getImage(key) !== null)
            {
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

                this._dynamicTexture = false;
            }

            return this;

        }

        /**
         * Load a DynamicTexture as its texture.
         * @param texture {DynamicTexture} The texture object to be used by this sprite.
         * @return {Sprite} Sprite instance itself.
         */
        public loadDynamicTexture(texture: DynamicTexture): Sprite {

            this._texture = texture;

            this.bounds.width = this._texture.width;
            this.bounds.height = this._texture.height;

            this._dynamicTexture = true;

            return this;

        }

        /**
         * This function creates a flat colored square image dynamically.
         * @param width {number} The width of the sprite you want to generate.
         * @param height {number} The height of the sprite you want to generate.
         * @param [color] {number} specifies the color of the generated block. (format is 0xAARRGGBB)
         * @return {Sprite} Sprite instance itself.
         */
        public makeGraphic(width: number, height: number, color: string = 'rgb(255,255,255)'): Sprite {

            this._texture = null;
            this.width = width;
            this.height = height;
            this.fillColor = color;
            this._dynamicTexture = false;

            return this;
        }

        /**
         * Check whether this object is visible in a specific camera rectangle.
         * @param camera {Rectangle} The rectangle you want to check.
         * @return {boolean} Return true if bounds of this sprite intersects the given rectangle, otherwise return false.
         */
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
                return camera.intersects(this.bounds, this.bounds.length);
            }

        }

        /**
         * Automatically called after update() by the game loop, this function just updates animations.
         */
        public postUpdate() {

            this.animations.update();

            super.postUpdate();

        }

        public set frame(value: number) {
            this.animations.frame = value;
        }

        public get frame(): number {
            return this.animations.frame;
        }

        public set frameName(value: string) {
            this.animations.frameName = value;
        }

        public get frameName(): string {
            return this.animations.frameName;
        }

        /**
         * Render this sprite to specific camera. Called by game loop after update().
         * @param camera {Camera} Camera this sprite will be rendered to.
         * @cameraOffsetX {number} X offset to the camera.
         * @cameraOffsetY {number} Y offset to the camera.
         * @return {boolean} Return false if not rendered, otherwise return true.
         */
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool {

            //  Render checks
            if (this.visible == false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false)
            {
                return false;
            }

            //  Alpha
            if (this.alpha !== 1)
            {
                var globalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = this.alpha;
            }

            this._sx = 0;
            this._sy = 0;
            this._sw = this.bounds.width;
            this._sh = this.bounds.height;
            this._dx = cameraOffsetX + (this.bounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.topLeft.y - camera.worldView.y);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;

            if (this.align == GameObject.ALIGN_TOP_CENTER)
            {
                this._dx -= this.bounds.halfWidth * this.scale.x;
            }
            else if (this.align == GameObject.ALIGN_TOP_RIGHT)
            {
                this._dx -= this.bounds.width * this.scale.x;
            }
            else if (this.align == GameObject.ALIGN_CENTER_LEFT)
            {
                this._dy -= this.bounds.halfHeight * this.scale.y;
            }
            else if (this.align == GameObject.ALIGN_CENTER)
            {
                this._dx -= this.bounds.halfWidth * this.scale.x;
                this._dy -= this.bounds.halfHeight * this.scale.y;
            }
            else if (this.align == GameObject.ALIGN_CENTER_RIGHT)
            {
                this._dx -= this.bounds.width * this.scale.x;
                this._dy -= this.bounds.halfHeight * this.scale.y;
            }
            else if (this.align == GameObject.ALIGN_BOTTOM_LEFT)
            {
                this._dy -= this.bounds.height * this.scale.y;
            }
            else if (this.align == GameObject.ALIGN_BOTTOM_CENTER)
            {
                this._dx -= this.bounds.halfWidth * this.scale.x;
                this._dy -= this.bounds.height * this.scale.y;
            }
            else if (this.align == GameObject.ALIGN_BOTTOM_RIGHT)
            {
                this._dx -= this.bounds.width * this.scale.x;
                this._dy -= this.bounds.height * this.scale.y;
            }

            if (this._dynamicTexture == false && this.animations.currentFrame !== null)
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

            //	Rotation - needs to work from origin point really, but for now from center
            if (this.angle !== 0 || this.rotationOffset !== 0 || this.flipped == true)
            {
                this.context.save();
                this.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));

                if (this.renderRotation == true &&  (this.angle !== 0 || this.rotationOffset !== 0))
                {
                    this.context.rotate((this.rotationOffset + this.angle) * (Math.PI / 180));
                }

                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);

                if (this.flipped == true)
                {
                	this.context.scale(-1, 1);
                }
            }

            this._sx = Math.round(this._sx);
            this._sy = Math.round(this._sy);
            this._sw = Math.round(this._sw);
            this._sh = Math.round(this._sh);
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);

            if (this._texture != null)
            {
                if (this._dynamicTexture)
                {
                    this.context.drawImage(
                        this._texture.canvas,   //	Source Image
                        this._sx, 			    //	Source X (location within the source image)
                        this._sy, 			    //	Source Y
                        this._sw, 			    //	Source Width
                        this._sh, 			    //	Source Height
                        this._dx, 			    //	Destination X (where on the canvas it'll be drawn)
                        this._dy, 			    //	Destination Y
                        this._dw, 			    //	Destination Width (always same as Source Width unless scaled)
                        this._dh			    //	Destination Height (always same as Source Height unless scaled)
                    );
                }
                else
                {
                    this.context.drawImage(
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
            }
            else
            {
                this.context.fillStyle = this.fillColor;
                this.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            }

            if (this.flipped === true || this.rotation !== 0 || this.rotationOffset !== 0)
            {
                //this.context.translate(0, 0);
                this.context.restore();
            }

            if (this.renderDebug)
            {
                this.renderBounds(camera, cameraOffsetX, cameraOffsetY);
            }

            if (globalAlpha > -1)
            {
                this.context.globalAlpha = globalAlpha;
            }

            return true;

        }

        /**
         * Renders the bounding box around this Sprite and the contact points. Useful for visually debugging.
         * @param camera {Camera} Camera the bound will be rendered to.
         * @param cameraOffsetX {number} X offset of bound to the camera.
         * @param cameraOffsetY {number} Y offset of bound to the camera.
         */
        private renderBounds(camera:Camera, cameraOffsetX:number, cameraOffsetY:number) {

            this._dx = cameraOffsetX + (this.bounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.topLeft.y - camera.worldView.y);

            this.context.fillStyle = this.renderDebugColor;
            this.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            this.context.fillStyle = this.renderDebugPointColor;

            var hw = this.bounds.halfWidth * this.scale.x;
            var hh = this.bounds.halfHeight * this.scale.y;
            var sw = (this.bounds.width * this.scale.x) - 1;
            var sh = (this.bounds.height * this.scale.y) - 1;

            this.context.fillRect(this._dx, this._dy, 1, 1);            //  top left
            this.context.fillRect(this._dx + hw, this._dy, 1, 1);       //  top center
            this.context.fillRect(this._dx + sw, this._dy, 1, 1);       //  top right
            this.context.fillRect(this._dx, this._dy + hh, 1, 1);       //  left center
            this.context.fillRect(this._dx + hw, this._dy + hh, 1, 1);  //  center
            this.context.fillRect(this._dx + sw, this._dy + hh, 1, 1);  //  right center
            this.context.fillRect(this._dx, this._dy + sh, 1, 1);       //  bottom left
            this.context.fillRect(this._dx + hw, this._dy + sh, 1, 1);  //  bottom center
            this.context.fillRect(this._dx + sw, this._dy + sh, 1, 1);  //  bottom right

        }

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            this.context.fillStyle = color;
            this.context.fillText('Sprite: ' + this.name + ' (' + this.bounds.width + ' x ' + this.bounds.height + ')', x, y);
            this.context.fillText('x: ' + this.bounds.x.toFixed(1) + ' y: ' + this.bounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
            this.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            this.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);

        }

    }

}