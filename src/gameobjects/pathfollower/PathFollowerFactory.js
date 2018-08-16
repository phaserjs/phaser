/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var Path = require('../components/Path');
var Sprite = require('../sprite/Sprite');

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
    return def && def.constructor === Object && ((!!def.get && typeof def.get === 'function') || (!!def.set && typeof def.set === 'function'));
}

/**
 * Creates a new PathFollower Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the PathFollower Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#follower
 * @since 3.0.0
 *
 * @param {Phaser.Curves.Path} path - The Path this PathFollower is connected to.
 * @param {Phaser.GameObjects.GameObject|number} x - The GameObject to augment, or the horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {string} [texture] - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 *
 * @return {Phaser.GameObjects.PathFollower} The Game Object that was created.
 */
GameObjectFactory.register('follower', function (path, x, y, key, frame)
{
    var gameObject = x;

    // Create a sprite if x is not an object
    if (typeof x !== 'object')
    {
        gameObject = new Sprite(this.scene, x, y, key, frame);
    }

    // Mixin the Path component
    var mixins = [
        Path
    ];

    for (var i = 0; i < mixins.length; i++)
    {
        var mixin = mixins[i];

        for (var m in mixin)
        {
            if (typeof mixin[m] === 'function')
            {
                Object.defineProperty(gameObject, m, {value: mixin[m]});
            }
            else if (mixin[m] && typeof mixin[m].factory === 'function')
            {
                gameObject[m] = mixin[m].factory();
            }
            else if (hasGetterOrSetter(mixin[m]))
            {
                Object.defineProperty(gameObject, key, {
                    get: mixin[key].get,
                    set: mixin[key].set
                });
            }
            else
            {
                gameObject[m] = mixin[m];
            }
        }
    }

    // Set the given arguments as properties
    gameObject.path = path;
    gameObject.pathOffset.set(x, y);

    // Add to the display list and update list
    this.displayList.add(gameObject);
    this.updateList.add(gameObject);

    return gameObject;
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
