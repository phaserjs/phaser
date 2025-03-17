// Mock browser globals that Phaser might need
global.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0);
};

global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};

// Mock canvas and WebGL context if needed
global.HTMLCanvasElement.prototype.getContext = function () {
    return {
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        getImageData: jest.fn(() => ({
            data: new Array(4),
        })),
        putImageData: jest.fn(),
        createImageData: jest.fn(() => []),
        setTransform: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        translate: jest.fn(),
        transform: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        stroke: jest.fn(),
        fill: jest.fn(),
    };
};

// Add any other global mocks or setup needed for Phaser tests
