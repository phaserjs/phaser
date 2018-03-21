//  Project vector b onto vector a and return a

export default function (a, b) {

    const dot = a[0] * b[0] + a[1] * b[1];
    const lenV = b[0] * b[0] + b[1] * b[1];
    const s = dot / lenV;

    a[0] *= s;
    a[1] *= s;

    return a;

}
