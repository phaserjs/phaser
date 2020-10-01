#ifdef USE_AMBIENT_LIGHT
    #include <ambientlight_pars_frag>
#endif
#if NUM_DIR_LIGHTS > 0
    #include <directlight_pars_frag>
#endif
#if NUM_POINT_LIGHTS > 0
    #include <pointlight_pars_frag>
#endif
#if NUM_SPOT_LIGHTS > 0
    #include <spotlight_pars_frag>
#endif

#if defined(USE_PBR) && defined(USE_ENV_MAP)

    vec3 getLightProbeIndirectIrradiance(const in int maxMIPLevel, const in vec3 envDir) {
        // TODO: replace with properly filtered cubemaps and access the irradiance LOD level, be it the last LOD level
    	// of a specular cubemap, or just the default level of a specially created irradiance cubemap.

    	#ifdef TEXTURE_LOD_EXT

    		vec4 envMapColor = textureCubeLodEXT( envMap, envDir, float( maxMIPLevel ) );

    	#else

    		// force the bias high to get the last LOD level as it is the most blurred.
    		vec4 envMapColor = textureCube( envMap, envDir, float( maxMIPLevel ) );

    	#endif

        envMapColor = envMapTexelToLinear( envMapColor );

        return PI * envMapColor.rgb * u_EnvMap_Intensity;
    }

    // taken from here: http://casual-effects.blogspot.ca/2011/08/plausible-environment-lighting-in-two.html
    float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {

    	//float envMapWidth = pow( 2.0, maxMIPLevelScalar );
    	//float desiredMIPLevel = log2( envMapWidth * sqrt( 3.0 ) ) - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );

    	float maxMIPLevelScalar = float( maxMIPLevel );
    	float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );

    	// clamp to allowable LOD ranges.
    	return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );

    }

    vec3 getLightProbeIndirectRadiance(const in float blinnShininessExponent, const in int maxMIPLevel, const in vec3 envDir) {
        float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );

        #ifdef TEXTURE_LOD_EXT

    		vec4 envMapColor = textureCubeLodEXT( envMap, envDir, specularMIPLevel );

    	#else

    		vec4 envMapColor = textureCube( envMap, envDir, specularMIPLevel );

    	#endif

        envMapColor = envMapTexelToLinear( envMapColor );

        return envMapColor.rgb * u_EnvMap_Intensity;
    }

    // ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
    float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {

    	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );

    }

#endif