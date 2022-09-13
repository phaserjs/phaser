
class Demo extends Phaser.Scene {
    constructor() {
     super()
    }
    create() {
        this.input.on('pointerdown', () => {
          this.addCircle()
        })
      this.add.text(400, 300, 'Click anywhere')
          .setOrigin(0.5,0.5)
    }
  addCircle(){
    let pointer = this.input.activePointer;
    let circle = this.add.circle(pointer.worldX, pointer.worldY, 5, 0x6666ff).setAlpha(0.7);
    this.add.tween({targets:circle,duration:1000,scale:4,alpha:0, onComplete:()=>{circle.destroy()}})
  }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: Demo
};

var game = new Phaser.Game(config);