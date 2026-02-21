export { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const getComponent = (name: any) => {
  const babulus = (globalThis as any).Babulus;
  if (!babulus?.getComponent) {
    throw new Error("Babulus global not found. Ensure babulus-standard.js is loaded before custom components.");
  }
  return babulus.getComponent(name);
};
