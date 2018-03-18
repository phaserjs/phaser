/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Components = require('./components');
var GetFastValue = require('../../utils/object/GetFastValue');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Matter Physics Body applied to a Game Object.
 *
 * @class MatterGameObject
 * @memberOf Phaser.Physics.Matter
 * @constructor
 * @since 3.3.0
 *
 * @extends Phaser.Physics.Matter.Components.Bounce
 * @extends Phaser.Physics.Matter.Components.Collision
 * @extends Phaser.Physics.Matter.Components.Force
 * @extends Phaser.Physics.Matter.Components.Friction
 * @extends Phaser.Physics.Matter.Components.Gravity
 * @extends Phaser.Physics.Matter.Components.Mass
 * @extends Phaser.Physics.Matter.Components.Sensor
 * @extends Phaser.Physics.Matter.Components.SetBody
 * @extends Phaser.Physics.Matter.Components.Sleep
 * @extends Phaser.Physics.Matter.Components.Static
 * @extends Phaser.Physics.Matter.Components.Transform
 * @extends Phaser.Physics.Matter.Components.Velocity
 *
 * @param {Phaser.Physics.Matter.World} world - [description]
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {object} options - [description]
 */
var MatterGameObject = new Class({

    Mixins: [
        Components.Bounce,
        Components.Collision,
        Components.Force,
        Components.Friction,
        Components.Gravity,
        Components.Mass,
        Components.Sensor,
        Components.SetBody,
        Components.Sleep,
        Components.Static,
        Components.Transform,
        Components.Velocity
    ],

    initialize:

    function MatterGameObject (world, gameObject, options)
    {
        this.gameObject = gameObject;

        this.world = world;

        this._tempVec2 = new Vector2(gameObject.x, gameObject.y);

        var shape = GetFastValue(options, 'shape', null);

        if (!shape)
        {
            this.body = Bodies.rectangle(gameObject.x, gameObject.y, gameObject.width, gameObject.height, options);

            this.body.gameObject = this.gameObject;

            if (GetFastValue(options, 'addToWorld', true))
            {
                world.add(this.body);
            }
        }
        else
        {
            this.setBody(shape, options);
        }
    }

});

module.exports = MatterGameObject;
