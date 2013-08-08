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
                sprite.cameraView.x = Math.floor(sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x) - (sprite.width * sprite.transform.origin.x));
                sprite.cameraView.y = Math.floor(sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y) - (sprite.height * sprite.transform.origin.y));
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
                    sprite.cameraView.x = Math.min(sprite.transform.upperLeft.x, sprite.transform.upperRight.x, sprite.transform.bottomLeft.x, sprite.transform.bottomRight.x);
                    sprite.cameraView.y = Math.min(sprite.transform.upperLeft.y, sprite.transform.upperRight.y, sprite.transform.bottomLeft.y, sprite.transform.bottomRight.y);
                    sprite.cameraView.width = Math.max(sprite.transform.upperLeft.x, sprite.transform.upperRight.x, sprite.transform.bottomLeft.x, sprite.transform.bottomRight.x) - sprite.cameraView.x;
                    sprite.cameraView.height = Math.max(sprite.transform.upperLeft.y, sprite.transform.upperRight.y, sprite.transform.bottomLeft.y, sprite.transform.bottomRight.y) - sprite.cameraView.y;
                }
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
        static overlaps(objectOrGroup, inScreenSpace: boolean = false, camera: Camera = null): boolean {

            if (objectOrGroup.isGroup)
            {
                var results: boolean = false;
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
                camera = this.game.camera;
            }

            var objectScreenPos: Point = objectOrGroup.getScreenXY(null, camera);

            this.getScreenXY(this._point, camera);

            return (objectScreenPos.x + objectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
                    (objectScreenPos.y + objectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
        }
        */


        /**
        * Checks to see if the given x and y coordinates overlaps this <code>Sprite</code>, taking scaling and rotation into account.
        * The coordinates must be given in world space, not local or camera space.
        *
        * @param sprite {Sprite} The Sprite to check. It will take scaling and rotation into account.
        * @param x {Number} The x coordinate in world space.
        * @param y {Number} The y coordinate in world space.
        *
        * @return   Whether or not the point overlaps this object.
        */
        static overlapsXY(sprite: Phaser.Sprite, x: number, y: number): boolean {

            //  if rotation == 0 then just do a rect check instead!
            if (sprite.transform.rotation == 0)
            {
                return Phaser.RectangleUtils.contains(sprite.worldView, x, y);
            }

            if ((x - sprite.transform.upperLeft.x) * (sprite.transform.upperRight.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperLeft.y) * (sprite.transform.upperRight.y - sprite.transform.upperLeft.y) < 0)
            {
                return false;
            }

            if ((x - sprite.transform.upperRight.x) * (sprite.transform.upperRight.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperRight.y) * (sprite.transform.upperRight.y - sprite.transform.upperLeft.y) > 0)
            {
                return false;
            }

            if ((x - sprite.transform.upperLeft.x) * (sprite.transform.bottomLeft.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperLeft.y) * (sprite.transform.bottomLeft.y - sprite.transform.upperLeft.y) < 0)
            {
                return false;
            }

            if ((x - sprite.transform.bottomLeft.x) * (sprite.transform.bottomLeft.x - sprite.transform.upperLeft.x) + (y - sprite.transform.bottomLeft.y) * (sprite.transform.bottomLeft.y - sprite.transform.upperLeft.y) > 0)
            {
                return false;
            }

            return true;

        }

        /**
        * Checks to see if the given point overlaps this <code>Sprite</code>, taking scaling and rotation into account.
        * The point must be given in world space, not local or camera space.
        *
        * @param sprite {Sprite} The Sprite to check. It will take scaling and rotation into account.
        * @param point {Point} The point in world space you want to check.
        *
        * @return   Whether or not the point overlaps this object.
        */
        static overlapsPoint(sprite: Sprite, point: Point): boolean {
            return SpriteUtils.overlapsXY(sprite, point.x, point.y);
        }

        /**
        * Check and see if this object is currently on screen.
        *
        * @param camera {Camera} Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether the object is on screen or not.
        */
        static onScreen(sprite: Sprite, camera: Camera = null): boolean {

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
                camera = this.game.camera;
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
        static setBoundsFromWorld(action: number = GameObject.OUT_OF_BOUNDS_STOP) {

            this.setBounds(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height);
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
            //sprite.body.touching = Types.NONE;
            //sprite.body.wasTouching = Types.NONE;
            sprite.x = x;
            sprite.y = y;
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
            sprite.body.position.x = x;
            sprite.body.position.y = y;

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