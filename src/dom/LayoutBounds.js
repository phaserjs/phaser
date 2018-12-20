/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var ClientHeight = require('./ClientHeight');
var ClientWidth = require('./ClientWidth');
var Rectangle = require('../geom/rectangle/Rectangle');

var LayoutBounds = new Class({

    Extends: Rectangle,

    initialize:

    function LayoutBounds ()
    {
        Rectangle.call(this);
    },

    init: function (isDesktop)
    {
        if (isDesktop)
        {
            Object.defineProperty(this, 'width', { get: ClientWidth });
            Object.defineProperty(this, 'height', { get: ClientHeight });
        }
        else
        {
            Object.defineProperty(this, 'width', {
                get: function ()
                {
                    var a = document.documentElement.clientWidth;
                    var b = window.innerWidth;

                    return a < b ? b : a; // max
                }
            });

            Object.defineProperty(this, 'height', {
                get: function ()
                {
                    var a = document.documentElement.clientHeight;
                    var b = window.innerHeight;

                    return a < b ? b : a; // max
                }
            });
        }
    }

});

module.exports = new LayoutBounds();
