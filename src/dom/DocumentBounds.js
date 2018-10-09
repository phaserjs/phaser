/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Rectangle = require('../geom/rectangle/Rectangle');

var DocumentBounds = new Class({

    Extends: Rectangle,

    initialize:

    function DocumentBounds ()
    {
        Rectangle.call(this);
    },

    width: {
        get: function ()
        {
            var d = document.documentElement;

            return Math.max(d.clientWidth, d.offsetWidth, d.scrollWidth);
        }
    },

    height: {
        get: function ()
        {
            var d = document.documentElement;

            return Math.max(d.clientHeight, d.offsetHeight, d.scrollHeight);
        }
    }

});

module.exports = new DocumentBounds();
