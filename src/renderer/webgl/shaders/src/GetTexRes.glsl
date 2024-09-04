// Set elsewhere: `#define TEXTURE_COUNT 1`
uniform vec2 uMainResolution[TEXTURE_COUNT];
vec2 getTexRes ()
{
    #if TEXTURE_COUNT == 1
    float texId = 0.0;
    #else
    float texId = outTexDatum;
    #endif
    #pragma phaserTemplate(texIdProcess)

    vec2 texRes = vec2(0.0);

    for (int i = 0; i < TEXTURE_COUNT; i++)
    {
        if (texId == float(i))
        {
            texRes = uMainResolution[i];
            break;
        }
    }

    return texRes;
}
