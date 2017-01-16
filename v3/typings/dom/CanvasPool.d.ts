declare var _default: {
    create: (parent: any, width?: number, height?: number, type?: number) => any;
    create2D: (parent: any, width?: any, height?: any) => any;
    createWebGL: (parent: any, width?: any, height?: any) => any;
    first: (type: any) => any;
    remove: (parent: any) => void;
    total: () => number;
    free: () => number;
    pool: any[];
};
export default _default;
