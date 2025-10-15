
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { useToast } from '@/hooks/use-toast';
import { instructionsData } from '@/lib/instructions-data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';

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
        description: error.message || 'Please enable camera permissions in your browser settings.',
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
                toast({
                  variant: 'destructive',
                  title: 'Invalid QR Code',
                  description: 'This QR code is not associated with any instructions.',
                });
                // Optional: add a small delay before scanning again
                setTimeout(() => setIsScanning(true), 2000);
                setIsScanning(false);
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

  return (
    <div className="py-8 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <QrCode className="h-6 w-6" />
            Scan QR Code
          </CardTitle>
          <CardDescription>
            Point your camera at a QR code to jump directly to its instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden border">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline // Important for iOS
              autoPlay
              muted
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {isScanning && (
              <>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-2/3 h-2/3 border-4 border-dashed border-primary/70 rounded-lg" />
                </div>
                <div className="scanning-line" />
              </>
            )}
          </div>
          
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                <p>This feature requires camera access. Please grant permission to continue.</p>
                <Button onClick={getCameraPermission} className="mt-2" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {hasCameraPermission === null && (
            <Alert className="mt-4">
              <Camera className="h-4 w-4" />
              <AlertTitle>Requesting Camera...</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser prompt.
              </AlertDescription>
            </Alert>
          )}

           {hasCameraPermission && !isScanning && (
            <Alert className="mt-4">
              <CameraOff className="h-4 w-4" />
              <AlertTitle>Scanner Paused</AlertTitle>
              <AlertDescription>
                The scanner is currently paused.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add a standalone QrCode icon component since it's used in this file but might not be in the Header
const QrCode = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5zM16 16h3v3h-3zM8 5H5v3M8 19H5v-3M16 5h3v3M16 19h3v-3" />
      <path d="M10.5 10.5h3v3h-3zM8 8v8h8V8z" />
    </svg>
  );
  
