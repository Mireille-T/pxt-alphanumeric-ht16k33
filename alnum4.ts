//% color=#008080 weight=100 icon="\uf26c"
namespace HT16K33_Alnum4 {
    let HT16K33_ADDRESS = 0xE0;
    let HT16K33_ON = 0x21;  // Commands
    let HT16K33_STANDBY = 0x20;
    let HT16K33_DISPLAYON = 0x81;
    let HT16K33_DISPLAYOFF = 0x80;
    let HT16K33_BRIGHTNESS = 0xE0;  // 0xE0|F from 0..15: Set brightness from 1/16 (0x00) to 16/16 (0x0F)

    const alphafonttable = [
        0b0000000000000001,
        0b0000000000000010,
        0b0000000000000100,
        0b0000000000001000,
        0b0000000000010000,
        0b0000000000100000,
        0b0000000001000000,
        0b0000000010000000,
        0b0000000100000000,
        0b0000001000000000,
        0b0000010000000000,
        0b0000100000000000,
        0b0001000000000000,
        0b0010000000000000,
        0b0100000000000000,
        0b1000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0000000000000000,
        0b0001001011001001,
        0b0001010111000000,
        0b0001001011111001,
        0b0000000011100011,
        0b0000010100110000,
        0b0001001011001000,
        0b0011101000000000,
        0b0001011100000000,
        0b0000000000000000, //  
        0b0000000000000110, // !
        0b0000001000100000, // "
        0b0001001011001110, // #
        0b0001001011101101, // $
        0b0000110000100100, // %
        0b0010001101011101, // &
        0b0000010000000000, // '
        0b0010010000000000, // (
        0b0000100100000000, // )
        0b0011111111000000, // *
        0b0001001011000000, // +
        0b0000100000000000, // ,
        0b0000000011000000, // -
        0b0100000000000000, // .
        0b0000110000000000, // /
        0b0000000000111111, // 0
        0b0000000000000110, // 1
        0b0000000011011011, // 2
        0b0000000011001111, // 3
        0b0000000011100110, // 4
        0b0000000001101101, // 5
        0b0000000011111101, // 6
        0b0000000000000111, // 7
        0b0000000011111111, // 8
        0b0000000011101111, // 9
        0b0001001000000000, // :
        0b0000101000000000, // ;
        0b0010010000000000, // <
        0b0000000011001000, // =
        0b0000100100000000, // >
        0b0001000010000011, // ?
        0b0000001010111011, // @
        0b0000000011110111, // A
        0b0001001010001111, // B
        0b0000000000111001, // C
        0b0001001000001111, // D
        0b0000000011111001, // E
        0b0000000001110001, // F
        0b0000000010111101, // G
        0b0000000011110110, // H
        0b0001001000000000, // I
        0b0000000000011110, // J
        0b0010010001110000, // K
        0b0000000000111000, // L
        0b0000010100110110, // M
        0b0010000100110110, // N
        0b0000000000111111, // O
        0b0000000011110011, // P
        0b0010000000111111, // Q
        0b0010000011110011, // R
        0b0000000011101101, // S
        0b0001001000000001, // T
        0b0000000000111110, // U
        0b0000110000110000, // V
        0b0010100000110110, // W
        0b0010110100000000, // X
        0b0001010100000000, // Y
        0b0000110000001001, // Z
        0b0000000000111001, // [
        0b0010000100000000, // 
        0b0000000000001111, // ]
        0b0000110000000011, // ^
        0b0000000000001000, // _
        0b0000000100000000, // `
        0b0001000001011000, // a
        0b0010000001111000, // b
        0b0000000011011000, // c
        0b0000100010001110, // d
        0b0000100001011000, // e
        0b0000000001110001, // f
        0b0000010010001110, // g
        0b0001000001110000, // h
        0b0001000000000000, // i
        0b0000000000001110, // j
        0b0011011000000000, // k
        0b0000000000110000, // l
        0b0001000011010100, // m
        0b0001000001010000, // n
        0b0000000011011100, // o
        0b0000000101110000, // p
        0b0000010010000110, // q
        0b0000000001010000, // r
        0b0010000010001000, // s
        0b0000000001111000, // t
        0b0000000000011100, // u
        0b0010000000000100, // v
        0b0010100000010100, // w
        0b0010100011000000, // x
        0b0010000000001100, // y
        0b0000100001001000, // z
        0b0000100101001001, // {
        0b0001001000000000, // |
        0b0010010010001001, // }
        0b0000010100100000, // ~
        0b0011111111111111,
    ];

    let displaybuffer = [null, null, null, null, null, null, null, null];

    function command(c: number) {
        let cmd = c;
        pins.i2cWriteNumber(HT16K33_ADDRESS, cmd, NumberFormat.UInt16BE);
    }

    function setBrightness(b: number) {
        /* Brightness can vary from 0 to 15 */
        if (b > 15) b = 15;
        command(HT16K33_BRIGHTNESS | b);
    }

    function blinkRate(b: number) {
        if (b > 3) b = 0; // turn off if not sure
        /*  0: Blinking off
          1: Blink at 2Hz
          2: Blink at 1Hz
          3: Blink at 0.5Hz
        */
        command(HT16K33_DISPLAYON | (b << 1));
    }

    function begin() {
        command(HT16K33_ON);
        command(HT16K33_DISPLAYON);
        setBrightness(15);
    }

    function writeDisplay() {
        let buff = [null, null, null, null, null, null, null, null, null];
        buff[0] = 0x00;

        /* Changes the mapping of characters
        0 -> 2
        1 -> 3
        2 -> 0
        3 -> 1
        */
        for (var i = 0, p; i < 4; i++) {
            p = i ^ 2;  //new mapped position
            buff[(p << 1) | 1] = displaybuffer[i] & 0xFF;
            buff[(p << 1) + 2] = displaybuffer[i] >> 8;
        }
        pins.i2cWriteNumber(HT16K33_ADDRESS, buff, NumberFormat.UInt16BE);
    }

    function clearBuffer() {
        for (var i = 0; i < 4; i++) displaybuffer[i] = 0;
    }

    function writeRaw(position: number, bitmask: number) {
        displaybuffer[position] = bitmask;
    }

    function writeAscii(position: number, a: string, dot = false) {
        let bitmask = alphafonttable[parseInt(a)];

        /* On HT16K33, position of bit 11 and 13 are swapped compared to AdaFruit */
        if (!!(bitmask & (1 << 11)) != !!(bitmask & (1 << 13))) {
            bitmask ^= (1 << 11) ^ (1 << 13);
        }
        //dot is the 15th bit
        if (dot) bitmask |= (1 << 14);

        displaybuffer[position] = bitmask;
    }

    function scroll(s: string, interval = 250) {
        let L = s.length();
        if (interval < 0 || L <= 0) {
            clearBuffer();
            writeDisplay();
            return;
        }
        let list: seq = [];
        for (var i = 0; i < L; i++) {
            if (i && s.charAt(i) == '.') {
                if ((seq[seq.length - 1] & (1 << 14)) == 0) {
                    seq[seq.length - 1] |= (1 << 14);
                    continue;
                }
            }
            let bitmask = alphafonttable[parseInt(s.charAt(i))];
            if (!!(bitmask & (1 << 11)) != !!(bitmask & (1 << 13)))
                bitmask ^= (1 << 11) ^ (1 << 13);
            seq.push(bitmask);
        }
        L = seq.length;
        if (L <= 4) {
            clearBuffer();
            for (var i = 0; i < L; i++) {
                let p = 4 - L + i;
                writeRaw(p, seq[i]);
            }
            writeDisplay();
        } else {
            for (var i = -3; i <= L; i++) {
                for (var p = 0; p < 4; p++) {
                    if (i + p < 0 || i + p >= L) writeRaw(p, 0);
                    else writeRaw(p, seq[i + p]);
                }
                writeDisplay();
                basic.pause(interval);
            }
        }
        seq = [];
    }

    /**
     * Prints a text on the alnum display, will scroll with interval if more than 4 letters 
     */
    //% weight=87 blockGap=8
    //% block="show|string %text" 
    //% async
    //% blockId=alnum_print_message
    //% icon="\uf1ec" interval.defl=250
    export function showString(text: string, interval?: number): void {
        serial.writeString("showString\r\n");
        scroll(text, interval);
    }

    /**
     * Scroll a number on the screen. If the number fits on the screen (i.e. less than 4 digit), do not scroll.
     * Defaults to flush right
     */
    //% weight=96
    //% blockId=alnum_print_number 
    //% block="show|number %number" blockGap=8
    //% async rightAlign.defl=1 interval.defl=250
    export function showNumber(value: number, rightAlign?: boolean, interval?: number): void {
        if (interval < 0) {
            clearBuffer();
            writeDisplay();
            return;
        }
        if (value < 0) {
			var s = toString(-value);
            if (s.length > 3) {
                scroll(s, interval);
                return;
            }
            /* assume its 3 digits */
            clearBuffer();
            writeAscii(0, '-');
            for (var i = 0; i < s.length; i++) {
				let p = 3 - s.length + i + 1;
                writeAscii(p, s.charAt(i));
            }
        }
        else {
			var s = toString(value);
            if (s.length > 4) {
                scroll(s, interval);
                return;
            }
            /* assume its 4 digits */
            clearBuffer();
            for (var i = 0; i < s.length; ++i) {
				let p = 4 - s.length + i;
                writeAscii(p, s.charAt(i));
            }
        }
        writeDisplay();
    }

    /**
     * initialises I2C for alnum display
     */
    //% blockId=alnum_init
    //% block="Initialize Alphanumeric Display"
    //% icon="\uf1ec"
    export function init(): void {
        for (var i = 0; i < 8; i++) displaybuffer[i] = 0;
		begin();
		writeDisplay();
    }
}
