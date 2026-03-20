class PhotoEditorPro {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeNavigation();
        this.initializeImageResizer();
    }

    initializeElements() {
        // Navigation elements
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.featureBtns = document.querySelectorAll('.feature-btn');
        
        // Background remover elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.processingSection = document.getElementById('processingSection');
        this.resultSection = document.getElementById('resultSection');
        this.originalImage = document.getElementById('originalImage');
        this.resultCanvas = document.getElementById('resultCanvas');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.newImageBtn = document.getElementById('newImageBtn');
        this.bgColorPicker = document.getElementById('bgColorPicker');
        this.transparentBtn = document.getElementById('transparentBtn');
        this.formatSelect = document.getElementById('formatSelect');
        this.colorPresets = document.querySelectorAll('.color-preset');
        this.bgImageInput = document.getElementById('bgImageInput');
        this.bgImageBtn = document.getElementById('bgImageBtn');
        this.clearBgImageBtn = document.getElementById('clearBgImageBtn');
        
        // Store original canvas data
        this.originalImageData = null;
        this.currentBackground = 'transparent';
        this.backgroundImage = null;
    }

    initializeNavigation() {
        // Handle navigation clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                this.showSection(targetSection);
            });
        });

        // Handle feature button clicks
        this.featureBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTool = btn.getAttribute('data-tool');
                this.showSection(targetTool);
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to corresponding nav link
        const activeNavLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
    }

    initializeImageResizer() {
        // Image resizer elements
        this.resizeUploadArea = document.getElementById('resizeUploadArea');
        this.resizeFileInput = document.getElementById('resizeFileInput');
        this.resizeControlsSection = document.getElementById('resizeControlsSection');
        this.resizeOriginalImage = document.getElementById('resizeOriginalImage');
        this.resizePreviewCanvas = document.getElementById('resizePreviewCanvas');
        this.widthInput = document.getElementById('widthInput');
        this.heightInput = document.getElementById('heightInput');
        this.maintainAspectRatio = document.getElementById('maintainAspectRatio');
        this.resizeFormatSelect = document.getElementById('resizeFormatSelect');
        this.resizeDownloadBtn = document.getElementById('resizeDownloadBtn');
        this.resizeNewImageBtn = document.getElementById('resizeNewImageBtn');
        this.processBatchBtn = document.getElementById('processBatchBtn');
        this.presetBtns = document.querySelectorAll('.preset-btn');
        this.resizeMethodSelect = document.getElementById('resizeMethodSelect');
        this.dpiInput = document.getElementById('dpiInput');
        this.fileSizeInput = document.getElementById('fileSizeInput');
        this.fileSizeUnit = document.getElementById('fileSizeUnit');
        this.enableFileSizeTarget = document.getElementById('enableFileSizeTarget');
        this.actualFileSize = document.getElementById('actualFileSize');
        this.resizePreviewBtn = document.getElementById('resizePreviewBtn');
        this.fitMethodRadios = document.querySelectorAll('input[name="fitMethod"]');
        this.qualityInput = document.getElementById('qualityInput');
        this.qualityValue = document.getElementById('qualityValue');
        this.compressionMethod = document.getElementById('compressionMethod');
        this.addImageBtn = document.getElementById('addImageBtn');
        this.clearBatchBtn = document.getElementById('clearBatchBtn');
        this.batchList = document.getElementById('batchList');
        
        // Image resizer data
        this.resizeOriginalImageData = null;
        this.originalWidth = 0;
        this.originalHeight = 0;
        this.aspectRatio = 1;
        this.currentMethod = 'pixels';
        this.currentFitMethod = 'none';
        this.batchImages = [];
        this.currentQuality = 90;
        this.currentCompressionMethod = 'auto';
        
        this.bindImageResizerEvents();
    }

    bindImageResizerEvents() {
        // Upload events
        this.resizeUploadArea.addEventListener('click', () => this.resizeFileInput.click());
        this.resizeFileInput.addEventListener('change', (e) => this.handleResizeFileSelect(e));
        this.resizeUploadArea.addEventListener('dragover', (e) => this.handleResizeDragOver(e));
        this.resizeUploadArea.addEventListener('dragleave', (e) => this.handleResizeDragLeave(e));
        this.resizeUploadArea.addEventListener('drop', (e) => this.handleResizeDrop(e));

        // Dimension inputs
        this.widthInput.addEventListener('input', () => this.handleDimensionChange('width'));
        this.heightInput.addEventListener('input', () => this.handleDimensionChange('height'));
        
        // Method change
        this.resizeMethodSelect.addEventListener('change', () => this.handleMethodChange());
        
        // Fit method change
        this.fitMethodRadios.forEach(radio => {
            radio.addEventListener('change', () => this.handleFitMethodChange());
        });
        
        // Quality change
        this.qualityInput.addEventListener('input', () => {
            this.currentQuality = parseInt(this.qualityInput.value);
            this.qualityValue.textContent = `${this.currentQuality}%`;
            this.updateResizePreview();
        });
        
        // Compression method change
        this.compressionMethod.addEventListener('change', () => {
            this.currentCompressionMethod = this.compressionMethod.value;
            this.updateResizePreview();
        });
        
        // Batch controls
        this.addImageBtn.addEventListener('click', () => this.addBatchImage());
        this.clearBatchBtn.addEventListener('click', () => this.clearBatchImages());
        
        // DPI change
        this.dpiInput.addEventListener('input', () => this.updateResizePreview());
        
        // File size target change
        this.fileSizeInput.addEventListener('input', () => this.updateResizePreview());
        this.fileSizeUnit.addEventListener('change', () => this.updateResizePreview());
        this.enableFileSizeTarget.addEventListener('change', () => this.updateResizePreview());

        // Preset buttons
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const width = parseInt(btn.getAttribute('data-width'));
                const height = parseInt(btn.getAttribute('data-height'));
                this.setDimensions(width, height);
            });
        });

        // Action buttons
        this.resizeDownloadBtn.addEventListener('click', () => this.downloadResizedImage());
        this.resizeNewImageBtn.addEventListener('click', () => this.resetImageResizer());
        this.processBatchBtn.addEventListener('click', () => this.processAllBatchImages());
        this.resizePreviewBtn.addEventListener('click', () => this.resizeImage());
    }

    handleResizeFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processResizeFile(files[0]);
        }
    }

    handleResizeDragOver(e) {
        e.preventDefault();
        this.resizeUploadArea.classList.add('dragover');
    }

    handleResizeDragLeave(e) {
        e.preventDefault();
        this.resizeUploadArea.classList.remove('dragover');
    }

    handleResizeDrop(e) {
        e.preventDefault();
        this.resizeUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processResizeFile(files[0]);
        }
    }

    processResizeFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.setupImageResizer(img, e.target.result);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    setupImageResizer(img, imageSrc) {
        // Store original data
        this.resizeOriginalImageData = img;
        this.originalWidth = img.width;
        this.originalHeight = img.height;
        this.aspectRatio = img.width / img.height;

        // Display original image
        this.resizeOriginalImage.src = imageSrc;

        // Set initial dimensions
        this.setDimensions(img.width, img.height);

        // Update info
        this.updateImageInfo();

        // Show controls
        this.resizeUploadArea.style.display = 'none';
        this.resizeControlsSection.style.display = 'block';

        // Update preview
        this.updateResizePreview();
    }

    setDimensions(width, height) {
        this.widthInput.value = width;
        this.heightInput.value = height;
        this.updateResizePreview();
        this.updateImageInfo();
    }

    handleDimensionChange(changedDimension) {
        if (!this.maintainAspectRatio.checked) return;

        if (changedDimension === 'width') {
            const newWidth = parseInt(this.widthInput.value);
            const newHeight = Math.round(newWidth / this.aspectRatio);
            this.heightInput.value = newHeight;
        } else {
            const newHeight = parseInt(this.heightInput.value);
            const newWidth = Math.round(newHeight * this.aspectRatio);
            this.widthInput.value = newWidth;
        }

        this.updateResizePreview();
        this.updateImageInfo();
    }

    handleMethodChange() {
        this.currentMethod = this.resizeMethodSelect.value;
        
        // Update units based on method
        let widthUnit, heightUnit;
        
        switch(this.currentMethod) {
            case 'pixels':
                widthUnit = heightUnit = 'px';
                // Reset to original pixel dimensions
                this.setDimensions(this.originalWidth, this.originalHeight);
                break;
            case 'percentage':
                widthUnit = heightUnit = '%';
                // Convert to 100% for both dimensions
                this.widthInput.value = 100;
                this.heightInput.value = 100;
                break;
            case 'centimeters':
                widthUnit = heightUnit = 'cm';
                // Convert original pixels to centimeters
                const dpi = parseInt(this.dpiInput.value);
                const cmWidth = (this.originalWidth / dpi) * 2.54;
                const cmHeight = (this.originalHeight / dpi) * 2.54;
                this.widthInput.value = cmWidth.toFixed(1);
                this.heightInput.value = cmHeight.toFixed(1);
                break;
            case 'inches':
                widthUnit = heightUnit = 'in';
                // Convert original pixels to inches
                const inchDpi = parseInt(this.dpiInput.value);
                const inchWidth = this.originalWidth / inchDpi;
                const inchHeight = this.originalHeight / inchDpi;
                this.widthInput.value = inchWidth.toFixed(2);
                this.heightInput.value = inchHeight.toFixed(2);
                break;
        }
        
        document.getElementById('widthUnit').textContent = widthUnit;
        document.getElementById('heightUnit').textContent = heightUnit;
        
        this.updateResizePreview();
        this.updateImageInfo();
    }

    convertToPixels(value, unit) {
        const dpi = parseInt(this.dpiInput.value);
        
        switch(unit) {
            case 'pixels':
                return value;
            case 'percentage':
                return Math.round(this.originalWidth * (value / 100));
            case 'centimeters':
                return Math.round((value / 2.54) * dpi);
            case 'inches':
                return Math.round(value * dpi);
            default:
                return value;
        }
    }

    getPixelDimensions() {
        const width = parseFloat(this.widthInput.value);
        const height = parseFloat(this.heightInput.value);
        
        return {
            width: this.convertToPixels(width, this.currentMethod),
            height: this.convertToPixels(height, this.currentMethod)
        };
    }

    handleFitMethodChange() {
        const selectedRadio = document.querySelector('input[name="fitMethod"]:checked');
        this.currentFitMethod = selectedRadio ? selectedRadio.value : 'none';
        console.log('Fit method changed to:', this.currentFitMethod);
        this.updateResizePreview();
    }

    updateResizePreview() {
        if (!this.resizeOriginalImageData) return;

        const canvas = this.resizePreviewCanvas;
        const ctx = canvas.getContext('2d');

        // Get target dimensions based on current method
        const pixelDims = this.getPixelDimensions();
        let targetWidth = pixelDims.width;
        let targetHeight = pixelDims.height;

        // Apply fit method adjustments
        const fitResult = this.applyFitMethod(targetWidth, targetHeight);
        targetWidth = fitResult.width;
        targetHeight = fitResult.height;

        // Check if file size target is enabled
        if (this.enableFileSizeTarget.checked) {
            const targetSize = this.getTargetFileSizeBytes();
            const currentSize = this.estimateFileSizeBytes(targetWidth, targetHeight);
            
            if (currentSize > targetSize) {
                // Calculate quality factor to meet target size
                const qualityFactor = Math.sqrt(targetSize / currentSize);
                targetWidth = Math.round(targetWidth * qualityFactor);
                targetHeight = Math.round(targetHeight * qualityFactor);
            }
        }

        // Set canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw resized image with appropriate fit method
        this.drawImageWithFitMethod(ctx, targetWidth, targetHeight);
    }

    applyFitMethod(width, height) {
        const originalAspect = this.originalWidth / this.originalHeight;
        const targetAspect = width / height;
        
        switch(this.currentFitMethod) {
            case 'crop':
                // Crop to fit - maintain aspect ratio, use smaller dimension
                if (originalAspect > targetAspect) {
                    // Original is wider, use height as reference
                    return {
                        width: Math.round(height * originalAspect),
                        height: height
                    };
                } else {
                    // Original is taller, use width as reference
                    return {
                        width: width,
                        height: Math.round(width / originalAspect)
                    };
                }
                
            case 'stretch':
                // Stretch to fit - ignore aspect ratio
                return {
                    width: width,
                    height: height
                };
                
            case 'fit':
                // Fit within bounds - maintain aspect ratio, use smaller dimension
                if (originalAspect > targetAspect) {
                    // Original is wider, fit to height
                    return {
                        width: Math.round(height * originalAspect),
                        height: height
                    };
                } else {
                    // Original is taller, fit to width
                    return {
                        width: width,
                        height: Math.round(width / originalAspect)
                    };
                }
                
            case 'none':
            default:
                // No fit method - use specified dimensions
                return {
                    width: width,
                    height: height
                };
        }
    }

    drawImageWithFitMethod(ctx, width, height) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        switch(this.currentFitMethod) {
            case 'crop':
                // Calculate crop dimensions
                const cropResult = this.applyFitMethod(width, height);
                // Calculate crop position to center the image
                const cropX = (width - cropResult.width) / 2;
                const cropY = (height - cropResult.height) / 2;
                
                // Draw cropped image
                ctx.drawImage(this.resizeOriginalImageData, cropX, cropY, cropResult.width, cropResult.height, 0, 0, cropResult.width, cropResult.height);
                break;
                
            case 'stretch':
                // Draw stretched image
                ctx.drawImage(this.resizeOriginalImageData, 0, 0, width, height);
                break;
                
            case 'fit':
                // Calculate fit dimensions
                const fitResult = this.applyFitMethod(width, height);
                // Calculate fit position to center the image
                const fitX = (width - fitResult.width) / 2;
                const fitY = (height - fitResult.height) / 2;
                
                // Draw fitted image
                ctx.drawImage(this.resizeOriginalImageData, fitX, fitY, fitResult.width, fitResult.height, 0, 0, fitResult.width, fitResult.height);
                break;
                
            case 'none':
            default:
                // Draw image normally
                ctx.drawImage(this.resizeOriginalImageData, 0, 0, width, height);
                break;
        }
    }

    getTargetFileSizeBytes() {
        const sizeValue = parseFloat(this.fileSizeInput.value);
        const unit = this.fileSizeUnit.value;
        
        if (unit === 'KB') {
            return sizeValue * 1024;
        } else if (unit === 'MB') {
            return sizeValue * 1024 * 1024;
        }
        return sizeValue * 1024; // Default to KB
    }

    estimateFileSizeBytes(width, height) {
        // More accurate estimation based on typical compression ratios
        const pixels = width * height;
        
        // Base estimation varies by format
        // JPEG: ~0.5-2 bytes per pixel depending on content
        // PNG: ~1-4 bytes per pixel depending on complexity
        // WebP: ~0.4-1.5 bytes per pixel
        
        // Use conservative estimate for general case
        return pixels * 1.2; // Average case estimation
    }

    updateImageInfo() {
        // Update original image info
        const originalSize = this.estimateFileSize(this.originalWidth, this.originalHeight);
        document.getElementById('originalDimensions').textContent = `Dimensions: ${this.originalWidth} x ${this.originalHeight}`;
        document.getElementById('originalSize').textContent = `Size: ${originalSize}`;

        // Get current pixel dimensions
        const pixelDims = this.getPixelDimensions();
        let newWidth = pixelDims.width;
        let newHeight = pixelDims.height;

        // Check if file size target is enabled and adjust dimensions
        if (this.enableFileSizeTarget.checked) {
            const targetSize = this.getTargetFileSizeBytes();
            const currentSize = this.estimateFileSizeBytes(newWidth, newHeight);
            
            if (currentSize > targetSize) {
                const qualityFactor = Math.sqrt(targetSize / currentSize);
                newWidth = Math.round(newWidth * qualityFactor);
                newHeight = Math.round(newHeight * qualityFactor);
            }
        }

        const newSize = this.estimateFileSize(newWidth, newHeight);
        document.getElementById('newDimensions').textContent = `Dimensions: ${newWidth} x ${newHeight}`;
        document.getElementById('newSize').textContent = `Size: ~${newSize}`;
        
        // Update actual file size display
        this.updateActualFileSize(newWidth, newHeight);
    }

    updateActualFileSize(width, height) {
        const actualSize = this.estimateFileSizeBytes(width, height);
        this.updateActualFileSizeDisplay(actualSize);
    }

    updateActualFileSizeDisplay(actualSize, targetSize = null) {
        const actualSizeKB = actualSize / 1024;
        let displaySize;
        
        if (actualSizeKB < 1024) {
            displaySize = `${actualSizeKB.toFixed(1)} KB`;
        } else {
            displaySize = `${(actualSizeKB / 1024).toFixed(2)} MB`;
        }
        
        this.actualFileSize.textContent = `Actual: ~${displaySize}`;
        
        // Color code based on target
        if (targetSize && this.enableFileSizeTarget.checked) {
            const accuracy = ((actualSize / targetSize) * 100).toFixed(1);
            this.actualFileSize.textContent += ` (${accuracy}% of target)`;
            
            if (actualSize > targetSize * 1.1) {
                this.actualFileSize.style.color = '#e74c3c'; // Red - too large
            } else if (actualSize < targetSize * 0.9) {
                this.actualFileSize.style.color = '#f39c12'; // Orange - too small
            } else {
                this.actualFileSize.style.color = '#27ae60'; // Green - good
            }
        } else if (targetSize && this.enableFileSizeTarget.checked) {
            this.actualFileSize.style.color = '#667eea'; // Default blue
        }
    }

    resizeImage() {
        // Apply the resize with current settings
        this.updateResizePreview();
        
        // Show success feedback
        const originalText = this.resizePreviewBtn.textContent;
        this.resizePreviewBtn.textContent = 'Resized!';
        this.resizePreviewBtn.style.background = '#27ae60';
        this.resizePreviewBtn.style.color = 'white';
        
        setTimeout(() => {
            this.resizePreviewBtn.textContent = originalText;
            this.resizePreviewBtn.style.background = '';
            this.resizePreviewBtn.style.color = '';
        }, 2000);
    }

    estimateFileSize(width, height) {
        // Rough estimation in KB
        const pixels = width * height;
        const bytes = pixels * 3; // 3 bytes per pixel (RGB)
        const kb = bytes / 1024;
        
        if (kb < 1024) {
            return `${Math.round(kb)} KB`;
        } else {
            return `${(kb / 1024).toFixed(1)} MB`;
        }
    }

    downloadResizedImage() {
        const canvas = this.resizePreviewCanvas;
        const format = this.resizeFormatSelect.value;
        
        let mimeType = 'image/png';
        if (format === 'jpeg' || format === 'jpg') {
            mimeType = 'image/jpeg';
        } else if (format === 'webp') {
            mimeType = 'image/webp';
        }

        let quality = this.currentQuality / 100;
        let finalDataUrl;

        if (this.enableFileSizeTarget.checked) {
            const targetSize = this.getTargetFileSizeBytes();
            
            // For PNG, we need to resize dimensions to meet target
            if (format === 'png') {
                finalDataUrl = this.optimizePngSize(canvas, targetSize);
            } else {
                // For JPEG/WebP, we can adjust quality
                finalDataUrl = this.optimizeQualitySize(canvas, mimeType, targetSize);
            }
            
            // Update actual size display with final optimized size
            const finalSize = this.getDataUrlSize(finalDataUrl);
            this.updateActualFileSizeDisplay(finalSize, targetSize);
        } else {
            // No target size, use original quality
            if (this.currentCompressionMethod === 'lossless') {
                finalDataUrl = canvas.toDataURL('image/png');
            } else if (this.currentCompressionMethod === 'lossy') {
                finalDataUrl = canvas.toDataURL(mimeType, quality);
            } else {
                // Auto mode - choose best method based on format
                if (format === 'png') {
                    finalDataUrl = canvas.toDataURL('image/png');
                } else {
                    finalDataUrl = canvas.toDataURL(mimeType, quality);
                }
            }
        }

        const link = document.createElement('a');
        link.download = `resized-image.${format}`;
        link.href = finalDataUrl;
        link.click();
    }

    optimizePngSize(canvas, targetSize) {
        // For PNG, we need to resize the image to meet target size
        let currentWidth = canvas.width;
        let currentHeight = canvas.height;
        let scaleFactor = 1;
        
        // Calculate required scale factor
        const currentSize = this.estimateFileSizeBytes(currentWidth, currentHeight);
        if (currentSize > targetSize) {
            scaleFactor = Math.sqrt(targetSize / currentSize);
        }
        
        // Create new canvas with optimized dimensions
        const optimizedCanvas = document.createElement('canvas');
        const optimizedCtx = optimizedCanvas.getContext('2d');
        
        optimizedCanvas.width = Math.round(currentWidth * scaleFactor);
        optimizedCanvas.height = Math.round(currentHeight * scaleFactor);
        
        // Draw scaled image
        optimizedCtx.drawImage(canvas, 0, 0, optimizedCanvas.width, optimizedCanvas.height);
        
        return optimizedCanvas.toDataURL('image/png');
    }

    optimizeQualitySize(canvas, mimeType, targetSize) {
        let quality = 0.9;
        let dataUrl = canvas.toDataURL(mimeType, quality);
        let currentSize = this.getDataUrlSize(dataUrl);
        
        console.log(`Initial: Quality ${quality}, Size ${(currentSize / 1024).toFixed(1)} KB, Target ${(targetSize / 1024).toFixed(1)} KB`);
        
        // Check if we can reach target size with current dimensions
        const maxQualitySize = this.getDataUrlSize(canvas.toDataURL(mimeType, 0.9));
        
        // If even at max quality we're way below target, we need to upscale
        if (maxQualitySize < targetSize * 0.8) {
            console.log(`Image too small for target. Upscaling required.`);
            
            // Calculate required scale factor to reach target size
            const scaleFactor = Math.sqrt(targetSize / maxQualitySize) * 1.3; // Increased buffer
            
            console.log(`Scale factor: ${scaleFactor.toFixed(2)}`);
            
            // Create upscaled canvas
            const upscaledCanvas = document.createElement('canvas');
            const upscaledCtx = upscaledCanvas.getContext('2d');
            
            const newWidth = Math.round(canvas.width * scaleFactor);
            const newHeight = Math.round(canvas.height * scaleFactor);
            
            console.log(`Upscaling to: ${newWidth}x${newHeight}`);
            
            upscaledCanvas.width = newWidth;
            upscaledCanvas.height = newHeight;
            
            // Enable image smoothing for better quality
            upscaledCtx.imageSmoothingEnabled = true;
            upscaledCtx.imageSmoothingQuality = 'high';
            
            // Draw upscaled image
            upscaledCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
            
            // Check if upscaled image can reach target
            const upscaledMaxSize = this.getDataUrlSize(upscaledCanvas.toDataURL(mimeType, 0.9));
            console.log(`Upscaled max quality size: ${(upscaledMaxSize / 1024).toFixed(1)} KB`);
            
            // Now optimize quality on the upscaled image (non-recursive)
            return this.optimizeQualityForCanvas(upscaledCanvas, mimeType, targetSize);
        }
        
        // Use current canvas for optimization
        return this.optimizeQualityForCanvas(canvas, mimeType, targetSize);
    }

    optimizeQualityForCanvas(canvas, mimeType, targetSize) {
        let quality = 0.9;
        let dataUrl = canvas.toDataURL(mimeType, quality);
        let currentSize = this.getDataUrlSize(dataUrl);
        
        // Binary search for optimal quality
        let minQuality = 0.1;
        let maxQuality = 0.9;
        let bestQuality = quality;
        let bestSize = currentSize;
        let iterations = 0;
        const maxIterations = 25; // Increased iterations for better accuracy
        
        // Target 98% of target size
        const targetSize98 = targetSize * 0.98;
        const tolerance = targetSize * 0.01; // 1% tolerance
        
        console.log(`Targeting 98%: ${(targetSize98 / 1024).toFixed(1)} KB ±${(tolerance / 1024).toFixed(1)} KB`);
        
        while (iterations < maxIterations && Math.abs(currentSize - targetSize98) > tolerance) {
            if (currentSize > targetSize98) {
                maxQuality = quality;
            } else {
                minQuality = quality;
                if (currentSize > bestSize && currentSize <= targetSize98) {
                    bestQuality = quality;
                    bestSize = currentSize;
                }
            }
            
            quality = (minQuality + maxQuality) / 2;
            dataUrl = canvas.toDataURL(mimeType, quality);
            currentSize = this.getDataUrlSize(dataUrl);
            iterations++;
            
            console.log(`Iteration ${iterations}: Quality ${quality.toFixed(3)}, Size ${(currentSize / 1024).toFixed(1)} KB, Target ${(targetSize98 / 1024).toFixed(1)} KB`);
        }
        
        // Use the best quality that gets closest to 98% target
        if (Math.abs(bestSize - targetSize98) < Math.abs(currentSize - targetSize98)) {
            dataUrl = canvas.toDataURL(mimeType, bestQuality);
            currentSize = bestSize;
        }
        
        // Final adjustment to get as close as possible to 98%
        if (Math.abs(currentSize - targetSize98) > tolerance) {
            // Fine-tune quality for final adjustment
            let fineQuality = quality;
            let fineStep = 0.005; // Finer steps
            
            // Determine direction
            if (currentSize < targetSize98) {
                // Need to increase size, increase quality
                while (fineQuality < 0.9 && currentSize < targetSize98) {
                    fineQuality = Math.min(0.9, fineQuality + fineStep);
                    dataUrl = canvas.toDataURL(mimeType, fineQuality);
                    const newSize = this.getDataUrlSize(dataUrl);
                    
                    if (newSize > targetSize98) {
                        break; // Overshot, use previous
                    }
                    currentSize = newSize;
                    quality = fineQuality;
                }
            } else {
                // Need to decrease size, decrease quality
                while (fineQuality > 0.1 && currentSize > targetSize98) {
                    fineQuality = Math.max(0.1, fineQuality - fineStep);
                    dataUrl = canvas.toDataURL(mimeType, fineQuality);
                    const newSize = this.getDataUrlSize(dataUrl);
                    
                    if (newSize < targetSize98) {
                        break; // Undershot, use previous
                    }
                    currentSize = newSize;
                    quality = fineQuality;
                }
            }
        }
        
        // Show final results
        const targetKB = targetSize / 1024;
        const actualKB = currentSize / 1024;
        const target98KB = targetSize98 / 1024;
        const accuracy = ((currentSize / targetSize) * 100).toFixed(1);
        const accuracy98 = ((currentSize / targetSize98) * 100).toFixed(1);
        
        console.log(`Final result - Original Target: ${targetKB.toFixed(1)} KB, 98% Target: ${target98KB.toFixed(1)} KB`);
        console.log(`Actual: ${actualKB.toFixed(1)} KB (${accuracy}% of original, ${accuracy98}% of 98% target)`);
        
        return dataUrl;
    }

    getDataUrlSize(dataUrl) {
        // Remove the data URL prefix to get the base64 string
        const base64 = dataUrl.split(',')[1];
        return base64.length * 0.75; // Approximate size of base64 decoded data
    }

    addBatchImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            this.batchImages.push({
                                name: file.name,
                                data: img,
                                originalWidth: img.width,
                                originalHeight: img.height
                            });
                            this.updateBatchList();
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
        
        input.click();
    }

    clearBatchImages() {
        this.batchImages = [];
        this.updateBatchList();
    }

    updateBatchList() {
        if (this.batchImages.length === 0) {
            this.batchList.innerHTML = '<div class="batch-item"><span class="batch-name">No images added</span></div>';
        } else {
            this.batchList.innerHTML = this.batchImages.map((img, index) => `
                <div class="batch-item">
                    <span class="batch-name">${img.name} (${img.originalWidth}×${img.originalHeight})</span>
                    <span class="batch-size">${this.estimateFileSize(img.originalWidth, img.originalHeight)}</span>
                </div>
            `).join('');
        }
    }

    processAllBatchImages() {
        if (this.batchImages.length === 0) {
            alert('Please add images to batch process first');
            return;
        }
        
        // Process each image with current settings
        this.batchImages.forEach((batchImg, index) => {
            setTimeout(() => {
                console.log(`Processing batch image ${index + 1}: ${batchImg.name}`);
                
                // Create temporary canvas for this image
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                
                // Apply current resize settings
                const pixelDims = this.getPixelDimensions();
                const fitResult = this.applyFitMethod(pixelDims.width, pixelDims.height);
                
                tempCanvas.width = fitResult.width;
                tempCanvas.height = fitResult.height;
                
                // Draw with fit method
                this.drawImageWithFitMethod(tempCtx, fitResult.width, fitResult.height);
                
                // Download processed image
                const format = this.resizeFormatSelect.value;
                let mimeType = 'image/png';
                if (format === 'jpeg' || format === 'jpg') {
                    mimeType = 'image/jpeg';
                } else if (format === 'webp') {
                    mimeType = 'image/webp';
                }
                
                const link = document.createElement('a');
                link.download = `resized-${index + 1}-${batchImg.name.split('.')[0]}.${format}`;
                link.href = tempCanvas.toDataURL(mimeType, this.currentQuality / 100);
                link.click();
                
                console.log(`Downloaded: resized-${index + 1}-${batchImg.name.split('.')[0]}.${format}`);
            }, index * 200); // Process each image with 200ms delay
        });
    }

    bindEvents() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Button events
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
        this.newImageBtn.addEventListener('click', () => this.resetToUpload());
        
        // Background color events
        this.bgColorPicker.addEventListener('change', (e) => this.changeBackgroundColor(e.target.value));
        this.transparentBtn.addEventListener('click', () => this.changeBackgroundColor('transparent'));
        
        // Background image events
        this.bgImageBtn.addEventListener('click', () => {
            console.log('Background image button clicked');
            this.bgImageInput.click();
        });
        this.bgImageInput.addEventListener('change', (e) => this.handleBackgroundImageUpload(e));
        this.clearBgImageBtn.addEventListener('click', () => this.clearBackgroundImage());
        
        // Color preset events
        this.colorPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.getAttribute('data-color');
                if (color === 'custom') {
                    // Open color picker for custom color
                    this.bgColorPicker.click();
                } else {
                    this.bgColorPicker.value = color;
                    this.changeBackgroundColor(color);
                }
            });
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage.src = e.target.result;
            this.showProcessing();
            
            // Process the image after a short delay to show loading state
            setTimeout(() => {
                this.removeBackground(e.target.result);
            }, 1000);
        };
        reader.readAsDataURL(file);
    }

    showProcessing() {
        this.uploadArea.style.display = 'none';
        this.processingSection.style.display = 'block';
        this.resultSection.style.display = 'none';
    }

    showResult() {
        this.uploadArea.style.display = 'none';
        this.processingSection.style.display = 'none';
        this.resultSection.style.display = 'block';
    }

    removeBackground(imageSrc) {
        const img = new Image();
        img.onload = () => {
            // Display original image
            this.originalImage.src = imageSrc;
            
            // Convert image to blob for API upload
            this.convertImageToBlob(imageSrc)
                .then(blob => this.callRemoveBgAPI(blob))
                .catch(error => {
                    console.error('Error:', error);
                    // Fallback to local algorithm if API fails
                    this.removeBackgroundLocal(imageSrc);
                });
        };
        img.src = imageSrc;
    }

    convertImageToBlob(imageSrc) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(resolve, 'image/png');
            };
            img.onerror = reject;
            img.src = imageSrc;
        });
    }

    async callRemoveBgAPI(imageBlob) {
        const apiKey = 'zcE7jE5SD6a2EeHTiT3gKAiY';
        const formData = new FormData();
        formData.append('image_file', imageBlob);
        formData.append('size', 'auto');
        formData.append('type', 'person');

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': apiKey,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const resultBlob = await response.blob();
            this.displayAPIResult(resultBlob);
        } catch (error) {
            console.error('Remove.bg API error:', error);
            throw error;
        }
    }

    displayAPIResult(resultBlob) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = this.resultCanvas;
                const ctx = canvas.getContext('2d');
                
                // Set canvas dimensions to match image
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Set initial transparent background with checkerboard
                canvas.style.backgroundColor = 'transparent';
                canvas.style.backgroundImage = 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)';
                canvas.style.backgroundSize = '20px 20px';
                canvas.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
                
                // Draw the result image
                ctx.drawImage(img, 0, 0);
                
                // Store original image data for background changes
                this.originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Show the result
                this.showResult();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(resultBlob);
    }

    changeBackgroundColor(color) {
        if (!this.originalImageData) return;
        
        const canvas = this.resultCanvas;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (color === 'transparent') {
            // Remove checkerboard background for transparent
            canvas.style.background = 'none';
            canvas.style.backgroundImage = 'none';
            canvas.style.backgroundColor = 'transparent';
            
            // Just draw the original image with transparency
            ctx.putImageData(this.originalImageData, 0, 0);
            this.currentBackground = 'transparent';
        } else {
            // Add solid background for color preview
            canvas.style.background = 'none';
            canvas.style.backgroundImage = 'none';
            canvas.style.backgroundColor = color;
            
            // Fill background with selected color first
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw the original image on top with proper alpha blending
            ctx.putImageData(this.originalImageData, 0, 0);
            this.currentBackground = color;
        }
        
        // Clear background image when color is selected
        this.backgroundImage = null;
        this.clearBgImageBtn.style.display = 'none';
        
        // Force canvas redraw
        ctx.drawImage(canvas, 0, 0);
    }

    handleBackgroundImageUpload(e) {
        console.log('handleBackgroundImageUpload called');
        const files = e.target.files;
        console.log('Files:', files);
        
        if (files.length > 0) {
            const file = files[0];
            console.log('File:', file.name, file.type);
            
            if (file.type.startsWith('image/')) {
                console.log('Reading file...');
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    console.log('File read complete');
                    const img = new Image();
                    
                    img.onload = () => {
                        console.log('Image loaded, dimensions:', img.width, 'x', img.height);
                        this.backgroundImage = img;
                        
                        // Apply background image immediately
                        setTimeout(() => {
                            this.applyBackgroundImage();
                            this.clearBgImageBtn.style.display = 'inline-block';
                        }, 100);
                    };
                    
                    img.onerror = () => {
                        console.error('Failed to load background image');
                        alert('Failed to load the background image. Please try a different image.');
                    };
                    
                    img.src = event.target.result;
                };
                
                reader.onerror = () => {
                    console.error('Failed to read file');
                    alert('Failed to read the file. Please try again.');
                };
                
                reader.readAsDataURL(file);
            } else {
                console.error('File is not an image');
                alert('Please select an image file.');
            }
        } else {
            console.error('No files selected');
        }
        
        // Reset the file input
        e.target.value = '';
    }

    applyBackgroundImage() {
        console.log('applyBackgroundImage called');
        console.log('originalImageData exists:', !!this.originalImageData);
        console.log('backgroundImage exists:', !!this.backgroundImage);
        
        if (!this.originalImageData || !this.backgroundImage) {
            console.log('Missing originalImageData or backgroundImage');
            alert('Please remove the background from an image first before adding a background image.');
            return;
        }
        
        const canvas = this.resultCanvas;
        const ctx = canvas.getContext('2d');
        
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        console.log('Background image dimensions:', this.backgroundImage.width, 'x', this.backgroundImage.height);
        
        // Clear canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Remove any solid background
        canvas.style.background = 'none';
        canvas.style.backgroundImage = 'none';
        canvas.style.backgroundColor = 'transparent';
        
        // Draw background image to cover the entire canvas
        ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
        
        // Draw the original image on top
        ctx.putImageData(this.originalImageData, 0, 0);
        
        // Update current background state
        this.currentBackground = 'image';
        
        console.log('Background image applied successfully');
    }

    clearBackgroundImage() {
        console.log('Removing background image');
        this.backgroundImage = null;
        this.clearBgImageBtn.style.display = 'none';
        
        // Reset to transparent
        this.changeBackgroundColor('transparent');
        console.log('Background image removed, reset to transparent');
    }

    downloadResult() {
        const canvas = this.resultCanvas;
        const format = this.formatSelect.value;
        const link = document.createElement('a');
        
        // Set filename based on format
        const filename = `background-removed.${format}`;
        link.download = filename;
        
        if (format === 'png') {
            // PNG supports transparency
            link.href = canvas.toDataURL('image/png');
        } else if (format === 'jpeg' || format === 'jpg') {
            // JPEG doesn't support transparency, so we need to add a white background
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Add white background for JPEG
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Draw the original image on top
            tempCtx.drawImage(canvas, 0, 0);
            
            link.href = tempCanvas.toDataURL('image/jpeg', 0.95);
        }
        
        link.click();
    }

    removeBackgroundLocal(imageSrc) {
        // Fallback to local algorithm if API fails
        const img = new Image();
        img.onload = () => {
            const canvas = this.resultCanvas;
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the original image
            ctx.drawImage(img, 0, 0);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Apply background removal algorithm
            this.applyBackgroundRemoval(data, canvas.width, canvas.height);
            
            // Put the modified image data back
            ctx.putImageData(imageData, 0, 0);
            
            // Store original image data for background changes
            this.originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Show the result
            this.showResult();
        };
        img.src = imageSrc;
    }

    applyBackgroundRemoval(data, width, height) {
        // Advanced background removal algorithm
        // Uses edge detection and color analysis to identify foreground vs background
        
        // First pass: Identify dominant background colors from corners
        const cornerColors = this.getCornerColors(data, width, height);
        const backgroundColors = this.dominantBackgroundColors(cornerColors);
        
        // Second pass: Process each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Check if pixel is similar to background colors
                const isBackground = this.isBackgroundColor(r, g, b, backgroundColors);
                
                // Additional edge detection for better accuracy
                const isEdge = this.detectEdge(data, x, y, width, height);
                
                if (isBackground && !isEdge) {
                    // Make transparent
                    data[i + 3] = 0;
                } else {
                    // Keep pixel with full opacity
                    data[i + 3] = 255;
                }
            }
        }
    }

    getCornerColors(data, width, height) {
        const corners = [];
        const sampleSize = 10; // Sample 10x10 pixels from each corner
        
        // Top-left corner
        for (let y = 0; y < sampleSize; y++) {
            for (let x = 0; x < sampleSize; x++) {
                const i = (y * width + x) * 4;
                corners.push({
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2]
                });
            }
        }
        
        // Top-right corner
        for (let y = 0; y < sampleSize; y++) {
            for (let x = width - sampleSize; x < width; x++) {
                const i = (y * width + x) * 4;
                corners.push({
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2]
                });
            }
        }
        
        // Bottom-left corner
        for (let y = height - sampleSize; y < height; y++) {
            for (let x = 0; x < sampleSize; x++) {
                const i = (y * width + x) * 4;
                corners.push({
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2]
                });
            }
        }
        
        // Bottom-right corner
        for (let y = height - sampleSize; y < height; y++) {
            for (let x = width - sampleSize; x < width; x++) {
                const i = (y * width + x) * 4;
                corners.push({
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2]
                });
            }
        }
        
        return corners;
    }

    dominantBackgroundColors(cornerColors) {
        // Simple color clustering to find dominant background colors
        const colorMap = new Map();
        
        cornerColors.forEach(color => {
            // Round colors to reduce variations
            const roundedColor = {
                r: Math.round(color.r / 20) * 20,
                g: Math.round(color.g / 20) * 20,
                b: Math.round(color.b / 20) * 20
            };
            const key = `${roundedColor.r},${roundedColor.g},${roundedColor.b}`;
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
        });
        
        // Get top 3 most common colors
        const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([colorStr]) => {
                const [r, g, b] = colorStr.split(',').map(Number);
                return { r, g, b };
            });
        
        return sortedColors;
    }

    isBackgroundColor(r, g, b, backgroundColors) {
        // Check if pixel color is similar to any background color
        const threshold = 50; // Color similarity threshold
        
        return backgroundColors.some(bgColor => {
            const distance = Math.sqrt(
                Math.pow(r - bgColor.r, 2) +
                Math.pow(g - bgColor.g, 2) +
                Math.pow(b - bgColor.b, 2)
            );
            return distance < threshold;
        });
    }

    detectEdge(data, x, y, width, height) {
        // Simple edge detection using Sobel operator
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
            return false;
        }
        
        const getPixelBrightness = (px, py) => {
            const i = (py * width + px) * 4;
            return (data[i] + data[i + 1] + data[i + 2]) / 3;
        };
        
        // Calculate gradient
        const topLeft = getPixelBrightness(x - 1, y - 1);
        const top = getPixelBrightness(x, y - 1);
        const topRight = getPixelBrightness(x + 1, y - 1);
        const left = getPixelBrightness(x - 1, y);
        const right = getPixelBrightness(x + 1, y);
        const bottomLeft = getPixelBrightness(x - 1, y + 1);
        const bottom = getPixelBrightness(x, y + 1);
        const bottomRight = getPixelBrightness(x + 1, y + 1);
        
        const sobelX = (topRight + 2 * right + bottomRight) - (topLeft + 2 * left + bottomLeft);
        const sobelY = (bottomLeft + 2 * bottom + bottomRight) - (topLeft + 2 * top + topRight);
        
        const edgeStrength = Math.sqrt(sobelX * sobelX + sobelY * sobelY);
        
        return edgeStrength > 30; // Edge threshold
    }

    resetToUpload() {
        this.uploadArea.style.display = 'block';
        this.processingSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.fileInput.value = '';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotoEditorPro();
});
