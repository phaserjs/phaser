/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

//  Add an extra properties to p2 that we need
p2.Body.prototype.parent = null;
p2.Spring.prototype.parent = null;

/**
* This is your main access to the P2 Physics World.
* From here you can create materials, listen for events and add bodies into the physics simulation.
* 
* @class Phaser.Physics.P2
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
    else
    {
        if (!config.hasOwnProperty('gravity'))
        {
            config.gravity = [0, 0];
        }

        if (!config.hasOwnProperty('broadphase'))
        {
            config.broadphase = new p2.SAPBroadphase();
        }
    }

    /**
    * @property {object} config - The p2 World configuration object.
    * @protected
    */
    this.config = config;

    /**
    * @property {p2.World} world - The p2 World in which the simulation is run.
    * @protected
    */
    this.world = new p2.World(this.config);

    /**
    * @property {number} frameRate - The frame rate the world will be stepped at. Defaults to 1 / 60, but you can change here. Also see useElapsedTime property.
    * @default
    */
    this.frameRate = 1 / 60;

    /**
    * @property {boolean} useElapsedTime - If true the frameRate value will be ignored and instead p2 will step with the value of Game.Time.physicsElapsed, which is a delta time value.
    * @default
    */
    this.useElapsedTime = false;

    /**
    * @property {boolean} paused - The paused state of the P2 World.
    * @default
    */
    this.paused = false;

    /**
    * @property {array<Phaser.Physics.P2.Material>} materials - A local array of all created Materials.
    * @protected
    */
    this.materials = [];

    /**
    * @property {Phaser.Physics.P2.InversePointProxy} gravity - The gravity applied to all bodies each step.
    */
    this.gravity = new Phaser.Physics.P2.InversePointProxy(this, this.world.gravity);

    /**
    * @property {object} walls - An object containing the 4 wall bodies that bound the physics world.
    */
    this.walls = { left: null, right: null, top: null, bottom: null };

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
    * @property {function} postBroadphaseCallback - A postBroadphase callback.
    */
    this.postBroadphaseCallback = null;

    /**
    * @property {object} callbackContext - The context under which the callbacks are fired.
    */
    this.callbackContext = null;

    /**
    * @property {Phaser.Signal} onBeginContact - Dispatched when a first contact is created between two bodies. This event is fired before the step has been done.
    */
    this.onBeginContact = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onEndContact - Dispatched when final contact occurs between two bodies. This event is fired before the step has been done.
    */
    this.onEndContact = new Phaser.Signal();

    //  Pixel to meter function overrides
    if (config.hasOwnProperty('mpx') && config.hasOwnProperty('pxm') && config.hasOwnProperty('mpxi') && config.hasOwnProperty('pxmi'))
    {
        this.mpx = config.mpx;
        this.mpxi = config.mpxi;
        this.pxm = config.pxm;
        this.pxmi = config.pxmi;
    }

    //  Hook into the World events
    this.world.on("beginContact", this.beginContactHandler, this);
    this.world.on("endContact", this.endContactHandler, this);

    /**
    * @property {array} collisionGroups - An array containing the collision groups that have been defined in the World.
    */
    this.collisionGroups = [];

    /**
    * @property {Phaser.Physics.P2.CollisionGroup} nothingCollisionGroup - A default collision group.
    */
    this.nothingCollisionGroup = new Phaser.Physics.P2.CollisionGroup(1);

    /**
    * @property {Phaser.Physics.P2.CollisionGroup} boundsCollisionGroup - A default collision group.
    */
    this.boundsCollisionGroup = new Phaser.Physics.P2.CollisionGroup(2);

    /**
    * @property {Phaser.Physics.P2.CollisionGroup} everythingCollisionGroup - A default collision group.
    */
    this.everythingCollisionGroup = new Phaser.Physics.P2.CollisionGroup(2147483648);

    /**
    * @property {array} boundsCollidesWith - An array of the bodies the world bounds collides with.
    */
    this.boundsCollidesWith = [];

    /**
    * @property {array} _toRemove - Internal var used to hold references to bodies to remove from the world on the next step.
    * @private
    */
    this._toRemove = [];

    /**
    * @property {number} _collisionGroupID - Internal var.
    * @private
    */
    this._collisionGroupID = 2;

    /**
    * @property {boolean} _boundsLeft - Internal var that keeps track of world bounds settings.
    * @private
    */
    this._boundsLeft = true;

    /**
    * @property {boolean} _boundsRight - Internal var that keeps track of world bounds settings.
    * @private
    */
    this._boundsRight = true;

    /**
    * @property {boolean} _boundsTop - Internal var that keeps track of world bounds settings.
    * @private
    */
    this._boundsTop = true;

    /**
    * @property {boolean} _boundsBottom - Internal var that keeps track of world bounds settings.
    * @private
    */
    this._boundsBottom = true;

    /**
    * @property {boolean} _boundsOwnGroup - Internal var that keeps track of world bounds settings.
    * @private
    */
    this._boundsOwnGroup = false;

    //  By default we want everything colliding with everything
    this.setBoundsToWorld(true, true, true, true, false);

};

Phaser.Physics.P2.prototype = {

    /**
    * This will add a P2 Physics body into the removal list for the next step.
    *
    * @method Phaser.Physics.P2#removeBodyNextStep
    * @param {Phaser.Physics.P2.Body} body - The body to remove at the start of the next step.
    */
    removeBodyNextStep: function (body) {

        this._toRemove.push(body);

    },

    /**
    * Called at the start of the core update loop. Purges flagged bodies from the world.
    *
    * @method Phaser.Physics.P2#preUpdate
    */
    preUpdate: function () {

        var i = this._toRemove.length;

        while (i--)
        {
            this.removeBody(this._toRemove[i]);
        }

        this._toRemove.length = 0;

    },

    /**
    * This will create a P2 Physics body on the given game object or array of game objects.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    * Note: When the game object is enabled for P2 physics it has its anchor x/y set to 0.5 so it becomes centered.
    *
    * @method Phaser.Physics.P2#enable
    * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
    * @param {boolean} [debug=false] - Create a debug object to go with this body?
    * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
    */
    enable: function (object, debug, children) {

        if (typeof debug === 'undefined') { debug = false; }
        if (typeof children === 'undefined') { children = true; }

        var i = 1;

        if (Array.isArray(object))
        {
            i = object.length;

            while (i--)
            {
                if (object[i] instanceof Phaser.Group)
                {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children, debug, children);
                }
                else
                {
                    this.enableBody(object[i], debug);

                    if (children && object[i].hasOwnProperty('children') && object[i].children.length > 0)
                    {
                        this.enable(object[i], debug, true);
                    }
                }
            }
        }
        else
        {
            if (object instanceof Phaser.Group)
            {
                //  If it's a Group then we do it on the children regardless
                this.enable(object.children, debug, children);
            }
            else
            {
                this.enableBody(object, debug);

                if (children && object.hasOwnProperty('children') && object.children.length > 0)
                {
                    this.enable(object.children, debug, true);
                }
            }
        }

    },

    /**
    * Creates a P2 Physics body on the given game object.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the body is nulled.
    *
    * @method Phaser.Physics.P2#enableBody
    * @param {object} object - The game object to create the physics body on. A body will only be created if this object has a null `body` property.
    * @param {boolean} debug - Create a debug object to go with this body?
    */
    enableBody: function (object, debug) {

        if (object.hasOwnProperty('body') && object.body === null)
        {
            object.body = new Phaser.Physics.P2.Body(this.game, object, object.x, object.y, 1);
            object.body.debug = debug;
            object.anchor.set(0.5);
        }

    },

    /**
    * Impact event handling is disabled by default. Enable it before any impact events will be dispatched.
    * In a busy world hundreds of impact events can be generated every step, so only enable this if you cannot do what you need via beginContact or collision masks.
    *
    * @method Phaser.Physics.P2#setImpactEvents
    * @param {boolean} state - Set to true to enable impact events, or false to disable.
    */
    setImpactEvents: function (state) {

        if (state)
        {
            this.world.on("impact", this.impactHandler, this);
        }
        else
        {
            this.world.off("impact", this.impactHandler, this);
        }

    },

    /**
    * Sets a callback to be fired after the Broadphase has collected collision pairs in the world.
    * Just because a pair exists it doesn't mean they *will* collide, just that they potentially could do.
    * If your calback returns `false` the pair will be removed from the narrowphase. This will stop them testing for collision this step.
    * Returning `true` from the callback will ensure they are checked in the narrowphase.
    *
    * @method Phaser.Physics.P2#setPostBroadphaseCallback
    * @param {function} callback - The callback that will receive the postBroadphase event data. It must return a boolean. Set to null to disable an existing callback.
    * @param {object} context - The context under which the callback will be fired.
    */
    setPostBroadphaseCallback: function (callback, context) {

        this.postBroadphaseCallback = callback;
        this.callbackContext = context;

        if (callback !== null)
        {
            this.world.on("postBroadphase", this.postBroadphaseHandler, this);
        }
        else
        {
            this.world.off("postBroadphase", this.postBroadphaseHandler, this);
        }

    },

    /**
    * Internal handler for the postBroadphase event.
    *
    * @method Phaser.Physics.P2#postBroadphaseHandler
    * @private
    * @param {object} event - The event data.
    */
    postBroadphaseHandler: function (event) {

        if (!this.postBroadphaseCallback || event.pairs.length === 0)
        {
            return;
        }

        for (var i = event.pairs.length - 2; i >= 0; i -= 2)
        {
            if (event.pairs[i].parent && event.pairs[i+1].parent && !this.postBroadphaseCallback.call(this.callbackContext, event.pairs[i].parent, event.pairs[i+1].parent))
            {
                event.pairs.splice(i, 2);
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
    * @param {object} event - The event data.
    */
    beginContactHandler: function (event) {

        this.onBeginContact.dispatch(event.bodyA, event.bodyB, event.shapeA, event.shapeB, event.contactEquations);

        if (event.bodyA.parent)
        {
            event.bodyA.parent.onBeginContact.dispatch(event.bodyB.parent, event.shapeA, event.shapeB, event.contactEquations);
        }

        if (event.bodyB.parent)
        {
            event.bodyB.parent.onBeginContact.dispatch(event.bodyA.parent, event.shapeB, event.shapeA, event.contactEquations);
        }

    },

    /**
    * Handles a p2 end contact event.
    *
    * @method Phaser.Physics.P2#endContactHandler
    * @param {object} event - The event data.
    */
    endContactHandler: function (event) {

        this.onEndContact.dispatch(event.bodyA, event.bodyB, event.shapeA, event.shapeB);

        if (event.bodyA.parent)
        {
            event.bodyA.parent.onEndContact.dispatch(event.bodyB.parent, event.shapeA, event.shapeB);
        }

        if (event.bodyB.parent)
        {
            event.bodyB.parent.onEndContact.dispatch(event.bodyA.parent, event.shapeB, event.shapeA);
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

        if (left && this.walls.left)
        {
            this.walls.left.shapes[0].material = material;
        }

        if (right && this.walls.right)
        {
            this.walls.right.shapes[0].material = material;
        }

        if (top && this.walls.top)
        {
            this.walls.top.shapes[0].material = material;
        }

        if (bottom && this.walls.bottom)
        {
            this.walls.bottom.shapes[0].material = material;
        }

    },

    /**
    * By default the World will be set to collide everything with everything. The bounds of the world is a Body with 4 shapes, one for each face.
    * If you start to use your own collision groups then your objects will no longer collide with the bounds.
    * To fix this you need to adjust the bounds to use its own collision group first BEFORE changing your Sprites collision group.
    *
    * @method Phaser.Physics.P2#updateBoundsCollisionGroup
    * @param {boolean} [setCollisionGroup=true] - If true the Bounds will be set to use its own Collision Group.
    */
    updateBoundsCollisionGroup: function (setCollisionGroup) {

        var mask = this.everythingCollisionGroup.mask;

        if (typeof setCollisionGroup === 'undefined') { mask = this.boundsCollisionGroup.mask; }

        if (this.walls.left)
        {
            this.walls.left.shapes[0].collisionGroup = mask;
        }

        if (this.walls.right)
        {
            this.walls.right.shapes[0].collisionGroup = mask;
        }

        if (this.walls.top)
        {
            this.walls.top.shapes[0].collisionGroup = mask;
        }

        if (this.walls.bottom)
        {
            this.walls.bottom.shapes[0].collisionGroup = mask;
        }

    },

    /**
    * Sets the bounds of the Physics world to match the given world pixel dimensions.
    * You can optionally set which 'walls' to create: left, right, top or bottom.
    * If none of the walls are given it will default to use the walls settings it had previously.
    * I.e. if you previously told it to not have the left or right walls, and you then adjust the world size
    * the newly created bounds will also not have the left and right walls.
    * Explicitly state them in the parameters to override this.
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

        if (typeof left === 'undefined') { left = this._boundsLeft; }
        if (typeof right === 'undefined') { right = this._boundsRight; }
        if (typeof top === 'undefined') { top = this._boundsTop; }
        if (typeof bottom === 'undefined') { bottom = this._boundsBottom; }
        if (typeof setCollisionGroup === 'undefined') { setCollisionGroup = this._boundsOwnGroup; }

        if (this.walls.left)
        {
            this.world.removeBody(this.walls.left);
        }

        if (this.walls.right)
        {
            this.world.removeBody(this.walls.right);
        }

        if (this.walls.top)
        {
            this.world.removeBody(this.walls.top);
        }

        if (this.walls.bottom)
        {
            this.world.removeBody(this.walls.bottom);
        }

        if (left)
        {
            this.walls.left = new p2.Body({ mass: 0, position: [ this.pxmi(x), this.pxmi(y) ], angle: 1.5707963267948966 });
            this.walls.left.addShape(new p2.Plane());

            if (setCollisionGroup)
            {
                this.walls.left.shapes[0].collisionGroup = this.boundsCollisionGroup.mask;
            }

            this.world.addBody(this.walls.left);
        }

        if (right)
        {
            this.walls.right = new p2.Body({ mass: 0, position: [ this.pxmi(x + width), this.pxmi(y) ], angle: -1.5707963267948966 });
            this.walls.right.addShape(new p2.Plane());

            if (setCollisionGroup)
            {
                this.walls.right.shapes[0].collisionGroup = this.boundsCollisionGroup.mask;
            }

            this.world.addBody(this.walls.right);
        }

        if (top)
        {
            this.walls.top = new p2.Body({ mass: 0, position: [ this.pxmi(x), this.pxmi(y) ], angle: -3.141592653589793 });
            this.walls.top.addShape(new p2.Plane());

            if (setCollisionGroup)
            {
                this.walls.top.shapes[0].collisionGroup = this.boundsCollisionGroup.mask;
            }

            this.world.addBody(this.walls.top);
        }

        if (bottom)
        {
            this.walls.bottom = new p2.Body({ mass: 0, position: [ this.pxmi(x), this.pxmi(y + height) ] });
            this.walls.bottom.addShape(new p2.Plane());

            if (setCollisionGroup)
            {
                this.walls.bottom.shapes[0].collisionGroup = this.boundsCollisionGroup.mask;
            }

            this.world.addBody(this.walls.bottom);
        }

        //  Remember the bounds settings in case they change later on via World.setBounds
        this._boundsLeft = left;
        this._boundsRight = right;
        this._boundsTop = top;
        this._boundsBottom = bottom;
        this._boundsOwnGroup = setCollisionGroup;

    },

    /**
    * Pauses the P2 World independent of the game pause state.
    *
    * @method Phaser.Physics.P2#pause
    */
    pause: function() {

        this.paused = true;

    },
    
    /**
    * Resumes a paused P2 World.
    *
    * @method Phaser.Physics.P2#resume
    */
    resume: function() {

        this.paused = false;

    },

    /**
    * Internal P2 update loop.
    *
    * @method Phaser.Physics.P2#update
    */
    update: function () {

        // Do nothing if the physics engine was paused before
        if (this.paused)
        {
            return;
        }

        if (this.useElapsedTime)
        {
            this.world.step(this.game.time.physicsElapsed);
        }
        else
        {
            this.world.step(this.frameRate);
        }

    },

    /**
    * Called by Phaser.Physics when a State swap occurs.
    * Starts the begin and end Contact listeners again.
    *
    * @method Phaser.Physics.P2#reset
    */
    reset: function () {

        this.world.on("beginContact", this.beginContactHandler, this);
        this.world.on("endContact", this.endContactHandler, this);

        this.nothingCollisionGroup = new Phaser.Physics.P2.CollisionGroup(1);
        this.boundsCollisionGroup = new Phaser.Physics.P2.CollisionGroup(2);
        this.everythingCollisionGroup = new Phaser.Physics.P2.CollisionGroup(2147483648);

        this._collisionGroupID = 2;

        this.setBoundsToWorld(true, true, true, true, false);

    },

    /**
    * Clears all bodies from the simulation, resets callbacks and resets the collision bitmask.
    * 
    * The P2 world is also cleared:
    * 
    * * Removes all solver equations
    * * Removes all constraints
    * * Removes all bodies
    * * Removes all springs
    * * Removes all contact materials
    * 
    * This is called automatically when you switch state.
    *
    * @method Phaser.Physics.P2#clear
    */
    clear: function () {

        this.world.time = 0;
        this.world.fixedStepTime = 0;

        // Remove all solver equations
        if (this.world.solver && this.world.solver.equations.length)
        {
            this.world.solver.removeAllEquations();
        }

        // Remove all constraints
        var cs = this.world.constraints;

        for (var i = cs.length - 1; i >= 0; i--)
        {
            this.world.removeConstraint(cs[i]);
        }

        // Remove all bodies
        var bodies = this.world.bodies;

        for (var i = bodies.length - 1; i >= 0; i--)
        {
            this.world.removeBody(bodies[i]);
        }

        // Remove all springs
        var springs = this.world.springs;

        for (var i = springs.length - 1; i >= 0; i--)
        {
            this.world.removeSpring(springs[i]);
        }

        // Remove all contact materials
        var cms = this.world.contactMaterials;

        for (var i = cms.length - 1; i >= 0; i--)
        {
            this.world.removeContactMaterial(cms[i]);
        }

        this.world.off("beginContact", this.beginContactHandler, this);
        this.world.off("endContact", this.endContactHandler, this);

        this.postBroadphaseCallback = null;
        this.callbackContext = null;
        this.impactCallback = null;

        this.collisionGroups = [];
        this._toRemove = [];
        this.boundsCollidesWith = [];

    },

    /**
    * Clears all bodies from the simulation and unlinks World from Game. Should only be called on game shutdown. Call `clear` on a State change.
    *
    * @method Phaser.Physics.P2#destroy
    */
    destroy: function () {

        this.clear();

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
    * Removes a body from the world. This will silently fail if the body wasn't part of the world to begin with.
    *
    * @method Phaser.Physics.P2#removeBody
    * @param {Phaser.Physics.P2.Body} body - The Body to remove from the World.
    * @return {Phaser.Physics.P2.Body} The Body that was removed.
    */
    removeBody: function (body) {

        if (body.data.world == this.world)
        {
            this.world.removeBody(body.data);

            this.onBodyRemoved.dispatch(body);
        }

        return body;

    },

    /**
    * Adds a Spring to the world.
    *
    * @method Phaser.Physics.P2#addSpring
    * @param {Phaser.Physics.P2.Spring|p2.LinearSpring|p2.RotationalSpring} spring - The Spring to add to the World.
    * @return {Phaser.Physics.P2.Spring} The Spring that was added.
    */
    addSpring: function (spring) {

        if (spring instanceof Phaser.Physics.P2.Spring || spring instanceof Phaser.Physics.P2.RotationalSpring)
        {
            this.world.addSpring(spring.data);
        }
        else
        {
            this.world.addSpring(spring);
        }

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

        if (spring instanceof Phaser.Physics.P2.Spring || spring instanceof Phaser.Physics.P2.RotationalSpring)
        {
            this.world.removeSpring(spring.data);
        }
        else
        {
            this.world.removeSpring(spring);
        }

        this.onSpringRemoved.dispatch(spring);

        return spring;

    },

    /**
    * Creates a constraint that tries to keep the distance between two bodies constant.
    *
    * @method Phaser.Physics.P2#createDistanceConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {number} distance - The distance to keep between the bodies.
    * @param {Array} [localAnchorA] - The anchor point for bodyA, defined locally in bodyA frame. Defaults to [0,0].
    * @param {Array} [localAnchorB] - The anchor point for bodyB, defined locally in bodyB frame. Defaults to [0,0].
    * @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
    * @return {Phaser.Physics.P2.DistanceConstraint} The constraint
    */
    createDistanceConstraint: function (bodyA, bodyB, distance, localAnchorA, localAnchorB, maxForce) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.DistanceConstraint(this, bodyA, bodyB, distance, localAnchorA, localAnchorB, maxForce));
        }

    },

    /**
    * Creates a constraint that tries to keep the distance between two bodies constant.
    *
    * @method Phaser.Physics.P2#createGearConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {number} [angle=0] - The relative angle
    * @param {number} [ratio=1] - The gear ratio.
    * @return {Phaser.Physics.P2.GearConstraint} The constraint
    */
    createGearConstraint: function (bodyA, bodyB, angle, ratio) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.GearConstraint(this, bodyA, bodyB, angle, ratio));
        }

    },

    /**
    * Connects two bodies at given offset points, letting them rotate relative to each other around this point.
    * The pivot points are given in world (pixel) coordinates.
    *
    * @method Phaser.Physics.P2#createRevoluteConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Array} pivotA - The point relative to the center of mass of bodyA which bodyA is constrained to. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {Array} pivotB - The point relative to the center of mass of bodyB which bodyB is constrained to. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {number} [maxForce=0] - The maximum force that should be applied to constrain the bodies.
    * @param {Float32Array} [worldPivot=null] - A pivot point given in world coordinates. If specified, localPivotA and localPivotB are automatically computed from this value.
    * @return {Phaser.Physics.P2.RevoluteConstraint} The constraint
    */
    createRevoluteConstraint: function (bodyA, pivotA, bodyB, pivotB, maxForce, worldPivot) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.RevoluteConstraint(this, bodyA, pivotA, bodyB, pivotB, maxForce, worldPivot));
        }

    },

    /**
    * Locks the relative position between two bodies.
    *
    * @method Phaser.Physics.P2#createLockConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {Array} [offset] - The offset of bodyB in bodyA's frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {number} [angle=0] - The angle of bodyB in bodyA's frame.
    * @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
    * @return {Phaser.Physics.P2.LockConstraint} The constraint
    */
    createLockConstraint: function (bodyA, bodyB, offset, angle, maxForce) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.LockConstraint(this, bodyA, bodyB, offset, angle, maxForce));
        }

    },

    /**
    * Constraint that only allows bodies to move along a line, relative to each other.
    * See http://www.iforce2d.net/b2dtut/joints-prismatic
    *
    * @method Phaser.Physics.P2#createPrismaticConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {boolean} [lockRotation=true] - If set to false, bodyB will be free to rotate around its anchor point.
    * @param {Array} [anchorA] - Body A's anchor point, defined in its own local frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {Array} [anchorB] - Body A's anchor point, defined in its own local frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {Array} [axis] - An axis, defined in body A frame, that body B's anchor point may slide along. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
    * @return {Phaser.Physics.P2.PrismaticConstraint} The constraint
    */
    createPrismaticConstraint: function (bodyA, bodyB, lockRotation, anchorA, anchorB, axis, maxForce) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.PrismaticConstraint(this, bodyA, bodyB, lockRotation, anchorA, anchorB, axis, maxForce));
        }

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
            bodies[i].setMaterial(material);
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
    * Populates and returns an array with references to of all current Bodies in the world.
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
    * Checks the given object to see if it has a p2.Body and if so returns it.
    *
    * @method Phaser.Physics.P2#getBody
    * @param {object} object - The object to check for a p2.Body on.
    * @return {p2.Body} The p2.Body, or null if not found.
    */
    getBody: function (object) {

        if (object instanceof p2.Body)
        {
            //  Native p2 body
            return object;
        }
        else if (object instanceof Phaser.Physics.P2.Body)
        {
            //  Phaser P2 Body
            return object.data;
        }
        else if (object['body'] && object['body'].type === Phaser.Physics.P2JS)
        {
            //  Sprite, TileSprite, etc
            return object.body.data;
        }

        return null;

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
            output.push(this.world.springs[i].parent);
        }

        return output;

    },

    /**
    * Populates and returns an array of all current Constraints in the world.
    * You will get an array of p2 constraints back. This can be of mixed types, for example the array may contain
    * PrismaticConstraints, RevoluteConstraints or any other valid p2 constraint type.
    *
    * @method Phaser.Physics.P2#getConstraints
    * @return {array<Phaser.Physics.P2.Constraint>} An array containing all current Constraints in the world.
    */
    getConstraints: function () {

        var output = [];
        var i = this.world.constraints.length;

        while (i--)
        {
            output.push(this.world.constraints[i]);
        }

        return output;

    },

    /**
    * Test if a world point overlaps bodies. You will get an array of actual P2 bodies back. You can find out which Sprite a Body belongs to
    * (if any) by checking the Body.parent.sprite property. Body.parent is a Phaser.Physics.P2.Body property.
    *
    * @method Phaser.Physics.P2#hitTest
    * @param {Phaser.Point} worldPoint - Point to use for intersection tests. The points values must be in world (pixel) coordinates.
    * @param {Array<Phaser.Physics.P2.Body|Phaser.Sprite|p2.Body>} [bodies] - A list of objects to check for intersection. If not given it will check Phaser.Physics.P2.world.bodies (i.e. all world bodies)
    * @param {number} [precision=5] - Used for matching against particles and lines. Adds some margin to these infinitesimal objects.
    * @param {boolean} [filterStatic=false] - If true all Static objects will be removed from the results array.
    * @return {Array} Array of bodies that overlap the point.
    */
    hitTest: function (worldPoint, bodies, precision, filterStatic) {

        if (typeof bodies === 'undefined') { bodies = this.world.bodies; }
        if (typeof precision === 'undefined') { precision = 5; }
        if (typeof filterStatic === 'undefined') { filterStatic = false; }

        var physicsPosition = [ this.pxmi(worldPoint.x), this.pxmi(worldPoint.y) ];

        var query = [];
        var i = bodies.length;

        while (i--)
        {
            if (bodies[i] instanceof Phaser.Physics.P2.Body && !(filterStatic && bodies[i].data.type === p2.Body.STATIC))
            {
                query.push(bodies[i].data);
            }
            else if (bodies[i] instanceof p2.Body && bodies[i].parent && !(filterStatic && bodies[i].type === p2.Body.STATIC))
            {
                query.push(bodies[i]);
            }
            else if (bodies[i] instanceof Phaser.Sprite && bodies[i].hasOwnProperty('body') && !(filterStatic && bodies[i].body.data.type === p2.Body.STATIC))
            {
                query.push(bodies[i].body.data);
            }
        }

        return this.world.hitTest(physicsPosition, query, precision);

    },

    /**
    * Converts the current world into a JSON object.
    *
    * @method Phaser.Physics.P2#toJSON
    * @return {object} A JSON representation of the world.
    */
    toJSON: function () {

        return this.world.toJSON();

    },

    /**
    * Creates a new Collision Group and optionally applies it to the given object.
    * Collision Groups are handled using bitmasks, therefore you have a fixed limit you can create before you need to re-use older groups.
    *
    * @method Phaser.Physics.P2#createCollisionGroup
    * @param {Phaser.Group|Phaser.Sprite} [object] - An optional Sprite or Group to apply the Collision Group to. If a Group is given it will be applied to all top-level children.
    */
    createCollisionGroup: function (object) {

        var bitmask = Math.pow(2, this._collisionGroupID);

        if (this.walls.left)
        {
            this.walls.left.shapes[0].collisionMask = this.walls.left.shapes[0].collisionMask | bitmask;
        }

        if (this.walls.right)
        {
            this.walls.right.shapes[0].collisionMask = this.walls.right.shapes[0].collisionMask | bitmask;
        }

        if (this.walls.top)
        {
            this.walls.top.shapes[0].collisionMask = this.walls.top.shapes[0].collisionMask | bitmask;
        }

        if (this.walls.bottom)
        {
            this.walls.bottom.shapes[0].collisionMask = this.walls.bottom.shapes[0].collisionMask | bitmask;
        }

        this._collisionGroupID++;

        var group = new Phaser.Physics.P2.CollisionGroup(bitmask);

        this.collisionGroups.push(group);

        if (object)
        {
            this.setCollisionGroup(object, group);
        }

        return group;

    },

    /**
    * Sets the given CollisionGroup to be the collision group for all shapes in this Body, unless a shape is specified.
    * Note that this resets the collisionMask and any previously set groups. See Body.collides() for appending them.
    *
    * @method Phaser.Physics.P2y#setCollisionGroup
    * @param {Phaser.Group|Phaser.Sprite} object - A Sprite or Group to apply the Collision Group to. If a Group is given it will be applied to all top-level children.
    * @param {Phaser.Physics.CollisionGroup} group - The Collision Group that this Bodies shapes will use.
    */
    setCollisionGroup: function (object, group) {

        if (object instanceof Phaser.Group)
        {
            for (var i = 0; i < object.total; i++)
            {
                if (object.children[i]['body'] && object.children[i]['body'].type === Phaser.Physics.P2JS)
                {
                    object.children[i].body.setCollisionGroup(group);
                }
            }
        }
        else
        {
            object.body.setCollisionGroup(group);
        }

    },

    /**
    * Creates a linear spring, connecting two bodies. A spring can have a resting length, a stiffness and damping.
    *
    * @method Phaser.Physics.P2#createSpring
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {number} [restLength=1] - Rest length of the spring. A number > 0.
    * @param {number} [stiffness=100] - Stiffness of the spring. A number >= 0.
    * @param {number} [damping=1] - Damping of the spring. A number >= 0.
    * @param {Array} [worldA] - Where to hook the spring to body A in world coordinates. This value is an array by 2 elements, x and y, i.e: [32, 32].
    * @param {Array} [worldB] - Where to hook the spring to body B in world coordinates. This value is an array by 2 elements, x and y, i.e: [32, 32].
    * @param {Array} [localA] - Where to hook the spring to body A in local body coordinates. This value is an array by 2 elements, x and y, i.e: [32, 32].
    * @param {Array} [localB] - Where to hook the spring to body B in local body coordinates. This value is an array by 2 elements, x and y, i.e: [32, 32].
    * @return {Phaser.Physics.P2.Spring} The spring
    */
    createSpring: function (bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Spring, invalid body objects given');
        }
        else
        {
            return this.addSpring(new Phaser.Physics.P2.Spring(this, bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB));
        }

    },

    /**
    * Creates a rotational spring, connecting two bodies. A spring can have a resting length, a stiffness and damping.
    *
    * @method Phaser.Physics.P2#createRotationalSpring
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {number} [restAngle] - The relative angle of bodies at which the spring is at rest. If not given, it's set to the current relative angle between the bodies.
    * @param {number} [stiffness=100] - Stiffness of the spring. A number >= 0.
    * @param {number} [damping=1] - Damping of the spring. A number >= 0.
    * @return {Phaser.Physics.P2.RotationalSpring} The spring
    */
    createRotationalSpring: function (bodyA, bodyB, restAngle, stiffness, damping) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Rotational Spring, invalid body objects given');
        }
        else
        {
            return this.addSpring(new Phaser.Physics.P2.RotationalSpring(this, bodyA, bodyB, restAngle, stiffness, damping));
        }

    },

    /**
    * Creates a new Body and adds it to the World.
    *
    * @method Phaser.Physics.P2#createBody
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
    * @return {Phaser.Physics.P2.Body} The body
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
    * Creates a new Particle and adds it to the World.
    *
    * @method Phaser.Physics.P2#createParticle
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

    /**
    * Converts all of the polylines objects inside a Tiled ObjectGroup into physics bodies that are added to the world.
    * Note that the polylines must be created in such a way that they can withstand polygon decomposition.
    *
    * @method Phaser.Physics.P2#convertCollisionObjects
    * @param {Phaser.Tilemap} map - The Tilemap to get the map data from.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to map.currentLayer.
    * @param {boolean} [addToWorld=true] - If true it will automatically add each body to the world.
    * @return {array} An array of the Phaser.Physics.Body objects that have been created.
    */
    convertCollisionObjects: function (map, layer, addToWorld) {

        if (typeof addToWorld === 'undefined') { addToWorld = true; }

        var output = [];

        for (var i = 0, len = map.collision[layer].length; i < len; i++)
        {
            // name: json.layers[i].objects[v].name,
            // x: json.layers[i].objects[v].x,
            // y: json.layers[i].objects[v].y,
            // width: json.layers[i].objects[v].width,
            // height: json.layers[i].objects[v].height,
            // visible: json.layers[i].objects[v].visible,
            // properties: json.layers[i].objects[v].properties,
            // polyline: json.layers[i].objects[v].polyline

            var object = map.collision[layer][i];

            var body = this.createBody(object.x, object.y, 0, addToWorld, {}, object.polyline);

            if (body)
            {
                output.push(body);
            }
        }

        return output;

    },

    /**
    * Clears all physics bodies from the given TilemapLayer that were created with `World.convertTilemap`.
    *
    * @method Phaser.Physics.P2#clearTilemapLayerBodies
    * @param {Phaser.Tilemap} map - The Tilemap to get the map data from.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to map.currentLayer.
    */
    clearTilemapLayerBodies: function (map, layer) {

        layer = map.getLayer(layer);

        var i = map.layers[layer].bodies.length;

        while (i--)
        {
            map.layers[layer].bodies[i].destroy();
        }

        map.layers[layer].bodies.length = 0;

    },

    /**
    * Goes through all tiles in the given Tilemap and TilemapLayer and converts those set to collide into physics bodies.
    * Only call this *after* you have specified all of the tiles you wish to collide with calls like Tilemap.setCollisionBetween, etc.
    * Every time you call this method it will destroy any previously created bodies and remove them from the world.
    * Therefore understand it's a very expensive operation and not to be done in a core game update loop.
    *
    * @method Phaser.Physics.P2#convertTilemap
    * @param {Phaser.Tilemap} map - The Tilemap to get the map data from.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to map.currentLayer.
    * @param {boolean} [addToWorld=true] - If true it will automatically add each body to the world, otherwise it's up to you to do so.
    * @param {boolean} [optimize=true] - If true adjacent colliding tiles will be combined into a single body to save processing. However it means you cannot perform specific Tile to Body collision responses.
    * @return {array} An array of the Phaser.Physics.P2.Body objects that were created.
    */
    convertTilemap: function (map, layer, addToWorld, optimize) {

        layer = map.getLayer(layer);

        if (typeof addToWorld === 'undefined') { addToWorld = true; }
        if (typeof optimize === 'undefined') { optimize = true; }

        //  If the bodies array is already populated we need to nuke it
        this.clearTilemapLayerBodies(map, layer);

        var width = 0;
        var sx = 0;
        var sy = 0;

        for (var y = 0, h = map.layers[layer].height; y < h; y++)
        {
            width = 0;

            for (var x = 0, w = map.layers[layer].width; x < w; x++)
            {
                var tile = map.layers[layer].data[y][x];

                if (tile && tile.index > -1 && tile.collides)
                {
                    if (optimize)
                    {
                        var right = map.getTileRight(layer, x, y);

                        if (width === 0)
                        {
                            sx = tile.x * tile.width;
                            sy = tile.y * tile.height;
                            width = tile.width;
                        }

                        if (right && right.collides)
                        {
                            width += tile.width;
                        }
                        else
                        {
                            var body = this.createBody(sx, sy, 0, false);

                            body.addRectangle(width, tile.height, width / 2, tile.height / 2, 0);

                            if (addToWorld)
                            {
                                this.addBody(body);
                            }

                            map.layers[layer].bodies.push(body);

                            width = 0;
                        }
                    }
                    else
                    {
                        var body = this.createBody(tile.x * tile.width, tile.y * tile.height, 0, false);

                        body.addRectangle(tile.width, tile.height, tile.width / 2, tile.height / 2, 0);

                        if (addToWorld)
                        {
                            this.addBody(body);
                        }

                        map.layers[layer].bodies.push(body);
                    }
                }
            }
        }

        return map.layers[layer].bodies;

    },

    /**
    * Convert p2 physics value (meters) to pixel scale.
    * By default Phaser uses a scale of 20px per meter.
    * If you need to modify this you can over-ride these functions via the Physics Configuration object.
    *
    * @method Phaser.Physics.P2#mpx
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    mpx: function (v) {

        return v *= 20;

    },

    /**
    * Convert pixel value to p2 physics scale (meters).
    * By default Phaser uses a scale of 20px per meter.
    * If you need to modify this you can over-ride these functions via the Physics Configuration object.
    *
    * @method Phaser.Physics.P2#pxm
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    pxm: function (v) {

        return v * 0.05;

    },

    /**
    * Convert p2 physics value (meters) to pixel scale and inverses it.
    * By default Phaser uses a scale of 20px per meter.
    * If you need to modify this you can over-ride these functions via the Physics Configuration object.
    *
    * @method Phaser.Physics.P2#mpxi
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    mpxi: function (v) {

        return v *= -20;

    },

    /**
    * Convert pixel value to p2 physics scale (meters) and inverses it.
    * By default Phaser uses a scale of 20px per meter.
    * If you need to modify this you can over-ride these functions via the Physics Configuration object.
    *
    * @method Phaser.Physics.P2#pxmi
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    pxmi: function (v) {

        return v * -0.05;

    }

};

/**
* @name Phaser.Physics.P2#friction
* @property {number} friction - Friction between colliding bodies. This value is used if no matching ContactMaterial is found for a Material pair.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "friction", {

    get: function () {

        return this.world.defaultContactMaterial.friction;

    },

    set: function (value) {

        this.world.defaultContactMaterial.friction = value;

    }

});

/**
* @name Phaser.Physics.P2#restitution
* @property {number} restitution - Default coefficient of restitution between colliding bodies. This value is used if no matching ContactMaterial is found for a Material pair.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "restitution", {

    get: function () {

        return this.world.defaultContactMaterial.restitution;

    },

    set: function (value) {

        this.world.defaultContactMaterial.restitution = value;

    }

});

/**
* @name Phaser.Physics.P2#contactMaterial
* @property {p2.ContactMaterial} contactMaterial - The default Contact Material being used by the World.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "contactMaterial", {

    get: function () {

        return this.world.defaultContactMaterial;

    },

    set: function (value) {

        this.world.defaultContactMaterial = value;

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
* How to deactivate bodies during simulation. Possible modes are: World.NO_SLEEPING, World.BODY_SLEEPING and World.ISLAND_SLEEPING.
* If sleeping is enabled, you might need to wake up the bodies if they fall asleep when they shouldn't. If you want to enable sleeping in the world, but want to disable it for a particular body, see Body.allowSleep.
* @name Phaser.Physics.P2#sleepMode
* @property {number} sleepMode
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "sleepMode", {

    get: function () {

        return this.world.sleepMode;

    },

    set: function (value) {

        this.world.sleepMode = value;

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
