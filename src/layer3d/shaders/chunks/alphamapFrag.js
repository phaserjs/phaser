module.exports = [
    '#ifdef USE_ALPHA_MAP',
    '',
    '	#ifdef USE_ALPHA_MAP_UV_TRANSFORM',
    '		outColor.a *= texture2D(alphaMap, vAlphaMapUV).g;',
    '	#else',
    '		#if (USE_ALPHA_MAP == 1)',
    '			outColor.a *= texture2D(alphaMap, v_Uv).g;',
    '		#elif (USE_ALPHA_MAP == 2)',
    '            outColor.a *= texture2D(alphaMap, v_Uv2).g;',
    '		#else',
    '            outColor.a *= texture2D(alphaMap, v_Uv).g;',
    '        #endif',
    '	#endif',
    '',
    '#endif'
].join('\n');
