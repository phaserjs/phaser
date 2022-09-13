var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var rt;
var trail;
var player;
var tween;

function preload ()
{
    this.load.image('bubble', 'assets/particles/bubble.png');
}

function create ()
{
    rt = this.add.renderTexture(0, 0, 800, 600);

    trail = this.add.image(400, 300, 'bubble').setVisible(false);

    player = this.add.image(400, 300, 'bubble');

    tween = this.tweens.add({
        targets: trail,
        x: player.x,
        y: player.y,
        ease: 'Sine.easeInOut',
        duration: 50000,
        repeat: -1
    });
}

function update ()
{
    player.x = this.input.x;
    player.y = this.input.y;

    var dist = Phaser.Math.Distance.Between(trail.x, trail.y, player.x, player.y);

    tween.timeScale = dist / 100;

    tween.updateTo('x', player.x, true);
    tween.updateTo('y', player.y, true);

    trail.setAlpha(100 / (dist + 0.001));
    trail.setTint(dist | 0xff0000);

    rt.draw(trail);
}
