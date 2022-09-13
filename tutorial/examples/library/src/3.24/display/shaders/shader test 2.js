var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var fragmentShader = `
//@machine_shaman
precision mediump float;



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define FOV 90.
#define imod(n, m) n - (n / m * m)

#define VERTICES 12
#define FACES 20

float iX = .525731112119133606;
float iZ = .850650808352039932;

void icoVertices(out vec3[VERTICES] shape) {
    shape[0] = vec3(-iX,  0.0,    iZ);
    shape[1] = vec3( iX,  0.0,    iZ);
    shape[2] = vec3(-iX,  0.0,   -iZ);
    shape[3] = vec3( iX,  0.0,   -iZ);
    shape[4] = vec3( 0.0,  iZ,    iX);
    shape[5] = vec3( 0.0,  iZ,   -iX);
    shape[6] = vec3( 0.0, -iZ,    iX);
    shape[7] = vec3( 0.0, -iZ,   -iX);
    shape[8] = vec3(  iZ,   iX,  0.0);
    shape[9] = vec3( -iZ,   iX,  0.0);
    shape[10] = vec3(  iZ,  -iX,  0.0);
    shape[11] = vec3( -iZ,  -iX,  0.0);
}

mat2 rotate(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, s, -s, c);
}

float line(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * t);
}

vec3 v[12];
vec2 p[12];

// using define trick to render different triangles
// not possible in loop on glslsandbox
#define tri(a, b, c) min(min(min(d, line(uv, p[a], p[b])), line(uv, p[b], p[c])), line(uv, p[c], p[a]))
    
void main() {
    
    vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
    
    uv.y += .08 * sin(uv.x + time);
    
    uv = floor(uv * 100.) / 100.;
    uv *= 3.;
    
    float t = 0.001 + abs(uv.y);
    float scl = 1. / t;
    vec2 st = uv * scl + vec2(0, scl + time);
    
        
    // setup vertices
    icoVertices(v);
    
    // project
    for (int i = 0; i < 12; i++) {
        v[i].xz *= rotate(time * 0.5);
        float scl = 1.0 / (1. + v[i].z * 0.2);
        float dist = distance(v[i].xyz, vec3(0, 0, -3));
        p[i] = v[i].xy * scl;// - vec2(0, 0);
    }
    
    
    // ico faces
    float d = 1.0;
    d = min(d, tri(0,  4,  1));
    d = min(d, tri(0,  9,  4));
    d = min(d, tri(9,  5,  4));
    d = min(d, tri(4,  5,  8));
    d = min(d, tri(4,  8,  1));
    d = min(d, tri(8,  10, 1));
    d = min(d, tri(8,  3,  10));
    d = min(d, tri(5,  3,  8));
    d = min(d, tri(5,  2,  3));
    d = min(d, tri(2,  7,  3));
    d = min(d, tri(7,  10, 3));
    d = min(d, tri(7,  6,  10));
    d = min(d, tri(7,  11, 6));
    d = min(d, tri(11, 0,  6));
    d = min(d, tri(0,  1,  6));
    d = min(d, tri(6,  1,  10));
    d = min(d, tri(9,  0,  11));
    d = min(d, tri(9,  11, 2));
    d = min(d, tri(9,  2,  5));
    d = min(d, tri(7,  2,  11));

    // color the scene
    vec3 col = vec3(0);
    
    
    col += mix(vec3(0), .5 + .5 * cos(time + st.x + 2. * st.y + vec3(0, 1, 2)), sign(cos(st.x * 10.)) * sign(cos(st.y * 20.))) * t * t;
    //col += smoothstep(0.3, 0., d);
    col *= smoothstep(0.0, 0.1, d);
    col += smoothstep(0.1, 0., d) * (.5 + .5 * cos(time + d * 20. + vec3(33, 66, 99)));
    col += abs(.01 / d);
    
    
    
    // thanks for the dithering effect :)
    col += floor(uv.y - fract(dot(gl_FragCoord.xy, vec2(0.5, 0.75))) * 10.0) * 0.1;

    
        
    gl_FragColor = vec4(col, 1.);

}`;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
    this.load.image('mask', 'assets/tests/camera/grunge-mask.png');
}

function create ()
{
    var maskImage = this.make.image({
        x: 400,
        y: 300,
        key: 'mask',
        add: false
    });

    var mask = maskImage.createBitmapMask();

    this.cameras.main.setMask(mask, false);

    var s = this.add.shader(400, 300, 800, 600, fragmentShader);

    this.add.image(400, 300, 'logo');
}
