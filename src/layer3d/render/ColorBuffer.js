/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Vector4 = require('../../math/Vector4');

var ColorBuffer = new Class({

    initialize:

    function ColorBuffer (state)
    {
        this.state = state;
        this.locked = false;
        this.color = new Vector4();
        this.currentColorMask = null;
        this.currentColorClear = new Vector4();
    },

    setMask: function (colorMask)
    {
        if (!this.locked && this.currentColorMask !== colorMask)
        {
            this.state.gl.colorMask(colorMask, colorMask, colorMask, colorMask);

            this.currentColorMask = colorMask;
        }
    },

    setLocked: function (lock)
    {
        this.locked = lock;
    },

    setClear: function (r, g, b, a, premultipliedAlpha)
    {
        if (premultipliedAlpha)
        {
            r *= a; g *= a; b *= a;
        }

        this.color.set(r, g, b, a);

        if (!this.currentColorClear.equals(this.color))
        {
            this.state.gl.clearColor(r, g, b, a);

            this.currentColorClear.copy(this.color);
        }
    },

    getClear: function ()
    {
        return this.currentColorClear;
    },

    reset: function ()
    {
        this.locked = false;

        this.currentColorMask = null;
        this.currentColorClear.set(-1, 0, 0, 0);
    }

});

module.exports = ColorBuffer;
