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
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {object} [physicsConfig=null] - A physics configuration object to pass to the Physics world on creation.
*/
Phaser.Physics = function (game, config) {

    config = config || {};

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
    this.arcade = null;

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

    this.parseConfig();

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
Phaser.Physics.CHIPMUNK = 4;

Phaser.Physics.prototype = {

    /**
    * Parses the Physics Configuration object passed to the Game constructor and starts any physics systems specified within.
    *
    * @method Phaser.Physics#parseConfig
    */
    parseConfig: function () {

        if ((!this.config.hasOwnProperty('arcade') || this.config['arcade'] === true) && Phaser.Physics.hasOwnProperty('Arcade'))
        {
            //  If Arcade isn't specified, we create it automatically if we can
            this.arcade = new Phaser.Physics.Arcade(this.game);
            this.game.time.deltaCap = 0.2;
        }

        if (this.config.hasOwnProperty('ninja') && this.config['ninja'] === true && Phaser.Physics.hasOwnProperty('Ninja'))
        {
            this.ninja = new Phaser.Physics.Ninja(this.game);
        }

        if (this.config.hasOwnProperty('p2') && this.config['p2'] === true && Phaser.Physics.hasOwnProperty('P2'))
        {
            this.p2 = new Phaser.Physics.P2(this.game, this.config);
        }

        if (this.config.hasOwnProperty('box2d') && this.config['box2d'] === true && Phaser.Physics.hasOwnProperty('BOX2D'))
        {
            this.box2d = new Phaser.Physics.BOX2D(this.game, this.config);
        }

    },

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

        if (system === Phaser.Physics.ARCADE)
        {
            this.arcade = new Phaser.Physics.Arcade(this.game);
        }
        else if (system === Phaser.Physics.P2JS)
        {
            this.p2 = new Phaser.Physics.P2(this.game, this.config);
        }
        if (system === Phaser.Physics.NINJA)
        {
            this.ninja = new Phaser.Physics.Ninja(this.game);
        }
        else if (system === Phaser.Physics.BOX2D && this.box2d === null)
        {
            this.box2d = new Phaser.Physics.Box2D(this.game, this.config);
        }
        else if (system === Phaser.Physics.CHIPMUNK && this.chipmunk === null)
        {
            throw new Error('The Chipmunk physics system has not been implemented yet.');
        }

    },

    /**
    * This will create a default physics body on the given game object or array of objects.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    * It can be for any of the physics systems that have been started:
    *
    * Phaser.Physics.Arcade - A light weight AABB based collision system with basic separation.
    * Phaser.Physics.P2JS - A full-body advanced physics system supporting multiple object shapes, polygon loading, contact materials, springs and constraints.
    * Phaser.Physics.NINJA - A port of Metanet Softwares N+ physics system. Advanced AABB and Circle vs. Tile collision.
    * Phaser.Physics.BOX2D - A port of https://code.google.com/p/box2d-html5
    * Phaser.Physics.CHIPMUNK is still in development.
    *
    * If you require more control over what type of body is created, for example to create a Ninja Physics Circle instead of the default AABB, then see the
    * individual physics systems `enable` methods instead of using this generic one.
    *
    * @method Phaser.Physics#enable
    * @param {object|array} object - The game object to create the physics body on. Can also be an array of objects, a body will be created on every object in the array.
    * @param {number} [system=Phaser.Physics.ARCADE] - The physics system that will be used to create the body. Defaults to Arcade Physics.
    * @param {boolean} [debug=false] - Enable the debug drawing for this body. Defaults to false.
    */
    enable: function (object, system, debug) {

        if (typeof system === 'undefined') { system = Phaser.Physics.ARCADE; }
        if (typeof debug === 'undefined') { debug = false; }

        if (system === Phaser.Physics.ARCADE)
        {
            this.arcade.enable(object);
        }
        else if (system === Phaser.Physics.P2JS && this.p2)
        {
            this.p2.enable(object, debug);
        }
        else if (system === Phaser.Physics.NINJA && this.ninja)
        {
            this.ninja.enableAABB(object);
        }
        else if (system === Phaser.Physics.BOX2D && this.box2d)
        {
            this.box2d.enable(object);
        }

    },

    /**
    * preUpdate checks.
    *
    * @method Phaser.Physics#preUpdate
    * @protected
    */
    preUpdate: function () {

        //  ArcadePhysics / Ninja don't have a core to preUpdate

        if (this.p2)
        {
            this.p2.preUpdate();
        }

        if (this.box2d)
        {
            this.box2d.preUpdate();
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

        if (this.box2d)
        {
            this.box2d.update();
        }

    },

    /**
    * Updates the physics bounds to match the world dimensions.
    *
    * @method Phaser.Physics#setBoundsToWorld
    * @protected
    */
    setBoundsToWorld: function () {

        if (this.arcade)
        {
            this.arcade.setBoundsToWorld();
        }

        if (this.ninja)
        {
            this.ninja.setBoundsToWorld();
        }

        if (this.p2)
        {
            this.p2.setBoundsToWorld();
        }

        if (this.box2d)
        {
            this.box2d.setBoundsToWorld();
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

        if (this.box2d)
        {
            this.box2d.clear();
        }

    },

    /**
    * Destroys all active physics systems. Usually only called on a Game Shutdown, not on a State swap.
    *
    * @method Phaser.Physics#destroy
    */
    destroy: function () {

        if (this.p2)
        {
            this.p2.destroy();
        }

        if (this.box2d)
        {
            this.box2d.destroy();
        }

        this.arcade = null;
        this.ninja = null;
        this.p2 = null;
        this.box2d = null;

    }

};

Phaser.Physics.prototype.constructor = Phaser.Physics;
