#ifdef USE_SHADOW

    #if NUM_DIR_SHADOWS > 0

        uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHTS ];
        varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];

        #ifdef USE_PCSS_SOFT_SHADOW

            uniform sampler2D directionalDepthMap[ NUM_DIR_LIGHTS ];

        #endif

    #endif

    #if NUM_POINT_SHADOWS > 0

        uniform samplerCube pointShadowMap[ NUM_POINT_LIGHTS ];

    #endif

    #if NUM_SPOT_SHADOWS > 0

        uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHTS ];
        varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];

        #ifdef USE_PCSS_SOFT_SHADOW

            uniform sampler2D spotDepthMap[ NUM_SPOT_LIGHTS ];

        #endif

    #endif

    #include <packing>
    #include <shadow>

#endif