new Phaser.Game({
    scale: {
      mode: Phaser.Scale.FIT,
      width: 800,
      height: 600
    },
    callbacks: {
      postBoot: function (game) {
        console.assert(
          game.scale.scaleMode === Phaser.Scale.FIT,
          "Expected scaleMode %s but got %s",
          Phaser.Scale.FIT,
          game.scale.scaleMode
        );
      }
    }
  });
