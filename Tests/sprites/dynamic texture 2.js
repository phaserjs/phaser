/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('slime', 'assets/sprites/slime.png');
        myGame.loader.addImageFile('eyes', 'assets/sprites/slimeeyes.png');
        myGame.loader.load();
    }
    var slime;
    var eyes;
    var wobble;
    function create() {
        myGame.camera.backgroundColor = 'rgb(82,154,206)';
        //  Create our DynamicTexture
        wobble = myGame.createDynamicTexture('wobbly', 48, 100);
        slime = myGame.createSprite(200, 300);
        slime.width = 48;
        slime.height = 100;
        slime.loadDynamicTexture(wobble);
        eyes = myGame.createSprite(210, 326, 'eyes');
        //  Populate the wave with some data
        waveData = myGame.math.sinCosGenerator(32, 8, 8, 2);
    }
    function update() {
        wobble.clear();
        updateWobble();
        slime.velocity.x = 0;
        slime.velocity.y = 0;
        slime.angularVelocity = 0;
        eyes.velocity.x = 0;
        eyes.velocity.y = 0;
        eyes.angularVelocity = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            slime.angularVelocity = -200;
            eyes.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            slime.angularVelocity = 200;
            eyes.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            slime.velocity.copyFrom(myGame.motion.velocityFromAngle(slime.angle, 200));
            eyes.velocity.copyFrom(myGame.motion.velocityFromAngle(slime.angle, 200));
        }
    }
    //  This creates a simple sine-wave effect running through our DynamicTexture.
    //  This is then duplicated across all sprites using it, meaning we only have to calculate it once.
    var waveSize = 8;
    var wavePixelChunk = 2;
    var waveData;
    var waveDataCounter;
    function updateWobble() {
        var s = 0;
        var copyRect = {
            x: 0,
            y: 0,
            w: wavePixelChunk,
            h: 52
        };
        var copyPoint = {
            x: 0,
            y: 0
        };
        for(var x = 0; x < 48; x += wavePixelChunk) {
            copyPoint.x = x;
            copyPoint.y = waveSize + (waveSize / 2) + waveData[s];
            wobble.context.drawImage(myGame.cache.getImage('slime'), copyRect.x, copyRect.y, copyRect.w, copyRect.h, copyPoint.x, copyPoint.y, copyRect.w, copyRect.h);
            copyRect.x += wavePixelChunk;
            s++;
        }
        //	Cycle through the wave data - this is what causes the image to "undulate"
        var t = waveData.shift();
        waveData.push(t);
        waveDataCounter++;
        if(waveDataCounter == waveData.length) {
            waveDataCounter = 0;
        }
    }
})();
