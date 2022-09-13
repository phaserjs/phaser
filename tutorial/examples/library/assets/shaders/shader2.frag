// Source: http://glslsandbox.com/e#39720.0

//// human readable with fixed lighting - for dorian =)

#ifdef GL_ES
precision mediump float;
#endif



uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying vec2 surfacePosition;



//// SCENE DEFINITIONS
//#define SPHERE
#define DNA
//// END SCENE DEFINITIONS



//// MATH CONSTANTS
#define PI      (4.*atan(1.))       
#define TAU     (1.*atan(1.))       
//// END MATH CONSTANTS 



//// RAY DEFINITIONS
#define ASPECT      resolution.x/resolution.y
#define EPSILON     .005
#define FOV         1.5
#define FARPLANE    8.
#define PHI     .25
#define ITERATIONS  192
//// END RAY DEFINITIONS



////SHADING PARAMETERS
#define OCCLUSION_ITERATIONS 8
#define OCCLUSION_DISTANCE .035
#define SHADOW_ITERATIONS 16
#define SHADOW_DISTANCE 4.
#define SHADOW_PENUMBRA 7.
//// END SHADING PARAMETERS



//// STRUCTS
struct ray
{
    vec3 origin;
    vec3 position;
    vec3 direction;
    vec2 material_range;
    float steps;
}; 
    
struct surface
{
    vec4 color;
    vec3 normal;
    float range;
};  

struct light
{
    vec3 color;
    vec3 position;
    vec3 direction;
    vec3 ambient;
};  

struct material
{
    vec3  color;
    vec3  gloss;
    float refractive_index;
    float roughness;
};  
//// END STRUCTS    


    
//// HACKS
vec3 global_color_hack = vec3(0.);
//// END HACKS
    


//// HEADER 
ray         emit(ray r);
ray         view(in vec2 uv);
vec2        map(in vec3 position);
vec3        derive(in vec3 p);

material    assign_material(in float material_index);
surface     shade(in ray r, in surface s,  in material m, in light l);
float       fresnel(in float i, in float hdl);  
float       geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl);
float       distribution(in float r, in float ndh);
float       ambient_occlusion(vec3 p, vec3 n);
float       shadow(vec3 p, vec3 d);
vec3        hsv(in float h, in float s, in float v);

vec3        sphericalharmonic(vec3 n, in vec4 c[7]);
void        shcdusk(out vec4 c[7]);
void        shcday(out vec4 c[7]);

float       smoothmin(float a, float b, float k);

float       sphere(vec3 position, float radius);
float       cube(vec3 position, vec3 scale);
float       torus( vec3 p, vec2 t );
float       cylinder(vec3 p, float l, float r);
float       kaleidoscopic_tifs(vec3 position, vec3 rotation);

float       smooth(float x);
//float     smoothmin(float a, float b, float k);
float       smoothmax(float a, float b, float k);

mat2        rmat(in float r);
mat3        rmat(in vec3 r);
//// END HEADER


//// SCENES
#ifdef DNA

#define VIEWPOSITION    vec3(0., .0, -3.)
#define VIEWTARGET  vec3(0.95, -.2, 0.)


#define LIGHTPOSITION   vec3(-4., 4., -8.)
#define LIGHTCOLOR  vec3(.95, 0.95,  0.86)
#define AMBIENTDAY

vec2 map(in vec3 position)
{
    position.x      -= cos(position.z+position.y)*.25;
    position.xz         *= rmat(time*.25);
    position.y      += cos(time*.25)+time*.125;
    
    float a         = atan(position.x, position.z)/PI;

    vec3 cp         = position;

    float c = 1e8;
    for(int i = 0; i < 4; i++)
    {
        c = min(c, cylinder(abs(vec3(cp.x, cp.z, mod(cp.y, 1.)-.5)), .5, .025));
        cp.y += .25;
        cp.zx *= rmat(PI/4.);
    }

    position.y      += a;   
    position.y      = mod(position.y, 1.)-.5;
    
    vec3 rotation       = .125*time*vec3(.3, -.17, .257)-time*.125; 
    float k         = kaleidoscopic_tifs(position, rotation);
    
    vec2 material_range     = vec2(0.);
    
    material_range.x    = c < k ? 2. : 3.;
    material_range.y    = min(k, c);
    return material_range;
}
#endif

#ifdef SPHERE
#define VIEWPOSITION    vec3(0., .0, -7.)
#define VIEWTARGET  vec3(0., -.1, 0.)

#define LIGHTPOSITION   vec3(-4., 9., -8.) * vec3(vec2(1.)*rmat(time),1.).xzy
#define LIGHTCOLOR  vec3(.75, 0.65,  0.6)
#define AMBIENTDUSK

vec2 map(in vec3 position)
{
    vec2 material_range     = vec2(0.);
    
    float s         = sphere(position+vec3(0., -.25 + cos(time) * .05, 0.), 2.);
    float c         = cube(position+vec3(0., 2., 0.), vec3(3., .025, 3.));
    
    material_range.x    = s < c ? 1. : 2.;
    material_range.y    = min(c, s);

    return material_range;
}
#endif
//// END SCENES




////MATERIALS
material assign_material(in float material_index)
{
    material_index = floor(material_index);
    
    material m;
    if(material_index == 1.)
    {
        m.color         = vec3(.9, .125, .125);
        m.gloss         = vec3(.75, .75, .7);
        m.refractive_index  = mouse.x;
        m.roughness     = mouse.y;
    }
    else if(material_index == 2.)
    {
        
        m.color         = vec3(1.);
        m.gloss         = vec3(.92);
        m.refractive_index  = .2;
        m.roughness     = .5;   
    }
    else if(material_index == 3.)
    {
        m.color         = global_color_hack * .75 + .25;
        m.gloss         = vec3(.15);
        m.refractive_index  = .2;
        m.roughness     = .1;   
    }
    else
    {
        m.color         = vec3(.5);
        m.gloss         = vec3(.5);
        m.refractive_index  = .5;
        m.roughness     = .5;   
    }
    return m;
}
////




//// MAIN
void main( void ) 
{
    vec2 uv     = gl_FragCoord.xy/resolution.xy;
    ray r       = view(uv);
    
    r       = emit(r);
    
    vec4 result = vec4(0.);
    
    vec4 ambientCoefficients[7];
    
    #ifdef AMBIENTDAY
        shcday(ambientCoefficients);
    #endif
    
    #ifdef AMBIENTDUSK
        shcdusk(ambientCoefficients);
    #endif
    
    if(r.material_range.x != 0. && fract(r.material_range.x) < 1.)
    {       
        surface s   = surface(vec4(0.), vec3(0.), 0.);
        s.color     = result;
        s.range     = distance(r.position, r.origin);
        s.normal    = derive(r.position);

        material m  = assign_material(r.material_range.x);
        
        light l     = light(vec3(0.), vec3(0.), vec3(0.), vec3(0.));
        l.color     = LIGHTCOLOR;   
        l.position  = LIGHTPOSITION;
        l.direction = normalize(l.position-r.position);
        l.ambient   = sphericalharmonic(s.normal, ambientCoefficients);
        
        s       = shade(r, s, m, l);
        
        result      = s.color;
    }
    else
    {
        result.xyz  = sphericalharmonic(r.direction, ambientCoefficients);
        result.w    = 1.;
    }
    

    float rayStepFog = r.steps/float(ITERATIONS);
    result.xyz *= rayStepFog+.5;
    
    result.xyz = pow(result.xyz+result.xyz*.35, vec3(1.25));
    
    gl_FragColor = result;
}// sphinx
//// END MAIN


//// RENDERING
//emit rays to map the scene, stepping along the direction of the ray by the  of the nearest object until it hits or goes to far
ray emit(ray r)
{
    r.material_range    = map(r.position);
    float total_range   = r.material_range.y;
    float threshold     = PHI * 2./float(ITERATIONS);
    
    for(int i = 0; i < ITERATIONS; i++)
    {
        if(total_range < FARPLANE)
        {
            if(r.material_range.y < threshold && r.material_range.y > 0.)
                {
                        r.material_range.x += r.material_range.y;
                        r.material_range.y = total_range;
                        r.steps            = float(i);
                        break;  
                } 
            
            threshold      *= 1.02;
            r.position         += r.direction * r.material_range.y * .8;
            
                r.material_range   = map(r.position);
        
            total_range        += r.material_range.y < 0. ? r.material_range.y + threshold : r.material_range.y;
            }
            else
            {
                r.material_range.y = length(r.origin + r.direction * FARPLANE);
                r.material_range.x = 0.;
                r.steps            = float(i);
                break;
            }
    }
    
    return r;
}

//transform the pixel positions into rays 
ray view(in vec2 uv)
{ 
    uv          = uv * 2. - 1.;
    uv.x            *= resolution.x/resolution.y;
        
    vec3 w          = normalize(VIEWTARGET-VIEWPOSITION);
    vec3 u          = normalize(cross(w,vec3(0.,1.,0.)));
    vec3 v          = normalize(cross(u,w));
    
    ray r           = ray(vec3(0.), vec3(0.), vec3(0.), vec2(0.), 0.);
    r.origin        = VIEWPOSITION;
    r.position      = VIEWPOSITION;
    r.direction     = normalize(uv.x*u + uv.y*v + FOV*w);;
    r.material_range    = vec2(0.);
    r.steps         = 0.;
    
    return r;
}   

//find the normal by comparing offset samples on each axis as a partial derivative
vec3 derive(in vec3 p)
{
    vec2 offset     = vec2(0., EPSILON);

    vec3 normal     = vec3(0.);
    normal.x    = map(p+offset.yxx).y-map(p-offset.yxx).y;
    normal.y    = map(p+offset.xyx).y-map(p-offset.xyx).y;
    normal.z    = map(p+offset.xxy).y-map(p-offset.xxy).y;
    
    return normalize(normal);
}
//// END RENDERING



//// SHADING
surface shade(in ray r, in surface s,  in material m, in light l)
{
    //http://simonstechblog.blogspot.com/2011/12/microfacet-brdf.html
    
    //view and light vectors
    vec3 view_direction = normalize(VIEWPOSITION-VIEWTARGET);       //direction into the view
    vec3 half_direction = normalize(view_direction+l.direction);    //direction halfway between view and light
    
    
    //exposure coefficients
        float light_exposure    = dot(s.normal, l.direction);           //ndl
    float view_exposure = dot(s.normal, view_direction);        //ndv
    
    float half_view     = dot(half_direction, view_direction);      //hdn   
    float half_normal   = dot(half_direction, s.normal);        //hdv
    float half_light    = dot(half_direction, l.direction);     //hdl
    
    
    //lighting coefficient
    float f             = fresnel(m.refractive_index, half_light);
    float g             = geometry(m.roughness, light_exposure, view_exposure, half_normal, half_view, half_light);
    float d             = distribution(m.refractive_index, half_normal);
    float n         = 1. - fresnel(m.refractive_index, light_exposure) * pow(light_exposure, 5.);
    
    //shadow and occlusion projections
    float occlusion     = ambient_occlusion(r.position, s.normal);
    float shadows       = shadow(r.position, l.direction);

    //bidrectional reflective distribution function
    float brdf              = (f*g*d)/(4.*light_exposure+6.*view_exposure);

        float distanceFog       = (max(0., light_exposure) + r.material_range.y)/FARPLANE;
        float stepFog           = r.steps/float(ITERATIONS);

        vec3 ambient_light  = clamp(stepFog/distanceFog * l.ambient, l.color * .125, l.ambient * .5);

    // compositing
    s.color.xyz     = ambient_light + m.color * 2. * brdf * n * l.color;
        s.color.xyz         *= occlusion * shadows * m.color + l.color;
        s.color.xyz     += m.gloss * ambient_light * shadows + brdf;
    s.color.w       = 1.;
    
    return s;
}

float fresnel(in float i, in float hdl)
{   
    return i + (1.33-i) * pow(1.-max(hdl, 0.), 5.);
}

float geometry(in float i, in float ndl, in float ndv, in float hdn, in float hdv, in float hdl)
{
    float k         = i * sqrt(2./PI);
    float ik        = 1. - k;
    ndv         = max(0., ndv);
    ndl         = max(0., ndl);
    return (ndv / (ndv * ik + k)) * (ndl / (ndl * ik + k));
}

float distribution(in float r, in float ndh)
{  
    float m     = 1./(r*r) - 3.;
    return (m+2.) * pow(max(ndh, 0.0), m) / TAU;
}

float ambient_occlusion(vec3 p, vec3 n)
{
    float a       = 1.; 
    const float r = OCCLUSION_DISTANCE;
    float d       = 1.-r/float(OCCLUSION_ITERATIONS);
    for(int i = 0; i < OCCLUSION_ITERATIONS; i++ )
    {
            float hr = r + r * float(i);
            vec3  op = n * hr + p;
            float e  = map(op).y;
            a    += (e-hr) * d;
            d    *= d;
    }
    return max(0., a);
}


float shadow(vec3 p, vec3 d)
{
    //http://glslsandbox.com/e#20224.0 < adapted from here
    float k = SHADOW_PENUMBRA;
    float s = 1.;
        float t = EPSILON;
    float h = 0.0;
    for(int i = 0; i < SHADOW_ITERATIONS; i++) {
        if(t > SHADOW_DISTANCE) continue;
            h = map(p + d * t).y;
        s = min(s, k * h / t);
        t += h;
    }
    return max(0., s);
}

vec3 hsv(in float h, in float s, in float v){
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

vec3 sphericalharmonic(vec3 n, in vec4 c[7])
{     
        vec4 p = vec4(n, 1.);
   
        vec3 l1 = vec3(0.);
        l1.r = dot(c[0], p);
    l1.g = dot(c[1], p);
    l1.b = dot(c[2], p);
    
    vec4 m2 = p.xyzz * p.yzzx;
    vec3 l2 = vec3(0.);
    l2.r = dot(c[3], m2);
    l2.g = dot(c[4], m2);
    l2.b = dot(c[5], m2);
    
    float m3 = p.x*p.x - p.y*p.y;
    vec3 l3 = vec3(0.);
    l3 = c[6].xyz * m3;
        
    vec3 sh = vec3(l1 + l2 + l3);
    
    return clamp(sh, 0., 1.);
}

//sh light coefficients
void shcdusk(out vec4 c[7])
{
    c[0] = vec4(0.2, .77, 0.2, 0.45);
    c[1] = vec4(0.2, .63, 0.2, 0.25);
    c[2] = vec4(0.0, .13, 0.1, 0.15);
    c[3] = vec4(0.1, -.1, 0.1, 0.0);
    c[4] = vec4(0.1,-0.1, 0.1, 0.0);
    c[5] = vec4(0.2, 0.2, 0.2, 0.0);
    c[6] = vec4(0.0, 0.0, 0.0, 0.0);
}


void shcday(out vec4 c[7])
{
    c[0] = vec4(0.0, 0.5, 0.0, 0.4);
    c[1] = vec4(0.0, 0.3, .05, .45);
    c[2] = vec4(0.0, 0.3, -.3, .85);
    c[3] = vec4(0.0, 0.2, 0.1, 0.0);
    c[4] = vec4(0.0, 0.2, 0.1, 0.0);
    c[5] = vec4(0.1, 0.1, 0.1, 0.0);
    c[6] = vec4(0.0, 0.0, 0.0, 0.0);   
}
//// END SHADING



//// CURVES
float smooth(float x)
{
    return x*x*(3.-2.*x);
}

float smoothmax(float a, float b, float k)
{
    return log(exp(k*a)+exp(k*b))/k;
}

float smoothmin(float a, float b, float k)
{
    return -(log(exp(k*-a)+exp(k*-b))/k);
}
//// END CURVES



//// DISTANCE FIELD FUNCTIONS
float sphere(vec3 position, float radius)
{
    return length(position)-radius; 
}

float cube(vec3 p, vec3 s)
{
    vec3 d = (abs(p) - s);
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float torus( vec3 p, vec2 t )
{
    vec2 q = vec2(length(p.xz)-t.x, p.y);
    return length(q)-t.y;
}

float cylinder(vec3 p, float l, float r)
{
   return max(abs(p.y-l)-l, length(p.xz)-r);
}

float kaleidoscopic_tifs(vec3 position, vec3 rotation)
{
    const int iterations    = 8;
    
    float translation   = 1.;
    float dialation     = 1.;
    float radius        = .1;
    float decay     = .5;
    

    float helix         = torus(position, vec2(translation, radius));
    float result        = helix;
    
    float l         = length(position.xz+cos(position.y*2.))*.25;
    vec3 rotation2      = abs(fract(rotation)-.5)*2.;
    rotation2       *= rotation2;
    rotation2       *= 1.-rotation2;
    
    mat3 rot        = rmat(.125*rotation2-rotation);
    rot             *= translation - helix * .025; 

    position.y = abs(fract(position.y*2.5+time*.75-l)-.5)*2.;
    position.y *= 1.-position.y;
    position.y *= position.y;
    
    global_color_hack = vec3(1., 0., 0.);
    for (int i = 0; i < iterations; i++) 
    {
        position        = abs(position)-radius*helix;
        dialation       *= translation;
        
            position        *= rot + cos(time+position.y*2.)*.0125;
        
        radius          *= decay * abs(result-helix);
        
        float t         = torus(position*.9, vec2(translation, radius));
        
        vec3 new_color      = hsv(float(8-i)/float(iterations), 1., 1.);
        new_color       = mix(new_color, global_color_hack, abs(t-helix));
        global_color_hack   = t < result ? new_color : global_color_hack;
        
        result          = smoothmin(t, result, 20. - 2. * helix - l);
        }

    return result;
}
//// END DISTANCE FIELD FUNCTIONS



//// ROTATION MATRICES
mat2 rmat(in float r)
{
    float c = cos(r);
    float s = sin(r);
    return mat2(c, s, -s, c);
}

//3d rotation matrix
mat3 rmat(in vec3 r)
{
    vec3 a = vec3(cos(r.x)*cos(r.y),sin(r.y),sin(r.x)*cos(r.y));
    
    float c = cos(r.z);
    float s = sin(r.z);
    vec3 as  = a*s;
    vec3 ac  = a*a*(1.1- c);
    vec3 ad  = a.yzx*a.zxy*(1.-c);
    mat3 rot = mat3(
        c    + ac.x, 
        ad.z - as.z, 
            ad.y + as.y,
        ad.z + as.z, 
        c    + ac.y, 
        ad.x - as.x,
        ad.y - as.y, 
        ad.x + as.x, 
        c    + ac.z);
    return rot; 
}
//// END ROTATION MATRICES
