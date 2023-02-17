/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var PostFXPipeline = require('../PostFXPipeline');

var ColorMatrixFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function ColorMatrixFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game
        });
    },

    onDraw: function (source)
    {
        var target = this.fullFrame1;

        if (this.controller)
        {
            this.manager.drawFrame(source, target, true, this.controller);
        }
        else
        {
            this.drawFrame(source, target);
        }

        this.copyToGame(target);
    }

});

module.exports = ColorMatrixFXPipeline;
