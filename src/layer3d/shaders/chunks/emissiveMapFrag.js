module.exports = [
    '#ifdef USE_EMISSIVEMAP',
    '',
    '	#if (USE_EMISSIVEMAP == 1)',
    '		vec4 emissiveColor = texture2D(emissiveMap, v_Uv);',
    '	#elif (USE_EMISSIVEMAP == 2)',
    '        vec4 emissiveColor = texture2D(emissiveMap, v_Uv2);',
    '    #else',
    '        vec4 emissiveColor = texture2D(emissiveMap, v_Uv);',
    '    #endif',
    '',
    '	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;',
    '',
    '	totalEmissiveRadiance *= emissiveColor.rgb;',
    '',
    '#endif'
].join('\n');
