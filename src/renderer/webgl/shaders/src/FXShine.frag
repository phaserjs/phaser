#define SHADER_NAME SHINE_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 resolution;
uniform bool reveal;
uniform float speed;
uniform float time;
uniform float lineWidth;
uniform float gradient;

varying vec2 outTexCoord;

void main ()
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 tex = texture2D(uMainSampler, outTexCoord);

    vec4 col1 = vec4(0.3, 0.0, 0.0, 1.0);
    vec4 col2 = vec4(0.85, 0.85, 0.85, 1.0);

    uv.x = uv.x - mod(time * speed, 2.0) + 0.5;
    float y = uv.x * gradient;

    float s = smoothstep(y - lineWidth, y, uv.y) - smoothstep(y, y + lineWidth, uv.y);

    gl_FragColor = (((s * col1) + (s * col2)) * tex);

    if (!reveal)
    {
        //  Apply the shine effect
        gl_FragColor += tex;
    }
}
