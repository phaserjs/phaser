/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create, update, render);

    var starfield: Phaser.DynamicTexture;

    var xx = [];
    var yy = [];
    var zz = [];
    var xxx = 0;
    var yyy = 0;

    function create() {

        //  the width of the starfield
        var star_w: number = 12000;

        for (var i: number = 0; i < 800; i++)
        {
            xx[i] = Math.floor(Math.random() * star_w * 2) - star_w
            yy[i] = Math.floor(Math.random() * star_w * 2) - star_w
            zz[i] = Math.floor(Math.random() * 160) + 1;
        }

        starfield = myGame.add.dynamicTexture(800, 600);

    }

    function update() {

        starfield.clear();

        for (var i: number = 0; i < 800; i++)
        {
            if (zz[i] == 1) zz[i] = 100;
            xxx = (xx[i]) / (zz[i]);
            yyy = (yy[i]) / (zz[i])--;
            //var x: number = xxx + myGame.input.x;
            //var y: number = yyy + myGame.input.y;
            var x: number = xxx + 400;
            var y: number = yyy + 300;
            var c: string = '#ffffff';

            if (zz[i] > 80) c = '#666666';
            else if (zz[i] > 60) c = '#888888'
            else if (zz[i] > 40) c = '#aaaaaa';

            starfield.setPixel(x, y, c);
        }

    }

    function render() {

        starfield.render();

    }

})();
