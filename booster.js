import * as FUNCTIONS from "./functions/index.js";
import {
  resample,
  prune,
  dedup,
  draco,
  meshopt,
  textureCompress,
} from "@gltf-transform/functions";
import sharp from "sharp";
import { initCompressor } from "./compressor.js";

const TEXTURE_SIZE = 2048;
const { compressFile, getFiles, getModel, saveModel } = await initCompressor();
const files = getFiles("./assets/booster");

for (const filePath of files) {
  const model = await getModel(filePath);
  await compressFile(model, transform);
  await saveModel(filePath, model, "./assets/booster/compressed", {
    suffix: "-compressed",
  });
}

function transform({ MeshoptEncoder }) {
  return [
    FUNCTIONS.removeCameras(),
    FUNCTIONS.removeLights(),
    meshopt({ encoder: MeshoptEncoder, level: "high" }),
    resample(),
    prune({
      keepAttributes: true,
    }),
    dedup({
      keepUniqueNames: true,
    }),
    draco(),
    textureCompress({
      encoder: sharp,
      quality: 100,
      targetFormat: "webp",
      // slots: /^(?!normalTexture).*$/, // exclude normal maps
      resize: [TEXTURE_SIZE, TEXTURE_SIZE],
    }),
    FUNCTIONS.backfaceCulling({ cull: false }),
  ];
}
