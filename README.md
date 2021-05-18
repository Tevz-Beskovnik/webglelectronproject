[comment]: <> (TODO: clean up the readme xD it's very messy im trash at making these)

# viewportGL

***(please note that this demo was made in electron forge, however viewportGL.js should still work in a browser if it supports WebGL, but the marching cubes alghorithem will not poroperly work, becouse it requires the perlin noise, but i could make a workaround for it (maybe a project for the future))***

## Javascript simplified webGL viewport

  The constructor takes in a few values like **height** and **width** of the canvas the **refresh rate** *(does nothing for now)*, the **fov** and **canvasID** the ID of the canvas.

### Integrated functions

* **projectionMatrix** Returns the projection matrix,
* **setTriangles** Takes in the array of coordinates and colors (like this: **[x1, y1, z1, r, g, b, x2, y2, z2, r, g, b, x3, y3, z3, r, g, b]**. Note that the rgb values go from 0.0 to 1.0), that in turn construct a triangle, the coordinates of which are bound to a buffer.
* **vertex3DCalc** Takes in an array of **vertecies** that you can see in *getVal.js*, and an **x**, **y** and **z** rotation aswell as a **zoom parameter**, with those values it calculates the object in 3D space and sets the so they can be directly drawn, this function also **illuminates** the cube.
* **draw** Takes in an array of numbers that define the rgba values of the background (array should look like this: **[r, g, b, a]**, ranging from 0 to 1), this functions draw the set triangles from the prior function to the screen.

## Marching cubes alghorithm

### Dependencies

* **perlin-noise-3d** you can find it [here](https://www.npmjs.com/package/perlin-noise-3d), or just download the depneencies.

### What is the marching cubes alghorith?

  The marching cubes alghorithm takes a number of points and the accoring to your surface level draws a terrain based on a triangulation table (this is a poor explenation, but it's the best i can do since im a amature)
  
### Cubes class

* **constructor** Takes in a width, height, length, options object containing density: isolevel *(from 1-0)*, xmod: x-offset, ymod: y-offset, zmod: z-offset, sampleRate: interval at what it should sample it *(higher values from noise to be less smooth and lover for it to be more smooth should be a vlaue between 1-0)*, noise: the noise function. Then it takes in colors that is an array filled with four arrays of 3 sets of values from 0-1, and lastly a bool that determens weather it should interpolate the surface or not *(that means if it sohould smooth it or keep it blocky)*  
*Example:*  
new CubeTriCoords(w, h, l, {  
                                                                      density: rangeDens,  
                                                                      xmod: rangex/(Math.pow(10, Math.abs(Math.log10(noiseSpace)+1))),  
                                                                      ymod: rangey/(Math.pow(10, Math.abs(Math.log10(noiseSpace)+1))),  
                                                                      zmod: rangez/(Math.pow(10, Math.abs(Math.log10(noiseSpace)+1))),  
                                                                      sampleRate: noiseSpace,  
                                                                      noise: noise  
                                                                   }, colors, true);
* **getTriArrs** Takes in x, y, z, return an array of triangles.

### Demo using perlin nose and the viewportGL class to render
![](https://github.com/Tevzi2/webglelectronproject/blob/marching-cubes/demo-marching-cubes1.png)

### Demo using interpolation
![](https://github.com/Tevzi2/webglelectronproject/blob/marching-cubes/demo-marching-cubes-interp.png)

### Now ported to browser!!!!!!
