export default function (a, b) {

    const dx = a[0] - b[0];
    const dy = a[1] - b[1];

    return dx * dx + dy * dy;

}
