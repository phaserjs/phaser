
#ifdef WEBGL2
    float computeShadow(sampler2DShadow shadowMap, vec3 shadowCoord) {
        return texture2D( shadowMap, shadowCoord );
    }
#else
    float computeShadow(sampler2D shadowMap, vec3 shadowCoord) {
        return step( shadowCoord.z, unpackRGBAToDepth( texture2D( shadowMap, shadowCoord.xy ) ) );
    }
#endif

float computeShadowWithPoissonSampling( sampler2DShadow shadowMap, vec3 shadowCoord, float texelSize ) {
    vec3 poissonDisk[4];
    poissonDisk[0] = vec3(-0.94201624, -0.39906216, 0);
    poissonDisk[1] = vec3(0.94558609, -0.76890725, 0);
    poissonDisk[2] = vec3(-0.094184101, -0.92938870, 0);
    poissonDisk[3] = vec3(0.34495938, 0.29387760, 0);

    return computeShadow( shadowMap, shadowCoord + poissonDisk[0] * texelSize ) * 0.25 +
        computeShadow( shadowMap, shadowCoord + poissonDisk[1] * texelSize ) * 0.25 +
        computeShadow( shadowMap, shadowCoord + poissonDisk[2] * texelSize ) * 0.25 +
        computeShadow( shadowMap, shadowCoord + poissonDisk[3] * texelSize ) * 0.25;
}

// Shadow PCF kernel size 1 with a single tap (lowest quality)
float computeShadowWithPCF1(sampler2DShadow shadowSampler, vec3 shadowCoord) {
    return computeShadow(shadowSampler, shadowCoord);
}

// Shadow PCF kernel 3*3 in only 4 taps (medium quality)
// This uses a well distributed taps to allow a gaussian distribution covering a 3*3 kernel
// https://mynameismjp.wordpress.com/2013/09/10/shadow-maps/
float computeShadowWithPCF3(sampler2DShadow shadowSampler, vec3 shadowCoord, vec2 shadowMapSizeAndInverse) {
    vec2 uv = shadowCoord.xy * shadowMapSizeAndInverse.x;	// uv in texel units
    uv += 0.5;											// offset of half to be in the center of the texel
    vec2 st = fract(uv);								// how far from the center
    vec2 base_uv = floor(uv) - 0.5;						// texel coord
    base_uv *= shadowMapSizeAndInverse.y;				// move back to uv coords

    // Equation resolved to fit in a 3*3 distribution like 
    // 1 2 1
    // 2 4 2 
    // 1 2 1
    vec2 uvw0 = 3. - 2. * st;
    vec2 uvw1 = 1. + 2. * st;
    vec2 u = vec2((2. - st.x) / uvw0.x - 1., st.x / uvw1.x + 1.) * shadowMapSizeAndInverse.y;
    vec2 v = vec2((2. - st.y) / uvw0.y - 1., st.y / uvw1.y + 1.) * shadowMapSizeAndInverse.y;

    float shadow = 0.;
    shadow += uvw0.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[0]), shadowCoord.z));
    shadow += uvw1.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[0]), shadowCoord.z));
    shadow += uvw0.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[1]), shadowCoord.z));
    shadow += uvw1.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[1]), shadowCoord.z));
    shadow = shadow / 16.;

    return shadow;
}

// Shadow PCF kernel 5*5 in only 9 taps (high quality)
// This uses a well distributed taps to allow a gaussian distribution covering a 5*5 kernel
// https://mynameismjp.wordpress.com/2013/09/10/shadow-maps/
float computeShadowWithPCF5(sampler2DShadow shadowSampler, vec3 shadowCoord, vec2 shadowMapSizeAndInverse) {

    vec2 uv = shadowCoord.xy * shadowMapSizeAndInverse.x;	// uv in texel units
    uv += 0.5;											// offset of half to be in the center of the texel
    vec2 st = fract(uv);								// how far from the center
    vec2 base_uv = floor(uv) - 0.5;						// texel coord
    base_uv *= shadowMapSizeAndInverse.y;				// move back to uv coords

    // Equation resolved to fit in a 5*5 distribution like 
    // 1 2 4 2 1
    vec2 uvw0 = 4. - 3. * st;
    vec2 uvw1 = vec2(7.);
    vec2 uvw2 = 1. + 3. * st;

    vec3 u = vec3((3. - 2. * st.x) / uvw0.x - 2., (3. + st.x) / uvw1.x, st.x / uvw2.x + 2.) * shadowMapSizeAndInverse.y;
    vec3 v = vec3((3. - 2. * st.y) / uvw0.y - 2., (3. + st.y) / uvw1.y, st.y / uvw2.y + 2.) * shadowMapSizeAndInverse.y;

    float shadow = 0.;
    shadow += uvw0.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[0]), shadowCoord.z));
    shadow += uvw1.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[0]), shadowCoord.z));
    shadow += uvw2.x * uvw0.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[0]), shadowCoord.z));
    shadow += uvw0.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[1]), shadowCoord.z));
    shadow += uvw1.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[1]), shadowCoord.z));
    shadow += uvw2.x * uvw1.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[1]), shadowCoord.z));
    shadow += uvw0.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[0], v[2]), shadowCoord.z));
    shadow += uvw1.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[1], v[2]), shadowCoord.z));
    shadow += uvw2.x * uvw2.y * computeShadow(shadowSampler, vec3(base_uv.xy + vec2(u[2], v[2]), shadowCoord.z));
    shadow = shadow / 144.;

    return shadow;
}

float getShadow( sampler2DShadow shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {
    shadowCoord.xyz /= shadowCoord.w;

    shadowCoord.z += shadowBias;

    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
    bool inFrustum = all( inFrustumVec );

    bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );

    bool frustumTest = all( frustumTestVec );

    if ( frustumTest ) {
        #ifdef USE_HARD_SHADOW
            return computeShadow(shadowMap, shadowCoord.xyz);
        #else
            #ifdef USE_PCF3_SOFT_SHADOW
                vec2 shadowMapSizeAndInverse = vec2(shadowMapSize.x, 1. / shadowMapSize.x);
                return computeShadowWithPCF3(shadowMap, shadowCoord.xyz, shadowMapSizeAndInverse);
            #else
                #ifdef USE_PCF5_SOFT_SHADOW
                    vec2 shadowMapSizeAndInverse = vec2(shadowMapSize.x, 1. / shadowMapSize.x);
                    return computeShadowWithPCF5(shadowMap, shadowCoord.xyz, shadowMapSizeAndInverse);
                #else
                    float texelSize = shadowRadius / shadowMapSize.x;
                    return computeShadowWithPoissonSampling(shadowMap, shadowCoord.xyz, texelSize);
                #endif
            #endif
        #endif
    }

    return 1.0;

}

float textureCubeCompare( samplerCube depths, vec3 uv, float compare ) {

    return step( compare, unpackRGBAToDepth( textureCube( depths, uv ) ) );

}

float getPointShadow( samplerCube shadowMap, vec3 V, float shadowBias, float shadowRadius, vec2 shadowMapSize, float shadowCameraNear, float shadowCameraFar ) {

    // depth = normalized distance from light to fragment position
    float depth = ( length( V ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?
    depth += shadowBias;

    #ifdef USE_HARD_SHADOW
        return textureCubeCompare( shadowMap, normalize(V), depth);
    #else
        float texelSize = shadowRadius / shadowMapSize.x;

        vec3 poissonDisk[4];
        poissonDisk[0] = vec3(-1.0, 1.0, -1.0);
        poissonDisk[1] = vec3(1.0, -1.0, -1.0);
        poissonDisk[2] = vec3(-1.0, -1.0, -1.0);
        poissonDisk[3] = vec3(1.0, -1.0, 1.0);

        return textureCubeCompare( shadowMap, normalize(V) + poissonDisk[0] * texelSize, depth ) * 0.25 +
            textureCubeCompare( shadowMap, normalize(V) + poissonDisk[1] * texelSize, depth ) * 0.25 +
            textureCubeCompare( shadowMap, normalize(V) + poissonDisk[2] * texelSize, depth ) * 0.25 +
            textureCubeCompare( shadowMap, normalize(V) + poissonDisk[3] * texelSize, depth ) * 0.25;
    #endif
}

#ifdef USE_PCSS_SOFT_SHADOW

    const vec3 PoissonSamplers32[64] = vec3[64](
        vec3(0.06407013, 0.05409927, 0.),
        vec3(0.7366577, 0.5789394, 0.),
        vec3(-0.6270542, -0.5320278, 0.),
        vec3(-0.4096107, 0.8411095, 0.),
        vec3(0.6849564, -0.4990818, 0.),
        vec3(-0.874181, -0.04579735, 0.),
        vec3(0.9989998, 0.0009880066, 0.),
        vec3(-0.004920578, -0.9151649, 0.),
        vec3(0.1805763, 0.9747483, 0.),
        vec3(-0.2138451, 0.2635818, 0.),
        vec3(0.109845, 0.3884785, 0.),
        vec3(0.06876755, -0.3581074, 0.),
        vec3(0.374073, -0.7661266, 0.),
        vec3(0.3079132, -0.1216763, 0.),
        vec3(-0.3794335, -0.8271583, 0.),
        vec3(-0.203878, -0.07715034, 0.),
        vec3(0.5912697, 0.1469799, 0.),
        vec3(-0.88069, 0.3031784, 0.),
        vec3(0.5040108, 0.8283722, 0.),
        vec3(-0.5844124, 0.5494877, 0.),
        vec3(0.6017799, -0.1726654, 0.),
        vec3(-0.5554981, 0.1559997, 0.),
        vec3(-0.3016369, -0.3900928, 0.),
        vec3(-0.5550632, -0.1723762, 0.),
        vec3(0.925029, 0.2995041, 0.),
        vec3(-0.2473137, 0.5538505, 0.),
        vec3(0.9183037, -0.2862392, 0.),
        vec3(0.2469421, 0.6718712, 0.),
        vec3(0.3916397, -0.4328209, 0.),
        vec3(-0.03576927, -0.6220032, 0.),
        vec3(-0.04661255, 0.7995201, 0.),
        vec3(0.4402924, 0.3640312, 0.),

        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.),
        vec3(0., 0., 0.)
    );

    const vec3 PoissonSamplers64[64] = vec3[64](
        vec3(-0.613392, 0.617481, 0.),
        vec3(0.170019, -0.040254, 0.),
        vec3(-0.299417, 0.791925, 0.),
        vec3(0.645680, 0.493210, 0.),
        vec3(-0.651784, 0.717887, 0.),
        vec3(0.421003, 0.027070, 0.),
        vec3(-0.817194, -0.271096, 0.),
        vec3(-0.705374, -0.668203, 0.),
        vec3(0.977050, -0.108615, 0.),
        vec3(0.063326, 0.142369, 0.),
        vec3(0.203528, 0.214331, 0.),
        vec3(-0.667531, 0.326090, 0.),
        vec3(-0.098422, -0.295755, 0.),
        vec3(-0.885922, 0.215369, 0.),
        vec3(0.566637, 0.605213, 0.),
        vec3(0.039766, -0.396100, 0.),
        vec3(0.751946, 0.453352, 0.),
        vec3(0.078707, -0.715323, 0.),
        vec3(-0.075838, -0.529344, 0.),
        vec3(0.724479, -0.580798, 0.),
        vec3(0.222999, -0.215125, 0.),
        vec3(-0.467574, -0.405438, 0.),
        vec3(-0.248268, -0.814753, 0.),
        vec3(0.354411, -0.887570, 0.),
        vec3(0.175817, 0.382366, 0.),
        vec3(0.487472, -0.063082, 0.),
        vec3(-0.084078, 0.898312, 0.),
        vec3(0.488876, -0.783441, 0.),
        vec3(0.470016, 0.217933, 0.),
        vec3(-0.696890, -0.549791, 0.),
        vec3(-0.149693, 0.605762, 0.),
        vec3(0.034211, 0.979980, 0.),
        vec3(0.503098, -0.308878, 0.),
        vec3(-0.016205, -0.872921, 0.),
        vec3(0.385784, -0.393902, 0.),
        vec3(-0.146886, -0.859249, 0.),
        vec3(0.643361, 0.164098, 0.),
        vec3(0.634388, -0.049471, 0.),
        vec3(-0.688894, 0.007843, 0.),
        vec3(0.464034, -0.188818, 0.),
        vec3(-0.440840, 0.137486, 0.),
        vec3(0.364483, 0.511704, 0.),
        vec3(0.034028, 0.325968, 0.),
        vec3(0.099094, -0.308023, 0.),
        vec3(0.693960, -0.366253, 0.),
        vec3(0.678884, -0.204688, 0.),
        vec3(0.001801, 0.780328, 0.),
        vec3(0.145177, -0.898984, 0.),
        vec3(0.062655, -0.611866, 0.),
        vec3(0.315226, -0.604297, 0.),
        vec3(-0.780145, 0.486251, 0.),
        vec3(-0.371868, 0.882138, 0.),
        vec3(0.200476, 0.494430, 0.),
        vec3(-0.494552, -0.711051, 0.),
        vec3(0.612476, 0.705252, 0.),
        vec3(-0.578845, -0.768792, 0.),
        vec3(-0.772454, -0.090976, 0.),
        vec3(0.504440, 0.372295, 0.),
        vec3(0.155736, 0.065157, 0.),
        vec3(0.391522, 0.849605, 0.),
        vec3(-0.620106, -0.328104, 0.),
        vec3(0.789239, -0.419965, 0.),
        vec3(-0.545396, 0.538133, 0.),
        vec3(-0.178564, -0.596057, 0.)
    );

    // https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
    float getRand(vec2 seed) {
        return fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    // PCSS
    // This helps to achieve a contact hardening effect on the shadow
    // It uses 16 Taps for search and a 32 PCF taps in a randomly rotating poisson sampling disc.
    // This is heavily inspired from http://developer.download.nvidia.com/shaderlibrary/docs/shadow_PCSS.pdf
    // and http://developer.download.nvidia.com/whitepapers/2008/PCSS_Integration.pdf
    float computeShadowWithPCSS(sampler2D depthSampler, sampler2DShadow shadowSampler, vec3 shadowCoord, float shadowMapSizeInverse, float lightSizeUV, int searchTapCount, int pcfTapCount, vec3[64] poissonSamplers) {
        float depthMetric = shadowCoord.z;

        float blockerDepth = 0.0;
        float sumBlockerDepth = 0.0;
        float numBlocker = 0.0;
        for (int i = 0; i < searchTapCount; i ++) {
            blockerDepth = unpackRGBAToDepth( texture( depthSampler, shadowCoord.xy + (lightSizeUV * shadowMapSizeInverse * PoissonSamplers32[i].xy) ) );
            if (blockerDepth < depthMetric) {
                sumBlockerDepth += blockerDepth;
                numBlocker++;
            }
        }

        if (numBlocker < 1.0) {
            return 1.0;
        }
        float avgBlockerDepth = sumBlockerDepth / numBlocker;

        // Offset preventing aliasing on contact.
        float AAOffset = shadowMapSizeInverse * 10.;
        // Do not dividing by z despite being physically incorrect looks better due to the limited kernel size.
        // float penumbraRatio = (depthMetric - avgBlockerDepth) / avgBlockerDepth;
        float penumbraRatio = ((depthMetric - avgBlockerDepth) + AAOffset);
        float filterRadius = penumbraRatio * lightSizeUV * shadowMapSizeInverse;

        float random = getRand(shadowCoord.xy);//getRand(vPositionFromLight.xy);
        float rotationAngle = random * 3.1415926;
        vec2 rotationVector = vec2(cos(rotationAngle), sin(rotationAngle));

        float shadow = 0.;
        for (int i = 0; i < pcfTapCount; i++) {
            vec3 offset = poissonSamplers[i];
            // Rotated offset.
            offset = vec3(offset.x * rotationVector.x - offset.y * rotationVector.y, offset.y * rotationVector.x + offset.x * rotationVector.y, 0.);
            shadow += texture(shadowSampler, shadowCoord + offset * filterRadius);
        }
        shadow /= float(pcfTapCount);

        // Blocker distance falloff
        shadow = mix(shadow, 1., depthMetric - avgBlockerDepth);

        return shadow;
    }

    float getShadowWithPCSS( sampler2D depthSampler, sampler2DShadow shadowMap, vec4 shadowCoord, float shadowBias, float shadowRadius, vec2 shadowMapSize ) {

        shadowCoord.xyz /= shadowCoord.w;

        shadowCoord.z += shadowBias;

        bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
        bool inFrustum = all( inFrustumVec );

        bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );

        bool frustumTest = all( frustumTestVec );

        if ( frustumTest ) {
            #ifdef USE_PCSS16_SOFT_SHADOW
                return computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 16, 16, PoissonSamplers32);
            #else
                #ifdef USE_PCSS32_SOFT_SHADOW
                    return computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 16, 32, PoissonSamplers32);
                #else
                    return computeShadowWithPCSS(depthSampler, shadowMap, shadowCoord.xyz, 1. / shadowMapSize.x, 0.1 * shadowMapSize.x, 32, 64, PoissonSamplers64);
                #endif
            #endif
        }

        return 1.0;

    }

#endif