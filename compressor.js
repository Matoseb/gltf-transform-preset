import { NodeIO } from "@gltf-transform/core";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import {
  resample,
  getBounds,
  prune,
  dedup,
  draco,
  meshopt,
  inspect,
  reorder,
  quantize,
  textureCompress,
} from "@gltf-transform/functions";

import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// import * as FUNCTIONS from "./functions/index.js";
export async function initCompressor() {
  const io = new NodeIO();

  await MeshoptDecoder.ready;
  await MeshoptEncoder.ready;

  io.registerExtensions(ALL_EXTENSIONS).registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(), // Optional.
    "draco3d.encoder": await draco3d.createEncoderModule(), // Optional.
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

  return {
    io,

    async saveModel(filePath, document, outputDir, { suffix = "" } = {}) {
      outputDir = path.resolve(outputDir);
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const fileName =
        path.basename(filePath, path.extname(filePath)) +
        suffix +
        path.extname(filePath);

      const outputPath = path.join(outputDir, fileName);

      await io.write(outputPath, document);

      console.log("Saved file: ", fileName);
    },
    getFiles(dir) {
      const inputDir = path.resolve(dir);
      return fs
        .readdirSync(inputDir)
        .filter((file) => {
          if (!(file.endsWith(".glb") || file.endsWith(".gltf"))) return false;
          return true;
        })
        .map((file) => path.join(inputDir, file));
      // .map(async (path) => await io.read(path));
    },
    async getModel(filepath) {
      console.log("Opening file: ", path.basename(filepath));
      return await io.read(filepath);
    },
    async compressFile(document, transform) {
      return await document.transform(...transform({ MeshoptEncoder }));
    },
  };
}

// ignore non-gltf files

//   const inputPath = path.join(inputDir, file);

//   console.log("Opening file: ", inputPath);

//   const document = await io.read(inputPath);

//   await document.transform();

// });

// await Promise.all(queue);

// console.log("done");

// // CUSTOM FUNCS
