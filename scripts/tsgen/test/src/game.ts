class MyScene extends Phaser.Scene {

    public preload ()
    {
        this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
    }

    public create ()
    {
        let sprite = this.add.sprite(400, 300, 'cards', 'clubs3');

        sprite.setInteractive();

        this.input.on('pointerdown', function () {

            sprite.setFrame('hearts4');

        });
    }

}

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyScene
};

let game = new Phaser.Game(config);
