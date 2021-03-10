function simplexNoise (x, y, z, w, h, l, opts) {
    const mult = 100
    const ret = 0;
    const xmod = opts.xmod || 0;
    const ymod = opts.ymod || 0;
    const zmod = opts.zmod || 0;
    const sampleRate = opts.sampleRate || 0.01;
    const noise = opts.noise
    const densityNum = opts.density || 0.5;

    const density = (Math.abs(noise.get((x+xmod)*sampleRate, (y+ymod)*sampleRate, (z+zmod)*sampleRate)));
        
    /*if(((y == 0 || x == 0 || z == 0) || (y == h-1 || x == w-1 || z == l-1))){
        return [0, densityNum, densityNum];
    }*/
    if(density > densityNum){
        return [1, density, densityNum];
    }
    return [0, density, densityNum];
}