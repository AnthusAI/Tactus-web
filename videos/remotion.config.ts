import { Config } from "@remotion/cli/config";
import path from "path";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Set output directory for rendered videos
Config.setOutputLocation("out");

// Configure webpack to support path aliases
Config.overrideWebpackConfig((config) => {
  const projectRoot = process.cwd();
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        "@": path.resolve(projectRoot, "src"),
        "@/components": path.resolve(projectRoot, "src/components"),
        "@/videos": path.resolve(projectRoot, "src/videos"),
        "@/lib": path.resolve(projectRoot, "src/lib"),
        "@/tactus": path.resolve(projectRoot, "src/tactus"),
        "@/babulus": path.resolve(projectRoot, "src/babulus"),
      },
    },
  };
});
