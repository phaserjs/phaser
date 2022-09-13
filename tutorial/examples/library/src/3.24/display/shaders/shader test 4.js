var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var fragmentShader = `
/*
 * Original shader from: https://www.shadertoy.com/view/ltdXzX
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy globals
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define PI 3.1415926535897932384626433832795

vec4 hsv_to_rgb(float h, float s, float v, float a)
{
    float c = v * s;
    h = mod((h * 6.0), 6.0);
    float x = c * (1.0 - abs(mod(h, 2.0) - 1.0));
    vec4 color;
 
    if (0.0 <= h && h < 1.0) {
        color = vec4(c, x, 0.0, a);
    } else if (1.0 <= h && h < 2.0) {
        color = vec4(x, c, 0.0, a);
    } else if (2.0 <= h && h < 3.0) {
        color = vec4(0.0, c, x, a);
    } else if (3.0 <= h && h < 4.0) {
        color = vec4(0.0, x, c, a);
    } else if (4.0 <= h && h < 5.0) {
        color = vec4(x, 0.0, c, a);
    } else if (5.0 <= h && h < 6.0) {
        color = vec4(c, 0.0, x, a);
    } else {
        color = vec4(0.0, 0.0, 0.0, a);
    }
 
    color.rgb += v - c;
 
    return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float x = fragCoord.x - (iResolution.x / 2.0);
    float y = fragCoord.y - (iResolution.y );
    
    float r = length(vec2(x,y));
    float angle = atan(x,y) - sin(iTime)*r / 200.0 + 1.0*iTime;
    float intensity = 0.5 + 0.25*sin(15.0*angle);
    //float intensity = mod(angle, (PI / 8.0));
    //float intensity = 0.5 + 0.25*sin(angle*16.0-5.0*iTime);
    
    fragColor = hsv_to_rgb(angle/PI, intensity, 1.0, 0.5);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}
`;

var fragmentShader7 = `
#ifdef GL_ES
precision mediump float;
#endif

// Love u Hanna E

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snoise(vec3 uv, float res) {
    const vec3 s = vec3(1e0, 1e2, 1e3);
    
    uv *= res;
    
    vec3 uv0 = floor(mod(uv, res)) * s;
    vec3 uv1 = floor(mod(uv + vec3(1.0), res)) * s;
    
    vec3 f = smoothstep(0.0, 1.0, fract(uv));

    vec4 v = vec4(uv0.x + uv0.y + uv0.z,
              uv1.x + uv0.y + uv0.z,
              uv0.x + uv1.y + uv0.z,
              uv1.x + uv1.y + uv0.z);

    vec4 r = fract(sin(v * 1e-1) * 1e3);
    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
    
    r = fract(sin((v + uv1.z - uv0.z) * 1e-1) * 1e3);
    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
    
    return mix(r0, r1, f.z) * 2.0 - 1.0;
}

void main() {
    vec2 p = -0.5 + gl_FragCoord.xy / resolution.xy;
    p.x *= resolution.x / resolution.y;
    float lp = .02/length(p);
    float ap = atan(p.x, p.y);
    
    float time = time*.04-pow(time, .8)*(1. + .1*cos(time*0.04))*2.;
    
    float r1 = 0.2;
    if(lp <= r1){
        ap -= time*0.1+lp*9.;
        lp = sqrt(1.-lp/r1)*0.5;
    }else{
        ap += time*0.1+lp*2.;
        lp -= r1;
    }
    
    lp = pow(lp*lp, 1./3.);
    
    p = lp*vec2(sin(ap), cos(ap));

    float color = 5.0 - (6.0 * lp);

    vec3 coord = vec3(atan(p.x, p.y) / 6.2832 + 0.5, 0.4 * lp, 0.5);
    
    float power = 2.0;
    for (int i = 0; i < 6; i++) {
        power *= 2.0;
        color += (1.5 / power) * snoise(coord + vec3(0.0, -0.05 * time*2.0, 0.01 * time*2.0), 16.0 * power);
    }
    color = max(color, 0.0);
    float c2 = color * color;
    float c3 = color * c2;
    vec3 fc = vec3(color * 0.34, c2*0.15, c3*0.85);
    float f = fract(time);
    //fc *= smoothstep(f-0.1, f, length(p)) - smoothstep(f, f+0.1, length(p));
    gl_FragColor = vec4(length(fc)*vec3(1,02,0)*0.04, 1.0);
}
`;

var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo-x2.png');
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('splat1', 'assets/pics/splat1.png');
    this.load.image('splat2', 'assets/pics/splat2.png');
    this.load.image('splat3', 'assets/pics/splat3.png');
}

function create ()
{
    var shape1 = this.make.graphics().fillCircle(400, 300, 300);
    var shape2 = this.make.graphics().fillCircle(400, 300, 200);

    var geomask1 = shape1.createGeometryMask().setName('geo1');
    var geomask2 = shape2.createGeometryMask().setName('geo2');

    var maskImage1 = this.make.image({ x: 400, y: 300, key: 'splat1', add: false });
    var maskImage2 = this.make.image({ x: 400, y: 300, key: 'splat2', add: false });
    var maskImage3 = this.make.image({ x: 400, y: 300, key: 'splat3', add: false });
    var maskImage4 = this.make.image({ x: 400, y: 300, key: 'bunny', add: false });

    var bitmask1 = maskImage1.createBitmapMask();
    var bitmask2 = maskImage2.createBitmapMask();
    var bitmask3 = maskImage3.createBitmapMask();
    var bitmask4 = maskImage4.createBitmapMask();

    // bitmask3.invertAlpha = true;

    // mask3.invertAlpha = true;

    // this.cameras.main.setMask(geomask1, false);
    this.cameras.main.setMask(bitmask1, false);

    this.add.image(700, 300, 'bunny').setName('bunny');

    this.add.image(400, 300, 'pic');
    // this.add.image(400, 300, 'pic').setName('rick').setMask(geomask2);
    // this.add.image(400, 300, 'pic').setMask(bitmask3);

    // var shader = this.add.shader(600, 300, 800, 600, fragmentShader7);

    // mask4.invertAlpha = true;
    // var shader = this.add.shader(400, 300, 800, 400, fragmentShader);
    var shader = this.add.shader(400, 300, 800, 600, fragmentShader).setMask(bitmask3);
    // var shader = this.add.shader(700, 300, 800, 400, fragmentShader).setMask(mask2);

    // shader.setPointer(this.input.activePointer);

    text = this.add.text(80, 320, '', { font: '16px Courier', fill: '#00ff00' }).setName('text');

    this.add.image(400, 300, 'logo').setName('logo');
    // this.add.image(400, 300, 'logo').setMask(mask2);
    // this.add.image(300, 300, 'logo').setMask(mask4);

    // this.add.image(400, 500, 'logo').setMask(mask4);
}

function update ()
{
    if (text)
    {
        text.setText([
            this.sys.game.loop.getDuration(),
            this.sys.game.loop.getDurationMS()
        ]);
    }
}
