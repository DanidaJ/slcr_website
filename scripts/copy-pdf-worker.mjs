// Copies the pdfjs worker into /public so the PDF viewer can load it by a
// stable URL. Runs before dev/build so it always matches the installed
// pdfjs-dist version. pdfjs-dist is a dependency of react-pdf, so we resolve
// it through react-pdf's module context (works with pnpm's nested layout).
import { createRequire } from "module";
import { copyFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, "..");

const reactPdfRequire = createRequire(
  createRequire(import.meta.url).resolve("react-pdf")
);
const workerSrc = reactPdfRequire.resolve(
  "pdfjs-dist/build/pdf.worker.min.mjs"
);

const destDir = join(projectRoot, "public");
mkdirSync(destDir, { recursive: true });
const dest = join(destDir, "pdf.worker.min.mjs");

copyFileSync(workerSrc, dest);
console.log(`Copied pdf worker → public/pdf.worker.min.mjs`);
