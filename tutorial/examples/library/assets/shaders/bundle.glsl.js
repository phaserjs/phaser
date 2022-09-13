
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord;

#ifndef saturate
#define saturate(v) clamp(v,0.,1.)
//      clamp(v,0.,1.)
#endif
vec3 cyan=vec3(0.,0.5765,0.8275),
     magenta=vec3(0.8,0.,0.4196),
     yellow=vec3(1.,0.9451,0.0471);

void main(void){
    vec2 uv=fragCoord.xy/resolution;
    uv.x-=.5;
    uv.x*=resolution.x/resolution.y;
    uv.x+=.5;
    vec3 col=vec3(1.);
    col*=mix(cyan,vec3(1.),saturate((length(uv-vec2(.6,.4))-.2)/5e-3));
    col*=mix(magenta,vec3(1.),saturate((length(uv-vec2(.4,.4))-.2)/5e-3));
    col*=mix(yellow,vec3(1.),saturate((length(uv-vec2(.5,.6))-.2)/5e-3));
    if(floor(mod(fragCoord.y,2.))==0.){
    col=vec3(-2.);
    col+=mix(cyan,vec3(1.),saturate((length(uv-vec2(.6,.4))-.2)/5e-3));
    col+=mix(magenta,vec3(1.),saturate((length(uv-vec2(.4,.4))-.2)/5e-3));
    col+=mix(yellow,vec3(1.),saturate((length(uv-vec2(.5,.6))-.2)/5e-3));
    }
    gl_FragColor=vec4(col,1.);
}

---
name: Raster Sky
type: fragment
author: http://glslsandbox.com/e#47285.1
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main( void ) {

    vec2 realposition = ( fragCoord.xy / resolution.xy );
    vec2 position = realposition;

    position.x += time*0.05+120.;

    position.x *= cos(position.y*1.);

    vec2 star = vec2(0.8, 0.8);

    vec3 color = vec3(0.0);

    color.r = abs(sin(position.x*4.));
    color.g = abs(cos(position.x*4.+1.));
    color.b = abs(cos(position.x*4.));

    color.r *= cos(time*0.2+1.)*0.5+0.5;
    color.g *= sin(time*0.2)*0.5+0.5;
    color.b *= sin(time*0.2+5.)*0.5+0.5;


    vec3 skycolor= vec3(0.0);

    skycolor.r = sin(time*0.1+realposition.x     )*0.5+0.5;
    skycolor.g = cos(time*0.1+realposition.x + 2.)*0.5+0.5;
    skycolor.b = cos(time*0.1+realposition.x + 3.)*0.5+0.5;


    skycolor*= 0.3;

    skycolor += ((vec3(cos(time),cos(time),sin(time))*0.25+vec3(0.25) + vec3(0.50))*0.01)/distance(star, realposition);

    if(realposition.y>0.6)
        color *= 0.0;
    if(realposition.y>0.5)
        color = mix(skycolor ,color, (0.6-realposition.y)*10.);

    gl_FragColor = vec4( color, 1.0 );

}

---
name: Colorful Voronoi
type: fragment
author: Brandon Fogerty (xdpixel.com)
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

vec2 hash(vec2 p)
{
    mat2 m = mat2(  13.85, 47.77,
                    99.41, 8.48
                );

    return fract(sin(m*p) * 46738.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 1.0;
    for(int y = -1; y <= 1; y++)
    {
        for(int x = -1; x <= 1; x++)
        {
            vec2 latticePoint = vec2(x, y);
            float currentDistance = distance(latticePoint + hash(g+latticePoint), f);
            distanceToClosestFeaturePoint = min(distanceToClosestFeaturePoint, currentDistance);
        }
    }

    return distanceToClosestFeaturePoint;
}

void main( void )
{
    vec2 uv = ( fragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float offset = voronoi(uv*10.0 + vec2(time));
    float t = 1.0/abs(((uv.x + sin(uv.y + time)) + offset) * 30.0);

    float r = voronoi( uv * 1.0 ) * 1.0;
    vec3 finalColor = vec3(10.0 * uv.y, 2.0, 1.0 * r ) * t;

    gl_FragColor = vec4(finalColor, 1.0 );
}

---
name: Tunnel
type: fragment
uniform.alpha: { "type": "1f", "value": 1.0 }
uniform.origin: { "type": "1f", "value": 2.0 }
uniform.iChannel0: { "type": "sampler2D", "value": null, "textureData": { "repeat": true } }
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform float alpha;
uniform float origin;

varying vec2 fragCoord;

#define S 0.79577471545 // Precalculated 2.5 / PI
#define E 0.0001

void main(void) {
    vec2 p = (origin * fragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    vec2 t = vec2(S * atan(p.x, p.y), 1.0 / max(length(p), E));
    vec3 c = texture2D(iChannel0, t + vec2(time * 0.1, time)).xyz;
    gl_FragColor = vec4(c / (t.y + 0.5), alpha);
}

---
name: Test1
type: fragment
author: https://www.shadertoy.com/view/ltdXzX
---

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
    float y = fragCoord.y - (iResolution.y / 2.0);

    float r = length(vec2(x,y));
    float angle = atan(x,y) - sin(iTime)*r / 200.0 + 1.0*iTime;
    float intensity = 0.5 + 0.25*sin(15.0*angle);
    // float intensity = mod(angle, (PI / 8.0));
    // float intensity = 0.5 + 0.25*sin(angle*16.0-5.0*iTime);

    fragColor = hsv_to_rgb(angle/PI, intensity, 1.0, 0.5);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}


---
name: Oldschool Plasma
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 fragCoord;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = -1.0 + 2.0 * fragCoord.xy / resolution.xy;

    // main code, *original shader by: 'Plasma' by Viktor Korsun (2011)
    float x = p.x;
    float y = p.y;
    float mov0 = x+y+cos(sin(time)*2.0)*100.+sin(x/100.)*1000.;
    float mov1 = y / 0.9 +  time;
    float mov2 = x / 0.2;
    float c1 = abs(sin(mov1+time)/2.+mov2/2.-mov1-mov2+time);
    float c2 = abs(sin(c1+sin(mov0/1000.+time)+sin(y/40.+time)+sin((x+y)/100.)*3.));
    float c3 = abs(sin(c2+cos(mov1+mov2+c2)+cos(mov2)+sin(x/1000.)));
    fragColor = vec4(c1,c2,c3,1);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}

---
name: Rainbow
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 fragCoord;

void main (void)
{
    vec2 uv = fragCoord.xy / resolution.xy;

    // Time varying pixel color
    // vec3 col = cos(uv.xyx + vec3(0, 2, 4));
    vec3 col = uv.xyx;

    gl_FragColor = vec4(col, 1.0);
}

---
name: Particles
type: fragment
---

precision highp float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

#define N(h) fract(sin(vec4(6,9,1,0)*h) * 9e2)

void main(void)
{
    vec4 o;
    vec2 u = fragCoord.xy / resolution.y;
    float s = 500.0;
    u = floor(u * s) / s;
    float e, d, i=0.;
    vec4 p;

    for (float i=1.; i<30.; i++) {
        d = floor(e = i*9.1+time);
        p = N(d)+.3;
        e -= d;

        for (float d=0.; d<5.;d++)
            o += p*(2.9-e)/1e3/length(u-(p-e*(N(d*i)-.5)).xy);
    }

    gl_FragColor = vec4(o.rgb, 1.0);
}

---
name: Plasma
type: fragment
---

precision highp float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main( void ) {

    vec2 position = ( fragCoord.xy / resolution.xy );

    float color = 0.0;
    color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
    color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
    color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
    color *= sin( time / 10.0 ) * 0.5;


    gl_FragColor = vec4( vec3( sin( color + time / 3.0 ) * 0.75, cos( color + time / 3.0 ) * 0.75, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}

