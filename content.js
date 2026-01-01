// content.js - 内容脚本（注入到网页中）
(function() {
  'use strict';

  let enabled = false;

  // 从storage获取初始状态
  chrome.storage.sync.get(['enabled'], (result) => {
    enabled = result.enabled || false;
    if (enabled) {
      initVideoHandler();
    }
  });

  // 监听来自popup的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
      enabled = request.enabled;
      if (enabled) {
        initVideoHandler();
      } else {
        removeVideoHandler();
      }
      sendResponse({ success: true });
    }
    return true;
  });

  function initVideoHandler() {
    // 查找页面中的所有视频元素
    const videos = document.querySelectorAll('video');
    
    videos.forEach((video, index) => {
      console.log(`找到视频元素 #${index}`, video);
      
      // 可以在这里添加视频处理逻辑
      // 例如：添加控制按钮、监听事件等
      
      video.addEventListener('play', () => {
        console.log('视频开始播放');
        chrome.runtime.sendMessage({
          action: 'videoDetected',
          data: { src: video.src, currentTime: video.currentTime }
        });
      });
    });

    // 如果使用MutationObserver监听动态加载的视频
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'VIDEO') {
              console.log('检测到新的视频元素', node);
            }
            // 检查子元素中的video
            const videos = node.querySelectorAll?.('video');
            videos?.forEach((video) => {
              console.log('检测到新的视频元素（子元素）', video);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function removeVideoHandler() {
    // 清理监听器和观察者
    console.log('移除视频处理器');
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (enabled) {
        initVideoHandler();
      }
    });
  } else {
    if (enabled) {
      initVideoHandler();
    }
  }
})();

