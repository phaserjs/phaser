const game = new Phaser.Game({
    parent: "phaser-example",
    width: 800,
    height: 600,
    scene: {
      create: create,
    }
  })

  function create() {
    const rect1 = this.add.rectangle(400, 300, 800, 600, 0xff0000).setInteractive();
    const rect2 = this.add.rectangle(400, 300, 200, 100, 0x00ff00).setInteractive();

    this.input.setDraggable(rect2);

    rect2.on("drag", function(pointer, dragX, dragY) {
      rect2.x = Phaser.Math.Clamp(dragX, 200, 600);
      rect2.y = Phaser.Math.Clamp(dragY, 100, 400);
    });
  }
