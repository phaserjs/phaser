/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var ShineFrag = require('../../shaders/FXShine-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var ShineFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function ShineFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: ShineFrag
        });

        this.speed = 0.5;
        this.lineWidth = 0.5;
        this.gradient = 3;
        this.reveal = false;
    },

    onPreRender: function (config, shader, width, height)
    {
        // eslint-disable-next-line consistent-this
        if (config === undefined) { config = this; }

        this.setTime('time', shader);

        this.set1f('speed', GetFastValue(config, 'speed'), shader);
        this.set1f('lineWidth', GetFastValue(config, 'lineWidth'), shader);
        this.set1f('gradient', GetFastValue(config, 'gradient'), shader);
        this.setBoolean('reveal', GetFastValue(config, 'reveal'), shader);

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

module.exports = ShineFXPipeline;
