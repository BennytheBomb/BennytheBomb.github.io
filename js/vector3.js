"use strict"

/**
 * Class providing three dimensional utility.
 */
export default class Vector3 {
  /**
   * Create a new Vector3 from x, y, z.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Create a new Vector3 from array entries.
   *
   * @param {number[]} entries - entries containing x, y, z
   */
  static fromArray(entries) {
    return new Vector3(entries[0], entries[1], entries[2]);
  }

  /**
   * Calculates v1 - v2.
   *
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @returns {Vector3} - new vector difference
   */
  static subtract(v1, v2) {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  /**
   * Calculates v1 + v2.
   *
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @returns {Vector3} - new vector difference
   */
  static sum(v1, v2) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  /**
   * Calculates the cross product of two vectors.
   *
   * @param {Vector3} v1
   * @param {Vector3} v2
   * @returns {Vector3} cross product
   */
  static cross(v1, v2) {
    return new Vector3(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x
    );
  }

  /**
   * Subtracts this vector by v.
   *
   * @param {Vector3} v - subtracting vector
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  }

  /**
   * Adds this vector by v.
   *
   * @param {Vector3} v - adding vector
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }

  /**
   * Divides this vector by d.
   *
   * @param {number} d
   */
  divide(d) {
    this.x /= d;
    this.y /= d;
    this.z /= d;
  }

  /**
   * Returns the length of this vector.
   *
   * @returns {number} vector length
   */
  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  /**
   * Normalizes the matrix.
   *
   * @returns {Vector3} the normalized vector
   */
  normalize() {
    const length = this.length();
    length > Number.EPSILON ? this.divide(length) : this.zeroValues();
    return this;
  }

  /**
   * Overwrites vector with zeros.
   */
  zeroValues() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  /**
   * Transforms vector into array.
   *
   * @returns {number[]} array of vector elements
   */
  entries() {
    return [this.x, this.y, this.z];
  }
}
