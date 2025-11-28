import React, { useState } from 'react';
import axios from 'axios';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Upload, FileVideo, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@clerk/clerk-react';
import API from '@/utility/api';

interface Detection {
  frame: number;
  label: string;
  confidence: number;
  box: number[];
}

const VideoAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setDetections([]);
    }
  };

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
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
        setError(null);
        setDetections([]);
      } else {
        setError("Please upload a valid video file.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setDetections([]);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await API.post("/video/analyze",formData);

      if (response.data.success) {
        setDetections(response.data.detections);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Video Analysis</h1>
          <p className="text-lg text-muted-foreground">
            Upload traffic footage to automatically detect accidents and hazards using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 shadow-custom-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Video
              </h2>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="video-upload"
                  accept="video/*" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileVideo className="w-6 h-6 text-primary" />
                  </div>
                  
                  {file ? (
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Drag & drop or click to upload</p>
                      <p>Supports MP4, AVI, MOV</p>
                    </div>
                  )}

                  <Button 
                    variant={file ? "secondary" : "default"}
                    onClick={() => document.getElementById('video-upload')?.click()}
                    className="mt-2"
                  >
                    {file ? "Change Video" : "Select Video"}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={!file || loading}
                className="w-full mt-6"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Footage...
                  </>
                ) : (
                  "Start Analysis"
                )}
              </Button>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {detections.length > 0 ? (
              <Card className="p-6 shadow-custom-md h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Analysis Results
                  </h2>
                  <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {detections.length} Objects Detected
                  </span>
                </div>

                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Frame</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Object</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Confidence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {detections.map((d, i) => (
                        <tr key={i} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {d.frame}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground capitalize">
                            {d.label}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Progress value={d.confidence * 100} className="w-16 h-2" />
                              <span>{(d.confidence * 100).toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              d.confidence > 0.8 
                                ? "bg-success/10 text-success" 
                                : "bg-warning/10 text-warning-foreground"
                            }`}>
                              {d.confidence > 0.8 ? "High" : "Medium"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/5 text-center">
                <div className="max-w-sm">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileVideo className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Analysis Results Yet</h3>
                  <p className="text-muted-foreground">
                    Upload a video and start the analysis to see detected objects and potential hazards here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoAnalysis;
