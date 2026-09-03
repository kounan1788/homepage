import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * public 配下の画像から実際の寸法を読み取ります（サーバー側・ビルド時のみ実行）。
 *
 * OGP の og:image:width / height に実寸と違う値を書くと、X や LINE のカードで
 * 意図しないトリミングや表示崩れが起きます。画像を差し替えても宣言が自動で
 * 追従するよう、ファイルのヘッダから直接読み取っています。
 *
 * 対応形式は PNG と JPEG（public 配下のOG画像はすべてこの2種類）。
 */
export function getImageSize(publicPath: string): { width: number; height: number } {
    const buf = readFileSync(join(process.cwd(), 'public', publicPath.replace(/^\//, '')));

    // PNG: シグネチャ8バイトの後の IHDR に幅・高さが入っている
    if (buf[0] === 0x89 && buf[1] === 0x50) {
        return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }

    // JPEG: SOF（Start of Frame）マーカーを探して寸法を読む
    if (buf[0] === 0xff && buf[1] === 0xd8) {
        let offset = 2;
        while (offset < buf.length - 8) {
            if (buf[offset] !== 0xff) {
                offset++;
                continue;
            }
            const marker = buf[offset + 1];
            // SOF0〜SOF15。ただし DHT(C4)・JPG(C8)・DAC(CC) は寸法を持たない
            const isSof =
                marker >= 0xc0 &&
                marker <= 0xcf &&
                marker !== 0xc4 &&
                marker !== 0xc8 &&
                marker !== 0xcc;
            if (isSof) {
                return {
                    width: buf.readUInt16BE(offset + 7),
                    height: buf.readUInt16BE(offset + 5),
                };
            }
            offset += 2 + buf.readUInt16BE(offset + 2);
        }
    }

    throw new Error(`画像の寸法を読み取れません（PNG/JPEG のみ対応）: ${publicPath}`);
}

/**
 * Metadata の openGraph.images にそのまま渡せる形で、実寸付きの1枚を組み立てます。
 */
export function ogImage(publicPath: string, alt: string) {
    const { width, height } = getImageSize(publicPath);
    return [{ url: publicPath, width, height, alt }];
}
