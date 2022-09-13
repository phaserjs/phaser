var Demo = {};

Demo.Backdrop = function ()
{
    this.bg;
    this.demosWindow;

    this.eyesIcon;
    this.starsIcon;
    this.copperIcon;
    this.jugglerIcon;
    this.twistIcon;
    this.wavesIcon;

    this.windows = {};
}

Demo.Backdrop.prototype.constructor = Demo.Backdrop;

Demo.Backdrop.prototype = {

    preload: function ()
    {
        this.load.image('bg', 'assets/phaser3/workbench.png');
        this.load.image('demosWindow', 'assets/phaser3/demos-window.png');

        this.load.image('eyesIcon', 'assets/phaser3/eyes-icon.png');
        this.load.image('starsIcon', 'assets/phaser3/stars-icon.png');
        this.load.image('copperIcon', 'assets/phaser3/copper-icon.png');
        this.load.image('jugglerIcon', 'assets/phaser3/juggler-icon.png');
        this.load.image('twistIcon', 'assets/phaser3/twist-icon.png');
        this.load.image('wavesIcon', 'assets/phaser3/waves-icon.png');

        this.load.image('starsWindow', 'assets/phaser3/stars-window.png');
        this.load.image('sineWindow', 'assets/phaser3/sinewave-window.png');
        this.load.image('eyesWindow', 'assets/phaser3/eyes-window.png');
        this.load.image('jugglerWindow', 'assets/phaser3/juggler-window.png');

        this.load.image('particle', 'assets/particles/yellow.png');
    },

    create: function ()
    {
        this.bg = this.add.image(0, 0, 'bg');

        this.demosWindow = this.add.image(900, 70, 'demosWindow');

        this.demosContainer = this.add.container(this, 0, 0);

        this.demosWindow.transform.add(this.demosContainer.transform);

        this.eyesIcon = this.add.image(32, 34, 'eyesIcon', 0, this.demosContainer);
        this.jugglerIcon = this.add.image(64, 110, 'jugglerIcon', 0, this.demosContainer);
        this.starsIcon = this.add.image(230, 40, 'starsIcon', 0, this.demosContainer);
        this.wavesIcon = this.add.image(140, 50, 'wavesIcon', 0, this.demosContainer);

        this.eyesIcon.input = new Phaser.InputHandler(this.eyesIcon);
        this.eyesIcon.input.start(0, true);
        this.eyesIcon.input.onDown.add(this.createWindow, this, 0, 64, 400, 'eyesWindow', Demo.Eyes);

        this.jugglerIcon.input = new Phaser.InputHandler(this.jugglerIcon);
        this.jugglerIcon.input.start(0, true);
        this.jugglerIcon.input.onDown.add(this.createWindow, this, 0, 500, 64, 'jugglerWindow', Demo.Juggler);

        this.starsIcon.input = new Phaser.InputHandler(this.starsIcon);
        this.starsIcon.input.start(0, true);
        this.starsIcon.input.onDown.add(this.createWindow, this, 0, 100, 100, 'starsWindow', Demo.Stars);

        this.wavesIcon.input = new Phaser.InputHandler(this.wavesIcon);
        this.wavesIcon.input.start(0, true);
        this.wavesIcon.input.onDown.add(this.createWindow, this, 0, 300, 200, 'sineWindow', Demo.SineWave);

        this.demosWindow.input = new Phaser.InputHandler(this.demosWindow);
        this.demosWindow.input.start(0, true);
        this.demosWindow.input.enableDrag();

        // this.scene.add('Plasma', Demo.Plasma, true);

    },

    createWindow: function (image, pointer, x, y, handle, func)
    {
        var i = Object.keys(this.windows).length + 1;
        var win = this.add.image(x, y, handle)
        var winName = 'Window' + i;

        win.data.set('handle', winName);

        this.windows[winName] = win;

        win.input = new Phaser.InputHandler(win);
        win.input.start(i, true);
        win.input.enableDrag();
        win.input.onDragUpdate.add(this.onDragUpdate, this);

        this.scene.add(winName, func, true);
    },

    onDragUpdate: function (win)
    {
        var scene = this.scene.getScene(win.data.get('handle'));

        scene.sys.fbo.setPosition(win.x, win.y);
    }

};

Demo.Particles = function ()
{
    this.particles = [];

    this.between = function (min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
}

Demo.Particles.prototype.constructor = Demo.Particles;

Demo.Particles.prototype = {

    create: function ()
    {
        for (var i = 0; i < 500; i++)
        {
            var x = this.between(-64, 1280);
            var y = this.between(-64, 720);

            var image = this.add.image(x, y, 'particle');

            image.blendMode = Phaser.blendModes.ADD;
            // image.blendMode = Phaser.blendModes.MULTIPLY;

            this.particles.push({ s: image, r: 4 + Math.random() * 8 });
        }

        this.sys.fbo.program = this.sys.fbo._twirl;
    },

    update: function ()
    {
        for (var i = 0; i < this.particles.length; i++)
        {
            var particle = this.particles[i].s;

            particle.y -= this.particles[i].r;

            if (particle.y < -256)
            {
                particle.y = 800;
            }
        }
    }

};

Demo.Eyes = function ()
{
    this.left;
    this.right;

    this.leftTarget;
    this.rightTarget;

    this.leftBase;
    this.rightBase;

    this.mid = new Phaser.Point();
}

Demo.Eyes.prototype.constructor = Demo.Eyes;

Demo.Eyes.prototype = {

    preload: function ()
    {
        this.load.image('eye', 'assets/phaser3/eye.png');
    },

    create: function ()
    {
        this.add.image(0, 0, 'eyesWindow');

        this.left = this.add.image(46, 92, 'eye');
        this.left.anchor = 0.5;

        this.right = this.add.image(140, 92, 'eye');
        this.right.anchor = 0.5;

        this.leftTarget = new Phaser.Line(this.left.x, this.left.y, 0, 0);
        this.rightTarget = new Phaser.Line(this.right.x, this.right.y, 0, 0);

        // this.leftBase = new Phaser.Circle(44, 90, 64);
        // this.rightBase = new Phaser.Circle(138, 90, 64);

        this.leftBase = new Phaser.Ellipse(this.left.x, this.left.y, 24, 40);
        this.rightBase = new Phaser.Ellipse(this.right.x, this.right.y, 24, 40);

        var main = this.scene.getScene('Main');
        var handle = main.windows[this.settings.key];

        this.sys.fbo.setPosition(handle.x, handle.y);
    },

    update: function ()
    {
        this.leftTarget.end.x = this.input.activePointer.x - this.sys.fbo.x;
        this.leftTarget.end.y = this.input.activePointer.y - this.sys.fbo.y;

        //  Within the circle?
        if (this.leftBase.contains(this.leftTarget.end.x, this.leftTarget.end.y))
        {
            this.mid.x = this.leftTarget.end.x;
            this.mid.y = this.leftTarget.end.y;
        }
        else
        {
            this.leftBase.circumferencePoint(this.leftTarget.angle, false, this.mid);
        }

        this.left.x = this.mid.x;
        this.left.y = this.mid.y;

        this.rightTarget.end.x = this.input.activePointer.x - this.sys.fbo.x;
        this.rightTarget.end.y = this.input.activePointer.y - this.sys.fbo.y;

        //  Within the circle?
        if (this.rightBase.contains(this.rightTarget.end.x, this.rightTarget.end.y))
        {
            this.mid.x = this.rightTarget.end.x;
            this.mid.y = this.rightTarget.end.y;
        }
        else
        {
            this.rightBase.circumferencePoint(this.rightTarget.angle, false, this.mid);
        }

        this.right.x = this.mid.x;
        this.right.y = this.mid.y;
    }

};

Demo.Juggler = function ()
{
    this.juggler;
    this.i = 0;
};

Demo.Juggler.prototype.constructor = Demo.Juggler;

Demo.Juggler.prototype = {

    preload: function ()
    {
        this.load.spritesheet('juggler', 'assets/phaser3/juggler.png', 128, 184);
    },

    create: function ()
    {
        this.add.image(0, 0, 'jugglerWindow');

        this.juggler = this.add.image(100, 22, 'juggler', 0);

        var main = this.scene.getScene('Main');
        var handle = main.windows[this.settings.key];

        this.sys.fbo.setPosition(handle.x, handle.y);
    },

    update: function ()
    {
        this.i++;

        if (this.i === this.juggler.texture.frameTotal)
        {
            this.i = 0;
        }

        this.juggler.frame = this.juggler.texture.get(this.i);
    }

};

Demo.Plasma = function ()
{

};

Demo.Plasma.prototype.constructor = Demo.Plasma;

Demo.Plasma.prototype = {

    create: function ()
    {
        this.add.image(0, 0, 'bg');

        this.sys.fbo.program = this.sys.fbo._twirl;
    }

};

Demo.SineWave = function ()
{
    this.slices;
    this.waveform;

    this.xl;
    this.cx = 0;
};

Demo.SineWave.prototype.constructor = Demo.SineWave;

Demo.SineWave.prototype = {

    preload: function ()
    {
        //  373 x 378
        this.load.image('big3', 'assets/phaser3/big3.png');
    },

    create: function ()
    {
        this.add.image(0, 0, 'sineWindow');

        //  Generate our motion data
        var motion = { x: 10 };
        var tween = this.add.tween(motion).to( { x: 190 }, 2000, "Bounce.easeInOut", true, 0, -1, true);
        this.waveform = tween.generateData(60);

        for (var i = 0; i < 200; i++)
        {
            this.waveform.push({ x: 10 });
        }

        this.xl = this.waveform.length - 1;

        this.slices = [];

        var picWidth = this.game.cache.getImage('big3').width;
        var picHeight = this.game.cache.getImage('big3').height;

        var ys = 4;

        for (var y = 0; y < Math.floor(picHeight / ys); y++)
        {
            var star = this.add.image(0, 30 + (y * ys), 'big3');

            //  Needs to clone the Frame, or they'll all use the same shared Frame crop

            star.frame = this.game.textures.cloneFrame('big3');

            //  This needs to move within the Texture Manager maybe?
            Phaser.TextureCrop(star, picWidth, ys, 0, y * ys);

            star.ox = star.x;

            star.cx = Phaser.Math.wrap(y * 2, 0, this.xl);

            this.slices.push(star);
        }

        var main = this.scene.getScene('Main');
        var handle = main.windows[this.settings.key];

        this.sys.fbo.setPosition(handle.x, handle.y);

    },

    update: function (frameDelta)
    {
        for (var i = 0; i < this.slices.length; i++)
        {
            this.slices[i].x = this.slices[i].ox + this.waveform[this.slices[i].cx].x;

            this.slices[i].cx++;

            if (this.slices[i].cx > this.xl)
            {
                this.slices[i].cx = 0;
            }
        }

    }

};

Demo.Stars = function ()
{
    this.p;

    this.width = 320;
    this.height = 220;
    this.depth = 1700;
    this.distance = 200;
    this.speed = 6;

    this.max = 500;
    this.xx = [];
    this.yy = [];
    this.zz = [];
};

Demo.Stars.prototype.constructor = Demo.Stars;

Demo.Stars.prototype = {

    create: function ()
    {
        this.add.image(0, 0, 'starsWindow');

        this.p = this.add.pixelField(0, 0, 2);

        for (var i = 0; i < this.max; i++)
        {
            this.xx[i] = Math.floor(Math.random() * this.width) - (this.width / 2);
            this.yy[i] = Math.floor(Math.random() * this.height) - (this.height / 2);
            this.zz[i] = Math.floor(Math.random() * this.depth) - 100;

            var perspective = this.distance / (this.distance - this.zz[i]);
            var x = (this.width / 2) + this.xx[i] * perspective;
            var y = (this.height / 2) + this.yy[i] * perspective;
            var a = (x < 0 || x > 320 || y < 20 || y > 260) ? 0 : 1;

            this.p.add(x, y, 255, 255, 255, a);
        }

        var main = this.scene.getScene('Main');
        var handle = main.windows[this.settings.key];

        this.sys.fbo.setPosition(handle.x, handle.y);
    },

    update: function (frameDelta)
    {
        for (var i = 0; i < this.max; i++)
        {
            var perspective = this.distance / (this.distance - this.zz[i]);

            var x = (this.width / 2) + this.xx[i] * perspective;
            var y = (this.height / 2) + this.yy[i] * perspective;

            this.zz[i] += this.speed;

            if (this.zz[i] > this.distance)
            {
                this.zz[i] -= (this.distance * 2);
            }

            this.p.list[i].x = x;
            this.p.list[i].y = y;
            this.p.list[i].a = (x < 0 || x > 320 || y < 20 || y > 260) ? 0 : 1;
        }
    }
};

window.onload = function() {

    var game = new Phaser.Game(1280, 720, Phaser.WEBGL, 'phaser-example');

    game.scene.add('Main', Demo.Backdrop, true);

    window.game = game;

};
