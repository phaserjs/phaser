---
name: Stripes
type: fragment
author: Richard Davey
uniform.size: { "type": "1f", "value": 16.0 }
---

precision mediump float;

uniform float size;
uniform vec2 resolution;

varying vec2 fragCoord;

void main(void)
{
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 white = vec3(1.0, 1.0, 1.0);
    bool color = (mod((fragCoord.y / resolution.y) * size, 1.0) > 0.5);

    if (!color)
    {
        gl_FragColor = vec4(white, 1.0);
    }
}

---
name: HSL
type: fragment
author: Per Bloksgaard
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;


// Created by Per Bloksgaard/2014

#define PI 3.14159265358979

// Convert HSL colorspace to RGB. http://en.wikipedia.org/wiki/HSL_and_HSV
vec3 HSLtoRGB(in vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
    return c.z+c.y*(rgb-0.5)*(1.-abs(2.*c.z-1.));
}

vec3 HSL2RGB_CubicSmooth(in vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
    rgb = rgb*rgb*(3.0-2.0*rgb); // iq's cubic smoothing.
    return c.z+ c.y*(rgb-0.5)*(1.-abs(2.*c.z-1.));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (-1.+2.*fragCoord.xy/resolution.xy)*vec2(resolution.x/resolution.y,1.);
    float fAngle = time*0.4;
    float h = atan(uv.x,uv.y) - fAngle;
    float x = length(uv);
    float a = -(0.6+0.2*sin(time*3.1+sin((time*0.8+h*2.0)*3.0))*sin(time+h));
    float b = -(0.8+0.3*sin(time*1.7+sin((time+h*4.0))));
    float c = 1.25+sin((time+sin((time+h)*3.0))*1.3)*0.15;
    float l = a*x*x + b*x + c;
    //vec3 hsl_standard = HSLtoRGB(vec3(h*3./PI,1.,l));
    vec3 hsl_cubic = HSL2RGB_CubicSmooth(vec3(h*3.0/PI,1.,l));
    //  dot product = distance from black (set as the alpha)
    // fragColor = vec4(hsl_cubic, dot(black, hsl_cubic));
    fragColor = vec4(hsl_cubic, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);

    // vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

    if (gl_FragColor.x == 0.0 && gl_FragColor.y == 0.0 && gl_FragColor.z == 0.0)
    {
        gl_FragColor.a = 0.0;
    }

    // gl_FragColor.a = dot(black, gl_FragColor);
}

---
name: Marble
type: fragment
author: klk (https://www.shadertoy.com/view/XsVSzW)
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy / resolution.xx-0.5)*8.0;
    vec2 uv0=uv;
    float i0=1.0;
    float i1=1.0;
    float i2=1.0;
    float i4=0.0;
    for(int s=0;s<7;s++)
    {
        vec2 r;
        r=vec2(cos(uv.y*i0-i4+time/i1),sin(uv.x*i0-i4+time/i1))/i2;
        r+=vec2(-r.y,r.x)*0.3;
        uv.xy+=r;

        i0*=1.93;
        i1*=1.15;
        i2*=1.7;
        i4+=0.05+0.1*time*i1;
    }
    float r=sin(uv.x-time)*0.5+0.5;
    float b=sin(uv.y+time)*0.5+0.5;
    float g=sin((uv.x+uv.y+sin(time*0.5))*0.5)*0.5+0.5;
    fragColor = vec4(r,g,b,1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

---
name: Flower Plasma
type: fragment
author: epsilum (https://www.shadertoy.com/view/Xdf3zH)
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

float addFlower(float x, float y, float ax, float ay, float fx, float fy)
{
    float xx=(x+sin(time*fx)*ax)*8.0;
    float yy=(y+cos(time*fy)*ay)*8.0;
    float angle = atan(yy,xx);
    float zz = 1.5*(cos(18.0*angle)*0.5+0.5) / (0.7 * 3.141592) + 1.2*(sin(15.0*angle)*0.5+0.5)/ (0.7 * 3.141592);

    return zz;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 xy=(fragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);

    float x=xy.x;
    float y=xy.y;

    float p1 = addFlower(x, y, 0.8, 0.9, 0.95, 0.85);
    float p2 = addFlower(x, y, 0.7, 0.9, 0.42, 0.71);
    float p3 = addFlower(x, y, 0.5, 1.0, 0.23, 0.97);
    float p4 = addFlower(x, y, 0.8, 0.5, 0.81, 1.91);

    float p=clamp((p1+p2+p3+p4)*0.25, 0.0, 1.0);

    vec4 col;
    if (p < 0.5)
        col=vec4(mix(0.0,1.0,p*2.0), mix(0.0,0.63,p*2.0), 0.0, 1.0);
    else if (p >= 0.5 && p <= 0.75)
        col=vec4(mix(1.0, 1.0-0.32, (p-0.5)*4.0), mix(0.63, 0.0, (p-0.5)*4.0), mix(0.0,0.24,(p-0.5)*4.0), 1.0);
    else
        col=vec4(mix(0.68, 0.0, (p-0.75)*4.0), 0.0, mix(0.24, 0.0, (p-0.75)*4.0), 1.0);

    fragColor = col;
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

---
name: Plasma
type: fragment
author: triggerHLM (https://www.shadertoy.com/view/MdXGDH)
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

const float PI = 3.14159265;

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    float time = time * 0.2;

    float color1, color2, color;

    color1 = (sin(dot(fragCoord.xy,vec2(sin(time*3.0),cos(time*3.0)))*0.02+time*3.0)+1.0)/2.0;

    vec2 center = vec2(640.0/2.0, 360.0/2.0) + vec2(640.0/2.0*sin(-time*3.0),360.0/2.0*cos(-time*3.0));

    color2 = (cos(length(fragCoord.xy - center)*0.03)+1.0)/2.0;

    color = (color1+ color2)/2.0;

    float red   = (cos(PI*color/0.5+time*3.0)+1.0)/2.0;
    float green = (sin(PI*color/0.5+time*3.0)+1.0)/2.0;
    float blue  = (sin(+time*3.0)+1.0)/2.0;

    fragColor = vec4(red, green, blue, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}
