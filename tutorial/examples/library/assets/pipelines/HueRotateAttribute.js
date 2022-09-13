const vertShader = `
#define SHADER_NAME PHASER_MULTI_HUE_VS

precision mediump float;

uniform mat4 uProjectionMatrix;

attribute vec2 inPosition;
attribute vec2 inTexCoord;
attribute float inTexId;
attribute float inSpeed;

varying vec2 outTexCoord;
varying float outTexId;
varying float outSpeed;

void main ()
{
    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);

    outTexCoord = inTexCoord;
    outTexId = inTexId;
    outSpeed = inSpeed;
}
`;

const fragShader = `
#define SHADER_NAME PHASER_MULTI_HUE_FS

precision mediump float;

uniform sampler2D uMainSampler[%count%];
uniform float uTime;

varying vec2 outTexCoord;
varying float outTexId;
varying float outSpeed;

void main()
{
    vec4 texture;

    %forloop%

    float c = cos(uTime * outSpeed);
    float s = sin(uTime * outSpeed);

    mat4 r = mat4(0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.0,  0.0, 0.0, 1.0);
    mat4 g = mat4(0.701, -0.587, -0.114, 0.0, -0.299, 0.413, -0.114, 0.0, -0.300, -0.588, 0.886, 0.0, 0.0, 0.0, 0.0, 0.0);
    mat4 b = mat4(0.168, 0.330, -0.497, 0.0, -0.328, 0.035, 0.292, 0.0, 1.250, -1.050, -0.203, 0.0, 0.0, 0.0, 0.0, 0.0);

    mat4 hueRotation = r + g * c + b * s;

    gl_FragColor = texture * hueRotation;
}
`;

export default class HueRotateAttributePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
{
    constructor (game)
    {
        super({
            game,
            vertShader,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime'
            ],
            attributes: [
                {
                    name: 'inPosition',
                    size: 2
                },
                {
                    name: 'inTexCoord',
                    size: 2
                },
                {
                    name: 'inTexId',
                    size: 1
                },
                {
                    name: 'inSpeed',
                    size: 1
                }
            ]
        });

        this._time = 0;
    }

    onPreRender ()
    {
        this.set1f('uTime', this.game.loop.time);
    }

    batchQuad (gameObject, x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, unit)
    {
        if (unit === undefined) { unit = this.currentUnit; }

        var hasFlushed = false;

        if (this.shouldFlush(6))
        {
            this.flush();

            hasFlushed = true;

            unit = this.setTexture2D(texture);
        }

        var speed = gameObject.pipelineData.speed;

        this.batchVert(x0, y0, u0, v0, unit, speed);
        this.batchVert(x1, y1, u0, v1, unit, speed);
        this.batchVert(x2, y2, u1, v1, unit, speed);
        this.batchVert(x0, y0, u0, v0, unit, speed);
        this.batchVert(x2, y2, u1, v1, unit, speed);
        this.batchVert(x3, y3, u1, v0, unit, speed);

        return hasFlushed;
    }

    batchVert (x, y, u, v, unit, speed)
    {
        var vertexViewF32 = this.vertexViewF32;

        var vertexOffset = (this.vertexCount * this.currentShader.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewF32[++vertexOffset] = u;
        vertexViewF32[++vertexOffset] = v;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = speed;

        this.vertexCount++;
    }

}
