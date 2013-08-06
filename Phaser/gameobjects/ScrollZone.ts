/// <reference path="../Game.ts" />
/// <reference path="../geom/Rectangle.ts" />
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

    export class ScrollZone extends Sprite {

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

            super(game, x, y, key);

            this.type = Phaser.Types.SCROLLZONE;

            this.regions = [];

            if (this.texture.loaded)
            {
                if (width > this.width || height > this.height)
                {
                    //  Create our repeating texture (as the source image wasn't large enough for the requested size)
                    this.createRepeatingTexture(width, height);
                    this.width = width;
                    this.height = height;
                }

                //  Create a default ScrollRegion at the requested size
                this.addRegion(0, 0, this.width, this.height);

                //  If the zone is smaller than the image itself then shrink the bounds
                if ((width < this.width || height < this.height) && width !== 0 && height !== 0)
                {
                    this.width = width;
                    this.height = height;
                }

            }

        }

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
                return null;
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
                this.regions[i].update(this.game.time.delta);
            }

        }

        /**
         * Create repeating texture with _texture, and store it into the _dynamicTexture.
         * Used to create texture when texture image is small than size of the zone.
         */
        private createRepeatingTexture(regionWidth: number, regionHeight: number) {

            //	Work out how many we'll need of the source image to make it tile properly
            var tileWidth = Math.ceil(this.width / regionWidth) * regionWidth;
            var tileHeight = Math.ceil(this.height / regionHeight) * regionHeight;

            var dt: DynamicTexture = new DynamicTexture(this.game, tileWidth, tileHeight);

            dt.context.rect(0, 0, tileWidth, tileHeight);
            dt.context.fillStyle = dt.context.createPattern(this.texture.imageTexture, "repeat");
            dt.context.fill();

            this.texture.loadDynamicTexture(dt);

        }

    }

}
