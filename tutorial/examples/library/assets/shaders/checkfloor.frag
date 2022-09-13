precision mediump float;

uniform float time;
// uniform vec2 resolution;

void main( void ) {
    
    vec2 resolution = vec2(800.0, 600.0);

    vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5,0.5); 
        float horizon = 0.7;
        float fov = 0.6; 
    float scaling = 0.2;
    float t = cos(time) / 6.0;
    
    mat2 rot = mat2(cos(t),sin(t),sin(t),cos(t)); // rot 2d pos ;
    
    pos  *=rot;
    
    vec3 p = vec3(pos.x, fov, pos.y - horizon);      
    vec2 s = vec2(p.x/p.z, p.y/p.z) * scaling;
    
    s.xy *=rot;
    
    float dupa = 4.0;
    float color = 1.0;

    if(pos.y < 1.1)
    
      color = sign((mod(s.x, 0.1) - 0.05) * (mod(s.y + dupa * mod(-time * 0.05, 1.0), 0.1) - 0.05));
    color *= p.z*p.z*14.0;
    
         gl_FragColor = vec4( 0.5-p.y,0.2,0.6, 1.0 );
    
    //fading 2 black 

    vec4 c = vec4(0,0,0,1);
    gl_FragColor = c;

    gl_FragColor += vec4( vec3(color), 1.0 );

}
