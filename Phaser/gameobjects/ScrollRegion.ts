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
            this._A = new Quad(0, 0, width, height);
            this._B = new Quad();
	        this._C = new Quad();
	        this._D = new Quad();

            this._scroll = new MicroPoint();
            this._offset = new MicroPoint(x, y);

            this.scrollSpeed = new MicroPoint(speedX, speedY);
            this.bounds = new Quad(0, 0, width, height);

        }

        private _A: Quad;
        private _B: Quad;
        private _C: Quad;
        private _D: Quad;

        private _scroll: MicroPoint;
        private _offset: MicroPoint;

        private _anchorWidth: number = 0;
        private _anchorHeight: number = 0;
        private _inverseWidth: number = 0;
        private _inverseHeight: number = 0;

        public bounds: Quad;
        public visible: bool = true;
        public scrollSpeed: MicroPoint;

        public update(delta: number) {

		    this._scroll.x = Math.round(this._scroll.x + (this.scrollSpeed.x));
		    this._scroll.y = Math.round(this._scroll.y + (this.scrollSpeed.y));

		    if (this._scroll.x > this._offset.x + this.bounds.width)
		    {
			    this._scroll.x = this._offset.x;
		    }

		    if (this._scroll.x < this._offset.x)
		    {
			    this._scroll.x = this._offset.x + this.bounds.width;
		    }

		    if (this._scroll.y > this._offset.y + this.bounds.height)
		    {
			    this._scroll.y = this._offset.y;
		    }

		    if (this._scroll.y < this._offset.y)
		    {
			    this._scroll.y = this._offset.y + this.bounds.height;
		    }

		    //	Anchor Dimensions
		    this._anchorWidth = this.bounds.width - this._scroll.x;
		    this._anchorHeight = this.bounds.height - this._scroll.y;

		    if (this._anchorWidth > this.bounds.width)
		    {
			    this._anchorWidth = this.bounds.width;
		    }

		    if (this._anchorHeight > this.bounds.height)
		    {
			    this._anchorHeight = this.bounds.height;
		    }

		    this._inverseWidth = this.bounds.width - this._anchorWidth;
            this._inverseHeight = this.bounds.height - this._anchorHeight;

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

            this.crop(context, texture, this._A.x, this._A.y, this._A.width, this._A.height, dx, dy, dw, dh, 0, 0);
            this.crop(context, texture, this._B.x, this._B.y, this._B.width, this._B.height, dx, dy, dw, dh, this._A.width, 0);
            this.crop(context, texture, this._C.x, this._C.y, this._C.width, this._C.height, dx, dy, dw, dh, 0, this._A.height);
            this.crop(context, texture, this._D.x, this._D.y, this._D.width, this._D.height, dx, dy, dw, dh, this._C.width, this._A.height);

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

            if (srcW > 0 && srcH > 0)
            {
                context.drawImage(texture, srcX, srcY, srcW, srcH, offsetX, offsetY, srcW, srcH);
            }
        }

    }

}
