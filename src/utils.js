const snakeToCamelString = s =>
  s.replace(/[-_\s]+(.)?/g, (m, c) => (c ? c.toUpperCase() : ''));

const snakeToCamelObject = o => {
  const keys = Object.keys(o);
  const newObj = {};
  keys.forEach(k => (newObj[snakeToCamelString(k)] = o[k]));
  return newObj;
};

export const deRust = mod =>
  mod().then(result => {
    console.log(result);
    return snakeToCamelObject(result.instance.exports);
  });

// Copy a nul-terminated string from the buffer pointed to.
// Consumes the old data and thus deallocated it.
export function copyCStr(module, ptr) {
  // let origPtr = ptr;
  const collectCString = function*() {
    const memory = new Uint8Array(module.memory.buffer);
    while (memory[ptr] !== 0) {
      if (memory[ptr] === undefined) {
        throw new Error('Tried to read undef mem');
      }
      yield memory[ptr];
      ptr += 1;
    }
  };

  const bufferAsU8 = new Uint8Array(collectCString());
  const utf8Decoder = new TextDecoder('UTF-8');
  const bufferAsUtf8 = utf8Decoder.decode(bufferAsU8);
  // module.dealloc_str(origPtr);
  return bufferAsUtf8;
}

export function getStr(module, ptr, len) {
  const getData = function*(ptr, len) {
    const memory = new Uint8Array(module.memory.buffer);
    for (let index = 0; index < len; index += 1) {
      if (memory[ptr] === undefined) {
        throw new Error(`Tried to read undef mem at ${ptr}`);
      }
      yield memory[ptr + index];
    }
  };

  const bufferAsU8 = new Uint8Array(getData(ptr / 8, len / 8));
  const utf8Decoder = new TextDecoder('UTF-8');
  const bufferAsUtf8 = utf8Decoder.decode(bufferAsU8);
  return bufferAsUtf8;
}

export function newString(module, str) {
  const utf8Encoder = new TextEncoder('UTF-8');
  const stringBuffer = utf8Encoder.encode(str);
  const len = stringBuffer.length;
  const ptr = module.alloc(len + 1);

  const memory = new Uint8Array(module.memory.buffer);
  for (let i = 0; i < len; i += 1) {
    memory[ptr + i] = stringBuffer[i];
  }

  memory[ptr + len] = 0;

  return ptr;
}
