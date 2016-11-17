Phaser.State.Settings = function (state, config)
{
    if (typeof config === 'string')
    {
        config = { key: config };
    }
    else if (config === undefined)
    {
        //  Pass the 'hasOwnProperty' checks
        config = {};
    }

    this.state = state;

    this.status = Phaser.State.Settings.PENDING;

    //  Which part of this State is currently being processed?
    //  preload, create, update, shutdown, etc
    this.op = Phaser.State.Settings.BOOT;

    this.key = (config.hasOwnProperty('key')) ? config.key : '';

    this.active = (config.hasOwnProperty('active')) ? config.active : false;

    this.visible = (config.hasOwnProperty('visible')) ? config.visible : true;

    this.scaleMode = (config.hasOwnProperty('scaleMode')) ? config.scaleMode : Phaser.scaleModes.DEFAULT;

    this.fps = (config.hasOwnProperty('fps')) ? config.fps : 60;

    this.x = (config.hasOwnProperty('x')) ? config.x : 0;

    this.y = (config.hasOwnProperty('y')) ? config.y : 0;

    //  -1 means the State Manager will set it to be the Game dimensions
    this.width = (config.hasOwnProperty('width')) ? config.width : -1;

    this.height = (config.hasOwnProperty('height')) ? config.height : -1;
};

Phaser.State.Settings.PENDING = 0;
Phaser.State.Settings.INSTALLED = 1;

Phaser.State.Settings.BOOT = 0;
Phaser.State.Settings.INIT = 1;
Phaser.State.Settings.PRELOAD = 2;
Phaser.State.Settings.CREATE = 3;
Phaser.State.Settings.UPDATE = 4;
Phaser.State.Settings.RENDER = 5;
Phaser.State.Settings.SHUTDOWN = 6;

Phaser.State.Settings.prototype.constructor = Phaser.State.Settings;
