var IsActive = function (key)
{
    var state = this.getState(key);

    return (state && state.sys.settings.active && this.active.indexOf(state) !== -1);
};

module.exports = IsActive;
