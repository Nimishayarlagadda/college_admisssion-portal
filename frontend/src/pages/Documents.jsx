import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [error, setError] = useState('');

  const requiredDocs = [
    { type: 'transcript', label: 'High School Transcript' },
    { type: 'id_proof', label: 'ID Proof' },
    { type: 'recommendation', label: 'Letter of Recommendation' },
    { type: 'certificate', label: 'Achievement Certificate' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, docsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/applications/me`, { withCredentials: true }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/documents/me`, { withCredentials: true })
      ]);
      setApplication(appRes.data);
      setDocuments(docsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !documentType) {
      setError('Please select a file and document type');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/documents/upload?document_type=${documentType}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setSelectedFile(null);
      setDocumentType('');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const getDocumentsByType = (type) => {
    return documents.filter(doc => doc.document_type === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002FA7] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-8" data-testid="documents-page-no-application">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <h2 className="font-serif text-2xl text-slate-900 mb-2">No Application Found</h2>
            <p className="font-sans text-base text-slate-600">Please submit an application first before uploading documents.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8" data-testid="documents-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-slate-900 mb-2">Document Management</h1>
          <p className="font-sans text-base text-slate-600">Upload and manage your application documents</p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8" data-testid="upload-section">
          <h2 className="font-sans text-xl font-medium text-slate-900 mb-4">Upload Document</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm" data-testid="upload-error">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <form onSubmit={handleUpload} className="space-y-4" data-testid="upload-form">
            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger data-testid="document-type-select" className="mt-1">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {requiredDocs.map(doc => (
                    <SelectItem key={doc.type} value={doc.type}>{doc.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file">Choose File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                data-testid="file-input"
                className="mt-1"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-slate-600" data-testid="selected-file-name">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={uploading}
              data-testid="upload-button"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </form>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          <h2 className="font-sans text-xl font-medium text-slate-900">Required Documents</h2>
          {requiredDocs.map(docType => {
            const uploadedDocs = getDocumentsByType(docType.type);
            const hasUploaded = uploadedDocs.length > 0;

            return (
              <Card key={docType.type} data-testid={`document-card-${docType.type}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      hasUploaded ? 'bg-green-50' : 'bg-gray-100'
                    }`}>
                      {hasUploaded ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-medium text-slate-900">{docType.label}</h3>
                      {hasUploaded ? (
                        <p className="font-sans text-sm text-slate-500">
                          {uploadedDocs.length} file(s) uploaded
                        </p>
                      ) : (
                        <p className="font-sans text-sm text-slate-500">Not uploaded yet</p>
                      )}
                    </div>
                  </div>
                  {hasUploaded && (
                    <div className="flex flex-col space-y-1">
                      {uploadedDocs.map(doc => (
                        <a
                          key={doc.id}
                          href={`${process.env.REACT_APP_BACKEND_URL}/api/documents/${doc.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#002FA7] hover:underline text-sm flex items-center space-x-1"
                          data-testid={`download-link-${doc.id}`}
                        >
                          <Download className="h-4 w-4" />
                          <span>{doc.original_filename}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
