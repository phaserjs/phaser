/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var GlowFrag = require('../../shaders/FXGlow-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var GlowFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function GlowFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: GlowFrag
        });

        this.distance = 10;

        /**
         * The strength of the glow outward from the edge of the sprite.
         * @default 4
         */
        this.outerStrength = 4;

        /**
         * The strength of the glow inward from the edge of the sprite.
         * @default 0
         */
        this.innerStrength = 0;

        /**
         * Only draw the glow, not the texture itself
         * @default false
         */
        this.knockout = false;

        this.glcolor = [ 1, 1, 1, 1 ];
    },

    onPreRender: function (config, shader, width, height)
    {
        // eslint-disable-next-line consistent-this
        if (config === undefined) { config = this; }

        this.set1f('distance', GetFastValue(config, 'distance'), shader);
        this.set1f('outerStrength', GetFastValue(config, 'outerStrength'), shader);
        this.set1f('innerStrength', GetFastValue(config, 'innerStrength'), shader);
        this.set4fv('glowColor', GetFastValue(config, 'glcolor'), shader);
        this.setBoolean('knockout', GetFastValue(config, 'knockout'), shader);

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

module.exports = GlowFXPipeline;
