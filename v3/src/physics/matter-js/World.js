//  Phaser.Physics.Matter.World

var Engine = require('./core/Engine');

// var Body = require('./Body');
var Class = require('../../utils/Class');
// var CONST = require('./const');
var GetValue = require('../../utils/object/GetValue');
// var Rectangle = require('../../geom/rectangle/Rectangle');
// var RTree = require('../../structs/RTree');
// var Set = require('../../structs/Set');
// var ProcessQueue = require('../../structs/ProcessQueue');
// var StaticBody = require('./StaticBody');
// var Vector2 = require('../../math/Vector2');

var World = new Class({

    initialize:

    function World (scene, config)
    {
        var defaults = {
            fps: 60,
            correction: 1,
            deltaSampleSize: 60,
            counterTimestamp: 0,
            frameCounter: 0,
            deltaHistory: [],
            timePrev: null,
            timeScalePrev: 1,
            frameRequestId: null,
            isFixed: false,
            enabled: true
        };

        this.scene = scene;

        this.events = scene.sys.events;

        this.engine = Engine.create(defaults);

        console.log('engine');
        console.log(this.engine);

        // this.world = this.engine.world;

        // console.log('world?');
        // console.log(this.world);
    },

    update: function (time, delta)
    {
        var correction = 1;

        this.engine.update(this.engine, delta, correction);
    },

    postUpdate: function ()
    {
        //  NOOP
    },

    shutdown: function ()
    {

    },

    destroy: function ()
    {

    }

});

module.exports = World;
