var game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
});

function preload ()
{
    this.load.atlas('atlas', 'assets/atlas/megaset-1.png', 'assets/atlas/megaset-1.json');
    this.load.image('ship', 'assets/sprites/ship.png');
}

function create ()
{
    let titan = this.add.image(400, 400, 'atlas', 'titan-mech');

    let ship = this.add.image(400, 400, 'atlas', 'ship').setVisible(false);

    // let ship = this.add.image(400, 400, 'ship').setVisible(false);

    titan.mask = new Phaser.Display.Masks.BitmapMask(this, ship);
}
