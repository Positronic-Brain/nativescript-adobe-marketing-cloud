export class AdobeAnalyticsUtils {

    static hexToBase64(hex: string): string {
        const hexSize: number = hex.length;

        if (hexSize % 2 === 1) {
            throw new Error('The length of the HEX value should be even.');
        }

        const decimals: number[] = [];

        for (let i = 0; i < hexSize; i += 2) {
            // Each pair of hex characters (00 - FF) is a decimal value from 0 to 255:
            decimals.push(parseInt(hex.substr(i, 2), 16));
        }

        let base64: string = '';

        // Group decimals in packs of 3 to create 4 base64 characters and forget for now about the
        // non-aligned decimals (1 or 2 decimals at the end of the decimals array if its length is not
        // multiple of 3):

        const CHARSET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        const decimalsSize: number = hexSize / 2;
        const remainingElements: number = decimalsSize % 3;
        const lastAlignedIndexPlusOne: number = decimalsSize - remainingElements;

        for (let i = 0; i < lastAlignedIndexPlusOne; i += 3) {
            const dec0: number = decimals[i];
            const dec1: number = decimals[i + 1];
            const dec2: number = decimals[i + 2];

            base64 += `${
                CHARSET.charAt((dec0 & 0xfc) >> 2)
            }${
                CHARSET.charAt(((dec0 & 0x03) << 4) + ((dec1 & 0xf0) >> 4))
            }${
                CHARSET.charAt(((dec1 & 0x0f) << 2) + ((dec2 & 0xc0) >> 6))
            }${
                CHARSET.charAt(dec2 & 0x3f)
            }`;
        }

        // Handle the remaining non-aligned decimals, if any (there can be only 1 or 2 of them):

        if (remainingElements) {
            const dec0: number = decimals[lastAlignedIndexPlusOne];
            const dec1: number = decimals[lastAlignedIndexPlusOne + 1] || 0;

            // Append the last 2-3 characters + 1-2 padding (=), so 4 more characters in total:

            base64 += `${
                CHARSET.charAt((dec0 & 0xfc) >> 2)
            }${
                CHARSET.charAt(((dec0 & 0x03) << 4) + ((dec1 & 0xf0) >> 4))
            }${
                remainingElements === 2 ? CHARSET.charAt((dec1 & 0x0f) << 2) : '='
            }=`;
        }

        return base64;
    }
}
