// src/utils/yamlLoader.ts
import { parse } from "yaml";

export async function fetchYaml<T>(path: string): Promise<T> {
  const base = import.meta.env.BASE_URL ?? "/";
  // ensure we don't end up with "//data/..."
  const url = base + path.replace(/^\//, "");

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  return parse(text) as T;
}
