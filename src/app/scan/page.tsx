'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { useToast } from '@/hooks/use-toast';
import { instructionsData } from '@/lib/instructions-data';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const getCameraPermission = async () => {
    // Reset state for retries
    setHasCameraPermission(null);
    setIsScanning(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported by this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsScanning(true);
        };
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to scan QR codes.',
        duration: 9000,
      });
    }
  };

  useEffect(() => {
    getCameraPermission(); // Request permission on component mount

    return () => {
      // Cleanup: stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && isScanning) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (context) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (code) {
              const locationCode = code.data;
              if (Object.keys(instructionsData).includes(locationCode)) {
                setIsScanning(false); // Stop scanning
                toast({
                  title: 'QR Code Found!',
                  description: `Redirecting to instructions for: ${locationCode}`,
                });
                router.push(`/instructions/${locationCode}`);
              } else {
                // Temporarily pause scanning and show a toast
                setIsScanning(false); 
                toast({
                  variant: 'destructive',
                  title: 'Invalid QR Code',
                  description: 'This QR code is not associated with any instructions.',
                  duration: 3000,
                });
                // Resume scanning after a delay
                setTimeout(() => setIsScanning(true), 3000);
              }
            }
          }
        }
      }
      if(isScanning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (isScanning) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      if(animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isScanning, router, toast]);

  // Use useEffect to show toasts for permission status changes, as UI elements are removed.
  useEffect(() => {
    if (hasCameraPermission === false) {
      toast({
        variant: 'destructive',
        title: 'Camera Access Required',
        description: 'Please grant permission in your browser to continue. You can try again by reloading the page.',
        duration: 9000,
      });
    } else if (hasCameraPermission === null) {
      toast({
        title: 'Requesting Camera...',
        description: 'Please allow camera access in your browser prompt.',
        duration: 5000,
      });
    }
  }, [hasCameraPermission, toast]);

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline // Important for iOS
        autoPlay
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {isScanning && (
        <div className="scanning-line" />
      )}

      {/* Cancel Button Overlay */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="text-white bg-black/50 hover:bg-black/75 hover:text-white px-3 py-2 h-auto"
        >
          <X className="h-5 w-5 mr-2" />
          CANCEL
        </Button>
      </div>

    </div>
  );
}