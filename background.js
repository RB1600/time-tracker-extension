let activeTab = null;
let startTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await trackTime();
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab && tab.url) {
    activeTab = new URL(tab.url).hostname;
    startTime = Date.now();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    await trackTime();
    if (tab && tab.url) {
      activeTab = new URL(tab.url).hostname;
      startTime = Date.now();
    }
  }
});

async function trackTime() {
  if (!activeTab || !startTime) return;
  const endTime = Date.now();
  const timeSpent = Math.floor((endTime - startTime) / 1000); // in seconds

  const today = new Date().toISOString().split('T')[0];
  const key = `${today}-${activeTab}`;
  const data = await chrome.storage.local.get([key]);
  const previousTime = data[key] || 0;

  await chrome.storage.local.set({
    [key]: previousTime + timeSpent
  });

  startTime = null;
}
