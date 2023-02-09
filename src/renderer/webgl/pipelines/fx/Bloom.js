/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var SpriteFXPipeline = require('../SpriteFXPipeline');
var BloomFrag = require('../../shaders/FXBloom-frag.js');

/**
 * @classdesc
 *
 * @class Bloom
 * @extends Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser game instance.
 */
var Bloom = new Class({

    Extends: SpriteFXPipeline,

    initialize:

    function Bloom (game)
    {
        console.log('bloom', game);

        SpriteFXPipeline.call(this, {
            game: game,
            fragShader: BloomFrag
        });

        this.steps = 4;
        this.offsetX = 0;
        this.offsetY = 0;
        this.blurStrength = 1;
        this.strength = 1;
        this.color = [ 1, 1, 1 ];
    },

    onPreRender: function ()
    {
        this.set1f('uStrength', this.blurStrength);
        this.set3fv('uColor', this.color);
    },

    onDraw: function (target1, target2, target3)
    {
        this.manager.copyFrame(target1, target3);

        var x = (2 / target1.width) * this.offsetX;
        var y = (2 / target1.height) * this.offsetY;

        for (var i = 0; i < this.steps; i++)
        {
            this.set2f('uOffset', x, 0);
            this.copySprite(target1, target2);

            this.set2f('uOffset', 0, y);
            this.copySprite(target2, target1);
        }

        this.blendFrames(target3, target1, target2, this.strength);

        this.copyToGame(target2);
    },

    setColor: function (r, g, b)
    {
        this.color[0] = r;
        this.color[1] = g;
        this.color[2] = b;

        return this;
    }

});

module.exports = Bloom;
