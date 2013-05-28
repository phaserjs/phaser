/// <reference path="../Game.ts" />
/// <reference path="../RenderManager.ts" />
/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="../cameras/Camera.ts" />
/// <reference path="IRenderer.ts" />

module Phaser {

    export class CanvasRenderer implements Phaser.IRenderer {

        constructor(game: Game) {

            this._game = game;

        }

        /**
         * The essential reference to the main game object
         */
        private _game: Game;

        //  local rendering related temp vars to help avoid gc spikes with var creation
        private _sx: number = 0;
        private _sy: number = 0;
        private _sw: number = 0;
        private _sh: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;

        private _cameraList;
        private _camera: Camera;
        private _groupLength: number;

        public render() {

            //  Get a list of all the active cameras

            this._cameraList = this._game.world.getAllCameras();

            //  Then iterate through world.group on them all (where not blacklisted, etc)
            for (var c = 0; c < this._cameraList.length; c++)
            {
                this._camera = this._cameraList[c];

                this._camera.preRender();

                this._game.world.group.render(this._camera);

                this._camera.postRender();
            }

        }

        /**
         * Render this sprite to specific camera. Called by game loop after update().
         * @param camera {Camera} Camera this sprite will be rendered to.
         * @return {boolean} Return false if not rendered, otherwise return true.
         */
        public renderSprite(camera: Camera, sprite: Sprite): bool {

            //  Render checks (needs inCamera check added)
            if (sprite.scale.x == 0 || sprite.scale.y == 0 || sprite.texture.alpha < 0.1)
            {
                return false;
            }

            //  Alpha
            if (sprite.texture.alpha !== 1)
            {
                var globalAlpha = sprite.texture.context.globalAlpha;
                sprite.texture.context.globalAlpha = sprite.texture.alpha;
            }

            this._sx = 0;
            this._sy = 0;
            this._sw = sprite.frameBounds.width;
            this._sh = sprite.frameBounds.height;

            this._dx = (camera.scaledX * sprite.scrollFactor.x) + sprite.frameBounds.x - (camera.worldView.x * sprite.scrollFactor.x);
            this._dy = (camera.scaledY * sprite.scrollFactor.y) + sprite.frameBounds.y - (camera.worldView.y * sprite.scrollFactor.y);
            this._dw = sprite.frameBounds.width * sprite.scale.x;
            this._dh = sprite.frameBounds.height * sprite.scale.y;

            /*
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
            */

            //	Apply camera difference
            if (sprite.scrollFactor.x !== 1 || sprite.scrollFactor.y !== 1)
            {
                //this._dx -= (camera.worldView.x * this.scrollFactor.x);
                //this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }

            //	Rotation and Flipped
            if (sprite.position.rotation !== 0 || sprite.position.rotationOffset !== 0 || sprite.texture.flippedX || sprite.texture.flippedY)
            {
                sprite.texture.context.save();
                sprite.texture.context.translate(this._dx + (this._dw / 2), this._dy + (this._dh / 2));

                if (sprite.texture.renderRotation == true && (sprite.position.rotation !== 0 || sprite.position.rotationOffset !== 0))
                {
                    //  Apply point of rotation here
                    sprite.texture.context.rotate((sprite.position.rotationOffset + sprite.position.rotation) * (Math.PI / 180));
                }

                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);

                if (sprite.texture.flippedX || sprite.texture.flippedY)
                {
                    if (sprite.texture.flippedX)
                    {
                        sprite.texture.context.scale(-1, 1);
                    }
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

            //if (this._texture != null)
            //{
                sprite.texture.context.drawImage(
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
            //}
            //else
            //{
            //    this.context.fillStyle = this.fillColor;
            //    this.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            //}

            if (sprite.position.rotation !== 0 || sprite.position.rotationOffset !== 0 || sprite.texture.flippedX || sprite.texture.flippedY)
            {
                //this.context.translate(0, 0);
                sprite.texture.context.restore();
            }

            //if (this.renderDebug)
            //{
            //    this.renderBounds(camera, cameraOffsetX, cameraOffsetY);
                //this.collisionMask.render(camera, cameraOffsetX, cameraOffsetY);
            //}

            if (globalAlpha > -1)
            {
                sprite.texture.context.globalAlpha = globalAlpha;
            }

            return true;

        }


    }

}