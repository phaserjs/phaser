var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('ball', 'assets/sprites/pangball.png');
}

function create() {
  const containerScale = 2;
  var container1 = this.add.container(0,0);
  var container2 = this.add.container(0,0);
  container1.setScale(containerScale)
  container1.add(container2)

  //    Change container position
  container2.x = 100;
  
  var ball = this.add.image(0, 0, "ball");
  ball.setOrigin(0,0)
  container2.add(ball);
  
  var containerWidth = container2.getBounds().width /containerScale;
  
  this.add.text(10, 200, 'Original sprite width: '+ ball.width , { fontFamily: 'Arial', fontSize: 40, color: '#00ff00' });
  this.add.text(10, 240, 'Container2 width: '+ containerWidth , { fontFamily: 'Arial', fontSize: 40, color: '#00ff00' });
}
