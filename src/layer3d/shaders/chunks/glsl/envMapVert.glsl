#ifdef USE_ENV_MAP
    #if defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP)
        v_worldPos = (u_Model * vec4(transformed, 1.0)).xyz;
    #else
        v_EnvPos = reflect(normalize((u_Model * vec4(transformed, 1.0)).xyz - u_CameraPosition), (transposeMat4(inverseMat4(u_Model)) * vec4(objectNormal, 1.0)).xyz);
    #endif
#endif