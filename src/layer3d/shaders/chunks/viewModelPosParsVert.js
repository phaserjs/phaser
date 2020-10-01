module.exports = [
    '#if (NUM_POINT_LIGHTS > 0) || (NUM_SPOT_LIGHTS > 0) || defined(USE_NORMAL_MAP) || defined(USE_BUMPMAP) || defined(FLAT_SHADED) || defined(USE_PHONG) || defined(USE_PBR)|| (NUM_CLIPPING_PLANES > 0)',
    '    varying vec3 v_modelPos;',
    '#endif'
].join('\n');
