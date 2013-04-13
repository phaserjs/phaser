/// <reference path="Cameras.ts" />
/// <reference path="Game.ts" />
/// <reference path="GameMath.ts" />
/// <reference path="Group.ts" />
/// <reference path="geom/Rectangle.ts" />
/// <reference path="geom/Point.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="Tilemap.ts" />
/// <reference path="system/Camera.ts" />
/// <reference path="system/QuadTree.ts" />

class World {

    constructor(game: Game, width: number, height: number) {

        this._game = game;

        this._cameras = new Cameras(this._game, 0, 0, width, height);

        this._game.camera = this._cameras.current;

        this.group = new Group(this._game, 0);

        this.bounds = new Rectangle(0, 0, width, height);

        this.worldDivisions = 6;

    }

    private _game: Game;
    private _cameras: Cameras;

    public group: Group;
    public bounds: Rectangle;
    public worldDivisions: number;

    public update() {

        this.group.preUpdate();
        this.group.update();
        this.group.postUpdate();

        this._cameras.update();

    }

    public render() {

        //  Unlike in flixel our render process is camera driven, not group driven
        this._cameras.render();

    }

    public destroy() {

        this.group.destroy();

        this._cameras.destroy();

    }

    //  World methods

    public setSize(width: number, height: number) {

        this.bounds.width = width;
        this.bounds.height = height;

    }

    public get width(): number {
        return this.bounds.width;
    }

    public set width(value: number) {
        this.bounds.width = value;
    }

    public get height(): number {
        return this.bounds.height;
    }

    public set height(value: number) {
        this.bounds.height = value;
    }

    public get centerX(): number {
        return this.bounds.halfWidth;
    }

    public get centerY(): number {
        return this.bounds.halfHeight;
    }

    public get randomX(): number {
        return Math.round(Math.random() * this.bounds.width);
    }

    public get randomY(): number {
        return Math.round(Math.random() * this.bounds.height);
    }

    //  Cameras

    public addExistingCamera(cam: Camera): Camera {
        //return this._cameras.addCamera(x, y, width, height);
        return cam;
    }

    public createCamera(x: number, y: number, width: number, height: number): Camera {
        return this._cameras.addCamera(x, y, width, height);
    }

    public removeCamera(id: number): bool {
        return this._cameras.removeCamera(id);
    }

    public getAllCameras(): Camera[] {
        return this._cameras.getAll();
    }

    //  Sprites

    public addExistingSprite(sprite: Sprite): Sprite {
        return <Sprite> this.group.add(sprite);
    }

    public createSprite(x: number, y: number, key?: string = ''): Sprite {
        return <Sprite> this.group.add(new Sprite(this._game, x, y, key));
    }

    public createGroup(MaxSize?: number = 0): Group {
        return <Group> this.group.add(new Group(this._game, MaxSize));
    }

    //  Tilemaps

    public createTilemap(key:string, mapData:string, format:number, tileWidth?:number,tileHeight?:number): Tilemap {
        return <Tilemap> this.group.add(new Tilemap(this._game, key, mapData, format, tileWidth, tileHeight));
    }

    //  Emitters

    public createParticle(): Particle {
        return new Particle(this._game);
    }

    public createEmitter(x?: number = 0, y?: number = 0, size?:number = 0): Emitter {
        return <Emitter> this.group.add(new Emitter(this._game, x, y, size));
    }

    //  Collision

    /**
    * Call this function to see if one <code>GameObject</code> overlaps another.
    * Can be called with one object and one group, or two groups, or two objects,
    * whatever floats your boat! For maximum performance try bundling a lot of objects
    * together using a <code>FlxGroup</code> (or even bundling groups together!).
    * 
    * <p>NOTE: does NOT take objects' scrollfactor into account, all overlaps are checked in world space.</p>
    * 
    * @param	ObjectOrGroup1	The first object or group you want to check.
    * @param	ObjectOrGroup2	The second object or group you want to check.  If it is the same as the first, flixel knows to just do a comparison within that group.
    * @param	NotifyCallback	A function with two <code>GameObject</code> parameters - e.g. <code>myOverlapFunction(Object1:GameObject,Object2:GameObject)</code> - that is called if those two objects overlap.
    * @param	ProcessCallback	A function with two <code>GameObject</code> parameters - e.g. <code>myOverlapFunction(Object1:GameObject,Object2:GameObject)</code> - that is called if those two objects overlap.  If a ProcessCallback is provided, then NotifyCallback will only be called if ProcessCallback returns true for those objects!
    * 
    * @return	Whether any overlaps were detected.
    */
    public overlap(ObjectOrGroup1: Basic = null, ObjectOrGroup2: Basic = null, NotifyCallback = null, ProcessCallback = null): bool {

        if (ObjectOrGroup1 == null)
        {
            ObjectOrGroup1 = this.group;
        }

        if (ObjectOrGroup2 == ObjectOrGroup1)
        {
            ObjectOrGroup2 = null;
        }

        QuadTree.divisions = this.worldDivisions;

        var quadTree: QuadTree = new QuadTree(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

        quadTree.load(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback);

        var result: bool = quadTree.execute();

        quadTree.destroy();

        quadTree = null;

        return result;

    }

    /**
     * The main collision resolution in flixel.
     * 
     * @param	Object1 	Any <code>Sprite</code>.
     * @param	Object2		Any other <code>Sprite</code>.
     * 
     * @return	Whether the objects in fact touched and were separated.
     */
    public static separate(Object1, Object2): bool {

        var separatedX: bool = World.separateX(Object1, Object2);
        var separatedY: bool = World.separateY(Object1, Object2);

        return separatedX || separatedY;

    }

    /**
     * The X-axis component of the object separation process.
     * 
     * @param	Object1 	Any <code>Sprite</code>.
     * @param	Object2		Any other <code>Sprite</code>.
     * 
     * @return	Whether the objects in fact touched and were separated along the X axis.
     */
    public static separateX(Object1, Object2): bool {

        //can't separate two immovable objects
        var obj1immovable: bool = Object1.immovable;
        var obj2immovable: bool = Object2.immovable;

        if (obj1immovable && obj2immovable)
        {
            return false;
        }

        //If one of the objects is a tilemap, just pass it off.
        /*
        if (typeof Object1 === 'FlxTilemap')
        {
            return Object1.overlapsWithCallback(Object2, separateX);
        }

        if (typeof Object2 === 'FlxTilemap')
        {
            return Object2.overlapsWithCallback(Object1, separateX, true);
        }
        */

        //First, get the two object deltas
        var overlap: number = 0;
        var obj1delta: number = Object1.x - Object1.last.x;
        var obj2delta: number = Object2.x - Object2.last.x;

        if (obj1delta != obj2delta)
        {
            //Check if the X hulls actually overlap
            var obj1deltaAbs: number = (obj1delta > 0) ? obj1delta : -obj1delta;
            var obj2deltaAbs: number = (obj2delta > 0) ? obj2delta : -obj2delta;
            var obj1rect: Rectangle = new Rectangle(Object1.x - ((obj1delta > 0) ? obj1delta : 0), Object1.last.y, Object1.width + ((obj1delta > 0) ? obj1delta : -obj1delta), Object1.height);
            var obj2rect: Rectangle = new Rectangle(Object2.x - ((obj2delta > 0) ? obj2delta : 0), Object2.last.y, Object2.width + ((obj2delta > 0) ? obj2delta : -obj2delta), Object2.height);

            if ((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height))
            {
                var maxOverlap: number = obj1deltaAbs + obj2deltaAbs + GameObject.OVERLAP_BIAS;

                //If they did overlap (and can), figure out by how much and flip the corresponding flags
                if (obj1delta > obj2delta)
                {
                    overlap = Object1.x + Object1.width - Object2.x;

                    if ((overlap > maxOverlap) || !(Object1.allowCollisions & GameObject.RIGHT) || !(Object2.allowCollisions & GameObject.LEFT))
                    {
                        overlap = 0;
                    }
                    else
                    {
                        Object1.touching |= GameObject.RIGHT;
                        Object2.touching |= GameObject.LEFT;
                    }
                }
                else if (obj1delta < obj2delta)
                {
                    overlap = Object1.x - Object2.width - Object2.x;

                    if ((-overlap > maxOverlap) || !(Object1.allowCollisions & GameObject.LEFT) || !(Object2.allowCollisions & GameObject.RIGHT))
                    {
                        overlap = 0;
                    }
                    else
                    {
                        Object1.touching |= GameObject.LEFT;
                        Object2.touching |= GameObject.RIGHT;
                    }

                }

            }
        }

        //Then adjust their positions and velocities accordingly (if there was any overlap)
        if (overlap != 0)
        {
            var obj1v: number = Object1.velocity.x;
            var obj2v: number = Object2.velocity.x;

            if (!obj1immovable && !obj2immovable)
            {
                overlap *= 0.5;
                Object1.x = Object1.x - overlap;
                Object2.x += overlap;

                var obj1velocity: number = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                var obj2velocity: number = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                var average: number = (obj1velocity + obj2velocity) * 0.5;
                obj1velocity -= average;
                obj2velocity -= average;
                Object1.velocity.x = average + obj1velocity * Object1.elasticity;
                Object2.velocity.x = average + obj2velocity * Object2.elasticity;
            }
            else if (!obj1immovable)
            {
                Object1.x = Object1.x - overlap;
                Object1.velocity.x = obj2v - obj1v * Object1.elasticity;
            }
            else if (!obj2immovable)
            {
                Object2.x += overlap;
                Object2.velocity.x = obj1v - obj2v * Object2.elasticity;
            }

            return true;
        }
        else
        {
            return false;
        }

    }

    /**
     * The Y-axis component of the object separation process.
     * 
     * @param	Object1 	Any <code>Sprite</code>.
     * @param	Object2		Any other <code>Sprite</code>.
     * 
     * @return	Whether the objects in fact touched and were separated along the Y axis.
     */
    public static separateY(Object1, Object2): bool {

        //can't separate two immovable objects

        var obj1immovable: bool = Object1.immovable;
        var obj2immovable: bool = Object2.immovable;

        if (obj1immovable && obj2immovable)
            return false;

        //If one of the objects is a tilemap, just pass it off.
        /*
        if (typeof Object1 === 'FlxTilemap')
        {
            return Object1.overlapsWithCallback(Object2, separateY);
        }

        if (typeof Object2 === 'FlxTilemap')
        {
            return Object2.overlapsWithCallback(Object1, separateY, true);
        }
        */

        //First, get the two object deltas
        var overlap: number = 0;
        var obj1delta: number = Object1.y - Object1.last.y;
        var obj2delta: number = Object2.y - Object2.last.y;

        if (obj1delta != obj2delta)
        {
            //Check if the Y hulls actually overlap
            var obj1deltaAbs: number = (obj1delta > 0) ? obj1delta : -obj1delta;
            var obj2deltaAbs: number = (obj2delta > 0) ? obj2delta : -obj2delta;
            var obj1rect: Rectangle = new Rectangle(Object1.x, Object1.y - ((obj1delta > 0) ? obj1delta : 0), Object1.width, Object1.height + obj1deltaAbs);
            var obj2rect: Rectangle = new Rectangle(Object2.x, Object2.y - ((obj2delta > 0) ? obj2delta : 0), Object2.width, Object2.height + obj2deltaAbs);

            if ((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height))
            {
                var maxOverlap: number = obj1deltaAbs + obj2deltaAbs + GameObject.OVERLAP_BIAS;

                //If they did overlap (and can), figure out by how much and flip the corresponding flags
                if (obj1delta > obj2delta)
                {
                    overlap = Object1.y + Object1.height - Object2.y;

                    if ((overlap > maxOverlap) || !(Object1.allowCollisions & GameObject.DOWN) || !(Object2.allowCollisions & GameObject.UP))
                    {
                        overlap = 0;
                    }
                    else
                    {
                        Object1.touching |= GameObject.DOWN;
                        Object2.touching |= GameObject.UP;
                    }
                }
                else if (obj1delta < obj2delta)
                {
                    overlap = Object1.y - Object2.height - Object2.y;

                    if ((-overlap > maxOverlap) || !(Object1.allowCollisions & GameObject.UP) || !(Object2.allowCollisions & GameObject.DOWN))
                    {
                        overlap = 0;
                    }
                    else
                    {
                        Object1.touching |= GameObject.UP;
                        Object2.touching |= GameObject.DOWN;
                    }
                }
            }
        }

        //Then adjust their positions and velocities accordingly (if there was any overlap)
        if (overlap != 0)
        {
            var obj1v: number = Object1.velocity.y;
            var obj2v: number = Object2.velocity.y;

            if (!obj1immovable && !obj2immovable)
            {
                overlap *= 0.5;
                Object1.y = Object1.y - overlap;
                Object2.y += overlap;

                var obj1velocity: number = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                var obj2velocity: number = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                var average: number = (obj1velocity + obj2velocity) * 0.5;
                obj1velocity -= average;
                obj2velocity -= average;
                Object1.velocity.y = average + obj1velocity * Object1.elasticity;
                Object2.velocity.y = average + obj2velocity * Object2.elasticity;
            }
            else if (!obj1immovable)
            {
                Object1.y = Object1.y - overlap;
                Object1.velocity.y = obj2v - obj1v * Object1.elasticity;
                //This is special case code that handles cases like horizontal moving platforms you can ride
                if (Object2.active && Object2.moves && (obj1delta > obj2delta))
                {
                    Object1.x += Object2.x - Object2.last.x;
                }
            }
            else if (!obj2immovable)
            {
                Object2.y += overlap;
                Object2.velocity.y = obj1v - obj2v * Object2.elasticity;
                //This is special case code that handles cases like horizontal moving platforms you can ride
                if (Object1.active && Object1.moves && (obj1delta < obj2delta))
                {
                    Object2.x += Object1.x - Object1.last.x;
                }
            }

            return true;
        }
        else
        {
            return false;
        }
    }

}