/**
 * Media Capabilities, Format Support, and Safe In-Browser Metadata Extraction.
 * Prevents browser-level NotSupportedError ("Failed to load because no supported source was found.")
 */

export interface MediaSupportResult {
  canPlay: boolean;
  confidence: 'probably' | 'maybe' | 'none';
  mimeType: string;
}

/**
 * Check if the current browser environment can natively decode and preview a media file or blob.
 */
export function testBrowserMediaSupport(
  source: File | Blob,
  category: 'video' | 'audio',
  filename?: string
): MediaSupportResult {
  if (typeof document === 'undefined') {
    return { canPlay: false, confidence: 'none', mimeType: '' };
  }

  const name = (('name' in source && typeof source.name === 'string' ? source.name : filename) || '').toLowerCase();
  const rawMime = source.type ? source.type.toLowerCase() : '';
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';

  const mediaEl = document.createElement(category);

  // 1. Direct MIME type check
  if (rawMime && rawMime !== 'application/octet-stream') {
    const directCheck = mediaEl.canPlayType(rawMime);
    if (directCheck === 'probably' || directCheck === 'maybe') {
      return { canPlay: true, confidence: directCheck, mimeType: rawMime };
    }
  }

  // 2. Extension-based capability check for common web formats
  if (category === 'video') {
    if (ext === '.mp4') {
      const mp4Check = mediaEl.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') || mediaEl.canPlayType('video/mp4');
      return {
        canPlay: mp4Check !== '',
        confidence: (mp4Check as 'probably' | 'maybe') || 'none',
        mimeType: 'video/mp4',
      };
    }
    if (ext === '.webm') {
      const webmCheck = mediaEl.canPlayType('video/webm; codecs="vp8, opus"') || mediaEl.canPlayType('video/webm');
      return {
        canPlay: webmCheck !== '',
        confidence: (webmCheck as 'probably' | 'maybe') || 'none',
        mimeType: 'video/webm',
      };
    }
    if (ext === '.mov') {
      const movCheck = mediaEl.canPlayType('video/quicktime') || mediaEl.canPlayType('video/mp4');
      return {
        canPlay: movCheck !== '',
        confidence: (movCheck as 'probably' | 'maybe') || 'none',
        mimeType: 'video/quicktime',
      };
    }

    // Formats like AVI, MKV, WMV, FLV are virtually never supported natively by HTMLMediaElement
    return {
      canPlay: false,
      confidence: 'none',
      mimeType: rawMime || 'video/' + ext.replace('.', ''),
    };
  }

  if (category === 'audio') {
    if (ext === '.mp3') {
      const mp3Check = mediaEl.canPlayType('audio/mpeg');
      return { canPlay: mp3Check !== '', confidence: (mp3Check as 'probably' | 'maybe') || 'none', mimeType: 'audio/mpeg' };
    }
    if (ext === '.wav') {
      const wavCheck = mediaEl.canPlayType('audio/wav');
      return { canPlay: wavCheck !== '', confidence: (wavCheck as 'probably' | 'maybe') || 'none', mimeType: 'audio/wav' };
    }
    if (ext === '.m4a' || ext === '.aac') {
      const aacCheck = mediaEl.canPlayType('audio/mp4; codecs="mp4a.40.2"') || mediaEl.canPlayType('audio/aac');
      return { canPlay: aacCheck !== '', confidence: (aacCheck as 'probably' | 'maybe') || 'none', mimeType: 'audio/mp4' };
    }
    if (ext === '.ogg') {
      const oggCheck = mediaEl.canPlayType('audio/ogg; codecs="vorbis"');
      return { canPlay: oggCheck !== '', confidence: (oggCheck as 'probably' | 'maybe') || 'none', mimeType: 'audio/ogg' };
    }
    if (ext === '.flac') {
      const flacCheck = mediaEl.canPlayType('audio/flac');
      return { canPlay: flacCheck !== '', confidence: (flacCheck as 'probably' | 'maybe') || 'none', mimeType: 'audio/flac' };
    }

    return {
      canPlay: false,
      confidence: 'none',
      mimeType: rawMime || 'audio/' + ext.replace('.', ''),
    };
  }

  return { canPlay: false, confidence: 'none', mimeType: rawMime };
}

export interface ExtractedMediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  canPreview: boolean;
  warning?: string;
}

/**
 * Safely extracts dimensions and duration from a media file without throwing
 * unhandled browser NotSupportedError or leaking memory.
 */
export async function extractMediaMetadataSafely(
  file: File,
  category: 'video' | 'audio'
): Promise<ExtractedMediaMetadata> {
  if (typeof document === 'undefined') {
    return { canPreview: false };
  }

  const support = testBrowserMediaSupport(file, category);
  if (!support.canPlay) {
    return {
      canPreview: false,
      warning: `Your browser cannot preview this ${category} container or codec directly. You can still compress and download it.`,
    };
  }

  return new Promise((resolve) => {
    let hasResolved = false;
    const tempUrl = URL.createObjectURL(file);

    let width: number | undefined;
    let height: number | undefined;

    let mediaEl: HTMLMediaElement;
    if (category === 'video') {
      const v = document.createElement('video');
      v.playsInline = true;
      mediaEl = v;
    } else {
      mediaEl = document.createElement('audio');
    }

    // Crucial settings for browser compatibility & autoplay security
    mediaEl.muted = true;
    mediaEl.preload = 'metadata';

    const cleanUp = () => {
      mediaEl.onloadedmetadata = null;
      mediaEl.onerror = null;
      mediaEl.removeAttribute('src');
      try {
        mediaEl.load(); // Force Blink/WebKit to release decoder
      } catch {
        // Safe ignore
      }
      URL.revokeObjectURL(tempUrl);
    };

    const finish = (result: ExtractedMediaMetadata) => {
      if (hasResolved) return;
      hasResolved = true;
      cleanUp();
      resolve(result);
    };

    // Safety timeout: abort after 4 seconds if metadata doesn't trigger
    const timeoutId = setTimeout(() => {
      finish({
        canPreview: false,
        warning: 'Metadata loading timed out. Browser may not support this stream.',
      });
    }, 4000);

    mediaEl.onloadedmetadata = () => {
      clearTimeout(timeoutId);
      const duration = Number.isFinite(mediaEl.duration) ? mediaEl.duration : undefined;
      if (category === 'video' && mediaEl instanceof HTMLVideoElement) {
        if (mediaEl.videoWidth > 0) width = mediaEl.videoWidth;
        if (mediaEl.videoHeight > 0) height = mediaEl.videoHeight;
      }

      finish({
        width,
        height,
        duration,
        canPreview: true,
      });
    };

    mediaEl.onerror = () => {
      clearTimeout(timeoutId);
      // Suppress browser exception and report safe fallback
      finish({
        canPreview: false,
        warning: `The browser could not load a supported source for this ${category} file.`,
      });
    };

    try {
      mediaEl.src = tempUrl;
    } catch {
      clearTimeout(timeoutId);
      finish({ canPreview: false });
    }
  });
}
