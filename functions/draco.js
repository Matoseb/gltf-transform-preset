import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import {
  assignDefaults,
  createTransform,
  weld,
} from "@gltf-transform/functions";

const NAME = "draco-custom";

export const DRACO_DEFAULTS = {
  method: "edgebreaker",
  encodeSpeed: 5,
  decodeSpeed: 5,
  quantizePosition: 14,
  quantizeNormal: 10,
  quantizeColor: 8,
  quantizeTexcoord: 12,
  quantizeGeneric: 12,
  quantizationVolume: "mesh",
};

export function draco(_options) {
  const options = assignDefaults(DRACO_DEFAULTS, _options);

  return createTransform(NAME, async (document) => {
    await document.transform(
      weld({
        cleanup: false,
      })
    );
    document
      .createExtension(KHRDracoMeshCompression)
      .setRequired(true)
      .setEncoderOptions({
        method:
          options.method === "edgebreaker"
            ? KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER
            : KHRDracoMeshCompression.EncoderMethod.SEQUENTIAL,
        encodeSpeed: options.encodeSpeed,
        decodeSpeed: options.decodeSpeed,
        quantizationBits: {
          POSITION: options.quantizePosition,
          NORMAL: options.quantizeNormal,
          COLOR: options.quantizeColor,
          TEX_COORD: options.quantizeTexcoord,
          GENERIC: options.quantizeGeneric,
        },
        quantizationVolume: options.quantizationVolume,
      });
  });
}
