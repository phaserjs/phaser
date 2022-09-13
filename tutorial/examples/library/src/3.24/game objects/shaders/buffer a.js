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
/*
"Magic particles" by Emmanuel Keller aka Tambako - December 2015
License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Contact: tamby@tambako.ch
*/

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

#define iTime time
#define iResolution resolution

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }
vec4 texture(sampler2D s, vec2 c, float b) { return texture2D(s,c,b); }
vec4 texture(samplerCube s, vec3 c ) { return textureCube(s,c); }
vec4 texture(samplerCube s, vec3 c, float b) { return textureCube(s,c,b); }


#define twopi 6.28319
// Please be careful, setting complexity > 1 may crash your browser!
// 1: for mac computers
// 2: for computers with normal graphic card
// 3: for computers with good graphic cards
// 4: for gaming computers
#define complexity 1

// General particles constants
#if complexity == 1
const int nb_particles = 95;                                  // Number of particles on the screen at the same time. Be CAREFUL with big numbers of particles, 1000 is already a lot!
#elif complexity == 2
const int nb_particles = 160;
#elif complexity == 3
const int nb_particles = 280;
#elif complexity == 4
const int nb_particles = 500;
#endif
const vec2 gen_scale = vec2(0.60, 0.45);                      // To scale the particle positions, not the particles themselves
const vec2 middlepoint = vec2(0.35, 0.15);                    // Offset of the particles

// Particle movement constants
const vec2 gravitation = vec2(-0., -4.5);                     // Gravitation vector
const vec3 main_x_freq = vec3(0.4, 0.66, 0.78);               // 3 frequences (in Hz) of the harmonics of horizontal position of the main particle
const vec3 main_x_amp = vec3(0.8, 0.24, 0.18);                // 3 amplitudes of the harmonics of horizontal position of the main particle
const vec3 main_x_phase = vec3(0., 45., 55.);                 // 3 phases (in degrees) of the harmonics of horizontal position of the main particle
const vec3 main_y_freq = vec3(0.415, 0.61, 0.82);             // 3 frequences (in Hz) of the harmonics of vertical position of the main particle
const vec3 main_y_amp = vec3(0.72, 0.28, 0.15);               // 3 amplitudes of the harmonics of vertical position of the main particle
const vec3 main_y_phase = vec3(90., 120., 10.);               // 3 phases (in degrees) of the harmonics of vertical position of the main particle
const float part_timefact_min = 6.;                           // Specifies the minimum how many times the particle moves slower than the main particle when it's "launched"
const float part_timefact_max = 20.;                          // Specifies the maximum how many times the particle moves slower than the main particle when it's "launched"
const vec2 part_max_mov = vec2(0.28, 0.28);                   // Maxumum movement out of the trajectory in display units / s

// Particle time constants
const float time_factor = 0.75;                               // Time in s factor, <1. for slow motion, >1. for faster movement
const float start_time = 2.5;                                 // Time in s needed until all the nb_particles are "launched"
const float grow_time_factor = 0.15;                          // Time in s particles need to reach their max intensity after they are "launched"
#if complexity == 1
const float part_life_time_min = 0.9;                         // Minimum life time in s of a particle
const float part_life_time_max = 1.9;                         // Maximum life time in s of a particle
#elif complexity == 2
const float part_life_time_min = 1.0;
const float part_life_time_max = 2.5;
#elif complexity == 3
const float part_life_time_min = 1.1;
const float part_life_time_max = 3.2;
#elif complexity == 4
const float part_life_time_min = 1.2;
const float part_life_time_max = 4.0;
#endif

// Particle intensity constants
const float part_int_div = 40000.;                            // Divisor of the particle intensity. Tweak this value to make the particles more or less bright
const float part_int_factor_min = 0.1;                        // Minimum initial intensity of a particle
const float part_int_factor_max = 3.2;                        // Maximum initial intensity of a particle
const float part_spark_min_int = 0.25;                        // Minimum sparkling intensity (factor of initial intensity) of a particle
const float part_spark_max_int = 0.88;                        // Minimum sparkling intensity (factor of initial intensity) of a particle
const float part_spark_min_freq = 2.5;                        // Minimum sparkling frequence in Hz of a particle
const float part_spark_max_freq = 6.0;                        // Maximum sparkling frequence in Hz of a particle
const float part_spark_time_freq_fact = 0.35;                 // Sparkling frequency factor at the end of the life of the particle
const float mp_int = 12.;                                     // Initial intensity of the main particle
const float dist_factor = 3.;                                 // Distance factor applied before calculating the intensity
const float ppow = 2.3;                                      // Exponent of the intensity in function of the distance

// Particle color constants
const float part_min_hue = -0.13;                             // Minimum particle hue shift (spectrum width = 1.)
const float part_max_hue = 0.13;                              // Maximum particle hue shift (spectrum width = 1.)
const float part_min_saturation = 0.5;                        // Minimum particle saturation (0. to 1.)
const float part_max_saturation = 0.9;                        // Maximum particle saturation (0. to 1.)
const float hue_time_factor = 0.035;                          // Time-based hue shift
const float mp_hue = 0.5;                                     // Hue (shift) of the main particle
const float mp_saturation = 0.18;                             // Saturation (delta) of the main particle

// Particle star constants
const vec2 part_starhv_dfac = vec2(9., 0.32);                 // x-y transformation vector of the distance to get the horizontal and vertical star branches
const float part_starhv_ifac = 0.25;                          // Intensity factor of the horizontal and vertical star branches
const vec2 part_stardiag_dfac = vec2(13., 0.61);              // x-y transformation vector of the distance to get the diagonal star branches
const float part_stardiag_ifac = 0.19;                        // Intensity factor of the diagonal star branches

const float mb_factor = 0.73;                                 // Mix factor for the multipass motion blur factor

// Variables
float pst;
float plt;
float runnr;
float time2;
float time3;
float time4;

// From https://www.shadertoy.com/view/ldtGDn
vec3 hsv2rgb (vec3 hsv) { // from HSV to RGB color vector
    hsv.yz = clamp (hsv.yz, 0.0, 1.0);
    return hsv.z*(0.63*hsv.y*(cos(twopi*(hsv.x + vec3(0.0, 2.0/3.0, 1.0/3.0))) - 1.0) + 1.0);
}

// Simple "random" function
float random(float co)
{
    return fract(sin(co*12.989) * 43758.545);
}

// Gets the time at which a paticle is starting its "life"
float getParticleStartTime(int partnr)
{
    return start_time*random(float(partnr*2));
}

// Harmonic calculation, base is a vec4
float harms(vec3 freq, vec3 amp, vec3 phase, float time)
{
   float val = 0.;
   for (int h=0; h<3; h++)
      val+= amp[h]*cos(time*freq[h]*twopi + phase[h]/360.*twopi);
   return (1. + val)/2.;
}

// Gets the position of a particle in function of its number and the time
vec2 getParticlePosition(int partnr)
{  
   // Particle "local" time, when a particle is "reborn" its time starts with 0.0
   float part_timefact = mix(part_timefact_min, part_timefact_max, random(float(partnr*2 + 94) + runnr*1.5));
   float ptime = (runnr*plt + pst)*(-1./part_timefact + 1.) + time2/part_timefact;   
   vec2 ppos = vec2(harms(main_x_freq, main_x_amp, main_x_phase, ptime), harms(main_y_freq, main_y_amp, main_y_phase, ptime)) + middlepoint;
   
   // Particles randomly get away the main particle's orbit, in a linear fashion
   vec2 delta_pos = part_max_mov*(vec2(random(float(partnr*3-23) + runnr*4.), random(float(partnr*7+632) - runnr*2.5))-0.5)*(time3 - pst);
   
   // Calculation of the effect of the gravitation on the particles
   vec2 grav_pos = gravitation*pow(time4, 2.)/250.;
   return (ppos + delta_pos + grav_pos)*gen_scale;
}

// Gets the position of the main particle in function of the time
vec2 getParticlePosition_mp()
{
   vec2 ppos = vec2(harms(main_x_freq, main_x_amp, main_x_phase, time2), harms(main_y_freq, main_y_amp, main_y_phase, time2)) + middlepoint;
   return gen_scale*ppos;
}

// Gets the rgb color of a particle in function of its intensity and number
vec3 getParticleColor(int partnr, float pint)
{
   float hue;
   float saturation;

   saturation = mix(part_min_saturation, part_max_saturation, random(float(partnr*6 + 44) + runnr*3.3))*0.45/pint;
   hue = mix(part_min_hue, part_max_hue, random(float(partnr + 124) + runnr*1.5)) + hue_time_factor*time2;
    
   return hsv2rgb(vec3(hue, saturation, pint));
}

// Gets the rgb color the main particle in function of its intensity
vec3 getParticleColor_mp( float pint)
{
   float hue;
   float saturation;
   
   saturation = 0.75/pow(pint, 2.5) + mp_saturation;
   hue = hue_time_factor*time2 + mp_hue;

   return hsv2rgb(vec3(hue, saturation, pint));
}

// Main function to draw particles, outputs the rgb color.
vec3 drawParticles(vec2 uv, float timedelta)
{   
    // Here the time is "stetched" with the time factor, so that you can make a slow motion effect for example
    time2 = time_factor*(iTime + timedelta);
    vec3 pcol = vec3(0.);
    // Main particles loop
    for (int i=1; i<nb_particles; i++)
    {
        pst = getParticleStartTime(i); // Particle start time
        plt = mix(part_life_time_min, part_life_time_max, random(float(i*2-35))); // Particle life time
        time4 = mod(time2 - pst, plt);
        time3 = time4 + pst;
       // if (time2>pst) // Doesn't draw the paricle at the start
        //{    
           runnr = floor((time2 - pst)/plt);  // Number of the "life" of a particle
           vec2 ppos = getParticlePosition(i);
           float dist = distance(uv, ppos);
           //if (dist<0.05) // When the current point is further than a certain distance, its impact is neglectable
           //{
              // Draws the eight-branched star
              // Horizontal and vertical branches
              vec2 uvppos = uv - ppos;
              float distv = distance(uvppos*part_starhv_dfac + ppos, ppos);
              float disth = distance(uvppos*part_starhv_dfac.yx + ppos, ppos);
              // Diagonal branches
              vec2 uvpposd = 0.707*vec2(dot(uvppos, vec2(1., 1.)), dot(uvppos, vec2(1., -1.)));
              float distd1 = distance(uvpposd*part_stardiag_dfac + ppos, ppos);
              float distd2 = distance(uvpposd*part_stardiag_dfac.yx + ppos, ppos);
              // Initial intensity (random)
              float pint0 = mix(part_int_factor_min, part_int_factor_max, random(runnr*4. + float(i-55)));
              // Middle point intensity star inensity
              float pint1 = 1./(dist*dist_factor + 0.015) + part_starhv_ifac/(disth*dist_factor + 0.01) + part_starhv_ifac/(distv*dist_factor + 0.01) + part_stardiag_ifac/(distd1*dist_factor + 0.01) + part_stardiag_ifac/(distd2*dist_factor + 0.01);
              // One neglects the intentity smaller than a certain threshold
              //if (pint0*pint1>16.)
              //{
                 // Intensity curve and fading over time
                 float pint = pint0*(pow(pint1, ppow)/part_int_div)*(-time4/plt + 1.);
                
                 // Initial growing of the paricle's intensity
                 pint*= smoothstep(0., grow_time_factor*plt, time4);
                 // "Sparkling" of the particles
                 float sparkfreq = clamp(part_spark_time_freq_fact*time4, 0., 1.)*part_spark_min_freq + random(float(i*5 + 72) - runnr*1.8)*(part_spark_max_freq - part_spark_min_freq);
                 pint*= mix(part_spark_min_int, part_spark_max_int, random(float(i*7 - 621) - runnr*12.))*sin(sparkfreq*twopi*time2)/2. + 1.;

                 // Adds the current intensity to the global intensity
                 pcol+= getParticleColor(i, pint);
              //}
           //}
        //}
    }
    
    // Main particle
    vec2 ppos = getParticlePosition_mp();
    float dist = distance(uv, ppos);

        // Draws the eight-branched star
        // Horizontal and vertical branches
        vec2 uvppos = uv - ppos;
        float distv = distance(uvppos*part_starhv_dfac + ppos, ppos);
        float disth = distance(uvppos*part_starhv_dfac.yx + ppos, ppos);
        // Diagonal branches
        vec2 uvpposd = 0.7071*vec2(dot(uvppos, vec2(1., 1.)), dot(uvppos, vec2(1., -1.)));
        float distd1 = distance(uvpposd*part_stardiag_dfac + ppos, ppos);
        float distd2 = distance(uvpposd*part_stardiag_dfac.yx + ppos, ppos);
        // Middle point intensity star inensity
        float pint1 = 1./(dist*dist_factor + 0.015) + part_starhv_ifac/(disth*dist_factor + 0.01) + part_starhv_ifac/(distv*dist_factor + 0.01) + part_stardiag_ifac/(distd1*dist_factor + 0.01) + part_stardiag_ifac/(distd2*dist_factor + 0.01);
        
        if (part_int_factor_max*pint1>6.)
        {
            float pint = part_int_factor_max*(pow(pint1, ppow)/part_int_div)*mp_int;
            pcol+= getParticleColor_mp(pint);
        }

    return pcol;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xx;
    
    // Multipass motion blur
    vec2 uv2 = fragCoord.xy / iResolution.xy;
    vec3 pcolor = texture(iChannel0,uv2).rgb*mb_factor;
    
    // Background gradient
    //vec3 pcolor = vec3(0., (0.6 - uv.y)/10., (1. - uv.y)/9.);
    //vec3 pcolor = texture(iChannel0,uv).rgb*0.4;
    
    pcolor+= drawParticles(uv,0.)*0.9;
       
    // We're done!
    fragColor = vec4(pcolor, 0.);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
    `;

    //  Create our BaseShader object using the fragment source above (and the default vertex source):

    const baseShader1 = new Phaser.Display.BaseShader('BufferA', s1);

    var s2 = `
precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

#define iTime time
#define iResolution resolution

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }
vec4 texture(sampler2D s, vec2 c, float b) { return texture2D(s,c,b); }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / resolution.xy;
    fragColor = texture(iChannel0,uv);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
    `;

    const baseShader2 = new Phaser.Display.BaseShader('BufferB', s2);

    var shader1 = this.add.shader(baseShader1, 400, 300, 512, 512);

    shader1.setRenderToTexture('blah');

    var shader2 = this.add.shader(baseShader2, 400, 300, 512, 512);

    shader2.setRenderToTexture('blah2');

    shader1.setSampler2D('iChannel0', 'blah2');
    shader2.setSampler2D('iChannel0', 'blah');

    this.add.image(400, 300, 'blah2');




}
