#if (NUM_POINT_LIGHTS > 0) || (NUM_SPOT_LIGHTS > 0) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || defined(USE_PHONG) || defined(USE_PBR) || (NUM_CLIPPING_PLANES > 0)
    v_modelPos = (u_Model * vec4(transformed, 1.0)).xyz;
#endif