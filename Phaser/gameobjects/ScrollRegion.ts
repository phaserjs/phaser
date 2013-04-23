/// <reference path="../Game.ts" />
/// <reference path="../geom/Quad.ts" />

/**
* Phaser - ScrollRegion
*
* Creates a scrolling region within a ScrollZone.
* It is scrolled via the scrollSpeed.x/y properties.
*/

module Phaser {

    export class ScrollRegion{

        constructor(x: number, y: number, width: number, height: number, speedX:number, speedY:number) {

	        //	Our seamless scrolling quads
            this._A = new Quad(x, y, width, height);
            this._B = new Quad(x, y, width, height);
	        this._C = new Quad(x, y, width, height);
	        this._D = new Quad(x, y, width, height);
            this._scroll = new MicroPoint();
            this._bounds = new Quad(x, y, width, height);
            this.scrollSpeed = new MicroPoint(speedX, speedY);

        }

        private _A: Quad;
        private _B: Quad;
        private _C: Quad;
        private _D: Quad;

        private _bounds: Quad;
        private _scroll: MicroPoint;

        private _anchorWidth: number = 0;
        private _anchorHeight: number = 0;
        private _inverseWidth: number = 0;
        private _inverseHeight: number = 0;

        public visible: bool = true;
        public scrollSpeed: MicroPoint;

        public update(delta: number) {

		    this._scroll.x += this.scrollSpeed.x;
		    this._scroll.y += this.scrollSpeed.y;

		    if (this._scroll.x > this._bounds.right)
		    {
			    this._scroll.x = this._bounds.x;
		    }

		    if (this._scroll.x < this._bounds.x)
		    {
			    this._scroll.x = this._bounds.right;
		    }

		    if (this._scroll.y > this._bounds.bottom)
		    {
			    this._scroll.y = this._bounds.y;
		    }

		    if (this._scroll.y < this._bounds.y)
		    {
			    this._scroll.y = this._bounds.bottom;
		    }

		    //	Anchor Dimensions
		    this._anchorWidth = (this._bounds.width - this._scroll.x) + this._bounds.x;
		    this._anchorHeight = (this._bounds.height - this._scroll.y) + this._bounds.y;

		    if (this._anchorWidth > this._bounds.width)
		    {
			    this._anchorWidth = this._bounds.width;
		    }

		    if (this._anchorHeight > this._bounds.height)
		    {
			    this._anchorHeight = this._bounds.height;
		    }

		    this._inverseWidth = this._bounds.width - this._anchorWidth;
            this._inverseHeight = this._bounds.height - this._anchorHeight;

		    //	Quad A
		    this._A.setTo(this._scroll.x, this._scroll.y, this._anchorWidth, this._anchorHeight);

		    //	Quad B
		    this._B.y = this._scroll.y;
		    this._B.width = this._inverseWidth;
		    this._B.height = this._anchorHeight;

		    //	Quad C
		    this._C.x = this._scroll.x;
		    this._C.width = this._anchorWidth;
		    this._C.height = this._inverseHeight;

		    //	Quad D
		    this._D.width = this._inverseWidth;
		    this._D.height = this._inverseHeight;

        }

        public render(context:CanvasRenderingContext2D, texture, dx: number, dy: number, dw: number, dh: number) {

            if (this.visible == false)
            {
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
            //context.fillText('QuadA: ' + this._A.toString(), 32, 450);
            //context.fillText('QuadB: ' + this._B.toString(), 32, 480);
            //context.fillText('QuadC: ' + this._C.toString(), 32, 510);
            //context.fillText('QuadD: ' + this._D.toString(), 32, 540);

        }

        private crop(context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY) {

            offsetX += destX;
            offsetY += destY;

            if (srcW > (destX + destW) - offsetX)
            {
                srcW = (destX + destW) - offsetX;
            }

            if (srcH > (destY + destH) - offsetY)
            {
                srcH = (destY + destH) - offsetY;
            }

            srcX = Math.floor(srcX);
            srcY = Math.floor(srcY);
            srcW = Math.floor(srcW);
            srcH = Math.floor(srcH);
            offsetX = Math.floor(offsetX + this._bounds.x);
            offsetY = Math.floor(offsetY + this._bounds.y);

            if (srcW > 0 && srcH > 0)
            {
                context.drawImage(texture, srcX, srcY, srcW, srcH, offsetX, offsetY, srcW, srcH);
            }
        }

    }

}
