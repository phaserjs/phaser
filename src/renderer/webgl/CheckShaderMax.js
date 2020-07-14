//  From Pixi v5

function GenerateSrc (maxIfs)
{
    var src = '';

    for (var i = 0; i < maxIfs; ++i)
    {
        if (i > 0)
        {
            src += '\nelse ';
        }

        if (i < maxIfs - 1)
        {
            src += 'if(test == ' + i + '.0){}';
        }
    }

    return src;
}

var CheckShaderMax = function (gl, maxIfs)
{
    var shader = gl.createShader(gl.FRAGMENT_SHADER);

    var fragTemplate = [
        'precision mediump float;',
        'void main(void){',
        'float test = 0.1;',
        '%forloop%',
        'gl_FragColor = vec4(0.0);',
        '}'
    ].join('\n');

    // eslint-disable-next-line no-constant-condition
    while (true)
    {
        var fragmentSrc = fragTemplate.replace(/%forloop%/gi, GenerateSrc(maxIfs));

        gl.shaderSource(shader, fragmentSrc);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            maxIfs = (maxIfs / 2) | 0;
        }
        else
        {
            // valid!
            break;
        }
    }

    return maxIfs;
};

module.exports = CheckShaderMax;
