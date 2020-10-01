float specularStrength;

#ifdef USE_SPECULARMAP

	vec4 texelSpecular = texture2D( specularMap, v_Uv );
	specularStrength = texelSpecular.r;

#else

	specularStrength = 1.0;

#endif