// background.js - 后台服务工作者（Service Worker）
chrome.runtime.onInstalled.addListener(() => {
  console.log('视频插件已安装');
});

// 监听来自content script或popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'videoDetected') {
    console.log('检测到视频元素', request.data);
    // 可以在这里处理视频相关的逻辑
  }
  
  sendResponse({ success: true });
  return true;
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('页面加载完成:', tab.url);
  }
});

