var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var anims;
var group;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
}

function create ()
{
    this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

    anims = [ 'diamond', 'prism', 'ruby', 'square' ];

    group = this.physics.add.group({ key: 'gems', repeat: 11 });
    group.children.iterate(createGem, this);
}

function update ()
{
    this.physics.world.wrap(group, 32);
}

function createGem (gem)
{
    Phaser.Geom.Rectangle.Random(this.physics.world.bounds, gem);

    gem.play(Phaser.Math.RND.pick(anims));

    gem.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
}
