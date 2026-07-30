// BLOCKY_FS
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 resolution;
uniform vec4 uSizeAndOffset;

varying vec2 outTexCoord;

void main()
{
    // Sample from the center of a grid cell, starting at the top-left corner,
    // with size uSizeAndOffset.xy and offset uSizeAndOffset.zw.
    vec2 gridCell = floor((outTexCoord * resolution + uSizeAndOffset.zw) / uSizeAndOffset.xy) * uSizeAndOffset.xy - uSizeAndOffset.zw;
    vec2 texCoord = gridCell / resolution;

    gl_FragColor = texture2D(uMainSampler, texCoord);
}
