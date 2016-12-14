var LUT = new Uint8Array([
    0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 
    0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F, 0x50, 
    0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 
    0x59, 0x5A, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 
    0x67, 0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 
    0x6F, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 
    0x77, 0x78, 0x79, 0x7A, 0x30, 0x31, 0x32, 0x33,
    0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x2B, 0x2F
]);
function ArrayBufferToBase64(arrayBuffer) {
    var encodedString = '';
    var byteView = new Uint8Array(arrayBuffer);
    var bufferSize = byteView.byteLength;
    var encodedBytesSize = 4 * ((bufferSize + 2) / 3)|0;
    // This could be optimized with a simple bump allocator
    // to avoid allocating a typed array every time a file is loaded.
    var encodedBytes = new Uint8Array(encodedBytesSize);
    var octet, index;

    for (octet = 0, index = 0; octet < bufferSize; octet += 3) {
        var a = (octet < bufferSize ? byteView[octet] : 0) << 0x10;
        var b = (octet + 1 < bufferSize ? byteView[octet + 1] : 0) << 0x08;
        var c = (octet + 2 < bufferSize ? byteView[octet + 2] : 0) << 0x00;
        var d = (a + b + c);

        encodedBytes[index++] = LUT[(d >> 3 * 6) & 0x3F];
        encodedBytes[index++] = LUT[(d >> 2 * 6) & 0x3F];
        encodedBytes[index++] = LUT[(d >> 1 * 6) & 0x3F];
        encodedBytes[index++] = LUT[(d >> 0 * 6) & 0x3F];
    }
    // Apply padding with character '=' since all endcoding must be aligned
    for (octet = 0; octet < (encodedBytesSize % index); ++octet) {
        encodedBytes[index - octet - 1] = 0x3D;
    }
    for (index = 0; index < encodedBytesSize; ++index) {
        encodedString += String.fromCharCode(encodedBytes[index]);
    }
    return encodedString;
}

window.document.body.innerHTML = '';
var testAssets = [
    'asuna_by_vali233.png', 
    'atlas_array_trim.png', 
    'metalslug_monster39x40.png', 
    'phaser.png'
];
testAssets.forEach(function (a) {
    var req = new XMLHttpRequest();
    req.open("GET", "assets/sprites/" + a, true);
    req.responseType = "arraybuffer";

    req.onload = function (e) {
      var arrayBuffer = req.response;
      if (arrayBuffer) {
        var img = new Image();
        img.src = 'data:image/png;base64,' + ArrayBufferToBase64(arrayBuffer);
        window.document.body.appendChild(img);
      }
    };
    req.send(null);
});