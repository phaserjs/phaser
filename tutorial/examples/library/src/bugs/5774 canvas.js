/* global colors, Phaser */

class Example extends Phaser.Scene {
  init() {
    const { pixelArt, roundPixels } = this.game.config;
    console.info("pixelArt", pixelArt);
    console.info("roundPixels", roundPixels);
    console.assert(
      pixelArt === false,
      "pixelArt should be true not %s",
      pixelArt
    );
    console.assert(
      roundPixels === true,
      "roundPixels should be true not %s",
      roundPixels
    );
  }

  preload() {
    this.load.image("pic", "assets/pics/baal-loader.png");
    this.load.image("spaceman", "assets/sprites/exocet_spaceman.png");
    this.load.spritesheet("spritesheet", "assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    const img1 = this.add.image(0, 0, "pic").setOrigin(0, 0);
    const img2 = this.add.image(0, 0, "spaceman").setOrigin(0, 0);
    const img3 = this.add.image(0, 0, "spritesheet", 4).setOrigin(0, 0);

    console.log(this.cameras.main);

    this.tweens.add({
      targets: [img1, img2, img3],
      props: { x: 1, y: 1 },
      repeat: -1,
      yoyo: true
    });
  }
}

const config = {
  type: Phaser.CANVAS,
  roundPixels: true,
  scene: [Example]
};

new Phaser.Game(config);
