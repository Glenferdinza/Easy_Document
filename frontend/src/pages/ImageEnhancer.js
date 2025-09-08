import React, { useState, useRef } from 'react';
import { Upload, Download, Settings, Sliders, Sparkles } from 'lucide-react';
import { 
  SharpenIcon, 
  NoiseReductionIcon, 
  UpscaleIcon, 
  ColorEnhanceIcon, 
  BrightnessIcon, 
  ContrastIcon,
  ImageEnhancerIcon 
} from '../components/Icons';
import './ImageEnhancer.css';

const ImageEnhancer = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [enhancementType, setEnhancementType] = useState('sharpen');
    const [parameters, setParameters] = useState({
        intensity: 1.0,
        scale_factor: 2.0,
        method: 'LANCZOS',
        saturation: 1.2,
        vibrance: 1.1,
        factor: 1.2,
        denoise_method: 'bilateral'
    });
    const [downloadUrl, setDownloadUrl] = useState(null);
    const fileInputRef = useRef(null);

    const enhancementTypes = {
        sharpen: {
            label: 'Sharpen',
            icon: SharpenIcon,
            description: 'Make your image crisp and detailed',
            params: ['intensity']
        },
        denoise: {
            label: 'Noise Reduction',
            icon: NoiseReductionIcon,
            description: 'Remove unwanted noise and grain',
            params: ['denoise_method']
        },
        upscale: {
            label: 'Upscale',
            icon: UpscaleIcon,
            description: 'Increase image resolution',
            params: ['scale_factor', 'method']
        },
        color_enhance: {
            label: 'Color Enhancement',
            icon: ColorEnhanceIcon,
            description: 'Boost colors and vibrancy',
            params: ['saturation', 'vibrance']
        },
        brightness: {
            label: 'Brightness',
            icon: BrightnessIcon,
            description: 'Adjust image brightness',
            params: ['factor']
        },
        contrast: {
            label: 'Contrast',
            icon: ContrastIcon,
            description: 'Enhance image contrast',
            params: ['factor']
        }
    };

    const handleFileUpload = (uploadedFile) => {
        if (uploadedFile) {
            setFile(uploadedFile);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(uploadedFile);
            setResult(null);
            setDownloadUrl(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            handleFileUpload(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const updateParameter = (param, value) => {
        setParameters(prev => ({
            ...prev,
            [param]: value
        }));
    };

    const enhanceImage = async () => {
        if (!file) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', enhancementType);

        // Add relevant parameters based on enhancement type
        const relevantParams = enhancementTypes[enhancementType].params;
        relevantParams.forEach(param => {
            if (param === 'denoise_method') {
                formData.append('method', parameters.denoise_method);
            } else {
                formData.append(param, parameters[param]);
            }
        });

        try {
            const response = await fetch('/api/image-processing/enhance/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setResult(url);
                setDownloadUrl(url);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const renderParameterControl = (param) => {
        switch (param) {
            case 'intensity':
                return (
                    <div className="parameter-control">
                        <label>Intensity: {parameters.intensity}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={parameters.intensity}
                            onChange={(e) => updateParameter('intensity', parseFloat(e.target.value))}
                        />
                    </div>
                );
            case 'scale_factor':
                return (
                    <div className="parameter-control">
                        <label>Scale Factor: {parameters.scale_factor}x</label>
                        <input
                            type="range"
                            min="1.1"
                            max="4.0"
                            step="0.1"
                            value={parameters.scale_factor}
                            onChange={(e) => updateParameter('scale_factor', parseFloat(e.target.value))}
                        />
                    </div>
                );
            case 'method':
                return (
                    <div className="parameter-control">
                        <label>Upscaling Method:</label>
                        <select
                            value={parameters.method}
                            onChange={(e) => updateParameter('method', e.target.value)}
                        >
                            <option value="LANCZOS">LANCZOS (Best Quality)</option>
                            <option value="BICUBIC">BICUBIC (Balanced)</option>
                            <option value="BILINEAR">BILINEAR (Fast)</option>
                        </select>
                    </div>
                );
            case 'saturation':
                return (
                    <div className="parameter-control">
                        <label>Saturation: {parameters.saturation}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={parameters.saturation}
                            onChange={(e) => updateParameter('saturation', parseFloat(e.target.value))}
                        />
                    </div>
                );
            case 'vibrance':
                return (
                    <div className="parameter-control">
                        <label>Vibrance: {parameters.vibrance}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={parameters.vibrance}
                            onChange={(e) => updateParameter('vibrance', parseFloat(e.target.value))}
                        />
                    </div>
                );
            case 'factor':
                return (
                    <div className="parameter-control">
                        <label>Factor: {parameters.factor}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={parameters.factor}
                            onChange={(e) => updateParameter('factor', parseFloat(e.target.value))}
                        />
                    </div>
                );
            case 'denoise_method':
                return (
                    <div className="parameter-control">
                        <label>Denoising Method:</label>
                        <select
                            value={parameters.denoise_method}
                            onChange={(e) => updateParameter('denoise_method', e.target.value)}
                        >
                            <option value="bilateral">Bilateral (Edge-preserving)</option>
                            <option value="gaussian">Gaussian (Simple)</option>
                        </select>
                    </div>
                );
            default:
                return null;
        }
    };

    const downloadResult = () => {
        if (downloadUrl) {
            const link = document.createElement('a');
            link.href = downloadUrl;
            const ext = enhancementType === 'upscale' ? 'png' : file.name.split('.').pop();
            link.download = `${file.name.split('.')[0]}_enhanced.${ext}`;
            link.click();
        }
    };

    return (
        <div className="image-enhancer">
            <div className="container">
                <h1 className="title">
                    <Sparkles className="title-icon" />
                    Image Enhancer
                </h1>
                <p className="subtitle">
                    Enhance your images with professional-grade algorithms
                </p>

                <div className="enhancement-types">
                    <h3>Choose Enhancement Type</h3>
                    <div className="type-grid">
                        {Object.entries(enhancementTypes).map(([key, type]) => (
                            <div
                                key={key}
                                className={`type-card ${enhancementType === key ? 'active' : ''}`}
                                onClick={() => setEnhancementType(key)}
                            >
                                <div className="type-icon">
                                    <type.icon size={32} />
                                </div>
                                <h4>{type.label}</h4>
                                <p>{type.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="upload-section">
                    <div
                        className={`dropzone ${file ? 'has-file' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                        
                        {!file && (
                            <div className="upload-placeholder">
                                <Upload size={48} />
                                <h3>Drop your image here or click to browse</h3>
                                <p>Supports: JPG, PNG, WebP, HEIC, BMP, TIFF</p>
                                <p>Max file size: 50MB</p>
                            </div>
                        )}

                        {file && (
                            <div className="file-info">
                                <img src={preview} alt="Preview" className="preview-image" />
                                <div className="file-details">
                                    <h4>{file.name}</h4>
                                    <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {file && (
                        <div className="controls">
                            <div className="parameters-section">
                                <h4>
                                    <Settings size={16} />
                                    Enhancement Settings
                                </h4>
                                <div className="parameters">
                                    {enhancementTypes[enhancementType].params.map(param => (
                                        <div key={param}>
                                            {renderParameterControl(param)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="action-section">
                                <button
                                    className="btn btn-primary"
                                    onClick={enhanceImage}
                                    disabled={isProcessing}
                                >
                                    <Sliders size={16} />
                                    {isProcessing ? 'Enhancing...' : `Apply ${enhancementTypes[enhancementType].label}`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {result && (
                    <div className="result-section">
                        <h3>Enhanced Result</h3>
                        <div className="result-preview">
                            <div className="before-after">
                                <div className="image-container">
                                    <h4>Original</h4>
                                    <img src={preview} alt="Original" />
                                </div>
                                <div className="image-container">
                                    <h4>Enhanced ({enhancementTypes[enhancementType].label})</h4>
                                    <img src={result} alt="Enhanced" />
                                </div>
                            </div>
                            
                            <div className="download-section">
                                <button
                                    className="btn btn-success"
                                    onClick={downloadResult}
                                >
                                    <Download size={16} />
                                    Download Enhanced Image
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageEnhancer;
