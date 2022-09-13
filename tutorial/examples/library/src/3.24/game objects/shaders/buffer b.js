var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.glsl('bundle', 'assets/shaders/bundle.glsl.js');
}

function create ()
{
    var s1 = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

#define iTime time
#define iResolution resolution

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }

// Created by Stephane Cuillerdier - @Aiekick/2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

void mainImage( out vec4 f, vec2 g )
{
    float 
        t = time,
        p;
    
    vec2 
        s = iResolution.xy,
        u = (g+g-s)/s.y,
        ar = vec2(
            atan(u.x, u.y) * 3.18 + t*2., 
            length(u)*3. + sin(t*.5)*10.);
    
    p = floor(ar.y)/5.;
    
    ar = abs(fract(ar)-.5);
    
    f = 
        mix(
            vec4(1,.3,0,1), 
            vec4(.3,.2,.5,1), 
            vec4(p)) 
        * .1/dot(ar,ar) * .1 
        + texture(iChannel0, g / s) * .9;
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
    `;

    var s2 = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

#define iTime time
#define iResolution resolution

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }

void mainImage( out vec4 f, vec2 g )
{
    f = texture(iChannel0, g/iResolution.xy);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
    `;

    const baseShader1 = new Phaser.Display.BaseShader('BufferA', s1);
    const baseShader2 = new Phaser.Display.BaseShader('BufferB', s2);

    var shader1 = this.add.shader(baseShader1, 0, 0, 512, 512).setRenderToTexture();
    var shader2 = this.add.shader(baseShader2, 0, 0, 512, 512).setRenderToTexture('output');

    shader1.setSampler2DBuffer('iChannel0', shader2.glTexture, 512, 512);
    shader2.setSampler2DBuffer('iChannel0', shader1.glTexture, 512, 512);

    //  Render our shader to this image
    this.add.image(400, 300, 'output');
}
