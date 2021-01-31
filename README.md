# viewportGL

***(please note that this demo was made in electron forge, however viewportGL.js should still work in a browser if it supports WebGL)***

## Javascript simplified webGL viewport

  The constructor takes in a few values like **height** and **width** of the canvas the **refresh rate** *(does nothing for now)*, the **fov** and **canvasID** the ID of the canvas.

### Integrated functions

* **projectionMatrix** Returns the projection matrix,
* **setTriangles** Takes in the array of coordinates and colors (like this: **[x1, y1, z1, r, g, b, x2, y2, z2, r, g, b, x3, y3, z3, r, g, b]**. Note that the rgb values go from 0.0 to 1.0), that in turn construct a triangle, the coordinates of which are bound to a buffer.
* **vertex3DCalc** Takes in an array of **vertecies** that you can see in *getVal.js*, and an **x**, **y** and **z** rotation, with those values it calculates the object in 3D space and sets the so they can be directly drawn.
* **draw** Takes in an array of numbers that define the rgba values of the background (array should look like this: **[r, g, b, a]**, ranging from 0 to 1), this functions draw the set triangles from the prior function to the screen.

### Demo

**This is what the demo looks like, it can be rotated in 3D space with the A, W, S, D keys:**
![](https://github.com/Tevzi2/webglelectronproject/blob/master/demo1.png)

## Marching cubes alghorithm

### What is the marching cubes alghorith?

  The marching cubes alghorithm takes a number of points and the accoring to your surface level draws a terrain based on a triangulation table (this is a poor explenation, but it's the best i can do since im a amature)
  
### Cubes class
*(This is an extreamly early version of this and im almost 100% certain that im not correctly sampeling the noise)*

* **constructor** Takes in a width, height, length and density parameter.
* **getTriArrs** Takes in x, y, z, return an array of triangles.

### Demo using the viewportGL to render
![](https://github.com/Tevzi2/webglelectronproject/blob/marching-cubes/demo-marching-cubes.png)
