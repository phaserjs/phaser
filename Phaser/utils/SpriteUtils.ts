/// <reference path="../_definitions.ts" />

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser
*/
module Phaser {

    /**
    * A collection of methods useful for manipulating and comparing Sprites.
    *
    * @class SpriteUtils
    */
    export class SpriteUtils {

        /**
        * A temporary internal variable.
        * @property _tempPoint
        * @type {Phaser.Point}
        */
        public static _tempPoint: Phaser.Point;

        /**
        * A temporary internal variable.
        * @property _sin
        * @type {Number}
        */
        public static _sin: number;

        /**
        * A temporary internal variable.
        * @property _cos
        * @type {Number}
        */
        public static _cos: number;

        /**
        * Updates a Sprites cameraView Rectangle based on the given camera, sprite world position and rotation.
        * @method updateCameraView
        * @param {Camera} camera The Camera to use in the view
        * @param {Sprite} sprite The Sprite that will have its cameraView property modified
        * @return {Rectangle} A reference to the Sprite.cameraView property
        */
        public static updateCameraView(camera: Phaser.Camera, sprite: Phaser.Sprite): Phaser.Rectangle {

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
                    Phaser.SpriteUtils._sin = sprite.transform.sin;
                    Phaser.SpriteUtils._cos = sprite.transform.cos;

                    if (Phaser.SpriteUtils._sin < 0)
                    {
                        Phaser.SpriteUtils._sin = -Phaser.SpriteUtils._sin;
                    }

                    if (Phaser.SpriteUtils._cos < 0)
                    {
                        Phaser.SpriteUtils._cos = -Phaser.SpriteUtils._cos;
                    }

                    sprite.cameraView.width = Math.round(sprite.height * Phaser.SpriteUtils._sin + sprite.width * Phaser.SpriteUtils._cos);
                    sprite.cameraView.height = Math.round(sprite.height * Phaser.SpriteUtils._cos + sprite.width * Phaser.SpriteUtils._sin);
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

        /**
        * Returns an array containing 4 Point objects corresponding to the 4 corners of the sprite bounds.
        * @method getAsPoints
        * @param {Sprite} sprite The Sprite that will have its cameraView property modified
        * @return {Array} An array of Point objects.
        */
        public static getAsPoints(sprite: Phaser.Sprite): Phaser.Point[] {

            var out: Phaser.Point[] = [];

            //  top left
            out.push(new Phaser.Point(sprite.x, sprite.y));

            //  top right
            out.push(new Phaser.Point(sprite.x + sprite.width, sprite.y));

            //  bottom right
            out.push(new Phaser.Point(sprite.x + sprite.width, sprite.y + sprite.height));

            //  bottom left
            out.push(new Phaser.Point(sprite.x, sprite.y + sprite.height));

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
        * @method overlapsXY
        * @param {Sprite} sprite The Sprite to check. It will take scaling and rotation into account.
        * @param {Number} x The x coordinate in world space.
        * @param {Number} y The y coordinate in world space.
        * @return {Boolean} Whether or not the point overlaps this object.
        */
        public static overlapsXY(sprite: Phaser.Sprite, x: number, y: number): boolean {

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
        * @method overlapsPoint
        * @param {Sprite} sprite The Sprite to check. It will take scaling and rotation into account.
        * @param {Point} point The point in world space you want to check.
        * @return {Boolean} Whether or not the point overlaps this object.
        */
        public static overlapsPoint(sprite: Phaser.Sprite, point: Phaser.Point): boolean {
            return Phaser.SpriteUtils.overlapsXY(sprite, point.x, point.y);
        }

        /**
        * Check and see if this object is currently on screen.
        *
        * @method onScreen
        * @param {Sprite} sprite The Sprite to check. It will take scaling and rotation into account.
        * @param {Camera} camera Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        * @return {Boolean} Whether the object is on screen or not.
        */
        public static onScreen(sprite: Phaser.Sprite, camera: Phaser.Camera = null): boolean {

            if (camera == null)
            {
                camera = sprite.game.camera;
            }

            Phaser.SpriteUtils.getScreenXY(sprite, SpriteUtils._tempPoint, camera);

            return (Phaser.SpriteUtils._tempPoint.x + sprite.width > 0) && (Phaser.SpriteUtils._tempPoint.x < camera.width) && (Phaser.SpriteUtils._tempPoint.y + sprite.height > 0) && (Phaser.SpriteUtils._tempPoint.y < camera.height);

        }

        /**
        * Call this to figure out the on-screen position of the object.
        *
        * @method getScreenXY
        * @param {Sprite} sprite The Sprite to check.
        * @param {Point} point Takes a <code>Point</code> object and assigns the post-scrolled X and Y values of this object to it.
        * @param {Camera} camera Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        * @return {Point} The <code>Point</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        public static getScreenXY(sprite: Phaser.Sprite, point: Phaser.Point = null, camera: Phaser.Camera = null): Phaser.Point {

            if (point == null)
            {
                point = new Point();
            }

            if (camera == null)
            {
                camera = sprite.game.camera;
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
        * Handy for reviving game objects. Resets their existence flags and position.
        *
        * @method reset
        * @param {Sprite} sprite The Sprite to reset.
        * @param {number} x The new X position of this object.
        * @param {number} y The new Y position of this object.
        * @return {Sprite} The reset Sprite object.
        */
        public static reset(sprite: Phaser.Sprite, x: number, y: number):Phaser.Sprite {

            sprite.revive();
            sprite.x = x;
            sprite.y = y;
            //sprite.body.velocity.x = 0;
            //sprite.body.velocity.y = 0;
            //sprite.body.position.x = x;
            //sprite.body.position.y = y;

            return sprite;

        }

        /**
        * Set the world bounds that this GameObject can exist within. By default a GameObject can exist anywhere
        * in the world. But by setting the bounds (which are given in world dimensions, not screen dimensions)
        * it can be stopped from leaving the world, or a section of it.
        *
        * @method setBounds
        * @param {number} x x position of the bound
        * @param {number} y y position of the bound
        * @param {number} width width of its bound
        * @param {number} height height of its bound
        */
        public static setBounds(x: number, y: number, width: number, height: number) {

            // Needed?

        }

    }

}