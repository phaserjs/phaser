/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    function preload() {
        game.load.image('beast', 'assets/pics/shadow_of_the_beast2_karamoon.png');
        game.load.image('snot', 'assets/pics/nslide_snot.png');
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
        game.load.image('coke', 'assets/sprites/cokecan.png');
        game.load.image('disk', 'assets/sprites/oz_pov_melting_disk.png');
    }

    var group1;
    var group2;
    var coke;
    var disk;

    function create() {
        //  Create a background image
        game.add.sprite(0, 0, 'beast');

        //  Create a Group that will sit above the background image
        group1 = game.add.group(11);

        //  Create a Group that will sit above Group 1
        group2 = game.add.group(11);

        for (var i = 0; i < 10; i++) {
            //var tempSprite: Phaser.Sprite = group1.addNewSprite(game.stage.randomX, game.stage.randomY, 'atari1');
            //var tempSprite: Phaser.Sprite = new Phaser.Sprite(game, game.stage.randomX, game.stage.randomY, 'atari1');
            var tempSprite = game.add.sprite(game.stage.randomX, game.stage.randomY, 'atari1');

            tempSprite.name = 'atari' + i;
            tempSprite.input.start(i, false, true);
            tempSprite.input.enableDrag(false, true);

            group1.add(tempSprite);

            //  Sonics
            //var tempSprite: Phaser.Sprite = group2.addNewSprite(game.stage.randomX, game.stage.randomY, 'sonic');
            //var tempSprite: Phaser.Sprite = new Phaser.Sprite(game, game.stage.randomX, game.stage.randomY, 'sonic');
            var tempSprite = game.add.sprite(game.stage.randomX, game.stage.randomY, 'sonic');

            tempSprite.name = 'sonic' + i;
            tempSprite.input.start(10 + i, false, true);
            tempSprite.input.enableDrag(false, true);

            group2.add(tempSprite);
        }

        //  Add 2 control sprites into each group - these cannot be dragged but should be bought to the top each time
        coke = group1.addNewSprite(100, 100, 'coke');
        disk = group2.addNewSprite(400, 300, 'disk');

        //  Create a foreground image - everything should appear behind this, even when dragged
        var snot = game.add.sprite(game.stage.centerX, game.stage.height, 'snot');
        snot.origin.setTo(0.5, 1);
        //  You can click and drag any sprite but Sonic sprites should always appear above the Atari sprites
        //  and both types of sprite should only ever appear above the background and behind the
    }

    function update() {
        if (game.input.keyboard.justReleased(Phaser.Keyboard.ONE)) {
            coke.bringToTop();
        }

        if (game.input.keyboard.justReleased(Phaser.Keyboard.TWO)) {
            disk.bringToTop();
        }
    }

    function render() {
        Phaser.DebugUtils.renderInputInfo(32, 32);
    }
})();
