/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A PathFollower is a virtual entity that follows the Path.
* It is usually linked to a game object such as a Sprite and it will control either the
* position of that object, or its velocity if it is a physics object.
*
* Callbacks will be triggered when certain events happen as the follower moves.  These
* may be used to aid in the creation of complex behaviours for the game objects.
*
* @class Phaser.PathFollower
* @constructor
* @param {Phaser.Path} path - The Path object which this follower is created on.
* @param {Phaser.Sprite|object} follower - The game object which this follower controls. Requires public properties: `x`, `y` for position and `rotation` for angle control (if specified).
* @param {number} [speed=1] - The current speed of this follower in pixels per frame. This value is multiplied with the Path segment speed to give the final value used.
* @param {number} [angleOffset=null] - If `null` then the PathFollower won't rotate. Otherwise it will face in the paths direction plus this offset which is given in radians.
* @param {function} [callbackAtEnd] - A callback to be invoked when the follower reaches the end of a path.
* @param {number} [physicsAdjustTime=0] - If non-zero then the follower expects to control a physics object using "arcade.moveToObject" to control velocity.
*/
Phaser.PathFollower = function (path, follower, speed, rotationOffset, angularOffset, callbackAtEnd, physicsAdjustTime) {

    if (speed === undefined) { speed = 1; }
    if (rotationOffset === undefined) { rotationOffset = 0; }
    if (angularOffset === undefined) { angularOffset = { angle: 0, distance: 0 }; }
    if (physicsAdjustTime === undefined) { physicsAdjustTime = 0; }

    Phaser.EventTarget.call(this);

    this.path = path;

    this.follower = follower;

    this._turnOffset = rotationOffset;

    this.callbackAtEnd = callbackAtEnd;

    this.physicsAdjustTime = physicsAdjustTime;

    // offset is an x,y offset from the Path unique for this PathFollower, it is added to the Path's own offset to give a final location
    this.offset = new Phaser.Point(0, 0);

    if (typeof speed === 'object')
    {
        this.speed = Phaser.Utils.extend(true, Object.create(Phaser.PathFollower.Defaults.speed), speed);
    }
    else
    {
        this.speed = Object.create(Phaser.PathFollower.Defaults.speed);

        this.speed.min = speed;
        this.speed.max = speed;
    }

    // _angularOffset is an angular offset from the Path's tangent direction, using angle (radians) and distance (pixels)
    this._angularOffset = { angle: 0, distance: 0 };

    this.setAngularOffset(angularOffset.angle, angularOffset.distance);

    // branchCount is used when the follower passes a counted PathPoint (see the Mummy Path example)
    // it is set whenever this follower passes a counted PathPoint and the count is zero
    // it decrements each time the follower passes a counted PathPoint and the count is non-zero
    // when the count reaches zero it triggers EVENT_COUNT_FINISH
    // NOTE: if there are multiple counted PathPoints this will not work as expected as there is only one count variable per follower!
    this.branchCount = 0;

    this.branchPredicate = null;

    // distance along the current Path segment
    this._currentDistance = 0;

    // PathPoint index of the start of the current Path segment
    this._currentPoint = 0;

    // Hermite curve for the current Path segment
    this._currentCurve = this.path.getCurve(this._currentPoint);

    // initialise the _pathSpeed by taking the speed of the first point on this Path
    var pp = new Phaser.PathPoint();

    if (this.path.getPathPoint(0, pp))
    {
        this._pathSpeed = pp.speed;
    }

    // set up a virtualParticle if this is controlling a Physics body instead of a simple graphic object
    if (this.physicsAdjustTime !== 0)
    {
        this.virtualParticle = new Phaser.Point(pp.x, pp.y);
    }
    else
    {
        this.virtualParticle = null;
    }

    // default maximum gap permitted between a physics based follower and its virtual particle, in pixels
    this.maximumGap = 1000;

    // process the data for the first point on this Path
    this.path.processData(this, this._currentPoint, false);

    // initialise the pause time to zero for this follower
    this._pauseTime = 0;

    this._accelerationTime = 0;

    this.yoyo = false;

    if (!follower.events)
    {
        follower.events = {};
    }

    follower.events.onPathPointReached = new Phaser.Signal(); // "follower has reached a PathPoint on the path"
    follower.events.onPathBranchReached = new Phaser.Signal(); // "follower has reached a branch and must choose a direction" (stay on this path or changePath to the branch)

    /* TODO: */
    follower.events.onCountFinished = new Phaser.Signal(); // "follower passed a counted point the specified number of times" */
    follower.events.onPathStart = new Phaser.Signal(); // NOTE: not "follower started a path" but "follower moved backwards to the start of the path"
    follower.events.onPathYoyo = new Phaser.Signal(); // "follower moved to the end of the path" but NOT if the path is looped, that generates EVENT_PATH_LOOPED instead
    follower.events.onPathEnd = new Phaser.Signal(); // "follower moved to the end of the path" but NOT if the path is looped, that generates EVENT_PATH_LOOPED instead
    follower.events.onPathLoop = new Phaser.Signal(); // "follower reached the end of a looped path and has started at the beginning again"

    follower.followerPathName = this.path.name;

    Object.defineProperty(this.speed, 'avg', {
        get: function() {
            return (this.min + this.max) / 2;
        }
    });

};

// events for PathFollower
Phaser.PathFollower.EVENT_REACHED_POINT = "event_reached_point";   // "follower has reached a PathPoint on the path"
Phaser.PathFollower.EVENT_BRANCH_CHOICE = "event_branch_choice";   // "follower has reached a branch and must choose a direction" (stay on this path or changePath to the branch)
Phaser.PathFollower.EVENT_COUNT_FINISH = "event_count_finish";     // "follower passed a counted point the specified number of times"
Phaser.PathFollower.EVENT_PATH_START = "event_path_start";         // NOTE: "a path started" but "follower moved backwards to the start of the path"
Phaser.PathFollower.EVENT_PATH_END = "event_path_end";             // "follower moved to the end of the path" but NOT if the path is looped, that generates EVENT_PATH_LOOPED instead
Phaser.PathFollower.EVENT_PATH_LOOPED = "event_path_looped";       // "follower reached the end of a looped path and has started at the beginning again"

// reduce dynamic object allocations by using this temporary Point wherever possible
Phaser.PathFollower.tempPoint = new Phaser.Point();

Phaser.PathFollower.Defaults = {
    speed: {
        min: 1,
        max: 1,
        theta: null,
        lambda: null,
        _target: null,
        _elapsed: 0,
        _current: null,
        _previous: null
    }
};

// remove all event listeners when this PathFollower is destroyed
Phaser.PathFollower.prototype.destroy = function () {

    this.follower.events.onPathPointReached.removeAll();
    this.follower.events.onPathBranchReached.removeAll();
    this.follower.events.onCountFinished.removeAll();
    this.follower.events.onPathStart.removeAll();
    this.follower.events.onPathEnd.removeAll();
    this.follower.events.onPathLoop.removeAll();

};

// update this PathFollower and move the attached graphic or physics object
// @return: false if this PathFollower should be removed from the Path's list of followers
Phaser.PathFollower.prototype.update = function () {

    // exit immediately if _pauseTime is non-zero and it's not that time yet
    if (this._pauseTime != 0)
    {
        if (game.time.now < this._pauseTime)
        {
            return true;
        }

        this._pauseTime = 0;

        if (this.follower.animations !== undefined)
        {
            // Phaser.AnimationManager doesn't check for a currentAnim before trying to set it's paused value, so I have to do it here
            if (this.follower.animations.currentAnim)
            {
                this.follower.animations.paused = false;
            }
        }
    }

    // if the follower is a physics object following a virtual particle
    var waitForFollower = false;

    if (this.physicsAdjustTime && this.virtualParticle)
    {
        // if the distance is too great, make the virtual particle wait for the follower to catch up
        if (game.physics.arcade.distanceBetween(this.follower, this.virtualParticle) >= this.maximumGap)
        {
            waitForFollower = true;
        }
    }

    // advance along the path unless we're waiting for the follower to catch up
    if (!waitForFollower)
    {
        this._currentDistance += this._calculateDistance();
    }

    // are we moving forwards or backwards?
    var direction = (this.speed.avg * this._pathSpeed) >= 0 ? 1 : -1;

    // while we're past either end of the current curve
    while ((direction == 1 && this._currentDistance >= this._currentCurve.length) || (direction == -1 && this._currentDistance < 0))
    {
        var memCurveLength = this._currentCurve.length;

        // backwards...
        if (direction == -1)
        {
            var branchTaken = false;

            // passed a point going backwards, process the data for it
            var point = this.path.processData(this, this._currentPoint, true);
            this.follower.events.onPathPointReached.dispatch(this.follower, point);
            this.takeBranchIfAvailable();
            this._currentPoint--;

            // reached the start of the path moving backwards
            if (this._currentPoint < 0)
            {
                if (this.path.loops)
                {
                    this.follower.events.onPathLoop.dispatch(point);
                    this._currentPoint = this.path.numPoints() - 1;
                }
                else
                {
                    if (!this.yoyo)
                    {
                        this.follower.events.onPathEnd.dispatch();        
                    }
                    else
                    {
                        this.follower.events.onPathYoyo.dispatch();
                        var speed = {min: this.speed.min, max: this.speed.max};
                        this.speed.min = -speed.max;
                        this.speed.max = -speed.min;
                        this._currentPoint = 0;
                        this._currentCurve = this.path.getCurve(this._currentPoint);
                        this._currentDistance = 0;
                        return true;
                    }
                }
            }

            if (!branchTaken)
            {
                // get the curve for this new point
                this._currentCurve = this.path.getCurve(this._currentPoint);

                // there isn't one, take a branch if there's one attached here
                if (!this._currentCurve)
                {
                    return this.takeBranchIfAvailable();
                }

                // move backwards to the end of the previous curve in the path
                this._currentDistance += this._currentCurve.length;
            }
        }
        else        // forwards...
        {
            this._currentPoint++;
            
            // reached the end of the path moving forwards
            if (this.path.atEnd(this._currentPoint))
            {
                if (this.path.loops)
                {
                    // the path loops
                    this.follower.events.onPathLoop.dispatch();
                    this._currentPoint = 0;
                }
                else
                {
                    // if the path doesn't loop
                    if (!this.takeBranchIfAvailable())
                    {
                        if (!this.yoyo)
                        {
                            this.follower.events.onPathEnd.dispatch();        
                        }
                        else
                        {
                            this.follower.events.onPathYoyo.dispatch();
                            var speed = {min: this.speed.min, max: this.speed.max};
                            this.speed.min = -speed.max;
                            this.speed.max = -speed.min;
                            this._currentPoint = this.path.length - 2;
                            this._currentCurve = this.path.getCurve(this._currentPoint);
                            this._currentDistance = this._currentCurve.length;
                            return true;
                        }
                    }
                }
            }

            // passed a point going forwards, process the data for the next one
            point = this.path.processData(this, this._currentPoint, false);

            this.follower.events.onPathPointReached.dispatch(this.follower, point);
            
            this.takeBranchIfAvailable();

            // move forwards to the start of the next curve in the path
            this._currentDistance -= memCurveLength;

            // get the curve for this new point
            this._currentCurve = this.path.getCurve(this._currentPoint);

            // there isn't one, take a branch if there's one attached here
            if (!this._currentCurve)
            {
                return this.takeBranchIfAvailable();
            }
        }

        // update the path speed while we have a reference to the PathPoint handy
        this._pathSpeed = point.speed;
    }

    return this.setPosition();

};

Phaser.PathFollower.prototype._calculateDistance = function () {

    if (this.speed.min === this.speed.max)
    {
        return game.time.elapsed * this.speed.avg * this._pathSpeed;
    }
    else
    {
        this.speed._elapsed += game.time.elapsed;
        this.speed._current = this.speed.current || this.speed.avg;

        if (this.speed._elapsed >= this.speed.theta)
        {
            this.speed._current = this.speed._target;
            this.speed._target = null;
            this.speed._elapsed = 0;
        }

        if (!this.speed._target )
        {
            var min = Phaser.Math.clamp(this.speed._current - (this.speed._current * this.speed.lambda), this.speed.min, this.speed.max);
            var max = Phaser.Math.clamp(this.speed._current + (this.speed._current * this.speed.lambda), this.speed.min, this.speed.max);

            this.speed._target = game.rnd.realInRange(min, max);
        }

        var step = Phaser.Math.smoothstep(this.speed._elapsed,0,this.speed.theta);
        
        return Phaser.Math.linear(this.speed._current, this.speed._target, step) * this._pathSpeed;;
    }

};

// move the attached graphic or physics object to match this PathFollower
// @return: false if this PathFollower should be removed from the Path's list of followers
Phaser.PathFollower.prototype.setPosition = function () {

    // if the follower object has been destroyed, kill this too
    if (!this.follower)
    {
        return false;
    }

    this._currentCurve.getPointWithDistance(this._currentDistance, Phaser.PathFollower.tempPoint);

    var ox = this.offset.x;
    var oy = this.offset.y;

    if (this._angularOffset.distance != 0)
    {
        var angle = (this.follower.rotation + this._angularOffset.angle);
        ox += Math.cos(angle) * this._angularOffset.distance;
        oy += Math.sin(angle) * this._angularOffset.distance;
    }

    if (this.physicsAdjustTime)
    {
        // move the virtual particle along the path
        this.virtualParticle.x = Phaser.PathFollower.tempPoint.x + ox;
        this.virtualParticle.y = Phaser.PathFollower.tempPoint.y + oy;

        // move the physics body towards the virtual particle
        if (this.follower.body)
        {
            game.physics.arcade.moveToObject(this.follower, this.virtualParticle, 100, this.physicsAdjustTime);
        }
    }
    else
    {
        // move the follower along the path by directly adjusting it's x,y coordinates
        this.follower.x = Phaser.PathFollower.tempPoint.x + ox;
        this.follower.y = Phaser.PathFollower.tempPoint.y + oy;
    }

    // if this follower should turn to follow the path, and it has a rotation member
    if (this._turnOffset !== undefined && this.follower.rotation !== undefined)
    {
        // turn to follow the path with a fixed offset of _turnOffset
        this.follower.rotation = this._currentCurve.getAngleWithDistance(this._currentDistance) + this._turnOffset;
    }

    return true;

};

// if we've reached the end of a path or a branch, take any branch that is available rather than die
// @return: true if successful, false if no branch is available
Phaser.PathFollower.prototype.takeBranchIfAvailable = function () {

    var p = new Phaser.PathPoint();

    if (this.path.getPathPoint(this._currentPoint, p))
    {
        // kill this follower if there isn't a branch for us to take
        if (!p.branchPath || !this.branchPredicate || !this.branchPredicate(p, this.path))
        {
            return false;
        }

        // changePath calls back to redo this function, exit after calling it
        
        this.changePath(p.branchPath, p.branchPointIndex);

        return true;    
    }

    return false;

};

// follow a different path
Phaser.PathFollower.prototype.changePath = function (branchPath, branchPointIndex) {

    // change to the new path
    this.path = branchPath;

    // get the speed of the new path
    this._pathSpeed = this.path.getPathPointReference(0).speed;

    // set my position on the new path
    this._currentPoint = branchPointIndex;

    // update the curve if we've moved past a Path point
    this._currentCurve = this.path.getCurve(this._currentPoint);

    // we've finished the path
    if (!this._currentCurve)
    {
        return this.takeBranchIfAvailable();
    }

    // move me to the correct position on the new curve
    this.setPosition();

};

// change this follower's x,y offset values
Phaser.PathFollower.prototype.setOffset = function (x, y) {

    // remove any prior offset from the follower's position
    this.follower.x -= this.offset.x;
    this.follower.y -= this.offset.y;

    // set the new offset for this PathFollower
    this.offset.x = x;
    this.offset.y = y;

    // add the offset into the follower's position straight away
    this.follower.x += this.offset.x;
    this.follower.y += this.offset.y;

};

// set this follower's angular offset values
Phaser.PathFollower.prototype.setAngularOffset = function (angle, distance) {

    this._angularOffset.angle = angle;
    this._angularOffset.distance = distance;

};

// cause this follower to pause for 'delay' milliseconds
Phaser.PathFollower.prototype.pause = function (delay) {

    this._pauseTime = game.time.now + delay;

    if (this.follower.animations !== undefined)
    {
        if (this.follower.animations.currentAnim)
        {
            this.follower.animations.paused = true;
        }
    }

};

Object.defineProperty(Phaser.PathFollower.prototype, 'paused', {

    get: function() {
        return !!this._pauseTime;
    },

    set: function(val) {
        if(!!val) {
            this.pause(Number.MAX_VALUE);
        } else {
            this._pauseTime = game.time.now - 1;
        }
    },

    enumerable: true,
    configurable: true

});
