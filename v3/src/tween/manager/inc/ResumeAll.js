var ResumeAll = function ()
{
    var list = this._active;

    for (var i = 0; i < list.length; i++)
    {
        list[i].resume();
    }

    return this;
};

module.exports = ResumeAll;
