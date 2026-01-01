// options.js - 设置页面脚本
document.addEventListener('DOMContentLoaded', async () => {
  const defaultSpeedInput = document.getElementById('defaultSpeed');
  const autoPlayCheckbox = document.getElementById('autoPlay');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const messageEl = document.getElementById('message');

  // 加载保存的设置
  const result = await chrome.storage.sync.get(['defaultSpeed', 'autoPlay']);
  defaultSpeedInput.value = result.defaultSpeed || 1;
  autoPlayCheckbox.checked = result.autoPlay || false;

  // 保存按钮
  saveBtn.addEventListener('click', async () => {
    const settings = {
      defaultSpeed: parseFloat(defaultSpeedInput.value),
      autoPlay: autoPlayCheckbox.checked
    };

    await chrome.storage.sync.set(settings);
    showMessage('设置已保存', 'success');
  });

  // 重置按钮
  resetBtn.addEventListener('click', () => {
    defaultSpeedInput.value = 1;
    autoPlayCheckbox.checked = false;
    showMessage('已重置为默认值', 'success');
  });

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = `message ${type} show`;
    setTimeout(() => {
      messageEl.className = 'message';
    }, 3000);
  }
});

