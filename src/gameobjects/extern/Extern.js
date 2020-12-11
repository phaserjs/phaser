/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var ExternRender = require('./ExternRender');

/**
 * @classdesc
 * An Extern Game Object is a special type of Game Object that allows you to pass
 * rendering off to a 3rd party.
 *
 * When you create an Extern and place it in the display list of a Scene, the renderer will
 * process the list as usual. When it finds an Extern it will flush the current batch,
 * clear down the pipeline and prepare a transform matrix which your render function can
 * take advantage of, if required.
 *
 * The WebGL context is then left is a 'clean' state, ready for you to bind your own shaders,
 * or draw to it, whatever you wish to do. Once you've finished, you should free-up any
 * of your resources. The Extern will then rebind the Phaser pipeline and carry on
 * rendering the display list.
 *
 * Although this object has lots of properties such as Alpha, Blend Mode and Tint, none of
 * them are used during rendering unless you take advantage of them in your own render code.
 *
 * @class Extern
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.16.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 */
var Extern = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.Origin,
        Components.ScrollFactor,
        Components.Size,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        ExternRender
    ],

    initialize:

    function Extern (scene)
    {
        GameObject.call(this, scene, 'Extern');
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    preUpdate: function ()
    {
        //  override this!
        //  Arguments: time, delta
    },

    render: function ()
    {
        //  override this!
        //  Arguments: renderer, camera, calcMatrix
    }

});

module.exports = Extern;
