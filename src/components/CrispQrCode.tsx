import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface CrispQrCodeProps {
  value: string;
  size: number;
  className?: string;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

/**
 * CrispQrCode
 * Mobile-optimized QR Code component that converts a high-resolution Canvas (3x-4x device density)
 * to a pure 24-bit PNG data-URL image.
 *
 * Why this solves mobile "faint/blurry" issues:
 * 1. Immune to browser dark-mode color inversion (mobile Chrome/Samsung Internet never invert <img> tags).
 * 2. Immune to WebKit 3D-transform rasterization downsampling and blur.
 * 3. Eliminates SVG subpixel rounding and crispEdges line dropouts.
 * 4. Ensures 100% pitch-black modules on snow-white background with maximum 21:1 contrast ratio.
 */
export default function CrispQrCode({
  value,
  size,
  className = '',
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'M',
  includeMargin = true,
}: CrispQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate at high internal pixel resolution (e.g. 240px min or 4x display size)
  const hiResPixelSize = Math.max(Math.round(size * 4), 320);

  useEffect(() => {
    let isMounted = true;

    const generateDataUrl = () => {
      if (canvasRef.current && isMounted) {
        try {
          const url = canvasRef.current.toDataURL('image/png');
          if (url && url.length > 50) {
            setDataUrl(url);
          }
        } catch {
          // fallback keeps QRCodeCanvas visible
        }
      }
    };

    // Run immediately and after a short tick to guarantee canvas context draw
    generateDataUrl();
    const timer = setTimeout(generateDataUrl, 30);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [value, hiResPixelSize, bgColor, fgColor, level, includeMargin]);

  return (
    <div
      className={`inline-flex items-center justify-center bg-white ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        backgroundColor: '#ffffff',
        colorScheme: 'light',
      }}
    >
      {/* Offscreen high-density canvas for generating the PNG image */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: `${hiResPixelSize}px`,
          height: `${hiResPixelSize}px`,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      >
        <QRCodeCanvas
          ref={canvasRef}
          value={value}
          size={hiResPixelSize}
          bgColor={bgColor}
          fgColor={fgColor}
          level={level}
          includeMargin={includeMargin}
        />
      </div>

      {dataUrl ? (
        <img
          src={dataUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="block w-full h-full object-contain select-none pointer-events-none"
          style={{
            display: 'block',
            width: `${size}px`,
            height: `${size}px`,
            maxWidth: '100%',
            maxHeight: '100%',
            backgroundColor: '#ffffff',
            imageRendering: 'auto',
            filter: 'none',
            WebkitFilter: 'none',
          }}
          loading="eager"
          decoding="sync"
        />
      ) : (
        /* Instant visible canvas while PNG dataUrl is being generated */
        <QRCodeCanvas
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level={level}
          includeMargin={includeMargin}
          style={{
            display: 'block',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: '#ffffff',
          }}
        />
      )}
    </div>
  );
}
