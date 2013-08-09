/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update);

    function preload() {
        game.load.image('ball', 'assets/sprites/shinyball.png');
    }

    var wobblyBall;

    function create() {
        //  Create our DynamicTexture
        wobblyBall = game.add.dynamicTexture(32, 64);

        for (var i = 0; i < 100; i++) {
            var temp = game.add.sprite(game.world.randomX, game.world.randomY);
            temp.texture.loadDynamicTexture(wobblyBall);
        }

        //  Populate the wave with some data
        waveData = game.math.sinCosGenerator(32, 8, 8, 2);
    }

    function update() {
        wobblyBall.clear();

        updateWobblyBall();
    }

    //  This creates a simple sine-wave effect running through our DynamicTexture.
    //  This is then duplicated across all sprites using it, meaning we only have to calculate it once.
    var waveSize = 8;
    var wavePixelChunk = 2;
    var waveData;
    var waveDataCounter;

    function updateWobblyBall() {
        var s = 0;
        var copyRect = { x: 0, y: 0, w: wavePixelChunk, h: 32 };
        var copyPoint = { x: 0, y: 0 };

        for (var x = 0; x < 32; x += wavePixelChunk) {
            copyPoint.x = x;
            copyPoint.y = waveSize + (waveSize / 2) + waveData[s];

            wobblyBall.context.drawImage(game.cache.getImage('ball'), copyRect.x, copyRect.y, copyRect.w, copyRect.h, copyPoint.x, copyPoint.y, copyRect.w, copyRect.h);

            copyRect.x += wavePixelChunk;

            s++;
        }

        //	Cycle through the wave data - this is what causes the image to "undulate"
        var t = waveData.shift();
        waveData.push(t);

        waveDataCounter++;

        if (waveDataCounter == waveData.length) {
            waveDataCounter = 0;
        }
    }
})();
