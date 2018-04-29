import 'babel-polyfill';
import 'tachyons/css/tachyons.css';
import 'normalize-css';
import './scss/main.scss';

import * as wasm from './lib.rs';

export class Universe {
  static __construct(ptr) {
    return new Universe(ptr);
  }

  constructor(ptr) {
    this.ptr = ptr;
  }

  free() {
    const ptr = this.ptr;
    this.ptr = 0;
    wasm.__wbg_universe_free(ptr);
  }

  static new() {
    return Universe.__construct(wasm.universe_new());
  }

  width() {
    return wasm.universe_width(this.ptr);
  }

  height() {
    return wasm.universe_height(this.ptr);
  }

  cells() {
    return wasm.universe_cells(this.ptr);
  }

  tick() {
    return wasm.universe_tick(this.ptr);
  }
}

const TextDecoder =
  typeof window === 'object' && window.TextDecoder
    ? window.TextDeocder
    : require('util').TextDecoder;

const cachedDecoder = new TextDecoder('utf-8');

let cachedUint8Memory = null;
function getUint8Memory() {
  if (
    cachedUint8Memory === null ||
    cachedUint8Memory.buffer !== wasm.memory.buffer
  ) {
    cachedUint8Memory = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory;
}

function getStringFromWasm(ptr, len) {
  return cachedDecoder.decode(getUint8Memory().slice(ptr, ptr + len));
}

// eslint-disable-next-line
export function __wbindgen_throw(ptr, len) {
  throw new Error(getStringFromWasm(ptr, len));
}
