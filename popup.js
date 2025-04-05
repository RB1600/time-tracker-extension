document.addEventListener("DOMContentLoaded", async () => {
    const list = document.getElementById("timeList");
    const today = new Date().toISOString().split('T')[0];
    const allData = await chrome.storage.local.get();
  
    const entries = Object.entries(allData).filter(([key]) =>
      key.startsWith(today)
    );
  
    entries.sort((a, b) => b[1] - a[1]);
  
    for (const [key, value] of entries) {
      const site = key.split("-")[1];
      const li = document.createElement("li");
      li.textContent = `${site} — ${(value / 60).toFixed(1)} mins`;
      list.appendChild(li);
    }
  });
  