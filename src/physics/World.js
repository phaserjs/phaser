/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Physics
*/
Phaser.Physics = {};

/**
* @const
*/
Phaser.Physics.LIME_CORONA_JSON = 0;

//  Add an extra property to p2.Body
p2.Body.prototype.parent = null;

/**
* @class Phaser.Physics.World
* @classdesc Physics World Constructor
* @constructor
* @param {Phaser.Game} 
*/
Phaser.Physics.World = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    this.onBodyAdded = new Phaser.Signal();
    this.onBodyRemoved = new Phaser.Signal();

    this.bounds = null;

    p2.World.call(this, { gravity: [0, 0] });

    this.on("addBody", this.addBodyHandler);
    this.on("removeBody", this.removeBodyHandler);
    this.on("postStep", this.postStepHandler);
    this.on("postBroadphase", this.postBroadphaseHandler);

    this.setBoundsToWorld(true, true, true, true);

};

Phaser.Physics.World.prototype = Object.create(p2.World.prototype);
Phaser.Physics.World.prototype.constructor = Phaser.Physics.World;

/**
* Handles a p2 addBody event.
*
* @method Phaser.Physics.Arcade#addBodyHandler
* @private
* @param {object} event - The event data.
*/
Phaser.Physics.World.prototype.addBodyHandler = function (event) {

    if (event.body.parent)
    {
        this.onBodyAdded.dispatch(event.body.parent, event.target);
    }

};

/**
* Handles a p2 removeBody event.
*
* @method Phaser.Physics.Arcade#removeBodyHandler
* @private
* @param {object} event - The event data.
*/
Phaser.Physics.World.prototype.removeBodyHandler = function (event) {

    if (event.body.parent)
    {
        this.onBodyRemoved.dispatch(event.body.parent, event.target);
    }

};

/**
* Handles a p2 postStep event.
*
* @method Phaser.Physics.Arcade#postStepHandler
* @private
* @param {object} event - The event data.
*/
Phaser.Physics.World.prototype.postStepHandler = function (event) {

    // console.log(event);

    // if (event.body.parent)
    // {
    //     this.onBodyRemoved.dispatch(event.body.parent, event.target);
    // }

};

/**
* Handles a p2 postBroadphase event.
*
* @method Phaser.Physics.Arcade#postBroadphaseHandler
* @private
* @param {object} event - The event data.
*/
Phaser.Physics.World.prototype.postBroadphaseHandler = function (event) {

    //  Body.id 1 is always the World bounds object

    for (var i = 0; i < event.pairs.length; i++)
    {
        // console.log(i, event.pairs[i]);

        if (event.pairs[i].parent)
        {
            // console.log(event.pairs[i].parent.sprite.name);
        }
    }

    // if (event.body.parent)
    // {
    //     this.onBodyRemoved.dispatch(event.body.parent, event.target);
    // }

};

/**
* Sets the bounds of the Physics world to match the Game.World dimensions.
* You can optionally set which 'walls' to create: left, right, top or bottom.
*
* @method Phaser.Physics#setBoundsToWorld
* @param {boolean} [left=true] - If true will create the left bounds wall.
* @param {boolean} [right=true] - If true will create the right bounds wall.
* @param {boolean} [top=true] - If true will create the top bounds wall.
* @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
*/
Phaser.Physics.World.prototype.setBoundsToWorld = function (left, right, top, bottom) {

	this.setBounds(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, left, right, top, bottom);

}

/**
* Sets the bounds of the Physics world to match the given world pixel dimensions.
* You can optionally set which 'walls' to create: left, right, top or bottom.
*
* @method Phaser.Physics.Arcade#setBounds
* @param {number} x - The x coordinate of the top-left corner of the bounds.
* @param {number} y - The y coordinate of the top-left corner of the bounds.
* @param {number} width - The width of the bounds.
* @param {number} height - The height of the bounds.
* @param {boolean} [left=true] - If true will create the left bounds wall.
* @param {boolean} [right=true] - If true will create the right bounds wall.
* @param {boolean} [top=true] - If true will create the top bounds wall.
* @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
*/
Phaser.Physics.World.prototype.setBounds = function (x, y, width, height, left, right, top, bottom) {

    if (typeof left === 'undefined') { left = true; }
    if (typeof right === 'undefined') { right = true; }
    if (typeof top === 'undefined') { top = true; }
    if (typeof bottom === 'undefined') { bottom = true; }

    var hw = (width / 2);
    var hh = (height / 2);
    var cx = hw + x;
    var cy = hh + y;

    if (this.bounds !== null)
    {
    	this.removeBody(this.bounds);

        var i = this.bounds.shapes.length;

        while (i--)
        {
            var shape = this.bounds.shapes[i];
            this.bounds.removeShape(shape);
        }

        this.bounds.position[0] = this.game.math.px2p(cx);
        this.bounds.position[1] = this.game.math.px2p(cy);
    }
    else
    {
        this.bounds = new p2.Body({ mass: 0, position:[this.game.math.px2p(cx), this.game.math.px2p(cy)] });
    }

    if (left)
    {
	    this.bounds.addShape(new p2.Plane(), [this.game.math.px2p(-hw), 0], 1.5707963267948966 );
    }

    if (right)
    {
	    this.bounds.addShape(new p2.Plane(), [this.game.math.px2p(hw), 0], -1.5707963267948966 );
    }

    if (top)
    {
	    this.bounds.addShape(new p2.Plane(), [0, this.game.math.px2p(-hh)], -3.141592653589793 );
    }

    if (bottom)
    {
	    this.bounds.addShape(new p2.Plane(), [0, this.game.math.px2p(hh)] );
    }

    this.addBody(this.bounds);

}

/**
* @method Phaser.Physics.World.prototype.update
*/
Phaser.Physics.World.prototype.update = function () {

	this.step(1 / 60);

};

/**
* @method Phaser.Physics.World.prototype.destroy
*/
Phaser.Physics.World.prototype.destroy = function () {

    this.clear();

    this.game = null;

};

/**
* @method Phaser.Physics.World.prototype.createBody
* @param {number} x - The x coordinate of Body.
* @param {number} y - The y coordinate of Body.
* @param {number} mass - The mass of the Body. A mass of 0 means a 'static' Body is created.
* @param {boolean} [addToWorld=false] - Automatically add this Body to the world? (usually false as it won't have any shapes on construction).
* @param {object} options - An object containing the build options: 
* @param {boolean} [options.optimalDecomp=false] - Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
* @param {boolean} [options.skipSimpleCheck=false] - Set to true if you already know that the path is not intersecting itself.
* @param {boolean|number} [options.removeCollinearPoints=false] - Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
* @param {(number[]|...number)} points - An array of 2d vectors that form the convex or concave polygon. 
*                                       Either [[0,0], [0,1],...] or a flat array of numbers that will be interpreted as [x,y, x,y, ...], 
*                                       or the arguments passed can be flat x,y values e.g. `setPolygon(options, x,y, x,y, x,y, ...)` where `x` and `y` are numbers.
*/
Phaser.Physics.World.prototype.createBody = function (x, y, mass, addToWorld, options, data) {

    if (typeof addToWorld === 'undefined') { addToWorld = false; }

    var body = new Phaser.Physics.Body(this.game, null, x, y, mass);

    if (data)
    {
        body.addPolygon(options, data);
    }

    if (addToWorld)
    {
        this.addBody(body.data);
    }

    return body;

};
