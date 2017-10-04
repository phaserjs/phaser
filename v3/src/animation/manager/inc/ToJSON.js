/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#toJSON
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * 
 * @return {object} [description]
 */
var ToJSON = function (key)
{
    if (key !== undefined && key !== '')
    {
        return this.anims.get(key).toJSON();
    }
    else
    {
        var output = {
            anims: [],
            globalTimeScale: this.globalTimeScale
        };

        this.anims.each(function (animationKey, animation)
        {
            output.anims.push(animation.toJSON());
        });

        return output;
    }
};

module.exports = ToJSON;
