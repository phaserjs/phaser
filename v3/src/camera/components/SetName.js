var SetName = function (value)
{
    if (value === undefined) { value = ''; }

    this.name = value;

    return this;
};

module.exports = SetName;
