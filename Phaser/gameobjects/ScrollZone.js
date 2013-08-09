/// <reference path="../_definitions.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Phaser - ScrollZone
*
* Creates a scrolling region of the given width and height from an image in the cache.
* The ScrollZone can be positioned anywhere in-world like a normal game object, re-act to physics, collision, etc.
* The image within it is scrolled via ScrollRegions and their scrollSpeed.x/y properties.
* If you create a scroll zone larger than the given source image it will create a DynamicTexture and fill it with a pattern of the source image.
*/
var Phaser;
(function (Phaser) {
    var ScrollZone = (function (_super) {
        __extends(ScrollZone, _super);
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
        function ScrollZone(game, key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            _super.call(this, game, x, y, key);

            this.type = Phaser.Types.SCROLLZONE;

            this.regions = [];

            if (this.texture.loaded) {
                if (width > this.width || height > this.height) {
                    //  Create our repeating texture (as the source image wasn't large enough for the requested size)
                    this.createRepeatingTexture(width, height);
                    this.width = width;
                    this.height = height;
                }

                //  Create a default ScrollRegion at the requested size
                this.addRegion(0, 0, this.width, this.height);

                if ((width < this.width || height < this.height) && width !== 0 && height !== 0) {
                    this.width = width;
                    this.height = height;
                }
            }
        }
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
        ScrollZone.prototype.addRegion = function (x, y, width, height, speedX, speedY) {
            if (typeof speedX === "undefined") { speedX = 0; }
            if (typeof speedY === "undefined") { speedY = 0; }
            if (x > this.width || y > this.height || x < 0 || y < 0 || (x + width) > this.width || (y + height) > this.height) {
                throw Error('Invalid ScrollRegion defined. Cannot be larger than parent ScrollZone');
                return null;
            }

            this.currentRegion = new Phaser.ScrollRegion(x, y, width, height, speedX, speedY);

            this.regions.push(this.currentRegion);

            return this.currentRegion;
        };

        /**
        * Set scrolling speed of current region.
        * @param x {number} X speed of current region.
        * @param y {number} Y speed of current region.
        */
        ScrollZone.prototype.setSpeed = function (x, y) {
            if (this.currentRegion) {
                this.currentRegion.scrollSpeed.setTo(x, y);
            }

            return this;
        };

        /**
        * Update regions.
        */
        ScrollZone.prototype.update = function () {
            for (var i = 0; i < this.regions.length; i++) {
                this.regions[i].update(this.game.time.delta);
            }
        };

        /**
        * Create repeating texture with _texture, and store it into the _dynamicTexture.
        * Used to create texture when texture image is small than size of the zone.
        */
        ScrollZone.prototype.createRepeatingTexture = function (regionWidth, regionHeight) {
            //	Work out how many we'll need of the source image to make it tile properly
            var tileWidth = Math.ceil(this.width / regionWidth) * regionWidth;
            var tileHeight = Math.ceil(this.height / regionHeight) * regionHeight;

            var dt = new Phaser.Display.DynamicTexture(this.game, tileWidth, tileHeight);

            dt.context.rect(0, 0, tileWidth, tileHeight);
            dt.context.fillStyle = dt.context.createPattern(this.texture.imageTexture, "repeat");
            dt.context.fill();

            this.texture.loadDynamicTexture(dt);
        };
        return ScrollZone;
    })(Phaser.Sprite);
    Phaser.ScrollZone = ScrollZone;
})(Phaser || (Phaser = {}));
