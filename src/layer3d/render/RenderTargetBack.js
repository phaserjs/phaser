/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var RenderTargetBase = require('./RenderTargetBase');

var RenderTargetBack = new Class({

    Extends: RenderTargetBase,

    initialize:

    function RenderTargetBack (view)
    {
        RenderTargetBase.call(this, view.width, view.height);

        this.view = view;
    },

    resize: function (width, height)
    {
        this.view.width = width;
        this.view.height = height;

        this.width = width;
        this.height = height;
    },

    dispose: function ()
    {
        //  TODO - Event?
    }

});

module.exports = RenderTargetBack;
