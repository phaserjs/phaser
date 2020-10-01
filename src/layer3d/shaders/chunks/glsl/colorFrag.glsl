#ifdef USE_VCOLOR_RGB
    outColor.rgb *= v_Color;
#endif
#ifdef USE_VCOLOR_RGBA
    outColor *= v_Color;
#endif