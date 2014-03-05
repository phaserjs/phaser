/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics manager.
*
* @class Phaser.Physics
*
* @classdesc todo
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

    this.config = config;

    this.arcade = new Phaser.Physics.Arcade(game);

    this.p2 = null;

    this.box2d = null;

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
Phaser.Physics.P2 = 1;

/**
* @const
* @type {number}
*/
Phaser.Physics.BOX2D = 2;

/**
* @const
* @type {number}
*/
Phaser.Physics.CHIPMUNK = 3;

Phaser.Physics.prototype = {

    startSystem: function (system) {

        if (system === Phaser.Physics.ARCADE)
        {
            this.arcade = new Phaser.Physics.Arcade(this.game);
        }
        else if (system === Phaser.Physics.P2)
        {
            this.p2 = new Phaser.Physics.P2(this.game, this.config);
        }
        else if (system === Phaser.Physics.BOX2D)
        {
            //  Coming soon
        }
        else if (system === Phaser.Physics.CHIPMUNK)
        {
            //  Coming soon
        }

    },

    //  Enables a sprites physics body
    enable: function (object, system) {

        if (typeof system === 'undefined') { system = Phaser.Physics.ARCADE; }

        var i = 1;

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
                else if (system === Phaser.Physics.P2)
                {
                    object[i].body = new Phaser.Physics.P2.Body(this.game, object[i], object[i].x, object[i].y, 1);
                    object[i].anchor.set(0.5);
                }
            }
        }

    },

    update: function () {

        //  ArcadePhysics doesn't have a core to update

        if (this.p2)
        {
            this.p2.update();
        }

    },

    setBoundsToWorld: function () {

    },

    clear: function () {

        if (this.p2)
        {
            this.p2.clear();
        }

    }

};

Phaser.Physics.prototype.constructor = Phaser.Physics;
