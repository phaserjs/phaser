/// <reference path="../Game.ts" />
/// <reference path="../geom/Quad.ts" />

/**
* Phaser - ScrollZone
*
* Creates a scrolling region of the given width and height from an image in the cache.
* The ScrollZone can be positioned anywhere in-world like a normal game object.
* The image within it is scrolled via the scrollSpeed.x/y properties.
* If you create a scroll zone larger than the given source image it will create a DynamicTexture and fill it with a pattern of the source image.
*/

module Phaser {

    export class ScrollZone extends GameObject {

        /**
         * 
         */
        constructor(game: Game, key:string, x: number, y: number, width: number, height: number) {

            super(game, x, y, width, height);

	        //	Our seamless scrolling quads
            this._A = new Quad(0, 0, width, height);
            this._B = new Quad();
	        this._C = new Quad();
	        this._D = new Quad();

            this._scroll = new MicroPoint();

            this.offset = new MicroPoint();
            this.scrollSpeed = new MicroPoint();

            if (this._game.cache.getImage(key))
            {
                this._texture = this._game.cache.getImage(key);
                this.bounds.width = width;
                this.bounds.height = height;
                this._sourceWidth = this._texture.width;
                this._sourceHeight = this._texture.height;

	            // If the Scrolling Zone is BIGGER than the texture then we need to create a repeating pattern DynamicTexture
	            if (this._texture.width < width || this._texture.height < height)
	            {
	                this.createRepeatingTexture();
	            }
            }

        }

        private _texture;
        private _dynamicTexture: DynamicTexture = null;

        private _A: Quad;
        private _B: Quad;
        private _C: Quad;
        private _D: Quad;

        private _scroll: MicroPoint;
        private _sourceWidth: number;
        private _sourceHeight: number;

        //  local rendering related temp vars to help avoid gc spikes
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;
        private _anchorWidth: number = 0;
        private _anchorHeight: number = 0;
        private _inverseWidth: number = 0;
        private _inverseHeight: number = 0;

        public scrollSpeed: MicroPoint;
        public offset: MicroPoint;

        public flipped: bool = false;

        public update() {

		    this._scroll.x = Math.round(this._scroll.x + this.scrollSpeed.x);
		    this._scroll.y = Math.round(this._scroll.y + this.scrollSpeed.y);

		    if (this._scroll.x > this._sourceWidth)
		    {
			    this._scroll.x = 0;
		    }

		    if (this._scroll.x < 0)
		    {
			    this._scroll.x = this._sourceWidth;
		    }

		    if (this._scroll.y > this._sourceHeight)
		    {
			    this._scroll.y = 0;
		    }

		    if (this._scroll.y < 0)
		    {
			    this._scroll.y = this._sourceHeight;
		    }

		    //	Anchor Dimensions
		    this._anchorWidth = this._sourceWidth - this._scroll.x;
		    this._anchorHeight = this._sourceHeight - this._scroll.y;

		    if (this._anchorWidth > this.width)
		    {
			    this._anchorWidth = this.width;
		    }

		    if (this._anchorHeight > this.height)
		    {
			    this._anchorHeight = this.height;
		    }

		    this._inverseWidth = this.width - this._anchorWidth;
		    this._inverseHeight = this.height - this._anchorHeight;

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

        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number) {

            //  Render checks
            if (this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.inCamera(camera.worldView) == false)
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

            if (this._dynamicTexture)
            {
		        if (this._A.width !== 0 && this._A.height !== 0)
		        {
    	            this._game.stage.context.drawImage(this._dynamicTexture.canvas, this._A.x, this._A.y, this._A.width, this._A.height, this._dx, this._dy, this._A.width, this._A.height);
		        }

		        if (this._B.width !== 0 && this._B.height !== 0)
		        {
			        this._game.stage.context.drawImage(this._dynamicTexture.canvas, this._B.x, this._B.y, this._B.width, this._B.height, this._dx + this._A.width, this._dy, this._B.width, this._B.height);
		        }

		        if (this._C.width !== 0 && this._C.height !== 0)
		        {
			        this._game.stage.context.drawImage(this._dynamicTexture.canvas, this._C.x, this._C.y, this._C.width, this._C.height, this._dx, this._dy + this._A.height, this._C.width, this._C.height);
		        }

		        if (this._D.width !== 0 && this._D.height !== 0)
		        {
			        this._game.stage.context.drawImage(this._dynamicTexture.canvas, this._D.x, this._D.y, this._D.width, this._D.height, this._dx + this._C.width, this._dy + this._A.height, this._D.width, this._D.height);
		        }
            }
            else
            {
		        if (this._A.width !== 0 && this._A.height !== 0)
		        {
    	            this._game.stage.context.drawImage(this._texture, this._A.x, this._A.y, this._A.width, this._A.height, this._dx, this._dy, this._A.width, this._A.height);
		        }

		        if (this._B.width !== 0 && this._B.height !== 0)
		        {
			        this._game.stage.context.drawImage(this._texture, this._B.x, this._B.y, this._B.width, this._B.height, this._dx + this._A.width, this._dy, this._B.width, this._B.height);
		        }

		        if (this._C.width !== 0 && this._C.height !== 0)
		        {
			        this._game.stage.context.drawImage(this._texture, this._C.x, this._C.y, this._C.width, this._C.height, this._dx, this._dy + this._A.height, this._C.width, this._C.height);
		        }

		        if (this._D.width !== 0 && this._D.height !== 0)
		        {
			        this._game.stage.context.drawImage(this._texture, this._D.x, this._D.y, this._D.width, this._D.height, this._dx + this._C.width, this._dy + this._A.height, this._D.width, this._D.height);
		        }
            }

            if (globalAlpha > -1)
            {
                this._game.stage.context.globalAlpha = globalAlpha;
            }

            return true;

        }

        private createRepeatingTexture() {

            //	Work out how many we'll need of the source image to make it tile properly
            var tileWidth = Math.ceil(this.width / this._sourceWidth) * this._sourceWidth;
            var tileHeight = Math.ceil(this.height / this._sourceHeight) * this._sourceHeight;

            this._dynamicTexture = new DynamicTexture(this._game, tileWidth, tileHeight);

            this._dynamicTexture.context.rect(0, 0, tileWidth, tileHeight);
            this._dynamicTexture.context.fillStyle = this._dynamicTexture.context.createPattern(this._texture, "repeat");
            this._dynamicTexture.context.fill();

            this._sourceWidth = tileWidth;
            this._sourceHeight = tileHeight;

        }

    }

}
