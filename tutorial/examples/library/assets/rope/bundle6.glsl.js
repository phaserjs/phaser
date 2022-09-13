---
name: Meta Balls
type: fragment
author: http://glslsandbox.com/e#60769.0
---

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926535897932384626433832795
#define PI_2 1.57079632679489661923
#define PI_4 0.785398163397448309616

#define MAXSTEPS 100
#define MAXDIST 10.0
#define EPSILON .000001
#define SPECULAR_STRENGTH 50.0

//#define ANTIALISING

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
}

vec3 rotateX(vec3 v, float a) {
    vec2 yz = rotate(v.yz, a);
    return vec3(v.x, yz[0], yz[1]);
}

vec3 rotateY(vec3 v, float a) {
    vec2 xz = rotate(v.xz, a);
    return vec3(xz[0], v.y, xz[1]);
}

vec3 rotateZ(vec3 v, float a) {
    vec2 xy = rotate(v.xy, a);
    return vec3(xy[0], xy[1], v.z);
}

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float sphereSDF(vec3 pos, vec3 spherePosition, float radius) {
    return distance(pos, spherePosition) - radius;
}

float boxSDF(vec3 pos, vec3 boxPosition, vec3 size) {
    pos -= boxPosition;
    vec3 q = abs(pos) - size;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float unionSDF(float distA, float distB) {
    return min(distA, distB);
}

float smoothUnionSDF(float a, float b, float k) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float sceneSDF(vec3 pos) {
    float spheres = 0.;
    spheres = sphereSDF(mod(pos, vec3(1, 1, 1) * 2.0), vec3(1, 1, 1), 0.4);
    for (int i = 0; i < 5; i++) {
        vec3 spherePos = vec3(1, 1, 1);
        vec3 sphereOffset = vec3(
            sin(time * (2.0 + float(i) / 3.) + float(i)) / 2.0,
            0,
            0
        );
        sphereOffset = rotateY(sphereOffset, float(i));
        sphereOffset = rotateZ(sphereOffset, float(i*100));
        spheres = smoothUnionSDF(spheres, sphereSDF(mod(pos + sphereOffset, spherePos * 2.0), spherePos, 0.1), 0.1);
    }
    
    return spheres;
    
    vec3 spherePosition = vec3(1, 1, 1);
    float sphere = sphereSDF(mod(pos, spherePosition * 2.0), spherePosition, 0.4);
    
    vec3 spherePosition2 = vec3(1, 1, 1);
    float sphere2 = sphereSDF(mod(pos + vec3(sin(time/2.)/2.4,sin(time)/2.4,cos(time)/2.4), spherePosition2 * 2.0), spherePosition2, 0.2);
    
    return smoothUnionSDF(sphere, sphere2, 0.1);
    
    vec3 box1Position = vec3(1, 1, 1);
    vec3 box1Offset = vec3(-0.2, -0.2, -0.2);
    vec3 box1Size = vec3(0.1, 0.1, 0.1);
    float box1 = boxSDF(mod(pos + box1Offset, box1Position * 2.0), box1Position, box1Size);
    
    vec3 box2Position = vec3(1, 1, 1);
    vec3 box2Offset = vec3(0.2, 0.2, 0.2);
    vec3 box2Size = vec3(0.1, 0.1, 0.1);
    float box2 = boxSDF(mod(pos + box2Offset, box2Position * 2.0), box2Position, box2Size);
    
    vec3 box3Position = vec3(1, 1, 1);
    vec3 box3Offset = vec3(0, 0, 0);
    vec3 box3Size = vec3(0.1, 0.1, 0.1);
    float box3 = boxSDF(mod(pos + box3Offset, box3Position * 2.0), box3Position, box3Size);
    
    float boxes = unionSDF(box1, unionSDF(box2, box3));
    
    float ratio = (sin(time * 2.0) + 1.0) / 2.0;
    //ratio = 0.5;
    return mix(sphere, boxes, ratio);
    //return unionSDF(sphere, box);
}

float legoSceneSDF(vec3 pos) {
    //pos = mod(pos, vec3(2,2,2));
    pos = rotateZ(pos, mouse.x / resolution.x * PI * 2.0);
    
    float outerBox = boxSDF(pos, vec3(0,-0.1,1), vec3(0.318,0.096,0.158));
    float innerBox = boxSDF(pos - vec3(0, -0.011 ,0), vec3(1,1,1), vec3(0.294,0.086,0.134));
    
    return max(outerBox, -innerBox);
}
    
float trace(vec3 from, vec3 direction) {
    float totalDistance = 0.;
    for (int i = 0; i < MAXSTEPS; i++) {
        vec3 p = from + totalDistance * direction;
        
        float dist = sceneSDF(p);
        //float dist = legoSceneSDF(p);
        
        totalDistance += dist;
        
        if (dist < EPSILON) {
            return totalDistance;
        }
        
        if (totalDistance >= MAXDIST) {
            return totalDistance;
        }
    }
    return totalDistance;
}

vec4 estimateNormalAndDistance(vec3 p, vec3 direction) {
    float epsilon = 0.00005;
    float centerDistance = trace(p, direction);
    if (centerDistance >= MAXDIST) {
        return vec4(0,0,0,centerDistance);
    } else {
        float xDistance = trace(p + vec3(epsilon, 0, 0), direction);
        float yDistance = trace(p + vec3(0, epsilon, 0), direction);
        float zDistance = trace(p + vec3(0, 0, epsilon), direction);
        return vec4(normalize((vec3(xDistance, yDistance, zDistance) - centerDistance) / epsilon), centerDistance);
    }
}

float degToRad(float angle) {
    return angle *= PI / 180.0;
}

vec4 addLight(vec4 base, vec3 normal, vec3 direction, vec3 color, float strength) {
    float light = pow(max(0.0, dot(normal, normalize(direction))), 1.5);
    float lightSpecular = pow(light, SPECULAR_STRENGTH);
    
    base.r += light * color.r * strength;
    base.g += light * color.g * strength;
    base.b += light * color.b * strength;
    
    base.r += lightSpecular;
    base.g += lightSpecular;
    base.b += lightSpecular;
    
    return base;
}

vec4 normalToColor(vec3 normal, vec4 base) {
    vec4 lightLayer = vec4(0,0,0,1);
    lightLayer = addLight(lightLayer, normal, vec3(1,sin(time * 2.) + 1.,-1), vec3(0.1, 0.6, 0.9), 1.0);
    lightLayer = addLight(lightLayer, normal, vec3(-1,-1,-1), vec3(0.8, 0.2, 0.1), 1.0);
    lightLayer = addLight(lightLayer, normal, vec3(0,0,1), vec3(1, 1, 0), 1.0);
    
    return base * lightLayer;
}

vec4 normalToFinalColor(vec3 normal, float dist) {
    float angleX = acos(dot(normal, normalize(vec3(0,0,-1)))) - PI_2;
    float angleY = asin(dot(normal, normalize(vec3(0,1,0))));
    
    vec4 base = vec4(1,1,1,1);
    vec4 fragColor = normalToColor(normal, base);
    
    float ratio = min(1.0, dist / MAXDIST);
    ratio = 1.0 - pow(ratio, 5.0);
    fragColor = mix(vec4(0,0,0,0), fragColor, ratio);
    
    return fragColor;
}

vec4 getFragColor(vec2 fragCoord) {
    vec2 uv = (fragCoord - resolution / 2.) / resolution.y;
    
    vec3 camPos = vec3(0.1, 0, 0);
    vec3 ray = normalize(vec3(uv, 1.));
    
    // rotate
    if (false) {
        ray = rotateX(ray, (mouse.y - 0.5) * PI);
        ray = rotateY(ray, (mouse.x - 0.5) * PI);
    } else {
        ray = rotateX(ray, time * 0.1);
        ray = rotateY(ray, time * 0.1);
        ray = rotateZ(ray, time * 0.2);
    }
    
    // translate
    if (true) {
        float iTimeMod = mod(time, 4.0);
        camPos = camPos + 1.0 * vec3(0, iTimeMod * 0.5, iTimeMod);
    }
    
    vec4 normalAndDistance = estimateNormalAndDistance(camPos, ray);
    vec3 normal = normalAndDistance.xyz;
    float dist = normalAndDistance.w;
    
    vec4 fragColor = normalToFinalColor(normal, dist);
    
    //second ray
    if (false && length(normal) > 0.) {
        camPos = camPos + (dist * ray) + (normal * EPSILON * 2.);
        
        normal.x += rand(camPos.xy) / 10.;
        normal.y += rand(camPos.yz) / 10.;
        normal.z += rand(camPos.zx) / 10.;
        
        normalAndDistance = estimateNormalAndDistance(camPos, normal);
        normal = normalAndDistance.xyz;
        dist = normalAndDistance.w;
        
        fragColor = mix(vec4(0,0,0,1), fragColor, pow(min(1.0, dist / 10.), 1. / 5.));
    }
    
    return fragColor;
}

void main(void) {
    gl_FragColor = getFragColor(gl_FragCoord.xy);
}

---
name: Moon Mist
type: fragment
author: http://glslsandbox.com/e#60793.0
---

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float n) {
    return fract(sin(n)*43758.5435);
}

float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    
    f = f*f*(3.0 - 2.0*f);
    float n = p.x + p.y*57.0 + p.z*113.0;
    
    return mix(
        mix(
            mix(hash(n + 000.0), hash(n + 001.0), f.x),
            mix(hash(n + 057.0), hash(n + 058.0), f.x),
            f.y),
        mix(
            mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 170.0), hash(n + 171.0), f.x),
            f.y),
        f.z);
}

float fbm(vec3 p) {
    float f = 0.0;
    
    f += 0.5000*noise(p); p *= 2.02;
    f += 0.2500*noise(p); p *= 2.04;
    f += 0.1250*noise(p); p *= 2.00;
    f += 0.0625*noise(p); p *= 1.97;
    f /= 0.9375;
    
    return f;
}

float volume(vec3 p, out float rawDens) {
    float dens = -p.y - 1.0;
    
    if (dens < -1.0) return 0.0;
    rawDens = dens + 1.0*fbm(2.0*p + time);
    dens = clamp(rawDens, 0.0, 1.0);
    
    return dens;
}

vec4 volumetric(vec3 ro, vec3 rd, vec3 col, float mt) {
    vec4 sum = vec4(0);
    
    float ste = 0.075;
    
    vec3 pos = ro + rd*ste;
    
    for(int i = 0; i < 100; i++) {
        if(sum.a > 0.99) continue;
        
        float dens, rawDens;
        dens = volume(pos, rawDens);
        
        vec4 col2 = vec4(mix(vec3(0.2), vec3(1.0), dens), dens);
        col2.rgb *= col2.a;
        col2.rgb = mix(col, col2.rgb, clamp(smoothstep(ste - 4.0, ste + 2.8 + ste*0.75, mt), 0.0, 1.0));
        sum = sum + col2*(1.0 - sum.a);
        
        float sm = 1. + 2.5*(1.0 - clamp(rawDens+1.0, 0.0, 1.0));
        //if(ste*sm < mt) break;
        pos += rd*ste*sm;
    }
    
    return clamp(sum, 0.0, 1.0);
}


float map(vec3 p) {
    p.y -= 0.2*cos(time);
    float s =  length(p) - 1.0;

    return s;
}


float march(vec3 ro, vec3 rd) {
    float t = 0.0;
    for(int i = 0; i < 100; i++) {
        float h = map(ro + rd*t);
        if(h < 0.001 || t >= 10.0) break;
        t += h;
    }
    
    return t;
}

vec3 normal(vec3 p) {
    vec2 h = vec2(0.001, 0.0);
    vec3 n = vec3(
        map(p + h.xyy) - map(p - h.xyy),
        map(p + h.yxy) - map(p - h.yxy),
        map(p + h.yyx) - map(p - h.yyx)
    );
    
    return normalize(n);
}

mat3 camera(vec3 eye, vec3 lat) {
    vec3 ww = normalize(lat - eye);
    vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
    vec3 vv = normalize(cross(ww, uu));
        
    return mat3(uu, vv, ww);    
}

void main( void ) {
    vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
    uv.x *= resolution.x/resolution.y;
    
    vec3 col = vec3(0);
    
    vec3 ro = 3.0*vec3(cos(0.3*time), 0.0, -sin(0.3*time));
    vec3 rd = normalize(camera(ro, vec3(0))*vec3(uv, 1.97));
    
    float i = march(ro, rd);
    
    if(i < 10.0) {
        vec3 pos = ro + rd*i;
        vec3 nor = normal(pos);
        
        col = (0.5 + 0.5*nor.y)*vec3(1.00, 0.97, 0.1);
    }
     
    vec4 fog = volumetric(ro, rd, col, i);
    col = fog.xyz;
    
    col = pow(col, vec3(.454545));
    
    gl_FragColor = vec4(col, 1);
}

---
name: Tunnel
type: fragment
author: http://glslsandbox.com/e#60792.0
---

/*
 * Original shader from: https://www.shadertoy.com/view/tlG3RV
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iResolution resolution
const vec4 iMouse = vec4(0.0);

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
#define mx (10.*iMouse.x/iResolution.y)
#define iTime (time + 2.4 + mx)
vec3 getRd(vec3 ro,vec3 lookAt,vec2 uv){
    vec3 dir = normalize(lookAt - ro);
    vec3 right = normalize(cross(vec3(0,1,0), dir));
    vec3 up = normalize(cross(dir, right));
    return dir + right*uv.x + up*uv.y;
}
#define dmin(a,b) a.x < b.x ? a : b
#define pmod(p,x) mod(p, x) - x*0.5

vec4 r14c(float i){return texture(iChannel0, vec2(i));}

float sdBox(vec3 p, vec3 s){
    p = abs(p) - s;    
    return max(p.x, max(p.y, p.z));
}
#define pi acos(-1.)
#define tau (2.*pi)
#define rot(x) mat2(cos(x),-sin(x),sin(x),cos(x))
#define tunnRotRate

vec2 id;
vec2 map(vec3 p){
    vec2 d = (vec2(10e7));

    p.xy *= rot(0. + p.z*0.1 + 0.1*iTime);
    
    
    for (float i = 0.; i < 4.; i++){
        p = abs(p);
        p.xy *= rot(0.4*pi );
        p.x -= 0.2;
        p.x *= 1. + 0.4*atan(p.x, p.y)/pi;
        //p.y += 0.1;
    }    

    p.xy -= 2.0;
    
    
    p.y = abs(p.y);
    
    
    p.y -= 1. + sin(iTime*0.1)*0.2;
    
    #define modSz 0.5
    id = floor(p.xz/modSz);
    //vec2 
    
    p.xy -= 0.8;
    p.xz = pmod(p.xz, modSz);
    
    for (float i = 0.; i < 5.; i++){
        p = abs(p);
        p.y -= 0.28 - sin(iTime*0.2)*0.08 - 0.1;
        p.x += 0.04;
        p.xy *= rot(0.6*pi + id.y*6.  + 0.9);
        if (i == 3.){
            p.xz *= rot(iTime*2. + id.y);
        }
    }     

    d = dmin(d, vec2(sdBox(p, vec3(modSz*0.25 + sin(iTime*0.26)*0.1)), 1.)); 
    
    d.x *= 0.25;
    return d;
} 
/*
vec3 getNormal(vec3 p){
    vec2 t = vec2(0.001,0);
    return normalize(map(p).x - vec3(
        map(p - t.xyy).x,
        map(p - t.yxy).x,
        map(p - t.yyx).x
    ));
}*/
    
vec3 glow = vec3(0);

//#define pal(q,w,e,r,t) (q + w*sin(e*r + t))
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;

    vec3 col = vec3(0);

    vec3 ro = vec3(0.,0,0);
    ro.z += iTime*3. + mx;
    
    float rate = ro.z*0.1 + 0.1*iTime;
    
    ro.xy += vec2(sin(rate), cos(rate))*2.;
    
    vec3 lookAt = ro + vec3(0,0,4);
    float rotRate = iTime*0.3 + sin(iTime*0.3)*0.0;
    lookAt.xz += vec2(
        sin(rotRate),
        cos(rotRate)
    );
    
    vec3 rd = getRd(ro, lookAt, uv);
    
    vec3 p = ro; float t = 0.;
    for (int i = 0; i < 250; i++){
        vec2 d = map(p);
                                #define pal(q,w,e,r,t) (q + w*cos( tau*(e*r + t))
        //glow += exp(-d.x*70.)* pal(vec3(0.5,0.6,0.7)*1., 0.35, id.y*0.2 + iTime*0.4 + 1.*p.z*(sin(iTime)*0.001), vec3(0.4, 0.9,0.2), 0. + p.z*0.02));
        //glow += exp(-d.x*20.)* pal(vec3(0.5,0.6,0.7)*1., 0.45, id.y*0.2 + iTime*0.4 + 0.*p.z*(sin(iTime)*0.001), vec3(0.4, 0.9,0.2), 0. + p.z*0.02));
        //zglow += exp(-d.x*20.)* pal(vec3(0.5,0.6,0.7)*0.2, 0.95, id.y*0.05 + iTime*1. + 0.*p.z*(sin(iTime)*0.001), vec3(0.1, 0.9,0.2), 0.5 + p.z*0.02));
        //glow += exp(-d.x*60.)* pal(0.5, 0.45, id.y*0.2 + iTime*2., vec3(0.1, 0.4,0.8), 0.5)) ;
        glow += exp(-d.x*60.)* pal(1., 0.35, id.y*0.01 + iTime*.2, vec3(0.4, 0.5,0.9), 0.9 + p.z*0.02)) ;
        if(d.x < 0.0005){
            /*
            vec3 n = getNormal(p);
            vec3 l = normalize(vec3(1));
            vec3 h = normalize(l - rd);
            float diff = max(dot(n,l),0.);
            float spec = max(dot(n,h),0.);
            float fres = pow(1. - max(dot(n,-rd), 0.),5.);
            */
            //col += fres*diff*3.;
            
            break;
        }
        if (t > 100.){
            break;
        }
        t += d.x;
        p = ro + rd*t;
    }   
    
    float bass = pow(texture(iChannel1, vec2(0.,0.14)).x, 4.);
    
    col += glow*(0.01 + bass*0.);
    col = mix(col, vec3(0), pow(clamp(t*.02 - 0.1, 0., 1.), 2.));
    col = smoothstep(0.,1., col);
    //col = smoothstep(0.,1., col);
    
    //col = pow(col , vec3(1.8,1.0,1.));
    
    
    //col.g = pow(col.g, 2. - 0.5*( col.r + col.b*0.1));
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}

---
name: RGB Wave
type: fragment
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
#define PI 3.141592

vec3 pal(float x)
{
    return max(min(sin(vec3(x,x+PI*2.0/3.0,x+PI*4.0/3.0))+0.5,1.0),0.0);
}

void main( void ) {
    
    float t = time*0.9;
    vec2 mouse = vec2(0.5, 0.5);
    
    vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
    position *= 2.25;
    position.y *= dot(position,position);
    
    position.y *= 1.0+sin(position.x*3.0)*0.2;
    
    float foff = 0.3;
    float den = 0.05;
    float amp = mouse.y;
    float freq = 5.0+mouse.x*10.0;
    float offset = 0.1-tan(position.x*0.5)*5.05;

        float modifer = 0.;
    
    for(float i = 0.0; i < 3.0; i+=1.0)
        modifer += 6.0/abs((position.y + (amp*sin(((position.x*4.0 + t) + offset) *freq+i*foff))))*den;;
    
    vec3 colour = pal(position.x*2.)*0.25* modifer;
    
    gl_FragColor = vec4( colour, 2.0 );


}

---
name: RayTracer
type: fragment
---

//http://glslsandbox.com/e#3161.2
#ifdef GL_ES
precision mediump float;
#endif
//this is a raytracer I found buried in a Japanese application. I lost the src package. I've changed it to fit with WebGl spec and not need some stuff originally in the vertex shader.-georgetoledo

uniform float time;
uniform vec2 resolution;



const int raytraceDepth = 6;



struct Ray
{
    vec3 org;
    vec3 dir;
};
struct Sphere
{
    vec3 c;
    float r;
    vec3 col;
};
struct Plane
{
    vec3 p;
    vec3 n;
    vec3 col;
};

struct Intersection
{
    float t;
    vec3 p;     // hit point
    vec3 n;     // normal
    int hit;
    vec3 col;
};

void shpere_intersect(Sphere s,  Ray ray, inout Intersection isect)
{
    // rs = ray.org - sphere.c
    vec3 rs = ray.org - s.c;
    float B = dot(rs, ray.dir);
    float C = dot(rs, rs) - (s.r * s.r);
    float D = B * B - C;

    if (D > 0.0)
    {
        float t = -B - sqrt(D);
        if ( (t > 0.0) && (t < isect.t) )
        {
            isect.t = t;
            isect.hit = 1;

            // calculate normal.
            vec3 p = vec3(ray.org.x + ray.dir.x * t,
                          ray.org.y + ray.dir.y * t,
                          ray.org.z + ray.dir.z * t);
            vec3 n = p - s.c;
            n = normalize(n);
            isect.n = n;
            isect.p = p;
            isect.col = s.col;
        }
    }
}

void plane_intersect(Plane pl, Ray ray, inout Intersection isect)
{
    // d = -(p . n)
    // t = -(ray.org . n + d) / (ray.dir . n)
    float d = -dot(pl.p, pl.n);
    float v = dot(ray.dir, pl.n);

    if (abs(v) < 1.0e-6)
        return; // the plane is parallel to the ray.

    float t = -(dot(ray.org, pl.n) + d) / v;

    if ( (t > 0.0) && (t < isect.t) )
    {
        isect.hit = 1;
        isect.t   = t;
        isect.n   = pl.n;

        vec3 p = vec3(ray.org.x + t * ray.dir.x,
                      ray.org.y + t * ray.dir.y,
                      ray.org.z + t * ray.dir.z);
        isect.p = p;
        float offset = 0.2;
        vec3 dp = p + offset;
        if ((mod(dp.x, 1.0) > 0.5 && mod(dp.z, 1.0) > 0.5)
        ||  (mod(dp.x, 1.0) < 0.5 && mod(dp.z, 1.0) < 0.5))
            isect.col = pl.col;
        else
            isect.col = pl.col * 0.2;
    }
}

Sphere sphere[3];
Plane plane;
void Intersect(Ray r, inout Intersection i)
{
    for (int c = 0; c < 3; c++)
    {
        shpere_intersect(sphere[c], r, i);
    }
    plane_intersect(plane, r, i);
}

int seed = 0;
float random()
{
    seed = int(mod(float(seed)*1364.0+626.0, 509.0));
    return float(seed)/509.0;
}
vec3 computeLightShadow(in Intersection isect)
{
    int i, j;
    int ntheta = 16;
    int nphi   = 16;
    float eps  = 0.0001;

    // Slightly move ray org towards ray dir to avoid numerical probrem.
    vec3 p = vec3(isect.p.x + eps * isect.n.x,
                  isect.p.y + eps * isect.n.y,
                  isect.p.z + eps * isect.n.z);

    vec3 lightPoint = vec3(5,5,5);
    Ray ray;
    ray.org = p;
    ray.dir = normalize(lightPoint - p);

    Intersection lisect;
    lisect.hit = 0;
    lisect.t = 1.0e+30;
    lisect.n = lisect.p = lisect.col = vec3(0, 0, 0);
    Intersect(ray, lisect);
    if (lisect.hit != 0)
        return vec3(0.0,0.0,0.0);
    else
    {
        float shade = max(0.0, dot(isect.n, ray.dir));
        shade = pow(shade,3.0) + shade * 0.5;
        return vec3(shade,shade,shade);
    }
    
}

void main()
{
    vec3    org=vec3(0,.0*sin(time*.1)+0.5,0.);
    vec2 pixel = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
    
    // compute ray origin and direction
    float asp = resolution.x / resolution.y;
    vec3 dir = normalize(vec3(asp*pixel.x, pixel.y, -1.5));
    
    sphere[0].c   = vec3(-2.0*sin(time*.5), 0.0, -1.5*cos(time*.5)-3.);
    sphere[0].r   = 0.5;
    sphere[0].col = vec3(1.,0.3,0.3);
    sphere[1].c   = vec3(-0.5*cos(time), 0.05*sin(time*10.)+.05, -3.0*sin(time)-5.);
    sphere[1].r   = 0.5;
    sphere[1].col = vec3(0.3,1,0.3);
    sphere[2].c   = vec3(1.0, 0.0, -2.*sin(time)-3.);
    sphere[2].r   = 0.5;
    sphere[2].col = vec3(0.3,0.3,1);
    plane.p = vec3(0,-0.5, 0);
    plane.n = vec3(0, 1.0, 0);
    plane.col = vec3(1,1, 1);
    seed = int(mod(dir.x * dir.y * 4525434.0, 65536.0));
    
    Ray r;
    r.org = org;
    r.dir = normalize(dir);
    vec4 col = vec4(0,0,0,1);
    float eps  = 0.0001;
    vec3 bcol = vec3(1,1,1);
    for (int j = 0; j < raytraceDepth; j++)
    {
        Intersection i;
        i.hit = 0;
        i.t = 1.0e+30;
        i.n = i.p = i.col = vec3(0, 0, 0);
            
        Intersect(r, i);
        if (i.hit != 0)
        {
            col.rgb += bcol * i.col * computeLightShadow(i);
            bcol *= i.col;
        }
        else
        {
            break;
        }
                
        r.org = vec3(i.p.x + eps * i.n.x,
                     i.p.y + eps * i.n.y,
                     i.p.z + eps * i.n.z);
        r.dir = reflect(r.dir, vec3(i.n.x, i.n.y, i.n.z));
    }
    
    
    gl_FragColor = col;
    gl_FragColor.a =1.0;
}

---
name: Road
type: fragment
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// roadfucks
vec3 road(vec3 pos)
{
    vec3 c1 = vec3(0.1,0.9,0.1);
    vec3 c2 = vec3(0.1,0.6,0.1);
    float a=time;
    float k=sin(.2*a);
    pos.x *= pos.x-=.05*k*k*k*pos.y*pos.y;
    
    
    if(abs(pos.x) < 1.0)
    {
        c1 = vec3(0.9,0.1,0.1);
        c2 = vec3(0.9,0.9,0.9);
    }
    if(abs(pos.x) < .8)     //left and right line
    {
        c1 = vec3(0.5,0.5,0.5);
        c2 = vec3(0.5,0.5,0.5);
    }
    if(abs(pos.x) < 0.002)    //middle lines
    {
        c1 = vec3(0.5,0.5,0.5);
        c2 = vec3(0.9,0.9,0.9);
    }
    
    float t = time * 5.0;  //speed of the tesla car*10
    
    
    float v = pow(sin(0.),20.0);
    
    float rep = fract(pos.y+t);
    float blur =  dot(pos,pos)*0.005;
    vec3 ground = mix(c1,c2,smoothstep(0.25-blur*0.25,0.25+blur*0.25,rep)*smoothstep(0.75+blur*0.25,0.75-blur*0.25,rep));
    
    return ground;
}

vec3 sky(vec2 uv)
{
    return mix(vec3(mouse.x,mouse.y,1.0),vec3(0.1,0.7,1.0),uv.y);
}

vec3 car(vec2 uv)
{
    if (uv.y > -0.3)
        return vec3(0.);
    float carpos = (mouse.x * 2.0) - 1.0;
    if (abs(uv.x-carpos) < 0.15)
    {
        if (abs(carpos) > 0.4)
            return (vec3(1.,0.,0.));
        return vec3(1.);
    }
    return vec3(0.);
}

float insidecar(vec3 col)
{
    if (length(col) == .0)
        return .0;
    return 1.;
}

void main( void ) 
{
    vec2 res = resolution.xy/resolution.y;
    vec2 uv = gl_FragCoord.xy / resolution.y;
    uv -= res/2.0;
    

    vec3 pos = vec3(uv.x/abs(uv.y),1.0/abs(uv.y),step(0.0,uv.y)*2.0-1.0);
    
    vec3 color = vec3(0.0);
    
    color = mix(road(pos),sky(uv),step(.0,pos.z));
    
    vec3 carcolor = car(uv);
    
    //color = mix(color, carcolor, insidecar(carcolor));
//  color = carcolor;
    
    gl_FragColor = vec4(color, 1.0 );

}

---
name: Trippy Dots
type: fragment
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define TWOPI 6.28318530718
#define PI 3.14159265359

//  Groovymap
//  by Jonathan Proxy
//  
//  Rainbow spot spiral distorted using complex conformal mappings

const float _periodX = 6.;
const float _periodY = 7.;

vec2 cmul(const vec2 a, const vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}
vec2 csq(const vec2 v) {
  return vec2(v.x*v.x - v.y*v.y, 2.*v.x*v.y);
}
vec2 cinv(const vec2 v) {
  return vec2(v[0],-v[1]) / dot(v, v);
}
vec2 cln(const vec2 z) {
  return vec2(log(length(z)), atan(z.y, z.x)); // +2k pi
}

vec2 perturbedNewton(in vec2 z) {
  float a=1.2;
  mat2 rot=mat2(cos(a),-sin(a),sin(a),cos(a));  
  for(int i=0; i<1; ++i) {
    z = rot * (2.*z + cinv(csq(z))) / 3.;
  }
  return z;
}

vec2 pentaplexify(const vec2 z) {
  vec2 y = z;
  for(float i=0.; i<TWOPI-0.1; i+=TWOPI/5.) {
    y = cmul(y, z-vec2(cos(i+.1*time), sin(i+.1*time)));
  }
  return y;
}

vec2 infundibularize(in vec2 z) {
  vec2 lnz = cln(z) / TWOPI;
  return vec2(_periodX*(lnz.y) + _periodY*(lnz.x), _periodX*(lnz.x) - _periodY*(lnz.y));
}

vec3 hsv(float h, float s, float v) {
  return v * mix(
    vec3(1.0),
    clamp((abs(fract(h+vec3(3.0, 2.0, 1.0)/3.0)*6.0-3.0)-1.0), 0.0, 1.0), 
    s);
}

vec4 rainbowJam(in vec2 z) {
  vec2 uv = fract(vec2(z[0]/_periodX, z[1]/_periodY))*vec2(_periodX, _periodY);
  vec2 iz = floor(uv);
  vec2 wz = uv - iz;
  return vec4(hsv(pow(iz[0]/_periodX, 1.5),0.9,smoothstep(0.45,0.4,length(wz-vec2(0.5)))), 1.);
}

void main( void ) {
  gl_FragColor = 
    rainbowJam(infundibularize(pentaplexify(perturbedNewton(3.*(2.*gl_FragCoord.xy-resolution.xy) / resolution.y)))
  + 0.4*(mouse.xy-0.5)
  + time * -0.2);
}

---
name: Rainbow Black Hole
type: fragment
---

// bobcat !
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

     
    vec2 p = gl_FragCoord.xy/resolution.xy;
    
    p.x *= resolution.x/resolution.y;
    
        float d =   smoothstep(0.1,1.0,length(p-vec2(1.0 ,0.5)))*5.0+log(p.y/20.0+0.5);
    
     float a =  exp(p.x*0.005)+fract(32.*p.y)/d ;
     
    
     gl_FragColor = vec4((p.y*a)*abs(sin(4.*p.y+time*1.)),
                 (p.y*a)*abs(sin(4.*p.y+time*2.)),
                 (p.y*a)*abs(sin(4.*p.y+time*3.)),1.0);
     

}
