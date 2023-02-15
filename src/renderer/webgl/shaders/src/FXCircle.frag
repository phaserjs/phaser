#define SHADER_NAME CIRCLE_FS

precision mediump float;

uniform sampler2D uMainSampler;

uniform vec2 resolution;
uniform vec3 color;
uniform vec4 backgroundColor;
uniform float width;

// uniform float radius;
// uniform vec2 position;
// uniform vec4 borderColor;
// uniform float borderThickness;

varying vec2 outTexCoord;

float circle (in vec2 _st, in float _radius)
{
    vec2 dist = _st - vec2(0.5);

	return 1.0 - smoothstep(_radius - (_radius * 0.01), _radius + (_radius * 0.01), dot(dist, dist) * 4.0);
}

void main ()
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);

    float a = min(resolution.x, resolution.y);
	vec2 st = gl_FragCoord.xy / vec2(a, a);

	// vec2 st = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(circle(st, 0.5));

	gl_FragColor = vec4(color, 1.0);



    // float radius = 128.0;

    // vec2 position = vec2(400.0, 300.0);
    // vec4 baseColor = vec4(0.0, 1.0, 0.0, 1.0);
    // vec4 borderColor = vec4(1.0, 0.0, 0.0, 1.0);
    // float borderThickness = 16.0;

    // vec2 tc = vec2(outTexCoord.x - 0.5, outTexCoord.y - 0.5);
    // vec2 uv = gl_FragCoord.xy - position;
    // vec2 uv = tc.xy - position;

    // float d = sqrt(dot(uv, uv));

    // float t1 = 1.0 - smoothstep(radius - borderThickness, radius, d);
    // float t2 = 1.0 - smoothstep(radius, radius + borderThickness, d);

    // gl_FragColor = vec4(mix(color.rgb, baseColor.rgb, t1), t2);






    /*
    vec2 tc = vec2(outTexCoord.x - 0.5, outTexCoord.y - 0.5);

    float grad = length(tc);

    float circle = smoothstep(0.50, 0.49, grad);

    //  0.005 = strength of the ring (0.5 = super soft, 0.05 = gentle, 0.005 = harsh)
    float ring = circle - smoothstep(width, width - 0.005, grad);

    texture = mix(backgroundColor * backgroundColor.a, texture, texture.a);

    texture = (texture * (circle - ring));

    gl_FragColor = vec4(texture.rgb + (ring * color), texture.a);
    */
}
