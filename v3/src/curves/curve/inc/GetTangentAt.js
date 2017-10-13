var GetTangentAt = function (u, out)
{
    var t = this.getUtoTmapping(u);

    return this.getTangent(t, out);
};

module.exports = GetTangentAt;
