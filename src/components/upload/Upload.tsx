import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, Image, Camera, Loader, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-hot-toast';

const Upload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  const { t } = useLanguage();
  const { addSoilData } = useApp();
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadComplete(false);
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock extracted data
    const mockData = {
      nitrogen: 32,
      phosphorus: 18,
      potassium: 165,
      pH: 6.8,
      moisture: 45,
      filename: file.name,
      uploadDate: new Date().toISOString()
    };
    
    setExtractedData(mockData);
    setUploading(false);
    setUploadComplete(true);
  };

  const handleUseForAnalysis = () => {
    if (!extractedData) return;

    sessionStorage.setItem('extractedSoilData', JSON.stringify({
      nitrogen: extractedData.nitrogen.toString(),
      phosphorus: extractedData.phosphorus.toString(),
      potassium: extractedData.potassium.toString(),
      pH: extractedData.pH.toString(),
      moisture: extractedData.moisture.toString()
    }));

    navigate('/dashboard');
  };

  const handleSaveToProfile = async () => {
    if (!extractedData) return;

    setSaving(true);

    const success = await addSoilData({
      nitrogen: extractedData.nitrogen,
      phosphorus: extractedData.phosphorus,
      potassium: extractedData.potassium,
      pH: extractedData.pH,
      moisture: extractedData.moisture,
      recommendations: [],
      cropSuggestions: [],
      status: 'fair'
    });

    setSaving(false);
    
    if (success) {
      toast.success('Data saved to your profile successfully!');
      setExtractedData(null);
      setUploadComplete(false);
    } else {
      toast.error('Failed to save data. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-black mb-2">
          {t('upload')} Lab Report
        </h1>
        <p className="text-black/70">
          Upload your soil analysis report (PDF or Image) and we'll extract the soil parameters automatically.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
            ${dragActive 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-4">
            {uploading ? (
              <>
                <Loader className="mx-auto text-black animate-spin" size={48} />
                <h3 className="text-xl font-semibold text-black">Processing your file...</h3>
                <p className="text-black/70">Extracting soil parameters from the report</p>
              </>
            ) : uploadComplete ? (
              <>
                <CheckCircle className="mx-auto text-green-400" size={48} />
                <h3 className="text-xl font-semibold text-black">Upload Complete!</h3>
                <p className="text-black/70">Data extracted successfully</p>
              </>
            ) : (
              <>
                <UploadIcon className="mx-auto text-black/60" size={48} />
                <h3 className="text-xl font-semibold text-black">
                  Drop your file here or click to browse
                </h3>
                <p className="text-black/70">
                  Supports PDF, JPG, JPEG, PNG files
                </p>
              </>
            )}
          </div>
        </div>

        {/* Supported Formats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="text-red-600" size={24} />
            <div>
              <p className="text-black font-medium">PDF Reports</p>
              <p className="text-black/60 text-sm">Lab analysis documents</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Image className="text-blue-600" size={24} />
            <div>
              <p className="text-black font-medium">Images</p>
              <p className="text-black/60 text-sm">JPG, JPEG, PNG formats</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Camera className="text-green-600" size={24} />
            <div>
              <p className="text-black font-medium">Photos</p>
              <p className="text-black/60 text-sm">Camera captures</p>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Data */}
      {extractedData && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-black mb-6">Extracted Data</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-800 font-medium">Successfully extracted from: {extractedData.filename}</span>
            </div>
            <p className="text-green-700 text-sm">Uploaded on {new Date(extractedData.uploadDate).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center border-2 border-gray-200">
              <p className="text-black/70 text-sm mb-1">Nitrogen (N)</p>
              <p className="text-2xl font-bold text-black">{extractedData.nitrogen}</p>
              <p className="text-black/60 text-xs">mg/kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center border-2 border-gray-200">
              <p className="text-black/70 text-sm mb-1">Phosphorus (P)</p>
              <p className="text-2xl font-bold text-black">{extractedData.phosphorus}</p>
              <p className="text-black/60 text-xs">mg/kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center border-2 border-gray-200">
              <p className="text-black/70 text-sm mb-1">Potassium (K)</p>
              <p className="text-2xl font-bold text-black">{extractedData.potassium}</p>
              <p className="text-black/60 text-xs">mg/kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center border-2 border-gray-200">
              <p className="text-black/70 text-sm mb-1">pH Level</p>
              <p className="text-2xl font-bold text-black">{extractedData.pH}</p>
              <p className="text-black/60 text-xs">0-14 scale</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center border-2 border-gray-200">
              <p className="text-black/70 text-sm mb-1">Moisture</p>
              <p className="text-2xl font-bold text-black">{extractedData.moisture}</p>
              <p className="text-black/60 text-xs">%</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded-lg border border-white/60 transition-all duration-200"
              onClick={handleUseForAnalysis}
              disabled={saving}
            >
              Use This Data for Analysis
            </button>
            <button
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-black font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200"
              onClick={handleSaveToProfile}
              disabled={saving}
            >
              {saving ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="animate-spin" size={16} />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save to Profile'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
