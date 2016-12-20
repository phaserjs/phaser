import Rectangle from 'geom/rectangle/Rectangle.js';

export default function Clone (source) {

    return Rectangle(source.x, source.y, source.width, source.height);
    
}