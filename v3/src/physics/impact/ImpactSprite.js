
var Class = require('../../utils/Class');
var Components = require('./Components');
var Sprite = require('../../gameobjects/sprite/Sprite');

var ImpactSprite = new Class({

    Extends: Sprite,

    Mixins: [
        Components.Acceleration,
        Components.BodyType,
        Components.Bounce,
        Components.CheckAgainst,
        Components.Collides,
        Components.Velocity
    ],

    initialize:

    function ImpactSprite (world, x, y, texture, frame)
    {
        Sprite.call(this, world.scene, x, y, texture, frame);

        this.body = world.create(x, y, this.width, this.height);

        this.body.gameObject = this;

        //  Local references to the Body properties
        this.vel = this.body.vel;
        this.accel = this.body.accel;
        this.friction = this.body.friction;
        this.maxVel = this.body.maxVel;
    }

});

module.exports = ImpactSprite;
