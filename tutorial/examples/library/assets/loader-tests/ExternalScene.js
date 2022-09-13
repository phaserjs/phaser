class ExternalScene extends Phaser.Scene {

    constructor ()
    {
        super('myScene');
    }

    preload ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    }

    create ()
    {
        this.face = this.add.image(400, 300, 'face');
        this.arrow = this.add.sprite(400, 300, 'arrow').setOrigin(0, 0.5);
    }

    update ()
    {
        this.arrow.rotation += 0.01;
    }

}
