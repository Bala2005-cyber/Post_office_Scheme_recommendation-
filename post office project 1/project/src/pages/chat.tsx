import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Users, Shield, MessageCircle, Image as ImageIcon, FileText, Download, X, Mail, Building2, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  role: 'user' | 'staff';
  timestamp: Date;
  image?: string;
  imageType?: 'poster' | 'regular';
  file?: {
    name: string;
    size: string;
    type: string;
    url: string;
  };
}

interface User {
  name: string;
  role: 'user' | 'staff';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({ name: 'Rajesh Kumar', role: 'user' });
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !selectedImage && !selectedFile) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: currentUser.name,
      role: currentUser.role,
      timestamp: new Date(),
      image: previewImage || undefined,
      imageType: currentUser.role === 'staff' ? 'poster' : 'regular',
      file: selectedFile ? {
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        type: selectedFile.type,
        url: URL.createObjectURL(selectedFile)
      } : undefined
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setSelectedImage(null);
    setSelectedFile(null);
    setPreviewImage(null);
    
    // Clear file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message.id !== messageId));
  };

  const canDeleteMessage = (message: Message) => {
    // Users can only delete their own messages
    // System messages cannot be deleted
    return message.sender === currentUser.name && message.sender !== 'System';
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-600" />;
    if (fileType.includes('image')) return <ImageIcon className="h-5 w-5 text-red-600" />;
    return <FileText className="h-5 w-5 text-red-600" />;
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleUserRole = () => {
    setCurrentUser(prev => ({
      ...prev,
      role: prev.role === 'user' ? 'staff' : 'user',
      name: prev.role === 'user' ? 'Post Office Staff' : 'Rajesh Kumar'
    }));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <Mail className="h-6 w-6" />
                <span>India Post Community Chat</span>
              </h1>
              <p className="text-red-100 text-sm">Official Communication Portal • Campaign Updates & Customer Support</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-red-100 bg-white/10 px-3 py-2 rounded-full">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Online: 24</span>
            </div>
            <button
              onClick={toggleUserRole}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 transition-all duration-200 ${
                currentUser.role === 'staff'
                  ? 'bg-white text-red-600 shadow-md hover:shadow-lg'
                  : 'bg-red-800 text-white hover:bg-red-900'
              }`}
            >
              {currentUser.role === 'staff' ? (
                <Shield className="h-4 w-4" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span>{currentUser.role === 'staff' ? 'Post Office Staff' : 'Citizen'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="bg-white/80 p-8 rounded-2xl shadow-lg border-2 border-red-200">
                <MessageCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">Welcome to India Post Community Chat</h3>
                <p className="text-red-600 mb-4">Start the conversation! Share campaign updates, ask questions, or upload important documents.</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-red-500">
                  <div className="flex items-center space-x-1">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload Images</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>Share Documents</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Official Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'staff' ? 'justify-start' : 'justify-end'}`}
              onMouseEnter={() => setHoveredMessage(message.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div className="relative group">
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.role === 'staff'
                      ? 'bg-white border-2 border-red-200 shadow-lg'
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  } rounded-2xl px-5 py-4 transform transition-all duration-200 hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-2 ${
                        message.role === 'staff' ? 'text-red-600' : 'text-red-100'
                      }`}>
                        {message.role === 'staff' ? (
                          <div className="bg-red-100 p-1 rounded-full">
                            <Shield className="h-4 w-4 text-red-600" />
                          </div>
                        ) : (
                          <div className="bg-white/20 p-1 rounded-full">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <span className="text-sm font-semibold">{message.sender}</span>
                      </div>
                      <span className={`text-xs ${
                        message.role === 'staff' ? 'text-gray-500' : 'text-red-100'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                    {/* Delete Button */}
                    {canDeleteMessage(message) && (hoveredMessage === message.id) && (
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${
                          message.role === 'staff'
                            ? 'text-red-500 hover:bg-red-100 hover:text-red-700'
                            : 'text-red-200 hover:bg-white/20 hover:text-white'
                        }`}
                        title="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {message.image && (
                    <div className="mb-4">
                      {message.imageType === 'poster' && (
                        <div className="flex items-center space-x-2 mb-3 p-2 bg-red-50 rounded-lg">
                          <ImageIcon className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-700">
                            📢 Official Campaign Poster
                          </span>
                        </div>
                      )}
                      <img
                        src={message.image}
                        alt="Shared image"
                        className="rounded-xl max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity shadow-md border-2 border-red-100"
                        onClick={() => window.open(message.image, '_blank')}
                      />
                    </div>
                  )}

                  {message.file && (
                    <div className={`mb-4 p-4 rounded-xl border-2 ${
                      message.role === 'staff' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-white/20 border-white/30'
                    } cursor-pointer hover:bg-opacity-80 transition-all`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(message.file.type)}
                          <div>
                            <p className={`font-semibold text-sm ${
                              message.role === 'staff' ? 'text-red-800' : 'text-white'
                            }`}>
                              {message.file.name}
                            </p>
                            <p className={`text-xs ${
                              message.role === 'staff' ? 'text-red-600' : 'text-red-100'
                            }`}>
                              {message.file.size}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(message.file?.url, '_blank')}
                          className={`p-2 rounded-full transition-colors ${
                            message.role === 'staff'
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {message.text && (
                    <p className={`text-sm leading-relaxed ${
                      message.role === 'staff' ? 'text-gray-800' : 'text-white'
                    }`}>
                      {message.text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-4 border-red-600 px-6 py-6 shadow-2xl">
        {/* File Previews */}
        {(previewImage || selectedFile) && (
          <div className="mb-6 space-y-4">
            {previewImage && (
              <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-red-700 flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>
                      {currentUser.role === 'staff' ? '📢 Campaign Poster Preview' : '🖼️ Image Preview'}
                    </span>
                  </span>
                  <button
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="rounded-lg max-w-xs h-auto shadow-md border-2 border-red-100"
                />
              </div>
            )}
            
            {selectedFile && (
              <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(selectedFile.type)}
                    <div>
                      <p className="font-semibold text-sm text-red-800">{selectedFile.name}</p>
                      <p className="text-xs text-red-600">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                currentUser.role === 'staff'
                  ? '📢 Share campaign updates, answer queries, or upload important documents...'
                  : '💬 Ask your questions about postal services, schemes, or campaigns...'
              }
              className="w-full px-5 py-4 border-2 border-red-200 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 resize-none text-gray-800 placeholder-gray-500 shadow-sm transition-all duration-200"
              rows={3}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors shadow-md hover:shadow-lg"
                title={currentUser.role === 'staff' ? 'Upload Campaign Poster' : 'Upload Image'}
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors shadow-md hover:shadow-lg"
                title="Upload Document/File"
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={newMessage.trim() === '' && !selectedImage && !selectedFile}
              className="p-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Chat;