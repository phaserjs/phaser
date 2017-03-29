var CreateProgram = function (gl, vertexShader, fragmentShader)
{
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error('Failed to link program. Error: \n' + gl.getProgramInfoLog(program));
        return null;
    }
    return program;
};

module.exports = CreateProgram;
