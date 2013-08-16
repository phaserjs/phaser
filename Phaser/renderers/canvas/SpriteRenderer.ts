/// <reference path="../../_definitions.ts" />

module Phaser.Renderer.Canvas {

    export class SpriteRenderer {

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        /**
         * The essential reference to the main game object
         */
        public game: Phaser.Game;

        //  Local rendering related temp vars to help avoid gc spikes through constant var creation
        //private _c: number = 0;
        private _ga: number = 1;
        private _sx: number = 0;
        private _sy: number = 0;
        private _sw: number = 0;
        private _sh: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;

        /**
         * Check whether this object is visible in a specific camera Rectangle.
         * @param camera {Rectangle} The Rectangle you want to check.
         * @return {bool} Return true if bounds of this sprite intersects the given Rectangle, otherwise return false.
         */
        public inCamera(camera: Phaser.Camera, sprite: Phaser.Sprite): bool {

            //  Object fixed in place regardless of the camera scrolling? Then it's always visible
            if (sprite.transform.scrollFactor.equals(0))
            {
                return true;
            }

            return RectangleUtils.intersects(sprite.cameraView, camera.screenView);
            //return true;

        }

        /**
         * Render this sprite to specific camera. Called by game loop after update().
         * @param camera {Camera} Camera this sprite will be rendered to.
         * @return {bool} Return false if not rendered, otherwise return true.
         */
        public render(camera: Phaser.Camera, sprite: Phaser.Sprite): bool {

            Phaser.SpriteUtils.updateCameraView(camera, sprite);

            if (sprite.transform.scale.x == 0 || sprite.transform.scale.y == 0 || sprite.texture.alpha < 0.1 || this.inCamera(camera, sprite) == false)
            {
                return false;
            }

            //  Reset our temp vars
            this._ga = -1;
            this._sx = 0;
            this._sy = 0;
            this._sw = sprite.texture.width;
            this._sh = sprite.texture.height;
            //this._dx = camera.screenView.x + sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x);
            //this._dy = camera.screenView.y + sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y);
            this._dx = sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x);
            this._dy = sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y);
            this._dw = sprite.texture.width;
            this._dh = sprite.texture.height;

            if (sprite.animations.currentFrame !== null)
            {
                this._sx = sprite.animations.currentFrame.x;
                this._sy = sprite.animations.currentFrame.y;

                if (sprite.animations.currentFrame.trimmed)
                {
                    this._dx += sprite.animations.currentFrame.spriteSourceSizeX;
                    this._dy += sprite.animations.currentFrame.spriteSourceSizeY;
                    this._sw = sprite.animations.currentFrame.spriteSourceSizeW;
                    this._sh = sprite.animations.currentFrame.spriteSourceSizeH;
                    this._dw = sprite.animations.currentFrame.spriteSourceSizeW;
                    this._dh = sprite.animations.currentFrame.spriteSourceSizeH;
                }
            }

            if (sprite.modified)
            {
                camera.texture.context.save();

                camera.texture.context.setTransform(
                    sprite.transform.local.data[0],         //  scale x
                    sprite.transform.local.data[3],         //  skew x
                    sprite.transform.local.data[1],         //  skew y
                    sprite.transform.local.data[4],         //  scale y
                    this._dx,                               //  translate x
                    this._dy                                //  translate y
                    );

                this._dx = sprite.transform.origin.x * -this._dw;
                this._dy = sprite.transform.origin.y * -this._dh;
            }
            else
            {
                this._dx -= (this._dw * sprite.transform.origin.x);
                this._dy -= (this._dh * sprite.transform.origin.y);
            }

            if (sprite.crop)
            {
                this._sx += sprite.crop.x * sprite.transform.scale.x;
                this._sy += sprite.crop.y * sprite.transform.scale.y;
                this._sw = sprite.crop.width * sprite.transform.scale.x;
                this._sh = sprite.crop.height * sprite.transform.scale.y;
                this._dx += sprite.crop.x * sprite.transform.scale.x;
                this._dy += sprite.crop.y * sprite.transform.scale.y;
                this._dw = sprite.crop.width * sprite.transform.scale.x;
                this._dh = sprite.crop.height * sprite.transform.scale.y;
            }

            this._sx = Math.floor(this._sx);
            this._sy = Math.floor(this._sy);
            this._sw = Math.floor(this._sw);
            this._sh = Math.floor(this._sh);
            this._dx = Math.floor(this._dx);
            this._dy = Math.floor(this._dy);
            this._dw = Math.floor(this._dw);
            this._dh = Math.floor(this._dh);

            if (this._sw <= 0 || this._sh <= 0 || this._dw <= 0 || this._dh <= 0)
            {
                return false;
            }

            //  Global Composite Ops
            if (sprite.texture.globalCompositeOperation)
            {
                camera.texture.context.save();
                camera.texture.context.globalCompositeOperation = sprite.texture.globalCompositeOperation;
            }

            //  Alpha
            if (sprite.texture.alpha !== 1 && camera.texture.context.globalAlpha != sprite.texture.alpha)
            {
                this._ga = sprite.texture.context.globalAlpha;
                camera.texture.context.globalAlpha = sprite.texture.alpha;
            }

            if (sprite.texture.opaque)
            {
                camera.texture.context.fillStyle = sprite.texture.backgroundColor;
                camera.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            }

            if (sprite.texture.loaded)
            {
                camera.texture.context.drawImage(
                    sprite.texture.texture,	    //	Source Image
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

            if (sprite.modified || sprite.texture.globalCompositeOperation)
            {
                camera.texture.context.restore();
            }

            if (this._ga > -1)
            {
                camera.texture.context.globalAlpha = this._ga;
            }

            sprite.renderOrderID = this.game.renderer.renderCount;

            this.game.renderer.renderCount++;

            return true;

        }

    }

}