#ifdef USE_DIFFUSE_MAP
    #if (USE_DIFFUSE_MAP == 1)
        vec4 texelColor = texture2D( diffuseMap, v_Uv );
    #elif (USE_DIFFUSE_MAP == 2)
        vec4 texelColor = texture2D( diffuseMap, v_Uv2 );
    #else 
        vec4 texelColor = texture2D( diffuseMap, v_Uv );
    #endif
    
    texelColor = mapTexelToLinear( texelColor );

    outColor *= texelColor;
#endif