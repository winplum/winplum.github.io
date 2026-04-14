 // camera.js - 摄像头视频接入控制
class CameraController {
  constructor() {
    this.videoElement = document.getElementById('webcam-video');
    this.startButton = document.getElementById('start-btn');
    this.stopButton = document.getElementById('stop-btn');
    this.resolutionSelect = document.getElementById('resolution-select');
    this.statusElement = document.getElementById('status');
    this.errorElement = document.getElementById('error-msg');
    this.stream = null;
    
    this.init();
  }
  
  init() {
    // 绑定按钮事件
    this.startButton.addEventListener('click', () => this.startCamera());
    this.stopButton.addEventListener('click', () => this.stopCamera());
    
    // 检查浏览器是否支持getUserMedia API
    this.checkCameraSupport();
  }
  
  checkCameraSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.showError('您的浏览器不支持摄像头功能，请使用Chrome、Firefox或Edge等现代浏览器。');
      this.startButton.disabled = true;
      return false;
    }
    return true;
  }
  
  async startCamera() {
    if (!this.checkCameraSupport()) return;
    
    // 清除之前的错误信息
    this.hideError();
    
    // 获取选中的分辨率
    const resolution = this.getSelectedResolution();
    
    // 配置摄像头参数
    const constraints = {
      video: {
        width: { ideal: resolution.width },
        height: { ideal: resolution.height },
        facingMode: 'user' // 前置摄像头，使用'environment'为后置摄像头
      },
      audio: false // 不需要音频
    };
    
    try {
      // 请求摄像头权限并获取视频流
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // 将视频流绑定到video元素
      this.videoElement.srcObject = this.stream;
      
      // 更新UI状态
      this.updateUI(true);
      this.updateStatus(`摄像头已启动 (${resolution.width}x${resolution.height})`);
      
      // 监听视频元数据加载完成
      this.videoElement.onloadedmetadata = () => {
        console.log('摄像头视频已就绪，分辨率:', 
          this.videoElement.videoWidth, 'x', this.videoElement.videoHeight);
      };
      
    } catch (error) {
      console.error('摄像头访问错误:', error);
      this.handleCameraError(error);
    }
  }
  
  stopCamera() {
    if (!this.stream) return;
    
    // 停止所有视频轨道
    this.stream.getTracks().forEach(track => {
      track.stop();
    });
    
    // 清除视频源
    this.videoElement.srcObject = null;
    this.stream = null;
    
    // 更新UI状态
    this.updateUI(false);
    this.updateStatus('摄像头已停止');
  }
  
  getSelectedResolution() {
    const selected = this.resolutionSelect.value;
    const resolutions = {
      'hd': { width: 1280, height: 720 },
      'full-hd': { width: 1920, height: 1080 },
      'vga': { width: 640, height: 480 }
    };
    return resolutions[selected] || resolutions['full-hd'];
  }
  
  updateUI(isCameraActive) {
    this.startButton.disabled = isCameraActive;
    this.stopButton.disabled = !isCameraActive;
    this.resolutionSelect.disabled = isCameraActive;
    
    if (isCameraActive) {
      this.startButton.textContent = '摄像头运行中...';
    } else {
      this.startButton.textContent = '开始摄像头';
    }
  }
  
  updateStatus(message) {
    this.statusElement.textContent = `状态: ${message}`;
  }
  
  showError(message) {
    this.errorElement.textContent = message;
    this.errorElement.style.display = 'block';
  }
  
  hideError() {
    this.errorElement.style.display = 'none';
  }
  
  handleCameraError(error) {
    let errorMessage = '无法访问摄像头: ';
    
    switch (error.name) {
      case 'NotAllowedError':
        errorMessage += '用户拒绝了摄像头权限请求。请允许摄像头访问后重试。';
        break;
      case 'NotFoundError':
        errorMessage += '未找到摄像头设备。请检查摄像头是否已连接。';
        break;
      case 'NotReadableError':
        errorMessage += '摄像头正被其他应用占用，请关闭其他使用摄像头的应用后重试。';
        break;
      case 'OverconstrainedError':
        errorMessage += '无法满足分辨率要求，正在尝试使用默认设置...';
        // 尝试使用默认设置重新启动
        setTimeout(() => this.startCameraWithDefault(), 100);
        return;
      default:
        errorMessage += `未知错误: ${error.message}`;
    }
    
    this.showError(errorMessage);
    this.updateUI(false);
  }
  
  async startCameraWithDefault() {
    try {
      // 使用最基本的约束条件
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      this.videoElement.srcObject = this.stream;
      this.updateUI(true);
      this.updateStatus('摄像头已启动 (默认设置)');
      this.hideError();
    } catch (error) {
      this.showError('即使使用默认设置也无法访问摄像头。');
    }
  }
  
  // 获取当前视频帧作为图片
  captureFrame() {
    if (!this.stream) {
      this.showError('摄像头未启动，无法捕获图像');
      return null;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoElement, 0, 0);
    
    return canvas.toDataURL('image/png');
  }
  
  // 切换前后摄像头
  async switchCamera() {
    if (!this.stream) return;
    
    // 停止当前摄像头
    this.stopCamera();
    
    // 获取所有摄像头设备
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    if (videoDevices.length > 1) {
      // 如果有多个摄像头，切换下一个
      const currentFacingMode = this.videoElement.srcObject 
        ? this.videoElement.srcObject.getVideoTracks()[0].getSettings().facingMode 
        : 'user';
      
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
      
      // 重新启动摄像头
      setTimeout(() => this.startCamera(), 300);
    }
  }
}

// 页面加载完成后初始化摄像头控制器
document.addEventListener('DOMContentLoaded', () => {
  window.cameraController = new CameraController();
  
  // 页面离开时自动关闭摄像头
  window.addEventListener('beforeunload', () => {
    if (window.cameraController && window.cameraController.stream) {
      window.cameraController.stopCamera();
    }
  });
});

// 导出API供其他脚本使用
export { CameraController };