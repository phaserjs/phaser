/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var CircleFrag = require('../../shaders/FXCircle-frag.js');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var PostFXPipeline = require('../PostFXPipeline');

var CircleFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function CircleFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: CircleFrag
        });

        //  A value between 0 and 100, with 0 being 'no ring' and 100 being 'very thick'
        this.width = 10;
        this.glcolor = [ 1, 0.2, 0.7 ];
        this.glcolor2 = [ 1, 0, 0, 0.4 ];
    },

    onPreRender: function (config, shader, width, height)
    {
        // eslint-disable-next-line consistent-this
        if (config === undefined) { config = this; }

        var circleWidth = GetFastValue(config, 'width');

        this.set1f('width', 0.4 + (0.1 - (circleWidth / 1000)), shader);
        this.set3fv('color', GetFastValue(config, 'glcolor'), shader);
        this.set4fv('backgroundColor', GetFastValue(config, 'glcolor2'), shader);

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

module.exports = CircleFXPipeline;
