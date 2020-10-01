// Per-Pixel Tangent Space Normal Mapping
// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html
mat3 tsn(vec3 N, vec3 V, vec2 uv) {
    // Workaround for Adreno/Nexus5 not able able to do dFdx( Vec3 ) ...
    vec3 q0 = vec3(dFdx(V.x), dFdx(V.y), dFdx(V.z));
    vec3 q1 = vec3(dFdy(V.x), dFdy(V.y), dFdy(V.z));
    vec2 st0 = dFdx( uv.st );
    vec2 st1 = dFdy( uv.st );

    float scale = sign( st1.t * st0.s - st0.t * st1.s );

    vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
    vec3 T = normalize( ( -q0 * st1.s + q1 * st0.s ) * scale );
    // vec3 N = normalize( N );

    mat3 tsn = mat3( S, T, N );
    return tsn;
}