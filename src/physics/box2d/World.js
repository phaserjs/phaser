/**
* @author       George https://github.com/georgiee
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Base Box2D World.
*
* @class Phaser.Physics.Box2D.BodyDebug
* @classdesc Physics Body Debug Constructor
* @constructor
* @extends Phaser.Group
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Physics.Box2D.Body} body - The P2 Body to display debug data for.
* @param {object} settings - Settings object.
*/

Phaser.Physics.Box2D = function (game, config) {
    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;
    this.velocityiterations = 8
    this.positionIterations = 10
    
    var gravity = new box2d.b2Vec2(0.0, -9.8);
    
    this.world = new box2d.b2World(gravity);
    this.contactListener = new Phaser.Physics.Box2D.SampleContactListener()
    this.world.SetContactListener(this.contactListener);

    this.setBoundsToWorld()

    bd = new box2d.b2BodyDef();
    this.ground = this.world.CreateBody(bd);
};

Phaser.Physics.Box2D.prototype = {
    update: function () {
        this.world.Step(1.0 / 60, this.velocityiterations, this.positionIterations);
        this.world.ClearForces();
        this.world.DrawDebugData()
    },
    
    addBody: function (body) {
      body.create(this)
    },
    
    removeBody: function(body){
      world.DestroyBody(body);
    },
    
    setBoundsToWorld: function (left, right, top, bottom, setCollisionGroup) {

        this.setBounds(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, left, right, top, bottom, setCollisionGroup);

    },

    /**
    * This will create a Box2D Physics body on the given game object or array of game objects.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    *
    * @method Phaser.Physics.Box2D#enable
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
    * Creates an Arcade Physics body on the given game object.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the body is nulled.
    *
    * @method Phaser.Physics.Box2D#enableBody
    * @param {object} object - The game object to create the physics body on. A body will only be created if this object has a null `body` property.
    * @param {boolean} debug - Create a debug object to go with this body?
    */
    enableBody: function (object, debug) {
        if (object.hasOwnProperty('body') && object.body === null)
        {
            object.body = new Phaser.Physics.Box2D.Body(this.game, object, object.x, object.y, 1);
            object.body.debug = debug
            object.anchor.set(0.5);
        }

    },


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

        upperLeft = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(0), Phaser.Physics.Box2D.Utils.px2bi(0));
        upperRight = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(width), Phaser.Physics.Box2D.Utils.px2bi(0));
        lowerRight = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(width), Phaser.Physics.Box2D.Utils.px2bi(height));
        lowerLeft = new box2d.b2Vec2(Phaser.Physics.Box2D.Utils.px2b(0), Phaser.Physics.Box2D.Utils.px2bi(height));
        
        var groundBodyDef = new box2d.b2BodyDef();
        var groundBody = this.world.CreateBody(groundBodyDef);
        
        var groundBox = new box2d.b2EdgeShape();
        var groundBoxDef = box2d.b2Body.prototype.CreateFixture2.s_def;
        groundBoxDef.shape = groundBox;
        groundBoxDef.density = 0;

        // top
        groundBox.Set(upperLeft, upperRight);
        groundBody.CreateFixture(groundBoxDef);

        // right
        groundBox.Set(upperRight, lowerRight);
        groundBody.CreateFixture(groundBoxDef);

        // right
        groundBox.Set(lowerRight, lowerLeft);
        groundBody.CreateFixture(groundBoxDef);
        
        // right
        groundBox.Set(lowerLeft, upperLeft);
        groundBody.CreateFixture(groundBoxDef);

        this.debugBounds = new Phaser.Physics.Box2D.BodyDebug(this.game, groundBody)
    }
}