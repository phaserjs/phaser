module.exports = [
    '#if NUM_CLIPPING_PLANES > 0',
    '',
    '    vec4 plane;',
    '',
    '    #pragma unroll_loop',
    '    for ( int i = 0; i < NUM_CLIPPING_PLANES; i ++ ) {',
    '',
    '        plane = clippingPlanes[ i ];',
    '        if ( dot( -v_modelPos, plane.xyz ) > plane.w ) discard;',
    '',
    '    }',
    '',
    '#endif'
].join('\n');
