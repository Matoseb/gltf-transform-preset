import * as FUNCTIONS from "./functions/index.js";
import {
  resample,
  prune,
  dedup,
  // draco,
  reorder,
  meshopt,
  textureCompress,
} from "@gltf-transform/functions";

import { draco as dracoCustom } from "./functions/draco.js";
import sharp from "sharp";
import { initCompressor } from "./compressor.js";

const TEXTURE_SIZE = 512;
const { compressFile, getFiles, getModel, saveModel } = await initCompressor();
const files = getFiles("./assets/book");

for (const filePath of files) {
  const model = await getModel(filePath);
  await compressFile(model, transform);
  await saveModel(filePath, model, "./assets/book/compressed", {
    suffix: "-compressed",
  });
}

function transform({ MeshoptEncoder }) {
  return [
    FUNCTIONS.removeCameras(),
    FUNCTIONS.removeLights(),
    reorder({ encoder: MeshoptEncoder, target: "size", cleanup: false }),
    resample(),
    dracoCustom(),
    prune({
      keepAttributes: true,
      keepLeaves: true, // keep empty
    }),
    dedup({
      keepUniqueNames: true,
    }),
    textureCompress({
      encoder: sharp,
      targetFormat: "webp",
      resize: [TEXTURE_SIZE, TEXTURE_SIZE],
    }),
    FUNCTIONS.backfaceCulling({ cull: false }),
  ];
}
