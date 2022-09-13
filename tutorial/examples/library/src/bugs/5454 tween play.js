new Phaser.Game({
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
});

function preload ()
{
    this.load.image('arrow', 'assets/sprites/arrow.png');
}

function create ()
{
    this.add.image(700, 300, 'arrow').setAlpha(0.5);

    const arrow = this.add.image(100, 300, 'arrow');

    const tween = this.tweens.add({
      targets: arrow,
      x: 600,
      duration: 1000,
      loop: -1
    });

    tween.play();
}
