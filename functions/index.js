import { KHRLightsPunctual } from "@gltf-transform/extensions";

export function removeCameras(options) {
  return (document) => {
    for (const camera of document.getRoot().listCameras()) {
      camera.dispose();
      console.log("removed camera");
    }
  };
}

export function removeLights(options) {
  return (document) => {
    document
      .getRoot()
      .listNodes()
      .forEach((node) => {
        const light = node.getExtension(KHRLightsPunctual.EXTENSION_NAME);
        if (!light) return;
        node.dispose();
        console.log("removed light");
      });
  };
}

export function handlePin({ name = "pin", remove = false } = {}) {
  return (document) => {
    document
      .getRoot()
      .listNodes()
      .forEach((node) => {
        if (!node.getName().includes(name)) return;
        if(remove) {
          node.dispose();
          console.log("Removed pin");
          return;
        }
        const mesh = node.getMesh();
        if (!mesh) return;
        mesh.dispose();
        console.log("Removed pin mesh");
      });
  };
}

export function backfaceCulling(options) {
  return (document) => {
    for (const material of document.getRoot().listMaterials()) {
      material.setDoubleSided(!options.cull);
    }
  };
}
