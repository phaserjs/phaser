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

    this.key = (config.hasOwnProperty('key')) ? config.key : '';

    this.active = (config.hasOwnProperty('active')) ? config.active : false;

    this.visible = (config.hasOwnProperty('visible')) ? config.visible : true;

    this.scaleMode = (config.hasOwnProperty('scaleMode')) ? config.scaleMode : Phaser.scaleModes.DEFAULT;

    this.x = (config.hasOwnProperty('x')) ? config.x : 0;

    this.y = (config.hasOwnProperty('y')) ? config.y : 0;

    //  -1 means the State Manager will set it to be the Game dimensions
    this.width = (config.hasOwnProperty('width')) ? config.width : -1;

    this.height = (config.hasOwnProperty('height')) ? config.height : -1;
};

Phaser.State.Settings.prototype.constructor = Phaser.State.Settings;
