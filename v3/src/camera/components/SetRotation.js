var SetRotation = function (value)
{
    if (value === undefined) { value = 0; }

    this.rotation = value;

    return this;
};

module.exports = SetRotation;
