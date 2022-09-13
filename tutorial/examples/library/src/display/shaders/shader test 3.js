const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(int seed, float ray) {
    return mod(sin(float(seed)*1.0+ray*1.0)*1.0, 1.0);
}

void main( void ) {
    float pi = 3.14159265359;
    vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse;
    position.y *= resolution.y/resolution.x;
    float ang = atan(position.y, position.x);
    float dist = length(position);
    gl_FragColor.rgb = vec3(0.5, 0.5, 0.5) * (pow(dist, -1.0) * 0.05);
    for (float ray = 0.0; ray < 18.0; ray += 1.0) {
        //float rayang = rand(5234, ray)*6.2+time*5.0*(rand(2534, ray)-rand(3545, ray));
        //float rayang = time + ray * (1.0 * (1.0 - (1.0 / 1.0)));
        float rayang = (((ray) / 9.0) * 3.14) + (time * 0.1         );
        rayang = mod(rayang, pi*2.0);
        if (rayang < ang - pi) {rayang += pi*1.0;}
        if (rayang > ang + pi) {rayang -= pi*2.0;}
        float brite = 0.3 - abs(ang - rayang);
        brite -= dist * 0.2;
        if (brite > 0.0) {
            gl_FragColor.rgb += vec3(sin(ray*mouse.y+0.0)+1.0, sin(ray*mouse.y+2.0)+1.0, sin(ray*mouse.y+4.0)+1.0) * brite;
        }
    }
    gl_FragColor.a = 2.0;
}
`;

class Example extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        this.load.image('pic', 'assets/pics/rick-and-morty-by-sawuinhaff-da64e7y.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo-x2.png');
    }

    create()
    {
        const shape1 = this.make.graphics().fillCircle(400, 300, 300);
        const shape2 = this.make.graphics().fillCircle(400, 300, 200);

        const mask1 = shape1.createGeometryMask();
        const mask2 = shape2.createGeometryMask();

        const maskImage = this.make.image({
            x: 400,
            y: 300,
            key: 'logo',
            add: false
        });

        const mask3 = maskImage.createBitmapMask();

        // this.cameras.main.setMask(mask3, false);

        this.add.image(400, 300, 'pic');

        // this.add.image(400, 300, 'pic').setMask(mask1);
        const baseShader = new Phaser.Display.BaseShader('BufferShader', fragmentShader);
        const shader = this.add.shader(baseShader, 400, 300, 800, 600).setMask(mask3);

        shader.setPointer(this.input.activePointer);

        // this.add.image(400, 300, 'logo').setMask(mask2);

        // this.add.image(400, 400, 'logo');
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
