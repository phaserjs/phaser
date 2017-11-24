var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Components = require('./components');
var GameObject = require('../../gameobjects/GameObject');
var GetFastValue = require('../../utils/object/GetFastValue');
var Image = require('../../gameobjects/image/Image');
var Vector2 = require('../../math/Vector2');

var MatterImage = new Class({

    Extends: Image,

    Mixins: [
        Components.Bounce,
        Components.Collision,
        Components.Force,
        Components.Friction,
        Components.Gravity,
        Components.Mass,
        Components.Sensor,
        Components.Sleep,
        Components.Static,
        Components.Transform,
        Components.Velocity
    ],

    initialize:

    //  x/y is the center of the Image / Body, just like other default Game Objects
    function MatterImage (world, x, y, texture, frame, options)
    {
        GameObject.call(this, world.scene, 'Image');

        this.setTexture(texture, frame);
        this.setSizeToFrame();
        this.setOrigin();

        this._tempVec2 = new Vector2();

        var isCircle = GetFastValue(options, 'isCircle', false);

        if (isCircle)
        {
            var radius = GetFastValue(options, 'radius', Math.max(this.width, this.height) / 2);

            this.body = Bodies.circle(x, y, radius, options);
        }
        else
        {
            this.body = Bodies.rectangle(x, y, this.width, this.height, options);
        }

        this.body.gameObject = this;

        this.world = world;

        if (GetFastValue(options, 'addToWorld', true))
        {
            world.add(this.body);
        }

        this.setPosition(x, y);
    }

});

module.exports = MatterImage;
