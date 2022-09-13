class Example extends Phaser.Scene {
    constructor() {
      super();
    }

    preload() {
      this.load.image(
        "elephant", "assets/sprites/elephant.png"
      );
    }

    create() {
      const elephant1 = this.add.sprite(100, 100, "elephant");
      const elephant2 = this.add.sprite(130, 120, "elephant");
      elephant1.depth = 2;
      elephant1.setInteractive({
        pixelPerfect: false,
        useHandCursor: true
      });
      elephant2.depth = 3;
      elephant2.setInteractive({
        pixelPerfect: false,
        useHandCursor: true
      });
      elephant1.on('pointerdown', function (){
        alert("elephant 1");
      });
      elephant2.on('pointerdown', function (){
        alert("elephant 2");
      });

      const layer = this.add.layer();

      // remove the line below and the alerts work as expected
      layer.add([elephant1, elephant2]);
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#2d2d2d",
    parent: "phaser-example",
    scene: Example
  };

  const game = new Phaser.Game(config);
