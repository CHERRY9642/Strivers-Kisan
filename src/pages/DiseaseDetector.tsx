import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Image as ImageIcon, 
  Upload, 
  Camera as CameraIcon, 
  X, 
  ChevronLeft,
  Microscope,
  Scan,
  Brain
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Import crop images
import riceImage from '@/assets/crops/rice.jpg';
import cottonImage from '@/assets/crops/cotton.jpg';
import hotpepperImage from '@/assets/crops/hotpepper.jpg';
import cornImage from '@/assets/crops/corn.jpg';
import tomatoImage from '@/assets/crops/tomato.jpg';
import onionImage from '@/assets/crops/onion.jpg';
import potatoImage from '@/assets/crops/potato.jpg';
import grapesImage from '@/assets/crops/grapes.jpg';

// Import disease reference images
import riceBlightImage from '@/assets/diseases/rice-blight.jpg';
import tomatoBlightImage from '@/assets/diseases/tomato-blight.jpg';
import cornSpotImage from '@/assets/diseases/corn-spot.jpg';
import cottonBollwormImage from '@/assets/diseases/cotton-bollworm.jpg';

type DetectorMode = 'normal' | 'advanced' | 'hyperspectral';

interface Crop {
  id: string;
  name: string;
  image: string;
  diseases: { name: string; image: string; description: string }[];
}

const crops: Crop[] = [
  {
    id: 'rice',
    name: 'Rice',
    image: riceImage,
    diseases: [
      { name: 'Bacterial Leaf Blight', image: riceBlightImage, description: 'Yellow to brown streaks on leaves' }
    ]
  },
  {
    id: 'cotton',
    name: 'Cotton',
    image: cottonImage,
    diseases: [
      { name: 'Bollworm Infestation', image: cottonBollwormImage, description: 'Holes and damage in cotton bolls' }
    ]
  },
  {
    id: 'hotpepper',
    name: 'Hot Pepper',
    image: hotpepperImage,
    diseases: []
  },
  {
    id: 'corn',
    name: 'Corn',
    image: cornImage,
    diseases: [
      { name: 'Leaf Spot Disease', image: cornSpotImage, description: 'Circular brown spots on leaves' }
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    image: tomatoImage,
    diseases: [
      { name: 'Late Blight', image: tomatoBlightImage, description: 'Dark spots with white fuzzy growth' }
    ]
  },
  {
    id: 'onion',
    name: 'Onion',
    image: onionImage,
    diseases: []
  },
  {
    id: 'potato',
    name: 'Potato',
    image: potatoImage,
    diseases: []
  },
  {
    id: 'grapes',
    name: 'Grapes',
    image: grapesImage,
    diseases: []
  }
];

const DiseaseDetector: React.FC = () => {
  const { translateSync } = useLanguage();
  const [mode, setMode] = useState<DetectorMode>('normal');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const modeConfig = {
    normal: { icon: Brain, label: 'Normal', color: 'bg-primary' },
    advanced: { icon: Microscope, label: 'Advanced', color: 'bg-secondary' },
    hyperspectral: { icon: Scan, label: 'Hyperspectral', color: 'bg-accent' }
  };

  const handleCameraOpen = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please ensure you have a camera and have granted permissions.");
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_image.png", { type: "image/png" });
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            handleCameraClose();
          }
        }, 'image/png');
      }
    }
  };

  const handleCameraClose = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    multiple: false,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handlePasteImage = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          setSelectedImage(file);
          setPreviewUrl(URL.createObjectURL(file));
        }
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResult('Leaf Spot Disease detected with 85% confidence. Recommended treatment: Apply fungicide spray.');
      setIsAnalyzing(false);
    }, 3000);
  };

  const resetToNormal = () => {
    setSelectedCrop(null);
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 mb-6"
        >
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Crop Disease Detection
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Identify and diagnose crop diseases using advanced AI technology. Upload images of your crops to get instant analysis and treatment recommendations.
          </motion.p>
        </motion.div>

        {/* Mode Selector */}
        <Card>
          <CardContent className="p-2 sm:p-3">
            <div className="flex justify-center space-x-0.5 sm:space-x-1">
              {Object.entries(modeConfig).map(([key, config]) => (
                <motion.button
                  key={key}
                  className={`relative px-2 sm:px-3 py-1.5 sm:py-2 rounded-md font-medium transition-all text-xs sm:text-sm ${
                    mode === key ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => {
                    setMode(key as DetectorMode);
                    resetToNormal();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {mode === key && (
                    <motion.div
                      className={`absolute inset-0 rounded-md ${config.color}`}
                      layoutId="activeMode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <div className="relative flex items-center space-x-1 sm:space-x-2">
                    <config.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{config.label}</span>
                    <span className="sm:hidden">{config.label.slice(0, 4)}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {/* Normal Mode - Crop Selection */}
          {mode === 'normal' && !selectedCrop && (
            <motion.div
              key="crop-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Select the crop you are having issues with</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {crops.map((crop) => (
                      <motion.button
                        key={crop.id}
                        className="p-2 sm:p-3 border rounded-lg hover:border-primary transition-colors"
                        onClick={() => setSelectedCrop(crop)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden mb-2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto">
                          <img
                            src={crop.image}
                            alt={crop.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-center text-xs sm:text-sm">{crop.name}</h3>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Normal Mode - Analysis Interface */}
          {mode === 'normal' && selectedCrop && (
            <motion.div
              key="normal-analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6"
            >
              {/* Left Side - Upload Image */}
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedCrop(null)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-primary">Upload Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Upload from device 📱:
                  </div>
                  
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm">Drop images here or click to browse</p>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Capture from camera:
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCameraOpen}
                      className="flex-1"
                    >
                      <CameraIcon className="w-4 h-4 mr-2" />
                      Open Camera
                    </Button>
                    {isCameraOpen && (
                      <Button
                        onClick={handleCapturePhoto}
                        className="flex-1"
                      >
                        📸 Capture
                      </Button>
                    )}
                  </div>


                  {isCameraOpen && (
                    <div className="relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleCameraClose}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {previewUrl && (
                    <div className="relative">
                      <img src={previewUrl} alt="Preview" className="w-full rounded-lg" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    className="w-full"
                    disabled={!selectedImage || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                        <span>🧠 Predict</span>
                      </div>
                    ) : (
                      <span>🧠 Predict</span>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Right Side - AI/ML Prediction Output */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">AI/ML Prediction Output</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Common Issues for Selected Crop */}
                  <div>
                    <h3 className="font-medium mb-3">Common {selectedCrop.name} Issues:</h3>
                    <div className="space-y-3">
                      {selectedCrop.diseases.length > 0 ? (
                        selectedCrop.diseases.map((disease, index) => (
                          <div key={index} className="flex space-x-3 p-3 border rounded-lg">
                            <img
                              src={disease.image}
                              alt={disease.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-sm">{disease.name}</h4>
                              <p className="text-xs text-muted-foreground">{disease.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No common diseases data available for {selectedCrop.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Analysis Result */}
                  {analysisResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-primary/10 border border-primary/20 rounded-lg"
                    >
                      <h3 className="font-medium text-primary mb-2">Analysis Result:</h3>
                      <p className="text-sm">{analysisResult}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Advanced Mode */}
          {mode === 'advanced' && (
            <motion.div
              key="advanced-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6"
            >
              <Card className="border-secondary/20 bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-secondary">Advanced Crop Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Upload your crop images directly for advanced AI analysis
                  </div>
                  
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-secondary bg-secondary/5' : 'border-secondary/30 hover:border-secondary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-10 w-10 text-secondary mb-3" />
                    <p className="text-lg font-medium text-secondary">Drop crop images here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-2">Advanced analysis with detailed reports</p>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Capture from camera:
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCameraOpen}
                      className="flex-1 border-secondary/30 text-secondary hover:bg-secondary/10"
                    >
                      <CameraIcon className="w-4 h-4 mr-2" />
                      Open Camera
                    </Button>
                    {isCameraOpen && (
                      <Button
                        onClick={handleCapturePhoto}
                        className="flex-1 bg-secondary hover:bg-secondary/90"
                      >
                        📸 Capture
                      </Button>
                    )}
                  </div>


                  {isCameraOpen && (
                    <div className="relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg max-h-64" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-background/80"
                        onClick={handleCameraClose}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {previewUrl && (
                    <div className="relative">
                      <img src={previewUrl} alt="Preview" className="w-full rounded-lg max-h-64 object-cover" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-background/80"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    className="w-full bg-secondary hover:bg-secondary/90"
                    disabled={!selectedImage || isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Run Advanced Analysis'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-secondary">Advanced Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResult ? (
                    <div className="space-y-4">
                      <Badge className="bg-secondary hover:bg-secondary/90">Advanced Analysis Complete</Badge>
                      <p className="text-sm">{analysisResult}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Upload an image to see advanced analysis results</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Hyperspectral Mode */}
          {mode === 'hyperspectral' && (
            <motion.div
              key="hyperspectral-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-accent-foreground">Hyperspectral Imaging</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Upload hyperspectral images for specialized analysis
                  </div>
                  
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Scan className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Drop hyperspectral images here</p>
                    <p className="text-sm text-muted-foreground mt-2">No crop selection required</p>
                  </div>

                  {previewUrl && (
                    <div className="relative">
                      <img src={previewUrl} alt="Preview" className="w-full rounded-lg" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    className="w-full bg-accent hover:bg-accent/90"
                    disabled={!selectedImage || isAnalyzing}
                  >
                    {isAnalyzing ? 'Processing Hyperspectral Data...' : 'Analyze Hyperspectral Image'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-accent-foreground">Hyperspectral Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResult ? (
                    <div className="space-y-4">
                      <Badge className="bg-accent hover:bg-accent/90">Hyperspectral Complete</Badge>
                      <p className="text-sm">{analysisResult}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Upload a hyperspectral image to see detailed spectral analysis</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default DiseaseDetector;