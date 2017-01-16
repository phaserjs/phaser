var CreateShader = function (gl, shaderSource, shaderType)
{
    var shader = null;
    shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.error('Failed ' + (shaderType === gl.VERTEX_SHADER ? 'vertex' : shaderType === gl.FRAGMENT_SHADER ? 'fragment' : 'invalid') + ' shader compilation. Error: \n' + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};
