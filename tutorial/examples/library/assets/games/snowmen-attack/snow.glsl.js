//  https://www.shadertoy.com/view/XlSBz1

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

#define iTime time
#define iResolution resolution
#define localTime (iTime / 2.)

#define p_to_pc(p)  vec2( atan((p).y, (p).x), length(p) )
#define pc_to_p(pc) pc.y * vec2( cos(pc.x), sin(pc.x) )

vec2 fieldA(vec2 pc){
    pc.y += .02 * floor( 5. * cos(pc.x * 6. ));
    pc.y += .01 * floor(10. * cos(pc.x * 30.));
    pc.y += .5  * cos(pc.y * 10.);
    return pc;
}

vec2 fieldB(vec2 pc, float f){
    pc.y += .1 * cos(pc.y * 100. + 10.);
    pc.y += .1 * cos(pc.y *  20. + f  );
    pc.y += .04* cos(pc.y *  10. + 10.); 
    return pc;
} 

float snow_flake(vec2 p, float f){
    vec2 pc = p_to_pc(p * 10.); 
    pc = fieldA(fieldB(pc, f));
    return float( length(pc.y) < .3) ;
}

float snow(vec2 p){
    p.y += 2. * localTime;
    p = fract(p + .5) - .5;
    p.x += .01 * cos( dot(p,vec2(3)) + localTime * 6.28);
    
    return snow_flake(p, 1.)
         + snow_flake(p + vec2( .2,-.1), 4.)
         + snow_flake(p + vec2(-.2, .4), 9.)
         + snow_flake(p*2. + vec2(-.4, -.5), 5.)
         + 2.0 * snow_flake(p * 1. + vec2(.4, -.4), 5.)
         + snow_flake(p + vec2(-1.2, 1.2), 9.)
         + snow_flake(p + vec2( 2.4,-1.2), 5.)
         + snow_flake(p + vec2(-1.2, 1.1), 9.);

}

void mainImage(out vec4 col, in vec2 fragCoord){
    
    vec2 p = fragCoord / iResolution.x - .5;
    
    col = vec4(.2, .4, .7, 1.)
          + .3 * snow(p * 2.)
          + .2 * snow(p * 4. + vec2(localTime, 0.0))
          + .1 * snow(p * 8.);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
