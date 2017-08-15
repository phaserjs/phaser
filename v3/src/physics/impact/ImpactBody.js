
var Class = require('../../utils/Class');
var Components = require('./Components');

var ImpactBody = new Class({

    Mixins: [
        Components.Acceleration,
        Components.BodyType,
        Components.Bounce,
        Components.CheckAgainst,
        Components.Collides,
        Components.Gravity,
        Components.Velocity
    ],

    initialize:

    function ImpactBody (world, x, y, width, height)
    {
        this.body = world.create(x, y, width, height);

        //  Local references to the Body properties
        this.vel = this.body.vel;
        this.accel = this.body.accel;
        this.friction = this.body.friction;
        this.maxVel = this.body.maxVel;
    }

});

module.exports = ImpactBody;
