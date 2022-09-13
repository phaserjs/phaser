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

varying vec2 fragCoord;

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
    mainImage(gl_FragColor, fragCoord.xy);
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

varying vec2 fragCoord;

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
    vec2 p = -0.5 + fragCoord.xy / resolution.xy;
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

var fragmentShader2 = `
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord;

//sampler2d

// https://github.com/hughsk/glsl-hsv2rgb/blob/master/index.glsl
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

    vec2 position = ( fragCoord.xy / resolution.xy ) + mouse / 4.0;

    /*float color = 0.0;
    color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
    color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
    color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
    color *= sin( time / 10.0 ) * 0.5;*/
    //float color = length(position);
    float bins = 20.0;
    vec2 pos = (fragCoord.xy / resolution.xy);
    float bin = floor(pos.x * bins + 0.6*sin(6.0*time)*sin(time+pos.y*20.0));
    gl_FragColor = vec4( hsv2rgb(vec3(bin/bins, 1.0, 0.8)), 1.0 );

}
`;

var fragmentShader1 = `
precision highp float;

#define TAU 6.28318

uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;
 
vec3 hsv2rgb_smooth( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing 
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main( void ) 
{
    float ss = 1.0;
    vec2 gg = fragCoord.xy;
    gg = ceil(gg / ss) * ss;    
    vec2 aspect = resolution.xy / resolution.y;
    vec2 uv = ( gg / resolution.y ) - aspect / 2.0;
    float t1 = fract(time*0.3)*TAU;
    float t2 = fract(time*0.1)*TAU;
    uv *= 38.0;
    // REPEAT
    uv.x += time*10.0;
    uv.x = mod(uv.x,32.0)-16.0;
    uv.x *= sin(t1+uv.y*0.125)+2.1;
    float d = length(uv)*0.06;
    d = d*d;
    float a = sin(t2);
    vec3 col = hsv2rgb_smooth(vec3(fract(time*0.4)+(uv.y+uv.x*a)*((d+0.5)*0.05),1.2-d,0.9-d));
    gl_FragColor = vec4(col, 1.0);
}
`;

var fragmentShader3 = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

void main( void ) {

    vec2 uv =  (fragCoord.xy -.5 * resolution.xy) / resolution.y ;
    
    float t = time * .8;
    
    vec3 ro = vec3(0, 0, -1);
        vec3 lookat = vec3(sin(t)/2.0 - 1.0, cos(t)/2.0 - 2.0, 0.0);
        float zoom = 0.05 + sin(t) / 50.0;
    
        vec3 f = normalize(lookat - ro),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f, r),
        c = ro + f * zoom,
        i = c + uv.x * r + uv.y * u,
        rd = normalize(i-ro);
    
        float dS, dO;
        vec3 p;
    
        for(int i=0; i<1000; i++) {
            p = ro + rd * dO;
            dS = -(length(vec2(length(p.yz)-1.0, p.x)) - 0.65 - (cos(t) + sin(t)) / 10.0);
            if(dS<.0001) break;
            dO += dS;
    }
    
    vec3 col = vec3(0);
    
    float x = atan(p.y, p.z) + t * 0.5;
    float y = atan(length(p.yz)-1., p.x);
    
    // Basically vert / horiz
    float bands = sin(y*20.+x*20.);
    
    // Size and orientation.
    float ripples = sin((x*20.-y*40.)*3.)*.5+.5;
    
    // Speed & size
    float waves = sin(x*30.+y*10.+t*6.);
    
    float b1 = smoothstep(-0.0, 1.0, bands-0.5);
    float b2 = smoothstep(-0.5, .5, bands-.35);
    
    float m = b1*(1.4-b2);
    m = max(m, ripples*b2*max(0., waves));
    m += max(0., waves*.65*b2);
    
    float fd = length(ro-p);
    col += m;
    col.rb *= 2.5;
    col.z *= 2.5*abs(cos(t));
    col = mix(col, vec3(0.2,0.75,0.75), 1.-exp(-0.80*fd*fd));

    gl_FragColor = vec4( col, 1.0 );
}
`;

var fragmentShader4 = `
/*
 * Original shader from: https://www.shadertoy.com/view/tlfGRN
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

// shadertoy globals
#define iTime time
#define iResolution resolution
const vec4  iMouse = vec4(0.0);

// --------[ Original ShaderToy begins here ]---------- //
#define EPS 0.0001
#define PI 3.14159265359
#define FLT_MAX 3.402823466e+38
#define FLT_MIN 1.175494351e-38
#define DBL_MAX 1.7976931348623158e+308
#define DBL_MIN 2.2250738585072014e-308

const int maxIterations = 64;
const float stepScale = .9;
const float stopThreshold = .005;

float fov = .65;
float nearClip = 0.;
float farClip = 80.;

struct Surface {
    float dist;
    vec3 position;
    vec3 baseColor;
    vec3 normal;
    vec3 emissiveColor;
};
    
struct Hit {
    Surface surface;
    Surface near;
    vec3 color;
};
    
float saturate(float s) {
    return clamp(s, 0., 1.);
}

float smin(float a, float b, float k) {
    float res = exp(-k * a) + exp(-k * b);
    return -log(res) / k;
}

mat2 rot2(float t) {
    return mat2(cos(t), -sin(t), sin(t), cos(t));
}

float scene(vec3 p) {
    vec3 p1 = p;
    p1.xy += vec2(iTime * .8 + 10., iTime * .4 + 20.);
    p1.xy *= rot2(PI * .05);
    
    vec3 p2 = p;   
    p2.yz += vec2(iTime * .4 + 30., iTime * .8 + 40.);
    p2.yz *= rot2(PI * .04);

    vec3 p3 = p;   
    p3.xz += vec2(iTime * .8 + 50., iTime * .6 + 60.);
    p3.xz *= rot2(PI / 2. + iTime * .0);
    
    float m = 6.;
   
    p1.y += sin(sin(p1.z * 1.2 + iTime * 4.) * .3) * .3;
    p1.x += sin(sin(p1.z * 1. + iTime * 2.) * .4) * .2;
    p1.y = mod(p1.y, m) - m * .5;
    p1.x = mod(p1.x, m) - m * .5;    
    

    p2.y += sin(sin(p2.z * 1.2 + iTime * 4.) * .4) * .4;
    p2.x += sin(sin(p2.z * .5 + iTime * 3.) * .5) * .3;
    p2.y = mod(p2.y, m) - m * .5;
    p2.x = mod(p2.x, m) - m * .5;    

    p3.y += sin(sin(p3.z * .8 + iTime * 2.) * .4) * .2;
    p3.x += sin(sin(p3.z * 1.1 + iTime * 3.) * .5) * .4;
    p3.y = mod(p3.y, m) - m * .5;
    p3.x = mod(p3.x, m) - m * .5;    

    float c = smin(length(p1.xy), length(p2.xy), 4.);
    c = smin(c, length(p3.xy), 4.);
    
    return c;
}

Hit rayMarching(vec3 origin, vec3 dir, float start, float end) {
    Surface cs;
    cs.dist = -1.;
    
    Hit hit;
    hit.color = vec3(0.);

    float sceneDist = 0.;
    float rayDepth = start;

    for(int i = 0; i < maxIterations; i++) {
        sceneDist = scene(origin + dir * rayDepth);
      
        if((sceneDist < stopThreshold) || (rayDepth >= end)) {
            break;
        }
        rayDepth += sceneDist * stepScale;
        vec3 p = origin + dir * rayDepth;
        vec3 c = sin((iTime + PI / 2.) * 4. * vec3(.123, .456, .789)) * .4 + .6;
        hit.color += max(vec3(0.), .09 / sceneDist * c);
    }
    
    /*
    if (sceneDist >= stopThreshold) {
        rayDepth = end;
    } else {
        rayDepth += sceneDist;
    }
    */
    
    cs.dist = rayDepth;
    hit.surface = cs;

    return hit;
}

vec3 fog(vec3 color, float distance, vec3 fogColor, float b) {
    float fogAmount = 1. - exp(-distance * b);
    return mix(color, fogColor, fogAmount);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 mouse = iMouse.xy;

    vec2 aspect = vec2(iResolution.x / iResolution.y, 1.);
    vec2 screenCoord = (2. * fragCoord.xy / iResolution.xy - 1.) * aspect;

    // displacement
    vec2 uv = screenCoord;
    uv.xy *= rot2(iTime * .07);
    uv.y += sin(screenCoord.x * 2.4 + iTime * .05) * .16;
    uv.x += sin(uv.y * 2.4 + iTime * .1) * .12;

    // mouse = mouse.xy / iResolution.xy - .5;
  
    // camera settings
    //vec3 lookAt = vec3(cos(iTime * .4) * .5, sin(iTime * .3) * .5, 0.);
    float z = iTime * -5.;
    vec3 lookAt = vec3(0., 0., z - 1.);
    vec3 cameraPos = vec3(0., 0., z);

    // camera vectors
    vec3 forward = normalize(lookAt - cameraPos);
    vec3 right = normalize(cross(forward, vec3(0., 1., 0.)));
    vec3 up = normalize(cross(right, forward));   
    
    // raymarch
    vec3 rayOrigin = cameraPos;
    vec3 rayDirection = normalize(forward + fov * uv.x * right + fov * uv.y * up);
    Hit hit = rayMarching(rayOrigin, rayDirection, nearClip, farClip);
    Surface surface = hit.surface;

    surface.position = rayOrigin + rayDirection * surface.dist;
    
    // color
    vec3 sceneColor = vec3(0.);

    sceneColor = hit.color;
    
    sceneColor = fog(sceneColor, surface.dist, vec3(0.), .065);
    
    // vignet by channel
    float vignetR = 1. - smoothstep(0., 2.5 + sin(iTime * 1.) * 1.5, length(screenCoord)) * .8;
    float vignetG = 1. - smoothstep(0., 2.5 + cos(iTime * 1.2) * 1.5, length(screenCoord)) * .8;
    float vignetB = 1. - smoothstep(0., 2.5 + sin(iTime * 1.4) * 1.5, length(screenCoord)) * .8;
    
    sceneColor.x *= vignetR;
    sceneColor.y *= vignetG;
    sceneColor.z *= vignetB;

    // debug distance color
    //sceneColor.rgb = vec3(surface.dist / farClip);
    
    fragColor = vec4(sceneColor, 1.);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
`;

var fragmentShader5 = `
precision highp float;   /// iOS needs high?

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

// "[SH17A] Fireworks" by Martijn Steinrucken aka BigWings/Countfrolic - 2017
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Based on https://www.shadertoy.com/view/lscGRl

#define N(h) fract(sin(vec4(6,9,1,0)*h) * 9e2)

void main(void)
{
  vec4 o; 
  vec2 u = fragCoord.xy/resolution.y;
    
// proper pixelate
float s = 500.;
    u = floor(u * s) / s;
    
  float e, d, i=0.;
  vec4 p;
    
  for(float i=1.; i<30.; i++) {
    d = floor(e = i*9.1+time);
    p = N(d)+.3;
    e -= d;
    for(float d=0.; d<5.;d++)
      o += p*(2.9-e)/1e3/length(u-(p-e*(N(d*i)-.5)).xy);  
  }
     
  gl_FragColor = vec4(o.rgb, 1.0);
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

    // bitmask2.invertAlpha = true;

    this.cameras.main.setMask(geomask1, false);

    // this.cameras.main.setMask(bitmask2, false);
    this.add.image(400, 300, 'pic');

    var container = this.add.container(400, 300);

    var shader1 = this.add.shader(-128, 0, 128, 128, fragmentShader);
    var shader2 = this.add.shader(0, 0, 128, 128, fragmentShader5);
    var shader3 = this.add.shader(128, 0, 128, 128, fragmentShader7);
    var shader4 = this.add.shader(0, -128, 128, 128, fragmentShader3);
    var shader5 = this.add.shader(0, 128, 128, 128, fragmentShader4);

    container.add([ shader1, shader2, shader3, shader4, shader5 ]);

    container.setScale(0.5);

    shader2.setMask(bitmask2, false);

    this.tweens.add({
        targets: container,
        angle: { value: 360, duration: 4000 },
        scaleX: { value: 5, duration: 6000, yoyo: true, ease: 'Quad.easeInOut' },
        scaleY: { value: 5, duration: 6000, yoyo: true, ease: 'Quad.easeInOut' },
        repeat: -1
    });
}
