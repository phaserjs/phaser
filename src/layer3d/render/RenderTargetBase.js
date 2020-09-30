/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

var RenderTargetBase = new Class({

    initialize:

    function RenderTargetBase (width, height)
    {
        this.width = width;
        this.height = height;

        this.isRenderTarget = true;
    },

    resize: function (width, height)
    {
        if (this.width !== width || this.height !== height)
        {
            this.dispose();

            this.width = width;
            this.height = height;

            return true;
        }

        return false;
    },

    dispose: function ()
    {
        //  TODO - Event?
    }

});

module.exports = RenderTargetBase;
