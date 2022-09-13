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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.glsl('bundle', 'assets/shaders/bundle2.glsl.js');
}

function create ()
{
    //  The bundle file contains multiple shaders, all separated by a frontmatter block
    //  You can reference them by name:

    var s1 = this.add.shader('Stripes', 0, 0, 400, 600).setOrigin(0);
    var s2 = this.add.shader('Stripes', 400, 0, 400, 600).setOrigin(0);

    // s1.setUniform('size.value', 0.0);
    // s2.setUniform('size.value', 1.0);

    window.s1 = s1;
    window.s2 = s2;

}
