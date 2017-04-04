var Decompose = function (rect, out)
{
    if (out === undefined) { out = []; }

    out.push({ x: rect.x, y: rect.y });
    out.push({ x: rect.right, y: rect.y });
    out.push({ x: rect.right, y: rect.bottom });
    out.push({ x: rect.x, y: rect.bottom });

    return out;
};

module.exports = Decompose;
