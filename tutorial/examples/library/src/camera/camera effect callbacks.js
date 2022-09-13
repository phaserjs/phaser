class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
    }

    create ()
    {
        const image = this.add.image(0, 0, 'CherilPerils')
        this.cameras.main.setViewport(5, 5, 390, 290);
        this.camera = this.cameras.add(5, 5, 390, 290);
        this.camera.flash(1000, 1.0, 1.0, 1.0, false, this.flashCallback);
    }

    flashCallback (cam = null, progress = 0)
    {
        if (progress === 1){
            console.log('Flash completed. Starting shake effect.');
            this.camera.shake(1000, 0.05, false, this.shakeCallback);
        }
    }

    shakeCallback (cam = null, progress = 0)
    {
        if (progress === 1){
            console.log('Shake completed. Starting fade effect.');
            this.camera.fade(1000, 0, 0, 0, false, this.fadeCallback);
        }
    }

    fadeCallback (cam = null, progress = 0)
    {
        if(progress === 1){
            console.log('Fade completed. End of example.');
        }
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
