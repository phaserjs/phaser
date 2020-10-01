#ifdef USE_UV
    v_Uv = (uvTransform * vec3(a_Uv, 1.)).xy;
#endif

#ifdef USE_UV2
    v_Uv2 = a_Uv2;
#endif

#ifdef USE_ALPHA_MAP_UV_TRANSFORM
    #if (USE_ALPHA_MAP == 1)
        vAlphaMapUV = (alphaMapUVTransform * vec3(a_Uv, 1.)).xy;
    #elif (USE_ALPHA_MAP == 2)
        vAlphaMapUV = (alphaMapUVTransform * vec3(a_Uv2, 1.)).xy;
    #else
        vAlphaMapUV = (alphaMapUVTransform * vec3(a_Uv, 1.)).xy;
    #endif
#endif 