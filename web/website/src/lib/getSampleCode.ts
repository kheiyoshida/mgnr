import { readFileSync } from "fs";
import { join } from "path";

export function getSampleCode(fileName: string): string {
  const filePath = join(process.cwd(), "src", "sample", fileName); // Adjust path as needed
  return readFileSync(filePath, "utf-8");
}
