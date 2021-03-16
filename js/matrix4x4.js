"use strict"

import Matrix3x3 from "./matrix3x3";
import Vector3 from "./vector3";

/**
 * Small matrix 4x4 framework.
 */
export default class Matrix4x4 {

  /**
   * @param {number[]} entries
   */
  constructor(entries = new Array(16)) {
    this.entries = entries;
  }

  /**
   * Returns an identity matrix.
   *
   * @returns {Matrix4x4} - new matrix
   */
  static identity() {
    return new Matrix4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  /**
   * Returns a fromTranslation matrix.
   *
   * @param {number} tx - fromTranslation in x-direction
   * @param {number} ty - fromTranslation in y-direction
   * @param {number} tz - fromTranslation in z-direction
   * @returns {Matrix4x4} - new matrix
   */
  static fromTranslation(tx, ty, tz) {
    return new Matrix4x4([
       1,  0,  0, 0,
       0,  1,  0, 0,
       0,  0,  1, 0,
      tx, ty, tz, 1
    ]);
  }

  /**
   * Returns a new rotation matrix on x-axis.
   *
   * @param {number} angleInRadians
   * @returns {Matrix4x4} - new matrix
   */
  static fromXRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return new Matrix4x4([
      1,  0, 0, 0,
      0,  c, s, 0,
      0, -s, c, 0,
      0,  0, 0, 1
    ]);
  }

  /**
   * Returns a new rotation matrix on y-axis.
   *
   * @param {number} angleInRadians
   * @returns {Matrix4x4} - new matrix
   */
  static fromYRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return new Matrix4x4([
      c, 0, -s, 0,
      0, 1,  0, 0,
      s, 0,  c, 0,
      0, 0,  0, 1
    ]);
  }

  /**
   * Returns a new rotation matrix on z-axis.
   *
   * @param {number} angleInRadians
   * @returns {Matrix4x4} - new matrix
   */
  static fromZRotation(angleInRadians) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return new Matrix4x4([
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1
    ]);
  }

  /**
   * Returns a new fromScaling matrix.
   *
   * @param {number} sx - fromScaling in x-direction
   * @param {number} sy - fromScaling in y-direction
   * @param {number} sz - fromScaling in z-direction
   * @returns {Matrix4x4} - new matrix
   */
  static fromScaling(sx, sy, sz) {
    return new Matrix4x4([
      sx,  0,  0, 0,
       0, sy,  0, 0,
       0,  0, sz, 0,
       0,  0,  0, 1
    ]);
  }

  /**
   * Returns a orthographic matrix converting pixels to clip space.
   *
   * @param {number} left
   * @param {number} right
   * @param {number} bottom
   * @param {number} top
   * @param {number} near
   * @param {number} far
   * @returns {Matrix4x4} - new matrix
   */
  static orthographic(left, right, bottom, top, near, far) {
    return new Matrix4x4([
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,

      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1
    ]);
  }

  /**
   * Introduces depth.
   *
   * @param {number} fieldOfViewInRadians - field of view
   * @param {number} aspect - aspect ration
   * @param {number} near - near clip plane
   * @param {number} far - far clip plane
   * @returns {Matrix4x4} - new matrix
   */
  static perspective(fieldOfViewInRadians, aspect, near = 1, far = 2000) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    const rangeInv = 1.0 / (near - far);

    return new Matrix4x4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]);
  }

  /**
   * Creates a look at matrix.
   *
   * @param {Vector3} origin - from where you look
   * @param {Vector3} target – where you're looking at
   * @param {Vector3} up - up vector
   * @returns {Matrix4x4} the lookAt matrix
   */
  static lookAt(origin, target, up = new Vector3(0, 1, 0)) {
    const zAxis = Vector3.subtract(origin, target).normalize();
    const xAxis = Vector3.cross(up, zAxis).normalize();
    const yAxis = Vector3.cross(zAxis, xAxis).normalize();

    return new Matrix4x4([
      xAxis.x,  xAxis.y,  xAxis.z,  0,
      yAxis.x,  yAxis.y,  yAxis.z,  0,
      zAxis.x,  zAxis.y,  zAxis.z,  0,
      origin.x, origin.y, origin.z, 1,
    ]);
  }

  /**
   * Multiplies two matrices into a new one.
   *
   * @param {Matrix4x4} a
   * @param {Matrix4x4} b
   * @returns {Matrix4x4} - new matrix
   */
  static multiply(a, b) {
    const c = Matrix4x4.identity();
    c.mult(a);
    c.mult(b);
    return c;
  }

  /**
   * Multiplies this matrix by another one rows times columns.
   *
   * @param {Matrix4x4} b
   */
  mult(b) {
    const a = this.copy();
    let sum;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a.entries[i * 4 + k] * b.entries[k * 4 + j];
        }
        this.entries[i * 4 + j] = sum;
      }
    }
  }

  /**
   * Multiplies matrix a by this one.
   *
   * @param {Matrix4x4} b
   */
  premult(b) {
    const a = this.copy();
    let sum;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += b.entries[i * 4 + k] * a.entries[k * 4 + j];
        }
        this.entries[i * 4 + j] = sum;
      }
    }
  }

  /**
   * Translates this matrix.
   *
   * @param {number} tx
   * @param {number} ty
   * @param {number} tz
   */
  translate(tx, ty, tz) {
    const t = Matrix4x4.fromTranslation(tx, ty, tz);
    this.premult(t);
  }

  /**
   * Scales this matrix.
   *
   * @param {number} sx
   * @param {number} sy
   * @param {number} sz
   */
  scale(sx, sy, sz) {
    const s = Matrix4x4.fromScaling(sx, sy, sz);
    this.premult(s);
  }

  /**
   * Rotates this matrix on x-axis.
   *
   * @param {number} angleInRadians
   */
  xRotate(angleInRadians) {
    const r = Matrix4x4.fromXRotation(angleInRadians);
    this.premult(r);
  }

  /**
   * Rotates this matrix on y-axis.
   *
   * @param {number} angleInRadians
   */
  yRotate(angleInRadians) {
    const r = Matrix4x4.fromYRotation(angleInRadians);
    this.premult(r);
  }

  /**
   * Rotates this matrix on z-axis.
   *
   * @param {number} angleInRadians
   */
  zRotate(angleInRadians) {
    const r = Matrix4x4.fromZRotation(angleInRadians);
    this.premult(r);
  }

  /**
   * Deep copies this Matrix.
   *
   * @returns {Matrix4x4}
   */
  copy() {
    return new Matrix4x4([...this.entries]);
  }

  /**
   * Matrix excluding i-th row and j-th column
   * @param {number} i - row
   * @param {number} j - column
   * @returns {Matrix3x3} new cofactor matrix
   * @private
   */
  _cofactor(i, j) {
    const entries = [];
    for (let a = 0; a < 4; a++) {
      if (a === i) continue;
      for (let b = 0; b < 4; b++) {
        if (b === j) continue;
        entries.push(this.entries[a * 4 + b]);
      }
    }
    return new Matrix3x3(entries);
  }

  /**
   * Calculates the determinant.
   *
   * @returns {number} determinant
   */
  determinant() {
    let sum = 0;
    for (let j = 0; j < 4; j++) {
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
    for (let k = 0; k < 4; k++) {
      adjoint.entries[k * 4 + i] = k === j ? 1 : 0;
    }
    return adjoint.determinant();
  }

  /**
   * Calculates the inverse of this matrix.
   *
   * @returns {Matrix4x4} new inverse matrix
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
    return new Matrix4x4(entries);
  }

  // inverse() {
  //   const m00 = this.entries[0 * 4 + 0];
  //   const m01 = this.entries[0 * 4 + 1];
  //   const m02 = this.entries[0 * 4 + 2];
  //   const m03 = this.entries[0 * 4 + 3];
  //   const m10 = this.entries[1 * 4 + 0];
  //   const m11 = this.entries[1 * 4 + 1];
  //   const m12 = this.entries[1 * 4 + 2];
  //   const m13 = this.entries[1 * 4 + 3];
  //   const m20 = this.entries[2 * 4 + 0];
  //   const m21 = this.entries[2 * 4 + 1];
  //   const m22 = this.entries[2 * 4 + 2];
  //   const m23 = this.entries[2 * 4 + 3];
  //   const m30 = this.entries[3 * 4 + 0];
  //   const m31 = this.entries[3 * 4 + 1];
  //   const m32 = this.entries[3 * 4 + 2];
  //   const m33 = this.entries[3 * 4 + 3];
  //   const tmp_0  = m22 * m33;
  //   const tmp_1  = m32 * m23;
  //   const tmp_2  = m12 * m33;
  //   const tmp_3  = m32 * m13;
  //   const tmp_4  = m12 * m23;
  //   const tmp_5  = m22 * m13;
  //   const tmp_6  = m02 * m33;
  //   const tmp_7  = m32 * m03;
  //   const tmp_8  = m02 * m23;
  //   const tmp_9  = m22 * m03;
  //   const tmp_10 = m02 * m13;
  //   const tmp_11 = m12 * m03;
  //   const tmp_12 = m20 * m31;
  //   const tmp_13 = m30 * m21;
  //   const tmp_14 = m10 * m31;
  //   const tmp_15 = m30 * m11;
  //   const tmp_16 = m10 * m21;
  //   const tmp_17 = m20 * m11;
  //   const tmp_18 = m00 * m31;
  //   const tmp_19 = m30 * m01;
  //   const tmp_20 = m00 * m21;
  //   const tmp_21 = m20 * m01;
  //   const tmp_22 = m00 * m11;
  //   const tmp_23 = m10 * m01;
  //
  //   const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
  //     (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  //   const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
  //     (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  //   const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
  //     (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  //   const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
  //     (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  //
  //   const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  //
  //   return new Matrix4x4([
  //     d * t0,
  //     d * t1,
  //     d * t2,
  //     d * t3,
  //     d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
  //       (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
  //     d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
  //       (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
  //     d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
  //       (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
  //     d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
  //       (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
  //     d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
  //       (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
  //     d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
  //       (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
  //     d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
  //       (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
  //     d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
  //       (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
  //     d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
  //       (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
  //     d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
  //       (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
  //     d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
  //       (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
  //     d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
  //       (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
  //   ]);
  // }

  prettyPrint() {
    for (let i = 0; i < 4; i++) {
      console.log(this.entries.slice(i * 4, i * 4 + 4))
    }
  }
}
