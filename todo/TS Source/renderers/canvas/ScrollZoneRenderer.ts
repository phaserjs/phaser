/// <reference path="../../_definitions.ts" />

module Phaser.Renderer.Canvas {

    export class ScrollZoneRenderer {

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        /**
         * The essential reference to the main game object
         */
        public game: Phaser.Game;

        //  Local rendering related temp vars to help avoid gc spikes through constant var creation
        private _ga: number = 1;
        private _sx: number = 0;
        private _sy: number = 0;
        private _sw: number = 0;
        private _sh: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;
        private _fx: number = 1;
        private _fy: number = 1;
        private _sin: number = 0;
        private _cos: number = 1;

        /**
         * Check whether this object is visible in a specific camera Rectangle.
         * @param camera {Rectangle} The Rectangle you want to check.
         * @return {bool} Return true if bounds of this sprite intersects the given Rectangle, otherwise return false.
         */
        public inCamera(camera: Phaser.Camera, scrollZone: Phaser.ScrollZone): bool {

            //  Object fixed in place regardless of the camera scrolling? Then it's always visible
            if (scrollZone.transform.scrollFactor.equals(0))
            {
                return true;
            }

            //return RectangleUtils.intersects(sprite.cameraView, camera.screenView);
            return true;

        }

        public render(camera: Phaser.Camera, scrollZone: Phaser.ScrollZone): bool {

            if (scrollZone.transform.scale.x == 0 || scrollZone.transform.scale.y == 0 || scrollZone.texture.alpha < 0.1 || this.inCamera(camera, scrollZone) == false)
            {
                return false;
            }

            //  Reset our temp vars
            this._ga = -1;
            this._sx = 0;
            this._sy = 0;
            this._sw = scrollZone.width;
            this._sh = scrollZone.height;
            this._fx = scrollZone.transform.scale.x;
            this._fy = scrollZone.transform.scale.y;
            this._sin = 0;
            this._cos = 1;
            this._dx = (camera.screenView.x * scrollZone.transform.scrollFactor.x) + scrollZone.x - (camera.worldView.x * scrollZone.transform.scrollFactor.x);
            this._dy = (camera.screenView.y * scrollZone.transform.scrollFactor.y) + scrollZone.y - (camera.worldView.y * scrollZone.transform.scrollFactor.y);
            this._dw = scrollZone.width;
            this._dh = scrollZone.height;

            //  Alpha
            if (scrollZone.texture.alpha !== 1)
            {
                this._ga = scrollZone.texture.context.globalAlpha;
                scrollZone.texture.context.globalAlpha = scrollZone.texture.alpha;
            }

            //  Sprite Flip X
            if (scrollZone.texture.flippedX)
            {
                this._fx = -scrollZone.transform.scale.x;
            }

            //  Sprite Flip Y
            if (scrollZone.texture.flippedY)
            {
                this._fy = -scrollZone.transform.scale.y;
            }

            //	Rotation and Flipped
            if (scrollZone.modified)
            {
                if (scrollZone.texture.renderRotation == true && (scrollZone.rotation !== 0 || scrollZone.transform.rotationOffset !== 0))
                {
                    this._sin = Math.sin(scrollZone.game.math.degreesToRadians(scrollZone.transform.rotationOffset + scrollZone.rotation));
                    this._cos = Math.cos(scrollZone.game.math.degreesToRadians(scrollZone.transform.rotationOffset + scrollZone.rotation));
                }

                scrollZone.texture.context.save();

                scrollZone.texture.context.setTransform(
                    this._cos * this._fx,                                   //  scale x
                    (this._sin * this._fx) + scrollZone.transform.skew.x,   //  skew x
                    -(this._sin * this._fy) + scrollZone.transform.skew.y,  //  skew y
                    this._cos * this._fy,                                   //  scale y
                    this._dx,                                               //  translate x
                    this._dy                                                //  translate y
                    );

                this._dx = -scrollZone.transform.origin.x;
                this._dy = -scrollZone.transform.origin.y;
            }
            else
            {
                if (!scrollZone.transform.origin.equals(0))
                {
                    this._dx -= scrollZone.transform.origin.x;
                    this._dy -= scrollZone.transform.origin.y;
                }
            }

            this._sx = Math.floor(this._sx);
            this._sy = Math.floor(this._sy);
            this._sw = Math.floor(this._sw);
            this._sh = Math.floor(this._sh);
            this._dx = Math.floor(this._dx);
            this._dy = Math.floor(this._dy);
            this._dw = Math.floor(this._dw);
            this._dh = Math.floor(this._dh);

            for (var i = 0; i < scrollZone.regions.length; i++)
            {
                if (scrollZone.texture.isDynamic)
                {
                    scrollZone.regions[i].render(scrollZone.texture.context, scrollZone.texture.texture, this._dx, this._dy, this._dw, this._dh);
                }
                else
                {
                    scrollZone.regions[i].render(scrollZone.texture.context, scrollZone.texture.texture, this._dx, this._dy, this._dw, this._dh);
                }
            }

            if (scrollZone.modified)
            {
                scrollZone.texture.context.restore();
            }

            if (this._ga > -1)
            {
                scrollZone.texture.context.globalAlpha = this._ga;
            }

            this.game.renderer.renderCount++;

            return true;

        }

    }

}