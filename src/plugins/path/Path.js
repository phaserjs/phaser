/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Phaser.Path contains all the functions need to create and manipulate a single Path object.
* A Path is a list of PathPoint objects connected by Hermite curves.
*
* @class Phaser.Path
* @constructor
* @param {Phaser.Game} game - A reference to the Phaser.Game instance.
* @param {number} [type=Phaser.Path.CoordinateSystems.WORLD] - The coordinate system used by the Path.
* @param {boolean} [loops=false] - Should this Path loop or not when a PathFollower reaches the end of it?
*/
Phaser.Path = function (game, type, loops) {

    if (type === undefined) { type = Phaser.Path.CoordinateSystems.WORLD; }
    if (loops === undefined) { loops = false; }

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {number} coordinateSystem - The coordinate system used by the Path.
    */
    this.coordinateSystem = type;

    /**
    * @property {boolean} loops - Should this Path loop or not when a PathFollower reaches the end of it?
    */
    this.loops = loops;

    /**
    * @property {string} cacheKey - The key of the JSON file in the cache used to define this path.
    */
    this.cacheKey = '';

    /**
    * @property {string} key - The key of the object within the JSON data. Used if there are multiple paths per JSON file.
    */
    this.key = '';

    /*
    * @property {Phaser.PathPoint} name - The name of this path.
    */
    this.name = '';

    /*
     * @property {Phaser.PathPoint} type - The Phaser.Path.PathTypes of this path.
     */
    this.type = Phaser.Path.PathTypes.PATH;

    /*
    * @property {Array} branches - A list of branches this path has.
    */
    this.branches = [];

    /**
    * @property {array} _points - A private cache of the Points on this Path.
    * @private
    */
    this._points = [];

    /**
    * @property {Phaser.Point} _offset - Default offset for PathFollowers on this path instance.
    * @private
    */
    this._offset = new Phaser.Point();

    /*
    * @property {Phaser.PathPoint} _p1 - Used for internal calculations.
    * @private
    */
    this._p1 = new Phaser.PathPoint();

    /*
    * @property {Phaser.PathPoint} _p2 - Used for internal calculations.
    * @private
    */
    this._p2 = new Phaser.PathPoint();

    /*
    * @property {Phaser.PathPoint} origin - the origin of this path. Used mostly for BRANCH paths.
    * @private
    */
    this._origin = new Phaser.Point();

};

Phaser.Path.prototype.constructor = Phaser.Path;

Phaser.Path.PathTypes = {};
Phaser.Path.BranchTypes = {};
Phaser.Path.CoordinateSystems = {};

/**
* @constant
* @type {number}
*/
Phaser.Path.PathTypes.PATH = 0;

/**
* @constant
* @type {number}
*/
Phaser.Path.PathTypes.BRANCH = 1;

/**
* @constant
* @type {number}
*/
Phaser.Path.BranchTypes.ATTACHED = 0;

/**
* @constant
* @type {number}
*/
Phaser.Path.BranchTypes.JOINED = 1;

/**
* Points are relative to the World origin.
* @constant
* @type {number}
*/
Phaser.Path.CoordinateSystems.WORLD = 1;

/**
* Points are relative to the screen origin.
* @constant
* @type {number}
*/
Phaser.Path.CoordinateSystems.SCREEN = 2;

/**
* Points are relative to the first point.
* @constant
* @type {number}
*/
Phaser.Path.CoordinateSystems.OFFSET = 3;

Phaser.Path.prototype = {

    /**
    * Initialize a Path based on the given coordinate system.
    *
    * @method Phaser.Path#create
    * @param {number|string} coordinateSystem - The Phaser.Path.CoordinateSystems type to use.
    * @param {boolean} [loops=false] - Should this Path loop or not when a PathFollower reaches the end of it?
    * @return {Phaser.Path} This Path object.
    */
    create: function (coordinateSystem, loops) {

        if (loops === undefined) { loops = false; }

        switch (coordinateSystem)
        {
            default:
                this.coordinateSystem = Phaser.Path.CoordinateSystems.WORLD;
                break;

            case 2:
            case 'SCREEN_COORDINATES':
                this.coordinateSystem = Phaser.Path.CoordinateSystems.SCREEN;
                break;

            case 3:
            case 'OFFSET_COORDINATES':
                this.coordinateSystem = Phaser.Path.CoordinateSystems.OFFSET;
                break;
        }

        this.loops = loops;

        this._points = [];

        return this;

    },

    /**
    * Clone this Path object. It clones the origin and points data.
    *
    * @method Phaser.Path#clone
    * @return {Phaser.Path} The cloned Path.
    */
    clone: function () {

        var clone = new Phaser.Path(this.coordinateSystem, this.loops);

        this.origin.clone(clone.origin);

        this.points.forEach(function(p) {
            clone._points.push(p.clone());
        });

        return clone;

    },

    /**
    * Creates a new PathPoint object, relative to the path origin, and adds it to this path.
    *
    * @method Phaser.Path#addPathPoint
    * @param {number} [x=0] - The x position of the PathPoint.
    * @param {number} [y=0] - The y position of the PathPoint.
    * @param {number} [vx=0] - The vx tangent vector value of the PathPoint.
    * @param {number} [vy=0] - The vy tangent vector value of the PathPoint.
    * @param {number} [speed=1] - The speed value of the PathPoint.
    * @param {number} [data={}] - The data object
    * @param {number} [index=null] - The index of the new path point. If not given, will add point to end of point list.
    * @return {Phaser.PathPoint} The PathPoint object that was created.
    */
    addPathPoint: function (x, y, vx, vy, speed, data, index) {

        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (vx === undefined) { vx = 0; }
        if (vy === undefined) { vy = 0; }

        var pp = new Phaser.PathPoint(x - this.origin.x, y - this.origin.y, vx, vy, speed, data);

        if (index !== null && index !== undefined)
        {
            this._points.splice(index, 0, pp);
        }
        else
        {
            this._points.push(pp);
        }

        return pp;

    },

    /**
    * Remove a PathPoint from this paths point list.
    *
    * @method Phaser.Path#removePathPoint
    * @param {number} [index] - The index of the PathPoint to remove.
    * @return {Phaser.PathPoint} The removed PathPoint object.
    */
    removePathPoint: function (index) {

        var p = this.getPathPointReference(index);

        if (p)
        {
            this._points.splice(index, 1);
        }

        return p;

    },

    /**
    * Set a PathPoint objects position and tangent vector.
    *
    * @method Phaser.Path#setPathPoint
    * @param {number} index - The index of the PathPoint in this paths point list.
    * @param {number} x - The x coordinate of the PathPoint.
    * @param {number} y - The y coordinate of the PathPoint.
    * @param {number} [vx] - The x coordinate of the tangent vector to create the curve from.
    * @param {number} [vy] - The y coordinate of the tangent vector to create the curve from.
    * @return {Phaser.PathPoint} A reference to the PathPoint object that was updated.
    */
    setPathPoint: function (index, x, y, vx, vy) {

        var p = this.getPathPointReference(index);

        if (p)
        {
            p.setTo(x, y, vx, vy);
        }

        return p;

    },

    /**
    * Translate all points in a path by the given point.
    *
    * @method Phaser.Path#translatePoints
    * @param {Phaser.Point|object} point - A Phaser.Point, or a Point-like Object with public `x` and `y` properties, that will be used to modify all points in this paths point list.
    * @return {Phaser.Path} This Path object.
    */
    translatePoints: function (point) {

        this._points.forEach(function(pnt) {
            pnt.x += point.x;
            pnt.y += point.y;
        });

        return this;

    },

    /**
    * Set the Path level offset which will affect all of this paths PathFollowers.
    *
    * @method Phaser.Path#setOffset
    * @param {number} x - The x offset.
    * @param {number} y - The y offset.
    * @return {Phaser.Path} This Path object.
    */
    setOffset: function (x, y) {

        this._offset.x = x;
        this._offset.y = y;

        return this;

    },

    /**
    * Get a point on the the current Path curve.
    *
    * @method Phaser.Path#getPointOnThisCurve
    * @param {Phaser.Hermite} curve - A Phaser.Hermite curve object.
    * @param {number} [t=0 .. 1.0] - The distance on the curve to get the point from. Where 0 is the start of the curve, and 1 is the end.
    * @return {Phaser.Point} A point containing the x and y values at the specified distance (t) value in the curve.
    */
    getPointOnThisCurve: function (curve, t) {

        if (!curve)
        {
            return null;
        }

        var pnt = curve.getPoint(t);

        pnt.x += this._offset.x;
        pnt.y += this._offset.y;

        return pnt;

    },

    /**
    * Gets the points on the curve representing the end points of the line segments that make up the curve.
    *
    * @method Phaser.Path#getControlPointsOnThisCurve
    * @param {Phaser.Hermite} curve - A Phaser.Hermite curve.
    * @return {array} An array of points representing the end points of 10 line segments that make up the curve.
    */
    getControlPointsOnThisCurve: function (curve) {

        var pnts = Phaser.ArrayUtils.numberArrayStep(0, 1.1, 0.1).map(function(num) {
            return this.getPointOnThisCurve(curve, num);
        }, this);

        return pnts;

    },

    /**
    * Get a PathPoint from this path. Automatically handles path looping.
    * 
    * The values from the PathPoint are copied into the given PathPoint object, which must
    * be a reference to a pre-existing PathPoint, as it's not returned by this method.
    *
    * @method Phaser.Path#getPathPoint
    * @param {number} index - The index of the point in this path to get.
    * @param {Phaser.PathPoint} point - A PathPoint object into which the found point object is cloned.
    * @return {boolean} false if the index is past the end of the path and it doesn't loop, otherwise true.
    */
    getPathPoint: function (index, point) {

        var i = this.loops ? index % this._points.length : index;

        //  If index is in the points list range
        if (this._points.length > i)
        {
            point.copy(this._points[i]);

            switch (this.coordinateSystem)
            {
                case Phaser.Path.CoordinateSystems.SCREEN:

                    point.x -= this.game.camera.x;
                    point.y -= this.game.camera.y;
                    break;

                case Phaser.Path.CoordinateSystems.OFFSET:

                    point.x += this.origin.x;
                    point.y += this.origin.y;
                    break;
            }

            return true;
        }
        else
        {
            //  The path doesn't loop and the index is out of range, so fail
            return false;
        }

    },

    /**
    * Get a reference to a PathPoint from this Path, handle path looping.
    * 
    * NOTE: because this is a PathPoint reference, it does not take into account the coordinateSystem selected, it will be WORLD, or OFFSET unmodified
    *
    * @method Phaser.Path#getPathPointReference
    * @param {number} index - The index of the point in this path to get.
    * @return {Phaser.PathPoint} A reference to the PathPoint object in this Path, or null if index is out of range.
    */
    getPathPointReference: function (index) {

        var i = this.loops ? index % this._points.length : index;

        //  If index is in the points list range
        if (this._points.length > i)
        {
            return this._points[i];
        }

        //  The path doesn't loop and the index is out of range, fail
        return null;

    },

    /**
    * Get the curve from the given point index to the next.
    * 
    * If the curve has been created previously, use that definition again, otherwise calculate it now.
    *
    * @method Phaser.Path#getCurve
    * @param {number} [index=0] - The index of the point in this path to get the curve from.
    * @return {Phaser.Hermite} A new Hermite object representing the curve starting at the 'index' path point.
    */
    getCurve: function (index) {

        if (index === undefined) { index = 0; }

        //  Beginning of the curve
        if (!this.getPathPoint(index, this._p1))
        {
            return null;
        }

        //  Has this curve been calculated already?
        if (this._p1.curve)
        {
            return this._p1.curve;
        }

        //  End of the curve
        if (!this.getPathPoint(index + 1, this._p2))
        {
            if (!this._p1.branchPath)
            {
                return null;
            }

            //  We joined another Path
            var newPath = this._p1.branchPath;
            var joinIndex = this._p1.branchPointIndex;

            if (!newPath.getPathPoint(joinIndex + 1, this._p2))
            {
                return null;
            }
        }

        //  Create and return the new Hermite object
        this._p1.curve = new Phaser.Hermite(this._p1.x, this._p1.y, this._p2.x, this._p2.y, this._p1.vx, this._p1.vy, this._p2.vx, this._p2.vy);

        this.curvePointIndex = index;

        return this._p1.curve;

    },

    /**
    * Find the first matching PathPoint in this path.
    * It works by taking the given PathPoint object, and then iterating through all points
    * in this Path until it finds one with the same values, then returns the index to it.
    *
    * @method Phaser.Path#pointIndex
    * @param {Phaser.PathPoint} pathPoint - The PathPoint object that will have its values compared to all the points in this Path.
    * @return {number} The index of the PathPoint in this Path if an equal match is found, or -1 if no match is found.
    */
    pointIndex: function (pathPoint) {

        var l = this._points.length;

        for (var i = 0; i < l; i++)
        {
            if (this.coordinateSystem === Phaser.Path.CoordinateSystems.OFFSET && i !== 0)
            {
                if (pathPoint.equals(this._points[i], this._points[0].x, this._points[0].y))
                {
                    return i;
                }
            }
            else
            {
                if (pathPoint.equals(this._points[i]))
                {
                    return i;
                }
            }
        }

        return -1;

    },

    /**
    * Is the given PathPoint index the end of this path?
    *
    * @method Phaser.Path#atEnd
    * @param {number} index - The index of the PathPoint to test.
    * @return {boolean} true if index is the last point in this path.
    */
    atEnd: function (index) {

        //  If the path loops, the end of the path is the end of the last curve
        if (this.loops)
        {
            return (index === this._points.length);
        }

        //  If the path doesn't loop, the end of the path is the last point on it
        return (index === this._points.length - 1);

    },

    /**
    * The total number of PathPoints in this Path.
    * 
    * @method Phaser.Path#numPoints
    * return {number} The total number of PathPoints in this Path.
    */
    numPoints: function () {

        return this._points.length;

    },

    /*
    *  DATA PROCESSING
    */

    /**
    * Process the data associated with a point on this Path.
    * Used by Phaser.PathFollower objects as they pass each control point.
    * 
    * @method Phaser.Path#processData
    * @param {Phaser.PathFollower} follower - The PathFollower that is processing the data.
    * @param {number} pathPointIndex - The index of the path point to process.
    * @param {boolean} reversing - Whether or not the follower is traversing the path in reverse.
    * @return {Phaser.PathPoint} The PathPoint that has been processed.
    */
    processData: function (follower, pathPointIndex, reversing) {

        if (this.getPathPoint(pathPointIndex, this._p1))
        {
            //  If there is a branch that can be taken from this point, 
            //  trigger an event to decide whether to take it or stay on the current path.
            //  Branches are forwards facing so they are ignored when the follower is reversing.
            if (this._p1.branchPath && !reversing)
            {
                follower.dispatchEvent({
                    type: Phaser.PathFollower.EVENT_BRANCH_CHOICE,
                    target: follower,
                    data: this._p1.clone()
                });
            }

            //  If there is information in the data member of this point
            if (this._p1.data && this._p1.data.type)
            {
                switch (this._p1.data.type)
                {
                    case Phaser.PathPoint.DATA_PAUSE:

                        follower.pause(this._p1.data.value);
                        break;

                    case Phaser.PathPoint.DATA_COUNTER:

                        // first time past, set the count
                        if (follower.branchCount === 0)
                        {
                            follower.branchCount = this._p1.data.value;
                        }
                        else
                        {
                            //  After that decrease the count
                            follower.branchCount--;

                            if (follower.branchCount <= 0)
                            {
                                follower.branchCount = 0;

                                //  Trigger event when counter expires
                                follower.dispatchEvent({
                                    type: Phaser.PathFollower.EVENT_COUNT_FINISH,
                                    target: follower,
                                    data: this._p1.clone()
                                });
                            }
                        }
                        break;
                }
            }

            //  Trigger event when passing any point on the path
            follower.dispatchEvent({
                type: Phaser.PathFollower.EVENT_REACHED_POINT,
                target: follower,
                data: this._p1.clone()
            });
        }

        return this._p1;

    },

    /**
    * If your Path has 3 points or more, this will walk through it and auto-smooth them out.
    * Note: It ignores branches.
    *
    * @method Phaser.Path#smooth
    * @return {Phaser.Path} This Path object.
    */
    smooth: function () {

        if (this._points.length === 0)
        {
            return this;
        }

        var i;
        var thisPoint;
        var p1;
        var p2;
        var dx;
        var dy;

        for (i = 1; i < this._points.length - 1; i++)
        {
            thisPoint = this.getPathPointReference(i);

            p1 = this.getPathPointReference(i - 1);
            p2 = this.getPathPointReference(i + 1);

            dx = p2.x - p1.x;
            dy = p2.y - p1.y;

            thisPoint.setTangent(dx, dy);
        }

        if (this.loops)
        {
            i = this._points.length - 1;

            thisPoint = this.getPathPointReference(i);

            p1 = this.getPathPointReference(i - 1);
            p2 = this.getPathPointReference(0);

            dx = p2.x - p1.x;
            dy = p2.y - p1.y;

            thisPoint.setTangent(dx, dy);

            i = 0;

            thisPoint = this.getPathPointReference(i);

            p1 = this.getPathPointReference(this._points.length - 1);
            p2 = this.getPathPointReference(1);

            dx = p2.x - p1.x;
            dy = p2.y - p1.y;

            thisPoint.setTangent(dx, dy);
        }

        return this;

    },

    /**
    * Draw the path on given canvas context. Used for debugging.
    * 
    * @method Phaser.Path#debug
    * @param {CanvasContext2D} ctx - The canvas context to draw the path on.
    * @param {boolean} [active=false] - Whether or not to highlight the active segments of this Path or not.
    * @return {Phaser.Path} This Path object.
    */
    debug: function (ctx, active) {

        var lineColor = '#333333';

        if (active)
        {
            lineColor = '#ffff00';
        }

        if (this._points.length === 0)
        {
            return this;
        }

        this._p1.setTo(0, 0);

        //  Draw the lines

        var lastPoint = this._points.length;

        if (!this.loops)
        {
            lastPoint--;
        }

        var p = new Phaser.PathPoint();

        for (var i = 0; i < lastPoint; i++)
        {
            var curve = this.getCurve(i);

            this.getPathPoint(i, p);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(100, 0, 250)';

            ctx.save();

            //  Control Points
            var controlPoints = this.getControlPointsOnThisCurve(curve);

            //  Draw lines
            ctx.beginPath();

            controlPoints.forEach(function(pnt, index) {

                if (!!pnt)
                {
                    if (index === 0)
                    {
                        ctx.moveTo(pnt.x, pnt.y);
                    }
                    else
                    {
                        ctx.lineTo(pnt.x, pnt.y);
                    }
                }

            });

            ctx.stroke();
            ctx.closePath();

            if (p.active)
            {
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 1;

                //  Copy control points to the point object
                this.getPathPointReference(i).controlPoints = controlPoints;

                controlPoints.forEach(function(pnt) {

                    ctx.beginPath();

                    ctx.arc(pnt.x, pnt.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.closePath();

                });
            }

            ctx.restore();
        }
        
        return this;

    },

    /**
    * Serializes this Path into a JSON object and returns it.
    * 
    * @methods Phaser.Path#toJSON
    * @return {Object} A JSON object representing this Path.
    */
    toJSON: function () {

        return {
            name: this.name,
            id: this.id,
            type: this.type,
            coordinateSystem: this.coordinateSystem,
            loops: this.loops,
            speed: 1,
            pointList: this._points.map(function(p) {
                return p.toJSON();
            }),
        };

    }

};

/**
* @property {Array} - The list of PathPoints that make up this path.
* @readonly
*/
Object.defineProperty(Phaser.Path.prototype, 'points', {

    get: function () {

        return this._points;

    }

});

/**
* @property {number} - The number of points in this path.
* @readonly
*/
Object.defineProperty(Phaser.Path.prototype, 'length', {

    get: function () {

        return this._points.length;

    }

});

/**
* @property {Phaser.Point} - The origin of the path.
*/
Object.defineProperty(Phaser.Path.prototype, 'origin', {

    get: function() {

        return this._origin;

    },

    set: function (val) {

        this._origin.setTo(val.x, val.y);

    }

});