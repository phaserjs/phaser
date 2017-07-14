var IsActive = function (key)
{
    var scene = this.getScene(key);

    return (scene && scene.sys.settings.active && this.active.indexOf(scene) !== -1);
};

module.exports = IsActive;
