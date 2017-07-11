var GetStateIndexByKey = function (key)
{
    var state = this.keys[key];

    return this.states.indexOf(state);
};

module.exports = GetStateIndexByKey;
