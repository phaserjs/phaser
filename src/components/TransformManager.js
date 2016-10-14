/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Dirty! Manager
*
* @class
*/
Phaser.TransformManager = function (game)
{
    this.game = game;

    this.list = [];
    
    this.processed = 0;
};

Phaser.TransformManager.prototype.constructor = Phaser.TransformManager;

Phaser.TransformManager.prototype = {

    preUpdate: function ()
    {
        this.processed = 0;
        this.list.length = 0;
    },

    update: function ()
    {
        for (var i = 0; i < this.list.length; i++)
        {
            //  Because it may have already been processed (as a child of another Transform that was updated)
            if (this.list[i] && this.list[i]._dirty)
            {
                this.processed++;
                this.list[i].update();
            }
        }

    },

    add: function (transform)
    {
        this.list.push(transform);
    }

};
