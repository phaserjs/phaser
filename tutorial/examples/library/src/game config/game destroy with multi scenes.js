class Background extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'background', active: true });
    }

    preload ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    }

    create ()
    {
        this.face = this.add.image(400, 300, 'face');

        this.arrow = this.add.image(300, 300, 'arrow').setOrigin(0, 0.5);

        this.input.on('pointerdown', function () {

            this.sys.game.destroy(true);

            document.addEventListener('mousedown', function newGame () {

                game = new Phaser.Game(config);

                document.removeEventListener('mousedown', newGame);

            });

        }, this);
    }

    update (time, delta)
    {
        this.arrow.rotation += 0.01;

    }
}

class Demo extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'demo', active: true });
    }

    preload ()
    {
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    }

    create ()
    {
        this.arrow = this.add.image(400, 300, 'arrow').setOrigin(0, 0.5);
    }

    update ()
    {
        this.arrow.rotation += 0.01;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Background, Demo ]
};

let game = new Phaser.Game(config);
