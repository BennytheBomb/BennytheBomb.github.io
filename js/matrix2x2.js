"use strict"

/**
 * Small matrix 2x2 framework.
 */
export default class Matrix2x2 {
  /**
   * @param {number[]} entries
   */
  constructor(entries = new Array(4)) {
    this.entries = entries;
  }

  /**
   * Returns an identity matrix.
   *
   * @returns {Matrix2x2} - new matrix
   */
  static identity() {
    return new Matrix2x2([
      1, 0,
      0, 1,]);
  }

  /**
   * Multiplies this matrix by another one rows times columns.
   *
   * @param {Matrix2x2} b
   */
  mult(b) {
    const a = this.copy();
    let sum;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        sum = 0;
        for (let k = 0; k < 2; k++) {
          sum += a.entries[i * 2 + k] * b.entries[k * 2 + j];
        }
        this.entries[i * 2 + j] = sum;
      }
    }
  }

  /**
   * Multiplies matrix a by this one.
   *
   * @param {Matrix2x2} b
   */
  premult(b) {
    const a = this.copy();
    let sum;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        sum = 0;
        for (let k = 0; k < 2; k++) {
          sum += b.entries[k * 2 + j] * a.entries[i * 2 + k];
        }
        this.entries[i * 2 + j] = sum;
      }
    }
  }

  /**
   * Deep copies this Matrix.
   *
   * @returns {Matrix2x2}
   */
  copy() {
    return new Matrix2x2([...this.entries]);
  }

  /**
   * Calculates the determinant.
   *
   * @returns {number} determinant
   */
  determinant() {
    return this.entries[0] * this.entries[3] - this.entries[1] * this.entries[2];
  }

  prettyPrint() {
    for (let i = 0; i < 2; i++) {
      console.log(this.entries.slice(i * 2, i * 2 + 2))
    }
  }
}
