#ifdef USE_UV
    attribute vec2 a_Uv;
    varying vec2 v_Uv;
    uniform mat3 uvTransform;
#endif

#ifdef USE_UV2
    attribute vec2 a_Uv2;
    varying vec2 v_Uv2;
#endif

#ifdef USE_ALPHA_MAP_UV_TRANSFORM
    varying vec2 vAlphaMapUV;
    uniform mat3 alphaMapUVTransform;
#endif 
