import React from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Correct import statement

const QRGenerator = ({ registrationId, eventName, eventDate }) => {
  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{eventName || 'Vé tham gia sự kiện'}</h2>
      {eventDate && (
        <p className="text-gray-600 mb-4">{new Date(eventDate).toLocaleDateString()}</p>
      )}
      
      <div className="border-4 border-blue-500 rounded-lg p-3 mb-4">
        <QRCodeCanvas // Using QRCodeCanvas component
          value={registrationId || "no-registration-id"}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      
      <p className="text-center text-sm text-gray-500">
        Mã đăng ký: <span className="font-mono">{registrationId || "Chưa có mã"}</span>
      </p>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Hãy xuất trình mã QR này khi check-in tại sự kiện
      </p>
    </div>
  );
};

export default QRGenerator;