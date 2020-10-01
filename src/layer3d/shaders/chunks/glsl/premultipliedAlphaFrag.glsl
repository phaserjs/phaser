#ifdef USE_PREMULTIPLIED_ALPHA
    gl_FragColor.rgb = gl_FragColor.rgb * gl_FragColor.a;
#endif