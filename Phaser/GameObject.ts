/// <reference path="Basic.ts" />
/// <reference path="Game.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="geom/Rectangle.ts" />
/// <reference path="geom/Point.ts" />

class GameObject extends Basic {

    constructor(game:Game, x?: number = 0, y?: number = 0, width?: number = 16, height?: number = 16) {

        super(game);

        this.bounds = new Rectangle(x, y, width, height);
        this.exists = true;
        this.active = true;
        this.visible = true;
        this.alive = true;
        this.isGroup = false;
        this.alpha = 1;
        this.scale = new Point(1, 1);

        this.last = new Point(x, y);
        this.origin = new Point(this.bounds.halfWidth, this.bounds.halfHeight);
        this.mass = 1.0;
        this.elasticity = 0.0;
        this.health = 1;
        this.immovable = false;
        this.moves = true;

        this.touching = GameObject.NONE;
        this.wasTouching = GameObject.NONE;
        this.allowCollisions = GameObject.ANY;

        this.velocity = new Point();
        this.acceleration = new Point();
        this.drag = new Point();
        this.maxVelocity = new Point(10000, 10000);

        this.angle = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.angularDrag = 0;
        this.maxAngular = 10000;

        this.scrollFactor = new Point(1.0, 1.0);

    }

    private _angle: number = 0;
    public _point: Point;

    public static LEFT: number = 0x0001;
    public static RIGHT: number = 0x0010;
    public static UP: number = 0x0100;
    public static DOWN: number = 0x1000;
    public static NONE: number = 0;
    public static CEILING: number = GameObject.UP;
    public static FLOOR: number = GameObject.DOWN;
    public static WALL: number = GameObject.LEFT | GameObject.RIGHT;
    public static ANY: number = GameObject.LEFT | GameObject.RIGHT | GameObject.UP | GameObject.DOWN;
    public static OVERLAP_BIAS: number = 4;

    public bounds: Rectangle;
    public alpha: number;
    public scale: Point;
    public origin: Point;

    //  Physics properties
    public immovable: bool;
    public velocity: Point;
    public mass: number;
    public elasticity: number;
    public acceleration: Point;
    public drag: Point;
    public maxVelocity: Point;
    public angularVelocity: number;
    public angularAcceleration: number;
    public angularDrag: number;
    public maxAngular: number;
    public scrollFactor: Point;

    public health: number;
    public moves: bool = true;
    public touching: number;
    public wasTouching: number;
    public allowCollisions: number;
    public last: Point;

    public preUpdate() {

        //  flicker time

        this.last.x = this.bounds.x;
        this.last.y = this.bounds.y;

    }

    public update() {
    }

    public postUpdate() {

        if (this.moves)
        {
            this.updateMotion();
        }

        this.wasTouching = this.touching;
        this.touching = GameObject.NONE;

    }

    private updateMotion() {

        var delta: number;
        var velocityDelta: number;

        velocityDelta = (this._game.math.computeVelocity(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.maxAngular) - this.angularVelocity) / 2;
        this.angularVelocity += velocityDelta;
        this._angle += this.angularVelocity * this._game.time.elapsed;
        this.angularVelocity += velocityDelta;

        velocityDelta = (this._game.math.computeVelocity(this.velocity.x, this.acceleration.x, this.drag.x, this.maxVelocity.x) - this.velocity.x) / 2;
        this.velocity.x += velocityDelta;
        delta = this.velocity.x * this._game.time.elapsed;
        this.velocity.x += velocityDelta;
        this.bounds.x += delta;

        velocityDelta = (this._game.math.computeVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) / 2;
        this.velocity.y += velocityDelta;
        delta = this.velocity.y * this._game.time.elapsed;
        this.velocity.y += velocityDelta;
        this.bounds.y += delta;

    }

    /**
	* Checks to see if some <code>GameObject</code> overlaps this <code>GameObject</code> or <code>FlxGroup</code>.
	* If the group has a LOT of things in it, it might be faster to use <code>FlxG.overlaps()</code>.
	* WARNING: Currently tilemaps do NOT support screen space overlap checks!
	* 
	* @param	ObjectOrGroup	The object or group being tested.
	* @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
	* @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
	* 
	* @return	Whether or not the two objects overlap.
	*/
    public overlaps(ObjectOrGroup, InScreenSpace: bool = false, Camera: Camera = null): bool {

        if (ObjectOrGroup.isGroup)
        {
            var results: bool = false;
            var i: number = 0;
            var members = <Group> ObjectOrGroup.members;

            while (i < length)
            {
                if (this.overlaps(members[i++], InScreenSpace, Camera))
                {
                    results = true;
                }
            }

            return results;

        }

        /*
        if (typeof ObjectOrGroup === 'FlxTilemap')
        {
            //Since tilemap's have to be the caller, not the target, to do proper tile-based collisions,
            // we redirect the call to the tilemap overlap here.
            return ObjectOrGroup.overlaps(this, InScreenSpace, Camera);
        }
        */

        //var object: GameObject = ObjectOrGroup;

        if (!InScreenSpace)
        {
            return (ObjectOrGroup.x + ObjectOrGroup.width > this.x) && (ObjectOrGroup.x < this.x + this.width) &&
                    (ObjectOrGroup.y + ObjectOrGroup.height > this.y) && (ObjectOrGroup.y < this.y + this.height);
        }

        if (Camera == null)
        {
            Camera = this._game.camera;
        }

        var objectScreenPos: Point = ObjectOrGroup.getScreenXY(null, Camera);

        this.getScreenXY(this._point, Camera);

        return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
                (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
    }

    /**
	* Checks to see if this <code>GameObject</code> were located at the given position, would it overlap the <code>GameObject</code> or <code>FlxGroup</code>?
	* This is distinct from overlapsPoint(), which just checks that ponumber, rather than taking the object's size numbero account.
	* WARNING: Currently tilemaps do NOT support screen space overlap checks!
	* 
	* @param	X				The X position you want to check.  Pretends this object (the caller, not the parameter) is located here.
	* @param	Y				The Y position you want to check.  Pretends this object (the caller, not the parameter) is located here.
	* @param	ObjectOrGroup	The object or group being tested.
	* @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.  Default is false, or "only compare in world space."
	* @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
	* 
	* @return	Whether or not the two objects overlap.
	*/
    public overlapsAt(X: number, Y: number, ObjectOrGroup, InScreenSpace: bool = false, Camera: Camera = null): bool {

        if (ObjectOrGroup.isGroup)
        {
            var results: bool = false;
            var basic;
            var i: number = 0;
            var members = ObjectOrGroup.members;

            while (i < length)
            {
                if (this.overlapsAt(X, Y, members[i++], InScreenSpace, Camera))
                {
                    results = true;
                }
            }

            return results;
        }

        /*
        if (typeof ObjectOrGroup === 'FlxTilemap')
        {
            //Since tilemap's have to be the caller, not the target, to do proper tile-based collisions,
            // we redirect the call to the tilemap overlap here.
            //However, since this is overlapsAt(), we also have to invent the appropriate position for the tilemap.
            //So we calculate the offset between the player and the requested position, and subtract that from the tilemap.
            var tilemap: FlxTilemap = ObjectOrGroup;
            return tilemap.overlapsAt(tilemap.x - (X - this.x), tilemap.y - (Y - this.y), this, InScreenSpace, Camera);
        }
        */

        //var object: GameObject = ObjectOrGroup;

        if (!InScreenSpace)
        {
            return (ObjectOrGroup.x + ObjectOrGroup.width > X) && (ObjectOrGroup.x < X + this.width) &&
                    (ObjectOrGroup.y + ObjectOrGroup.height > Y) && (ObjectOrGroup.y < Y + this.height);
        }

        if (Camera == null)
        {
            Camera = this._game.camera;
        }

        var objectScreenPos: Point = ObjectOrGroup.getScreenXY(null, Camera);

        this._point.x = X - Camera.scroll.x * this.scrollFactor.x; //copied from getScreenXY()
        this._point.y = Y - Camera.scroll.y * this.scrollFactor.y;
        this._point.x += (this._point.x > 0) ? 0.0000001 : -0.0000001;
        this._point.y += (this._point.y > 0) ? 0.0000001 : -0.0000001;

        return (objectScreenPos.x + ObjectOrGroup.width > this._point.x) && (objectScreenPos.x < this._point.x + this.width) &&
            (objectScreenPos.y + ObjectOrGroup.height > this._point.y) && (objectScreenPos.y < this._point.y + this.height);
    }

    /**
	* Checks to see if a ponumber in 2D world space overlaps this <code>GameObject</code> object.
	* 
	* @param	Point			The ponumber in world space you want to check.
	* @param	InScreenSpace	Whether to take scroll factors numbero account when checking for overlap.
	* @param	Camera			Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
	* 
	* @return	Whether or not the ponumber overlaps this object.
	*/
    public overlapsPoint(point: Point, InScreenSpace: bool = false, Camera: Camera = null): bool {

        if (!InScreenSpace)
        {
            return (point.x > this.x) && (point.x < this.x + this.width) && (point.y > this.y) && (point.y < this.y + this.height);
        }

        if (Camera == null)
        {
            Camera = this._game.camera;
        }

        var X: number = point.x - Camera.scroll.x;
        var Y: number = point.y - Camera.scroll.y;

        this.getScreenXY(this._point, Camera);

        return (X > this._point.x) && (X < this._point.x + this.width) && (Y > this._point.y) && (Y < this._point.y + this.height);

    }

    /**
	* Check and see if this object is currently on screen.
	* 
	* @param	Camera		Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
	* 
	* @return	Whether the object is on screen or not.
	*/
    public onScreen(Camera: Camera = null): bool {

        if (Camera == null)
        {
            Camera = this._game.camera;
        }

        this.getScreenXY(this._point, Camera);

        return (this._point.x + this.width > 0) && (this._point.x < Camera.width) && (this._point.y + this.height > 0) && (this._point.y < Camera.height);

    }

    /**
	* Call this to figure out the on-screen position of the object.
	* 
	* @param	Camera		Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
	* @param	Point		Takes a <code>Point</code> object and assigns the post-scrolled X and Y values of this object to it.
	* 
	* @return	The <code>Point</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
	*/
    public getScreenXY(point: Point = null, Camera: Camera = null): Point {

        if (point == null)
        {
            point = new Point();
        }

        if (Camera == null)
        {
            Camera = this._game.camera;
        }

        point.x = this.x - Camera.scroll.x * this.scrollFactor.x;
        point.y = this.y - Camera.scroll.y * this.scrollFactor.y;
        point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
        point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

        return point;

    }

    /**
    * Whether the object collides or not.  For more control over what directions
    * the object will collide from, use collision constants (like LEFT, FLOOR, etc)
    * to set the value of allowCollisions directly.
    */
    public get solid(): bool {
        return (this.allowCollisions & GameObject.ANY) > GameObject.NONE;
    }

    /**
    * @private
    */
    public set solid(Solid: bool) {

        if (Solid)
        {
            this.allowCollisions = GameObject.ANY;
        }
        else
        {
            this.allowCollisions = GameObject.NONE;
        }

    }

    /**
    * Retrieve the midponumber of this object in world coordinates.
    * 
    * @Point	Allows you to pass in an existing <code>Point</code> object if you're so inclined.  Otherwise a new one is created.
    * 
    * @return	A <code>Point</code> object containing the midponumber of this object in world coordinates.
    */
    public getMidpoint(point: Point = null): Point {

        if (point == null)
        {
            point = new Point();
        }

        point.x = this.x + this.width * 0.5;
        point.y = this.y + this.height * 0.5;

        return point;

    }

    /**
    * Handy for reviving game objects.
    * Resets their existence flags and position.
    * 
    * @param	X	The new X position of this object.
    * @param	Y	The new Y position of this object.
    */
    public reset(X: number, Y: number) {

        this.revive();
        this.touching = GameObject.NONE;
        this.wasTouching = GameObject.NONE;
        this.x = X;
        this.y = Y;
        this.last.x = X;
        this.last.y = Y;
        this.velocity.x = 0;
        this.velocity.y = 0;

    }

    /**
    * Handy for checking if this object is touching a particular surface.
    * For slightly better performance you can just &amp; the value directly numbero <code>touching</code>.
    * However, this method is good for readability and accessibility.
    * 
    * @param	Direction	Any of the collision flags (e.g. LEFT, FLOOR, etc).
    * 
    * @return	Whether the object is touching an object in (any of) the specified direction(s) this frame.
    */
    public isTouching(Direction: number): bool {
        return (this.touching & Direction) > GameObject.NONE;
    }

    /**
    * Handy for checking if this object is just landed on a particular surface.
    * 
    * @param	Direction	Any of the collision flags (e.g. LEFT, FLOOR, etc).
    * 
    * @return	Whether the object just landed on (any of) the specified surface(s) this frame.
    */
    public justTouched(Direction: number): bool {
        return ((this.touching & Direction) > GameObject.NONE) && ((this.wasTouching & Direction) <= GameObject.NONE);
    }

    /**
    * Reduces the "health" variable of this sprite by the amount specified in Damage.
    * Calls kill() if health drops to or below zero.
    * 
    * @param	Damage		How much health to take away (use a negative number to give a health bonus).
    */
    public hurt(Damage: number) {

        this.health = this.health - Damage;

        if (this.health <= 0)
        {
            this.kill();
        }

    }

    public destroy() {

    }

    public get x(): number {
        return this.bounds.x;
    }

    public set x(value: number) {
        this.bounds.x = value;
    }

    public get y(): number {
        return this.bounds.y;
    }

    public set y(value: number) {
        this.bounds.y = value;
    }

    public get rotation(): number {
        return this._angle;
    }

    public set rotation(value: number) {
        this._angle = this._game.math.wrap(value, 360, 0);
    }

    public get angle(): number {
        return this._angle;
    }

    public set angle(value: number) {
        this._angle = this._game.math.wrap(value, 360, 0);
    }

    public get width(): number {
        return this.bounds.width;
    }

    public get height(): number {
        return this.bounds.height;
    }


}