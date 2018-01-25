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
        Components.Inertia,
        Components.Mass,
        Components.Sensor,
        Components.SetBody,
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

        this.world = world;

        this._tempVec2 = new Vector2(x, y);

        var shape = GetFastValue(options, 'shape', null);

        if (!shape)
        {
            this.body = Bodies.rectangle(x, y, this.width, this.height, options);

            this.body.gameObject = this;

            if (GetFastValue(options, 'addToWorld', true))
            {
                world.add(this.body);
            }
        }
        else
        {
            this.setBody(shape, options);
        }

        this.setPosition(x, y);
    }

});

module.exports = MatterImage;
