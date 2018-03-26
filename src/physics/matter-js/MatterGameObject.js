/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Components = require('./components');
var GetFastValue = require('../../utils/object/GetFastValue');
var Vector2 = require('../../math/Vector2');

/**
 * [description]
 *
 * @function hasGetterOrSetter
 * @private
 *
 * @param {object} def - The object to check.
 *
 * @return {boolean} True if it has a getter or setter, otherwise false.
 */
function hasGetterOrSetter (def)
{
    return (!!def.get && typeof def.get === 'function') || (!!def.set && typeof def.set === 'function');
}

/**
 * [description]
 *
 * @function Phaser.Physics.Matter.MatterGameObject
 * @since 3.3.0
 *
 * @param {Phaser.Physics.Matter.World} world - [description]
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 * @param {object} options - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var MatterGameObject = function (world, gameObject, options)
{
    if (options === undefined) { options = {}; }

    var x = gameObject.x;
    var y = gameObject.y;

    //  Temp body pos to avoid body null checks
    gameObject.body = {
        position: {
            x: x,
            y: y
        }
    };

    var mixins = [
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
    ];

    //  First let's inject all of the components into the Game Object
    mixins.forEach(function (mixin)
    {

        for (var key in mixin)
        {
            if (hasGetterOrSetter(mixin[key]))
            {
                Object.defineProperty(gameObject, key, {
                    get: mixin[key].get,
                    set: mixin[key].set
                });
            }
            else
            {
                Object.defineProperty(gameObject, key, {value: mixin[key]});
            }
        }

    });

    gameObject.world = world;

    gameObject._tempVec2 = new Vector2(x, y);

    var shape = GetFastValue(options, 'shape', null);

    if (!shape)
    {
        shape = 'rectangle';
    }

    gameObject.setBody(shape, options);

    return gameObject;
};

module.exports = MatterGameObject;
