/// <reference path="../Game.ts" />
/// <reference path="../core/Point.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="../core/Circle.ts" />
/// <reference path="../gameobjects/Sprite.ts" />

/**
* Phaser - SpriteUtils
*
* A collection of methods useful for manipulating and checking Sprites.
*
* TODO: 
*/

module Phaser {

    export class SpriteUtils {

        /**
         * Pivot position enum: at the top-left corner.
         * @type {number}
         */
        static ALIGN_TOP_LEFT: number = 0;

        /**
         * Pivot position enum: at the top-center corner.
         * @type {number}
         */
        static ALIGN_TOP_CENTER: number = 1;

        /**
         * Pivot position enum: at the top-right corner.
         * @type {number}
         */
        static ALIGN_TOP_RIGHT: number = 2;

        /**
         * Pivot position enum: at the center-left corner.
         * @type {number}
         */
        static ALIGN_CENTER_LEFT: number = 3;

        /**
         * Pivot position enum: at the center corner.
         * @type {number}
         */
        static ALIGN_CENTER: number = 4;

        /**
         * Pivot position enum: at the center-right corner.
         * @type {number}
         */
        static ALIGN_CENTER_RIGHT: number = 5;

        /**
         * Pivot position enum: at the bottom-left corner.
         * @type {number}
         */
        static ALIGN_BOTTOM_LEFT: number = 6;

        /**
         * Pivot position enum: at the bottom-center corner.
         * @type {number}
         */
        static ALIGN_BOTTOM_CENTER: number = 7;

        /**
         * Pivot position enum: at the bottom-right corner.
         * @type {number}
         */
        static ALIGN_BOTTOM_RIGHT: number = 8;



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

            this._point.x = X - camera.scroll.x * this.scrollFactor.x; //copied from getScreenXY()
            this._point.y = Y - camera.scroll.y * this.scrollFactor.y;
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
        /*
        static overlapsPoint(point: Point, inScreenSpace: bool = false, camera: Camera = null): bool {

            if (!inScreenSpace)
            {
                return (point.x > this.x) && (point.x < this.x + this.width) && (point.y > this.y) && (point.y < this.y + this.height);
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            var X: number = point.x - camera.scroll.x;
            var Y: number = point.y - camera.scroll.y;

            this.getScreenXY(this._point, camera);

            return (X > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);

        }
        */

        /**
        * Check and see if this object is currently on screen.
        *
        * @param camera {Camera} Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether the object is on screen or not.
        */
        /*
        static onScreen(camera: Camera = null): bool {

            if (camera == null)
            {
                camera = this._game.camera;
            }

            this.getScreenXY(this._point, camera);

            return (this._point.x + this.width > 0) && (this._point.x < camera.width) && (this._point.y + this.height > 0) && (this._point.y < camera.height);

        }
        */

        /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param point {Point} Takes a <code>MicroPoint</code> object and assigns the post-scrolled X and Y values of this object to it.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {MicroPoint} The <code>MicroPoint</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        /*
        static getScreenXY(point: MicroPoint = null, camera: Camera = null): MicroPoint {

            if (point == null)
            {
                point = new MicroPoint();
            }

            if (camera == null)
            {
                camera = this._game.camera;
            }

            point.x = this.x - camera.scroll.x * this.scrollFactor.x;
            point.y = this.y - camera.scroll.y * this.scrollFactor.y;
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            return point;

        }
        */

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
         * Check whether this object is visible in a specific camera rectangle.
         * @param camera {Rectangle} The rectangle you want to check.
         * @return {boolean} Return true if bounds of this sprite intersects the given rectangle, otherwise return false.
         */
        /*
        static inCamera(camera: Rectangle, cameraOffsetX: number, cameraOffsetY: number): bool {

            //  Object fixed in place regardless of the camera scrolling? Then it's always visible
            if (this.scrollFactor.x == 0 && this.scrollFactor.y == 0)
            {
                return true;
            }

            this._dx = (this.frameBounds.x - camera.x);
            this._dy = (this.frameBounds.y - camera.y);
            this._dw = this.frameBounds.width * this.scale.x;
            this._dh = this.frameBounds.height * this.scale.y;

            return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);

        }
        */

        /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param x {number} The new X position of this object.
        * @param y {number} The new Y position of this object.
        */
        /*
        static reset(x: number, y: number) {

            this.revive();
            this.touching = Collision.NONE;
            this.wasTouching = Collision.NONE;
            this.x = x;
            this.y = y;
            this.last.x = x;
            this.last.y = y;
            this.velocity.x = 0;
            this.velocity.y = 0;

        }
        */

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