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

var y = 160;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
}

function create ()
{
    this.add.text(400, 32, 'Click to create animations', { color: '#00ff00' }).setOrigin(0.5, 0);

    //  Each time a new animation is added to the Animation Manager we'll call this function
    this.anims.on(Phaser.Animations.Events.ADD_ANIMATION, addAnimation, this);

    var i = 0;

    //  Click to add an animation
    this.input.on('pointerup', function () {

        switch (i)
        {
            case 0:
                this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
                break;

            case 1:
                this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
                break;

            case 2:
                this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
                break;

            case 3:
                this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });
                break;
        }

        i++;

    }, this);
}

function addAnimation (key)
{
    this.add.sprite(400, y, 'gems').play(key);

    y += 100;
}
