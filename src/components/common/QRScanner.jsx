import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FaCamera, FaExclamationTriangle } from 'react-icons/fa';

const QRScanner = ({ onScan }) => {
  const [cameraError, setCameraError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const scannerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize the scanner instance
    scannerRef.current = new Html5Qrcode("qr-reader");

    // Get available cameras
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          setSelectedCamera(devices[0].id); // Select the first camera by default
        } else {
          setCameraError("Không tìm thấy camera nào. Vui lòng kiểm tra thiết bị của bạn.");
        }
      })
      .catch(err => {
        console.error("Error getting cameras", err);
        setCameraError("Không thể truy cập camera. Vui lòng đảm bảo bạn đã cấp quyền truy cập camera cho trang web này.");
      });

    return () => {
      // Clean up when component unmounts
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  useEffect(() => {
    // Start scanning when a camera is selected
    const startScanner = async () => {
      if (!selectedCamera || !scannerRef.current || !containerRef.current) return;
      
      // If already scanning with a different camera, stop first
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        setScanning(false);
      }
      
      // Configure ideal dimensions based on container
      const containerWidth = containerRef.current.clientWidth;
      const aspectRatio = 4/3;
      const qrboxSize = Math.min(containerWidth, 300);
      
      try {
        setScanning(true);
        setCameraError(null);

        await scannerRef.current.start(
          selectedCamera, 
          {
            fps: 10,
            qrbox: { width: qrboxSize, height: qrboxSize },
            aspectRatio: aspectRatio
          },
          (decodedText) => {
            console.log(`QR Code detected: ${decodedText}`);
            onScan(decodedText);
            
            // Optionally pause scanner after successful scan
            scannerRef.current.pause();
            
            // Resume scanner after 3 seconds
            setTimeout(() => {
              if (scannerRef.current) {
                scannerRef.current.resume();
              }
            }, 3000);
          },
          (errorMessage) => {
            // QR error is logged but doesn't affect UI - this is just for individual scan errors
            console.log(errorMessage);
          }
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
        setCameraError(`Không thể khởi động camera: ${err.message || "Lỗi không xác định"}`);
        setScanning(false);
      }
    };

    startScanner();

    return () => {
      // Clean up on camera change
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.pause();
      }
    };
  }, [selectedCamera, onScan]);

  const handleCameraChange = (e) => {
    setSelectedCamera(e.target.value);
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Refresh camera list
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setCameras(devices);
        setSelectedCamera(devices[0].id);
        setCameraError(null);
      } else {
        setCameraError("Không tìm thấy camera nào.");
      }
    } catch (err) {
      setCameraError("Truy cập camera bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.");
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div id="qr-reader" className="w-full" style={{ minHeight: '300px' }}></div>
      
      {cameraError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 text-center">
          <FaExclamationTriangle className="text-red-500 text-2xl mx-auto mb-2" />
          <p className="text-red-700 mb-3">{cameraError}</p>
          <button 
            onClick={requestCameraPermission} 
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            <FaCamera className="inline mr-2" /> Cấp quyền truy cập camera
          </button>
        </div>
      )}
      
      {cameras.length > 1 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn camera:
          </label>
          <select
            value={selectedCamera || ''}
            onChange={handleCameraChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          >
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Camera ${camera.id}`}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="mt-3 flex items-center justify-center">
        <div className="text-sm text-gray-500 text-center">
          {scanning ? (
            <span className="text-blue-600">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-1 animate-ping"></span>
              Đang quét... Đưa mã QR vào khung
            </span>
          ) : (
            <span>Khởi tạo camera...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;