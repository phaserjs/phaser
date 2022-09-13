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

var vertexShader = `
precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

attribute vec2 inPosition;

varying vec2 fragCoord;

void main () 
{
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    fragCoord = inPosition;
}
`;

var vertexShader2 = `
precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

attribute vec2 inPosition;

varying vec2 fragCoord;

void main () 
{
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    fragCoord = inPosition;
}
`;

var fragmentShader = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 fragCoord;

void main (void)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / resolution.xy;

    // Time varying pixel color
    // vec3 col = cos(uv.xyx + vec3(0, 2, 4));
    vec3 col = uv.xyx;

    gl_FragColor = vec4(col, 1.0);
}
`;

var fragmentShader2 = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 fragCoord;

vec3 hsv2rgb (vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main (void)
{
    vec2 gg = fragCoord.xy;
    float bins = 10.0;
    vec2 pos = (gg / resolution.xy);

    float bin = floor(pos.x * bins);

    gl_FragColor = vec4(hsv2rgb(vec3(bin / bins, 1.0, 1.0)), 1.0);
}
`;

var fragmentShader3 = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 fragCoord;

void main (void)
{
    float intensity = 0.;

    for (float i = 0.; i < 54.; i++)
    {
        float angle = i/27. * 3.14159;
        vec2 xy = vec2(0.27 * cos(angle), 0.27 * sin(angle));
        xy += fragCoord.xy/resolution.y-0.5;
        intensity += pow(1000000., (0.77 - length(xy) * 1.9) * (1. + 0.275 * fract(-i / 27. - time))) / 80000.;
    }

    gl_FragColor = vec4(clamp(intensity * vec3(0.0777, 0.196, 0.27), vec3(0.), vec3(1.)), 0.);
}
`;

var fragmentShader4 = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 fragCoord;

void main (void)
{
    float ss = 0.1;
    vec2 gg = fragCoord.xy;
    gg = ceil(gg / ss) * ss;
    
    vec2 uv =  (gg -.5 * resolution.xy) / resolution.y ;
    
    if (ss<0.0)
        uv = abs(uv);
    
    float t = time * .2;
    
    vec3 ro = vec3(0, 0, -1);
        vec3 lookat = vec3(0.0);
        float zoom = .1 + abs( sin(t))/5.;
    
        vec3 f = normalize(lookat-ro),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f, r),
        c = ro + f * zoom,
        i = c + uv.x * r + uv.y * u,
        rd = normalize(i-ro);
    
        float radius = mix(.3, 1.5, .5+.5);
    
        float dS, dO;
        vec3 p;
    
        for(int i=0; i<1000; i++) {
            p = ro + rd * dO;
            dS = -(length(vec2(length(p.xz)-1., p.y)) - .15);
            if(dS<.0001) break;
            dO += dS;
    }
    
    vec3 col = vec3(0);

    if(dS<.001) {
        float x = atan(p.x, p.z)+t*.5;          // -pi to pi
        float y = atan(length(p.xz)-1., p.y);
        
        float bands = sin(y*10.+x*30.);
        float ripples = sin((x*10.-y*30.)*3.)*.5+.5;
        float waves = sin(x*2.-y*6.+t*20.);
        
        float b1 = smoothstep(-.2, .2, bands);
        float b2 = smoothstep(-.2, .2, bands-.5);
        
        float m = b1*(1.-b2);
        m = max(m, ripples*b2*max(0., waves));
        m += max(0., waves*.3*b2);
        
        col += m;
    col.rb *= 2.5;
    col.z *= 2.5*abs(cos(t));   
    }
    
    gl_FragColor = vec4( col, 0.5 );
}
`;

var vertexShader5 = `
precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

attribute vec2 inPosition;

varying vec2 fragCoord;

void main () 
{
    // gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    gl_Position = uProjectionMatrix * uViewMatrix * vec4(100.5, 0.1, 1.0, 1.0);

    // gl_Position = vec4(inPosition, 1.0, 1.0);

    fragCoord = inPosition;
}
`;

var fragmentShader5 = `
precision mediump float;

uniform float time;

varying vec2 fragCoord;

void main() {

    vec2 p = - 1.0 + 2.0 * fragCoord;
    float a = time * 40.0;
    float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;

    e = 400.0 * ( p.x * 0.5 + 0.5 );
    f = 400.0 * ( p.y * 0.5 + 0.5 );
    i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
    d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
    r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
    q = f / r;
    e = ( r * cos( q ) ) - a / 2.0;
    f = ( r * sin( q ) ) - a / 2.0;
    d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
    h = ( ( f + d ) + a / 2.0 ) * g;
    i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
    h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
    h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
    i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
    i = mod( i / 5.6, 256.0 ) / 64.0;
    if ( i < 0.0 ) i += 4.0;
    if ( i >= 2.0 ) i = 4.0 - i;
    d = r / 350.0;
    d += sin( d * d * 8.0 ) * 0.52;
    f = ( sin( a * g ) + 1.0 ) / 2.0;
    gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );

}
`;

var fragmentShader6 = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 fragCoord;

void main() {

    vec2 position = ( fragCoord.xy / resolution.xy ) + mouse / 4.0;

    float color = 0.0;
    color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
    color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
    color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
    color *= sin( time / 1.0 ) * 0.5;

    gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

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

// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/gl_FragCoord.xhtml

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var s = this.add.shader(400, 300, 800, 600, fragmentShader7);

    this.add.image(200, 300, 'block');

    var s2 = this.add.shader(400, 300, 256, 256, fragmentShader3).setVisible(false);

    this.add.image(400, 300, 'block');

    this.add.image(600, 300, 'block');

    this.tweens.add({
        targets: s2,
        scaleX: 4,
        scaleY: 4,
        repeat: -1,
        yoyo: true,
        duration: 2000
    });

    this.input.on('pointermove', function (pointer) {

        s2.setPosition(pointer.x, pointer.y);

        var x = pointer.x / 800;
        var y = 1 - pointer.y / 600;

        // s.uniforms.mouse.value.x = x.toFixed(2);
        // s.uniforms.mouse.value.y = y.toFixed(2);

    });

    this.input.on('pointerdown', function (pointer) {

        if (s2.visible)
        {
            s2.setShader(fragmentShader6);
        }
        else
        {
            s2.setVisible(true);
        }

    });
}
