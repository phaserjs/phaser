/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var VignetteFrag = require('../../shaders/FXVignette-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var VignetteFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function VignetteFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: VignetteFrag
        });

        this.strength = 1;
    },

    onPreRender: function (config, shader)
    {
        // eslint-disable-next-line consistent-this
        if (config === undefined) { config = this; }

        this.set1f('strength', GetFastValue(config, 'strength'), shader);
    }

});

module.exports = VignetteFXPipeline;
