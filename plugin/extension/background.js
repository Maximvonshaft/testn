chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'DOWNLOAD_FILE') {
    const payload = String(message.content || '');
    const url = 'data:' + (message.mime || 'text/plain;charset=utf-8') + ',' + encodeURIComponent(payload);
    chrome.downloads.download({
      url,
      filename: message.filename || 'zx-map-leads.csv',
      saveAs: true
    });
    sendResponse({ ok: true });
    return true;
  }

  if (message && message.type === 'OPEN_SEARCH') {
    chrome.tabs.create({ url: message.url || 'https://www.google.com/maps' });
    sendResponse({ ok: true });
    return true;
  }
});
