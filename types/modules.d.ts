declare module 'utif' {
  const UTIF: {
    decode: (buffer: ArrayBuffer) => any[];
    decodeImage: (buffer: ArrayBuffer, ifd: any, ifds?: any[]) => void;
    toRGBA8: (ifd: any) => Uint8Array;
    encodeImage: (rgba: Uint8Array | ArrayBuffer, width: number, height: number, metadata?: any) => ArrayBuffer;
    encode: (ifds: any[]) => ArrayBuffer;
    [key: string]: any;
  };
  export default UTIF;
}

declare module 'pako' {
  export function deflate(input: Uint8Array | string, options?: any): Uint8Array;
  export function inflate(input: Uint8Array, options?: any): Uint8Array;
  const pako: {
    deflate: typeof deflate;
    inflate: typeof inflate;
    [key: string]: any;
  };
  export default pako;
}
