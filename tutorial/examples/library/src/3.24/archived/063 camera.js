
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    //  1080 x 1440
    this.load.image('pic', 'assets/pics/Bounty_Hunter_by_Anathematixs_Desire.png');

}

var d;
var cursors;

function create() {

    d = this.add.image(0, 0, 'pic');

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    // d.angle += 1;

    if (cursors.up.isDown)
    {
        if (cursors.up.shiftKey)
        {
            // d.angle++;
        }
        else
        {
            this.camera.y -= 4;
        }
    }
    else if (cursors.down.isDown)
    {
        if (cursors.down.shiftKey)
        {
            // d.angle--;
        }
        else
        {
            this.camera.y += 4;
        }
    }

    if (cursors.left.isDown)
    {
        if (cursors.left.shiftKey)
        {
            // this.world.rotation -= 0.05;
        }
        else
        {
            this.camera.x -= 4;
        }
    }
    else if (cursors.right.isDown)
    {
        if (cursors.right.shiftKey)
        {
            // game.world.rotation += 0.05;
        }
        else
        {
            this.camera.x += 4;
        }
    }

}
