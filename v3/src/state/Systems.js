/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var EventDispatcher = require('../events/EventDispatcher');
var GameObjectFactory = require('./systems/GameObjectFactory');
var GameObjectCreator = require('./systems/GameObjectCreator');
var Loader = require('./systems/Loader');
var MainLoop = require('./systems/MainLoop');
var UpdateManager = require('./systems/UpdateManager');

var Systems = function (state, config)
{
    this.state = state;

    this.config = config;

    this.events;

    //  State specific managers (Factory, Tweens, Loader, Physics, etc)
    this.add;
    this.make;
    this.input;
    this.load;
    this.tweens;
    this.mainloop;
    this.updates;

    //  State specific properties (transform, data, children, etc)
    this.camera;
    this.children;
    this.color;
    this.data;
    this.fbo;
    this.time;
    this.transform;
};

Systems.prototype.constructor = Systems;

Systems.prototype = {

    init: function ()
    {
        console.log('State.Systems.init');

        //  All of the systems can use the State level EventDispatcher
        this.events = new EventDispatcher();

        //  State specific managers (Factory, Tweens, Loader, Physics, etc)
        //  All these to be set by a State Config package

        this.add = new GameObjectFactory(this.state);
        // this.make = GameObjectCreator(this.state);
        this.mainloop = new MainLoop(this.state, this.state.settings.fps);
        this.updates = new UpdateManager(this.state);
        this.load = new Loader(this.state);

        // this.tweens = new Phaser.TweenManager(this.state);
        // this.input = new Phaser.State.Input(this.state);
        // this.physics = new Phaser.Physics.Arcade(this.state, 800, 600);

        //  State specific properties (transform, data, children, etc)
        // this.camera = new Phaser.Camera(this.state, 0, 0, 800, 600);
        // this.children = new Phaser.Component.Children(this.state);
        // this.color = new Phaser.Component.Color(this.state);
        // this.data = new Phaser.Component.Data(this.state);
        // this.transform = this.camera.transform;

        //  Boot

        // this.input.init();

        //  Defaults

        this.state.events = this.events;
        this.state.add = this.add;
        this.state.load = this.load;
        // this.state.children = this.children;
        // this.state.color = this.color;
        // this.state.data = this.data;
        // this.state.camera = this.camera;
        // this.state.input = this.input;
        // this.state.transform = this.camera.transform;
        // this.state.state = this.state.game.state;

        //  Here we can check which Systems to install as properties into the State object
        //  (default systems always exist in here, regardless)

        /*
        var config = this.config;
        var t = typeof config;

        if (t !== 'object' || (t === 'object' && !t.hasOwnProperty('systems')))
        {
            return;
        }
        */

        // this.key = (config.hasOwnProperty('key')) ? config.key : '';
    },

    begin: function (timestamp, frameDelta)
    {
    },

    update: function (timestep, physicsStep)
    {
        // this.tweens.update(timestep);
        // this.physics.preUpdate(physicsStep);
    },

    preRender: function ()
    {
        // this.physics.update();
    },

    end: function (fps, panic)
    {
        if (panic)
        {
            // This pattern introduces non-deterministic behavior, but in this case
            // it's better than the alternative (the application would look like it
            // was running very quickly until the simulation caught up to real
            // time).
            var discardedTime = Math.round(this.mainloop.resetFrameDelta());

            console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
        }
    }

};

module.exports = Systems;
