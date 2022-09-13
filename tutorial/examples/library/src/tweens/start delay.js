class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('block', 'assets/sprites/block.png');
    }

    create ()
    {
        const image = this.add.image(100, 300, 'block');

        this.text = this.add.text(16, 16, '').setFontSize(16).setColor('#ffffff');

        this.tween = this.tweens.add({
            targets: image,
            x: 700,
            yoyo: true,
            ease: 'Sine.inOut',
            duration: 2000,
            delay: 3000,
            repeat: 1,
            persist: true
        });

        console.log(this.tween);
    }

    update ()
    {
        this.text.setText([
            'progress: ' + this.tween.progress,
            'total progress: ' + this.tween.totalProgress,
            'TD elapsed: ' + this.tween.data[0].elapsed,
            'TD progress: ' + this.tween.data[0].progress
        ]);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
