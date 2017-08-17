
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
        Components.Debug,
        Components.Gravity,
        Components.Offset,
        Components.SetGameObject,
        Components.Velocity
    ],

    initialize:

    //  x/y is the center of the Sprite / Body, just like other default Game Objects
    function ImpactSprite (world, x, y, texture, frame)
    {
        Sprite.call(this, world.scene, x, y, texture, frame);

        this.body = world.create(x - this.frame.centerX, y - this.frame.centerY, this.width, this.height);

        this.body.parent = this;
        this.body.gameObject = this;

        //  Local references to the Body properties
        this.size = this.body.size;
        this.offset = this.body.offset;
        this.vel = this.body.vel;
        this.accel = this.body.accel;
        this.friction = this.body.friction;
        this.maxVel = this.body.maxVel;
    }

});

module.exports = ImpactSprite;
