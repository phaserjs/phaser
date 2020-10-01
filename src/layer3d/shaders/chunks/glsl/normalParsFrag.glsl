#ifndef FLAT_SHADED
    varying vec3 v_Normal;
    #ifdef USE_TANGENT
        varying vec3 v_Tangent;
		varying vec3 v_Bitangent;
    #endif
#endif