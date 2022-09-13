class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
        this.load.image('clown', 'assets/sprites/clown.png');
        this.iter = 3.14;
    }

    create ()
    {
        this.add.image(0, 0, 'CherilPerils').setOrigin(0);

        this.cameras.main.setSize(400, 300);

        const cam2 = this.cameras.add(400, 0, 400, 300);
        const cam3 = this.cameras.add(0, 300, 400, 300);
        const cam4 = this.cameras.add(400, 300, 400, 300);

        this.clown = this.add.image(450 + Math.cos(this.iter) * 200, 510 + Math.sin(this.iter) * 200, 'clown');

        this.cameras.main.startFollow(this.clown);

        cam2.startFollow(this.clown, false, 0.5, 0.5);
        cam3.startFollow(this.clown, false, 0.1, 0.1);
        cam4.startFollow(this.clown, false, 0.05, 0.05);
    }

    update ()
    {
        this.clown.x = 450 + Math.cos(this.iter) * 200;
        this.clown.y = 510 + Math.sin(this.iter) * 200;

        this.iter += 0.02;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
