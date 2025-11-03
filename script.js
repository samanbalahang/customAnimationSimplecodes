// Create video frame extractor and scroll animation

class VideoScrollAnimation {
    constructor(videoPath, containerId, options = {}) {
        this.videoPath = videoPath;
        this.containerId = containerId;
        this.options = {
            totalFrames: options.totalFrames || 60,
            quality: options.quality || 0.8,
            frameRate: options.frameRate || 24,
            ...options
        };
        
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.frames = [];
        this.currentFrame = 0;
        this.isVideoReady = false;
        
        this.init();
    }
    
    async init() {
        await this.setupVideo();
        this.setupCanvas();
        this.setupScrollListener();
        this.createContent();
    }
    
    setupVideo() {
        return new Promise((resolve) => {
            this.video = document.createElement('video');
            this.video.src = this.videoPath;
            this.video.crossOrigin = 'anonymous';
            this.video.muted = true;
            this.video.playsInline = true;
            
            // Don't autoplay, we just need it for frame extraction
            this.video.addEventListener('loadeddata', () => {
                console.log('Video loaded, duration:', this.video.duration);
                this.extractFrames().then(resolve);
            });
            
            this.video.addEventListener('error', (e) => {
                console.error('Video loading error:', e);
                this.createDemoFrames();
                resolve();
            });
            
            this.video.load();
        });
    }
    
    async extractFrames() {
        const frames = [];
        const duration = this.video.duration;
        const interval = duration / this.options.totalFrames;
        
        console.log('Extracting frames...');
        
        for (let i = 0; i < this.options.totalFrames; i++) {
            const time = i * interval;
            
            try {
                const frameData = await this.getVideoFrame(time);
                frames.push(frameData);
                
                // Update progress
                if (i % 10 === 0) {
                    console.log(`Extracted ${i}/${this.options.totalFrames} frames`);
                }
            } catch (error) {
                console.error('Error extracting frame:', error);
                // Create a colored frame as fallback
                frames.push(this.createColorFrame(i));
            }
        }
        
        this.frames = frames;
        this.isVideoReady = true;
        console.log('All frames extracted');
        this.drawFrame(0);
    }
    
    getVideoFrame(time) {
        return new Promise((resolve, reject) => {
            this.video.currentTime = time;
            
            const onSeeked = () => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.video.videoWidth || 800;
                tempCanvas.height = this.video.videoHeight || 450;
                const tempCtx = tempCanvas.getContext('2d');
                
                tempCtx.drawImage(this.video, 0, 0, tempCanvas.width, tempCanvas.height);
                
                // Remove event listener
                this.video.removeEventListener('seeked', onSeeked);
                
                resolve({
                    image: tempCanvas.toDataURL('image/jpeg', this.options.quality),
                    width: tempCanvas.width,
                    height: tempCanvas.height,
                    time: time
                });
            };
            
            this.video.addEventListener('seeked', onSeeked);
            
            // Timeout for frame extraction
            setTimeout(() => {
                this.video.removeEventListener('seeked', onSeeked);
                reject(new Error('Frame extraction timeout'));
            }, 1000);
        });
    }
    
    createColorFrame(index) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 800;
        tempCanvas.height = 450;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Create gradient based on frame index
        const hue = (index / this.options.totalFrames) * 360;
        const gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height);
        gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
        gradient.addColorStop(1, `hsl(${hue + 60}, 70%, 50%)`);
        
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Add frame info
        tempCtx.fillStyle = 'white';
        tempCtx.font = '20px Arial';
        tempCtx.textAlign = 'center';
        tempCtx.fillText(`Frame ${index + 1}`, tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.fillText(`Time: ${(index / this.options.totalFrames * this.video.duration).toFixed(1)}s`, 
                         tempCanvas.width / 2, tempCanvas.height / 2 + 30);
        
        return {
            image: tempCanvas.toDataURL('image/jpeg', this.options.quality),
            width: tempCanvas.width,
            height: tempCanvas.height,
            time: (index / this.options.totalFrames) * (this.video.duration || 10)
        };
    }
    
    createDemoFrames() {
        console.log('Creating demo frames');
        this.frames = [];
        
        for (let i = 0; i < this.options.totalFrames; i++) {
            this.frames.push(this.createColorFrame(i));
        }
        
        this.isVideoReady = true;
        this.drawFrame(0);
    }
    
    setupCanvas() {
        const container = document.getElementById(this.containerId);
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on first frame or default
        const firstFrame = this.frames[0] || { width: 800, height: 450 };
        this.canvas.width = firstFrame.width;
        this.canvas.height = firstFrame.height;
        
        this.canvas.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 80vh;
            border: 2px solid white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 1000;
        `;
        
        container.appendChild(this.canvas);
    }
    
    drawFrame(frameIndex) {
        if (!this.frames[frameIndex]) return;
        
        const frame = this.frames[frameIndex];
        
        // Create image from frame data
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.currentFrame = frameIndex;
            this.updateFrameInfo(frameIndex);
        };
        img.src = frame.image;
    }
    
    updateFrameInfo(frameIndex) {
        // Remove existing info if any
        const existingInfo = document.querySelector('.frame-info');
        if (existingInfo) existingInfo.remove();
        
        const frame = this.frames[frameIndex];
        const info = document.createElement('div');
        info.className = 'frame-info';
        info.innerHTML = `
            <div>Frame: ${frameIndex + 1}/${this.options.totalFrames}</div>
            <div>Time: ${frame.time ? frame.time.toFixed(2) + 's' : 'N/A'}</div>
            <div>Progress: ${Math.round((frameIndex / (this.options.totalFrames - 1)) * 100)}%</div>
        `;
        info.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            text-align: center;
            z-index: 1001;
        `;
        
        document.getElementById(this.containerId).appendChild(info);
    }
    
    setupScrollListener() {
        let scrollTimeout;
        
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
            
            // Calculate target frame based on scroll progress
            const targetFrame = Math.floor(scrollProgress * (this.options.totalFrames - 1));
            
            if (targetFrame !== this.currentFrame && this.frames[targetFrame]) {
                this.drawFrame(targetFrame);
            }
            
            // Update progress bar
            this.updateProgressBar(scrollProgress);
            
            // Throttle scroll events
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const finalFrame = Math.floor(scrollProgress * (this.options.totalFrames - 1));
                if (finalFrame !== this.currentFrame && this.frames[finalFrame]) {
                    this.drawFrame(finalFrame);
                }
            }, 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
    }
    
    updateProgressBar(progress) {
        let progressBar = document.querySelector('.scroll-progress');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 5px;
                background: rgba(255,255,255,0.2);
                z-index: 1001;
            `;
            
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.cssText = `
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
                transition: width 0.1s;
            `;
            
            progressBar.appendChild(progressFill);
            document.getElementById(this.containerId).appendChild(progressBar);
        }
        
        const progressFill = progressBar.querySelector('.progress-fill');
        progressFill.style.width = `${progress * 100}%`;
    }
    
    createContent() {
        const container = document.getElementById(this.containerId);
        
        // Add instruction
        const instruction = document.createElement('div');
        instruction.innerHTML = `
            <div style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); 
                       text-align: center; background: rgba(0,0,0,0.8); color: white; 
                       padding: 15px 25px; border-radius: 10px; z-index: 1001; font-family: Arial;">
                <h3>Scroll to Animate Video</h3>
                <p>Scroll down to play the video frame by frame</p>
                <p style="font-size: 12px; opacity: 0.8;">Frames: ${this.options.totalFrames} | Status: ${this.isVideoReady ? 'Ready' : 'Loading...'}</p>
            </div>
        `;
        container.appendChild(instruction);
        
        // Add scrollable content
        const content = document.createElement('div');
        content.style.cssText = `
            margin-top: 100vh;
            padding: 50px 20px;
            color: white;
            font-family: Arial;
        `;
        
        // Create scroll sections
        for (let i = 0; i < 15; i++) {
            const section = document.createElement('div');
            section.style.cssText = `
                height: 400px;
                margin: 40px 0;
                background: rgba(255,255,255,0.1);
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                backdrop-filter: blur(10px);
            `;
            section.textContent = `Scroll Section ${i + 1}`;
            content.appendChild(section);
        }
        
        container.appendChild(content);
    }
}

// Usage
document.addEventListener('DOMContentLoaded', function() {
    // Create container
    const container = document.createElement('div');
    container.id = 'video-scroll-container';
    container.style.cssText = `
        min-height: 100vh;
        background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
    `;
    document.body.appendChild(container);
    
    // Initialize video scroll animation
    const videoScroll = new VideoScrollAnimation(
        'your-video.mp4', // Replace with your video path
        'video-scroll-container',
        {
            totalFrames: 60,    // More frames = smoother but heavier
            quality: 0.8,       // Image quality (0.1 - 1.0)
            frameRate: 24       // Not used directly but good for reference
        }
    );
});