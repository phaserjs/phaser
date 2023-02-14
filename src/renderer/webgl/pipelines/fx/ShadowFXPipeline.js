/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var ShadowFrag = require('../../shaders/FXShadow-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var ShadowFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function ShadowFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: ShadowFrag
        });

        this.x = 0;
        this.y = 1;
        this.decay = 0.1;
        this.power = 1.0;
        this.glcolor = [ 0, 0, 0, 1 ];
        this.samples = 6;
        this.intensity = 1;
    },

    onPreRender: function (config, shader)
    {
        // eslint-disable-next-line consistent-this
        if (config === undefined) { config = this; }

        var samples = GetFastValue(config, 'samples');

        this.set1i('samples', samples, shader);
        this.set1f('intensity', GetFastValue(config, 'intensity'), shader);
        this.set1f('decay', GetFastValue(config, 'decay'), shader);
        this.set1f('power', (GetFastValue(config, 'power') / samples), shader);
        this.set2f('lightPosition', GetFastValue(config, 'x'), GetFastValue(config, 'y'), shader);
        this.set4fv('color', GetFastValue(config, 'glcolor'), shader);
    }

});

module.exports = ShadowFXPipeline;
