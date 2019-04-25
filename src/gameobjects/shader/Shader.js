/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var ShaderRender = require('./ShaderRender');

/**
 * @classdesc
 * A Shader Game Object.
 *
 * @class Shader
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.17.0
 *
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Shader = new Class({

    Extends: GameObject,

    Mixins: [
        Components.BlendMode,
        Components.Depth,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.Size,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        ShaderRender
    ],

    initialize:

    function Shader (scene, x, y, width, height, vert, frag)
    {
        GameObject.call(this, scene, 'Shader');

        this.vertSrc = vert;
        this.fragSrc = frag;

        this.program = null;

        this.initPipeline('QuadShaderPipeline');

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5, 0.5);
    }

});

module.exports = Shader;
