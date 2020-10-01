/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

var DepthBuffer = new Class({

    initialize:

    function DepthBuffer (state)
    {
        this.state = state;

        this.isEnabled = false;

        this.locked = false;
        this.currentDepthMask = null;
        this.currentDepthFunc = null;
        this.currentDepthClear = null;
    },

    setTest: function (depthTest)
    {
        var gl = this.state.gl;

        if (depthTest)
        {
            if (!this.isEnabled)
            {
                gl.enable(gl.DEPTH_TEST);

                this.isEnabled = true;
            }
        }
        else if (this.isEnabled)
        {
            gl.disable(gl.DEPTH_TEST);

            this.isEnabled = false;
        }
    },

    setMask: function (depthMask)
    {
        if (!this.locked && this.currentDepthMask !== depthMask)
        {
            this.state.gl.depthMask(depthMask);

            this.currentDepthMask = depthMask;
        }
    },

    setFunc: function (depthFunc)
    {
        if (this.currentDepthFunc !== depthFunc)
        {
            this.state.gl.depthFunc(depthFunc);

            this.currentDepthFunc = depthFunc;
        }
    },

    setLocked: function (lock)
    {
        this.locked = lock;
    },

    setClear: function (depth)
    {
        if (this.currentDepthClear !== depth)
        {
            this.state.gl.clearDepth(depth);

            this.currentDepthClear = depth;
        }
    },

    reset: function ()
    {
        this.locked = false;

        this.currentDepthMask = null;
        this.currentDepthFunc = null;
        this.currentDepthClear = null;
    }

});

module.exports = DepthBuffer;
