import test from 'node:test';
import assert from 'node:assert/strict';
import {
  testBrowserMediaSupport,
  extractMediaMetadataSafely,
} from '../lib/utils/media-support.ts';

test('Media Support (SSR / Node environment safety)', () => {
  const dummyFile = new File(['dummy content'], 'video.avi', { type: 'video/x-msvideo' });
  const result = testBrowserMediaSupport(dummyFile, 'video');

  // When typeof document === 'undefined', it must safely return canPlay: false without throwing
  assert.equal(result.canPlay, false);
  assert.equal(result.confidence, 'none');
});

test('Media Support (Browser-like mock environment)', async (t) => {
  // Setup minimal DOM mocks for Node environment
  const originalDocument = globalThis.document;

  const mockCanPlayType = (type: string): string => {
    const t = type.toLowerCase();
    if (t.includes('mp4') || t.includes('mpeg') || t.includes('wav') || t.includes('webm')) {
      return 'probably';
    }
    if (t.includes('quicktime') || t.includes('aac') || t.includes('ogg') || t.includes('flac')) {
      return 'maybe';
    }
    return ''; // empty string represents unsupported format in HTMLMediaElement spec
  };

  (globalThis as unknown as { document: unknown }).document = {
    createElement(tag: string) {
      return {
        tagName: tag.toUpperCase(),
        canPlayType: mockCanPlayType,
        muted: false,
        playsInline: false,
        preload: '',
        src: '',
        removeAttribute(_attr: string) {
          this.src = '';
        },
        load() {},
      };
    },
  };

  await t.test('detects unsupported video container (e.g. .avi, .mkv, .wmv)', () => {
    const aviFile = new File([new Uint8Array(100)], 'test-movie.avi', { type: 'video/x-msvideo' });
    const result = testBrowserMediaSupport(aviFile, 'video');

    assert.equal(result.canPlay, false);
    assert.equal(result.confidence, 'none');
  });

  await t.test('detects supported video container (e.g. .mp4, .webm)', () => {
    const mp4File = new File([new Uint8Array(100)], 'clip.mp4', { type: 'video/mp4' });
    const result = testBrowserMediaSupport(mp4File, 'video');

    assert.equal(result.canPlay, true);
    assert.equal(result.mimeType, 'video/mp4');
    assert.equal(result.confidence, 'probably');
  });

  await t.test('detects supported audio formats (e.g. .mp3, .wav)', () => {
    const mp3File = new File([new Uint8Array(100)], 'song.mp3', { type: 'audio/mpeg' });
    const result = testBrowserMediaSupport(mp3File, 'audio');

    assert.equal(result.canPlay, true);
    assert.equal(result.mimeType, 'audio/mpeg');
    assert.equal(result.confidence, 'probably');
  });

  await t.test('detects unsupported audio formats (e.g. .wma)', () => {
    const wmaFile = new File([new Uint8Array(100)], 'audio.wma', { type: 'audio/x-ms-wma' });
    const result = testBrowserMediaSupport(wmaFile, 'audio');

    assert.equal(result.canPlay, false);
    assert.equal(result.confidence, 'none');
  });

  await t.test('handles output Blob with explicit filename parameter', () => {
    const outputBlob = new Blob([new Uint8Array(500)], { type: 'video/webm' });
    const result = testBrowserMediaSupport(outputBlob, 'video', 'compressed-output.webm');

    assert.equal(result.canPlay, true);
    assert.equal(result.confidence, 'probably');
  });

  await t.test('extractMediaMetadataSafely prevents crash on unsupported video', async () => {
    const mkvFile = new File([new Uint8Array(500)], 'unsupported.mkv', { type: 'video/x-matroska' });
    const meta = await extractMediaMetadataSafely(mkvFile, 'video');

    assert.equal(meta.canPreview, false);
    assert.ok(meta.warning?.includes('cannot preview'));
  });

  // Restore original environment
  (globalThis as unknown as { document: unknown }).document = originalDocument;
});
