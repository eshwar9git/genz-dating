import { pathToFileURL } from "url";
import path from "path";

// Dynamic import of compiled isn't available — count from built logic by evaluating TS via transpile is heavy.
// Instead import after ensuring the module shape: use a tiny duplicate check on the source arrays.
import fs from "fs";

const src = fs.readFileSync(
  path.join(process.cwd(), "src/lib/mock-data.ts"),
  "utf8"
);

function countNames(blockName) {
  const re = new RegExp(`${blockName} = \\[([\\s\\S]*?)\\];`);
  const m = src.match(re);
  if (!m) return 0;
  return (m[1].match(/"[^"]+"/g) || []).length;
}

const women = countNames("WOMAN_NAMES");
const men = countNames("MAN_NAMES");
const womanBios = countNames("WOMAN_BIOS");
const manBios = countNames("MAN_BIOS");

console.log(
  JSON.stringify(
    {
      women,
      men,
      womanBios,
      manBios,
      uniqueWomanNames: women === new Set(src.match(/WOMAN_NAMES[\s\S]*?\];/)?.[0].match(/"[^"]+"/g) || []).size,
    },
    null,
    2
  )
);

if (women !== 50 || men !== 50 || womanBios !== 50 || manBios !== 50) {
  console.error("Expected 50 names and 50 bios per gender");
  process.exit(1);
}
