//  https://www.shadertoy.com/view/MtXfDj

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

// GooFunc - now with technical parameters for you to play with :)
float GooFunc(vec2 uv,float zoom,float distortion, float gooeyness,float wibble)
{
    float s = sin(time*0.1);
    float s2 = 0.5+sin(time*1.8);
    vec2 d = uv*(distortion+s*.3);
    d.x += time*0.25+sin(d.x+d.y + time*0.3)*wibble;
    d.y += time*0.25+sin(d.x + time*0.3)*wibble;
    float v1=length(0.5-fract(d.xy))+gooeyness;
    d = (1.0-zoom)*0.5+(uv*zoom);                   // try removing this :)
    float v2=length(0.5-fract(d.xy));
    v1 *= 1.0-v2*v1;
    v1 = v1*v1*v1;
    v1 *= 1.9+s2*0.2;
    return v1;
}

void mainImage(out vec4 k, vec2 p)
{
    vec2 uv = p.xy / resolution.xy;

    float distortion = 5.0;                     // increase or decrease to suit your taste.
    float zoom = 0.6;                           // zoom value
    float gooeyness = 0.90;                     // smaller = more gooey bits
    float wibble = 0.5;                         // tweak the wibble!
    float goo = GooFunc(uv, zoom, distortion, gooeyness,wibble);
    
    const vec4 col1 = vec4(0.0,.1,.1,1.0);
    const vec4 col2 = vec4(0.5,0.9,0.3,1.0);
    float saturation = 2.4;
    k = mix(col2,col1,goo)*saturation;

    float avg = max(max(k.r,k.g),k.b);      //float avg = k.g;  //(k.r+k.g+k.b)/3.0;
    float alpha=1.0;

    if (avg<=0.4)
    {
        // darken & alpha edge of goo...
        avg = clamp(avg,0.0,1.0);
        k*=avg+0.0;                     // 0.0 = black edges
        alpha = clamp((avg*avg)*15.5,0.0,1.0);
    }
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
