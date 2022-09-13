// Author: Patricio Gonzalez Vivo
// Title: Cosmic Ripples

precision mediump float;

uniform float time;
//  uniform vec2 mouse;
//  uniform vec2 resolution;

#define PI 3.1415926535897932384626433832795

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float circle (vec2 st, float radius) {
    vec2 pos = vec2(0.5)-st;
    return smoothstep(1.0-radius,1.0-radius+radius*0.2,1.-dot(pos,pos)*PI);
}

void main() {

    vec2 resolution = vec2(800.0, 600.0);

    vec2 st = gl_FragCoord.xy/resolution.xy;
    st = (st-.5)*1.088+.5;
    if (resolution.y > resolution.x ) {
        st.y *= resolution.y/resolution.x;
        st.y -= (resolution.y*.5-resolution.x*.5)/resolution.x;
    } else {
        st.x *= resolution.x/resolution.y;
        st.x -= (resolution.x*.5-resolution.y*.5)/resolution.y;
    }
    vec3 color = vec3(0.);
    
    float t = time*.1;
    vec2 pol = vec2(0.0);
    pol.x = atan(st.x-.5,st.y-.5)/PI;
    pol.y = dot(st-.5,st-.5)*2.;
    
    float pct = 0.0;
    pct += snoise(vec2(log(pol.y),abs(pol.x)+t));
    pol.x *= .2;
    pct += snoise(vec2(log(pol.y)*(1.5+cos(t*.5)),abs(pol.x)-t));

    color += smoothstep(0.,.1+abs(cos(t*.2)),pct) * circle(st,.8) * smoothstep(.00,.1,pol.y);
    gl_FragColor = vec4(color,1.0);
}