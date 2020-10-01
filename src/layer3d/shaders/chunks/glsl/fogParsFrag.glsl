#ifdef USE_FOG

    uniform vec3 u_FogColor;

    #ifdef USE_EXP2_FOG

        uniform float u_FogDensity;

    #else

        uniform float u_FogNear;
        uniform float u_FogFar;
    #endif

#endif