//Source: http://glslsandbox.com/e#39745.0

precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define MAX 12345678

vec2 rotate(vec2 k, float t)
{
    return vec2(cos(t)*k.x-sin(t)*k.y,sin(t)*k.x+cos(t)*k.y);
}

vec2 add(in vec2 a, in vec2 b) {
    return a.x < b.x ? a : b;
}

float displace(in float a, in float b) {
    return a + b;
}

vec3 repeat(in vec3 p, in vec3 dist) {
    return mod(p, dist) - 0.5*dist;
}

float sphere(in vec3 p, in float t) {
    return length(p) - t;
}

vec2 scene(in vec3 p) {
    vec2 scene = vec2(MAX,0);

    p.xy = rotate(p.xy, p.z/50.+time/10.);
    vec3 rp = repeat(p, vec3(20, 2, 2));
    vec3 rq = repeat(p, vec3(20, 0.4, 0.4));
    float sph = sphere(rp, abs(sin(time + p.z / 5.)*2.));
    float sp2 = sphere(rq, 0.1);

    scene = add(scene, vec2(sph, 1));
    scene = add(scene, vec2(sp2, 2));

    return scene;
}

#define MAX_STEPS 200

vec2 intersect(in vec3 ro, in vec3 rd) {
    float t = 0.;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec2 h = scene(ro+rd*t);
        if (h.x < .001) return vec2(t,h.y);
        t += h.x;
    }
    return vec2(0);
}

vec3 normal(in vec3 p) {
    vec3 e = vec3(.001,0,0);
    vec3 n = vec3(scene(p+e.xyy).x - scene(p-e.xyy).x,
                  scene(p+e.yxy).x - scene(p-e.yxy).x,
                  scene(p+e.yyx).x - scene(p-e.yyx).x);
    return normalize(n);
}

float softshadow(in vec3 ro, in vec3 rd, float k) {
    float res = 1.;
    float t = 0.1;
    for (int i = 0; i < 16; i++) {
        float h = scene(ro + rd*t).x;
        if (h < .001) return 0.;
        res = min(res, k*h / t);
        t += h;
    }
    return res;
}

vec3 hsb(float h, float s, float b) {
    if (s <= 0.) return vec3(b);
    if (h >= 1.) h = 0.;
    h *= 6.;
    int i = int(floor(h));
    float f = h - float(i);
    float p = b * (1. - s);
    float q = b * (1. - s * f);
    float t = b * (1. - s * (1. - f));
    if (i == 0) {
        return vec3(b, t, p);
    }
    if (i == 1) {
        return vec3(q, b, p);
    }
    if (i == 2) {
        return vec3(p, b, t);
    }
    if (i == 3) {
        return vec3(p, q, b);
    }
    if (i == 4) {
        return vec3(t, p, b);
    }
    return vec3(b, p, q);
}

void main() {
    vec2 p = gl_FragCoord.xy/resolution;
    vec2 ratio = resolution.xy/resolution.yy;
    float sensibility = 1.2;
    vec2 mouse = mouse;// mouse/resolution;
    mouse = vec2(0.5 - mouse.x, 0.5 - mouse.y) * sensibility;

    vec3 ro = vec3(sin(time*2.)*2.,cos(time*2.)*2.,time*10.);
    vec3 rd = normalize(vec3((-1.+2.*p)*ratio,2.5));

    rd.yz = rotate(rd.yz, mouse.y);
    rd.xz = rotate(rd.xz, mouse.x);

    vec3 color = vec3(0);
    vec2 t = intersect(ro, rd);
    if (t.y > 0.) {
        vec3 pos = ro + rd*t.x;
        vec3 amb = hsb(mod(pos.z/10., 1.0), 0.5, 0.2) + vec3(0, .07, .15);
        vec3 col = hsb(mod(pos.z/10., 1.0), 1., 0.5);
        vec3 lum = vec3(0.5, 0.5, -2);
        color = amb + col * softshadow(pos, lum, 5.) * 50.;
    }

    gl_FragColor = vec4(color, 1);
}