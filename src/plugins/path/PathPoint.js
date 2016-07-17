/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The PathPoint class contains data and functions for each point on a Path.
*
* @class Phaser.PathPoint
* @constructor
* @param {number} x - The x coordinate of the PathPoint.
* @param {number} y - The y coordinate of the PathPoint.
* @param {number} vx - The x coordinate of the tangent vector to create the curve from.
* @param {number} vy - The y coordinate of the tangent vector to create the curve from.
* @param {number} [speed=1] - The speed multiplier for PathFollowers on this Path segment.
* @param {object} [data] - The data associated with this point, e.g.: { type: PathPoint.DATA_VALUE, value: XXX }
* @param {Phaser.Path} [branchPath] - A branched path which is attached to this point.
* @param {number} [branchPointIndex] - The index where the branch is attached to on the new path.
*/
Phaser.PathPoint = function (x, y, vx, vy, speed, data, branchPath, branchPointIndex) {

    if (speed === undefined) { speed = 1; }
    if (data === undefined) { data = { type: 0, value: 0 }; }
    if (branchPath === undefined) { branchPath = null; }
    if (branchPointIndex === undefined) { branchPointIndex = 0; }

    /**
    * @property {number} x - The x coordinate of the PathPoint.
    */
    this.x = x;

    /**
    * @property {number} y - The y coordinate of the PathPoint.
    */
    this.y = y;

    /**
    * @property {number} vx - The x coordinate of the tangent vector to create the curve from.
    */
    this.vx = vx;

    /**
    * @property {number} vy - The y coordinate of the tangent vector to create the curve from.
    */
    this.vy = vy;

    /**
    * @property {number} speed - The speed multiplier for PathFollowers on this path segment.
    */
    this.speed = speed;

    /**
    * @property {object} data - Data associated with this point eg: { type: PathPoint.DATA_VALUE, value: XXX }
    */
    this.data = data;

    /**
    * @property {Phaser.Path} branchPath - A branched path which is attached at this point.
    */
    this.branchPath = branchPath;

    /**
    * @property {number} branchPointIndex - The index where the branch is attached to on the new path.
    */
    this.branchPointIndex = branchPointIndex;

    /**
    * @property {number} branchType - The branch type of the path this point is on. Either 0 (attached) or 1 (joined)
    */
    this.branchType = 0;

    /**
    * @property {number} curve - Once the Hermite curve is calculated, store it to avoid recalculation later.
    * @protected
    */
    this.curve = null;

    /**
    * @property {boolean} active - Is this point a selected (or active) point?
    * @warn For Path Editor use only
    */
    this.active = false;

    /**
    * @property {array} controlPoints - A list of Phaser.Point objects representing the control points on the segment.
    * @warn For Path Editor use only
    */
    this.controlPoints = null;

};

Phaser.PathPoint.prototype.constructor = Phaser.PathPoint;

/**
* @constant
* @type {number}
*/
Phaser.PathPoint.DATA_NONE = 0;

/**
* @constant
* @type {number}
*/
Phaser.PathPoint.DATA_PAUSE = 1;

/**
* @constant
* @type {number}
*/
Phaser.PathPoint.DATA_VALUE = 2;

/**
* @constant
* @type {number}
*/
Phaser.PathPoint.DATA_COUNTER = 3;

Phaser.PathPoint.prototype = {

    /**
    * Sets the x, y and optionally vx and vy properties of this PathPoint.
    * 
    * @method Phaser.PathPoint#setTo
    * @param {number} x - The x coordinate of the PathPoint.
    * @param {number} y - The y coordinate of the PathPoint.
    * @param {number} [vx] - The x coordinate of the tangent vector to create the curve from.
    * @param {number} [vy] - The y coordinate of the tangent vector to create the curve from.
    * @return {Phaser.PathPoint} This object.
    */
    setTo: function (x, y, vx, vy) {

        this.x = x;
        this.y = y;

        if (vx !== undefined)
        {
            this.vx = vx;
        }

        if (vy !== undefined)
        {
            this.vy = vy;
        }

        //  Invalidate the pre-calculated curve to force it to recalculate with these new settings
        this.curve = null;

        return this;

    },

    /**
    * Sets the tangent vector properties of this PathPoint.
    * 
    * @method Phaser.PathPoint#setTangent
    * @param {number} vx - The x coordinate of the tangent vector to create the curve from.
    * @param {number} vy - The y coordinate of the tangent vector to create the curve from.
    * @return {Phaser.PathPoint} This object.
    */
    setTangent: function (vx, vy) {

        this.vx = vx;
        this.vy = vy;

        //  Invalidate the pre-calculated curve to force it to recalculate with these new settings
        this.curve = null;

        return this;

    },

    /**
    * Creates a clone of this PathPoint object.
    *
    * @method Phaser.PathPoint#clone
    * @param {Phaser.PathPoint} [out] - An optional PathPoint object into which this object is cloned. If no object is provided a new PathPoint is created.
    * @return {Phaser.PathPoint} A clone of this PathPoint.
    */
    clone: function (out) {

        if (out === undefined) { out = new Phaser.PathPoint(); }

        return out.copy(this);

    },

    /**
    * Copies all of the values from the given PathPoint object into this PathPoint.
    * The source PathPoint is untouched by this operation.
    *
    * @method Phaser.PathPoint#copy
    * @param {Phaser.PathPoint} source - The PathPoint object to copy the values from.
    * @return {Phaser.PathPoint} This PathPoint object.
    */
    copy: function (source) {

        this.x = source.x;
        this.y = source.y;
        this.vx = source.vx;
        this.vy = source.vy;
        this.speed = source.speed;
        this.data = source.data;
        this.branchPath = source.branchPath;
        this.branchPointIndex = source.branchPointIndex;
        this.curve = null;
        this.active = source.active;

        return this;

    },

    /**
    * Compare this PathPoint with another PathPoint object and return `true` 
    * if they have the same `x`, `y` and `speed` properties, after taking the optional
    * offset values into consideration.
    *
    * @method Phaser.PathPoint#equals
    * @param {Phaser.PathPoint} pathPoint - The PathPoint to compare against this PathPoint.
    * @param {number} [offsetX=0] - A value to apply to the x coordinate before comparison.
    * @param {number} [offsetY=0] - A value to apply to the y coordinate before comparison.
    * @return {boolean} True if the two PathPoint objects match, after the offsets are applied, or false if they don't.
    */
    equals: function (pathPoint, offsetX, offsetY) {

        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = 0; }

        return (this.x === pathPoint.x + offsetX && 
                this.y === pathPoint.y + offsetY && 
                this.speed === pathPoint.speed);

    },

    /**
    * Serializes this PathPoint into a JSON object and returns it.
    * 
    * @method Phaser.PathPoint#toJSON
    * @return {Object} A JSON object representing this PathPoint.
    */
    toJSON: function () {

        return {
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            speed: this.speed,
            data: this.data,
            branchPath: !!this.branchPath ? this.branchPath.name : null,
            branchPointIndex: this.branchPointIndex,
            branchType: this.branchType
        };

    }

};