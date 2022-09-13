var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-example',
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image("1x1", "https://upload.wikimedia.org/wikipedia/commons/7/7f/Red_1x1.gif");
  this.load.image("20x20", "https://upload.wikimedia.org/wikipedia/commons/c/c1/20x20square.png");
}

function create() {

  const oneNoScale = this.matter.add.image(200, 300, "1x1");

  oneNoScale.setScale(1);
  
  const oneScale = this.matter.add.image(300, 300, "1x1");

  oneScale.setScale(40);
  
  const largerScale = this.matter.add.image(400, 300, "20x20");

  largerScale.setScale(2);
}
