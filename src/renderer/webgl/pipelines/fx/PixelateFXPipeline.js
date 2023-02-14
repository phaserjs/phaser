/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var PixelateFrag = require('../../shaders/FXPixelate-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var PixelateFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function PixelateFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: PixelateFrag
        });

        this.amount = 1;
    },

    onPreRender: function (config, shader, width, height)
    {
        // eslint-disable-next-line consistent-this
        if (config === undefined) { config = this; }

        this.set1f('amount', GetFastValue(config, 'amount'), shader);

        if (width && height)
        {
            this.set2f('resolution', width, height, shader);
        }
    },

    onDraw: function (target)
    {
        this.set2f('resolution', target.width, target.height);

        this.bindAndDraw(target);
    }

});

module.exports = PixelateFXPipeline;
