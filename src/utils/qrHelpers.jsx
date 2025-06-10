import QRCode from 'qrcode';

export const generateQRCode = async (registrationId) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(registrationId);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Could not generate QR code. Please try again.');
  }
};

export const formatRegistrationId = (registrationId) => {
  return registrationId.trim().toUpperCase();
};

export const handleQRCodeError = (error) => {
  console.error('QR Code error:', error);
  return 'An error occurred while processing the QR code. Please try again.';
};