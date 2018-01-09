var WebGLSupportedExtensions = require('../../renderer/webgl/WebGLSupportedExtensions');

module.exports = (function () {
    if (WebGLSupportedExtensions.has('WEBGL_draw_buffers'))
    {
        return require('./DeferredRenderer');
    }
    else
    {
        return require('./ForwardRenderer');
    }
})();

 