/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

var StencilBuffer = new Class({

    initialize:

    function StencilBuffer (state)
    {
        this.state = state;

        this.isEnabled = false;

        this.locked = false;

        this.currentStencilMask = null;
        this.currentStencilFunc = null;
        this.currentStencilRef = null;
        this.currentStencilFuncMask = null;
        this.currentStencilFail = null;
        this.currentStencilZFail = null;
        this.currentStencilZPass = null;
        this.currentStencilFuncBack = null;
        this.currentStencilRefBack = null;
        this.currentStencilFuncMaskBack = null;
        this.currentStencilFailBack = null;
        this.currentStencilZFailBack = null;
        this.currentStencilZPassBack = null;
        this.currentStencilClear = null;
    },

    setTest: function (stencilTest)
    {
        var gl = this.state.gl;

        if (stencilTest)
        {
            if (!this.isEnabled)
            {
                gl.enable(gl.STENCIL_TEST);

                this.isEnabled = true;
            }
        }
        else if (this.isEnabled)
        {
            gl.disable(gl.STENCIL_TEST);

            this.isEnabled = false;
        }
    },

    setMask: function (stencilMask)
    {
        if (!this.locked && this.currentStencilMask !== stencilMask)
        {
            this.state.gl.stencilMask(stencilMask);

            this.currentStencilMask = stencilMask;
        }
    },

    setFunc: function (stencilFunc, stencilRef, stencilMask, stencilFuncBack, stencilRefBack, stencilMaskBack)
    {
        if (this.currentStencilFunc !== stencilFunc ||
            this.currentStencilRef !== stencilRef ||
            this.currentStencilFuncMask !== stencilMask ||
            this.currentStencilFuncBack !== stencilFuncBack ||
            this.currentStencilRefBack !== stencilRefBack ||
            this.currentStencilFuncMaskBack !== stencilMaskBack)
        {
            var gl = this.state.gl;

            if (stencilFuncBack === null || stencilRefBack === null || stencilMaskBack === null)
            {
                gl.stencilFunc(stencilFunc, stencilRef, stencilMask);
            }
            else
            {
                gl.stencilFuncSeparate(gl.FRONT, stencilFunc, stencilRef, stencilMask);
                gl.stencilFuncSeparate(gl.BACK, stencilFuncBack, stencilRefBack, stencilMaskBack);
            }

            this.currentStencilFunc = stencilFunc;
            this.currentStencilRef = stencilRef;
            this.currentStencilFuncMask = stencilMask;
            this.currentStencilFuncBack = stencilFuncBack;
            this.currentStencilRefBack = stencilRefBack;
            this.currentStencilFuncMaskBack = stencilMaskBack;
        }
    },

    setOp: function (stencilFail, stencilZFail, stencilZPass, stencilFailBack, stencilZFailBack, stencilZPassBack)
    {
        if (this.currentStencilFail	 !== stencilFail 	||
            this.currentStencilZFail !== stencilZFail ||
            this.currentStencilZPass !== stencilZPass ||
            this.currentStencilFailBack	 !== stencilFailBack ||
            this.currentStencilZFailBack !== stencilZFailBack ||
            this.currentStencilZPassBack !== stencilZPassBack)
        {
            var gl = this.state.gl;

            if (stencilFailBack === null || stencilZFailBack === null || stencilZPassBack === null)
            {
                gl.stencilOp(stencilFail, stencilZFail, stencilZPass);
            }
            else
            {
                gl.stencilOpSeparate(gl.FRONT, stencilFail, stencilZFail, stencilZPass);
                gl.stencilOpSeparate(gl.BACK, stencilFailBack, stencilZFailBack, stencilZPassBack);
            }

            this.currentStencilFail = stencilFail;
            this.currentStencilZFail = stencilZFail;
            this.currentStencilZPass = stencilZPass;
            this.currentStencilFailBack = stencilFailBack;
            this.currentStencilZFailBack = stencilZFailBack;
            this.currentStencilZPassBack = stencilZPassBack;
        }
    },

    setLocked: function (lock)
    {
        this.locked = lock;
    },

    setClear: function (stencil)
    {
        if (this.currentStencilClear !== stencil)
        {
            this.state.gl.clearStencil(stencil);

            this.currentStencilClear = stencil;
        }
    },

    reset: function ()
    {
        this.locked = false;

        this.currentStencilMask = null;
        this.currentStencilFunc = null;
        this.currentStencilRef = null;
        this.currentStencilFuncMask = null;
        this.currentStencilFail = null;
        this.currentStencilZFail = null;
        this.currentStencilZPass = null;
        this.currentStencilClear = null;
    }

});

module.exports = StencilBuffer;
