/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var LinearGradientFrag = require('../../shaders/FXLinearGradient-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var LinearGradientFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function LinearGradientFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: LinearGradientFrag
        });

        this.alpha = 1;
        this.size = 16;

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
    }

});

module.exports = LinearGradientFXPipeline;
