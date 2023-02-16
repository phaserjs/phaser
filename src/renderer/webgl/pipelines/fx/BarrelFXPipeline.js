/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BarrelFrag = require('../../shaders/FXBarrel-frag.js');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var PostFXPipeline = require('../PostFXPipeline');

var BarrelFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function BarrelFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: BarrelFrag
        });

        this.amount = 1;
    },

    onPreRender: function (config, shader)
    {
        // eslint-disable-next-line consistent-this
        if (config === undefined) { config = this; }

        this.set1f('amount', GetFastValue(config, 'amount'), shader);
    }

});

module.exports = BarrelFXPipeline;
