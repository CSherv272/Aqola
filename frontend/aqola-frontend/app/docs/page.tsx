import fs from "fs/promises";
import path from "path";

export default async function DocsPage() {
  const filePath = path.join(process.cwd(), "app", "docs", "contents", "documentation.html");
  const html = await fs.readFile(filePath, "utf-8");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}