"use strict"

/**
 * Creates a shader for a given type and source.
 *
 * @param {WebGLRenderingContext} gl
 * @param {GLenum} type
 * @param {string} source
 * @returns {WebGLShader}
 */
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * Creates a GLSL program.
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexShaderElement
 * @param {string} fragmentShaderElement
 * @returns {*|WebGLProgram}
 */
export function createProgram(gl, vertexShaderElement, fragmentShaderElement) {
  const vertexShaderSource = document.querySelector(vertexShaderElement).text;
  const fragmentShaderSource = document.querySelector(fragmentShaderElement).text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

/**
 * Resizes canvas to display size.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {boolean} - whether it needs to resize
 */
export function resizeCanvasToDisplaySize(canvas) {
  // init with the default canvas size
  const canvasToDisplaySizeMap = new Map([[canvas, [300, 150]]]);

  // Get the size the browser is displaying the canvas in device pixels.
  const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas);

  // Check if the canvas is not the same size.
  const needResize = canvas.width  != displayWidth ||
    canvas.height != displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

/**
 * Resizes the canvas.
 *
 * @param {Map<HTMLCanvasElement,number[]>} entries
 * @param canvasToDisplaySizeMap
 */
export function onResize(entries, canvasToDisplaySizeMap) {
  for (const entry of entries) {
    let width;
    let height;
    let dpr = window.devicePixelRatio;
    if (entry.devicePixelContentBoxSize) {
      // NOTE: Only this path gives the correct answer
      // The other paths are imperfect fallbacks
      // for browsers that don't provide anyway to do this
      width = entry.devicePixelContentBoxSize[0].inlineSize;
      height = entry.devicePixelContentBoxSize[0].blockSize;
      dpr = 1; // it's already in width and height
    } else if (entry.contentBoxSize) {
      if (entry.contentBoxSize[0]) {
        width = entry.contentBoxSize[0].inlineSize;
        height = entry.contentBoxSize[0].blockSize;
      } else {
        width = entry.contentBoxSize.inlineSize;
        height = entry.contentBoxSize.blockSize;
      }
    } else {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    }
    const displayWidth = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);
    canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
  }
}

/**
 * Sets up the input slider and links input value to output text.
 *
 * @param {string} inputId
 * @param {string} outputId
 * @param {number} min
 * @param {number} max
 * @param {function} onInput
 */
export function setupInputSlider(inputId, outputId, min = 0, max = 100, onInput) {
  const inputSlider = document.getElementById(inputId);
  inputSlider.min = min;
  inputSlider.max = max;

  const outputText = document.getElementById(outputId);
  outputText.innerHTML = inputSlider.value;

  inputSlider.oninput = function(event) {
    outputText.innerHTML = this.value;
    onInput(event, this);
  };
}

/**
 * Sets up buffer for given attribute into ARRAY_BUFFER.
 *
 * @param {WebGLRenderingContext} gl
 * @param {GLuint} attributeIndex - attribute to set buffer up
 * @param {GLint} size - number of components per iteration
 * @param {GLenum} type
 * @param {GLboolean} normalize - convert from 0-255 to 0-1
 * @param {GLsizei} stride - 0 = move forward size * sizeof(type) each iteration to get the next position
 * @param {GLintptr} offset - offset into the buffer
 */
export function setupBufferForAttribute(gl, attributeIndex, size, type, normalize, stride = 0, offset = 0) {
  gl.vertexAttribPointer(
    attributeIndex, size, type, normalize, stride, offset);
}
