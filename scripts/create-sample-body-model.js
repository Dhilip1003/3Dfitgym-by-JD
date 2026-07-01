const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'models', 'sample-body.glb');

const positions = new Float32Array([
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
  0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5
]);

const normals = new Float32Array([
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
]);

const indices = new Uint16Array([
  0, 1, 2, 0, 2, 3,
  4, 5, 6, 4, 6, 7,
  8, 9, 10, 8, 10, 11,
  12, 13, 14, 12, 14, 15,
  16, 17, 18, 16, 18, 19,
  20, 21, 22, 20, 22, 23
]);

function toBuffer(typedArray) {
  return Buffer.from(typedArray.buffer);
}

function pad4(buffer, fill = 0) {
  const padding = (4 - (buffer.length % 4)) % 4;
  return padding ? Buffer.concat([buffer, Buffer.alloc(padding, fill)]) : buffer;
}

let offset = 0;
const positionBuffer = pad4(toBuffer(positions));
const positionOffset = offset;
offset += positionBuffer.length;

const normalBuffer = pad4(toBuffer(normals));
const normalOffset = offset;
offset += normalBuffer.length;

const indexBuffer = pad4(toBuffer(indices));
const indexOffset = offset;
offset += indexBuffer.length;

const binary = Buffer.concat([positionBuffer, normalBuffer, indexBuffer]);
const json = {
  asset: {
    version: '2.0',
    generator: '3D Fit Gym sample model generator'
  },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [
    { name: 'Sample Body Model', children: [1, 2, 3, 4, 5, 6] },
    { name: 'Torso', mesh: 0, translation: [0, 1.1, 0], scale: [0.45, 0.8, 0.22] },
    { name: 'Head', mesh: 0, translation: [0, 2.05, 0], scale: [0.32, 0.32, 0.32] },
    { name: 'Left Arm', mesh: 0, translation: [-0.62, 1.08, 0], scale: [0.16, 0.68, 0.16] },
    { name: 'Right Arm', mesh: 0, translation: [0.62, 1.08, 0], scale: [0.16, 0.68, 0.16] },
    { name: 'Left Leg', mesh: 0, translation: [-0.2, 0.18, 0], scale: [0.18, 0.76, 0.18] },
    { name: 'Right Leg', mesh: 0, translation: [0.2, 0.18, 0], scale: [0.18, 0.76, 0.18] }
  ],
  meshes: [
    {
      name: 'Unit Cube Body Part',
      primitives: [
        {
          attributes: {
            POSITION: 0,
            NORMAL: 1
          },
          indices: 2,
          material: 0
        }
      ]
    }
  ],
  materials: [
    {
      name: 'Warm Neutral Body Material',
      pbrMetallicRoughness: {
        baseColorFactor: [0.83, 0.66, 0.5, 1],
        metallicFactor: 0,
        roughnessFactor: 0.78
      }
    }
  ],
  buffers: [{ byteLength: binary.length }],
  bufferViews: [
    { buffer: 0, byteOffset: positionOffset, byteLength: positions.byteLength, target: 34962 },
    { buffer: 0, byteOffset: normalOffset, byteLength: normals.byteLength, target: 34962 },
    { buffer: 0, byteOffset: indexOffset, byteLength: indices.byteLength, target: 34963 }
  ],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126,
      count: 24,
      type: 'VEC3',
      min: [-0.5, -0.5, -0.5],
      max: [0.5, 0.5, 0.5]
    },
    {
      bufferView: 1,
      componentType: 5126,
      count: 24,
      type: 'VEC3'
    },
    {
      bufferView: 2,
      componentType: 5123,
      count: 36,
      type: 'SCALAR'
    }
  ]
};

const jsonBuffer = pad4(Buffer.from(JSON.stringify(json)), 0x20);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonBuffer.length + 8 + binary.length, 8);

const jsonChunkHeader = Buffer.alloc(8);
jsonChunkHeader.writeUInt32LE(jsonBuffer.length, 0);
jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4);

const binaryChunkHeader = Buffer.alloc(8);
binaryChunkHeader.writeUInt32LE(binary.length, 0);
binaryChunkHeader.writeUInt32LE(0x004e4942, 4);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.concat([header, jsonChunkHeader, jsonBuffer, binaryChunkHeader, binary]));

console.log(`Created ${outputPath}`);
