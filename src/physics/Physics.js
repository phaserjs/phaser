/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Manager is responsible for looking after all of the running physics systems.
* Phaser supports 3 physics systems: Arcade Physics, P2 and Ninja Physics (with Box2D and Chipmunk in development)
* Game Objects can belong to only 1 physics system, but you can have multiple systems active in a single game.
*
* For example you could have P2 managing a polygon-built terrain landscape that an vehicle drives over, while it could be firing bullets that use the
* faster (due to being much simpler) Arcade Physics system.
*
* @class Phaser.Physics
*
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {object} [physicsConfig=null] - A physics configuration object to pass to the Physics world on creation.
*/
Phaser.Physics = function (game, config) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {object} config - The physics configuration object as passed to the game on creation.
    */
    this.config = config;

    /**
    * @property {Phaser.Physics.Arcade} arcade - The Arcade Physics system.
    */
    this.arcade = new Phaser.Physics.Arcade(game);

    /**
    * @property {Phaser.Physics.P2} p2 - The P2.JS Physics system.
    */
    this.p2 = null;

    /**
    * @property {Phaser.Physics.Ninja} ninja - The N+ Ninja Physics System.
    */
    this.ninja = null;

    /**
    * @property {Phaser.Physics.Box2D} box2d - The Box2D Physics system (to be done).
    */
    this.box2d = null;

    /**
    * @property {Phaser.Physics.Chipmunk} chipmunk - The Chipmunk Physics system (to be done).
    */
    this.chipmunk = null;

};

/**
* @const
* @type {number}
*/
Phaser.Physics.ARCADE = 0;

/**
* @const
* @type {number}
*/
Phaser.Physics.P2JS = 1;

/**
* @const
* @type {number}
*/
Phaser.Physics.NINJA = 2;

/**
* @const
* @type {number}
*/
Phaser.Physics.BOX2D = 3;

/**
* @const
* @type {number}
*/
Phaser.Physics.CHIPMUNK = 5;

Phaser.Physics.prototype = {

    /**
    * This will create an instance of the requested physics simulation.
    * Phaser.Physics.Arcade is running by default, but all others need activating directly.
    * You can start the following physics systems:
    * Phaser.Physics.P2JS - A full-body advanced physics system by Stefan Hedman.
    * Phaser.Physics.NINJA - A port of Metanet Softwares N+ physics system.
    * Phaser.Physics.BOX2D and Phaser.Physics.CHIPMUNK are still in development.
    *
    * @method Phaser.Physics#startSystem
    * @param {number} The physics system to start.
    */
    startSystem: function (system) {

        if (system === Phaser.Physics.ARCADE && this.arcade === null)
        {
            this.arcade = new Phaser.Physics.Arcade(this.game);
        }
        else if (system === Phaser.Physics.P2JS && this.p2 === null)
        {
            this.p2 = new Phaser.Physics.P2(this.game, this.config);
        }
        if (system === Phaser.Physics.NINJA && this.ninja === null)
        {
            this.ninja = new Phaser.Physics.Ninja(this.game);
        }
        else if (system === Phaser.Physics.BOX2D && this.box2d === null)
        {
            //  Coming soon
        }
        else if (system === Phaser.Physics.CHIPMUNK && this.chipmunk === null)
        {
            //  Coming soon
        }

    },

    /**
    * This will create a physics body on the given game object.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    * It can be for any of the physics systems that have been started:
    *
    * Phaser.Physics.Arcade - A light weight AABB based collision system with basic separation.
    * Phaser.Physics.P2JS - A full-body advanced physics system supporting multiple object shapes, polygon loading, contact materials, springs and constraints.
    * Phaser.Physics.NINJA - A port of Metanet Softwares N+ physics system. Advanced AABB and Circle vs. Tile collision.
    * Phaser.Physics.BOX2D and Phaser.Physics.CHIPMUNK are still in development.
    *
    * @method Phaser.Physics#enable
    * @param {object|array} object - The game object to create the physics body on. Can also be an array of objects, a body will be created on every object in the array.
    * @param {number} [system=Phaser.Physics.ARCADE] - The physics system that will be used to create the body. Defaults to Arcade Physics.
    * @param {boolean} [debug=false] - Enable the debug drawing for this body. Defaults to false.
    */
    enable: function (object, system, debug) {

        if (typeof system === 'undefined') { system = Phaser.Physics.ARCADE; }
        if (typeof debug === 'undefined') { debug = false; }

        var i = 1;

        if (object instanceof Phaser.Group)
        {

        }
        else
        {
            if (Array.isArray(object))
            {
                //  Add to Group
                i = object.length;
            }
            else
            {
                object = [object];
            }

            while (i--)
            {
                if (object[i].body === null)
                {
                    if (system === Phaser.Physics.ARCADE)
                    {
                        object[i].body = new Phaser.Physics.Arcade.Body(object[i]);
                    }
                    else if (system === Phaser.Physics.P2JS)
                    {
                        object[i].body = new Phaser.Physics.P2.Body(this.game, object[i], object[i].x, object[i].y, 1);
                        object[i].body.debug = debug
                        object[i].anchor.set(0.5);
                    }
                    else if (system === Phaser.Physics.NINJA)
                    {
                        object[i].body = new Phaser.Physics.Ninja.Body(this.ninja, object[i]);
                        object[i].anchor.set(0.5);
                    }
                }
            }
        }

    },

    /**
    * Updates all running physics systems.
    *
    * @method Phaser.Physics#update
    * @protected
    */
    update: function () {

        //  ArcadePhysics / Ninja don't have a core to update

        if (this.p2)
        {
            this.p2.update();
        }

    },

    /**
    * Updates the physics bounds to match the world dimensions.
    *
    * @method Phaser.Physics#setBoundsToWorld
    * @protected
    */
    setBoundsToWorld: function () {

        if (this.ninja)
        {
            this.ninja.setBoundsToWorld();
        }

    },

    /**
    * Clears down all active physics systems. This doesn't destroy them, it just clears them of objects and is called when the State changes.
    *
    * @method Phaser.Physics#clear
    * @protected
    */
    clear: function () {

        if (this.p2)
        {
            this.p2.clear();
        }

    }

};

Phaser.Physics.prototype.constructor = Phaser.Physics;
