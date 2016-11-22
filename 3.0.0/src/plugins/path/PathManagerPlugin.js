/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* PathManager controls a list of Paths and a list of PathFollowers.
* It is the central control for the majority of the Pathing API.
*
* @class Phaser.Plugin.PathManager
* @constructor
* @param {Phaser.Game} game - A reference to the current Phaser.Game instance.
* @param {Phaser.PluginManager} parent - The Phaser Plugin Manager which looks after this plugin.
*/
Phaser.Plugin.PathManager = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);

    /**
     * @property {array} _list - list of paths
     * @private
     */
    this._list = [];

    /**
     * @property {array} _followers - list of path followers
     * @private
     */
    this._followers = [];

    this._branchRegistry = {};

};

Phaser.Plugin.PathManager.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.PathManager.prototype.constructor = Phaser.Plugin.PathManager;

/**
 * create a new Path from JSON data
 *
 * JSON data format:
 * required: "coordinateSystem":, "smoothness":, "loops":, "speed":, "pointList":[ {"x":, "y":}, ... ]
 * optional: "branchFrom": { "path":, "point": }, "joinTo": { "path":, "point": }
 */
Phaser.Plugin.PathManager.prototype.createPathsFromJSON = function(jsonKey) {

    var parse = this.game.cache.getJSON(jsonKey);
    var path;
    var createdPaths = [];
    var branchList = [];

    parse.paths.forEach(function(config) {
        path = new Phaser.Path(config.coordinateSystem, config.loops);
        path.name = config.name;
        this.addPoints(path, config.pointList, config.speed);
        this._list.push(path);
        createdPaths.push(path);
        config.pointList.reduce(function(list, pnt, index) {
            if (pnt.branchType === Phaser.Path.BranchTypes.ATTACHED) {
                list.push({
                    path: path.name,
                    branchPath: pnt.branchPath,
                    pointIndex: index,
                    type: pnt.branchType
                });
            } else if (pnt.branchType === Phaser.Path.BranchTypes.JOINED) {
                list.push({
                    path: pnt.branchPath,
                    branchPath: path.name,
                    pointIndex: pnt.branchPointIndex,
                    type: pnt.branchType
                });
            }
            return list;
        }, branchList);
    }, this);
    branchList.forEach(function(branch) {
        var mainPath = this.findPathByName(branch.path);
        var branchPath = this.findPathByName(branch.branchPath);
        var mainPathPointIndex = branch.pointIndex;
        if (branch.type === Phaser.Path.BranchTypes.ATTACHED) {
            this.attachBranch(branchPath, mainPath, mainPathPointIndex);
        } else if (branch.type === Phaser.Path.BranchTypes.JOINED) {
            this.joinBranch(branchPath, mainPath, mainPathPointIndex, false);
        }
    }, this);

    return createdPaths;
};

Phaser.Plugin.PathManager.prototype.addPath = function(path) {

    //  if path has points then addPoints, otherwise don't
    // this.addPoints(path, parse.pointList, parse.speed);

    this._list.push(path);

    return path;

};

// create a branching path and attach the start to an existing path
// when a PathFollower encounters the attachment point, it will be able to switch onto this new branch
//
// @param: count {value, optional}, make this branch counted (it won't be taken until a follower has passed it enough times)
Phaser.Plugin.PathManager.prototype.attachBranch = function(branchPath, mainPath, mainPathPointIndex, count) {

    if (typeof mainPath === 'string') {
        mainPath = this.findPathByName(mainPath);
    }

    var branchFromPoint = new Phaser.PathPoint();

    if (mainPath.getPathPoint(mainPathPointIndex, branchFromPoint)) {
        // move the first point of the branchPath to the branchFromPoint location
        branchPath.origin = branchFromPoint;
        var branchToPoint = branchPath.getPathPointReference(0);

        // attach the branch (use point reference so the changes go into the path)
        var branchFromPointRef = mainPath.getPathPointReference(mainPathPointIndex);

        this._branchAttach(branchFromPointRef, branchPath, 0);
        branchFromPointRef.branchType = Phaser.Path.BranchTypes.ATTACHED;

        // attach the branch's first point back to where it branched off from (for path reversal)
        branchToPoint.branchPath = mainPath;

        branchToPoint.branchPointIndex = mainPathPointIndex;

        // make sure this branch knows that it's using offset coordinates based on the first path point location
        branchPath.coordinateSystem = Phaser.Path.CoordinateSystems.OFFSET;
        branchPath.type = Phaser.Path.PathTypes.BRANCH;

        // set up counted branches data
        if (count !== undefined) {
            branchFromPointRef.data = {
                type: Phaser.PathPoint.DATA_COUNTER,
                value: count
            };
        }

        if (this._branchRegistry[branchPath.name]) {
            this._branchRegistry[branchPath.name].push(branchFromPointRef);
        } else {
            this._branchRegistry[branchPath.name] = [branchFromPointRef];
        }
    }

};



// attach the end of a path to an existing path
// when a PathFollower encounters the attachment point, it will automatically switch onto the attached path
Phaser.Plugin.PathManager.prototype.joinBranch = function(branchPath, mainPath, mainPathPointIndex, addPoint) {
    if (typeof addPoint === 'undefined') {
        addPoint = true;
    }
    if (typeof mainPath === 'string') {
        mainPath = this.findPathByName(mainPath);
    }

    var mainPathJoinPoint, branchLastPoint;

    mainPathJoinPoint = new Phaser.PathPoint();
    mainPath.getPathPoint(mainPathPointIndex, mainPathJoinPoint);

    if (mainPathJoinPoint) {
        if (addPoint) {


            var newBranchPoint = new Phaser.PathPoint();
            if (branchPath.getPathPoint(0, newBranchPoint)) {
                // make sure the newly added last path point is relative to the previously added first path point for the branch path by subtracting it out
                branchLastPoint = branchPath.addPathPoint(mainPathJoinPoint.x - newBranchPoint.x, mainPathJoinPoint.y - newBranchPoint.y, mainPathJoinPoint.vx, mainPathJoinPoint.vy, 1.0);
                this._branchAttach(branchLastPoint, mainPath, mainPathPointIndex);
            }
        } else {
            branchLastPoint = branchPath.getPathPointReference(branchPath.length - 1);
            this._branchAttach(branchLastPoint, mainPath, mainPathPointIndex);
        }
        branchLastPoint.branchType = Phaser.Path.BranchTypes.JOINED;
    }
    if (this._branchRegistry[branchPath.name]) {
        this._branchRegistry[branchPath.name].push(branchLastPoint);
    } else {
        this._branchRegistry[branchPath.name] = [branchLastPoint];
    }
};

// internal function, set the branching parameters of a PathPoint
Phaser.Plugin.PathManager.prototype._branchAttach = function(attachPoint, branchingPath, branchToPointIndex) {
    attachPoint.branchPath = branchingPath;
    attachPoint.branchPointIndex = branchToPointIndex;
};

Phaser.Plugin.PathManager.prototype._branchDetach = function(attachedPoint) {
    attachedPoint.branchPath = null;
    attachedPoint.branchPointIndex = null;
};


Phaser.Plugin.PathManager.prototype.removeBranch = function(branch) {
    if (typeof branch === 'string') {
        branch = this.findPathByName(branch);
    }
    this._branchRegistry[branch.name].forEach(function(point) {
        this._branchDetach(point);
    }, this);
    this._branchRegistry[branch.name] = null;
    this.removePath(this.pathIndex(branch));

};

// @return: the Path object which is at 'index' in the list
Phaser.Plugin.PathManager.prototype.getPath = function(index) {
    return this._list[index];
};



// add a list of points to a Path
Phaser.Plugin.PathManager.prototype.addPoints = function(path, pointList, speed) {
    if (speed === undefined) speed = 1.0;

    for (var i = 0; i < pointList.length; i++) {
        path.addPathPoint(pointList[i].x, pointList[i].y, pointList[i].vx, pointList[i].vy, speed, pointList[i].data);
    }

    return path.numPoints();
};

// @return: the Path object matching 'name' in the list
Phaser.Plugin.PathManager.prototype.findPathByName = function(name) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].name == name) {
            return this._list[i];
        }
    }

    return null;

};


Phaser.Plugin.PathManager.prototype.findPathByPoint = function(point) {
    var l = this._list.length;

    for (var i = 0; i < l; i++) {
        if (this._list[i].pointIndex(point) > -1) {
            return this._list[i];
        }
    }

};

/*
 *  FOLLOWERS
 *
 *  the following functions control PathFollower objects
 *
 */

// create a new PathFollower and add it to the list
// @param: physicsAdjustTime - how quickly does a physics object attempt to get back to the path's virtual particle position (milliseconds), 0 = it's not a physics object
// @return: the new PathFollower object
Phaser.Plugin.PathManager.prototype.addFollower = function(path, follower, speed, rotationOffset, angularOffset, callbackAtEnd, physicsAdjustTime) {

    var f = new Phaser.PathFollower(path, follower, speed, rotationOffset, angularOffset, callbackAtEnd, physicsAdjustTime);

    this._followers.push(f);

    return f;

};

// update all PathFollower objects in the _followers list
// this will automatically move them along the Paths
//  was called updateFollowers
Phaser.Plugin.PathManager.prototype.update = function() {

    //  move this to a plugin var
    //var elapsedTime = 1.0;

    for (var i = this._followers.length - 1; i >= 0; --i) {
        var f = this._followers[i];

        // when a follower's update returns false, kill it
        if (!f.update(this.game.time.elpased)) {
            // callback for this follower when it dies
            if (f.callbackAtEnd) {
                f.callbackAtEnd(f.follower);
            }

            // destroy the follower
            f.destroy();

            // remove the follower from the list
            this._followers.splice(i, 1);
        }
    }

};

// remove all PathFollowers on this path without destroying their attached graphic objects
// (eg. a long line of enemies use a path to enter, then switch to AI control on arrival maintaining their relative positions)
Phaser.Plugin.PathManager.prototype.removeAllFollowers = function(path) {
    for (var i = this._followers.length - 1; i >= 0; --i) {
        var f = this._followers[i];

        if (f.path == path) {
            // callback for this follower when it dies
            if (f.callbackAtEnd) {
                f.callbackAtEnd(f.follower);
            }

            // destroy the follower
            f.destroy();

            // remove the follower from the list
            this._followers.splice(i, 1);
        }
    }

};

Phaser.Plugin.PathManager.prototype.pathIndex = function(path) {
    return this._list.indexOf(path);
};

Phaser.Plugin.PathManager.prototype.removePath = function(pathIndex) {
    this.removeAllFollowers(this.getPath(pathIndex));
    if (pathIndex < this._list.length) {
        return this._list.splice(pathIndex, 1);
    } else {
        throw new Error("ERROR: Cannot remove non-existent path");
    }
};



/*
 *  DEBUG DRAWING OF ALL PATHS
 */

// draw all paths
Phaser.Plugin.PathManager.prototype.drawPaths = function(graphics) {
    for (var i = 0; i < this._list.length; i++) {
        this._list[i].debug(graphics);
    }
};