var CustomPipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:
        //https://github.com/mattdesl/lwjgl-basics/wiki/ShaderLesson5
        function CustomPipeline(game) {
            Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
                game: game,
                renderer: game.renderer,
                fragShader: [
                    "precision mediump float;",

                    //"in" attributes from our vertex shader
                    "varying vec4 outColor;",
                    "varying vec2 outTexCoord;",

                    //declare uniforms
                    "uniform sampler2D u_texture;",
                    "uniform float resolution;",
                    "uniform float radius;",
                    "uniform vec2 dir;",

                    "void main() {",
                    //this will be our RGBA sum
                    "vec4 sum = vec4(0.0);",

                    //our original texcoord for this fragment
                    "vec2 tc = outTexCoord;",

                    //the amount to blur, i.e. how far off center to sample from 
                    //1.0 -> blur by one pixel
                    //2.0 -> blur by two pixels, etc.
                    "float blur = radius/resolution;",

                    //the direction of our blur
                    //(1.0, 0.0) -> x-axis blur
                    //(0.0, 1.0) -> y-axis blur
                    "float hstep = dir.x;",
                    "float vstep = dir.y;",

                    //apply blurring, using a 9-tap filter with predefined gaussian weights",

                    "sum += texture2D(u_texture, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;",
                    "sum += texture2D(u_texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;",
                    "sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;",
                    "sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;",

                    "sum += texture2D(u_texture, vec2(tc.x, tc.y)) * 0.2270270270;",

                    "sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;",
                    "sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;",
                    "sum += texture2D(u_texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;",
                    "sum += texture2D(u_texture, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;",

                    //discard alpha for our simple demo,return
                    "gl_FragColor =  vec4(sum.rgb, 1.0);",
                    "}"

                ].join('\n')
            });
        }

});

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var time = 0;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('volcano', 'assets/pics/bw-face.png');
    this.load.image('hotdog', 'assets/sprites/hotdog.png');

    customPipeline = game.renderer.addPipeline('Custom', new CustomPipeline(game));
    customPipeline.setFloat1('resolution', game.config.width);
    customPipeline.setFloat1('radius', 1.0);
    customPipeline.setFloat2('dir', 1.0, 1.0);
}

function create() {
    var volcano = this.add.image(400, 300, 'volcano').setAlpha(0.5);
    var hotdog = this.add.image(400, 300, 'hotdog').setScrollFactor(0);

    this.cameras.main.setRenderToTexture(customPipeline);

    var extracam = this.cameras.add();

    this.cameras.main.ignore(hotdog);
    extracam.ignore(volcano);
}

function update() {
    var r = Math.abs(2 * Math.sin(this.time.now * 10));
    customPipeline.setFloat1('radius', r);
}
