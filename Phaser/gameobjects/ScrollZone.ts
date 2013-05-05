/// <reference path="../Game.ts" />
/// <reference path="../geom/Quad.ts" />
/// <reference path="ScrollRegion.ts" />

/**
* Phaser - ScrollZone
*
* Creates a scrolling region of the given width and height from an image in the cache.
* The ScrollZone can be positioned anywhere in-world like a normal game object, re-act to physics, collision, etc.
* The image within it is scrolled via ScrollRegions and their scrollSpeed.x/y properties.
* If you create a scroll zone larger than the given source image it will create a DynamicTexture and fill it with a pattern of the source image.
*/

module Phaser {

    export class ScrollZone extends GameObject {

        /**
         * ScrollZone constructor
         * Create a new <code>ScrollZone</code>.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param key {string} Asset key for image texture of this object.
         * @param x {number} X position in world coordinate.
         * @param y {number} Y position in world coordinate.
         * @param [width] {number} width of this object.
         * @param [height] {number} height of this object.
         */
        constructor(game: Game, key:string, x: number = 0, y: number = 0, width?: number = 0, height?: number = 0) {

            super(game, x, y, width, height);

            this.regions = [];

            if (this._game.cache.getImage(key))
            {
                this._texture = this._game.cache.getImage(key);
                this.width = this._texture.width;
                this.height = this._texture.height;

                if (width > this._texture.width || height > this._texture.height)
                {
                    //  Create our repeating texture (as the source image wasn't large enough for the requested size)
                    this.createRepeatingTexture(width, height);
                    this.width = width;
                    this.height = height;
                }

                //  Create a default ScrollRegion at the requested size
                this.addRegion(0, 0, this.width, this.height);

                //  If the zone is smaller than the image itself then shrink the bounds
                if ((width < this._texture.width || height < this._texture.height) && width !== 0 && height !== 0)
                {
                    this.width = width;
                    this.height = height;
                }

            }

        }

        /**
         * Texture of this object.
         */
        private _texture;
        /**
         * If this zone is larger than texture image, this will be filled with a pattern of texture.
         * @type {DynamicTexture}
         */
        private _dynamicTexture: DynamicTexture = null;

        /**
         * Local rendering related temp vars to help avoid gc spikes.
         * @type {number}
         */
        private _dx: number = 0;
        /**
         * Local rendering related temp vars to help avoid gc spikes.
         * @type {number}
         */
        private _dy: number = 0;
        /**
         * Local rendering related temp vars to help avoid gc spikes.
         * @type {number}
         */
        private _dw: number = 0;
        /**
         * Local rendering related temp vars to help avoid gc spikes.
         * @type {number}
         */
        private _dh: number = 0;

        /**
         * Current region this zone is scrolling.
         * @type {ScrollRegion}
         */
        public currentRegion: ScrollRegion;
        /**
         * Array contains all added regions.
         * @type {ScrollRegion[]}
         */
        public regions: ScrollRegion[];
        /**
         * Flip this zone vertically? (default to false)
         * @type {boolean}
         */
        public flipped: bool = false;

        /**
         * Add a new region to this zone.
         * @param x {number} X position of the new region.
         * @param y {number} Y position of the new region.
         * @param width {number} Width of the new region.
         * @param height {number} Height of the new region.
         * @param [speedX] {number} x-axis scrolling speed.
         * @param [speedY] {number} y-axis scrolling speed.
         * @return {ScrollRegion} The newly added region.
         */
        public addRegion(x: number, y: number, width: number, height: number, speedX?:number = 0, speedY?:number = 0):ScrollRegion {

            if (x > this.width || y > this.height || x < 0 || y < 0 || (x + width) > this.width || (y + height) > this.height)
            {
                throw Error('Invalid ScrollRegion defined. Cannot be larger than parent ScrollZone');
                return;
            }

            this.currentRegion = new ScrollRegion(x, y, width, height, speedX, speedY);

            this.regions.push(this.currentRegion);

            return this.currentRegion;

        }

        /**
         * Set scrolling speed of current region.
         * @param x {number} X speed of current region.
         * @param y {number} Y speed of current region.
         */
        public setSpeed(x: number, y: number) {

            if (this.currentRegion)
            {
                this.currentRegion.scrollSpeed.setTo(x, y);
            }

            return this;

        }

        /**
         * Update regions.
         */
        public update() {

            for (var i = 0; i < this.regions.length; i++)
            {
                this.regions[i].update(this._game.time.delta);
            }

        }

        /**
         * Check whether this zone is visible in a specific camera rectangle.
         * @param camera {Rectangle} The rectangle you want to check.
         * @return {boolean} Return true if bound of this zone intersects the given rectangle, otherwise return false.
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
         * Render this zone object to a specific camera.
         * @param camera {Camera} The camera this object will be render to.
         * @param cameraOffsetX {number} X offset of camera.
         * @param cameraOffsetY {number} Y offset of camera.
         * @return Return false if not rendered, otherwise return true.
         */
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number) {

            //  Render checks
            if (this.visible == false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false)
            {
                return false;
            }

            //  Alpha
            if (this.alpha !== 1)
            {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }

            this._dx = cameraOffsetX + (this.bounds.topLeft.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.topLeft.y - camera.worldView.y);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;

            //	Apply camera difference
            if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
            {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }

            //	Rotation - needs to work from origin point really, but for now from center
            if (this.angle !== 0 || this.flipped == true)
            {
                this._game.stage.context.save();
                this._game.stage.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));

                if (this.angle !== 0)
                {
                    this._game.stage.context.rotate(this.angle * (Math.PI / 180));
                }

                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);

                if (this.flipped == true)
                {
                	this._game.stage.context.scale(-1, 1);
                }
            }

            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);

            for (var i = 0; i < this.regions.length; i++)
            {
                if (this._dynamicTexture)
                {
                    this.regions[i].render(this._game.stage.context, this._dynamicTexture.canvas, this._dx, this._dy, this._dw, this._dh);
                }
                else
                {
                    this.regions[i].render(this._game.stage.context, this._texture, this._dx, this._dy, this._dw, this._dh);
                }
            }

            if (globalAlpha > -1)
            {
                this._game.stage.context.globalAlpha = globalAlpha;
            }

            return true;

        }

        /**
         * Create repeating texture with _texture, and store it into the _dynamicTexture.
         * Used to create texture when texture image is small than size of the zone.
         */
        private createRepeatingTexture(regionWidth: number, regionHeight: number) {

            //	Work out how many we'll need of the source image to make it tile properly
            var tileWidth = Math.ceil(this._texture.width / regionWidth) * regionWidth;
            var tileHeight = Math.ceil(this._texture.height / regionHeight) * regionHeight;

            this._dynamicTexture = new DynamicTexture(this._game, tileWidth, tileHeight);

            this._dynamicTexture.context.rect(0, 0, tileWidth, tileHeight);
            this._dynamicTexture.context.fillStyle = this._dynamicTexture.context.createPattern(this._texture, "repeat");
            this._dynamicTexture.context.fill();

        }

    }

}
