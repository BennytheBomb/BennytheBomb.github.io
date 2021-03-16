"use strict"

import {
  createProgram,
  resizeCanvasToDisplaySize,
  onResize,
  setupInputSlider,
  setupBufferForAttribute
} from "./utils";
import Matrix4x4 from './matrix4x4';

const DEG2RAD = Math.PI / 180;

const canvas = document.querySelector("#myCanvas");

const gl = canvas.getContext('webgl');

if (!gl) {
  // no WebGL for you
  console.log("Your browser doesn't support WebGL.")
}

const program = createProgram(gl, "#vertex-shader-3d", "#fragment-shader-3d");

// set attributes
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

// set uniforms
const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

// create buffers
const positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put geometry data into buffer
setGeometry(gl);

const colorBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// Put the colors in the buffer.
setColors(gl);

// transformations
const translation = [-150, 0, -360];
const rotation = [DEG2RAD * 190, DEG2RAD * 40, DEG2RAD * 320];
const scale = [1, 1, 1];

let fieldOfView = 60 * DEG2RAD;

drawScene();

setupInputSlider("fovInput", "fovOutput", 1, 179, (event, slider) => {
  fieldOfView = parseFloat(slider.value) * DEG2RAD;
  drawScene();
});

setupInputSlider("xInput", "xOutput", -gl.canvas.width / 2, gl.canvas.width / 2, (event, slider) => {
  updatePosition(slider.value, 0);
});
setupInputSlider("yInput", "yOutput", -gl.canvas.height / 2, gl.canvas.height / 2, (event, slider) => {
  updatePosition(slider.value, 1);
});
setupInputSlider("zInput", "zOutput", -1000, 1, (event, slider) => {
  updatePosition(slider.value, 2);
});

setupInputSlider("angleXInput", "angleXOutput", 0, 360, (event, slider) => {
  updateRotation(slider.value, 0);
});
setupInputSlider("angleYInput", "angleYOutput", 0, 360, (event, slider) => {
  updateRotation(slider.value, 1);
});
setupInputSlider("angleZInput", "angleZOutput", 0, 360, (event, slider) => {
  updateRotation(slider.value, 2);
});

setupInputSlider("scaleXInput", "scaleXOutput", -5, 5, (event, slider) => {
  updateScale(slider.value, 0);
});
setupInputSlider("scaleYInput", "scaleYOutput", -5, 5, (event, slider) => {
  updateScale(slider.value, 1);
});
setupInputSlider("scaleZInput", "scaleZOutput", -5, 5, (event, slider) => {
  updateScale(slider.value, 2);
});

function updatePosition(value, index) {
  translation[index] = parseInt(value);
  drawScene();
}

function updateRotation(value, index) {
  rotation[index] = parseFloat(value) * DEG2RAD;
  drawScene();
}

function updateScale(value, index) {
  scale[index] = parseFloat(value);
  drawScene();
}

function drawScene() {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Turn on culling. By default backfacing triangles
  // will be culled.
  gl.enable(gl.CULL_FACE);

  // Enable the depth buffer
  gl.enable(gl.DEPTH_TEST);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  setupBufferForAttribute(gl, positionAttributeLocation, 3, gl.FLOAT, false)

  // set the color
  // Turn on the color attribute
  gl.enableVertexAttribArray(colorAttributeLocation);

  // Bind the color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  setupBufferForAttribute(gl, colorAttributeLocation, 3, gl.UNSIGNED_BYTE, true);

  // Starting Matrix.
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 2000;
  const matrix = Matrix4x4.identity();

  // Multiply the matrices.
  matrix.mult(Matrix4x4.perspective(fieldOfView, aspect, zNear, zFar));
  matrix.translate(translation[0], translation[1], translation[2]);
  matrix.zRotate(rotation[2]);
  matrix.yRotate(rotation[1]);
  matrix.xRotate(rotation[0]);
  matrix.scale(scale[0], scale[1], scale[2]);
  // matrix.mult(Matrix4x4.orthographic(left, right, bottom, top, near, far));


  // Set the matrix.
  gl.uniformMatrix4fv(matrixUniformLocation, false, matrix.entries);

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 16 * 6;  // 96 triangles in the 'F', 3 points per triangle, 16 surfaces

  // Draw the geometry.
  gl.drawArrays(primitiveType, offset, count);
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column front
      0,   0,  0,
      0, 150,  0,
      30,   0,  0,
      0, 150,  0,
      30, 150,  0,
      30,   0,  0,

      // top rung front
      30,   0,  0,
      30,  30,  0,
      100,   0,  0,
      30,  30,  0,
      100,  30,  0,
      100,   0,  0,

      // middle rung front
      30,  60,  0,
      30,  90,  0,
      67,  60,  0,
      30,  90,  0,
      67,  90,  0,
      67,  60,  0,

      // left column back
      0,   0,  30,
      30,   0,  30,
      0, 150,  30,
      0, 150,  30,
      30,   0,  30,
      30, 150,  30,

      // top rung back
      30,   0,  30,
      100,   0,  30,
      30,  30,  30,
      30,  30,  30,
      100,   0,  30,
      100,  30,  30,

      // middle rung back
      30,  60,  30,
      67,  60,  30,
      30,  90,  30,
      30,  90,  30,
      67,  60,  30,
      67,  90,  30,

      // top
      0,   0,   0,
      100,   0,   0,
      100,   0,  30,
      0,   0,   0,
      100,   0,  30,
      0,   0,  30,

      // top rung right
      100,   0,   0,
      100,  30,   0,
      100,  30,  30,
      100,   0,   0,
      100,  30,  30,
      100,   0,  30,

      // under top rung
      30,   30,   0,
      30,   30,  30,
      100,  30,  30,
      30,   30,   0,
      100,  30,  30,
      100,  30,   0,

      // between top rung and middle
      30,   30,   0,
      30,   60,  30,
      30,   30,  30,
      30,   30,   0,
      30,   60,   0,
      30,   60,  30,

      // top of middle rung
      30,   60,   0,
      67,   60,  30,
      30,   60,  30,
      30,   60,   0,
      67,   60,   0,
      67,   60,  30,

      // right of middle rung
      67,   60,   0,
      67,   90,  30,
      67,   60,  30,
      67,   60,   0,
      67,   90,   0,
      67,   90,  30,

      // bottom of middle rung.
      30,   90,   0,
      30,   90,  30,
      67,   90,  30,
      30,   90,   0,
      67,   90,  30,
      67,   90,   0,

      // right of bottom
      30,   90,   0,
      30,  150,  30,
      30,   90,  30,
      30,   90,   0,
      30,  150,   0,
      30,  150,  30,

      // bottom
      0,   150,   0,
      0,   150,  30,
      30,  150,  30,
      0,   150,   0,
      30,  150,  30,
      30,  150,   0,

      // left side
      0,   0,   0,
      0,   0,  30,
      0, 150,  30,
      0,   0,   0,
      0, 150,  30,
      0, 150,   0]),
    gl.STATIC_DRAW);
}

// Fill the buffer with colors for the 'F'.
function setColors(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      // left column front
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,

      // top rung front
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,

      // middle rung front
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,

      // left column back
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,

      // top rung back
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,

      // middle rung back
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,

      // top
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,

      // top rung right
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,

      // under top rung
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,

      // between top rung and middle
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,

      // top of middle rung
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,

      // right of middle rung
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,

      // bottom of middle rung.
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,

      // right of bottom
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,

      // bottom
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,

      // left side
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220]),
    gl.STATIC_DRAW);
}
