var config = {
    type: Phaser.AUTO,
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
    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
}

function create ()
{
    this.add.text(400, 32, 'Check the console', { color: '#00ff00' }).setOrigin(0.5, 0);

    this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

    this.add.sprite(400, 200, 'gems').play('diamond');
    this.add.sprite(400, 300, 'gems').play('prism');
    this.add.sprite(400, 400, 'gems').play('ruby');
    this.add.sprite(400, 500, 'gems').play('square');

    //  Get a JSON representation of a single animation, or all animations:

    //  You can extract the animation:
    var ruby = this.anims.get('ruby');

    //  Then pass it to JSON.stringify
    console.log(JSON.stringify(ruby));

    //  Or call toJSON directly (this returns an Object)
    console.log(ruby.toJSON());

    //  You can also call 'this.anims.toJSON' and pass it the key of the animation you want:
    console.log(JSON.stringify(this.anims.toJSON('ruby')));

    //  Or dump out ALL animations in the Animation Manager:
    console.log(JSON.stringify(this.anims));
}
