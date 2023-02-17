/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BloomFrag = require('../../shaders/FXBloom-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

var BloomFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function BloomFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: BloomFrag
        });

        this.steps = 4;
        this.offsetX = 1;
        this.offsetY = 1;
        this.blurStrength = 1;
        this.strength = 1;
        this.glcolor = [ 1, 1, 1 ];
    },

    onPreRender: function (controller)
    {
        controller = this.getController(controller);

        this.set1f('strength', controller.blurStrength);
        this.set3fv('color', controller.glcolor);
    },

    onDraw: function (target1)
    {
        var controller = this.getController();

        var target2 = this.fullFrame1;
        var target3 = this.fullFrame2;

        this.copyFrame(target1, target3);

        var x = (2 / target1.width) * controller.offsetX;
        var y = (2 / target1.height) * controller.offsetY;

        for (var i = 0; i < controller.steps; i++)
        {
            this.set2f('offset', x, 0);
            this.copySprite(target1, target2);

            this.set2f('offset', 0, y);
            this.copySprite(target2, target1);
        }

        this.blendFrames(target3, target1, target2, controller.strength);

        this.copyToGame(target2);
    }

});

module.exports = BloomFXPipeline;
