var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
}

function create ()
{
    //  Create a stack of random cards

    var frames = this.textures.get('cards').getFrameNames();

    var x = 80;
    var y = 100;

    for (var i = 0; i < 64; i++)
    {
        this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive();

        x += 3;
        y += 6;
    }

    this.input.setTopOnly(false);

    this.input.on('pointerdown', function (pointer, gameObjects) {

        //  gameObjects is an array of ALL GameObjects that were under the pointer
        //  So let's tween them all :)

        if (gameObjects.length > 0)
        {
            this.tweens.add({
                targets: gameObjects,
                x: { value: 1100, duration: 1500, ease: 'Power2' },
                delay: function (target, key, value, targetIndex) {
                    return targetIndex * 100;
                }
            });
        }

    }, this);

}
