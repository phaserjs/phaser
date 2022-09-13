new Phaser.Game({
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
});

var text, arrow, tween;

function preload ()
{
    this.load.image('arrow', 'assets/sprites/arrow.png');
}

function create ()
{
    text = this.add.text(30, 20, '0', { font: '16px Courier', fill: '#00ff00' });

    this.add.image(700, 300, 'arrow').setAlpha(0.5);
    arrow = this.add.image(100, 300, 'arrow');

    tween = this.tweens.add({
        targets: arrow,
        x: 700,
        ease: 'Linear',
        duration: 1000
    });

    setInterval(() => {

        if (tween.state === 25)
        {
            console.log('pending_remove');
            tween.restart();
            console.log(tween.state);
        }
        else
        {
            tween.restart();
        }

    },
    1000);
}

function update ()
{
    text.setText('Progress : ' + tween.progress + '\nState    : ' + tween.state);
}
