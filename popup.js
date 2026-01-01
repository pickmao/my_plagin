// popup.js - 弹出窗口脚本
document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const statusEl = document.getElementById('status');

  // 获取当前状态
  const result = await chrome.storage.sync.get(['enabled']);
  const enabled = result.enabled || false;

  updateUI(enabled);

  // 切换按钮点击事件
  toggleBtn.addEventListener('click', async () => {
    const newState = !enabled;
    await chrome.storage.sync.set({ enabled: newState });
    
    // 通知content script状态变化
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'toggle', enabled: newState });
    }
    
    updateUI(newState);
  });

  // 设置按钮点击事件
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  function updateUI(isEnabled) {
    if (isEnabled) {
      toggleBtn.textContent = '禁用';
      toggleBtn.className = 'btn btn-secondary';
      statusEl.textContent = '状态：已启用';
      statusEl.style.color = '#28a745';
    } else {
      toggleBtn.textContent = '启用';
      toggleBtn.className = 'btn btn-primary';
      statusEl.textContent = '状态：未启用';
      statusEl.style.color = '#666';
    }
  }
});

