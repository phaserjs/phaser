#ifdef ALPHATEST

	if ( outColor.a < ALPHATEST ) {
		discard;
	} else {
		// Prevent alpha test edge gradient
		outColor.a = u_Opacity;
	}

#endif