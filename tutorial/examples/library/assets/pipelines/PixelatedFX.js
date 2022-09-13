const fragShader = `
    precision mediump float;

    uniform sampler2D uMainSampler;
    uniform vec2 uResolution;
    uniform float uTime;

    varying vec2 outTexCoord;
    varying vec4 outTint;

    void main()
    {
        vec2 pixelSize = vec2(8.0, 8.0);
        vec2 dimensions = vec2(800.0, 600.0);
        vec2 size = dimensions.xy / pixelSize;
        vec2 color = floor((outTexCoord * size)) / size + pixelSize/dimensions.xy * 0.5;

        gl_FragColor = texture2D(uMainSampler, color);
    }
`;

export default class PixelatedFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    constructor (game)
    {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime',
                'uResolution'
            ]
        });
    }

    onBoot ()
    {
        this.set2f('uResolution', this.renderer.width, this.renderer.height);
    }

    onPreRender ()
    {
        this.set1f('uTime', this.game.loop.time / 1000);
    }
}
