/// <reference path="../Game.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../geom/Circle.ts" />
/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="RectangleUtils.ts" />

/**
* Phaser - SpriteUtils
*
* A collection of methods useful for manipulating and checking Sprites.
*/

module Phaser {

    export class SpriteUtils {

        static _tempPoint: Point;
        static _sin: number;
        static _cos: number;

        /**
         * Updates a Sprites cameraView Rectangle based on the given camera, sprite world position and rotation
         * @param camera {Camera} The Camera to use in the view
         * @param sprite {Sprite} The Sprite that will have its cameraView property modified
         * @return {Rectangle} A reference to the Sprite.cameraView property
         */
        static updateCameraView(camera: Camera, sprite: Sprite): Rectangle {

            if (sprite.rotation == 0 || sprite.texture.renderRotation == false)
            {
                //  Easy out
                sprite.cameraView.x = Math.round(sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x) - (sprite.width * sprite.transform.origin.x));
                sprite.cameraView.y = Math.round(sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y) - (sprite.height * sprite.transform.origin.y));
                sprite.cameraView.width = sprite.width;
                sprite.cameraView.height = sprite.height;
            }
            else
            {
                //  If the sprite is rotated around its center we can use this quicker method:
                if (sprite.transform.origin.x == 0.5 && sprite.transform.origin.y == 0.5)
                {
                    SpriteUtils._sin = sprite.transform.sin;
                    SpriteUtils._cos = sprite.transform.cos;

                    if (SpriteUtils._sin < 0)
                    {
                        SpriteUtils._sin = -SpriteUtils._sin;
                    }

                    if (SpriteUtils._cos < 0)
                    {
                        SpriteUtils._cos = -SpriteUtils._cos;
                    }

                    sprite.cameraView.width = Math.round(sprite.height * SpriteUtils._sin + sprite.width * SpriteUtils._cos);
                    sprite.cameraView.height = Math.round(sprite.height * SpriteUtils._cos + sprite.width * SpriteUtils._sin);
                    sprite.cameraView.x = Math.round(sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x) - (sprite.cameraView.width * sprite.transform.origin.x));
                    sprite.cameraView.y = Math.round(sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y) - (sprite.cameraView.height * sprite.transform.origin.y));
                }
                else
                {
                    //var left:Number = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
                    //var top:Number = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
                    //var right:Number = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
                    //var bottom:Number = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
                    //return new Rectangle(left, top, right - left, bottom - top);

                    var minX: number = Math.min(sprite.transform.upperLeft.x, sprite.transform.upperRight.x, sprite.transform.bottomLeft.x, sprite.transform.bottomRight.x);
                    var minY: number = Math.min(sprite.transform.upperLeft.y, sprite.transform.upperRight.y, sprite.transform.bottomLeft.y, sprite.transform.bottomRight.y);
                    var maxX: number = Math.max(sprite.transform.upperLeft.x, sprite.transform.upperRight.x, sprite.transform.bottomLeft.x, sprite.transform.bottomRight.x);
                    var maxY: number = Math.max(sprite.transform.upperLeft.y, sprite.transform.upperRight.y, sprite.transform.bottomLeft.y, sprite.transform.bottomRight.y);

                    //  (min_x,min_y), (min_x,max_y), (max_x,max_y), (max_x,min_y)

                    sprite.cameraView.x = minX;
                    sprite.cameraView.y = minY;
                    sprite.cameraView.width = maxX - minX;
                    sprite.cameraView.height = maxY - minY;

                    /*
                        //  Useful to get the maximum AABB size of any given rect

                        If you want a single box that covers all angles, just take the half-diagonal of your existing box as the radius of a circle.
                        The new box has to contain this circle, so it should be a square with side-length equal to twice the radius 
                        (equiv. the diagonal of the original AABB) and with the same center as the original.
                    */

                }

            }

            if (sprite.animations.currentFrame !== null && sprite.animations.currentFrame.trimmed)
            {
                //sprite.cameraView.x += sprite.animations.currentFrame.spriteSourceSizeX;
                //sprite.cameraView.y += sprite.animations.currentFrame.spriteSourceSizeY;
                //this._dw = sprite.animations.currentFrame.spriteSourceSizeW;
                //this._dh = sprite.animations.currentFrame.spriteSourceSizeH;
            }

            return sprite.cameraView;

        }

        static getAsPoints(sprite: Sprite): Phaser.Point[] {

            var out: Phaser.Point[] = [];

            //  top left
            out.push(new Point(sprite.x, sprite.y));

            //  top right
            out.push(new Point(sprite.x + sprite.width, sprite.y));

            //  bottom right
            out.push(new Point(sprite.x + sprite.width, sprite.y + sprite.height));

            //  bottom left
            out.push(new Point(sprite.x, sprite.y + sprite.height));

            return out;

        }

        /**
        * Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>Group</code>.
        * If the group has a LOT of things in it, it might be faster to use <code>Collision.overlaps()</code>.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param objectOrGroup {object} The object or group being tested.
        * @param inScreenSpace {boolean} Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether or not the objects overlap this.
        */
        /*
        static overlaps(objectOrGroup, inScreenSpace: bool = false, camera: Camera = null): bool {

            if (objectOrGroup.isGroup)
            {
                var results: bool = false;
                var i: number = 0;
                var members = <Group> objectOrGroup.members;

                while (i < length)
                {
                    if (this.overlaps(members[i++], inScreenSpace, camera))
                    {
                        results = true;
                    }
                }

                return results;

            }

            if (!inScreenSpace)
            {
                return (objectOrGroup.x + objectOrGroup.width > this.x) && (objectOrGroup.x < this.x + this.width) &&
                        (objectOrGroup.y + objectOrGroup.height > this.y) && (objectOrGroup.y < this.y + this.height);
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            var objectScreenPos: Point = objectOrGroup.getScreenXY(null, camera);

            this.getScreenXY(this._point, camera);

            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
                    (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        }
        */

        /**
        * Checks to see if this <code>GameObject</code> were located at the given position, would it overlap the <code>GameObject</code> or <code>Group</code>?
        * This is distinct from overlapsPoint(), which just checks that point, rather than taking the object's size numbero account.
        * WARNING: Currently tilemaps do NOT support screen space overlap checks!
        *
        * @param X {number} The X position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param Y {number} The Y position you want to check.  Pretends this object (the caller, not the parameter) is located here.
        * @param objectOrGroup {object} The object or group being tested.
        * @param inScreenSpace {boolean} Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether or not the two objects overlap.
        */
        /*
        static overlapsAt(X: number, Y: number, objectOrGroup, inScreenSpace: bool = false, camera: Camera = null): bool {

            if (objectOrGroup.isGroup)
            {
                var results: bool = false;
                var basic;
                var i: number = 0;
                var members = objectOrGroup.members;

                while (i < length)
                {
                    if (this.overlapsAt(X, Y, members[i++], inScreenSpace, camera))
                    {
                        results = true;
                    }
                }

                return results;
            }

            if (!inScreenSpace)
            {
                return (objectOrGroup.x + objectOrGroup.width > X) && (objectOrGroup.x < X + this.width) &&
                        (objectOrGroup.y + objectOrGroup.height > Y) && (objectOrGroup.y < Y + this.height);
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            var objectScreenPos: Point = objectOrGroup.getScreenXY(null, Camera);

            this._point.x = X - camera.scroll.x * this.transform.scrollFactor.x; //copied from getScreenXY()
            this._point.y = Y - camera.scroll.y * this.transform.scrollFactor.y;
            this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
            this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;

            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
                (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        }
        */

        /**
        * Checks to see if a point in 2D world space overlaps this <code>GameObject</code>.
        *
        * @param point {Point} The point in world space you want to check.
        * @param inScreenSpace {boolean} Whether to take scroll factors into account when checking for overlap.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return   Whether or not the point overlaps this object.
        */
        static overlapsPoint(sprite: Sprite, point: Point, inScreenSpace: bool = false, camera: Camera = null): bool {

            if (!inScreenSpace)
            {
                return Phaser.RectangleUtils.containsPoint(sprite.body.bounds, point);
                //return (point.x > sprite.x) && (point.x < sprite.x + sprite.width) && (point.y > sprite.y) && (point.y < sprite.y + sprite.height);
            }

            if (camera == null)
            {
                camera = sprite.game.camera;
            }

            //var x: number = point.x - camera.scroll.x;
            //var y: number = point.y - camera.scroll.y;

            //this.getScreenXY(this._point, camera);

            //return (x > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);

        }

        /**
        * Check and see if this object is currently on screen.
        *
        * @param camera {Camera} Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether the object is on screen or not.
        */
        static onScreen(sprite: Sprite, camera: Camera = null): bool {

            if (camera == null)
            {
                camera = sprite.game.camera;
            }

            SpriteUtils.getScreenXY(sprite, SpriteUtils._tempPoint, camera);

            return (SpriteUtils._tempPoint.x + sprite.width > 0) && (SpriteUtils._tempPoint.x < camera.width) && (SpriteUtils._tempPoint.y + sprite.height > 0) && (SpriteUtils._tempPoint.y < camera.height);

        }

        /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param point {Point} Takes a <code>Point</code> object and assigns the post-scrolled X and Y values of this object to it.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {Point} The <code>Point</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        static getScreenXY(sprite: Sprite, point: Point = null, camera: Camera = null): Point {

            if (point == null)
            {
                point = new Point();
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            point.x = sprite.x - camera.x * sprite.transform.scrollFactor.x;
            point.y = sprite.y - camera.y * sprite.transform.scrollFactor.y;
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            return point;

        }

        /**
        * Set the world bounds that this GameObject can exist within based on the size of the current game world.
        *
        * @param action {number} The action to take if the object hits the world bounds, either OUT_OF_BOUNDS_KILL or OUT_OF_BOUNDS_STOP
        */
        /*
        static setBoundsFromWorld(action?: number = GameObject.OUT_OF_BOUNDS_STOP) {

            this.setBounds(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);
            this.outOfBoundsAction = action;

        }
        */

        /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param x {number} The new X position of this object.
        * @param y {number} The new Y position of this object.
        */
        static reset(sprite: Sprite, x: number, y: number) {

            sprite.revive();
            sprite.body.touching = Types.NONE;
            sprite.body.wasTouching = Types.NONE;
            sprite.x = x;
            sprite.y = y;
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
            sprite.body.position.x = x;
            sprite.body.position.y = y;

        }

        static setOriginToCenter(sprite: Sprite, fromFrameBounds: bool = true, fromBody?: bool = false) {

            if (fromFrameBounds)
            {
                sprite.transform.origin.setTo(sprite.width / 2, sprite.height / 2);
            }
            else if (fromBody)
            {
                sprite.transform.origin.setTo(sprite.body.bounds.halfWidth, sprite.body.bounds.halfHeight);
            }

        }

        /**
        * Set the world bounds that this GameObject can exist within. By default a GameObject can exist anywhere
        * in the world. But by setting the bounds (which are given in world dimensions, not screen dimensions)
        * it can be stopped from leaving the world, or a section of it.
        *
        * @param x {number} x position of the bound
        * @param y {number} y position of the bound
        * @param width {number} width of its bound
        * @param height {number} height of its bound
        */
        static setBounds(x: number, y: number, width: number, height: number) {

            //this.worldBounds = new Quad(x, y, width, height);

        }

        /**
         * This function creates a flat colored square image dynamically.
         * @param width {number} The width of the sprite you want to generate.
         * @param height {number} The height of the sprite you want to generate.
         * @param [color] {number} specifies the color of the generated block. (format is 0xAARRGGBB)
         * @return {Sprite} Sprite instance itself.
         */
        /*
        static makeGraphic(width: number, height: number, color: string = 'rgb(255,255,255)'): Sprite {

            this._texture = null;
            this.width = width;
            this.height = height;
            this.fillColor = color;
            this._dynamicTexture = false;

            return this;
        }
        */

    }

}