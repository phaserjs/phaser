/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

//  Add an extra properties to p2 that we need
p2.Body.prototype.parent = null;
p2.Spring.prototype.parent = null;

/**
* @class Phaser.Physics.P2
* @classdesc Physics World Constructor
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
* @param {object} [config] - Physics configuration object passed in from the game constructor.
*/
Phaser.Physics.P2 = function (game, config) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    if (typeof config === 'undefined')
    {
        config = { gravity: [0, 0], broadphase: new p2.SAPBroadphase() };
    }

    /**
    * @property {p2.World} game - The p2 World in which the simulation is run.
    * @protected
    */
    this.world = new p2.World(config);

    /**
    * @property {array<Phaser.Physics.P2.Material>} materials - A local array of all created Materials.
    * @protected
    */
    this.materials = [];

    /**
    * @property {Phaser.InversePointProxy} gravity - The gravity applied to all bodies each step.
    */
    this.gravity = new Phaser.Physics.P2.InversePointProxy(game, this.world.gravity);

    /**
    * @property {p2.Body} bounds - The bounds body contains the 4 walls that border the World. Define or disable with setBounds.
    */
    this.bounds = null;

    /**
    * @property {array} _wallShapes - The wall bounds shapes.
    * @private
    */
    this._wallShapes = [ null, null, null, null ];

    /**
    * @property {Phaser.Signal} onBodyAdded - Dispatched when a new Body is added to the World.
    */
    this.onBodyAdded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onBodyRemoved - Dispatched when a Body is removed from the World.
    */
    this.onBodyRemoved = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onSpringAdded - Dispatched when a new Spring is added to the World.
    */
    this.onSpringAdded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onSpringRemoved - Dispatched when a Spring is removed from the World.
    */
    this.onSpringRemoved = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onConstraintAdded - Dispatched when a new Constraint is added to the World.
    */
    this.onConstraintAdded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onConstraintRemoved - Dispatched when a Constraint is removed from the World.
    */
    this.onConstraintRemoved = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onContactMaterialAdded - Dispatched when a new ContactMaterial is added to the World.
    */
    this.onContactMaterialAdded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onContactMaterialRemoved - Dispatched when a ContactMaterial is removed from the World.
    */
    this.onContactMaterialRemoved = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onPostStep - Dispatched after the World.step()
    */
    this.onPostStep = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onPostBroadphase - Dispatched after the Broadphase has collected collision pairs in the world.
    */
    this.onPostBroadphase = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onImpact - Dispatched when a first contact is created between two bodies. This event is fired after the step has been done.
    */
    this.onImpact = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onBeginContact - Dispatched when a first contact is created between two bodies. This event is fired before the step has been done.
    */
    this.onBeginContact = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onEndContact - Dispatched when final contact occurs between two bodies. This event is fired before the step has been done.
    */
    this.onEndContact = new Phaser.Signal();

    //  Hook into the World events
    this.world.on("postStep", this.postStepHandler, this);
    this.world.on("postBroadphase", this.postBroadphaseHandler, this);
    this.world.on("impact", this.impactHandler, this);
    this.world.on("beginContact", this.beginContactHandler, this);
    this.world.on("endContact", this.endContactHandler, this);

    /**
    * @property {array} collisionGroups - Internal var.
    */
    this.collisionGroups = [];

    /**
    * @property {number} _collisionGroupID - Internal var.
    * @private
    */
    this._collisionGroupID = 2;

    this.nothingCollisionGroup = new Phaser.Physics.P2.CollisionGroup(1);
    this.boundsCollisionGroup = new Phaser.Physics.P2.CollisionGroup(2);
    this.everythingCollisionGroup = new Phaser.Physics.P2.CollisionGroup(2147483648);

    this.boundsCollidesWith = [];

    //  Group vs. Group callbacks

    //  By default we want everything colliding with everything
    this.setBoundsToWorld(true, true, true, true, false);

};

/**
* @const
* @type {number}
*/
Phaser.Physics.P2.LIME_CORONA_JSON = 0;

Phaser.Physics.P2.prototype = {

    /**
    * Handles a p2 postStep event.
    *
    * @method Phaser.Physics.P2#postStepHandler
    * @private
    * @param {object} event - The event data.
    */
    postStepHandler: function (event) {

    },

    /**
    * Fired after the Broadphase has collected collision pairs in the world.
    * Inside the event handler, you can modify the pairs array as you like, to prevent collisions between objects that you don't want.
    *
    * @method Phaser.Physics.P2#postBroadphaseHandler
    * @private
    * @param {object} event - The event data.
    */
    postBroadphaseHandler: function (event) {

        //  Body.id 1 is always the World bounds object

        for (var i = 0; i < event.pairs.length; i += 2)
        {
            var a = event.pairs[i];
            var b = event.pairs[i+1];

            if (a.id !== 1 && b.id !== 1)
            {
                // console.log('postBroadphaseHandler', a, b);
            }
        }

    },

    /**
    * Handles a p2 impact event.
    *
    * @method Phaser.Physics.P2#impactHandler
    * @private
    * @param {object} event - The event data.
    */
    impactHandler: function (event) {

        if (event.bodyA.parent && event.bodyB.parent)
        {
            //  Body vs. Body callbacks
            var a = event.bodyA.parent;
            var b = event.bodyB.parent;

            if (a._bodyCallbacks[event.bodyB.id])
            {
                a._bodyCallbacks[event.bodyB.id].call(a._bodyCallbackContext[event.bodyB.id], a, b, event.shapeA, event.shapeB);
            }

            if (b._bodyCallbacks[event.bodyA.id])
            {
                b._bodyCallbacks[event.bodyA.id].call(b._bodyCallbackContext[event.bodyA.id], b, a, event.shapeB, event.shapeA);
            }

            //  Body vs. Group callbacks
            if (a._groupCallbacks[event.shapeB.collisionGroup])
            {
                a._groupCallbacks[event.shapeB.collisionGroup].call(a._groupCallbackContext[event.shapeB.collisionGroup], a, b, event.shapeA, event.shapeB);
            }

            if (b._groupCallbacks[event.shapeA.collisionGroup])
            {
                b._groupCallbacks[event.shapeA.collisionGroup].call(b._groupCallbackContext[event.shapeA.collisionGroup], b, a, event.shapeB, event.shapeA);
            }
        }

    },

    /**
    * Handles a p2 begin contact event.
    *
    * @method Phaser.Physics.P2#beginContactHandler
    * @private
    * @param {object} event - The event data.
    */
    beginContactHandler: function (event) {

            // console.log('beginContactHandler');
            // console.log(event);

        if (event.bodyA.id > 1 && event.bodyB.id > 1)
        {
            // console.log('beginContactHandler');
            // console.log(event.bodyA.parent.sprite.key);
            // console.log(event.bodyB.parent.sprite.key);
        }

    },

    /**
    * Handles a p2 end contact event.
    *
    * @method Phaser.Physics.P2#endContactHandler
    * @private
    * @param {object} event - The event data.
    */
    endContactHandler: function (event) {

            // console.log('endContactHandler');
            // console.log(event);


        if (event.bodyA.id > 1 && event.bodyB.id > 1)
        {
            // console.log('endContactHandler');
            // console.log(event);
        }

    },

    /**
    * Sets the bounds of the Physics world to match the Game.World dimensions.
    * You can optionally set which 'walls' to create: left, right, top or bottom.
    *
    * @method Phaser.Physics#setBoundsToWorld
    * @param {boolean} [left=true] - If true will create the left bounds wall.
    * @param {boolean} [right=true] - If true will create the right bounds wall.
    * @param {boolean} [top=true] - If true will create the top bounds wall.
    * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
    * @param {boolean} [setCollisionGroup=true] - If true the Bounds will be set to use its own Collision Group.
    */
    setBoundsToWorld: function (left, right, top, bottom, setCollisionGroup) {

        this.setBounds(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, left, right, top, bottom, setCollisionGroup);

    },

    /**
    * Sets the given material against the 4 bounds of this World.
    *
    * @method Phaser.Physics#setWorldMaterial
    * @param {Phaser.Physics.P2.Material} material - The material to set.
    * @param {boolean} [left=true] - If true will set the material on the left bounds wall.
    * @param {boolean} [right=true] - If true will set the material on the right bounds wall.
    * @param {boolean} [top=true] - If true will set the material on the top bounds wall.
    * @param {boolean} [bottom=true] - If true will set the material on the bottom bounds wall.
    */
    setWorldMaterial: function (material, left, right, top, bottom) {

        if (typeof left === 'undefined') { left = true; }
        if (typeof right === 'undefined') { right = true; }
        if (typeof top === 'undefined') { top = true; }
        if (typeof bottom === 'undefined') { bottom = true; }

        if (left && this._wallShapes[0])
        {
            this._wallShapes[0].material = material;
        }

        if (right && this._wallShapes[1])
        {
            this._wallShapes[1].material = material;
        }

        if (top && this._wallShapes[2])
        {
            this._wallShapes[2].material = material;
        }

        if (bottom && this._wallShapes[3])
        {
            this._wallShapes[3].material = material;
        }

    },

    /**
    * Sets the bounds of the Physics world to match the given world pixel dimensions.
    * You can optionally set which 'walls' to create: left, right, top or bottom.
    *
    * @method Phaser.Physics.P2#setBounds
    * @param {number} x - The x coordinate of the top-left corner of the bounds.
    * @param {number} y - The y coordinate of the top-left corner of the bounds.
    * @param {number} width - The width of the bounds.
    * @param {number} height - The height of the bounds.
    * @param {boolean} [left=true] - If true will create the left bounds wall.
    * @param {boolean} [right=true] - If true will create the right bounds wall.
    * @param {boolean} [top=true] - If true will create the top bounds wall.
    * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
    * @param {boolean} [setCollisionGroup=true] - If true the Bounds will be set to use its own Collision Group.
    */
    setBounds: function (x, y, width, height, left, right, top, bottom, setCollisionGroup) {

        if (typeof left === 'undefined') { left = true; }
        if (typeof right === 'undefined') { right = true; }
        if (typeof top === 'undefined') { top = true; }
        if (typeof bottom === 'undefined') { bottom = true; }
        if (typeof setCollisionGroup === 'undefined') { setCollisionGroup = true; }

        var hw = (width / 2);
        var hh = (height / 2);
        var cx = hw + x;
        var cy = hh + y;

        if (this.bounds !== null)
        {
            if (this.bounds.world)
            {
                this.world.removeBody(this.bounds);
            }

            var i = this.bounds.shapes.length;

            while (i--)
            {
                var shape = this.bounds.shapes[i];
                this.bounds.removeShape(shape);
            }

            this.bounds.position[0] = this.game.math.px2pi(cx);
            this.bounds.position[1] = this.game.math.px2pi(cy);
        }
        else
        {
            this.bounds = new p2.Body({ mass: 0, position:[this.game.math.px2pi(cx), this.game.math.px2pi(cy)] });
        }

        if (left)
        {
            this._wallShapes[0] = new p2.Plane();

            if (setCollisionGroup)
            {
                this._wallShapes[0].collisionGroup = this.boundsCollisionGroup.mask;
                // this._wallShapes[0].collisionGroup = this.everythingCollisionGroup.mask;
                // this._wallShapes[0].collisionMask = this.everythingCollisionGroup.mask;
            }

            this.bounds.addShape(this._wallShapes[0], [this.game.math.px2pi(-hw), 0], 1.5707963267948966 );
        }

        if (right)
        {
            this._wallShapes[1] = new p2.Plane();

            if (setCollisionGroup)
            {
                this._wallShapes[1].collisionGroup = this.boundsCollisionGroup.mask;
                // this._wallShapes[1].collisionGroup = this.everythingCollisionGroup.mask;
                // this._wallShapes[1].collisionMask = this.everythingCollisionGroup.mask;
            }

            this.bounds.addShape(this._wallShapes[1], [this.game.math.px2pi(hw), 0], -1.5707963267948966 );
        }

        if (top)
        {
            this._wallShapes[2] = new p2.Plane();

            if (setCollisionGroup)
            {
                this._wallShapes[2].collisionGroup = this.boundsCollisionGroup.mask;
                // this._wallShapes[2].collisionGroup = this.everythingCollisionGroup.mask;
                // this._wallShapes[2].collisionMask = this.everythingCollisionGroup.mask;
            }

            this.bounds.addShape(this._wallShapes[2], [0, this.game.math.px2pi(-hh)], -3.141592653589793 );
        }

        if (bottom)
        {
            this._wallShapes[3] = new p2.Plane();

            if (setCollisionGroup)
            {
                this._wallShapes[3].collisionGroup = this.boundsCollisionGroup.mask;
                // this._wallShapes[3].collisionGroup = this.everythingCollisionGroup.mask;
                // this._wallShapes[3].collisionMask = this.everythingCollisionGroup.mask;
            }

            this.bounds.addShape(this._wallShapes[3], [0, this.game.math.px2pi(hh)] );
        }

        this.world.addBody(this.bounds);

    },

    /**
    * @method Phaser.Physics.P2#update
    */
    update: function () {

        this.world.step(1 / 60);

    },

    /**
    * Clears all bodies from the simulation.
    *
    * @method Phaser.Physics.P2#clear
    */
    clear: function () {

        this.world.clear();

    },

    /**
    * Clears all bodies from the simulation and unlinks World from Game. Should only be called on game shutdown. Call `clear` on a State change.
    *
    * @method Phaser.Physics.P2#destroy
    */
    destroy: function () {

        this.world.clear();

        this.game = null;

    },

    /**
    * Add a body to the world.
    *
    * @method Phaser.Physics.P2#addBody
    * @param {Phaser.Physics.P2.Body} body - The Body to add to the World.
    * @return {boolean} True if the Body was added successfully, otherwise false.
    */
    addBody: function (body) {

        if (body.data.world)
        {
            return false;
        }
        else
        {
            this.world.addBody(body.data);

            this.onBodyAdded.dispatch(body);

            return true;
        }

    },

    /**
    * Removes a body from the world.
    *
    * @method Phaser.Physics.P2#removeBody
    * @param {Phaser.Physics.P2.Body} body - The Body to remove from the World.
    * @return {Phaser.Physics.P2.Body} The Body that was removed.
    */
    removeBody: function (body) {

        this.world.removeBody(body.data);

        this.onBodyRemoved.dispatch(body);

        return body;

    },

    /**
    * Adds a Spring to the world.
    *
    * @method Phaser.Physics.P2#addSpring
    * @param {Phaser.Physics.P2.Spring} spring - The Spring to add to the World.
    * @return {Phaser.Physics.P2.Spring} The Spring that was added.
    */
    addSpring: function (spring) {

        this.world.addSpring(spring);

        this.onSpringAdded.dispatch(spring);

        return spring;

    },

    /**
    * Removes a Spring from the world.
    *
    * @method Phaser.Physics.P2#removeSpring
    * @param {Phaser.Physics.P2.Spring} spring - The Spring to remove from the World.
    * @return {Phaser.Physics.P2.Spring} The Spring that was removed.
    */
    removeSpring: function (spring) {

        this.world.removeSpring(spring);

        this.onSpringRemoved.dispatch(spring);

        return spring;

    },

    /**
    * Adds a Constraint to the world.
    *
    * @method Phaser.Physics.P2#addConstraint
    * @param {Phaser.Physics.P2.Constraint} constraint - The Constraint to add to the World.
    * @return {Phaser.Physics.P2.Constraint} The Constraint that was added.
    */
    addConstraint: function (constraint) {

        this.world.addConstraint(constraint);

        this.onConstraintAdded.dispatch(constraint);

        return constraint;

    },

    /**
    * Removes a Constraint from the world.
    *
    * @method Phaser.Physics.P2#removeConstraint
    * @param {Phaser.Physics.P2.Constraint} constraint - The Constraint to be removed from the World.
    * @return {Phaser.Physics.P2.Constraint} The Constraint that was removed.
    */
    removeConstraint: function (constraint) {

        this.world.removeConstraint(constraint);

        this.onConstraintRemoved.dispatch(constraint);

        return constraint;

    },

    /**
    * Adds a Contact Material to the world.
    *
    * @method Phaser.Physics.P2#addContactMaterial
    * @param {Phaser.Physics.P2.ContactMaterial} material - The Contact Material to be added to the World.
    * @return {Phaser.Physics.P2.ContactMaterial} The Contact Material that was added.
    */
    addContactMaterial: function (material) {

        this.world.addContactMaterial(material);

        this.onContactMaterialAdded.dispatch(material);

        return material;

    },

    /**
    * Removes a Contact Material from the world.
    *
    * @method Phaser.Physics.P2#removeContactMaterial
    * @param {Phaser.Physics.P2.ContactMaterial} material - The Contact Material to be removed from the World.
    * @return {Phaser.Physics.P2.ContactMaterial} The Contact Material that was removed.
    */
    removeContactMaterial: function (material) {

        this.world.removeContactMaterial(material);

        this.onContactMaterialRemoved.dispatch(material);

        return material;

    },

    /**
    * Gets a Contact Material based on the two given Materials.
    *
    * @method Phaser.Physics.P2#getContactMaterial
    * @param {Phaser.Physics.P2.Material} materialA - The first Material to search for.
    * @param {Phaser.Physics.P2.Material} materialB - The second Material to search for.
    * @return {Phaser.Physics.P2.ContactMaterial|boolean} The Contact Material or false if none was found matching the Materials given.
    */
    getContactMaterial: function (materialA, materialB) {

        return this.world.getContactMaterial(materialA, materialB);

    },

    /**
    * Sets the given Material against all Shapes owned by all the Bodies in the given array.
    *
    * @method Phaser.Physics.P2#setMaterial
    * @param {Phaser.Physics.P2.Material} material - The Material to be applied to the given Bodies.
    * @param {array<Phaser.Physics.P2.Body>} bodies - An Array of Body objects that the given Material will be set on.
    */
    setMaterial: function (material, bodies) {

        var i = bodies.length;

        while (i--)
        {
            bodies.setMaterial(material);
        }

    },

    /**
    * Creates a Material. Materials are applied to Shapes owned by a Body and can be set with Body.setMaterial().
    * Materials are a way to control what happens when Shapes collide. Combine unique Materials together to create Contact Materials.
    * Contact Materials have properties such as friction and restitution that allow for fine-grained collision control between different Materials.
    *
    * @method Phaser.Physics.P2#createMaterial
    * @param {string} [name] - Optional name of the Material. Each Material has a unique ID but string names are handy for debugging.
    * @param {Phaser.Physics.P2.Body} [body] - Optional Body. If given it will assign the newly created Material to the Body shapes.
    * @return {Phaser.Physics.P2.Material} The Material that was created. This is also stored in Phaser.Physics.P2.materials.
    */
    createMaterial: function (name, body) {

        name = name || '';

        var material = new Phaser.Physics.P2.Material(name);

        this.materials.push(material);

        if (typeof body !== 'undefined')
        {
            body.setMaterial(material);
        }

        return material;

    },

    /**
    * Creates a Contact Material from the two given Materials. You can then edit the properties of the Contact Material directly.
    *
    * @method Phaser.Physics.P2#createContactMaterial
    * @param {Phaser.Physics.P2.Material} [materialA] - The first Material to create the ContactMaterial from. If undefined it will create a new Material object first.
    * @param {Phaser.Physics.P2.Material} [materialB] - The second Material to create the ContactMaterial from. If undefined it will create a new Material object first.
    * @param {object} [options] - Material options object.
    * @return {Phaser.Physics.P2.ContactMaterial} The Contact Material that was created.
    */
    createContactMaterial: function (materialA, materialB, options) {

        if (typeof materialA === 'undefined') { materialA = this.createMaterial(); }
        if (typeof materialB === 'undefined') { materialB = this.createMaterial(); }

        var contact = new Phaser.Physics.P2.ContactMaterial(materialA, materialB, options);

        return this.addContactMaterial(contact);

    },

    /**
    * Populates and returns an array of all current Bodies in the world.
    *
    * @method Phaser.Physics.P2#getBodies
    * @return {array<Phaser.Physics.P2.Body>} An array containing all current Bodies in the world.
    */
    getBodies: function () {

        var output = [];
        var i = this.world.bodies.length;

        while (i--)
        {
            output.push(this.world.bodies[i].parent);
        }

        return output;

    },

    /**
    * Populates and returns an array of all current Springs in the world.
    *
    * @method Phaser.Physics.P2#getSprings
    * @return {array<Phaser.Physics.P2.Spring>} An array containing all current Springs in the world.
    */
    getSprings: function () {

        var output = [];
        var i = this.world.springs.length;

        while (i--)
        {
            output.push(this.world.springs[i]);
        }

        return output;

    },

    /**
    * Populates and returns an array of all current Constraints in the world.
    *
    * @method Phaser.Physics.P2#getConstraints
    * @return {array<Phaser.Physics.P2.Constraints>} An array containing all current Constraints in the world.
    */
    getConstraints: function () {

        var output = [];
        var i = this.world.constraints.length;

        while (i--)
        {
            output.push(this.world.springs[i]);
        }

        return output;

    },

    /**
    * Test if a world point overlaps bodies.
    *
    * @method Phaser.Physics.P2#hitTest
    * @param {Phaser.Point} worldPoint - Point to use for intersection tests.
    * @param {Array} bodies - A list of objects to check for intersection.
    * @param {number} precision - Used for matching against particles and lines. Adds some margin to these infinitesimal objects.
    * @return {Array} Array of bodies that overlap the point.
    */
    hitTest: function (worldPoint, bodies, precision) {

    },

    /**
    * Converts the current world into a JSON object.
    *
    * @method Phaser.Physics.P2#toJSON
    * @return {object} A JSON representation of the world.
    */
    toJSON: function () {

        this.world.toJSON();

    },

    createCollisionGroup: function () {

        var bitmask = Math.pow(2, this._collisionGroupID);

        if (this._wallShapes[0])
        {
            this._wallShapes[0].collisionMask = this._wallShapes[0].collisionMask | bitmask;
        }

        if (this._wallShapes[1])
        {
            this._wallShapes[1].collisionMask = this._wallShapes[1].collisionMask | bitmask;
        }

        if (this._wallShapes[2])
        {
            this._wallShapes[2].collisionMask = this._wallShapes[2].collisionMask | bitmask;
        }

        if (this._wallShapes[3])
        {
            this._wallShapes[3].collisionMask = this._wallShapes[3].collisionMask | bitmask;
        }

        this._collisionGroupID++;

        var group = new Phaser.Physics.P2.CollisionGroup(bitmask);

        this.collisionGroups.push(group);

        return group;

    },

    /**
    * @method Phaser.Physics.P2.prototype.createBody
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
    createBody: function (x, y, mass, addToWorld, options, data) {

        if (typeof addToWorld === 'undefined') { addToWorld = false; }

        var body = new Phaser.Physics.P2.Body(this.game, null, x, y, mass);

        if (data)
        {
            var result = body.addPolygon(options, data);

            if (!result)
            {
                return false;
            }
        }

        if (addToWorld)
        {
            this.world.addBody(body.data);
        }

        return body;

    },

    /**
    * @method Phaser.Physics.P2.prototype.createBody
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
    createParticle: function (x, y, mass, addToWorld, options, data) {

        if (typeof addToWorld === 'undefined') { addToWorld = false; }

        var body = new Phaser.Physics.P2.Body(this.game, null, x, y, mass);

        if (data)
        {
            var result = body.addPolygon(options, data);

            if (!result)
            {
                return false;
            }
        }

        if (addToWorld)
        {
            this.world.addBody(body.data);
        }

        return body;

    },



};

/**
* @name Phaser.Physics.P2#friction
* @property {number} friction - Friction between colliding bodies. This value is used if no matching ContactMaterial is found for a Material pair.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "friction", {
    
    get: function () {

        return this.world.defaultFriction;

    },

    set: function (value) {

        this.world.defaultFriction = value;

    }

});

/**
* @name Phaser.Physics.P2#restituion
* @property {number} restitution - Default coefficient of restitution between colliding bodies. This value is used if no matching ContactMaterial is found for a Material pair.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "restituion", {
    
    get: function () {

        return this.world.defaultRestitution;

    },

    set: function (value) {

        this.world.defaultRestitution = value;

    }

});

/**
* @name Phaser.Physics.P2#applySpringForces
* @property {boolean} applySpringForces - Enable to automatically apply spring forces each step.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "applySpringForces", {
    
    get: function () {

        return this.world.applySpringForces;

    },

    set: function (value) {

        this.world.applySpringForces = value;

    }

});

/**
* @name Phaser.Physics.P2#applyDamping
* @property {boolean} applyDamping - Enable to automatically apply body damping each step.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "applyDamping", {
    
    get: function () {

        return this.world.applyDamping;

    },

    set: function (value) {

        this.world.applyDamping = value;

    }

});

/**
* @name Phaser.Physics.P2#applyGravity
* @property {boolean} applyGravity - Enable to automatically apply gravity each step.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "applyGravity", {
    
    get: function () {

        return this.world.applyGravity;

    },

    set: function (value) {

        this.world.applyGravity = value;

    }

});

/**
* @name Phaser.Physics.P2#solveConstraints
* @property {boolean} solveConstraints - Enable/disable constraint solving in each step.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "solveConstraints", {
    
    get: function () {

        return this.world.solveConstraints;

    },

    set: function (value) {

        this.world.solveConstraints = value;

    }

});

/**
* @name Phaser.Physics.P2#time
* @property {boolean} time - The World time.
* @readonly
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "time", {
    
    get: function () {

        return this.world.time;

    }

});

/**
* @name Phaser.Physics.P2#emitImpactEvent
* @property {boolean} emitImpactEvent - Set to true if you want to the world to emit the "impact" event. Turning this off could improve performance.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "emitImpactEvent", {
    
    get: function () {

        return this.world.emitImpactEvent;

    },

    set: function (value) {

        this.world.emitImpactEvent = value;

    }

});

/**
* @name Phaser.Physics.P2#enableBodySleeping
* @property {boolean} enableBodySleeping - Enable / disable automatic body sleeping.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "enableBodySleeping", {
    
    get: function () {

        return this.world.enableBodySleeping;

    },

    set: function (value) {

        this.world.enableBodySleeping = value;

    }

});

/**
* @name Phaser.Physics.P2#total
* @property {number} total - The total number of bodies in the world.
* @readonly
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "total", {
    
    get: function () {

        return this.world.bodies.length;

    }

});
