export async function getData(key?: string) {
  const url = key ? `/api/sheets?key=${encodeURIComponent(key)}` : "/api/sheets";
  const response = await fetch(url);
  return await response.json();
}

export async function saveData(key: string, value: any) {
  const response = await fetch("/api/sheets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value })
  });
  return await response.json();
}

export async function getSheetsUrl() {
  const response = await fetch("/api/sheets/url");
  const data = await response.json();
  return data.url || "";
}

export async function saveSheetsUrl(url: string) {
  const response = await fetch("/api/sheets/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  return await response.json();
}

