var WebGLSupportedExtensions = (function () {
    
    var gl = document.createElement('canvas').getContext('webgl');
    var extensionList = gl ? gl.getSupportedExtensions() : [];

    return {

        has: function (name)
        {
            return false; //extensionList.indexOf(name) >= 0;
        }
        
    };
}());

module.exports = WebGLSupportedExtensions;
