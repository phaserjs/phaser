declare var _default: {
    create: (parent: any, width?: number, height?: number, type?: number) => HTMLCanvasElement;
    create2D: (parent: any, width?: any, height?: any) => HTMLCanvasElement;
    createWebGL: (parent: any, width?: any, height?: any) => HTMLCanvasElement;
    first: (type: any) => any;
    remove: (parent: HTMLCanvasElement) => void;
    total: () => number;
    free: () => number;
    pool: any[];
};
export default _default;
