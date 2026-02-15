let originalRate = 1.0; // 用来记录按下前的原始倍速
let isSpeeding = false; // 状态锁，防止长按时重复触发逻辑

// 1. 监听按下事件
document.addEventListener('keydown', (event) => {
  // 判定逻辑：如果正在输入框打字，则不触发
  const activeElem = document.activeElement;
  if (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA' || activeElem.isContentEditable) return;

  // 判定是否是我们需要监听的键（2 或 3），且当前没有在加速状态中
  if ((event.key === '2' || event.key === '3') && !isSpeeding) {
    const video = document.querySelector('video');
    if (video) {
      isSpeeding = true;
      originalRate = video.playbackRate; // 记住当前速度（可能是 1.0，也可能是你之前调过的 1.5）
      
      const targetRate = event.key === '2' ? 2.0 : 3.0;
      video.playbackRate = targetRate;
      
      showToast(`🔥 正在以 ${targetRate}x 加速播放...`);
    }
  }
});

// 2. 监听松开事件
document.addEventListener('keyup', (event) => {
  if (event.key === '2' || event.key === '3') {
    const video = document.querySelector('video');
    if (video && isSpeeding) {
      video.playbackRate = originalRate; // 恢复到按下前的速度
      isSpeeding = false;
      hideToast(); // 隐藏提示框
    }
  }
});

// --- 辅助函数：显示和隐藏提示框 ---

function showToast(message) {
  let toast = document.getElementById('bili-speed-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bili-speed-toast';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.opacity = '1'; // 显示
  toast.style.display = 'block';
}

function hideToast() {
  const toast = document.getElementById('bili-speed-toast');
  if (toast) {
    toast.style.opacity = '0'; // 渐隐
    // 延迟一会完全隐藏，配合 CSS 过渡动画
    setTimeout(() => {
      if (!isSpeeding) toast.style.display = 'none';
    }, 300);
  }
}