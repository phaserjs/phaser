/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var GradientFrag = require('../../shaders/FXGradient-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var GradientFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function GradientFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: GradientFrag
        });

        this.size = 0;
        this.alpha = 0.2;

        this.fromX = 0;
        this.fromY = 0;

        this.toX = 0;
        this.toY = 1;

        this.glcolor1 = [ 255, 0, 0 ];
        this.glcolor2 = [ 0, 255, 0 ];
    },

    onPreRender: function (config, shader)
    {
        // eslint-disable-next-line consistent-this
        if (config === undefined) { config = this; }

        this.set1f('alpha', GetFastValue(config, 'alpha'), shader);
        this.set1i('size', GetFastValue(config, 'size'), shader);
        this.set3fv('color1', GetFastValue(config, 'glcolor1'), shader);
        this.set3fv('color2', GetFastValue(config, 'glcolor2'), shader);
        this.set2f('positionFrom', GetFastValue(config, 'fromX'), GetFastValue(config, 'fromY'), shader);
        this.set2f('positionTo', GetFastValue(config, 'toX'), GetFastValue(config, 'toY'), shader);
    }

});

module.exports = GradientFXPipeline;
