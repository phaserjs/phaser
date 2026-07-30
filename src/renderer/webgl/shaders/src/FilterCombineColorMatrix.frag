// COMBINE_COLOR_MATRIX

#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;
uniform sampler2D uTransferSampler;
uniform float uColorMatrixSelf[20];
uniform float uColorMatrixTransfer[20];
uniform float uAlphaSelf;
uniform float uAlphaTransfer;
uniform vec4 uAdditions;
uniform vec4 uMultiplications;

varying vec2 outTexCoord;

#define S uColorMatrixSelf
#define T uColorMatrixTransfer

void main ()
{
    vec4 self = texture2D(uMainSampler, outTexCoord);

    if (uAlphaSelf == 0.0)
    {
        // Return just the input.
        gl_FragColor = self;

        return;
    }

    if (self.a > 0.0)
    {
        // Unpremultiply.
        self.rgb /= self.a;
    }

    vec4 resultSelf;

    resultSelf.r = (S[0] * self.r) + (S[1] * self.g) + (S[2] * self.b) + (S[3] * self.a) + S[4];
    resultSelf.g = (S[5] * self.r) + (S[6] * self.g) + (S[7] * self.b) + (S[8] * self.a) + S[9];
    resultSelf.b = (S[10] * self.r) + (S[11] * self.g) + (S[12] * self.b) + (S[13] * self.a) + S[14];
    resultSelf.a = (S[15] * self.r) + (S[16] * self.g) + (S[17] * self.b) + (S[18] * self.a) + S[19];

    if (uAlphaTransfer == 0.0)
    {
        // Return just the self matrix result.

        // Premultiply.
        self.rgb *= self.a;
        resultSelf.rgb *= resultSelf.a;
        gl_FragColor = mix(self, resultSelf, uAlphaSelf);

        return;
    }

    vec4 tex = texture2D(uTransferSampler, outTexCoord);

    if (tex.a > 0.0)
    {
        // Unpremultiply.
        tex.rgb /= tex.a;
    }

    vec4 resultTransfer;

    resultTransfer.r = (T[0] * tex.r) + (T[1] * tex.g) + (T[2] * tex.b) + (T[3] * tex.a) + T[4];
    resultTransfer.g = (T[5] * tex.r) + (T[6] * tex.g) + (T[7] * tex.b) + (T[8] * tex.a) + T[9];
    resultTransfer.b = (T[10] * tex.r) + (T[11] * tex.g) + (T[12] * tex.b) + (T[13] * tex.a) + T[14];
    resultTransfer.a = (T[15] * tex.r) + (T[16] * tex.g) + (T[17] * tex.b) + (T[18] * tex.a) + T[19];

    // Add and multiply the two results as desired for each channel.
    vec4 combo = (resultSelf + resultTransfer) * uAdditions + (resultSelf * resultTransfer) * uMultiplications;

    // Premultiply.
    self.rgb *= self.a;
    resultSelf.rgb *= resultSelf.a;
    combo.rgb *= combo.a;

    gl_FragColor = mix(self, mix(resultSelf, combo, uAlphaTransfer), uAlphaSelf);
}
