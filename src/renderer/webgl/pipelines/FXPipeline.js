/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var PreFXPipeline = require('./PreFXPipeline');
var BloomFrag = require('../shaders/FXBloom-frag.js');
var GlowFrag = require('../shaders/FXGlow-frag.js');
var ShadowFrag = require('../shaders/FXShadow-frag.js');
var SingleQuadVS = require('../shaders/Single-vert.js');

/**
 * @classdesc
 *
 * @class FX
 * @extends Phaser.Renderer.WebGL.Pipelines.PreFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser game instance.
 */
var FXPipeline = new Class({

    Extends: PreFXPipeline,

    initialize:

    function FXPipeline (config)
    {
        var shaders = [];

        var fragShader = GlowFrag;
        var quality = 0.1;
        var distance = 10;

        fragShader = fragShader.replace(/__SIZE__/gi, `${(1 / quality / distance).toFixed(7)}`);
        fragShader = fragShader.replace(/__DIST__/gi, `${distance.toFixed(0)}.0`);

        shaders.push({
            name: 'Glow',
            fragShader: fragShader,
            vertShader: SingleQuadVS
        });

        fragShader = ShadowFrag;

        var samples = 12;

        fragShader = fragShader.replace(/__SAMPLES__/gi, samples.toFixed(0));

        shaders.push({
            name: 'Shadow',
            fragShader: fragShader,
            vertShader: SingleQuadVS
        });

        config.shaders = shaders;

        PreFXPipeline.call(this, config);

        this.bloom = {
            steps: 4,
            offsetX: 2,
            offsetY: 3,
            blurStrength: 1,
            strength: 1.5,
            color: [ 1, 1, 1 ]
        };

        this.glow = {
            quality: 0.1,
            distance: 10,
            outerStrength: 4,
            innerStrength: 0,
            knockout: false,
            color: [ 1, 1, 1, 1 ]
        };
    },

    boot: function ()
    {
        PreFXPipeline.prototype.boot.call(this);

        console.log(this.shaders);

    },

    onDraw: function (target1, target2, target3)
    {
        //  tempSprite = current sprite being drawn

        this.setShader(this.shaders[4]);

        var glow = this.tempSprite.fx.glow;

        this.set1f('outerStrength', glow.outerStrength);
        this.set1f('innerStrength', glow.innerStrength);
        this.set4fv('glowColor', glow.color);
        this.setBoolean('knockout', glow.knockout);
        this.set2f('resolution', target1.width, target1.height);

        this.copy(target1, target2);

        this.setShader(this.shaders[5]);

        var shadow = this.tempSprite.fx.shadow;

        this.set1f('intensity', shadow.intensity);
        this.set1f('decay', shadow.decay);
        this.set1f('power', shadow.power / shadow.samples);
        this.set2f('lightPosition', shadow.x, shadow.y);
        this.set4fv('shadowColor', shadow.shadowColor);

        this.copy(target2, target1);

        this.drawToGame(target1);
    },

    onBloomDraw: function (target1, target2, target3)
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
    }

});

module.exports = FXPipeline;
