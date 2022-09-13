var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var container;
var center = {x: 400, y: 300}
var rotateSpeed = 0.02

function preload ()
{
    this.load.spritesheet('diamonds', 'assets/sprites/diamonds32x24x5.png', { frameWidth: 32, frameHeight: 24 });
}

function create ()
{
    this.add.sprite(center.x, center.y, 'diamonds', 1); // center point. We will rotate around it

    container = this.add.container(600, 300);

    text = this.add.text(-25, -50, 'Phaser');

    diamond1 = this.add.sprite(0, 0, 'diamonds', 1);
    diamond1.setScale(2)

    diamond2 = this.add.sprite(15, 0, 'diamonds', 2);
    diamond2.setScale(2)

    diamond3 = this.add.sprite(-15, 0, 'diamonds', 3);
    diamond3.setScale(2)

    container.add([diamond1, diamond2, diamond3, text])

    this.input.on('pointerdown', function() { // stop rotation on click
      if (rotateSpeed > 0) {
          rotateSpeed = 0
      } else {
          rotateSpeed = 0.02
      }
    });

}

function update ()
{
   Phaser.Actions.RotateAroundDistance([container], center, rotateSpeed, 250);
    var angleDeg = Math.atan2(container.y - center.y, container.x - center.x) * 180 / Math.PI;
    console.log(angleDeg)
    container.angle = angleDeg+90 // container should face the center point
}
