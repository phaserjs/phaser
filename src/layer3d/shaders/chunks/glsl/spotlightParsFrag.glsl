struct SpotLight
{
    vec3 position;
    vec4 color;
    float distance;
    float decay;
    float coneCos;
    float penumbraCos;
    vec3 direction;

    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
};
uniform SpotLight u_Spot[NUM_SPOT_LIGHTS];