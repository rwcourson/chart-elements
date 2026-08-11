import { defineConfig } from "vite";

export default defineConfig({
  // Workspace links expose the library package's development React install.
  // A published tarball does not, so force the fixture to model the consumer's
  // peer resolution and fail if the package cannot run on React 18.
  resolve: {
    dedupe: ["react", "react-dom"]
  }
});
