#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@iarna/toml/lib/parser.js
var require_parser = __commonJS({
  "node_modules/@iarna/toml/lib/parser.js"(exports2, module2) {
    "use strict";
    var ParserEND = 1114112;
    var ParserError = class _ParserError extends Error {
      /* istanbul ignore next */
      constructor(msg, filename, linenumber) {
        super("[ParserError] " + msg, filename, linenumber);
        this.name = "ParserError";
        this.code = "ParserError";
        if (Error.captureStackTrace) Error.captureStackTrace(this, _ParserError);
      }
    };
    var State = class {
      constructor(parser) {
        this.parser = parser;
        this.buf = "";
        this.returned = null;
        this.result = null;
        this.resultTable = null;
        this.resultArr = null;
      }
    };
    var Parser = class {
      constructor() {
        this.pos = 0;
        this.col = 0;
        this.line = 0;
        this.obj = {};
        this.ctx = this.obj;
        this.stack = [];
        this._buf = "";
        this.char = null;
        this.ii = 0;
        this.state = new State(this.parseStart);
      }
      parse(str) {
        if (str.length === 0 || str.length == null) return;
        this._buf = String(str);
        this.ii = -1;
        this.char = -1;
        let getNext;
        while (getNext === false || this.nextChar()) {
          getNext = this.runOne();
        }
        this._buf = null;
      }
      nextChar() {
        if (this.char === 10) {
          ++this.line;
          this.col = -1;
        }
        ++this.ii;
        this.char = this._buf.codePointAt(this.ii);
        ++this.pos;
        ++this.col;
        return this.haveBuffer();
      }
      haveBuffer() {
        return this.ii < this._buf.length;
      }
      runOne() {
        return this.state.parser.call(this, this.state.returned);
      }
      finish() {
        this.char = ParserEND;
        let last;
        do {
          last = this.state.parser;
          this.runOne();
        } while (this.state.parser !== last);
        this.ctx = null;
        this.state = null;
        this._buf = null;
        return this.obj;
      }
      next(fn) {
        if (typeof fn !== "function") throw new ParserError("Tried to set state to non-existent state: " + JSON.stringify(fn));
        this.state.parser = fn;
      }
      goto(fn) {
        this.next(fn);
        return this.runOne();
      }
      call(fn, returnWith) {
        if (returnWith) this.next(returnWith);
        this.stack.push(this.state);
        this.state = new State(fn);
      }
      callNow(fn, returnWith) {
        this.call(fn, returnWith);
        return this.runOne();
      }
      return(value) {
        if (this.stack.length === 0) throw this.error(new ParserError("Stack underflow"));
        if (value === void 0) value = this.state.buf;
        this.state = this.stack.pop();
        this.state.returned = value;
      }
      returnNow(value) {
        this.return(value);
        return this.runOne();
      }
      consume() {
        if (this.char === ParserEND) throw this.error(new ParserError("Unexpected end-of-buffer"));
        this.state.buf += this._buf[this.ii];
      }
      error(err) {
        err.line = this.line;
        err.col = this.col;
        err.pos = this.pos;
        return err;
      }
      /* istanbul ignore next */
      parseStart() {
        throw new ParserError("Must declare a parseStart method");
      }
    };
    Parser.END = ParserEND;
    Parser.Error = ParserError;
    module2.exports = Parser;
  }
});

// node_modules/@iarna/toml/lib/create-datetime.js
var require_create_datetime = __commonJS({
  "node_modules/@iarna/toml/lib/create-datetime.js"(exports2, module2) {
    "use strict";
    module2.exports = (value) => {
      const date = new Date(value);
      if (isNaN(date)) {
        throw new TypeError("Invalid Datetime");
      } else {
        return date;
      }
    };
  }
});

// node_modules/@iarna/toml/lib/format-num.js
var require_format_num = __commonJS({
  "node_modules/@iarna/toml/lib/format-num.js"(exports2, module2) {
    "use strict";
    module2.exports = (d, num) => {
      num = String(num);
      while (num.length < d) num = "0" + num;
      return num;
    };
  }
});

// node_modules/@iarna/toml/lib/create-datetime-float.js
var require_create_datetime_float = __commonJS({
  "node_modules/@iarna/toml/lib/create-datetime-float.js"(exports2, module2) {
    "use strict";
    var f = require_format_num();
    var FloatingDateTime = class extends Date {
      constructor(value) {
        super(value + "Z");
        this.isFloating = true;
      }
      toISOString() {
        const date = `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`;
        const time = `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`;
        return `${date}T${time}`;
      }
    };
    module2.exports = (value) => {
      const date = new FloatingDateTime(value);
      if (isNaN(date)) {
        throw new TypeError("Invalid Datetime");
      } else {
        return date;
      }
    };
  }
});

// node_modules/@iarna/toml/lib/create-date.js
var require_create_date = __commonJS({
  "node_modules/@iarna/toml/lib/create-date.js"(exports2, module2) {
    "use strict";
    var f = require_format_num();
    var DateTime = global.Date;
    var Date2 = class extends DateTime {
      constructor(value) {
        super(value);
        this.isDate = true;
      }
      toISOString() {
        return `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`;
      }
    };
    module2.exports = (value) => {
      const date = new Date2(value);
      if (isNaN(date)) {
        throw new TypeError("Invalid Datetime");
      } else {
        return date;
      }
    };
  }
});

// node_modules/@iarna/toml/lib/create-time.js
var require_create_time = __commonJS({
  "node_modules/@iarna/toml/lib/create-time.js"(exports2, module2) {
    "use strict";
    var f = require_format_num();
    var Time = class extends Date {
      constructor(value) {
        super(`0000-01-01T${value}Z`);
        this.isTime = true;
      }
      toISOString() {
        return `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`;
      }
    };
    module2.exports = (value) => {
      const date = new Time(value);
      if (isNaN(date)) {
        throw new TypeError("Invalid Datetime");
      } else {
        return date;
      }
    };
  }
});

// node_modules/@iarna/toml/lib/toml-parser.js
var require_toml_parser = __commonJS({
  "node_modules/@iarna/toml/lib/toml-parser.js"(exports, module) {
    "use strict";
    module.exports = makeParserClass(require_parser());
    module.exports.makeParserClass = makeParserClass;
    var TomlError = class _TomlError extends Error {
      constructor(msg) {
        super(msg);
        this.name = "TomlError";
        if (Error.captureStackTrace) Error.captureStackTrace(this, _TomlError);
        this.fromTOML = true;
        this.wrapped = null;
      }
    };
    TomlError.wrap = (err) => {
      const terr = new TomlError(err.message);
      terr.code = err.code;
      terr.wrapped = err;
      return terr;
    };
    module.exports.TomlError = TomlError;
    var createDateTime = require_create_datetime();
    var createDateTimeFloat = require_create_datetime_float();
    var createDate = require_create_date();
    var createTime = require_create_time();
    var CTRL_I = 9;
    var CTRL_J = 10;
    var CTRL_M = 13;
    var CTRL_CHAR_BOUNDARY = 31;
    var CHAR_SP = 32;
    var CHAR_QUOT = 34;
    var CHAR_NUM = 35;
    var CHAR_APOS = 39;
    var CHAR_PLUS = 43;
    var CHAR_COMMA = 44;
    var CHAR_HYPHEN = 45;
    var CHAR_PERIOD = 46;
    var CHAR_0 = 48;
    var CHAR_1 = 49;
    var CHAR_7 = 55;
    var CHAR_9 = 57;
    var CHAR_COLON = 58;
    var CHAR_EQUALS = 61;
    var CHAR_A = 65;
    var CHAR_E = 69;
    var CHAR_F = 70;
    var CHAR_T = 84;
    var CHAR_U = 85;
    var CHAR_Z = 90;
    var CHAR_LOWBAR = 95;
    var CHAR_a = 97;
    var CHAR_b = 98;
    var CHAR_e = 101;
    var CHAR_f = 102;
    var CHAR_i = 105;
    var CHAR_l = 108;
    var CHAR_n = 110;
    var CHAR_o = 111;
    var CHAR_r = 114;
    var CHAR_s = 115;
    var CHAR_t = 116;
    var CHAR_u = 117;
    var CHAR_x = 120;
    var CHAR_z = 122;
    var CHAR_LCUB = 123;
    var CHAR_RCUB = 125;
    var CHAR_LSQB = 91;
    var CHAR_BSOL = 92;
    var CHAR_RSQB = 93;
    var CHAR_DEL = 127;
    var SURROGATE_FIRST = 55296;
    var SURROGATE_LAST = 57343;
    var escapes = {
      [CHAR_b]: "\b",
      [CHAR_t]: "	",
      [CHAR_n]: "\n",
      [CHAR_f]: "\f",
      [CHAR_r]: "\r",
      [CHAR_QUOT]: '"',
      [CHAR_BSOL]: "\\"
    };
    function isDigit(cp) {
      return cp >= CHAR_0 && cp <= CHAR_9;
    }
    function isHexit(cp) {
      return cp >= CHAR_A && cp <= CHAR_F || cp >= CHAR_a && cp <= CHAR_f || cp >= CHAR_0 && cp <= CHAR_9;
    }
    function isBit(cp) {
      return cp === CHAR_1 || cp === CHAR_0;
    }
    function isOctit(cp) {
      return cp >= CHAR_0 && cp <= CHAR_7;
    }
    function isAlphaNumQuoteHyphen(cp) {
      return cp >= CHAR_A && cp <= CHAR_Z || cp >= CHAR_a && cp <= CHAR_z || cp >= CHAR_0 && cp <= CHAR_9 || cp === CHAR_APOS || cp === CHAR_QUOT || cp === CHAR_LOWBAR || cp === CHAR_HYPHEN;
    }
    function isAlphaNumHyphen(cp) {
      return cp >= CHAR_A && cp <= CHAR_Z || cp >= CHAR_a && cp <= CHAR_z || cp >= CHAR_0 && cp <= CHAR_9 || cp === CHAR_LOWBAR || cp === CHAR_HYPHEN;
    }
    var _type = /* @__PURE__ */ Symbol("type");
    var _declared = /* @__PURE__ */ Symbol("declared");
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var defineProperty = Object.defineProperty;
    var descriptor = { configurable: true, enumerable: true, writable: true, value: void 0 };
    function hasKey(obj, key) {
      if (hasOwnProperty.call(obj, key)) return true;
      if (key === "__proto__") defineProperty(obj, "__proto__", descriptor);
      return false;
    }
    var INLINE_TABLE = /* @__PURE__ */ Symbol("inline-table");
    function InlineTable() {
      return Object.defineProperties({}, {
        [_type]: { value: INLINE_TABLE }
      });
    }
    function isInlineTable(obj) {
      if (obj === null || typeof obj !== "object") return false;
      return obj[_type] === INLINE_TABLE;
    }
    var TABLE = /* @__PURE__ */ Symbol("table");
    function Table() {
      return Object.defineProperties({}, {
        [_type]: { value: TABLE },
        [_declared]: { value: false, writable: true }
      });
    }
    function isTable(obj) {
      if (obj === null || typeof obj !== "object") return false;
      return obj[_type] === TABLE;
    }
    var _contentType = /* @__PURE__ */ Symbol("content-type");
    var INLINE_LIST = /* @__PURE__ */ Symbol("inline-list");
    function InlineList(type) {
      return Object.defineProperties([], {
        [_type]: { value: INLINE_LIST },
        [_contentType]: { value: type }
      });
    }
    function isInlineList(obj) {
      if (obj === null || typeof obj !== "object") return false;
      return obj[_type] === INLINE_LIST;
    }
    var LIST = /* @__PURE__ */ Symbol("list");
    function List() {
      return Object.defineProperties([], {
        [_type]: { value: LIST }
      });
    }
    function isList(obj) {
      if (obj === null || typeof obj !== "object") return false;
      return obj[_type] === LIST;
    }
    var _custom;
    try {
      const utilInspect = eval("require('util').inspect");
      _custom = utilInspect.custom;
    } catch (_) {
    }
    var _inspect = _custom || "inspect";
    var BoxedBigInt = class {
      constructor(value) {
        try {
          this.value = global.BigInt.asIntN(64, value);
        } catch (_) {
          this.value = null;
        }
        Object.defineProperty(this, _type, { value: INTEGER });
      }
      isNaN() {
        return this.value === null;
      }
      /* istanbul ignore next */
      toString() {
        return String(this.value);
      }
      /* istanbul ignore next */
      [_inspect]() {
        return `[BigInt: ${this.toString()}]}`;
      }
      valueOf() {
        return this.value;
      }
    };
    var INTEGER = /* @__PURE__ */ Symbol("integer");
    function Integer(value) {
      let num = Number(value);
      if (Object.is(num, -0)) num = 0;
      if (global.BigInt && !Number.isSafeInteger(num)) {
        return new BoxedBigInt(value);
      } else {
        return Object.defineProperties(new Number(num), {
          isNaN: { value: function() {
            return isNaN(this);
          } },
          [_type]: { value: INTEGER },
          [_inspect]: { value: () => `[Integer: ${value}]` }
        });
      }
    }
    function isInteger(obj) {
      if (obj === null || typeof obj !== "object") return false;
      return obj[_type] === INTEGER;
    }
    var FLOAT = /* @__PURE__ */ Symbol("float");
    function Float(value) {
      return Object.defineProperties(new Number(value), {
        [_type]: { value: FLOAT },
        [_inspect]: { value: () => `[Float: ${value}]` }
      });
    }
    function isFloat(obj) {
      if (obj === null || typeof obj !== "object") return false;
      return obj[_type] === FLOAT;
    }
    function tomlType(value) {
      const type = typeof value;
      if (type === "object") {
        if (value === null) return "null";
        if (value instanceof Date) return "datetime";
        if (_type in value) {
          switch (value[_type]) {
            case INLINE_TABLE:
              return "inline-table";
            case INLINE_LIST:
              return "inline-list";
            /* istanbul ignore next */
            case TABLE:
              return "table";
            /* istanbul ignore next */
            case LIST:
              return "list";
            case FLOAT:
              return "float";
            case INTEGER:
              return "integer";
          }
        }
      }
      return type;
    }
    function makeParserClass(Parser) {
      class TOMLParser extends Parser {
        constructor() {
          super();
          this.ctx = this.obj = Table();
        }
        /* MATCH HELPER */
        atEndOfWord() {
          return this.char === CHAR_NUM || this.char === CTRL_I || this.char === CHAR_SP || this.atEndOfLine();
        }
        atEndOfLine() {
          return this.char === Parser.END || this.char === CTRL_J || this.char === CTRL_M;
        }
        parseStart() {
          if (this.char === Parser.END) {
            return null;
          } else if (this.char === CHAR_LSQB) {
            return this.call(this.parseTableOrList);
          } else if (this.char === CHAR_NUM) {
            return this.call(this.parseComment);
          } else if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
            return null;
          } else if (isAlphaNumQuoteHyphen(this.char)) {
            return this.callNow(this.parseAssignStatement);
          } else {
            throw this.error(new TomlError(`Unknown character "${this.char}"`));
          }
        }
        // HELPER, this strips any whitespace and comments to the end of the line
        // then RETURNS. Last state in a production.
        parseWhitespaceToEOL() {
          if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
            return null;
          } else if (this.char === CHAR_NUM) {
            return this.goto(this.parseComment);
          } else if (this.char === Parser.END || this.char === CTRL_J) {
            return this.return();
          } else {
            throw this.error(new TomlError("Unexpected character, expected only whitespace or comments till end of line"));
          }
        }
        /* ASSIGNMENT: key = value */
        parseAssignStatement() {
          return this.callNow(this.parseAssign, this.recordAssignStatement);
        }
        recordAssignStatement(kv) {
          let target = this.ctx;
          let finalKey = kv.key.pop();
          for (let kw of kv.key) {
            if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
              throw this.error(new TomlError("Can't redefine existing key"));
            }
            target = target[kw] = target[kw] || Table();
          }
          if (hasKey(target, finalKey)) {
            throw this.error(new TomlError("Can't redefine existing key"));
          }
          if (isInteger(kv.value) || isFloat(kv.value)) {
            target[finalKey] = kv.value.valueOf();
          } else {
            target[finalKey] = kv.value;
          }
          return this.goto(this.parseWhitespaceToEOL);
        }
        /* ASSSIGNMENT expression, key = value possibly inside an inline table */
        parseAssign() {
          return this.callNow(this.parseKeyword, this.recordAssignKeyword);
        }
        recordAssignKeyword(key) {
          if (this.state.resultTable) {
            this.state.resultTable.push(key);
          } else {
            this.state.resultTable = [key];
          }
          return this.goto(this.parseAssignKeywordPreDot);
        }
        parseAssignKeywordPreDot() {
          if (this.char === CHAR_PERIOD) {
            return this.next(this.parseAssignKeywordPostDot);
          } else if (this.char !== CHAR_SP && this.char !== CTRL_I) {
            return this.goto(this.parseAssignEqual);
          }
        }
        parseAssignKeywordPostDot() {
          if (this.char !== CHAR_SP && this.char !== CTRL_I) {
            return this.callNow(this.parseKeyword, this.recordAssignKeyword);
          }
        }
        parseAssignEqual() {
          if (this.char === CHAR_EQUALS) {
            return this.next(this.parseAssignPreValue);
          } else {
            throw this.error(new TomlError('Invalid character, expected "="'));
          }
        }
        parseAssignPreValue() {
          if (this.char === CHAR_SP || this.char === CTRL_I) {
            return null;
          } else {
            return this.callNow(this.parseValue, this.recordAssignValue);
          }
        }
        recordAssignValue(value) {
          return this.returnNow({ key: this.state.resultTable, value });
        }
        /* COMMENTS: #...eol */
        parseComment() {
          do {
            if (this.char === Parser.END || this.char === CTRL_J) {
              return this.return();
            }
          } while (this.nextChar());
        }
        /* TABLES AND LISTS, [foo] and [[foo]] */
        parseTableOrList() {
          if (this.char === CHAR_LSQB) {
            this.next(this.parseList);
          } else {
            return this.goto(this.parseTable);
          }
        }
        /* TABLE [foo.bar.baz] */
        parseTable() {
          this.ctx = this.obj;
          return this.goto(this.parseTableNext);
        }
        parseTableNext() {
          if (this.char === CHAR_SP || this.char === CTRL_I) {
            return null;
          } else {
            return this.callNow(this.parseKeyword, this.parseTableMore);
          }
        }
        parseTableMore(keyword) {
          if (this.char === CHAR_SP || this.char === CTRL_I) {
            return null;
          } else if (this.char === CHAR_RSQB) {
            if (hasKey(this.ctx, keyword) && (!isTable(this.ctx[keyword]) || this.ctx[keyword][_declared])) {
              throw this.error(new TomlError("Can't redefine existing key"));
            } else {
              this.ctx = this.ctx[keyword] = this.ctx[keyword] || Table();
              this.ctx[_declared] = true;
            }
            return this.next(this.parseWhitespaceToEOL);
          } else if (this.char === CHAR_PERIOD) {
            if (!hasKey(this.ctx, keyword)) {
              this.ctx = this.ctx[keyword] = Table();
            } else if (isTable(this.ctx[keyword])) {
              this.ctx = this.ctx[keyword];
            } else if (isList(this.ctx[keyword])) {
              this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1];
            } else {
              throw this.error(new TomlError("Can't redefine existing key"));
            }
            return this.next(this.parseTableNext);
          } else {
            throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
          }
        }
        /* LIST [[a.b.c]] */
        parseList() {
          this.ctx = this.obj;
          return this.goto(this.parseListNext);
        }
        parseListNext() {
          if (this.char === CHAR_SP || this.char === CTRL_I) {
            return null;
          } else {
            return this.callNow(this.parseKeyword, this.parseListMore);
          }
        }
        parseListMore(keyword) {
          if (this.char === CHAR_SP || this.char === CTRL_I) {
            return null;
          } else if (this.char === CHAR_RSQB) {
            if (!hasKey(this.ctx, keyword)) {
              this.ctx[keyword] = List();
            }
            if (isInlineList(this.ctx[keyword])) {
              throw this.error(new TomlError("Can't extend an inline array"));
            } else if (isList(this.ctx[keyword])) {
              const next = Table();
              this.ctx[keyword].push(next);
              this.ctx = next;
            } else {
              throw this.error(new TomlError("Can't redefine an existing key"));
            }
            return this.next(this.parseListEnd);
          } else if (this.char === CHAR_PERIOD) {
            if (!hasKey(this.ctx, keyword)) {
              this.ctx = this.ctx[keyword] = Table();
            } else if (isInlineList(this.ctx[keyword])) {
              throw this.error(new TomlError("Can't extend an inline array"));
            } else if (isInlineTable(this.ctx[keyword])) {
              throw this.error(new TomlError("Can't extend an inline table"));
            } else if (isList(this.ctx[keyword])) {
              this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1];
            } else if (isTable(this.ctx[keyword])) {
              this.ctx = this.ctx[keyword];
            } else {
              throw this.error(new TomlError("Can't redefine an existing key"));
            }
            return this.next(this.parseListNext);
          } else {
            throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
          }
        }
        parseListEnd(keyword) {
          if (this.char === CHAR_RSQB) {
            return this.next(this.parseWhitespaceToEOL);
          } else {
            throw this.error(new TomlError("Unexpected character, expected whitespace, . or ]"));
          }
        }
        /* VALUE string, number, boolean, inline list, inline object */
        parseValue() {
          if (this.char === Parser.END) {
            throw this.error(new TomlError("Key without value"));
          } else if (this.char === CHAR_QUOT) {
            return this.next(this.parseDoubleString);
          }
          if (this.char === CHAR_APOS) {
            return this.next(this.parseSingleString);
          } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
            return this.goto(this.parseNumberSign);
          } else if (this.char === CHAR_i) {
            return this.next(this.parseInf);
          } else if (this.char === CHAR_n) {
            return this.next(this.parseNan);
          } else if (isDigit(this.char)) {
            return this.goto(this.parseNumberOrDateTime);
          } else if (this.char === CHAR_t || this.char === CHAR_f) {
            return this.goto(this.parseBoolean);
          } else if (this.char === CHAR_LSQB) {
            return this.call(this.parseInlineList, this.recordValue);
          } else if (this.char === CHAR_LCUB) {
            return this.call(this.parseInlineTable, this.recordValue);
          } else {
            throw this.error(new TomlError("Unexpected character, expecting string, number, datetime, boolean, inline array or inline table"));
          }
        }
        recordValue(value) {
          return this.returnNow(value);
        }
        parseInf() {
          if (this.char === CHAR_n) {
            return this.next(this.parseInf2);
          } else {
            throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'));
          }
        }
        parseInf2() {
          if (this.char === CHAR_f) {
            if (this.state.buf === "-") {
              return this.return(-Infinity);
            } else {
              return this.return(Infinity);
            }
          } else {
            throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'));
          }
        }
        parseNan() {
          if (this.char === CHAR_a) {
            return this.next(this.parseNan2);
          } else {
            throw this.error(new TomlError('Unexpected character, expected "nan"'));
          }
        }
        parseNan2() {
          if (this.char === CHAR_n) {
            return this.return(NaN);
          } else {
            throw this.error(new TomlError('Unexpected character, expected "nan"'));
          }
        }
        /* KEYS, barewords or basic, literal, or dotted */
        parseKeyword() {
          if (this.char === CHAR_QUOT) {
            return this.next(this.parseBasicString);
          } else if (this.char === CHAR_APOS) {
            return this.next(this.parseLiteralString);
          } else {
            return this.goto(this.parseBareKey);
          }
        }
        /* KEYS: barewords */
        parseBareKey() {
          do {
            if (this.char === Parser.END) {
              throw this.error(new TomlError("Key ended without value"));
            } else if (isAlphaNumHyphen(this.char)) {
              this.consume();
            } else if (this.state.buf.length === 0) {
              throw this.error(new TomlError("Empty bare keys are not allowed"));
            } else {
              return this.returnNow();
            }
          } while (this.nextChar());
        }
        /* STRINGS, single quoted (literal) */
        parseSingleString() {
          if (this.char === CHAR_APOS) {
            return this.next(this.parseLiteralMultiStringMaybe);
          } else {
            return this.goto(this.parseLiteralString);
          }
        }
        parseLiteralString() {
          do {
            if (this.char === CHAR_APOS) {
              return this.return();
            } else if (this.atEndOfLine()) {
              throw this.error(new TomlError("Unterminated string"));
            } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I) {
              throw this.errorControlCharInString();
            } else {
              this.consume();
            }
          } while (this.nextChar());
        }
        parseLiteralMultiStringMaybe() {
          if (this.char === CHAR_APOS) {
            return this.next(this.parseLiteralMultiString);
          } else {
            return this.returnNow();
          }
        }
        parseLiteralMultiString() {
          if (this.char === CTRL_M) {
            return null;
          } else if (this.char === CTRL_J) {
            return this.next(this.parseLiteralMultiStringContent);
          } else {
            return this.goto(this.parseLiteralMultiStringContent);
          }
        }
        parseLiteralMultiStringContent() {
          do {
            if (this.char === CHAR_APOS) {
              return this.next(this.parseLiteralMultiEnd);
            } else if (this.char === Parser.END) {
              throw this.error(new TomlError("Unterminated multi-line string"));
            } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M) {
              throw this.errorControlCharInString();
            } else {
              this.consume();
            }
          } while (this.nextChar());
        }
        parseLiteralMultiEnd() {
          if (this.char === CHAR_APOS) {
            return this.next(this.parseLiteralMultiEnd2);
          } else {
            this.state.buf += "'";
            return this.goto(this.parseLiteralMultiStringContent);
          }
        }
        parseLiteralMultiEnd2() {
          if (this.char === CHAR_APOS) {
            return this.return();
          } else {
            this.state.buf += "''";
            return this.goto(this.parseLiteralMultiStringContent);
          }
        }
        /* STRINGS double quoted */
        parseDoubleString() {
          if (this.char === CHAR_QUOT) {
            return this.next(this.parseMultiStringMaybe);
          } else {
            return this.goto(this.parseBasicString);
          }
        }
        parseBasicString() {
          do {
            if (this.char === CHAR_BSOL) {
              return this.call(this.parseEscape, this.recordEscapeReplacement);
            } else if (this.char === CHAR_QUOT) {
              return this.return();
            } else if (this.atEndOfLine()) {
              throw this.error(new TomlError("Unterminated string"));
            } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I) {
              throw this.errorControlCharInString();
            } else {
              this.consume();
            }
          } while (this.nextChar());
        }
        recordEscapeReplacement(replacement) {
          this.state.buf += replacement;
          return this.goto(this.parseBasicString);
        }
        parseMultiStringMaybe() {
          if (this.char === CHAR_QUOT) {
            return this.next(this.parseMultiString);
          } else {
            return this.returnNow();
          }
        }
        parseMultiString() {
          if (this.char === CTRL_M) {
            return null;
          } else if (this.char === CTRL_J) {
            return this.next(this.parseMultiStringContent);
          } else {
            return this.goto(this.parseMultiStringContent);
          }
        }
        parseMultiStringContent() {
          do {
            if (this.char === CHAR_BSOL) {
              return this.call(this.parseMultiEscape, this.recordMultiEscapeReplacement);
            } else if (this.char === CHAR_QUOT) {
              return this.next(this.parseMultiEnd);
            } else if (this.char === Parser.END) {
              throw this.error(new TomlError("Unterminated multi-line string"));
            } else if (this.char === CHAR_DEL || this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M) {
              throw this.errorControlCharInString();
            } else {
              this.consume();
            }
          } while (this.nextChar());
        }
        errorControlCharInString() {
          let displayCode = "\\u00";
          if (this.char < 16) {
            displayCode += "0";
          }
          displayCode += this.char.toString(16);
          return this.error(new TomlError(`Control characters (codes < 0x1f and 0x7f) are not allowed in strings, use ${displayCode} instead`));
        }
        recordMultiEscapeReplacement(replacement) {
          this.state.buf += replacement;
          return this.goto(this.parseMultiStringContent);
        }
        parseMultiEnd() {
          if (this.char === CHAR_QUOT) {
            return this.next(this.parseMultiEnd2);
          } else {
            this.state.buf += '"';
            return this.goto(this.parseMultiStringContent);
          }
        }
        parseMultiEnd2() {
          if (this.char === CHAR_QUOT) {
            return this.return();
          } else {
            this.state.buf += '""';
            return this.goto(this.parseMultiStringContent);
          }
        }
        parseMultiEscape() {
          if (this.char === CTRL_M || this.char === CTRL_J) {
            return this.next(this.parseMultiTrim);
          } else if (this.char === CHAR_SP || this.char === CTRL_I) {
            return this.next(this.parsePreMultiTrim);
          } else {
            return this.goto(this.parseEscape);
          }
        }
        parsePreMultiTrim() {
          if (this.char === CHAR_SP || this.char === CTRL_I) {
            return null;
          } else if (this.char === CTRL_M || this.char === CTRL_J) {
            return this.next(this.parseMultiTrim);
          } else {
            throw this.error(new TomlError("Can't escape whitespace"));
          }
        }
        parseMultiTrim() {
          if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
            return null;
          } else {
            return this.returnNow();
          }
        }
        parseEscape() {
          if (this.char in escapes) {
            return this.return(escapes[this.char]);
          } else if (this.char === CHAR_u) {
            return this.call(this.parseSmallUnicode, this.parseUnicodeReturn);
          } else if (this.char === CHAR_U) {
            return this.call(this.parseLargeUnicode, this.parseUnicodeReturn);
          } else {
            throw this.error(new TomlError("Unknown escape character: " + this.char));
          }
        }
        parseUnicodeReturn(char) {
          try {
            const codePoint = parseInt(char, 16);
            if (codePoint >= SURROGATE_FIRST && codePoint <= SURROGATE_LAST) {
              throw this.error(new TomlError("Invalid unicode, character in range 0xD800 - 0xDFFF is reserved"));
            }
            return this.returnNow(String.fromCodePoint(codePoint));
          } catch (err) {
            throw this.error(TomlError.wrap(err));
          }
        }
        parseSmallUnicode() {
          if (!isHexit(this.char)) {
            throw this.error(new TomlError("Invalid character in unicode sequence, expected hex"));
          } else {
            this.consume();
            if (this.state.buf.length >= 4) return this.return();
          }
        }
        parseLargeUnicode() {
          if (!isHexit(this.char)) {
            throw this.error(new TomlError("Invalid character in unicode sequence, expected hex"));
          } else {
            this.consume();
            if (this.state.buf.length >= 8) return this.return();
          }
        }
        /* NUMBERS */
        parseNumberSign() {
          this.consume();
          return this.next(this.parseMaybeSignedInfOrNan);
        }
        parseMaybeSignedInfOrNan() {
          if (this.char === CHAR_i) {
            return this.next(this.parseInf);
          } else if (this.char === CHAR_n) {
            return this.next(this.parseNan);
          } else {
            return this.callNow(this.parseNoUnder, this.parseNumberIntegerStart);
          }
        }
        parseNumberIntegerStart() {
          if (this.char === CHAR_0) {
            this.consume();
            return this.next(this.parseNumberIntegerExponentOrDecimal);
          } else {
            return this.goto(this.parseNumberInteger);
          }
        }
        parseNumberIntegerExponentOrDecimal() {
          if (this.char === CHAR_PERIOD) {
            this.consume();
            return this.call(this.parseNoUnder, this.parseNumberFloat);
          } else if (this.char === CHAR_E || this.char === CHAR_e) {
            this.consume();
            return this.next(this.parseNumberExponentSign);
          } else {
            return this.returnNow(Integer(this.state.buf));
          }
        }
        parseNumberInteger() {
          if (isDigit(this.char)) {
            this.consume();
          } else if (this.char === CHAR_LOWBAR) {
            return this.call(this.parseNoUnder);
          } else if (this.char === CHAR_E || this.char === CHAR_e) {
            this.consume();
            return this.next(this.parseNumberExponentSign);
          } else if (this.char === CHAR_PERIOD) {
            this.consume();
            return this.call(this.parseNoUnder, this.parseNumberFloat);
          } else {
            const result = Integer(this.state.buf);
            if (result.isNaN()) {
              throw this.error(new TomlError("Invalid number"));
            } else {
              return this.returnNow(result);
            }
          }
        }
        parseNoUnder() {
          if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD || this.char === CHAR_E || this.char === CHAR_e) {
            throw this.error(new TomlError("Unexpected character, expected digit"));
          } else if (this.atEndOfWord()) {
            throw this.error(new TomlError("Incomplete number"));
          }
          return this.returnNow();
        }
        parseNoUnderHexOctBinLiteral() {
          if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD) {
            throw this.error(new TomlError("Unexpected character, expected digit"));
          } else if (this.atEndOfWord()) {
            throw this.error(new TomlError("Incomplete number"));
          }
          return this.returnNow();
        }
        parseNumberFloat() {
          if (this.char === CHAR_LOWBAR) {
            return this.call(this.parseNoUnder, this.parseNumberFloat);
          } else if (isDigit(this.char)) {
            this.consume();
          } else if (this.char === CHAR_E || this.char === CHAR_e) {
            this.consume();
            return this.next(this.parseNumberExponentSign);
          } else {
            return this.returnNow(Float(this.state.buf));
          }
        }
        parseNumberExponentSign() {
          if (isDigit(this.char)) {
            return this.goto(this.parseNumberExponent);
          } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
            this.consume();
            this.call(this.parseNoUnder, this.parseNumberExponent);
          } else {
            throw this.error(new TomlError("Unexpected character, expected -, + or digit"));
          }
        }
        parseNumberExponent() {
          if (isDigit(this.char)) {
            this.consume();
          } else if (this.char === CHAR_LOWBAR) {
            return this.call(this.parseNoUnder);
          } else {
            return this.returnNow(Float(this.state.buf));
          }
        }
        /* NUMBERS or DATETIMES  */
        parseNumberOrDateTime() {
          if (this.char === CHAR_0) {
            this.consume();
            return this.next(this.parseNumberBaseOrDateTime);
          } else {
            return this.goto(this.parseNumberOrDateTimeOnly);
          }
        }
        parseNumberOrDateTimeOnly() {
          if (this.char === CHAR_LOWBAR) {
            return this.call(this.parseNoUnder, this.parseNumberInteger);
          } else if (isDigit(this.char)) {
            this.consume();
            if (this.state.buf.length > 4) this.next(this.parseNumberInteger);
          } else if (this.char === CHAR_E || this.char === CHAR_e) {
            this.consume();
            return this.next(this.parseNumberExponentSign);
          } else if (this.char === CHAR_PERIOD) {
            this.consume();
            return this.call(this.parseNoUnder, this.parseNumberFloat);
          } else if (this.char === CHAR_HYPHEN) {
            return this.goto(this.parseDateTime);
          } else if (this.char === CHAR_COLON) {
            return this.goto(this.parseOnlyTimeHour);
          } else {
            return this.returnNow(Integer(this.state.buf));
          }
        }
        parseDateTimeOnly() {
          if (this.state.buf.length < 4) {
            if (isDigit(this.char)) {
              return this.consume();
            } else if (this.char === CHAR_COLON) {
              return this.goto(this.parseOnlyTimeHour);
            } else {
              throw this.error(new TomlError("Expected digit while parsing year part of a date"));
            }
          } else {
            if (this.char === CHAR_HYPHEN) {
              return this.goto(this.parseDateTime);
            } else {
              throw this.error(new TomlError("Expected hyphen (-) while parsing year part of date"));
            }
          }
        }
        parseNumberBaseOrDateTime() {
          if (this.char === CHAR_b) {
            this.consume();
            return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerBin);
          } else if (this.char === CHAR_o) {
            this.consume();
            return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerOct);
          } else if (this.char === CHAR_x) {
            this.consume();
            return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerHex);
          } else if (this.char === CHAR_PERIOD) {
            return this.goto(this.parseNumberInteger);
          } else if (isDigit(this.char)) {
            return this.goto(this.parseDateTimeOnly);
          } else {
            return this.returnNow(Integer(this.state.buf));
          }
        }
        parseIntegerHex() {
          if (isHexit(this.char)) {
            this.consume();
          } else if (this.char === CHAR_LOWBAR) {
            return this.call(this.parseNoUnderHexOctBinLiteral);
          } else {
            const result = Integer(this.state.buf);
            if (result.isNaN()) {
              throw this.error(new TomlError("Invalid number"));
            } else {
              return this.returnNow(result);
            }
          }
        }
        parseIntegerOct() {
          if (isOctit(this.char)) {
            this.consume();
          } else if (this.char === CHAR_LOWBAR) {
            return this.call(this.parseNoUnderHexOctBinLiteral);
          } else {
            const result = Integer(this.state.buf);
            if (result.isNaN()) {
              throw this.error(new TomlError("Invalid number"));
            } else {
              return this.returnNow(result);
            }
          }
        }
        parseIntegerBin() {
          if (isBit(this.char)) {
            this.consume();
          } else if (this.char === CHAR_LOWBAR) {
            return this.call(this.parseNoUnderHexOctBinLiteral);
          } else {
            const result = Integer(this.state.buf);
            if (result.isNaN()) {
              throw this.error(new TomlError("Invalid number"));
            } else {
              return this.returnNow(result);
            }
          }
        }
        /* DATETIME */
        parseDateTime() {
          if (this.state.buf.length < 4) {
            throw this.error(new TomlError("Years less than 1000 must be zero padded to four characters"));
          }
          this.state.result = this.state.buf;
          this.state.buf = "";
          return this.next(this.parseDateMonth);
        }
        parseDateMonth() {
          if (this.char === CHAR_HYPHEN) {
            if (this.state.buf.length < 2) {
              throw this.error(new TomlError("Months less than 10 must be zero padded to two characters"));
            }
            this.state.result += "-" + this.state.buf;
            this.state.buf = "";
            return this.next(this.parseDateDay);
          } else if (isDigit(this.char)) {
            this.consume();
          } else {
            throw this.error(new TomlError("Incomplete datetime"));
          }
        }
        parseDateDay() {
          if (this.char === CHAR_T || this.char === CHAR_SP) {
            if (this.state.buf.length < 2) {
              throw this.error(new TomlError("Days less than 10 must be zero padded to two characters"));
            }
            this.state.result += "-" + this.state.buf;
            this.state.buf = "";
            return this.next(this.parseStartTimeHour);
          } else if (this.atEndOfWord()) {
            return this.returnNow(createDate(this.state.result + "-" + this.state.buf));
          } else if (isDigit(this.char)) {
            this.consume();
          } else {
            throw this.error(new TomlError("Incomplete datetime"));
          }
        }
        parseStartTimeHour() {
          if (this.atEndOfWord()) {
            return this.returnNow(createDate(this.state.result));
          } else {
            return this.goto(this.parseTimeHour);
          }
        }
        parseTimeHour() {
          if (this.char === CHAR_COLON) {
            if (this.state.buf.length < 2) {
              throw this.error(new TomlError("Hours less than 10 must be zero padded to two characters"));
            }
            this.state.result += "T" + this.state.buf;
            this.state.buf = "";
            return this.next(this.parseTimeMin);
          } else if (isDigit(this.char)) {
            this.consume();
          } else {
            throw this.error(new TomlError("Incomplete datetime"));
          }
        }
        parseTimeMin() {
          if (this.state.buf.length < 2 && isDigit(this.char)) {
            this.consume();
          } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
            this.state.result += ":" + this.state.buf;
            this.state.buf = "";
            return this.next(this.parseTimeSec);
          } else {
            throw this.error(new TomlError("Incomplete datetime"));
          }
        }
        parseTimeSec() {
          if (isDigit(this.char)) {
            this.consume();
            if (this.state.buf.length === 2) {
              this.state.result += ":" + this.state.buf;
              this.state.buf = "";
              return this.next(this.parseTimeZoneOrFraction);
            }
          } else {
            throw this.error(new TomlError("Incomplete datetime"));
          }
        }
        parseOnlyTimeHour() {
          if (this.char === CHAR_COLON) {
            if (this.state.buf.length < 2) {
              throw this.error(new TomlError("Hours less than 10 must be zero padded to two characters"));
            }
            this.state.result = this.state.buf;
            this.state.buf = "";
            return this.next(this.parseOnlyTimeMin);
          } else {
            throw this.error(new TomlError("Incomplete time"));
          }
        }
        parseOnlyTimeMin() {
          if (this.state.buf.length < 2 && isDigit(this.char)) {
            this.consume();
          } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
            this.state.result += ":" + this.state.buf;
            this.state.buf = "";
            return this.next(this.parseOnlyTimeSec);
          } else {
            throw this.error(new TomlError("Incomplete time"));
          }
        }
        parseOnlyTimeSec() {
          if (isDigit(this.char)) {
            this.consume();
            if (this.state.buf.length === 2) {
              return this.next(this.parseOnlyTimeFractionMaybe);
            }
          } else {
            throw this.error(new TomlError("Incomplete time"));
          }
        }
        parseOnlyTimeFractionMaybe() {
          this.state.result += ":" + this.state.buf;
          if (this.char === CHAR_PERIOD) {
            this.state.buf = "";
            this.next(this.parseOnlyTimeFraction);
          } else {
            return this.return(createTime(this.state.result));
          }
        }
        parseOnlyTimeFraction() {
          if (isDigit(this.char)) {
            this.consume();
          } else if (this.atEndOfWord()) {
            if (this.state.buf.length === 0) throw this.error(new TomlError("Expected digit in milliseconds"));
            return this.returnNow(createTime(this.state.result + "." + this.state.buf));
          } else {
            throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
          }
        }
        parseTimeZoneOrFraction() {
          if (this.char === CHAR_PERIOD) {
            this.consume();
            this.next(this.parseDateTimeFraction);
          } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
            this.consume();
            this.next(this.parseTimeZoneHour);
          } else if (this.char === CHAR_Z) {
            this.consume();
            return this.return(createDateTime(this.state.result + this.state.buf));
          } else if (this.atEndOfWord()) {
            return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf));
          } else {
            throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
          }
        }
        parseDateTimeFraction() {
          if (isDigit(this.char)) {
            this.consume();
          } else if (this.state.buf.length === 1) {
            throw this.error(new TomlError("Expected digit in milliseconds"));
          } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
            this.consume();
            this.next(this.parseTimeZoneHour);
          } else if (this.char === CHAR_Z) {
            this.consume();
            return this.return(createDateTime(this.state.result + this.state.buf));
          } else if (this.atEndOfWord()) {
            return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf));
          } else {
            throw this.error(new TomlError("Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z"));
          }
        }
        parseTimeZoneHour() {
          if (isDigit(this.char)) {
            this.consume();
            if (/\d\d$/.test(this.state.buf)) return this.next(this.parseTimeZoneSep);
          } else {
            throw this.error(new TomlError("Unexpected character in datetime, expected digit"));
          }
        }
        parseTimeZoneSep() {
          if (this.char === CHAR_COLON) {
            this.consume();
            this.next(this.parseTimeZoneMin);
          } else {
            throw this.error(new TomlError("Unexpected character in datetime, expected colon"));
          }
        }
        parseTimeZoneMin() {
          if (isDigit(this.char)) {
            this.consume();
            if (/\d\d$/.test(this.state.buf)) return this.return(createDateTime(this.state.result + this.state.buf));
          } else {
            throw this.error(new TomlError("Unexpected character in datetime, expected digit"));
          }
        }
        /* BOOLEAN */
        parseBoolean() {
          if (this.char === CHAR_t) {
            this.consume();
            return this.next(this.parseTrue_r);
          } else if (this.char === CHAR_f) {
            this.consume();
            return this.next(this.parseFalse_a);
          }
        }
        parseTrue_r() {
          if (this.char === CHAR_r) {
            this.consume();
            return this.next(this.parseTrue_u);
          } else {
            throw this.error(new TomlError("Invalid boolean, expected true or false"));
          }
        }
        parseTrue_u() {
          if (this.char === CHAR_u) {
            this.consume();
            return this.next(this.parseTrue_e);
          } else {
            throw this.error(new TomlError("Invalid boolean, expected true or false"));
          }
        }
        parseTrue_e() {
          if (this.char === CHAR_e) {
            return this.return(true);
          } else {
            throw this.error(new TomlError("Invalid boolean, expected true or false"));
          }
        }
        parseFalse_a() {
          if (this.char === CHAR_a) {
            this.consume();
            return this.next(this.parseFalse_l);
          } else {
            throw this.error(new TomlError("Invalid boolean, expected true or false"));
          }
        }
        parseFalse_l() {
          if (this.char === CHAR_l) {
            this.consume();
            return this.next(this.parseFalse_s);
          } else {
            throw this.error(new TomlError("Invalid boolean, expected true or false"));
          }
        }
        parseFalse_s() {
          if (this.char === CHAR_s) {
            this.consume();
            return this.next(this.parseFalse_e);
          } else {
            throw this.error(new TomlError("Invalid boolean, expected true or false"));
          }
        }
        parseFalse_e() {
          if (this.char === CHAR_e) {
            return this.return(false);
          } else {
            throw this.error(new TomlError("Invalid boolean, expected true or false"));
          }
        }
        /* INLINE LISTS */
        parseInlineList() {
          if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
            return null;
          } else if (this.char === Parser.END) {
            throw this.error(new TomlError("Unterminated inline array"));
          } else if (this.char === CHAR_NUM) {
            return this.call(this.parseComment);
          } else if (this.char === CHAR_RSQB) {
            return this.return(this.state.resultArr || InlineList());
          } else {
            return this.callNow(this.parseValue, this.recordInlineListValue);
          }
        }
        recordInlineListValue(value) {
          if (this.state.resultArr) {
            const listType = this.state.resultArr[_contentType];
            const valueType = tomlType(value);
            if (listType !== valueType) {
              throw this.error(new TomlError(`Inline lists must be a single type, not a mix of ${listType} and ${valueType}`));
            }
          } else {
            this.state.resultArr = InlineList(tomlType(value));
          }
          if (isFloat(value) || isInteger(value)) {
            this.state.resultArr.push(value.valueOf());
          } else {
            this.state.resultArr.push(value);
          }
          return this.goto(this.parseInlineListNext);
        }
        parseInlineListNext() {
          if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
            return null;
          } else if (this.char === CHAR_NUM) {
            return this.call(this.parseComment);
          } else if (this.char === CHAR_COMMA) {
            return this.next(this.parseInlineList);
          } else if (this.char === CHAR_RSQB) {
            return this.goto(this.parseInlineList);
          } else {
            throw this.error(new TomlError("Invalid character, expected whitespace, comma (,) or close bracket (])"));
          }
        }
        /* INLINE TABLE */
        parseInlineTable() {
          if (this.char === CHAR_SP || this.char === CTRL_I) {
            return null;
          } else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
            throw this.error(new TomlError("Unterminated inline array"));
          } else if (this.char === CHAR_RCUB) {
            return this.return(this.state.resultTable || InlineTable());
          } else {
            if (!this.state.resultTable) this.state.resultTable = InlineTable();
            return this.callNow(this.parseAssign, this.recordInlineTableValue);
          }
        }
        recordInlineTableValue(kv) {
          let target = this.state.resultTable;
          let finalKey = kv.key.pop();
          for (let kw of kv.key) {
            if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
              throw this.error(new TomlError("Can't redefine existing key"));
            }
            target = target[kw] = target[kw] || Table();
          }
          if (hasKey(target, finalKey)) {
            throw this.error(new TomlError("Can't redefine existing key"));
          }
          if (isInteger(kv.value) || isFloat(kv.value)) {
            target[finalKey] = kv.value.valueOf();
          } else {
            target[finalKey] = kv.value;
          }
          return this.goto(this.parseInlineTableNext);
        }
        parseInlineTableNext() {
          if (this.char === CHAR_SP || this.char === CTRL_I) {
            return null;
          } else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
            throw this.error(new TomlError("Unterminated inline array"));
          } else if (this.char === CHAR_COMMA) {
            return this.next(this.parseInlineTable);
          } else if (this.char === CHAR_RCUB) {
            return this.goto(this.parseInlineTable);
          } else {
            throw this.error(new TomlError("Invalid character, expected whitespace, comma (,) or close bracket (])"));
          }
        }
      }
      return TOMLParser;
    }
  }
});

// node_modules/@iarna/toml/parse-pretty-error.js
var require_parse_pretty_error = __commonJS({
  "node_modules/@iarna/toml/parse-pretty-error.js"(exports2, module2) {
    "use strict";
    module2.exports = prettyError;
    function prettyError(err, buf) {
      if (err.pos == null || err.line == null) return err;
      let msg = err.message;
      msg += ` at row ${err.line + 1}, col ${err.col + 1}, pos ${err.pos}:
`;
      if (buf && buf.split) {
        const lines = buf.split(/\n/);
        const lineNumWidth = String(Math.min(lines.length, err.line + 3)).length;
        let linePadding = " ";
        while (linePadding.length < lineNumWidth) linePadding += " ";
        for (let ii = Math.max(0, err.line - 1); ii < Math.min(lines.length, err.line + 2); ++ii) {
          let lineNum = String(ii + 1);
          if (lineNum.length < lineNumWidth) lineNum = " " + lineNum;
          if (err.line === ii) {
            msg += lineNum + "> " + lines[ii] + "\n";
            msg += linePadding + "  ";
            for (let hh = 0; hh < err.col; ++hh) {
              msg += " ";
            }
            msg += "^\n";
          } else {
            msg += lineNum + ": " + lines[ii] + "\n";
          }
        }
      }
      err.message = msg + "\n";
      return err;
    }
  }
});

// node_modules/@iarna/toml/parse-string.js
var require_parse_string = __commonJS({
  "node_modules/@iarna/toml/parse-string.js"(exports2, module2) {
    "use strict";
    module2.exports = parseString;
    var TOMLParser = require_toml_parser();
    var prettyError = require_parse_pretty_error();
    function parseString(str) {
      if (global.Buffer && global.Buffer.isBuffer(str)) {
        str = str.toString("utf8");
      }
      const parser = new TOMLParser();
      try {
        parser.parse(str);
        return parser.finish();
      } catch (err) {
        throw prettyError(err, str);
      }
    }
  }
});

// node_modules/@iarna/toml/parse-async.js
var require_parse_async = __commonJS({
  "node_modules/@iarna/toml/parse-async.js"(exports2, module2) {
    "use strict";
    module2.exports = parseAsync;
    var TOMLParser = require_toml_parser();
    var prettyError = require_parse_pretty_error();
    function parseAsync(str, opts) {
      if (!opts) opts = {};
      const index = 0;
      const blocksize = opts.blocksize || 40960;
      const parser = new TOMLParser();
      return new Promise((resolve, reject) => {
        setImmediate(parseAsyncNext, index, blocksize, resolve, reject);
      });
      function parseAsyncNext(index2, blocksize2, resolve, reject) {
        if (index2 >= str.length) {
          try {
            return resolve(parser.finish());
          } catch (err) {
            return reject(prettyError(err, str));
          }
        }
        try {
          parser.parse(str.slice(index2, index2 + blocksize2));
          setImmediate(parseAsyncNext, index2 + blocksize2, blocksize2, resolve, reject);
        } catch (err) {
          reject(prettyError(err, str));
        }
      }
    }
  }
});

// node_modules/@iarna/toml/parse-stream.js
var require_parse_stream = __commonJS({
  "node_modules/@iarna/toml/parse-stream.js"(exports2, module2) {
    "use strict";
    module2.exports = parseStream;
    var stream = require("stream");
    var TOMLParser = require_toml_parser();
    function parseStream(stm) {
      if (stm) {
        return parseReadable(stm);
      } else {
        return parseTransform(stm);
      }
    }
    function parseReadable(stm) {
      const parser = new TOMLParser();
      stm.setEncoding("utf8");
      return new Promise((resolve, reject) => {
        let readable;
        let ended = false;
        let errored = false;
        function finish() {
          ended = true;
          if (readable) return;
          try {
            resolve(parser.finish());
          } catch (err) {
            reject(err);
          }
        }
        function error(err) {
          errored = true;
          reject(err);
        }
        stm.once("end", finish);
        stm.once("error", error);
        readNext();
        function readNext() {
          readable = true;
          let data;
          while ((data = stm.read()) !== null) {
            try {
              parser.parse(data);
            } catch (err) {
              return error(err);
            }
          }
          readable = false;
          if (ended) return finish();
          if (errored) return;
          stm.once("readable", readNext);
        }
      });
    }
    function parseTransform() {
      const parser = new TOMLParser();
      return new stream.Transform({
        objectMode: true,
        transform(chunk, encoding, cb) {
          try {
            parser.parse(chunk.toString(encoding));
          } catch (err) {
            this.emit("error", err);
          }
          cb();
        },
        flush(cb) {
          try {
            this.push(parser.finish());
          } catch (err) {
            this.emit("error", err);
          }
          cb();
        }
      });
    }
  }
});

// node_modules/@iarna/toml/parse.js
var require_parse = __commonJS({
  "node_modules/@iarna/toml/parse.js"(exports2, module2) {
    "use strict";
    module2.exports = require_parse_string();
    module2.exports.async = require_parse_async();
    module2.exports.stream = require_parse_stream();
    module2.exports.prettyError = require_parse_pretty_error();
  }
});

// node_modules/@iarna/toml/stringify.js
var require_stringify = __commonJS({
  "node_modules/@iarna/toml/stringify.js"(exports2, module2) {
    "use strict";
    module2.exports = stringify;
    module2.exports.value = stringifyInline;
    function stringify(obj) {
      if (obj === null) throw typeError("null");
      if (obj === void 0) throw typeError("undefined");
      if (typeof obj !== "object") throw typeError(typeof obj);
      if (typeof obj.toJSON === "function") obj = obj.toJSON();
      if (obj == null) return null;
      const type = tomlType2(obj);
      if (type !== "table") throw typeError(type);
      return stringifyObject("", "", obj);
    }
    function typeError(type) {
      return new Error("Can only stringify objects, not " + type);
    }
    function arrayOneTypeError() {
      return new Error("Array values can't have mixed types");
    }
    function getInlineKeys(obj) {
      return Object.keys(obj).filter((key) => isInline(obj[key]));
    }
    function getComplexKeys(obj) {
      return Object.keys(obj).filter((key) => !isInline(obj[key]));
    }
    function toJSON(obj) {
      let nobj = Array.isArray(obj) ? [] : Object.prototype.hasOwnProperty.call(obj, "__proto__") ? { ["__proto__"]: void 0 } : {};
      for (let prop of Object.keys(obj)) {
        if (obj[prop] && typeof obj[prop].toJSON === "function" && !("toISOString" in obj[prop])) {
          nobj[prop] = obj[prop].toJSON();
        } else {
          nobj[prop] = obj[prop];
        }
      }
      return nobj;
    }
    function stringifyObject(prefix, indent, obj) {
      obj = toJSON(obj);
      var inlineKeys;
      var complexKeys;
      inlineKeys = getInlineKeys(obj);
      complexKeys = getComplexKeys(obj);
      var result = [];
      var inlineIndent = indent || "";
      inlineKeys.forEach((key) => {
        var type = tomlType2(obj[key]);
        if (type !== "undefined" && type !== "null") {
          result.push(inlineIndent + stringifyKey(key) + " = " + stringifyAnyInline(obj[key], true));
        }
      });
      if (result.length > 0) result.push("");
      var complexIndent = prefix && inlineKeys.length > 0 ? indent + "  " : "";
      complexKeys.forEach((key) => {
        result.push(stringifyComplex(prefix, complexIndent, key, obj[key]));
      });
      return result.join("\n");
    }
    function isInline(value) {
      switch (tomlType2(value)) {
        case "undefined":
        case "null":
        case "integer":
        case "nan":
        case "float":
        case "boolean":
        case "string":
        case "datetime":
          return true;
        case "array":
          return value.length === 0 || tomlType2(value[0]) !== "table";
        case "table":
          return Object.keys(value).length === 0;
        /* istanbul ignore next */
        default:
          return false;
      }
    }
    function tomlType2(value) {
      if (value === void 0) {
        return "undefined";
      } else if (value === null) {
        return "null";
      } else if (typeof value === "bigint" || Number.isInteger(value) && !Object.is(value, -0)) {
        return "integer";
      } else if (typeof value === "number") {
        return "float";
      } else if (typeof value === "boolean") {
        return "boolean";
      } else if (typeof value === "string") {
        return "string";
      } else if ("toISOString" in value) {
        return isNaN(value) ? "undefined" : "datetime";
      } else if (Array.isArray(value)) {
        return "array";
      } else {
        return "table";
      }
    }
    function stringifyKey(key) {
      var keyStr = String(key);
      if (/^[-A-Za-z0-9_]+$/.test(keyStr)) {
        return keyStr;
      } else {
        return stringifyBasicString(keyStr);
      }
    }
    function stringifyBasicString(str) {
      return '"' + escapeString(str).replace(/"/g, '\\"') + '"';
    }
    function stringifyLiteralString(str) {
      return "'" + str + "'";
    }
    function numpad(num, str) {
      while (str.length < num) str = "0" + str;
      return str;
    }
    function escapeString(str) {
      return str.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/([\u0000-\u001f\u007f])/, (c) => "\\u" + numpad(4, c.codePointAt(0).toString(16)));
    }
    function stringifyMultilineString(str) {
      let escaped = str.split(/\n/).map((str2) => {
        return escapeString(str2).replace(/"(?="")/g, '\\"');
      }).join("\n");
      if (escaped.slice(-1) === '"') escaped += "\\\n";
      return '"""\n' + escaped + '"""';
    }
    function stringifyAnyInline(value, multilineOk) {
      let type = tomlType2(value);
      if (type === "string") {
        if (multilineOk && /\n/.test(value)) {
          type = "string-multiline";
        } else if (!/[\b\t\n\f\r']/.test(value) && /"/.test(value)) {
          type = "string-literal";
        }
      }
      return stringifyInline(value, type);
    }
    function stringifyInline(value, type) {
      if (!type) type = tomlType2(value);
      switch (type) {
        case "string-multiline":
          return stringifyMultilineString(value);
        case "string":
          return stringifyBasicString(value);
        case "string-literal":
          return stringifyLiteralString(value);
        case "integer":
          return stringifyInteger(value);
        case "float":
          return stringifyFloat(value);
        case "boolean":
          return stringifyBoolean(value);
        case "datetime":
          return stringifyDatetime(value);
        case "array":
          return stringifyInlineArray(value.filter((_) => tomlType2(_) !== "null" && tomlType2(_) !== "undefined" && tomlType2(_) !== "nan"));
        case "table":
          return stringifyInlineTable(value);
        /* istanbul ignore next */
        default:
          throw typeError(type);
      }
    }
    function stringifyInteger(value) {
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "_");
    }
    function stringifyFloat(value) {
      if (value === Infinity) {
        return "inf";
      } else if (value === -Infinity) {
        return "-inf";
      } else if (Object.is(value, NaN)) {
        return "nan";
      } else if (Object.is(value, -0)) {
        return "-0.0";
      }
      var chunks = String(value).split(".");
      var int = chunks[0];
      var dec = chunks[1] || 0;
      return stringifyInteger(int) + "." + dec;
    }
    function stringifyBoolean(value) {
      return String(value);
    }
    function stringifyDatetime(value) {
      return value.toISOString();
    }
    function isNumber(type) {
      return type === "float" || type === "integer";
    }
    function arrayType(values) {
      var contentType = tomlType2(values[0]);
      if (values.every((_) => tomlType2(_) === contentType)) return contentType;
      if (values.every((_) => isNumber(tomlType2(_)))) return "float";
      return "mixed";
    }
    function validateArray(values) {
      const type = arrayType(values);
      if (type === "mixed") {
        throw arrayOneTypeError();
      }
      return type;
    }
    function stringifyInlineArray(values) {
      values = toJSON(values);
      const type = validateArray(values);
      var result = "[";
      var stringified = values.map((_) => stringifyInline(_, type));
      if (stringified.join(", ").length > 60 || /\n/.test(stringified)) {
        result += "\n  " + stringified.join(",\n  ") + "\n";
      } else {
        result += " " + stringified.join(", ") + (stringified.length > 0 ? " " : "");
      }
      return result + "]";
    }
    function stringifyInlineTable(value) {
      value = toJSON(value);
      var result = [];
      Object.keys(value).forEach((key) => {
        result.push(stringifyKey(key) + " = " + stringifyAnyInline(value[key], false));
      });
      return "{ " + result.join(", ") + (result.length > 0 ? " " : "") + "}";
    }
    function stringifyComplex(prefix, indent, key, value) {
      var valueType = tomlType2(value);
      if (valueType === "array") {
        return stringifyArrayOfTables(prefix, indent, key, value);
      } else if (valueType === "table") {
        return stringifyComplexTable(prefix, indent, key, value);
      } else {
        throw typeError(valueType);
      }
    }
    function stringifyArrayOfTables(prefix, indent, key, values) {
      values = toJSON(values);
      validateArray(values);
      var firstValueType = tomlType2(values[0]);
      if (firstValueType !== "table") throw typeError(firstValueType);
      var fullKey = prefix + stringifyKey(key);
      var result = "";
      values.forEach((table) => {
        if (result.length > 0) result += "\n";
        result += indent + "[[" + fullKey + "]]\n";
        result += stringifyObject(fullKey + ".", indent, table);
      });
      return result;
    }
    function stringifyComplexTable(prefix, indent, key, value) {
      var fullKey = prefix + stringifyKey(key);
      var result = "";
      if (getInlineKeys(value).length > 0) {
        result += indent + "[" + fullKey + "]\n";
      }
      return result + stringifyObject(fullKey + ".", indent, value);
    }
  }
});

// node_modules/@iarna/toml/toml.js
var require_toml = __commonJS({
  "node_modules/@iarna/toml/toml.js"(exports2) {
    "use strict";
    exports2.parse = require_parse();
    exports2.stringify = require_stringify();
  }
});

// node_modules/graphql/version.js
var require_version = __commonJS({
  "node_modules/graphql/version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.versionInfo = exports2.version = void 0;
    var version = "16.14.2";
    exports2.version = version;
    var versionInfo = Object.freeze({
      major: 16,
      minor: 14,
      patch: 2,
      preReleaseTag: null
    });
    exports2.versionInfo = versionInfo;
  }
});

// node_modules/graphql/jsutils/devAssert.js
var require_devAssert = __commonJS({
  "node_modules/graphql/jsutils/devAssert.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.devAssert = devAssert;
    function devAssert(condition, message) {
      const booleanCondition = Boolean(condition);
      if (!booleanCondition) {
        throw new Error(message);
      }
    }
  }
});

// node_modules/graphql/jsutils/isPromise.js
var require_isPromise = __commonJS({
  "node_modules/graphql/jsutils/isPromise.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.isPromise = isPromise;
    function isPromise(value) {
      return typeof (value === null || value === void 0 ? void 0 : value.then) === "function";
    }
  }
});

// node_modules/graphql/jsutils/isObjectLike.js
var require_isObjectLike = __commonJS({
  "node_modules/graphql/jsutils/isObjectLike.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.isObjectLike = isObjectLike;
    function isObjectLike(value) {
      return typeof value == "object" && value !== null;
    }
  }
});

// node_modules/graphql/jsutils/invariant.js
var require_invariant = __commonJS({
  "node_modules/graphql/jsutils/invariant.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.invariant = invariant;
    function invariant(condition, message) {
      const booleanCondition = Boolean(condition);
      if (!booleanCondition) {
        throw new Error(
          message != null ? message : "Unexpected invariant triggered."
        );
      }
    }
  }
});

// node_modules/graphql/language/location.js
var require_location = __commonJS({
  "node_modules/graphql/language/location.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.getLocation = getLocation;
    var _invariant = require_invariant();
    var LineRegExp = /\r\n|[\n\r]/g;
    function getLocation(source, position) {
      let lastLineStart = 0;
      let line = 1;
      for (const match of source.body.matchAll(LineRegExp)) {
        typeof match.index === "number" || (0, _invariant.invariant)(false);
        if (match.index >= position) {
          break;
        }
        lastLineStart = match.index + match[0].length;
        line += 1;
      }
      return {
        line,
        column: position + 1 - lastLineStart
      };
    }
  }
});

// node_modules/graphql/language/printLocation.js
var require_printLocation = __commonJS({
  "node_modules/graphql/language/printLocation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.printLocation = printLocation;
    exports2.printSourceLocation = printSourceLocation;
    var _location = require_location();
    function printLocation(location) {
      return printSourceLocation(
        location.source,
        (0, _location.getLocation)(location.source, location.start)
      );
    }
    function printSourceLocation(source, sourceLocation) {
      const firstLineColumnOffset = source.locationOffset.column - 1;
      const body = "".padStart(firstLineColumnOffset) + source.body;
      const lineIndex = sourceLocation.line - 1;
      const lineOffset = source.locationOffset.line - 1;
      const lineNum = sourceLocation.line + lineOffset;
      const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
      const columnNum = sourceLocation.column + columnOffset;
      const locationStr = `${source.name}:${lineNum}:${columnNum}
`;
      const lines = body.split(/\r\n|[\n\r]/g);
      const locationLine = lines[lineIndex];
      if (locationLine.length > 120) {
        const subLineIndex = Math.floor(columnNum / 80);
        const subLineColumnNum = columnNum % 80;
        const subLines = [];
        for (let i = 0; i < locationLine.length; i += 80) {
          subLines.push(locationLine.slice(i, i + 80));
        }
        return locationStr + printPrefixedLines([
          [`${lineNum} |`, subLines[0]],
          ...subLines.slice(1, subLineIndex + 1).map((subLine) => ["|", subLine]),
          ["|", "^".padStart(subLineColumnNum)],
          ["|", subLines[subLineIndex + 1]]
        ]);
      }
      return locationStr + printPrefixedLines([
        // Lines specified like this: ["prefix", "string"],
        [`${lineNum - 1} |`, lines[lineIndex - 1]],
        [`${lineNum} |`, locationLine],
        ["|", "^".padStart(columnNum)],
        [`${lineNum + 1} |`, lines[lineIndex + 1]]
      ]);
    }
    function printPrefixedLines(lines) {
      const existingLines = lines.filter(([_, line]) => line !== void 0);
      const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
      return existingLines.map(([prefix, line]) => prefix.padStart(padLen) + (line ? " " + line : "")).join("\n");
    }
  }
});

// node_modules/graphql/error/GraphQLError.js
var require_GraphQLError = __commonJS({
  "node_modules/graphql/error/GraphQLError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.GraphQLError = void 0;
    exports2.formatError = formatError;
    exports2.printError = printError;
    var _isObjectLike = require_isObjectLike();
    var _location = require_location();
    var _printLocation = require_printLocation();
    function toNormalizedOptions(args) {
      const firstArg = args[0];
      if (firstArg == null || "kind" in firstArg || "length" in firstArg) {
        return {
          nodes: firstArg,
          source: args[1],
          positions: args[2],
          path: args[3],
          originalError: args[4],
          extensions: args[5]
        };
      }
      return firstArg;
    }
    var GraphQLError = class _GraphQLError extends Error {
      /**
       * An array of `{ line, column }` locations within the source GraphQL document
       * which correspond to this error.
       *
       * Errors during validation often contain multiple locations, for example to
       * point out two things with the same name. Errors during execution include a
       * single location, the field which produced the error.
       *
       * Enumerable, and appears in the result of JSON.stringify().
       */
      /**
       * An array describing the JSON-path into the execution response which
       * corresponds to this error. Only included for errors during execution.
       *
       * Enumerable, and appears in the result of JSON.stringify().
       */
      /** An array of GraphQL AST Nodes corresponding to this error. */
      /**
       * The source GraphQL document for the first location of this error.
       *
       * Note that if this Error represents more than one node, the source may not
       * represent nodes after the first node.
       */
      /**
       * An array of character offsets within the source GraphQL document
       * which correspond to this error.
       */
      /** Original error that caused this GraphQLError, if one exists. */
      /** Extension fields to add to the formatted error. */
      /**
       * Creates a GraphQLError instance.
       * @param message - Human-readable error message.
       * @param options - Error metadata such as source locations, response path, original error, and extensions.
       * This positional-arguments constructor overload is deprecated. Use the
       * `GraphQLError(message, options)` overload instead.
       * @example
       * ```ts
       * // Create an error from AST nodes and response metadata.
       * import { parse } from 'graphql/language';
       * import { GraphQLError } from 'graphql/error';
       *
       * const document = parse('{ greeting }');
       * const fieldNode = document.definitions[0].selectionSet.selections[0];
       * const error = new GraphQLError('Cannot query this field.', {
       *   nodes: fieldNode,
       *   path: ['greeting'],
       *   extensions: { code: 'FORBIDDEN' },
       * });
       *
       * error.message; // => 'Cannot query this field.'
       * error.locations; // => [{ line: 1, column: 3 }]
       * error.path; // => ['greeting']
       * error.extensions; // => { code: 'FORBIDDEN' }
       * ```
       * @example
       * ```ts
       * // This variant derives locations from source positions and preserves the original error.
       * import { Source } from 'graphql/language';
       * import { GraphQLError } from 'graphql/error';
       *
       * const source = new Source('{ greeting }');
       * const originalError = new Error('Database unavailable.');
       * const error = new GraphQLError('Resolver failed.', {
       *   source,
       *   positions: [2],
       *   path: ['greeting'],
       *   originalError,
       * });
       *
       * error.locations; // => [{ line: 1, column: 3 }]
       * error.path; // => ['greeting']
       * error.originalError; // => originalError
       * ```
       */
      /**
       * Creates a GraphQLError instance using the legacy positional constructor.
       * This deprecated overload will be removed in v17. Prefer the
       * `GraphQLErrorOptions` object overload, which keeps optional error metadata
       * in a single options bag.
       * @param message - Human-readable error message.
       * @param nodes - AST node or nodes associated with this error.
       * @param source - Source document used to derive error locations.
       * @param positions - Character offsets in the source document associated with
       * this error.
       * @param path - Response path where this error occurred during execution.
       * @param originalError - Original error that caused this GraphQLError, if one
       * exists.
       * @param extensions - Extension fields to include in the formatted error.
       * @example
       * ```ts
       * import { Source } from 'graphql/language';
       * import { GraphQLError } from 'graphql/error';
       *
       * const source = new Source('{ greeting }');
       * const originalError = new Error('Database unavailable.');
       * const error = new GraphQLError(
       *   'Resolver failed.',
       *   undefined,
       *   source,
       *   [2],
       *   ['greeting'],
       *   originalError,
       *   { code: 'INTERNAL' },
       * );
       *
       * error.locations; // => [{ line: 1, column: 3 }]
       * error.path; // => ['greeting']
       * error.originalError; // => originalError
       * error.extensions; // => { code: 'INTERNAL' }
       * ```
       * @deprecated Please use the `GraphQLErrorOptions` constructor overload instead.
       */
      constructor(message, ...rawArgs) {
        var _this$nodes, _nodeLocations$, _ref;
        const { nodes, source, positions, path: path4, originalError, extensions } = toNormalizedOptions(rawArgs);
        super(message);
        this.name = "GraphQLError";
        this.path = path4 !== null && path4 !== void 0 ? path4 : void 0;
        this.originalError = originalError !== null && originalError !== void 0 ? originalError : void 0;
        this.nodes = undefinedIfEmpty(
          Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0
        );
        const nodeLocations = undefinedIfEmpty(
          (_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node) => node.loc).filter((loc) => loc != null)
        );
        this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
        this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => loc.start);
        this.locations = positions && source ? positions.map((pos) => (0, _location.getLocation)(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map(
          (loc) => (0, _location.getLocation)(loc.source, loc.start)
        );
        const originalExtensions = (0, _isObjectLike.isObjectLike)(
          originalError === null || originalError === void 0 ? void 0 : originalError.extensions
        ) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : void 0;
        this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : /* @__PURE__ */ Object.create(null);
        Object.defineProperties(this, {
          message: {
            writable: true,
            enumerable: true
          },
          name: {
            enumerable: false
          },
          nodes: {
            enumerable: false
          },
          source: {
            enumerable: false
          },
          positions: {
            enumerable: false
          },
          originalError: {
            enumerable: false
          }
        });
        if (originalError !== null && originalError !== void 0 && originalError.stack) {
          Object.defineProperty(this, "stack", {
            value: originalError.stack,
            writable: true,
            configurable: true
          });
        } else if (Error.captureStackTrace) {
          Error.captureStackTrace(this, _GraphQLError);
        } else {
          Object.defineProperty(this, "stack", {
            value: Error().stack,
            writable: true,
            configurable: true
          });
        }
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLError";
      }
      /**
       * Returns this error as a human-readable message with source locations.
       * @returns The formatted error string.
       * @example
       * ```ts
       * import { Source } from 'graphql/language';
       * import { GraphQLError } from 'graphql/error';
       *
       * const error = new GraphQLError('Cannot query field "name".', {
       *   source: new Source('{ name }'),
       *   positions: [2],
       * });
       *
       * error.toString(); // => 'Cannot query field "name".\n\nGraphQL request:1:3\n1 | { name }\n  |   ^'
       * ```
       */
      toString() {
        let output = this.message;
        if (this.nodes) {
          for (const node of this.nodes) {
            if (node.loc) {
              output += "\n\n" + (0, _printLocation.printLocation)(node.loc);
            }
          }
        } else if (this.source && this.locations) {
          for (const location of this.locations) {
            output += "\n\n" + (0, _printLocation.printSourceLocation)(this.source, location);
          }
        }
        return output;
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLError } from 'graphql/error';
       *
       * const error = new GraphQLError('Resolver failed.', {
       *   path: ['viewer', 'name'],
       *   extensions: { code: 'INTERNAL' },
       * });
       *
       * error.toJSON(); // => { message: 'Resolver failed.', path: ['viewer', 'name'], extensions: { code: 'INTERNAL' } }
       * ```
       */
      toJSON() {
        const formattedError = {
          message: this.message
        };
        if (this.locations != null) {
          formattedError.locations = this.locations;
        }
        if (this.path != null) {
          formattedError.path = this.path;
        }
        if (this.extensions != null && Object.keys(this.extensions).length > 0) {
          formattedError.extensions = this.extensions;
        }
        return formattedError;
      }
    };
    exports2.GraphQLError = GraphQLError;
    function undefinedIfEmpty(array) {
      return array === void 0 || array.length === 0 ? void 0 : array;
    }
    function printError(error) {
      return error.toString();
    }
    function formatError(error) {
      return error.toJSON();
    }
  }
});

// node_modules/graphql/error/syntaxError.js
var require_syntaxError = __commonJS({
  "node_modules/graphql/error/syntaxError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.syntaxError = syntaxError;
    var _GraphQLError = require_GraphQLError();
    function syntaxError(source, position, description) {
      return new _GraphQLError.GraphQLError(`Syntax Error: ${description}`, {
        source,
        positions: [position]
      });
    }
  }
});

// node_modules/graphql/language/ast.js
var require_ast = __commonJS({
  "node_modules/graphql/language/ast.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.Token = exports2.QueryDocumentKeys = exports2.OperationTypeNode = exports2.Location = void 0;
    exports2.isNode = isNode;
    var Location = class {
      /** The character offset at which this Node begins. */
      /** The character offset at which this Node ends. */
      /** The Token at which this Node begins. */
      /** The Token at which this Node ends. */
      /** The Source document the AST represents. */
      /**
       * Creates a Location instance.
       * @param startToken - The start token.
       * @param endToken - The end token.
       * @param source - Source document used to derive error locations.
       * @example
       * ```ts
       * import { Location, Source, Token, TokenKind } from 'graphql/language';
       *
       * const source = new Source('{ hello }');
       * const startToken = new Token(TokenKind.BRACE_L, 0, 1, 1, 1);
       * const endToken = new Token(TokenKind.BRACE_R, 8, 9, 1, 9);
       * const location = new Location(startToken, endToken, source);
       *
       * location.start; // => 0
       * location.end; // => 9
       * location.source.body; // => '{ hello }'
       * ```
       */
      constructor(startToken, endToken, source) {
        this.start = startToken.start;
        this.end = endToken.end;
        this.startToken = startToken;
        this.endToken = endToken;
        this.source = source;
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "Location";
      }
      /**
       * Returns a JSON representation of this location.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       *
       * const document = parse('{ hello }');
       * const location = document.loc?.toJSON();
       *
       * location; // => { start: 0, end: 9 }
       * ```
       */
      toJSON() {
        return {
          start: this.start,
          end: this.end
        };
      }
    };
    exports2.Location = Location;
    var Token = class {
      /** The kind of Token. */
      /** The character offset at which this Node begins. */
      /** The character offset at which this Node ends. */
      /** The 1-indexed line number on which this Token appears. */
      /** The 1-indexed column number at which this Token begins. */
      /**
       * For non-punctuation tokens, represents the interpreted value of the token.
       *
       * Note: is undefined for punctuation tokens, but typed as string for
       * convenience in the parser.
       */
      /**
       * Tokens exist as nodes in a double-linked-list amongst all tokens
       * including ignored tokens. <SOF> is always the first node and <EOF>
       * the last.
       */
      /** Next token in the token stream, including ignored tokens. */
      /**
       * Creates a Token instance.
       * @param kind - Token kind produced by lexical analysis.
       * @param start - Character offset where this token begins.
       * @param end - Character offset where this token ends.
       * @param line - One-indexed line number where this token begins.
       * @param column - One-indexed column number where this token begins.
       * @param value - Interpreted value for non-punctuation tokens.
       * @example
       * ```ts
       * import { Token, TokenKind } from 'graphql/language';
       *
       * const token = new Token(TokenKind.NAME, 2, 7, 1, 3, 'hello');
       *
       * token.kind; // => TokenKind.NAME
       * token.value; // => 'hello'
       * token.toJSON(); // => { kind: 'Name', value: 'hello', line: 1, column: 3 }
       * ```
       */
      constructor(kind, start, end, line, column, value) {
        this.kind = kind;
        this.start = start;
        this.end = end;
        this.line = line;
        this.column = column;
        this.value = value;
        this.prev = null;
        this.next = null;
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "Token";
      }
      /**
       * Returns a JSON representation of this token.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { Lexer, Source } from 'graphql/language';
       *
       * const lexer = new Lexer(new Source('{ hello }'));
       * const token = lexer.advance().toJSON();
       *
       * token; // => { kind: '{', value: undefined, line: 1, column: 1 }
       * ```
       */
      toJSON() {
        return {
          kind: this.kind,
          value: this.value,
          line: this.line,
          column: this.column
        };
      }
    };
    exports2.Token = Token;
    var QueryDocumentKeys = {
      Name: [],
      Document: ["definitions"],
      OperationDefinition: [
        "description",
        "name",
        "variableDefinitions",
        "directives",
        "selectionSet"
      ],
      VariableDefinition: [
        "description",
        "variable",
        "type",
        "defaultValue",
        "directives"
      ],
      Variable: ["name"],
      SelectionSet: ["selections"],
      Field: ["alias", "name", "arguments", "directives", "selectionSet"],
      Argument: ["name", "value"],
      FragmentSpread: ["name", "directives"],
      InlineFragment: ["typeCondition", "directives", "selectionSet"],
      FragmentDefinition: [
        "description",
        "name",
        // Note: fragment variable definitions are deprecated and will removed in v17.0.0
        "variableDefinitions",
        "typeCondition",
        "directives",
        "selectionSet"
      ],
      IntValue: [],
      FloatValue: [],
      StringValue: [],
      BooleanValue: [],
      NullValue: [],
      EnumValue: [],
      ListValue: ["values"],
      ObjectValue: ["fields"],
      ObjectField: ["name", "value"],
      Directive: ["name", "arguments"],
      NamedType: ["name"],
      ListType: ["type"],
      NonNullType: ["type"],
      SchemaDefinition: ["description", "directives", "operationTypes"],
      OperationTypeDefinition: ["type"],
      ScalarTypeDefinition: ["description", "name", "directives"],
      ObjectTypeDefinition: [
        "description",
        "name",
        "interfaces",
        "directives",
        "fields"
      ],
      FieldDefinition: ["description", "name", "arguments", "type", "directives"],
      InputValueDefinition: [
        "description",
        "name",
        "type",
        "defaultValue",
        "directives"
      ],
      InterfaceTypeDefinition: [
        "description",
        "name",
        "interfaces",
        "directives",
        "fields"
      ],
      UnionTypeDefinition: ["description", "name", "directives", "types"],
      EnumTypeDefinition: ["description", "name", "directives", "values"],
      EnumValueDefinition: ["description", "name", "directives"],
      InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
      DirectiveDefinition: [
        "description",
        "name",
        "arguments",
        "directives",
        "locations"
      ],
      SchemaExtension: ["directives", "operationTypes"],
      DirectiveExtension: ["name", "directives"],
      ScalarTypeExtension: ["name", "directives"],
      ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
      InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
      UnionTypeExtension: ["name", "directives", "types"],
      EnumTypeExtension: ["name", "directives", "values"],
      InputObjectTypeExtension: ["name", "directives", "fields"],
      TypeCoordinate: ["name"],
      MemberCoordinate: ["name", "memberName"],
      ArgumentCoordinate: ["name", "fieldName", "argumentName"],
      DirectiveCoordinate: ["name"],
      DirectiveArgumentCoordinate: ["name", "argumentName"]
    };
    exports2.QueryDocumentKeys = QueryDocumentKeys;
    var kindValues = new Set(Object.keys(QueryDocumentKeys));
    function isNode(maybeNode) {
      const maybeKind = maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
      return typeof maybeKind === "string" && kindValues.has(maybeKind);
    }
    var OperationTypeNode;
    exports2.OperationTypeNode = OperationTypeNode;
    (function(OperationTypeNode2) {
      OperationTypeNode2["QUERY"] = "query";
      OperationTypeNode2["MUTATION"] = "mutation";
      OperationTypeNode2["SUBSCRIPTION"] = "subscription";
    })(OperationTypeNode || (exports2.OperationTypeNode = OperationTypeNode = {}));
  }
});

// node_modules/graphql/language/directiveLocation.js
var require_directiveLocation = __commonJS({
  "node_modules/graphql/language/directiveLocation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.DirectiveLocation = void 0;
    var DirectiveLocation;
    exports2.DirectiveLocation = DirectiveLocation;
    (function(DirectiveLocation2) {
      DirectiveLocation2["QUERY"] = "QUERY";
      DirectiveLocation2["MUTATION"] = "MUTATION";
      DirectiveLocation2["SUBSCRIPTION"] = "SUBSCRIPTION";
      DirectiveLocation2["FIELD"] = "FIELD";
      DirectiveLocation2["FRAGMENT_DEFINITION"] = "FRAGMENT_DEFINITION";
      DirectiveLocation2["FRAGMENT_SPREAD"] = "FRAGMENT_SPREAD";
      DirectiveLocation2["INLINE_FRAGMENT"] = "INLINE_FRAGMENT";
      DirectiveLocation2["VARIABLE_DEFINITION"] = "VARIABLE_DEFINITION";
      DirectiveLocation2["SCHEMA"] = "SCHEMA";
      DirectiveLocation2["SCALAR"] = "SCALAR";
      DirectiveLocation2["OBJECT"] = "OBJECT";
      DirectiveLocation2["FIELD_DEFINITION"] = "FIELD_DEFINITION";
      DirectiveLocation2["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
      DirectiveLocation2["INTERFACE"] = "INTERFACE";
      DirectiveLocation2["UNION"] = "UNION";
      DirectiveLocation2["ENUM"] = "ENUM";
      DirectiveLocation2["ENUM_VALUE"] = "ENUM_VALUE";
      DirectiveLocation2["INPUT_OBJECT"] = "INPUT_OBJECT";
      DirectiveLocation2["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
      DirectiveLocation2["DIRECTIVE_DEFINITION"] = "DIRECTIVE_DEFINITION";
    })(DirectiveLocation || (exports2.DirectiveLocation = DirectiveLocation = {}));
  }
});

// node_modules/graphql/language/kinds.js
var require_kinds = __commonJS({
  "node_modules/graphql/language/kinds.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.Kind = void 0;
    var Kind2;
    exports2.Kind = Kind2;
    (function(Kind3) {
      Kind3["NAME"] = "Name";
      Kind3["DOCUMENT"] = "Document";
      Kind3["OPERATION_DEFINITION"] = "OperationDefinition";
      Kind3["VARIABLE_DEFINITION"] = "VariableDefinition";
      Kind3["SELECTION_SET"] = "SelectionSet";
      Kind3["FIELD"] = "Field";
      Kind3["ARGUMENT"] = "Argument";
      Kind3["FRAGMENT_SPREAD"] = "FragmentSpread";
      Kind3["INLINE_FRAGMENT"] = "InlineFragment";
      Kind3["FRAGMENT_DEFINITION"] = "FragmentDefinition";
      Kind3["VARIABLE"] = "Variable";
      Kind3["INT"] = "IntValue";
      Kind3["FLOAT"] = "FloatValue";
      Kind3["STRING"] = "StringValue";
      Kind3["BOOLEAN"] = "BooleanValue";
      Kind3["NULL"] = "NullValue";
      Kind3["ENUM"] = "EnumValue";
      Kind3["LIST"] = "ListValue";
      Kind3["OBJECT"] = "ObjectValue";
      Kind3["OBJECT_FIELD"] = "ObjectField";
      Kind3["DIRECTIVE"] = "Directive";
      Kind3["NAMED_TYPE"] = "NamedType";
      Kind3["LIST_TYPE"] = "ListType";
      Kind3["NON_NULL_TYPE"] = "NonNullType";
      Kind3["SCHEMA_DEFINITION"] = "SchemaDefinition";
      Kind3["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
      Kind3["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
      Kind3["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
      Kind3["FIELD_DEFINITION"] = "FieldDefinition";
      Kind3["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
      Kind3["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
      Kind3["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
      Kind3["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
      Kind3["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
      Kind3["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
      Kind3["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
      Kind3["SCHEMA_EXTENSION"] = "SchemaExtension";
      Kind3["DIRECTIVE_EXTENSION"] = "DirectiveExtension";
      Kind3["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
      Kind3["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
      Kind3["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
      Kind3["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
      Kind3["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
      Kind3["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
      Kind3["TYPE_COORDINATE"] = "TypeCoordinate";
      Kind3["MEMBER_COORDINATE"] = "MemberCoordinate";
      Kind3["ARGUMENT_COORDINATE"] = "ArgumentCoordinate";
      Kind3["DIRECTIVE_COORDINATE"] = "DirectiveCoordinate";
      Kind3["DIRECTIVE_ARGUMENT_COORDINATE"] = "DirectiveArgumentCoordinate";
    })(Kind2 || (exports2.Kind = Kind2 = {}));
  }
});

// node_modules/graphql/language/characterClasses.js
var require_characterClasses = __commonJS({
  "node_modules/graphql/language/characterClasses.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.isDigit = isDigit2;
    exports2.isLetter = isLetter;
    exports2.isNameContinue = isNameContinue;
    exports2.isNameStart = isNameStart;
    exports2.isWhiteSpace = isWhiteSpace;
    function isWhiteSpace(code) {
      return code === 9 || code === 32;
    }
    function isDigit2(code) {
      return code >= 48 && code <= 57;
    }
    function isLetter(code) {
      return code >= 97 && code <= 122 || // A-Z
      code >= 65 && code <= 90;
    }
    function isNameStart(code) {
      return isLetter(code) || code === 95;
    }
    function isNameContinue(code) {
      return isLetter(code) || isDigit2(code) || code === 95;
    }
  }
});

// node_modules/graphql/language/blockString.js
var require_blockString = __commonJS({
  "node_modules/graphql/language/blockString.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.dedentBlockStringLines = dedentBlockStringLines;
    exports2.isPrintableAsBlockString = isPrintableAsBlockString;
    exports2.printBlockString = printBlockString;
    var _characterClasses = require_characterClasses();
    function dedentBlockStringLines(lines) {
      var _firstNonEmptyLine2;
      let commonIndent = Number.MAX_SAFE_INTEGER;
      let firstNonEmptyLine = null;
      let lastNonEmptyLine = -1;
      for (let i = 0; i < lines.length; ++i) {
        var _firstNonEmptyLine;
        const line = lines[i];
        const indent = leadingWhitespace(line);
        if (indent === line.length) {
          continue;
        }
        firstNonEmptyLine = (_firstNonEmptyLine = firstNonEmptyLine) !== null && _firstNonEmptyLine !== void 0 ? _firstNonEmptyLine : i;
        lastNonEmptyLine = i;
        if (i !== 0 && indent < commonIndent) {
          commonIndent = indent;
        }
      }
      return lines.map((line, i) => i === 0 ? line : line.slice(commonIndent)).slice(
        (_firstNonEmptyLine2 = firstNonEmptyLine) !== null && _firstNonEmptyLine2 !== void 0 ? _firstNonEmptyLine2 : 0,
        lastNonEmptyLine + 1
      );
    }
    function leadingWhitespace(str) {
      let i = 0;
      while (i < str.length && (0, _characterClasses.isWhiteSpace)(str.charCodeAt(i))) {
        ++i;
      }
      return i;
    }
    function isPrintableAsBlockString(value) {
      if (value === "") {
        return true;
      }
      let isEmptyLine = true;
      let hasIndent = false;
      let hasCommonIndent = true;
      let seenNonEmptyLine = false;
      for (let i = 0; i < value.length; ++i) {
        switch (value.codePointAt(i)) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 11:
          case 12:
          case 14:
          case 15:
            return false;
          // Has non-printable characters
          case 13:
            return false;
          // Has \r or \r\n which will be replaced as \n
          case 10:
            if (isEmptyLine && !seenNonEmptyLine) {
              return false;
            }
            seenNonEmptyLine = true;
            isEmptyLine = true;
            hasIndent = false;
            break;
          case 9:
          //   \t
          case 32:
            hasIndent || (hasIndent = isEmptyLine);
            break;
          default:
            hasCommonIndent && (hasCommonIndent = hasIndent);
            isEmptyLine = false;
        }
      }
      if (isEmptyLine) {
        return false;
      }
      if (hasCommonIndent && seenNonEmptyLine) {
        return false;
      }
      return true;
    }
    function printBlockString(value, options) {
      const escapedValue = value.replace(/"""/g, '\\"""');
      const lines = escapedValue.split(/\r\n|[\n\r]/g);
      const isSingleLine = lines.length === 1;
      const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every(
        (line) => line.length === 0 || (0, _characterClasses.isWhiteSpace)(line.charCodeAt(0))
      );
      const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""');
      const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
      const hasTrailingSlash = value.endsWith("\\");
      const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
      const printAsMultipleLines = !(options !== null && options !== void 0 && options.minimize) && // add leading and trailing new lines only if it improves readability
      (!isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes);
      let result = "";
      const skipLeadingNewLine = isSingleLine && (0, _characterClasses.isWhiteSpace)(value.charCodeAt(0));
      if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) {
        result += "\n";
      }
      result += escapedValue;
      if (printAsMultipleLines || forceTrailingNewline) {
        result += "\n";
      }
      return '"""' + result + '"""';
    }
  }
});

// node_modules/graphql/language/tokenKind.js
var require_tokenKind = __commonJS({
  "node_modules/graphql/language/tokenKind.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.TokenKind = void 0;
    var TokenKind;
    exports2.TokenKind = TokenKind;
    (function(TokenKind2) {
      TokenKind2["SOF"] = "<SOF>";
      TokenKind2["EOF"] = "<EOF>";
      TokenKind2["BANG"] = "!";
      TokenKind2["DOLLAR"] = "$";
      TokenKind2["AMP"] = "&";
      TokenKind2["PAREN_L"] = "(";
      TokenKind2["PAREN_R"] = ")";
      TokenKind2["DOT"] = ".";
      TokenKind2["SPREAD"] = "...";
      TokenKind2["COLON"] = ":";
      TokenKind2["EQUALS"] = "=";
      TokenKind2["AT"] = "@";
      TokenKind2["BRACKET_L"] = "[";
      TokenKind2["BRACKET_R"] = "]";
      TokenKind2["BRACE_L"] = "{";
      TokenKind2["PIPE"] = "|";
      TokenKind2["BRACE_R"] = "}";
      TokenKind2["NAME"] = "Name";
      TokenKind2["INT"] = "Int";
      TokenKind2["FLOAT"] = "Float";
      TokenKind2["STRING"] = "String";
      TokenKind2["BLOCK_STRING"] = "BlockString";
      TokenKind2["COMMENT"] = "Comment";
    })(TokenKind || (exports2.TokenKind = TokenKind = {}));
  }
});

// node_modules/graphql/language/lexer.js
var require_lexer = __commonJS({
  "node_modules/graphql/language/lexer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.Lexer = void 0;
    exports2.createToken = createToken;
    exports2.isPunctuatorTokenKind = isPunctuatorTokenKind;
    exports2.printCodePointAt = printCodePointAt;
    exports2.readName = readName;
    var _syntaxError = require_syntaxError();
    var _ast = require_ast();
    var _blockString = require_blockString();
    var _characterClasses = require_characterClasses();
    var _tokenKind = require_tokenKind();
    var Lexer = class {
      /** Source document used to derive error locations. */
      /** Most recent non-ignored token returned by the lexer. */
      /** Current non-ignored token at the lexer cursor. */
      /** The (1-indexed) line containing the current token. */
      /** Character offset where the current line starts. */
      /**
       * Creates a Lexer instance.
       * @param source - Source document used to derive error locations.
       * @example
       * ```ts
       * import { Lexer, Source, TokenKind } from 'graphql/language';
       *
       * const lexer = new Lexer(new Source('{ hello }'));
       *
       * lexer.token.kind; // => TokenKind.SOF
       * lexer.advance().kind; // => TokenKind.BRACE_L
       * lexer.advance().value; // => 'hello'
       * lexer.advance().kind; // => TokenKind.BRACE_R
       * ```
       */
      constructor(source) {
        const startOfFileToken = new _ast.Token(
          _tokenKind.TokenKind.SOF,
          0,
          0,
          0,
          0
        );
        this.source = source;
        this.lastToken = startOfFileToken;
        this.token = startOfFileToken;
        this.line = 1;
        this.lineStart = 0;
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "Lexer";
      }
      /**
       * Advances the token stream to the next non-ignored token.
       * @returns The next non-ignored token.
       * @example
       * ```ts
       * import { Lexer, Source } from 'graphql/language';
       *
       * const lexer = new Lexer(new Source('{ hello }'));
       * const token = lexer.advance();
       *
       * token.kind; // => '{'
       * lexer.token; // => token
       * ```
       */
      advance() {
        this.lastToken = this.token;
        const token = this.token = this.lookahead();
        return token;
      }
      /**
       * Looks ahead and returns the next non-ignored token, but does not change
       * the state of Lexer.
       * @returns The next non-ignored token without advancing the lexer.
       * @example
       * ```ts
       * import { Lexer, Source } from 'graphql/language';
       *
       * const lexer = new Lexer(new Source('{ hello }'));
       * const token = lexer.lookahead();
       *
       * token.kind; // => '{'
       * lexer.token.kind; // => '<SOF>'
       * ```
       */
      lookahead() {
        let token = this.token;
        if (token.kind !== _tokenKind.TokenKind.EOF) {
          do {
            if (token.next) {
              token = token.next;
            } else {
              const nextToken = readNextToken(this, token.end);
              token.next = nextToken;
              nextToken.prev = token;
              token = nextToken;
            }
          } while (token.kind === _tokenKind.TokenKind.COMMENT);
        }
        return token;
      }
    };
    exports2.Lexer = Lexer;
    function isPunctuatorTokenKind(kind) {
      return kind === _tokenKind.TokenKind.BANG || kind === _tokenKind.TokenKind.DOLLAR || kind === _tokenKind.TokenKind.AMP || kind === _tokenKind.TokenKind.PAREN_L || kind === _tokenKind.TokenKind.PAREN_R || kind === _tokenKind.TokenKind.DOT || kind === _tokenKind.TokenKind.SPREAD || kind === _tokenKind.TokenKind.COLON || kind === _tokenKind.TokenKind.EQUALS || kind === _tokenKind.TokenKind.AT || kind === _tokenKind.TokenKind.BRACKET_L || kind === _tokenKind.TokenKind.BRACKET_R || kind === _tokenKind.TokenKind.BRACE_L || kind === _tokenKind.TokenKind.PIPE || kind === _tokenKind.TokenKind.BRACE_R;
    }
    function isUnicodeScalarValue(code) {
      return code >= 0 && code <= 55295 || code >= 57344 && code <= 1114111;
    }
    function isSupplementaryCodePoint(body, location) {
      return isLeadingSurrogate(body.charCodeAt(location)) && isTrailingSurrogate(body.charCodeAt(location + 1));
    }
    function isLeadingSurrogate(code) {
      return code >= 55296 && code <= 56319;
    }
    function isTrailingSurrogate(code) {
      return code >= 56320 && code <= 57343;
    }
    function printCodePointAt(lexer, location) {
      const code = lexer.source.body.codePointAt(location);
      if (code === void 0) {
        return _tokenKind.TokenKind.EOF;
      } else if (code >= 32 && code <= 126) {
        const char = String.fromCodePoint(code);
        return char === '"' ? `'"'` : `"${char}"`;
      }
      return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
    }
    function createToken(lexer, kind, start, end, value) {
      const line = lexer.line;
      const col = 1 + start - lexer.lineStart;
      return new _ast.Token(kind, start, end, line, col, value);
    }
    function readNextToken(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let position = start;
      while (position < bodyLength) {
        const code = body.charCodeAt(position);
        switch (code) {
          // Ignored ::
          //   - UnicodeBOM
          //   - WhiteSpace
          //   - LineTerminator
          //   - Comment
          //   - Comma
          //
          // UnicodeBOM :: "Byte Order Mark (U+FEFF)"
          //
          // WhiteSpace ::
          //   - "Horizontal Tab (U+0009)"
          //   - "Space (U+0020)"
          //
          // Comma :: ,
          case 65279:
          // <BOM>
          case 9:
          // \t
          case 32:
          // <space>
          case 44:
            ++position;
            continue;
          // LineTerminator ::
          //   - "New Line (U+000A)"
          //   - "Carriage Return (U+000D)" [lookahead != "New Line (U+000A)"]
          //   - "Carriage Return (U+000D)" "New Line (U+000A)"
          case 10:
            ++position;
            ++lexer.line;
            lexer.lineStart = position;
            continue;
          case 13:
            if (body.charCodeAt(position + 1) === 10) {
              position += 2;
            } else {
              ++position;
            }
            ++lexer.line;
            lexer.lineStart = position;
            continue;
          // Comment
          case 35:
            return readComment(lexer, position);
          // Token ::
          //   - Punctuator
          //   - Name
          //   - IntValue
          //   - FloatValue
          //   - StringValue
          //
          // Punctuator :: one of ! $ & ( ) ... : = @ [ ] { | }
          case 33:
            return createToken(
              lexer,
              _tokenKind.TokenKind.BANG,
              position,
              position + 1
            );
          case 36:
            return createToken(
              lexer,
              _tokenKind.TokenKind.DOLLAR,
              position,
              position + 1
            );
          case 38:
            return createToken(
              lexer,
              _tokenKind.TokenKind.AMP,
              position,
              position + 1
            );
          case 40:
            return createToken(
              lexer,
              _tokenKind.TokenKind.PAREN_L,
              position,
              position + 1
            );
          case 41:
            return createToken(
              lexer,
              _tokenKind.TokenKind.PAREN_R,
              position,
              position + 1
            );
          case 46:
            if (body.charCodeAt(position + 1) === 46 && body.charCodeAt(position + 2) === 46) {
              return createToken(
                lexer,
                _tokenKind.TokenKind.SPREAD,
                position,
                position + 3
              );
            }
            break;
          case 58:
            return createToken(
              lexer,
              _tokenKind.TokenKind.COLON,
              position,
              position + 1
            );
          case 61:
            return createToken(
              lexer,
              _tokenKind.TokenKind.EQUALS,
              position,
              position + 1
            );
          case 64:
            return createToken(
              lexer,
              _tokenKind.TokenKind.AT,
              position,
              position + 1
            );
          case 91:
            return createToken(
              lexer,
              _tokenKind.TokenKind.BRACKET_L,
              position,
              position + 1
            );
          case 93:
            return createToken(
              lexer,
              _tokenKind.TokenKind.BRACKET_R,
              position,
              position + 1
            );
          case 123:
            return createToken(
              lexer,
              _tokenKind.TokenKind.BRACE_L,
              position,
              position + 1
            );
          case 124:
            return createToken(
              lexer,
              _tokenKind.TokenKind.PIPE,
              position,
              position + 1
            );
          case 125:
            return createToken(
              lexer,
              _tokenKind.TokenKind.BRACE_R,
              position,
              position + 1
            );
          // StringValue
          case 34:
            if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
              return readBlockString(lexer, position);
            }
            return readString(lexer, position);
        }
        if ((0, _characterClasses.isDigit)(code) || code === 45) {
          return readNumber(lexer, position, code);
        }
        if ((0, _characterClasses.isNameStart)(code)) {
          return readName(lexer, position);
        }
        throw (0, _syntaxError.syntaxError)(
          lexer.source,
          position,
          code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer, position)}.` : `Invalid character: ${printCodePointAt(lexer, position)}.`
        );
      }
      return createToken(lexer, _tokenKind.TokenKind.EOF, bodyLength, bodyLength);
    }
    function readComment(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let position = start + 1;
      while (position < bodyLength) {
        const code = body.charCodeAt(position);
        if (code === 10 || code === 13) {
          break;
        }
        if (isUnicodeScalarValue(code)) {
          ++position;
        } else if (isSupplementaryCodePoint(body, position)) {
          position += 2;
        } else {
          break;
        }
      }
      return createToken(
        lexer,
        _tokenKind.TokenKind.COMMENT,
        start,
        position,
        body.slice(start + 1, position)
      );
    }
    function readNumber(lexer, start, firstCode) {
      const body = lexer.source.body;
      let position = start;
      let code = firstCode;
      let isFloat2 = false;
      if (code === 45) {
        code = body.charCodeAt(++position);
      }
      if (code === 48) {
        code = body.charCodeAt(++position);
        if ((0, _characterClasses.isDigit)(code)) {
          throw (0, _syntaxError.syntaxError)(
            lexer.source,
            position,
            `Invalid number, unexpected digit after 0: ${printCodePointAt(
              lexer,
              position
            )}.`
          );
        }
      } else {
        position = readDigits(lexer, position, code);
        code = body.charCodeAt(position);
      }
      if (code === 46) {
        isFloat2 = true;
        code = body.charCodeAt(++position);
        position = readDigits(lexer, position, code);
        code = body.charCodeAt(position);
      }
      if (code === 69 || code === 101) {
        isFloat2 = true;
        code = body.charCodeAt(++position);
        if (code === 43 || code === 45) {
          code = body.charCodeAt(++position);
        }
        position = readDigits(lexer, position, code);
        code = body.charCodeAt(position);
      }
      if (code === 46 || (0, _characterClasses.isNameStart)(code)) {
        throw (0, _syntaxError.syntaxError)(
          lexer.source,
          position,
          `Invalid number, expected digit but got: ${printCodePointAt(
            lexer,
            position
          )}.`
        );
      }
      return createToken(
        lexer,
        isFloat2 ? _tokenKind.TokenKind.FLOAT : _tokenKind.TokenKind.INT,
        start,
        position,
        body.slice(start, position)
      );
    }
    function readDigits(lexer, start, firstCode) {
      if (!(0, _characterClasses.isDigit)(firstCode)) {
        throw (0, _syntaxError.syntaxError)(
          lexer.source,
          start,
          `Invalid number, expected digit but got: ${printCodePointAt(
            lexer,
            start
          )}.`
        );
      }
      const body = lexer.source.body;
      let position = start + 1;
      while ((0, _characterClasses.isDigit)(body.charCodeAt(position))) {
        ++position;
      }
      return position;
    }
    function readString(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let position = start + 1;
      let chunkStart = position;
      let value = "";
      while (position < bodyLength) {
        const code = body.charCodeAt(position);
        if (code === 34) {
          value += body.slice(chunkStart, position);
          return createToken(
            lexer,
            _tokenKind.TokenKind.STRING,
            start,
            position + 1,
            value
          );
        }
        if (code === 92) {
          value += body.slice(chunkStart, position);
          const escape = body.charCodeAt(position + 1) === 117 ? body.charCodeAt(position + 2) === 123 ? readEscapedUnicodeVariableWidth(lexer, position) : readEscapedUnicodeFixedWidth(lexer, position) : readEscapedCharacter(lexer, position);
          value += escape.value;
          position += escape.size;
          chunkStart = position;
          continue;
        }
        if (code === 10 || code === 13) {
          break;
        }
        if (isUnicodeScalarValue(code)) {
          ++position;
        } else if (isSupplementaryCodePoint(body, position)) {
          position += 2;
        } else {
          throw (0, _syntaxError.syntaxError)(
            lexer.source,
            position,
            `Invalid character within String: ${printCodePointAt(
              lexer,
              position
            )}.`
          );
        }
      }
      throw (0, _syntaxError.syntaxError)(
        lexer.source,
        position,
        "Unterminated string."
      );
    }
    function readEscapedUnicodeVariableWidth(lexer, position) {
      const body = lexer.source.body;
      let point = 0;
      let size = 3;
      while (size < 12) {
        const code = body.charCodeAt(position + size++);
        if (code === 125) {
          if (size < 5 || !isUnicodeScalarValue(point)) {
            break;
          }
          return {
            value: String.fromCodePoint(point),
            size
          };
        }
        point = point << 4 | readHexDigit(code);
        if (point < 0) {
          break;
        }
      }
      throw (0, _syntaxError.syntaxError)(
        lexer.source,
        position,
        `Invalid Unicode escape sequence: "${body.slice(
          position,
          position + size
        )}".`
      );
    }
    function readEscapedUnicodeFixedWidth(lexer, position) {
      const body = lexer.source.body;
      const code = read16BitHexCode(body, position + 2);
      if (isUnicodeScalarValue(code)) {
        return {
          value: String.fromCodePoint(code),
          size: 6
        };
      }
      if (isLeadingSurrogate(code)) {
        if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
          const trailingCode = read16BitHexCode(body, position + 8);
          if (isTrailingSurrogate(trailingCode)) {
            return {
              value: String.fromCodePoint(code, trailingCode),
              size: 12
            };
          }
        }
      }
      throw (0, _syntaxError.syntaxError)(
        lexer.source,
        position,
        `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`
      );
    }
    function read16BitHexCode(body, position) {
      return readHexDigit(body.charCodeAt(position)) << 12 | readHexDigit(body.charCodeAt(position + 1)) << 8 | readHexDigit(body.charCodeAt(position + 2)) << 4 | readHexDigit(body.charCodeAt(position + 3));
    }
    function readHexDigit(code) {
      return code >= 48 && code <= 57 ? code - 48 : code >= 65 && code <= 70 ? code - 55 : code >= 97 && code <= 102 ? code - 87 : -1;
    }
    function readEscapedCharacter(lexer, position) {
      const body = lexer.source.body;
      const code = body.charCodeAt(position + 1);
      switch (code) {
        case 34:
          return {
            value: '"',
            size: 2
          };
        case 92:
          return {
            value: "\\",
            size: 2
          };
        case 47:
          return {
            value: "/",
            size: 2
          };
        case 98:
          return {
            value: "\b",
            size: 2
          };
        case 102:
          return {
            value: "\f",
            size: 2
          };
        case 110:
          return {
            value: "\n",
            size: 2
          };
        case 114:
          return {
            value: "\r",
            size: 2
          };
        case 116:
          return {
            value: "	",
            size: 2
          };
      }
      throw (0, _syntaxError.syntaxError)(
        lexer.source,
        position,
        `Invalid character escape sequence: "${body.slice(
          position,
          position + 2
        )}".`
      );
    }
    function readBlockString(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let lineStart = lexer.lineStart;
      let position = start + 3;
      let chunkStart = position;
      let currentLine = "";
      const blockLines = [];
      while (position < bodyLength) {
        const code = body.charCodeAt(position);
        if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
          currentLine += body.slice(chunkStart, position);
          blockLines.push(currentLine);
          const token = createToken(
            lexer,
            _tokenKind.TokenKind.BLOCK_STRING,
            start,
            position + 3,
            // Return a string of the lines joined with U+000A.
            (0, _blockString.dedentBlockStringLines)(blockLines).join("\n")
          );
          lexer.line += blockLines.length - 1;
          lexer.lineStart = lineStart;
          return token;
        }
        if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
          currentLine += body.slice(chunkStart, position);
          chunkStart = position + 1;
          position += 4;
          continue;
        }
        if (code === 10 || code === 13) {
          currentLine += body.slice(chunkStart, position);
          blockLines.push(currentLine);
          if (code === 13 && body.charCodeAt(position + 1) === 10) {
            position += 2;
          } else {
            ++position;
          }
          currentLine = "";
          chunkStart = position;
          lineStart = position;
          continue;
        }
        if (isUnicodeScalarValue(code)) {
          ++position;
        } else if (isSupplementaryCodePoint(body, position)) {
          position += 2;
        } else {
          throw (0, _syntaxError.syntaxError)(
            lexer.source,
            position,
            `Invalid character within String: ${printCodePointAt(
              lexer,
              position
            )}.`
          );
        }
      }
      throw (0, _syntaxError.syntaxError)(
        lexer.source,
        position,
        "Unterminated string."
      );
    }
    function readName(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let position = start + 1;
      while (position < bodyLength) {
        const code = body.charCodeAt(position);
        if ((0, _characterClasses.isNameContinue)(code)) {
          ++position;
        } else {
          break;
        }
      }
      return createToken(
        lexer,
        _tokenKind.TokenKind.NAME,
        start,
        position,
        body.slice(start, position)
      );
    }
  }
});

// node_modules/graphql/language/schemaCoordinateLexer.js
var require_schemaCoordinateLexer = __commonJS({
  "node_modules/graphql/language/schemaCoordinateLexer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.SchemaCoordinateLexer = void 0;
    var _syntaxError = require_syntaxError();
    var _ast = require_ast();
    var _characterClasses = require_characterClasses();
    var _lexer = require_lexer();
    var _tokenKind = require_tokenKind();
    var SchemaCoordinateLexer = class {
      /** The previously focused non-ignored token. */
      /** The currently focused non-ignored token. */
      /**
       * The (1-indexed) line containing the current token.
       * Since a schema coordinate may not contain newline, this value is always 1.
       */
      line = 1;
      /**
       * The character offset at which the current line begins.
       * Since a schema coordinate may not contain newline, this value is always 0.
       */
      lineStart = 0;
      constructor(source) {
        const startOfFileToken = new _ast.Token(
          _tokenKind.TokenKind.SOF,
          0,
          0,
          0,
          0
        );
        this.source = source;
        this.lastToken = startOfFileToken;
        this.token = startOfFileToken;
      }
      get [Symbol.toStringTag]() {
        return "SchemaCoordinateLexer";
      }
      /**
       * Advances the token stream to the next non-ignored token.
       *
       * @internal
       */
      advance() {
        this.lastToken = this.token;
        const token = this.token = this.lookahead();
        return token;
      }
      /**
       * Looks ahead and returns the next non-ignored token, but does not change
       * the current Lexer token.
       *
       * @internal
       */
      lookahead() {
        let token = this.token;
        if (token.kind !== _tokenKind.TokenKind.EOF) {
          const nextToken = readNextToken(this, token.end);
          token.next = nextToken;
          nextToken.prev = token;
          token = nextToken;
        }
        return token;
      }
    };
    exports2.SchemaCoordinateLexer = SchemaCoordinateLexer;
    function readNextToken(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      const position = start;
      if (position < bodyLength) {
        const code = body.charCodeAt(position);
        switch (code) {
          case 46:
            return (0, _lexer.createToken)(
              lexer,
              _tokenKind.TokenKind.DOT,
              position,
              position + 1
            );
          case 40:
            return (0, _lexer.createToken)(
              lexer,
              _tokenKind.TokenKind.PAREN_L,
              position,
              position + 1
            );
          case 41:
            return (0, _lexer.createToken)(
              lexer,
              _tokenKind.TokenKind.PAREN_R,
              position,
              position + 1
            );
          case 58:
            return (0, _lexer.createToken)(
              lexer,
              _tokenKind.TokenKind.COLON,
              position,
              position + 1
            );
          case 64:
            return (0, _lexer.createToken)(
              lexer,
              _tokenKind.TokenKind.AT,
              position,
              position + 1
            );
        }
        if ((0, _characterClasses.isNameStart)(code)) {
          return (0, _lexer.readName)(lexer, position);
        }
        throw (0, _syntaxError.syntaxError)(
          lexer.source,
          position,
          `Invalid character: ${(0, _lexer.printCodePointAt)(lexer, position)}.`
        );
      }
      return (0, _lexer.createToken)(
        lexer,
        _tokenKind.TokenKind.EOF,
        bodyLength,
        bodyLength
      );
    }
  }
});

// node_modules/graphql/jsutils/inspect.js
var require_inspect = __commonJS({
  "node_modules/graphql/jsutils/inspect.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.inspect = inspect;
    var MAX_ARRAY_LENGTH = 10;
    var MAX_RECURSIVE_DEPTH = 2;
    function inspect(value) {
      return formatValue(value, []);
    }
    function formatValue(value, seenValues) {
      switch (typeof value) {
        case "string":
          return JSON.stringify(value);
        case "function":
          return value.name ? `[function ${value.name}]` : "[function]";
        case "object":
          return formatObjectValue(value, seenValues);
        default:
          return String(value);
      }
    }
    function formatObjectValue(value, previouslySeenValues) {
      if (value === null) {
        return "null";
      }
      if (previouslySeenValues.includes(value)) {
        return "[Circular]";
      }
      const seenValues = [...previouslySeenValues, value];
      if (isJSONable(value)) {
        const jsonValue = value.toJSON();
        if (jsonValue !== value) {
          return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
        }
      } else if (Array.isArray(value)) {
        return formatArray(value, seenValues);
      }
      return formatObject(value, seenValues);
    }
    function isJSONable(value) {
      return typeof value.toJSON === "function";
    }
    function formatObject(object, seenValues) {
      const entries = Object.entries(object);
      if (entries.length === 0) {
        return "{}";
      }
      if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return "[" + getObjectTag(object) + "]";
      }
      const properties = entries.map(
        ([key, value]) => key + ": " + formatValue(value, seenValues)
      );
      return "{ " + properties.join(", ") + " }";
    }
    function formatArray(array, seenValues) {
      if (array.length === 0) {
        return "[]";
      }
      if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return "[Array]";
      }
      const len = Math.min(MAX_ARRAY_LENGTH, array.length);
      const remaining = array.length - len;
      const items = [];
      for (let i = 0; i < len; ++i) {
        items.push(formatValue(array[i], seenValues));
      }
      if (remaining === 1) {
        items.push("... 1 more item");
      } else if (remaining > 1) {
        items.push(`... ${remaining} more items`);
      }
      return "[" + items.join(", ") + "]";
    }
    function getObjectTag(object) {
      const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
      if (tag === "Object" && typeof object.constructor === "function") {
        const name = object.constructor.name;
        if (typeof name === "string" && name !== "") {
          return name;
        }
      }
      return tag;
    }
  }
});

// node_modules/graphql/jsutils/instanceOf.js
var require_instanceOf = __commonJS({
  "node_modules/graphql/jsutils/instanceOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.instanceOf = void 0;
    var _inspect2 = require_inspect();
    var isProduction = globalThis.process && // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "production";
    var instanceOf = (
      /* c8 ignore next 6 */
      // FIXME: https://github.com/graphql/graphql-js/issues/2317
      isProduction ? function instanceOf2(value, constructor) {
        return value instanceof constructor;
      } : function instanceOf2(value, constructor) {
        if (value instanceof constructor) {
          return true;
        }
        if (typeof value === "object" && value !== null) {
          var _value$constructor;
          const className = constructor.prototype[Symbol.toStringTag];
          const valueClassName = (
            // We still need to support constructor's name to detect conflicts with older versions of this library.
            Symbol.toStringTag in value ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name
          );
          if (className === valueClassName) {
            const stringifiedValue = (0, _inspect2.inspect)(value);
            throw new Error(`Cannot use ${className} "${stringifiedValue}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
          }
        }
        return false;
      }
    );
    exports2.instanceOf = instanceOf;
  }
});

// node_modules/graphql/language/source.js
var require_source = __commonJS({
  "node_modules/graphql/language/source.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.Source = void 0;
    exports2.isSource = isSource;
    var _devAssert = require_devAssert();
    var _inspect2 = require_inspect();
    var _instanceOf = require_instanceOf();
    var Source = class {
      /** The GraphQL source text. */
      /** Name used in diagnostics for this source, such as a file path or request name. */
      /** One-indexed line and column where this source begins. */
      /**
       * Creates a Source instance.
       * @param body - The GraphQL source text.
       * @param name - Name used in diagnostics for this source.
       * @param locationOffset - One-indexed line and column where this source begins.
       * @example
       * ```ts
       * import { Source } from 'graphql/language';
       *
       * const source = new Source(
       *   'type Query { greeting: String }',
       *   'schema.graphql',
       *   { line: 10, column: 1 },
       * );
       *
       * source.body; // => 'type Query { greeting: String }'
       * source.name; // => 'schema.graphql'
       * source.locationOffset; // => { line: 10, column: 1 }
       * ```
       */
      constructor(body, name = "GraphQL request", locationOffset = {
        line: 1,
        column: 1
      }) {
        typeof body === "string" || (0, _devAssert.devAssert)(
          false,
          `Body must be a string. Received: ${(0, _inspect2.inspect)(body)}.`
        );
        this.body = body;
        this.name = name;
        this.locationOffset = locationOffset;
        this.locationOffset.line > 0 || (0, _devAssert.devAssert)(
          false,
          "line in locationOffset is 1-indexed and must be positive."
        );
        this.locationOffset.column > 0 || (0, _devAssert.devAssert)(
          false,
          "column in locationOffset is 1-indexed and must be positive."
        );
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "Source";
      }
    };
    exports2.Source = Source;
    function isSource(source) {
      return (0, _instanceOf.instanceOf)(source, Source);
    }
  }
});

// node_modules/graphql/language/parser.js
var require_parser2 = __commonJS({
  "node_modules/graphql/language/parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.Parser = void 0;
    exports2.parse = parse2;
    exports2.parseConstValue = parseConstValue;
    exports2.parseSchemaCoordinate = parseSchemaCoordinate;
    exports2.parseType = parseType;
    exports2.parseValue = parseValue;
    var _syntaxError = require_syntaxError();
    var _ast = require_ast();
    var _directiveLocation = require_directiveLocation();
    var _kinds = require_kinds();
    var _lexer = require_lexer();
    var _schemaCoordinateLexer = require_schemaCoordinateLexer();
    var _source = require_source();
    var _tokenKind = require_tokenKind();
    function parse2(source, options) {
      const parser = new Parser(source, options);
      const document = parser.parseDocument();
      Object.defineProperty(document, "tokenCount", {
        enumerable: false,
        value: parser.tokenCount
      });
      return document;
    }
    function parseValue(source, options) {
      const parser = new Parser(source, options);
      parser.expectToken(_tokenKind.TokenKind.SOF);
      const value = parser.parseValueLiteral(false);
      parser.expectToken(_tokenKind.TokenKind.EOF);
      return value;
    }
    function parseConstValue(source, options) {
      const parser = new Parser(source, options);
      parser.expectToken(_tokenKind.TokenKind.SOF);
      const value = parser.parseConstValueLiteral();
      parser.expectToken(_tokenKind.TokenKind.EOF);
      return value;
    }
    function parseType(source, options) {
      const parser = new Parser(source, options);
      parser.expectToken(_tokenKind.TokenKind.SOF);
      const type = parser.parseTypeReference();
      parser.expectToken(_tokenKind.TokenKind.EOF);
      return type;
    }
    function parseSchemaCoordinate(source) {
      const sourceObj = (0, _source.isSource)(source) ? source : new _source.Source(source);
      const lexer = new _schemaCoordinateLexer.SchemaCoordinateLexer(sourceObj);
      const parser = new Parser(source, {
        lexer
      });
      parser.expectToken(_tokenKind.TokenKind.SOF);
      const coordinate = parser.parseSchemaCoordinate();
      parser.expectToken(_tokenKind.TokenKind.EOF);
      return coordinate;
    }
    var Parser = class {
      constructor(source, options = {}) {
        const { lexer, ..._options } = options;
        if (lexer) {
          this._lexer = lexer;
        } else {
          const sourceObj = (0, _source.isSource)(source) ? source : new _source.Source(source);
          this._lexer = new _lexer.Lexer(sourceObj);
        }
        this._options = _options;
        this._tokenCounter = 0;
      }
      get tokenCount() {
        return this._tokenCounter;
      }
      /**
       * Converts a name lex token into a name parse node.
       *
       * @internal
       */
      parseName() {
        const token = this.expectToken(_tokenKind.TokenKind.NAME);
        return this.node(token, {
          kind: _kinds.Kind.NAME,
          value: token.value
        });
      }
      // Implements the parsing rules in the Document section.
      /**
       * Document : Definition+
       *
       * @internal
       */
      parseDocument() {
        return this.node(this._lexer.token, {
          kind: _kinds.Kind.DOCUMENT,
          definitions: this.many(
            _tokenKind.TokenKind.SOF,
            this.parseDefinition,
            _tokenKind.TokenKind.EOF
          )
        });
      }
      /**
       * Definition :
       *   - ExecutableDefinition
       *   - TypeSystemDefinition
       *   - TypeSystemExtension
       *
       * ExecutableDefinition :
       *   - OperationDefinition
       *   - FragmentDefinition
       *
       * TypeSystemDefinition :
       *   - SchemaDefinition
       *   - TypeDefinition
       *   - DirectiveDefinition
       *
       * TypeDefinition :
       *   - ScalarTypeDefinition
       *   - ObjectTypeDefinition
       *   - InterfaceTypeDefinition
       *   - UnionTypeDefinition
       *   - EnumTypeDefinition
       *   - InputObjectTypeDefinition
       *
       * @internal
       */
      parseDefinition() {
        if (this.peek(_tokenKind.TokenKind.BRACE_L)) {
          return this.parseOperationDefinition();
        }
        const hasDescription = this.peekDescription();
        const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
        if (hasDescription && keywordToken.kind === _tokenKind.TokenKind.BRACE_L) {
          throw (0, _syntaxError.syntaxError)(
            this._lexer.source,
            this._lexer.token.start,
            "Unexpected description, descriptions are not supported on shorthand queries."
          );
        }
        if (keywordToken.kind === _tokenKind.TokenKind.NAME) {
          switch (keywordToken.value) {
            case "schema":
              return this.parseSchemaDefinition();
            case "scalar":
              return this.parseScalarTypeDefinition();
            case "type":
              return this.parseObjectTypeDefinition();
            case "interface":
              return this.parseInterfaceTypeDefinition();
            case "union":
              return this.parseUnionTypeDefinition();
            case "enum":
              return this.parseEnumTypeDefinition();
            case "input":
              return this.parseInputObjectTypeDefinition();
            case "directive":
              return this.parseDirectiveDefinition();
          }
          switch (keywordToken.value) {
            case "query":
            case "mutation":
            case "subscription":
              return this.parseOperationDefinition();
            case "fragment":
              return this.parseFragmentDefinition();
          }
          if (hasDescription) {
            throw (0, _syntaxError.syntaxError)(
              this._lexer.source,
              this._lexer.token.start,
              "Unexpected description, only GraphQL definitions support descriptions."
            );
          }
          switch (keywordToken.value) {
            case "extend":
              return this.parseTypeSystemExtension();
          }
        }
        throw this.unexpected(keywordToken);
      }
      // Implements the parsing rules in the Operations section.
      /**
       * OperationDefinition :
       *  - SelectionSet
       *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
       *
       * @internal
       */
      parseOperationDefinition() {
        const start = this._lexer.token;
        if (this.peek(_tokenKind.TokenKind.BRACE_L)) {
          return this.node(start, {
            kind: _kinds.Kind.OPERATION_DEFINITION,
            operation: _ast.OperationTypeNode.QUERY,
            description: void 0,
            name: void 0,
            variableDefinitions: [],
            directives: [],
            selectionSet: this.parseSelectionSet()
          });
        }
        const description = this.parseDescription();
        const operation = this.parseOperationType();
        let name;
        if (this.peek(_tokenKind.TokenKind.NAME)) {
          name = this.parseName();
        }
        return this.node(start, {
          kind: _kinds.Kind.OPERATION_DEFINITION,
          operation,
          description,
          name,
          variableDefinitions: this.parseVariableDefinitions(),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet()
        });
      }
      /**
       * OperationType : one of query mutation subscription
       *
       * @internal
       */
      parseOperationType() {
        const operationToken = this.expectToken(_tokenKind.TokenKind.NAME);
        switch (operationToken.value) {
          case "query":
            return _ast.OperationTypeNode.QUERY;
          case "mutation":
            return _ast.OperationTypeNode.MUTATION;
          case "subscription":
            return _ast.OperationTypeNode.SUBSCRIPTION;
        }
        throw this.unexpected(operationToken);
      }
      /**
       * VariableDefinitions : ( VariableDefinition+ )
       *
       * @internal
       */
      parseVariableDefinitions() {
        return this.optionalMany(
          _tokenKind.TokenKind.PAREN_L,
          this.parseVariableDefinition,
          _tokenKind.TokenKind.PAREN_R
        );
      }
      /**
       * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
       *
       * @internal
       */
      parseVariableDefinition() {
        return this.node(this._lexer.token, {
          kind: _kinds.Kind.VARIABLE_DEFINITION,
          description: this.parseDescription(),
          variable: this.parseVariable(),
          type: (this.expectToken(_tokenKind.TokenKind.COLON), this.parseTypeReference()),
          defaultValue: this.expectOptionalToken(_tokenKind.TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
          directives: this.parseConstDirectives()
        });
      }
      /**
       * Variable : $ Name
       *
       * @internal
       */
      parseVariable() {
        const start = this._lexer.token;
        this.expectToken(_tokenKind.TokenKind.DOLLAR);
        return this.node(start, {
          kind: _kinds.Kind.VARIABLE,
          name: this.parseName()
        });
      }
      /**
       * ```
       * SelectionSet : { Selection+ }
       * ```
       *
       * @internal
       */
      parseSelectionSet() {
        return this.node(this._lexer.token, {
          kind: _kinds.Kind.SELECTION_SET,
          selections: this.many(
            _tokenKind.TokenKind.BRACE_L,
            this.parseSelection,
            _tokenKind.TokenKind.BRACE_R
          )
        });
      }
      /**
       * Selection :
       *   - Field
       *   - FragmentSpread
       *   - InlineFragment
       *
       * @internal
       */
      parseSelection() {
        return this.peek(_tokenKind.TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
      }
      /**
       * Field : Alias? Name Arguments? Directives? SelectionSet?
       *
       * Alias : Name :
       *
       * @internal
       */
      parseField() {
        const start = this._lexer.token;
        const nameOrAlias = this.parseName();
        let alias;
        let name;
        if (this.expectOptionalToken(_tokenKind.TokenKind.COLON)) {
          alias = nameOrAlias;
          name = this.parseName();
        } else {
          name = nameOrAlias;
        }
        return this.node(start, {
          kind: _kinds.Kind.FIELD,
          alias,
          name,
          arguments: this.parseArguments(false),
          directives: this.parseDirectives(false),
          selectionSet: this.peek(_tokenKind.TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
        });
      }
      /**
       * Arguments[Const] : ( Argument[?Const]+ )
       *
       * @internal
       */
      parseArguments(isConst) {
        const item = isConst ? this.parseConstArgument : this.parseArgument;
        return this.optionalMany(
          _tokenKind.TokenKind.PAREN_L,
          item,
          _tokenKind.TokenKind.PAREN_R
        );
      }
      /**
       * Argument[Const] : Name : Value[?Const]
       *
       * @internal
       */
      parseArgument(isConst = false) {
        const start = this._lexer.token;
        const name = this.parseName();
        this.expectToken(_tokenKind.TokenKind.COLON);
        return this.node(start, {
          kind: _kinds.Kind.ARGUMENT,
          name,
          value: this.parseValueLiteral(isConst)
        });
      }
      parseConstArgument() {
        return this.parseArgument(true);
      }
      // Implements the parsing rules in the Fragments section.
      /**
       * Corresponds to both FragmentSpread and InlineFragment in the spec.
       *
       * FragmentSpread : ... FragmentName Directives?
       *
       * InlineFragment : ... TypeCondition? Directives? SelectionSet
       *
       * @internal
       */
      parseFragment() {
        const start = this._lexer.token;
        this.expectToken(_tokenKind.TokenKind.SPREAD);
        const hasTypeCondition = this.expectOptionalKeyword("on");
        if (!hasTypeCondition && this.peek(_tokenKind.TokenKind.NAME)) {
          return this.node(start, {
            kind: _kinds.Kind.FRAGMENT_SPREAD,
            name: this.parseFragmentName(),
            directives: this.parseDirectives(false)
          });
        }
        return this.node(start, {
          kind: _kinds.Kind.INLINE_FRAGMENT,
          typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet()
        });
      }
      /**
       * FragmentDefinition :
       *   - fragment FragmentName on TypeCondition Directives? SelectionSet
       *
       * TypeCondition : NamedType
       *
       * @internal
       */
      parseFragmentDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("fragment");
        if (this._options.allowLegacyFragmentVariables === true) {
          return this.node(start, {
            kind: _kinds.Kind.FRAGMENT_DEFINITION,
            description,
            name: this.parseFragmentName(),
            variableDefinitions: this.parseVariableDefinitions(),
            typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
            directives: this.parseDirectives(false),
            selectionSet: this.parseSelectionSet()
          });
        }
        return this.node(start, {
          kind: _kinds.Kind.FRAGMENT_DEFINITION,
          description,
          name: this.parseFragmentName(),
          typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet()
        });
      }
      /**
       * FragmentName : Name but not `on`
       *
       * @internal
       */
      parseFragmentName() {
        if (this._lexer.token.value === "on") {
          throw this.unexpected();
        }
        return this.parseName();
      }
      // Implements the parsing rules in the Values section.
      /**
       * Value[Const] :
       *   - [~Const] Variable
       *   - IntValue
       *   - FloatValue
       *   - StringValue
       *   - BooleanValue
       *   - NullValue
       *   - EnumValue
       *   - ListValue[?Const]
       *   - ObjectValue[?Const]
       *
       * BooleanValue : one of `true` `false`
       *
       * NullValue : `null`
       *
       * EnumValue : Name but not `true`, `false` or `null`
       *
       * @internal
       */
      parseValueLiteral(isConst) {
        const token = this._lexer.token;
        switch (token.kind) {
          case _tokenKind.TokenKind.BRACKET_L:
            return this.parseList(isConst);
          case _tokenKind.TokenKind.BRACE_L:
            return this.parseObject(isConst);
          case _tokenKind.TokenKind.INT:
            this.advanceLexer();
            return this.node(token, {
              kind: _kinds.Kind.INT,
              value: token.value
            });
          case _tokenKind.TokenKind.FLOAT:
            this.advanceLexer();
            return this.node(token, {
              kind: _kinds.Kind.FLOAT,
              value: token.value
            });
          case _tokenKind.TokenKind.STRING:
          case _tokenKind.TokenKind.BLOCK_STRING:
            return this.parseStringLiteral();
          case _tokenKind.TokenKind.NAME:
            this.advanceLexer();
            switch (token.value) {
              case "true":
                return this.node(token, {
                  kind: _kinds.Kind.BOOLEAN,
                  value: true
                });
              case "false":
                return this.node(token, {
                  kind: _kinds.Kind.BOOLEAN,
                  value: false
                });
              case "null":
                return this.node(token, {
                  kind: _kinds.Kind.NULL
                });
              default:
                return this.node(token, {
                  kind: _kinds.Kind.ENUM,
                  value: token.value
                });
            }
          case _tokenKind.TokenKind.DOLLAR:
            if (isConst) {
              this.expectToken(_tokenKind.TokenKind.DOLLAR);
              if (this._lexer.token.kind === _tokenKind.TokenKind.NAME) {
                const varName = this._lexer.token.value;
                throw (0, _syntaxError.syntaxError)(
                  this._lexer.source,
                  token.start,
                  `Unexpected variable "$${varName}" in constant value.`
                );
              } else {
                throw this.unexpected(token);
              }
            }
            return this.parseVariable();
          default:
            throw this.unexpected();
        }
      }
      parseConstValueLiteral() {
        return this.parseValueLiteral(true);
      }
      parseStringLiteral() {
        const token = this._lexer.token;
        this.advanceLexer();
        return this.node(token, {
          kind: _kinds.Kind.STRING,
          value: token.value,
          block: token.kind === _tokenKind.TokenKind.BLOCK_STRING
        });
      }
      /**
       * ListValue[Const] :
       *   - [ ]
       *   - [ Value[?Const]+ ]
       *
       * @internal
       */
      parseList(isConst) {
        const item = () => this.parseValueLiteral(isConst);
        return this.node(this._lexer.token, {
          kind: _kinds.Kind.LIST,
          values: this.any(
            _tokenKind.TokenKind.BRACKET_L,
            item,
            _tokenKind.TokenKind.BRACKET_R
          )
        });
      }
      /**
       * ```
       * ObjectValue[Const] :
       *   - { }
       *   - { ObjectField[?Const]+ }
       * ```
       *
       * @internal
       */
      parseObject(isConst) {
        const item = () => this.parseObjectField(isConst);
        return this.node(this._lexer.token, {
          kind: _kinds.Kind.OBJECT,
          fields: this.any(
            _tokenKind.TokenKind.BRACE_L,
            item,
            _tokenKind.TokenKind.BRACE_R
          )
        });
      }
      /**
       * ObjectField[Const] : Name : Value[?Const]
       *
       * @internal
       */
      parseObjectField(isConst) {
        const start = this._lexer.token;
        const name = this.parseName();
        this.expectToken(_tokenKind.TokenKind.COLON);
        return this.node(start, {
          kind: _kinds.Kind.OBJECT_FIELD,
          name,
          value: this.parseValueLiteral(isConst)
        });
      }
      // Implements the parsing rules in the Directives section.
      /**
       * Directives[Const] : Directive[?Const]+
       *
       * @internal
       */
      parseDirectives(isConst) {
        const directives = [];
        while (this.peek(_tokenKind.TokenKind.AT)) {
          directives.push(this.parseDirective(isConst));
        }
        return directives;
      }
      parseConstDirectives() {
        return this.parseDirectives(true);
      }
      /**
       * ```
       * Directive[Const] : @ Name Arguments[?Const]?
       * ```
       *
       * @internal
       */
      parseDirective(isConst) {
        const start = this._lexer.token;
        this.expectToken(_tokenKind.TokenKind.AT);
        return this.node(start, {
          kind: _kinds.Kind.DIRECTIVE,
          name: this.parseName(),
          arguments: this.parseArguments(isConst)
        });
      }
      // Implements the parsing rules in the Types section.
      /**
       * Type :
       *   - NamedType
       *   - ListType
       *   - NonNullType
       *
       * @internal
       */
      parseTypeReference() {
        const start = this._lexer.token;
        let type;
        if (this.expectOptionalToken(_tokenKind.TokenKind.BRACKET_L)) {
          const innerType = this.parseTypeReference();
          this.expectToken(_tokenKind.TokenKind.BRACKET_R);
          type = this.node(start, {
            kind: _kinds.Kind.LIST_TYPE,
            type: innerType
          });
        } else {
          type = this.parseNamedType();
        }
        if (this.expectOptionalToken(_tokenKind.TokenKind.BANG)) {
          return this.node(start, {
            kind: _kinds.Kind.NON_NULL_TYPE,
            type
          });
        }
        return type;
      }
      /**
       * NamedType : Name
       *
       * @internal
       */
      parseNamedType() {
        return this.node(this._lexer.token, {
          kind: _kinds.Kind.NAMED_TYPE,
          name: this.parseName()
        });
      }
      // Implements the parsing rules in the Type Definition section.
      peekDescription() {
        return this.peek(_tokenKind.TokenKind.STRING) || this.peek(_tokenKind.TokenKind.BLOCK_STRING);
      }
      /**
       * Description : StringValue
       *
       * @internal
       */
      parseDescription() {
        if (this.peekDescription()) {
          return this.parseStringLiteral();
        }
      }
      /**
       * ```
       * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
       * ```
       *
       * @internal
       */
      parseSchemaDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("schema");
        const directives = this.parseConstDirectives();
        const operationTypes = this.many(
          _tokenKind.TokenKind.BRACE_L,
          this.parseOperationTypeDefinition,
          _tokenKind.TokenKind.BRACE_R
        );
        return this.node(start, {
          kind: _kinds.Kind.SCHEMA_DEFINITION,
          description,
          directives,
          operationTypes
        });
      }
      /**
       * OperationTypeDefinition : OperationType : NamedType
       *
       * @internal
       */
      parseOperationTypeDefinition() {
        const start = this._lexer.token;
        const operation = this.parseOperationType();
        this.expectToken(_tokenKind.TokenKind.COLON);
        const type = this.parseNamedType();
        return this.node(start, {
          kind: _kinds.Kind.OPERATION_TYPE_DEFINITION,
          operation,
          type
        });
      }
      /**
       * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
       *
       * @internal
       */
      parseScalarTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("scalar");
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        return this.node(start, {
          kind: _kinds.Kind.SCALAR_TYPE_DEFINITION,
          description,
          name,
          directives
        });
      }
      /**
       * ObjectTypeDefinition :
       *   Description?
       *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
       *
       * @internal
       */
      parseObjectTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("type");
        const name = this.parseName();
        const interfaces = this.parseImplementsInterfaces();
        const directives = this.parseConstDirectives();
        const fields = this.parseFieldsDefinition();
        return this.node(start, {
          kind: _kinds.Kind.OBJECT_TYPE_DEFINITION,
          description,
          name,
          interfaces,
          directives,
          fields
        });
      }
      /**
       * ImplementsInterfaces :
       *   - implements `&`? NamedType
       *   - ImplementsInterfaces & NamedType
       *
       * @internal
       */
      parseImplementsInterfaces() {
        return this.expectOptionalKeyword("implements") ? this.delimitedMany(_tokenKind.TokenKind.AMP, this.parseNamedType) : [];
      }
      /**
       * ```
       * FieldsDefinition : { FieldDefinition+ }
       * ```
       *
       * @internal
       */
      parseFieldsDefinition() {
        return this.optionalMany(
          _tokenKind.TokenKind.BRACE_L,
          this.parseFieldDefinition,
          _tokenKind.TokenKind.BRACE_R
        );
      }
      /**
       * FieldDefinition :
       *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
       *
       * @internal
       */
      parseFieldDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        const name = this.parseName();
        const args = this.parseArgumentDefs();
        this.expectToken(_tokenKind.TokenKind.COLON);
        const type = this.parseTypeReference();
        const directives = this.parseConstDirectives();
        return this.node(start, {
          kind: _kinds.Kind.FIELD_DEFINITION,
          description,
          name,
          arguments: args,
          type,
          directives
        });
      }
      /**
       * ArgumentsDefinition : ( InputValueDefinition+ )
       *
       * @internal
       */
      parseArgumentDefs() {
        return this.optionalMany(
          _tokenKind.TokenKind.PAREN_L,
          this.parseInputValueDef,
          _tokenKind.TokenKind.PAREN_R
        );
      }
      /**
       * InputValueDefinition :
       *   - Description? Name : Type DefaultValue? Directives[Const]?
       *
       * @internal
       */
      parseInputValueDef() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        const name = this.parseName();
        this.expectToken(_tokenKind.TokenKind.COLON);
        const type = this.parseTypeReference();
        let defaultValue;
        if (this.expectOptionalToken(_tokenKind.TokenKind.EQUALS)) {
          defaultValue = this.parseConstValueLiteral();
        }
        const directives = this.parseConstDirectives();
        return this.node(start, {
          kind: _kinds.Kind.INPUT_VALUE_DEFINITION,
          description,
          name,
          type,
          defaultValue,
          directives
        });
      }
      /**
       * InterfaceTypeDefinition :
       *   - Description? interface Name Directives[Const]? FieldsDefinition?
       *
       * @internal
       */
      parseInterfaceTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("interface");
        const name = this.parseName();
        const interfaces = this.parseImplementsInterfaces();
        const directives = this.parseConstDirectives();
        const fields = this.parseFieldsDefinition();
        return this.node(start, {
          kind: _kinds.Kind.INTERFACE_TYPE_DEFINITION,
          description,
          name,
          interfaces,
          directives,
          fields
        });
      }
      /**
       * UnionTypeDefinition :
       *   - Description? union Name Directives[Const]? UnionMemberTypes?
       *
       * @internal
       */
      parseUnionTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("union");
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const types = this.parseUnionMemberTypes();
        return this.node(start, {
          kind: _kinds.Kind.UNION_TYPE_DEFINITION,
          description,
          name,
          directives,
          types
        });
      }
      /**
       * UnionMemberTypes :
       *   - = `|`? NamedType
       *   - UnionMemberTypes | NamedType
       *
       * @internal
       */
      parseUnionMemberTypes() {
        return this.expectOptionalToken(_tokenKind.TokenKind.EQUALS) ? this.delimitedMany(_tokenKind.TokenKind.PIPE, this.parseNamedType) : [];
      }
      /**
       * EnumTypeDefinition :
       *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
       *
       * @internal
       */
      parseEnumTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("enum");
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const values = this.parseEnumValuesDefinition();
        return this.node(start, {
          kind: _kinds.Kind.ENUM_TYPE_DEFINITION,
          description,
          name,
          directives,
          values
        });
      }
      /**
       * ```
       * EnumValuesDefinition : { EnumValueDefinition+ }
       * ```
       *
       * @internal
       */
      parseEnumValuesDefinition() {
        return this.optionalMany(
          _tokenKind.TokenKind.BRACE_L,
          this.parseEnumValueDefinition,
          _tokenKind.TokenKind.BRACE_R
        );
      }
      /**
       * EnumValueDefinition : Description? EnumValue Directives[Const]?
       *
       * @internal
       */
      parseEnumValueDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        const name = this.parseEnumValueName();
        const directives = this.parseConstDirectives();
        return this.node(start, {
          kind: _kinds.Kind.ENUM_VALUE_DEFINITION,
          description,
          name,
          directives
        });
      }
      /**
       * EnumValue : Name but not `true`, `false` or `null`
       *
       * @internal
       */
      parseEnumValueName() {
        if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
          throw (0, _syntaxError.syntaxError)(
            this._lexer.source,
            this._lexer.token.start,
            `${getTokenDesc(
              this._lexer.token
            )} is reserved and cannot be used for an enum value.`
          );
        }
        return this.parseName();
      }
      /**
       * InputObjectTypeDefinition :
       *   - Description? input Name Directives[Const]? InputFieldsDefinition?
       *
       * @internal
       */
      parseInputObjectTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("input");
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const fields = this.parseInputFieldsDefinition();
        return this.node(start, {
          kind: _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION,
          description,
          name,
          directives,
          fields
        });
      }
      /**
       * ```
       * InputFieldsDefinition : { InputValueDefinition+ }
       * ```
       *
       * @internal
       */
      parseInputFieldsDefinition() {
        return this.optionalMany(
          _tokenKind.TokenKind.BRACE_L,
          this.parseInputValueDef,
          _tokenKind.TokenKind.BRACE_R
        );
      }
      /**
       * TypeSystemExtension :
       *   - SchemaExtension
       *   - TypeExtension
       *
       * TypeExtension :
       *   - ScalarTypeExtension
       *   - ObjectTypeExtension
       *   - InterfaceTypeExtension
       *   - UnionTypeExtension
       *   - EnumTypeExtension
       *   - InputObjectTypeDefinition
       *   - DirectiveDefinitionExtension
       *
       * @internal
       */
      parseTypeSystemExtension() {
        const keywordToken = this._lexer.lookahead();
        if (keywordToken.kind === _tokenKind.TokenKind.NAME) {
          switch (keywordToken.value) {
            case "schema":
              return this.parseSchemaExtension();
            case "scalar":
              return this.parseScalarTypeExtension();
            case "type":
              return this.parseObjectTypeExtension();
            case "interface":
              return this.parseInterfaceTypeExtension();
            case "union":
              return this.parseUnionTypeExtension();
            case "enum":
              return this.parseEnumTypeExtension();
            case "input":
              return this.parseInputObjectTypeExtension();
            case "directive":
              if (this._options.experimentalDirectivesOnDirectiveDefinitions) {
                return this.parseDirectiveDefinitionExtension();
              }
              break;
          }
        }
        throw this.unexpected(keywordToken);
      }
      /**
       * ```
       * SchemaExtension :
       *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
       *  - extend schema Directives[Const]
       * ```
       *
       * @internal
       */
      parseSchemaExtension() {
        const start = this._lexer.token;
        this.expectKeyword("extend");
        this.expectKeyword("schema");
        const directives = this.parseConstDirectives();
        const operationTypes = this.optionalMany(
          _tokenKind.TokenKind.BRACE_L,
          this.parseOperationTypeDefinition,
          _tokenKind.TokenKind.BRACE_R
        );
        if (directives.length === 0 && operationTypes.length === 0) {
          throw this.unexpected();
        }
        return this.node(start, {
          kind: _kinds.Kind.SCHEMA_EXTENSION,
          directives,
          operationTypes
        });
      }
      /**
       * ScalarTypeExtension :
       *   - extend scalar Name Directives[Const]
       *
       * @internal
       */
      parseScalarTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword("extend");
        this.expectKeyword("scalar");
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        if (directives.length === 0) {
          throw this.unexpected();
        }
        return this.node(start, {
          kind: _kinds.Kind.SCALAR_TYPE_EXTENSION,
          name,
          directives
        });
      }
      /**
       * ObjectTypeExtension :
       *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
       *  - extend type Name ImplementsInterfaces? Directives[Const]
       *  - extend type Name ImplementsInterfaces
       *
       * @internal
       */
      parseObjectTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword("extend");
        this.expectKeyword("type");
        const name = this.parseName();
        const interfaces = this.parseImplementsInterfaces();
        const directives = this.parseConstDirectives();
        const fields = this.parseFieldsDefinition();
        if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
          throw this.unexpected();
        }
        return this.node(start, {
          kind: _kinds.Kind.OBJECT_TYPE_EXTENSION,
          name,
          interfaces,
          directives,
          fields
        });
      }
      /**
       * InterfaceTypeExtension :
       *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
       *  - extend interface Name ImplementsInterfaces? Directives[Const]
       *  - extend interface Name ImplementsInterfaces
       *
       * @internal
       */
      parseInterfaceTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword("extend");
        this.expectKeyword("interface");
        const name = this.parseName();
        const interfaces = this.parseImplementsInterfaces();
        const directives = this.parseConstDirectives();
        const fields = this.parseFieldsDefinition();
        if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
          throw this.unexpected();
        }
        return this.node(start, {
          kind: _kinds.Kind.INTERFACE_TYPE_EXTENSION,
          name,
          interfaces,
          directives,
          fields
        });
      }
      /**
       * UnionTypeExtension :
       *   - extend union Name Directives[Const]? UnionMemberTypes
       *   - extend union Name Directives[Const]
       *
       * @internal
       */
      parseUnionTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword("extend");
        this.expectKeyword("union");
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const types = this.parseUnionMemberTypes();
        if (directives.length === 0 && types.length === 0) {
          throw this.unexpected();
        }
        return this.node(start, {
          kind: _kinds.Kind.UNION_TYPE_EXTENSION,
          name,
          directives,
          types
        });
      }
      /**
       * EnumTypeExtension :
       *   - extend enum Name Directives[Const]? EnumValuesDefinition
       *   - extend enum Name Directives[Const]
       *
       * @internal
       */
      parseEnumTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword("extend");
        this.expectKeyword("enum");
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const values = this.parseEnumValuesDefinition();
        if (directives.length === 0 && values.length === 0) {
          throw this.unexpected();
        }
        return this.node(start, {
          kind: _kinds.Kind.ENUM_TYPE_EXTENSION,
          name,
          directives,
          values
        });
      }
      /**
       * InputObjectTypeExtension :
       *   - extend input Name Directives[Const]? InputFieldsDefinition
       *   - extend input Name Directives[Const]
       *
       * @internal
       */
      parseInputObjectTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword("extend");
        this.expectKeyword("input");
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const fields = this.parseInputFieldsDefinition();
        if (directives.length === 0 && fields.length === 0) {
          throw this.unexpected();
        }
        return this.node(start, {
          kind: _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION,
          name,
          directives,
          fields
        });
      }
      parseDirectiveDefinitionExtension() {
        const start = this._lexer.token;
        this.expectKeyword("extend");
        this.expectKeyword("directive");
        this.expectToken(_tokenKind.TokenKind.AT);
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        if (directives.length === 0) {
          throw this.unexpected();
        }
        return this.node(start, {
          kind: _kinds.Kind.DIRECTIVE_EXTENSION,
          name,
          directives
        });
      }
      /**
       * ```
       * DirectiveDefinition :
       *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
       * ```
       *
       * @internal
       */
      parseDirectiveDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword("directive");
        this.expectToken(_tokenKind.TokenKind.AT);
        const name = this.parseName();
        const args = this.parseArgumentDefs();
        const directives = this._options.experimentalDirectivesOnDirectiveDefinitions ? this.parseConstDirectives() : [];
        const repeatable = this.expectOptionalKeyword("repeatable");
        this.expectKeyword("on");
        const locations = this.parseDirectiveLocations();
        return this.node(start, {
          kind: _kinds.Kind.DIRECTIVE_DEFINITION,
          description,
          name,
          arguments: args,
          directives,
          repeatable,
          locations
        });
      }
      /**
       * DirectiveLocations :
       *   - `|`? DirectiveLocation
       *   - DirectiveLocations | DirectiveLocation
       *
       * @internal
       */
      parseDirectiveLocations() {
        return this.delimitedMany(
          _tokenKind.TokenKind.PIPE,
          this.parseDirectiveLocation
        );
      }
      /*
       * DirectiveLocation :
       *   - ExecutableDirectiveLocation
       *   - TypeSystemDirectiveLocation
       *
       * ExecutableDirectiveLocation : one of
       *   `QUERY`
       *   `MUTATION`
       *   `SUBSCRIPTION`
       *   `FIELD`
       *   `FRAGMENT_DEFINITION`
       *   `FRAGMENT_SPREAD`
       *   `INLINE_FRAGMENT`
       *
       * TypeSystemDirectiveLocation : one of
       *   `SCHEMA`
       *   `SCALAR`
       *   `OBJECT`
       *   `FIELD_DEFINITION`
       *   `ARGUMENT_DEFINITION`
       *   `INTERFACE`
       *   `UNION`
       *   `ENUM`
       *   `ENUM_VALUE`
       *   `INPUT_OBJECT`
       *   `INPUT_FIELD_DEFINITION`
       *   `DIRECTIVE_DEFINITION`
       */
      parseDirectiveLocation() {
        const start = this._lexer.token;
        const name = this.parseName();
        if (Object.prototype.hasOwnProperty.call(
          _directiveLocation.DirectiveLocation,
          name.value
        )) {
          return name;
        }
        throw this.unexpected(start);
      }
      // Schema Coordinates
      /**
       * SchemaCoordinate :
       *   - Name
       *   - Name . Name
       *   - Name . Name ( Name : )
       *   - \@ Name
       *   - \@ Name ( Name : )
       * @returns Parsed schema coordinate AST.
       * @example
       * ```ts
       * import { Parser, Source } from 'graphql/language';
       *
       * const typeCoordinate = new Parser(new Source('User.name')).parseSchemaCoordinate();
       * const directiveCoordinate = new Parser(new Source('@include(if:)')).parseSchemaCoordinate();
       *
       * typeCoordinate.name.value; // => 'User'
       * typeCoordinate.memberName?.value; // => 'name'
       * directiveCoordinate.name.value; // => 'deprecated'
       * directiveCoordinate.argumentName?.value; // => 'reason'
       * ```
       */
      parseSchemaCoordinate() {
        const start = this._lexer.token;
        const ofDirective = this.expectOptionalToken(_tokenKind.TokenKind.AT);
        const name = this.parseName();
        let memberName;
        if (!ofDirective && this.expectOptionalToken(_tokenKind.TokenKind.DOT)) {
          memberName = this.parseName();
        }
        let argumentName;
        if ((ofDirective || memberName) && this.expectOptionalToken(_tokenKind.TokenKind.PAREN_L)) {
          argumentName = this.parseName();
          this.expectToken(_tokenKind.TokenKind.COLON);
          this.expectToken(_tokenKind.TokenKind.PAREN_R);
        }
        if (ofDirective) {
          if (argumentName) {
            return this.node(start, {
              kind: _kinds.Kind.DIRECTIVE_ARGUMENT_COORDINATE,
              name,
              argumentName
            });
          }
          return this.node(start, {
            kind: _kinds.Kind.DIRECTIVE_COORDINATE,
            name
          });
        } else if (memberName) {
          if (argumentName) {
            return this.node(start, {
              kind: _kinds.Kind.ARGUMENT_COORDINATE,
              name,
              fieldName: memberName,
              argumentName
            });
          }
          return this.node(start, {
            kind: _kinds.Kind.MEMBER_COORDINATE,
            name,
            memberName
          });
        }
        return this.node(start, {
          kind: _kinds.Kind.TYPE_COORDINATE,
          name
        });
      }
      // Core parsing utility functions
      /**
       * Returns a node that, if configured to do so, sets a "loc" field as a
       * location object, used to identify the place in the source that created a
       * given parsed object.
       *
       * @internal
       */
      node(startToken, node) {
        if (this._options.noLocation !== true) {
          node.loc = new _ast.Location(
            startToken,
            this._lexer.lastToken,
            this._lexer.source
          );
        }
        return node;
      }
      /**
       * Determines if the next token is of a given kind
       *
       * @internal
       */
      peek(kind) {
        return this._lexer.token.kind === kind;
      }
      /**
       * If the next token is of the given kind, return that token after advancing the lexer.
       * Otherwise, do not change the parser state and throw an error.
       *
       * @internal
       */
      expectToken(kind) {
        const token = this._lexer.token;
        if (token.kind === kind) {
          this.advanceLexer();
          return token;
        }
        throw (0, _syntaxError.syntaxError)(
          this._lexer.source,
          token.start,
          `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`
        );
      }
      /**
       * If the next token is of the given kind, return "true" after advancing the lexer.
       * Otherwise, do not change the parser state and return "false".
       *
       * @internal
       */
      expectOptionalToken(kind) {
        const token = this._lexer.token;
        if (token.kind === kind) {
          this.advanceLexer();
          return true;
        }
        return false;
      }
      /**
       * If the next token is a given keyword, advance the lexer.
       * Otherwise, do not change the parser state and throw an error.
       *
       * @internal
       */
      expectKeyword(value) {
        const token = this._lexer.token;
        if (token.kind === _tokenKind.TokenKind.NAME && token.value === value) {
          this.advanceLexer();
        } else {
          throw (0, _syntaxError.syntaxError)(
            this._lexer.source,
            token.start,
            `Expected "${value}", found ${getTokenDesc(token)}.`
          );
        }
      }
      /**
       * If the next token is a given keyword, return "true" after advancing the lexer.
       * Otherwise, do not change the parser state and return "false".
       *
       * @internal
       */
      expectOptionalKeyword(value) {
        const token = this._lexer.token;
        if (token.kind === _tokenKind.TokenKind.NAME && token.value === value) {
          this.advanceLexer();
          return true;
        }
        return false;
      }
      /**
       * Helper function for creating an error when an unexpected lexed token is encountered.
       *
       * @internal
       */
      unexpected(atToken) {
        const token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
        return (0, _syntaxError.syntaxError)(
          this._lexer.source,
          token.start,
          `Unexpected ${getTokenDesc(token)}.`
        );
      }
      /**
       * Returns a possibly empty list of parse nodes, determined by the parseFn.
       * This list begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       *
       * @internal
       */
      any(openKind, parseFn, closeKind) {
        this.expectToken(openKind);
        const nodes = [];
        while (!this.expectOptionalToken(closeKind)) {
          nodes.push(parseFn.call(this));
        }
        return nodes;
      }
      /**
       * Returns a list of parse nodes, determined by the parseFn.
       * It can be empty only if open token is missing otherwise it will always return non-empty list
       * that begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       *
       * @internal
       */
      optionalMany(openKind, parseFn, closeKind) {
        if (this.expectOptionalToken(openKind)) {
          const nodes = [];
          do {
            nodes.push(parseFn.call(this));
          } while (!this.expectOptionalToken(closeKind));
          return nodes;
        }
        return [];
      }
      /**
       * Returns a non-empty list of parse nodes, determined by the parseFn.
       * This list begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       *
       * @internal
       */
      many(openKind, parseFn, closeKind) {
        this.expectToken(openKind);
        const nodes = [];
        do {
          nodes.push(parseFn.call(this));
        } while (!this.expectOptionalToken(closeKind));
        return nodes;
      }
      /**
       * Returns a non-empty list of parse nodes, determined by the parseFn.
       * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
       * Advances the parser to the next lex token after last item in the list.
       *
       * @internal
       */
      delimitedMany(delimiterKind, parseFn) {
        this.expectOptionalToken(delimiterKind);
        const nodes = [];
        do {
          nodes.push(parseFn.call(this));
        } while (this.expectOptionalToken(delimiterKind));
        return nodes;
      }
      advanceLexer() {
        const { maxTokens } = this._options;
        const token = this._lexer.advance();
        if (token.kind !== _tokenKind.TokenKind.EOF) {
          ++this._tokenCounter;
          if (maxTokens !== void 0 && this._tokenCounter > maxTokens) {
            throw (0, _syntaxError.syntaxError)(
              this._lexer.source,
              token.start,
              `Document contains more that ${maxTokens} tokens. Parsing aborted.`
            );
          }
        }
      }
    };
    exports2.Parser = Parser;
    function getTokenDesc(token) {
      const value = token.value;
      return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
    }
    function getTokenKindDesc(kind) {
      return (0, _lexer.isPunctuatorTokenKind)(kind) ? `"${kind}"` : kind;
    }
  }
});

// node_modules/graphql/jsutils/didYouMean.js
var require_didYouMean = __commonJS({
  "node_modules/graphql/jsutils/didYouMean.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.didYouMean = didYouMean;
    var MAX_SUGGESTIONS = 5;
    function didYouMean(firstArg, secondArg) {
      const [subMessage, suggestionsArg] = secondArg ? [firstArg, secondArg] : [void 0, firstArg];
      let message = " Did you mean ";
      if (subMessage) {
        message += subMessage + " ";
      }
      const suggestions = suggestionsArg.map((x) => `"${x}"`);
      switch (suggestions.length) {
        case 0:
          return "";
        case 1:
          return message + suggestions[0] + "?";
        case 2:
          return message + suggestions[0] + " or " + suggestions[1] + "?";
      }
      const selected = suggestions.slice(0, MAX_SUGGESTIONS);
      const lastItem = selected.pop();
      return message + selected.join(", ") + ", or " + lastItem + "?";
    }
  }
});

// node_modules/graphql/jsutils/identityFunc.js
var require_identityFunc = __commonJS({
  "node_modules/graphql/jsutils/identityFunc.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.identityFunc = identityFunc;
    function identityFunc(x) {
      return x;
    }
  }
});

// node_modules/graphql/jsutils/keyMap.js
var require_keyMap = __commonJS({
  "node_modules/graphql/jsutils/keyMap.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.keyMap = keyMap;
    function keyMap(list, keyFn) {
      const result = /* @__PURE__ */ Object.create(null);
      for (const item of list) {
        result[keyFn(item)] = item;
      }
      return result;
    }
  }
});

// node_modules/graphql/jsutils/keyValMap.js
var require_keyValMap = __commonJS({
  "node_modules/graphql/jsutils/keyValMap.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.keyValMap = keyValMap;
    function keyValMap(list, keyFn, valFn) {
      const result = /* @__PURE__ */ Object.create(null);
      for (const item of list) {
        result[keyFn(item)] = valFn(item);
      }
      return result;
    }
  }
});

// node_modules/graphql/jsutils/mapValue.js
var require_mapValue = __commonJS({
  "node_modules/graphql/jsutils/mapValue.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.mapValue = mapValue;
    function mapValue(map, fn) {
      const result = /* @__PURE__ */ Object.create(null);
      for (const key of Object.keys(map)) {
        result[key] = fn(map[key], key);
      }
      return result;
    }
  }
});

// node_modules/graphql/jsutils/naturalCompare.js
var require_naturalCompare = __commonJS({
  "node_modules/graphql/jsutils/naturalCompare.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.naturalCompare = naturalCompare;
    function naturalCompare(aStr, bStr) {
      let aIndex = 0;
      let bIndex = 0;
      while (aIndex < aStr.length && bIndex < bStr.length) {
        let aChar = aStr.charCodeAt(aIndex);
        let bChar = bStr.charCodeAt(bIndex);
        if (isDigit2(aChar) && isDigit2(bChar)) {
          let aNum = 0;
          do {
            ++aIndex;
            aNum = aNum * 10 + aChar - DIGIT_0;
            aChar = aStr.charCodeAt(aIndex);
          } while (isDigit2(aChar) && aNum > 0);
          let bNum = 0;
          do {
            ++bIndex;
            bNum = bNum * 10 + bChar - DIGIT_0;
            bChar = bStr.charCodeAt(bIndex);
          } while (isDigit2(bChar) && bNum > 0);
          if (aNum < bNum) {
            return -1;
          }
          if (aNum > bNum) {
            return 1;
          }
        } else {
          if (aChar < bChar) {
            return -1;
          }
          if (aChar > bChar) {
            return 1;
          }
          ++aIndex;
          ++bIndex;
        }
      }
      return aStr.length - bStr.length;
    }
    var DIGIT_0 = 48;
    var DIGIT_9 = 57;
    function isDigit2(code) {
      return !isNaN(code) && DIGIT_0 <= code && code <= DIGIT_9;
    }
  }
});

// node_modules/graphql/jsutils/suggestionList.js
var require_suggestionList = __commonJS({
  "node_modules/graphql/jsutils/suggestionList.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.suggestionList = suggestionList;
    var _naturalCompare = require_naturalCompare();
    function suggestionList(input2, options) {
      const optionsByDistance = /* @__PURE__ */ Object.create(null);
      const lexicalDistance = new LexicalDistance(input2);
      const threshold = Math.floor(input2.length * 0.4) + 1;
      for (const option of options) {
        const distance = lexicalDistance.measure(option, threshold);
        if (distance !== void 0) {
          optionsByDistance[option] = distance;
        }
      }
      return Object.keys(optionsByDistance).sort((a, b) => {
        const distanceDiff = optionsByDistance[a] - optionsByDistance[b];
        return distanceDiff !== 0 ? distanceDiff : (0, _naturalCompare.naturalCompare)(a, b);
      });
    }
    var LexicalDistance = class {
      constructor(input2) {
        this._input = input2;
        this._inputLowerCase = input2.toLowerCase();
        this._inputArray = stringToArray(this._inputLowerCase);
        this._rows = [
          new Array(input2.length + 1).fill(0),
          new Array(input2.length + 1).fill(0),
          new Array(input2.length + 1).fill(0)
        ];
      }
      measure(option, threshold) {
        if (this._input === option) {
          return 0;
        }
        const optionLowerCase = option.toLowerCase();
        if (this._inputLowerCase === optionLowerCase) {
          return 1;
        }
        let a = stringToArray(optionLowerCase);
        let b = this._inputArray;
        if (a.length < b.length) {
          const tmp = a;
          a = b;
          b = tmp;
        }
        const aLength = a.length;
        const bLength = b.length;
        if (aLength - bLength > threshold) {
          return void 0;
        }
        const rows = this._rows;
        for (let j = 0; j <= bLength; j++) {
          rows[0][j] = j;
        }
        for (let i = 1; i <= aLength; i++) {
          const upRow = rows[(i - 1) % 3];
          const currentRow = rows[i % 3];
          let smallestCell = currentRow[0] = i;
          for (let j = 1; j <= bLength; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            let currentCell = Math.min(
              upRow[j] + 1,
              // delete
              currentRow[j - 1] + 1,
              // insert
              upRow[j - 1] + cost
              // substitute
            );
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
              const doubleDiagonalCell = rows[(i - 2) % 3][j - 2];
              currentCell = Math.min(currentCell, doubleDiagonalCell + 1);
            }
            if (currentCell < smallestCell) {
              smallestCell = currentCell;
            }
            currentRow[j] = currentCell;
          }
          if (smallestCell > threshold) {
            return void 0;
          }
        }
        const distance = rows[aLength % 3][bLength];
        return distance <= threshold ? distance : void 0;
      }
    };
    function stringToArray(str) {
      const strLength = str.length;
      const array = new Array(strLength);
      for (let i = 0; i < strLength; ++i) {
        array[i] = str.charCodeAt(i);
      }
      return array;
    }
  }
});

// node_modules/graphql/jsutils/toObjMap.js
var require_toObjMap = __commonJS({
  "node_modules/graphql/jsutils/toObjMap.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.toObjMap = toObjMap;
    function toObjMap(obj) {
      if (obj == null) {
        return /* @__PURE__ */ Object.create(null);
      }
      if (Object.getPrototypeOf(obj) === null) {
        return obj;
      }
      const map = /* @__PURE__ */ Object.create(null);
      for (const [key, value] of Object.entries(obj)) {
        map[key] = value;
      }
      return map;
    }
  }
});

// node_modules/graphql/language/printString.js
var require_printString = __commonJS({
  "node_modules/graphql/language/printString.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.printString = printString;
    function printString(str) {
      return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
    }
    var escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
    function escapedReplacer(str) {
      return escapeSequences[str.charCodeAt(0)];
    }
    var escapeSequences = [
      "\\u0000",
      "\\u0001",
      "\\u0002",
      "\\u0003",
      "\\u0004",
      "\\u0005",
      "\\u0006",
      "\\u0007",
      "\\b",
      "\\t",
      "\\n",
      "\\u000B",
      "\\f",
      "\\r",
      "\\u000E",
      "\\u000F",
      "\\u0010",
      "\\u0011",
      "\\u0012",
      "\\u0013",
      "\\u0014",
      "\\u0015",
      "\\u0016",
      "\\u0017",
      "\\u0018",
      "\\u0019",
      "\\u001A",
      "\\u001B",
      "\\u001C",
      "\\u001D",
      "\\u001E",
      "\\u001F",
      "",
      "",
      '\\"',
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // 2F
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // 3F
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // 4F
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "\\\\",
      "",
      "",
      "",
      // 5F
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // 6F
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "\\u007F",
      "\\u0080",
      "\\u0081",
      "\\u0082",
      "\\u0083",
      "\\u0084",
      "\\u0085",
      "\\u0086",
      "\\u0087",
      "\\u0088",
      "\\u0089",
      "\\u008A",
      "\\u008B",
      "\\u008C",
      "\\u008D",
      "\\u008E",
      "\\u008F",
      "\\u0090",
      "\\u0091",
      "\\u0092",
      "\\u0093",
      "\\u0094",
      "\\u0095",
      "\\u0096",
      "\\u0097",
      "\\u0098",
      "\\u0099",
      "\\u009A",
      "\\u009B",
      "\\u009C",
      "\\u009D",
      "\\u009E",
      "\\u009F"
    ];
  }
});

// node_modules/graphql/language/visitor.js
var require_visitor = __commonJS({
  "node_modules/graphql/language/visitor.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.BREAK = void 0;
    exports2.getEnterLeaveForKind = getEnterLeaveForKind;
    exports2.getVisitFn = getVisitFn;
    exports2.visit = visit;
    exports2.visitInParallel = visitInParallel;
    var _devAssert = require_devAssert();
    var _inspect2 = require_inspect();
    var _ast = require_ast();
    var _kinds = require_kinds();
    var BREAK = Object.freeze({});
    exports2.BREAK = BREAK;
    function visit(root, visitor, visitorKeys = _ast.QueryDocumentKeys) {
      const enterLeaveMap = /* @__PURE__ */ new Map();
      for (const kind of Object.values(_kinds.Kind)) {
        enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
      }
      let stack = void 0;
      let inArray = Array.isArray(root);
      let keys = [root];
      let index = -1;
      let edits = [];
      let node = root;
      let key = void 0;
      let parent = void 0;
      const path4 = [];
      const ancestors = [];
      do {
        index++;
        const isLeaving = index === keys.length;
        const isEdited = isLeaving && edits.length !== 0;
        if (isLeaving) {
          key = ancestors.length === 0 ? void 0 : path4[path4.length - 1];
          node = parent;
          parent = ancestors.pop();
          if (isEdited) {
            if (inArray) {
              node = node.slice();
              let editOffset = 0;
              for (const [editKey, editValue] of edits) {
                const arrayKey = editKey - editOffset;
                if (editValue === null) {
                  node.splice(arrayKey, 1);
                  editOffset++;
                } else {
                  node[arrayKey] = editValue;
                }
              }
            } else {
              node = { ...node };
              for (const [editKey, editValue] of edits) {
                node[editKey] = editValue;
              }
            }
          }
          index = stack.index;
          keys = stack.keys;
          edits = stack.edits;
          inArray = stack.inArray;
          stack = stack.prev;
        } else if (parent) {
          key = inArray ? index : keys[index];
          node = parent[key];
          if (node === null || node === void 0) {
            continue;
          }
          path4.push(key);
        }
        let result;
        if (!Array.isArray(node)) {
          var _enterLeaveMap$get, _enterLeaveMap$get2;
          (0, _ast.isNode)(node) || (0, _devAssert.devAssert)(
            false,
            `Invalid AST Node: ${(0, _inspect2.inspect)(node)}.`
          );
          const visitFn = isLeaving ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get === void 0 ? void 0 : _enterLeaveMap$get.leave : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get2 === void 0 ? void 0 : _enterLeaveMap$get2.enter;
          result = visitFn === null || visitFn === void 0 ? void 0 : visitFn.call(visitor, node, key, parent, path4, ancestors);
          if (result === BREAK) {
            break;
          }
          if (result === false) {
            if (!isLeaving) {
              path4.pop();
              continue;
            }
          } else if (result !== void 0) {
            edits.push([key, result]);
            if (!isLeaving) {
              if ((0, _ast.isNode)(result)) {
                node = result;
              } else {
                path4.pop();
                continue;
              }
            }
          }
        }
        if (result === void 0 && isEdited) {
          edits.push([key, node]);
        }
        if (isLeaving) {
          path4.pop();
        } else {
          var _node$kind;
          stack = {
            inArray,
            index,
            keys,
            edits,
            prev: stack
          };
          inArray = Array.isArray(node);
          keys = inArray ? node : (_node$kind = visitorKeys[node.kind]) !== null && _node$kind !== void 0 ? _node$kind : [];
          index = -1;
          edits = [];
          if (parent) {
            ancestors.push(parent);
          }
          parent = node;
        }
      } while (stack !== void 0);
      if (edits.length !== 0) {
        return edits[edits.length - 1][1];
      }
      return root;
    }
    function visitInParallel(visitors) {
      const skipping = new Array(visitors.length).fill(null);
      const mergedVisitor = /* @__PURE__ */ Object.create(null);
      for (const kind of Object.values(_kinds.Kind)) {
        let hasVisitor = false;
        const enterList = new Array(visitors.length).fill(void 0);
        const leaveList = new Array(visitors.length).fill(void 0);
        for (let i = 0; i < visitors.length; ++i) {
          const { enter, leave } = getEnterLeaveForKind(visitors[i], kind);
          hasVisitor || (hasVisitor = enter != null || leave != null);
          enterList[i] = enter;
          leaveList[i] = leave;
        }
        if (!hasVisitor) {
          continue;
        }
        const mergedEnterLeave = {
          enter(...args) {
            const node = args[0];
            for (let i = 0; i < visitors.length; i++) {
              if (skipping[i] === null) {
                var _enterList$i;
                const result = (_enterList$i = enterList[i]) === null || _enterList$i === void 0 ? void 0 : _enterList$i.apply(visitors[i], args);
                if (result === false) {
                  skipping[i] = node;
                } else if (result === BREAK) {
                  skipping[i] = BREAK;
                } else if (result !== void 0) {
                  return result;
                }
              }
            }
          },
          leave(...args) {
            const node = args[0];
            for (let i = 0; i < visitors.length; i++) {
              if (skipping[i] === null) {
                var _leaveList$i;
                const result = (_leaveList$i = leaveList[i]) === null || _leaveList$i === void 0 ? void 0 : _leaveList$i.apply(visitors[i], args);
                if (result === BREAK) {
                  skipping[i] = BREAK;
                } else if (result !== void 0 && result !== false) {
                  return result;
                }
              } else if (skipping[i] === node) {
                skipping[i] = null;
              }
            }
          }
        };
        mergedVisitor[kind] = mergedEnterLeave;
      }
      return mergedVisitor;
    }
    function getEnterLeaveForKind(visitor, kind) {
      const kindVisitor = visitor[kind];
      if (typeof kindVisitor === "object") {
        return kindVisitor;
      } else if (typeof kindVisitor === "function") {
        return {
          enter: kindVisitor,
          leave: void 0
        };
      }
      return {
        enter: visitor.enter,
        leave: visitor.leave
      };
    }
    function getVisitFn(visitor, kind, isLeaving) {
      const { enter, leave } = getEnterLeaveForKind(visitor, kind);
      return isLeaving ? leave : enter;
    }
  }
});

// node_modules/graphql/language/printer.js
var require_printer = __commonJS({
  "node_modules/graphql/language/printer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.print = print;
    var _blockString = require_blockString();
    var _printString = require_printString();
    var _visitor = require_visitor();
    function print(ast) {
      return (0, _visitor.visit)(ast, printDocASTReducer);
    }
    var MAX_LINE_LENGTH = 80;
    var printDocASTReducer = {
      Name: {
        leave: (node) => node.value
      },
      Variable: {
        leave: (node) => "$" + node.name
      },
      // Document
      Document: {
        leave: (node) => join(node.definitions, "\n\n")
      },
      OperationDefinition: {
        leave(node) {
          const varDefs = hasMultilineItems(node.variableDefinitions) ? wrap("(\n", join(node.variableDefinitions, "\n"), "\n)") : wrap("(", join(node.variableDefinitions, ", "), ")");
          const prefix = wrap("", node.description, "\n") + join(
            [
              node.operation,
              join([node.name, varDefs]),
              join(node.directives, " ")
            ],
            " "
          );
          return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
        }
      },
      VariableDefinition: {
        leave: ({ variable, type, defaultValue, directives, description }) => wrap("", description, "\n") + variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " "))
      },
      SelectionSet: {
        leave: ({ selections }) => block(selections)
      },
      Field: {
        leave({ alias, name, arguments: args, directives, selectionSet }) {
          const prefix = wrap("", alias, ": ") + name;
          let argsLine = prefix + wrap("(", join(args, ", "), ")");
          if (argsLine.length > MAX_LINE_LENGTH) {
            argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
          }
          return join([argsLine, join(directives, " "), selectionSet], " ");
        }
      },
      Argument: {
        leave: ({ name, value }) => name + ": " + value
      },
      // Fragments
      FragmentSpread: {
        leave: ({ name, directives }) => "..." + name + wrap(" ", join(directives, " "))
      },
      InlineFragment: {
        leave: ({ typeCondition, directives, selectionSet }) => join(
          [
            "...",
            wrap("on ", typeCondition),
            join(directives, " "),
            selectionSet
          ],
          " "
        )
      },
      FragmentDefinition: {
        leave: ({
          name,
          typeCondition,
          variableDefinitions,
          directives,
          selectionSet,
          description
        }) => wrap("", description, "\n") + // Note: fragment variable definitions are experimental and may be changed
        // or removed in the future.
        `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet
      },
      // Value
      IntValue: {
        leave: ({ value }) => value
      },
      FloatValue: {
        leave: ({ value }) => value
      },
      StringValue: {
        leave: ({ value, block: isBlockString }) => isBlockString ? (0, _blockString.printBlockString)(value) : (0, _printString.printString)(value)
      },
      BooleanValue: {
        leave: ({ value }) => value ? "true" : "false"
      },
      NullValue: {
        leave: () => "null"
      },
      EnumValue: {
        leave: ({ value }) => value
      },
      ListValue: {
        leave: ({ values }) => "[" + join(values, ", ") + "]"
      },
      ObjectValue: {
        leave: ({ fields }) => "{" + join(fields, ", ") + "}"
      },
      ObjectField: {
        leave: ({ name, value }) => name + ": " + value
      },
      // Directive
      Directive: {
        leave: ({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")")
      },
      // Type
      NamedType: {
        leave: ({ name }) => name
      },
      ListType: {
        leave: ({ type }) => "[" + type + "]"
      },
      NonNullType: {
        leave: ({ type }) => type + "!"
      },
      // Type System Definitions
      SchemaDefinition: {
        leave: ({ description, directives, operationTypes }) => wrap("", description, "\n") + join(["schema", join(directives, " "), block(operationTypes)], " ")
      },
      OperationTypeDefinition: {
        leave: ({ operation, type }) => operation + ": " + type
      },
      ScalarTypeDefinition: {
        leave: ({ description, name, directives }) => wrap("", description, "\n") + join(["scalar", name, join(directives, " ")], " ")
      },
      ObjectTypeDefinition: {
        leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
          [
            "type",
            name,
            wrap("implements ", join(interfaces, " & ")),
            join(directives, " "),
            block(fields)
          ],
          " "
        )
      },
      FieldDefinition: {
        leave: ({ description, name, arguments: args, type, directives }) => wrap("", description, "\n") + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " "))
      },
      InputValueDefinition: {
        leave: ({ description, name, type, defaultValue, directives }) => wrap("", description, "\n") + join(
          [name + ": " + type, wrap("= ", defaultValue), join(directives, " ")],
          " "
        )
      },
      InterfaceTypeDefinition: {
        leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join(
          [
            "interface",
            name,
            wrap("implements ", join(interfaces, " & ")),
            join(directives, " "),
            block(fields)
          ],
          " "
        )
      },
      UnionTypeDefinition: {
        leave: ({ description, name, directives, types }) => wrap("", description, "\n") + join(
          ["union", name, join(directives, " "), wrap("= ", join(types, " | "))],
          " "
        )
      },
      EnumTypeDefinition: {
        leave: ({ description, name, directives, values }) => wrap("", description, "\n") + join(["enum", name, join(directives, " "), block(values)], " ")
      },
      EnumValueDefinition: {
        leave: ({ description, name, directives }) => wrap("", description, "\n") + join([name, join(directives, " ")], " ")
      },
      InputObjectTypeDefinition: {
        leave: ({ description, name, directives, fields }) => wrap("", description, "\n") + join(["input", name, join(directives, " "), block(fields)], " ")
      },
      DirectiveDefinition: {
        leave: ({
          description,
          name,
          arguments: args,
          directives,
          repeatable,
          locations
        }) => wrap("", description, "\n") + "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + wrap(" ", join(directives, " ")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | ")
      },
      SchemaExtension: {
        leave: ({ directives, operationTypes }) => join(
          ["extend schema", join(directives, " "), block(operationTypes)],
          " "
        )
      },
      ScalarTypeExtension: {
        leave: ({ name, directives }) => join(["extend scalar", name, join(directives, " ")], " ")
      },
      ObjectTypeExtension: {
        leave: ({ name, interfaces, directives, fields }) => join(
          [
            "extend type",
            name,
            wrap("implements ", join(interfaces, " & ")),
            join(directives, " "),
            block(fields)
          ],
          " "
        )
      },
      InterfaceTypeExtension: {
        leave: ({ name, interfaces, directives, fields }) => join(
          [
            "extend interface",
            name,
            wrap("implements ", join(interfaces, " & ")),
            join(directives, " "),
            block(fields)
          ],
          " "
        )
      },
      UnionTypeExtension: {
        leave: ({ name, directives, types }) => join(
          [
            "extend union",
            name,
            join(directives, " "),
            wrap("= ", join(types, " | "))
          ],
          " "
        )
      },
      EnumTypeExtension: {
        leave: ({ name, directives, values }) => join(["extend enum", name, join(directives, " "), block(values)], " ")
      },
      InputObjectTypeExtension: {
        leave: ({ name, directives, fields }) => join(["extend input", name, join(directives, " "), block(fields)], " ")
      },
      DirectiveExtension: {
        leave: ({ name, directives }) => join(["extend directive @" + name, join(directives, " ")], " ")
      },
      // Schema Coordinates
      TypeCoordinate: {
        leave: ({ name }) => name
      },
      MemberCoordinate: {
        leave: ({ name, memberName }) => join([name, wrap(".", memberName)])
      },
      ArgumentCoordinate: {
        leave: ({ name, fieldName, argumentName }) => join([name, wrap(".", fieldName), wrap("(", argumentName, ":)")])
      },
      DirectiveCoordinate: {
        leave: ({ name }) => join(["@", name])
      },
      DirectiveArgumentCoordinate: {
        leave: ({ name, argumentName }) => join(["@", name, wrap("(", argumentName, ":)")])
      }
    };
    function join(maybeArray, separator = "") {
      var _maybeArray$filter$jo;
      return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x) => x).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
    }
    function block(array) {
      return wrap("{\n", indent(join(array, "\n")), "\n}");
    }
    function wrap(start, maybeString, end = "") {
      return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
    }
    function indent(str) {
      return wrap("  ", str.replace(/\n/g, "\n  "));
    }
    function hasMultilineItems(maybeArray) {
      var _maybeArray$some;
      return (_maybeArray$some = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some((str) => str.includes("\n"))) !== null && _maybeArray$some !== void 0 ? _maybeArray$some : false;
    }
  }
});

// node_modules/graphql/utilities/valueFromASTUntyped.js
var require_valueFromASTUntyped = __commonJS({
  "node_modules/graphql/utilities/valueFromASTUntyped.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.valueFromASTUntyped = valueFromASTUntyped;
    var _keyValMap = require_keyValMap();
    var _kinds = require_kinds();
    function valueFromASTUntyped(valueNode, variables) {
      switch (valueNode.kind) {
        case _kinds.Kind.NULL:
          return null;
        case _kinds.Kind.INT:
          return parseInt(valueNode.value, 10);
        case _kinds.Kind.FLOAT:
          return parseFloat(valueNode.value);
        case _kinds.Kind.STRING:
        case _kinds.Kind.ENUM:
        case _kinds.Kind.BOOLEAN:
          return valueNode.value;
        case _kinds.Kind.LIST:
          return valueNode.values.map(
            (node) => valueFromASTUntyped(node, variables)
          );
        case _kinds.Kind.OBJECT:
          return (0, _keyValMap.keyValMap)(
            valueNode.fields,
            (field) => field.name.value,
            (field) => valueFromASTUntyped(field.value, variables)
          );
        case _kinds.Kind.VARIABLE:
          return variables === null || variables === void 0 ? void 0 : variables[valueNode.name.value];
      }
    }
  }
});

// node_modules/graphql/type/assertName.js
var require_assertName = __commonJS({
  "node_modules/graphql/type/assertName.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.assertEnumValueName = assertEnumValueName;
    exports2.assertName = assertName;
    var _devAssert = require_devAssert();
    var _GraphQLError = require_GraphQLError();
    var _characterClasses = require_characterClasses();
    function assertName(name) {
      name != null || (0, _devAssert.devAssert)(false, "Must provide name.");
      typeof name === "string" || (0, _devAssert.devAssert)(false, "Expected name to be a string.");
      if (name.length === 0) {
        throw new _GraphQLError.GraphQLError(
          "Expected name to be a non-empty string."
        );
      }
      for (let i = 1; i < name.length; ++i) {
        if (!(0, _characterClasses.isNameContinue)(name.charCodeAt(i))) {
          throw new _GraphQLError.GraphQLError(
            `Names must only contain [_a-zA-Z0-9] but "${name}" does not.`
          );
        }
      }
      if (!(0, _characterClasses.isNameStart)(name.charCodeAt(0))) {
        throw new _GraphQLError.GraphQLError(
          `Names must start with [_a-zA-Z] but "${name}" does not.`
        );
      }
      return name;
    }
    function assertEnumValueName(name) {
      if (name === "true" || name === "false" || name === "null") {
        throw new _GraphQLError.GraphQLError(
          `Enum values cannot be named: ${name}`
        );
      }
      return assertName(name);
    }
  }
});

// node_modules/graphql/type/definition.js
var require_definition = __commonJS({
  "node_modules/graphql/type/definition.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.GraphQLUnionType = exports2.GraphQLScalarType = exports2.GraphQLObjectType = exports2.GraphQLNonNull = exports2.GraphQLList = exports2.GraphQLInterfaceType = exports2.GraphQLInputObjectType = exports2.GraphQLEnumType = void 0;
    exports2.argsToArgsConfig = argsToArgsConfig;
    exports2.assertAbstractType = assertAbstractType;
    exports2.assertCompositeType = assertCompositeType;
    exports2.assertEnumType = assertEnumType;
    exports2.assertInputObjectType = assertInputObjectType;
    exports2.assertInputType = assertInputType;
    exports2.assertInterfaceType = assertInterfaceType;
    exports2.assertLeafType = assertLeafType;
    exports2.assertListType = assertListType;
    exports2.assertNamedType = assertNamedType;
    exports2.assertNonNullType = assertNonNullType;
    exports2.assertNullableType = assertNullableType;
    exports2.assertObjectType = assertObjectType;
    exports2.assertOutputType = assertOutputType;
    exports2.assertScalarType = assertScalarType;
    exports2.assertType = assertType;
    exports2.assertUnionType = assertUnionType;
    exports2.assertWrappingType = assertWrappingType;
    exports2.defineArguments = defineArguments;
    exports2.getNamedType = getNamedType;
    exports2.getNullableType = getNullableType;
    exports2.isAbstractType = isAbstractType;
    exports2.isCompositeType = isCompositeType;
    exports2.isEnumType = isEnumType;
    exports2.isInputObjectType = isInputObjectType;
    exports2.isInputType = isInputType;
    exports2.isInterfaceType = isInterfaceType;
    exports2.isLeafType = isLeafType;
    exports2.isListType = isListType;
    exports2.isNamedType = isNamedType;
    exports2.isNonNullType = isNonNullType;
    exports2.isNullableType = isNullableType;
    exports2.isObjectType = isObjectType;
    exports2.isOutputType = isOutputType;
    exports2.isRequiredArgument = isRequiredArgument;
    exports2.isRequiredInputField = isRequiredInputField;
    exports2.isScalarType = isScalarType;
    exports2.isType = isType;
    exports2.isUnionType = isUnionType;
    exports2.isWrappingType = isWrappingType;
    exports2.resolveObjMapThunk = resolveObjMapThunk;
    exports2.resolveReadonlyArrayThunk = resolveReadonlyArrayThunk;
    var _devAssert = require_devAssert();
    var _didYouMean = require_didYouMean();
    var _identityFunc = require_identityFunc();
    var _inspect2 = require_inspect();
    var _instanceOf = require_instanceOf();
    var _isObjectLike = require_isObjectLike();
    var _keyMap = require_keyMap();
    var _keyValMap = require_keyValMap();
    var _mapValue = require_mapValue();
    var _suggestionList = require_suggestionList();
    var _toObjMap = require_toObjMap();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _printer = require_printer();
    var _valueFromASTUntyped = require_valueFromASTUntyped();
    var _assertName = require_assertName();
    function isType(type) {
      return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type) || isListType(type) || isNonNullType(type);
    }
    function assertType(type) {
      if (!isType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL type.`
        );
      }
      return type;
    }
    function isScalarType(type) {
      return (0, _instanceOf.instanceOf)(type, GraphQLScalarType);
    }
    function assertScalarType(type) {
      if (!isScalarType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL Scalar type.`
        );
      }
      return type;
    }
    function isObjectType(type) {
      return (0, _instanceOf.instanceOf)(type, GraphQLObjectType);
    }
    function assertObjectType(type) {
      if (!isObjectType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL Object type.`
        );
      }
      return type;
    }
    function isInterfaceType(type) {
      return (0, _instanceOf.instanceOf)(type, GraphQLInterfaceType);
    }
    function assertInterfaceType(type) {
      if (!isInterfaceType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL Interface type.`
        );
      }
      return type;
    }
    function isUnionType(type) {
      return (0, _instanceOf.instanceOf)(type, GraphQLUnionType);
    }
    function assertUnionType(type) {
      if (!isUnionType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL Union type.`
        );
      }
      return type;
    }
    function isEnumType(type) {
      return (0, _instanceOf.instanceOf)(type, GraphQLEnumType);
    }
    function assertEnumType(type) {
      if (!isEnumType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL Enum type.`
        );
      }
      return type;
    }
    function isInputObjectType(type) {
      return (0, _instanceOf.instanceOf)(type, GraphQLInputObjectType);
    }
    function assertInputObjectType(type) {
      if (!isInputObjectType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(
            type
          )} to be a GraphQL Input Object type.`
        );
      }
      return type;
    }
    function isListType(type) {
      return (0, _instanceOf.instanceOf)(type, GraphQLList);
    }
    function assertListType(type) {
      if (!isListType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL List type.`
        );
      }
      return type;
    }
    function isNonNullType(type) {
      return (0, _instanceOf.instanceOf)(type, GraphQLNonNull);
    }
    function assertNonNullType(type) {
      if (!isNonNullType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL Non-Null type.`
        );
      }
      return type;
    }
    function isInputType(type) {
      return isScalarType(type) || isEnumType(type) || isInputObjectType(type) || isWrappingType(type) && isInputType(type.ofType);
    }
    function assertInputType(type) {
      if (!isInputType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL input type.`
        );
      }
      return type;
    }
    function isOutputType(type) {
      return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isWrappingType(type) && isOutputType(type.ofType);
    }
    function assertOutputType(type) {
      if (!isOutputType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL output type.`
        );
      }
      return type;
    }
    function isLeafType(type) {
      return isScalarType(type) || isEnumType(type);
    }
    function assertLeafType(type) {
      if (!isLeafType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL leaf type.`
        );
      }
      return type;
    }
    function isCompositeType(type) {
      return isObjectType(type) || isInterfaceType(type) || isUnionType(type);
    }
    function assertCompositeType(type) {
      if (!isCompositeType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL composite type.`
        );
      }
      return type;
    }
    function isAbstractType(type) {
      return isInterfaceType(type) || isUnionType(type);
    }
    function assertAbstractType(type) {
      if (!isAbstractType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL abstract type.`
        );
      }
      return type;
    }
    var GraphQLList = class {
      /** The type wrapped by this list or non-null type. */
      /**
       * Creates a GraphQLList instance.
       * @param ofType - The type to wrap.
       * @example
       * ```ts
       * import { GraphQLList, GraphQLString } from 'graphql/type';
       *
       * const stringList = new GraphQLList(GraphQLString);
       *
       * stringList.ofType; // => GraphQLString
       * String(stringList); // => '[String]'
       * ```
       */
      constructor(ofType) {
        isType(ofType) || (0, _devAssert.devAssert)(
          false,
          `Expected ${(0, _inspect2.inspect)(ofType)} to be a GraphQL type.`
        );
        this.ofType = ofType;
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLList";
      }
      /**
       * Returns this wrapping type as a GraphQL type-reference string.
       * @returns The GraphQL type-reference string.
       * @example
       * ```ts
       * import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type';
       *
       * const stringList = new GraphQLList(GraphQLString);
       * const requiredStringList = new GraphQLList(new GraphQLNonNull(GraphQLString));
       *
       * stringList.toString(); // => '[String]'
       * requiredStringList.toString(); // => '[String!]'
       * ```
       */
      toString() {
        return "[" + String(this.ofType) + "]";
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLList, GraphQLString } from 'graphql/type';
       *
       * const stringList = new GraphQLList(GraphQLString);
       *
       * stringList.toJSON(); // => '[String]'
       * JSON.stringify({ type: stringList }); // => '{"type":"[String]"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLList = GraphQLList;
    var GraphQLNonNull = class {
      /** The type wrapped by this list or non-null type. */
      /**
       * Creates a GraphQLNonNull instance.
       * @param ofType - The type to wrap.
       * @example
       * ```ts
       * import { GraphQLNonNull, GraphQLString } from 'graphql/type';
       *
       * const requiredString = new GraphQLNonNull(GraphQLString);
       *
       * requiredString.ofType; // => GraphQLString
       * String(requiredString); // => 'String!'
       * ```
       */
      constructor(ofType) {
        isNullableType(ofType) || (0, _devAssert.devAssert)(
          false,
          `Expected ${(0, _inspect2.inspect)(
            ofType
          )} to be a GraphQL nullable type.`
        );
        this.ofType = ofType;
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLNonNull";
      }
      /**
       * Returns this wrapping type as a GraphQL type-reference string.
       * @returns The GraphQL type-reference string.
       * @example
       * ```ts
       * import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type';
       *
       * const requiredString = new GraphQLNonNull(GraphQLString);
       * const requiredStringList = new GraphQLNonNull(
       *   new GraphQLList(GraphQLString),
       * );
       *
       * requiredString.toString(); // => 'String!'
       * requiredStringList.toString(); // => '[String]!'
       * ```
       */
      toString() {
        return String(this.ofType) + "!";
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLNonNull, GraphQLString } from 'graphql/type';
       *
       * const requiredString = new GraphQLNonNull(GraphQLString);
       *
       * requiredString.toJSON(); // => 'String!'
       * JSON.stringify({ type: requiredString }); // => '{"type":"String!"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLNonNull = GraphQLNonNull;
    function isWrappingType(type) {
      return isListType(type) || isNonNullType(type);
    }
    function assertWrappingType(type) {
      if (!isWrappingType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL wrapping type.`
        );
      }
      return type;
    }
    function isNullableType(type) {
      return isType(type) && !isNonNullType(type);
    }
    function assertNullableType(type) {
      if (!isNullableType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL nullable type.`
        );
      }
      return type;
    }
    function getNullableType(type) {
      if (type) {
        return isNonNullType(type) ? type.ofType : type;
      }
    }
    function isNamedType(type) {
      return isScalarType(type) || isObjectType(type) || isInterfaceType(type) || isUnionType(type) || isEnumType(type) || isInputObjectType(type);
    }
    function assertNamedType(type) {
      if (!isNamedType(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(type)} to be a GraphQL named type.`
        );
      }
      return type;
    }
    function getNamedType(type) {
      if (type) {
        let unwrappedType = type;
        while (isWrappingType(unwrappedType)) {
          unwrappedType = unwrappedType.ofType;
        }
        return unwrappedType;
      }
    }
    function resolveReadonlyArrayThunk(thunk) {
      return typeof thunk === "function" ? thunk() : thunk;
    }
    function resolveObjMapThunk(thunk) {
      return typeof thunk === "function" ? thunk() : thunk;
    }
    var GraphQLScalarType = class {
      /** The GraphQL name for this schema element. */
      /** Human-readable description for this schema element, if provided. */
      /** URL identifying the behavior specified for this custom scalar. */
      /** Function that converts internal values to externally visible scalar values. */
      /** Function that converts variable input into this scalar's internal value. */
      /** Function that converts AST input literals into this scalar's internal value. */
      /** Custom extension fields reserved for users. */
      /** AST node from which this schema element was built, if available. */
      /** AST extension nodes applied to this schema element. */
      /**
       * Creates a GraphQLScalarType instance.
       * @param config - Configuration describing this object.
       * @example
       * ```ts
       * import { Kind, parse } from 'graphql/language';
       * import { GraphQLScalarType } from 'graphql/type';
       *
       * const document = parse(`
       *   "Odd integer values."
       *   scalar Odd @specifiedBy(url: "https://example.com/odd")
       *
       *   extend scalar Odd @specifiedBy(url: "https://example.com/odd-v2")
       * `);
       *
       * const Odd = new GraphQLScalarType({
       *   name: 'Odd',
       *   description: 'Odd integer values.',
       *   specifiedByURL: 'https://example.com/odd',
       *   serialize: (value) => {
       *     if (typeof value !== 'number' || value % 2 === 0) {
       *       throw new TypeError('Odd can only serialize odd numbers.');
       *     }
       *     return value;
       *   },
       *   parseValue: (value) => {
       *     if (typeof value !== 'number' || value % 2 === 0) {
       *       throw new TypeError('Odd can only parse odd numbers.');
       *     }
       *     return value;
       *   },
       *   parseLiteral: (ast) => {
       *     if (ast.kind !== Kind.INT) {
       *       throw new TypeError('Odd can only parse integer literals.');
       *     }
       *     const value = Number(ast.value);
       *     if (value % 2 === 0) {
       *       throw new TypeError('Odd can only parse odd integer literals.');
       *     }
       *     return value;
       *   },
       *   extensions: { numeric: true },
       *   astNode: document.definitions[0],
       *   extensionASTNodes: [ document.definitions[1] ],
       * });
       *
       * Odd.description; // => 'Odd integer values.'
       * Odd.specifiedByURL; // => 'https://example.com/odd'
       * Odd.serialize(3); // => 3
       * Odd.parseValue(5); // => 5
       * Odd.extensions; // => { numeric: true }
       * ```
       */
      constructor(config) {
        var _config$parseValue, _config$serialize, _config$parseLiteral, _config$extensionASTN;
        const parseValue = (_config$parseValue = config.parseValue) !== null && _config$parseValue !== void 0 ? _config$parseValue : _identityFunc.identityFunc;
        this.name = (0, _assertName.assertName)(config.name);
        this.description = config.description;
        this.specifiedByURL = config.specifiedByURL;
        this.serialize = (_config$serialize = config.serialize) !== null && _config$serialize !== void 0 ? _config$serialize : _identityFunc.identityFunc;
        this.parseValue = parseValue;
        this.parseLiteral = (_config$parseLiteral = config.parseLiteral) !== null && _config$parseLiteral !== void 0 ? _config$parseLiteral : (node, variables) => parseValue(
          (0, _valueFromASTUntyped.valueFromASTUntyped)(node, variables)
        );
        this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN = config.extensionASTNodes) !== null && _config$extensionASTN !== void 0 ? _config$extensionASTN : [];
        config.specifiedByURL == null || typeof config.specifiedByURL === "string" || (0, _devAssert.devAssert)(
          false,
          `${this.name} must provide "specifiedByURL" as a string, but got: ${(0, _inspect2.inspect)(config.specifiedByURL)}.`
        );
        config.serialize == null || typeof config.serialize === "function" || (0, _devAssert.devAssert)(
          false,
          `${this.name} must provide "serialize" function. If this custom Scalar is also used as an input type, ensure "parseValue" and "parseLiteral" functions are also provided.`
        );
        if (config.parseLiteral) {
          typeof config.parseValue === "function" && typeof config.parseLiteral === "function" || (0, _devAssert.devAssert)(
            false,
            `${this.name} must provide both "parseValue" and "parseLiteral" functions.`
          );
        }
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLScalarType";
      }
      /**
       * Returns a normalized configuration object for this object.
       * @returns A configuration object that can be used to recreate this object.
       * @example
       * ```ts
       * import { GraphQLScalarType } from 'graphql/type';
       *
       * const Url = new GraphQLScalarType({
       *   name: 'Url',
       *   description: 'An absolute URL string.',
       *   specifiedByURL: 'https://url.spec.whatwg.org/',
       * });
       *
       * const config = Url.toConfig();
       * const UrlCopy = new GraphQLScalarType(config);
       *
       * config.name; // => 'Url'
       * config.specifiedByURL; // => 'https://url.spec.whatwg.org/'
       * UrlCopy.name; // => Url.name
       * ```
       */
      toConfig() {
        return {
          name: this.name,
          description: this.description,
          specifiedByURL: this.specifiedByURL,
          serialize: this.serialize,
          parseValue: this.parseValue,
          parseLiteral: this.parseLiteral,
          extensions: this.extensions,
          astNode: this.astNode,
          extensionASTNodes: this.extensionASTNodes
        };
      }
      /**
       * Returns the schema coordinate identifying this scalar type.
       * @returns The schema coordinate for this scalar type.
       * @example
       * ```ts
       * import { GraphQLScalarType } from 'graphql/type';
       *
       * const DateTime = new GraphQLScalarType({ name: 'DateTime' });
       *
       * DateTime.toString(); // => 'DateTime'
       * String(DateTime); // => 'DateTime'
       * ```
       */
      toString() {
        return this.name;
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLScalarType } from 'graphql/type';
       *
       * const DateTime = new GraphQLScalarType({ name: 'DateTime' });
       *
       * DateTime.toJSON(); // => 'DateTime'
       * JSON.stringify({ type: DateTime }); // => '{"type":"DateTime"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLScalarType = GraphQLScalarType;
    var GraphQLObjectType = class {
      /** The GraphQL name for this schema element. */
      /** Human-readable description for this schema element, if provided. */
      /** Predicate used to determine whether a runtime value belongs to this object type. */
      /** Custom extension fields reserved for users. */
      /** AST node from which this schema element was built, if available. */
      /** AST extension nodes applied to this schema element. */
      /**
       * Creates a GraphQLObjectType instance.
       * @param config - Configuration describing this object.
       * @example
       * ```ts
       * // Configure an object type with interfaces, fields, arguments, and metadata.
       * import { parse } from 'graphql/language';
       * import {
       *   GraphQLID,
       *   GraphQLInterfaceType,
       *   GraphQLNonNull,
       *   GraphQLObjectType,
       *   GraphQLString,
       * } from 'graphql/type';
       *
       * const document = parse(`
       *   type User implements Node {
       *     id: ID!
       *     name(format: String = "short"): String
       *   }
       *
       *   extend type User {
       *     displayName: String
       *   }
       * `);
       * const definition = document.definitions[0];
       * const nameField = definition.fields[1];
       * const formatArg = nameField.arguments[0];
       *
       * const Node = new GraphQLInterfaceType({
       *   name: 'Node',
       *   fields: {
       *     id: { type: new GraphQLNonNull(GraphQLID) },
       *   },
       * });
       *
       * const User = new GraphQLObjectType({
       *   name: 'User',
       *   description: 'A registered user.',
       *   interfaces: [Node],
       *   fields: {
       *     id: { type: new GraphQLNonNull(GraphQLID) },
       *     name: {
       *       description: 'The formatted user name.',
       *       type: GraphQLString,
       *       args: {
       *         format: {
       *           description: 'Controls the name format.',
       *           type: GraphQLString,
       *           defaultValue: 'short',
       *           deprecationReason: 'Use locale instead.',
       *           extensions: { public: true },
       *           astNode: formatArg,
       *         },
       *       },
       *       resolve: (user, { format }) => {
       *         return format === 'long' ? user.fullName : user.name;
       *       },
       *       deprecationReason: 'Use displayName.',
       *       extensions: { cacheSeconds: 60 },
       *       astNode: nameField,
       *     },
       *   },
       *   isTypeOf: (value) => {
       *     return typeof value === 'object' && value != null && 'id' in value;
       *   },
       *   extensions: { entity: 'User' },
       *   astNode: definition,
       *   extensionASTNodes: [ document.definitions[1] ],
       * });
       *
       * User.name; // => 'User'
       * User.getInterfaces(); // => [Node]
       * Object.keys(User.getFields()); // => ['id', 'name']
       * User.getFields().name.args[0].defaultValue; // => 'short'
       * User.extensions; // => { entity: 'User' }
       * ```
       * @example
       * ```ts
       * // This variant configures a subscription field with subscribe and resolve functions.
       * import { GraphQLObjectType, GraphQLString } from 'graphql/type';
       *
       * const Subscription = new GraphQLObjectType({
       *   name: 'Subscription',
       *   fields: {
       *     greeting: {
       *       type: GraphQLString,
       *       subscribe: async function* () {
       *         yield { greeting: 'Hello!' };
       *       },
       *       resolve: (event) => {
       *         return event.greeting;
       *       },
       *     },
       *   },
       * });
       *
       * typeof Subscription.getFields().greeting.subscribe; // => 'function'
       * ```
       */
      constructor(config) {
        var _config$extensionASTN2;
        this.name = (0, _assertName.assertName)(config.name);
        this.description = config.description;
        this.isTypeOf = config.isTypeOf;
        this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN2 = config.extensionASTNodes) !== null && _config$extensionASTN2 !== void 0 ? _config$extensionASTN2 : [];
        this._fields = () => defineFieldMap(config);
        this._interfaces = () => defineInterfaces(config);
        config.isTypeOf == null || typeof config.isTypeOf === "function" || (0, _devAssert.devAssert)(
          false,
          `${this.name} must provide "isTypeOf" as a function, but got: ${(0, _inspect2.inspect)(config.isTypeOf)}.`
        );
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLObjectType";
      }
      /**
       * Returns the fields defined by this type.
       * @returns The fields keyed by field name.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertObjectType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   type User {
       *     id: ID!
       *     name: String
       *   }
       *
       *   type Query {
       *     viewer: User
       *   }
       * `);
       *
       * const User = assertObjectType(schema.getType('User'));
       * const fields = User.getFields();
       *
       * Object.keys(fields); // => ['id', 'name']
       * String(fields.id.type); // => 'ID!'
       * ```
       */
      getFields() {
        if (typeof this._fields === "function") {
          this._fields = this._fields();
        }
        return this._fields;
      }
      /**
       * Returns the interfaces implemented by this type.
       * @returns The implemented interfaces.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertObjectType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   interface Node {
       *     id: ID!
       *   }
       *
       *   type User implements Node {
       *     id: ID!
       *   }
       *
       *   type Query {
       *     viewer: User
       *   }
       * `);
       *
       * const User = assertObjectType(schema.getType('User'));
       *
       * User.getInterfaces().map((type) => type.name); // => ['Node']
       * ```
       */
      getInterfaces() {
        if (typeof this._interfaces === "function") {
          this._interfaces = this._interfaces();
        }
        return this._interfaces;
      }
      /**
       * Returns a normalized configuration object for this object.
       * @returns A configuration object that can be used to recreate this object.
       * @example
       * ```ts
       * import { GraphQLObjectType, GraphQLString } from 'graphql/type';
       *
       * const User = new GraphQLObjectType({
       *   name: 'User',
       *   fields: {
       *     name: { type: GraphQLString },
       *   },
       * });
       *
       * const config = User.toConfig();
       * const UserCopy = new GraphQLObjectType(config);
       *
       * config.fields.name.type; // => GraphQLString
       * UserCopy.getFields().name.type; // => GraphQLString
       * ```
       */
      toConfig() {
        return {
          name: this.name,
          description: this.description,
          interfaces: this.getInterfaces(),
          fields: fieldsToFieldsConfig(this.getFields()),
          isTypeOf: this.isTypeOf,
          extensions: this.extensions,
          astNode: this.astNode,
          extensionASTNodes: this.extensionASTNodes
        };
      }
      /**
       * Returns the schema coordinate identifying this object type.
       * @returns The schema coordinate for this object type.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertObjectType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   type User {
       *     name: String
       *   }
       *
       *   type Query {
       *     viewer: User
       *   }
       * `);
       *
       * const User = assertObjectType(schema.getType('User'));
       *
       * User.toString(); // => 'User'
       * ```
       */
      toString() {
        return this.name;
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLObjectType, GraphQLString } from 'graphql/type';
       *
       * const User = new GraphQLObjectType({
       *   name: 'User',
       *   fields: { name: { type: GraphQLString } },
       * });
       *
       * User.toJSON(); // => 'User'
       * JSON.stringify({ type: User }); // => '{"type":"User"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLObjectType = GraphQLObjectType;
    function defineInterfaces(config) {
      var _config$interfaces;
      const interfaces = resolveReadonlyArrayThunk(
        (_config$interfaces = config.interfaces) !== null && _config$interfaces !== void 0 ? _config$interfaces : []
      );
      Array.isArray(interfaces) || (0, _devAssert.devAssert)(
        false,
        `${config.name} interfaces must be an Array or a function which returns an Array.`
      );
      return interfaces;
    }
    function defineFieldMap(config) {
      const fieldMap = resolveObjMapThunk(config.fields);
      isPlainObj(fieldMap) || (0, _devAssert.devAssert)(
        false,
        `${config.name} fields must be an object with field names as keys or a function which returns such an object.`
      );
      return (0, _mapValue.mapValue)(fieldMap, (fieldConfig, fieldName) => {
        var _fieldConfig$args;
        isPlainObj(fieldConfig) || (0, _devAssert.devAssert)(
          false,
          `${config.name}.${fieldName} field config must be an object.`
        );
        fieldConfig.resolve == null || typeof fieldConfig.resolve === "function" || (0, _devAssert.devAssert)(
          false,
          `${config.name}.${fieldName} field resolver must be a function if provided, but got: ${(0, _inspect2.inspect)(fieldConfig.resolve)}.`
        );
        const argsConfig = (_fieldConfig$args = fieldConfig.args) !== null && _fieldConfig$args !== void 0 ? _fieldConfig$args : {};
        isPlainObj(argsConfig) || (0, _devAssert.devAssert)(
          false,
          `${config.name}.${fieldName} args must be an object with argument names as keys.`
        );
        return {
          name: (0, _assertName.assertName)(fieldName),
          description: fieldConfig.description,
          type: fieldConfig.type,
          args: defineArguments(argsConfig),
          resolve: fieldConfig.resolve,
          subscribe: fieldConfig.subscribe,
          deprecationReason: fieldConfig.deprecationReason,
          extensions: (0, _toObjMap.toObjMap)(fieldConfig.extensions),
          astNode: fieldConfig.astNode
        };
      });
    }
    function defineArguments(config) {
      return Object.entries(config).map(([argName, argConfig]) => ({
        name: (0, _assertName.assertName)(argName),
        description: argConfig.description,
        type: argConfig.type,
        defaultValue: argConfig.defaultValue,
        deprecationReason: argConfig.deprecationReason,
        extensions: (0, _toObjMap.toObjMap)(argConfig.extensions),
        astNode: argConfig.astNode
      }));
    }
    function isPlainObj(obj) {
      return (0, _isObjectLike.isObjectLike)(obj) && !Array.isArray(obj);
    }
    function fieldsToFieldsConfig(fields) {
      return (0, _mapValue.mapValue)(fields, (field) => ({
        description: field.description,
        type: field.type,
        args: argsToArgsConfig(field.args),
        resolve: field.resolve,
        subscribe: field.subscribe,
        deprecationReason: field.deprecationReason,
        extensions: field.extensions,
        astNode: field.astNode
      }));
    }
    function argsToArgsConfig(args) {
      return (0, _keyValMap.keyValMap)(
        args,
        (arg) => arg.name,
        (arg) => ({
          description: arg.description,
          type: arg.type,
          defaultValue: arg.defaultValue,
          deprecationReason: arg.deprecationReason,
          extensions: arg.extensions,
          astNode: arg.astNode
        })
      );
    }
    function isRequiredArgument(arg) {
      return isNonNullType(arg.type) && arg.defaultValue === void 0;
    }
    var GraphQLInterfaceType = class {
      /** The GraphQL name for this schema element. */
      /** Human-readable description for this schema element, if provided. */
      /** Function that resolves the concrete object type for this abstract type. */
      /** Custom extension fields reserved for users. */
      /** AST node from which this schema element was built, if available. */
      /** AST extension nodes applied to this schema element. */
      /**
       * Creates a GraphQLInterfaceType instance.
       * @param config - Configuration describing this object.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import { GraphQLID, GraphQLInterfaceType, GraphQLNonNull } from 'graphql/type';
       *
       * const document = parse(`
       *   interface Node {
       *     id: ID!
       *   }
       *
       *   interface Resource implements Node {
       *     id: ID!
       *   }
       *
       *   extend interface Resource {
       *     url: String
       *   }
       * `);
       *
       * const Node = new GraphQLInterfaceType({
       *   name: 'Node',
       *   fields: {
       *     id: { type: new GraphQLNonNull(GraphQLID) },
       *   },
       * });
       *
       * const Resource = new GraphQLInterfaceType({
       *   name: 'Resource',
       *   description: 'An addressable resource.',
       *   interfaces: [Node],
       *   fields: {
       *     id: { type: new GraphQLNonNull(GraphQLID) },
       *   },
       *   resolveType: (value) => {
       *     return typeof value === 'object' && value != null && 'url' in value
       *       ? 'WebPage'
       *       : null;
       *   },
       *   extensions: { abstract: true },
       *   astNode: document.definitions[1],
       *   extensionASTNodes: [ document.definitions[2] ],
       * });
       *
       * Resource.name; // => 'Resource'
       * Resource.getInterfaces(); // => [Node]
       * Object.keys(Resource.getFields()); // => ['id']
       * Resource.extensions; // => { abstract: true }
       * ```
       */
      constructor(config) {
        var _config$extensionASTN3;
        this.name = (0, _assertName.assertName)(config.name);
        this.description = config.description;
        this.resolveType = config.resolveType;
        this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN3 = config.extensionASTNodes) !== null && _config$extensionASTN3 !== void 0 ? _config$extensionASTN3 : [];
        this._fields = defineFieldMap.bind(void 0, config);
        this._interfaces = defineInterfaces.bind(void 0, config);
        config.resolveType == null || typeof config.resolveType === "function" || (0, _devAssert.devAssert)(
          false,
          `${this.name} must provide "resolveType" as a function, but got: ${(0, _inspect2.inspect)(config.resolveType)}.`
        );
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLInterfaceType";
      }
      /**
       * Returns the fields defined by this type.
       * @returns The fields keyed by field name.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertInterfaceType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   interface Node {
       *     id: ID!
       *   }
       *
       *   type User implements Node {
       *     id: ID!
       *   }
       *
       *   type Query {
       *     node: Node
       *   }
       * `);
       *
       * const Node = assertInterfaceType(schema.getType('Node'));
       * const fields = Node.getFields();
       *
       * Object.keys(fields); // => ['id']
       * String(fields.id.type); // => 'ID!'
       * ```
       */
      getFields() {
        if (typeof this._fields === "function") {
          this._fields = this._fields();
        }
        return this._fields;
      }
      /**
       * Returns the interfaces implemented by this type.
       * @returns The implemented interfaces.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertInterfaceType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   interface Resource {
       *     url: String!
       *   }
       *
       *   interface Image implements Resource {
       *     url: String!
       *     width: Int
       *   }
       *
       *   type Photo implements Resource & Image {
       *     url: String!
       *     width: Int
       *   }
       *
       *   type Query {
       *     image: Image
       *   }
       * `);
       *
       * const Image = assertInterfaceType(schema.getType('Image'));
       *
       * Image.getInterfaces().map((type) => type.name); // => ['Resource']
       * ```
       */
      getInterfaces() {
        if (typeof this._interfaces === "function") {
          this._interfaces = this._interfaces();
        }
        return this._interfaces;
      }
      /**
       * Returns a normalized configuration object for this object.
       * @returns A configuration object that can be used to recreate this object.
       * @example
       * ```ts
       * import { GraphQLID, GraphQLInterfaceType, GraphQLNonNull } from 'graphql/type';
       *
       * const Node = new GraphQLInterfaceType({
       *   name: 'Node',
       *   fields: {
       *     id: { type: new GraphQLNonNull(GraphQLID) },
       *   },
       * });
       *
       * const config = Node.toConfig();
       * const NodeCopy = new GraphQLInterfaceType(config);
       *
       * String(config.fields.id.type); // => 'ID!'
       * String(NodeCopy.getFields().id.type); // => 'ID!'
       * ```
       */
      toConfig() {
        return {
          name: this.name,
          description: this.description,
          interfaces: this.getInterfaces(),
          fields: fieldsToFieldsConfig(this.getFields()),
          resolveType: this.resolveType,
          extensions: this.extensions,
          astNode: this.astNode,
          extensionASTNodes: this.extensionASTNodes
        };
      }
      /**
       * Returns the schema coordinate identifying this interface type.
       * @returns The schema coordinate for this interface type.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertInterfaceType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   interface Node {
       *     id: ID!
       *   }
       *
       *   type User implements Node {
       *     id: ID!
       *   }
       *
       *   type Query {
       *     node: Node
       *   }
       * `);
       *
       * const Node = assertInterfaceType(schema.getType('Node'));
       *
       * Node.toString(); // => 'Node'
       * ```
       */
      toString() {
        return this.name;
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLInterfaceType, GraphQLString } from 'graphql/type';
       *
       * const Named = new GraphQLInterfaceType({
       *   name: 'Named',
       *   fields: { name: { type: GraphQLString } },
       * });
       *
       * Named.toJSON(); // => 'Named'
       * JSON.stringify({ type: Named }); // => '{"type":"Named"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLInterfaceType = GraphQLInterfaceType;
    var GraphQLUnionType = class {
      /** The GraphQL name for this schema element. */
      /** Human-readable description for this schema element, if provided. */
      /** Function that resolves the concrete object type for this abstract type. */
      /** Custom extension fields reserved for users. */
      /** AST node from which this schema element was built, if available. */
      /** AST extension nodes applied to this schema element. */
      /**
       * Creates a GraphQLUnionType instance.
       * @param config - Configuration describing this object.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import { GraphQLObjectType, GraphQLString, GraphQLUnionType } from 'graphql/type';
       *
       * const document = parse(`
       *   union Media = Photo | Video
       *
       *   extend union Media = Audio
       * `);
       *
       * const Photo = new GraphQLObjectType({
       *   name: 'Photo',
       *   fields: { url: { type: GraphQLString } },
       * });
       * const Video = new GraphQLObjectType({
       *   name: 'Video',
       *   fields: { url: { type: GraphQLString } },
       * });
       *
       * const Media = new GraphQLUnionType({
       *   name: 'Media',
       *   description: 'Media that can appear in a search result.',
       *   types: [Photo, Video],
       *   resolveType: (value) => {
       *     return typeof value === 'object' && value != null && 'duration' in value
       *       ? 'Video'
       *       : 'Photo';
       *   },
       *   extensions: { searchable: true },
       *   astNode: document.definitions[0],
       *   extensionASTNodes: [ document.definitions[1] ],
       * });
       *
       * Media.description; // => 'Media that can appear in a search result.'
       * Media.getTypes().map((type) => type.name); // => ['Photo', 'Video']
       * Media.extensions; // => { searchable: true }
       * ```
       */
      constructor(config) {
        var _config$extensionASTN4;
        this.name = (0, _assertName.assertName)(config.name);
        this.description = config.description;
        this.resolveType = config.resolveType;
        this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN4 = config.extensionASTNodes) !== null && _config$extensionASTN4 !== void 0 ? _config$extensionASTN4 : [];
        this._types = defineTypes.bind(void 0, config);
        config.resolveType == null || typeof config.resolveType === "function" || (0, _devAssert.devAssert)(
          false,
          `${this.name} must provide "resolveType" as a function, but got: ${(0, _inspect2.inspect)(config.resolveType)}.`
        );
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLUnionType";
      }
      /**
       * Returns the object types included in this union.
       * @returns The union member object types.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertUnionType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   type Photo {
       *     url: String!
       *   }
       *
       *   type Video {
       *     url: String!
       *   }
       *
       *   union Media = Photo | Video
       *
       *   type Query {
       *     media: [Media]
       *   }
       * `);
       *
       * const Media = assertUnionType(schema.getType('Media'));
       *
       * Media.getTypes().map((type) => type.name); // => ['Photo', 'Video']
       * ```
       */
      getTypes() {
        if (typeof this._types === "function") {
          this._types = this._types();
        }
        return this._types;
      }
      /**
       * Returns a normalized configuration object for this object.
       * @returns A configuration object that can be used to recreate this object.
       * @example
       * ```ts
       * import { GraphQLObjectType, GraphQLString, GraphQLUnionType } from 'graphql/type';
       *
       * const Photo = new GraphQLObjectType({
       *   name: 'Photo',
       *   fields: { url: { type: GraphQLString } },
       * });
       * const Video = new GraphQLObjectType({
       *   name: 'Video',
       *   fields: { url: { type: GraphQLString } },
       * });
       * const Media = new GraphQLUnionType({
       *   name: 'Media',
       *   types: [Photo, Video],
       * });
       *
       * const config = Media.toConfig();
       * const MediaCopy = new GraphQLUnionType(config);
       *
       * MediaCopy.getTypes().map((type) => type.name); // => ['Photo', 'Video']
       * ```
       */
      toConfig() {
        return {
          name: this.name,
          description: this.description,
          types: this.getTypes(),
          resolveType: this.resolveType,
          extensions: this.extensions,
          astNode: this.astNode,
          extensionASTNodes: this.extensionASTNodes
        };
      }
      /**
       * Returns the schema coordinate identifying this union type.
       * @returns The schema coordinate for this union type.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertUnionType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   type Photo {
       *     url: String!
       *   }
       *
       *   union SearchResult = Photo
       *
       *   type Query {
       *     search: [SearchResult]
       *   }
       * `);
       *
       * const SearchResult = assertUnionType(schema.getType('SearchResult'));
       *
       * SearchResult.toString(); // => 'SearchResult'
       * ```
       */
      toString() {
        return this.name;
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLObjectType, GraphQLString, GraphQLUnionType } from 'graphql/type';
       *
       * const Photo = new GraphQLObjectType({
       *   name: 'Photo',
       *   fields: { url: { type: GraphQLString } },
       * });
       * const SearchResult = new GraphQLUnionType({
       *   name: 'SearchResult',
       *   types: [Photo],
       * });
       *
       * SearchResult.toJSON(); // => 'SearchResult'
       * JSON.stringify({ type: SearchResult }); // => '{"type":"SearchResult"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLUnionType = GraphQLUnionType;
    function defineTypes(config) {
      const types = resolveReadonlyArrayThunk(config.types);
      Array.isArray(types) || (0, _devAssert.devAssert)(
        false,
        `Must provide Array of types or a function which returns such an array for Union ${config.name}.`
      );
      return types;
    }
    var GraphQLEnumType = class {
      /* <T> */
      /** The GraphQL name for this schema element. */
      /** Human-readable description for this schema element, if provided. */
      /** Custom extension fields reserved for users. */
      /** AST node from which this schema element was built, if available. */
      /** AST extension nodes applied to this schema element. */
      /**
       * Creates a GraphQLEnumType instance.
       * @param config - Configuration describing this object.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import { GraphQLEnumType } from 'graphql/type';
       *
       * const document = parse(`
       *   enum Episode {
       *     NEW_HOPE
       *     EMPIRE
       *     JEDI
       *   }
       *
       *   extend enum Episode {
       *     FORCE_AWAKENS
       *   }
       * `);
       * const definition = document.definitions[0];
       *
       * const Episode = new GraphQLEnumType({
       *   name: 'Episode',
       *   description: 'A Star Wars film episode.',
       *   values: {
       *     NEW_HOPE: {
       *       value: 4,
       *       description: 'Released in 1977.',
       *       extensions: { trilogy: 'original' },
       *       astNode: definition.values[0],
       *     },
       *     EMPIRE: { value: 5, astNode: definition.values[1] },
       *     JEDI: {
       *       value: 6,
       *       deprecationReason: 'Use RETURN_OF_THE_JEDI.',
       *       astNode: definition.values[2],
       *     },
       *   },
       *   extensions: { catalog: 'films' },
       *   astNode: definition,
       *   extensionASTNodes: [ document.definitions[1] ],
       * });
       *
       * Episode.description; // => 'A Star Wars film episode.'
       * Episode.serialize(5); // => 'EMPIRE'
       * Episode.parseValue('JEDI'); // => 6
       * Episode.getValue('JEDI').deprecationReason; // => 'Use RETURN_OF_THE_JEDI.'
       * Episode.extensions; // => { catalog: 'films' }
       * ```
       */
      constructor(config) {
        var _config$extensionASTN5;
        this.name = (0, _assertName.assertName)(config.name);
        this.description = config.description;
        this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN5 = config.extensionASTNodes) !== null && _config$extensionASTN5 !== void 0 ? _config$extensionASTN5 : [];
        this._values = typeof config.values === "function" ? config.values : defineEnumValues(this.name, config.values);
        this._valueLookup = null;
        this._nameLookup = null;
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLEnumType";
      }
      /**
       * Returns the values defined by this enum type.
       * @returns Enum value definitions in schema order.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertEnumType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   enum Episode {
       *     NEW_HOPE
       *     EMPIRE
       *     JEDI
       *   }
       *
       *   type Query {
       *     episode: Episode
       *   }
       * `);
       *
       * const Episode = assertEnumType(schema.getType('Episode'));
       *
       * Episode.getValues().map((value) => value.name); // => ['NEW_HOPE', 'EMPIRE', 'JEDI']
       * ```
       */
      getValues() {
        if (typeof this._values === "function") {
          this._values = defineEnumValues(this.name, this._values());
        }
        return this._values;
      }
      /**
       * Returns the enum value definition for a value name.
       * @param name - The GraphQL name to look up.
       * @returns The matching enum value definition, if it exists.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertEnumType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   enum Episode {
       *     NEW_HOPE
       *     EMPIRE
       *   }
       *
       *   type Query {
       *     episode: Episode
       *   }
       * `);
       *
       * const Episode = assertEnumType(schema.getType('Episode'));
       *
       * Episode.getValue('EMPIRE')?.name; // => 'EMPIRE'
       * Episode.getValue('JEDI'); // => undefined
       * ```
       */
      getValue(name) {
        if (this._nameLookup === null) {
          this._nameLookup = (0, _keyMap.keyMap)(
            this.getValues(),
            (value) => value.name
          );
        }
        return this._nameLookup[name];
      }
      /**
       * Serializes a runtime enum value as a GraphQL enum name.
       * @param outputValue - Runtime enum value to serialize.
       * @returns The GraphQL enum name for the runtime value.
       * @example
       * ```ts
       * import { GraphQLEnumType } from 'graphql/type';
       *
       * const RGB = new GraphQLEnumType({
       *   name: 'RGB',
       *   values: {
       *     RED: { value: 0 },
       *     GREEN: { value: 1 },
       *     BLUE: { value: 2 },
       *   },
       * });
       *
       * RGB.serialize(1); // => 'GREEN'
       * RGB.serialize(3); // throws an error
       * ```
       */
      serialize(outputValue) {
        if (this._valueLookup === null) {
          this._valueLookup = new Map(
            this.getValues().map((enumValue2) => [enumValue2.value, enumValue2])
          );
        }
        const enumValue = this._valueLookup.get(outputValue);
        if (enumValue === void 0) {
          throw new _GraphQLError.GraphQLError(
            `Enum "${this.name}" cannot represent value: ${(0, _inspect2.inspect)(
              outputValue
            )}`
          );
        }
        return enumValue.name;
      }
      /**
       * Parses a GraphQL enum name from variable input.
       * @param inputValue - Runtime input value to parse.
       * @returns The internal enum value represented by the input name.
       * @example
       * ```ts
       * import { GraphQLEnumType } from 'graphql/type';
       *
       * const RGB = new GraphQLEnumType({
       *   name: 'RGB',
       *   values: {
       *     RED: { value: 0 },
       *     GREEN: { value: 1 },
       *     BLUE: { value: 2 },
       *   },
       * });
       *
       * RGB.parseValue('BLUE'); // => 2
       * RGB.parseValue('PURPLE'); // throws an error
       * RGB.parseValue(2); // throws an error
       * ```
       */
      parseValue(inputValue) {
        if (typeof inputValue !== "string") {
          const valueStr = (0, _inspect2.inspect)(inputValue);
          throw new _GraphQLError.GraphQLError(
            `Enum "${this.name}" cannot represent non-string value: ${valueStr}.` + didYouMeanEnumValue(this, valueStr)
          );
        }
        const enumValue = this.getValue(inputValue);
        if (enumValue == null) {
          throw new _GraphQLError.GraphQLError(
            `Value "${inputValue}" does not exist in "${this.name}" enum.` + didYouMeanEnumValue(this, inputValue)
          );
        }
        return enumValue.value;
      }
      /**
       * Parses a GraphQL enum name from an AST value literal.
       * @param valueNode - AST value literal to parse.
       * @param _variables - Runtime variable values; ignored because enum literals cannot contain variables.
       * @returns The internal enum value represented by the literal.
       * @example
       * ```ts
       * import { parseValue } from 'graphql/language';
       * import { GraphQLEnumType } from 'graphql/type';
       *
       * const RGB = new GraphQLEnumType({
       *   name: 'RGB',
       *   values: {
       *     RED: { value: 0 },
       *     GREEN: { value: 1 },
       *     BLUE: { value: 2 },
       *   },
       * });
       *
       * RGB.parseLiteral(parseValue('RED')); // => 0
       * RGB.parseLiteral(parseValue('"RED"')); // throws an error
       * ```
       */
      parseLiteral(valueNode, _variables) {
        if (valueNode.kind !== _kinds.Kind.ENUM) {
          const valueStr = (0, _printer.print)(valueNode);
          throw new _GraphQLError.GraphQLError(
            `Enum "${this.name}" cannot represent non-enum value: ${valueStr}.` + didYouMeanEnumValue(this, valueStr),
            {
              nodes: valueNode
            }
          );
        }
        const enumValue = this.getValue(valueNode.value);
        if (enumValue == null) {
          const valueStr = (0, _printer.print)(valueNode);
          throw new _GraphQLError.GraphQLError(
            `Value "${valueStr}" does not exist in "${this.name}" enum.` + didYouMeanEnumValue(this, valueStr),
            {
              nodes: valueNode
            }
          );
        }
        return enumValue.value;
      }
      /**
       * Returns a normalized configuration object for this object.
       * @returns A configuration object that can be used to recreate this object.
       * @example
       * ```ts
       * import { GraphQLEnumType } from 'graphql/type';
       *
       * const RGB = new GraphQLEnumType({
       *   name: 'RGB',
       *   values: {
       *     RED: { value: 0 },
       *     GREEN: { value: 1 },
       *     BLUE: { value: 2 },
       *   },
       * });
       *
       * const config = RGB.toConfig();
       * const RGBCopy = new GraphQLEnumType(config);
       *
       * config.values.GREEN.value; // => 1
       * RGBCopy.serialize(2); // => 'BLUE'
       * ```
       */
      toConfig() {
        const values = (0, _keyValMap.keyValMap)(
          this.getValues(),
          (value) => value.name,
          (value) => ({
            description: value.description,
            value: value.value,
            deprecationReason: value.deprecationReason,
            extensions: value.extensions,
            astNode: value.astNode
          })
        );
        return {
          name: this.name,
          description: this.description,
          values,
          extensions: this.extensions,
          astNode: this.astNode,
          extensionASTNodes: this.extensionASTNodes
        };
      }
      /**
       * Returns the schema coordinate identifying this enum type.
       * @returns The schema coordinate for this enum type.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertEnumType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   enum Episode {
       *     NEW_HOPE
       *   }
       *
       *   type Query {
       *     episode: Episode
       *   }
       * `);
       *
       * const Episode = assertEnumType(schema.getType('Episode'));
       *
       * Episode.toString(); // => 'Episode'
       * ```
       */
      toString() {
        return this.name;
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLEnumType } from 'graphql/type';
       *
       * const Episode = new GraphQLEnumType({
       *   name: 'Episode',
       *   values: {
       *     NEW_HOPE: {},
       *   },
       * });
       *
       * Episode.toJSON(); // => 'Episode'
       * JSON.stringify({ type: Episode }); // => '{"type":"Episode"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLEnumType = GraphQLEnumType;
    function didYouMeanEnumValue(enumType, unknownValueStr) {
      const allNames = enumType.getValues().map((value) => value.name);
      const suggestedValues = (0, _suggestionList.suggestionList)(
        unknownValueStr,
        allNames
      );
      return (0, _didYouMean.didYouMean)("the enum value", suggestedValues);
    }
    function defineEnumValues(typeName, valueMap) {
      isPlainObj(valueMap) || (0, _devAssert.devAssert)(
        false,
        `${typeName} values must be an object with value names as keys.`
      );
      return Object.entries(valueMap).map(([valueName, valueConfig]) => {
        isPlainObj(valueConfig) || (0, _devAssert.devAssert)(
          false,
          `${typeName}.${valueName} must refer to an object with a "value" key representing an internal value but got: ${(0, _inspect2.inspect)(
            valueConfig
          )}.`
        );
        return {
          name: (0, _assertName.assertEnumValueName)(valueName),
          description: valueConfig.description,
          value: valueConfig.value !== void 0 ? valueConfig.value : valueName,
          deprecationReason: valueConfig.deprecationReason,
          extensions: (0, _toObjMap.toObjMap)(valueConfig.extensions),
          astNode: valueConfig.astNode
        };
      });
    }
    var GraphQLInputObjectType = class {
      /** The GraphQL name for this schema element. */
      /** Human-readable description for this schema element, if provided. */
      /** Custom extension fields reserved for users. */
      /** AST node from which this schema element was built, if available. */
      /** AST extension nodes applied to this schema element. */
      /** Whether this input object uses the experimental OneOf input object semantics. */
      /**
       * Creates a GraphQLInputObjectType instance.
       * @param config - Configuration describing this object.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import {
       *   GraphQLID,
       *   GraphQLInputObjectType,
       *   GraphQLInt,
       *   GraphQLNonNull,
       *   GraphQLString,
       * } from 'graphql/type';
       *
       * const document = parse(`
       *   input ReviewInput {
       *     stars: Int!
       *     commentary: String
       *   }
       *
       *   extend input ReviewInput {
       *     body: String
       *   }
       * `);
       * const definition = document.definitions[0];
       *
       * const ReviewInput = new GraphQLInputObjectType({
       *   name: 'ReviewInput',
       *   description: 'Input collected when reviewing a product.',
       *   fields: {
       *     stars: {
       *       description: 'Star rating from one to five.',
       *       type: new GraphQLNonNull(GraphQLInt),
       *       extensions: { min: 1, max: 5 },
       *       astNode: definition.fields[0],
       *     },
       *     commentary: {
       *       type: GraphQLString,
       *       defaultValue: '',
       *       deprecationReason: 'Use body.',
       *       astNode: definition.fields[1],
       *     },
       *   },
       *   extensions: { form: 'review' },
       *   astNode: definition,
       *   extensionASTNodes: [ document.definitions[1] ],
       *   isOneOf: false,
       * });
       * const SearchBy = new GraphQLInputObjectType({
       *   name: 'SearchBy',
       *   fields: {
       *     id: { type: GraphQLID },
       *     slug: { type: GraphQLString },
       *   },
       *   isOneOf: true,
       * });
       *
       * const fields = ReviewInput.getFields();
       *
       * ReviewInput.description; // => 'Input collected when reviewing a product.'
       * String(fields.stars.type); // => 'Int!'
       * fields.stars.extensions; // => { min: 1, max: 5 }
       * fields.commentary.defaultValue; // => ''
       * fields.commentary.deprecationReason; // => 'Use body.'
       * ReviewInput.isOneOf; // => false
       * SearchBy.isOneOf; // => true
       * ```
       */
      constructor(config) {
        var _config$extensionASTN6, _config$isOneOf;
        this.name = (0, _assertName.assertName)(config.name);
        this.description = config.description;
        this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN6 = config.extensionASTNodes) !== null && _config$extensionASTN6 !== void 0 ? _config$extensionASTN6 : [];
        this.isOneOf = (_config$isOneOf = config.isOneOf) !== null && _config$isOneOf !== void 0 ? _config$isOneOf : false;
        this._fields = defineInputFieldMap.bind(void 0, config);
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLInputObjectType";
      }
      /**
       * Returns the fields defined by this type.
       * @returns The fields keyed by field name.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertInputObjectType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   input ReviewInput {
       *     stars: Int!
       *     commentary: String = ""
       *   }
       *
       *   type Query {
       *     reviews(filter: ReviewInput): [String]
       *   }
       * `);
       *
       * const ReviewInput = assertInputObjectType(schema.getType('ReviewInput'));
       * const fields = ReviewInput.getFields();
       *
       * Object.keys(fields); // => ['stars', 'commentary']
       * fields.commentary.defaultValue; // => ''
       * ```
       */
      getFields() {
        if (typeof this._fields === "function") {
          this._fields = this._fields();
        }
        return this._fields;
      }
      /**
       * Returns a normalized configuration object for this object.
       * @returns A configuration object that can be used to recreate this object.
       * @example
       * ```ts
       * import {
       *   GraphQLInputObjectType,
       *   GraphQLInt,
       *   GraphQLNonNull,
       * } from 'graphql/type';
       *
       * const ReviewInput = new GraphQLInputObjectType({
       *   name: 'ReviewInput',
       *   fields: {
       *     stars: { type: new GraphQLNonNull(GraphQLInt) },
       *   },
       * });
       *
       * const config = ReviewInput.toConfig();
       * const ReviewInputCopy = new GraphQLInputObjectType(config);
       *
       * String(config.fields.stars.type); // => 'Int!'
       * String(ReviewInputCopy.getFields().stars.type); // => 'Int!'
       * ```
       */
      toConfig() {
        const fields = (0, _mapValue.mapValue)(this.getFields(), (field) => ({
          description: field.description,
          type: field.type,
          defaultValue: field.defaultValue,
          deprecationReason: field.deprecationReason,
          extensions: field.extensions,
          astNode: field.astNode
        }));
        return {
          name: this.name,
          description: this.description,
          fields,
          extensions: this.extensions,
          astNode: this.astNode,
          extensionASTNodes: this.extensionASTNodes,
          isOneOf: this.isOneOf
        };
      }
      /**
       * Returns the schema coordinate identifying this input object type.
       * @returns The schema coordinate for this input object type.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertInputObjectType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   input ReviewInput {
       *     stars: Int!
       *   }
       *
       *   type Query {
       *     reviews(filter: ReviewInput): [String]
       *   }
       * `);
       *
       * const ReviewInput = assertInputObjectType(schema.getType('ReviewInput'));
       *
       * ReviewInput.toString(); // => 'ReviewInput'
       * ```
       */
      toString() {
        return this.name;
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { GraphQLInputObjectType, GraphQLString } from 'graphql/type';
       *
       * const ReviewInput = new GraphQLInputObjectType({
       *   name: 'ReviewInput',
       *   fields: {
       *     commentary: { type: GraphQLString },
       *   },
       * });
       *
       * ReviewInput.toJSON(); // => 'ReviewInput'
       * JSON.stringify({ type: ReviewInput }); // => '{"type":"ReviewInput"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLInputObjectType = GraphQLInputObjectType;
    function defineInputFieldMap(config) {
      const fieldMap = resolveObjMapThunk(config.fields);
      isPlainObj(fieldMap) || (0, _devAssert.devAssert)(
        false,
        `${config.name} fields must be an object with field names as keys or a function which returns such an object.`
      );
      return (0, _mapValue.mapValue)(fieldMap, (fieldConfig, fieldName) => {
        !("resolve" in fieldConfig) || (0, _devAssert.devAssert)(
          false,
          `${config.name}.${fieldName} field has a resolve property, but Input Types cannot define resolvers.`
        );
        return {
          name: (0, _assertName.assertName)(fieldName),
          description: fieldConfig.description,
          type: fieldConfig.type,
          defaultValue: fieldConfig.defaultValue,
          deprecationReason: fieldConfig.deprecationReason,
          extensions: (0, _toObjMap.toObjMap)(fieldConfig.extensions),
          astNode: fieldConfig.astNode
        };
      });
    }
    function isRequiredInputField(field) {
      return isNonNullType(field.type) && field.defaultValue === void 0;
    }
  }
});

// node_modules/graphql/utilities/typeComparators.js
var require_typeComparators = __commonJS({
  "node_modules/graphql/utilities/typeComparators.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.doTypesOverlap = doTypesOverlap;
    exports2.isEqualType = isEqualType;
    exports2.isTypeSubTypeOf = isTypeSubTypeOf;
    var _definition = require_definition();
    function isEqualType(typeA, typeB) {
      if (typeA === typeB) {
        return true;
      }
      if ((0, _definition.isNonNullType)(typeA) && (0, _definition.isNonNullType)(typeB)) {
        return isEqualType(typeA.ofType, typeB.ofType);
      }
      if ((0, _definition.isListType)(typeA) && (0, _definition.isListType)(typeB)) {
        return isEqualType(typeA.ofType, typeB.ofType);
      }
      return false;
    }
    function isTypeSubTypeOf(schema, maybeSubType, superType) {
      if (maybeSubType === superType) {
        return true;
      }
      if ((0, _definition.isNonNullType)(superType)) {
        if ((0, _definition.isNonNullType)(maybeSubType)) {
          return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
        }
        return false;
      }
      if ((0, _definition.isNonNullType)(maybeSubType)) {
        return isTypeSubTypeOf(schema, maybeSubType.ofType, superType);
      }
      if ((0, _definition.isListType)(superType)) {
        if ((0, _definition.isListType)(maybeSubType)) {
          return isTypeSubTypeOf(schema, maybeSubType.ofType, superType.ofType);
        }
        return false;
      }
      if ((0, _definition.isListType)(maybeSubType)) {
        return false;
      }
      return (0, _definition.isAbstractType)(superType) && ((0, _definition.isInterfaceType)(maybeSubType) || (0, _definition.isObjectType)(maybeSubType)) && schema.isSubType(superType, maybeSubType);
    }
    function doTypesOverlap(schema, typeA, typeB) {
      if (typeA === typeB) {
        return true;
      }
      if ((0, _definition.isAbstractType)(typeA)) {
        if ((0, _definition.isAbstractType)(typeB)) {
          return schema.getPossibleTypes(typeA).some((type) => schema.isSubType(typeB, type));
        }
        return schema.isSubType(typeA, typeB);
      }
      if ((0, _definition.isAbstractType)(typeB)) {
        return schema.isSubType(typeB, typeA);
      }
      return false;
    }
  }
});

// node_modules/graphql/type/scalars.js
var require_scalars = __commonJS({
  "node_modules/graphql/type/scalars.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.GraphQLString = exports2.GraphQLInt = exports2.GraphQLID = exports2.GraphQLFloat = exports2.GraphQLBoolean = exports2.GRAPHQL_MIN_INT = exports2.GRAPHQL_MAX_INT = void 0;
    exports2.isSpecifiedScalarType = isSpecifiedScalarType;
    exports2.specifiedScalarTypes = void 0;
    var _inspect2 = require_inspect();
    var _isObjectLike = require_isObjectLike();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _printer = require_printer();
    var _definition = require_definition();
    var GRAPHQL_MAX_INT = 2147483647;
    exports2.GRAPHQL_MAX_INT = GRAPHQL_MAX_INT;
    var GRAPHQL_MIN_INT = -2147483648;
    exports2.GRAPHQL_MIN_INT = GRAPHQL_MIN_INT;
    var GraphQLInt = new _definition.GraphQLScalarType({
      name: "Int",
      description: "The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",
      serialize(outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === "boolean") {
          return coercedValue ? 1 : 0;
        }
        let num = coercedValue;
        if (typeof coercedValue === "string" && coercedValue !== "") {
          num = Number(coercedValue);
        }
        if (typeof num !== "number" || !Number.isInteger(num)) {
          throw new _GraphQLError.GraphQLError(
            `Int cannot represent non-integer value: ${(0, _inspect2.inspect)(
              coercedValue
            )}`
          );
        }
        if (num > GRAPHQL_MAX_INT || num < GRAPHQL_MIN_INT) {
          throw new _GraphQLError.GraphQLError(
            "Int cannot represent non 32-bit signed integer value: " + (0, _inspect2.inspect)(coercedValue)
          );
        }
        return num;
      },
      parseValue(inputValue) {
        if (typeof inputValue !== "number" || !Number.isInteger(inputValue)) {
          throw new _GraphQLError.GraphQLError(
            `Int cannot represent non-integer value: ${(0, _inspect2.inspect)(
              inputValue
            )}`
          );
        }
        if (inputValue > GRAPHQL_MAX_INT || inputValue < GRAPHQL_MIN_INT) {
          throw new _GraphQLError.GraphQLError(
            `Int cannot represent non 32-bit signed integer value: ${inputValue}`
          );
        }
        return inputValue;
      },
      parseLiteral(valueNode) {
        if (valueNode.kind !== _kinds.Kind.INT) {
          throw new _GraphQLError.GraphQLError(
            `Int cannot represent non-integer value: ${(0, _printer.print)(
              valueNode
            )}`,
            {
              nodes: valueNode
            }
          );
        }
        const num = parseInt(valueNode.value, 10);
        if (num > GRAPHQL_MAX_INT || num < GRAPHQL_MIN_INT) {
          throw new _GraphQLError.GraphQLError(
            `Int cannot represent non 32-bit signed integer value: ${valueNode.value}`,
            {
              nodes: valueNode
            }
          );
        }
        return num;
      }
    });
    exports2.GraphQLInt = GraphQLInt;
    var GraphQLFloat = new _definition.GraphQLScalarType({
      name: "Float",
      description: "The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).",
      serialize(outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === "boolean") {
          return coercedValue ? 1 : 0;
        }
        let num = coercedValue;
        if (typeof coercedValue === "string" && coercedValue !== "") {
          num = Number(coercedValue);
        }
        if (typeof num !== "number" || !Number.isFinite(num)) {
          throw new _GraphQLError.GraphQLError(
            `Float cannot represent non numeric value: ${(0, _inspect2.inspect)(
              coercedValue
            )}`
          );
        }
        return num;
      },
      parseValue(inputValue) {
        if (typeof inputValue !== "number" || !Number.isFinite(inputValue)) {
          throw new _GraphQLError.GraphQLError(
            `Float cannot represent non numeric value: ${(0, _inspect2.inspect)(
              inputValue
            )}`
          );
        }
        return inputValue;
      },
      parseLiteral(valueNode) {
        if (valueNode.kind !== _kinds.Kind.FLOAT && valueNode.kind !== _kinds.Kind.INT) {
          throw new _GraphQLError.GraphQLError(
            `Float cannot represent non numeric value: ${(0, _printer.print)(
              valueNode
            )}`,
            valueNode
          );
        }
        return parseFloat(valueNode.value);
      }
    });
    exports2.GraphQLFloat = GraphQLFloat;
    var GraphQLString = new _definition.GraphQLScalarType({
      name: "String",
      description: "The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
      serialize(outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === "string") {
          return coercedValue;
        }
        if (typeof coercedValue === "boolean") {
          return coercedValue ? "true" : "false";
        }
        if (typeof coercedValue === "number" && Number.isFinite(coercedValue)) {
          return coercedValue.toString();
        }
        throw new _GraphQLError.GraphQLError(
          `String cannot represent value: ${(0, _inspect2.inspect)(outputValue)}`
        );
      },
      parseValue(inputValue) {
        if (typeof inputValue !== "string") {
          throw new _GraphQLError.GraphQLError(
            `String cannot represent a non string value: ${(0, _inspect2.inspect)(
              inputValue
            )}`
          );
        }
        return inputValue;
      },
      parseLiteral(valueNode) {
        if (valueNode.kind !== _kinds.Kind.STRING) {
          throw new _GraphQLError.GraphQLError(
            `String cannot represent a non string value: ${(0, _printer.print)(
              valueNode
            )}`,
            {
              nodes: valueNode
            }
          );
        }
        return valueNode.value;
      }
    });
    exports2.GraphQLString = GraphQLString;
    var GraphQLBoolean = new _definition.GraphQLScalarType({
      name: "Boolean",
      description: "The `Boolean` scalar type represents `true` or `false`.",
      serialize(outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === "boolean") {
          return coercedValue;
        }
        if (Number.isFinite(coercedValue)) {
          return coercedValue !== 0;
        }
        throw new _GraphQLError.GraphQLError(
          `Boolean cannot represent a non boolean value: ${(0, _inspect2.inspect)(
            coercedValue
          )}`
        );
      },
      parseValue(inputValue) {
        if (typeof inputValue !== "boolean") {
          throw new _GraphQLError.GraphQLError(
            `Boolean cannot represent a non boolean value: ${(0, _inspect2.inspect)(
              inputValue
            )}`
          );
        }
        return inputValue;
      },
      parseLiteral(valueNode) {
        if (valueNode.kind !== _kinds.Kind.BOOLEAN) {
          throw new _GraphQLError.GraphQLError(
            `Boolean cannot represent a non boolean value: ${(0, _printer.print)(
              valueNode
            )}`,
            {
              nodes: valueNode
            }
          );
        }
        return valueNode.value;
      }
    });
    exports2.GraphQLBoolean = GraphQLBoolean;
    var GraphQLID = new _definition.GraphQLScalarType({
      name: "ID",
      description: 'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',
      serialize(outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === "string") {
          return coercedValue;
        }
        if (Number.isInteger(coercedValue)) {
          return String(coercedValue);
        }
        throw new _GraphQLError.GraphQLError(
          `ID cannot represent value: ${(0, _inspect2.inspect)(outputValue)}`
        );
      },
      parseValue(inputValue) {
        if (typeof inputValue === "string") {
          return inputValue;
        }
        if (typeof inputValue === "number" && Number.isInteger(inputValue)) {
          return inputValue.toString();
        }
        throw new _GraphQLError.GraphQLError(
          `ID cannot represent value: ${(0, _inspect2.inspect)(inputValue)}`
        );
      },
      parseLiteral(valueNode) {
        if (valueNode.kind !== _kinds.Kind.STRING && valueNode.kind !== _kinds.Kind.INT) {
          throw new _GraphQLError.GraphQLError(
            "ID cannot represent a non-string and non-integer value: " + (0, _printer.print)(valueNode),
            {
              nodes: valueNode
            }
          );
        }
        return valueNode.value;
      }
    });
    exports2.GraphQLID = GraphQLID;
    var specifiedScalarTypes = Object.freeze([
      GraphQLString,
      GraphQLInt,
      GraphQLFloat,
      GraphQLBoolean,
      GraphQLID
    ]);
    exports2.specifiedScalarTypes = specifiedScalarTypes;
    function isSpecifiedScalarType(type) {
      return specifiedScalarTypes.some(({ name }) => type.name === name);
    }
    function serializeObject(outputValue) {
      if ((0, _isObjectLike.isObjectLike)(outputValue)) {
        if (typeof outputValue.valueOf === "function") {
          const valueOfResult = outputValue.valueOf();
          if (!(0, _isObjectLike.isObjectLike)(valueOfResult)) {
            return valueOfResult;
          }
        }
        if (typeof outputValue.toJSON === "function") {
          return outputValue.toJSON();
        }
      }
      return outputValue;
    }
  }
});

// node_modules/graphql/type/directives.js
var require_directives = __commonJS({
  "node_modules/graphql/type/directives.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.GraphQLSpecifiedByDirective = exports2.GraphQLSkipDirective = exports2.GraphQLOneOfDirective = exports2.GraphQLIncludeDirective = exports2.GraphQLDirective = exports2.GraphQLDeprecatedDirective = exports2.DEFAULT_DEPRECATION_REASON = void 0;
    exports2.assertDirective = assertDirective;
    exports2.isDirective = isDirective;
    exports2.isSpecifiedDirective = isSpecifiedDirective;
    exports2.specifiedDirectives = void 0;
    var _devAssert = require_devAssert();
    var _inspect2 = require_inspect();
    var _instanceOf = require_instanceOf();
    var _isObjectLike = require_isObjectLike();
    var _toObjMap = require_toObjMap();
    var _directiveLocation = require_directiveLocation();
    var _assertName = require_assertName();
    var _definition = require_definition();
    var _scalars = require_scalars();
    function isDirective(directive) {
      return (0, _instanceOf.instanceOf)(directive, GraphQLDirective);
    }
    function assertDirective(directive) {
      if (!isDirective(directive)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(directive)} to be a GraphQL directive.`
        );
      }
      return directive;
    }
    var GraphQLDirective = class {
      /** The GraphQL name for this schema element. */
      /** Human-readable description for this schema element, if provided. */
      /** Locations where this directive may be applied. */
      /** Arguments accepted by this field or directive. */
      /** Whether this directive may appear more than once at the same location. */
      /** Reason this element is deprecated, if one was provided. */
      /** Custom extension fields reserved for users. */
      /** AST node from which this schema element was built, if available. */
      /** AST extension nodes applied to this schema element. */
      /**
       * Creates a GraphQLDirective instance.
       * @param config - Configuration describing this object.
       * @example
       * ```ts
       * import { DirectiveLocation, parse } from 'graphql/language';
       * import {
       *   GraphQLBoolean,
       *   GraphQLDirective,
       *   GraphQLInt,
       *   GraphQLNonNull,
       * } from 'graphql/type';
       *
       * const document = parse(`
       *   directive @cacheControl(maxAge: Int) repeatable on FIELD_DEFINITION
       *   extend directive @cacheControl(maxAge: Int) on FIELD_DEFINITION
       * `);
       * const definition = document.definitions[0];
       *
       * const cacheControl = new GraphQLDirective({
       *   name: 'cacheControl',
       *   description: 'Controls HTTP cache hints for a field.',
       *   locations: [DirectiveLocation.FIELD_DEFINITION],
       *   args: {
       *     inheritMaxAge: {
       *       description: 'Inherit the parent cache hint.',
       *       type: new GraphQLNonNull(GraphQLBoolean),
       *       defaultValue: false,
       *       deprecationReason: 'Use maxAge instead.',
       *       extensions: { scope: 'cache' },
       *     },
       *     maxAge: {
       *       type: GraphQLInt,
       *       astNode: definition.arguments[0],
       *     },
       *   },
       *   isRepeatable: true,
       *   deprecationReason: 'Use @cache instead.',
       *   extensions: { scope: 'cache' },
       *   astNode: definition,
       *   extensionASTNodes: [ document.definitions[1] ],
       * });
       *
       * cacheControl.name; // => 'cacheControl'
       * cacheControl.description; // => 'Controls HTTP cache hints for a field.'
       * cacheControl.args[0].name; // => 'inheritMaxAge'
       * cacheControl.args[0].defaultValue; // => false
       * cacheControl.isRepeatable; // => true
       * cacheControl.extensions; // => { scope: 'cache' }
       * ```
       */
      constructor(config) {
        var _config$isRepeatable, _config$extensionASTN, _config$args;
        this.name = (0, _assertName.assertName)(config.name);
        this.description = config.description;
        this.locations = config.locations;
        this.isRepeatable = (_config$isRepeatable = config.isRepeatable) !== null && _config$isRepeatable !== void 0 ? _config$isRepeatable : false;
        this.deprecationReason = config.deprecationReason;
        this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN = config.extensionASTNodes) !== null && _config$extensionASTN !== void 0 ? _config$extensionASTN : [];
        Array.isArray(config.locations) || (0, _devAssert.devAssert)(
          false,
          `@${config.name} locations must be an Array.`
        );
        const args = (_config$args = config.args) !== null && _config$args !== void 0 ? _config$args : {};
        (0, _isObjectLike.isObjectLike)(args) && !Array.isArray(args) || (0, _devAssert.devAssert)(
          false,
          `@${config.name} args must be an object with argument names as keys.`
        );
        this.args = (0, _definition.defineArguments)(args);
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLDirective";
      }
      /**
       * Returns a normalized configuration object for this object.
       * @returns A configuration object that can be used to recreate this object.
       * @example
       * ```ts
       * import { DirectiveLocation } from 'graphql/language';
       * import { GraphQLDirective, GraphQLString } from 'graphql/type';
       *
       * const tag = new GraphQLDirective({
       *   name: 'tag',
       *   locations: [DirectiveLocation.FIELD_DEFINITION],
       *   args: {
       *     name: { type: GraphQLString },
       *   },
       * });
       *
       * const config = tag.toConfig();
       * const tagCopy = new GraphQLDirective(config);
       *
       * config.args.name.type; // => GraphQLString
       * tagCopy.args[0].name; // => 'name'
       * ```
       */
      toConfig() {
        return {
          name: this.name,
          description: this.description,
          locations: this.locations,
          args: (0, _definition.argsToArgsConfig)(this.args),
          isRepeatable: this.isRepeatable,
          deprecationReason: this.deprecationReason,
          extensions: this.extensions,
          astNode: this.astNode,
          extensionASTNodes: this.extensionASTNodes
        };
      }
      /**
       * Returns the schema coordinate identifying this directive.
       * @returns The directive schema coordinate.
       * @example
       * ```ts
       * import { DirectiveLocation } from 'graphql/language';
       * import { GraphQLDirective } from 'graphql/type';
       *
       * const tag = new GraphQLDirective({
       *   name: 'tag',
       *   locations: [DirectiveLocation.FIELD_DEFINITION],
       * });
       *
       * tag.toString(); // => '@tag'
       * ```
       */
      toString() {
        return "@" + this.name;
      }
      /**
       * Returns the JSON representation used when this object is serialized.
       * @returns The JSON-serializable representation.
       * @example
       * ```ts
       * import { DirectiveLocation } from 'graphql/language';
       * import { GraphQLDirective } from 'graphql/type';
       *
       * const tag = new GraphQLDirective({
       *   name: 'tag',
       *   locations: [DirectiveLocation.FIELD_DEFINITION],
       * });
       *
       * tag.toJSON(); // => '@tag'
       * JSON.stringify({ directive: tag }); // => '{"directive":"@tag"}'
       * ```
       */
      toJSON() {
        return this.toString();
      }
    };
    exports2.GraphQLDirective = GraphQLDirective;
    var GraphQLIncludeDirective = new GraphQLDirective({
      name: "include",
      description: "Directs the executor to include this field or fragment only when the `if` argument is true.",
      locations: [
        _directiveLocation.DirectiveLocation.FIELD,
        _directiveLocation.DirectiveLocation.FRAGMENT_SPREAD,
        _directiveLocation.DirectiveLocation.INLINE_FRAGMENT
      ],
      args: {
        if: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
          description: "Included when true."
        }
      }
    });
    exports2.GraphQLIncludeDirective = GraphQLIncludeDirective;
    var GraphQLSkipDirective = new GraphQLDirective({
      name: "skip",
      description: "Directs the executor to skip this field or fragment when the `if` argument is true.",
      locations: [
        _directiveLocation.DirectiveLocation.FIELD,
        _directiveLocation.DirectiveLocation.FRAGMENT_SPREAD,
        _directiveLocation.DirectiveLocation.INLINE_FRAGMENT
      ],
      args: {
        if: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
          description: "Skipped when true."
        }
      }
    });
    exports2.GraphQLSkipDirective = GraphQLSkipDirective;
    var DEFAULT_DEPRECATION_REASON = "No longer supported";
    exports2.DEFAULT_DEPRECATION_REASON = DEFAULT_DEPRECATION_REASON;
    var GraphQLDeprecatedDirective = new GraphQLDirective({
      name: "deprecated",
      description: "Marks an element of a GraphQL schema as no longer supported.",
      locations: [
        _directiveLocation.DirectiveLocation.FIELD_DEFINITION,
        _directiveLocation.DirectiveLocation.ARGUMENT_DEFINITION,
        _directiveLocation.DirectiveLocation.INPUT_FIELD_DEFINITION,
        _directiveLocation.DirectiveLocation.ENUM_VALUE,
        _directiveLocation.DirectiveLocation.DIRECTIVE_DEFINITION
      ],
      args: {
        reason: {
          type: _scalars.GraphQLString,
          description: "Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",
          defaultValue: DEFAULT_DEPRECATION_REASON
        }
      }
    });
    exports2.GraphQLDeprecatedDirective = GraphQLDeprecatedDirective;
    var GraphQLSpecifiedByDirective = new GraphQLDirective({
      name: "specifiedBy",
      description: "Exposes a URL that specifies the behavior of this scalar.",
      locations: [_directiveLocation.DirectiveLocation.SCALAR],
      args: {
        url: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
          description: "The URL that specifies the behavior of this scalar."
        }
      }
    });
    exports2.GraphQLSpecifiedByDirective = GraphQLSpecifiedByDirective;
    var GraphQLOneOfDirective = new GraphQLDirective({
      name: "oneOf",
      description: "Indicates exactly one field must be supplied and this field must not be `null`.",
      locations: [_directiveLocation.DirectiveLocation.INPUT_OBJECT],
      args: {}
    });
    exports2.GraphQLOneOfDirective = GraphQLOneOfDirective;
    var specifiedDirectives = Object.freeze([
      GraphQLIncludeDirective,
      GraphQLSkipDirective,
      GraphQLDeprecatedDirective,
      GraphQLSpecifiedByDirective,
      GraphQLOneOfDirective
    ]);
    exports2.specifiedDirectives = specifiedDirectives;
    function isSpecifiedDirective(directive) {
      return specifiedDirectives.some(({ name }) => name === directive.name);
    }
  }
});

// node_modules/graphql/jsutils/isIterableObject.js
var require_isIterableObject = __commonJS({
  "node_modules/graphql/jsutils/isIterableObject.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.isIterableObject = isIterableObject;
    function isIterableObject(maybeIterable) {
      return typeof maybeIterable === "object" && typeof (maybeIterable === null || maybeIterable === void 0 ? void 0 : maybeIterable[Symbol.iterator]) === "function";
    }
  }
});

// node_modules/graphql/utilities/astFromValue.js
var require_astFromValue = __commonJS({
  "node_modules/graphql/utilities/astFromValue.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.astFromValue = astFromValue;
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _isIterableObject = require_isIterableObject();
    var _isObjectLike = require_isObjectLike();
    var _kinds = require_kinds();
    var _definition = require_definition();
    var _scalars = require_scalars();
    function astFromValue(value, type) {
      if ((0, _definition.isNonNullType)(type)) {
        const astValue = astFromValue(value, type.ofType);
        if ((astValue === null || astValue === void 0 ? void 0 : astValue.kind) === _kinds.Kind.NULL) {
          return null;
        }
        return astValue;
      }
      if (value === null) {
        return {
          kind: _kinds.Kind.NULL
        };
      }
      if (value === void 0) {
        return null;
      }
      if ((0, _definition.isListType)(type)) {
        const itemType = type.ofType;
        if ((0, _isIterableObject.isIterableObject)(value)) {
          const valuesNodes = [];
          for (const item of value) {
            const itemNode = astFromValue(item, itemType);
            if (itemNode != null) {
              valuesNodes.push(itemNode);
            }
          }
          return {
            kind: _kinds.Kind.LIST,
            values: valuesNodes
          };
        }
        return astFromValue(value, itemType);
      }
      if ((0, _definition.isInputObjectType)(type)) {
        if (!(0, _isObjectLike.isObjectLike)(value)) {
          return null;
        }
        const fieldNodes = [];
        for (const field of Object.values(type.getFields())) {
          const fieldValue = astFromValue(value[field.name], field.type);
          if (fieldValue) {
            fieldNodes.push({
              kind: _kinds.Kind.OBJECT_FIELD,
              name: {
                kind: _kinds.Kind.NAME,
                value: field.name
              },
              value: fieldValue
            });
          }
        }
        return {
          kind: _kinds.Kind.OBJECT,
          fields: fieldNodes
        };
      }
      if ((0, _definition.isLeafType)(type)) {
        const serialized = type.serialize(value);
        if (serialized == null) {
          return null;
        }
        if (typeof serialized === "boolean") {
          return {
            kind: _kinds.Kind.BOOLEAN,
            value: serialized
          };
        }
        if (typeof serialized === "number" && Number.isFinite(serialized)) {
          const stringNum = String(serialized);
          return integerStringRegExp.test(stringNum) ? {
            kind: _kinds.Kind.INT,
            value: stringNum
          } : {
            kind: _kinds.Kind.FLOAT,
            value: stringNum
          };
        }
        if (typeof serialized === "string") {
          if ((0, _definition.isEnumType)(type)) {
            return {
              kind: _kinds.Kind.ENUM,
              value: serialized
            };
          }
          if (type === _scalars.GraphQLID && integerStringRegExp.test(serialized)) {
            return {
              kind: _kinds.Kind.INT,
              value: serialized
            };
          }
          return {
            kind: _kinds.Kind.STRING,
            value: serialized
          };
        }
        throw new TypeError(
          `Cannot convert value to AST: ${(0, _inspect2.inspect)(serialized)}.`
        );
      }
      (0, _invariant.invariant)(
        false,
        "Unexpected input type: " + (0, _inspect2.inspect)(type)
      );
    }
    var integerStringRegExp = /^-?(?:0|[1-9][0-9]*)$/;
  }
});

// node_modules/graphql/type/introspection.js
var require_introspection = __commonJS({
  "node_modules/graphql/type/introspection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.introspectionTypes = exports2.__TypeKind = exports2.__Type = exports2.__Schema = exports2.__InputValue = exports2.__Field = exports2.__EnumValue = exports2.__DirectiveLocation = exports2.__Directive = exports2.TypeNameMetaFieldDef = exports2.TypeMetaFieldDef = exports2.TypeKind = exports2.SchemaMetaFieldDef = void 0;
    exports2.isIntrospectionType = isIntrospectionType;
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _directiveLocation = require_directiveLocation();
    var _printer = require_printer();
    var _astFromValue = require_astFromValue();
    var _definition = require_definition();
    var _scalars = require_scalars();
    var __Schema = new _definition.GraphQLObjectType({
      name: "__Schema",
      description: "A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",
      fields: () => ({
        description: {
          type: _scalars.GraphQLString,
          resolve: (schema) => schema.description
        },
        types: {
          description: "A list of all types supported by this server.",
          type: new _definition.GraphQLNonNull(
            new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type))
          ),
          resolve(schema) {
            return Object.values(schema.getTypeMap());
          }
        },
        queryType: {
          description: "The type that query operations will be rooted at.",
          type: new _definition.GraphQLNonNull(__Type),
          resolve: (schema) => schema.getQueryType()
        },
        mutationType: {
          description: "If this server supports mutation, the type that mutation operations will be rooted at.",
          type: __Type,
          resolve: (schema) => schema.getMutationType()
        },
        subscriptionType: {
          description: "If this server support subscription, the type that subscription operations will be rooted at.",
          type: __Type,
          resolve: (schema) => schema.getSubscriptionType()
        },
        directives: {
          description: "A list of all directives supported by this server.",
          type: new _definition.GraphQLNonNull(
            new _definition.GraphQLList(
              new _definition.GraphQLNonNull(__Directive)
            )
          ),
          args: {
            includeDeprecated: {
              type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
              defaultValue: false
            }
          },
          resolve: (schema, { includeDeprecated }) => includeDeprecated ? schema.getDirectives() : schema.getDirectives().filter((directive) => directive.deprecationReason == null)
        }
      })
    });
    exports2.__Schema = __Schema;
    var __Directive = new _definition.GraphQLObjectType({
      name: "__Directive",
      description: "A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\nIn some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.",
      fields: () => ({
        name: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
          resolve: (directive) => directive.name
        },
        description: {
          type: _scalars.GraphQLString,
          resolve: (directive) => directive.description
        },
        isRepeatable: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
          resolve: (directive) => directive.isRepeatable
        },
        locations: {
          type: new _definition.GraphQLNonNull(
            new _definition.GraphQLList(
              new _definition.GraphQLNonNull(__DirectiveLocation)
            )
          ),
          resolve: (directive) => directive.locations
        },
        args: {
          type: new _definition.GraphQLNonNull(
            new _definition.GraphQLList(
              new _definition.GraphQLNonNull(__InputValue)
            )
          ),
          args: {
            includeDeprecated: {
              type: _scalars.GraphQLBoolean,
              defaultValue: false
            }
          },
          resolve(field, { includeDeprecated }) {
            return includeDeprecated ? field.args : field.args.filter((arg) => arg.deprecationReason == null);
          }
        },
        isDeprecated: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
          resolve: (directive) => directive.deprecationReason != null
        },
        deprecationReason: {
          type: _scalars.GraphQLString,
          resolve: (directive) => directive.deprecationReason
        }
      })
    });
    exports2.__Directive = __Directive;
    var __DirectiveLocation = new _definition.GraphQLEnumType({
      name: "__DirectiveLocation",
      description: "A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",
      values: {
        QUERY: {
          value: _directiveLocation.DirectiveLocation.QUERY,
          description: "Location adjacent to a query operation."
        },
        MUTATION: {
          value: _directiveLocation.DirectiveLocation.MUTATION,
          description: "Location adjacent to a mutation operation."
        },
        SUBSCRIPTION: {
          value: _directiveLocation.DirectiveLocation.SUBSCRIPTION,
          description: "Location adjacent to a subscription operation."
        },
        FIELD: {
          value: _directiveLocation.DirectiveLocation.FIELD,
          description: "Location adjacent to a field."
        },
        FRAGMENT_DEFINITION: {
          value: _directiveLocation.DirectiveLocation.FRAGMENT_DEFINITION,
          description: "Location adjacent to a fragment definition."
        },
        FRAGMENT_SPREAD: {
          value: _directiveLocation.DirectiveLocation.FRAGMENT_SPREAD,
          description: "Location adjacent to a fragment spread."
        },
        INLINE_FRAGMENT: {
          value: _directiveLocation.DirectiveLocation.INLINE_FRAGMENT,
          description: "Location adjacent to an inline fragment."
        },
        VARIABLE_DEFINITION: {
          value: _directiveLocation.DirectiveLocation.VARIABLE_DEFINITION,
          description: "Location adjacent to a variable definition."
        },
        SCHEMA: {
          value: _directiveLocation.DirectiveLocation.SCHEMA,
          description: "Location adjacent to a schema definition."
        },
        SCALAR: {
          value: _directiveLocation.DirectiveLocation.SCALAR,
          description: "Location adjacent to a scalar definition."
        },
        OBJECT: {
          value: _directiveLocation.DirectiveLocation.OBJECT,
          description: "Location adjacent to an object type definition."
        },
        FIELD_DEFINITION: {
          value: _directiveLocation.DirectiveLocation.FIELD_DEFINITION,
          description: "Location adjacent to a field definition."
        },
        ARGUMENT_DEFINITION: {
          value: _directiveLocation.DirectiveLocation.ARGUMENT_DEFINITION,
          description: "Location adjacent to an argument definition."
        },
        INTERFACE: {
          value: _directiveLocation.DirectiveLocation.INTERFACE,
          description: "Location adjacent to an interface definition."
        },
        UNION: {
          value: _directiveLocation.DirectiveLocation.UNION,
          description: "Location adjacent to a union definition."
        },
        ENUM: {
          value: _directiveLocation.DirectiveLocation.ENUM,
          description: "Location adjacent to an enum definition."
        },
        ENUM_VALUE: {
          value: _directiveLocation.DirectiveLocation.ENUM_VALUE,
          description: "Location adjacent to an enum value definition."
        },
        INPUT_OBJECT: {
          value: _directiveLocation.DirectiveLocation.INPUT_OBJECT,
          description: "Location adjacent to an input object type definition."
        },
        INPUT_FIELD_DEFINITION: {
          value: _directiveLocation.DirectiveLocation.INPUT_FIELD_DEFINITION,
          description: "Location adjacent to an input object field definition."
        },
        DIRECTIVE_DEFINITION: {
          value: _directiveLocation.DirectiveLocation.DIRECTIVE_DEFINITION,
          description: "Location adjacent to a directive definition."
        }
      }
    });
    exports2.__DirectiveLocation = __DirectiveLocation;
    var __Type = new _definition.GraphQLObjectType({
      name: "__Type",
      description: "The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",
      fields: () => ({
        kind: {
          type: new _definition.GraphQLNonNull(__TypeKind),
          resolve(type) {
            if ((0, _definition.isScalarType)(type)) {
              return TypeKind.SCALAR;
            }
            if ((0, _definition.isObjectType)(type)) {
              return TypeKind.OBJECT;
            }
            if ((0, _definition.isInterfaceType)(type)) {
              return TypeKind.INTERFACE;
            }
            if ((0, _definition.isUnionType)(type)) {
              return TypeKind.UNION;
            }
            if ((0, _definition.isEnumType)(type)) {
              return TypeKind.ENUM;
            }
            if ((0, _definition.isInputObjectType)(type)) {
              return TypeKind.INPUT_OBJECT;
            }
            if ((0, _definition.isListType)(type)) {
              return TypeKind.LIST;
            }
            if ((0, _definition.isNonNullType)(type)) {
              return TypeKind.NON_NULL;
            }
            (0, _invariant.invariant)(
              false,
              `Unexpected type: "${(0, _inspect2.inspect)(type)}".`
            );
          }
        },
        name: {
          type: _scalars.GraphQLString,
          resolve: (type) => "name" in type ? type.name : void 0
        },
        description: {
          type: _scalars.GraphQLString,
          resolve: (type) => (
            /* c8 ignore next */
            "description" in type ? type.description : void 0
          )
        },
        specifiedByURL: {
          type: _scalars.GraphQLString,
          resolve: (obj) => "specifiedByURL" in obj ? obj.specifiedByURL : void 0
        },
        fields: {
          type: new _definition.GraphQLList(
            new _definition.GraphQLNonNull(__Field)
          ),
          args: {
            includeDeprecated: {
              type: _scalars.GraphQLBoolean,
              defaultValue: false
            }
          },
          resolve(type, { includeDeprecated }) {
            if ((0, _definition.isObjectType)(type) || (0, _definition.isInterfaceType)(type)) {
              const fields = Object.values(type.getFields());
              return includeDeprecated ? fields : fields.filter((field) => field.deprecationReason == null);
            }
          }
        },
        interfaces: {
          type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),
          resolve(type) {
            if ((0, _definition.isObjectType)(type) || (0, _definition.isInterfaceType)(type)) {
              return type.getInterfaces();
            }
          }
        },
        possibleTypes: {
          type: new _definition.GraphQLList(new _definition.GraphQLNonNull(__Type)),
          resolve(type, _args, _context, { schema }) {
            if ((0, _definition.isAbstractType)(type)) {
              return schema.getPossibleTypes(type);
            }
          }
        },
        enumValues: {
          type: new _definition.GraphQLList(
            new _definition.GraphQLNonNull(__EnumValue)
          ),
          args: {
            includeDeprecated: {
              type: _scalars.GraphQLBoolean,
              defaultValue: false
            }
          },
          resolve(type, { includeDeprecated }) {
            if ((0, _definition.isEnumType)(type)) {
              const values = type.getValues();
              return includeDeprecated ? values : values.filter((field) => field.deprecationReason == null);
            }
          }
        },
        inputFields: {
          type: new _definition.GraphQLList(
            new _definition.GraphQLNonNull(__InputValue)
          ),
          args: {
            includeDeprecated: {
              type: _scalars.GraphQLBoolean,
              defaultValue: false
            }
          },
          resolve(type, { includeDeprecated }) {
            if ((0, _definition.isInputObjectType)(type)) {
              const values = Object.values(type.getFields());
              return includeDeprecated ? values : values.filter((field) => field.deprecationReason == null);
            }
          }
        },
        ofType: {
          type: __Type,
          resolve: (type) => "ofType" in type ? type.ofType : void 0
        },
        isOneOf: {
          type: _scalars.GraphQLBoolean,
          resolve: (type) => {
            if ((0, _definition.isInputObjectType)(type)) {
              return type.isOneOf;
            }
          }
        }
      })
    });
    exports2.__Type = __Type;
    var __Field = new _definition.GraphQLObjectType({
      name: "__Field",
      description: "Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",
      fields: () => ({
        name: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
          resolve: (field) => field.name
        },
        description: {
          type: _scalars.GraphQLString,
          resolve: (field) => field.description
        },
        args: {
          type: new _definition.GraphQLNonNull(
            new _definition.GraphQLList(
              new _definition.GraphQLNonNull(__InputValue)
            )
          ),
          args: {
            includeDeprecated: {
              type: _scalars.GraphQLBoolean,
              defaultValue: false
            }
          },
          resolve(field, { includeDeprecated }) {
            return includeDeprecated ? field.args : field.args.filter((arg) => arg.deprecationReason == null);
          }
        },
        type: {
          type: new _definition.GraphQLNonNull(__Type),
          resolve: (field) => field.type
        },
        isDeprecated: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
          resolve: (field) => field.deprecationReason != null
        },
        deprecationReason: {
          type: _scalars.GraphQLString,
          resolve: (field) => field.deprecationReason
        }
      })
    });
    exports2.__Field = __Field;
    var __InputValue = new _definition.GraphQLObjectType({
      name: "__InputValue",
      description: "Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",
      fields: () => ({
        name: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
          resolve: (inputValue) => inputValue.name
        },
        description: {
          type: _scalars.GraphQLString,
          resolve: (inputValue) => inputValue.description
        },
        type: {
          type: new _definition.GraphQLNonNull(__Type),
          resolve: (inputValue) => inputValue.type
        },
        defaultValue: {
          type: _scalars.GraphQLString,
          description: "A GraphQL-formatted string representing the default value for this input value.",
          resolve(inputValue) {
            const { type, defaultValue } = inputValue;
            const valueAST = (0, _astFromValue.astFromValue)(defaultValue, type);
            return valueAST ? (0, _printer.print)(valueAST) : null;
          }
        },
        isDeprecated: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
          resolve: (field) => field.deprecationReason != null
        },
        deprecationReason: {
          type: _scalars.GraphQLString,
          resolve: (obj) => obj.deprecationReason
        }
      })
    });
    exports2.__InputValue = __InputValue;
    var __EnumValue = new _definition.GraphQLObjectType({
      name: "__EnumValue",
      description: "One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",
      fields: () => ({
        name: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
          resolve: (enumValue) => enumValue.name
        },
        description: {
          type: _scalars.GraphQLString,
          resolve: (enumValue) => enumValue.description
        },
        isDeprecated: {
          type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
          resolve: (enumValue) => enumValue.deprecationReason != null
        },
        deprecationReason: {
          type: _scalars.GraphQLString,
          resolve: (enumValue) => enumValue.deprecationReason
        }
      })
    });
    exports2.__EnumValue = __EnumValue;
    var TypeKind;
    exports2.TypeKind = TypeKind;
    (function(TypeKind2) {
      TypeKind2["SCALAR"] = "SCALAR";
      TypeKind2["OBJECT"] = "OBJECT";
      TypeKind2["INTERFACE"] = "INTERFACE";
      TypeKind2["UNION"] = "UNION";
      TypeKind2["ENUM"] = "ENUM";
      TypeKind2["INPUT_OBJECT"] = "INPUT_OBJECT";
      TypeKind2["LIST"] = "LIST";
      TypeKind2["NON_NULL"] = "NON_NULL";
    })(TypeKind || (exports2.TypeKind = TypeKind = {}));
    var __TypeKind = new _definition.GraphQLEnumType({
      name: "__TypeKind",
      description: "An enum describing what kind of type a given `__Type` is.",
      values: {
        SCALAR: {
          value: TypeKind.SCALAR,
          description: "Indicates this type is a scalar."
        },
        OBJECT: {
          value: TypeKind.OBJECT,
          description: "Indicates this type is an object. `fields` and `interfaces` are valid fields."
        },
        INTERFACE: {
          value: TypeKind.INTERFACE,
          description: "Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields."
        },
        UNION: {
          value: TypeKind.UNION,
          description: "Indicates this type is a union. `possibleTypes` is a valid field."
        },
        ENUM: {
          value: TypeKind.ENUM,
          description: "Indicates this type is an enum. `enumValues` is a valid field."
        },
        INPUT_OBJECT: {
          value: TypeKind.INPUT_OBJECT,
          description: "Indicates this type is an input object. `inputFields` is a valid field."
        },
        LIST: {
          value: TypeKind.LIST,
          description: "Indicates this type is a list. `ofType` is a valid field."
        },
        NON_NULL: {
          value: TypeKind.NON_NULL,
          description: "Indicates this type is a non-null. `ofType` is a valid field."
        }
      }
    });
    exports2.__TypeKind = __TypeKind;
    var SchemaMetaFieldDef = {
      name: "__schema",
      type: new _definition.GraphQLNonNull(__Schema),
      description: "Access the current type schema of this server.",
      args: [],
      resolve: (_source, _args, _context, { schema }) => schema,
      deprecationReason: void 0,
      extensions: /* @__PURE__ */ Object.create(null),
      astNode: void 0
    };
    exports2.SchemaMetaFieldDef = SchemaMetaFieldDef;
    var TypeMetaFieldDef = {
      name: "__type",
      type: __Type,
      description: "Request the type information of a single type.",
      args: [
        {
          name: "name",
          description: void 0,
          type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
          defaultValue: void 0,
          deprecationReason: void 0,
          extensions: /* @__PURE__ */ Object.create(null),
          astNode: void 0
        }
      ],
      resolve: (_source, { name }, _context, { schema }) => schema.getType(name),
      deprecationReason: void 0,
      extensions: /* @__PURE__ */ Object.create(null),
      astNode: void 0
    };
    exports2.TypeMetaFieldDef = TypeMetaFieldDef;
    var TypeNameMetaFieldDef = {
      name: "__typename",
      type: new _definition.GraphQLNonNull(_scalars.GraphQLString),
      description: "The name of the current Object type at runtime.",
      args: [],
      resolve: (_source, _args, _context, { parentType }) => parentType.name,
      deprecationReason: void 0,
      extensions: /* @__PURE__ */ Object.create(null),
      astNode: void 0
    };
    exports2.TypeNameMetaFieldDef = TypeNameMetaFieldDef;
    var introspectionTypes = Object.freeze([
      __Schema,
      __Directive,
      __DirectiveLocation,
      __Type,
      __Field,
      __InputValue,
      __EnumValue,
      __TypeKind
    ]);
    exports2.introspectionTypes = introspectionTypes;
    function isIntrospectionType(type) {
      return introspectionTypes.some(({ name }) => type.name === name);
    }
  }
});

// node_modules/graphql/type/schema.js
var require_schema = __commonJS({
  "node_modules/graphql/type/schema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.GraphQLSchema = void 0;
    exports2.assertSchema = assertSchema;
    exports2.isSchema = isSchema;
    var _devAssert = require_devAssert();
    var _inspect2 = require_inspect();
    var _instanceOf = require_instanceOf();
    var _isObjectLike = require_isObjectLike();
    var _toObjMap = require_toObjMap();
    var _ast = require_ast();
    var _definition = require_definition();
    var _directives = require_directives();
    var _introspection = require_introspection();
    function isSchema(schema) {
      return (0, _instanceOf.instanceOf)(schema, GraphQLSchema);
    }
    function assertSchema(schema) {
      if (!isSchema(schema)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(schema)} to be a GraphQL schema.`
        );
      }
      return schema;
    }
    var GraphQLSchema = class {
      /** Human-readable description for this schema element, if provided. */
      /** Custom extension fields reserved for users. */
      /** AST node from which this schema element was built, if available. */
      /** AST extension nodes applied to this schema element. */
      /**
       * Cached schema validation errors, if validation has already run.
       * @internal
       */
      /**
       * Creates a GraphQLSchema instance.
       * @param config - Configuration describing this object.
       * @example
       * ```ts
       * // Create a schema with the required query root.
       * import {
       *   GraphQLObjectType,
       *   GraphQLSchema,
       *   GraphQLString,
       * } from 'graphql/type';
       *
       * const Query = new GraphQLObjectType({
       *   name: 'Query',
       *   fields: {
       *     greeting: {
       *       type: GraphQLString,
       *       resolve: () => 'Hello',
       *     },
       *   },
       * });
       *
       * const schema = new GraphQLSchema({
       *   description: 'The application schema.',
       *   query: Query,
       * });
       *
       * schema.getQueryType(); // => Query
       * schema.description; // => 'The application schema.'
       * ```
       * @example
       * ```ts
       * // This variant configures every schema option, including directives and extensions.
       * import { DirectiveLocation, parse } from 'graphql/language';
       * import {
       *   GraphQLBoolean,
       *   GraphQLDirective,
       *   GraphQLObjectType,
       *   GraphQLSchema,
       *   GraphQLString,
       * } from 'graphql/type';
       *
       * const Query = new GraphQLObjectType({
       *   name: 'Query',
       *   fields: { greeting: { type: GraphQLString } },
       * });
       * const Mutation = new GraphQLObjectType({
       *   name: 'Mutation',
       *   fields: { setGreeting: { type: GraphQLString } },
       * });
       * const Subscription = new GraphQLObjectType({
       *   name: 'Subscription',
       *   fields: { greetingChanged: { type: GraphQLString } },
       * });
       * const AuditEvent = new GraphQLObjectType({
       *   name: 'AuditEvent',
       *   fields: { message: { type: GraphQLString } },
       * });
       * const authDirective = new GraphQLDirective({
       *   name: 'auth',
       *   locations: [DirectiveLocation.FIELD_DEFINITION],
       *   args: { required: { type: GraphQLBoolean } },
       * });
       * const schemaDocument = parse(`
       *   schema {
       *     query: Query
       *     mutation: Mutation
       *     subscription: Subscription
       *   }
       *
       *   extend schema @auth
       * `);
       *
       * const schema = new GraphQLSchema({
       *   description: 'Operations exposed by the application.',
       *   query: Query,
       *   mutation: Mutation,
       *   subscription: Subscription,
       *   types: [AuditEvent],
       *   directives: [authDirective],
       *   extensions: { owner: 'platform' },
       *   astNode: schemaDocument.definitions[0],
       *   extensionASTNodes: [ schemaDocument.definitions[1] ],
       *   assumeValid: true,
       * });
       *
       * schema.getMutationType(); // => Mutation
       * schema.getSubscriptionType(); // => Subscription
       * schema.getType('AuditEvent'); // => AuditEvent
       * schema.getDirective('auth'); // => authDirective
       * schema.extensions; // => { owner: 'platform' }
       * ```
       */
      constructor(config) {
        var _config$extensionASTN, _config$directives;
        this.__validationErrors = config.assumeValid === true ? [] : void 0;
        (0, _isObjectLike.isObjectLike)(config) || (0, _devAssert.devAssert)(false, "Must provide configuration object.");
        !config.types || Array.isArray(config.types) || (0, _devAssert.devAssert)(
          false,
          `"types" must be Array if provided but got: ${(0, _inspect2.inspect)(
            config.types
          )}.`
        );
        !config.directives || Array.isArray(config.directives) || (0, _devAssert.devAssert)(
          false,
          `"directives" must be Array if provided but got: ${(0, _inspect2.inspect)(config.directives)}.`
        );
        this.description = config.description;
        this.extensions = (0, _toObjMap.toObjMap)(config.extensions);
        this.astNode = config.astNode;
        this.extensionASTNodes = (_config$extensionASTN = config.extensionASTNodes) !== null && _config$extensionASTN !== void 0 ? _config$extensionASTN : [];
        this._queryType = config.query;
        this._mutationType = config.mutation;
        this._subscriptionType = config.subscription;
        this._directives = (_config$directives = config.directives) !== null && _config$directives !== void 0 ? _config$directives : _directives.specifiedDirectives;
        const allReferencedTypes = new Set(config.types);
        if (config.types != null) {
          for (const type of config.types) {
            allReferencedTypes.delete(type);
            collectReferencedTypes(type, allReferencedTypes);
          }
        }
        if (this._queryType != null) {
          collectReferencedTypes(this._queryType, allReferencedTypes);
        }
        if (this._mutationType != null) {
          collectReferencedTypes(this._mutationType, allReferencedTypes);
        }
        if (this._subscriptionType != null) {
          collectReferencedTypes(this._subscriptionType, allReferencedTypes);
        }
        for (const directive of this._directives) {
          if ((0, _directives.isDirective)(directive)) {
            for (const arg of directive.args) {
              collectReferencedTypes(arg.type, allReferencedTypes);
            }
          }
        }
        collectReferencedTypes(_introspection.__Schema, allReferencedTypes);
        this._typeMap = /* @__PURE__ */ Object.create(null);
        this._subTypeMap = /* @__PURE__ */ Object.create(null);
        this._implementationsMap = /* @__PURE__ */ Object.create(null);
        for (const namedType of allReferencedTypes) {
          if (namedType == null) {
            continue;
          }
          const typeName = namedType.name;
          typeName || (0, _devAssert.devAssert)(
            false,
            "One of the provided types for building the Schema is missing a name."
          );
          if (this._typeMap[typeName] !== void 0) {
            throw new Error(
              `Schema must contain uniquely named types but contains multiple types named "${typeName}".`
            );
          }
          this._typeMap[typeName] = namedType;
          if ((0, _definition.isInterfaceType)(namedType)) {
            for (const iface of namedType.getInterfaces()) {
              if ((0, _definition.isInterfaceType)(iface)) {
                let implementations = this._implementationsMap[iface.name];
                if (implementations === void 0) {
                  implementations = this._implementationsMap[iface.name] = {
                    objects: [],
                    interfaces: []
                  };
                }
                implementations.interfaces.push(namedType);
              }
            }
          } else if ((0, _definition.isObjectType)(namedType)) {
            for (const iface of namedType.getInterfaces()) {
              if ((0, _definition.isInterfaceType)(iface)) {
                let implementations = this._implementationsMap[iface.name];
                if (implementations === void 0) {
                  implementations = this._implementationsMap[iface.name] = {
                    objects: [],
                    interfaces: []
                  };
                }
                implementations.objects.push(namedType);
              }
            }
          }
        }
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "GraphQLSchema";
      }
      /**
       * Returns the root object type for query operations.
       * @returns The query root type, if this schema defines one.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       *
       * schema.getQueryType()?.name; // => 'Query'
       * ```
       */
      getQueryType() {
        return this._queryType;
      }
      /**
       * Returns the root object type for mutation operations.
       * @returns The mutation root type, if this schema defines one.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       *
       *   type Mutation {
       *     setGreeting(value: String!): String
       *   }
       * `);
       *
       * schema.getMutationType()?.name; // => 'Mutation'
       * ```
       */
      getMutationType() {
        return this._mutationType;
      }
      /**
       * Returns the root object type for subscription operations.
       * @returns The subscription root type, if this schema defines one.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       *
       *   type Subscription {
       *     greetings: String
       *   }
       * `);
       *
       * schema.getSubscriptionType()?.name; // => 'Subscription'
       * ```
       */
      getSubscriptionType() {
        return this._subscriptionType;
      }
      /**
       * Returns the root object type for the requested operation kind.
       * @param operation - Operation kind to resolve.
       * @returns The root object type for the operation kind, if this schema defines one.
       * @example
       * ```ts
       * import { OperationTypeNode } from 'graphql/language';
       * import { buildSchema } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       *
       *   type Mutation {
       *     setGreeting(value: String!): String
       *   }
       * `);
       *
       * schema.getRootType(OperationTypeNode.QUERY)?.name; // => 'Query'
       * schema.getRootType(OperationTypeNode.MUTATION)?.name; // => 'Mutation'
       * schema.getRootType(OperationTypeNode.SUBSCRIPTION); // => undefined
       * ```
       */
      getRootType(operation) {
        switch (operation) {
          case _ast.OperationTypeNode.QUERY:
            return this.getQueryType();
          case _ast.OperationTypeNode.MUTATION:
            return this.getMutationType();
          case _ast.OperationTypeNode.SUBSCRIPTION:
            return this.getSubscriptionType();
        }
      }
      /**
       * Returns all named types known to this schema.
       * @returns A map of schema types keyed by type name.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type User {
       *     name: String
       *   }
       *
       *   type Query {
       *     viewer: User
       *   }
       * `);
       *
       * const typeMap = schema.getTypeMap();
       *
       * typeMap.User.name; // => 'User'
       * typeMap.Query.name; // => 'Query'
       * typeMap.String.name; // => 'String'
       * ```
       */
      getTypeMap() {
        return this._typeMap;
      }
      /**
       * Returns the named type with the provided name.
       * @param name - The GraphQL name to look up.
       * @returns The named schema type, if one exists.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type User {
       *     name: String
       *   }
       *
       *   type Query {
       *     viewer: User
       *   }
       * `);
       *
       * schema.getType('User')?.toString(); // => 'User'
       * schema.getType('Missing'); // => undefined
       * ```
       */
      getType(name) {
        return this.getTypeMap()[name];
      }
      /**
       * Returns object types that may be returned for an abstract type.
       * @param abstractType - Interface or union type to inspect.
       * @returns Object types that may satisfy the abstract type.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertInterfaceType, assertUnionType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   interface Node {
       *     id: ID!
       *   }
       *
       *   type User implements Node {
       *     id: ID!
       *   }
       *
       *   type Organization implements Node {
       *     id: ID!
       *   }
       *
       *   union SearchResult = User | Organization
       *
       *   type Query {
       *     node: Node
       *     search: [SearchResult]
       *   }
       * `);
       *
       * const Node = assertInterfaceType(schema.getType('Node'));
       * const SearchResult = assertUnionType(schema.getType('SearchResult'));
       *
       * schema.getPossibleTypes(Node).map((type) => type.name); // => ['User', 'Organization']
       * schema.getPossibleTypes(SearchResult).map((type) => type.name); // => ['User', 'Organization']
       * ```
       */
      getPossibleTypes(abstractType) {
        return (0, _definition.isUnionType)(abstractType) ? abstractType.getTypes() : this.getImplementations(abstractType).objects;
      }
      /**
       * Returns objects and interfaces that implement an interface type.
       * @param interfaceType - Interface type to inspect.
       * @returns Object and interface implementations of the interface.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertInterfaceType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   interface Resource {
       *     url: String!
       *   }
       *
       *   interface Image implements Resource {
       *     url: String!
       *     width: Int
       *   }
       *
       *   type Photo implements Resource & Image {
       *     url: String!
       *     width: Int
       *   }
       *
       *   type Query {
       *     resource: Resource
       *   }
       * `);
       *
       * const Resource = assertInterfaceType(schema.getType('Resource'));
       * const implementations = schema.getImplementations(Resource);
       *
       * implementations.interfaces.map((type) => type.name); // => ['Image']
       * implementations.objects.map((type) => type.name); // => ['Photo']
       * ```
       */
      getImplementations(interfaceType) {
        const implementations = this._implementationsMap[interfaceType.name];
        return implementations !== null && implementations !== void 0 ? implementations : {
          objects: [],
          interfaces: []
        };
      }
      /**
       * Returns whether one type is a possible runtime subtype of an abstract type.
       * @param abstractType - Interface or union type to inspect.
       * @param maybeSubType - Object or interface type to test as a possible subtype.
       * @returns True when the subtype may satisfy the abstract type.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { assertInterfaceType, assertObjectType } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   interface Node {
       *     id: ID!
       *   }
       *
       *   type User implements Node {
       *     id: ID!
       *   }
       *
       *   type Review {
       *     body: String
       *   }
       *
       *   type Query {
       *     node: Node
       *     review: Review
       *   }
       * `);
       *
       * const Node = assertInterfaceType(schema.getType('Node'));
       * const User = assertObjectType(schema.getType('User'));
       * const Review = assertObjectType(schema.getType('Review'));
       *
       * schema.isSubType(Node, User); // => true
       * schema.isSubType(Node, Review); // => false
       * ```
       */
      isSubType(abstractType, maybeSubType) {
        let map = this._subTypeMap[abstractType.name];
        if (map === void 0) {
          map = /* @__PURE__ */ Object.create(null);
          if ((0, _definition.isUnionType)(abstractType)) {
            for (const type of abstractType.getTypes()) {
              map[type.name] = true;
            }
          } else {
            const implementations = this.getImplementations(abstractType);
            for (const type of implementations.objects) {
              map[type.name] = true;
            }
            for (const type of implementations.interfaces) {
              map[type.name] = true;
            }
          }
          this._subTypeMap[abstractType.name] = map;
        }
        return map[maybeSubType.name] !== void 0;
      }
      /**
       * Returns directives available in this schema.
       * @returns Directives available in this schema.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   directive @upper on FIELD_DEFINITION
       *
       *   type Query {
       *     greeting: String @upper
       *   }
       * `);
       *
       * schema.getDirectives().map((directive) => directive.name); // => ['include', 'skip', 'deprecated', 'specifiedBy', 'oneOf', 'upper']
       * ```
       */
      getDirectives() {
        return this._directives;
      }
      /**
       * Returns the current directive definition.
       * @param name - The GraphQL name to look up.
       * @returns The current directive definition, if known.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   directive @upper on FIELD_DEFINITION
       *
       *   type Query {
       *     greeting: String @upper
       *   }
       * `);
       *
       * schema.getDirective('upper')?.name; // => 'upper'
       * schema.getDirective('missing'); // => undefined
       * ```
       */
      getDirective(name) {
        return this.getDirectives().find((directive) => directive.name === name);
      }
      /**
       * Returns a normalized configuration object for this object.
       *
       * The returned config preserves the original `assumeValid` flag so the schema
       * can be recreated with the same validation behavior.
       * @returns A configuration object that can be used to recreate this object.
       * @example
       * ```ts
       * import { buildSchema } from 'graphql/utilities';
       * import { GraphQLSchema } from 'graphql/type';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       *
       * const config = schema.toConfig();
       * const schemaCopy = new GraphQLSchema(config);
       *
       * config.query?.name; // => 'Query'
       * schemaCopy.getQueryType()?.name; // => 'Query'
       * ```
       */
      toConfig() {
        return {
          description: this.description,
          query: this.getQueryType(),
          mutation: this.getMutationType(),
          subscription: this.getSubscriptionType(),
          types: Object.values(this.getTypeMap()),
          directives: this.getDirectives(),
          extensions: this.extensions,
          astNode: this.astNode,
          extensionASTNodes: this.extensionASTNodes,
          assumeValid: this.__validationErrors !== void 0
        };
      }
    };
    exports2.GraphQLSchema = GraphQLSchema;
    function collectReferencedTypes(type, typeSet) {
      const namedType = (0, _definition.getNamedType)(type);
      if (!typeSet.has(namedType)) {
        typeSet.add(namedType);
        if ((0, _definition.isUnionType)(namedType)) {
          for (const memberType of namedType.getTypes()) {
            collectReferencedTypes(memberType, typeSet);
          }
        } else if ((0, _definition.isObjectType)(namedType) || (0, _definition.isInterfaceType)(namedType)) {
          for (const interfaceType of namedType.getInterfaces()) {
            collectReferencedTypes(interfaceType, typeSet);
          }
          for (const field of Object.values(namedType.getFields())) {
            collectReferencedTypes(field.type, typeSet);
            for (const arg of field.args) {
              collectReferencedTypes(arg.type, typeSet);
            }
          }
        } else if ((0, _definition.isInputObjectType)(namedType)) {
          for (const field of Object.values(namedType.getFields())) {
            collectReferencedTypes(field.type, typeSet);
          }
        }
      }
      return typeSet;
    }
  }
});

// node_modules/graphql/type/validate.js
var require_validate = __commonJS({
  "node_modules/graphql/type/validate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.assertValidSchema = assertValidSchema;
    exports2.validateSchema = validateSchema;
    var _inspect2 = require_inspect();
    var _GraphQLError = require_GraphQLError();
    var _ast = require_ast();
    var _typeComparators = require_typeComparators();
    var _definition = require_definition();
    var _directives = require_directives();
    var _introspection = require_introspection();
    var _schema = require_schema();
    function validateSchema(schema) {
      (0, _schema.assertSchema)(schema);
      if (schema.__validationErrors) {
        return schema.__validationErrors;
      }
      const context = new SchemaValidationContext(schema);
      validateRootTypes(context);
      validateDirectives(context);
      validateTypes(context);
      const errors = context.getErrors();
      schema.__validationErrors = errors;
      return errors;
    }
    function assertValidSchema(schema) {
      const errors = validateSchema(schema);
      if (errors.length !== 0) {
        throw new Error(errors.map((error) => error.message).join("\n\n"));
      }
    }
    var SchemaValidationContext = class {
      constructor(schema) {
        this._errors = [];
        this.schema = schema;
      }
      reportError(message, nodes) {
        const _nodes = Array.isArray(nodes) ? nodes.filter(Boolean) : nodes;
        this._errors.push(
          new _GraphQLError.GraphQLError(message, {
            nodes: _nodes
          })
        );
      }
      getErrors() {
        return this._errors;
      }
    };
    function validateRootTypes(context) {
      const schema = context.schema;
      const queryType = schema.getQueryType();
      if (!queryType) {
        context.reportError("Query root type must be provided.", schema.astNode);
      } else if (!(0, _definition.isObjectType)(queryType)) {
        var _getOperationTypeNode;
        context.reportError(
          `Query root type must be Object type, it cannot be ${(0, _inspect2.inspect)(queryType)}.`,
          (_getOperationTypeNode = getOperationTypeNode(
            schema,
            _ast.OperationTypeNode.QUERY
          )) !== null && _getOperationTypeNode !== void 0 ? _getOperationTypeNode : queryType.astNode
        );
      }
      const mutationType = schema.getMutationType();
      if (mutationType && !(0, _definition.isObjectType)(mutationType)) {
        var _getOperationTypeNode2;
        context.reportError(
          `Mutation root type must be Object type if provided, it cannot be ${(0, _inspect2.inspect)(mutationType)}.`,
          (_getOperationTypeNode2 = getOperationTypeNode(
            schema,
            _ast.OperationTypeNode.MUTATION
          )) !== null && _getOperationTypeNode2 !== void 0 ? _getOperationTypeNode2 : mutationType.astNode
        );
      }
      const subscriptionType = schema.getSubscriptionType();
      if (subscriptionType && !(0, _definition.isObjectType)(subscriptionType)) {
        var _getOperationTypeNode3;
        context.reportError(
          `Subscription root type must be Object type if provided, it cannot be ${(0, _inspect2.inspect)(subscriptionType)}.`,
          (_getOperationTypeNode3 = getOperationTypeNode(
            schema,
            _ast.OperationTypeNode.SUBSCRIPTION
          )) !== null && _getOperationTypeNode3 !== void 0 ? _getOperationTypeNode3 : subscriptionType.astNode
        );
      }
    }
    function getOperationTypeNode(schema, operation) {
      var _flatMap$find;
      return (_flatMap$find = [schema.astNode, ...schema.extensionASTNodes].flatMap(
        // FIXME: https://github.com/graphql/graphql-js/issues/2203
        (schemaNode) => {
          var _schemaNode$operation;
          return (
            /* c8 ignore next */
            (_schemaNode$operation = schemaNode === null || schemaNode === void 0 ? void 0 : schemaNode.operationTypes) !== null && _schemaNode$operation !== void 0 ? _schemaNode$operation : []
          );
        }
      ).find((operationNode) => operationNode.operation === operation)) === null || _flatMap$find === void 0 ? void 0 : _flatMap$find.type;
    }
    function validateDirectives(context) {
      for (const directive of context.schema.getDirectives()) {
        if (!(0, _directives.isDirective)(directive)) {
          context.reportError(
            `Expected directive but got: ${(0, _inspect2.inspect)(directive)}.`,
            directive === null || directive === void 0 ? void 0 : directive.astNode
          );
          continue;
        }
        validateName(context, directive);
        if (directive.locations.length === 0) {
          context.reportError(
            `Directive @${directive.name} must include 1 or more locations.`,
            directive.astNode
          );
        }
        for (const arg of directive.args) {
          validateName(context, arg);
          if (!(0, _definition.isInputType)(arg.type)) {
            context.reportError(
              `The type of @${directive.name}(${arg.name}:) must be Input Type but got: ${(0, _inspect2.inspect)(arg.type)}.`,
              arg.astNode
            );
          }
          if ((0, _definition.isRequiredArgument)(arg) && arg.deprecationReason != null) {
            var _arg$astNode;
            context.reportError(
              `Required argument @${directive.name}(${arg.name}:) cannot be deprecated.`,
              [
                getDeprecatedDirectiveNode(arg.astNode),
                (_arg$astNode = arg.astNode) === null || _arg$astNode === void 0 ? void 0 : _arg$astNode.type
              ]
            );
          }
        }
      }
    }
    function validateName(context, node) {
      if (node.name.startsWith("__")) {
        context.reportError(
          `Name "${node.name}" must not begin with "__", which is reserved by GraphQL introspection.`,
          node.astNode
        );
      }
    }
    function validateTypes(context) {
      const validateInputObjectCircularRefs = createInputObjectCircularRefsValidator(context);
      const typeMap = context.schema.getTypeMap();
      for (const type of Object.values(typeMap)) {
        if (!(0, _definition.isNamedType)(type)) {
          context.reportError(
            `Expected GraphQL named type but got: ${(0, _inspect2.inspect)(type)}.`,
            type.astNode
          );
          continue;
        }
        if (!(0, _introspection.isIntrospectionType)(type)) {
          validateName(context, type);
        }
        if ((0, _definition.isObjectType)(type)) {
          validateFields(context, type);
          validateInterfaces(context, type);
        } else if ((0, _definition.isInterfaceType)(type)) {
          validateFields(context, type);
          validateInterfaces(context, type);
        } else if ((0, _definition.isUnionType)(type)) {
          validateUnionMembers(context, type);
        } else if ((0, _definition.isEnumType)(type)) {
          validateEnumValues(context, type);
        } else if ((0, _definition.isInputObjectType)(type)) {
          validateInputFields(context, type);
          validateInputObjectCircularRefs(type);
        }
      }
    }
    function validateFields(context, type) {
      const fields = Object.values(type.getFields());
      if (fields.length === 0) {
        context.reportError(`Type ${type.name} must define one or more fields.`, [
          type.astNode,
          ...type.extensionASTNodes
        ]);
      }
      for (const field of fields) {
        validateName(context, field);
        if (!(0, _definition.isOutputType)(field.type)) {
          var _field$astNode;
          context.reportError(
            `The type of ${type.name}.${field.name} must be Output Type but got: ${(0, _inspect2.inspect)(field.type)}.`,
            (_field$astNode = field.astNode) === null || _field$astNode === void 0 ? void 0 : _field$astNode.type
          );
        }
        for (const arg of field.args) {
          const argName = arg.name;
          validateName(context, arg);
          if (!(0, _definition.isInputType)(arg.type)) {
            var _arg$astNode2;
            context.reportError(
              `The type of ${type.name}.${field.name}(${argName}:) must be Input Type but got: ${(0, _inspect2.inspect)(arg.type)}.`,
              (_arg$astNode2 = arg.astNode) === null || _arg$astNode2 === void 0 ? void 0 : _arg$astNode2.type
            );
          }
          if ((0, _definition.isRequiredArgument)(arg) && arg.deprecationReason != null) {
            var _arg$astNode3;
            context.reportError(
              `Required argument ${type.name}.${field.name}(${argName}:) cannot be deprecated.`,
              [
                getDeprecatedDirectiveNode(arg.astNode),
                (_arg$astNode3 = arg.astNode) === null || _arg$astNode3 === void 0 ? void 0 : _arg$astNode3.type
              ]
            );
          }
        }
      }
    }
    function validateInterfaces(context, type) {
      const ifaceTypeNames = /* @__PURE__ */ Object.create(null);
      for (const iface of type.getInterfaces()) {
        if (!(0, _definition.isInterfaceType)(iface)) {
          context.reportError(
            `Type ${(0, _inspect2.inspect)(
              type
            )} must only implement Interface types, it cannot implement ${(0, _inspect2.inspect)(iface)}.`,
            getAllImplementsInterfaceNodes(type, iface)
          );
          continue;
        }
        if (type === iface) {
          context.reportError(
            `Type ${type.name} cannot implement itself because it would create a circular reference.`,
            getAllImplementsInterfaceNodes(type, iface)
          );
          continue;
        }
        if (ifaceTypeNames[iface.name]) {
          context.reportError(
            `Type ${type.name} can only implement ${iface.name} once.`,
            getAllImplementsInterfaceNodes(type, iface)
          );
          continue;
        }
        ifaceTypeNames[iface.name] = true;
        validateTypeImplementsAncestors(context, type, iface);
        validateTypeImplementsInterface(context, type, iface);
      }
    }
    function validateTypeImplementsInterface(context, type, iface) {
      const typeFieldMap = type.getFields();
      for (const ifaceField of Object.values(iface.getFields())) {
        const fieldName = ifaceField.name;
        const typeField = typeFieldMap[fieldName];
        if (!typeField) {
          context.reportError(
            `Interface field ${iface.name}.${fieldName} expected but ${type.name} does not provide it.`,
            [ifaceField.astNode, type.astNode, ...type.extensionASTNodes]
          );
          continue;
        }
        if (!(0, _typeComparators.isTypeSubTypeOf)(
          context.schema,
          typeField.type,
          ifaceField.type
        )) {
          var _ifaceField$astNode, _typeField$astNode;
          context.reportError(
            `Interface field ${iface.name}.${fieldName} expects type ${(0, _inspect2.inspect)(ifaceField.type)} but ${type.name}.${fieldName} is type ${(0, _inspect2.inspect)(typeField.type)}.`,
            [
              (_ifaceField$astNode = ifaceField.astNode) === null || _ifaceField$astNode === void 0 ? void 0 : _ifaceField$astNode.type,
              (_typeField$astNode = typeField.astNode) === null || _typeField$astNode === void 0 ? void 0 : _typeField$astNode.type
            ]
          );
        }
        for (const ifaceArg of ifaceField.args) {
          const argName = ifaceArg.name;
          const typeArg = typeField.args.find((arg) => arg.name === argName);
          if (!typeArg) {
            context.reportError(
              `Interface field argument ${iface.name}.${fieldName}(${argName}:) expected but ${type.name}.${fieldName} does not provide it.`,
              [ifaceArg.astNode, typeField.astNode]
            );
            continue;
          }
          if (!(0, _typeComparators.isEqualType)(ifaceArg.type, typeArg.type)) {
            var _ifaceArg$astNode, _typeArg$astNode;
            context.reportError(
              `Interface field argument ${iface.name}.${fieldName}(${argName}:) expects type ${(0, _inspect2.inspect)(ifaceArg.type)} but ${type.name}.${fieldName}(${argName}:) is type ${(0, _inspect2.inspect)(typeArg.type)}.`,
              [
                (_ifaceArg$astNode = ifaceArg.astNode) === null || _ifaceArg$astNode === void 0 ? void 0 : _ifaceArg$astNode.type,
                (_typeArg$astNode = typeArg.astNode) === null || _typeArg$astNode === void 0 ? void 0 : _typeArg$astNode.type
              ]
            );
          }
        }
        for (const typeArg of typeField.args) {
          const argName = typeArg.name;
          const ifaceArg = ifaceField.args.find((arg) => arg.name === argName);
          if (!ifaceArg && (0, _definition.isRequiredArgument)(typeArg)) {
            context.reportError(
              `Object field ${type.name}.${fieldName} includes required argument ${argName} that is missing from the Interface field ${iface.name}.${fieldName}.`,
              [typeArg.astNode, ifaceField.astNode]
            );
          }
        }
      }
    }
    function validateTypeImplementsAncestors(context, type, iface) {
      const ifaceInterfaces = type.getInterfaces();
      for (const transitive of iface.getInterfaces()) {
        if (!ifaceInterfaces.includes(transitive)) {
          context.reportError(
            transitive === type ? `Type ${type.name} cannot implement ${iface.name} because it would create a circular reference.` : `Type ${type.name} must implement ${transitive.name} because it is implemented by ${iface.name}.`,
            [
              ...getAllImplementsInterfaceNodes(iface, transitive),
              ...getAllImplementsInterfaceNodes(type, iface)
            ]
          );
        }
      }
    }
    function validateUnionMembers(context, union) {
      const memberTypes = union.getTypes();
      if (memberTypes.length === 0) {
        context.reportError(
          `Union type ${union.name} must define one or more member types.`,
          [union.astNode, ...union.extensionASTNodes]
        );
      }
      const includedTypeNames = /* @__PURE__ */ Object.create(null);
      for (const memberType of memberTypes) {
        if (includedTypeNames[memberType.name]) {
          context.reportError(
            `Union type ${union.name} can only include type ${memberType.name} once.`,
            getUnionMemberTypeNodes(union, memberType.name)
          );
          continue;
        }
        includedTypeNames[memberType.name] = true;
        if (!(0, _definition.isObjectType)(memberType)) {
          context.reportError(
            `Union type ${union.name} can only include Object types, it cannot include ${(0, _inspect2.inspect)(memberType)}.`,
            getUnionMemberTypeNodes(union, String(memberType))
          );
        }
      }
    }
    function validateEnumValues(context, enumType) {
      const enumValues = enumType.getValues();
      if (enumValues.length === 0) {
        context.reportError(
          `Enum type ${enumType.name} must define one or more values.`,
          [enumType.astNode, ...enumType.extensionASTNodes]
        );
      }
      for (const enumValue of enumValues) {
        validateName(context, enumValue);
      }
    }
    function validateInputFields(context, inputObj) {
      const fields = Object.values(inputObj.getFields());
      if (fields.length === 0) {
        context.reportError(
          `Input Object type ${inputObj.name} must define one or more fields.`,
          [inputObj.astNode, ...inputObj.extensionASTNodes]
        );
      }
      for (const field of fields) {
        validateName(context, field);
        if (!(0, _definition.isInputType)(field.type)) {
          var _field$astNode2;
          context.reportError(
            `The type of ${inputObj.name}.${field.name} must be Input Type but got: ${(0, _inspect2.inspect)(field.type)}.`,
            (_field$astNode2 = field.astNode) === null || _field$astNode2 === void 0 ? void 0 : _field$astNode2.type
          );
        }
        if ((0, _definition.isRequiredInputField)(field) && field.deprecationReason != null) {
          var _field$astNode3;
          context.reportError(
            `Required input field ${inputObj.name}.${field.name} cannot be deprecated.`,
            [
              getDeprecatedDirectiveNode(field.astNode),
              (_field$astNode3 = field.astNode) === null || _field$astNode3 === void 0 ? void 0 : _field$astNode3.type
            ]
          );
        }
        if (inputObj.isOneOf) {
          validateOneOfInputObjectField(inputObj, field, context);
        }
      }
    }
    function validateOneOfInputObjectField(type, field, context) {
      if ((0, _definition.isNonNullType)(field.type)) {
        var _field$astNode4;
        context.reportError(
          `OneOf input field ${type.name}.${field.name} must be nullable.`,
          (_field$astNode4 = field.astNode) === null || _field$astNode4 === void 0 ? void 0 : _field$astNode4.type
        );
      }
      if (field.defaultValue !== void 0) {
        context.reportError(
          `OneOf input field ${type.name}.${field.name} cannot have a default value.`,
          field.astNode
        );
      }
    }
    function createInputObjectCircularRefsValidator(context) {
      const visitedTypes = /* @__PURE__ */ Object.create(null);
      const fieldPath = [];
      const fieldPathIndexByTypeName = /* @__PURE__ */ Object.create(null);
      return detectCycleRecursive;
      function detectCycleRecursive(inputObj) {
        if (visitedTypes[inputObj.name]) {
          return;
        }
        visitedTypes[inputObj.name] = true;
        fieldPathIndexByTypeName[inputObj.name] = fieldPath.length;
        const fields = Object.values(inputObj.getFields());
        for (const field of fields) {
          if ((0, _definition.isNonNullType)(field.type) && (0, _definition.isInputObjectType)(field.type.ofType)) {
            const fieldType = field.type.ofType;
            const cycleIndex = fieldPathIndexByTypeName[fieldType.name];
            fieldPath.push(field);
            if (cycleIndex === void 0) {
              detectCycleRecursive(fieldType);
            } else {
              const cyclePath = fieldPath.slice(cycleIndex);
              const pathStr = cyclePath.map((fieldObj) => fieldObj.name).join(".");
              context.reportError(
                `Cannot reference Input Object "${fieldType.name}" within itself through a series of non-null fields: "${pathStr}".`,
                cyclePath.map((fieldObj) => fieldObj.astNode)
              );
            }
            fieldPath.pop();
          }
        }
        fieldPathIndexByTypeName[inputObj.name] = void 0;
      }
    }
    function getAllImplementsInterfaceNodes(type, iface) {
      const { astNode, extensionASTNodes } = type;
      const nodes = astNode != null ? [astNode, ...extensionASTNodes] : extensionASTNodes;
      return nodes.flatMap((typeNode) => {
        var _typeNode$interfaces;
        return (
          /* c8 ignore next */
          (_typeNode$interfaces = typeNode.interfaces) !== null && _typeNode$interfaces !== void 0 ? _typeNode$interfaces : []
        );
      }).filter((ifaceNode) => ifaceNode.name.value === iface.name);
    }
    function getUnionMemberTypeNodes(union, typeName) {
      const { astNode, extensionASTNodes } = union;
      const nodes = astNode != null ? [astNode, ...extensionASTNodes] : extensionASTNodes;
      return nodes.flatMap((unionNode) => {
        var _unionNode$types;
        return (
          /* c8 ignore next */
          (_unionNode$types = unionNode.types) !== null && _unionNode$types !== void 0 ? _unionNode$types : []
        );
      }).filter((typeNode) => typeNode.name.value === typeName);
    }
    function getDeprecatedDirectiveNode(definitionNode) {
      var _definitionNode$direc;
      return definitionNode === null || definitionNode === void 0 ? void 0 : (_definitionNode$direc = definitionNode.directives) === null || _definitionNode$direc === void 0 ? void 0 : _definitionNode$direc.find(
        (node) => node.name.value === _directives.GraphQLDeprecatedDirective.name
      );
    }
  }
});

// node_modules/graphql/utilities/typeFromAST.js
var require_typeFromAST = __commonJS({
  "node_modules/graphql/utilities/typeFromAST.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.typeFromAST = typeFromAST;
    var _kinds = require_kinds();
    var _definition = require_definition();
    function typeFromAST(schema, typeNode) {
      switch (typeNode.kind) {
        case _kinds.Kind.LIST_TYPE: {
          const innerType = typeFromAST(schema, typeNode.type);
          return innerType && new _definition.GraphQLList(innerType);
        }
        case _kinds.Kind.NON_NULL_TYPE: {
          const innerType = typeFromAST(schema, typeNode.type);
          return innerType && new _definition.GraphQLNonNull(innerType);
        }
        case _kinds.Kind.NAMED_TYPE:
          return schema.getType(typeNode.name.value);
      }
    }
  }
});

// node_modules/graphql/utilities/TypeInfo.js
var require_TypeInfo = __commonJS({
  "node_modules/graphql/utilities/TypeInfo.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.TypeInfo = void 0;
    exports2.visitWithTypeInfo = visitWithTypeInfo;
    var _ast = require_ast();
    var _kinds = require_kinds();
    var _visitor = require_visitor();
    var _definition = require_definition();
    var _introspection = require_introspection();
    var _typeFromAST = require_typeFromAST();
    var TypeInfo = class {
      /**
       * Creates a TypeInfo instance.
       * @param schema - Schema used for type lookups.
       * @param initialType - Optional type to use at the start of traversal.
       * @param getFieldDefFn - Optional field definition lookup override.
       * @example
       * ```ts
       * // Track field types during a visitWithTypeInfo traversal.
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema } from 'graphql/utilities';
       * import { TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * const seenTypes = [];
       *
       * visit(
       *   parse('{ greeting }'),
       *   visitWithTypeInfo(typeInfo, {
       *     Field: () => {
       *       seenTypes.push(String(typeInfo.getType()));
       *     },
       *   }),
       * );
       *
       * seenTypes; // => ['String']
       * ```
       * @example
       * ```ts
       * // This variant starts from an initial type and supplies a field definition resolver.
       * import { Kind } from 'graphql/language';
       * import { GraphQLString } from 'graphql/type';
       * import { buildSchema, TypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema, schema.getQueryType(), () => ({
       *   name: 'virtualGreeting',
       *   description: undefined,
       *   type: GraphQLString,
       *   args: [],
       *   resolve: undefined,
       *   subscribe: undefined,
       *   deprecationReason: undefined,
       *   extensions: Object.create(null),
       *   astNode: undefined,
       * }));
       *
       * typeInfo.enter({
       *   kind: Kind.SELECTION_SET,
       *   selections: [],
       * });
       * typeInfo.enter({
       *   kind: Kind.FIELD,
       *   name: { kind: Kind.NAME, value: 'ignored' },
       * });
       *
       * typeInfo.getFieldDef()?.name; // => 'virtualGreeting'
       * String(typeInfo.getType()); // => 'String'
       * ```
       */
      constructor(schema, initialType, getFieldDefFn) {
        this._schema = schema;
        this._typeStack = [];
        this._parentTypeStack = [];
        this._inputTypeStack = [];
        this._fieldDefStack = [];
        this._defaultValueStack = [];
        this._directive = null;
        this._argument = null;
        this._enumValue = null;
        this._getFieldDef = getFieldDefFn !== null && getFieldDefFn !== void 0 ? getFieldDefFn : getFieldDef;
        if (initialType) {
          if ((0, _definition.isInputType)(initialType)) {
            this._inputTypeStack.push(initialType);
          }
          if ((0, _definition.isCompositeType)(initialType)) {
            this._parentTypeStack.push(initialType);
          }
          if ((0, _definition.isOutputType)(initialType)) {
            this._typeStack.push(initialType);
          }
        }
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "TypeInfo";
      }
      /**
       * Returns the current output type at this point in traversal.
       * @returns The current output type, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     viewer: User
       *   }
       *
       *   type User {
       *     name: String
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * const fieldTypes = {};
       *
       * visit(
       *   parse('{ viewer { name } }'),
       *   visitWithTypeInfo(typeInfo, {
       *     Field: (node) => {
       *       fieldTypes[node.name.value] = String(typeInfo.getType());
       *     },
       *   }),
       * );
       *
       * fieldTypes; // => { viewer: 'User', name: 'String' }
       * ```
       */
      getType() {
        if (this._typeStack.length > 0) {
          return this._typeStack[this._typeStack.length - 1];
        }
      }
      /**
       * Returns the current parent composite type.
       * @returns The current parent composite type, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     viewer: User
       *   }
       *
       *   type User {
       *     name: String
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * const parentTypes = {};
       *
       * visit(
       *   parse('{ viewer { name } }'),
       *   visitWithTypeInfo(typeInfo, {
       *     Field: (node) => {
       *       parentTypes[node.name.value] = String(typeInfo.getParentType());
       *     },
       *   }),
       * );
       *
       * parentTypes; // => { viewer: 'Query', name: 'User' }
       * ```
       */
      getParentType() {
        if (this._parentTypeStack.length > 0) {
          return this._parentTypeStack[this._parentTypeStack.length - 1];
        }
      }
      /**
       * Returns the current input type at this point in traversal.
       * @returns The current input type, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     reviews(stars: Int!, sort: Sort = NEWEST): [String]
       *   }
       *
       *   enum Sort {
       *     NEWEST
       *     OLDEST
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * const inputTypes = {};
       *
       * visit(
       *   parse('{ reviews(stars: 5, sort: OLDEST) }'),
       *   visitWithTypeInfo(typeInfo, {
       *     Argument: (node) => {
       *       inputTypes[node.name.value] = String(typeInfo.getInputType());
       *     },
       *   }),
       * );
       *
       * inputTypes; // => { stars: 'Int!', sort: 'Sort' }
       * ```
       */
      getInputType() {
        if (this._inputTypeStack.length > 0) {
          return this._inputTypeStack[this._inputTypeStack.length - 1];
        }
      }
      /**
       * Returns the parent input type for the current input position.
       * @returns The parent input type, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   input ReviewFilter {
       *     stars: Int!
       *   }
       *
       *   type Query {
       *     reviews(filter: ReviewFilter): [String]
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * const parentInputTypes = {};
       *
       * visit(
       *   parse('{ reviews(filter: { stars: 5 }) }'),
       *   visitWithTypeInfo(typeInfo, {
       *     ObjectField: (node) => {
       *       parentInputTypes[node.name.value] = String(typeInfo.getParentInputType());
       *     },
       *   }),
       * );
       *
       * parentInputTypes; // => { stars: 'ReviewFilter' }
       * ```
       */
      getParentInputType() {
        if (this._inputTypeStack.length > 1) {
          return this._inputTypeStack[this._inputTypeStack.length - 2];
        }
      }
      /**
       * Returns the current field definition.
       * @returns The current field definition, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * let fieldName;
       *
       * visit(
       *   parse('{ greeting }'),
       *   visitWithTypeInfo(typeInfo, {
       *     Field: () => {
       *       fieldName = typeInfo.getFieldDef()?.name;
       *     },
       *   }),
       * );
       *
       * fieldName; // => 'greeting'
       * ```
       */
      getFieldDef() {
        if (this._fieldDefStack.length > 0) {
          return this._fieldDefStack[this._fieldDefStack.length - 1];
        }
      }
      /**
       * Returns the default value for the current input position.
       * @returns The current default value, if one is available.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     reviews(limit: Int = 10): [String]
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * let defaultLimit;
       *
       * visit(
       *   parse('{ reviews(limit: 5) }'),
       *   visitWithTypeInfo(typeInfo, {
       *     Argument: () => {
       *       defaultLimit = typeInfo.getDefaultValue();
       *     },
       *   }),
       * );
       *
       * defaultLimit; // => 10
       * ```
       */
      getDefaultValue() {
        if (this._defaultValueStack.length > 0) {
          return this._defaultValueStack[this._defaultValueStack.length - 1];
        }
      }
      /**
       * Returns the current directive definition.
       * @returns The current directive definition, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * let directiveName;
       *
       * visit(
       *   parse('{ greeting @include(if: true) }'),
       *   visitWithTypeInfo(typeInfo, {
       *     Directive: () => {
       *       directiveName = typeInfo.getDirective()?.name;
       *     },
       *   }),
       * );
       *
       * directiveName; // => 'include'
       * ```
       */
      getDirective() {
        return this._directive;
      }
      /**
       * Returns the current argument definition.
       * @returns The current argument definition, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     reviews(limit: Int = 10): [String]
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * let argumentName;
       *
       * visit(
       *   parse('{ reviews(limit: 5) }'),
       *   visitWithTypeInfo(typeInfo, {
       *     Argument: () => {
       *       argumentName = typeInfo.getArgument()?.name;
       *     },
       *   }),
       * );
       *
       * argumentName; // => 'limit'
       * ```
       */
      getArgument() {
        return this._argument;
      }
      /**
       * Returns the current enum value definition.
       * @returns The current enum value definition, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   enum Sort {
       *     NEWEST
       *     OLDEST
       *   }
       *
       *   type Query {
       *     reviews(sort: Sort = NEWEST): [String]
       *   }
       * `);
       * const typeInfo = new TypeInfo(schema);
       * let enumValueName;
       *
       * visit(
       *   parse('{ reviews(sort: OLDEST) }'),
       *   visitWithTypeInfo(typeInfo, {
       *     EnumValue: () => {
       *       enumValueName = typeInfo.getEnumValue()?.name;
       *     },
       *   }),
       * );
       *
       * enumValueName; // => 'OLDEST'
       * ```
       */
      getEnumValue() {
        return this._enumValue;
      }
      /**
       * Updates this TypeInfo instance for an entered AST node.
       * @param node - AST node being entered.
       * @returns Nothing.
       * @example
       * ```ts
       * import { Kind, parse } from 'graphql/language';
       * import { buildSchema, TypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const document = parse('{ greeting }');
       * const operation = document.definitions[0];
       * const selectionSet = operation.selectionSet;
       * const field = selectionSet.selections[0];
       * const typeInfo = new TypeInfo(schema);
       *
       * typeInfo.enter(operation);
       * typeInfo.enter(selectionSet);
       * typeInfo.enter(field);
       *
       * field.kind; // => Kind.FIELD
       * typeInfo.getParentType()?.name; // => 'Query'
       * String(typeInfo.getType()); // => 'String'
       * ```
       */
      enter(node) {
        const schema = this._schema;
        switch (node.kind) {
          case _kinds.Kind.SELECTION_SET: {
            const namedType = (0, _definition.getNamedType)(this.getType());
            this._parentTypeStack.push(
              (0, _definition.isCompositeType)(namedType) ? namedType : void 0
            );
            break;
          }
          case _kinds.Kind.FIELD: {
            const parentType = this.getParentType();
            let fieldDef;
            let fieldType;
            if (parentType) {
              fieldDef = this._getFieldDef(schema, parentType, node);
              if (fieldDef) {
                fieldType = fieldDef.type;
              }
            }
            this._fieldDefStack.push(fieldDef);
            this._typeStack.push(
              (0, _definition.isOutputType)(fieldType) ? fieldType : void 0
            );
            break;
          }
          case _kinds.Kind.DIRECTIVE:
            this._directive = schema.getDirective(node.name.value);
            break;
          case _kinds.Kind.OPERATION_DEFINITION: {
            const rootType = schema.getRootType(node.operation);
            this._typeStack.push(
              (0, _definition.isObjectType)(rootType) ? rootType : void 0
            );
            break;
          }
          case _kinds.Kind.INLINE_FRAGMENT:
          case _kinds.Kind.FRAGMENT_DEFINITION: {
            const typeConditionAST = node.typeCondition;
            const outputType = typeConditionAST ? (0, _typeFromAST.typeFromAST)(schema, typeConditionAST) : (0, _definition.getNamedType)(this.getType());
            this._typeStack.push(
              (0, _definition.isOutputType)(outputType) ? outputType : void 0
            );
            break;
          }
          case _kinds.Kind.VARIABLE_DEFINITION: {
            const inputType = (0, _typeFromAST.typeFromAST)(schema, node.type);
            this._inputTypeStack.push(
              (0, _definition.isInputType)(inputType) ? inputType : void 0
            );
            break;
          }
          case _kinds.Kind.ARGUMENT: {
            var _this$getDirective;
            let argDef;
            let argType;
            const fieldOrDirective = (_this$getDirective = this.getDirective()) !== null && _this$getDirective !== void 0 ? _this$getDirective : this.getFieldDef();
            if (fieldOrDirective) {
              argDef = fieldOrDirective.args.find(
                (arg) => arg.name === node.name.value
              );
              if (argDef) {
                argType = argDef.type;
              }
            }
            this._argument = argDef;
            this._defaultValueStack.push(argDef ? argDef.defaultValue : void 0);
            this._inputTypeStack.push(
              (0, _definition.isInputType)(argType) ? argType : void 0
            );
            break;
          }
          case _kinds.Kind.LIST: {
            const listType = (0, _definition.getNullableType)(this.getInputType());
            const itemType = (0, _definition.isListType)(listType) ? listType.ofType : listType;
            this._defaultValueStack.push(void 0);
            this._inputTypeStack.push(
              (0, _definition.isInputType)(itemType) ? itemType : void 0
            );
            break;
          }
          case _kinds.Kind.OBJECT_FIELD: {
            const objectType = (0, _definition.getNamedType)(this.getInputType());
            let inputFieldType;
            let inputField;
            if ((0, _definition.isInputObjectType)(objectType)) {
              inputField = objectType.getFields()[node.name.value];
              if (inputField) {
                inputFieldType = inputField.type;
              }
            }
            this._defaultValueStack.push(
              inputField ? inputField.defaultValue : void 0
            );
            this._inputTypeStack.push(
              (0, _definition.isInputType)(inputFieldType) ? inputFieldType : void 0
            );
            break;
          }
          case _kinds.Kind.ENUM: {
            const enumType = (0, _definition.getNamedType)(this.getInputType());
            let enumValue;
            if ((0, _definition.isEnumType)(enumType)) {
              enumValue = enumType.getValue(node.value);
            }
            this._enumValue = enumValue;
            break;
          }
          default:
        }
      }
      /**
       * Updates this TypeInfo instance for a left AST node.
       * @param node - AST node being entered.
       * @returns Nothing.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import { buildSchema, TypeInfo } from 'graphql/utilities';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const document = parse('{ greeting }');
       * const operation = document.definitions[0];
       * const selectionSet = operation.selectionSet;
       * const field = selectionSet.selections[0];
       * const typeInfo = new TypeInfo(schema);
       *
       * typeInfo.enter(operation);
       * typeInfo.enter(selectionSet);
       * typeInfo.enter(field);
       * String(typeInfo.getType()); // => 'String'
       *
       * typeInfo.leave(field);
       * typeInfo.getType(); // => undefined
       * ```
       */
      leave(node) {
        switch (node.kind) {
          case _kinds.Kind.SELECTION_SET:
            this._parentTypeStack.pop();
            break;
          case _kinds.Kind.FIELD:
            this._fieldDefStack.pop();
            this._typeStack.pop();
            break;
          case _kinds.Kind.DIRECTIVE:
            this._directive = null;
            break;
          case _kinds.Kind.OPERATION_DEFINITION:
          case _kinds.Kind.INLINE_FRAGMENT:
          case _kinds.Kind.FRAGMENT_DEFINITION:
            this._typeStack.pop();
            break;
          case _kinds.Kind.VARIABLE_DEFINITION:
            this._inputTypeStack.pop();
            break;
          case _kinds.Kind.ARGUMENT:
            this._argument = null;
            this._defaultValueStack.pop();
            this._inputTypeStack.pop();
            break;
          case _kinds.Kind.LIST:
          case _kinds.Kind.OBJECT_FIELD:
            this._defaultValueStack.pop();
            this._inputTypeStack.pop();
            break;
          case _kinds.Kind.ENUM:
            this._enumValue = null;
            break;
          default:
        }
      }
    };
    exports2.TypeInfo = TypeInfo;
    function getFieldDef(schema, parentType, fieldNode) {
      const name = fieldNode.name.value;
      if (name === _introspection.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
        return _introspection.SchemaMetaFieldDef;
      }
      if (name === _introspection.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
        return _introspection.TypeMetaFieldDef;
      }
      if (name === _introspection.TypeNameMetaFieldDef.name && (0, _definition.isCompositeType)(parentType)) {
        return _introspection.TypeNameMetaFieldDef;
      }
      if ((0, _definition.isObjectType)(parentType) || (0, _definition.isInterfaceType)(parentType)) {
        return parentType.getFields()[name];
      }
    }
    function visitWithTypeInfo(typeInfo, visitor) {
      return {
        enter(...args) {
          const node = args[0];
          typeInfo.enter(node);
          const fn = (0, _visitor.getEnterLeaveForKind)(visitor, node.kind).enter;
          if (fn) {
            const result = fn.apply(visitor, args);
            if (result !== void 0) {
              typeInfo.leave(node);
              if ((0, _ast.isNode)(result)) {
                typeInfo.enter(result);
              }
            }
            return result;
          }
        },
        leave(...args) {
          const node = args[0];
          const fn = (0, _visitor.getEnterLeaveForKind)(visitor, node.kind).leave;
          let result;
          if (fn) {
            result = fn.apply(visitor, args);
          }
          typeInfo.leave(node);
          return result;
        }
      };
    }
  }
});

// node_modules/graphql/language/predicates.js
var require_predicates = __commonJS({
  "node_modules/graphql/language/predicates.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.isConstValueNode = isConstValueNode;
    exports2.isDefinitionNode = isDefinitionNode;
    exports2.isExecutableDefinitionNode = isExecutableDefinitionNode;
    exports2.isSchemaCoordinateNode = isSchemaCoordinateNode;
    exports2.isSelectionNode = isSelectionNode;
    exports2.isTypeDefinitionNode = isTypeDefinitionNode;
    exports2.isTypeExtensionNode = isTypeExtensionNode;
    exports2.isTypeNode = isTypeNode;
    exports2.isTypeSystemDefinitionNode = isTypeSystemDefinitionNode;
    exports2.isTypeSystemExtensionNode = isTypeSystemExtensionNode;
    exports2.isValueNode = isValueNode;
    var _kinds = require_kinds();
    function isDefinitionNode(node) {
      return isExecutableDefinitionNode(node) || isTypeSystemDefinitionNode(node) || isTypeSystemExtensionNode(node);
    }
    function isExecutableDefinitionNode(node) {
      return node.kind === _kinds.Kind.OPERATION_DEFINITION || node.kind === _kinds.Kind.FRAGMENT_DEFINITION;
    }
    function isSelectionNode(node) {
      return node.kind === _kinds.Kind.FIELD || node.kind === _kinds.Kind.FRAGMENT_SPREAD || node.kind === _kinds.Kind.INLINE_FRAGMENT;
    }
    function isValueNode(node) {
      return node.kind === _kinds.Kind.VARIABLE || node.kind === _kinds.Kind.INT || node.kind === _kinds.Kind.FLOAT || node.kind === _kinds.Kind.STRING || node.kind === _kinds.Kind.BOOLEAN || node.kind === _kinds.Kind.NULL || node.kind === _kinds.Kind.ENUM || node.kind === _kinds.Kind.LIST || node.kind === _kinds.Kind.OBJECT;
    }
    function isConstValueNode(node) {
      return isValueNode(node) && (node.kind === _kinds.Kind.LIST ? node.values.some(isConstValueNode) : node.kind === _kinds.Kind.OBJECT ? node.fields.some((field) => isConstValueNode(field.value)) : node.kind !== _kinds.Kind.VARIABLE);
    }
    function isTypeNode(node) {
      return node.kind === _kinds.Kind.NAMED_TYPE || node.kind === _kinds.Kind.LIST_TYPE || node.kind === _kinds.Kind.NON_NULL_TYPE;
    }
    function isTypeSystemDefinitionNode(node) {
      return node.kind === _kinds.Kind.SCHEMA_DEFINITION || isTypeDefinitionNode(node) || node.kind === _kinds.Kind.DIRECTIVE_DEFINITION;
    }
    function isTypeDefinitionNode(node) {
      return node.kind === _kinds.Kind.SCALAR_TYPE_DEFINITION || node.kind === _kinds.Kind.OBJECT_TYPE_DEFINITION || node.kind === _kinds.Kind.INTERFACE_TYPE_DEFINITION || node.kind === _kinds.Kind.UNION_TYPE_DEFINITION || node.kind === _kinds.Kind.ENUM_TYPE_DEFINITION || node.kind === _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION;
    }
    function isTypeSystemExtensionNode(node) {
      return node.kind === _kinds.Kind.SCHEMA_EXTENSION || node.kind === _kinds.Kind.DIRECTIVE_EXTENSION || isTypeExtensionNode(node);
    }
    function isTypeExtensionNode(node) {
      return node.kind === _kinds.Kind.SCALAR_TYPE_EXTENSION || node.kind === _kinds.Kind.OBJECT_TYPE_EXTENSION || node.kind === _kinds.Kind.INTERFACE_TYPE_EXTENSION || node.kind === _kinds.Kind.UNION_TYPE_EXTENSION || node.kind === _kinds.Kind.ENUM_TYPE_EXTENSION || node.kind === _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION;
    }
    function isSchemaCoordinateNode(node) {
      return node.kind === _kinds.Kind.TYPE_COORDINATE || node.kind === _kinds.Kind.MEMBER_COORDINATE || node.kind === _kinds.Kind.ARGUMENT_COORDINATE || node.kind === _kinds.Kind.DIRECTIVE_COORDINATE || node.kind === _kinds.Kind.DIRECTIVE_ARGUMENT_COORDINATE;
    }
  }
});

// node_modules/graphql/validation/rules/ExecutableDefinitionsRule.js
var require_ExecutableDefinitionsRule = __commonJS({
  "node_modules/graphql/validation/rules/ExecutableDefinitionsRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.ExecutableDefinitionsRule = ExecutableDefinitionsRule;
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _predicates = require_predicates();
    function ExecutableDefinitionsRule(context) {
      return {
        Document(node) {
          for (const definition of node.definitions) {
            if (!(0, _predicates.isExecutableDefinitionNode)(definition)) {
              const defName = definition.kind === _kinds.Kind.SCHEMA_DEFINITION || definition.kind === _kinds.Kind.SCHEMA_EXTENSION ? "schema" : '"' + definition.name.value + '"';
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `The ${defName} definition is not executable.`,
                  {
                    nodes: definition
                  }
                )
              );
            }
          }
          return false;
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.js
var require_FieldsOnCorrectTypeRule = __commonJS({
  "node_modules/graphql/validation/rules/FieldsOnCorrectTypeRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.FieldsOnCorrectTypeRule = FieldsOnCorrectTypeRule;
    var _didYouMean = require_didYouMean();
    var _naturalCompare = require_naturalCompare();
    var _suggestionList = require_suggestionList();
    var _GraphQLError = require_GraphQLError();
    var _definition = require_definition();
    function FieldsOnCorrectTypeRule(context) {
      return {
        Field(node) {
          const type = context.getParentType();
          if (type) {
            const fieldDef = context.getFieldDef();
            if (!fieldDef) {
              const schema = context.getSchema();
              const fieldName = node.name.value;
              let suggestion = (0, _didYouMean.didYouMean)(
                "to use an inline fragment on",
                getSuggestedTypeNames(schema, type, fieldName)
              );
              if (suggestion === "") {
                suggestion = (0, _didYouMean.didYouMean)(
                  getSuggestedFieldNames(type, fieldName)
                );
              }
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Cannot query field "${fieldName}" on type "${type.name}".` + suggestion,
                  {
                    nodes: node
                  }
                )
              );
            }
          }
        }
      };
    }
    function getSuggestedTypeNames(schema, type, fieldName) {
      if (!(0, _definition.isAbstractType)(type)) {
        return [];
      }
      const suggestedTypes = /* @__PURE__ */ new Set();
      const usageCount = /* @__PURE__ */ Object.create(null);
      for (const possibleType of schema.getPossibleTypes(type)) {
        if (!possibleType.getFields()[fieldName]) {
          continue;
        }
        suggestedTypes.add(possibleType);
        usageCount[possibleType.name] = 1;
        for (const possibleInterface of possibleType.getInterfaces()) {
          var _usageCount$possibleI;
          if (!possibleInterface.getFields()[fieldName]) {
            continue;
          }
          suggestedTypes.add(possibleInterface);
          usageCount[possibleInterface.name] = ((_usageCount$possibleI = usageCount[possibleInterface.name]) !== null && _usageCount$possibleI !== void 0 ? _usageCount$possibleI : 0) + 1;
        }
      }
      return [...suggestedTypes].sort((typeA, typeB) => {
        const usageCountDiff = usageCount[typeB.name] - usageCount[typeA.name];
        if (usageCountDiff !== 0) {
          return usageCountDiff;
        }
        if ((0, _definition.isInterfaceType)(typeA) && schema.isSubType(typeA, typeB)) {
          return -1;
        }
        if ((0, _definition.isInterfaceType)(typeB) && schema.isSubType(typeB, typeA)) {
          return 1;
        }
        return (0, _naturalCompare.naturalCompare)(typeA.name, typeB.name);
      }).map((x) => x.name);
    }
    function getSuggestedFieldNames(type, fieldName) {
      if ((0, _definition.isObjectType)(type) || (0, _definition.isInterfaceType)(type)) {
        const possibleFieldNames = Object.keys(type.getFields());
        return (0, _suggestionList.suggestionList)(fieldName, possibleFieldNames);
      }
      return [];
    }
  }
});

// node_modules/graphql/validation/rules/FragmentsOnCompositeTypesRule.js
var require_FragmentsOnCompositeTypesRule = __commonJS({
  "node_modules/graphql/validation/rules/FragmentsOnCompositeTypesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.FragmentsOnCompositeTypesRule = FragmentsOnCompositeTypesRule;
    var _GraphQLError = require_GraphQLError();
    var _printer = require_printer();
    var _definition = require_definition();
    var _typeFromAST = require_typeFromAST();
    function FragmentsOnCompositeTypesRule(context) {
      return {
        InlineFragment(node) {
          const typeCondition = node.typeCondition;
          if (typeCondition) {
            const type = (0, _typeFromAST.typeFromAST)(
              context.getSchema(),
              typeCondition
            );
            if (type && !(0, _definition.isCompositeType)(type)) {
              const typeStr = (0, _printer.print)(typeCondition);
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Fragment cannot condition on non composite type "${typeStr}".`,
                  {
                    nodes: typeCondition
                  }
                )
              );
            }
          }
        },
        FragmentDefinition(node) {
          const type = (0, _typeFromAST.typeFromAST)(
            context.getSchema(),
            node.typeCondition
          );
          if (type && !(0, _definition.isCompositeType)(type)) {
            const typeStr = (0, _printer.print)(node.typeCondition);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Fragment "${node.name.value}" cannot condition on non composite type "${typeStr}".`,
                {
                  nodes: node.typeCondition
                }
              )
            );
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/KnownArgumentNamesRule.js
var require_KnownArgumentNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/KnownArgumentNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.KnownArgumentNamesOnDirectivesRule = KnownArgumentNamesOnDirectivesRule;
    exports2.KnownArgumentNamesRule = KnownArgumentNamesRule;
    var _didYouMean = require_didYouMean();
    var _suggestionList = require_suggestionList();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _directives = require_directives();
    function KnownArgumentNamesRule(context) {
      return {
        // eslint-disable-next-line new-cap
        ...KnownArgumentNamesOnDirectivesRule(context),
        Argument(argNode) {
          const argDef = context.getArgument();
          const fieldDef = context.getFieldDef();
          const parentType = context.getParentType();
          if (!argDef && fieldDef && parentType) {
            const argName = argNode.name.value;
            const knownArgsNames = fieldDef.args.map((arg) => arg.name);
            const suggestions = (0, _suggestionList.suggestionList)(
              argName,
              knownArgsNames
            );
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Unknown argument "${argName}" on field "${parentType.name}.${fieldDef.name}".` + (0, _didYouMean.didYouMean)(suggestions),
                {
                  nodes: argNode
                }
              )
            );
          }
        }
      };
    }
    function KnownArgumentNamesOnDirectivesRule(context) {
      const directiveArgs = /* @__PURE__ */ Object.create(null);
      const schema = context.getSchema();
      const definedDirectives = schema ? schema.getDirectives() : _directives.specifiedDirectives;
      for (const directive of definedDirectives) {
        directiveArgs[directive.name] = directive.args.map((arg) => arg.name);
      }
      const astDefinitions = context.getDocument().definitions;
      for (const def of astDefinitions) {
        if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
          var _def$arguments;
          const argsNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
          directiveArgs[def.name.value] = argsNodes.map((arg) => arg.name.value);
        }
      }
      return {
        Directive(directiveNode) {
          const directiveName = directiveNode.name.value;
          const knownArgs = directiveArgs[directiveName];
          if (directiveNode.arguments && knownArgs) {
            for (const argNode of directiveNode.arguments) {
              const argName = argNode.name.value;
              if (!knownArgs.includes(argName)) {
                const suggestions = (0, _suggestionList.suggestionList)(
                  argName,
                  knownArgs
                );
                context.reportError(
                  new _GraphQLError.GraphQLError(
                    `Unknown argument "${argName}" on directive "@${directiveName}".` + (0, _didYouMean.didYouMean)(suggestions),
                    {
                      nodes: argNode
                    }
                  )
                );
              }
            }
          }
          return false;
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/KnownDirectivesRule.js
var require_KnownDirectivesRule = __commonJS({
  "node_modules/graphql/validation/rules/KnownDirectivesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.KnownDirectivesRule = KnownDirectivesRule;
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _GraphQLError = require_GraphQLError();
    var _ast = require_ast();
    var _directiveLocation = require_directiveLocation();
    var _kinds = require_kinds();
    var _directives = require_directives();
    function KnownDirectivesRule(context) {
      const locationsMap = /* @__PURE__ */ Object.create(null);
      const schema = context.getSchema();
      const definedDirectives = schema ? schema.getDirectives() : _directives.specifiedDirectives;
      for (const directive of definedDirectives) {
        locationsMap[directive.name] = directive.locations;
      }
      const astDefinitions = context.getDocument().definitions;
      for (const def of astDefinitions) {
        if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
          locationsMap[def.name.value] = def.locations.map((name) => name.value);
        }
      }
      return {
        Directive(node, _key, _parent, _path, ancestors) {
          const name = node.name.value;
          const locations = locationsMap[name];
          if (!locations) {
            context.reportError(
              new _GraphQLError.GraphQLError(`Unknown directive "@${name}".`, {
                nodes: node
              })
            );
            return;
          }
          const candidateLocation = getDirectiveLocationForASTPath(ancestors);
          if (candidateLocation && !locations.includes(candidateLocation)) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Directive "@${name}" may not be used on ${candidateLocation}.`,
                {
                  nodes: node
                }
              )
            );
          }
        }
      };
    }
    function getDirectiveLocationForASTPath(ancestors) {
      const appliedTo = ancestors[ancestors.length - 1];
      "kind" in appliedTo || (0, _invariant.invariant)(false);
      switch (appliedTo.kind) {
        case _kinds.Kind.OPERATION_DEFINITION:
          return getDirectiveLocationForOperation(appliedTo.operation);
        case _kinds.Kind.FIELD:
          return _directiveLocation.DirectiveLocation.FIELD;
        case _kinds.Kind.FRAGMENT_SPREAD:
          return _directiveLocation.DirectiveLocation.FRAGMENT_SPREAD;
        case _kinds.Kind.INLINE_FRAGMENT:
          return _directiveLocation.DirectiveLocation.INLINE_FRAGMENT;
        case _kinds.Kind.FRAGMENT_DEFINITION:
          return _directiveLocation.DirectiveLocation.FRAGMENT_DEFINITION;
        case _kinds.Kind.VARIABLE_DEFINITION:
          return _directiveLocation.DirectiveLocation.VARIABLE_DEFINITION;
        case _kinds.Kind.SCHEMA_DEFINITION:
        case _kinds.Kind.SCHEMA_EXTENSION:
          return _directiveLocation.DirectiveLocation.SCHEMA;
        case _kinds.Kind.SCALAR_TYPE_DEFINITION:
        case _kinds.Kind.SCALAR_TYPE_EXTENSION:
          return _directiveLocation.DirectiveLocation.SCALAR;
        case _kinds.Kind.OBJECT_TYPE_DEFINITION:
        case _kinds.Kind.OBJECT_TYPE_EXTENSION:
          return _directiveLocation.DirectiveLocation.OBJECT;
        case _kinds.Kind.FIELD_DEFINITION:
          return _directiveLocation.DirectiveLocation.FIELD_DEFINITION;
        case _kinds.Kind.INTERFACE_TYPE_DEFINITION:
        case _kinds.Kind.INTERFACE_TYPE_EXTENSION:
          return _directiveLocation.DirectiveLocation.INTERFACE;
        case _kinds.Kind.UNION_TYPE_DEFINITION:
        case _kinds.Kind.UNION_TYPE_EXTENSION:
          return _directiveLocation.DirectiveLocation.UNION;
        case _kinds.Kind.ENUM_TYPE_DEFINITION:
        case _kinds.Kind.ENUM_TYPE_EXTENSION:
          return _directiveLocation.DirectiveLocation.ENUM;
        case _kinds.Kind.ENUM_VALUE_DEFINITION:
          return _directiveLocation.DirectiveLocation.ENUM_VALUE;
        case _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION:
        case _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION:
          return _directiveLocation.DirectiveLocation.INPUT_OBJECT;
        case _kinds.Kind.INPUT_VALUE_DEFINITION: {
          const parentNode = ancestors[ancestors.length - 3];
          "kind" in parentNode || (0, _invariant.invariant)(false);
          return parentNode.kind === _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION ? _directiveLocation.DirectiveLocation.INPUT_FIELD_DEFINITION : _directiveLocation.DirectiveLocation.ARGUMENT_DEFINITION;
        }
        case _kinds.Kind.DIRECTIVE_DEFINITION:
        case _kinds.Kind.DIRECTIVE_EXTENSION:
          return _directiveLocation.DirectiveLocation.DIRECTIVE_DEFINITION;
        // Not reachable, all possible types have been considered.
        /* c8 ignore next */
        default:
          (0, _invariant.invariant)(
            false,
            "Unexpected kind: " + (0, _inspect2.inspect)(appliedTo.kind)
          );
      }
    }
    function getDirectiveLocationForOperation(operation) {
      switch (operation) {
        case _ast.OperationTypeNode.QUERY:
          return _directiveLocation.DirectiveLocation.QUERY;
        case _ast.OperationTypeNode.MUTATION:
          return _directiveLocation.DirectiveLocation.MUTATION;
        case _ast.OperationTypeNode.SUBSCRIPTION:
          return _directiveLocation.DirectiveLocation.SUBSCRIPTION;
      }
    }
  }
});

// node_modules/graphql/validation/rules/KnownFragmentNamesRule.js
var require_KnownFragmentNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/KnownFragmentNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.KnownFragmentNamesRule = KnownFragmentNamesRule;
    var _GraphQLError = require_GraphQLError();
    function KnownFragmentNamesRule(context) {
      return {
        FragmentSpread(node) {
          const fragmentName = node.name.value;
          const fragment = context.getFragment(fragmentName);
          if (!fragment) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Unknown fragment "${fragmentName}".`,
                {
                  nodes: node.name
                }
              )
            );
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/KnownTypeNamesRule.js
var require_KnownTypeNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/KnownTypeNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.KnownTypeNamesRule = KnownTypeNamesRule;
    var _didYouMean = require_didYouMean();
    var _suggestionList = require_suggestionList();
    var _GraphQLError = require_GraphQLError();
    var _predicates = require_predicates();
    var _introspection = require_introspection();
    var _scalars = require_scalars();
    function KnownTypeNamesRule(context) {
      const schema = context.getSchema();
      const existingTypesMap = schema ? schema.getTypeMap() : /* @__PURE__ */ Object.create(null);
      const definedTypes = /* @__PURE__ */ Object.create(null);
      for (const def of context.getDocument().definitions) {
        if ((0, _predicates.isTypeDefinitionNode)(def)) {
          definedTypes[def.name.value] = true;
        }
      }
      const typeNames = [
        ...Object.keys(existingTypesMap),
        ...Object.keys(definedTypes)
      ];
      return {
        NamedType(node, _1, parent, _2, ancestors) {
          const typeName = node.name.value;
          if (!existingTypesMap[typeName] && !definedTypes[typeName]) {
            var _ancestors$;
            const definitionNode = (_ancestors$ = ancestors[2]) !== null && _ancestors$ !== void 0 ? _ancestors$ : parent;
            const isSDL = definitionNode != null && isSDLNode(definitionNode);
            if (isSDL && standardTypeNames.includes(typeName)) {
              return;
            }
            const suggestedTypes = (0, _suggestionList.suggestionList)(
              typeName,
              isSDL ? standardTypeNames.concat(typeNames) : typeNames
            );
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Unknown type "${typeName}".` + (0, _didYouMean.didYouMean)(suggestedTypes),
                {
                  nodes: node
                }
              )
            );
          }
        }
      };
    }
    var standardTypeNames = [
      ..._scalars.specifiedScalarTypes,
      ..._introspection.introspectionTypes
    ].map((type) => type.name);
    function isSDLNode(value) {
      return "kind" in value && ((0, _predicates.isTypeSystemDefinitionNode)(value) || (0, _predicates.isTypeSystemExtensionNode)(value));
    }
  }
});

// node_modules/graphql/validation/rules/LoneAnonymousOperationRule.js
var require_LoneAnonymousOperationRule = __commonJS({
  "node_modules/graphql/validation/rules/LoneAnonymousOperationRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.LoneAnonymousOperationRule = LoneAnonymousOperationRule;
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    function LoneAnonymousOperationRule(context) {
      let operationCount = 0;
      return {
        Document(node) {
          operationCount = node.definitions.filter(
            (definition) => definition.kind === _kinds.Kind.OPERATION_DEFINITION
          ).length;
        },
        OperationDefinition(node) {
          if (!node.name && operationCount > 1) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                "This anonymous operation must be the only defined operation.",
                {
                  nodes: node
                }
              )
            );
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/LoneSchemaDefinitionRule.js
var require_LoneSchemaDefinitionRule = __commonJS({
  "node_modules/graphql/validation/rules/LoneSchemaDefinitionRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.LoneSchemaDefinitionRule = LoneSchemaDefinitionRule;
    var _GraphQLError = require_GraphQLError();
    function LoneSchemaDefinitionRule(context) {
      var _ref, _ref2, _oldSchema$astNode;
      const oldSchema = context.getSchema();
      const alreadyDefined = (_ref = (_ref2 = (_oldSchema$astNode = oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.astNode) !== null && _oldSchema$astNode !== void 0 ? _oldSchema$astNode : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getQueryType()) !== null && _ref2 !== void 0 ? _ref2 : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getMutationType()) !== null && _ref !== void 0 ? _ref : oldSchema === null || oldSchema === void 0 ? void 0 : oldSchema.getSubscriptionType();
      let schemaDefinitionsCount = 0;
      return {
        SchemaDefinition(node) {
          if (alreadyDefined) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                "Cannot define a new schema within a schema extension.",
                {
                  nodes: node
                }
              )
            );
            return;
          }
          if (schemaDefinitionsCount > 0) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                "Must provide only one schema definition.",
                {
                  nodes: node
                }
              )
            );
          }
          ++schemaDefinitionsCount;
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/MaxIntrospectionDepthRule.js
var require_MaxIntrospectionDepthRule = __commonJS({
  "node_modules/graphql/validation/rules/MaxIntrospectionDepthRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.MaxIntrospectionDepthRule = MaxIntrospectionDepthRule;
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var MAX_LISTS_DEPTH = 3;
    function MaxIntrospectionDepthRule(context) {
      function checkDepth(node, visitedFragments = /* @__PURE__ */ Object.create(null), depth = 0) {
        if (node.kind === _kinds.Kind.FRAGMENT_SPREAD) {
          const fragmentName = node.name.value;
          if (visitedFragments[fragmentName] === true) {
            return false;
          }
          const fragment = context.getFragment(fragmentName);
          if (!fragment) {
            return false;
          }
          try {
            visitedFragments[fragmentName] = true;
            return checkDepth(fragment, visitedFragments, depth);
          } finally {
            visitedFragments[fragmentName] = void 0;
          }
        }
        if (node.kind === _kinds.Kind.FIELD && // check all introspection lists
        (node.name.value === "fields" || node.name.value === "interfaces" || node.name.value === "possibleTypes" || node.name.value === "inputFields")) {
          depth++;
          if (depth >= MAX_LISTS_DEPTH) {
            return true;
          }
        }
        if ("selectionSet" in node && node.selectionSet) {
          for (const child of node.selectionSet.selections) {
            if (checkDepth(child, visitedFragments, depth)) {
              return true;
            }
          }
        }
        return false;
      }
      return {
        Field(node) {
          if (node.name.value === "__schema" || node.name.value === "__type") {
            if (checkDepth(node)) {
              context.reportError(
                new _GraphQLError.GraphQLError(
                  "Maximum introspection depth exceeded",
                  {
                    nodes: [node]
                  }
                )
              );
              return false;
            }
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/NoFragmentCyclesRule.js
var require_NoFragmentCyclesRule = __commonJS({
  "node_modules/graphql/validation/rules/NoFragmentCyclesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.NoFragmentCyclesRule = NoFragmentCyclesRule;
    var _GraphQLError = require_GraphQLError();
    function NoFragmentCyclesRule(context) {
      const visitedFrags = /* @__PURE__ */ Object.create(null);
      const spreadPath = [];
      const spreadPathIndexByName = /* @__PURE__ */ Object.create(null);
      return {
        OperationDefinition: () => false,
        FragmentDefinition(node) {
          detectCycleRecursive(node);
          return false;
        }
      };
      function detectCycleRecursive(fragment) {
        if (visitedFrags[fragment.name.value]) {
          return;
        }
        const fragmentName = fragment.name.value;
        visitedFrags[fragmentName] = true;
        const spreadNodes = context.getFragmentSpreads(fragment.selectionSet);
        if (spreadNodes.length === 0) {
          return;
        }
        spreadPathIndexByName[fragmentName] = spreadPath.length;
        for (const spreadNode of spreadNodes) {
          const spreadName = spreadNode.name.value;
          const cycleIndex = spreadPathIndexByName[spreadName];
          spreadPath.push(spreadNode);
          if (cycleIndex === void 0) {
            const spreadFragment = context.getFragment(spreadName);
            if (spreadFragment) {
              detectCycleRecursive(spreadFragment);
            }
          } else {
            const cyclePath = spreadPath.slice(cycleIndex);
            const viaPath = cyclePath.slice(0, -1).map((s) => '"' + s.name.value + '"').join(", ");
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Cannot spread fragment "${spreadName}" within itself` + (viaPath !== "" ? ` via ${viaPath}.` : "."),
                {
                  nodes: cyclePath
                }
              )
            );
          }
          spreadPath.pop();
        }
        spreadPathIndexByName[fragmentName] = void 0;
      }
    }
  }
});

// node_modules/graphql/validation/rules/NoUndefinedVariablesRule.js
var require_NoUndefinedVariablesRule = __commonJS({
  "node_modules/graphql/validation/rules/NoUndefinedVariablesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.NoUndefinedVariablesRule = NoUndefinedVariablesRule;
    var _GraphQLError = require_GraphQLError();
    function NoUndefinedVariablesRule(context) {
      let variableNameDefined = /* @__PURE__ */ Object.create(null);
      return {
        OperationDefinition: {
          enter() {
            variableNameDefined = /* @__PURE__ */ Object.create(null);
          },
          leave(operation) {
            const usages = context.getRecursiveVariableUsages(operation);
            for (const { node } of usages) {
              const varName = node.name.value;
              if (variableNameDefined[varName] !== true) {
                context.reportError(
                  new _GraphQLError.GraphQLError(
                    operation.name ? `Variable "$${varName}" is not defined by operation "${operation.name.value}".` : `Variable "$${varName}" is not defined.`,
                    {
                      nodes: [node, operation]
                    }
                  )
                );
              }
            }
          }
        },
        VariableDefinition(node) {
          variableNameDefined[node.variable.name.value] = true;
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/NoUnusedFragmentsRule.js
var require_NoUnusedFragmentsRule = __commonJS({
  "node_modules/graphql/validation/rules/NoUnusedFragmentsRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.NoUnusedFragmentsRule = NoUnusedFragmentsRule;
    var _GraphQLError = require_GraphQLError();
    function NoUnusedFragmentsRule(context) {
      const operationDefs = [];
      const fragmentDefs = [];
      return {
        OperationDefinition(node) {
          operationDefs.push(node);
          return false;
        },
        FragmentDefinition(node) {
          fragmentDefs.push(node);
          return false;
        },
        Document: {
          leave() {
            const fragmentNameUsed = /* @__PURE__ */ Object.create(null);
            for (const operation of operationDefs) {
              for (const fragment of context.getRecursivelyReferencedFragments(
                operation
              )) {
                fragmentNameUsed[fragment.name.value] = true;
              }
            }
            for (const fragmentDef of fragmentDefs) {
              const fragName = fragmentDef.name.value;
              if (fragmentNameUsed[fragName] !== true) {
                context.reportError(
                  new _GraphQLError.GraphQLError(
                    `Fragment "${fragName}" is never used.`,
                    {
                      nodes: fragmentDef
                    }
                  )
                );
              }
            }
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/NoUnusedVariablesRule.js
var require_NoUnusedVariablesRule = __commonJS({
  "node_modules/graphql/validation/rules/NoUnusedVariablesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.NoUnusedVariablesRule = NoUnusedVariablesRule;
    var _GraphQLError = require_GraphQLError();
    function NoUnusedVariablesRule(context) {
      let variableDefs = [];
      return {
        OperationDefinition: {
          enter() {
            variableDefs = [];
          },
          leave(operation) {
            const variableNameUsed = /* @__PURE__ */ Object.create(null);
            const usages = context.getRecursiveVariableUsages(operation);
            for (const { node } of usages) {
              variableNameUsed[node.name.value] = true;
            }
            for (const variableDef of variableDefs) {
              const variableName = variableDef.variable.name.value;
              if (variableNameUsed[variableName] !== true) {
                context.reportError(
                  new _GraphQLError.GraphQLError(
                    operation.name ? `Variable "$${variableName}" is never used in operation "${operation.name.value}".` : `Variable "$${variableName}" is never used.`,
                    {
                      nodes: variableDef
                    }
                  )
                );
              }
            }
          }
        },
        VariableDefinition(def) {
          variableDefs.push(def);
        }
      };
    }
  }
});

// node_modules/graphql/utilities/sortValueNode.js
var require_sortValueNode = __commonJS({
  "node_modules/graphql/utilities/sortValueNode.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.sortValueNode = sortValueNode;
    var _naturalCompare = require_naturalCompare();
    var _kinds = require_kinds();
    function sortValueNode(valueNode) {
      switch (valueNode.kind) {
        case _kinds.Kind.OBJECT:
          return { ...valueNode, fields: sortFields(valueNode.fields) };
        case _kinds.Kind.LIST:
          return { ...valueNode, values: valueNode.values.map(sortValueNode) };
        case _kinds.Kind.INT:
        case _kinds.Kind.FLOAT:
        case _kinds.Kind.STRING:
        case _kinds.Kind.BOOLEAN:
        case _kinds.Kind.NULL:
        case _kinds.Kind.ENUM:
        case _kinds.Kind.VARIABLE:
          return valueNode;
      }
    }
    function sortFields(fields) {
      return fields.map((fieldNode) => ({
        ...fieldNode,
        value: sortValueNode(fieldNode.value)
      })).sort(
        (fieldA, fieldB) => (0, _naturalCompare.naturalCompare)(fieldA.name.value, fieldB.name.value)
      );
    }
  }
});

// node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.js
var require_OverlappingFieldsCanBeMergedRule = __commonJS({
  "node_modules/graphql/validation/rules/OverlappingFieldsCanBeMergedRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.OverlappingFieldsCanBeMergedRule = OverlappingFieldsCanBeMergedRule;
    var _inspect2 = require_inspect();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _printer = require_printer();
    var _definition = require_definition();
    var _sortValueNode = require_sortValueNode();
    var _typeFromAST = require_typeFromAST();
    function reasonMessage(reason) {
      if (Array.isArray(reason)) {
        return reason.map(
          ([responseName, subReason]) => `subfields "${responseName}" conflict because ` + reasonMessage(subReason)
        ).join(" and ");
      }
      return reason;
    }
    function OverlappingFieldsCanBeMergedRule(context) {
      const comparedFieldsAndFragmentPairs = new OrderedPairSet();
      const comparedFragmentPairs = new PairSet();
      const cachedFieldsAndFragmentNames = /* @__PURE__ */ new Map();
      return {
        SelectionSet(selectionSet) {
          const conflicts = findConflictsWithinSelectionSet(
            context,
            cachedFieldsAndFragmentNames,
            comparedFieldsAndFragmentPairs,
            comparedFragmentPairs,
            context.getParentType(),
            selectionSet
          );
          for (const [[responseName, reason], fields1, fields2] of conflicts) {
            const reasonMsg = reasonMessage(reason);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Fields "${responseName}" conflict because ${reasonMsg}. Use different aliases on the fields to fetch both if this was intentional.`,
                {
                  nodes: fields1.concat(fields2)
                }
              )
            );
          }
        }
      };
    }
    function findConflictsWithinSelectionSet(context, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentType, selectionSet) {
      const conflicts = [];
      const [fieldMap, fragmentNames] = getFieldsAndFragmentNames(
        context,
        cachedFieldsAndFragmentNames,
        parentType,
        selectionSet
      );
      collectConflictsWithin(
        context,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        fieldMap
      );
      if (fragmentNames.length !== 0) {
        for (let i = 0; i < fragmentNames.length; i++) {
          collectConflictsBetweenFieldsAndFragment(
            context,
            conflicts,
            cachedFieldsAndFragmentNames,
            comparedFieldsAndFragmentPairs,
            comparedFragmentPairs,
            false,
            fieldMap,
            fragmentNames[i]
          );
          for (let j = i + 1; j < fragmentNames.length; j++) {
            collectConflictsBetweenFragments(
              context,
              conflicts,
              cachedFieldsAndFragmentNames,
              comparedFieldsAndFragmentPairs,
              comparedFragmentPairs,
              false,
              fragmentNames[i],
              fragmentNames[j]
            );
          }
        }
      }
      return conflicts;
    }
    function collectConflictsBetweenFieldsAndFragment(context, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, fieldMap, fragmentName) {
      if (comparedFieldsAndFragmentPairs.has(
        fieldMap,
        fragmentName,
        areMutuallyExclusive
      )) {
        return;
      }
      comparedFieldsAndFragmentPairs.add(
        fieldMap,
        fragmentName,
        areMutuallyExclusive
      );
      const fragment = context.getFragment(fragmentName);
      if (!fragment) {
        return;
      }
      const [fieldMap2, referencedFragmentNames] = getReferencedFieldsAndFragmentNames(
        context,
        cachedFieldsAndFragmentNames,
        fragment
      );
      if (fieldMap === fieldMap2) {
        return;
      }
      collectConflictsBetween(
        context,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        areMutuallyExclusive,
        fieldMap,
        fieldMap2
      );
      for (const referencedFragmentName of referencedFragmentNames) {
        collectConflictsBetweenFieldsAndFragment(
          context,
          conflicts,
          cachedFieldsAndFragmentNames,
          comparedFieldsAndFragmentPairs,
          comparedFragmentPairs,
          areMutuallyExclusive,
          fieldMap,
          referencedFragmentName
        );
      }
    }
    function collectConflictsBetweenFragments(context, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, fragmentName1, fragmentName2) {
      if (fragmentName1 === fragmentName2) {
        return;
      }
      if (comparedFragmentPairs.has(
        fragmentName1,
        fragmentName2,
        areMutuallyExclusive
      )) {
        return;
      }
      comparedFragmentPairs.add(fragmentName1, fragmentName2, areMutuallyExclusive);
      const fragment1 = context.getFragment(fragmentName1);
      const fragment2 = context.getFragment(fragmentName2);
      if (!fragment1 || !fragment2) {
        return;
      }
      const [fieldMap1, referencedFragmentNames1] = getReferencedFieldsAndFragmentNames(
        context,
        cachedFieldsAndFragmentNames,
        fragment1
      );
      const [fieldMap2, referencedFragmentNames2] = getReferencedFieldsAndFragmentNames(
        context,
        cachedFieldsAndFragmentNames,
        fragment2
      );
      collectConflictsBetween(
        context,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        areMutuallyExclusive,
        fieldMap1,
        fieldMap2
      );
      for (const referencedFragmentName2 of referencedFragmentNames2) {
        collectConflictsBetweenFragments(
          context,
          conflicts,
          cachedFieldsAndFragmentNames,
          comparedFieldsAndFragmentPairs,
          comparedFragmentPairs,
          areMutuallyExclusive,
          fragmentName1,
          referencedFragmentName2
        );
      }
      for (const referencedFragmentName1 of referencedFragmentNames1) {
        collectConflictsBetweenFragments(
          context,
          conflicts,
          cachedFieldsAndFragmentNames,
          comparedFieldsAndFragmentPairs,
          comparedFragmentPairs,
          areMutuallyExclusive,
          referencedFragmentName1,
          fragmentName2
        );
      }
    }
    function findConflictsBetweenSubSelectionSets(context, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, areMutuallyExclusive, parentType1, selectionSet1, parentType2, selectionSet2) {
      const conflicts = [];
      const [fieldMap1, fragmentNames1] = getFieldsAndFragmentNames(
        context,
        cachedFieldsAndFragmentNames,
        parentType1,
        selectionSet1
      );
      const [fieldMap2, fragmentNames2] = getFieldsAndFragmentNames(
        context,
        cachedFieldsAndFragmentNames,
        parentType2,
        selectionSet2
      );
      collectConflictsBetween(
        context,
        conflicts,
        cachedFieldsAndFragmentNames,
        comparedFieldsAndFragmentPairs,
        comparedFragmentPairs,
        areMutuallyExclusive,
        fieldMap1,
        fieldMap2
      );
      for (const fragmentName2 of fragmentNames2) {
        collectConflictsBetweenFieldsAndFragment(
          context,
          conflicts,
          cachedFieldsAndFragmentNames,
          comparedFieldsAndFragmentPairs,
          comparedFragmentPairs,
          areMutuallyExclusive,
          fieldMap1,
          fragmentName2
        );
      }
      for (const fragmentName1 of fragmentNames1) {
        collectConflictsBetweenFieldsAndFragment(
          context,
          conflicts,
          cachedFieldsAndFragmentNames,
          comparedFieldsAndFragmentPairs,
          comparedFragmentPairs,
          areMutuallyExclusive,
          fieldMap2,
          fragmentName1
        );
      }
      for (const fragmentName1 of fragmentNames1) {
        for (const fragmentName2 of fragmentNames2) {
          collectConflictsBetweenFragments(
            context,
            conflicts,
            cachedFieldsAndFragmentNames,
            comparedFieldsAndFragmentPairs,
            comparedFragmentPairs,
            areMutuallyExclusive,
            fragmentName1,
            fragmentName2
          );
        }
      }
      return conflicts;
    }
    function collectConflictsWithin(context, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, fieldMap) {
      for (const [responseName, fields] of Object.entries(fieldMap)) {
        if (fields.length > 1) {
          for (let i = 0; i < fields.length; i++) {
            for (let j = i + 1; j < fields.length; j++) {
              const conflict = findConflict(
                context,
                cachedFieldsAndFragmentNames,
                comparedFieldsAndFragmentPairs,
                comparedFragmentPairs,
                false,
                // within one collection is never mutually exclusive
                responseName,
                fields[i],
                fields[j]
              );
              if (conflict) {
                conflicts.push(conflict);
              }
            }
          }
        }
      }
    }
    function collectConflictsBetween(context, conflicts, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, fieldMap1, fieldMap2) {
      for (const [responseName, fields1] of Object.entries(fieldMap1)) {
        const fields2 = fieldMap2[responseName];
        if (fields2) {
          for (const field1 of fields1) {
            for (const field2 of fields2) {
              const conflict = findConflict(
                context,
                cachedFieldsAndFragmentNames,
                comparedFieldsAndFragmentPairs,
                comparedFragmentPairs,
                parentFieldsAreMutuallyExclusive,
                responseName,
                field1,
                field2
              );
              if (conflict) {
                conflicts.push(conflict);
              }
            }
          }
        }
      }
    }
    function findConflict(context, cachedFieldsAndFragmentNames, comparedFieldsAndFragmentPairs, comparedFragmentPairs, parentFieldsAreMutuallyExclusive, responseName, field1, field2) {
      const [parentType1, node1, def1] = field1;
      const [parentType2, node2, def2] = field2;
      const areMutuallyExclusive = parentFieldsAreMutuallyExclusive || parentType1 !== parentType2 && (0, _definition.isObjectType)(parentType1) && (0, _definition.isObjectType)(parentType2);
      if (!areMutuallyExclusive) {
        const name1 = node1.name.value;
        const name2 = node2.name.value;
        if (name1 !== name2) {
          return [
            [responseName, `"${name1}" and "${name2}" are different fields`],
            [node1],
            [node2]
          ];
        }
        if (!sameArguments(node1, node2)) {
          return [
            [responseName, "they have differing arguments"],
            [node1],
            [node2]
          ];
        }
      }
      const type1 = def1 === null || def1 === void 0 ? void 0 : def1.type;
      const type2 = def2 === null || def2 === void 0 ? void 0 : def2.type;
      if (type1 && type2 && doTypesConflict(type1, type2)) {
        return [
          [
            responseName,
            `they return conflicting types "${(0, _inspect2.inspect)(
              type1
            )}" and "${(0, _inspect2.inspect)(type2)}"`
          ],
          [node1],
          [node2]
        ];
      }
      const selectionSet1 = node1.selectionSet;
      const selectionSet2 = node2.selectionSet;
      if (selectionSet1 && selectionSet2) {
        const conflicts = findConflictsBetweenSubSelectionSets(
          context,
          cachedFieldsAndFragmentNames,
          comparedFieldsAndFragmentPairs,
          comparedFragmentPairs,
          areMutuallyExclusive,
          (0, _definition.getNamedType)(type1),
          selectionSet1,
          (0, _definition.getNamedType)(type2),
          selectionSet2
        );
        return subfieldConflicts(conflicts, responseName, node1, node2);
      }
    }
    function sameArguments(node1, node2) {
      const args1 = node1.arguments;
      const args2 = node2.arguments;
      if (args1 === void 0 || args1.length === 0) {
        return args2 === void 0 || args2.length === 0;
      }
      if (args2 === void 0 || args2.length === 0) {
        return false;
      }
      if (args1.length !== args2.length) {
        return false;
      }
      const values2 = new Map(args2.map(({ name, value }) => [name.value, value]));
      return args1.every((arg1) => {
        const value1 = arg1.value;
        const value2 = values2.get(arg1.name.value);
        if (value2 === void 0) {
          return false;
        }
        return stringifyValue(value1) === stringifyValue(value2);
      });
    }
    function stringifyValue(value) {
      return (0, _printer.print)((0, _sortValueNode.sortValueNode)(value));
    }
    function doTypesConflict(type1, type2) {
      if ((0, _definition.isListType)(type1)) {
        return (0, _definition.isListType)(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
      }
      if ((0, _definition.isListType)(type2)) {
        return true;
      }
      if ((0, _definition.isNonNullType)(type1)) {
        return (0, _definition.isNonNullType)(type2) ? doTypesConflict(type1.ofType, type2.ofType) : true;
      }
      if ((0, _definition.isNonNullType)(type2)) {
        return true;
      }
      if ((0, _definition.isLeafType)(type1) || (0, _definition.isLeafType)(type2)) {
        return type1 !== type2;
      }
      return false;
    }
    function getFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, parentType, selectionSet) {
      const cached = cachedFieldsAndFragmentNames.get(selectionSet);
      if (cached) {
        return cached;
      }
      const nodeAndDefs = /* @__PURE__ */ Object.create(null);
      const fragmentNames = /* @__PURE__ */ Object.create(null);
      _collectFieldsAndFragmentNames(
        context,
        parentType,
        selectionSet,
        nodeAndDefs,
        fragmentNames
      );
      const result = [nodeAndDefs, Object.keys(fragmentNames)];
      cachedFieldsAndFragmentNames.set(selectionSet, result);
      return result;
    }
    function getReferencedFieldsAndFragmentNames(context, cachedFieldsAndFragmentNames, fragment) {
      const cached = cachedFieldsAndFragmentNames.get(fragment.selectionSet);
      if (cached) {
        return cached;
      }
      const fragmentType = (0, _typeFromAST.typeFromAST)(
        context.getSchema(),
        fragment.typeCondition
      );
      return getFieldsAndFragmentNames(
        context,
        cachedFieldsAndFragmentNames,
        fragmentType,
        fragment.selectionSet
      );
    }
    function _collectFieldsAndFragmentNames(context, parentType, selectionSet, nodeAndDefs, fragmentNames) {
      for (const selection of selectionSet.selections) {
        switch (selection.kind) {
          case _kinds.Kind.FIELD: {
            const fieldName = selection.name.value;
            let fieldDef;
            if ((0, _definition.isObjectType)(parentType) || (0, _definition.isInterfaceType)(parentType)) {
              fieldDef = parentType.getFields()[fieldName];
            }
            const responseName = selection.alias ? selection.alias.value : fieldName;
            if (!nodeAndDefs[responseName]) {
              nodeAndDefs[responseName] = [];
            }
            nodeAndDefs[responseName].push([parentType, selection, fieldDef]);
            break;
          }
          case _kinds.Kind.FRAGMENT_SPREAD:
            fragmentNames[selection.name.value] = true;
            break;
          case _kinds.Kind.INLINE_FRAGMENT: {
            const typeCondition = selection.typeCondition;
            const inlineFragmentType = typeCondition ? (0, _typeFromAST.typeFromAST)(context.getSchema(), typeCondition) : parentType;
            _collectFieldsAndFragmentNames(
              context,
              inlineFragmentType,
              selection.selectionSet,
              nodeAndDefs,
              fragmentNames
            );
            break;
          }
        }
      }
    }
    function subfieldConflicts(conflicts, responseName, node1, node2) {
      if (conflicts.length > 0) {
        return [
          [responseName, conflicts.map(([reason]) => reason)],
          [node1, ...conflicts.map(([, fields1]) => fields1).flat()],
          [node2, ...conflicts.map(([, , fields2]) => fields2).flat()]
        ];
      }
    }
    var OrderedPairSet = class {
      constructor() {
        this._data = /* @__PURE__ */ new Map();
      }
      has(a, b, weaklyPresent) {
        var _this$_data$get;
        const result = (_this$_data$get = this._data.get(a)) === null || _this$_data$get === void 0 ? void 0 : _this$_data$get.get(b);
        if (result === void 0) {
          return false;
        }
        return weaklyPresent ? true : weaklyPresent === result;
      }
      add(a, b, weaklyPresent) {
        const map = this._data.get(a);
        if (map === void 0) {
          this._data.set(a, /* @__PURE__ */ new Map([[b, weaklyPresent]]));
        } else {
          map.set(b, weaklyPresent);
        }
      }
    };
    var PairSet = class {
      constructor() {
        this._orderedPairSet = new OrderedPairSet();
      }
      has(a, b, weaklyPresent) {
        return a < b ? this._orderedPairSet.has(a, b, weaklyPresent) : this._orderedPairSet.has(b, a, weaklyPresent);
      }
      add(a, b, weaklyPresent) {
        if (a < b) {
          this._orderedPairSet.add(a, b, weaklyPresent);
        } else {
          this._orderedPairSet.add(b, a, weaklyPresent);
        }
      }
    };
  }
});

// node_modules/graphql/validation/rules/PossibleFragmentSpreadsRule.js
var require_PossibleFragmentSpreadsRule = __commonJS({
  "node_modules/graphql/validation/rules/PossibleFragmentSpreadsRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.PossibleFragmentSpreadsRule = PossibleFragmentSpreadsRule;
    var _inspect2 = require_inspect();
    var _GraphQLError = require_GraphQLError();
    var _definition = require_definition();
    var _typeComparators = require_typeComparators();
    var _typeFromAST = require_typeFromAST();
    function PossibleFragmentSpreadsRule(context) {
      return {
        InlineFragment(node) {
          const fragType = context.getType();
          const parentType = context.getParentType();
          if ((0, _definition.isCompositeType)(fragType) && (0, _definition.isCompositeType)(parentType) && !(0, _typeComparators.doTypesOverlap)(
            context.getSchema(),
            fragType,
            parentType
          )) {
            const parentTypeStr = (0, _inspect2.inspect)(parentType);
            const fragTypeStr = (0, _inspect2.inspect)(fragType);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Fragment cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`,
                {
                  nodes: node
                }
              )
            );
          }
        },
        FragmentSpread(node) {
          const fragName = node.name.value;
          const fragType = getFragmentType(context, fragName);
          const parentType = context.getParentType();
          if (fragType && parentType && !(0, _typeComparators.doTypesOverlap)(
            context.getSchema(),
            fragType,
            parentType
          )) {
            const parentTypeStr = (0, _inspect2.inspect)(parentType);
            const fragTypeStr = (0, _inspect2.inspect)(fragType);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Fragment "${fragName}" cannot be spread here as objects of type "${parentTypeStr}" can never be of type "${fragTypeStr}".`,
                {
                  nodes: node
                }
              )
            );
          }
        }
      };
    }
    function getFragmentType(context, name) {
      const frag = context.getFragment(name);
      if (frag) {
        const type = (0, _typeFromAST.typeFromAST)(
          context.getSchema(),
          frag.typeCondition
        );
        if ((0, _definition.isCompositeType)(type)) {
          return type;
        }
      }
    }
  }
});

// node_modules/graphql/validation/rules/PossibleTypeExtensionsRule.js
var require_PossibleTypeExtensionsRule = __commonJS({
  "node_modules/graphql/validation/rules/PossibleTypeExtensionsRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.PossibleTypeExtensionsRule = PossibleTypeExtensionsRule;
    var _didYouMean = require_didYouMean();
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _suggestionList = require_suggestionList();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _predicates = require_predicates();
    var _definition = require_definition();
    function PossibleTypeExtensionsRule(context) {
      const schema = context.getSchema();
      const definedTypes = /* @__PURE__ */ Object.create(null);
      for (const def of context.getDocument().definitions) {
        if ((0, _predicates.isTypeDefinitionNode)(def)) {
          definedTypes[def.name.value] = def;
        }
      }
      return {
        ScalarTypeExtension: checkExtension,
        ObjectTypeExtension: checkExtension,
        InterfaceTypeExtension: checkExtension,
        UnionTypeExtension: checkExtension,
        EnumTypeExtension: checkExtension,
        InputObjectTypeExtension: checkExtension
      };
      function checkExtension(node) {
        const typeName = node.name.value;
        const defNode = definedTypes[typeName];
        const existingType = schema === null || schema === void 0 ? void 0 : schema.getType(typeName);
        let expectedKind;
        if (defNode) {
          expectedKind = defKindToExtKind[defNode.kind];
        } else if (existingType) {
          expectedKind = typeToExtKind(existingType);
        }
        if (expectedKind) {
          if (expectedKind !== node.kind) {
            const kindStr = extensionKindToTypeName(node.kind);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Cannot extend non-${kindStr} type "${typeName}".`,
                {
                  nodes: defNode ? [defNode, node] : node
                }
              )
            );
          }
        } else {
          const allTypeNames = Object.keys({
            ...definedTypes,
            ...schema === null || schema === void 0 ? void 0 : schema.getTypeMap()
          });
          const suggestedTypes = (0, _suggestionList.suggestionList)(
            typeName,
            allTypeNames
          );
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Cannot extend type "${typeName}" because it is not defined.` + (0, _didYouMean.didYouMean)(suggestedTypes),
              {
                nodes: node.name
              }
            )
          );
        }
      }
    }
    var defKindToExtKind = {
      [_kinds.Kind.SCALAR_TYPE_DEFINITION]: _kinds.Kind.SCALAR_TYPE_EXTENSION,
      [_kinds.Kind.OBJECT_TYPE_DEFINITION]: _kinds.Kind.OBJECT_TYPE_EXTENSION,
      [_kinds.Kind.INTERFACE_TYPE_DEFINITION]: _kinds.Kind.INTERFACE_TYPE_EXTENSION,
      [_kinds.Kind.UNION_TYPE_DEFINITION]: _kinds.Kind.UNION_TYPE_EXTENSION,
      [_kinds.Kind.ENUM_TYPE_DEFINITION]: _kinds.Kind.ENUM_TYPE_EXTENSION,
      [_kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION]: _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION
    };
    function typeToExtKind(type) {
      if ((0, _definition.isScalarType)(type)) {
        return _kinds.Kind.SCALAR_TYPE_EXTENSION;
      }
      if ((0, _definition.isObjectType)(type)) {
        return _kinds.Kind.OBJECT_TYPE_EXTENSION;
      }
      if ((0, _definition.isInterfaceType)(type)) {
        return _kinds.Kind.INTERFACE_TYPE_EXTENSION;
      }
      if ((0, _definition.isUnionType)(type)) {
        return _kinds.Kind.UNION_TYPE_EXTENSION;
      }
      if ((0, _definition.isEnumType)(type)) {
        return _kinds.Kind.ENUM_TYPE_EXTENSION;
      }
      if ((0, _definition.isInputObjectType)(type)) {
        return _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION;
      }
      (0, _invariant.invariant)(
        false,
        "Unexpected type: " + (0, _inspect2.inspect)(type)
      );
    }
    function extensionKindToTypeName(kind) {
      switch (kind) {
        case _kinds.Kind.SCALAR_TYPE_EXTENSION:
          return "scalar";
        case _kinds.Kind.OBJECT_TYPE_EXTENSION:
          return "object";
        case _kinds.Kind.INTERFACE_TYPE_EXTENSION:
          return "interface";
        case _kinds.Kind.UNION_TYPE_EXTENSION:
          return "union";
        case _kinds.Kind.ENUM_TYPE_EXTENSION:
          return "enum";
        case _kinds.Kind.INPUT_OBJECT_TYPE_EXTENSION:
          return "input object";
        // Not reachable. All possible types have been considered
        /* c8 ignore next */
        default:
          (0, _invariant.invariant)(
            false,
            "Unexpected kind: " + (0, _inspect2.inspect)(kind)
          );
      }
    }
  }
});

// node_modules/graphql/validation/rules/ProvidedRequiredArgumentsRule.js
var require_ProvidedRequiredArgumentsRule = __commonJS({
  "node_modules/graphql/validation/rules/ProvidedRequiredArgumentsRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.ProvidedRequiredArgumentsOnDirectivesRule = ProvidedRequiredArgumentsOnDirectivesRule;
    exports2.ProvidedRequiredArgumentsRule = ProvidedRequiredArgumentsRule;
    var _inspect2 = require_inspect();
    var _keyMap = require_keyMap();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _printer = require_printer();
    var _definition = require_definition();
    var _directives = require_directives();
    function ProvidedRequiredArgumentsRule(context) {
      return {
        // eslint-disable-next-line new-cap
        ...ProvidedRequiredArgumentsOnDirectivesRule(context),
        Field: {
          // Validate on leave to allow for deeper errors to appear first.
          leave(fieldNode) {
            var _fieldNode$arguments;
            const fieldDef = context.getFieldDef();
            if (!fieldDef) {
              return false;
            }
            const providedArgs = new Set(
              // FIXME: https://github.com/graphql/graphql-js/issues/2203
              /* c8 ignore next */
              (_fieldNode$arguments = fieldNode.arguments) === null || _fieldNode$arguments === void 0 ? void 0 : _fieldNode$arguments.map((arg) => arg.name.value)
            );
            for (const argDef of fieldDef.args) {
              if (!providedArgs.has(argDef.name) && (0, _definition.isRequiredArgument)(argDef)) {
                const argTypeStr = (0, _inspect2.inspect)(argDef.type);
                context.reportError(
                  new _GraphQLError.GraphQLError(
                    `Field "${fieldDef.name}" argument "${argDef.name}" of type "${argTypeStr}" is required, but it was not provided.`,
                    {
                      nodes: fieldNode
                    }
                  )
                );
              }
            }
          }
        }
      };
    }
    function ProvidedRequiredArgumentsOnDirectivesRule(context) {
      var _schema$getDirectives;
      const requiredArgsMap = /* @__PURE__ */ Object.create(null);
      const schema = context.getSchema();
      const definedDirectives = (_schema$getDirectives = schema === null || schema === void 0 ? void 0 : schema.getDirectives()) !== null && _schema$getDirectives !== void 0 ? _schema$getDirectives : _directives.specifiedDirectives;
      for (const directive of definedDirectives) {
        requiredArgsMap[directive.name] = (0, _keyMap.keyMap)(
          directive.args.filter(_definition.isRequiredArgument),
          (arg) => arg.name
        );
      }
      const astDefinitions = context.getDocument().definitions;
      for (const def of astDefinitions) {
        if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
          var _def$arguments;
          const argNodes = (_def$arguments = def.arguments) !== null && _def$arguments !== void 0 ? _def$arguments : [];
          requiredArgsMap[def.name.value] = (0, _keyMap.keyMap)(
            argNodes.filter(isRequiredArgumentNode),
            (arg) => arg.name.value
          );
        }
      }
      return {
        Directive: {
          // Validate on leave to allow for deeper errors to appear first.
          leave(directiveNode) {
            const directiveName = directiveNode.name.value;
            const requiredArgs = requiredArgsMap[directiveName];
            if (requiredArgs) {
              var _directiveNode$argume;
              const argNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
              const argNodeMap = new Set(argNodes.map((arg) => arg.name.value));
              for (const [argName, argDef] of Object.entries(requiredArgs)) {
                if (!argNodeMap.has(argName)) {
                  const argType = (0, _definition.isType)(argDef.type) ? (0, _inspect2.inspect)(argDef.type) : (0, _printer.print)(argDef.type);
                  context.reportError(
                    new _GraphQLError.GraphQLError(
                      `Directive "@${directiveName}" argument "${argName}" of type "${argType}" is required, but it was not provided.`,
                      {
                        nodes: directiveNode
                      }
                    )
                  );
                }
              }
            }
          }
        }
      };
    }
    function isRequiredArgumentNode(arg) {
      return arg.type.kind === _kinds.Kind.NON_NULL_TYPE && arg.defaultValue == null;
    }
  }
});

// node_modules/graphql/validation/rules/ScalarLeafsRule.js
var require_ScalarLeafsRule = __commonJS({
  "node_modules/graphql/validation/rules/ScalarLeafsRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.ScalarLeafsRule = ScalarLeafsRule;
    var _inspect2 = require_inspect();
    var _GraphQLError = require_GraphQLError();
    var _definition = require_definition();
    function ScalarLeafsRule(context) {
      return {
        Field(node) {
          const type = context.getType();
          const selectionSet = node.selectionSet;
          if (type) {
            if ((0, _definition.isLeafType)((0, _definition.getNamedType)(type))) {
              if (selectionSet) {
                const fieldName = node.name.value;
                const typeStr = (0, _inspect2.inspect)(type);
                context.reportError(
                  new _GraphQLError.GraphQLError(
                    `Field "${fieldName}" must not have a selection since type "${typeStr}" has no subfields.`,
                    {
                      nodes: selectionSet
                    }
                  )
                );
              }
            } else if (!selectionSet) {
              const fieldName = node.name.value;
              const typeStr = (0, _inspect2.inspect)(type);
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Field "${fieldName}" of type "${typeStr}" must have a selection of subfields. Did you mean "${fieldName} { ... }"?`,
                  {
                    nodes: node
                  }
                )
              );
            } else if (selectionSet.selections.length === 0) {
              const fieldName = node.name.value;
              const typeStr = (0, _inspect2.inspect)(type);
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Field "${fieldName}" of type "${typeStr}" must have at least one field selected.`,
                  {
                    nodes: node
                  }
                )
              );
            }
          }
        }
      };
    }
  }
});

// node_modules/graphql/jsutils/printPathArray.js
var require_printPathArray = __commonJS({
  "node_modules/graphql/jsutils/printPathArray.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.printPathArray = printPathArray;
    function printPathArray(path4) {
      return path4.map(
        (key) => typeof key === "number" ? "[" + key.toString() + "]" : "." + key
      ).join("");
    }
  }
});

// node_modules/graphql/jsutils/Path.js
var require_Path = __commonJS({
  "node_modules/graphql/jsutils/Path.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.addPath = addPath;
    exports2.pathToArray = pathToArray;
    function addPath(prev, key, typename) {
      return {
        prev,
        key,
        typename
      };
    }
    function pathToArray(path4) {
      const flattened = [];
      let curr = path4;
      while (curr) {
        flattened.push(curr.key);
        curr = curr.prev;
      }
      return flattened.reverse();
    }
  }
});

// node_modules/graphql/utilities/coerceInputValue.js
var require_coerceInputValue = __commonJS({
  "node_modules/graphql/utilities/coerceInputValue.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.coerceInputValue = coerceInputValue;
    var _didYouMean = require_didYouMean();
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _isIterableObject = require_isIterableObject();
    var _isObjectLike = require_isObjectLike();
    var _Path = require_Path();
    var _printPathArray = require_printPathArray();
    var _suggestionList = require_suggestionList();
    var _GraphQLError = require_GraphQLError();
    var _definition = require_definition();
    function coerceInputValue(inputValue, type, onError = defaultOnError) {
      return coerceInputValueImpl(inputValue, type, onError, void 0);
    }
    function defaultOnError(path4, invalidValue, error) {
      let errorPrefix = "Invalid value " + (0, _inspect2.inspect)(invalidValue);
      if (path4.length > 0) {
        errorPrefix += ` at "value${(0, _printPathArray.printPathArray)(path4)}"`;
      }
      error.message = errorPrefix + ": " + error.message;
      throw error;
    }
    function coerceInputValueImpl(inputValue, type, onError, path4) {
      if ((0, _definition.isNonNullType)(type)) {
        if (inputValue != null) {
          return coerceInputValueImpl(inputValue, type.ofType, onError, path4);
        }
        onError(
          (0, _Path.pathToArray)(path4),
          inputValue,
          new _GraphQLError.GraphQLError(
            `Expected non-nullable type "${(0, _inspect2.inspect)(
              type
            )}" not to be null.`
          )
        );
        return;
      }
      if (inputValue == null) {
        return null;
      }
      if ((0, _definition.isListType)(type)) {
        const itemType = type.ofType;
        if ((0, _isIterableObject.isIterableObject)(inputValue)) {
          return Array.from(inputValue, (itemValue, index) => {
            const itemPath = (0, _Path.addPath)(path4, index, void 0);
            return coerceInputValueImpl(itemValue, itemType, onError, itemPath);
          });
        }
        return [coerceInputValueImpl(inputValue, itemType, onError, path4)];
      }
      if ((0, _definition.isInputObjectType)(type)) {
        if (!(0, _isObjectLike.isObjectLike)(inputValue) || Array.isArray(inputValue)) {
          onError(
            (0, _Path.pathToArray)(path4),
            inputValue,
            new _GraphQLError.GraphQLError(
              `Expected type "${type.name}" to be an object.`
            )
          );
          return;
        }
        const coercedValue = /* @__PURE__ */ Object.create(null);
        const fieldDefs = type.getFields();
        for (const field of Object.values(fieldDefs)) {
          const fieldValue = inputValue[field.name];
          if (fieldValue === void 0) {
            if (field.defaultValue !== void 0) {
              coercedValue[field.name] = field.defaultValue;
            } else if ((0, _definition.isNonNullType)(field.type)) {
              const typeStr = (0, _inspect2.inspect)(field.type);
              onError(
                (0, _Path.pathToArray)(path4),
                inputValue,
                new _GraphQLError.GraphQLError(
                  `Field "${field.name}" of required type "${typeStr}" was not provided.`
                )
              );
            }
            continue;
          }
          coercedValue[field.name] = coerceInputValueImpl(
            fieldValue,
            field.type,
            onError,
            (0, _Path.addPath)(path4, field.name, type.name)
          );
        }
        for (const fieldName of Object.keys(inputValue)) {
          if (!fieldDefs[fieldName]) {
            const suggestions = (0, _suggestionList.suggestionList)(
              fieldName,
              Object.keys(type.getFields())
            );
            onError(
              (0, _Path.pathToArray)(path4),
              inputValue,
              new _GraphQLError.GraphQLError(
                `Field "${fieldName}" is not defined by type "${type.name}".` + (0, _didYouMean.didYouMean)(suggestions)
              )
            );
          }
        }
        if (type.isOneOf) {
          const keys = Object.keys(coercedValue);
          if (keys.length !== 1) {
            onError(
              (0, _Path.pathToArray)(path4),
              inputValue,
              new _GraphQLError.GraphQLError(
                `Exactly one key must be specified for OneOf type "${type.name}".`
              )
            );
          }
          const key = keys[0];
          const value = coercedValue[key];
          if (value === null) {
            onError(
              (0, _Path.pathToArray)(path4).concat(key),
              value,
              new _GraphQLError.GraphQLError(`Field "${key}" must be non-null.`)
            );
          }
        }
        return { ...coercedValue };
      }
      if ((0, _definition.isLeafType)(type)) {
        let parseResult;
        try {
          parseResult = type.parseValue(inputValue);
        } catch (error) {
          if (error instanceof _GraphQLError.GraphQLError) {
            onError((0, _Path.pathToArray)(path4), inputValue, error);
          } else {
            onError(
              (0, _Path.pathToArray)(path4),
              inputValue,
              new _GraphQLError.GraphQLError(
                `Expected type "${type.name}". ` + error.message,
                {
                  originalError: error
                }
              )
            );
          }
          return;
        }
        if (parseResult === void 0) {
          onError(
            (0, _Path.pathToArray)(path4),
            inputValue,
            new _GraphQLError.GraphQLError(`Expected type "${type.name}".`)
          );
        }
        return parseResult;
      }
      (0, _invariant.invariant)(
        false,
        "Unexpected input type: " + (0, _inspect2.inspect)(type)
      );
    }
  }
});

// node_modules/graphql/utilities/valueFromAST.js
var require_valueFromAST = __commonJS({
  "node_modules/graphql/utilities/valueFromAST.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.valueFromAST = valueFromAST;
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _keyMap = require_keyMap();
    var _kinds = require_kinds();
    var _definition = require_definition();
    function valueFromAST(valueNode, type, variables) {
      if (!valueNode) {
        return;
      }
      if (valueNode.kind === _kinds.Kind.VARIABLE) {
        const variableName = valueNode.name.value;
        if (variables == null || variables[variableName] === void 0 || !hasOwnProperty2(variables, variableName)) {
          return;
        }
        const variableValue = variables[variableName];
        if (variableValue === null && (0, _definition.isNonNullType)(type)) {
          return;
        }
        return variableValue;
      }
      if ((0, _definition.isNonNullType)(type)) {
        if (valueNode.kind === _kinds.Kind.NULL) {
          return;
        }
        return valueFromAST(valueNode, type.ofType, variables);
      }
      if (valueNode.kind === _kinds.Kind.NULL) {
        return null;
      }
      if ((0, _definition.isListType)(type)) {
        const itemType = type.ofType;
        if (valueNode.kind === _kinds.Kind.LIST) {
          const coercedValues = [];
          for (const itemNode of valueNode.values) {
            if (isMissingVariable(itemNode, variables)) {
              if ((0, _definition.isNonNullType)(itemType)) {
                return;
              }
              coercedValues.push(null);
            } else {
              const itemValue = valueFromAST(itemNode, itemType, variables);
              if (itemValue === void 0) {
                return;
              }
              coercedValues.push(itemValue);
            }
          }
          return coercedValues;
        }
        const coercedValue = valueFromAST(valueNode, itemType, variables);
        if (coercedValue === void 0) {
          return;
        }
        return [coercedValue];
      }
      if ((0, _definition.isInputObjectType)(type)) {
        if (valueNode.kind !== _kinds.Kind.OBJECT) {
          return;
        }
        const coercedObj = /* @__PURE__ */ Object.create(null);
        const fieldNodes = (0, _keyMap.keyMap)(
          valueNode.fields,
          (field) => field.name.value
        );
        for (const field of Object.values(type.getFields())) {
          const fieldNode = fieldNodes[field.name];
          if (!fieldNode || isMissingVariable(fieldNode.value, variables)) {
            if (field.defaultValue !== void 0) {
              coercedObj[field.name] = field.defaultValue;
            } else if ((0, _definition.isNonNullType)(field.type)) {
              return;
            }
            continue;
          }
          const fieldValue = valueFromAST(fieldNode.value, field.type, variables);
          if (fieldValue === void 0) {
            return;
          }
          coercedObj[field.name] = fieldValue;
        }
        if (type.isOneOf) {
          const keys = Object.keys(coercedObj);
          if (keys.length !== 1) {
            return;
          }
          if (coercedObj[keys[0]] === null) {
            return;
          }
        }
        return coercedObj;
      }
      if ((0, _definition.isLeafType)(type)) {
        let result;
        try {
          result = type.parseLiteral(valueNode, variables);
        } catch (_error) {
          return;
        }
        if (result === void 0) {
          return;
        }
        return result;
      }
      (0, _invariant.invariant)(
        false,
        "Unexpected input type: " + (0, _inspect2.inspect)(type)
      );
    }
    function isMissingVariable(valueNode, variables) {
      return valueNode.kind === _kinds.Kind.VARIABLE && (variables == null || variables[valueNode.name.value] === void 0 || !hasOwnProperty2(variables, valueNode.name.value));
    }
    function hasOwnProperty2(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
  }
});

// node_modules/graphql/execution/values.js
var require_values = __commonJS({
  "node_modules/graphql/execution/values.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.getArgumentValues = getArgumentValues;
    exports2.getDirectiveValues = getDirectiveValues;
    exports2.getVariableValues = getVariableValues;
    var _inspect2 = require_inspect();
    var _keyMap = require_keyMap();
    var _printPathArray = require_printPathArray();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _printer = require_printer();
    var _definition = require_definition();
    var _coerceInputValue = require_coerceInputValue();
    var _typeFromAST = require_typeFromAST();
    var _valueFromAST = require_valueFromAST();
    function getVariableValues(schema, varDefNodes, inputs, options) {
      const errors = [];
      const maxErrors = options === null || options === void 0 ? void 0 : options.maxErrors;
      try {
        const coerced = coerceVariableValues(
          schema,
          varDefNodes,
          inputs,
          (error) => {
            if (maxErrors != null && errors.length >= maxErrors) {
              throw new _GraphQLError.GraphQLError(
                "Too many errors processing variables, error limit reached. Execution aborted."
              );
            }
            errors.push(error);
          }
        );
        if (errors.length === 0) {
          return {
            coerced
          };
        }
      } catch (error) {
        errors.push(error);
      }
      return {
        errors
      };
    }
    function coerceVariableValues(schema, varDefNodes, inputs, onError) {
      const coercedValues = /* @__PURE__ */ Object.create(null);
      for (const varDefNode of varDefNodes) {
        const varName = varDefNode.variable.name.value;
        const varType = (0, _typeFromAST.typeFromAST)(schema, varDefNode.type);
        if (!(0, _definition.isInputType)(varType)) {
          const varTypeStr = (0, _printer.print)(varDefNode.type);
          onError(
            new _GraphQLError.GraphQLError(
              `Variable "$${varName}" expected value of type "${varTypeStr}" which cannot be used as an input type.`,
              {
                nodes: varDefNode.type
              }
            )
          );
          continue;
        }
        if (!hasOwnProperty2(inputs, varName)) {
          if (varDefNode.defaultValue) {
            coercedValues[varName] = (0, _valueFromAST.valueFromAST)(
              varDefNode.defaultValue,
              varType
            );
          } else if ((0, _definition.isNonNullType)(varType)) {
            const varTypeStr = (0, _inspect2.inspect)(varType);
            onError(
              new _GraphQLError.GraphQLError(
                `Variable "$${varName}" of required type "${varTypeStr}" was not provided.`,
                {
                  nodes: varDefNode
                }
              )
            );
          }
          continue;
        }
        const value = inputs[varName];
        if (value === null && (0, _definition.isNonNullType)(varType)) {
          const varTypeStr = (0, _inspect2.inspect)(varType);
          onError(
            new _GraphQLError.GraphQLError(
              `Variable "$${varName}" of non-null type "${varTypeStr}" must not be null.`,
              {
                nodes: varDefNode
              }
            )
          );
          continue;
        }
        coercedValues[varName] = (0, _coerceInputValue.coerceInputValue)(
          value,
          varType,
          (path4, invalidValue, error) => {
            let prefix = `Variable "$${varName}" got invalid value ` + (0, _inspect2.inspect)(invalidValue);
            if (path4.length > 0) {
              prefix += ` at "${varName}${(0, _printPathArray.printPathArray)(
                path4
              )}"`;
            }
            onError(
              new _GraphQLError.GraphQLError(prefix + "; " + error.message, {
                nodes: varDefNode,
                originalError: error
              })
            );
          }
        );
      }
      return { ...coercedValues };
    }
    function getArgumentValues(def, node, variableValues) {
      var _node$arguments;
      const coercedValues = /* @__PURE__ */ Object.create(null);
      const argumentNodes = (_node$arguments = node.arguments) !== null && _node$arguments !== void 0 ? _node$arguments : [];
      const argNodeMap = (0, _keyMap.keyMap)(
        argumentNodes,
        (arg) => arg.name.value
      );
      for (const argDef of def.args) {
        const name = argDef.name;
        const argType = argDef.type;
        const argumentNode = argNodeMap[name];
        if (!argumentNode) {
          if (argDef.defaultValue !== void 0) {
            coercedValues[name] = argDef.defaultValue;
          } else if ((0, _definition.isNonNullType)(argType)) {
            throw new _GraphQLError.GraphQLError(
              `Argument "${name}" of required type "${(0, _inspect2.inspect)(
                argType
              )}" was not provided.`,
              {
                nodes: node
              }
            );
          }
          continue;
        }
        const valueNode = argumentNode.value;
        let isNull = valueNode.kind === _kinds.Kind.NULL;
        if (valueNode.kind === _kinds.Kind.VARIABLE) {
          const variableName = valueNode.name.value;
          if (variableValues == null || !hasOwnProperty2(variableValues, variableName)) {
            if (argDef.defaultValue !== void 0) {
              coercedValues[name] = argDef.defaultValue;
            } else if ((0, _definition.isNonNullType)(argType)) {
              throw new _GraphQLError.GraphQLError(
                `Argument "${name}" of required type "${(0, _inspect2.inspect)(
                  argType
                )}" was provided the variable "$${variableName}" which was not provided a runtime value.`,
                {
                  nodes: valueNode
                }
              );
            }
            continue;
          }
          isNull = variableValues[variableName] == null;
        }
        if (isNull && (0, _definition.isNonNullType)(argType)) {
          throw new _GraphQLError.GraphQLError(
            `Argument "${name}" of non-null type "${(0, _inspect2.inspect)(
              argType
            )}" must not be null.`,
            {
              nodes: valueNode
            }
          );
        }
        const coercedValue = (0, _valueFromAST.valueFromAST)(
          valueNode,
          argType,
          variableValues
        );
        if (coercedValue === void 0) {
          throw new _GraphQLError.GraphQLError(
            `Argument "${name}" has invalid value ${(0, _printer.print)(
              valueNode
            )}.`,
            {
              nodes: valueNode
            }
          );
        }
        coercedValues[name] = coercedValue;
      }
      return { ...coercedValues };
    }
    function getDirectiveValues(directiveDef, node, variableValues) {
      var _node$directives;
      const directiveNode = (_node$directives = node.directives) === null || _node$directives === void 0 ? void 0 : _node$directives.find(
        (directive) => directive.name.value === directiveDef.name
      );
      if (directiveNode) {
        return getArgumentValues(directiveDef, directiveNode, variableValues);
      }
    }
    function hasOwnProperty2(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
  }
});

// node_modules/graphql/execution/collectFields.js
var require_collectFields = __commonJS({
  "node_modules/graphql/execution/collectFields.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.collectFields = collectFields;
    exports2.collectSubfields = collectSubfields;
    var _kinds = require_kinds();
    var _definition = require_definition();
    var _directives = require_directives();
    var _typeFromAST = require_typeFromAST();
    var _values = require_values();
    function collectFields(schema, fragments, variableValues, runtimeType, selectionSet) {
      const fields = /* @__PURE__ */ new Map();
      collectFieldsImpl(
        schema,
        fragments,
        variableValues,
        runtimeType,
        selectionSet,
        fields,
        /* @__PURE__ */ new Set()
      );
      return fields;
    }
    function collectSubfields(schema, fragments, variableValues, returnType, fieldNodes) {
      const subFieldNodes = /* @__PURE__ */ new Map();
      const visitedFragmentNames = /* @__PURE__ */ new Set();
      for (const node of fieldNodes) {
        if (node.selectionSet) {
          collectFieldsImpl(
            schema,
            fragments,
            variableValues,
            returnType,
            node.selectionSet,
            subFieldNodes,
            visitedFragmentNames
          );
        }
      }
      return subFieldNodes;
    }
    function collectFieldsImpl(schema, fragments, variableValues, runtimeType, selectionSet, fields, visitedFragmentNames) {
      for (const selection of selectionSet.selections) {
        switch (selection.kind) {
          case _kinds.Kind.FIELD: {
            if (!shouldIncludeNode(variableValues, selection)) {
              continue;
            }
            const name = getFieldEntryKey(selection);
            const fieldList = fields.get(name);
            if (fieldList !== void 0) {
              fieldList.push(selection);
            } else {
              fields.set(name, [selection]);
            }
            break;
          }
          case _kinds.Kind.INLINE_FRAGMENT: {
            if (!shouldIncludeNode(variableValues, selection) || !doesFragmentConditionMatch(schema, selection, runtimeType)) {
              continue;
            }
            collectFieldsImpl(
              schema,
              fragments,
              variableValues,
              runtimeType,
              selection.selectionSet,
              fields,
              visitedFragmentNames
            );
            break;
          }
          case _kinds.Kind.FRAGMENT_SPREAD: {
            const fragName = selection.name.value;
            if (visitedFragmentNames.has(fragName) || !shouldIncludeNode(variableValues, selection)) {
              continue;
            }
            visitedFragmentNames.add(fragName);
            const fragment = fragments[fragName];
            if (!fragment || !doesFragmentConditionMatch(schema, fragment, runtimeType)) {
              continue;
            }
            collectFieldsImpl(
              schema,
              fragments,
              variableValues,
              runtimeType,
              fragment.selectionSet,
              fields,
              visitedFragmentNames
            );
            break;
          }
        }
      }
    }
    function shouldIncludeNode(variableValues, node) {
      const skip = (0, _values.getDirectiveValues)(
        _directives.GraphQLSkipDirective,
        node,
        variableValues
      );
      if ((skip === null || skip === void 0 ? void 0 : skip.if) === true) {
        return false;
      }
      const include = (0, _values.getDirectiveValues)(
        _directives.GraphQLIncludeDirective,
        node,
        variableValues
      );
      if ((include === null || include === void 0 ? void 0 : include.if) === false) {
        return false;
      }
      return true;
    }
    function doesFragmentConditionMatch(schema, fragment, type) {
      const typeConditionNode = fragment.typeCondition;
      if (!typeConditionNode) {
        return true;
      }
      const conditionalType = (0, _typeFromAST.typeFromAST)(
        schema,
        typeConditionNode
      );
      if (conditionalType === type) {
        return true;
      }
      if ((0, _definition.isAbstractType)(conditionalType)) {
        return schema.isSubType(conditionalType, type);
      }
      return false;
    }
    function getFieldEntryKey(node) {
      return node.alias ? node.alias.value : node.name.value;
    }
  }
});

// node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.js
var require_SingleFieldSubscriptionsRule = __commonJS({
  "node_modules/graphql/validation/rules/SingleFieldSubscriptionsRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.SingleFieldSubscriptionsRule = SingleFieldSubscriptionsRule;
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _collectFields = require_collectFields();
    function SingleFieldSubscriptionsRule(context) {
      return {
        OperationDefinition(node) {
          if (node.operation === "subscription") {
            const schema = context.getSchema();
            const subscriptionType = schema.getSubscriptionType();
            if (subscriptionType) {
              const operationName = node.name ? node.name.value : null;
              const variableValues = /* @__PURE__ */ Object.create(null);
              const document = context.getDocument();
              const fragments = /* @__PURE__ */ Object.create(null);
              for (const definition of document.definitions) {
                if (definition.kind === _kinds.Kind.FRAGMENT_DEFINITION) {
                  fragments[definition.name.value] = definition;
                }
              }
              const fields = (0, _collectFields.collectFields)(
                schema,
                fragments,
                variableValues,
                subscriptionType,
                node.selectionSet
              );
              if (fields.size > 1) {
                const fieldSelectionLists = [...fields.values()];
                const extraFieldSelectionLists = fieldSelectionLists.slice(1);
                const extraFieldSelections = extraFieldSelectionLists.flat();
                context.reportError(
                  new _GraphQLError.GraphQLError(
                    operationName != null ? `Subscription "${operationName}" must select only one top level field.` : "Anonymous Subscription must select only one top level field.",
                    {
                      nodes: extraFieldSelections
                    }
                  )
                );
              }
              for (const fieldNodes of fields.values()) {
                const field = fieldNodes[0];
                const fieldName = field.name.value;
                if (fieldName.startsWith("__")) {
                  context.reportError(
                    new _GraphQLError.GraphQLError(
                      operationName != null ? `Subscription "${operationName}" must not select an introspection top level field.` : "Anonymous Subscription must not select an introspection top level field.",
                      {
                        nodes: fieldNodes
                      }
                    )
                  );
                }
              }
            }
          }
        }
      };
    }
  }
});

// node_modules/graphql/jsutils/groupBy.js
var require_groupBy = __commonJS({
  "node_modules/graphql/jsutils/groupBy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.groupBy = groupBy;
    function groupBy(list, keyFn) {
      const result = /* @__PURE__ */ new Map();
      for (const item of list) {
        const key = keyFn(item);
        const group = result.get(key);
        if (group === void 0) {
          result.set(key, [item]);
        } else {
          group.push(item);
        }
      }
      return result;
    }
  }
});

// node_modules/graphql/validation/rules/UniqueArgumentDefinitionNamesRule.js
var require_UniqueArgumentDefinitionNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueArgumentDefinitionNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueArgumentDefinitionNamesRule = UniqueArgumentDefinitionNamesRule;
    var _groupBy = require_groupBy();
    var _GraphQLError = require_GraphQLError();
    function UniqueArgumentDefinitionNamesRule(context) {
      return {
        DirectiveDefinition(directiveNode) {
          var _directiveNode$argume;
          const argumentNodes = (_directiveNode$argume = directiveNode.arguments) !== null && _directiveNode$argume !== void 0 ? _directiveNode$argume : [];
          return checkArgUniqueness(`@${directiveNode.name.value}`, argumentNodes);
        },
        InterfaceTypeDefinition: checkArgUniquenessPerField,
        InterfaceTypeExtension: checkArgUniquenessPerField,
        ObjectTypeDefinition: checkArgUniquenessPerField,
        ObjectTypeExtension: checkArgUniquenessPerField
      };
      function checkArgUniquenessPerField(typeNode) {
        var _typeNode$fields;
        const typeName = typeNode.name.value;
        const fieldNodes = (_typeNode$fields = typeNode.fields) !== null && _typeNode$fields !== void 0 ? _typeNode$fields : [];
        for (const fieldDef of fieldNodes) {
          var _fieldDef$arguments;
          const fieldName = fieldDef.name.value;
          const argumentNodes = (_fieldDef$arguments = fieldDef.arguments) !== null && _fieldDef$arguments !== void 0 ? _fieldDef$arguments : [];
          checkArgUniqueness(`${typeName}.${fieldName}`, argumentNodes);
        }
        return false;
      }
      function checkArgUniqueness(parentName, argumentNodes) {
        const seenArgs = (0, _groupBy.groupBy)(
          argumentNodes,
          (arg) => arg.name.value
        );
        for (const [argName, argNodes] of seenArgs) {
          if (argNodes.length > 1) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Argument "${parentName}(${argName}:)" can only be defined once.`,
                {
                  nodes: argNodes.map((node) => node.name)
                }
              )
            );
          }
        }
        return false;
      }
    }
  }
});

// node_modules/graphql/validation/rules/UniqueArgumentNamesRule.js
var require_UniqueArgumentNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueArgumentNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueArgumentNamesRule = UniqueArgumentNamesRule;
    var _groupBy = require_groupBy();
    var _GraphQLError = require_GraphQLError();
    function UniqueArgumentNamesRule(context) {
      return {
        Field: checkArgUniqueness,
        Directive: checkArgUniqueness
      };
      function checkArgUniqueness(parentNode) {
        var _parentNode$arguments;
        const argumentNodes = (_parentNode$arguments = parentNode.arguments) !== null && _parentNode$arguments !== void 0 ? _parentNode$arguments : [];
        const seenArgs = (0, _groupBy.groupBy)(
          argumentNodes,
          (arg) => arg.name.value
        );
        for (const [argName, argNodes] of seenArgs) {
          if (argNodes.length > 1) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `There can be only one argument named "${argName}".`,
                {
                  nodes: argNodes.map((node) => node.name)
                }
              )
            );
          }
        }
      }
    }
  }
});

// node_modules/graphql/validation/rules/UniqueDirectiveNamesRule.js
var require_UniqueDirectiveNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueDirectiveNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueDirectiveNamesRule = UniqueDirectiveNamesRule;
    var _GraphQLError = require_GraphQLError();
    function UniqueDirectiveNamesRule(context) {
      const knownDirectiveNames = /* @__PURE__ */ Object.create(null);
      const schema = context.getSchema();
      return {
        DirectiveDefinition(node) {
          const directiveName = node.name.value;
          if (schema !== null && schema !== void 0 && schema.getDirective(directiveName)) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Directive "@${directiveName}" already exists in the schema. It cannot be redefined.`,
                {
                  nodes: node.name
                }
              )
            );
            return;
          }
          if (knownDirectiveNames[directiveName]) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `There can be only one directive named "@${directiveName}".`,
                {
                  nodes: [knownDirectiveNames[directiveName], node.name]
                }
              )
            );
          } else {
            knownDirectiveNames[directiveName] = node.name;
          }
          return false;
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/UniqueDirectivesPerLocationRule.js
var require_UniqueDirectivesPerLocationRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueDirectivesPerLocationRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueDirectivesPerLocationRule = UniqueDirectivesPerLocationRule;
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _predicates = require_predicates();
    var _directives = require_directives();
    function UniqueDirectivesPerLocationRule(context) {
      const uniqueDirectiveMap = /* @__PURE__ */ Object.create(null);
      const schema = context.getSchema();
      const definedDirectives = schema ? schema.getDirectives() : _directives.specifiedDirectives;
      for (const directive of definedDirectives) {
        uniqueDirectiveMap[directive.name] = !directive.isRepeatable;
      }
      const astDefinitions = context.getDocument().definitions;
      for (const def of astDefinitions) {
        if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
          uniqueDirectiveMap[def.name.value] = !def.repeatable;
        }
      }
      const schemaDirectives = /* @__PURE__ */ Object.create(null);
      const typeDirectivesMap = /* @__PURE__ */ Object.create(null);
      const directiveDirectivesMap = /* @__PURE__ */ Object.create(null);
      return {
        // Many different AST nodes may contain directives. Rather than listing
        // them all, just listen for entering any node, and check to see if it
        // defines any directives.
        enter(node) {
          if (!("directives" in node) || !node.directives) {
            return;
          }
          let seenDirectives;
          if (node.kind === _kinds.Kind.SCHEMA_DEFINITION || node.kind === _kinds.Kind.SCHEMA_EXTENSION) {
            seenDirectives = schemaDirectives;
          } else if ((0, _predicates.isTypeDefinitionNode)(node) || (0, _predicates.isTypeExtensionNode)(node)) {
            const typeName = node.name.value;
            seenDirectives = typeDirectivesMap[typeName];
            if (seenDirectives === void 0) {
              typeDirectivesMap[typeName] = seenDirectives = /* @__PURE__ */ Object.create(null);
            }
          } else if (node.kind === _kinds.Kind.DIRECTIVE_DEFINITION || node.kind === _kinds.Kind.DIRECTIVE_EXTENSION) {
            const directiveName = node.name.value;
            seenDirectives = directiveDirectivesMap[directiveName];
            if (seenDirectives === void 0) {
              directiveDirectivesMap[directiveName] = seenDirectives = /* @__PURE__ */ Object.create(null);
            }
          } else {
            seenDirectives = /* @__PURE__ */ Object.create(null);
          }
          for (const directive of node.directives) {
            const directiveName = directive.name.value;
            if (uniqueDirectiveMap[directiveName]) {
              if (seenDirectives[directiveName]) {
                context.reportError(
                  new _GraphQLError.GraphQLError(
                    `The directive "@${directiveName}" can only be used once at this location.`,
                    {
                      nodes: [seenDirectives[directiveName], directive]
                    }
                  )
                );
              } else {
                seenDirectives[directiveName] = directive;
              }
            }
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/UniqueEnumValueNamesRule.js
var require_UniqueEnumValueNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueEnumValueNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueEnumValueNamesRule = UniqueEnumValueNamesRule;
    var _GraphQLError = require_GraphQLError();
    var _definition = require_definition();
    function UniqueEnumValueNamesRule(context) {
      const schema = context.getSchema();
      const existingTypeMap = schema ? schema.getTypeMap() : /* @__PURE__ */ Object.create(null);
      const knownValueNames = /* @__PURE__ */ Object.create(null);
      return {
        EnumTypeDefinition: checkValueUniqueness,
        EnumTypeExtension: checkValueUniqueness
      };
      function checkValueUniqueness(node) {
        var _node$values;
        const typeName = node.name.value;
        if (!knownValueNames[typeName]) {
          knownValueNames[typeName] = /* @__PURE__ */ Object.create(null);
        }
        const valueNodes = (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : [];
        const valueNames = knownValueNames[typeName];
        for (const valueDef of valueNodes) {
          const valueName = valueDef.name.value;
          const existingType = existingTypeMap[typeName];
          if ((0, _definition.isEnumType)(existingType) && existingType.getValue(valueName)) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Enum value "${typeName}.${valueName}" already exists in the schema. It cannot also be defined in this type extension.`,
                {
                  nodes: valueDef.name
                }
              )
            );
          } else if (valueNames[valueName]) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Enum value "${typeName}.${valueName}" can only be defined once.`,
                {
                  nodes: [valueNames[valueName], valueDef.name]
                }
              )
            );
          } else {
            valueNames[valueName] = valueDef.name;
          }
        }
        return false;
      }
    }
  }
});

// node_modules/graphql/validation/rules/UniqueFieldDefinitionNamesRule.js
var require_UniqueFieldDefinitionNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueFieldDefinitionNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueFieldDefinitionNamesRule = UniqueFieldDefinitionNamesRule;
    var _GraphQLError = require_GraphQLError();
    var _definition = require_definition();
    function UniqueFieldDefinitionNamesRule(context) {
      const schema = context.getSchema();
      const existingTypeMap = schema ? schema.getTypeMap() : /* @__PURE__ */ Object.create(null);
      const knownFieldNames = /* @__PURE__ */ Object.create(null);
      return {
        InputObjectTypeDefinition: checkFieldUniqueness,
        InputObjectTypeExtension: checkFieldUniqueness,
        InterfaceTypeDefinition: checkFieldUniqueness,
        InterfaceTypeExtension: checkFieldUniqueness,
        ObjectTypeDefinition: checkFieldUniqueness,
        ObjectTypeExtension: checkFieldUniqueness
      };
      function checkFieldUniqueness(node) {
        var _node$fields;
        const typeName = node.name.value;
        if (!knownFieldNames[typeName]) {
          knownFieldNames[typeName] = /* @__PURE__ */ Object.create(null);
        }
        const fieldNodes = (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : [];
        const fieldNames = knownFieldNames[typeName];
        for (const fieldDef of fieldNodes) {
          const fieldName = fieldDef.name.value;
          if (hasField(existingTypeMap[typeName], fieldName)) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Field "${typeName}.${fieldName}" already exists in the schema. It cannot also be defined in this type extension.`,
                {
                  nodes: fieldDef.name
                }
              )
            );
          } else if (fieldNames[fieldName]) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Field "${typeName}.${fieldName}" can only be defined once.`,
                {
                  nodes: [fieldNames[fieldName], fieldDef.name]
                }
              )
            );
          } else {
            fieldNames[fieldName] = fieldDef.name;
          }
        }
        return false;
      }
    }
    function hasField(type, fieldName) {
      if ((0, _definition.isObjectType)(type) || (0, _definition.isInterfaceType)(type) || (0, _definition.isInputObjectType)(type)) {
        return type.getFields()[fieldName] != null;
      }
      return false;
    }
  }
});

// node_modules/graphql/validation/rules/UniqueFragmentNamesRule.js
var require_UniqueFragmentNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueFragmentNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueFragmentNamesRule = UniqueFragmentNamesRule;
    var _GraphQLError = require_GraphQLError();
    function UniqueFragmentNamesRule(context) {
      const knownFragmentNames = /* @__PURE__ */ Object.create(null);
      return {
        OperationDefinition: () => false,
        FragmentDefinition(node) {
          const fragmentName = node.name.value;
          if (knownFragmentNames[fragmentName]) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `There can be only one fragment named "${fragmentName}".`,
                {
                  nodes: [knownFragmentNames[fragmentName], node.name]
                }
              )
            );
          } else {
            knownFragmentNames[fragmentName] = node.name;
          }
          return false;
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/UniqueInputFieldNamesRule.js
var require_UniqueInputFieldNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueInputFieldNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueInputFieldNamesRule = UniqueInputFieldNamesRule;
    var _invariant = require_invariant();
    var _GraphQLError = require_GraphQLError();
    function UniqueInputFieldNamesRule(context) {
      const knownNameStack = [];
      let knownNames = /* @__PURE__ */ Object.create(null);
      return {
        ObjectValue: {
          enter() {
            knownNameStack.push(knownNames);
            knownNames = /* @__PURE__ */ Object.create(null);
          },
          leave() {
            const prevKnownNames = knownNameStack.pop();
            prevKnownNames || (0, _invariant.invariant)(false);
            knownNames = prevKnownNames;
          }
        },
        ObjectField(node) {
          const fieldName = node.name.value;
          if (knownNames[fieldName]) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `There can be only one input field named "${fieldName}".`,
                {
                  nodes: [knownNames[fieldName], node.name]
                }
              )
            );
          } else {
            knownNames[fieldName] = node.name;
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/UniqueOperationNamesRule.js
var require_UniqueOperationNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueOperationNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueOperationNamesRule = UniqueOperationNamesRule;
    var _GraphQLError = require_GraphQLError();
    function UniqueOperationNamesRule(context) {
      const knownOperationNames = /* @__PURE__ */ Object.create(null);
      return {
        OperationDefinition(node) {
          const operationName = node.name;
          if (operationName) {
            if (knownOperationNames[operationName.value]) {
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `There can be only one operation named "${operationName.value}".`,
                  {
                    nodes: [
                      knownOperationNames[operationName.value],
                      operationName
                    ]
                  }
                )
              );
            } else {
              knownOperationNames[operationName.value] = operationName;
            }
          }
          return false;
        },
        FragmentDefinition: () => false
      };
    }
  }
});

// node_modules/graphql/validation/rules/UniqueOperationTypesRule.js
var require_UniqueOperationTypesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueOperationTypesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueOperationTypesRule = UniqueOperationTypesRule;
    var _GraphQLError = require_GraphQLError();
    function UniqueOperationTypesRule(context) {
      const schema = context.getSchema();
      const definedOperationTypes = /* @__PURE__ */ Object.create(null);
      const existingOperationTypes = schema ? {
        query: schema.getQueryType(),
        mutation: schema.getMutationType(),
        subscription: schema.getSubscriptionType()
      } : {};
      return {
        SchemaDefinition: checkOperationTypes,
        SchemaExtension: checkOperationTypes
      };
      function checkOperationTypes(node) {
        var _node$operationTypes;
        const operationTypesNodes = (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : [];
        for (const operationType of operationTypesNodes) {
          const operation = operationType.operation;
          const alreadyDefinedOperationType = definedOperationTypes[operation];
          if (existingOperationTypes[operation]) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Type for ${operation} already defined in the schema. It cannot be redefined.`,
                {
                  nodes: operationType
                }
              )
            );
          } else if (alreadyDefinedOperationType) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `There can be only one ${operation} type in schema.`,
                {
                  nodes: [alreadyDefinedOperationType, operationType]
                }
              )
            );
          } else {
            definedOperationTypes[operation] = operationType;
          }
        }
        return false;
      }
    }
  }
});

// node_modules/graphql/validation/rules/UniqueTypeNamesRule.js
var require_UniqueTypeNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueTypeNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueTypeNamesRule = UniqueTypeNamesRule;
    var _GraphQLError = require_GraphQLError();
    function UniqueTypeNamesRule(context) {
      const knownTypeNames = /* @__PURE__ */ Object.create(null);
      const schema = context.getSchema();
      return {
        ScalarTypeDefinition: checkTypeName,
        ObjectTypeDefinition: checkTypeName,
        InterfaceTypeDefinition: checkTypeName,
        UnionTypeDefinition: checkTypeName,
        EnumTypeDefinition: checkTypeName,
        InputObjectTypeDefinition: checkTypeName
      };
      function checkTypeName(node) {
        const typeName = node.name.value;
        if (schema !== null && schema !== void 0 && schema.getType(typeName)) {
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Type "${typeName}" already exists in the schema. It cannot also be defined in this type definition.`,
              {
                nodes: node.name
              }
            )
          );
          return;
        }
        if (knownTypeNames[typeName]) {
          context.reportError(
            new _GraphQLError.GraphQLError(
              `There can be only one type named "${typeName}".`,
              {
                nodes: [knownTypeNames[typeName], node.name]
              }
            )
          );
        } else {
          knownTypeNames[typeName] = node.name;
        }
        return false;
      }
    }
  }
});

// node_modules/graphql/validation/rules/UniqueVariableNamesRule.js
var require_UniqueVariableNamesRule = __commonJS({
  "node_modules/graphql/validation/rules/UniqueVariableNamesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UniqueVariableNamesRule = UniqueVariableNamesRule;
    var _groupBy = require_groupBy();
    var _GraphQLError = require_GraphQLError();
    function UniqueVariableNamesRule(context) {
      return {
        OperationDefinition(operationNode) {
          var _operationNode$variab;
          const variableDefinitions = (_operationNode$variab = operationNode.variableDefinitions) !== null && _operationNode$variab !== void 0 ? _operationNode$variab : [];
          const seenVariableDefinitions = (0, _groupBy.groupBy)(
            variableDefinitions,
            (node) => node.variable.name.value
          );
          for (const [variableName, variableNodes] of seenVariableDefinitions) {
            if (variableNodes.length > 1) {
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `There can be only one variable named "$${variableName}".`,
                  {
                    nodes: variableNodes.map((node) => node.variable.name)
                  }
                )
              );
            }
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/ValuesOfCorrectTypeRule.js
var require_ValuesOfCorrectTypeRule = __commonJS({
  "node_modules/graphql/validation/rules/ValuesOfCorrectTypeRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.ValuesOfCorrectTypeRule = ValuesOfCorrectTypeRule;
    var _didYouMean = require_didYouMean();
    var _inspect2 = require_inspect();
    var _keyMap = require_keyMap();
    var _suggestionList = require_suggestionList();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _printer = require_printer();
    var _definition = require_definition();
    function ValuesOfCorrectTypeRule(context) {
      return {
        ListValue(node) {
          const type = (0, _definition.getNullableType)(
            context.getParentInputType()
          );
          if (!(0, _definition.isListType)(type)) {
            isValidValueNode(context, node);
            return false;
          }
        },
        ObjectValue(node) {
          const type = (0, _definition.getNamedType)(context.getInputType());
          if (!(0, _definition.isInputObjectType)(type)) {
            isValidValueNode(context, node);
            return false;
          }
          const fieldNodeMap = (0, _keyMap.keyMap)(
            node.fields,
            (field) => field.name.value
          );
          for (const fieldDef of Object.values(type.getFields())) {
            const fieldNode = fieldNodeMap[fieldDef.name];
            if (!fieldNode && (0, _definition.isRequiredInputField)(fieldDef)) {
              const typeStr = (0, _inspect2.inspect)(fieldDef.type);
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Field "${type.name}.${fieldDef.name}" of required type "${typeStr}" was not provided.`,
                  {
                    nodes: node
                  }
                )
              );
            }
          }
          if (type.isOneOf) {
            validateOneOfInputObject(context, node, type, fieldNodeMap);
          }
        },
        ObjectField(node) {
          const parentType = (0, _definition.getNamedType)(
            context.getParentInputType()
          );
          const fieldType = context.getInputType();
          if (!fieldType && (0, _definition.isInputObjectType)(parentType)) {
            const suggestions = (0, _suggestionList.suggestionList)(
              node.name.value,
              Object.keys(parentType.getFields())
            );
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Field "${node.name.value}" is not defined by type "${parentType.name}".` + (0, _didYouMean.didYouMean)(suggestions),
                {
                  nodes: node
                }
              )
            );
          }
        },
        NullValue(node) {
          const type = context.getInputType();
          if ((0, _definition.isNonNullType)(type)) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Expected value of type "${(0, _inspect2.inspect)(
                  type
                )}", found ${(0, _printer.print)(node)}.`,
                {
                  nodes: node
                }
              )
            );
          }
        },
        EnumValue: (node) => isValidValueNode(context, node),
        IntValue: (node) => isValidValueNode(context, node),
        FloatValue: (node) => isValidValueNode(context, node),
        // Descriptions are string values that would not validate according
        // to the below logic, but since (per the specification) descriptions must
        // not affect validation, they are ignored entirely when visiting the AST
        // and do not require special handling.
        // See https://spec.graphql.org/draft/#sec-Descriptions
        StringValue: (node) => isValidValueNode(context, node),
        BooleanValue: (node) => isValidValueNode(context, node)
      };
    }
    function isValidValueNode(context, node) {
      const locationType = context.getInputType();
      if (!locationType) {
        return;
      }
      const type = (0, _definition.getNamedType)(locationType);
      if (!(0, _definition.isLeafType)(type)) {
        const typeStr = (0, _inspect2.inspect)(locationType);
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Expected value of type "${typeStr}", found ${(0, _printer.print)(
              node
            )}.`,
            {
              nodes: node
            }
          )
        );
        return;
      }
      try {
        const parseResult = type.parseLiteral(
          node,
          void 0
          /* variables */
        );
        if (parseResult === void 0) {
          const typeStr = (0, _inspect2.inspect)(locationType);
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Expected value of type "${typeStr}", found ${(0, _printer.print)(
                node
              )}.`,
              {
                nodes: node
              }
            )
          );
        }
      } catch (error) {
        const typeStr = (0, _inspect2.inspect)(locationType);
        if (error instanceof _GraphQLError.GraphQLError) {
          context.reportError(error);
        } else {
          context.reportError(
            new _GraphQLError.GraphQLError(
              `Expected value of type "${typeStr}", found ${(0, _printer.print)(
                node
              )}; ` + error.message,
              {
                nodes: node,
                originalError: error
              }
            )
          );
        }
      }
    }
    function validateOneOfInputObject(context, node, type, fieldNodeMap) {
      var _fieldNodeMap$keys$;
      const keys = Object.keys(fieldNodeMap);
      const isNotExactlyOneField = keys.length !== 1;
      if (isNotExactlyOneField) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `OneOf Input Object "${type.name}" must specify exactly one key.`,
            {
              nodes: [node]
            }
          )
        );
        return;
      }
      const value = (_fieldNodeMap$keys$ = fieldNodeMap[keys[0]]) === null || _fieldNodeMap$keys$ === void 0 ? void 0 : _fieldNodeMap$keys$.value;
      const isNullLiteral = !value || value.kind === _kinds.Kind.NULL;
      if (isNullLiteral) {
        context.reportError(
          new _GraphQLError.GraphQLError(
            `Field "${type.name}.${keys[0]}" must be non-null.`,
            {
              nodes: [node]
            }
          )
        );
      }
    }
  }
});

// node_modules/graphql/validation/rules/VariablesAreInputTypesRule.js
var require_VariablesAreInputTypesRule = __commonJS({
  "node_modules/graphql/validation/rules/VariablesAreInputTypesRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.VariablesAreInputTypesRule = VariablesAreInputTypesRule;
    var _GraphQLError = require_GraphQLError();
    var _printer = require_printer();
    var _definition = require_definition();
    var _typeFromAST = require_typeFromAST();
    function VariablesAreInputTypesRule(context) {
      return {
        VariableDefinition(node) {
          const type = (0, _typeFromAST.typeFromAST)(
            context.getSchema(),
            node.type
          );
          if (type !== void 0 && !(0, _definition.isInputType)(type)) {
            const variableName = node.variable.name.value;
            const typeName = (0, _printer.print)(node.type);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `Variable "$${variableName}" cannot be non-input type "${typeName}".`,
                {
                  nodes: node.type
                }
              )
            );
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/VariablesInAllowedPositionRule.js
var require_VariablesInAllowedPositionRule = __commonJS({
  "node_modules/graphql/validation/rules/VariablesInAllowedPositionRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.VariablesInAllowedPositionRule = VariablesInAllowedPositionRule;
    var _inspect2 = require_inspect();
    var _GraphQLError = require_GraphQLError();
    var _kinds = require_kinds();
    var _definition = require_definition();
    var _typeComparators = require_typeComparators();
    var _typeFromAST = require_typeFromAST();
    function VariablesInAllowedPositionRule(context) {
      let varDefMap = /* @__PURE__ */ Object.create(null);
      return {
        OperationDefinition: {
          enter() {
            varDefMap = /* @__PURE__ */ Object.create(null);
          },
          leave(operation) {
            const usages = context.getRecursiveVariableUsages(operation);
            for (const { node, type, defaultValue, parentType } of usages) {
              const varName = node.name.value;
              const varDef = varDefMap[varName];
              if (varDef && type) {
                const schema = context.getSchema();
                const varType = (0, _typeFromAST.typeFromAST)(schema, varDef.type);
                if (varType && !allowedVariableUsage(
                  schema,
                  varType,
                  varDef.defaultValue,
                  type,
                  defaultValue
                )) {
                  const varTypeStr = (0, _inspect2.inspect)(varType);
                  const typeStr = (0, _inspect2.inspect)(type);
                  context.reportError(
                    new _GraphQLError.GraphQLError(
                      `Variable "$${varName}" of type "${varTypeStr}" used in position expecting type "${typeStr}".`,
                      {
                        nodes: [varDef, node]
                      }
                    )
                  );
                }
                if ((0, _definition.isInputObjectType)(parentType) && parentType.isOneOf && (0, _definition.isNullableType)(varType)) {
                  context.reportError(
                    new _GraphQLError.GraphQLError(
                      `Variable "$${varName}" is of type "${varType}" but must be non-nullable to be used for OneOf Input Object "${parentType}".`,
                      {
                        nodes: [varDef, node]
                      }
                    )
                  );
                }
              }
            }
          }
        },
        VariableDefinition(node) {
          varDefMap[node.variable.name.value] = node;
        }
      };
    }
    function allowedVariableUsage(schema, varType, varDefaultValue, locationType, locationDefaultValue) {
      if ((0, _definition.isNonNullType)(locationType) && !(0, _definition.isNonNullType)(varType)) {
        const hasNonNullVariableDefaultValue = varDefaultValue != null && varDefaultValue.kind !== _kinds.Kind.NULL;
        const hasLocationDefaultValue = locationDefaultValue !== void 0;
        if (!hasNonNullVariableDefaultValue && !hasLocationDefaultValue) {
          return false;
        }
        const nullableLocationType = locationType.ofType;
        return (0, _typeComparators.isTypeSubTypeOf)(
          schema,
          varType,
          nullableLocationType
        );
      }
      return (0, _typeComparators.isTypeSubTypeOf)(schema, varType, locationType);
    }
  }
});

// node_modules/graphql/validation/specifiedRules.js
var require_specifiedRules = __commonJS({
  "node_modules/graphql/validation/specifiedRules.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.specifiedSDLRules = exports2.specifiedRules = exports2.recommendedRules = void 0;
    var _ExecutableDefinitionsRule = require_ExecutableDefinitionsRule();
    var _FieldsOnCorrectTypeRule = require_FieldsOnCorrectTypeRule();
    var _FragmentsOnCompositeTypesRule = require_FragmentsOnCompositeTypesRule();
    var _KnownArgumentNamesRule = require_KnownArgumentNamesRule();
    var _KnownDirectivesRule = require_KnownDirectivesRule();
    var _KnownFragmentNamesRule = require_KnownFragmentNamesRule();
    var _KnownTypeNamesRule = require_KnownTypeNamesRule();
    var _LoneAnonymousOperationRule = require_LoneAnonymousOperationRule();
    var _LoneSchemaDefinitionRule = require_LoneSchemaDefinitionRule();
    var _MaxIntrospectionDepthRule = require_MaxIntrospectionDepthRule();
    var _NoFragmentCyclesRule = require_NoFragmentCyclesRule();
    var _NoUndefinedVariablesRule = require_NoUndefinedVariablesRule();
    var _NoUnusedFragmentsRule = require_NoUnusedFragmentsRule();
    var _NoUnusedVariablesRule = require_NoUnusedVariablesRule();
    var _OverlappingFieldsCanBeMergedRule = require_OverlappingFieldsCanBeMergedRule();
    var _PossibleFragmentSpreadsRule = require_PossibleFragmentSpreadsRule();
    var _PossibleTypeExtensionsRule = require_PossibleTypeExtensionsRule();
    var _ProvidedRequiredArgumentsRule = require_ProvidedRequiredArgumentsRule();
    var _ScalarLeafsRule = require_ScalarLeafsRule();
    var _SingleFieldSubscriptionsRule = require_SingleFieldSubscriptionsRule();
    var _UniqueArgumentDefinitionNamesRule = require_UniqueArgumentDefinitionNamesRule();
    var _UniqueArgumentNamesRule = require_UniqueArgumentNamesRule();
    var _UniqueDirectiveNamesRule = require_UniqueDirectiveNamesRule();
    var _UniqueDirectivesPerLocationRule = require_UniqueDirectivesPerLocationRule();
    var _UniqueEnumValueNamesRule = require_UniqueEnumValueNamesRule();
    var _UniqueFieldDefinitionNamesRule = require_UniqueFieldDefinitionNamesRule();
    var _UniqueFragmentNamesRule = require_UniqueFragmentNamesRule();
    var _UniqueInputFieldNamesRule = require_UniqueInputFieldNamesRule();
    var _UniqueOperationNamesRule = require_UniqueOperationNamesRule();
    var _UniqueOperationTypesRule = require_UniqueOperationTypesRule();
    var _UniqueTypeNamesRule = require_UniqueTypeNamesRule();
    var _UniqueVariableNamesRule = require_UniqueVariableNamesRule();
    var _ValuesOfCorrectTypeRule = require_ValuesOfCorrectTypeRule();
    var _VariablesAreInputTypesRule = require_VariablesAreInputTypesRule();
    var _VariablesInAllowedPositionRule = require_VariablesInAllowedPositionRule();
    var recommendedRules = Object.freeze([
      _MaxIntrospectionDepthRule.MaxIntrospectionDepthRule
    ]);
    exports2.recommendedRules = recommendedRules;
    var specifiedRules = Object.freeze([
      _ExecutableDefinitionsRule.ExecutableDefinitionsRule,
      _UniqueOperationNamesRule.UniqueOperationNamesRule,
      _LoneAnonymousOperationRule.LoneAnonymousOperationRule,
      _SingleFieldSubscriptionsRule.SingleFieldSubscriptionsRule,
      _KnownTypeNamesRule.KnownTypeNamesRule,
      _FragmentsOnCompositeTypesRule.FragmentsOnCompositeTypesRule,
      _VariablesAreInputTypesRule.VariablesAreInputTypesRule,
      _ScalarLeafsRule.ScalarLeafsRule,
      _FieldsOnCorrectTypeRule.FieldsOnCorrectTypeRule,
      _UniqueFragmentNamesRule.UniqueFragmentNamesRule,
      _KnownFragmentNamesRule.KnownFragmentNamesRule,
      _NoUnusedFragmentsRule.NoUnusedFragmentsRule,
      _PossibleFragmentSpreadsRule.PossibleFragmentSpreadsRule,
      _NoFragmentCyclesRule.NoFragmentCyclesRule,
      _UniqueVariableNamesRule.UniqueVariableNamesRule,
      _NoUndefinedVariablesRule.NoUndefinedVariablesRule,
      _NoUnusedVariablesRule.NoUnusedVariablesRule,
      _KnownDirectivesRule.KnownDirectivesRule,
      _UniqueDirectivesPerLocationRule.UniqueDirectivesPerLocationRule,
      _KnownArgumentNamesRule.KnownArgumentNamesRule,
      _UniqueArgumentNamesRule.UniqueArgumentNamesRule,
      _ValuesOfCorrectTypeRule.ValuesOfCorrectTypeRule,
      _ProvidedRequiredArgumentsRule.ProvidedRequiredArgumentsRule,
      _VariablesInAllowedPositionRule.VariablesInAllowedPositionRule,
      _OverlappingFieldsCanBeMergedRule.OverlappingFieldsCanBeMergedRule,
      _UniqueInputFieldNamesRule.UniqueInputFieldNamesRule,
      ...recommendedRules
    ]);
    exports2.specifiedRules = specifiedRules;
    var specifiedSDLRules = Object.freeze([
      _LoneSchemaDefinitionRule.LoneSchemaDefinitionRule,
      _UniqueOperationTypesRule.UniqueOperationTypesRule,
      _UniqueTypeNamesRule.UniqueTypeNamesRule,
      _UniqueEnumValueNamesRule.UniqueEnumValueNamesRule,
      _UniqueFieldDefinitionNamesRule.UniqueFieldDefinitionNamesRule,
      _UniqueArgumentDefinitionNamesRule.UniqueArgumentDefinitionNamesRule,
      _UniqueDirectiveNamesRule.UniqueDirectiveNamesRule,
      _KnownTypeNamesRule.KnownTypeNamesRule,
      _KnownDirectivesRule.KnownDirectivesRule,
      _UniqueDirectivesPerLocationRule.UniqueDirectivesPerLocationRule,
      _PossibleTypeExtensionsRule.PossibleTypeExtensionsRule,
      _KnownArgumentNamesRule.KnownArgumentNamesOnDirectivesRule,
      _UniqueArgumentNamesRule.UniqueArgumentNamesRule,
      _UniqueInputFieldNamesRule.UniqueInputFieldNamesRule,
      _ProvidedRequiredArgumentsRule.ProvidedRequiredArgumentsOnDirectivesRule
    ]);
    exports2.specifiedSDLRules = specifiedSDLRules;
  }
});

// node_modules/graphql/validation/ValidationContext.js
var require_ValidationContext = __commonJS({
  "node_modules/graphql/validation/ValidationContext.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.ValidationContext = exports2.SDLValidationContext = exports2.ASTValidationContext = void 0;
    var _kinds = require_kinds();
    var _visitor = require_visitor();
    var _TypeInfo = require_TypeInfo();
    var ASTValidationContext = class {
      constructor(ast, onError) {
        this._ast = ast;
        this._fragments = void 0;
        this._fragmentSpreads = /* @__PURE__ */ new Map();
        this._recursivelyReferencedFragments = /* @__PURE__ */ new Map();
        this._onError = onError;
      }
      get [Symbol.toStringTag]() {
        return "ASTValidationContext";
      }
      reportError(error) {
        this._onError(error);
      }
      getDocument() {
        return this._ast;
      }
      getFragment(name) {
        let fragments;
        if (this._fragments) {
          fragments = this._fragments;
        } else {
          fragments = /* @__PURE__ */ Object.create(null);
          for (const defNode of this.getDocument().definitions) {
            if (defNode.kind === _kinds.Kind.FRAGMENT_DEFINITION) {
              fragments[defNode.name.value] = defNode;
            }
          }
          this._fragments = fragments;
        }
        return fragments[name];
      }
      getFragmentSpreads(node) {
        let spreads = this._fragmentSpreads.get(node);
        if (!spreads) {
          spreads = [];
          const setsToVisit = [node];
          let set;
          while (set = setsToVisit.pop()) {
            for (const selection of set.selections) {
              if (selection.kind === _kinds.Kind.FRAGMENT_SPREAD) {
                spreads.push(selection);
              } else if (selection.selectionSet) {
                setsToVisit.push(selection.selectionSet);
              }
            }
          }
          this._fragmentSpreads.set(node, spreads);
        }
        return spreads;
      }
      getRecursivelyReferencedFragments(operation) {
        let fragments = this._recursivelyReferencedFragments.get(operation);
        if (!fragments) {
          fragments = [];
          const collectedNames = /* @__PURE__ */ Object.create(null);
          const nodesToVisit = [operation.selectionSet];
          let node;
          while (node = nodesToVisit.pop()) {
            for (const spread of this.getFragmentSpreads(node)) {
              const fragName = spread.name.value;
              if (collectedNames[fragName] !== true) {
                collectedNames[fragName] = true;
                const fragment = this.getFragment(fragName);
                if (fragment) {
                  fragments.push(fragment);
                  nodesToVisit.push(fragment.selectionSet);
                }
              }
            }
          }
          this._recursivelyReferencedFragments.set(operation, fragments);
        }
        return fragments;
      }
    };
    exports2.ASTValidationContext = ASTValidationContext;
    var SDLValidationContext = class extends ASTValidationContext {
      constructor(ast, schema, onError) {
        super(ast, onError);
        this._schema = schema;
      }
      get [Symbol.toStringTag]() {
        return "SDLValidationContext";
      }
      getSchema() {
        return this._schema;
      }
    };
    exports2.SDLValidationContext = SDLValidationContext;
    var ValidationContext = class extends ASTValidationContext {
      /**
       * Creates a ValidationContext instance.
       * @param schema - Schema used to validate the document.
       * @param ast - Document AST being validated.
       * @param typeInfo - TypeInfo instance used to track traversal state.
       * @param onError - Callback invoked for each validation error.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import { GraphQLError } from 'graphql/error';
       * import { buildSchema, TypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const document = parse('{ greeting }');
       * const errors = [];
       * const context = new ValidationContext(
       *   schema,
       *   document,
       *   new TypeInfo(schema),
       *   (error) => errors.push(error),
       * );
       *
       * context.reportError(new GraphQLError('Example validation error.'));
       *
       * context.getSchema(); // => schema
       * errors[0].message; // => 'Example validation error.'
       * ```
       */
      constructor(schema, ast, typeInfo, onError) {
        super(ast, onError);
        this._schema = schema;
        this._typeInfo = typeInfo;
        this._variableUsages = /* @__PURE__ */ new Map();
        this._recursiveVariableUsages = /* @__PURE__ */ new Map();
      }
      /**
       * Returns the value used by `Object.prototype.toString`.
       * @returns The built-in string tag for this object.
       */
      get [Symbol.toStringTag]() {
        return "ValidationContext";
      }
      /**
       * Returns the schema being used by this validation context.
       * @returns The schema being validated against.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import { buildSchema, TypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const context = new ValidationContext(
       *   schema,
       *   parse('{ greeting }'),
       *   new TypeInfo(schema),
       *   () => {},
       * );
       *
       * context.getSchema().getQueryType()?.name; // => 'Query'
       * ```
       */
      getSchema() {
        return this._schema;
      }
      /**
       * Returns variable usages found directly within this node.
       * @param node - The AST node to inspect or visit.
       * @returns Variable usages found directly within this node.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import { buildSchema, TypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting(name: String): String
       *   }
       * `);
       * const document = parse('query ($name: String) { greeting(name: $name) }');
       * const operation = document.definitions[0];
       * const context = new ValidationContext(
       *   schema,
       *   document,
       *   new TypeInfo(schema),
       *   () => {},
       * );
       *
       * const usages = context.getVariableUsages(operation);
       *
       * usages[0].node.name.value; // => 'name'
       * String(usages[0].type); // => 'String'
       * ```
       */
      getVariableUsages(node) {
        let usages = this._variableUsages.get(node);
        if (!usages) {
          const newUsages = [];
          const typeInfo = new _TypeInfo.TypeInfo(this._schema);
          (0, _visitor.visit)(
            node,
            (0, _TypeInfo.visitWithTypeInfo)(typeInfo, {
              VariableDefinition: () => false,
              Variable(variable) {
                newUsages.push({
                  node: variable,
                  type: typeInfo.getInputType(),
                  defaultValue: typeInfo.getDefaultValue(),
                  parentType: typeInfo.getParentInputType()
                });
              }
            })
          );
          usages = newUsages;
          this._variableUsages.set(node, usages);
        }
        return usages;
      }
      /**
       * Returns variable usages for an operation, including variables used by referenced fragments.
       * @param operation - Operation definition to inspect.
       * @returns Variable usages reachable from the operation.
       * @example
       * ```ts
       * import { parse } from 'graphql/language';
       * import { buildSchema, TypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     viewer: User
       *   }
       *
       *   type User {
       *     name(prefix: String): String
       *   }
       * `);
       * const document = parse(`
       *   query ($prefix: String) {
       *     viewer {
       *       ...UserName
       *     }
       *   }
       *
       *   fragment UserName on User {
       *     name(prefix: $prefix)
       *   }
       * `);
       * const operation = document.definitions[0];
       * const context = new ValidationContext(
       *   schema,
       *   document,
       *   new TypeInfo(schema),
       *   () => {},
       * );
       *
       * const usages = context.getRecursiveVariableUsages(operation);
       *
       * usages.map((usage) => usage.node.name.value); // => ['prefix']
       * ```
       */
      getRecursiveVariableUsages(operation) {
        let usages = this._recursiveVariableUsages.get(operation);
        if (!usages) {
          usages = this.getVariableUsages(operation);
          for (const frag of this.getRecursivelyReferencedFragments(operation)) {
            usages = usages.concat(this.getVariableUsages(frag));
          }
          this._recursiveVariableUsages.set(operation, usages);
        }
        return usages;
      }
      /**
       * Returns the current output type at this point in traversal.
       * @returns The current output type, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const document = parse('{ greeting }');
       * const typeInfo = new TypeInfo(schema);
       * const context = new ValidationContext(schema, document, typeInfo, () => {});
       * let typeName;
       *
       * visit(
       *   document,
       *   visitWithTypeInfo(typeInfo, {
       *     Field: () => {
       *       typeName = String(context.getType());
       *     },
       *   }),
       * );
       *
       * typeName; // => 'String'
       * ```
       */
      getType() {
        return this._typeInfo.getType();
      }
      /**
       * Returns the current parent composite type.
       * @returns The current parent composite type, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const document = parse('{ greeting }');
       * const typeInfo = new TypeInfo(schema);
       * const context = new ValidationContext(schema, document, typeInfo, () => {});
       * let parentTypeName;
       *
       * visit(
       *   document,
       *   visitWithTypeInfo(typeInfo, {
       *     Field: () => {
       *       parentTypeName = context.getParentType()?.name;
       *     },
       *   }),
       * );
       *
       * parentTypeName; // => 'Query'
       * ```
       */
      getParentType() {
        return this._typeInfo.getParentType();
      }
      /**
       * Returns the current input type at this point in traversal.
       * @returns The current input type, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     reviews(limit: Int): [String]
       *   }
       * `);
       * const document = parse('{ reviews(limit: 5) }');
       * const typeInfo = new TypeInfo(schema);
       * const context = new ValidationContext(schema, document, typeInfo, () => {});
       * let inputTypeName;
       *
       * visit(
       *   document,
       *   visitWithTypeInfo(typeInfo, {
       *     Argument: () => {
       *       inputTypeName = String(context.getInputType());
       *     },
       *   }),
       * );
       *
       * inputTypeName; // => 'Int'
       * ```
       */
      getInputType() {
        return this._typeInfo.getInputType();
      }
      /**
       * Returns the parent input type for the current input position.
       * @returns The parent input type, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   input ReviewFilter {
       *     stars: Int
       *   }
       *
       *   type Query {
       *     reviews(filter: ReviewFilter): [String]
       *   }
       * `);
       * const document = parse('{ reviews(filter: { stars: 5 }) }');
       * const typeInfo = new TypeInfo(schema);
       * const context = new ValidationContext(schema, document, typeInfo, () => {});
       * let parentInputTypeName;
       *
       * visit(
       *   document,
       *   visitWithTypeInfo(typeInfo, {
       *     ObjectField: () => {
       *       parentInputTypeName = String(context.getParentInputType());
       *     },
       *   }),
       * );
       *
       * parentInputTypeName; // => 'ReviewFilter'
       * ```
       */
      getParentInputType() {
        return this._typeInfo.getParentInputType();
      }
      /**
       * Returns the current field definition.
       * @returns The current field definition, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const document = parse('{ greeting }');
       * const typeInfo = new TypeInfo(schema);
       * const context = new ValidationContext(schema, document, typeInfo, () => {});
       * let fieldName;
       *
       * visit(
       *   document,
       *   visitWithTypeInfo(typeInfo, {
       *     Field: () => {
       *       fieldName = context.getFieldDef()?.name;
       *     },
       *   }),
       * );
       *
       * fieldName; // => 'greeting'
       * ```
       */
      getFieldDef() {
        return this._typeInfo.getFieldDef();
      }
      /**
       * Returns the current directive definition.
       * @returns The current directive definition, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     greeting: String
       *   }
       * `);
       * const document = parse('{ greeting @include(if: true) }');
       * const typeInfo = new TypeInfo(schema);
       * const context = new ValidationContext(schema, document, typeInfo, () => {});
       * let directiveName;
       *
       * visit(
       *   document,
       *   visitWithTypeInfo(typeInfo, {
       *     Directive: () => {
       *       directiveName = context.getDirective()?.name;
       *     },
       *   }),
       * );
       *
       * directiveName; // => 'include'
       * ```
       */
      getDirective() {
        return this._typeInfo.getDirective();
      }
      /**
       * Returns the current argument definition.
       * @returns The current argument definition, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   type Query {
       *     reviews(limit: Int): [String]
       *   }
       * `);
       * const document = parse('{ reviews(limit: 5) }');
       * const typeInfo = new TypeInfo(schema);
       * const context = new ValidationContext(schema, document, typeInfo, () => {});
       * let argumentName;
       *
       * visit(
       *   document,
       *   visitWithTypeInfo(typeInfo, {
       *     Argument: () => {
       *       argumentName = context.getArgument()?.name;
       *     },
       *   }),
       * );
       *
       * argumentName; // => 'limit'
       * ```
       */
      getArgument() {
        return this._typeInfo.getArgument();
      }
      /**
       * Returns the current enum value definition.
       * @returns The current enum value definition, if known.
       * @example
       * ```ts
       * import { parse, visit } from 'graphql/language';
       * import { buildSchema, TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
       * import { ValidationContext } from 'graphql/validation';
       *
       * const schema = buildSchema(`
       *   enum Sort {
       *     NEWEST
       *     OLDEST
       *   }
       *
       *   type Query {
       *     reviews(sort: Sort): [String]
       *   }
       * `);
       * const document = parse('{ reviews(sort: OLDEST) }');
       * const typeInfo = new TypeInfo(schema);
       * const context = new ValidationContext(schema, document, typeInfo, () => {});
       * let enumValueName;
       *
       * visit(
       *   document,
       *   visitWithTypeInfo(typeInfo, {
       *     EnumValue: () => {
       *       enumValueName = context.getEnumValue()?.name;
       *     },
       *   }),
       * );
       *
       * enumValueName; // => 'OLDEST'
       * ```
       */
      getEnumValue() {
        return this._typeInfo.getEnumValue();
      }
    };
    exports2.ValidationContext = ValidationContext;
  }
});

// node_modules/graphql/validation/validate.js
var require_validate2 = __commonJS({
  "node_modules/graphql/validation/validate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.assertValidSDL = assertValidSDL;
    exports2.assertValidSDLExtension = assertValidSDLExtension;
    exports2.validate = validate;
    exports2.validateSDL = validateSDL;
    var _devAssert = require_devAssert();
    var _mapValue = require_mapValue();
    var _GraphQLError = require_GraphQLError();
    var _ast = require_ast();
    var _visitor = require_visitor();
    var _validate = require_validate();
    var _TypeInfo = require_TypeInfo();
    var _specifiedRules = require_specifiedRules();
    var _ValidationContext = require_ValidationContext();
    var QueryDocumentKeysToValidate = (0, _mapValue.mapValue)(
      _ast.QueryDocumentKeys,
      (keys) => keys.filter((key) => key !== "description")
    );
    function validate(schema, documentAST, rules = _specifiedRules.specifiedRules, options, typeInfo = new _TypeInfo.TypeInfo(schema)) {
      var _options$maxErrors;
      const maxErrors = (_options$maxErrors = options === null || options === void 0 ? void 0 : options.maxErrors) !== null && _options$maxErrors !== void 0 ? _options$maxErrors : 100;
      documentAST || (0, _devAssert.devAssert)(false, "Must provide document.");
      (0, _validate.assertValidSchema)(schema);
      const abortObj = Object.freeze({});
      const errors = [];
      const context = new _ValidationContext.ValidationContext(
        schema,
        documentAST,
        typeInfo,
        (error) => {
          if (errors.length >= maxErrors) {
            errors.push(
              new _GraphQLError.GraphQLError(
                "Too many validation errors, error limit reached. Validation aborted."
              )
            );
            throw abortObj;
          }
          errors.push(error);
        }
      );
      const visitor = (0, _visitor.visitInParallel)(
        rules.map((rule2) => rule2(context))
      );
      try {
        (0, _visitor.visit)(
          documentAST,
          (0, _TypeInfo.visitWithTypeInfo)(typeInfo, visitor),
          QueryDocumentKeysToValidate
        );
      } catch (e) {
        if (e !== abortObj) {
          throw e;
        }
      }
      return errors;
    }
    function validateSDL(documentAST, schemaToExtend, rules = _specifiedRules.specifiedSDLRules) {
      const errors = [];
      const context = new _ValidationContext.SDLValidationContext(
        documentAST,
        schemaToExtend,
        (error) => {
          errors.push(error);
        }
      );
      const visitors = rules.map((rule2) => rule2(context));
      (0, _visitor.visit)(documentAST, (0, _visitor.visitInParallel)(visitors));
      return errors;
    }
    function assertValidSDL(documentAST) {
      const errors = validateSDL(documentAST);
      if (errors.length !== 0) {
        throw new Error(errors.map((error) => error.message).join("\n\n"));
      }
    }
    function assertValidSDLExtension(documentAST, schema) {
      const errors = validateSDL(documentAST, schema);
      if (errors.length !== 0) {
        throw new Error(errors.map((error) => error.message).join("\n\n"));
      }
    }
  }
});

// node_modules/graphql/jsutils/memoize3.js
var require_memoize3 = __commonJS({
  "node_modules/graphql/jsutils/memoize3.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.memoize3 = memoize3;
    function memoize3(fn) {
      let cache0;
      return function memoized(a1, a2, a3) {
        if (cache0 === void 0) {
          cache0 = /* @__PURE__ */ new WeakMap();
        }
        let cache1 = cache0.get(a1);
        if (cache1 === void 0) {
          cache1 = /* @__PURE__ */ new WeakMap();
          cache0.set(a1, cache1);
        }
        let cache2 = cache1.get(a2);
        if (cache2 === void 0) {
          cache2 = /* @__PURE__ */ new WeakMap();
          cache1.set(a2, cache2);
        }
        let fnResult = cache2.get(a3);
        if (fnResult === void 0) {
          fnResult = fn(a1, a2, a3);
          cache2.set(a3, fnResult);
        }
        return fnResult;
      };
    }
  }
});

// node_modules/graphql/jsutils/promiseForObject.js
var require_promiseForObject = __commonJS({
  "node_modules/graphql/jsutils/promiseForObject.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.promiseForObject = promiseForObject;
    function promiseForObject(object) {
      return Promise.all(Object.values(object)).then((resolvedValues) => {
        const resolvedObject = /* @__PURE__ */ Object.create(null);
        for (const [i, key] of Object.keys(object).entries()) {
          resolvedObject[key] = resolvedValues[i];
        }
        return resolvedObject;
      });
    }
  }
});

// node_modules/graphql/jsutils/promiseReduce.js
var require_promiseReduce = __commonJS({
  "node_modules/graphql/jsutils/promiseReduce.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.promiseReduce = promiseReduce;
    var _isPromise = require_isPromise();
    function promiseReduce(values, callbackFn, initialValue) {
      let accumulator = initialValue;
      for (const value of values) {
        accumulator = (0, _isPromise.isPromise)(accumulator) ? accumulator.then((resolved) => callbackFn(resolved, value)) : callbackFn(accumulator, value);
      }
      return accumulator;
    }
  }
});

// node_modules/graphql/jsutils/toError.js
var require_toError = __commonJS({
  "node_modules/graphql/jsutils/toError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.toError = toError;
    var _inspect2 = require_inspect();
    function toError(thrownValue) {
      return thrownValue instanceof Error ? thrownValue : new NonErrorThrown(thrownValue);
    }
    var NonErrorThrown = class extends Error {
      constructor(thrownValue) {
        super("Unexpected error value: " + (0, _inspect2.inspect)(thrownValue));
        this.name = "NonErrorThrown";
        this.thrownValue = thrownValue;
      }
    };
  }
});

// node_modules/graphql/error/locatedError.js
var require_locatedError = __commonJS({
  "node_modules/graphql/error/locatedError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.locatedError = locatedError;
    var _toError = require_toError();
    var _GraphQLError = require_GraphQLError();
    function locatedError(rawOriginalError, nodes, path4) {
      var _nodes;
      const originalError = (0, _toError.toError)(rawOriginalError);
      if (isLocatedGraphQLError(originalError)) {
        return originalError;
      }
      return new _GraphQLError.GraphQLError(originalError.message, {
        nodes: (_nodes = originalError.nodes) !== null && _nodes !== void 0 ? _nodes : nodes,
        source: originalError.source,
        positions: originalError.positions,
        path: path4,
        originalError
      });
    }
    function isLocatedGraphQLError(error) {
      return Array.isArray(error.path);
    }
  }
});

// node_modules/graphql/execution/execute.js
var require_execute = __commonJS({
  "node_modules/graphql/execution/execute.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.assertValidExecutionArguments = assertValidExecutionArguments;
    exports2.buildExecutionContext = buildExecutionContext;
    exports2.buildResolveInfo = buildResolveInfo;
    exports2.defaultTypeResolver = exports2.defaultFieldResolver = void 0;
    exports2.execute = execute;
    exports2.executeSync = executeSync;
    exports2.getFieldDef = getFieldDef;
    var _devAssert = require_devAssert();
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _isIterableObject = require_isIterableObject();
    var _isObjectLike = require_isObjectLike();
    var _isPromise = require_isPromise();
    var _memoize = require_memoize3();
    var _Path = require_Path();
    var _promiseForObject = require_promiseForObject();
    var _promiseReduce = require_promiseReduce();
    var _GraphQLError = require_GraphQLError();
    var _locatedError = require_locatedError();
    var _ast = require_ast();
    var _kinds = require_kinds();
    var _definition = require_definition();
    var _introspection = require_introspection();
    var _validate = require_validate();
    var _collectFields = require_collectFields();
    var _values = require_values();
    var collectSubfields = (0, _memoize.memoize3)(
      (exeContext, returnType, fieldNodes) => (0, _collectFields.collectSubfields)(
        exeContext.schema,
        exeContext.fragments,
        exeContext.variableValues,
        returnType,
        fieldNodes
      )
    );
    var CollectedErrors = class {
      constructor() {
        this._errorPositions = /* @__PURE__ */ new Set();
        this._errors = [];
      }
      get errors() {
        return this._errors;
      }
      add(error, path4) {
        if (this._hasNulledPosition(path4)) {
          return;
        }
        this._errorPositions.add(path4);
        this._errors.push(error);
      }
      _hasNulledPosition(startPath) {
        let path4 = startPath;
        while (path4 !== void 0) {
          if (this._errorPositions.has(path4)) {
            return true;
          }
          path4 = path4.prev;
        }
        return this._errorPositions.has(void 0);
      }
    };
    function execute(args) {
      arguments.length < 2 || (0, _devAssert.devAssert)(
        false,
        "graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead."
      );
      const { schema, document, variableValues, rootValue } = args;
      assertValidExecutionArguments(schema, document, variableValues);
      const exeContext = buildExecutionContext(args);
      if (!("schema" in exeContext)) {
        return {
          errors: exeContext
        };
      }
      try {
        const { operation } = exeContext;
        const result = executeOperation(exeContext, operation, rootValue);
        if ((0, _isPromise.isPromise)(result)) {
          return result.then(
            (data) => buildResponse(data, exeContext.collectedErrors.errors),
            (error) => {
              exeContext.collectedErrors.add(error, void 0);
              return buildResponse(null, exeContext.collectedErrors.errors);
            }
          );
        }
        return buildResponse(result, exeContext.collectedErrors.errors);
      } catch (error) {
        exeContext.collectedErrors.add(error, void 0);
        return buildResponse(null, exeContext.collectedErrors.errors);
      }
    }
    function executeSync(args) {
      const result = execute(args);
      if ((0, _isPromise.isPromise)(result)) {
        throw new Error("GraphQL execution failed to complete synchronously.");
      }
      return result;
    }
    function buildResponse(data, errors) {
      return errors.length === 0 ? {
        data
      } : {
        errors,
        data
      };
    }
    function assertValidExecutionArguments(schema, document, rawVariableValues) {
      document || (0, _devAssert.devAssert)(false, "Must provide document.");
      (0, _validate.assertValidSchema)(schema);
      rawVariableValues == null || (0, _isObjectLike.isObjectLike)(rawVariableValues) || (0, _devAssert.devAssert)(
        false,
        "Variables must be provided as an Object where each property is a variable value. Perhaps look to see if an unparsed JSON string was provided."
      );
    }
    function buildExecutionContext(args) {
      var _definition$name, _operation$variableDe, _options$maxCoercionE;
      const {
        schema,
        document,
        rootValue,
        contextValue,
        variableValues: rawVariableValues,
        operationName,
        fieldResolver,
        typeResolver,
        subscribeFieldResolver,
        options
      } = args;
      let operation;
      const fragments = /* @__PURE__ */ Object.create(null);
      for (const definition of document.definitions) {
        switch (definition.kind) {
          case _kinds.Kind.OPERATION_DEFINITION:
            if (operationName == null) {
              if (operation !== void 0) {
                return [
                  new _GraphQLError.GraphQLError(
                    "Must provide operation name if query contains multiple operations."
                  )
                ];
              }
              operation = definition;
            } else if (((_definition$name = definition.name) === null || _definition$name === void 0 ? void 0 : _definition$name.value) === operationName) {
              operation = definition;
            }
            break;
          case _kinds.Kind.FRAGMENT_DEFINITION:
            fragments[definition.name.value] = definition;
            break;
          default:
        }
      }
      if (!operation) {
        if (operationName != null) {
          return [
            new _GraphQLError.GraphQLError(
              `Unknown operation named "${operationName}".`
            )
          ];
        }
        return [new _GraphQLError.GraphQLError("Must provide an operation.")];
      }
      const variableDefinitions = (_operation$variableDe = operation.variableDefinitions) !== null && _operation$variableDe !== void 0 ? _operation$variableDe : [];
      const coercedVariableValues = (0, _values.getVariableValues)(
        schema,
        variableDefinitions,
        rawVariableValues !== null && rawVariableValues !== void 0 ? rawVariableValues : {},
        {
          maxErrors: (_options$maxCoercionE = options === null || options === void 0 ? void 0 : options.maxCoercionErrors) !== null && _options$maxCoercionE !== void 0 ? _options$maxCoercionE : 50
        }
      );
      if (coercedVariableValues.errors) {
        return coercedVariableValues.errors;
      }
      return {
        schema,
        fragments,
        rootValue,
        contextValue,
        operation,
        variableValues: coercedVariableValues.coerced,
        fieldResolver: fieldResolver !== null && fieldResolver !== void 0 ? fieldResolver : defaultFieldResolver,
        typeResolver: typeResolver !== null && typeResolver !== void 0 ? typeResolver : defaultTypeResolver,
        subscribeFieldResolver: subscribeFieldResolver !== null && subscribeFieldResolver !== void 0 ? subscribeFieldResolver : defaultFieldResolver,
        collectedErrors: new CollectedErrors()
      };
    }
    function executeOperation(exeContext, operation, rootValue) {
      const rootType = exeContext.schema.getRootType(operation.operation);
      if (rootType == null) {
        throw new _GraphQLError.GraphQLError(
          `Schema is not configured to execute ${operation.operation} operation.`,
          {
            nodes: operation
          }
        );
      }
      const rootFields = (0, _collectFields.collectFields)(
        exeContext.schema,
        exeContext.fragments,
        exeContext.variableValues,
        rootType,
        operation.selectionSet
      );
      const path4 = void 0;
      switch (operation.operation) {
        case _ast.OperationTypeNode.QUERY:
          return executeFields(exeContext, rootType, rootValue, path4, rootFields);
        case _ast.OperationTypeNode.MUTATION:
          return executeFieldsSerially(
            exeContext,
            rootType,
            rootValue,
            path4,
            rootFields
          );
        case _ast.OperationTypeNode.SUBSCRIPTION:
          return executeFields(exeContext, rootType, rootValue, path4, rootFields);
      }
    }
    function executeFieldsSerially(exeContext, parentType, sourceValue, path4, fields) {
      return (0, _promiseReduce.promiseReduce)(
        fields.entries(),
        (results, [responseName, fieldNodes]) => {
          const fieldPath = (0, _Path.addPath)(path4, responseName, parentType.name);
          const result = executeField(
            exeContext,
            parentType,
            sourceValue,
            fieldNodes,
            fieldPath
          );
          if (result === void 0) {
            return results;
          }
          if ((0, _isPromise.isPromise)(result)) {
            return result.then((resolvedResult) => {
              results[responseName] = resolvedResult;
              return results;
            });
          }
          results[responseName] = result;
          return results;
        },
        /* @__PURE__ */ Object.create(null)
      );
    }
    function executeFields(exeContext, parentType, sourceValue, path4, fields) {
      const results = /* @__PURE__ */ Object.create(null);
      let containsPromise = false;
      try {
        for (const [responseName, fieldNodes] of fields.entries()) {
          const fieldPath = (0, _Path.addPath)(path4, responseName, parentType.name);
          const result = executeField(
            exeContext,
            parentType,
            sourceValue,
            fieldNodes,
            fieldPath
          );
          if (result !== void 0) {
            results[responseName] = result;
            if ((0, _isPromise.isPromise)(result)) {
              containsPromise = true;
            }
          }
        }
      } catch (error) {
        if (containsPromise) {
          return (0, _promiseForObject.promiseForObject)(results).finally(() => {
            throw error;
          });
        }
        throw error;
      }
      if (!containsPromise) {
        return results;
      }
      return (0, _promiseForObject.promiseForObject)(results);
    }
    function executeField(exeContext, parentType, source, fieldNodes, path4) {
      var _fieldDef$resolve;
      const fieldDef = getFieldDef(exeContext.schema, parentType, fieldNodes[0]);
      if (!fieldDef) {
        return;
      }
      const returnType = fieldDef.type;
      const resolveFn = (_fieldDef$resolve = fieldDef.resolve) !== null && _fieldDef$resolve !== void 0 ? _fieldDef$resolve : exeContext.fieldResolver;
      const info = buildResolveInfo(
        exeContext,
        fieldDef,
        fieldNodes,
        parentType,
        path4
      );
      try {
        const args = (0, _values.getArgumentValues)(
          fieldDef,
          fieldNodes[0],
          exeContext.variableValues
        );
        const contextValue = exeContext.contextValue;
        const result = resolveFn(source, args, contextValue, info);
        let completed;
        if ((0, _isPromise.isPromise)(result)) {
          completed = result.then(
            (resolved) => completeValue(exeContext, returnType, fieldNodes, info, path4, resolved)
          );
        } else {
          completed = completeValue(
            exeContext,
            returnType,
            fieldNodes,
            info,
            path4,
            result
          );
        }
        if ((0, _isPromise.isPromise)(completed)) {
          return completed.then(void 0, (rawError) => {
            const error = (0, _locatedError.locatedError)(
              rawError,
              fieldNodes,
              (0, _Path.pathToArray)(path4)
            );
            return handleFieldError(error, returnType, path4, exeContext);
          });
        }
        return completed;
      } catch (rawError) {
        const error = (0, _locatedError.locatedError)(
          rawError,
          fieldNodes,
          (0, _Path.pathToArray)(path4)
        );
        return handleFieldError(error, returnType, path4, exeContext);
      }
    }
    function buildResolveInfo(exeContext, fieldDef, fieldNodes, parentType, path4) {
      return {
        fieldName: fieldDef.name,
        fieldNodes,
        returnType: fieldDef.type,
        parentType,
        path: path4,
        schema: exeContext.schema,
        fragments: exeContext.fragments,
        rootValue: exeContext.rootValue,
        operation: exeContext.operation,
        variableValues: exeContext.variableValues
      };
    }
    function handleFieldError(error, returnType, path4, exeContext) {
      if ((0, _definition.isNonNullType)(returnType)) {
        throw error;
      }
      exeContext.collectedErrors.add(error, path4);
      return null;
    }
    function completeValue(exeContext, returnType, fieldNodes, info, path4, result) {
      if (result instanceof Error) {
        throw result;
      }
      if ((0, _definition.isNonNullType)(returnType)) {
        const completed = completeValue(
          exeContext,
          returnType.ofType,
          fieldNodes,
          info,
          path4,
          result
        );
        if (completed === null) {
          throw new Error(
            `Cannot return null for non-nullable field ${info.parentType.name}.${info.fieldName}.`
          );
        }
        return completed;
      }
      if (result == null) {
        return null;
      }
      if ((0, _definition.isListType)(returnType)) {
        return completeListValue(
          exeContext,
          returnType,
          fieldNodes,
          info,
          path4,
          result
        );
      }
      if ((0, _definition.isLeafType)(returnType)) {
        return completeLeafValue(returnType, result);
      }
      if ((0, _definition.isAbstractType)(returnType)) {
        return completeAbstractValue(
          exeContext,
          returnType,
          fieldNodes,
          info,
          path4,
          result
        );
      }
      if ((0, _definition.isObjectType)(returnType)) {
        return completeObjectValue(
          exeContext,
          returnType,
          fieldNodes,
          info,
          path4,
          result
        );
      }
      (0, _invariant.invariant)(
        false,
        "Cannot complete value of unexpected output type: " + (0, _inspect2.inspect)(returnType)
      );
    }
    function completeListValue(exeContext, returnType, fieldNodes, info, path4, result) {
      if (!(0, _isIterableObject.isIterableObject)(result)) {
        throw new _GraphQLError.GraphQLError(
          `Expected Iterable, but did not find one for field "${info.parentType.name}.${info.fieldName}".`
        );
      }
      const itemType = returnType.ofType;
      let containsPromise = false;
      const completedResults = Array.from(result, (item, index) => {
        const itemPath = (0, _Path.addPath)(path4, index, void 0);
        try {
          let completedItem;
          if ((0, _isPromise.isPromise)(item)) {
            completedItem = item.then(
              (resolved) => completeValue(
                exeContext,
                itemType,
                fieldNodes,
                info,
                itemPath,
                resolved
              )
            );
          } else {
            completedItem = completeValue(
              exeContext,
              itemType,
              fieldNodes,
              info,
              itemPath,
              item
            );
          }
          if ((0, _isPromise.isPromise)(completedItem)) {
            containsPromise = true;
            return completedItem.then(void 0, (rawError) => {
              const error = (0, _locatedError.locatedError)(
                rawError,
                fieldNodes,
                (0, _Path.pathToArray)(itemPath)
              );
              return handleFieldError(error, itemType, itemPath, exeContext);
            });
          }
          return completedItem;
        } catch (rawError) {
          const error = (0, _locatedError.locatedError)(
            rawError,
            fieldNodes,
            (0, _Path.pathToArray)(itemPath)
          );
          return handleFieldError(error, itemType, itemPath, exeContext);
        }
      });
      return containsPromise ? Promise.all(completedResults) : completedResults;
    }
    function completeLeafValue(returnType, result) {
      const serializedResult = returnType.serialize(result);
      if (serializedResult == null) {
        throw new Error(
          `Expected \`${(0, _inspect2.inspect)(returnType)}.serialize(${(0, _inspect2.inspect)(result)})\` to return non-nullable value, returned: ${(0, _inspect2.inspect)(
            serializedResult
          )}`
        );
      }
      return serializedResult;
    }
    function completeAbstractValue(exeContext, returnType, fieldNodes, info, path4, result) {
      var _returnType$resolveTy;
      const resolveTypeFn = (_returnType$resolveTy = returnType.resolveType) !== null && _returnType$resolveTy !== void 0 ? _returnType$resolveTy : exeContext.typeResolver;
      const contextValue = exeContext.contextValue;
      const runtimeType = resolveTypeFn(result, contextValue, info, returnType);
      if ((0, _isPromise.isPromise)(runtimeType)) {
        return runtimeType.then(
          (resolvedRuntimeType) => completeObjectValue(
            exeContext,
            ensureValidRuntimeType(
              resolvedRuntimeType,
              exeContext,
              returnType,
              fieldNodes,
              info,
              result
            ),
            fieldNodes,
            info,
            path4,
            result
          )
        );
      }
      return completeObjectValue(
        exeContext,
        ensureValidRuntimeType(
          runtimeType,
          exeContext,
          returnType,
          fieldNodes,
          info,
          result
        ),
        fieldNodes,
        info,
        path4,
        result
      );
    }
    function ensureValidRuntimeType(runtimeTypeName, exeContext, returnType, fieldNodes, info, result) {
      if (runtimeTypeName == null) {
        throw new _GraphQLError.GraphQLError(
          `Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}". Either the "${returnType.name}" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.`,
          fieldNodes
        );
      }
      if ((0, _definition.isObjectType)(runtimeTypeName)) {
        throw new _GraphQLError.GraphQLError(
          "Support for returning GraphQLObjectType from resolveType was removed in graphql-js@16.0.0 please return type name instead."
        );
      }
      if (typeof runtimeTypeName !== "string") {
        throw new _GraphQLError.GraphQLError(
          `Abstract type "${returnType.name}" must resolve to an Object type at runtime for field "${info.parentType.name}.${info.fieldName}" with value ${(0, _inspect2.inspect)(result)}, received "${(0, _inspect2.inspect)(runtimeTypeName)}".`
        );
      }
      const runtimeType = exeContext.schema.getType(runtimeTypeName);
      if (runtimeType == null) {
        throw new _GraphQLError.GraphQLError(
          `Abstract type "${returnType.name}" was resolved to a type "${runtimeTypeName}" that does not exist inside the schema.`,
          {
            nodes: fieldNodes
          }
        );
      }
      if (!(0, _definition.isObjectType)(runtimeType)) {
        throw new _GraphQLError.GraphQLError(
          `Abstract type "${returnType.name}" was resolved to a non-object type "${runtimeTypeName}".`,
          {
            nodes: fieldNodes
          }
        );
      }
      if (!exeContext.schema.isSubType(returnType, runtimeType)) {
        throw new _GraphQLError.GraphQLError(
          `Runtime Object type "${runtimeType.name}" is not a possible type for "${returnType.name}".`,
          {
            nodes: fieldNodes
          }
        );
      }
      return runtimeType;
    }
    function completeObjectValue(exeContext, returnType, fieldNodes, info, path4, result) {
      const subFieldNodes = collectSubfields(exeContext, returnType, fieldNodes);
      if (returnType.isTypeOf) {
        const isTypeOf = returnType.isTypeOf(result, exeContext.contextValue, info);
        if ((0, _isPromise.isPromise)(isTypeOf)) {
          return isTypeOf.then((resolvedIsTypeOf) => {
            if (!resolvedIsTypeOf) {
              throw invalidReturnTypeError(returnType, result, fieldNodes);
            }
            return executeFields(
              exeContext,
              returnType,
              result,
              path4,
              subFieldNodes
            );
          });
        }
        if (!isTypeOf) {
          throw invalidReturnTypeError(returnType, result, fieldNodes);
        }
      }
      return executeFields(exeContext, returnType, result, path4, subFieldNodes);
    }
    function invalidReturnTypeError(returnType, result, fieldNodes) {
      return new _GraphQLError.GraphQLError(
        `Expected value of type "${returnType.name}" but got: ${(0, _inspect2.inspect)(result)}.`,
        {
          nodes: fieldNodes
        }
      );
    }
    var defaultTypeResolver = function(value, contextValue, info, abstractType) {
      if ((0, _isObjectLike.isObjectLike)(value) && typeof value.__typename === "string") {
        return value.__typename;
      }
      const possibleTypes = info.schema.getPossibleTypes(abstractType);
      const promisedIsTypeOfResults = [];
      for (let i = 0; i < possibleTypes.length; i++) {
        const type = possibleTypes[i];
        if (type.isTypeOf) {
          const isTypeOfResult = type.isTypeOf(value, contextValue, info);
          if ((0, _isPromise.isPromise)(isTypeOfResult)) {
            promisedIsTypeOfResults[i] = isTypeOfResult;
          } else if (isTypeOfResult) {
            if (promisedIsTypeOfResults.length) {
              Promise.allSettled(promisedIsTypeOfResults).catch(() => {
              });
            }
            return type.name;
          }
        }
      }
      if (promisedIsTypeOfResults.length) {
        return Promise.all(promisedIsTypeOfResults).then((isTypeOfResults) => {
          for (let i = 0; i < isTypeOfResults.length; i++) {
            if (isTypeOfResults[i]) {
              return possibleTypes[i].name;
            }
          }
        });
      }
    };
    exports2.defaultTypeResolver = defaultTypeResolver;
    var defaultFieldResolver = function(source, args, contextValue, info) {
      if ((0, _isObjectLike.isObjectLike)(source) || typeof source === "function") {
        const property = source[info.fieldName];
        if (typeof property === "function") {
          return source[info.fieldName](args, contextValue, info);
        }
        return property;
      }
    };
    exports2.defaultFieldResolver = defaultFieldResolver;
    function getFieldDef(schema, parentType, fieldNode) {
      const fieldName = fieldNode.name.value;
      if (fieldName === _introspection.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
        return _introspection.SchemaMetaFieldDef;
      } else if (fieldName === _introspection.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
        return _introspection.TypeMetaFieldDef;
      } else if (fieldName === _introspection.TypeNameMetaFieldDef.name) {
        return _introspection.TypeNameMetaFieldDef;
      }
      return parentType.getFields()[fieldName];
    }
  }
});

// node_modules/graphql/graphql.js
var require_graphql = __commonJS({
  "node_modules/graphql/graphql.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.graphql = graphql;
    exports2.graphqlSync = graphqlSync;
    var _devAssert = require_devAssert();
    var _isPromise = require_isPromise();
    var _parser = require_parser2();
    var _validate = require_validate();
    var _validate2 = require_validate2();
    var _execute = require_execute();
    function graphql(args) {
      return new Promise((resolve) => resolve(graphqlImpl(args)));
    }
    function graphqlSync(args) {
      const result = graphqlImpl(args);
      if ((0, _isPromise.isPromise)(result)) {
        throw new Error("GraphQL execution failed to complete synchronously.");
      }
      return result;
    }
    function graphqlImpl(args) {
      arguments.length < 2 || (0, _devAssert.devAssert)(
        false,
        "graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead."
      );
      const {
        schema,
        source,
        rootValue,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
        typeResolver
      } = args;
      const schemaValidationErrors = (0, _validate.validateSchema)(schema);
      if (schemaValidationErrors.length > 0) {
        return {
          errors: schemaValidationErrors
        };
      }
      let document;
      try {
        document = (0, _parser.parse)(source);
      } catch (syntaxError) {
        return {
          errors: [syntaxError]
        };
      }
      const validationErrors = (0, _validate2.validate)(schema, document);
      if (validationErrors.length > 0) {
        return {
          errors: validationErrors
        };
      }
      return (0, _execute.execute)({
        schema,
        document,
        rootValue,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
        typeResolver
      });
    }
  }
});

// node_modules/graphql/type/index.js
var require_type = __commonJS({
  "node_modules/graphql/type/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "DEFAULT_DEPRECATION_REASON", {
      enumerable: true,
      get: function() {
        return _directives.DEFAULT_DEPRECATION_REASON;
      }
    });
    Object.defineProperty(exports2, "GRAPHQL_MAX_INT", {
      enumerable: true,
      get: function() {
        return _scalars.GRAPHQL_MAX_INT;
      }
    });
    Object.defineProperty(exports2, "GRAPHQL_MIN_INT", {
      enumerable: true,
      get: function() {
        return _scalars.GRAPHQL_MIN_INT;
      }
    });
    Object.defineProperty(exports2, "GraphQLBoolean", {
      enumerable: true,
      get: function() {
        return _scalars.GraphQLBoolean;
      }
    });
    Object.defineProperty(exports2, "GraphQLDeprecatedDirective", {
      enumerable: true,
      get: function() {
        return _directives.GraphQLDeprecatedDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLDirective", {
      enumerable: true,
      get: function() {
        return _directives.GraphQLDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLEnumType", {
      enumerable: true,
      get: function() {
        return _definition.GraphQLEnumType;
      }
    });
    Object.defineProperty(exports2, "GraphQLFloat", {
      enumerable: true,
      get: function() {
        return _scalars.GraphQLFloat;
      }
    });
    Object.defineProperty(exports2, "GraphQLID", {
      enumerable: true,
      get: function() {
        return _scalars.GraphQLID;
      }
    });
    Object.defineProperty(exports2, "GraphQLIncludeDirective", {
      enumerable: true,
      get: function() {
        return _directives.GraphQLIncludeDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLInputObjectType", {
      enumerable: true,
      get: function() {
        return _definition.GraphQLInputObjectType;
      }
    });
    Object.defineProperty(exports2, "GraphQLInt", {
      enumerable: true,
      get: function() {
        return _scalars.GraphQLInt;
      }
    });
    Object.defineProperty(exports2, "GraphQLInterfaceType", {
      enumerable: true,
      get: function() {
        return _definition.GraphQLInterfaceType;
      }
    });
    Object.defineProperty(exports2, "GraphQLList", {
      enumerable: true,
      get: function() {
        return _definition.GraphQLList;
      }
    });
    Object.defineProperty(exports2, "GraphQLNonNull", {
      enumerable: true,
      get: function() {
        return _definition.GraphQLNonNull;
      }
    });
    Object.defineProperty(exports2, "GraphQLObjectType", {
      enumerable: true,
      get: function() {
        return _definition.GraphQLObjectType;
      }
    });
    Object.defineProperty(exports2, "GraphQLOneOfDirective", {
      enumerable: true,
      get: function() {
        return _directives.GraphQLOneOfDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLScalarType", {
      enumerable: true,
      get: function() {
        return _definition.GraphQLScalarType;
      }
    });
    Object.defineProperty(exports2, "GraphQLSchema", {
      enumerable: true,
      get: function() {
        return _schema.GraphQLSchema;
      }
    });
    Object.defineProperty(exports2, "GraphQLSkipDirective", {
      enumerable: true,
      get: function() {
        return _directives.GraphQLSkipDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLSpecifiedByDirective", {
      enumerable: true,
      get: function() {
        return _directives.GraphQLSpecifiedByDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLString", {
      enumerable: true,
      get: function() {
        return _scalars.GraphQLString;
      }
    });
    Object.defineProperty(exports2, "GraphQLUnionType", {
      enumerable: true,
      get: function() {
        return _definition.GraphQLUnionType;
      }
    });
    Object.defineProperty(exports2, "SchemaMetaFieldDef", {
      enumerable: true,
      get: function() {
        return _introspection.SchemaMetaFieldDef;
      }
    });
    Object.defineProperty(exports2, "TypeKind", {
      enumerable: true,
      get: function() {
        return _introspection.TypeKind;
      }
    });
    Object.defineProperty(exports2, "TypeMetaFieldDef", {
      enumerable: true,
      get: function() {
        return _introspection.TypeMetaFieldDef;
      }
    });
    Object.defineProperty(exports2, "TypeNameMetaFieldDef", {
      enumerable: true,
      get: function() {
        return _introspection.TypeNameMetaFieldDef;
      }
    });
    Object.defineProperty(exports2, "__Directive", {
      enumerable: true,
      get: function() {
        return _introspection.__Directive;
      }
    });
    Object.defineProperty(exports2, "__DirectiveLocation", {
      enumerable: true,
      get: function() {
        return _introspection.__DirectiveLocation;
      }
    });
    Object.defineProperty(exports2, "__EnumValue", {
      enumerable: true,
      get: function() {
        return _introspection.__EnumValue;
      }
    });
    Object.defineProperty(exports2, "__Field", {
      enumerable: true,
      get: function() {
        return _introspection.__Field;
      }
    });
    Object.defineProperty(exports2, "__InputValue", {
      enumerable: true,
      get: function() {
        return _introspection.__InputValue;
      }
    });
    Object.defineProperty(exports2, "__Schema", {
      enumerable: true,
      get: function() {
        return _introspection.__Schema;
      }
    });
    Object.defineProperty(exports2, "__Type", {
      enumerable: true,
      get: function() {
        return _introspection.__Type;
      }
    });
    Object.defineProperty(exports2, "__TypeKind", {
      enumerable: true,
      get: function() {
        return _introspection.__TypeKind;
      }
    });
    Object.defineProperty(exports2, "assertAbstractType", {
      enumerable: true,
      get: function() {
        return _definition.assertAbstractType;
      }
    });
    Object.defineProperty(exports2, "assertCompositeType", {
      enumerable: true,
      get: function() {
        return _definition.assertCompositeType;
      }
    });
    Object.defineProperty(exports2, "assertDirective", {
      enumerable: true,
      get: function() {
        return _directives.assertDirective;
      }
    });
    Object.defineProperty(exports2, "assertEnumType", {
      enumerable: true,
      get: function() {
        return _definition.assertEnumType;
      }
    });
    Object.defineProperty(exports2, "assertEnumValueName", {
      enumerable: true,
      get: function() {
        return _assertName.assertEnumValueName;
      }
    });
    Object.defineProperty(exports2, "assertInputObjectType", {
      enumerable: true,
      get: function() {
        return _definition.assertInputObjectType;
      }
    });
    Object.defineProperty(exports2, "assertInputType", {
      enumerable: true,
      get: function() {
        return _definition.assertInputType;
      }
    });
    Object.defineProperty(exports2, "assertInterfaceType", {
      enumerable: true,
      get: function() {
        return _definition.assertInterfaceType;
      }
    });
    Object.defineProperty(exports2, "assertLeafType", {
      enumerable: true,
      get: function() {
        return _definition.assertLeafType;
      }
    });
    Object.defineProperty(exports2, "assertListType", {
      enumerable: true,
      get: function() {
        return _definition.assertListType;
      }
    });
    Object.defineProperty(exports2, "assertName", {
      enumerable: true,
      get: function() {
        return _assertName.assertName;
      }
    });
    Object.defineProperty(exports2, "assertNamedType", {
      enumerable: true,
      get: function() {
        return _definition.assertNamedType;
      }
    });
    Object.defineProperty(exports2, "assertNonNullType", {
      enumerable: true,
      get: function() {
        return _definition.assertNonNullType;
      }
    });
    Object.defineProperty(exports2, "assertNullableType", {
      enumerable: true,
      get: function() {
        return _definition.assertNullableType;
      }
    });
    Object.defineProperty(exports2, "assertObjectType", {
      enumerable: true,
      get: function() {
        return _definition.assertObjectType;
      }
    });
    Object.defineProperty(exports2, "assertOutputType", {
      enumerable: true,
      get: function() {
        return _definition.assertOutputType;
      }
    });
    Object.defineProperty(exports2, "assertScalarType", {
      enumerable: true,
      get: function() {
        return _definition.assertScalarType;
      }
    });
    Object.defineProperty(exports2, "assertSchema", {
      enumerable: true,
      get: function() {
        return _schema.assertSchema;
      }
    });
    Object.defineProperty(exports2, "assertType", {
      enumerable: true,
      get: function() {
        return _definition.assertType;
      }
    });
    Object.defineProperty(exports2, "assertUnionType", {
      enumerable: true,
      get: function() {
        return _definition.assertUnionType;
      }
    });
    Object.defineProperty(exports2, "assertValidSchema", {
      enumerable: true,
      get: function() {
        return _validate.assertValidSchema;
      }
    });
    Object.defineProperty(exports2, "assertWrappingType", {
      enumerable: true,
      get: function() {
        return _definition.assertWrappingType;
      }
    });
    Object.defineProperty(exports2, "getNamedType", {
      enumerable: true,
      get: function() {
        return _definition.getNamedType;
      }
    });
    Object.defineProperty(exports2, "getNullableType", {
      enumerable: true,
      get: function() {
        return _definition.getNullableType;
      }
    });
    Object.defineProperty(exports2, "introspectionTypes", {
      enumerable: true,
      get: function() {
        return _introspection.introspectionTypes;
      }
    });
    Object.defineProperty(exports2, "isAbstractType", {
      enumerable: true,
      get: function() {
        return _definition.isAbstractType;
      }
    });
    Object.defineProperty(exports2, "isCompositeType", {
      enumerable: true,
      get: function() {
        return _definition.isCompositeType;
      }
    });
    Object.defineProperty(exports2, "isDirective", {
      enumerable: true,
      get: function() {
        return _directives.isDirective;
      }
    });
    Object.defineProperty(exports2, "isEnumType", {
      enumerable: true,
      get: function() {
        return _definition.isEnumType;
      }
    });
    Object.defineProperty(exports2, "isInputObjectType", {
      enumerable: true,
      get: function() {
        return _definition.isInputObjectType;
      }
    });
    Object.defineProperty(exports2, "isInputType", {
      enumerable: true,
      get: function() {
        return _definition.isInputType;
      }
    });
    Object.defineProperty(exports2, "isInterfaceType", {
      enumerable: true,
      get: function() {
        return _definition.isInterfaceType;
      }
    });
    Object.defineProperty(exports2, "isIntrospectionType", {
      enumerable: true,
      get: function() {
        return _introspection.isIntrospectionType;
      }
    });
    Object.defineProperty(exports2, "isLeafType", {
      enumerable: true,
      get: function() {
        return _definition.isLeafType;
      }
    });
    Object.defineProperty(exports2, "isListType", {
      enumerable: true,
      get: function() {
        return _definition.isListType;
      }
    });
    Object.defineProperty(exports2, "isNamedType", {
      enumerable: true,
      get: function() {
        return _definition.isNamedType;
      }
    });
    Object.defineProperty(exports2, "isNonNullType", {
      enumerable: true,
      get: function() {
        return _definition.isNonNullType;
      }
    });
    Object.defineProperty(exports2, "isNullableType", {
      enumerable: true,
      get: function() {
        return _definition.isNullableType;
      }
    });
    Object.defineProperty(exports2, "isObjectType", {
      enumerable: true,
      get: function() {
        return _definition.isObjectType;
      }
    });
    Object.defineProperty(exports2, "isOutputType", {
      enumerable: true,
      get: function() {
        return _definition.isOutputType;
      }
    });
    Object.defineProperty(exports2, "isRequiredArgument", {
      enumerable: true,
      get: function() {
        return _definition.isRequiredArgument;
      }
    });
    Object.defineProperty(exports2, "isRequiredInputField", {
      enumerable: true,
      get: function() {
        return _definition.isRequiredInputField;
      }
    });
    Object.defineProperty(exports2, "isScalarType", {
      enumerable: true,
      get: function() {
        return _definition.isScalarType;
      }
    });
    Object.defineProperty(exports2, "isSchema", {
      enumerable: true,
      get: function() {
        return _schema.isSchema;
      }
    });
    Object.defineProperty(exports2, "isSpecifiedDirective", {
      enumerable: true,
      get: function() {
        return _directives.isSpecifiedDirective;
      }
    });
    Object.defineProperty(exports2, "isSpecifiedScalarType", {
      enumerable: true,
      get: function() {
        return _scalars.isSpecifiedScalarType;
      }
    });
    Object.defineProperty(exports2, "isType", {
      enumerable: true,
      get: function() {
        return _definition.isType;
      }
    });
    Object.defineProperty(exports2, "isUnionType", {
      enumerable: true,
      get: function() {
        return _definition.isUnionType;
      }
    });
    Object.defineProperty(exports2, "isWrappingType", {
      enumerable: true,
      get: function() {
        return _definition.isWrappingType;
      }
    });
    Object.defineProperty(exports2, "resolveObjMapThunk", {
      enumerable: true,
      get: function() {
        return _definition.resolveObjMapThunk;
      }
    });
    Object.defineProperty(exports2, "resolveReadonlyArrayThunk", {
      enumerable: true,
      get: function() {
        return _definition.resolveReadonlyArrayThunk;
      }
    });
    Object.defineProperty(exports2, "specifiedDirectives", {
      enumerable: true,
      get: function() {
        return _directives.specifiedDirectives;
      }
    });
    Object.defineProperty(exports2, "specifiedScalarTypes", {
      enumerable: true,
      get: function() {
        return _scalars.specifiedScalarTypes;
      }
    });
    Object.defineProperty(exports2, "validateSchema", {
      enumerable: true,
      get: function() {
        return _validate.validateSchema;
      }
    });
    var _schema = require_schema();
    var _definition = require_definition();
    var _directives = require_directives();
    var _scalars = require_scalars();
    var _introspection = require_introspection();
    var _validate = require_validate();
    var _assertName = require_assertName();
  }
});

// node_modules/graphql/language/index.js
var require_language = __commonJS({
  "node_modules/graphql/language/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "BREAK", {
      enumerable: true,
      get: function() {
        return _visitor.BREAK;
      }
    });
    Object.defineProperty(exports2, "DirectiveLocation", {
      enumerable: true,
      get: function() {
        return _directiveLocation.DirectiveLocation;
      }
    });
    Object.defineProperty(exports2, "Kind", {
      enumerable: true,
      get: function() {
        return _kinds.Kind;
      }
    });
    Object.defineProperty(exports2, "Lexer", {
      enumerable: true,
      get: function() {
        return _lexer.Lexer;
      }
    });
    Object.defineProperty(exports2, "Location", {
      enumerable: true,
      get: function() {
        return _ast.Location;
      }
    });
    Object.defineProperty(exports2, "OperationTypeNode", {
      enumerable: true,
      get: function() {
        return _ast.OperationTypeNode;
      }
    });
    Object.defineProperty(exports2, "Source", {
      enumerable: true,
      get: function() {
        return _source.Source;
      }
    });
    Object.defineProperty(exports2, "Token", {
      enumerable: true,
      get: function() {
        return _ast.Token;
      }
    });
    Object.defineProperty(exports2, "TokenKind", {
      enumerable: true,
      get: function() {
        return _tokenKind.TokenKind;
      }
    });
    Object.defineProperty(exports2, "getEnterLeaveForKind", {
      enumerable: true,
      get: function() {
        return _visitor.getEnterLeaveForKind;
      }
    });
    Object.defineProperty(exports2, "getLocation", {
      enumerable: true,
      get: function() {
        return _location.getLocation;
      }
    });
    Object.defineProperty(exports2, "getVisitFn", {
      enumerable: true,
      get: function() {
        return _visitor.getVisitFn;
      }
    });
    Object.defineProperty(exports2, "isConstValueNode", {
      enumerable: true,
      get: function() {
        return _predicates.isConstValueNode;
      }
    });
    Object.defineProperty(exports2, "isDefinitionNode", {
      enumerable: true,
      get: function() {
        return _predicates.isDefinitionNode;
      }
    });
    Object.defineProperty(exports2, "isExecutableDefinitionNode", {
      enumerable: true,
      get: function() {
        return _predicates.isExecutableDefinitionNode;
      }
    });
    Object.defineProperty(exports2, "isSchemaCoordinateNode", {
      enumerable: true,
      get: function() {
        return _predicates.isSchemaCoordinateNode;
      }
    });
    Object.defineProperty(exports2, "isSelectionNode", {
      enumerable: true,
      get: function() {
        return _predicates.isSelectionNode;
      }
    });
    Object.defineProperty(exports2, "isTypeDefinitionNode", {
      enumerable: true,
      get: function() {
        return _predicates.isTypeDefinitionNode;
      }
    });
    Object.defineProperty(exports2, "isTypeExtensionNode", {
      enumerable: true,
      get: function() {
        return _predicates.isTypeExtensionNode;
      }
    });
    Object.defineProperty(exports2, "isTypeNode", {
      enumerable: true,
      get: function() {
        return _predicates.isTypeNode;
      }
    });
    Object.defineProperty(exports2, "isTypeSystemDefinitionNode", {
      enumerable: true,
      get: function() {
        return _predicates.isTypeSystemDefinitionNode;
      }
    });
    Object.defineProperty(exports2, "isTypeSystemExtensionNode", {
      enumerable: true,
      get: function() {
        return _predicates.isTypeSystemExtensionNode;
      }
    });
    Object.defineProperty(exports2, "isValueNode", {
      enumerable: true,
      get: function() {
        return _predicates.isValueNode;
      }
    });
    Object.defineProperty(exports2, "parse", {
      enumerable: true,
      get: function() {
        return _parser.parse;
      }
    });
    Object.defineProperty(exports2, "parseConstValue", {
      enumerable: true,
      get: function() {
        return _parser.parseConstValue;
      }
    });
    Object.defineProperty(exports2, "parseSchemaCoordinate", {
      enumerable: true,
      get: function() {
        return _parser.parseSchemaCoordinate;
      }
    });
    Object.defineProperty(exports2, "parseType", {
      enumerable: true,
      get: function() {
        return _parser.parseType;
      }
    });
    Object.defineProperty(exports2, "parseValue", {
      enumerable: true,
      get: function() {
        return _parser.parseValue;
      }
    });
    Object.defineProperty(exports2, "print", {
      enumerable: true,
      get: function() {
        return _printer.print;
      }
    });
    Object.defineProperty(exports2, "printLocation", {
      enumerable: true,
      get: function() {
        return _printLocation.printLocation;
      }
    });
    Object.defineProperty(exports2, "printSourceLocation", {
      enumerable: true,
      get: function() {
        return _printLocation.printSourceLocation;
      }
    });
    Object.defineProperty(exports2, "visit", {
      enumerable: true,
      get: function() {
        return _visitor.visit;
      }
    });
    Object.defineProperty(exports2, "visitInParallel", {
      enumerable: true,
      get: function() {
        return _visitor.visitInParallel;
      }
    });
    var _source = require_source();
    var _location = require_location();
    var _printLocation = require_printLocation();
    var _kinds = require_kinds();
    var _tokenKind = require_tokenKind();
    var _lexer = require_lexer();
    var _parser = require_parser2();
    var _printer = require_printer();
    var _visitor = require_visitor();
    var _ast = require_ast();
    var _predicates = require_predicates();
    var _directiveLocation = require_directiveLocation();
  }
});

// node_modules/graphql/jsutils/isAsyncIterable.js
var require_isAsyncIterable = __commonJS({
  "node_modules/graphql/jsutils/isAsyncIterable.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.isAsyncIterable = isAsyncIterable;
    function isAsyncIterable(maybeAsyncIterable) {
      return typeof (maybeAsyncIterable === null || maybeAsyncIterable === void 0 ? void 0 : maybeAsyncIterable[Symbol.asyncIterator]) === "function";
    }
  }
});

// node_modules/graphql/execution/mapAsyncIterator.js
var require_mapAsyncIterator = __commonJS({
  "node_modules/graphql/execution/mapAsyncIterator.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.mapAsyncIterator = mapAsyncIterator;
    function mapAsyncIterator(iterable, callback) {
      const iterator = iterable[Symbol.asyncIterator]();
      async function mapResult(result) {
        if (result.done) {
          return result;
        }
        try {
          return {
            value: await callback(result.value),
            done: false
          };
        } catch (error) {
          if (typeof iterator.return === "function") {
            try {
              await iterator.return();
            } catch (_e) {
            }
          }
          throw error;
        }
      }
      return {
        async next() {
          return mapResult(await iterator.next());
        },
        async return() {
          return typeof iterator.return === "function" ? mapResult(await iterator.return()) : {
            value: void 0,
            done: true
          };
        },
        async throw(error) {
          if (typeof iterator.throw === "function") {
            return mapResult(await iterator.throw(error));
          }
          throw error;
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
  }
});

// node_modules/graphql/execution/subscribe.js
var require_subscribe = __commonJS({
  "node_modules/graphql/execution/subscribe.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.createSourceEventStream = createSourceEventStream;
    exports2.subscribe = subscribe;
    var _devAssert = require_devAssert();
    var _inspect2 = require_inspect();
    var _isAsyncIterable = require_isAsyncIterable();
    var _Path = require_Path();
    var _GraphQLError = require_GraphQLError();
    var _locatedError = require_locatedError();
    var _collectFields = require_collectFields();
    var _execute = require_execute();
    var _mapAsyncIterator = require_mapAsyncIterator();
    var _values = require_values();
    async function subscribe(args) {
      arguments.length < 2 || (0, _devAssert.devAssert)(
        false,
        "graphql@16 dropped long-deprecated support for positional arguments, please pass an object instead."
      );
      const resultOrStream = await createSourceEventStream(args);
      if (!(0, _isAsyncIterable.isAsyncIterable)(resultOrStream)) {
        return resultOrStream;
      }
      const mapSourceToResponse = (payload) => (0, _execute.execute)({ ...args, rootValue: payload });
      return (0, _mapAsyncIterator.mapAsyncIterator)(
        resultOrStream,
        mapSourceToResponse
      );
    }
    function toNormalizedArgs(args) {
      const firstArg = args[0];
      if (firstArg && "document" in firstArg) {
        return firstArg;
      }
      return {
        schema: firstArg,
        // FIXME: when underlying TS bug fixed, see https://github.com/microsoft/TypeScript/issues/31613
        document: args[1],
        rootValue: args[2],
        contextValue: args[3],
        variableValues: args[4],
        operationName: args[5],
        subscribeFieldResolver: args[6]
      };
    }
    async function createSourceEventStream(...rawArgs) {
      const args = toNormalizedArgs(rawArgs);
      const { schema, document, variableValues } = args;
      (0, _execute.assertValidExecutionArguments)(schema, document, variableValues);
      const exeContext = (0, _execute.buildExecutionContext)(args);
      if (!("schema" in exeContext)) {
        return {
          errors: exeContext
        };
      }
      try {
        const eventStream = await executeSubscription(exeContext);
        if (!(0, _isAsyncIterable.isAsyncIterable)(eventStream)) {
          throw new Error(
            `Subscription field must return Async Iterable. Received: ${(0, _inspect2.inspect)(eventStream)}.`
          );
        }
        return eventStream;
      } catch (error) {
        if (error instanceof _GraphQLError.GraphQLError) {
          return {
            errors: [error]
          };
        }
        throw error;
      }
    }
    async function executeSubscription(exeContext) {
      const { schema, fragments, operation, variableValues, rootValue } = exeContext;
      const rootType = schema.getSubscriptionType();
      if (rootType == null) {
        throw new _GraphQLError.GraphQLError(
          "Schema is not configured to execute subscription operation.",
          {
            nodes: operation
          }
        );
      }
      const rootFields = (0, _collectFields.collectFields)(
        schema,
        fragments,
        variableValues,
        rootType,
        operation.selectionSet
      );
      const [responseName, fieldNodes] = [...rootFields.entries()][0];
      const fieldDef = (0, _execute.getFieldDef)(schema, rootType, fieldNodes[0]);
      if (!fieldDef) {
        const fieldName = fieldNodes[0].name.value;
        throw new _GraphQLError.GraphQLError(
          `The subscription field "${fieldName}" is not defined.`,
          {
            nodes: fieldNodes
          }
        );
      }
      const path4 = (0, _Path.addPath)(void 0, responseName, rootType.name);
      const info = (0, _execute.buildResolveInfo)(
        exeContext,
        fieldDef,
        fieldNodes,
        rootType,
        path4
      );
      try {
        var _fieldDef$subscribe;
        const args = (0, _values.getArgumentValues)(
          fieldDef,
          fieldNodes[0],
          variableValues
        );
        const contextValue = exeContext.contextValue;
        const resolveFn = (_fieldDef$subscribe = fieldDef.subscribe) !== null && _fieldDef$subscribe !== void 0 ? _fieldDef$subscribe : exeContext.subscribeFieldResolver;
        const eventStream = await resolveFn(rootValue, args, contextValue, info);
        if (eventStream instanceof Error) {
          throw eventStream;
        }
        return eventStream;
      } catch (error) {
        throw (0, _locatedError.locatedError)(
          error,
          fieldNodes,
          (0, _Path.pathToArray)(path4)
        );
      }
    }
  }
});

// node_modules/graphql/execution/index.js
var require_execution = __commonJS({
  "node_modules/graphql/execution/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "createSourceEventStream", {
      enumerable: true,
      get: function() {
        return _subscribe.createSourceEventStream;
      }
    });
    Object.defineProperty(exports2, "defaultFieldResolver", {
      enumerable: true,
      get: function() {
        return _execute.defaultFieldResolver;
      }
    });
    Object.defineProperty(exports2, "defaultTypeResolver", {
      enumerable: true,
      get: function() {
        return _execute.defaultTypeResolver;
      }
    });
    Object.defineProperty(exports2, "execute", {
      enumerable: true,
      get: function() {
        return _execute.execute;
      }
    });
    Object.defineProperty(exports2, "executeSync", {
      enumerable: true,
      get: function() {
        return _execute.executeSync;
      }
    });
    Object.defineProperty(exports2, "getArgumentValues", {
      enumerable: true,
      get: function() {
        return _values.getArgumentValues;
      }
    });
    Object.defineProperty(exports2, "getDirectiveValues", {
      enumerable: true,
      get: function() {
        return _values.getDirectiveValues;
      }
    });
    Object.defineProperty(exports2, "getVariableValues", {
      enumerable: true,
      get: function() {
        return _values.getVariableValues;
      }
    });
    Object.defineProperty(exports2, "responsePathAsArray", {
      enumerable: true,
      get: function() {
        return _Path.pathToArray;
      }
    });
    Object.defineProperty(exports2, "subscribe", {
      enumerable: true,
      get: function() {
        return _subscribe.subscribe;
      }
    });
    var _Path = require_Path();
    var _execute = require_execute();
    var _subscribe = require_subscribe();
    var _values = require_values();
  }
});

// node_modules/graphql/validation/rules/custom/NoDeprecatedCustomRule.js
var require_NoDeprecatedCustomRule = __commonJS({
  "node_modules/graphql/validation/rules/custom/NoDeprecatedCustomRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.NoDeprecatedCustomRule = NoDeprecatedCustomRule;
    var _invariant = require_invariant();
    var _GraphQLError = require_GraphQLError();
    var _definition = require_definition();
    function NoDeprecatedCustomRule(context) {
      return {
        Field(node) {
          const fieldDef = context.getFieldDef();
          const deprecationReason = fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.deprecationReason;
          if (fieldDef && deprecationReason != null) {
            const parentType = context.getParentType();
            parentType != null || (0, _invariant.invariant)(false);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `The field ${parentType.name}.${fieldDef.name} is deprecated. ${deprecationReason}`,
                {
                  nodes: node
                }
              )
            );
          }
        },
        Argument(node) {
          const argDef = context.getArgument();
          const deprecationReason = argDef === null || argDef === void 0 ? void 0 : argDef.deprecationReason;
          if (argDef && deprecationReason != null) {
            const directiveDef = context.getDirective();
            if (directiveDef != null) {
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Directive "@${directiveDef.name}" argument "${argDef.name}" is deprecated. ${deprecationReason}`,
                  {
                    nodes: node
                  }
                )
              );
            } else {
              const parentType = context.getParentType();
              const fieldDef = context.getFieldDef();
              parentType != null && fieldDef != null || (0, _invariant.invariant)(false);
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `Field "${parentType.name}.${fieldDef.name}" argument "${argDef.name}" is deprecated. ${deprecationReason}`,
                  {
                    nodes: node
                  }
                )
              );
            }
          }
        },
        ObjectField(node) {
          const inputObjectDef = (0, _definition.getNamedType)(
            context.getParentInputType()
          );
          if ((0, _definition.isInputObjectType)(inputObjectDef)) {
            const inputFieldDef = inputObjectDef.getFields()[node.name.value];
            const deprecationReason = inputFieldDef === null || inputFieldDef === void 0 ? void 0 : inputFieldDef.deprecationReason;
            if (deprecationReason != null) {
              context.reportError(
                new _GraphQLError.GraphQLError(
                  `The input field ${inputObjectDef.name}.${inputFieldDef.name} is deprecated. ${deprecationReason}`,
                  {
                    nodes: node
                  }
                )
              );
            }
          }
        },
        EnumValue(node) {
          const enumValueDef = context.getEnumValue();
          const deprecationReason = enumValueDef === null || enumValueDef === void 0 ? void 0 : enumValueDef.deprecationReason;
          if (enumValueDef && deprecationReason != null) {
            const enumTypeDef = (0, _definition.getNamedType)(
              context.getInputType()
            );
            enumTypeDef != null || (0, _invariant.invariant)(false);
            context.reportError(
              new _GraphQLError.GraphQLError(
                `The enum value "${enumTypeDef.name}.${enumValueDef.name}" is deprecated. ${deprecationReason}`,
                {
                  nodes: node
                }
              )
            );
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/rules/custom/NoSchemaIntrospectionCustomRule.js
var require_NoSchemaIntrospectionCustomRule = __commonJS({
  "node_modules/graphql/validation/rules/custom/NoSchemaIntrospectionCustomRule.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.NoSchemaIntrospectionCustomRule = NoSchemaIntrospectionCustomRule;
    var _GraphQLError = require_GraphQLError();
    var _definition = require_definition();
    var _introspection = require_introspection();
    function NoSchemaIntrospectionCustomRule(context) {
      return {
        Field(node) {
          const type = (0, _definition.getNamedType)(context.getType());
          if (type && (0, _introspection.isIntrospectionType)(type)) {
            context.reportError(
              new _GraphQLError.GraphQLError(
                `GraphQL introspection has been disabled, but the requested query contained the field "${node.name.value}".`,
                {
                  nodes: node
                }
              )
            );
          }
        }
      };
    }
  }
});

// node_modules/graphql/validation/index.js
var require_validation = __commonJS({
  "node_modules/graphql/validation/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "ExecutableDefinitionsRule", {
      enumerable: true,
      get: function() {
        return _ExecutableDefinitionsRule.ExecutableDefinitionsRule;
      }
    });
    Object.defineProperty(exports2, "FieldsOnCorrectTypeRule", {
      enumerable: true,
      get: function() {
        return _FieldsOnCorrectTypeRule.FieldsOnCorrectTypeRule;
      }
    });
    Object.defineProperty(exports2, "FragmentsOnCompositeTypesRule", {
      enumerable: true,
      get: function() {
        return _FragmentsOnCompositeTypesRule.FragmentsOnCompositeTypesRule;
      }
    });
    Object.defineProperty(exports2, "KnownArgumentNamesRule", {
      enumerable: true,
      get: function() {
        return _KnownArgumentNamesRule.KnownArgumentNamesRule;
      }
    });
    Object.defineProperty(exports2, "KnownDirectivesRule", {
      enumerable: true,
      get: function() {
        return _KnownDirectivesRule.KnownDirectivesRule;
      }
    });
    Object.defineProperty(exports2, "KnownFragmentNamesRule", {
      enumerable: true,
      get: function() {
        return _KnownFragmentNamesRule.KnownFragmentNamesRule;
      }
    });
    Object.defineProperty(exports2, "KnownTypeNamesRule", {
      enumerable: true,
      get: function() {
        return _KnownTypeNamesRule.KnownTypeNamesRule;
      }
    });
    Object.defineProperty(exports2, "LoneAnonymousOperationRule", {
      enumerable: true,
      get: function() {
        return _LoneAnonymousOperationRule.LoneAnonymousOperationRule;
      }
    });
    Object.defineProperty(exports2, "LoneSchemaDefinitionRule", {
      enumerable: true,
      get: function() {
        return _LoneSchemaDefinitionRule.LoneSchemaDefinitionRule;
      }
    });
    Object.defineProperty(exports2, "MaxIntrospectionDepthRule", {
      enumerable: true,
      get: function() {
        return _MaxIntrospectionDepthRule.MaxIntrospectionDepthRule;
      }
    });
    Object.defineProperty(exports2, "NoDeprecatedCustomRule", {
      enumerable: true,
      get: function() {
        return _NoDeprecatedCustomRule.NoDeprecatedCustomRule;
      }
    });
    Object.defineProperty(exports2, "NoFragmentCyclesRule", {
      enumerable: true,
      get: function() {
        return _NoFragmentCyclesRule.NoFragmentCyclesRule;
      }
    });
    Object.defineProperty(exports2, "NoSchemaIntrospectionCustomRule", {
      enumerable: true,
      get: function() {
        return _NoSchemaIntrospectionCustomRule.NoSchemaIntrospectionCustomRule;
      }
    });
    Object.defineProperty(exports2, "NoUndefinedVariablesRule", {
      enumerable: true,
      get: function() {
        return _NoUndefinedVariablesRule.NoUndefinedVariablesRule;
      }
    });
    Object.defineProperty(exports2, "NoUnusedFragmentsRule", {
      enumerable: true,
      get: function() {
        return _NoUnusedFragmentsRule.NoUnusedFragmentsRule;
      }
    });
    Object.defineProperty(exports2, "NoUnusedVariablesRule", {
      enumerable: true,
      get: function() {
        return _NoUnusedVariablesRule.NoUnusedVariablesRule;
      }
    });
    Object.defineProperty(exports2, "OverlappingFieldsCanBeMergedRule", {
      enumerable: true,
      get: function() {
        return _OverlappingFieldsCanBeMergedRule.OverlappingFieldsCanBeMergedRule;
      }
    });
    Object.defineProperty(exports2, "PossibleFragmentSpreadsRule", {
      enumerable: true,
      get: function() {
        return _PossibleFragmentSpreadsRule.PossibleFragmentSpreadsRule;
      }
    });
    Object.defineProperty(exports2, "PossibleTypeExtensionsRule", {
      enumerable: true,
      get: function() {
        return _PossibleTypeExtensionsRule.PossibleTypeExtensionsRule;
      }
    });
    Object.defineProperty(exports2, "ProvidedRequiredArgumentsRule", {
      enumerable: true,
      get: function() {
        return _ProvidedRequiredArgumentsRule.ProvidedRequiredArgumentsRule;
      }
    });
    Object.defineProperty(exports2, "ScalarLeafsRule", {
      enumerable: true,
      get: function() {
        return _ScalarLeafsRule.ScalarLeafsRule;
      }
    });
    Object.defineProperty(exports2, "SingleFieldSubscriptionsRule", {
      enumerable: true,
      get: function() {
        return _SingleFieldSubscriptionsRule.SingleFieldSubscriptionsRule;
      }
    });
    Object.defineProperty(exports2, "UniqueArgumentDefinitionNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueArgumentDefinitionNamesRule.UniqueArgumentDefinitionNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueArgumentNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueArgumentNamesRule.UniqueArgumentNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueDirectiveNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueDirectiveNamesRule.UniqueDirectiveNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueDirectivesPerLocationRule", {
      enumerable: true,
      get: function() {
        return _UniqueDirectivesPerLocationRule.UniqueDirectivesPerLocationRule;
      }
    });
    Object.defineProperty(exports2, "UniqueEnumValueNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueEnumValueNamesRule.UniqueEnumValueNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueFieldDefinitionNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueFieldDefinitionNamesRule.UniqueFieldDefinitionNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueFragmentNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueFragmentNamesRule.UniqueFragmentNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueInputFieldNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueInputFieldNamesRule.UniqueInputFieldNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueOperationNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueOperationNamesRule.UniqueOperationNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueOperationTypesRule", {
      enumerable: true,
      get: function() {
        return _UniqueOperationTypesRule.UniqueOperationTypesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueTypeNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueTypeNamesRule.UniqueTypeNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueVariableNamesRule", {
      enumerable: true,
      get: function() {
        return _UniqueVariableNamesRule.UniqueVariableNamesRule;
      }
    });
    Object.defineProperty(exports2, "ValidationContext", {
      enumerable: true,
      get: function() {
        return _ValidationContext.ValidationContext;
      }
    });
    Object.defineProperty(exports2, "ValuesOfCorrectTypeRule", {
      enumerable: true,
      get: function() {
        return _ValuesOfCorrectTypeRule.ValuesOfCorrectTypeRule;
      }
    });
    Object.defineProperty(exports2, "VariablesAreInputTypesRule", {
      enumerable: true,
      get: function() {
        return _VariablesAreInputTypesRule.VariablesAreInputTypesRule;
      }
    });
    Object.defineProperty(exports2, "VariablesInAllowedPositionRule", {
      enumerable: true,
      get: function() {
        return _VariablesInAllowedPositionRule.VariablesInAllowedPositionRule;
      }
    });
    Object.defineProperty(exports2, "recommendedRules", {
      enumerable: true,
      get: function() {
        return _specifiedRules.recommendedRules;
      }
    });
    Object.defineProperty(exports2, "specifiedRules", {
      enumerable: true,
      get: function() {
        return _specifiedRules.specifiedRules;
      }
    });
    Object.defineProperty(exports2, "validate", {
      enumerable: true,
      get: function() {
        return _validate.validate;
      }
    });
    var _validate = require_validate2();
    var _ValidationContext = require_ValidationContext();
    var _specifiedRules = require_specifiedRules();
    var _ExecutableDefinitionsRule = require_ExecutableDefinitionsRule();
    var _FieldsOnCorrectTypeRule = require_FieldsOnCorrectTypeRule();
    var _FragmentsOnCompositeTypesRule = require_FragmentsOnCompositeTypesRule();
    var _KnownArgumentNamesRule = require_KnownArgumentNamesRule();
    var _KnownDirectivesRule = require_KnownDirectivesRule();
    var _KnownFragmentNamesRule = require_KnownFragmentNamesRule();
    var _KnownTypeNamesRule = require_KnownTypeNamesRule();
    var _LoneAnonymousOperationRule = require_LoneAnonymousOperationRule();
    var _NoFragmentCyclesRule = require_NoFragmentCyclesRule();
    var _NoUndefinedVariablesRule = require_NoUndefinedVariablesRule();
    var _NoUnusedFragmentsRule = require_NoUnusedFragmentsRule();
    var _NoUnusedVariablesRule = require_NoUnusedVariablesRule();
    var _OverlappingFieldsCanBeMergedRule = require_OverlappingFieldsCanBeMergedRule();
    var _PossibleFragmentSpreadsRule = require_PossibleFragmentSpreadsRule();
    var _ProvidedRequiredArgumentsRule = require_ProvidedRequiredArgumentsRule();
    var _ScalarLeafsRule = require_ScalarLeafsRule();
    var _SingleFieldSubscriptionsRule = require_SingleFieldSubscriptionsRule();
    var _UniqueArgumentNamesRule = require_UniqueArgumentNamesRule();
    var _UniqueDirectivesPerLocationRule = require_UniqueDirectivesPerLocationRule();
    var _UniqueFragmentNamesRule = require_UniqueFragmentNamesRule();
    var _UniqueInputFieldNamesRule = require_UniqueInputFieldNamesRule();
    var _UniqueOperationNamesRule = require_UniqueOperationNamesRule();
    var _UniqueVariableNamesRule = require_UniqueVariableNamesRule();
    var _ValuesOfCorrectTypeRule = require_ValuesOfCorrectTypeRule();
    var _VariablesAreInputTypesRule = require_VariablesAreInputTypesRule();
    var _VariablesInAllowedPositionRule = require_VariablesInAllowedPositionRule();
    var _MaxIntrospectionDepthRule = require_MaxIntrospectionDepthRule();
    var _LoneSchemaDefinitionRule = require_LoneSchemaDefinitionRule();
    var _UniqueOperationTypesRule = require_UniqueOperationTypesRule();
    var _UniqueTypeNamesRule = require_UniqueTypeNamesRule();
    var _UniqueEnumValueNamesRule = require_UniqueEnumValueNamesRule();
    var _UniqueFieldDefinitionNamesRule = require_UniqueFieldDefinitionNamesRule();
    var _UniqueArgumentDefinitionNamesRule = require_UniqueArgumentDefinitionNamesRule();
    var _UniqueDirectiveNamesRule = require_UniqueDirectiveNamesRule();
    var _PossibleTypeExtensionsRule = require_PossibleTypeExtensionsRule();
    var _NoDeprecatedCustomRule = require_NoDeprecatedCustomRule();
    var _NoSchemaIntrospectionCustomRule = require_NoSchemaIntrospectionCustomRule();
  }
});

// node_modules/graphql/error/index.js
var require_error = __commonJS({
  "node_modules/graphql/error/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "GraphQLError", {
      enumerable: true,
      get: function() {
        return _GraphQLError.GraphQLError;
      }
    });
    Object.defineProperty(exports2, "formatError", {
      enumerable: true,
      get: function() {
        return _GraphQLError.formatError;
      }
    });
    Object.defineProperty(exports2, "locatedError", {
      enumerable: true,
      get: function() {
        return _locatedError.locatedError;
      }
    });
    Object.defineProperty(exports2, "printError", {
      enumerable: true,
      get: function() {
        return _GraphQLError.printError;
      }
    });
    Object.defineProperty(exports2, "syntaxError", {
      enumerable: true,
      get: function() {
        return _syntaxError.syntaxError;
      }
    });
    var _GraphQLError = require_GraphQLError();
    var _syntaxError = require_syntaxError();
    var _locatedError = require_locatedError();
  }
});

// node_modules/graphql/utilities/getIntrospectionQuery.js
var require_getIntrospectionQuery = __commonJS({
  "node_modules/graphql/utilities/getIntrospectionQuery.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.getIntrospectionQuery = getIntrospectionQuery;
    function getIntrospectionQuery(options) {
      const optionsWithDefault = {
        descriptions: true,
        specifiedByUrl: false,
        directiveIsRepeatable: false,
        schemaDescription: false,
        inputValueDeprecation: false,
        experimentalDirectiveDeprecation: false,
        oneOf: false,
        typeDepth: 9,
        ...options
      };
      const descriptions = optionsWithDefault.descriptions ? "description" : "";
      const specifiedByUrl = optionsWithDefault.specifiedByUrl ? "specifiedByURL" : "";
      const directiveIsRepeatable = optionsWithDefault.directiveIsRepeatable ? "isRepeatable" : "";
      const schemaDescription = optionsWithDefault.schemaDescription ? descriptions : "";
      function inputDeprecation(str) {
        return optionsWithDefault.inputValueDeprecation ? str : "";
      }
      function experimentalDirectiveDeprecation(str) {
        return optionsWithDefault.experimentalDirectiveDeprecation ? str : "";
      }
      const oneOf = optionsWithDefault.oneOf ? "isOneOf" : "";
      function ofType(level, indent) {
        if (level <= 0) {
          return "";
        }
        if (level > 100) {
          throw new Error(
            "Please set typeDepth to a reasonable value between 0 and 100; the default is 9."
          );
        }
        return `
${indent}ofType {
${indent}  name
${indent}  kind${ofType(level - 1, indent + "  ")}
${indent}}`;
      }
      return `
    query IntrospectionQuery {
      __schema {
        ${schemaDescription}
        queryType { name kind }
        mutationType { name kind }
        subscriptionType { name kind }
        types {
          ...FullType
        }
        directives${experimentalDirectiveDeprecation(
        "(includeDeprecated: true)"
      )} {
          name
          ${descriptions}
          ${directiveIsRepeatable}
          ${experimentalDirectiveDeprecation("isDeprecated")}
          ${experimentalDirectiveDeprecation("deprecationReason")}
          locations
          args${inputDeprecation("(includeDeprecated: true)")} {
            ...InputValue
          }
        }
      }
    }

    fragment FullType on __Type {
      kind
      name
      ${descriptions}
      ${specifiedByUrl}
      ${oneOf}
      fields(includeDeprecated: true) {
        name
        ${descriptions}
        args${inputDeprecation("(includeDeprecated: true)")} {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields${inputDeprecation("(includeDeprecated: true)")} {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        ${descriptions}
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }

    fragment InputValue on __InputValue {
      name
      ${descriptions}
      type { ...TypeRef }
      defaultValue
      ${inputDeprecation("isDeprecated")}
      ${inputDeprecation("deprecationReason")}
    }

    fragment TypeRef on __Type {
      kind
      name${ofType(optionsWithDefault.typeDepth, "      ")}
    }
  `;
    }
  }
});

// node_modules/graphql/utilities/getOperationAST.js
var require_getOperationAST = __commonJS({
  "node_modules/graphql/utilities/getOperationAST.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.getOperationAST = getOperationAST;
    var _kinds = require_kinds();
    function getOperationAST(documentAST, operationName) {
      let operation = null;
      for (const definition of documentAST.definitions) {
        if (definition.kind === _kinds.Kind.OPERATION_DEFINITION) {
          var _definition$name;
          if (operationName == null) {
            if (operation) {
              return null;
            }
            operation = definition;
          } else if (((_definition$name = definition.name) === null || _definition$name === void 0 ? void 0 : _definition$name.value) === operationName) {
            return definition;
          }
        }
      }
      return operation;
    }
  }
});

// node_modules/graphql/utilities/getOperationRootType.js
var require_getOperationRootType = __commonJS({
  "node_modules/graphql/utilities/getOperationRootType.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.getOperationRootType = getOperationRootType;
    var _GraphQLError = require_GraphQLError();
    function getOperationRootType(schema, operation) {
      if (operation.operation === "query") {
        const queryType = schema.getQueryType();
        if (!queryType) {
          throw new _GraphQLError.GraphQLError(
            "Schema does not define the required query root type.",
            {
              nodes: operation
            }
          );
        }
        return queryType;
      }
      if (operation.operation === "mutation") {
        const mutationType = schema.getMutationType();
        if (!mutationType) {
          throw new _GraphQLError.GraphQLError(
            "Schema is not configured for mutations.",
            {
              nodes: operation
            }
          );
        }
        return mutationType;
      }
      if (operation.operation === "subscription") {
        const subscriptionType = schema.getSubscriptionType();
        if (!subscriptionType) {
          throw new _GraphQLError.GraphQLError(
            "Schema is not configured for subscriptions.",
            {
              nodes: operation
            }
          );
        }
        return subscriptionType;
      }
      throw new _GraphQLError.GraphQLError(
        "Can only have query, mutation and subscription operations.",
        {
          nodes: operation
        }
      );
    }
  }
});

// node_modules/graphql/utilities/introspectionFromSchema.js
var require_introspectionFromSchema = __commonJS({
  "node_modules/graphql/utilities/introspectionFromSchema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.introspectionFromSchema = introspectionFromSchema;
    var _invariant = require_invariant();
    var _parser = require_parser2();
    var _execute = require_execute();
    var _getIntrospectionQuery = require_getIntrospectionQuery();
    function introspectionFromSchema(schema, options) {
      const optionsWithDefaults = {
        specifiedByUrl: true,
        directiveIsRepeatable: true,
        schemaDescription: true,
        inputValueDeprecation: true,
        experimentalDirectiveDeprecation: true,
        oneOf: true,
        ...options
      };
      const document = (0, _parser.parse)(
        (0, _getIntrospectionQuery.getIntrospectionQuery)(optionsWithDefaults)
      );
      const result = (0, _execute.executeSync)({
        schema,
        document
      });
      !result.errors && result.data || (0, _invariant.invariant)(false);
      return result.data;
    }
  }
});

// node_modules/graphql/utilities/buildClientSchema.js
var require_buildClientSchema = __commonJS({
  "node_modules/graphql/utilities/buildClientSchema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.buildClientSchema = buildClientSchema;
    var _devAssert = require_devAssert();
    var _inspect2 = require_inspect();
    var _isObjectLike = require_isObjectLike();
    var _keyValMap = require_keyValMap();
    var _parser = require_parser2();
    var _definition = require_definition();
    var _directives = require_directives();
    var _introspection = require_introspection();
    var _scalars = require_scalars();
    var _schema = require_schema();
    var _valueFromAST = require_valueFromAST();
    function buildClientSchema(introspection, options) {
      (0, _isObjectLike.isObjectLike)(introspection) && (0, _isObjectLike.isObjectLike)(introspection.__schema) || (0, _devAssert.devAssert)(
        false,
        `Invalid or incomplete introspection result. Ensure that you are passing "data" property of introspection response and no "errors" was returned alongside: ${(0, _inspect2.inspect)(introspection)}.`
      );
      const schemaIntrospection = introspection.__schema;
      const typeMap = (0, _keyValMap.keyValMap)(
        schemaIntrospection.types,
        (typeIntrospection) => typeIntrospection.name,
        (typeIntrospection) => buildType(typeIntrospection)
      );
      for (const stdType of [
        ..._scalars.specifiedScalarTypes,
        ..._introspection.introspectionTypes
      ]) {
        if (typeMap[stdType.name]) {
          typeMap[stdType.name] = stdType;
        }
      }
      const queryType = schemaIntrospection.queryType ? getObjectType(schemaIntrospection.queryType) : null;
      const mutationType = schemaIntrospection.mutationType ? getObjectType(schemaIntrospection.mutationType) : null;
      const subscriptionType = schemaIntrospection.subscriptionType ? getObjectType(schemaIntrospection.subscriptionType) : null;
      const directives = schemaIntrospection.directives ? schemaIntrospection.directives.map(buildDirective) : [];
      return new _schema.GraphQLSchema({
        description: schemaIntrospection.description,
        query: queryType,
        mutation: mutationType,
        subscription: subscriptionType,
        types: Object.values(typeMap),
        directives,
        assumeValid: options === null || options === void 0 ? void 0 : options.assumeValid
      });
      function getType(typeRef) {
        if (typeRef.kind === _introspection.TypeKind.LIST) {
          const itemRef = typeRef.ofType;
          if (!itemRef) {
            throw new Error("Decorated type deeper than introspection query.");
          }
          return new _definition.GraphQLList(getType(itemRef));
        }
        if (typeRef.kind === _introspection.TypeKind.NON_NULL) {
          const nullableRef = typeRef.ofType;
          if (!nullableRef) {
            throw new Error("Decorated type deeper than introspection query.");
          }
          const nullableType = getType(nullableRef);
          return new _definition.GraphQLNonNull(
            (0, _definition.assertNullableType)(nullableType)
          );
        }
        return getNamedType(typeRef);
      }
      function getNamedType(typeRef) {
        const typeName = typeRef.name;
        if (!typeName) {
          throw new Error(
            `Unknown type reference: ${(0, _inspect2.inspect)(typeRef)}.`
          );
        }
        const type = typeMap[typeName];
        if (!type) {
          throw new Error(
            `Invalid or incomplete schema, unknown type: ${typeName}. Ensure that a full introspection query is used in order to build a client schema.`
          );
        }
        return type;
      }
      function getObjectType(typeRef) {
        return (0, _definition.assertObjectType)(getNamedType(typeRef));
      }
      function getInterfaceType(typeRef) {
        return (0, _definition.assertInterfaceType)(getNamedType(typeRef));
      }
      function buildType(type) {
        if (type != null && type.name != null && type.kind != null) {
          switch (type.kind) {
            case _introspection.TypeKind.SCALAR:
              return buildScalarDef(type);
            case _introspection.TypeKind.OBJECT:
              return buildObjectDef(type);
            case _introspection.TypeKind.INTERFACE:
              return buildInterfaceDef(type);
            case _introspection.TypeKind.UNION:
              return buildUnionDef(type);
            case _introspection.TypeKind.ENUM:
              return buildEnumDef(type);
            case _introspection.TypeKind.INPUT_OBJECT:
              return buildInputObjectDef(type);
          }
        }
        const typeStr = (0, _inspect2.inspect)(type);
        throw new Error(
          `Invalid or incomplete introspection result. Ensure that a full introspection query is used in order to build a client schema: ${typeStr}.`
        );
      }
      function buildScalarDef(scalarIntrospection) {
        return new _definition.GraphQLScalarType({
          name: scalarIntrospection.name,
          description: scalarIntrospection.description,
          specifiedByURL: scalarIntrospection.specifiedByURL
        });
      }
      function buildImplementationsList(implementingIntrospection) {
        if (implementingIntrospection.interfaces === null && implementingIntrospection.kind === _introspection.TypeKind.INTERFACE) {
          return [];
        }
        if (!implementingIntrospection.interfaces) {
          const implementingIntrospectionStr = (0, _inspect2.inspect)(
            implementingIntrospection
          );
          throw new Error(
            `Introspection result missing interfaces: ${implementingIntrospectionStr}.`
          );
        }
        return implementingIntrospection.interfaces.map(getInterfaceType);
      }
      function buildObjectDef(objectIntrospection) {
        return new _definition.GraphQLObjectType({
          name: objectIntrospection.name,
          description: objectIntrospection.description,
          interfaces: () => buildImplementationsList(objectIntrospection),
          fields: () => buildFieldDefMap(objectIntrospection)
        });
      }
      function buildInterfaceDef(interfaceIntrospection) {
        return new _definition.GraphQLInterfaceType({
          name: interfaceIntrospection.name,
          description: interfaceIntrospection.description,
          interfaces: () => buildImplementationsList(interfaceIntrospection),
          fields: () => buildFieldDefMap(interfaceIntrospection)
        });
      }
      function buildUnionDef(unionIntrospection) {
        if (!unionIntrospection.possibleTypes) {
          const unionIntrospectionStr = (0, _inspect2.inspect)(unionIntrospection);
          throw new Error(
            `Introspection result missing possibleTypes: ${unionIntrospectionStr}.`
          );
        }
        return new _definition.GraphQLUnionType({
          name: unionIntrospection.name,
          description: unionIntrospection.description,
          types: () => unionIntrospection.possibleTypes.map(getObjectType)
        });
      }
      function buildEnumDef(enumIntrospection) {
        if (!enumIntrospection.enumValues) {
          const enumIntrospectionStr = (0, _inspect2.inspect)(enumIntrospection);
          throw new Error(
            `Introspection result missing enumValues: ${enumIntrospectionStr}.`
          );
        }
        return new _definition.GraphQLEnumType({
          name: enumIntrospection.name,
          description: enumIntrospection.description,
          values: (0, _keyValMap.keyValMap)(
            enumIntrospection.enumValues,
            (valueIntrospection) => valueIntrospection.name,
            (valueIntrospection) => ({
              description: valueIntrospection.description,
              deprecationReason: valueIntrospection.deprecationReason
            })
          )
        });
      }
      function buildInputObjectDef(inputObjectIntrospection) {
        if (!inputObjectIntrospection.inputFields) {
          const inputObjectIntrospectionStr = (0, _inspect2.inspect)(
            inputObjectIntrospection
          );
          throw new Error(
            `Introspection result missing inputFields: ${inputObjectIntrospectionStr}.`
          );
        }
        return new _definition.GraphQLInputObjectType({
          name: inputObjectIntrospection.name,
          description: inputObjectIntrospection.description,
          fields: () => buildInputValueDefMap(inputObjectIntrospection.inputFields),
          isOneOf: inputObjectIntrospection.isOneOf
        });
      }
      function buildFieldDefMap(typeIntrospection) {
        if (!typeIntrospection.fields) {
          throw new Error(
            `Introspection result missing fields: ${(0, _inspect2.inspect)(
              typeIntrospection
            )}.`
          );
        }
        return (0, _keyValMap.keyValMap)(
          typeIntrospection.fields,
          (fieldIntrospection) => fieldIntrospection.name,
          buildField
        );
      }
      function buildField(fieldIntrospection) {
        const type = getType(fieldIntrospection.type);
        if (!(0, _definition.isOutputType)(type)) {
          const typeStr = (0, _inspect2.inspect)(type);
          throw new Error(
            `Introspection must provide output type for fields, but received: ${typeStr}.`
          );
        }
        if (!fieldIntrospection.args) {
          const fieldIntrospectionStr = (0, _inspect2.inspect)(fieldIntrospection);
          throw new Error(
            `Introspection result missing field args: ${fieldIntrospectionStr}.`
          );
        }
        return {
          description: fieldIntrospection.description,
          deprecationReason: fieldIntrospection.deprecationReason,
          type,
          args: buildInputValueDefMap(fieldIntrospection.args)
        };
      }
      function buildInputValueDefMap(inputValueIntrospections) {
        return (0, _keyValMap.keyValMap)(
          inputValueIntrospections,
          (inputValue) => inputValue.name,
          buildInputValue
        );
      }
      function buildInputValue(inputValueIntrospection) {
        const type = getType(inputValueIntrospection.type);
        if (!(0, _definition.isInputType)(type)) {
          const typeStr = (0, _inspect2.inspect)(type);
          throw new Error(
            `Introspection must provide input type for arguments, but received: ${typeStr}.`
          );
        }
        const defaultValue = inputValueIntrospection.defaultValue != null ? (0, _valueFromAST.valueFromAST)(
          (0, _parser.parseValue)(inputValueIntrospection.defaultValue),
          type
        ) : void 0;
        return {
          description: inputValueIntrospection.description,
          type,
          defaultValue,
          deprecationReason: inputValueIntrospection.deprecationReason
        };
      }
      function buildDirective(directiveIntrospection) {
        if (!directiveIntrospection.args) {
          const directiveIntrospectionStr = (0, _inspect2.inspect)(
            directiveIntrospection
          );
          throw new Error(
            `Introspection result missing directive args: ${directiveIntrospectionStr}.`
          );
        }
        if (!directiveIntrospection.locations) {
          const directiveIntrospectionStr = (0, _inspect2.inspect)(
            directiveIntrospection
          );
          throw new Error(
            `Introspection result missing directive locations: ${directiveIntrospectionStr}.`
          );
        }
        return new _directives.GraphQLDirective({
          name: directiveIntrospection.name,
          description: directiveIntrospection.description,
          isRepeatable: directiveIntrospection.isRepeatable,
          deprecationReason: directiveIntrospection.deprecationReason,
          locations: directiveIntrospection.locations.slice(),
          args: buildInputValueDefMap(directiveIntrospection.args)
        });
      }
    }
  }
});

// node_modules/graphql/utilities/extendSchema.js
var require_extendSchema = __commonJS({
  "node_modules/graphql/utilities/extendSchema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.extendSchema = extendSchema;
    exports2.extendSchemaImpl = extendSchemaImpl;
    var _devAssert = require_devAssert();
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _keyMap = require_keyMap();
    var _mapValue = require_mapValue();
    var _kinds = require_kinds();
    var _predicates = require_predicates();
    var _definition = require_definition();
    var _directives = require_directives();
    var _introspection = require_introspection();
    var _scalars = require_scalars();
    var _schema = require_schema();
    var _validate = require_validate2();
    var _values = require_values();
    var _valueFromAST = require_valueFromAST();
    function extendSchema(schema, documentAST, options) {
      (0, _schema.assertSchema)(schema);
      documentAST != null && documentAST.kind === _kinds.Kind.DOCUMENT || (0, _devAssert.devAssert)(false, "Must provide valid Document AST.");
      if ((options === null || options === void 0 ? void 0 : options.assumeValid) !== true && (options === null || options === void 0 ? void 0 : options.assumeValidSDL) !== true) {
        (0, _validate.assertValidSDLExtension)(documentAST, schema);
      }
      const schemaConfig = schema.toConfig();
      const extendedConfig = extendSchemaImpl(schemaConfig, documentAST, options);
      return schemaConfig === extendedConfig ? schema : new _schema.GraphQLSchema(extendedConfig);
    }
    function extendSchemaImpl(schemaConfig, documentAST, options) {
      var _schemaDef, _schemaDef$descriptio, _schemaDef2, _options$assumeValid;
      const typeDefs = [];
      const typeExtensionsMap = /* @__PURE__ */ Object.create(null);
      const directiveExtensionsMap = /* @__PURE__ */ Object.create(null);
      const directiveDefs = [];
      let schemaDef;
      const schemaExtensions = [];
      for (const def of documentAST.definitions) {
        if (def.kind === _kinds.Kind.SCHEMA_DEFINITION) {
          schemaDef = def;
        } else if (def.kind === _kinds.Kind.SCHEMA_EXTENSION) {
          schemaExtensions.push(def);
        } else if ((0, _predicates.isTypeDefinitionNode)(def)) {
          typeDefs.push(def);
        } else if ((0, _predicates.isTypeExtensionNode)(def)) {
          const extendedTypeName = def.name.value;
          const existingTypeExtensions = typeExtensionsMap[extendedTypeName];
          typeExtensionsMap[extendedTypeName] = existingTypeExtensions ? existingTypeExtensions.concat([def]) : [def];
        } else if (def.kind === _kinds.Kind.DIRECTIVE_DEFINITION) {
          directiveDefs.push(def);
        } else if (def.kind === _kinds.Kind.DIRECTIVE_EXTENSION) {
          const extendedDirectiveName = def.name.value;
          const existingDirectiveExtensions = directiveExtensionsMap[extendedDirectiveName];
          directiveExtensionsMap[extendedDirectiveName] = existingDirectiveExtensions ? existingDirectiveExtensions.concat([def]) : [def];
        }
      }
      if (Object.keys(typeExtensionsMap).length === 0 && typeDefs.length === 0 && Object.keys(directiveExtensionsMap).length === 0 && directiveDefs.length === 0 && schemaExtensions.length === 0 && schemaDef == null) {
        return schemaConfig;
      }
      const typeMap = /* @__PURE__ */ Object.create(null);
      for (const existingType of schemaConfig.types) {
        typeMap[existingType.name] = extendNamedType(existingType);
      }
      for (const typeNode of typeDefs) {
        var _stdTypeMap$name;
        const name = typeNode.name.value;
        typeMap[name] = (_stdTypeMap$name = stdTypeMap[name]) !== null && _stdTypeMap$name !== void 0 ? _stdTypeMap$name : buildType(typeNode);
      }
      const directiveMap = /* @__PURE__ */ Object.create(null);
      for (const existingDirective of schemaConfig.directives) {
        directiveMap[existingDirective.name] = extendDirective(existingDirective);
      }
      const operationTypes = {
        // Get the extended root operation types.
        query: schemaConfig.query && replaceNamedType(schemaConfig.query),
        mutation: schemaConfig.mutation && replaceNamedType(schemaConfig.mutation),
        subscription: schemaConfig.subscription && replaceNamedType(schemaConfig.subscription),
        // Then, incorporate schema definition and all schema extensions.
        ...schemaDef && getOperationTypes([schemaDef]),
        ...getOperationTypes(schemaExtensions)
      };
      const directives = Object.values(directiveMap);
      return {
        description: (_schemaDef = schemaDef) === null || _schemaDef === void 0 ? void 0 : (_schemaDef$descriptio = _schemaDef.description) === null || _schemaDef$descriptio === void 0 ? void 0 : _schemaDef$descriptio.value,
        ...operationTypes,
        types: Object.values(typeMap),
        directives: [
          ...directives.map(replaceDirective),
          ...directiveDefs.map(buildDirective)
        ],
        extensions: /* @__PURE__ */ Object.create(null),
        astNode: (_schemaDef2 = schemaDef) !== null && _schemaDef2 !== void 0 ? _schemaDef2 : schemaConfig.astNode,
        extensionASTNodes: schemaConfig.extensionASTNodes.concat(schemaExtensions),
        assumeValid: (_options$assumeValid = options === null || options === void 0 ? void 0 : options.assumeValid) !== null && _options$assumeValid !== void 0 ? _options$assumeValid : false
      };
      function replaceType(type) {
        if ((0, _definition.isListType)(type)) {
          return new _definition.GraphQLList(replaceType(type.ofType));
        }
        if ((0, _definition.isNonNullType)(type)) {
          return new _definition.GraphQLNonNull(replaceType(type.ofType));
        }
        return replaceNamedType(type);
      }
      function replaceNamedType(type) {
        return typeMap[type.name];
      }
      function replaceDirective(directive) {
        const config = directive.toConfig();
        return new _directives.GraphQLDirective({
          ...config,
          args: (0, _mapValue.mapValue)(config.args, extendArg)
        });
      }
      function extendNamedType(type) {
        if ((0, _introspection.isIntrospectionType)(type) || (0, _scalars.isSpecifiedScalarType)(type)) {
          return type;
        }
        if ((0, _definition.isScalarType)(type)) {
          return extendScalarType(type);
        }
        if ((0, _definition.isObjectType)(type)) {
          return extendObjectType(type);
        }
        if ((0, _definition.isInterfaceType)(type)) {
          return extendInterfaceType(type);
        }
        if ((0, _definition.isUnionType)(type)) {
          return extendUnionType(type);
        }
        if ((0, _definition.isEnumType)(type)) {
          return extendEnumType(type);
        }
        if ((0, _definition.isInputObjectType)(type)) {
          return extendInputObjectType(type);
        }
        (0, _invariant.invariant)(
          false,
          "Unexpected type: " + (0, _inspect2.inspect)(type)
        );
      }
      function extendInputObjectType(type) {
        var _typeExtensionsMap$co;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co !== void 0 ? _typeExtensionsMap$co : [];
        return new _definition.GraphQLInputObjectType({
          ...config,
          fields: () => ({
            ...(0, _mapValue.mapValue)(config.fields, (field) => ({
              ...field,
              type: replaceType(field.type)
            })),
            ...buildInputFieldMap(extensions)
          }),
          extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
      }
      function extendEnumType(type) {
        var _typeExtensionsMap$ty;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$ty = typeExtensionsMap[type.name]) !== null && _typeExtensionsMap$ty !== void 0 ? _typeExtensionsMap$ty : [];
        return new _definition.GraphQLEnumType({
          ...config,
          values: { ...config.values, ...buildEnumValueMap(extensions) },
          extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
      }
      function extendScalarType(type) {
        var _typeExtensionsMap$co2;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co2 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co2 !== void 0 ? _typeExtensionsMap$co2 : [];
        let specifiedByURL = config.specifiedByURL;
        for (const extensionNode of extensions) {
          var _getSpecifiedByURL;
          specifiedByURL = (_getSpecifiedByURL = getSpecifiedByURL(extensionNode)) !== null && _getSpecifiedByURL !== void 0 ? _getSpecifiedByURL : specifiedByURL;
        }
        return new _definition.GraphQLScalarType({
          ...config,
          specifiedByURL,
          extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
      }
      function extendObjectType(type) {
        var _typeExtensionsMap$co3;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co3 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co3 !== void 0 ? _typeExtensionsMap$co3 : [];
        return new _definition.GraphQLObjectType({
          ...config,
          interfaces: () => [
            ...type.getInterfaces().map(replaceNamedType),
            ...buildInterfaces(extensions)
          ],
          fields: () => ({
            ...(0, _mapValue.mapValue)(config.fields, extendField),
            ...buildFieldMap(extensions)
          }),
          extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
      }
      function extendInterfaceType(type) {
        var _typeExtensionsMap$co4;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co4 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co4 !== void 0 ? _typeExtensionsMap$co4 : [];
        return new _definition.GraphQLInterfaceType({
          ...config,
          interfaces: () => [
            ...type.getInterfaces().map(replaceNamedType),
            ...buildInterfaces(extensions)
          ],
          fields: () => ({
            ...(0, _mapValue.mapValue)(config.fields, extendField),
            ...buildFieldMap(extensions)
          }),
          extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
      }
      function extendUnionType(type) {
        var _typeExtensionsMap$co5;
        const config = type.toConfig();
        const extensions = (_typeExtensionsMap$co5 = typeExtensionsMap[config.name]) !== null && _typeExtensionsMap$co5 !== void 0 ? _typeExtensionsMap$co5 : [];
        return new _definition.GraphQLUnionType({
          ...config,
          types: () => [
            ...type.getTypes().map(replaceNamedType),
            ...buildUnionTypes(extensions)
          ],
          extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
      }
      function extendField(field) {
        return {
          ...field,
          type: replaceType(field.type),
          args: field.args && (0, _mapValue.mapValue)(field.args, extendArg)
        };
      }
      function extendArg(arg) {
        return { ...arg, type: replaceType(arg.type) };
      }
      function getOperationTypes(nodes) {
        const opTypes = {};
        for (const node of nodes) {
          var _node$operationTypes;
          const operationTypesNodes = (
            /* c8 ignore next */
            (_node$operationTypes = node.operationTypes) !== null && _node$operationTypes !== void 0 ? _node$operationTypes : []
          );
          for (const operationType of operationTypesNodes) {
            opTypes[operationType.operation] = getNamedType(operationType.type);
          }
        }
        return opTypes;
      }
      function extendDirective(directive) {
        var _directiveExtensionsM, _config$deprecationRe;
        const config = directive.toConfig();
        const extensions = (_directiveExtensionsM = directiveExtensionsMap[config.name]) !== null && _directiveExtensionsM !== void 0 ? _directiveExtensionsM : [];
        const deprecationReason = (_config$deprecationRe = config.deprecationReason) !== null && _config$deprecationRe !== void 0 ? _config$deprecationRe : extensions.map((ext) => getDeprecationReason(ext)).find((reason) => reason != null);
        return new _directives.GraphQLDirective({
          ...config,
          deprecationReason,
          extensionASTNodes: config.extensionASTNodes.concat(extensions)
        });
      }
      function getNamedType(node) {
        var _stdTypeMap$name2;
        const name = node.name.value;
        const type = (_stdTypeMap$name2 = stdTypeMap[name]) !== null && _stdTypeMap$name2 !== void 0 ? _stdTypeMap$name2 : typeMap[name];
        if (type === void 0) {
          throw new Error(`Unknown type: "${name}".`);
        }
        return type;
      }
      function getWrappedType(node) {
        if (node.kind === _kinds.Kind.LIST_TYPE) {
          return new _definition.GraphQLList(getWrappedType(node.type));
        }
        if (node.kind === _kinds.Kind.NON_NULL_TYPE) {
          return new _definition.GraphQLNonNull(getWrappedType(node.type));
        }
        return getNamedType(node);
      }
      function buildDirective(node) {
        var _directiveExtensionsM2, _getDeprecationReason, _node$description;
        const extensions = (_directiveExtensionsM2 = directiveExtensionsMap[node.name.value]) !== null && _directiveExtensionsM2 !== void 0 ? _directiveExtensionsM2 : [];
        const deprecationReason = (_getDeprecationReason = getDeprecationReason(node)) !== null && _getDeprecationReason !== void 0 ? _getDeprecationReason : extensions.map((ext) => getDeprecationReason(ext)).find((reason) => reason != null);
        return new _directives.GraphQLDirective({
          name: node.name.value,
          description: (_node$description = node.description) === null || _node$description === void 0 ? void 0 : _node$description.value,
          // @ts-expect-error
          locations: node.locations.map(({ value }) => value),
          isRepeatable: node.repeatable,
          args: buildArgumentMap(node.arguments),
          deprecationReason,
          astNode: node,
          extensionASTNodes: extensions
        });
      }
      function buildFieldMap(nodes) {
        const fieldConfigMap = /* @__PURE__ */ Object.create(null);
        for (const node of nodes) {
          var _node$fields;
          const nodeFields = (
            /* c8 ignore next */
            (_node$fields = node.fields) !== null && _node$fields !== void 0 ? _node$fields : []
          );
          for (const field of nodeFields) {
            var _field$description;
            fieldConfigMap[field.name.value] = {
              // Note: While this could make assertions to get the correctly typed
              // value, that would throw immediately while type system validation
              // with validateSchema() will produce more actionable results.
              type: getWrappedType(field.type),
              description: (_field$description = field.description) === null || _field$description === void 0 ? void 0 : _field$description.value,
              args: buildArgumentMap(field.arguments),
              deprecationReason: getDeprecationReason(field),
              astNode: field
            };
          }
        }
        return fieldConfigMap;
      }
      function buildArgumentMap(args) {
        const argsNodes = (
          /* c8 ignore next */
          args !== null && args !== void 0 ? args : []
        );
        const argConfigMap = /* @__PURE__ */ Object.create(null);
        for (const arg of argsNodes) {
          var _arg$description;
          const type = getWrappedType(arg.type);
          argConfigMap[arg.name.value] = {
            type,
            description: (_arg$description = arg.description) === null || _arg$description === void 0 ? void 0 : _arg$description.value,
            defaultValue: (0, _valueFromAST.valueFromAST)(arg.defaultValue, type),
            deprecationReason: getDeprecationReason(arg),
            astNode: arg
          };
        }
        return argConfigMap;
      }
      function buildInputFieldMap(nodes) {
        const inputFieldMap = /* @__PURE__ */ Object.create(null);
        for (const node of nodes) {
          var _node$fields2;
          const fieldsNodes = (
            /* c8 ignore next */
            (_node$fields2 = node.fields) !== null && _node$fields2 !== void 0 ? _node$fields2 : []
          );
          for (const field of fieldsNodes) {
            var _field$description2;
            const type = getWrappedType(field.type);
            inputFieldMap[field.name.value] = {
              type,
              description: (_field$description2 = field.description) === null || _field$description2 === void 0 ? void 0 : _field$description2.value,
              defaultValue: (0, _valueFromAST.valueFromAST)(
                field.defaultValue,
                type
              ),
              deprecationReason: getDeprecationReason(field),
              astNode: field
            };
          }
        }
        return inputFieldMap;
      }
      function buildEnumValueMap(nodes) {
        const enumValueMap = /* @__PURE__ */ Object.create(null);
        for (const node of nodes) {
          var _node$values;
          const valuesNodes = (
            /* c8 ignore next */
            (_node$values = node.values) !== null && _node$values !== void 0 ? _node$values : []
          );
          for (const value of valuesNodes) {
            var _value$description;
            enumValueMap[value.name.value] = {
              description: (_value$description = value.description) === null || _value$description === void 0 ? void 0 : _value$description.value,
              deprecationReason: getDeprecationReason(value),
              astNode: value
            };
          }
        }
        return enumValueMap;
      }
      function buildInterfaces(nodes) {
        return nodes.flatMap(
          // FIXME: https://github.com/graphql/graphql-js/issues/2203
          (node) => {
            var _node$interfaces$map, _node$interfaces;
            return (
              /* c8 ignore next */
              (_node$interfaces$map = (_node$interfaces = node.interfaces) === null || _node$interfaces === void 0 ? void 0 : _node$interfaces.map(getNamedType)) !== null && _node$interfaces$map !== void 0 ? _node$interfaces$map : []
            );
          }
        );
      }
      function buildUnionTypes(nodes) {
        return nodes.flatMap(
          // FIXME: https://github.com/graphql/graphql-js/issues/2203
          (node) => {
            var _node$types$map, _node$types;
            return (
              /* c8 ignore next */
              (_node$types$map = (_node$types = node.types) === null || _node$types === void 0 ? void 0 : _node$types.map(getNamedType)) !== null && _node$types$map !== void 0 ? _node$types$map : []
            );
          }
        );
      }
      function buildType(astNode) {
        var _typeExtensionsMap$na;
        const name = astNode.name.value;
        const extensionASTNodes = (_typeExtensionsMap$na = typeExtensionsMap[name]) !== null && _typeExtensionsMap$na !== void 0 ? _typeExtensionsMap$na : [];
        switch (astNode.kind) {
          case _kinds.Kind.OBJECT_TYPE_DEFINITION: {
            var _astNode$description;
            const allNodes = [astNode, ...extensionASTNodes];
            return new _definition.GraphQLObjectType({
              name,
              description: (_astNode$description = astNode.description) === null || _astNode$description === void 0 ? void 0 : _astNode$description.value,
              interfaces: () => buildInterfaces(allNodes),
              fields: () => buildFieldMap(allNodes),
              astNode,
              extensionASTNodes
            });
          }
          case _kinds.Kind.INTERFACE_TYPE_DEFINITION: {
            var _astNode$description2;
            const allNodes = [astNode, ...extensionASTNodes];
            return new _definition.GraphQLInterfaceType({
              name,
              description: (_astNode$description2 = astNode.description) === null || _astNode$description2 === void 0 ? void 0 : _astNode$description2.value,
              interfaces: () => buildInterfaces(allNodes),
              fields: () => buildFieldMap(allNodes),
              astNode,
              extensionASTNodes
            });
          }
          case _kinds.Kind.ENUM_TYPE_DEFINITION: {
            var _astNode$description3;
            const allNodes = [astNode, ...extensionASTNodes];
            return new _definition.GraphQLEnumType({
              name,
              description: (_astNode$description3 = astNode.description) === null || _astNode$description3 === void 0 ? void 0 : _astNode$description3.value,
              values: buildEnumValueMap(allNodes),
              astNode,
              extensionASTNodes
            });
          }
          case _kinds.Kind.UNION_TYPE_DEFINITION: {
            var _astNode$description4;
            const allNodes = [astNode, ...extensionASTNodes];
            return new _definition.GraphQLUnionType({
              name,
              description: (_astNode$description4 = astNode.description) === null || _astNode$description4 === void 0 ? void 0 : _astNode$description4.value,
              types: () => buildUnionTypes(allNodes),
              astNode,
              extensionASTNodes
            });
          }
          case _kinds.Kind.SCALAR_TYPE_DEFINITION: {
            var _astNode$description5;
            return new _definition.GraphQLScalarType({
              name,
              description: (_astNode$description5 = astNode.description) === null || _astNode$description5 === void 0 ? void 0 : _astNode$description5.value,
              specifiedByURL: getSpecifiedByURL(astNode),
              astNode,
              extensionASTNodes
            });
          }
          case _kinds.Kind.INPUT_OBJECT_TYPE_DEFINITION: {
            var _astNode$description6;
            const allNodes = [astNode, ...extensionASTNodes];
            return new _definition.GraphQLInputObjectType({
              name,
              description: (_astNode$description6 = astNode.description) === null || _astNode$description6 === void 0 ? void 0 : _astNode$description6.value,
              fields: () => buildInputFieldMap(allNodes),
              astNode,
              extensionASTNodes,
              isOneOf: isOneOf(astNode)
            });
          }
        }
      }
    }
    var stdTypeMap = (0, _keyMap.keyMap)(
      [..._scalars.specifiedScalarTypes, ..._introspection.introspectionTypes],
      (type) => type.name
    );
    function getDeprecationReason(node) {
      const deprecated = (0, _values.getDirectiveValues)(
        _directives.GraphQLDeprecatedDirective,
        node
      );
      return deprecated === null || deprecated === void 0 ? void 0 : deprecated.reason;
    }
    function getSpecifiedByURL(node) {
      const specifiedBy = (0, _values.getDirectiveValues)(
        _directives.GraphQLSpecifiedByDirective,
        node
      );
      return specifiedBy === null || specifiedBy === void 0 ? void 0 : specifiedBy.url;
    }
    function isOneOf(node) {
      return Boolean(
        (0, _values.getDirectiveValues)(_directives.GraphQLOneOfDirective, node)
      );
    }
  }
});

// node_modules/graphql/utilities/buildASTSchema.js
var require_buildASTSchema = __commonJS({
  "node_modules/graphql/utilities/buildASTSchema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.buildASTSchema = buildASTSchema;
    exports2.buildSchema = buildSchema;
    var _devAssert = require_devAssert();
    var _kinds = require_kinds();
    var _parser = require_parser2();
    var _directives = require_directives();
    var _schema = require_schema();
    var _validate = require_validate2();
    var _extendSchema = require_extendSchema();
    function buildASTSchema(documentAST, options) {
      documentAST != null && documentAST.kind === _kinds.Kind.DOCUMENT || (0, _devAssert.devAssert)(false, "Must provide valid Document AST.");
      if ((options === null || options === void 0 ? void 0 : options.assumeValid) !== true && (options === null || options === void 0 ? void 0 : options.assumeValidSDL) !== true) {
        (0, _validate.assertValidSDL)(documentAST);
      }
      const emptySchemaConfig = {
        description: void 0,
        types: [],
        directives: [],
        extensions: /* @__PURE__ */ Object.create(null),
        extensionASTNodes: [],
        assumeValid: false
      };
      const config = (0, _extendSchema.extendSchemaImpl)(
        emptySchemaConfig,
        documentAST,
        options
      );
      if (config.astNode == null) {
        for (const type of config.types) {
          switch (type.name) {
            // Note: While this could make early assertions to get the correctly
            // typed values below, that would throw immediately while type system
            // validation with validateSchema() will produce more actionable results.
            case "Query":
              config.query = type;
              break;
            case "Mutation":
              config.mutation = type;
              break;
            case "Subscription":
              config.subscription = type;
              break;
          }
        }
      }
      const directives = [
        ...config.directives,
        // If specified directives were not explicitly declared, add them.
        ..._directives.specifiedDirectives.filter(
          (stdDirective) => config.directives.every(
            (directive) => directive.name !== stdDirective.name
          )
        )
      ];
      return new _schema.GraphQLSchema({ ...config, directives });
    }
    function buildSchema(source, options) {
      const document = (0, _parser.parse)(source, {
        noLocation: options === null || options === void 0 ? void 0 : options.noLocation,
        allowLegacyFragmentVariables: options === null || options === void 0 ? void 0 : options.allowLegacyFragmentVariables,
        experimentalDirectivesOnDirectiveDefinitions: options === null || options === void 0 ? void 0 : options.experimentalDirectivesOnDirectiveDefinitions
      });
      return buildASTSchema(document, {
        assumeValidSDL: options === null || options === void 0 ? void 0 : options.assumeValidSDL,
        assumeValid: options === null || options === void 0 ? void 0 : options.assumeValid
      });
    }
  }
});

// node_modules/graphql/utilities/lexicographicSortSchema.js
var require_lexicographicSortSchema = __commonJS({
  "node_modules/graphql/utilities/lexicographicSortSchema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.lexicographicSortSchema = lexicographicSortSchema;
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _keyValMap = require_keyValMap();
    var _naturalCompare = require_naturalCompare();
    var _definition = require_definition();
    var _directives = require_directives();
    var _introspection = require_introspection();
    var _schema = require_schema();
    function lexicographicSortSchema(schema) {
      const schemaConfig = schema.toConfig();
      const typeMap = (0, _keyValMap.keyValMap)(
        sortByName(schemaConfig.types),
        (type) => type.name,
        sortNamedType
      );
      return new _schema.GraphQLSchema({
        ...schemaConfig,
        types: Object.values(typeMap),
        directives: sortByName(schemaConfig.directives).map(sortDirective),
        query: replaceMaybeType(schemaConfig.query),
        mutation: replaceMaybeType(schemaConfig.mutation),
        subscription: replaceMaybeType(schemaConfig.subscription)
      });
      function replaceType(type) {
        if ((0, _definition.isListType)(type)) {
          return new _definition.GraphQLList(replaceType(type.ofType));
        } else if ((0, _definition.isNonNullType)(type)) {
          return new _definition.GraphQLNonNull(replaceType(type.ofType));
        }
        return replaceNamedType(type);
      }
      function replaceNamedType(type) {
        return typeMap[type.name];
      }
      function replaceMaybeType(maybeType) {
        return maybeType && replaceNamedType(maybeType);
      }
      function sortDirective(directive) {
        const config = directive.toConfig();
        return new _directives.GraphQLDirective({
          ...config,
          locations: sortBy(config.locations, (x) => x),
          args: sortArgs(config.args)
        });
      }
      function sortArgs(args) {
        return sortObjMap(args, (arg) => ({ ...arg, type: replaceType(arg.type) }));
      }
      function sortFields(fieldsMap) {
        return sortObjMap(fieldsMap, (field) => ({
          ...field,
          type: replaceType(field.type),
          args: field.args && sortArgs(field.args)
        }));
      }
      function sortInputFields(fieldsMap) {
        return sortObjMap(fieldsMap, (field) => ({
          ...field,
          type: replaceType(field.type)
        }));
      }
      function sortTypes(array) {
        return sortByName(array).map(replaceNamedType);
      }
      function sortNamedType(type) {
        if ((0, _definition.isScalarType)(type) || (0, _introspection.isIntrospectionType)(type)) {
          return type;
        }
        if ((0, _definition.isObjectType)(type)) {
          const config = type.toConfig();
          return new _definition.GraphQLObjectType({
            ...config,
            interfaces: () => sortTypes(config.interfaces),
            fields: () => sortFields(config.fields)
          });
        }
        if ((0, _definition.isInterfaceType)(type)) {
          const config = type.toConfig();
          return new _definition.GraphQLInterfaceType({
            ...config,
            interfaces: () => sortTypes(config.interfaces),
            fields: () => sortFields(config.fields)
          });
        }
        if ((0, _definition.isUnionType)(type)) {
          const config = type.toConfig();
          return new _definition.GraphQLUnionType({
            ...config,
            types: () => sortTypes(config.types)
          });
        }
        if ((0, _definition.isEnumType)(type)) {
          const config = type.toConfig();
          return new _definition.GraphQLEnumType({
            ...config,
            values: sortObjMap(config.values, (value) => value)
          });
        }
        if ((0, _definition.isInputObjectType)(type)) {
          const config = type.toConfig();
          return new _definition.GraphQLInputObjectType({
            ...config,
            fields: () => sortInputFields(config.fields)
          });
        }
        (0, _invariant.invariant)(
          false,
          "Unexpected type: " + (0, _inspect2.inspect)(type)
        );
      }
    }
    function sortObjMap(map, sortValueFn) {
      const sortedMap = /* @__PURE__ */ Object.create(null);
      for (const key of Object.keys(map).sort(_naturalCompare.naturalCompare)) {
        sortedMap[key] = sortValueFn(map[key]);
      }
      return sortedMap;
    }
    function sortByName(array) {
      return sortBy(array, (obj) => obj.name);
    }
    function sortBy(array, mapToKey) {
      return array.slice().sort((obj1, obj2) => {
        const key1 = mapToKey(obj1);
        const key2 = mapToKey(obj2);
        return (0, _naturalCompare.naturalCompare)(key1, key2);
      });
    }
  }
});

// node_modules/graphql/utilities/printSchema.js
var require_printSchema = __commonJS({
  "node_modules/graphql/utilities/printSchema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.printIntrospectionSchema = printIntrospectionSchema;
    exports2.printSchema = printSchema;
    exports2.printType = printType;
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _blockString = require_blockString();
    var _kinds = require_kinds();
    var _printer = require_printer();
    var _definition = require_definition();
    var _directives = require_directives();
    var _introspection = require_introspection();
    var _scalars = require_scalars();
    var _astFromValue = require_astFromValue();
    function printSchema(schema) {
      return printFilteredSchema(
        schema,
        (n) => !(0, _directives.isSpecifiedDirective)(n),
        isDefinedType
      );
    }
    function printIntrospectionSchema(schema) {
      return printFilteredSchema(
        schema,
        _directives.isSpecifiedDirective,
        _introspection.isIntrospectionType
      );
    }
    function isDefinedType(type) {
      return !(0, _scalars.isSpecifiedScalarType)(type) && !(0, _introspection.isIntrospectionType)(type);
    }
    function printFilteredSchema(schema, directiveFilter, typeFilter) {
      const directives = schema.getDirectives().filter(directiveFilter);
      const types = Object.values(schema.getTypeMap()).filter(typeFilter);
      return [
        printSchemaDefinition(schema),
        ...directives.map((directive) => printDirective(directive)),
        ...types.map((type) => printType(type))
      ].filter(Boolean).join("\n\n");
    }
    function printSchemaDefinition(schema) {
      if (schema.description == null && isSchemaOfCommonNames(schema)) {
        return;
      }
      const operationTypes = [];
      const queryType = schema.getQueryType();
      if (queryType) {
        operationTypes.push(`  query: ${queryType.name}`);
      }
      const mutationType = schema.getMutationType();
      if (mutationType) {
        operationTypes.push(`  mutation: ${mutationType.name}`);
      }
      const subscriptionType = schema.getSubscriptionType();
      if (subscriptionType) {
        operationTypes.push(`  subscription: ${subscriptionType.name}`);
      }
      return printDescription(schema) + `schema {
${operationTypes.join("\n")}
}`;
    }
    function isSchemaOfCommonNames(schema) {
      const queryType = schema.getQueryType();
      if (queryType && queryType.name !== "Query") {
        return false;
      }
      const mutationType = schema.getMutationType();
      if (mutationType && mutationType.name !== "Mutation") {
        return false;
      }
      const subscriptionType = schema.getSubscriptionType();
      if (subscriptionType && subscriptionType.name !== "Subscription") {
        return false;
      }
      return true;
    }
    function printType(type) {
      if ((0, _definition.isScalarType)(type)) {
        return printScalar(type);
      }
      if ((0, _definition.isObjectType)(type)) {
        return printObject(type);
      }
      if ((0, _definition.isInterfaceType)(type)) {
        return printInterface(type);
      }
      if ((0, _definition.isUnionType)(type)) {
        return printUnion(type);
      }
      if ((0, _definition.isEnumType)(type)) {
        return printEnum(type);
      }
      if ((0, _definition.isInputObjectType)(type)) {
        return printInputObject(type);
      }
      (0, _invariant.invariant)(
        false,
        "Unexpected type: " + (0, _inspect2.inspect)(type)
      );
    }
    function printScalar(type) {
      return printDescription(type) + `scalar ${type.name}` + printSpecifiedByURL(type);
    }
    function printImplementedInterfaces(type) {
      const interfaces = type.getInterfaces();
      return interfaces.length ? " implements " + interfaces.map((i) => i.name).join(" & ") : "";
    }
    function printObject(type) {
      return printDescription(type) + `type ${type.name}` + printImplementedInterfaces(type) + printFields(type);
    }
    function printInterface(type) {
      return printDescription(type) + `interface ${type.name}` + printImplementedInterfaces(type) + printFields(type);
    }
    function printUnion(type) {
      const types = type.getTypes();
      const possibleTypes = types.length ? " = " + types.join(" | ") : "";
      return printDescription(type) + "union " + type.name + possibleTypes;
    }
    function printEnum(type) {
      const values = type.getValues().map(
        (value, i) => printDescription(value, "  ", !i) + "  " + value.name + printDeprecated(value.deprecationReason)
      );
      return printDescription(type) + `enum ${type.name}` + printBlock(values);
    }
    function printInputObject(type) {
      const fields = Object.values(type.getFields()).map(
        (f, i) => printDescription(f, "  ", !i) + "  " + printInputValue(f)
      );
      return printDescription(type) + `input ${type.name}` + (type.isOneOf ? " @oneOf" : "") + printBlock(fields);
    }
    function printFields(type) {
      const fields = Object.values(type.getFields()).map(
        (f, i) => printDescription(f, "  ", !i) + "  " + f.name + printArgs(f.args, "  ") + ": " + String(f.type) + printDeprecated(f.deprecationReason)
      );
      return printBlock(fields);
    }
    function printBlock(items) {
      return items.length !== 0 ? " {\n" + items.join("\n") + "\n}" : "";
    }
    function printArgs(args, indentation = "") {
      if (args.length === 0) {
        return "";
      }
      if (args.every((arg) => !arg.description)) {
        return "(" + args.map(printInputValue).join(", ") + ")";
      }
      return "(\n" + args.map(
        (arg, i) => printDescription(arg, "  " + indentation, !i) + "  " + indentation + printInputValue(arg)
      ).join("\n") + "\n" + indentation + ")";
    }
    function printInputValue(arg) {
      const defaultAST = (0, _astFromValue.astFromValue)(
        arg.defaultValue,
        arg.type
      );
      let argDecl = arg.name + ": " + String(arg.type);
      if (defaultAST) {
        argDecl += ` = ${(0, _printer.print)(defaultAST)}`;
      }
      return argDecl + printDeprecated(arg.deprecationReason);
    }
    function printDirective(directive) {
      return printDescription(directive) + "directive @" + directive.name + printArgs(directive.args) + printDeprecated(directive.deprecationReason) + (directive.isRepeatable ? " repeatable" : "") + " on " + directive.locations.join(" | ");
    }
    function printDeprecated(reason) {
      if (reason == null) {
        return "";
      }
      if (reason !== _directives.DEFAULT_DEPRECATION_REASON) {
        const astValue = (0, _printer.print)({
          kind: _kinds.Kind.STRING,
          value: reason
        });
        return ` @deprecated(reason: ${astValue})`;
      }
      return " @deprecated";
    }
    function printSpecifiedByURL(scalar) {
      if (scalar.specifiedByURL == null) {
        return "";
      }
      const astValue = (0, _printer.print)({
        kind: _kinds.Kind.STRING,
        value: scalar.specifiedByURL
      });
      return ` @specifiedBy(url: ${astValue})`;
    }
    function printDescription(def, indentation = "", firstInBlock = true) {
      const { description } = def;
      if (description == null) {
        return "";
      }
      const blockString = (0, _printer.print)({
        kind: _kinds.Kind.STRING,
        value: description,
        block: (0, _blockString.isPrintableAsBlockString)(description)
      });
      const prefix = indentation && !firstInBlock ? "\n" + indentation : indentation;
      return prefix + blockString.replace(/\n/g, "\n" + indentation) + "\n";
    }
  }
});

// node_modules/graphql/utilities/concatAST.js
var require_concatAST = __commonJS({
  "node_modules/graphql/utilities/concatAST.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.concatAST = concatAST;
    var _kinds = require_kinds();
    function concatAST(documents) {
      const definitions = [];
      for (const doc of documents) {
        definitions.push(...doc.definitions);
      }
      return {
        kind: _kinds.Kind.DOCUMENT,
        definitions
      };
    }
  }
});

// node_modules/graphql/utilities/separateOperations.js
var require_separateOperations = __commonJS({
  "node_modules/graphql/utilities/separateOperations.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.separateOperations = separateOperations;
    var _kinds = require_kinds();
    var _visitor = require_visitor();
    function separateOperations(documentAST) {
      const operations = [];
      const depGraph = /* @__PURE__ */ Object.create(null);
      for (const definitionNode of documentAST.definitions) {
        switch (definitionNode.kind) {
          case _kinds.Kind.OPERATION_DEFINITION:
            operations.push(definitionNode);
            break;
          case _kinds.Kind.FRAGMENT_DEFINITION:
            depGraph[definitionNode.name.value] = collectDependencies(
              definitionNode.selectionSet
            );
            break;
          default:
        }
      }
      const separatedDocumentASTs = /* @__PURE__ */ Object.create(null);
      for (const operation of operations) {
        const dependencies = /* @__PURE__ */ new Set();
        for (const fragmentName of collectDependencies(operation.selectionSet)) {
          collectTransitiveDependencies(dependencies, depGraph, fragmentName);
        }
        const operationName = operation.name ? operation.name.value : "";
        separatedDocumentASTs[operationName] = {
          kind: _kinds.Kind.DOCUMENT,
          definitions: documentAST.definitions.filter(
            (node) => node === operation || node.kind === _kinds.Kind.FRAGMENT_DEFINITION && dependencies.has(node.name.value)
          )
        };
      }
      return separatedDocumentASTs;
    }
    function collectTransitiveDependencies(collected, depGraph, fromName) {
      if (!collected.has(fromName)) {
        collected.add(fromName);
        const immediateDeps = depGraph[fromName];
        if (immediateDeps !== void 0) {
          for (const toName of immediateDeps) {
            collectTransitiveDependencies(collected, depGraph, toName);
          }
        }
      }
    }
    function collectDependencies(selectionSet) {
      const dependencies = [];
      (0, _visitor.visit)(selectionSet, {
        FragmentSpread(node) {
          dependencies.push(node.name.value);
        }
      });
      return dependencies;
    }
  }
});

// node_modules/graphql/utilities/stripIgnoredCharacters.js
var require_stripIgnoredCharacters = __commonJS({
  "node_modules/graphql/utilities/stripIgnoredCharacters.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.stripIgnoredCharacters = stripIgnoredCharacters;
    var _blockString = require_blockString();
    var _lexer = require_lexer();
    var _source = require_source();
    var _tokenKind = require_tokenKind();
    function stripIgnoredCharacters(source) {
      const sourceObj = (0, _source.isSource)(source) ? source : new _source.Source(source);
      const body = sourceObj.body;
      const lexer = new _lexer.Lexer(sourceObj);
      let strippedBody = "";
      let wasLastAddedTokenNonPunctuator = false;
      while (lexer.advance().kind !== _tokenKind.TokenKind.EOF) {
        const currentToken = lexer.token;
        const tokenKind = currentToken.kind;
        const isNonPunctuator = !(0, _lexer.isPunctuatorTokenKind)(
          currentToken.kind
        );
        if (wasLastAddedTokenNonPunctuator) {
          if (isNonPunctuator || currentToken.kind === _tokenKind.TokenKind.SPREAD) {
            strippedBody += " ";
          }
        }
        const tokenBody = body.slice(currentToken.start, currentToken.end);
        if (tokenKind === _tokenKind.TokenKind.BLOCK_STRING) {
          strippedBody += (0, _blockString.printBlockString)(currentToken.value, {
            minimize: true
          });
        } else {
          strippedBody += tokenBody;
        }
        wasLastAddedTokenNonPunctuator = isNonPunctuator;
      }
      return strippedBody;
    }
  }
});

// node_modules/graphql/utilities/assertValidName.js
var require_assertValidName = __commonJS({
  "node_modules/graphql/utilities/assertValidName.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.assertValidName = assertValidName;
    exports2.isValidNameError = isValidNameError;
    var _devAssert = require_devAssert();
    var _GraphQLError = require_GraphQLError();
    var _assertName = require_assertName();
    function assertValidName(name) {
      const error = isValidNameError(name);
      if (error) {
        throw error;
      }
      return name;
    }
    function isValidNameError(name) {
      typeof name === "string" || (0, _devAssert.devAssert)(false, "Expected name to be a string.");
      if (name.startsWith("__")) {
        return new _GraphQLError.GraphQLError(
          `Name "${name}" must not begin with "__", which is reserved by GraphQL introspection.`
        );
      }
      try {
        (0, _assertName.assertName)(name);
      } catch (error) {
        return error;
      }
    }
  }
});

// node_modules/graphql/utilities/findBreakingChanges.js
var require_findBreakingChanges = __commonJS({
  "node_modules/graphql/utilities/findBreakingChanges.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.DangerousChangeType = exports2.BreakingChangeType = void 0;
    exports2.findBreakingChanges = findBreakingChanges;
    exports2.findDangerousChanges = findDangerousChanges;
    var _inspect2 = require_inspect();
    var _invariant = require_invariant();
    var _keyMap = require_keyMap();
    var _printer = require_printer();
    var _definition = require_definition();
    var _scalars = require_scalars();
    var _astFromValue = require_astFromValue();
    var _sortValueNode = require_sortValueNode();
    var BreakingChangeType;
    exports2.BreakingChangeType = BreakingChangeType;
    (function(BreakingChangeType2) {
      BreakingChangeType2["TYPE_REMOVED"] = "TYPE_REMOVED";
      BreakingChangeType2["TYPE_CHANGED_KIND"] = "TYPE_CHANGED_KIND";
      BreakingChangeType2["TYPE_REMOVED_FROM_UNION"] = "TYPE_REMOVED_FROM_UNION";
      BreakingChangeType2["VALUE_REMOVED_FROM_ENUM"] = "VALUE_REMOVED_FROM_ENUM";
      BreakingChangeType2["REQUIRED_INPUT_FIELD_ADDED"] = "REQUIRED_INPUT_FIELD_ADDED";
      BreakingChangeType2["IMPLEMENTED_INTERFACE_REMOVED"] = "IMPLEMENTED_INTERFACE_REMOVED";
      BreakingChangeType2["FIELD_REMOVED"] = "FIELD_REMOVED";
      BreakingChangeType2["FIELD_CHANGED_KIND"] = "FIELD_CHANGED_KIND";
      BreakingChangeType2["REQUIRED_ARG_ADDED"] = "REQUIRED_ARG_ADDED";
      BreakingChangeType2["ARG_REMOVED"] = "ARG_REMOVED";
      BreakingChangeType2["ARG_CHANGED_KIND"] = "ARG_CHANGED_KIND";
      BreakingChangeType2["DIRECTIVE_REMOVED"] = "DIRECTIVE_REMOVED";
      BreakingChangeType2["DIRECTIVE_ARG_REMOVED"] = "DIRECTIVE_ARG_REMOVED";
      BreakingChangeType2["REQUIRED_DIRECTIVE_ARG_ADDED"] = "REQUIRED_DIRECTIVE_ARG_ADDED";
      BreakingChangeType2["DIRECTIVE_REPEATABLE_REMOVED"] = "DIRECTIVE_REPEATABLE_REMOVED";
      BreakingChangeType2["DIRECTIVE_LOCATION_REMOVED"] = "DIRECTIVE_LOCATION_REMOVED";
    })(
      BreakingChangeType || (exports2.BreakingChangeType = BreakingChangeType = {})
    );
    var DangerousChangeType;
    exports2.DangerousChangeType = DangerousChangeType;
    (function(DangerousChangeType2) {
      DangerousChangeType2["VALUE_ADDED_TO_ENUM"] = "VALUE_ADDED_TO_ENUM";
      DangerousChangeType2["TYPE_ADDED_TO_UNION"] = "TYPE_ADDED_TO_UNION";
      DangerousChangeType2["OPTIONAL_INPUT_FIELD_ADDED"] = "OPTIONAL_INPUT_FIELD_ADDED";
      DangerousChangeType2["OPTIONAL_ARG_ADDED"] = "OPTIONAL_ARG_ADDED";
      DangerousChangeType2["IMPLEMENTED_INTERFACE_ADDED"] = "IMPLEMENTED_INTERFACE_ADDED";
      DangerousChangeType2["ARG_DEFAULT_VALUE_CHANGE"] = "ARG_DEFAULT_VALUE_CHANGE";
    })(
      DangerousChangeType || (exports2.DangerousChangeType = DangerousChangeType = {})
    );
    function findBreakingChanges(oldSchema, newSchema) {
      return findSchemaChanges(oldSchema, newSchema).filter(
        (change) => change.type in BreakingChangeType
      );
    }
    function findDangerousChanges(oldSchema, newSchema) {
      return findSchemaChanges(oldSchema, newSchema).filter(
        (change) => change.type in DangerousChangeType
      );
    }
    function findSchemaChanges(oldSchema, newSchema) {
      return [
        ...findTypeChanges(oldSchema, newSchema),
        ...findDirectiveChanges(oldSchema, newSchema)
      ];
    }
    function findDirectiveChanges(oldSchema, newSchema) {
      const schemaChanges = [];
      const directivesDiff = diff(
        oldSchema.getDirectives(),
        newSchema.getDirectives()
      );
      for (const oldDirective of directivesDiff.removed) {
        schemaChanges.push({
          type: BreakingChangeType.DIRECTIVE_REMOVED,
          description: `${oldDirective.name} was removed.`
        });
      }
      for (const [oldDirective, newDirective] of directivesDiff.persisted) {
        const argsDiff = diff(oldDirective.args, newDirective.args);
        for (const newArg of argsDiff.added) {
          if ((0, _definition.isRequiredArgument)(newArg)) {
            schemaChanges.push({
              type: BreakingChangeType.REQUIRED_DIRECTIVE_ARG_ADDED,
              description: `A required arg ${newArg.name} on directive ${oldDirective.name} was added.`
            });
          }
        }
        for (const oldArg of argsDiff.removed) {
          schemaChanges.push({
            type: BreakingChangeType.DIRECTIVE_ARG_REMOVED,
            description: `${oldArg.name} was removed from ${oldDirective.name}.`
          });
        }
        if (oldDirective.isRepeatable && !newDirective.isRepeatable) {
          schemaChanges.push({
            type: BreakingChangeType.DIRECTIVE_REPEATABLE_REMOVED,
            description: `Repeatable flag was removed from ${oldDirective.name}.`
          });
        }
        for (const location of oldDirective.locations) {
          if (!newDirective.locations.includes(location)) {
            schemaChanges.push({
              type: BreakingChangeType.DIRECTIVE_LOCATION_REMOVED,
              description: `${location} was removed from ${oldDirective.name}.`
            });
          }
        }
      }
      return schemaChanges;
    }
    function findTypeChanges(oldSchema, newSchema) {
      const schemaChanges = [];
      const typesDiff = diff(
        Object.values(oldSchema.getTypeMap()),
        Object.values(newSchema.getTypeMap())
      );
      for (const oldType of typesDiff.removed) {
        schemaChanges.push({
          type: BreakingChangeType.TYPE_REMOVED,
          description: (0, _scalars.isSpecifiedScalarType)(oldType) ? `Standard scalar ${oldType.name} was removed because it is not referenced anymore.` : `${oldType.name} was removed.`
        });
      }
      for (const [oldType, newType] of typesDiff.persisted) {
        if ((0, _definition.isEnumType)(oldType) && (0, _definition.isEnumType)(newType)) {
          schemaChanges.push(...findEnumTypeChanges(oldType, newType));
        } else if ((0, _definition.isUnionType)(oldType) && (0, _definition.isUnionType)(newType)) {
          schemaChanges.push(...findUnionTypeChanges(oldType, newType));
        } else if ((0, _definition.isInputObjectType)(oldType) && (0, _definition.isInputObjectType)(newType)) {
          schemaChanges.push(...findInputObjectTypeChanges(oldType, newType));
        } else if ((0, _definition.isObjectType)(oldType) && (0, _definition.isObjectType)(newType)) {
          schemaChanges.push(
            ...findFieldChanges(oldType, newType),
            ...findImplementedInterfacesChanges(oldType, newType)
          );
        } else if ((0, _definition.isInterfaceType)(oldType) && (0, _definition.isInterfaceType)(newType)) {
          schemaChanges.push(
            ...findFieldChanges(oldType, newType),
            ...findImplementedInterfacesChanges(oldType, newType)
          );
        } else if (oldType.constructor !== newType.constructor) {
          schemaChanges.push({
            type: BreakingChangeType.TYPE_CHANGED_KIND,
            description: `${oldType.name} changed from ${typeKindName(oldType)} to ${typeKindName(newType)}.`
          });
        }
      }
      return schemaChanges;
    }
    function findInputObjectTypeChanges(oldType, newType) {
      const schemaChanges = [];
      const fieldsDiff = diff(
        Object.values(oldType.getFields()),
        Object.values(newType.getFields())
      );
      for (const newField of fieldsDiff.added) {
        if ((0, _definition.isRequiredInputField)(newField)) {
          schemaChanges.push({
            type: BreakingChangeType.REQUIRED_INPUT_FIELD_ADDED,
            description: `A required field ${newField.name} on input type ${oldType.name} was added.`
          });
        } else {
          schemaChanges.push({
            type: DangerousChangeType.OPTIONAL_INPUT_FIELD_ADDED,
            description: `An optional field ${newField.name} on input type ${oldType.name} was added.`
          });
        }
      }
      for (const oldField of fieldsDiff.removed) {
        schemaChanges.push({
          type: BreakingChangeType.FIELD_REMOVED,
          description: `${oldType.name}.${oldField.name} was removed.`
        });
      }
      for (const [oldField, newField] of fieldsDiff.persisted) {
        const isSafe = isChangeSafeForInputObjectFieldOrFieldArg(
          oldField.type,
          newField.type
        );
        if (!isSafe) {
          schemaChanges.push({
            type: BreakingChangeType.FIELD_CHANGED_KIND,
            description: `${oldType.name}.${oldField.name} changed type from ${String(oldField.type)} to ${String(newField.type)}.`
          });
        }
      }
      return schemaChanges;
    }
    function findUnionTypeChanges(oldType, newType) {
      const schemaChanges = [];
      const possibleTypesDiff = diff(oldType.getTypes(), newType.getTypes());
      for (const newPossibleType of possibleTypesDiff.added) {
        schemaChanges.push({
          type: DangerousChangeType.TYPE_ADDED_TO_UNION,
          description: `${newPossibleType.name} was added to union type ${oldType.name}.`
        });
      }
      for (const oldPossibleType of possibleTypesDiff.removed) {
        schemaChanges.push({
          type: BreakingChangeType.TYPE_REMOVED_FROM_UNION,
          description: `${oldPossibleType.name} was removed from union type ${oldType.name}.`
        });
      }
      return schemaChanges;
    }
    function findEnumTypeChanges(oldType, newType) {
      const schemaChanges = [];
      const valuesDiff = diff(oldType.getValues(), newType.getValues());
      for (const newValue of valuesDiff.added) {
        schemaChanges.push({
          type: DangerousChangeType.VALUE_ADDED_TO_ENUM,
          description: `${newValue.name} was added to enum type ${oldType.name}.`
        });
      }
      for (const oldValue of valuesDiff.removed) {
        schemaChanges.push({
          type: BreakingChangeType.VALUE_REMOVED_FROM_ENUM,
          description: `${oldValue.name} was removed from enum type ${oldType.name}.`
        });
      }
      return schemaChanges;
    }
    function findImplementedInterfacesChanges(oldType, newType) {
      const schemaChanges = [];
      const interfacesDiff = diff(oldType.getInterfaces(), newType.getInterfaces());
      for (const newInterface of interfacesDiff.added) {
        schemaChanges.push({
          type: DangerousChangeType.IMPLEMENTED_INTERFACE_ADDED,
          description: `${newInterface.name} added to interfaces implemented by ${oldType.name}.`
        });
      }
      for (const oldInterface of interfacesDiff.removed) {
        schemaChanges.push({
          type: BreakingChangeType.IMPLEMENTED_INTERFACE_REMOVED,
          description: `${oldType.name} no longer implements interface ${oldInterface.name}.`
        });
      }
      return schemaChanges;
    }
    function findFieldChanges(oldType, newType) {
      const schemaChanges = [];
      const fieldsDiff = diff(
        Object.values(oldType.getFields()),
        Object.values(newType.getFields())
      );
      for (const oldField of fieldsDiff.removed) {
        schemaChanges.push({
          type: BreakingChangeType.FIELD_REMOVED,
          description: `${oldType.name}.${oldField.name} was removed.`
        });
      }
      for (const [oldField, newField] of fieldsDiff.persisted) {
        schemaChanges.push(...findArgChanges(oldType, oldField, newField));
        const isSafe = isChangeSafeForObjectOrInterfaceField(
          oldField.type,
          newField.type
        );
        if (!isSafe) {
          schemaChanges.push({
            type: BreakingChangeType.FIELD_CHANGED_KIND,
            description: `${oldType.name}.${oldField.name} changed type from ${String(oldField.type)} to ${String(newField.type)}.`
          });
        }
      }
      return schemaChanges;
    }
    function findArgChanges(oldType, oldField, newField) {
      const schemaChanges = [];
      const argsDiff = diff(oldField.args, newField.args);
      for (const oldArg of argsDiff.removed) {
        schemaChanges.push({
          type: BreakingChangeType.ARG_REMOVED,
          description: `${oldType.name}.${oldField.name} arg ${oldArg.name} was removed.`
        });
      }
      for (const [oldArg, newArg] of argsDiff.persisted) {
        const isSafe = isChangeSafeForInputObjectFieldOrFieldArg(
          oldArg.type,
          newArg.type
        );
        if (!isSafe) {
          schemaChanges.push({
            type: BreakingChangeType.ARG_CHANGED_KIND,
            description: `${oldType.name}.${oldField.name} arg ${oldArg.name} has changed type from ${String(oldArg.type)} to ${String(newArg.type)}.`
          });
        } else if (oldArg.defaultValue !== void 0) {
          if (newArg.defaultValue === void 0) {
            schemaChanges.push({
              type: DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
              description: `${oldType.name}.${oldField.name} arg ${oldArg.name} defaultValue was removed.`
            });
          } else {
            const oldValueStr = stringifyValue(oldArg.defaultValue, oldArg.type);
            const newValueStr = stringifyValue(newArg.defaultValue, newArg.type);
            if (oldValueStr !== newValueStr) {
              schemaChanges.push({
                type: DangerousChangeType.ARG_DEFAULT_VALUE_CHANGE,
                description: `${oldType.name}.${oldField.name} arg ${oldArg.name} has changed defaultValue from ${oldValueStr} to ${newValueStr}.`
              });
            }
          }
        }
      }
      for (const newArg of argsDiff.added) {
        if ((0, _definition.isRequiredArgument)(newArg)) {
          schemaChanges.push({
            type: BreakingChangeType.REQUIRED_ARG_ADDED,
            description: `A required arg ${newArg.name} on ${oldType.name}.${oldField.name} was added.`
          });
        } else {
          schemaChanges.push({
            type: DangerousChangeType.OPTIONAL_ARG_ADDED,
            description: `An optional arg ${newArg.name} on ${oldType.name}.${oldField.name} was added.`
          });
        }
      }
      return schemaChanges;
    }
    function isChangeSafeForObjectOrInterfaceField(oldType, newType) {
      if ((0, _definition.isListType)(oldType)) {
        return (
          // if they're both lists, make sure the underlying types are compatible
          (0, _definition.isListType)(newType) && isChangeSafeForObjectOrInterfaceField(
            oldType.ofType,
            newType.ofType
          ) || // moving from nullable to non-null of the same underlying type is safe
          (0, _definition.isNonNullType)(newType) && isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType)
        );
      }
      if ((0, _definition.isNonNullType)(oldType)) {
        return (0, _definition.isNonNullType)(newType) && isChangeSafeForObjectOrInterfaceField(oldType.ofType, newType.ofType);
      }
      return (
        // if they're both named types, see if their names are equivalent
        (0, _definition.isNamedType)(newType) && oldType.name === newType.name || // moving from nullable to non-null of the same underlying type is safe
        (0, _definition.isNonNullType)(newType) && isChangeSafeForObjectOrInterfaceField(oldType, newType.ofType)
      );
    }
    function isChangeSafeForInputObjectFieldOrFieldArg(oldType, newType) {
      if ((0, _definition.isListType)(oldType)) {
        return (0, _definition.isListType)(newType) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType.ofType);
      }
      if ((0, _definition.isNonNullType)(oldType)) {
        return (
          // if they're both non-null, make sure the underlying types are
          // compatible
          (0, _definition.isNonNullType)(newType) && isChangeSafeForInputObjectFieldOrFieldArg(
            oldType.ofType,
            newType.ofType
          ) || // moving from non-null to nullable of the same underlying type is safe
          !(0, _definition.isNonNullType)(newType) && isChangeSafeForInputObjectFieldOrFieldArg(oldType.ofType, newType)
        );
      }
      return (0, _definition.isNamedType)(newType) && oldType.name === newType.name;
    }
    function typeKindName(type) {
      if ((0, _definition.isScalarType)(type)) {
        return "a Scalar type";
      }
      if ((0, _definition.isObjectType)(type)) {
        return "an Object type";
      }
      if ((0, _definition.isInterfaceType)(type)) {
        return "an Interface type";
      }
      if ((0, _definition.isUnionType)(type)) {
        return "a Union type";
      }
      if ((0, _definition.isEnumType)(type)) {
        return "an Enum type";
      }
      if ((0, _definition.isInputObjectType)(type)) {
        return "an Input type";
      }
      (0, _invariant.invariant)(
        false,
        "Unexpected type: " + (0, _inspect2.inspect)(type)
      );
    }
    function stringifyValue(value, type) {
      const ast = (0, _astFromValue.astFromValue)(value, type);
      ast != null || (0, _invariant.invariant)(false);
      return (0, _printer.print)((0, _sortValueNode.sortValueNode)(ast));
    }
    function diff(oldArray, newArray) {
      const added = [];
      const removed = [];
      const persisted = [];
      const oldMap = (0, _keyMap.keyMap)(oldArray, ({ name }) => name);
      const newMap = (0, _keyMap.keyMap)(newArray, ({ name }) => name);
      for (const oldItem of oldArray) {
        const newItem = newMap[oldItem.name];
        if (newItem === void 0) {
          removed.push(oldItem);
        } else {
          persisted.push([oldItem, newItem]);
        }
      }
      for (const newItem of newArray) {
        if (oldMap[newItem.name] === void 0) {
          added.push(newItem);
        }
      }
      return {
        added,
        persisted,
        removed
      };
    }
  }
});

// node_modules/graphql/utilities/resolveSchemaCoordinate.js
var require_resolveSchemaCoordinate = __commonJS({
  "node_modules/graphql/utilities/resolveSchemaCoordinate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.resolveASTSchemaCoordinate = resolveASTSchemaCoordinate;
    exports2.resolveSchemaCoordinate = resolveSchemaCoordinate;
    var _inspect2 = require_inspect();
    var _kinds = require_kinds();
    var _parser = require_parser2();
    var _definition = require_definition();
    function resolveSchemaCoordinate(schema, schemaCoordinate) {
      return resolveASTSchemaCoordinate(
        schema,
        (0, _parser.parseSchemaCoordinate)(schemaCoordinate)
      );
    }
    function resolveTypeCoordinate(schema, schemaCoordinate) {
      const typeName = schemaCoordinate.name.value;
      const type = schema.getType(typeName);
      if (type == null) {
        return;
      }
      return {
        kind: "NamedType",
        type
      };
    }
    function resolveMemberCoordinate(schema, schemaCoordinate) {
      const typeName = schemaCoordinate.name.value;
      const type = schema.getType(typeName);
      if (!type) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(
            typeName
          )} to be defined as a type in the schema.`
        );
      }
      if (!(0, _definition.isEnumType)(type) && !(0, _definition.isInputObjectType)(type) && !(0, _definition.isObjectType)(type) && !(0, _definition.isInterfaceType)(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(
            typeName
          )} to be an Enum, Input Object, Object or Interface type.`
        );
      }
      if ((0, _definition.isEnumType)(type)) {
        const enumValueName = schemaCoordinate.memberName.value;
        const enumValue = type.getValue(enumValueName);
        if (enumValue == null) {
          return;
        }
        return {
          kind: "EnumValue",
          type,
          enumValue
        };
      }
      if ((0, _definition.isInputObjectType)(type)) {
        const inputFieldName = schemaCoordinate.memberName.value;
        const inputField = type.getFields()[inputFieldName];
        if (inputField == null) {
          return;
        }
        return {
          kind: "InputField",
          type,
          inputField
        };
      }
      const fieldName = schemaCoordinate.memberName.value;
      const field = type.getFields()[fieldName];
      if (field == null) {
        return;
      }
      return {
        kind: "Field",
        type,
        field
      };
    }
    function resolveArgumentCoordinate(schema, schemaCoordinate) {
      const typeName = schemaCoordinate.name.value;
      const type = schema.getType(typeName);
      if (type == null) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(
            typeName
          )} to be defined as a type in the schema.`
        );
      }
      if (!(0, _definition.isObjectType)(type) && !(0, _definition.isInterfaceType)(type)) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(
            typeName
          )} to be an object type or interface type.`
        );
      }
      const fieldName = schemaCoordinate.fieldName.value;
      const field = type.getFields()[fieldName];
      if (field == null) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(
            fieldName
          )} to exist as a field of type ${(0, _inspect2.inspect)(
            typeName
          )} in the schema.`
        );
      }
      const fieldArgumentName = schemaCoordinate.argumentName.value;
      const fieldArgument = field.args.find(
        (arg) => arg.name === fieldArgumentName
      );
      if (fieldArgument == null) {
        return;
      }
      return {
        kind: "FieldArgument",
        type,
        field,
        fieldArgument
      };
    }
    function resolveDirectiveCoordinate(schema, schemaCoordinate) {
      const directiveName = schemaCoordinate.name.value;
      const directive = schema.getDirective(directiveName);
      if (!directive) {
        return;
      }
      return {
        kind: "Directive",
        directive
      };
    }
    function resolveDirectiveArgumentCoordinate(schema, schemaCoordinate) {
      const directiveName = schemaCoordinate.name.value;
      const directive = schema.getDirective(directiveName);
      if (!directive) {
        throw new Error(
          `Expected ${(0, _inspect2.inspect)(
            directiveName
          )} to be defined as a directive in the schema.`
        );
      }
      const {
        argumentName: { value: directiveArgumentName }
      } = schemaCoordinate;
      const directiveArgument = directive.args.find(
        (arg) => arg.name === directiveArgumentName
      );
      if (!directiveArgument) {
        return;
      }
      return {
        kind: "DirectiveArgument",
        directive,
        directiveArgument
      };
    }
    function resolveASTSchemaCoordinate(schema, schemaCoordinate) {
      switch (schemaCoordinate.kind) {
        case _kinds.Kind.TYPE_COORDINATE:
          return resolveTypeCoordinate(schema, schemaCoordinate);
        case _kinds.Kind.MEMBER_COORDINATE:
          return resolveMemberCoordinate(schema, schemaCoordinate);
        case _kinds.Kind.ARGUMENT_COORDINATE:
          return resolveArgumentCoordinate(schema, schemaCoordinate);
        case _kinds.Kind.DIRECTIVE_COORDINATE:
          return resolveDirectiveCoordinate(schema, schemaCoordinate);
        case _kinds.Kind.DIRECTIVE_ARGUMENT_COORDINATE:
          return resolveDirectiveArgumentCoordinate(schema, schemaCoordinate);
      }
    }
  }
});

// node_modules/graphql/utilities/index.js
var require_utilities = __commonJS({
  "node_modules/graphql/utilities/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "BreakingChangeType", {
      enumerable: true,
      get: function() {
        return _findBreakingChanges.BreakingChangeType;
      }
    });
    Object.defineProperty(exports2, "DangerousChangeType", {
      enumerable: true,
      get: function() {
        return _findBreakingChanges.DangerousChangeType;
      }
    });
    Object.defineProperty(exports2, "TypeInfo", {
      enumerable: true,
      get: function() {
        return _TypeInfo.TypeInfo;
      }
    });
    Object.defineProperty(exports2, "assertValidName", {
      enumerable: true,
      get: function() {
        return _assertValidName.assertValidName;
      }
    });
    Object.defineProperty(exports2, "astFromValue", {
      enumerable: true,
      get: function() {
        return _astFromValue.astFromValue;
      }
    });
    Object.defineProperty(exports2, "buildASTSchema", {
      enumerable: true,
      get: function() {
        return _buildASTSchema.buildASTSchema;
      }
    });
    Object.defineProperty(exports2, "buildClientSchema", {
      enumerable: true,
      get: function() {
        return _buildClientSchema.buildClientSchema;
      }
    });
    Object.defineProperty(exports2, "buildSchema", {
      enumerable: true,
      get: function() {
        return _buildASTSchema.buildSchema;
      }
    });
    Object.defineProperty(exports2, "coerceInputValue", {
      enumerable: true,
      get: function() {
        return _coerceInputValue.coerceInputValue;
      }
    });
    Object.defineProperty(exports2, "concatAST", {
      enumerable: true,
      get: function() {
        return _concatAST.concatAST;
      }
    });
    Object.defineProperty(exports2, "doTypesOverlap", {
      enumerable: true,
      get: function() {
        return _typeComparators.doTypesOverlap;
      }
    });
    Object.defineProperty(exports2, "extendSchema", {
      enumerable: true,
      get: function() {
        return _extendSchema.extendSchema;
      }
    });
    Object.defineProperty(exports2, "findBreakingChanges", {
      enumerable: true,
      get: function() {
        return _findBreakingChanges.findBreakingChanges;
      }
    });
    Object.defineProperty(exports2, "findDangerousChanges", {
      enumerable: true,
      get: function() {
        return _findBreakingChanges.findDangerousChanges;
      }
    });
    Object.defineProperty(exports2, "getIntrospectionQuery", {
      enumerable: true,
      get: function() {
        return _getIntrospectionQuery.getIntrospectionQuery;
      }
    });
    Object.defineProperty(exports2, "getOperationAST", {
      enumerable: true,
      get: function() {
        return _getOperationAST.getOperationAST;
      }
    });
    Object.defineProperty(exports2, "getOperationRootType", {
      enumerable: true,
      get: function() {
        return _getOperationRootType.getOperationRootType;
      }
    });
    Object.defineProperty(exports2, "introspectionFromSchema", {
      enumerable: true,
      get: function() {
        return _introspectionFromSchema.introspectionFromSchema;
      }
    });
    Object.defineProperty(exports2, "isEqualType", {
      enumerable: true,
      get: function() {
        return _typeComparators.isEqualType;
      }
    });
    Object.defineProperty(exports2, "isTypeSubTypeOf", {
      enumerable: true,
      get: function() {
        return _typeComparators.isTypeSubTypeOf;
      }
    });
    Object.defineProperty(exports2, "isValidNameError", {
      enumerable: true,
      get: function() {
        return _assertValidName.isValidNameError;
      }
    });
    Object.defineProperty(exports2, "lexicographicSortSchema", {
      enumerable: true,
      get: function() {
        return _lexicographicSortSchema.lexicographicSortSchema;
      }
    });
    Object.defineProperty(exports2, "printIntrospectionSchema", {
      enumerable: true,
      get: function() {
        return _printSchema.printIntrospectionSchema;
      }
    });
    Object.defineProperty(exports2, "printSchema", {
      enumerable: true,
      get: function() {
        return _printSchema.printSchema;
      }
    });
    Object.defineProperty(exports2, "printType", {
      enumerable: true,
      get: function() {
        return _printSchema.printType;
      }
    });
    Object.defineProperty(exports2, "resolveASTSchemaCoordinate", {
      enumerable: true,
      get: function() {
        return _resolveSchemaCoordinate.resolveASTSchemaCoordinate;
      }
    });
    Object.defineProperty(exports2, "resolveSchemaCoordinate", {
      enumerable: true,
      get: function() {
        return _resolveSchemaCoordinate.resolveSchemaCoordinate;
      }
    });
    Object.defineProperty(exports2, "separateOperations", {
      enumerable: true,
      get: function() {
        return _separateOperations.separateOperations;
      }
    });
    Object.defineProperty(exports2, "stripIgnoredCharacters", {
      enumerable: true,
      get: function() {
        return _stripIgnoredCharacters.stripIgnoredCharacters;
      }
    });
    Object.defineProperty(exports2, "typeFromAST", {
      enumerable: true,
      get: function() {
        return _typeFromAST.typeFromAST;
      }
    });
    Object.defineProperty(exports2, "valueFromAST", {
      enumerable: true,
      get: function() {
        return _valueFromAST.valueFromAST;
      }
    });
    Object.defineProperty(exports2, "valueFromASTUntyped", {
      enumerable: true,
      get: function() {
        return _valueFromASTUntyped.valueFromASTUntyped;
      }
    });
    Object.defineProperty(exports2, "visitWithTypeInfo", {
      enumerable: true,
      get: function() {
        return _TypeInfo.visitWithTypeInfo;
      }
    });
    var _getIntrospectionQuery = require_getIntrospectionQuery();
    var _getOperationAST = require_getOperationAST();
    var _getOperationRootType = require_getOperationRootType();
    var _introspectionFromSchema = require_introspectionFromSchema();
    var _buildClientSchema = require_buildClientSchema();
    var _buildASTSchema = require_buildASTSchema();
    var _extendSchema = require_extendSchema();
    var _lexicographicSortSchema = require_lexicographicSortSchema();
    var _printSchema = require_printSchema();
    var _typeFromAST = require_typeFromAST();
    var _valueFromAST = require_valueFromAST();
    var _valueFromASTUntyped = require_valueFromASTUntyped();
    var _astFromValue = require_astFromValue();
    var _TypeInfo = require_TypeInfo();
    var _coerceInputValue = require_coerceInputValue();
    var _concatAST = require_concatAST();
    var _separateOperations = require_separateOperations();
    var _stripIgnoredCharacters = require_stripIgnoredCharacters();
    var _typeComparators = require_typeComparators();
    var _assertValidName = require_assertValidName();
    var _findBreakingChanges = require_findBreakingChanges();
    var _resolveSchemaCoordinate = require_resolveSchemaCoordinate();
  }
});

// node_modules/graphql/index.js
var require_graphql2 = __commonJS({
  "node_modules/graphql/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    Object.defineProperty(exports2, "BREAK", {
      enumerable: true,
      get: function() {
        return _index2.BREAK;
      }
    });
    Object.defineProperty(exports2, "BreakingChangeType", {
      enumerable: true,
      get: function() {
        return _index6.BreakingChangeType;
      }
    });
    Object.defineProperty(exports2, "DEFAULT_DEPRECATION_REASON", {
      enumerable: true,
      get: function() {
        return _index.DEFAULT_DEPRECATION_REASON;
      }
    });
    Object.defineProperty(exports2, "DangerousChangeType", {
      enumerable: true,
      get: function() {
        return _index6.DangerousChangeType;
      }
    });
    Object.defineProperty(exports2, "DirectiveLocation", {
      enumerable: true,
      get: function() {
        return _index2.DirectiveLocation;
      }
    });
    Object.defineProperty(exports2, "ExecutableDefinitionsRule", {
      enumerable: true,
      get: function() {
        return _index4.ExecutableDefinitionsRule;
      }
    });
    Object.defineProperty(exports2, "FieldsOnCorrectTypeRule", {
      enumerable: true,
      get: function() {
        return _index4.FieldsOnCorrectTypeRule;
      }
    });
    Object.defineProperty(exports2, "FragmentsOnCompositeTypesRule", {
      enumerable: true,
      get: function() {
        return _index4.FragmentsOnCompositeTypesRule;
      }
    });
    Object.defineProperty(exports2, "GRAPHQL_MAX_INT", {
      enumerable: true,
      get: function() {
        return _index.GRAPHQL_MAX_INT;
      }
    });
    Object.defineProperty(exports2, "GRAPHQL_MIN_INT", {
      enumerable: true,
      get: function() {
        return _index.GRAPHQL_MIN_INT;
      }
    });
    Object.defineProperty(exports2, "GraphQLBoolean", {
      enumerable: true,
      get: function() {
        return _index.GraphQLBoolean;
      }
    });
    Object.defineProperty(exports2, "GraphQLDeprecatedDirective", {
      enumerable: true,
      get: function() {
        return _index.GraphQLDeprecatedDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLDirective", {
      enumerable: true,
      get: function() {
        return _index.GraphQLDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLEnumType", {
      enumerable: true,
      get: function() {
        return _index.GraphQLEnumType;
      }
    });
    Object.defineProperty(exports2, "GraphQLError", {
      enumerable: true,
      get: function() {
        return _index5.GraphQLError;
      }
    });
    Object.defineProperty(exports2, "GraphQLFloat", {
      enumerable: true,
      get: function() {
        return _index.GraphQLFloat;
      }
    });
    Object.defineProperty(exports2, "GraphQLID", {
      enumerable: true,
      get: function() {
        return _index.GraphQLID;
      }
    });
    Object.defineProperty(exports2, "GraphQLIncludeDirective", {
      enumerable: true,
      get: function() {
        return _index.GraphQLIncludeDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLInputObjectType", {
      enumerable: true,
      get: function() {
        return _index.GraphQLInputObjectType;
      }
    });
    Object.defineProperty(exports2, "GraphQLInt", {
      enumerable: true,
      get: function() {
        return _index.GraphQLInt;
      }
    });
    Object.defineProperty(exports2, "GraphQLInterfaceType", {
      enumerable: true,
      get: function() {
        return _index.GraphQLInterfaceType;
      }
    });
    Object.defineProperty(exports2, "GraphQLList", {
      enumerable: true,
      get: function() {
        return _index.GraphQLList;
      }
    });
    Object.defineProperty(exports2, "GraphQLNonNull", {
      enumerable: true,
      get: function() {
        return _index.GraphQLNonNull;
      }
    });
    Object.defineProperty(exports2, "GraphQLObjectType", {
      enumerable: true,
      get: function() {
        return _index.GraphQLObjectType;
      }
    });
    Object.defineProperty(exports2, "GraphQLOneOfDirective", {
      enumerable: true,
      get: function() {
        return _index.GraphQLOneOfDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLScalarType", {
      enumerable: true,
      get: function() {
        return _index.GraphQLScalarType;
      }
    });
    Object.defineProperty(exports2, "GraphQLSchema", {
      enumerable: true,
      get: function() {
        return _index.GraphQLSchema;
      }
    });
    Object.defineProperty(exports2, "GraphQLSkipDirective", {
      enumerable: true,
      get: function() {
        return _index.GraphQLSkipDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLSpecifiedByDirective", {
      enumerable: true,
      get: function() {
        return _index.GraphQLSpecifiedByDirective;
      }
    });
    Object.defineProperty(exports2, "GraphQLString", {
      enumerable: true,
      get: function() {
        return _index.GraphQLString;
      }
    });
    Object.defineProperty(exports2, "GraphQLUnionType", {
      enumerable: true,
      get: function() {
        return _index.GraphQLUnionType;
      }
    });
    Object.defineProperty(exports2, "Kind", {
      enumerable: true,
      get: function() {
        return _index2.Kind;
      }
    });
    Object.defineProperty(exports2, "KnownArgumentNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.KnownArgumentNamesRule;
      }
    });
    Object.defineProperty(exports2, "KnownDirectivesRule", {
      enumerable: true,
      get: function() {
        return _index4.KnownDirectivesRule;
      }
    });
    Object.defineProperty(exports2, "KnownFragmentNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.KnownFragmentNamesRule;
      }
    });
    Object.defineProperty(exports2, "KnownTypeNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.KnownTypeNamesRule;
      }
    });
    Object.defineProperty(exports2, "Lexer", {
      enumerable: true,
      get: function() {
        return _index2.Lexer;
      }
    });
    Object.defineProperty(exports2, "Location", {
      enumerable: true,
      get: function() {
        return _index2.Location;
      }
    });
    Object.defineProperty(exports2, "LoneAnonymousOperationRule", {
      enumerable: true,
      get: function() {
        return _index4.LoneAnonymousOperationRule;
      }
    });
    Object.defineProperty(exports2, "LoneSchemaDefinitionRule", {
      enumerable: true,
      get: function() {
        return _index4.LoneSchemaDefinitionRule;
      }
    });
    Object.defineProperty(exports2, "MaxIntrospectionDepthRule", {
      enumerable: true,
      get: function() {
        return _index4.MaxIntrospectionDepthRule;
      }
    });
    Object.defineProperty(exports2, "NoDeprecatedCustomRule", {
      enumerable: true,
      get: function() {
        return _index4.NoDeprecatedCustomRule;
      }
    });
    Object.defineProperty(exports2, "NoFragmentCyclesRule", {
      enumerable: true,
      get: function() {
        return _index4.NoFragmentCyclesRule;
      }
    });
    Object.defineProperty(exports2, "NoSchemaIntrospectionCustomRule", {
      enumerable: true,
      get: function() {
        return _index4.NoSchemaIntrospectionCustomRule;
      }
    });
    Object.defineProperty(exports2, "NoUndefinedVariablesRule", {
      enumerable: true,
      get: function() {
        return _index4.NoUndefinedVariablesRule;
      }
    });
    Object.defineProperty(exports2, "NoUnusedFragmentsRule", {
      enumerable: true,
      get: function() {
        return _index4.NoUnusedFragmentsRule;
      }
    });
    Object.defineProperty(exports2, "NoUnusedVariablesRule", {
      enumerable: true,
      get: function() {
        return _index4.NoUnusedVariablesRule;
      }
    });
    Object.defineProperty(exports2, "OperationTypeNode", {
      enumerable: true,
      get: function() {
        return _index2.OperationTypeNode;
      }
    });
    Object.defineProperty(exports2, "OverlappingFieldsCanBeMergedRule", {
      enumerable: true,
      get: function() {
        return _index4.OverlappingFieldsCanBeMergedRule;
      }
    });
    Object.defineProperty(exports2, "PossibleFragmentSpreadsRule", {
      enumerable: true,
      get: function() {
        return _index4.PossibleFragmentSpreadsRule;
      }
    });
    Object.defineProperty(exports2, "PossibleTypeExtensionsRule", {
      enumerable: true,
      get: function() {
        return _index4.PossibleTypeExtensionsRule;
      }
    });
    Object.defineProperty(exports2, "ProvidedRequiredArgumentsRule", {
      enumerable: true,
      get: function() {
        return _index4.ProvidedRequiredArgumentsRule;
      }
    });
    Object.defineProperty(exports2, "ScalarLeafsRule", {
      enumerable: true,
      get: function() {
        return _index4.ScalarLeafsRule;
      }
    });
    Object.defineProperty(exports2, "SchemaMetaFieldDef", {
      enumerable: true,
      get: function() {
        return _index.SchemaMetaFieldDef;
      }
    });
    Object.defineProperty(exports2, "SingleFieldSubscriptionsRule", {
      enumerable: true,
      get: function() {
        return _index4.SingleFieldSubscriptionsRule;
      }
    });
    Object.defineProperty(exports2, "Source", {
      enumerable: true,
      get: function() {
        return _index2.Source;
      }
    });
    Object.defineProperty(exports2, "Token", {
      enumerable: true,
      get: function() {
        return _index2.Token;
      }
    });
    Object.defineProperty(exports2, "TokenKind", {
      enumerable: true,
      get: function() {
        return _index2.TokenKind;
      }
    });
    Object.defineProperty(exports2, "TypeInfo", {
      enumerable: true,
      get: function() {
        return _index6.TypeInfo;
      }
    });
    Object.defineProperty(exports2, "TypeKind", {
      enumerable: true,
      get: function() {
        return _index.TypeKind;
      }
    });
    Object.defineProperty(exports2, "TypeMetaFieldDef", {
      enumerable: true,
      get: function() {
        return _index.TypeMetaFieldDef;
      }
    });
    Object.defineProperty(exports2, "TypeNameMetaFieldDef", {
      enumerable: true,
      get: function() {
        return _index.TypeNameMetaFieldDef;
      }
    });
    Object.defineProperty(exports2, "UniqueArgumentDefinitionNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueArgumentDefinitionNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueArgumentNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueArgumentNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueDirectiveNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueDirectiveNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueDirectivesPerLocationRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueDirectivesPerLocationRule;
      }
    });
    Object.defineProperty(exports2, "UniqueEnumValueNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueEnumValueNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueFieldDefinitionNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueFieldDefinitionNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueFragmentNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueFragmentNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueInputFieldNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueInputFieldNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueOperationNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueOperationNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueOperationTypesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueOperationTypesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueTypeNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueTypeNamesRule;
      }
    });
    Object.defineProperty(exports2, "UniqueVariableNamesRule", {
      enumerable: true,
      get: function() {
        return _index4.UniqueVariableNamesRule;
      }
    });
    Object.defineProperty(exports2, "ValidationContext", {
      enumerable: true,
      get: function() {
        return _index4.ValidationContext;
      }
    });
    Object.defineProperty(exports2, "ValuesOfCorrectTypeRule", {
      enumerable: true,
      get: function() {
        return _index4.ValuesOfCorrectTypeRule;
      }
    });
    Object.defineProperty(exports2, "VariablesAreInputTypesRule", {
      enumerable: true,
      get: function() {
        return _index4.VariablesAreInputTypesRule;
      }
    });
    Object.defineProperty(exports2, "VariablesInAllowedPositionRule", {
      enumerable: true,
      get: function() {
        return _index4.VariablesInAllowedPositionRule;
      }
    });
    Object.defineProperty(exports2, "__Directive", {
      enumerable: true,
      get: function() {
        return _index.__Directive;
      }
    });
    Object.defineProperty(exports2, "__DirectiveLocation", {
      enumerable: true,
      get: function() {
        return _index.__DirectiveLocation;
      }
    });
    Object.defineProperty(exports2, "__EnumValue", {
      enumerable: true,
      get: function() {
        return _index.__EnumValue;
      }
    });
    Object.defineProperty(exports2, "__Field", {
      enumerable: true,
      get: function() {
        return _index.__Field;
      }
    });
    Object.defineProperty(exports2, "__InputValue", {
      enumerable: true,
      get: function() {
        return _index.__InputValue;
      }
    });
    Object.defineProperty(exports2, "__Schema", {
      enumerable: true,
      get: function() {
        return _index.__Schema;
      }
    });
    Object.defineProperty(exports2, "__Type", {
      enumerable: true,
      get: function() {
        return _index.__Type;
      }
    });
    Object.defineProperty(exports2, "__TypeKind", {
      enumerable: true,
      get: function() {
        return _index.__TypeKind;
      }
    });
    Object.defineProperty(exports2, "assertAbstractType", {
      enumerable: true,
      get: function() {
        return _index.assertAbstractType;
      }
    });
    Object.defineProperty(exports2, "assertCompositeType", {
      enumerable: true,
      get: function() {
        return _index.assertCompositeType;
      }
    });
    Object.defineProperty(exports2, "assertDirective", {
      enumerable: true,
      get: function() {
        return _index.assertDirective;
      }
    });
    Object.defineProperty(exports2, "assertEnumType", {
      enumerable: true,
      get: function() {
        return _index.assertEnumType;
      }
    });
    Object.defineProperty(exports2, "assertEnumValueName", {
      enumerable: true,
      get: function() {
        return _index.assertEnumValueName;
      }
    });
    Object.defineProperty(exports2, "assertInputObjectType", {
      enumerable: true,
      get: function() {
        return _index.assertInputObjectType;
      }
    });
    Object.defineProperty(exports2, "assertInputType", {
      enumerable: true,
      get: function() {
        return _index.assertInputType;
      }
    });
    Object.defineProperty(exports2, "assertInterfaceType", {
      enumerable: true,
      get: function() {
        return _index.assertInterfaceType;
      }
    });
    Object.defineProperty(exports2, "assertLeafType", {
      enumerable: true,
      get: function() {
        return _index.assertLeafType;
      }
    });
    Object.defineProperty(exports2, "assertListType", {
      enumerable: true,
      get: function() {
        return _index.assertListType;
      }
    });
    Object.defineProperty(exports2, "assertName", {
      enumerable: true,
      get: function() {
        return _index.assertName;
      }
    });
    Object.defineProperty(exports2, "assertNamedType", {
      enumerable: true,
      get: function() {
        return _index.assertNamedType;
      }
    });
    Object.defineProperty(exports2, "assertNonNullType", {
      enumerable: true,
      get: function() {
        return _index.assertNonNullType;
      }
    });
    Object.defineProperty(exports2, "assertNullableType", {
      enumerable: true,
      get: function() {
        return _index.assertNullableType;
      }
    });
    Object.defineProperty(exports2, "assertObjectType", {
      enumerable: true,
      get: function() {
        return _index.assertObjectType;
      }
    });
    Object.defineProperty(exports2, "assertOutputType", {
      enumerable: true,
      get: function() {
        return _index.assertOutputType;
      }
    });
    Object.defineProperty(exports2, "assertScalarType", {
      enumerable: true,
      get: function() {
        return _index.assertScalarType;
      }
    });
    Object.defineProperty(exports2, "assertSchema", {
      enumerable: true,
      get: function() {
        return _index.assertSchema;
      }
    });
    Object.defineProperty(exports2, "assertType", {
      enumerable: true,
      get: function() {
        return _index.assertType;
      }
    });
    Object.defineProperty(exports2, "assertUnionType", {
      enumerable: true,
      get: function() {
        return _index.assertUnionType;
      }
    });
    Object.defineProperty(exports2, "assertValidName", {
      enumerable: true,
      get: function() {
        return _index6.assertValidName;
      }
    });
    Object.defineProperty(exports2, "assertValidSchema", {
      enumerable: true,
      get: function() {
        return _index.assertValidSchema;
      }
    });
    Object.defineProperty(exports2, "assertWrappingType", {
      enumerable: true,
      get: function() {
        return _index.assertWrappingType;
      }
    });
    Object.defineProperty(exports2, "astFromValue", {
      enumerable: true,
      get: function() {
        return _index6.astFromValue;
      }
    });
    Object.defineProperty(exports2, "buildASTSchema", {
      enumerable: true,
      get: function() {
        return _index6.buildASTSchema;
      }
    });
    Object.defineProperty(exports2, "buildClientSchema", {
      enumerable: true,
      get: function() {
        return _index6.buildClientSchema;
      }
    });
    Object.defineProperty(exports2, "buildSchema", {
      enumerable: true,
      get: function() {
        return _index6.buildSchema;
      }
    });
    Object.defineProperty(exports2, "coerceInputValue", {
      enumerable: true,
      get: function() {
        return _index6.coerceInputValue;
      }
    });
    Object.defineProperty(exports2, "concatAST", {
      enumerable: true,
      get: function() {
        return _index6.concatAST;
      }
    });
    Object.defineProperty(exports2, "createSourceEventStream", {
      enumerable: true,
      get: function() {
        return _index3.createSourceEventStream;
      }
    });
    Object.defineProperty(exports2, "defaultFieldResolver", {
      enumerable: true,
      get: function() {
        return _index3.defaultFieldResolver;
      }
    });
    Object.defineProperty(exports2, "defaultTypeResolver", {
      enumerable: true,
      get: function() {
        return _index3.defaultTypeResolver;
      }
    });
    Object.defineProperty(exports2, "doTypesOverlap", {
      enumerable: true,
      get: function() {
        return _index6.doTypesOverlap;
      }
    });
    Object.defineProperty(exports2, "execute", {
      enumerable: true,
      get: function() {
        return _index3.execute;
      }
    });
    Object.defineProperty(exports2, "executeSync", {
      enumerable: true,
      get: function() {
        return _index3.executeSync;
      }
    });
    Object.defineProperty(exports2, "extendSchema", {
      enumerable: true,
      get: function() {
        return _index6.extendSchema;
      }
    });
    Object.defineProperty(exports2, "findBreakingChanges", {
      enumerable: true,
      get: function() {
        return _index6.findBreakingChanges;
      }
    });
    Object.defineProperty(exports2, "findDangerousChanges", {
      enumerable: true,
      get: function() {
        return _index6.findDangerousChanges;
      }
    });
    Object.defineProperty(exports2, "formatError", {
      enumerable: true,
      get: function() {
        return _index5.formatError;
      }
    });
    Object.defineProperty(exports2, "getArgumentValues", {
      enumerable: true,
      get: function() {
        return _index3.getArgumentValues;
      }
    });
    Object.defineProperty(exports2, "getDirectiveValues", {
      enumerable: true,
      get: function() {
        return _index3.getDirectiveValues;
      }
    });
    Object.defineProperty(exports2, "getEnterLeaveForKind", {
      enumerable: true,
      get: function() {
        return _index2.getEnterLeaveForKind;
      }
    });
    Object.defineProperty(exports2, "getIntrospectionQuery", {
      enumerable: true,
      get: function() {
        return _index6.getIntrospectionQuery;
      }
    });
    Object.defineProperty(exports2, "getLocation", {
      enumerable: true,
      get: function() {
        return _index2.getLocation;
      }
    });
    Object.defineProperty(exports2, "getNamedType", {
      enumerable: true,
      get: function() {
        return _index.getNamedType;
      }
    });
    Object.defineProperty(exports2, "getNullableType", {
      enumerable: true,
      get: function() {
        return _index.getNullableType;
      }
    });
    Object.defineProperty(exports2, "getOperationAST", {
      enumerable: true,
      get: function() {
        return _index6.getOperationAST;
      }
    });
    Object.defineProperty(exports2, "getOperationRootType", {
      enumerable: true,
      get: function() {
        return _index6.getOperationRootType;
      }
    });
    Object.defineProperty(exports2, "getVariableValues", {
      enumerable: true,
      get: function() {
        return _index3.getVariableValues;
      }
    });
    Object.defineProperty(exports2, "getVisitFn", {
      enumerable: true,
      get: function() {
        return _index2.getVisitFn;
      }
    });
    Object.defineProperty(exports2, "graphql", {
      enumerable: true,
      get: function() {
        return _graphql.graphql;
      }
    });
    Object.defineProperty(exports2, "graphqlSync", {
      enumerable: true,
      get: function() {
        return _graphql.graphqlSync;
      }
    });
    Object.defineProperty(exports2, "introspectionFromSchema", {
      enumerable: true,
      get: function() {
        return _index6.introspectionFromSchema;
      }
    });
    Object.defineProperty(exports2, "introspectionTypes", {
      enumerable: true,
      get: function() {
        return _index.introspectionTypes;
      }
    });
    Object.defineProperty(exports2, "isAbstractType", {
      enumerable: true,
      get: function() {
        return _index.isAbstractType;
      }
    });
    Object.defineProperty(exports2, "isCompositeType", {
      enumerable: true,
      get: function() {
        return _index.isCompositeType;
      }
    });
    Object.defineProperty(exports2, "isConstValueNode", {
      enumerable: true,
      get: function() {
        return _index2.isConstValueNode;
      }
    });
    Object.defineProperty(exports2, "isDefinitionNode", {
      enumerable: true,
      get: function() {
        return _index2.isDefinitionNode;
      }
    });
    Object.defineProperty(exports2, "isDirective", {
      enumerable: true,
      get: function() {
        return _index.isDirective;
      }
    });
    Object.defineProperty(exports2, "isEnumType", {
      enumerable: true,
      get: function() {
        return _index.isEnumType;
      }
    });
    Object.defineProperty(exports2, "isEqualType", {
      enumerable: true,
      get: function() {
        return _index6.isEqualType;
      }
    });
    Object.defineProperty(exports2, "isExecutableDefinitionNode", {
      enumerable: true,
      get: function() {
        return _index2.isExecutableDefinitionNode;
      }
    });
    Object.defineProperty(exports2, "isInputObjectType", {
      enumerable: true,
      get: function() {
        return _index.isInputObjectType;
      }
    });
    Object.defineProperty(exports2, "isInputType", {
      enumerable: true,
      get: function() {
        return _index.isInputType;
      }
    });
    Object.defineProperty(exports2, "isInterfaceType", {
      enumerable: true,
      get: function() {
        return _index.isInterfaceType;
      }
    });
    Object.defineProperty(exports2, "isIntrospectionType", {
      enumerable: true,
      get: function() {
        return _index.isIntrospectionType;
      }
    });
    Object.defineProperty(exports2, "isLeafType", {
      enumerable: true,
      get: function() {
        return _index.isLeafType;
      }
    });
    Object.defineProperty(exports2, "isListType", {
      enumerable: true,
      get: function() {
        return _index.isListType;
      }
    });
    Object.defineProperty(exports2, "isNamedType", {
      enumerable: true,
      get: function() {
        return _index.isNamedType;
      }
    });
    Object.defineProperty(exports2, "isNonNullType", {
      enumerable: true,
      get: function() {
        return _index.isNonNullType;
      }
    });
    Object.defineProperty(exports2, "isNullableType", {
      enumerable: true,
      get: function() {
        return _index.isNullableType;
      }
    });
    Object.defineProperty(exports2, "isObjectType", {
      enumerable: true,
      get: function() {
        return _index.isObjectType;
      }
    });
    Object.defineProperty(exports2, "isOutputType", {
      enumerable: true,
      get: function() {
        return _index.isOutputType;
      }
    });
    Object.defineProperty(exports2, "isRequiredArgument", {
      enumerable: true,
      get: function() {
        return _index.isRequiredArgument;
      }
    });
    Object.defineProperty(exports2, "isRequiredInputField", {
      enumerable: true,
      get: function() {
        return _index.isRequiredInputField;
      }
    });
    Object.defineProperty(exports2, "isScalarType", {
      enumerable: true,
      get: function() {
        return _index.isScalarType;
      }
    });
    Object.defineProperty(exports2, "isSchema", {
      enumerable: true,
      get: function() {
        return _index.isSchema;
      }
    });
    Object.defineProperty(exports2, "isSchemaCoordinateNode", {
      enumerable: true,
      get: function() {
        return _index2.isSchemaCoordinateNode;
      }
    });
    Object.defineProperty(exports2, "isSelectionNode", {
      enumerable: true,
      get: function() {
        return _index2.isSelectionNode;
      }
    });
    Object.defineProperty(exports2, "isSpecifiedDirective", {
      enumerable: true,
      get: function() {
        return _index.isSpecifiedDirective;
      }
    });
    Object.defineProperty(exports2, "isSpecifiedScalarType", {
      enumerable: true,
      get: function() {
        return _index.isSpecifiedScalarType;
      }
    });
    Object.defineProperty(exports2, "isType", {
      enumerable: true,
      get: function() {
        return _index.isType;
      }
    });
    Object.defineProperty(exports2, "isTypeDefinitionNode", {
      enumerable: true,
      get: function() {
        return _index2.isTypeDefinitionNode;
      }
    });
    Object.defineProperty(exports2, "isTypeExtensionNode", {
      enumerable: true,
      get: function() {
        return _index2.isTypeExtensionNode;
      }
    });
    Object.defineProperty(exports2, "isTypeNode", {
      enumerable: true,
      get: function() {
        return _index2.isTypeNode;
      }
    });
    Object.defineProperty(exports2, "isTypeSubTypeOf", {
      enumerable: true,
      get: function() {
        return _index6.isTypeSubTypeOf;
      }
    });
    Object.defineProperty(exports2, "isTypeSystemDefinitionNode", {
      enumerable: true,
      get: function() {
        return _index2.isTypeSystemDefinitionNode;
      }
    });
    Object.defineProperty(exports2, "isTypeSystemExtensionNode", {
      enumerable: true,
      get: function() {
        return _index2.isTypeSystemExtensionNode;
      }
    });
    Object.defineProperty(exports2, "isUnionType", {
      enumerable: true,
      get: function() {
        return _index.isUnionType;
      }
    });
    Object.defineProperty(exports2, "isValidNameError", {
      enumerable: true,
      get: function() {
        return _index6.isValidNameError;
      }
    });
    Object.defineProperty(exports2, "isValueNode", {
      enumerable: true,
      get: function() {
        return _index2.isValueNode;
      }
    });
    Object.defineProperty(exports2, "isWrappingType", {
      enumerable: true,
      get: function() {
        return _index.isWrappingType;
      }
    });
    Object.defineProperty(exports2, "lexicographicSortSchema", {
      enumerable: true,
      get: function() {
        return _index6.lexicographicSortSchema;
      }
    });
    Object.defineProperty(exports2, "locatedError", {
      enumerable: true,
      get: function() {
        return _index5.locatedError;
      }
    });
    Object.defineProperty(exports2, "parse", {
      enumerable: true,
      get: function() {
        return _index2.parse;
      }
    });
    Object.defineProperty(exports2, "parseConstValue", {
      enumerable: true,
      get: function() {
        return _index2.parseConstValue;
      }
    });
    Object.defineProperty(exports2, "parseSchemaCoordinate", {
      enumerable: true,
      get: function() {
        return _index2.parseSchemaCoordinate;
      }
    });
    Object.defineProperty(exports2, "parseType", {
      enumerable: true,
      get: function() {
        return _index2.parseType;
      }
    });
    Object.defineProperty(exports2, "parseValue", {
      enumerable: true,
      get: function() {
        return _index2.parseValue;
      }
    });
    Object.defineProperty(exports2, "print", {
      enumerable: true,
      get: function() {
        return _index2.print;
      }
    });
    Object.defineProperty(exports2, "printError", {
      enumerable: true,
      get: function() {
        return _index5.printError;
      }
    });
    Object.defineProperty(exports2, "printIntrospectionSchema", {
      enumerable: true,
      get: function() {
        return _index6.printIntrospectionSchema;
      }
    });
    Object.defineProperty(exports2, "printLocation", {
      enumerable: true,
      get: function() {
        return _index2.printLocation;
      }
    });
    Object.defineProperty(exports2, "printSchema", {
      enumerable: true,
      get: function() {
        return _index6.printSchema;
      }
    });
    Object.defineProperty(exports2, "printSourceLocation", {
      enumerable: true,
      get: function() {
        return _index2.printSourceLocation;
      }
    });
    Object.defineProperty(exports2, "printType", {
      enumerable: true,
      get: function() {
        return _index6.printType;
      }
    });
    Object.defineProperty(exports2, "recommendedRules", {
      enumerable: true,
      get: function() {
        return _index4.recommendedRules;
      }
    });
    Object.defineProperty(exports2, "resolveASTSchemaCoordinate", {
      enumerable: true,
      get: function() {
        return _index6.resolveASTSchemaCoordinate;
      }
    });
    Object.defineProperty(exports2, "resolveObjMapThunk", {
      enumerable: true,
      get: function() {
        return _index.resolveObjMapThunk;
      }
    });
    Object.defineProperty(exports2, "resolveReadonlyArrayThunk", {
      enumerable: true,
      get: function() {
        return _index.resolveReadonlyArrayThunk;
      }
    });
    Object.defineProperty(exports2, "resolveSchemaCoordinate", {
      enumerable: true,
      get: function() {
        return _index6.resolveSchemaCoordinate;
      }
    });
    Object.defineProperty(exports2, "responsePathAsArray", {
      enumerable: true,
      get: function() {
        return _index3.responsePathAsArray;
      }
    });
    Object.defineProperty(exports2, "separateOperations", {
      enumerable: true,
      get: function() {
        return _index6.separateOperations;
      }
    });
    Object.defineProperty(exports2, "specifiedDirectives", {
      enumerable: true,
      get: function() {
        return _index.specifiedDirectives;
      }
    });
    Object.defineProperty(exports2, "specifiedRules", {
      enumerable: true,
      get: function() {
        return _index4.specifiedRules;
      }
    });
    Object.defineProperty(exports2, "specifiedScalarTypes", {
      enumerable: true,
      get: function() {
        return _index.specifiedScalarTypes;
      }
    });
    Object.defineProperty(exports2, "stripIgnoredCharacters", {
      enumerable: true,
      get: function() {
        return _index6.stripIgnoredCharacters;
      }
    });
    Object.defineProperty(exports2, "subscribe", {
      enumerable: true,
      get: function() {
        return _index3.subscribe;
      }
    });
    Object.defineProperty(exports2, "syntaxError", {
      enumerable: true,
      get: function() {
        return _index5.syntaxError;
      }
    });
    Object.defineProperty(exports2, "typeFromAST", {
      enumerable: true,
      get: function() {
        return _index6.typeFromAST;
      }
    });
    Object.defineProperty(exports2, "validate", {
      enumerable: true,
      get: function() {
        return _index4.validate;
      }
    });
    Object.defineProperty(exports2, "validateSchema", {
      enumerable: true,
      get: function() {
        return _index.validateSchema;
      }
    });
    Object.defineProperty(exports2, "valueFromAST", {
      enumerable: true,
      get: function() {
        return _index6.valueFromAST;
      }
    });
    Object.defineProperty(exports2, "valueFromASTUntyped", {
      enumerable: true,
      get: function() {
        return _index6.valueFromASTUntyped;
      }
    });
    Object.defineProperty(exports2, "version", {
      enumerable: true,
      get: function() {
        return _version.version;
      }
    });
    Object.defineProperty(exports2, "versionInfo", {
      enumerable: true,
      get: function() {
        return _version.versionInfo;
      }
    });
    Object.defineProperty(exports2, "visit", {
      enumerable: true,
      get: function() {
        return _index2.visit;
      }
    });
    Object.defineProperty(exports2, "visitInParallel", {
      enumerable: true,
      get: function() {
        return _index2.visitInParallel;
      }
    });
    Object.defineProperty(exports2, "visitWithTypeInfo", {
      enumerable: true,
      get: function() {
        return _index6.visitWithTypeInfo;
      }
    });
    var _version = require_version();
    var _graphql = require_graphql();
    var _index = require_type();
    var _index2 = require_language();
    var _index3 = require_execution();
    var _index4 = require_validation();
    var _index5 = require_error();
    var _index6 = require_utilities();
  }
});

// src/action/index.js
var import_node_fs3 = __toESM(require("node:fs"), 1);
var import_node_path3 = __toESM(require("node:path"), 1);
var import_node_crypto = require("node:crypto");

// src/version.js
var TOOL_VERSION = "0.2.3";

// src/analyzer/index.js
var import_node_fs2 = __toESM(require("node:fs"), 1);
var import_node_path2 = __toESM(require("node:path"), 1);

// src/config/index.js
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var import_toml = __toESM(require_toml(), 1);
function regularFile(root, file) {
  const relative = import_node_path.default.relative(root, file);
  if (relative.startsWith(`..${import_node_path.default.sep}`) || relative === ".." || import_node_path.default.isAbsolute(relative)) throw new Error("Configuration must be inside the scan root");
  let current = root;
  for (const part of relative.split(import_node_path.default.sep)) {
    current = import_node_path.default.join(current, part);
    if (import_node_fs.default.lstatSync(current).isSymbolicLink()) throw new Error("Symbolic links are not supported configuration inputs");
  }
  const stat = import_node_fs.default.lstatSync(file);
  if (!stat.isFile() || stat.size > 1024 * 1024) throw new Error("Configuration must be a regular file up to 1 MiB");
}
function parseConfig(file) {
  const stat = import_node_fs.default.lstatSync(file);
  if (!stat.isFile() || stat.size > 1024 * 1024) throw new Error("Configuration must be a regular file up to 1 MiB");
  let data;
  try {
    data = import_toml.default.parse(import_node_fs.default.readFileSync(file, "utf8"));
  } catch {
    throw new Error("Invalid Shopify app TOML; contents were not printed");
  }
  const section = data.access_scopes;
  if (!section || typeof section.scopes !== "string") throw new Error("[access_scopes].scopes must be a comma-separated string");
  if (section.optional_scopes !== void 0 && (!Array.isArray(section.optional_scopes) || section.optional_scopes.some((s) => typeof s !== "string" || !s.trim()))) throw new Error("[access_scopes].optional_scopes must be an array of non-empty strings");
  const scopes = section.scopes.split(",").map((s) => s.trim()).filter(Boolean);
  const optional = section.optional_scopes ?? [];
  const normalize = (values) => [...new Set(values.map((s) => s.trim()).filter(Boolean))].sort();
  const required = normalize(scopes), normalizedOptional = normalize(optional);
  if (required.some((s) => normalizedOptional.includes(s))) throw new Error("A scope cannot be both required and optional");
  return { required, optional: normalizedOptional, raw: { required: scopes, optional }, events: data.events ?? null };
}

// src/graphql/index.js
var import_graphql = __toESM(require_graphql2(), 1);
function parseGraphQL(source, file, lineOffset = 0) {
  const document = (0, import_graphql.parse)(source, { noLocation: false, maxTokens: 5e4 });
  const fragments = new Map(document.definitions.filter((d) => d.kind === import_graphql.Kind.FRAGMENT_DEFINITION).map((d) => [d.name.value, d]));
  let visited = 0;
  const collectFields = (selectionSet, parentPath = "", stack = []) => (selectionSet?.selections ?? []).flatMap((selection) => {
    if (++visited > 5e4) throw new Error("GraphQL selection limit exceeded");
    if (selection.kind === import_graphql.Kind.INLINE_FRAGMENT) return collectFields(selection.selectionSet, parentPath, stack);
    if (selection.kind === import_graphql.Kind.FRAGMENT_SPREAD) {
      const name = selection.name.value;
      if (stack.includes(name) || !fragments.has(name)) throw new Error("Unresolved or cyclic GraphQL fragment");
      return collectFields(fragments.get(name).selectionSet, parentPath, [...stack, name]);
    }
    const fieldPath = parentPath ? `${parentPath}.${selection.name.value}` : selection.name.value;
    return [{ name: selection.name.value, path: fieldPath, line: (selection.loc?.startToken?.line ?? 1) + lineOffset, column: selection.loc?.startToken?.column ?? 1 }, ...collectFields(selection.selectionSet, fieldPath, stack)];
  });
  return document.definitions.filter((d) => d.kind === import_graphql.Kind.OPERATION_DEFINITION).map((node) => ({ type: node.operation, name: node.name?.value ?? null, fields: collectFields(node.selectionSet), file, line: (node.loc?.startToken?.line ?? 1) + lineOffset }));
}
function extractGraphQL(text, file) {
  const documents = /* @__PURE__ */ new Map();
  if (/\.(graphql|gql)$/i.test(file)) documents.set(0, text);
  else {
    const patterns = [/#graphql\s*([\s\S]*?)(?=`)/g, /(?:graphql|gql)\s*(?:\(\s*)?`([\s\S]*?)`/g, /query\s*[:=]\s*`([\s\S]*?)`/g];
    for (const pattern of patterns) for (const match of text.matchAll(pattern)) {
      const offset = match.index + match[0].indexOf(match[1]);
      const source = match[1].replace(/^#graphql\s*/, "");
      if (![...documents.values()].some((d) => d.replace(/^#graphql\s*/, "") === source)) documents.set(offset, match[1]);
    }
  }
  const result = [];
  for (const [offset, source] of documents) {
    try {
      result.push(...parseGraphQL(source, file, text.slice(0, offset).split("\n").length - 1));
    } catch {
      result.push({ type: "unknown", name: null, fields: [], file, line: text.slice(0, offset).split("\n").length, parseError: true });
    }
  }
  return result;
}

// src/evidence/registry.js
var EVIDENCE_VERSION = "2026-10";
var EVIDENCE_SOURCES = {
  scopes: "https://shopify.dev/docs/apps/build/authentication-authorization/manage-access-scopes",
  accessScopes: "https://shopify.dev/docs/api/usage/access-scopes",
  versioning: "https://shopify.dev/docs/api/usage/versioning"
};
var rule = (ruleId, operation, anyOf, source, notes = "", introduced = "2023-01") => ({
  ruleId,
  api: "admin-graphql",
  operation,
  operationType: source.includes("/mutations/") ? "mutation" : "query",
  requires: { anyOf },
  introduced,
  lastVerified: EVIDENCE_VERSION,
  source,
  evidenceType: "official-api-reference",
  confidence: "high",
  notes
});
var EVIDENCE_REGISTRY = [
  rule("SG-SCOPE-001", "productCreate", ["write_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productcreate"),
  rule("SG-SCOPE-001", "productUpdate", ["write_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productupdate"),
  rule("SG-SCOPE-001", "productSet", ["write_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productset"),
  rule("SG-SCOPE-001", "productOptionsCreate", ["write_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productoptionscreate"),
  rule("SG-SCOPE-001", "collectionCreate", ["write_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/collectioncreate"),
  rule("SG-SCOPE-001", "products", ["read_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/products"),
  rule("SG-SCOPE-001", "product", ["read_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/product"),
  rule("SG-SCOPE-001", "productVariants", ["read_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/productvariants"),
  rule("SG-SCOPE-001", "orders", ["read_orders", "read_marketplace_orders", "read_buyer_membership_orders", "read_quick_sale"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/orders", "read_orders covers the standard recent-order window; older orders require read_all_orders."),
  rule("SG-SCOPE-001", "order", ["read_orders", "read_marketplace_orders", "read_buyer_membership_orders", "read_quick_sale"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/order", "read_orders covers the standard recent-order window; older orders require read_all_orders."),
  rule("SG-SCOPE-001", "customers", ["read_customers"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/customers"),
  rule("SG-SCOPE-001", "customer", ["read_customers"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/customer"),
  rule("SG-SCOPE-001", "inventoryItem", ["read_inventory", "read_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/inventoryItem"),
  rule("SG-SCOPE-001", "inventoryItems.nodes.inventoryLevels", ["read_inventory"], "https://shopify.dev/docs/api/admin-graphql/2026-10/objects/InventoryLevel"),
  rule("SG-SCOPE-001", "inventoryItem.inventoryLevels", ["read_inventory"], "https://shopify.dev/docs/api/admin-graphql/2026-10/objects/InventoryLevel"),
  rule("SG-SCOPE-001", "inventoryItems", ["read_inventory", "read_products"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/inventoryitems"),
  rule("SG-SCOPE-001", "locations", ["read_locations", "read_inventory", "read_markets_home"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/locations"),
  rule("SG-SCOPE-001", "themes", ["read_themes"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/themes"),
  rule("SG-SCOPE-001", "files", ["read_files"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/files"),
  rule("SG-SCOPE-001", "metaobjects", ["read_metaobjects"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/metaobjects", "App-owned metaobjects may have special access behavior; this rule is intentionally conservative for merchant-owned access."),
  rule("SG-SCOPE-001", "metaobject", ["read_metaobjects"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/metaobject", "App-owned metaobjects may have special access behavior; this rule is intentionally conservative for merchant-owned access."),
  rule("SG-SCOPE-001", "cartTransformCreate", ["write_cart_transforms"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/carttransformcreate"),
  rule("SG-SCOPE-001", "paymentInstrumentSendAddEmail", ["write_customers"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/paymentInstrumentSendAddEmail", "The mutation also requires staff create/edit customer permission and read access to the mandate resource.", "2026-10"),
  rule("SG-SCOPE-001", "feeDetails", ["read_billing"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/feeDetails", "", "2026-10"),
  rule("SG-SCOPE-001", "marketRelationships", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "marketRelationshipsStatus", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "marketRelationships.nodes.parentMarket", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "marketRelationships.nodes.childMarket", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "market.parentMarkets", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "market.parentMarketsCount", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "market.childMarkets", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "market.childMarketsCount", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "markets.nodes.parentMarkets", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "markets.nodes.parentMarketsCount", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "markets.nodes.childMarkets", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "markets.nodes.childMarketsCount", ["read_markets"], "https://shopify.dev/changelog/posts/market-relationships", "", "2026-10"),
  rule("SG-SCOPE-001", "discountNode", ["read_discounts"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/discountNode"),
  rule("SG-SCOPE-001", "discountNode.discount.rollouts", ["read_rollouts"], "https://shopify.dev/docs/api/usage/access-scopes", "Discount.rollouts is available in Admin GraphQL 2026-10+. Reading the discount itself still requires its resource scope, such as read_discounts.", "2026-10"),
  rule("SG-SCOPE-001", "discountNodes", ["read_discounts"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/discountNodes"),
  rule("SG-SCOPE-001", "discountNodes.nodes.discount.rollouts", ["read_rollouts"], "https://shopify.dev/docs/api/usage/access-scopes", "Discount.rollouts is available in Admin GraphQL 2026-10+. Reading the discount itself still requires its resource scope, such as read_discounts.", "2026-10"),
  rule("SG-SCOPE-001", "analyticsAnnotationCreate", ["write_analytics_annotations"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationcreate", "", "2026-10"),
  rule("SG-SCOPE-001", "analyticsAnnotationUpdate", ["write_analytics_annotations"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationupdate", "", "2026-10"),
  rule("SG-SCOPE-001", "analyticsAnnotationDelete", ["write_analytics_annotations"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationdelete", "", "2026-10"),
  rule("SG-SCOPE-001", "shop.analyticsAnnotations", ["read_analytics_annotations", "write_analytics_annotations"], "https://shopify.dev/docs/api/admin-graphql/2026-10/objects/analyticsannotation", "The nested Shop.analyticsAnnotations field is statically mapped; unrelated AnalyticsAnnotation type selections are intentionally not inferred.", "2026-10"),
  rule("SG-SCOPE-001", "analyticsTargets", ["read_reports", "write_reports"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/analyticstargets", "", "2026-10"),
  rule("SG-SCOPE-001", "analyticsTargetCreate", ["write_reports"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetcreate", "", "2026-10"),
  rule("SG-SCOPE-001", "analyticsTargetUpdate", ["write_reports"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetupdate", "", "2026-10"),
  rule("SG-SCOPE-001", "analyticsTargetsDelete", ["write_reports"], "https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetsdelete", "", "2026-10"),
  rule("SG-SCOPE-001", "shopifyqlQuery", ["read_reports", "write_reports"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/shopifyqlquery", "", "2026-10"),
  rule("SG-SCOPE-001", "rollout", ["read_rollouts"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/rollout", "Reading protected discount payloads within a rollout can additionally require read_discounts; that resource-specific scope is not inferred here.", "2026-10"),
  rule("SG-SCOPE-001", "rollouts", ["read_rollouts"], "https://shopify.dev/docs/api/admin-graphql/2026-10/queries/rollouts", "Reading protected discount payloads within a rollout can additionally require read_discounts; that resource-specific scope is not inferred here.", "2026-10")
];
var eventsTopic = (scopes, slug) => ({ scopes, introduced: "2026-10", source: `https://shopify.dev/docs/api/events/latest/${slug}` });
var EVENTS_TOPIC_EVIDENCE = Object.freeze({
  Article: eventsTopic(["read_content", "read_online_store_pages"], "article"),
  Blog: eventsTopic(["read_content", "read_online_store_pages"], "blog"),
  Collection: eventsTopic(["read_products"], "collection"),
  Company: eventsTopic(["read_companies"], "company"),
  Customer: eventsTopic(["read_customers"], "customer"),
  FulfillmentOrder: eventsTopic(["read_assigned_fulfillment_orders", "read_marketplace_fulfillment_orders", "read_merchant_managed_fulfillment_orders", "read_third_party_fulfillment_orders"], "fulfillment-order"),
  InventoryItem: eventsTopic(["read_inventory"], "inventory-item"),
  InventoryShipment: eventsTopic(["read_inventory_shipments"], "inventory-shipment"),
  InventoryTransfer: eventsTopic(["read_inventory_transfers"], "inventory-transfer"),
  Location: eventsTopic(["read_locations"], "location"),
  MetafieldDefinition: eventsTopic(["read_content"], "metafield-definition"),
  Metaobject: eventsTopic(["read_metaobjects"], "metaobject"),
  MetaobjectDefinition: eventsTopic(["read_metaobject_definitions"], "metaobject-definition"),
  Order: eventsTopic(["read_orders", "read_marketplace_orders", "read_buyer_membership_orders", "read_quick_sale"], "order"),
  Page: eventsTopic(["read_content", "read_online_store_pages"], "page"),
  Product: eventsTopic(["read_products"], "product"),
  Refund: eventsTopic(["read_orders", "read_marketplace_orders", "read_buyer_membership_orders"], "refund"),
  Return: eventsTopic(["read_returns", "read_marketplace_returns"], "return")
});
var IMPLIED_SCOPES = /* @__PURE__ */ new Map([
  ["write_products", "read_products"],
  ["write_orders", "read_orders"],
  ["write_customers", "read_customers"],
  ["write_inventory", "read_inventory"],
  ["write_draft_orders", "read_draft_orders"],
  ["write_discounts", "read_discounts"],
  ["write_themes", "read_themes"],
  ["write_content", "read_content"],
  ["write_locations", "read_locations"],
  ["write_files", "read_files"],
  ["write_analytics_annotations", "read_analytics_annotations"],
  ["write_reports", "read_reports"]
]);
function rulesFor(operation, type) {
  return EVIDENCE_REGISTRY.filter((item) => item.operation === operation && (!type || item.operationType === type));
}

// src/analyzer/index.js
var DEFAULT_IGNORES = /* @__PURE__ */ new Set([".git", "node_modules", "vendor", "dist", "build", "coverage", ".cache", "tmp", "fixtures"]);
var CODE_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".jsx", ".ts", ".tsx", ".graphql", ".gql"]);
var MAX_FILE_BYTES = 1024 * 1024;
function walk(root, skipped, current = root, out = []) {
  for (const entry of import_node_fs2.default.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    const full = import_node_path2.default.join(current, entry.name);
    if (entry.isSymbolicLink()) {
      skipped.push({ file: import_node_path2.default.relative(root, full), reason: "Symbolic link" });
      continue;
    }
    if (entry.isDirectory()) {
      if (!DEFAULT_IGNORES.has(entry.name)) walk(root, skipped, full, out);
      continue;
    }
    if (!entry.isFile() || !CODE_EXTENSIONS.has(import_node_path2.default.extname(entry.name).toLowerCase())) continue;
    if (out.length >= 2e3 || import_node_fs2.default.lstatSync(full).size > MAX_FILE_BYTES) {
      skipped.push({ file: import_node_path2.default.relative(root, full), reason: "Analysis limit" });
      continue;
    }
    out.push(full);
  }
  return out;
}
function finding(ruleId, severity, confidence, scope, file, line, explanation, evidence, source, remediation) {
  return { ruleId, severity, confidence, scope, file: file ?? null, line: line ?? null, explanation, evidence, source, remediation };
}
function audit({ root = ".", configPath, include, exclude = [] } = {}) {
  const absoluteRoot = import_node_path2.default.resolve(root);
  if (!import_node_fs2.default.lstatSync(absoluteRoot).isDirectory()) throw new Error("Scan root must be a regular directory");
  const candidates = import_node_fs2.default.readdirSync(absoluteRoot).filter((f) => /^shopify\.app(?:\..+)?\.toml$/.test(f)).sort();
  if (!configPath && candidates.length > 1 && !candidates.includes("shopify.app.toml")) throw new Error("Multiple app configurations found; select one with --config");
  const selected = configPath ?? (candidates.includes("shopify.app.toml") ? "shopify.app.toml" : candidates[0]);
  if (!selected) throw new Error("Shopify app configuration not found; select one with --config");
  const configFile = import_node_path2.default.resolve(absoluteRoot, selected);
  regularFile(absoluteRoot, configFile);
  const config = parseConfig(configFile);
  const skipped = [];
  const files = walk(absoluteRoot, skipped).filter((file) => !exclude.some((value) => file.includes(value)) && (!include || file.includes(include)));
  const observations = [], findings = [], unknown = [];
  for (const file of files) {
    const text = import_node_fs2.default.readFileSync(file, "utf8");
    const surface = /\/admin\/api\/[^/]+\/graphql\.json|admin\.graphql|authenticate\.admin|currentAppInstallation/.test(text) ? "admin-graphql" : /storefront|unauthenticated_read_/.test(text) ? "storefront" : /\.(graphql|gql)$/i.test(file) ? "admin-graphql" : null;
    if (!surface && /graphql|shopify/i.test(text)) {
      unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), reason: "Shopify-related code could not be assigned to a supported API surface." });
      continue;
    }
    if (surface === "storefront") continue;
    const operations = extractGraphQL(text, file);
    if (surface === "admin-graphql" && operations.length === 0 && /(admin\.graphql|client\.(query|request)|graphql\s*\()/.test(text)) {
      unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: 1, reason: "Shopify Admin GraphQL client usage was found, but the query was not a static document." });
    }
    for (const op of operations) {
      if (op.parseError) {
        unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: op.line, reason: "GraphQL-like text could not be parsed safely." });
        continue;
      }
      for (const field of op.fields) {
        const rules = rulesFor(field.path, op.type);
        if (!rules.length) {
          if (!field.path.includes(".") && !["shop", "__typename"].includes(field.path)) unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: field.line, reason: "GraphQL root operation is outside the bundled scope registry." });
          continue;
        }
        for (const item of rules) observations.push({ ...item, operationType: op.type, file, line: field.line, operationName: op.name });
      }
    }
  }
  if (config.events !== null) {
    const events = config.events;
    if (!events || typeof events !== "object" || Array.isArray(events) || !Array.isArray(events.subscription)) {
      unknown.push({ file: import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), line: null, reason: "Events subscriptions could not be mapped from the app configuration." });
    } else for (const subscription of events.subscription) {
      if (!subscription || typeof subscription !== "object" || Array.isArray(subscription) || typeof subscription.topic !== "string") {
        unknown.push({ file: import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), line: null, reason: "An Events subscription topic could not be mapped safely." });
        continue;
      }
      const evidence = events.api_version === EVIDENCE_VERSION && Object.hasOwn(EVENTS_TOPIC_EVIDENCE, subscription.topic) ? EVENTS_TOPIC_EVIDENCE[subscription.topic] : null;
      if (!evidence) {
        unknown.push({ file: import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), line: null, reason: "An Events topic or API version has no bundled 2026-10 scope evidence." });
        continue;
      }
      observations.push({ ruleId: "SG-SCOPE-001", operation: `events.subscription.${subscription.topic}`, operationType: "events", requires: { anyOf: evidence.scopes }, source: evidence.source, confidence: "high", file: configFile, line: null });
    }
  }
  const observedScopes = new Set(observations.flatMap((o) => o.requires.anyOf));
  const satisfied = (scope) => config.required.includes(scope) || [...config.required].some((s) => IMPLIED_SCOPES.get(s) === scope);
  for (const observation of observations) {
    if (observation.requires.anyOf.some(satisfied)) continue;
    const optionalScope = observation.requires.anyOf.find((s) => config.optional.includes(s) || config.optional.some((write) => IMPLIED_SCOPES.get(write) === s));
    const scope = optionalScope ?? observation.requires.anyOf[0];
    const severity = "high";
    findings.push(finding(Boolean(optionalScope) ? "SG-SCOPE-002" : "SG-SCOPE-001", severity, observation.confidence, scope, import_node_path2.default.relative(absoluteRoot, observation.file).replaceAll(import_node_path2.default.sep, "/"), observation.line, Boolean(optionalScope) ? `The code evidences ${scope}, but it is declared optional.` : `The ${observation.operation} operation requires one of ${observation.requires.anyOf.join(", ")}, and none is declared as required.`, `${observation.operation} ${observation.operationType}`, observation.source, `Declare ${scope} as required, or make the code path conditional on an optional-scope request.`));
  }
  for (const [write, read] of IMPLIED_SCOPES) if (config.required.includes(write) && (config.required.includes(read) || config.optional.includes(read))) findings.push(finding("SG-SCOPE-003", "medium", "high", read, import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), null, `${write} already grants read access to this resource; the separate ${read} declaration is redundant.`, `${write} implies ${read}`, EVIDENCE_SOURCES.scopes, `Remove ${read} from the declarations unless you intentionally replace ${write}.`));
  for (const scope of config.required) if (!observedScopes.has(scope) && ![...observedScopes].some((s) => IMPLIED_SCOPES.get(s) === scope) && ![...IMPLIED_SCOPES.entries()].some(([write, read]) => write === scope && observedScopes.has(read))) findings.push(finding("SG-SCOPE-004", "low", "high", scope, import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), null, `No supported usage requiring ${scope} was evidenced.`, "No matching supported operation found", EVIDENCE_SOURCES.scopes, `Review whether ${scope} is still needed; static analysis cannot prove it is unused.`));
  for (const scope of config.optional) if (!observedScopes.has(scope)) findings.push(finding("SG-SCOPE-004", "low", "high", scope, import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), null, `No supported usage requiring optional scope ${scope} was evidenced.`, "No matching supported operation found", EVIDENCE_SOURCES.scopes, `Review the optional feature path; this result does not prove the scope is unused.`));
  if (unknown.length) findings.push(finding("SG-SCOPE-006", "info", "low", null, unknown[0].file, unknown[0].line, "Shopify-related code was found but could not be safely mapped to supported static evidence.", unknown.map((item) => item.reason).join("; "), EVIDENCE_SOURCES.scopes, "Review the unmapped code manually."));
  findings.sort((a, b) => `${a.severity}:${a.ruleId}:${a.file}:${a.line}`.localeCompare(`${b.severity}:${b.ruleId}:${b.file}:${b.line}`));
  return { tool: { name: "shopify-scope-guard", version: TOOL_VERSION }, evidence: { api: "admin-graphql", version: EVIDENCE_VERSION, source: EVIDENCE_SOURCES.versioning }, summary: { declaredRequired: config.required.length, declaredOptional: config.optional.length, evidenced: observedScopes.size, unknown: unknown.length, findingCount: findings.length }, scopes: { required: config.required, optional: config.optional }, observations: observations.map((o) => ({ operation: o.operation, scope: o.requires.anyOf, file: import_node_path2.default.relative(absoluteRoot, o.file).replaceAll(import_node_path2.default.sep, "/"), line: o.line })), findings, unknown, skipped };
}

// src/output/index.js
var rank = { info: 0, low: 1, medium: 2, high: 3 };
function toJson(report) {
  return JSON.stringify(report, null, 2) + "\n";
}
function toHuman(report, { showUnmapped = false } = {}) {
  const lines = ["Shopify Scope Guard", "", "Scope audit", "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", `Declared: required ${report.summary.declaredRequired}, optional ${report.summary.declaredOptional}`, `Observed: evidenced ${report.summary.evidenced}, unknown ${report.summary.unknown}`, `Findings: ${report.summary.findingCount}`, ""];
  for (const f of [...report.findings].sort((a, b) => rank[b.severity] - rank[a.severity])) {
    lines.push(`${f.severity.toUpperCase()} ${f.ruleId}${f.scope ? ` \u2014 ${f.scope}` : ""}`, `  ${f.explanation}`, `  Evidence: ${f.evidence}`, `  Source: ${f.source}`, `  Location: ${f.file ?? "repository"}${f.line ? `:${f.line}` : ""}`, `  Recommendation: ${f.remediation}`, "");
  }
  if (showUnmapped) for (const item of report.unknown) lines.push(`UNKNOWN ${item.file}${item.line ? ":" + item.line : ""}: ${item.reason}`);
  if (report.skipped?.length) lines.push(`Skipped analysis: ${report.skipped.length} file(s); inspect JSON and review manually.`);
  return lines.join("\n");
}
function toSarif(report) {
  return JSON.stringify({ version: "2.1.0", $schema: "https://json.schemastore.org/sarif-2.1.0.json", runs: [{ tool: { driver: { name: report.tool.name, version: report.tool.version, informationUri: "https://github.com/RexCode-Digital/shopify-scope-guard", rules: [...new Map(report.findings.map((f) => [f.ruleId, { id: f.ruleId, shortDescription: { text: f.explanation }, helpUri: f.source }])).values()] } }, results: report.findings.map((f) => ({ ruleId: f.ruleId, level: f.severity === "high" ? "error" : f.severity === "medium" ? "warning" : "note", message: { text: f.explanation }, locations: f.file ? [{ physicalLocation: { artifactLocation: { uri: f.file.split("/").map(encodeURIComponent).join("/") }, region: f.line ? { startLine: f.line } : void 0 } }] : void 0 })) }] }, null, 2) + "\n";
}

// src/policy.js
var rank2 = { info: 0, low: 1, medium: 2, high: 3 };
function validateOptions({ format = "human", failOn = "none" } = {}) {
  if (!["human", "json", "sarif"].includes(format)) throw new Error("format must be human, json, or sarif");
  if (!["none", "low", "medium", "high"].includes(failOn)) throw new Error("fail-on must be none, low, medium, or high");
}
function shouldFail(report, threshold = "none") {
  validateOptions({ failOn: threshold });
  return threshold !== "none" && report.findings.some((f) => rank2[f.severity] >= rank2[threshold]);
}

// src/action/index.js
var input = (name) => process.env[`INPUT_${name.toUpperCase().replaceAll("-", "_")}`] || "";
try {
  const format = input("format") || "human", threshold = input("fail-on") || "high";
  validateOptions({ format, failOn: threshold });
  if (input("show-unmapped") && !["true", "false"].includes(input("show-unmapped"))) throw new Error("show-unmapped must be true or false");
  const report = audit({ root: input("path") || ".", configPath: input("config") || void 0 });
  const rendered = format === "json" ? toJson(report) : format === "sarif" ? toSarif(report) : toHuman(report, { showUnmapped: input("show-unmapped") === "true" });
  const stop = (0, import_node_crypto.randomUUID)();
  console.log(`::stop-commands::${stop}
${rendered}
::${stop}::`);
  const directory = process.env.RUNNER_TEMP || process.cwd();
  const reportPath = import_node_path3.default.join(directory, `scope-guard-${(0, import_node_crypto.randomUUID)()}.json`);
  import_node_fs3.default.writeFileSync(reportPath, toJson(report));
  if (format === "sarif") import_node_fs3.default.writeFileSync(import_node_path3.default.join(directory, "scope-guard.sarif"), rendered);
  const counts = (severity) => report.findings.filter((f) => f.severity === severity).length;
  const failed = shouldFail(report, threshold);
  const values = { outcome: failed ? "failed" : "passed", "finding-count": report.findings.length, "high-count": counts("high"), "medium-count": counts("medium"), "low-count": counts("low"), "unknown-count": report.summary.unknown, "missing-scope-count": report.findings.filter((f) => ["SG-SCOPE-001", "SG-SCOPE-002"].includes(f.ruleId)).length, "redundant-scope-count": report.findings.filter((f) => f.ruleId === "SG-SCOPE-003").length, report: reportPath };
  if (process.env.GITHUB_OUTPUT) for (const [key, value] of Object.entries(values)) {
    const delimiter = (0, import_node_crypto.randomUUID)();
    import_node_fs3.default.appendFileSync(process.env.GITHUB_OUTPUT, `${key}<<${delimiter}
${value}
${delimiter}
`);
  }
  process.exitCode = failed ? 1 : 0;
} catch (error) {
  console.error(`Scope Guard scanner error: ${String(error.message).replace(/[\r\n]/g, " ")}`);
  process.exitCode = 2;
}
