class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/skies/space4.png');
        this.load.image('star', 'assets/sprites/star.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        this.text = this.add.text(30, 20, '0', { font: '16px Courier', fill: '#00ff00' });

        this.add.image(700, 300, 'star').setAlpha(0.25);

        var star = this.add.image(100, 300, 'star');

        this.tween = this.tweens.add({
            targets: star,
            x: 700,
            ease: 'Linear',
            duration: 5000,
            persist: true
        });

        this.input.on('pointerdown', () => {
            this.tween.restart();
        });
    }

    update ()
    {
        if (this.tween.isPlaying())
        {
            this.text.setText([
                'Click to restart',
                'Progress: ' + this.tween.progress
            ]);
        }
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
