export class AdobeAnalyticsUtils {

    static hexToBase64(hex: string): string {
        const hexSize: number = hex.length;

        if (hexSize % 2 === 1) {
            throw new Error('The length of the HEX value should be even.');
        }

        let base64: string = '';

        // Every 2 characters in hex (00 - FF) make one decimal number (0-255).
        // Then, decimals are grouped in packs of 3 to create 4 base64 characters. That means on each
        // iteration we take care of 6 characters at a time, ignoring the trailing ones that are not aligned
        // (not multiple of 6), that is, the last 2 or 4 characters (1 or 2 decimals):

        const CHARSET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        const remainingCharacters: number = hexSize % 6;
        const lastAlignedIndexPlusOne: number = hexSize - remainingCharacters;

        for (let i = 0; i < lastAlignedIndexPlusOne; i += 6) {
            const dec0: number = parseInt(hex.substr(i, 2), 16);
            const dec1: number = parseInt(hex.substr(i + 2, 2), 16);
            const dec2: number = parseInt(hex.substr(i + 4, 2), 16);

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

        // Handle the remaining non-aligned characters, if any (there can be only 2 or 4 of them, which
        // would translate to 1 or 2 decimals):

        if (remainingCharacters) {
            const dec0: number = parseInt(hex.substr(lastAlignedIndexPlusOne, 2), 16);
            const dec1: number = parseInt(hex.substr(lastAlignedIndexPlusOne + 2, 2), 16) || 0;

            // Append the last 2 or 3 characters + 2 or 1 padding (=), respectively, so 4 more
            // characters in total:

            base64 += `${
                CHARSET.charAt((dec0 & 0xfc) >> 2)
            }${
                CHARSET.charAt(((dec0 & 0x03) << 4) + ((dec1 & 0xf0) >> 4))
            }${
                remainingCharacters === 4 ? CHARSET.charAt((dec1 & 0x0f) << 2) : '='
            }=`;
        }

        return base64;
    }
}
