import * as fs from "fs";
import * as path from "path";
import {build} from "esbuild";

fs.rmSync(path.join(__dirname, "../build"), {
  force: true,
  recursive: true
});

executeEsbuild({
  entryPoint: path.join(__dirname, "../src/CheckDeployments.ts"),
  outFile: path.join(__dirname, "../dist/src/CheckDeployments.js")
}).catch(() => process.exit(1));

interface BuildConfiguration {
  entryPoint: string;
  outFile: string;
}

async function executeEsbuild({entryPoint, outFile}: BuildConfiguration): Promise<void> {
  console.log(`Executing esbuild from input '${entryPoint}' to '${outFile}'`);

  await build({
    entryPoints: [entryPoint],
    outfile: outFile,
    bundle: true,
    minify: true,
    platform: "node"
  });
}
