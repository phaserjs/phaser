/// <reference path="../Game.ts" />
/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="../gameobjects/ScrollZone.ts" />
/// <reference path="../cameras/Camera.ts" />
/// <reference path="IRenderer.ts" />

module Phaser {

    export class CanvasRenderer implements Phaser.IRenderer {

        constructor(game: Phaser.Game) {
            this._game = game;
        }

        /**
         * The essential reference to the main game object
         */
        private _game: Phaser.Game;

        //  local rendering related temp vars to help avoid gc spikes with var creation
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

        private _cameraList;
        private _camera: Camera;
        private _groupLength: number;

        private _count: number;

        public renderTotal: number;

        public render() {

            //  Get a list of all the active cameras

            this._cameraList = this._game.world.getAllCameras();

            this._count = 0;

            //  Then iterate through world.group on them all (where not blacklisted, etc)
            for (var c = 0; c < this._cameraList.length; c++)
            {
                this._camera = this._cameraList[c];

                this.preRenderCamera(this._camera);

                this._game.world.group.render(this._camera);

                this.postRenderCamera(this._camera);
            }

            this.renderTotal = this._count;

        }

        public renderGameObject(object) {

            if (object.type == Types.SPRITE)
            {
                this.renderSprite(this._camera, object);
            }
            else if (object.type == Types.SCROLLZONE)
            {
                this.renderScrollZone(this._camera, object);
            }

        }

        public preRenderGroup(camera: Camera, group: Group) {

            if (camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1 || this.inScreen(camera) == false)
            {
                return false;
            }

            //  Reset our temp vars
            this._ga = -1;
            this._sx = 0;
            this._sy = 0;
            this._sw = group.texture.width;
            this._sh = group.texture.height;
            this._fx = group.transform.scale.x;
            this._fy = group.transform.scale.y;
            this._sin = 0;
            this._cos = 1;
            //this._dx = (camera.screenView.x * camera.scrollFactor.x) + camera.frameBounds.x - (camera.worldView.x * camera.scrollFactor.x);
            //this._dy = (camera.screenView.y * camera.scrollFactor.y) + camera.frameBounds.y - (camera.worldView.y * camera.scrollFactor.y);
            this._dx = 0;
            this._dy = 0;
            this._dw = group.texture.width;
            this._dh = group.texture.height;

            //  Global Composite Ops
            if (group.texture.globalCompositeOperation)
            {
                group.texture.context.save();
                group.texture.context.globalCompositeOperation = group.texture.globalCompositeOperation;
            }

            //  Alpha
            if (group.texture.alpha !== 1 && group.texture.context.globalAlpha !== group.texture.alpha)
            {
                this._ga = group.texture.context.globalAlpha;
                group.texture.context.globalAlpha = group.texture.alpha;
            }

            //  Flip X
            if (group.texture.flippedX)
            {
                this._fx = -group.transform.scale.x;
            }

            //  Flip Y
            if (group.texture.flippedY)
            {
                this._fy = -group.transform.scale.y;
            }

            //	Rotation and Flipped
            if (group.modified)
            {
                if (group.transform.rotation !== 0 || group.transform.rotationOffset !== 0)
                {
                    this._sin = Math.sin(group.game.math.degreesToRadians(group.transform.rotationOffset + group.transform.rotation));
                    this._cos = Math.cos(group.game.math.degreesToRadians(group.transform.rotationOffset + group.transform.rotation));
                }

                //  setTransform(a, b, c, d, e, f);
                //  a = scale x
                //  b = skew x
                //  c = skew y
                //  d = scale y
                //  e = translate x
                //  f = translate y

                group.texture.context.save();
                group.texture.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + group.transform.skew.x, -(this._sin * this._fy) + group.transform.skew.y, this._cos * this._fy, this._dx, this._dy);

                this._dx = -group.transform.origin.x;
                this._dy = -group.transform.origin.y;
            }
            else
            {
                if (!group.transform.origin.equals(0))
                {
                    this._dx -= group.transform.origin.x;
                    this._dy -= group.transform.origin.y;
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

            if (group.texture.opaque)
            {
                group.texture.context.fillStyle = group.texture.backgroundColor;
                group.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            }

            if (group.texture.loaded)
            {
                group.texture.context.drawImage(
                    group.texture.texture,	    //	Source Image
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

            return true;

        }

        public postRenderGroup(camera: Camera, group: Group) {

            if (group.modified || group.texture.globalCompositeOperation)
            {
                group.texture.context.restore();
            }

            //  This could have been over-written by a sprite, need to store elsewhere
            if (this._ga > -1)
            {
                group.texture.context.globalAlpha = this._ga;
            }

        }

        /**
         * Check whether this object is visible in a specific camera Rectangle.
         * @param camera {Rectangle} The Rectangle you want to check.
         * @return {boolean} Return true if bounds of this sprite intersects the given Rectangle, otherwise return false.
         */
        public inCamera(camera: Camera, sprite: Sprite): bool {

            //  Object fixed in place regardless of the camera scrolling? Then it's always visible
            if (sprite.transform.scrollFactor.equals(0))
            {
                return true;
            }

            return RectangleUtils.intersects(sprite.cameraView, camera.screenView);

        }

        public inScreen(camera: Camera): bool {

            return true;

        }

        /**
         * Render this sprite to specific camera. Called by game loop after update().
         * @param camera {Camera} Camera this sprite will be rendered to.
         * @return {boolean} Return false if not rendered, otherwise return true.
         */
        public preRenderCamera(camera: Camera): bool {

            if (camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1 || this.inScreen(camera) == false)
            {
                return false;
            }

            //  Reset our temp vars
            this._ga = -1;
            this._sx = 0;
            this._sy = 0;
            this._sw = camera.width;
            this._sh = camera.height;
            this._fx = camera.transform.scale.x;
            this._fy = camera.transform.scale.y;
            this._sin = 0;
            this._cos = 1;
            this._dx = camera.screenView.x;
            this._dy = camera.screenView.y;
            this._dw = camera.width;
            this._dh = camera.height;

            //  Global Composite Ops
            if (camera.texture.globalCompositeOperation)
            {
                camera.texture.context.save();
                camera.texture.context.globalCompositeOperation = camera.texture.globalCompositeOperation;
            }

            //  Alpha
            if (camera.texture.alpha !== 1 && camera.texture.context.globalAlpha != camera.texture.alpha)
            {
                this._ga = camera.texture.context.globalAlpha;
                camera.texture.context.globalAlpha = camera.texture.alpha;
            }

            //  Sprite Flip X
            if (camera.texture.flippedX)
            {
                this._fx = -camera.transform.scale.x;
            }

            //  Sprite Flip Y
            if (camera.texture.flippedY)
            {
                this._fy = -camera.transform.scale.y;
            }

            //	Rotation and Flipped
            if (camera.modified)
            {
                if (camera.transform.rotation !== 0 || camera.transform.rotationOffset !== 0)
                {
                    this._sin = Math.sin(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                    this._cos = Math.cos(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                }

                //  setTransform(a, b, c, d, e, f);
                //  a = scale x
                //  b = skew x
                //  c = skew y
                //  d = scale y
                //  e = translate x
                //  f = translate y

                camera.texture.context.save();
                camera.texture.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + camera.transform.skew.x, -(this._sin * this._fy) + camera.transform.skew.y, this._cos * this._fy, this._dx, this._dy);

                this._dx = -camera.transform.origin.x;
                this._dy = -camera.transform.origin.y;
            }
            else
            {
                if (!camera.transform.origin.equals(0))
                {
                    this._dx -= camera.transform.origin.x;
                    this._dy -= camera.transform.origin.y;
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

            //  Clip the camera so we don't get sprites appearing outside the edges
            if (camera.clip == true && camera.disableClipping == false)
            {
                camera.texture.context.beginPath();
                camera.texture.context.rect(camera.screenView.x, camera.screenView.x, camera.screenView.width, camera.screenView.height);
                camera.texture.context.closePath();
                camera.texture.context.clip();
            }

            if (camera.texture.opaque)
            {
                camera.texture.context.fillStyle = camera.texture.backgroundColor;
                camera.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            }

            //camera.fx.render(camera);

            if (camera.texture.loaded)
            {
                camera.texture.context.drawImage(
                    camera.texture.texture,	    //	Source Image
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

            return true;

        }

        public postRenderCamera(camera: Camera) {

            //camera.fx.postRender(camera);

            if (camera.modified || camera.texture.globalCompositeOperation)
            {
                camera.texture.context.restore();
            }

            //  This could have been over-written by a sprite, need to store elsewhere
            if (this._ga > -1)
            {
                camera.texture.context.globalAlpha = this._ga;
            }

        }

        public renderCircle(camera: Camera, circle: Circle, context, outline?: bool = false, fill?: bool = true, lineColor?: string = 'rgb(0,255,0)', fillColor?: string = 'rgba(0,100,0.0.3)', lineWidth?: number = 1): bool {

            this._count++;

            //  Reset our temp vars
            this._sx = 0;
            this._sy = 0;
            this._sw = circle.diameter;
            this._sh = circle.diameter;
            this._fx = 1;
            this._fy = 1;
            this._sin = 0;
            this._cos = 1;
            this._dx = camera.screenView.x + circle.x - camera.worldView.x;
            this._dy = camera.screenView.y + circle.y - camera.worldView.y;
            this._dw = circle.diameter;
            this._dh = circle.diameter;

            this._sx = Math.round(this._sx);
            this._sy = Math.round(this._sy);
            this._sw = Math.round(this._sw);
            this._sh = Math.round(this._sh);
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);

            this._game.stage.saveCanvasValues();

            context.save();
            context.lineWidth = lineWidth;
            context.strokeStyle = lineColor;
            context.fillStyle = fillColor;

            context.beginPath();
            context.arc(this._dx, this._dy, circle.radius, 0, Math.PI * 2);
            context.closePath();

            if (outline)
            {
                //context.stroke();
            }

            if (fill)
            {
                context.fill();
            }

            context.restore();

            this._game.stage.restoreCanvasValues();

            return true;

        }

        /**
         * Render this sprite to specific camera. Called by game loop after update().
         * @param camera {Camera} Camera this sprite will be rendered to.
         * @return {boolean} Return false if not rendered, otherwise return true.
         */
        public renderSprite(camera: Camera, sprite: Sprite): bool {

            Phaser.SpriteUtils.updateCameraView(camera, sprite);

            if (sprite.transform.scale.x == 0 || sprite.transform.scale.y == 0 || sprite.texture.alpha < 0.1 || this.inCamera(camera, sprite) == false)
            {
                return false;
            }

            sprite.renderOrderID = this._count;
            this._count++;

            //  Reset our temp vars
            this._ga = -1;
            this._sx = 0;
            this._sy = 0;
            this._sw = sprite.texture.width;
            this._sh = sprite.texture.height;
            this._dx = camera.screenView.x + sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x);
            this._dy = camera.screenView.y + sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y);
            this._dw = sprite.texture.width;
            this._dh = sprite.texture.height;

            //  Global Composite Ops
            if (sprite.texture.globalCompositeOperation)
            {
                sprite.texture.context.save();
                sprite.texture.context.globalCompositeOperation = sprite.texture.globalCompositeOperation;
            }

            //  Alpha
            if (sprite.texture.alpha !== 1 && sprite.texture.context.globalAlpha != sprite.texture.alpha)
            {
                this._ga = sprite.texture.context.globalAlpha;
                sprite.texture.context.globalAlpha = sprite.texture.alpha;
            }

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
                sprite.texture.context.save();

                sprite.texture.context.setTransform(
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

            this._sx = Math.round(this._sx);
            this._sy = Math.round(this._sy);
            this._sw = Math.round(this._sw);
            this._sh = Math.round(this._sh);
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);

            if (sprite.texture.opaque)
            {
                sprite.texture.context.fillStyle = sprite.texture.backgroundColor;
                sprite.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
            }

            if (sprite.texture.loaded)
            {
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
            }
                
            if (sprite.modified || sprite.texture.globalCompositeOperation)
            {
                sprite.texture.context.restore();
            }

            if (this._ga > -1)
            {
                sprite.texture.context.globalAlpha = this._ga;
            }

            return true;

        }

        public renderScrollZone(camera: Camera, scrollZone: ScrollZone): bool {

            if (scrollZone.transform.scale.x == 0 || scrollZone.transform.scale.y == 0 || scrollZone.texture.alpha < 0.1 || this.inCamera(camera, scrollZone) == false)
            {
                return false;
            }

            this._count++;

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

                //  setTransform(a, b, c, d, e, f);
                //  a = scale x
                //  b = skew x
                //  c = skew y
                //  d = scale y
                //  e = translate x
                //  f = translate y

                scrollZone.texture.context.save();
                scrollZone.texture.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + scrollZone.transform.skew.x, -(this._sin * this._fy) + scrollZone.transform.skew.y, this._cos * this._fy, this._dx, this._dy);

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

            this._sx = Math.round(this._sx);
            this._sy = Math.round(this._sy);
            this._sw = Math.round(this._sw);
            this._sh = Math.round(this._sh);
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);

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

            return true;

        }

    }

}