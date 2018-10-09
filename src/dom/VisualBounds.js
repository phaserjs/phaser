/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var ClientHeight = require('./ClientHeight');
var ClientWidth = require('./ClientWidth');
var Rectangle = require('../geom/rectangle/Rectangle');

//  All target browsers should support page[XY]Offset.
var ScrollX = (window && ('pageXOffset' in window)) ? function () { return window.pageXOffset; } : function () { return document.documentElement.scrollLeft; };
var ScrollY = (window && ('pageYOffset' in window)) ? function () { return window.pageYOffset; } : function () { return document.documentElement.scrollTop; };

var VisualBounds = new Class({

    Extends: Rectangle,

    initialize:

    function VisualBounds ()
    {
        Rectangle.call(this);
    },

    x: {
        get: ScrollX
    },

    y: {
        get: ScrollY
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
                    return window.innerWidth;
                }
            });

            Object.defineProperty(this, 'height', {
                get: function ()
                {
                    return window.innerHeight;
                }
            });
        }
    }

});

module.exports = new VisualBounds();
