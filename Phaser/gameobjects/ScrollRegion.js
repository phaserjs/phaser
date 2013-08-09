/// <reference path="../_definitions.ts" />
/**
* Phaser - ScrollRegion
*
* Creates a scrolling region within a ScrollZone.
* It is scrolled via the scrollSpeed.x/y properties.
*/
var Phaser;
(function (Phaser) {
    var ScrollRegion = (function () {
        /**
        * ScrollRegion constructor
        * Create a new <code>ScrollRegion</code>.
        *
        * @param x {number} X position in world coordinate.
        * @param y {number} Y position in world coordinate.
        * @param width {number} Width of this object.
        * @param height {number} Height of this object.
        * @param speedX {number} X-axis scrolling speed.
        * @param speedY {number} Y-axis scrolling speed.
        */
        function ScrollRegion(x, y, width, height, speedX, speedY) {
            this._anchorWidth = 0;
            this._anchorHeight = 0;
            this._inverseWidth = 0;
            this._inverseHeight = 0;
            /**
            * Will this region be rendered? (default to true)
            * @type {boolean}
            */
            this.visible = true;
            //	Our seamless scrolling quads
            this._A = new Phaser.Rectangle(x, y, width, height);
            this._B = new Phaser.Rectangle(x, y, width, height);
            this._C = new Phaser.Rectangle(x, y, width, height);
            this._D = new Phaser.Rectangle(x, y, width, height);
            this._scroll = new Phaser.Vec2();
            this._bounds = new Phaser.Rectangle(x, y, width, height);
            this.scrollSpeed = new Phaser.Vec2(speedX, speedY);
        }
        /**
        * Update region scrolling with tick time.
        * @param delta {number} Elapsed time since last update.
        */
        ScrollRegion.prototype.update = function (delta) {
            this._scroll.x += this.scrollSpeed.x;
            this._scroll.y += this.scrollSpeed.y;

            if (this._scroll.x > this._bounds.right) {
                this._scroll.x = this._bounds.x;
            }

            if (this._scroll.x < this._bounds.x) {
                this._scroll.x = this._bounds.right;
            }

            if (this._scroll.y > this._bounds.bottom) {
                this._scroll.y = this._bounds.y;
            }

            if (this._scroll.y < this._bounds.y) {
                this._scroll.y = this._bounds.bottom;
            }

            //	Anchor Dimensions
            this._anchorWidth = (this._bounds.width - this._scroll.x) + this._bounds.x;
            this._anchorHeight = (this._bounds.height - this._scroll.y) + this._bounds.y;

            if (this._anchorWidth > this._bounds.width) {
                this._anchorWidth = this._bounds.width;
            }

            if (this._anchorHeight > this._bounds.height) {
                this._anchorHeight = this._bounds.height;
            }

            this._inverseWidth = this._bounds.width - this._anchorWidth;
            this._inverseHeight = this._bounds.height - this._anchorHeight;

            //	Rectangle A
            this._A.setTo(this._scroll.x, this._scroll.y, this._anchorWidth, this._anchorHeight);

            //	Rectangle B
            this._B.y = this._scroll.y;
            this._B.width = this._inverseWidth;
            this._B.height = this._anchorHeight;

            //	Rectangle C
            this._C.x = this._scroll.x;
            this._C.width = this._anchorWidth;
            this._C.height = this._inverseHeight;

            //	Rectangle D
            this._D.width = this._inverseWidth;
            this._D.height = this._inverseHeight;
        };

        /**
        * Render this region to specific context.
        * @param context {CanvasRenderingContext2D} Canvas context this region will be rendered to.
        * @param texture {object} The texture to be rendered.
        * @param dx {number} X position in world coordinate.
        * @param dy {number} Y position in world coordinate.
        * @param width {number} Width of this region to be rendered.
        * @param height {number} Height of this region to be rendered.
        */
        ScrollRegion.prototype.render = function (context, texture, dx, dy, dw, dh) {
            if (this.visible == false) {
                return;
            }

            //  dx/dy are the world coordinates to render the FULL ScrollZone into.
            //  This ScrollRegion may be smaller than that and offset from the dx/dy coordinates.
            this.crop(context, texture, this._A.x, this._A.y, this._A.width, this._A.height, dx, dy, dw, dh, 0, 0);
            this.crop(context, texture, this._B.x, this._B.y, this._B.width, this._B.height, dx, dy, dw, dh, this._A.width, 0);
            this.crop(context, texture, this._C.x, this._C.y, this._C.width, this._C.height, dx, dy, dw, dh, 0, this._A.height);
            this.crop(context, texture, this._D.x, this._D.y, this._D.width, this._D.height, dx, dy, dw, dh, this._C.width, this._A.height);
            //context.fillStyle = 'rgb(255,255,255)';
            //context.font = '18px Arial';
            //context.fillText('RectangleA: ' + this._A.toString(), 32, 450);
            //context.fillText('RectangleB: ' + this._B.toString(), 32, 480);
            //context.fillText('RectangleC: ' + this._C.toString(), 32, 510);
            //context.fillText('RectangleD: ' + this._D.toString(), 32, 540);
        };

        /**
        * Crop part of the texture and render it to the given context.
        * @param context {CanvasRenderingContext2D} Canvas context the texture will be rendered to.
        * @param texture {object} Texture to be rendered.
        * @param srcX {number} Target region top-left x coordinate in the texture.
        * @param srcX {number} Target region top-left y coordinate in the texture.
        * @param srcW {number} Target region width in the texture.
        * @param srcH {number} Target region height in the texture.
        * @param destX {number} Render region top-left x coordinate in the context.
        * @param destX {number} Render region top-left y coordinate in the context.
        * @param destW {number} Target region width in the context.
        * @param destH {number} Target region height in the context.
        * @param offsetX {number} X offset to the context.
        * @param offsetY {number} Y offset to the context.
        */
        ScrollRegion.prototype.crop = function (context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY) {
            offsetX += destX;
            offsetY += destY;

            if (srcW > (destX + destW) - offsetX) {
                srcW = (destX + destW) - offsetX;
            }

            if (srcH > (destY + destH) - offsetY) {
                srcH = (destY + destH) - offsetY;
            }

            srcX = Math.floor(srcX);
            srcY = Math.floor(srcY);
            srcW = Math.floor(srcW);
            srcH = Math.floor(srcH);
            offsetX = Math.floor(offsetX + this._bounds.x);
            offsetY = Math.floor(offsetY + this._bounds.y);

            if (srcW > 0 && srcH > 0) {
                context.drawImage(texture, srcX, srcY, srcW, srcH, offsetX, offsetY, srcW, srcH);
            }
        };
        return ScrollRegion;
    })();
    Phaser.ScrollRegion = ScrollRegion;
})(Phaser || (Phaser = {}));
