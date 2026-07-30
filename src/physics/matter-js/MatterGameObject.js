/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Components = require('./components');
var GetFastValue = require('../../utils/object/GetFastValue');
var Vector2 = require('../../math/Vector2');

/**
 * Internal function to check if the object has a getter or setter.
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
 * A factory function that mixes all Matter.js physics components into any existing Phaser Game
 * Object, including those you have extended or created yourself. This enables you to give any
 * Game Object full Matter physics capabilities without requiring it to extend a specific class.
 *
 * The following components are mixed directly onto the Game Object: Bounce, Collision, Force,
 * Friction, Gravity, Mass, Sensor, SetBody, Sleep, Static, Transform, and Velocity. This means
 * methods such as `setVelocity`, `setFriction`, and `isSensor` become available directly on the
 * Game Object after this function is called.
 *
 * If `options` is an existing Matter Body instance (i.e. its `type` property equals `'body'`),
 * that body is attached via `setExistingBody`. Otherwise, `options` is treated as a
 * `MatterBodyConfig` and a new body is created via `setBody`, defaulting to a rectangle shape
 * if no `shape` property is provided.
 *
 * @function Phaser.Physics.Matter.MatterGameObject
 * @since 3.3.0
 *
 * @param {Phaser.Physics.Matter.World} world - The Matter world to add the body to.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will have the Matter body applied to it.
 * @param {(Phaser.Types.Physics.Matter.MatterBodyConfig|MatterJS.Body)} [options] - A Matter Body configuration object, or an instance of a Matter Body.
 * @param {boolean} [addToWorld=true] - Should the newly created body be immediately added to the World?
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was passed in, now enhanced with Matter physics components.
 */
var MatterGameObject = function (world, gameObject, options, addToWorld)
{
    if (options === undefined) { options = {}; }
    if (addToWorld === undefined) { addToWorld = true; }

    var x = gameObject.x;
    var y = gameObject.y;

    //  Temp body pos to avoid body null checks
    gameObject.body = {
        temp: true,
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

    if (options.hasOwnProperty('type') && options.type === 'body')
    {
        gameObject.setExistingBody(options, addToWorld);
    }
    else
    {
        var shape = GetFastValue(options, 'shape', null);

        if (!shape)
        {
            shape = 'rectangle';
        }

        options.addToWorld = addToWorld;

        gameObject.setBody(shape, options);
    }

    return gameObject;
};

module.exports = MatterGameObject;
