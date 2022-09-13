var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'https://labs.phaser.io/assets/sprites/shinyball.png');
}

function create ()
{
    const text = this.add.text(30, 20, '', { font: '16px Courier', fill: '#00ff00' });
  
    const curve = new Phaser.Curves.Path(100, 100).lineTo(400, 400);
    var graphics = this.add.graphics();
    graphics.lineStyle(1, 0xffffff, 1);
    curve.draw(graphics, 64);
  
    const ball = this.add.follower(curve, 100, 100, 'ball');

    this.input.on('pointerdown', () => {

        ball.startFollow({
            duration: 77,
            onComplete: function(tween, targets, param) {
              text.setText([
                'x: ' + ball.x, // Target is x: 400, y: 400
                'y: ' + ball.y,
              ]);
            }
          });

    });


}