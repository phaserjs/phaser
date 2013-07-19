/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {
        game.load.spritesheet('shadow', 'assets/tests/tween/shadow.png', 80, 15);
        game.load.spritesheet('PHASER', 'assets/tests/tween/PHASER.png', 70, 90);
        game.load.spritesheet('ribbon', 'assets/tests/tween/ribbon.png', 731, 49);
        game.load.start();
    }
    function create() {
        var ribbon = game.add.sprite(-1000, 256, 'ribbon');
        ribbon.transform.scale.setTo(1.2, 1.0);
        // Add ribbon appear animation.
        var tween = game.add.tween(ribbon)
            .to({x: -218}, 2400, Phaser.Easing.Elastic.Out, true, 0, false);

        // Add characters and give them a delay so they'll appear after the
        // ribbon already there.
        var item;
        var letterGroup = game.add.group();
        for (var i = 0; i < 6; i++) {
            item = game.add.sprite(80 + 69 * i, -100, 'PHASER', i);
            letterGroup.add(item);
            // Set origin to the center to make the rotation look better.
            item.transform.origin.setTo(0.5, 0.5);
            // Add a simple bounce tween to each character's position.
            tween = game.add.tween(item)
                .to({y: 240}, 2000, Phaser.Easing.Bounce.Out, true, 1600 + 400 * i, false);
        }

        // Move the ribbon out after the last letter landded.
        // Instead of using delay, we can use the callback of tweens.
        tween.onComplete.add(function() {
            tween = game.add.tween(ribbon)
                .to({x: -1000}, 1600, Phaser.Easing.Elastic.In, true, 500, false);
            // Again add falling animations to the letter after ribbon disappeared.
            tween.onComplete.add(function() {
                var index = 5;
                letterGroup.forEach(function(item) {
                    game.add.tween(item)
                        .to({y: 640}, 1000, Phaser.Easing.Circular.In, true, index * 100, false);
                    game.add.tween(item)
                        .to({rotation: 720}, 1600, Phaser.Easing.Cubic.Out, true, 200 + index * 300, false);
                    index--;
                });
            });
        });

        // Set background color to white.
        game.stage.backgroundColor = '#fff';
    }
})();
