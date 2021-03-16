"use strict"

import { createProgram, resizeCanvasToDisplaySize, onResize, setupInputSlider } from "./utils";
import Matrix3x3 from './matrix3x3';

const canvas = document.querySelector("#myCanvas");

const gl = canvas.getContext('webgl');

if (!gl) {
  // no WebGL for you
  console.log("Your browser doesn't support WebGL.")
}

const program = createProgram(gl, "#vertex-shader-2d", "#fragment-shader-2d");

// set attributes
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// set uniforms
const colorUniformLocation = gl.getUniformLocation(program, "u_color");
const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

const positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put geometry data into buffer
setGeometry(gl);

// transformations
const translation = [200, 100];
let angleInRadians = 0;
const scale = [1, 1];
const color = [Math.random(), Math.random(), Math.random(), 1];

drawScene();

setupInputSlider("xInput", "xOutput", 0, gl.canvas.width, (event, slider) => {
  updatePosition(slider.value, 0);
});

setupInputSlider("yInput", "yOutput", 0, gl.canvas.height, (event, slider) => {
  updatePosition(slider.value, 1);
});

setupInputSlider("rotInput", "rotOutput", 0, 360, (event, slider) => {
  const DEG2RAD = Math.PI / 180;
  angleInRadians = parseFloat(slider.value) * DEG2RAD;

  drawScene();
});

setupInputSlider("scaleXInput", "scaleXOutput", -5, 5, (event, slider) => {
  scale[0] = parseFloat(slider.value);
  drawScene();
});

setupInputSlider("scaleYInput", "scaleYOutput", -5, 5, (event, slider) => {
  scale[1] = parseFloat(slider.value);
  drawScene();
});

function updatePosition(value, index) {
  translation[index] = parseInt(value);
  drawScene();
}

function drawScene() {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2;          // 2 components per iteration
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const bufferOffset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, bufferOffset);

  // set the color
  gl.uniform4fv(colorUniformLocation, color);

  // Starting Matrix.
  const matrix = Matrix3x3.identity();

  // Multiply the matrices.
  matrix.translate(-50, -75);
  matrix.scale(scale[0], scale[1]);
  matrix.rotate(angleInRadians);
  matrix.translate(translation[0], translation[1]);
  matrix.mult(Matrix3x3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight));

  // Set the matrix.
  gl.uniformMatrix3fv(matrixUniformLocation, false, matrix.entries);

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 18;  // 6 triangles in the 'F', 3 points per triangle

  // Draw the geometry.
  gl.drawArrays(primitiveType, offset, count);
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      0, 0,
      30, 0,
      0, 150,
      0, 150,
      30, 0,
      30, 150,

      // top rung
      30, 0,
      100, 0,
      30, 30,
      30, 30,
      100, 0,
      100, 30,

      // middle rung
      30, 60,
      67, 60,
      30, 90,
      30, 90,
      67, 60,
      67, 90,
    ]),
    gl.STATIC_DRAW);
}
