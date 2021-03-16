"use strict"

import Matrix2x2 from "./matrix2x2";

/**
 * Small matrix 3x3 framework.
 */
export default class Matrix3x3 {
  /**
   * @param {number[]} entries
   */
  constructor(entries = new Array(9)) {
    this.entries = entries;
  }

  /**
   * Returns an identity matrix.
   *
   * @returns {Matrix3x3} - new matrix
   */
  static identity() {
    return new Matrix3x3([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1]);
  }

  /**
   * Returns a fromTranslation matrix.
   *
   * @param {number} tx - fromTranslation in x-direction
   * @param {number} ty - fromTranslation in y-direction
   * @returns {Matrix3x3} - new matrix
   */
  static translation(tx, ty) {
    return new Matrix3x3([
      1,   0, 0,
      0,   1, 0,
      tx, ty, 1
    ]);
  }

  /**
   * Returns a new rotation matrix.
   *
   * @param {number} angleInRadians
   * @returns {Matrix3x3} - new matrix
   */
  static rotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return new Matrix3x3([
      c, -s, 0,
      s,  c, 0,
      0,  0, 1
    ]);
  }

  /**
   * Returns a new fromScaling matrix.
   *
   * @param {number} sx - fromScaling in x-direction
   * @param {number} sy - fromScaling in y-direction
   * @returns {Matrix3x3} - new matrix
   */
  static scaling(sx, sy) {
    return new Matrix3x3([
      sx,  0, 0,
      0,  sy, 0,
      0,   0, 1
    ]);
  }

  /**
   * Returns a projection matrix converting pixel to clip space.
   *
   * @param {number} width - canvas width
   * @param {number} height - canvas height
   * @returns {Matrix3x3} - new matrix
   */
  static projection(width, height) {
    return new Matrix3x3([
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ]);
  }

  /**
   * Multiplies two matrices into a new one.
   *
   * @param {Matrix3x3} a
   * @param {Matrix3x3} b
   * @returns {Matrix3x3} - new matrix
   */
  static multiply(a, b) {
    const c = Matrix3x3.identity();
    c.mult(a);
    c.mult(b);
    return c;
  }

  /**
   * Multiplies this matrix by another one rows times columns.
   *
   * @param {Matrix3x3} b
   */
  mult(b) {
    const a = this.copy();
    let sum;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += a.entries[i * 3 + k] * b.entries[k * 3 + j];
        }
        this.entries[i * 3 + j] = sum;
      }
    }
  }

  /**
   * Multiplies matrix a by this one.
   *
   * @param {Matrix3x3} b
   */
  premult(b) {
    const a = this.copy();
    let sum;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += b.entries[k * 3 + j] * a.entries[i * 3 + k];
        }
        this.entries[i * 3 + j] = sum;
      }
    }
  }

  /**
   * Translates this matrix.
   *
   * @param {number} tx
   * @param {number} ty
   */
  translate(tx, ty) {
    const t = Matrix3x3.translation(tx, ty);
    this.mult(t);
  }

  /**
   * Scales this matrix.
   *
   * @param {number} sx
   * @param {number} sy
   */
  scale(sx, sy) {
    const s = Matrix3x3.scaling(sx, sy);
    this.mult(s);
  }

  /**
   * Rotates this matrix.
   *
   * @param {number} angleInRadians
   */
  rotate(angleInRadians) {
    const r = Matrix3x3.rotation(angleInRadians);
    this.mult(r);
  }

  /**
   * Deep copies this Matrix.
   *
   * @returns {Matrix3x3}
   */
  copy() {
    return new Matrix3x3([...this.entries]);
  }

  /**
   * Matrix excluding i-th row and j-th column
   * @param {number} i - row
   * @param {number} j - column
   * @returns {Matrix2x2} new cofactor matrix
   * @private
   */
  _cofactor(i, j) {
    const entries = [];
    for (let a = 0; a < 3; a++) {
      if (a === i) continue;
      for (let b = 0; b < 3; b++) {
        if (b === j) continue;
        entries.push(this.entries[a * 3 + b]);
      }
    }
    return new Matrix2x2(entries);
  }

  /**
   * Calculates the determinant.
   *
   * @returns {number} determinant
   */
  determinant() {
    let sum = 0;
    for (let j = 0; j < 3; j++) {
      const sign = (-1) ** j;
      const subDet = this._cofactor(0, j).determinant();
      sum += sign * this.entries[j] * subDet;
    }
    return sum;
  }

  /**
   * Returns the determinant of the adjoint (= i-th column is 0 except for j-th row element)
   *
   * @param {number} i - unified column
   * @param {number} j - element to be 1
   * @returns {number} new determinant
   * @private
   */
  _adjointDeterminant(i, j) {
    const adjoint = this.copy();
    for (let k = 0; k < 3; k++) {
      adjoint.entries[k * 3 + i] = k === j ? 1 : 0;
    }
    return adjoint.determinant();
  }

  /**
   * Calculates the inverse of this matrix.
   *
   * @returns {Matrix3x3} new inverse matrix
   */
  inverse() {
    const det = this.determinant();
    if (det === 0) throw new Error("The determinant of this matrix is 0. This happens when rows and columns are linearly dependant");

    const entries = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        entries.push(this._adjointDeterminant(i, j) / det);
      }
    }
    return new Matrix3x3(entries);
  }

  prettyPrint() {
    for (let i = 0; i < 3; i++) {
      console.log(this.entries.slice(i * 3, i * 3 + 3))
    }
  }
}
