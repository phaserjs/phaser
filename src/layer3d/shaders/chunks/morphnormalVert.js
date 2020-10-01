module.exports = [
    '#ifdef USE_MORPHNORMALS',
    '',
    '	objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];',
    '	objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];',
    '	objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];',
    '	objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];',
    '',
    '#endif'
].join('\n');
