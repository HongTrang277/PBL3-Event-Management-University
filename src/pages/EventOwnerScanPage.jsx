import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRScanner from '../components/common/QRScanner';
import { qrService } from '../services/api';
import { FaQrcode, FaCheckCircle, FaTimesCircle, FaSync, FaCamera } from 'react-icons/fa';
import { BiScan } from 'react-icons/bi';

const EventOwnerScanPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [manualInput, setManualInput] = useState('');

  // Reset scan result after 5 seconds
  useEffect(() => {
    let timer;
    if (scanResult) {
      timer = setTimeout(() => {
        setScanResult(null);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [scanResult]);

  const handleScan = async (registrationId) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setScanResult(null);
    
    try {
      const response = await qrService.checkInUser(registrationId);
      
      // Create scan result object
      const result = {
        id: Date.now(),
        registrationId,
        timestamp: new Date().toLocaleTimeString(),
        success: response.success,
        message: response.success 
          ? `Điểm danh thành công!` 
          : `Điểm danh thất bại: ${response.message || 'Lỗi không xác định'}`
      };
      
      // Update state with scan result
      setScanResult(result);
      
      // Add to scan history
      setScanHistory(prev => [result, ...prev].slice(0, 10));
    } catch (error) {
      // Handle error
      setScanResult({
        id: Date.now(),
        registrationId,
        timestamp: new Date().toLocaleTimeString(),
        success: false,
        message: `Lỗi: ${error.message || 'Không thể kết nối đến máy chủ'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualInput = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
      setManualInput('');
    }
  };

  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BiScan className="text-3xl mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Điểm Danh Sự Kiện</h1>
                <p className="text-blue-100 text-sm mt-1">Quét mã QR để điểm danh người tham dự</p>
              </div>
            </div>
            <button 
              onClick={toggleCamera}
              className={`p-3 rounded-full transition ${
                isCameraActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isCameraActive ? 'Tắt Camera' : 'Bật Camera'}
            </button>
          </div>
        </div>
        
        {/* Scanner Section */}
        <div className="p-6">
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {isCameraActive ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-blue-500"
                >
                  {/* Scanner */}
                  <QRScanner onScan={handleScan} />
                  
                  {/* Loading Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-blue-900 bg-opacity-70 flex items-center justify-center">
                      <div className="text-center text-white">
                        <FaSync className="text-3xl animate-spin mx-auto mb-3" />
                        <p>Đang xử lý...</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="camera-off"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-100 rounded-2xl p-12 text-center"
                >
                  <FaQrcode className="mx-auto text-gray-400 text-5xl mb-4" />
                  <h3 className="text-xl font-medium text-gray-500">Camera đã tắt</h3>
                  <p className="text-gray-500 mt-2 mb-4">Bạn có thể nhập mã đăng ký thủ công hoặc bật camera để quét</p>
                  <button
                    onClick={toggleCamera}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaCamera className="inline-block mr-2" />
                    Bật Camera
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Manual Entry Option */}
          <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-medium mb-2 text-gray-700">Nhập mã thủ công</h3>
            <form onSubmit={handleManualInput} className="flex">
              <input 
                type="text" 
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Nhập mã đăng ký"
                className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                disabled={isLoading}
              >
                {isLoading ? <FaSync className="animate-spin" /> : "Điểm danh"}
              </button>
            </form>
          </div>

          {/* Scan Result */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-6 rounded-xl p-4 flex items-start ${
                  scanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className={`p-2 rounded-full mr-3 ${
                  scanResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {scanResult.success ? <FaCheckCircle size={24} /> : <FaTimesCircle size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${
                      scanResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {scanResult.success ? 'Điểm danh thành công' : 'Điểm danh thất bại'}
                    </h3>
                    <span className="text-xs text-gray-500">{scanResult.timestamp}</span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    scanResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {scanResult.message}
                  </p>
                  <div className="mt-2 bg-white bg-opacity-50 rounded px-3 py-1">
                    <span className="text-xs font-medium text-gray-500">Mã đăng ký:</span>
                    <span className="text-xs font-mono ml-2">{scanResult.registrationId}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <h3 className="text-lg font-medium mb-3 text-gray-700 border-b pb-2">Lịch sử điểm danh gần đây</h3>
              <div className="space-y-2 max-h-60 overflow-auto pr-2 scrollbar-thin">
                {scanHistory.map(item => (
                  <div 
                    key={item.id}
                    className={`flex items-center p-2 rounded-lg text-sm ${
                      item.success ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className={`p-1 rounded-full mr-2 ${
                      item.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.success ? <FaCheckCircle size={16} /> : <FaTimesCircle size={16} />}
                    </div>
                    <div className="flex-1 font-mono text-gray-700 truncate">
                      {item.registrationId}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.timestamp}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <button 
                  onClick={() => setScanHistory([])}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Xóa lịch sử
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Gặp vấn đề với camera? Bạn có thể nhập mã đăng ký thủ công.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventOwnerScanPage;