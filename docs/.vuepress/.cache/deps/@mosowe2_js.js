import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS
} from "./chunk-J43GMYXM.js";

// node_modules/@mosowe2/js/qr.ts
var qr_exports = {};
__export(qr_exports, {
  default: () => qr_default
});
function qrPolynomial(num, shift) {
  if (typeof num.length == "undefined") {
    throw new Error(num.length + "/" + shift);
  }
  const _num = function() {
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset += 1;
    }
    let _num2 = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i += 1) {
      _num2[i] = num[i + offset];
    }
    return _num2;
  }();
  const _this = {};
  _this.getAt = function(index) {
    return _num[index];
  };
  _this.getLength = function() {
    return _num.length;
  };
  _this.multiply = function(e) {
    let num2 = new Array(_this.getLength() + e.getLength() - 1);
    for (let i = 0; i < _this.getLength(); i += 1) {
      for (let j = 0; j < e.getLength(); j += 1) {
        num2[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
      }
    }
    return qrPolynomial(num2, 0);
  };
  _this.mod = function(e) {
    if (_this.getLength() - e.getLength() < 0) {
      return _this;
    }
    const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
    let num2 = new Array(_this.getLength());
    for (let i = 0; i < _this.getLength(); i += 1) {
      num2[i] = _this.getAt(i);
    }
    for (let i = 0; i < e.getLength(); i += 1) {
      num2[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
    }
    return qrPolynomial(num2, 0).mod(e);
  };
  return _this;
}
var qrcode, QRMode, QRErrorCorrectLevel, QRMaskPattern, QRUtil, QRMath, QRRSBlock, qrBitBuffer, qr8BitByte, byteArrayOutputStream, base64EncodeOutputStream, base64DecodeInputStream, gifImage, createImgTag, createQrCodeImg, qr_default;
var init_qr = __esm({
  "node_modules/@mosowe2/js/qr.ts"() {
    qrcode = function(typeNumber, errorCorrectLevel) {
      const PAD0 = 236;
      const PAD1 = 17;
      const _typeNumber = typeNumber;
      const _errorCorrectLevel = QRErrorCorrectLevel[errorCorrectLevel];
      let _modules = null;
      let _moduleCount = 0;
      let _dataCache = null;
      let _dataList = new Array();
      const _this = {};
      const makeImpl = function(test, maskPattern) {
        _moduleCount = _typeNumber * 4 + 17;
        _modules = function(moduleCount) {
          const modules = new Array(moduleCount);
          for (let row = 0; row < moduleCount; row += 1) {
            modules[row] = new Array(moduleCount);
            for (let col = 0; col < moduleCount; col += 1) {
              modules[row][col] = null;
            }
          }
          return modules;
        }(_moduleCount);
        setupPositionProbePattern(0, 0);
        setupPositionProbePattern(_moduleCount - 7, 0);
        setupPositionProbePattern(0, _moduleCount - 7);
        setupPositionAdjustPattern();
        setupTimingPattern();
        setupTypeInfo(test, maskPattern);
        if (_typeNumber >= 7) {
          setupTypeNumber(test);
        }
        if (_dataCache == null) {
          _dataCache = createData(_typeNumber, _errorCorrectLevel, _dataList);
        }
        mapData(_dataCache, maskPattern);
      };
      const setupPositionProbePattern = function(row, col) {
        for (let r = -1; r <= 7; r += 1) {
          if (row + r <= -1 || _moduleCount <= row + r)
            continue;
          for (let c = -1; c <= 7; c += 1) {
            if (col + c <= -1 || _moduleCount <= col + c)
              continue;
            if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
              _modules[row + r][col + c] = true;
            } else {
              _modules[row + r][col + c] = false;
            }
          }
        }
      };
      const getBestMaskPattern = function() {
        let minLostPoint = 0;
        let pattern = 0;
        for (let i = 0; i < 8; i += 1) {
          makeImpl(true, i);
          const lostPoint = QRUtil.getLostPoint(_this);
          if (i == 0 || minLostPoint > lostPoint) {
            minLostPoint = lostPoint;
            pattern = i;
          }
        }
        return pattern;
      };
      const setupTimingPattern = function() {
        for (let r = 8; r < _moduleCount - 8; r += 1) {
          if (_modules[r][6] != null) {
            continue;
          }
          _modules[r][6] = r % 2 == 0;
        }
        for (let c = 8; c < _moduleCount - 8; c += 1) {
          if (_modules[6][c] != null) {
            continue;
          }
          _modules[6][c] = c % 2 == 0;
        }
      };
      const setupPositionAdjustPattern = function() {
        const pos = QRUtil.getPatternPosition(_typeNumber);
        for (let i = 0; i < pos.length; i += 1) {
          for (let j = 0; j < pos.length; j += 1) {
            const row = pos[i];
            const col = pos[j];
            if (_modules[row][col] != null) {
              continue;
            }
            for (let r = -2; r <= 2; r += 1) {
              for (let c = -2; c <= 2; c += 1) {
                if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                  _modules[row + r][col + c] = true;
                } else {
                  _modules[row + r][col + c] = false;
                }
              }
            }
          }
        }
      };
      const setupTypeNumber = function(test) {
        const bits = QRUtil.getBCHTypeNumber(_typeNumber);
        for (let i = 0; i < 18; i += 1) {
          const mod = !test && (bits >> i & 1) == 1;
          _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
        }
        for (let i = 0; i < 18; i += 1) {
          const mod = !test && (bits >> i & 1) == 1;
          _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
        }
      };
      const setupTypeInfo = function(test, maskPattern) {
        let data = _errorCorrectLevel << 3 | maskPattern;
        let bits = QRUtil.getBCHTypeInfo(data);
        for (let i = 0; i < 15; i += 1) {
          let mod = !test && (bits >> i & 1) == 1;
          if (i < 6) {
            _modules[i][8] = mod;
          } else if (i < 8) {
            _modules[i + 1][8] = mod;
          } else {
            _modules[_moduleCount - 15 + i][8] = mod;
          }
        }
        for (let i = 0; i < 15; i += 1) {
          let mod = !test && (bits >> i & 1) == 1;
          if (i < 8) {
            _modules[8][_moduleCount - i - 1] = mod;
          } else if (i < 9) {
            _modules[8][15 - i - 1 + 1] = mod;
          } else {
            _modules[8][15 - i - 1] = mod;
          }
        }
        _modules[_moduleCount - 8][8] = !test;
      };
      const mapData = function(data, maskPattern) {
        let inc = -1;
        let row = _moduleCount - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        const maskFunc = QRUtil.getMaskFunction(maskPattern);
        for (let col = _moduleCount - 1; col > 0; col -= 2) {
          if (col == 6)
            col -= 1;
          while (true) {
            for (let c = 0; c < 2; c += 1) {
              if (_modules[row][col - c] == null) {
                let dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                }
                let mask = maskFunc(row, col - c);
                if (mask) {
                  dark = !dark;
                }
                _modules[row][col - c] = dark;
                bitIndex -= 1;
                if (bitIndex == -1) {
                  byteIndex += 1;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || _moduleCount <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      };
      const createBytes = function(buffer, rsBlocks) {
        let offset = 0;
        let maxDcCount = 0;
        let maxEcCount = 0;
        const dcdata = new Array(rsBlocks.length);
        const ecdata = new Array(rsBlocks.length);
        for (let r = 0; r < rsBlocks.length; r += 1) {
          const dcCount = rsBlocks[r].dataCount;
          const ecCount = rsBlocks[r].totalCount - dcCount;
          maxDcCount = Math.max(maxDcCount, dcCount);
          maxEcCount = Math.max(maxEcCount, ecCount);
          dcdata[r] = new Array(dcCount);
          for (let i = 0; i < dcdata[r].length; i += 1) {
            dcdata[r][i] = 255 & buffer.getBuffer()[i + offset];
          }
          offset += dcCount;
          const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
          const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
          const modPoly = rawPoly.mod(rsPoly);
          ecdata[r] = new Array(rsPoly.getLength() - 1);
          for (let i = 0; i < ecdata[r].length; i += 1) {
            const modIndex = i + modPoly.getLength() - ecdata[r].length;
            ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
          }
        }
        let totalCodeCount = 0;
        for (let i = 0; i < rsBlocks.length; i += 1) {
          totalCodeCount += rsBlocks[i].totalCount;
        }
        const data = new Array(totalCodeCount);
        let index = 0;
        for (let i = 0; i < maxDcCount; i += 1) {
          for (let r = 0; r < rsBlocks.length; r += 1) {
            if (i < dcdata[r].length) {
              data[index] = dcdata[r][i];
              index += 1;
            }
          }
        }
        for (let i = 0; i < maxEcCount; i += 1) {
          for (let r = 0; r < rsBlocks.length; r += 1) {
            if (i < ecdata[r].length) {
              data[index] = ecdata[r][i];
              index += 1;
            }
          }
        }
        return data;
      };
      const createData = function(typeNumber2, errorCorrectLevel2, dataList) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectLevel2);
        const buffer = qrBitBuffer();
        for (let i = 0; i < dataList.length; i += 1) {
          let data = dataList[i];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
          data.write(buffer);
        }
        let totalDataCount = 0;
        for (let i = 0; i < rsBlocks.length; i += 1) {
          totalDataCount += rsBlocks[i].dataCount;
        }
        if (buffer.getLengthInBits() > totalDataCount * 8) {
          throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
        }
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
          buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 != 0) {
          buffer.putBit(false);
        }
        while (true) {
          if (buffer.getLengthInBits() >= totalDataCount * 8) {
            break;
          }
          buffer.put(PAD0, 8);
          if (buffer.getLengthInBits() >= totalDataCount * 8) {
            break;
          }
          buffer.put(PAD1, 8);
        }
        return createBytes(buffer, rsBlocks);
      };
      _this.addData = function(data) {
        const newData = qr8BitByte(data);
        _dataList.push(newData);
        _dataCache = null;
      };
      _this.isDark = function(row, col) {
        if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
          throw new Error(row + "," + col);
        }
        return _modules[row][col];
      };
      _this.getModuleCount = function() {
        return _moduleCount;
      };
      _this.make = function() {
        makeImpl(false, getBestMaskPattern());
      };
      _this.createTableTag = function(cellSize, margin) {
        cellSize = cellSize || 2;
        margin = typeof margin == "undefined" ? cellSize * 4 : margin;
        let qrHtml = "";
        qrHtml += '<table style="';
        qrHtml += " border-width: 0px; border-style: none;";
        qrHtml += " border-collapse: collapse;";
        qrHtml += " padding: 0px; margin: " + margin + "px;";
        qrHtml += '">';
        qrHtml += "<tbody>";
        for (let r = 0; r < _this.getModuleCount(); r += 1) {
          qrHtml += "<tr>";
          for (let c = 0; c < _this.getModuleCount(); c += 1) {
            qrHtml += '<td style="';
            qrHtml += " border-width: 0px; border-style: none;";
            qrHtml += " border-collapse: collapse;";
            qrHtml += " padding: 0px; margin: 0px;";
            qrHtml += " width: " + cellSize + "px;";
            qrHtml += " height: " + cellSize + "px;";
            qrHtml += " background-color: ";
            qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
            qrHtml += ";";
            qrHtml += '"/>';
          }
          qrHtml += "</tr>";
        }
        qrHtml += "</tbody>";
        qrHtml += "</table>";
        return qrHtml;
      };
      _this.createImgTag = function(cellSize, margin, size) {
        cellSize = cellSize || 2;
        margin = typeof margin === "undefined" ? cellSize * 4 : margin;
        const min = margin;
        const max = _this.getModuleCount() * cellSize + margin;
        return createImgTag(size, size, function(x, y) {
          if (min <= x && x < max && min <= y && y < max) {
            const c = Math.floor((x - min) / cellSize);
            const r = Math.floor((y - min) / cellSize);
            return _this.isDark(r, c) ? 0 : 1;
          } else {
            return 1;
          }
        });
      };
      return _this;
    };
    qrcode.stringToBytes = function(s) {
      const bytes = new Array();
      for (let i = 0; i < s.length; i += 1) {
        const c = s.charCodeAt(i);
        bytes.push(c & 255);
      }
      return bytes;
    };
    qrcode.createStringToBytes = function(unicodeData, numChars) {
      const unicodeMap = function() {
        const bin = base64DecodeInputStream(unicodeData);
        const read = function() {
          const b = bin.read();
          if (b == -1)
            throw new Error();
          return b;
        };
        let count = 0;
        let unicodeMap2 = {};
        while (true) {
          let b0 = bin.read();
          if (b0 == -1)
            break;
          let b1 = read();
          let b2 = read();
          let b3 = read();
          let k = String.fromCharCode(b0 << 8 | b1);
          let v = b2 << 8 | b3;
          unicodeMap2[k] = v;
          count += 1;
        }
        if (count != numChars) {
          throw new Error(count + " != " + numChars);
        }
        return unicodeMap2;
      }();
      let unknownChar = "?".charCodeAt(0);
      return function(s) {
        let bytes = new Array();
        for (let i = 0; i < s.length; i += 1) {
          let c = s.charCodeAt(i);
          if (c < 128) {
            bytes.push(c);
          } else {
            let b = unicodeMap[s.charAt(i)];
            if (typeof b == "number") {
              if ((b & 255) == b) {
                bytes.push(b);
              } else {
                bytes.push(b >>> 8);
                bytes.push(b & 255);
              }
            } else {
              bytes.push(unknownChar);
            }
          }
        }
        return bytes;
      };
    };
    QRMode = {
      MODE_NUMBER: 1 << 0,
      MODE_ALPHA_NUM: 1 << 1,
      MODE_8BIT_BYTE: 1 << 2,
      MODE_KANJI: 1 << 3
    };
    QRErrorCorrectLevel = {
      L: 1,
      M: 0,
      Q: 3,
      H: 2
    };
    QRMaskPattern = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    QRUtil = function() {
      const PATTERN_POSITION_TABLE = [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
      ];
      const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
      const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
      const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
      const _this = {};
      const getBCHDigit = function(data) {
        let digit = 0;
        while (data != 0) {
          digit += 1;
          data >>>= 1;
        }
        return digit;
      };
      _this.getBCHTypeInfo = function(data) {
        let d = data << 10;
        while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
          d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
        }
        return (data << 10 | d) ^ G15_MASK;
      };
      _this.getBCHTypeNumber = function(data) {
        let d = data << 12;
        while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
          d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
        }
        return data << 12 | d;
      };
      _this.getPatternPosition = function(typeNumber) {
        return PATTERN_POSITION_TABLE[typeNumber - 1];
      };
      _this.getMaskFunction = function(maskPattern) {
        switch (maskPattern) {
          case QRMaskPattern.PATTERN000:
            return function(i, j) {
              return (i + j) % 2 == 0;
            };
          case QRMaskPattern.PATTERN001:
            return function(i, j) {
              return i % 2 == 0;
            };
          case QRMaskPattern.PATTERN010:
            return function(i, j) {
              return j % 3 == 0;
            };
          case QRMaskPattern.PATTERN011:
            return function(i, j) {
              return (i + j) % 3 == 0;
            };
          case QRMaskPattern.PATTERN100:
            return function(i, j) {
              return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
            };
          case QRMaskPattern.PATTERN101:
            return function(i, j) {
              return i * j % 2 + i * j % 3 == 0;
            };
          case QRMaskPattern.PATTERN110:
            return function(i, j) {
              return (i * j % 2 + i * j % 3) % 2 == 0;
            };
          case QRMaskPattern.PATTERN111:
            return function(i, j) {
              return (i * j % 3 + (i + j) % 2) % 2 == 0;
            };
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      };
      _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
        let a = qrPolynomial([1], 0);
        for (let i = 0; i < errorCorrectLength; i += 1) {
          a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
        }
        return a;
      };
      _this.getLengthInBits = function(mode, type) {
        if (1 <= type && type < 10) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 10;
            case QRMode.MODE_ALPHA_NUM:
              return 9;
            case QRMode.MODE_8BIT_BYTE:
              return 8;
            case QRMode.MODE_KANJI:
              return 8;
            default:
              throw new Error("mode:" + mode);
          }
        } else if (type < 27) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 12;
            case QRMode.MODE_ALPHA_NUM:
              return 11;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 10;
            default:
              throw new Error("mode:" + mode);
          }
        } else if (type < 41) {
          switch (mode) {
            case QRMode.MODE_NUMBER:
              return 14;
            case QRMode.MODE_ALPHA_NUM:
              return 13;
            case QRMode.MODE_8BIT_BYTE:
              return 16;
            case QRMode.MODE_KANJI:
              return 12;
            default:
              throw new Error("mode:" + mode);
          }
        } else {
          throw new Error("type:" + type);
        }
      };
      _this.getLostPoint = function(qrcode2) {
        const moduleCount = qrcode2.getModuleCount();
        let lostPoint = 0;
        for (let row = 0; row < moduleCount; row += 1) {
          for (let col = 0; col < moduleCount; col += 1) {
            let sameCount = 0;
            let dark = qrcode2.isDark(row, col);
            for (let r = -1; r <= 1; r += 1) {
              if (row + r < 0 || moduleCount <= row + r) {
                continue;
              }
              for (let c = -1; c <= 1; c += 1) {
                if (col + c < 0 || moduleCount <= col + c) {
                  continue;
                }
                if (r == 0 && c == 0) {
                  continue;
                }
                if (dark == qrcode2.isDark(row + r, col + c)) {
                  sameCount += 1;
                }
              }
            }
            if (sameCount > 5) {
              lostPoint += 3 + sameCount - 5;
            }
          }
        }
        ;
        for (let row = 0; row < moduleCount - 1; row += 1) {
          for (let col = 0; col < moduleCount - 1; col += 1) {
            let count = 0;
            if (qrcode2.isDark(row, col))
              count += 1;
            if (qrcode2.isDark(row + 1, col))
              count += 1;
            if (qrcode2.isDark(row, col + 1))
              count += 1;
            if (qrcode2.isDark(row + 1, col + 1))
              count += 1;
            if (count == 0 || count == 4) {
              lostPoint += 3;
            }
          }
        }
        for (let row = 0; row < moduleCount; row += 1) {
          for (let col = 0; col < moduleCount - 6; col += 1) {
            if (qrcode2.isDark(row, col) && !qrcode2.isDark(row, col + 1) && qrcode2.isDark(row, col + 2) && qrcode2.isDark(row, col + 3) && qrcode2.isDark(row, col + 4) && !qrcode2.isDark(row, col + 5) && qrcode2.isDark(row, col + 6)) {
              lostPoint += 40;
            }
          }
        }
        for (let col = 0; col < moduleCount; col += 1) {
          for (let row = 0; row < moduleCount - 6; row += 1) {
            if (qrcode2.isDark(row, col) && !qrcode2.isDark(row + 1, col) && qrcode2.isDark(row + 2, col) && qrcode2.isDark(row + 3, col) && qrcode2.isDark(row + 4, col) && !qrcode2.isDark(row + 5, col) && qrcode2.isDark(row + 6, col)) {
              lostPoint += 40;
            }
          }
        }
        let darkCount = 0;
        for (let col = 0; col < moduleCount; col += 1) {
          for (let row = 0; row < moduleCount; row += 1) {
            if (qrcode2.isDark(row, col)) {
              darkCount += 1;
            }
          }
        }
        const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;
        return lostPoint;
      };
      return _this;
    }();
    QRMath = function() {
      const EXP_TABLE = new Array(256);
      const LOG_TABLE = new Array(256);
      for (let i = 0; i < 8; i += 1) {
        EXP_TABLE[i] = 1 << i;
      }
      for (let i = 8; i < 256; i += 1) {
        EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
      }
      for (let i = 0; i < 255; i += 1) {
        LOG_TABLE[EXP_TABLE[i]] = i;
      }
      const _this = {};
      _this.glog = function(n) {
        if (n < 1) {
          throw new Error("glog(" + n + ")");
        }
        return LOG_TABLE[n];
      };
      _this.gexp = function(n) {
        while (n < 0) {
          n += 255;
        }
        while (n >= 256) {
          n -= 255;
        }
        return EXP_TABLE[n];
      };
      return _this;
    }();
    QRRSBlock = function() {
      const RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
      const qrRSBlock = function(totalCount, dataCount) {
        const _this2 = {};
        _this2.totalCount = totalCount;
        _this2.dataCount = dataCount;
        return _this2;
      };
      const _this = {};
      const getRsBlockTable = function(typeNumber, errorCorrectLevel) {
        switch (errorCorrectLevel) {
          case QRErrorCorrectLevel.L:
            return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
          case QRErrorCorrectLevel.M:
            return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
          case QRErrorCorrectLevel.Q:
            return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
          case QRErrorCorrectLevel.H:
            return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
      _this.getRSBlocks = function(typeNumber, errorCorrectLevel) {
        const rsBlock = getRsBlockTable(typeNumber, errorCorrectLevel);
        if (typeof rsBlock == "undefined") {
          throw new Error("bad rs block [url=home.php?mod=space&uid=5302]@[/url] typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
        }
        let length = rsBlock.length / 3;
        let list = new Array();
        for (let i = 0; i < length; i += 1) {
          const count = rsBlock[i * 3 + 0];
          const totalCount = rsBlock[i * 3 + 1];
          const dataCount = rsBlock[i * 3 + 2];
          for (let j = 0; j < count; j += 1) {
            list.push(qrRSBlock(totalCount, dataCount));
          }
        }
        return list;
      };
      return _this;
    }();
    qrBitBuffer = function() {
      let _buffer = new Array();
      let _length = 0;
      const _this = {};
      _this.getBuffer = function() {
        return _buffer;
      };
      _this.getAt = function(index) {
        const bufIndex = Math.floor(index / 8);
        return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
      };
      _this.put = function(num, length) {
        for (let i = 0; i < length; i += 1) {
          _this.putBit((num >>> length - i - 1 & 1) == 1);
        }
      };
      _this.getLengthInBits = function() {
        return _length;
      };
      _this.putBit = function(bit) {
        let bufIndex = Math.floor(_length / 8);
        if (_buffer.length <= bufIndex) {
          _buffer.push(0);
        }
        if (bit) {
          _buffer[bufIndex] |= 128 >>> _length % 8;
        }
        _length += 1;
      };
      return _this;
    };
    qr8BitByte = function(data) {
      const _mode = QRMode.MODE_8BIT_BYTE;
      const _data = data;
      let _parsedData = [];
      const _this = {};
      for (let i = 0, l = _data.length; i < l; i++) {
        let byteArray = [];
        const code = _data.charCodeAt(i);
        if (code > 65536) {
          byteArray[0] = 240 | (code & 1835008) >>> 18;
          byteArray[1] = 128 | (code & 258048) >>> 12;
          byteArray[2] = 128 | (code & 4032) >>> 6;
          byteArray[3] = 128 | code & 63;
        } else if (code > 2048) {
          byteArray[0] = 224 | (code & 61440) >>> 12;
          byteArray[1] = 128 | (code & 4032) >>> 6;
          byteArray[2] = 128 | code & 63;
        } else if (code > 128) {
          byteArray[0] = 192 | (code & 1984) >>> 6;
          byteArray[1] = 128 | code & 63;
        } else {
          byteArray[0] = code;
        }
        _parsedData.push(byteArray);
      }
      _parsedData = Array.prototype.concat.apply([], _parsedData);
      if (_parsedData.length != _data.length) {
        _parsedData.unshift(191);
        _parsedData.unshift(187);
        _parsedData.unshift(239);
      }
      const _bytes = _parsedData;
      _this.getMode = function() {
        return _mode;
      };
      _this.getLength = function(buffer) {
        return _bytes.length;
      };
      _this.write = function(buffer) {
        for (let i = 0; i < _bytes.length; i += 1) {
          buffer.put(_bytes[i], 8);
        }
      };
      return _this;
    };
    byteArrayOutputStream = function() {
      let _bytes = new Array();
      const _this = {};
      _this.writeByte = function(b) {
        _bytes.push(b & 255);
      };
      _this.writeShort = function(i) {
        _this.writeByte(i);
        _this.writeByte(i >>> 8);
      };
      _this.writeBytes = function(b, off, len) {
        off = off || 0;
        len = len || b.length;
        for (let i = 0; i < len; i += 1) {
          _this.writeByte(b[i + off]);
        }
      };
      _this.writeString = function(s) {
        for (let i = 0; i < s.length; i += 1) {
          _this.writeByte(s.charCodeAt(i));
        }
      };
      _this.toByteArray = function() {
        return _bytes;
      };
      _this.toString = function() {
        let s = "";
        s += "[";
        for (let i = 0; i < _bytes.length; i += 1) {
          if (i > 0) {
            s += ",";
          }
          s += _bytes[i];
        }
        s += "]";
        return s;
      };
      return _this;
    };
    base64EncodeOutputStream = function() {
      let _buffer = 0;
      let _buflen = 0;
      let _length = 0;
      let _base64 = "";
      const _this = {};
      const writeEncoded = function(b) {
        _base64 += String.fromCharCode(encode(b & 63));
      };
      const encode = function(n) {
        if (n < 0) {
        } else if (n < 26) {
          return 65 + n;
        } else if (n < 52) {
          return 97 + (n - 26);
        } else if (n < 62) {
          return 48 + (n - 52);
        } else if (n == 62) {
          return 43;
        } else if (n == 63) {
          return 47;
        }
        throw new Error("n:" + n);
      };
      _this.writeByte = function(n) {
        _buffer = _buffer << 8 | n & 255;
        _buflen += 8;
        _length += 1;
        while (_buflen >= 6) {
          writeEncoded(_buffer >>> _buflen - 6);
          _buflen -= 6;
        }
      };
      _this.flush = function() {
        if (_buflen > 0) {
          writeEncoded(_buffer << 6 - _buflen);
          _buffer = 0;
          _buflen = 0;
        }
        if (_length % 3 != 0) {
          let padlen = 3 - _length % 3;
          for (let i = 0; i < padlen; i += 1) {
            _base64 += "=";
          }
        }
      };
      _this.toString = function() {
        return _base64;
      };
      return _this;
    };
    base64DecodeInputStream = function(str) {
      let _str = str;
      let _pos = 0;
      let _buffer = 0;
      let _buflen = 0;
      const _this = {};
      _this.read = function() {
        while (_buflen < 8) {
          if (_pos >= _str.length) {
            if (_buflen == 0) {
              return -1;
            }
            throw new Error("unexpected end of file./" + _buflen);
          }
          let c = _str.charAt(_pos);
          _pos += 1;
          if (c == "=") {
            _buflen = 0;
            return -1;
          } else if (c.match(/^\s$/)) {
            continue;
          }
          _buffer = _buffer << 6 | decode(c.charCodeAt(0));
          _buflen += 6;
        }
        let n = _buffer >>> _buflen - 8 & 255;
        _buflen -= 8;
        return n;
      };
      const decode = function(c) {
        if (65 <= c && c <= 90) {
          return c - 65;
        } else if (97 <= c && c <= 122) {
          return c - 97 + 26;
        } else if (48 <= c && c <= 57) {
          return c - 48 + 52;
        } else if (c == 43) {
          return 62;
        } else if (c == 47) {
          return 63;
        } else {
          throw new Error("c:" + c);
        }
      };
      return _this;
    };
    gifImage = function(width, height) {
      let _width = width;
      let _height = height;
      let _data = new Array(width * height);
      const _this = {};
      _this.setPixel = function(x, y, pixel) {
        _data[y * _width + x] = pixel;
      };
      _this.write = function(out) {
        out.writeString("GIF87a");
        out.writeShort(_width);
        out.writeShort(_height);
        out.writeByte(128);
        out.writeByte(0);
        out.writeByte(0);
        out.writeByte(0);
        out.writeByte(0);
        out.writeByte(0);
        out.writeByte(255);
        out.writeByte(255);
        out.writeByte(255);
        out.writeString(",");
        out.writeShort(0);
        out.writeShort(0);
        out.writeShort(_width);
        out.writeShort(_height);
        out.writeByte(0);
        let lzwMinCodeSize = 2;
        let raster = getLZWRaster(lzwMinCodeSize);
        out.writeByte(lzwMinCodeSize);
        let offset = 0;
        while (raster.length - offset > 255) {
          out.writeByte(255);
          out.writeBytes(raster, offset, 255);
          offset += 255;
        }
        out.writeByte(raster.length - offset);
        out.writeBytes(raster, offset, raster.length - offset);
        out.writeByte(0);
        out.writeString(";");
      };
      const bitOutputStream = function(out) {
        let _out = out;
        let _bitLength = 0;
        let _bitBuffer = 0;
        const _this2 = {};
        _this2.write = function(data, length) {
          if (data >>> length != 0) {
            throw new Error("length over");
          }
          while (_bitLength + length >= 8) {
            _out.writeByte(255 & (data << _bitLength | _bitBuffer));
            length -= 8 - _bitLength;
            data >>>= 8 - _bitLength;
            _bitBuffer = 0;
            _bitLength = 0;
          }
          _bitBuffer = data << _bitLength | _bitBuffer;
          _bitLength = _bitLength + length;
        };
        _this2.flush = function() {
          if (_bitLength > 0) {
            _out.writeByte(_bitBuffer);
          }
        };
        return _this2;
      };
      const getLZWRaster = function(lzwMinCodeSize) {
        const clearCode = 1 << lzwMinCodeSize;
        const endCode = (1 << lzwMinCodeSize) + 1;
        let bitLength = lzwMinCodeSize + 1;
        let table = lzwTable();
        for (let i = 0; i < clearCode; i += 1) {
          table.add(String.fromCharCode(i));
        }
        table.add(String.fromCharCode(clearCode));
        table.add(String.fromCharCode(endCode));
        const byteOut = byteArrayOutputStream();
        const bitOut = bitOutputStream(byteOut);
        bitOut.write(clearCode, bitLength);
        let dataIndex = 0;
        let s = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;
        while (dataIndex < _data.length) {
          let c = String.fromCharCode(_data[dataIndex]);
          dataIndex += 1;
          if (table.contains(s + c)) {
            s = s + c;
          } else {
            bitOut.write(table.indexOf(s), bitLength);
            if (table.size() < 4095) {
              if (table.size() == 1 << bitLength) {
                bitLength += 1;
              }
              table.add(s + c);
            }
            s = c;
          }
        }
        bitOut.write(table.indexOf(s), bitLength);
        bitOut.write(endCode, bitLength);
        bitOut.flush();
        return byteOut.toByteArray();
      };
      const lzwTable = function() {
        let _map = {};
        let _size = 0;
        const _this2 = {};
        _this2.add = function(key) {
          if (_this2.contains(key)) {
            throw new Error("dup key:" + key);
          }
          _map[key] = _size;
          _size += 1;
        };
        _this2.size = function() {
          return _size;
        };
        _this2.indexOf = function(key) {
          return _map[key];
        };
        _this2.contains = function(key) {
          return typeof _map[key] != "undefined";
        };
        return _this2;
      };
      return _this;
    };
    createImgTag = function(width, height, getPixel) {
      const gif = gifImage(width, height);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          gif.setPixel(x, y, getPixel(x, y));
        }
      }
      const b = byteArrayOutputStream();
      gif.write(b);
      const base64 = base64EncodeOutputStream();
      const bytes = b.toByteArray();
      for (let i = 0; i < bytes.length; i += 1) {
        base64.writeByte(bytes[i]);
      }
      base64.flush();
      let img = "";
      img += "data:image/gif;base64,";
      img += base64;
      return img;
    };
    createQrCodeImg = function(text, options = {}) {
      const typeNumber = options.typeNumber || 4;
      const errorCorrectLevel = options.errorCorrectLevel || "M";
      const size = options.size || 500;
      let qr;
      try {
        qr = qrcode(typeNumber, errorCorrectLevel || "M");
        qr.addData(text);
        qr.make();
      } catch (e) {
        if (typeNumber >= 40) {
          throw new Error("Text too long to encode");
        } else {
          return createQrCodeImg(text, {
            size,
            errorCorrectLevel,
            typeNumber: typeNumber + 1
          });
        }
      }
      const cellSize = parseInt((size / qr.getModuleCount()).toString());
      const margin = parseInt(((size - qr.getModuleCount() * cellSize) / 2).toString());
      return qr.createImgTag(cellSize, margin, size);
    };
    qr_default = createQrCodeImg;
  }
});

// node_modules/@mosowe2/js/index.js
var require_js = __commonJS({
  "node_modules/@mosowe2/js/index.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    exports.__esModule = true;
    exports.CanvasPolygonClip = exports.CanvasDaubClip = exports.CanvasImageCompose = exports.Throttle = exports.Debounce = exports.Base64toBlob = exports.WebImageToBase64 = exports.XMLHttpRequest = exports.FileDownload = exports.DeleteEmptyObj = exports.FileToBase64 = exports.DeepClone = exports.Copy = exports.OutScreenFileChoose = exports.NumberWan = exports.NumberIsFloat = exports.ReplaceStar = exports.NumberDot = exports.DateFormat = exports.local = exports.sessions = exports.IsSocialCreditCode = exports.SocialCreditCode = exports.IsPostCode = exports.PostCode = exports.IsUrl = exports.Url = exports.IsIpv4 = exports.Ipv4 = exports.IsCapitalEnglish = exports.CapitalEnglish = exports.IsEnglish = exports.English = exports.IsCnEnNuLine = exports.CnEnNuLine = exports.IsChinese = exports.Chinese = exports.IsDigitLetter = exports.DigitLetter = exports.IsDigit = exports.Digit = exports.IsIdCard = exports.IdCard = exports.IsEmail = exports.Email = exports.IsStudioCamera = exports.StudioCamera = exports.IsMobile = exports.Mobile = exports.CreateQrCode = void 0;
    exports.IsTrue = exports.IsFalse = exports.IsUndefined = exports.IsNull = exports.IsFunction = exports.IsBoolean = exports.IsDate = exports.IsString = exports.IsNumber = exports.IsArray = exports.IsObject = exports.IsPhone = void 0;
    var qr_1 = (init_qr(), __toCommonJS(qr_exports));
    var CreateQrCode = function(text, options) {
      if (options === void 0) {
        options = {};
      }
      return (0, qr_1["default"])(text, options);
    };
    exports.CreateQrCode = CreateQrCode;
    exports.Mobile = /^1[3456789]\d{9}$/;
    var IsMobile = function(value) {
      return exports.Mobile.test(value);
    };
    exports.IsMobile = IsMobile;
    exports.StudioCamera = /^0\d{2,3}-\d{6,8}$/;
    var IsStudioCamera = function(value) {
      return exports.StudioCamera.test(value);
    };
    exports.IsStudioCamera = IsStudioCamera;
    exports.Email = /^\w+(\.)?(\w+)?@[0-9a-z]+(\.[a-z]+){1,3}$/;
    var IsEmail = function(value) {
      return exports.Email.test(value);
    };
    exports.IsEmail = IsEmail;
    exports.IdCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var IsIdCard = function(value) {
      return exports.IdCard.test(value);
    };
    exports.IsIdCard = IsIdCard;
    exports.Digit = /^\d+$/;
    var IsDigit = function(value) {
      return exports.Digit.test(value);
    };
    exports.IsDigit = IsDigit;
    exports.DigitLetter = /^[A-Za-z0-9]+$/;
    var IsDigitLetter = function(value) {
      return exports.DigitLetter.test(value);
    };
    exports.IsDigitLetter = IsDigitLetter;
    exports.Chinese = /^[\u4e00-\u9fa5]+$/;
    var IsChinese = function(value) {
      return exports.Chinese.test(value);
    };
    exports.IsChinese = IsChinese;
    exports.CnEnNuLine = /^[\u4e00-\u9fa5A-Za-z0-9_]+$/;
    var IsCnEnNuLine = function(value) {
      return exports.CnEnNuLine.test(value);
    };
    exports.IsCnEnNuLine = IsCnEnNuLine;
    exports.English = /^[A-Za-z]+$/;
    var IsEnglish = function(value) {
      return exports.English.test(value);
    };
    exports.IsEnglish = IsEnglish;
    exports.CapitalEnglish = /^[A-Z]+$/;
    var IsCapitalEnglish = function(value) {
      return exports.CapitalEnglish.test(value);
    };
    exports.IsCapitalEnglish = IsCapitalEnglish;
    exports.Ipv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
    var IsIpv4 = function(value) {
      return exports.Ipv4.test(value);
    };
    exports.IsIpv4 = IsIpv4;
    exports.Url = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=]+$/;
    var IsUrl = function(value) {
      return exports.Url.test(value);
    };
    exports.IsUrl = IsUrl;
    exports.PostCode = /^[0-8]\d{5}$/;
    var IsPostCode = function(value) {
      return exports.PostCode.test(value);
    };
    exports.IsPostCode = IsPostCode;
    exports.SocialCreditCode = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/;
    var IsSocialCreditCode = function(value) {
      return exports.SocialCreditCode.test(value);
    };
    exports.IsSocialCreditCode = IsSocialCreditCode;
    exports.sessions = {
      get: function(key) {
        var data = sessionStorage[key];
        if (!data || data === "null") {
          return null;
        }
        return JSON.parse(data).value;
      },
      set: function(key, value) {
        var data = {
          value
        };
        sessionStorage[key] = JSON.stringify(data);
      },
      remove: function(key) {
        sessionStorage.removeItem(key);
      },
      clear: function() {
        sessionStorage.clear();
      }
    };
    exports.local = {
      get: function(key) {
        var data = localStorage[key];
        if (!data || data === "null") {
          return null;
        }
        return JSON.parse(data).value;
      },
      set: function(key, value) {
        var data = {
          value
        };
        localStorage[key] = JSON.stringify(data);
      },
      remove: function(key) {
        localStorage.removeItem(key);
      },
      clear: function() {
        localStorage.clear();
      }
    };
    var DateFormat = function(timeTemp, fmt) {
      if (fmt === void 0) {
        fmt = "YYYY-MM-DD hh:mm:ss";
      }
      if (!timeTemp && timeTemp !== 0 || typeof timeTemp !== "number") {
        return "";
      }
      var ThisDate = new Date(timeTemp);
      var getYearWeek = function() {
        var firstDay = new Date();
        var year = ThisDate.getFullYear();
        firstDay.setYear(year);
        firstDay.setMonth(0);
        firstDay.setDate(1);
        var yearDays = Math.ceil((ThisDate - firstDay) / (24 * 60 * 60 * 1e3));
        var days = yearDays + firstDay.getDay() + 1;
        var weeks = Math.ceil(days / 7);
        return { weeks, yearDays };
      };
      var getMonthWeek = function() {
        var w = ThisDate.getDay();
        var d = ThisDate.getDate();
        return Math.ceil((d + 6 - w) / 7);
      };
      var o = {
        "M+": ThisDate.getMonth() + 1,
        "D+": ThisDate.getDate(),
        "h+": ThisDate.getHours(),
        "m+": ThisDate.getMinutes(),
        "s+": ThisDate.getSeconds(),
        "q+": Math.floor((ThisDate.getMonth() + 3) / 3),
        "S": ThisDate.getMilliseconds(),
        "w": getMonthWeek(),
        "WW": getYearWeek().weeks,
        "d": ThisDate.getDay(),
        "n": getYearWeek().yearDays + 1
      };
      if (/([yY]+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (ThisDate.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          var sk = RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length);
          fmt = fmt.replace(RegExp.$1, sk);
        }
      }
      return fmt;
    };
    exports.DateFormat = DateFormat;
    var NumberDot = function(value, float) {
      if (float === void 0) {
        float = false;
      }
      if (!value && value !== 0 || typeof value !== "number") {
        return "";
      }
      var str = value.toString();
      var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
      if (float) {
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return str.replace(reg, "$1,");
    };
    exports.NumberDot = NumberDot;
    var ReplaceStar = function(value, start, end) {
      if (start === void 0) {
        start = 3;
      }
      if (end === void 0) {
        end = 4;
      }
      if (!value || typeof value !== "string") {
        return value;
      }
      if (value.length <= start + end) {
        console.error("replaceStar: value.length less than (start + end)total, the value (".concat(value, ")"));
        return value;
      }
      var str = "*";
      str = str.repeat(value.length - start - end);
      var re = new RegExp("(.{" + start + "}).*(.{" + end + "})", "");
      return value.replace(re, "$1" + str + "$2");
    };
    exports.ReplaceStar = ReplaceStar;
    var NumberIsFloat = function(number, maxLen) {
      if (!isNaN(number) && number.toString().indexOf(".") > -1) {
        if (maxLen) {
          return number.toString().split(".")[1].length > maxLen ? false : true;
        }
        return true;
      }
      return maxLen ? true : false;
    };
    exports.NumberIsFloat = NumberIsFloat;
    var NumberWan = function(value, float) {
      if (float === void 0) {
        float = 2;
      }
      if (!value && value !== 0 || typeof value !== "number") {
        return "";
      }
      if (value < 1e4) {
        var str = value.toString();
        var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
        return str.replace(reg, "$1,");
      } else {
        var str = Number((value / 1e4).toFixed(float)).toString();
        var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
        return str.replace(reg, "$1,");
      }
    };
    exports.NumberWan = NumberWan;
    var OutScreenFileChoose = function(config) {
      var inputObj = document.createElement("input");
      inputObj.setAttribute("type", "file");
      inputObj.setAttribute("name", "file");
      (config === null || config === void 0 ? void 0 : config.multiple) ? inputObj.setAttribute("multiple", "true") : "";
      inputObj.setAttribute("accept", (config === null || config === void 0 ? void 0 : config.accept) || "image/*");
      inputObj.click();
      return new Promise(function(resolve, reject) {
        try {
          inputObj.addEventListener("change", function(e) {
            var files = e.target.files;
            var forms = [];
            if (config === null || config === void 0 ? void 0 : config.formData) {
              for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var item = files_1[_i];
                var form = new FormData();
                form.append((config === null || config === void 0 ? void 0 : config.fileName) || "file", item);
                forms.push(form);
              }
            } else {
              forms = files;
            }
            resolve(forms);
          });
        } catch (_a) {
          resolve("");
        }
      });
    };
    exports.OutScreenFileChoose = OutScreenFileChoose;
    var Copy = function(value) {
      try {
        var input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", value);
        input.select();
        if (document.execCommand("copy")) {
          document.execCommand("copy");
          document.body.removeChild(input);
          return true;
        }
        document.body.removeChild(input);
        return false;
      } catch (_a) {
        return false;
      }
    };
    exports.Copy = Copy;
    var DeepClone = function(value, map) {
      if (map === void 0) {
        map = /* @__PURE__ */ new WeakMap();
      }
      if (value.constructor === Date) {
        return new Date(value);
      }
      if (value.constructor === Set) {
        return new Set(value);
      }
      if (value.constructor === Map) {
        return new Map(value);
      }
      if (value.constructor === RegExp) {
        return new RegExp(value);
      }
      if (typeof value !== "object" || value === null) {
        return value;
      }
      var prototype = Object.getPrototypeOf(value);
      var description = Object.getOwnPropertyDescriptors(value);
      var object = Object.create(prototype, description);
      map.set(value, object);
      Reflect.ownKeys(value).forEach(function(key) {
        if (typeof key !== object || key === null) {
          object[key] = value[key];
        } else {
          var mapValue = map.get(value);
          mapValue ? object[key] = map.get(value) : object[key] = (0, exports.DeepClone)(value[key]);
        }
      });
      return object;
    };
    exports.DeepClone = DeepClone;
    var FileToBase64 = function(file) {
      return new Promise(function(resolve, reject) {
        try {
          var reader = new FileReader();
          reader.onload = function(evt) {
            var base64 = evt.target.result;
            resolve(base64);
          };
          reader.readAsDataURL(file);
        } catch (_a) {
          resolve("");
        }
      });
    };
    exports.FileToBase64 = FileToBase64;
    var DeleteEmptyObj = function(obj) {
      var result = {};
      if (obj === null || obj === void 0 || obj === "")
        return result;
      for (var key in obj) {
        if ((0, exports.IsObject)(obj[key])) {
          result[key] = (0, exports.DeleteEmptyObj)(obj[key]);
        } else if (obj[key] !== null && obj[key] !== void 0 && obj[key] !== "") {
          result[key] = obj[key];
        }
      }
      return result;
    };
    exports.DeleteEmptyObj = DeleteEmptyObj;
    var FileDownload = function(link, name) {
      return __awaiter(void 0, void 0, void 0, function() {
        var fileName, type, image;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              fileName = name ? name : decodeURIComponent(link.split("?")[0].split(".").reverse()[1].split("/").reverse()[0]);
              type = link.split(".").reverse()[0].split("?")[0].toLowerCase();
              if (!["jpg", "png", "jpeg", "gif", "webp"].includes(type))
                return [3, 2];
              return [4, (0, exports.WebImageToBase64)(link)];
            case 1:
              image = _a.sent();
              if (image) {
                (0, exports.XMLHttpRequest)(image, "".concat(fileName, ".").concat(type), "image");
                return [2];
              }
              console.error("WebImageToBase64 back value error");
              return [3, 3];
            case 2:
              (0, exports.XMLHttpRequest)(link, fileName, "file");
              _a.label = 3;
            case 3:
              return [2];
          }
        });
      });
    };
    exports.FileDownload = FileDownload;
    var XMLHttpRequest = function(link, name, type) {
      var x = new window.XMLHttpRequest();
      x.open("GET", link, true);
      x.responseType = "blob";
      x.onload = function() {
        var blob = x.response;
        var url = window.URL.createObjectURL(blob);
        if ("msSaveBlob" in window.navigator) {
          try {
            window.navigator.msSaveBlob(type === "image" ? link : blob, name);
          } catch (e) {
            console.error(e);
          }
        } else {
          var a = document.createElement("a");
          a.href = url;
          a.download = name || "";
          a.click();
        }
      };
      x.send();
    };
    exports.XMLHttpRequest = XMLHttpRequest;
    var WebImageToBase64 = function(imgUrl) {
      return new Promise(function(resolve, reject) {
        try {
          var canvas_1 = document.createElement("canvas");
          var image_1 = new Image();
          image_1.setAttribute("crossOrigin", "anonymous");
          image_1.src = "".concat(imgUrl).concat(imgUrl.indexOf("?") > -1 ? "&" : "?", "v=").concat(Math.random());
          image_1.onload = function() {
            return __awaiter(void 0, void 0, void 0, function() {
              var ctx, ext, base64, blob;
              return __generator(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    canvas_1.width = image_1.width;
                    canvas_1.height = image_1.height;
                    ctx = canvas_1.getContext("2d");
                    ctx && ctx.drawImage(image_1, 0, 0, image_1.width, image_1.height);
                    ext = image_1.src.substring(image_1.src.lastIndexOf(".") + 1).toLowerCase();
                    base64 = canvas_1.toDataURL("image/".concat(ext));
                    if (!("msSaveBlob" in window.navigator))
                      return [3, 2];
                    return [4, (0, exports.Base64toBlob)(base64)];
                  case 1:
                    blob = _a.sent();
                    if (blob) {
                      resolve(blob);
                    }
                    resolve("");
                    console.error("Base64toBlob back value is error");
                    return [3, 3];
                  case 2:
                    resolve(base64);
                    _a.label = 3;
                  case 3:
                    return [2];
                }
              });
            });
          };
        } catch (_a) {
          resolve("");
        }
      });
    };
    exports.WebImageToBase64 = WebImageToBase64;
    var Base64toBlob = function(base64) {
      return new Promise(function(resolve, reject) {
        try {
          var arr = base64.split(",");
          var bstr = atob(arr[1]);
          var n = bstr.length;
          var u8arr = new Uint8Array(n);
          while (n > 0) {
            n -= 1;
            u8arr[n] = bstr.charCodeAt(n);
          }
          var blob = new Blob([u8arr]);
          resolve(new File([blob], "".concat(Date.now(), ".").concat(base64.match(/:(\S*);/)[1].split("/")[1]), { type: base64.match(/:(\S*);/)[1] }));
        } catch (_a) {
          resolve("");
        }
      });
    };
    exports.Base64toBlob = Base64toBlob;
    var debounceTime = null;
    var Debounce = function(cb, time) {
      if (time === void 0) {
        time = 300;
      }
      if (debounceTime) {
        clearTimeout(debounceTime);
        debounceTime = null;
      }
      debounceTime = setTimeout(function() {
        clearTimeout(debounceTime);
        debounceTime = null;
        cb();
      }, time);
    };
    exports.Debounce = Debounce;
    var throttleTime = null;
    var Throttle = function(cb, time) {
      if (time === void 0) {
        time = 300;
      }
      if (throttleTime) {
        return;
      }
      throttleTime = setTimeout(function() {
        clearTimeout(throttleTime);
        throttleTime = null;
        cb();
      }, time);
    };
    exports.Throttle = Throttle;
    var CanvasImageCompose = function(config) {
      return new Promise(function(resolve, reject) {
        var _a;
        try {
          if (!config || !(config === null || config === void 0 ? void 0 : config.list) || ((_a = config === null || config === void 0 ? void 0 : config.list) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            console.error("prototype: list empty!");
            resolve("");
          }
          var Init_1 = {
            imgType: config.imgType || "jpeg",
            height: config.height || 1330,
            width: config.width || 750,
            list: config.list,
            arcWidth: 500,
            arcHeight: 500
          };
          var drawIndex_1 = 0;
          if (Init_1.imgType === "jpeg") {
            Init_1.list.unshift({
              type: "rect",
              x: 0,
              y: 0,
              content: "",
              color: "#ffffff",
              width: Init_1.width,
              height: Init_1.height,
              globalAlpha: 1
            });
          }
          var CanvasBox_1 = document.createElement("div");
          CanvasBox_1.style.display = "none";
          var CanvasMain_1 = document.createElement("canvas");
          CanvasMain_1.width = Init_1.width;
          CanvasMain_1.height = Init_1.height;
          CanvasMain_1.setAttribute("style", "width:".concat(Init_1.width * window.devicePixelRatio, "px;height:").concat(Init_1.height * window.devicePixelRatio, "px"));
          CanvasMain_1.id = "CanvasMain";
          var CtxMain_1 = CanvasMain_1.getContext("2d");
          var CanvasArc_1 = document.createElement("canvas");
          CanvasArc_1.width = Init_1.arcWidth;
          CanvasArc_1.height = Init_1.arcWidth;
          CanvasArc_1.setAttribute("style", "width:".concat(Init_1.arcWidth * window.devicePixelRatio, "px;height:").concat(Init_1.arcWidth * window.devicePixelRatio, "px"));
          CanvasArc_1.id = "CanvasArc";
          var CtxArc_1 = CanvasArc_1.getContext("2d");
          CanvasBox_1.appendChild(CanvasMain_1);
          CanvasBox_1.appendChild(CanvasArc_1);
          document.body.appendChild(CanvasBox_1);
          var drawStart_1 = function() {
            return __awaiter(void 0, void 0, void 0, function() {
              var item, _a2;
              var _b;
              return __generator(this, function(_c) {
                switch (_c.label) {
                  case 0:
                    item = Init_1.list[drawIndex_1];
                    if (!(item.type === "image"))
                      return [3, 4];
                    if (!(typeof item.content === "string" && ((_b = item.content) === null || _b === void 0 ? void 0 : _b.startsWith("http"))))
                      return [3, 1];
                    downloadImageH5_1(item);
                    return [3, 3];
                  case 1:
                    _a2 = item;
                    return [4, (0, exports.FileToBase64)(item.content)];
                  case 2:
                    _a2.content = _c.sent();
                    if (item.arc) {
                      drawImageArc_1(item);
                    } else {
                      drawImage_1(item);
                    }
                    _c.label = 3;
                  case 3:
                    return [3, 5];
                  case 4:
                    if (item.type === "text") {
                      drawText_1(item);
                    } else if (item.type === "rect") {
                      drawRect_1(item);
                    } else if (item.type === "arc") {
                      drawArc_1(item);
                    }
                    _c.label = 5;
                  case 5:
                    return [2];
                }
              });
            });
          };
          var drawRect_1 = function(item) {
            CtxMain_1.fillStyle = (item === null || item === void 0 ? void 0 : item.color) || "#000000";
            CtxMain_1.globalAlpha = (item === null || item === void 0 ? void 0 : item.globalAlpha) || 1;
            CtxMain_1.fillRect(item.x, item.y, item.width || 0, item.height || 0);
            checkDrawOver_1();
          };
          var drawArc_1 = function(item) {
            var arcR = ((item === null || item === void 0 ? void 0 : item.width) || 0) / 2;
            CtxMain_1.arc(item.x + arcR, item.y + arcR, arcR, 0, 2 * Math.PI);
            CtxMain_1.fillStyle = (item === null || item === void 0 ? void 0 : item.color) || "#000000";
            CtxMain_1.strokeStyle = "#ff0000";
            CtxMain_1.globalAlpha = (item === null || item === void 0 ? void 0 : item.globalAlpha) || 1;
            CtxMain_1.fill();
            CtxMain_1.closePath();
            checkDrawOver_1();
          };
          var drawText_1 = function(item) {
            CtxMain_1.fillStyle = (item === null || item === void 0 ? void 0 : item.color) || "#000000";
            if (item === null || item === void 0 ? void 0 : item.font) {
              CtxMain_1.font = item.font;
            }
            CtxMain_1.textAlign = (item === null || item === void 0 ? void 0 : item.align) || "left";
            CtxMain_1.globalAlpha = (item === null || item === void 0 ? void 0 : item.globalAlpha) || 1;
            if (item === null || item === void 0 ? void 0 : item.maxWidth) {
              CtxMain_1.fillText(item.content, item.x, item.y, item.maxWidth);
            } else {
              CtxMain_1.fillText(item.content, item.x, item.y);
            }
            checkDrawOver_1();
          };
          var downloadImageH5_1 = function(item) {
            return __awaiter(void 0, void 0, void 0, function() {
              var base64;
              return __generator(this, function(_a2) {
                switch (_a2.label) {
                  case 0:
                    return [4, (0, exports.WebImageToBase64)(item.content)];
                  case 1:
                    base64 = _a2.sent();
                    if (!base64) {
                      checkDrawOver_1();
                      return [2];
                    }
                    item.content = base64;
                    if (item === null || item === void 0 ? void 0 : item.arc) {
                      drawImageArc_1(item);
                    } else {
                      drawImage_1(item);
                    }
                    return [2];
                }
              });
            });
          };
          var drawImageArc_1 = function(item) {
            CtxArc_1.clearRect(0, 0, Init_1.arcWidth, Init_1.arcHeight);
            CtxArc_1.beginPath();
            CtxArc_1.arc(Init_1.arcWidth / 2, Init_1.arcWidth / 2, Init_1.arcWidth / 2, 0, 2 * Math.PI);
            CtxArc_1.closePath();
            CtxArc_1.clip();
            var image = new Image();
            image.src = item.content;
            var width = image.width;
            var height = image.height;
            var x = 0;
            var y = 0;
            if (!(item === null || item === void 0 ? void 0 : item.arcType) || (item === null || item === void 0 ? void 0 : item.arcType) === "cover") {
              width = Init_1.arcWidth;
              height = Init_1.arcHeight;
            }
            if ((item === null || item === void 0 ? void 0 : item.arcType) === "scale") {
              if (image.width > image.height) {
                width = Init_1.arcWidth;
                height = Init_1.arcWidth * image.height / image.width;
              } else {
                width = Init_1.arcWidth * image.width / image.height;
                height = Init_1.arcWidth;
              }
            }
            x = (Init_1.arcWidth - width) / 2;
            y = (Init_1.arcWidth - height) / 2;
            if ((item === null || item === void 0 ? void 0 : item.arcType) === "clip" && (item === null || item === void 0 ? void 0 : item.arcClipXYS) && (item === null || item === void 0 ? void 0 : item.arcClipXYS.length) === 3) {
              width = image.width * item.arcClipXYS[2];
              height = image.height * item.arcClipXYS[2];
              x = item.arcClipXYS[0];
              y = item.arcClipXYS[1];
            }
            image.style.width = "".concat(width, "px");
            image.style.height = "".concat(height, "px");
            image.onload = function() {
              var _a2;
              CtxArc_1.drawImage(image, x, y, width, height);
              var base64 = (_a2 = document.getElementById("CanvasArc")) === null || _a2 === void 0 ? void 0 : _a2.toDataURL("image/png");
              item.content = base64;
              drawImage_1(item);
            };
          };
          var drawImage_1 = function(item) {
            var image = new Image();
            image.src = item.content;
            CtxMain_1.globalAlpha = (item === null || item === void 0 ? void 0 : item.globalAlpha) || 1;
            image.onload = function() {
              CtxMain_1.drawImage(image, item.x, item.y, item.width || image.width, item.height || image.height);
              checkDrawOver_1();
            };
          };
          var checkDrawOver_1 = function() {
            if (drawIndex_1 < Init_1.list.length - 1) {
              drawIndex_1++;
              drawStart_1();
            } else {
              canvasImage_1();
            }
          };
          var canvasImage_1 = function() {
            var _a2;
            var base64 = (_a2 = document.getElementById("CanvasMain")) === null || _a2 === void 0 ? void 0 : _a2.toDataURL("image/".concat(Init_1.imgType), 0.99);
            resolve(base64);
            drawIndex_1 = null;
            document.body.removeChild(CanvasBox_1);
            CanvasBox_1 = null;
            CanvasMain_1 = null;
            CtxMain_1 = null;
            CanvasArc_1 = null;
            CtxArc_1 = null;
            Init_1 = null;
            drawStart_1 = null;
            drawRect_1 = null;
            drawArc_1 = null;
            drawText_1 = null;
            downloadImageH5_1 = null;
            drawImageArc_1 = null;
            drawImage_1 = null;
            checkDrawOver_1 = null;
            canvasImage_1 = null;
          };
          drawStart_1();
        } catch (_b) {
          resolve("");
        }
      });
    };
    exports.CanvasImageCompose = CanvasImageCompose;
    var CanvasDaubClip = function(config) {
      return new Promise(function(resolve, reject) {
        return __awaiter(void 0, void 0, void 0, function() {
          var Init_2, CanvasBox_2, Img_1, _a, _b, CanvasImage_1, CtxImage_1, CanvasShade_1, CtxShade_1, CanvasOut_1, CtxOut_1, createShade_1, fillShade_1, isMouseDown_1, isMobile_1, touches_1, imageClip_1, _c;
          return __generator(this, function(_d) {
            switch (_d.label) {
              case 0:
                _d.trys.push([0, 4, , 5]);
                if (!(config === null || config === void 0 ? void 0 : config.image)) {
                  console.error("prototype: image is empty!");
                  resolve("");
                }
                Init_2 = {
                  el: document.getElementById(config.el),
                  image: config.image,
                  radius: (config === null || config === void 0 ? void 0 : config.radius) || 20,
                  alpha: (config === null || config === void 0 ? void 0 : config.alpha) || 0.6,
                  handleClip: (config === null || config === void 0 ? void 0 : config.handleClip) || false,
                  width: (config === null || config === void 0 ? void 0 : config.width) || 300,
                  height: (config === null || config === void 0 ? void 0 : config.height) || 300,
                  shade: (config === null || config === void 0 ? void 0 : config.shade) || "#000000",
                  touchX: 0,
                  touchY: 0
                };
                CanvasBox_2 = document.createElement("div");
                CanvasBox_2.setAttribute("style", "\n        width:".concat(Init_2.width, "px;\n        height:").concat(Init_2.height, "px;\n        position: relative;\n        overflow: hidden\n      "));
                Img_1 = new Image();
                _a = Img_1;
                if (!(typeof Init_2.image === "object"))
                  return [3, 2];
                return [4, (0, exports.FileToBase64)(Init_2.image)];
              case 1:
                _b = _d.sent();
                return [3, 3];
              case 2:
                _b = Init_2.image;
                _d.label = 3;
              case 3:
                _a.src = _b;
                Img_1.setAttribute("style", "\n        display: block;\n      ");
                Img_1.onload = function() {
                  var w = Img_1.width;
                  var h = Img_1.height;
                  Img_1.width = Init_2.width;
                  Img_1.height = Init_2.width * h / w;
                };
                CanvasImage_1 = document.createElement("canvas");
                CanvasImage_1.width = Init_2.width;
                CanvasImage_1.height = Init_2.height;
                CanvasImage_1.setAttribute("style", "\n        width:".concat(Init_2.width, "px;\n        height:").concat(Init_2.height, "px;\n        position: absolute;\n        left: 10000px;\n        top: 0;\n      "));
                CanvasImage_1.id = "CanvasImage";
                CtxImage_1 = CanvasImage_1.getContext("2d");
                CanvasShade_1 = document.createElement("canvas");
                CanvasShade_1.width = Init_2.width;
                CanvasShade_1.height = Init_2.height;
                CanvasShade_1.setAttribute("style", "\n        width:".concat(Init_2.width, "px;\n        height:").concat(Init_2.height, "px;\n        position: absolute;\n        left: 0;\n        top: 0;\n        z-index: 9999\n      "));
                CanvasShade_1.id = "CanvasShade";
                CtxShade_1 = CanvasShade_1.getContext("2d");
                CanvasOut_1 = document.createElement("canvas");
                CanvasOut_1.id = "CanvasOut";
                CtxOut_1 = CanvasOut_1.getContext("2d");
                CtxShade_1.save();
                CtxImage_1.save();
                CanvasBox_2.appendChild(Img_1);
                CanvasBox_2.appendChild(CanvasImage_1);
                CanvasBox_2.appendChild(CanvasShade_1);
                CanvasBox_2.appendChild(CanvasOut_1);
                if (Init_2.el) {
                  Init_2.el.appendChild(CanvasBox_2);
                } else {
                  document.body.appendChild(CanvasBox_2);
                }
                createShade_1 = function() {
                  return __awaiter(void 0, void 0, void 0, function() {
                    var image_2, _a2, _b2;
                    return __generator(this, function(_c2) {
                      switch (_c2.label) {
                        case 0:
                          CtxShade_1.rect(0, 0, Init_2.width, Init_2.height);
                          if (!Init_2.shade.startsWith("#"))
                            return [3, 1];
                          CtxShade_1.fillStyle = Init_2.shade;
                          fillShade_1();
                          return [3, 5];
                        case 1:
                          image_2 = new Image();
                          _a2 = image_2;
                          if (!Init_2.shade.startsWith("http"))
                            return [3, 3];
                          return [4, (0, exports.WebImageToBase64)(Init_2.shade)];
                        case 2:
                          _b2 = _c2.sent();
                          return [3, 4];
                        case 3:
                          _b2 = Init_2.shade;
                          _c2.label = 4;
                        case 4:
                          _a2.src = _b2;
                          image_2.onload = function() {
                            CtxShade_1.drawImage(image_2, 0, 0, Init_2.width, Init_2.height);
                            fillShade_1();
                          };
                          _c2.label = 5;
                        case 5:
                          return [2];
                      }
                    });
                  });
                };
                fillShade_1 = function() {
                  CtxShade_1.globalAlpha = Init_2.alpha;
                  CtxShade_1.fill();
                  CtxShade_1.globalCompositeOperation = "destination-out";
                  CtxImage_1.beginPath();
                  CtxShade_1.beginPath();
                };
                createShade_1();
                isMouseDown_1 = false;
                isMobile_1 = /mobile|android|webos|iphone|ipad|phone/i.test(window.navigator.userAgent.toLowerCase());
                touches_1 = [];
                CanvasBox_2.addEventListener(isMobile_1 ? "touchstart" : "mousedown", function(e) {
                  isMouseDown_1 = true;
                  e.preventDefault();
                  if (!Init_2.image) {
                    return;
                  }
                  var offset = e.target.getBoundingClientRect();
                  if (isMobile_1) {
                    Init_2.touchX = e.touches[0].clientX - offset.left;
                    Init_2.touchY = e.touches[0].clientY - offset.top;
                  } else {
                    Init_2.touchX = e.clientX - offset.left;
                    Init_2.touchY = e.clientY - offset.top;
                  }
                  touches_1 = [Init_2.touchX, Init_2.touchY];
                  CtxShade_1.beginPath();
                  CtxShade_1.fillStyle = "rgba(0,0,0,1)";
                  CtxShade_1.arc(Init_2.touchX, Init_2.touchY, Init_2.radius, 0, Math.PI * 2, true);
                  CtxShade_1.fill();
                  CtxShade_1.closePath();
                  CtxImage_1.arc(Init_2.touchX, Init_2.touchY, Init_2.radius, 0, Math.PI * 2);
                  CtxImage_1.fill();
                  CtxImage_1.closePath();
                });
                CanvasBox_2.addEventListener(isMobile_1 ? "touchmove" : "mousemove", function(e) {
                  e.preventDefault();
                  if (!Init_2.image || !isMouseDown_1) {
                    return;
                  }
                  var x = 0;
                  var y = 0;
                  var offset = e.target.getBoundingClientRect();
                  if (isMobile_1) {
                    x = e.touches[0].clientX - offset.left;
                    y = e.touches[0].clientY - offset.top;
                  } else {
                    x = e.clientX - offset.left;
                    y = e.clientY - offset.top;
                  }
                  CtxShade_1.beginPath();
                  CtxShade_1.fillStyle = "rgba(0,0,0,1)";
                  CtxShade_1.arc(x, y, Init_2.radius, 0, Math.PI * 2, true);
                  CtxShade_1.fill();
                  CtxShade_1.closePath();
                  CtxImage_1.arc(x, y, Init_2.radius, 0, Math.PI * 2);
                  CtxImage_1.fill();
                  CtxImage_1.closePath();
                });
                CanvasBox_2.addEventListener(isMobile_1 ? "touchend" : "mouseup", function(e) {
                  return __awaiter(void 0, void 0, void 0, function() {
                    var _a2;
                    return __generator(this, function(_b2) {
                      switch (_b2.label) {
                        case 0:
                          e.preventDefault();
                          isMouseDown_1 = false;
                          if (!Init_2.handleClip)
                            return [3, 1];
                          resolve({
                            clip: function() {
                              return __awaiter(void 0, void 0, void 0, function() {
                                return __generator(this, function(_a3) {
                                  switch (_a3.label) {
                                    case 0:
                                      return [4, imageClip_1()];
                                    case 1:
                                      return [2, _a3.sent()];
                                  }
                                });
                              });
                            }
                          });
                          return [3, 3];
                        case 1:
                          _a2 = resolve;
                          return [4, imageClip_1()];
                        case 2:
                          _a2.apply(void 0, [_b2.sent()]);
                          _b2.label = 3;
                        case 3:
                          return [2];
                      }
                    });
                  });
                });
                imageClip_1 = function() {
                  return new Promise(function(resolve2, reject2) {
                    try {
                      CtxShade_1.clip();
                      CtxImage_1.clip();
                      CtxImage_1.drawImage(Img_1, 0, 0, Init_2.width, Img_1.height);
                      var data = CtxImage_1.getImageData(0, 0, Init_2.width, Init_2.height).data;
                      var threshold = 0;
                      var bOffset_1 = 0;
                      var rOffset_1 = 0;
                      var tOffset_1 = Init_2.height;
                      var lOffset_1 = Init_2.width;
                      for (var i = 0; i < Init_2.width; i++) {
                        for (var j = 0; j < Init_2.height; j++) {
                          var pos = (i + Init_2.width * j) * 4;
                          if (data[pos + 3] > threshold) {
                            bOffset_1 = Math.max(j, bOffset_1);
                            tOffset_1 = Math.min(j, tOffset_1);
                            rOffset_1 = Math.max(i, rOffset_1);
                            lOffset_1 = Math.min(i, lOffset_1);
                          }
                        }
                      }
                      var base64 = document.getElementById("CanvasImage").toDataURL("image/png");
                      var image_3 = new Image();
                      image_3.src = base64;
                      image_3.onload = function() {
                        CanvasOut_1.setAttribute("style", "\n                  width:".concat(rOffset_1 - lOffset_1, "px;\n                  height:").concat(bOffset_1 - tOffset_1, "px;\n                  position: absolute;\n                  left: 10000px;\n                  top: 0;\n                "));
                        CanvasOut_1.width = rOffset_1 - lOffset_1;
                        CanvasOut_1.height = bOffset_1 - tOffset_1;
                        CtxOut_1.drawImage(image_3, -lOffset_1, -tOffset_1, image_3.width, image_3.height);
                        CtxOut_1.clip();
                        var result = document.getElementById("CanvasOut").toDataURL("image/png");
                        if (Init_2.el) {
                          Init_2.el.removeChild(CanvasBox_2);
                        } else {
                          document.body.removeChild(CanvasBox_2);
                        }
                        CanvasBox_2 = null;
                        CanvasImage_1 = null;
                        CanvasShade_1 = null;
                        CanvasOut_1 = null;
                        CtxImage_1 = null;
                        CtxOut_1 = null;
                        CtxShade_1 = null;
                        Img_1 = null;
                        imageClip_1 = null;
                        createShade_1 = null;
                        fillShade_1 = null;
                        resolve2(result);
                      };
                    } catch (_a2) {
                      resolve2("");
                    }
                  });
                };
                return [3, 5];
              case 4:
                _c = _d.sent();
                resolve("");
                return [3, 5];
              case 5:
                return [2];
            }
          });
        });
      });
    };
    exports.CanvasDaubClip = CanvasDaubClip;
    var CanvasPolygonClip = function(config) {
      return new Promise(function(resolve, reject) {
        return __awaiter(void 0, void 0, void 0, function() {
          var isMobile, Init_3, CanvasBox_3, Img_2, _a, _b, CanvasImage_2, CtxImage_2, CanvasShade_2, CtxShade_2, CanvasOut_2, CtxOut_2, polygon_1, touches_2, moveTouches_1, lenTouches_1, rotateTouches_1, initLen_1, isMouseDown_2, buttonType_1, getAngle_1, imageClip_2, _c;
          return __generator(this, function(_d) {
            switch (_d.label) {
              case 0:
                _d.trys.push([0, 5, , 6]);
                if (!(config === null || config === void 0 ? void 0 : config.image)) {
                  console.error("prototype: image is empty!");
                  resolve("");
                }
                if ((config === null || config === void 0 ? void 0 : config.side) && (config === null || config === void 0 ? void 0 : config.side) < 3) {
                  console.error("prototype: side less than 3!");
                  resolve("");
                }
                isMobile = /mobile|android|webos|iphone|ipad|phone/i.test(window.navigator.userAgent.toLowerCase());
                Init_3 = {
                  el: document.getElementById(config.el),
                  image: config.image,
                  side: config.side || 3,
                  radius: (config === null || config === void 0 ? void 0 : config.radius) || 150,
                  alpha: (config === null || config === void 0 ? void 0 : config.alpha) || 0.6,
                  rect: (config === null || config === void 0 ? void 0 : config.rect) || false,
                  rectWidth: (config === null || config === void 0 ? void 0 : config.rectWidth) || 150,
                  rectHeight: (config === null || config === void 0 ? void 0 : config.rectHeight) || 150,
                  inner: (config === null || config === void 0 ? void 0 : config.inner) || false,
                  innerTimes: config.innerTimes || 0.4,
                  width: isMobile ? window.innerWidth : (config === null || config === void 0 ? void 0 : config.width) || window.innerWidth * 0.5,
                  height: isMobile ? window.innerHeight : (config === null || config === void 0 ? void 0 : config.height) || window.innerHeight,
                  rotate: (config === null || config === void 0 ? void 0 : config.rotate) === false ? false : true,
                  clipX: 0,
                  clipY: 0,
                  imageWidth: 0,
                  imageHeight: 0,
                  imageRotate: 0
                };
                CanvasBox_3 = document.createElement("div");
                CanvasBox_3.setAttribute("style", "\n        width:".concat(Init_3.width, "px;\n        height:").concat(Init_3.height, "px;\n        overflow: hidden;\n        position: ").concat((Init_3 === null || Init_3 === void 0 ? void 0 : Init_3.el) ? "relative" : "fixed", ";\n        left: ").concat((Init_3 === null || Init_3 === void 0 ? void 0 : Init_3.el) ? "unset" : "0", ";\n        top: ").concat((Init_3 === null || Init_3 === void 0 ? void 0 : Init_3.el) ? "unset" : "0", ";\n        margin: 0 auto\n      "));
                Img_2 = new Image();
                _a = Img_2;
                if (!(typeof Init_3.image === "object"))
                  return [3, 2];
                return [4, (0, exports.FileToBase64)(Init_3.image)];
              case 1:
                _b = _d.sent();
                return [3, 3];
              case 2:
                _b = Init_3.image;
                _d.label = 3;
              case 3:
                _a.src = _b;
                Img_2.setAttribute("style", "\n        display: block;\n        position:absolute;\n        left:0;\n        top:0\n      ");
                Img_2.onload = function() {
                  var w = Img_2.width;
                  var h = Img_2.height;
                  Img_2.width = Init_3.width;
                  Img_2.height = Init_3.width * h / w;
                  Init_3.imageWidth = Init_3.width;
                  Init_3.imageHeight = Init_3.width * h / w;
                };
                CanvasImage_2 = document.createElement("canvas");
                CanvasImage_2.width = Init_3.width;
                CanvasImage_2.height = Init_3.height;
                CanvasImage_2.setAttribute("style", "\n        width:".concat(Init_3.width, "px;\n        height:").concat(Init_3.height, "px;\n        position: absolute;\n        left: 10000px;\n        top: 0;\n      "));
                CanvasImage_2.id = "CanvasImage";
                CtxImage_2 = CanvasImage_2.getContext("2d");
                CtxImage_2.translate(Init_3.width / 2, Init_3.height / 2);
                CanvasShade_2 = document.createElement("canvas");
                CanvasShade_2.width = Init_3.width;
                CanvasShade_2.height = Init_3.height;
                CanvasShade_2.setAttribute("style", "\n        width:".concat(Init_3.width, "px;\n        height:").concat(Init_3.height, "px;\n        position: absolute;\n        left: 0;\n        top: 0;\n        z-index: 9999\n      "));
                CanvasShade_2.id = "CanvasShade";
                CtxShade_2 = CanvasShade_2.getContext("2d");
                CtxShade_2.translate(Init_3.width / 2, Init_3.height / 2);
                CanvasOut_2 = document.createElement("canvas");
                CanvasOut_2.id = "CanvasOut";
                CtxOut_2 = CanvasOut_2.getContext("2d");
                CtxShade_2.save();
                CtxImage_2.save();
                CanvasBox_3.appendChild(Img_2);
                CanvasBox_3.appendChild(CanvasImage_2);
                CanvasBox_3.appendChild(CanvasShade_2);
                CanvasBox_3.appendChild(CanvasOut_2);
                if (Init_3.el) {
                  Init_3.el.appendChild(CanvasBox_3);
                } else {
                  document.body.appendChild(CanvasBox_3);
                }
                polygon_1 = function(ctx, bool, conf) {
                  return new Promise(function(resolve2, reject2) {
                    return __awaiter(void 0, void 0, void 0, function() {
                      var x, y, num, r, inner, rect, rectW, rectH, width, strokeStyle, startX, startY, i, newX, newY, newX1, newY1, newX, newY, img, _a2, _b2, data;
                      return __generator(this, function(_c2) {
                        switch (_c2.label) {
                          case 0:
                            x = conf && conf.x || 0;
                            y = conf && conf.y || 0;
                            num = conf && conf.num || 3;
                            r = conf && conf.r || 100;
                            inner = conf && conf.inner || false;
                            rect = conf && conf.rect || false;
                            rectW = conf && conf.rectW || r;
                            rectH = conf && conf.rectH || r;
                            width = conf && conf.width || 2;
                            strokeStyle = conf && conf.strokeStyle || false;
                            if (rect) {
                              ctx.beginPath();
                              ctx.rect(x - rectW / 2 - Init_3.width / 2, y - rectH / 2 - Init_3.height / 2, rectW, rectH);
                              ctx.closePath();
                            } else {
                              ctx.beginPath();
                              startX = x - r * Math.sin(2 * Math.PI * 0 / num);
                              startY = y - r * Math.cos(2 * Math.PI * 0 / num);
                              ctx.moveTo(startX - Init_3.width / 2, startY - Init_3.height / 2);
                              for (i = 1; i <= num; i++) {
                                if (inner) {
                                  if (i % 2 === 0) {
                                    newX = x - r * Math.sin(2 * Math.PI * i / num);
                                    newY = y - r * Math.cos(2 * Math.PI * i / num);
                                    ctx.lineTo(newX - Init_3.width / 2, newY - Init_3.height / 2);
                                  } else {
                                    newX1 = x - Math.ceil(r * Init_3.innerTimes) * Math.sin(2 * Math.PI * i / num);
                                    newY1 = y - Math.ceil(r * Init_3.innerTimes) * Math.cos(2 * Math.PI * i / num);
                                    ctx.lineTo(newX1 - Init_3.width / 2, newY1 - Init_3.height / 2);
                                  }
                                } else {
                                  newX = x - r * Math.sin(2 * Math.PI * i / num);
                                  newY = y - r * Math.cos(2 * Math.PI * i / num);
                                  ctx.lineTo(newX - Init_3.width / 2, newY - Init_3.height / 2);
                                }
                              }
                              ctx.closePath();
                            }
                            if (strokeStyle) {
                              ctx.strokeStyle = strokeStyle;
                              ctx.lineWidth = 1;
                              ctx.lineJoin = "round";
                              ctx.stroke();
                            }
                            if (!bool) {
                              ctx.fill();
                              ctx.globalCompositeOperation = "source-out";
                              ctx.beginPath();
                              ctx.rect(0 - Init_3.width / 2, 0 - Init_3.height / 2, Init_3.width, Init_3.height);
                              ctx.closePath();
                              ctx.fillStyle = "rgba(0,0,0," + Number(Init_3.alpha) + ")";
                              ctx.fill();
                              resolve2(true);
                            }
                            if (!bool)
                              return [3, 5];
                            img = new Image();
                            _a2 = img;
                            if (!(typeof Init_3.image === "object"))
                              return [3, 2];
                            return [4, (0, exports.FileToBase64)(Init_3.image)];
                          case 1:
                            _b2 = _c2.sent();
                            return [3, 3];
                          case 2:
                            _b2 = Init_3.image;
                            _c2.label = 3;
                          case 3:
                            _a2.src = _b2;
                            return [4, imageClip_2(img)];
                          case 4:
                            data = _c2.sent();
                            resolve2(data);
                            _c2.label = 5;
                          case 5:
                            return [2];
                        }
                      });
                    });
                  });
                };
                return [4, polygon_1(CtxShade_2, false, {
                  x: Init_3.width / 2,
                  y: Init_3.height / 2,
                  num: Init_3.side,
                  r: Init_3.radius,
                  rect: Init_3.rect,
                  rectW: Init_3.rectWidth,
                  rectH: Init_3.rectHeight,
                  inner: Init_3.inner
                })];
              case 4:
                _d.sent();
                resolve({
                  clip: function() {
                    return __awaiter(void 0, void 0, void 0, function() {
                      return __generator(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            return [4, polygon_1(CtxImage_2, true, {
                              x: Init_3.width / 2,
                              y: Init_3.height / 2,
                              num: Init_3.side,
                              r: Init_3.radius,
                              rect: Init_3.rect,
                              rectW: Init_3.rectWidth,
                              rectH: Init_3.rectHeight,
                              inner: Init_3.inner
                            })];
                          case 1:
                            return [2, _a2.sent()];
                        }
                      });
                    });
                  }
                });
                touches_2 = [];
                moveTouches_1 = [];
                lenTouches_1 = [];
                rotateTouches_1 = 0;
                initLen_1 = 0;
                if (isMobile) {
                  CanvasBox_3.addEventListener("touchstart", function(e) {
                    e.preventDefault();
                    if (!Init_3.image) {
                      return;
                    }
                    touches_2 = [];
                    for (var _i = 0, _a2 = e.touches; _i < _a2.length; _i++) {
                      var item = _a2[_i];
                      var list = [item.clientX, item.clientY];
                      touches_2.push(list);
                    }
                    if (touches_2.length === 2) {
                      initLen_1 = Math.abs(touches_2[0][0] - touches_2[1][0]);
                    }
                    if (moveTouches_1.length === 2) {
                      Init_3.clipX = moveTouches_1[0] || Init_3.clipX;
                      Init_3.clipY = moveTouches_1[1] || Init_3.clipY;
                      moveTouches_1 = [];
                    }
                    if (lenTouches_1.length === 2) {
                      Init_3.imageWidth = lenTouches_1[0] || Init_3.imageWidth;
                      Init_3.imageHeight = lenTouches_1[1] || Init_3.imageHeight;
                      lenTouches_1 = [];
                    }
                  });
                  CanvasBox_3.addEventListener("touchmove", function(e) {
                    e.preventDefault();
                    if (!Init_3.image) {
                      return;
                    }
                    if (touches_2.length === 1) {
                      var moveX = e.touches[0].clientX - touches_2[0][0];
                      var moveY = e.touches[0].clientY - touches_2[0][1];
                      Img_2.style.left = moveX + Init_3.clipX + "px";
                      Img_2.style.top = moveY + Init_3.clipY + "px";
                      moveTouches_1 = [moveX + Init_3.clipX, moveY + Init_3.clipY];
                    }
                    if (touches_2.length === 2) {
                      var len = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
                      var r = (len - initLen_1) * 2;
                      var w = r + Init_3.imageWidth;
                      var h = w * Init_3.imageHeight / Init_3.imageWidth;
                      Img_2.style.width = w + "px";
                      Img_2.style.height = h + "px";
                      lenTouches_1 = [w, h];
                      Img_2.style.left = -r / 2 + Init_3.clipX + "px";
                      Img_2.style.top = -(h - Init_3.imageHeight) / 2 + Init_3.clipY + "px";
                      moveTouches_1 = [-r / 2 + Init_3.clipX, -(h - Init_3.imageHeight) / 2 + Init_3.clipY];
                    }
                    if (touches_2.length === 3 && Init_3.rotate) {
                      var origin_1 = [Init_3.width / 2, Init_3.height / 2];
                      var firstDot = touches_2[0];
                      var nextDot = [e.touches[0].clientX, e.touches[0].clientY];
                      var rotate = getAngle_1([firstDot[0] - origin_1[0], firstDot[1] - origin_1[1]], [nextDot[0] - origin_1[0], nextDot[1] - origin_1[1]]);
                      if (rotate > 0 && rotate < 180) {
                        rotateTouches_1 = Init_3.imageRotate + rotate;
                      } else {
                        rotateTouches_1 = Init_3.imageRotate - (360 - rotate);
                      }
                      Img_2.style.transform = "rotate(".concat(rotateTouches_1, "deg)");
                    }
                  });
                  CanvasBox_3.addEventListener("touchend", function(e) {
                    e.preventDefault();
                    touches_2 = [];
                    Init_3.clipX = moveTouches_1[0] || Init_3.clipX;
                    Init_3.clipY = moveTouches_1[1] || Init_3.clipY;
                    Init_3.imageWidth = lenTouches_1[0] || Init_3.imageWidth;
                    Init_3.imageHeight = lenTouches_1[1] || Init_3.imageHeight;
                    Init_3.imageRotate = rotateTouches_1;
                    moveTouches_1 = [];
                    lenTouches_1 = [];
                    initLen_1 = 0;
                    if (e.touches.length === 1) {
                      for (var _i = 0, _a2 = e.touches; _i < _a2.length; _i++) {
                        var item = _a2[_i];
                        var list = [item.clientX, item.clientY];
                        touches_2.push(list);
                      }
                    }
                  });
                } else {
                  CanvasBox_3.addEventListener("wheel", function(e) {
                    e.preventDefault();
                    var step = -e.deltaY;
                    var w = step + Init_3.imageWidth;
                    var h = w * Init_3.imageHeight / Init_3.imageWidth;
                    Img_2.style.width = w + "px";
                    Img_2.style.height = h + "px";
                    Img_2.style.left = -step / 2 + Init_3.clipX + "px";
                    Img_2.style.top = -(h - Init_3.imageHeight) / 2 + Init_3.clipY + "px";
                    moveTouches_1 = [-step / 2 + Init_3.clipX, -(h - Init_3.imageHeight) / 2 + Init_3.clipY];
                    Init_3.clipX = -step / 2 + Init_3.clipX;
                    Init_3.clipY = -(h - Init_3.imageHeight) / 2 + Init_3.clipY;
                    Init_3.imageWidth = w;
                    Init_3.imageHeight = h;
                  });
                  CanvasBox_3.addEventListener("contextmenu", function(e) {
                    e.preventDefault();
                  });
                  isMouseDown_2 = false;
                  buttonType_1 = 0;
                  CanvasBox_3.addEventListener("mousedown", function(e) {
                    isMouseDown_2 = true;
                    e.preventDefault();
                    buttonType_1 = e.button;
                    if (!Init_3.image) {
                      return;
                    }
                    var offset = e.target.getBoundingClientRect();
                    touches_2 = [e.clientX - offset.left, e.clientY - offset.top];
                  });
                  CanvasBox_3.addEventListener("mousemove", function(e) {
                    e.preventDefault();
                    if (!Init_3.image || !isMouseDown_2) {
                      return;
                    }
                    var offset = e.target.getBoundingClientRect();
                    var x = e.clientX - offset.left;
                    var y = e.clientY - offset.top;
                    var moveX = x - touches_2[0];
                    var moveY = y - touches_2[1];
                    if (buttonType_1 === 0) {
                      Img_2.style.left = moveX + Init_3.clipX + "px";
                      Img_2.style.top = moveY + Init_3.clipY + "px";
                      moveTouches_1 = [moveX + Init_3.clipX, moveY + Init_3.clipY];
                    }
                    if (buttonType_1 === 2 && Init_3.rotate) {
                      rotateTouches_1 = Init_3.imageRotate + moveY / 2;
                      Img_2.style.transform = "rotate(".concat(rotateTouches_1, "deg)");
                    }
                  });
                  CanvasBox_3.addEventListener("mouseup", function(e) {
                    return __awaiter(void 0, void 0, void 0, function() {
                      return __generator(this, function(_a2) {
                        e.preventDefault();
                        isMouseDown_2 = false;
                        Init_3.clipX = moveTouches_1[0] || Init_3.clipX;
                        Init_3.clipY = moveTouches_1[1] || Init_3.clipY;
                        Init_3.imageRotate = rotateTouches_1 || Init_3.imageRotate;
                        buttonType_1 = 0;
                        moveTouches_1 = [];
                        touches_2 = [];
                        return [2];
                      });
                    });
                  });
                }
                getAngle_1 = function(_a2, _b2) {
                  var x1 = _a2[0], y1 = _a2[1];
                  var x2 = _b2[0], y2 = _b2[1];
                  var dot = x1 * x2 + y1 * y2;
                  var det = x1 * y2 - y1 * x2;
                  var angle = Math.atan2(det, dot) / Math.PI * 180;
                  return Math.round(angle + 360) % 360;
                };
                imageClip_2 = function(img) {
                  return new Promise(function(resolve2, reject2) {
                    try {
                      CtxShade_2.clip();
                      CtxImage_2.clip();
                      var x = Math.ceil(Init_3.clipX - Init_3.width / 2);
                      var y = Math.ceil(Init_3.clipY - Init_3.height / 2);
                      if (Init_3.imageRotate) {
                        CtxImage_2.rotate(Init_3.imageRotate * Math.PI / 180);
                      }
                      CtxImage_2.drawImage(img, x, y, Math.ceil(Init_3.imageWidth), Math.ceil(Init_3.imageHeight));
                      var data = CtxImage_2.getImageData(0, 0, Init_3.width, Init_3.height).data;
                      var threshold = 0;
                      var bOffset_2 = 0;
                      var rOffset_2 = 0;
                      var tOffset_2 = Init_3.height;
                      var lOffset_2 = Init_3.width;
                      for (var i = 0; i < Init_3.width; i++) {
                        for (var j = 0; j < Init_3.height; j++) {
                          var pos = (i + Init_3.width * j) * 4;
                          if (data[pos + 3] > threshold) {
                            bOffset_2 = Math.max(j, bOffset_2);
                            tOffset_2 = Math.min(j, tOffset_2);
                            rOffset_2 = Math.max(i, rOffset_2);
                            lOffset_2 = Math.min(i, lOffset_2);
                          }
                        }
                      }
                      var base64 = document.getElementById("CanvasImage").toDataURL("image/png");
                      var image_4 = new Image();
                      image_4.src = base64;
                      image_4.onload = function() {
                        CanvasOut_2.setAttribute("style", "\n                  width:".concat(rOffset_2 - lOffset_2, "px;\n                  height:").concat(bOffset_2 - tOffset_2, "px;\n                  position: absolute;\n                  left: 10000px;\n                  top: 0;\n                "));
                        CanvasOut_2.width = rOffset_2 - lOffset_2;
                        CanvasOut_2.height = bOffset_2 - tOffset_2;
                        CtxOut_2.drawImage(image_4, -lOffset_2, -tOffset_2, image_4.width, image_4.height);
                        CtxOut_2.clip();
                        var result = document.getElementById("CanvasOut").toDataURL("image/png");
                        if (Init_3.el) {
                          Init_3.el.removeChild(CanvasBox_3);
                        } else {
                          document.body.removeChild(CanvasBox_3);
                        }
                        CanvasBox_3 = null;
                        CanvasImage_2 = null;
                        CanvasShade_2 = null;
                        CanvasOut_2 = null;
                        CtxImage_2 = null;
                        CtxOut_2 = null;
                        CtxShade_2 = null;
                        rotateTouches_1 = 0;
                        touches_2 = [];
                        moveTouches_1 = [];
                        lenTouches_1 = [];
                        initLen_1 = 0;
                        Img_2 = null;
                        imageClip_2 = null;
                        resolve2(result);
                      };
                    } catch (_a2) {
                      resolve2("");
                    }
                  });
                };
                return [3, 6];
              case 5:
                _c = _d.sent();
                resolve("");
                return [3, 6];
              case 6:
                return [2];
            }
          });
        });
      });
    };
    exports.CanvasPolygonClip = CanvasPolygonClip;
    var IsPhone = function() {
      return /mobile|android|webos|iphone|ipad|phone/i.test(window.navigator.userAgent.toLowerCase());
    };
    exports.IsPhone = IsPhone;
    var IsObject = function(val) {
      return Object.prototype.toString.call(val) === "[object Object]";
    };
    exports.IsObject = IsObject;
    var IsArray = function(val) {
      return Object.prototype.toString.call(val) == "[object Array]";
    };
    exports.IsArray = IsArray;
    var IsNumber = function(val) {
      return Object.prototype.toString.call(val) == "[object Number]";
    };
    exports.IsNumber = IsNumber;
    var IsString = function(val) {
      return Object.prototype.toString.call(val) == "[object String]";
    };
    exports.IsString = IsString;
    var IsDate = function(val) {
      return Object.prototype.toString.call(val) == "[object Date]";
    };
    exports.IsDate = IsDate;
    var IsBoolean = function(val) {
      return Object.prototype.toString.call(val) == "[object Boolean]";
    };
    exports.IsBoolean = IsBoolean;
    var IsFunction = function(val) {
      return Object.prototype.toString.call(val) == "[object Function]";
    };
    exports.IsFunction = IsFunction;
    var IsNull = function(val) {
      return Object.prototype.toString.call(val) == "[object Null]";
    };
    exports.IsNull = IsNull;
    var IsUndefined = function(val) {
      return Object.prototype.toString.call(val) == "[object Undefined]";
    };
    exports.IsUndefined = IsUndefined;
    var IsFalse = function(val) {
      if (["", "null", "undefined", 0, false, void 0, null, NaN].includes(val))
        return true;
      return false;
    };
    exports.IsFalse = IsFalse;
    var IsTrue = function(val) {
      return !(0, exports.IsFalse)(val);
    };
    exports.IsTrue = IsTrue;
    exports["default"] = {
      Mobile: exports.Mobile,
      StudioCamera: exports.StudioCamera,
      Email: exports.Email,
      Digit: exports.Digit,
      DigitLetter: exports.DigitLetter,
      IdCard: exports.IdCard,
      Chinese: exports.Chinese,
      CnEnNuLine: exports.CnEnNuLine,
      English: exports.English,
      CapitalEnglish: exports.CapitalEnglish,
      Ipv4: exports.Ipv4,
      Url: exports.Url,
      PostCode: exports.PostCode,
      SocialCreditCode: exports.SocialCreditCode,
      IsMobile: exports.IsMobile,
      IsStudioCamera: exports.IsStudioCamera,
      IsEmail: exports.IsEmail,
      IsDigit: exports.IsDigit,
      IsDigitLetter: exports.IsDigitLetter,
      IsIdCard: exports.IsIdCard,
      IsChinese: exports.IsChinese,
      IsCnEnNuLine: exports.IsCnEnNuLine,
      IsEnglish: exports.IsEnglish,
      IsCapitalEnglish: exports.IsCapitalEnglish,
      IsIpv4: exports.IsIpv4,
      IsUrl: exports.IsUrl,
      IsPostCode: exports.IsPostCode,
      IsSocialCreditCode: exports.IsSocialCreditCode,
      sessions: exports.sessions,
      local: exports.local,
      DateFormat: exports.DateFormat,
      NumberDot: exports.NumberDot,
      ReplaceStar: exports.ReplaceStar,
      NumberIsFloat: exports.NumberIsFloat,
      OutScreenFileChoose: exports.OutScreenFileChoose,
      NumberWan: exports.NumberWan,
      FileToBase64: exports.FileToBase64,
      DeleteEmptyObj: exports.DeleteEmptyObj,
      FileDownload: exports.FileDownload,
      Base64toBlob: exports.Base64toBlob,
      WebImageToBase64: exports.WebImageToBase64,
      XMLHttpRequest: exports.XMLHttpRequest,
      Copy: exports.Copy,
      DeepClone: exports.DeepClone,
      Debounce: exports.Debounce,
      Throttle: exports.Throttle,
      CanvasImageCompose: exports.CanvasImageCompose,
      CanvasDaubClip: exports.CanvasDaubClip,
      CanvasPolygonClip: exports.CanvasPolygonClip,
      IsObject: exports.IsObject,
      IsArray: exports.IsArray,
      IsNumber: exports.IsNumber,
      IsString: exports.IsString,
      IsDate: exports.IsDate,
      IsBoolean: exports.IsBoolean,
      IsFunction: exports.IsFunction,
      IsNull: exports.IsNull,
      IsUndefined: exports.IsUndefined,
      IsFalse: exports.IsFalse,
      IsTrue: exports.IsTrue,
      IsPhone: exports.IsPhone
    };
  }
});

// dep:@mosowe2_js
var mosowe2_js_default = require_js();
export {
  mosowe2_js_default as default
};
//# sourceMappingURL=@mosowe2_js.js.map
