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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
    var Parser2 = class {
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
    Parser2.END = ParserEND;
    Parser2.Error = ParserError;
    module2.exports = Parser2;
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
    function makeParserClass(Parser2) {
      class TOMLParser extends Parser2 {
        constructor() {
          super();
          this.ctx = this.obj = Table();
        }
        /* MATCH HELPER */
        atEndOfWord() {
          return this.char === CHAR_NUM || this.char === CTRL_I || this.char === CHAR_SP || this.atEndOfLine();
        }
        atEndOfLine() {
          return this.char === Parser2.END || this.char === CTRL_J || this.char === CTRL_M;
        }
        parseStart() {
          if (this.char === Parser2.END) {
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
          } else if (this.char === Parser2.END || this.char === CTRL_J) {
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
            if (this.char === Parser2.END || this.char === CTRL_J) {
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
          if (this.char === Parser2.END) {
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
            if (this.char === Parser2.END) {
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
            } else if (this.char === Parser2.END) {
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
            } else if (this.char === Parser2.END) {
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
          } else if (this.char === Parser2.END) {
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
          } else if (this.char === Parser2.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
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
          } else if (this.char === Parser2.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
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

// src/action/index.js
var import_node_fs3 = __toESM(require("node:fs"), 1);
var import_node_path3 = __toESM(require("node:path"), 1);
var import_node_crypto = require("node:crypto");

// src/version.js
var TOOL_VERSION = "0.4.0";

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
  return { required, optional: normalizedOptional, raw: { required: scopes, optional }, events: data.events ?? null, webhooks: data.webhooks ?? null };
}

// node_modules/graphql/jsutils/instanceOf.mjs
function prodInstanceOf(value, symbol) {
  return value?.__kind === symbol;
}
var instanceOf = prodInstanceOf;

// node_modules/graphql/jsutils/isObjectLike.mjs
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}

// node_modules/graphql/jsutils/invariant.mjs
function invariant(condition, message) {
  if (!condition) {
    throw new Error(message ?? "Unexpected invariant triggered.");
  }
}

// node_modules/graphql/language/location.mjs
var LineRegExp = /\r\n|[\n\r]/g;
function getLocation(source, position) {
  let lastLineStart = 0;
  let line = 1;
  for (const match of source.body.matchAll(LineRegExp)) {
    if (!(typeof match.index === "number"))
      invariant(false);
    if (match.index >= position) {
      break;
    }
    lastLineStart = match.index + match[0].length;
    line += 1;
  }
  return { line, column: position + 1 - lastLineStart };
}

// node_modules/graphql/language/printLocation.mjs
function printLocation(location) {
  return printSourceLocation(location.source, getLocation(location.source, location.start));
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

// node_modules/graphql/error/GraphQLError.mjs
var GraphQLError = class _GraphQLError extends Error {
  constructor(message, options = {}) {
    const { nodes, source, positions, path: path4, originalError, cause, extensions } = options;
    const hasCause = "cause" in options;
    const errorCause = hasCause ? cause : originalError;
    const errorOptions = hasCause || originalError != null ? { cause: errorCause } : void 0;
    super(message, errorOptions);
    this.name = "GraphQLError";
    this.path = path4 ?? void 0;
    const underlyingError = originalError ?? (cause instanceof Error ? cause : void 0);
    this.originalError = underlyingError;
    this.nodes = undefinedIfEmpty(Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0);
    const nodeLocations = undefinedIfEmpty(this.nodes?.map((node) => node.loc).filter((loc) => loc != null));
    this.source = source ?? nodeLocations?.[0]?.source;
    this.positions = positions ?? nodeLocations?.map((loc) => loc.start);
    this.locations = positions && source ? positions.map((pos) => getLocation(source, pos)) : nodeLocations?.map((loc) => getLocation(loc.source, loc.start));
    const originalExtensions = isObjectLike(underlyingError?.extensions) ? underlyingError.extensions : void 0;
    this.extensions = extensions ?? originalExtensions ?? /* @__PURE__ */ Object.create(null);
    Object.defineProperties(this, {
      message: {
        writable: true,
        enumerable: true
      },
      name: { enumerable: false },
      nodes: { enumerable: false },
      source: { enumerable: false },
      positions: { enumerable: false },
      originalError: { enumerable: false }
    });
    if (originalError?.stack != null) {
      Object.defineProperty(this, "stack", {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
    } else if (Error.captureStackTrace != null) {
      Error.captureStackTrace(this, _GraphQLError);
    } else {
      Object.defineProperty(this, "stack", {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let output = this.message;
    if (this.nodes) {
      for (const node of this.nodes) {
        if (node.loc) {
          output += "\n\n" + printLocation(node.loc);
        }
      }
    } else if (this.source && this.locations) {
      for (const location of this.locations) {
        output += "\n\n" + printSourceLocation(this.source, location);
      }
    }
    return output;
  }
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
function undefinedIfEmpty(array) {
  return array === void 0 || array.length === 0 ? void 0 : array;
}

// node_modules/graphql/language/ast.mjs
var Location = class {
  constructor(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return { start: this.start, end: this.end };
  }
};
var Token = class {
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
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
};
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
  FragmentArgument: ["name", "value"],
  FragmentSpread: [
    "name",
    "arguments",
    "directives"
  ],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "description",
    "name",
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
var kindValues = new Set(Object.keys(QueryDocumentKeys));
var OperationTypeNode = {
  QUERY: "query",
  MUTATION: "mutation",
  SUBSCRIPTION: "subscription"
};

// node_modules/graphql/language/kinds_.mjs
var kinds_exports = {};
__export(kinds_exports, {
  ARGUMENT: () => ARGUMENT,
  ARGUMENT_COORDINATE: () => ARGUMENT_COORDINATE,
  BOOLEAN: () => BOOLEAN,
  DIRECTIVE: () => DIRECTIVE,
  DIRECTIVE_ARGUMENT_COORDINATE: () => DIRECTIVE_ARGUMENT_COORDINATE,
  DIRECTIVE_COORDINATE: () => DIRECTIVE_COORDINATE,
  DIRECTIVE_DEFINITION: () => DIRECTIVE_DEFINITION,
  DIRECTIVE_EXTENSION: () => DIRECTIVE_EXTENSION,
  DOCUMENT: () => DOCUMENT,
  ENUM: () => ENUM,
  ENUM_TYPE_DEFINITION: () => ENUM_TYPE_DEFINITION,
  ENUM_TYPE_EXTENSION: () => ENUM_TYPE_EXTENSION,
  ENUM_VALUE_DEFINITION: () => ENUM_VALUE_DEFINITION,
  FIELD: () => FIELD,
  FIELD_DEFINITION: () => FIELD_DEFINITION,
  FLOAT: () => FLOAT2,
  FRAGMENT_ARGUMENT: () => FRAGMENT_ARGUMENT,
  FRAGMENT_DEFINITION: () => FRAGMENT_DEFINITION,
  FRAGMENT_SPREAD: () => FRAGMENT_SPREAD,
  INLINE_FRAGMENT: () => INLINE_FRAGMENT,
  INPUT_OBJECT_TYPE_DEFINITION: () => INPUT_OBJECT_TYPE_DEFINITION,
  INPUT_OBJECT_TYPE_EXTENSION: () => INPUT_OBJECT_TYPE_EXTENSION,
  INPUT_VALUE_DEFINITION: () => INPUT_VALUE_DEFINITION,
  INT: () => INT,
  INTERFACE_TYPE_DEFINITION: () => INTERFACE_TYPE_DEFINITION,
  INTERFACE_TYPE_EXTENSION: () => INTERFACE_TYPE_EXTENSION,
  LIST: () => LIST2,
  LIST_TYPE: () => LIST_TYPE,
  MEMBER_COORDINATE: () => MEMBER_COORDINATE,
  NAME: () => NAME,
  NAMED_TYPE: () => NAMED_TYPE,
  NON_NULL_TYPE: () => NON_NULL_TYPE,
  NULL: () => NULL,
  OBJECT: () => OBJECT,
  OBJECT_FIELD: () => OBJECT_FIELD,
  OBJECT_TYPE_DEFINITION: () => OBJECT_TYPE_DEFINITION,
  OBJECT_TYPE_EXTENSION: () => OBJECT_TYPE_EXTENSION,
  OPERATION_DEFINITION: () => OPERATION_DEFINITION,
  OPERATION_TYPE_DEFINITION: () => OPERATION_TYPE_DEFINITION,
  SCALAR_TYPE_DEFINITION: () => SCALAR_TYPE_DEFINITION,
  SCALAR_TYPE_EXTENSION: () => SCALAR_TYPE_EXTENSION,
  SCHEMA_DEFINITION: () => SCHEMA_DEFINITION,
  SCHEMA_EXTENSION: () => SCHEMA_EXTENSION,
  SELECTION_SET: () => SELECTION_SET,
  STRING: () => STRING,
  TYPE_COORDINATE: () => TYPE_COORDINATE,
  UNION_TYPE_DEFINITION: () => UNION_TYPE_DEFINITION,
  UNION_TYPE_EXTENSION: () => UNION_TYPE_EXTENSION,
  VARIABLE: () => VARIABLE,
  VARIABLE_DEFINITION: () => VARIABLE_DEFINITION
});
var NAME = "Name";
var DOCUMENT = "Document";
var OPERATION_DEFINITION = "OperationDefinition";
var VARIABLE_DEFINITION = "VariableDefinition";
var SELECTION_SET = "SelectionSet";
var FIELD = "Field";
var ARGUMENT = "Argument";
var FRAGMENT_ARGUMENT = "FragmentArgument";
var FRAGMENT_SPREAD = "FragmentSpread";
var INLINE_FRAGMENT = "InlineFragment";
var FRAGMENT_DEFINITION = "FragmentDefinition";
var VARIABLE = "Variable";
var INT = "IntValue";
var FLOAT2 = "FloatValue";
var STRING = "StringValue";
var BOOLEAN = "BooleanValue";
var NULL = "NullValue";
var ENUM = "EnumValue";
var LIST2 = "ListValue";
var OBJECT = "ObjectValue";
var OBJECT_FIELD = "ObjectField";
var DIRECTIVE = "Directive";
var NAMED_TYPE = "NamedType";
var LIST_TYPE = "ListType";
var NON_NULL_TYPE = "NonNullType";
var SCHEMA_DEFINITION = "SchemaDefinition";
var OPERATION_TYPE_DEFINITION = "OperationTypeDefinition";
var SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition";
var OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition";
var FIELD_DEFINITION = "FieldDefinition";
var INPUT_VALUE_DEFINITION = "InputValueDefinition";
var INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition";
var UNION_TYPE_DEFINITION = "UnionTypeDefinition";
var ENUM_TYPE_DEFINITION = "EnumTypeDefinition";
var ENUM_VALUE_DEFINITION = "EnumValueDefinition";
var INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition";
var DIRECTIVE_DEFINITION = "DirectiveDefinition";
var SCHEMA_EXTENSION = "SchemaExtension";
var DIRECTIVE_EXTENSION = "DirectiveExtension";
var SCALAR_TYPE_EXTENSION = "ScalarTypeExtension";
var OBJECT_TYPE_EXTENSION = "ObjectTypeExtension";
var INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension";
var UNION_TYPE_EXTENSION = "UnionTypeExtension";
var ENUM_TYPE_EXTENSION = "EnumTypeExtension";
var INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
var TYPE_COORDINATE = "TypeCoordinate";
var MEMBER_COORDINATE = "MemberCoordinate";
var ARGUMENT_COORDINATE = "ArgumentCoordinate";
var DIRECTIVE_COORDINATE = "DirectiveCoordinate";
var DIRECTIVE_ARGUMENT_COORDINATE = "DirectiveArgumentCoordinate";

// node_modules/graphql/jsutils/devAssert.mjs
function devAssert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// node_modules/graphql/language/characterClasses.mjs
function isWhiteSpace(code) {
  return code === 9 || code === 32;
}
function isDigit2(code) {
  return code >= 48 && code <= 57;
}
function isLetter(code) {
  return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function isNameStart(code) {
  return isLetter(code) || code === 95;
}
function isNameContinue(code) {
  return isLetter(code) || isDigit2(code) || code === 95;
}

// node_modules/graphql/language/blockString.mjs
function dedentBlockStringLines(lines) {
  let commonIndent = Number.MAX_SAFE_INTEGER;
  let firstNonEmptyLine = null;
  let lastNonEmptyLine = -1;
  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    const indent = leadingWhitespace(line);
    if (indent === line.length) {
      continue;
    }
    firstNonEmptyLine ??= i;
    lastNonEmptyLine = i;
    if (i !== 0 && indent < commonIndent) {
      commonIndent = indent;
    }
  }
  return lines.map((line, i) => i === 0 ? line : line.slice(commonIndent)).slice(firstNonEmptyLine ?? 0, lastNonEmptyLine + 1);
}
function leadingWhitespace(str) {
  let i = 0;
  while (i < str.length && isWhiteSpace(str.charCodeAt(i))) {
    ++i;
  }
  return i;
}

// node_modules/graphql/language/directiveLocation.mjs
var DirectiveLocation = {
  QUERY: "QUERY",
  MUTATION: "MUTATION",
  SUBSCRIPTION: "SUBSCRIPTION",
  FIELD: "FIELD",
  FRAGMENT_DEFINITION: "FRAGMENT_DEFINITION",
  FRAGMENT_SPREAD: "FRAGMENT_SPREAD",
  INLINE_FRAGMENT: "INLINE_FRAGMENT",
  VARIABLE_DEFINITION: "VARIABLE_DEFINITION",
  FRAGMENT_VARIABLE_DEFINITION: "FRAGMENT_VARIABLE_DEFINITION",
  SCHEMA: "SCHEMA",
  SCALAR: "SCALAR",
  OBJECT: "OBJECT",
  FIELD_DEFINITION: "FIELD_DEFINITION",
  ARGUMENT_DEFINITION: "ARGUMENT_DEFINITION",
  INTERFACE: "INTERFACE",
  UNION: "UNION",
  ENUM: "ENUM",
  ENUM_VALUE: "ENUM_VALUE",
  INPUT_OBJECT: "INPUT_OBJECT",
  INPUT_FIELD_DEFINITION: "INPUT_FIELD_DEFINITION",
  DIRECTIVE_DEFINITION: "DIRECTIVE_DEFINITION"
};

// node_modules/graphql/error/syntaxError.mjs
function syntaxError(source, position, description) {
  return new GraphQLError(`Syntax Error: ${description}`, {
    source,
    positions: [position]
  });
}

// node_modules/graphql/diagnostics.mjs
function resolveDiagnosticsChannel() {
  let dc2;
  try {
    const processRef = globalThis.process;
    if (typeof processRef?.getBuiltinModule === "function") {
      dc2 = processRef.getBuiltinModule("node:diagnostics_channel");
    }
  } catch {
  }
  return dc2;
}
var dc = resolveDiagnosticsChannel();
var parseChannel = dc?.tracingChannel("graphql:parse");
var validateChannel = dc?.tracingChannel("graphql:validate");
var executeChannel = dc?.tracingChannel("graphql:execute");
var executeVariableCoercionChannel = dc?.tracingChannel("graphql:execute:variableCoercion");
var executeRootSelectionSetChannel = dc?.tracingChannel("graphql:execute:rootSelectionSet");
var subscribeChannel = dc?.tracingChannel("graphql:subscribe");
var resolveChannel = dc?.tracingChannel("graphql:resolve");
var SUB_CHANNEL_KEYS = ["start", "end", "asyncStart", "asyncEnd", "error"];
function shouldTrace(channel) {
  if (channel == null) {
    return false;
  }
  const aggregate = channel.hasSubscribers;
  if (aggregate !== void 0) {
    return aggregate;
  }
  for (const key of SUB_CHANNEL_KEYS) {
    if (channel[key].hasSubscribers) {
      return true;
    }
  }
  return false;
}

// node_modules/graphql/language/tokenKind.mjs
var TokenKind = {
  SOF: "<SOF>",
  EOF: "<EOF>",
  BANG: "!",
  DOLLAR: "$",
  AMP: "&",
  PAREN_L: "(",
  PAREN_R: ")",
  DOT: ".",
  SPREAD: "...",
  COLON: ":",
  EQUALS: "=",
  AT: "@",
  BRACKET_L: "[",
  BRACKET_R: "]",
  BRACE_L: "{",
  PIPE: "|",
  BRACE_R: "}",
  NAME: "Name",
  INT: "Int",
  FLOAT: "Float",
  STRING: "String",
  BLOCK_STRING: "BlockString",
  COMMENT: "Comment"
};

// node_modules/graphql/language/lexer.mjs
var Lexer = class {
  constructor(source) {
    const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  advance() {
    this.lastToken = this.token;
    const token = this.token = this.lookahead();
    return token;
  }
  lookahead() {
    let token = this.token;
    if (token.kind !== TokenKind.EOF) {
      do {
        if (token.next) {
          token = token.next;
        } else {
          const nextToken = readNextToken(this, token.end);
          token.next = nextToken;
          nextToken.prev = token;
          token = nextToken;
        }
      } while (token.kind === TokenKind.COMMENT);
    }
    return token;
  }
};
function isPunctuatorTokenKind(kind) {
  return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.DOT || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
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
    return TokenKind.EOF;
  } else if (code >= 32 && code <= 126) {
    const char = String.fromCodePoint(code);
    return char === '"' ? `'"'` : `"${char}"`;
  }
  return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
}
function createToken(lexer, kind, start, end, value) {
  const line = lexer.line;
  const col = 1 + start - lexer.lineStart;
  return new Token(kind, start, end, line, col, value);
}
function readNextToken(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    switch (code) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++position;
        continue;
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
      case 35:
        return readComment(lexer, position);
      case 33:
        return createToken(lexer, TokenKind.BANG, position, position + 1);
      case 36:
        return createToken(lexer, TokenKind.DOLLAR, position, position + 1);
      case 38:
        return createToken(lexer, TokenKind.AMP, position, position + 1);
      case 40:
        return createToken(lexer, TokenKind.PAREN_L, position, position + 1);
      case 41:
        return createToken(lexer, TokenKind.PAREN_R, position, position + 1);
      case 46: {
        const nextCode = body.charCodeAt(position + 1);
        if (nextCode === 46 && body.charCodeAt(position + 2) === 46) {
          return createToken(lexer, TokenKind.SPREAD, position, position + 3);
        }
        if (nextCode === 46) {
          throw syntaxError(lexer.source, position, 'Unexpected "..", did you mean "..."?');
        } else if (isDigit2(nextCode)) {
          const digits = lexer.source.body.slice(position + 1, readDigits(lexer, position + 1, nextCode));
          throw syntaxError(lexer.source, position, `Invalid number, expected digit before ".", did you mean "0.${digits}"?`);
        }
        break;
      }
      case 58:
        return createToken(lexer, TokenKind.COLON, position, position + 1);
      case 61:
        return createToken(lexer, TokenKind.EQUALS, position, position + 1);
      case 64:
        return createToken(lexer, TokenKind.AT, position, position + 1);
      case 91:
        return createToken(lexer, TokenKind.BRACKET_L, position, position + 1);
      case 93:
        return createToken(lexer, TokenKind.BRACKET_R, position, position + 1);
      case 123:
        return createToken(lexer, TokenKind.BRACE_L, position, position + 1);
      case 124:
        return createToken(lexer, TokenKind.PIPE, position, position + 1);
      case 125:
        return createToken(lexer, TokenKind.BRACE_R, position, position + 1);
      case 34:
        if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
          return readBlockString(lexer, position);
        }
        return readString(lexer, position);
    }
    if (isDigit2(code) || code === 45) {
      return readNumber(lexer, position, code);
    }
    if (isNameStart(code)) {
      return readName(lexer, position);
    }
    throw syntaxError(lexer.source, position, code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer, position)}.` : `Invalid character: ${printCodePointAt(lexer, position)}.`);
  }
  return createToken(lexer, TokenKind.EOF, bodyLength, bodyLength);
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
  return createToken(lexer, TokenKind.COMMENT, start, position, body.slice(start + 1, position));
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
    if (isDigit2(code)) {
      throw syntaxError(lexer.source, position, `Invalid number, unexpected digit after 0: ${printCodePointAt(lexer, position)}.`);
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
  if (code === 46 || isNameStart(code)) {
    throw syntaxError(lexer.source, position, `Invalid number, expected digit but got: ${printCodePointAt(lexer, position)}.`);
  }
  return createToken(lexer, isFloat2 ? TokenKind.FLOAT : TokenKind.INT, start, position, body.slice(start, position));
}
function readDigits(lexer, start, firstCode) {
  if (!isDigit2(firstCode)) {
    throw syntaxError(lexer.source, start, `Invalid number, expected digit but got: ${printCodePointAt(lexer, start)}.`);
  }
  const body = lexer.source.body;
  let position = start + 1;
  while (isDigit2(body.charCodeAt(position))) {
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
      return createToken(lexer, TokenKind.STRING, start, position + 1, value);
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
      throw syntaxError(lexer.source, position, `Invalid character within String: ${printCodePointAt(lexer, position)}.`);
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
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
      return { value: String.fromCodePoint(point), size };
    }
    point = point << 4 | readHexDigit(code);
    if (point < 0) {
      break;
    }
  }
  throw syntaxError(lexer.source, position, `Invalid Unicode escape sequence: "${body.slice(position, position + size)}".`);
}
function readEscapedUnicodeFixedWidth(lexer, position) {
  const body = lexer.source.body;
  const code = read16BitHexCode(body, position + 2);
  if (isUnicodeScalarValue(code)) {
    return { value: String.fromCodePoint(code), size: 6 };
  }
  if (isLeadingSurrogate(code)) {
    if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
      const trailingCode = read16BitHexCode(body, position + 8);
      if (isTrailingSurrogate(trailingCode)) {
        return { value: String.fromCodePoint(code, trailingCode), size: 12 };
      }
    }
  }
  throw syntaxError(lexer.source, position, `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`);
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
      return { value: '"', size: 2 };
    case 92:
      return { value: "\\", size: 2 };
    case 47:
      return { value: "/", size: 2 };
    case 98:
      return { value: "\b", size: 2 };
    case 102:
      return { value: "\f", size: 2 };
    case 110:
      return { value: "\n", size: 2 };
    case 114:
      return { value: "\r", size: 2 };
    case 116:
      return { value: "	", size: 2 };
  }
  throw syntaxError(lexer.source, position, `Invalid character escape sequence: "${body.slice(position, position + 2)}".`);
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
      const token = createToken(lexer, TokenKind.BLOCK_STRING, start, position + 3, dedentBlockStringLines(blockLines).join("\n"));
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
      throw syntaxError(lexer.source, position, `Invalid character within String: ${printCodePointAt(lexer, position)}.`);
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
function readName(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (isNameContinue(code)) {
      ++position;
    } else {
      break;
    }
  }
  return createToken(lexer, TokenKind.NAME, start, position, body.slice(start, position));
}

// node_modules/graphql/language/source.mjs
var sourceSymbol = /* @__PURE__ */ Symbol("Source");
var Source = class {
  constructor(body, name = "GraphQL request", locationOffset = { line: 1, column: 1 }) {
    this.__kind = sourceSymbol;
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    if (!(this.locationOffset.line > 0))
      devAssert(false, "line in locationOffset is 1-indexed and must be positive.");
    if (!(this.locationOffset.column > 0))
      devAssert(false, "column in locationOffset is 1-indexed and must be positive.");
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
};
function isSource(source) {
  return instanceOf(source, sourceSymbol, Source);
}

// node_modules/graphql/language/parser.mjs
function parse(source, options) {
  return shouldTrace(parseChannel) ? parseChannel.traceSync(() => parseImpl(source, options), { source }) : parseImpl(source, options);
}
function parseImpl(source, options) {
  const parser = new Parser(source, options);
  const document = parser.parseDocument();
  Object.defineProperty(document, "tokenCount", {
    enumerable: false,
    value: parser.tokenCount
  });
  return document;
}
var Parser = class {
  constructor(source, options = {}) {
    const { lexer, ..._options } = options;
    if (lexer) {
      this._lexer = lexer;
    } else {
      const sourceObj = isSource(source) ? source : new Source(source);
      this._lexer = new Lexer(sourceObj);
    }
    this._options = _options;
    this._tokenCounter = 0;
  }
  get tokenCount() {
    return this._tokenCounter;
  }
  parseName() {
    const token = this.expectToken(TokenKind.NAME);
    return this.node(token, {
      kind: kinds_exports.NAME,
      value: token.value
    });
  }
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: kinds_exports.DOCUMENT,
      definitions: this.many(TokenKind.SOF, this.parseDefinition, TokenKind.EOF)
    });
  }
  parseDefinition() {
    if (this.peek(TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    }
    const hasDescription = this.peekDescription();
    const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
    if (hasDescription && keywordToken.kind === TokenKind.BRACE_L) {
      throw syntaxError(this._lexer.source, this._lexer.token.start, "Unexpected description, descriptions are not supported on shorthand queries.");
    }
    if (keywordToken.kind === TokenKind.NAME) {
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
        throw syntaxError(this._lexer.source, this._lexer.token.start, "Unexpected description, only GraphQL definitions support descriptions.");
      }
      switch (keywordToken.value) {
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  parseOperationDefinition() {
    const start = this._lexer.token;
    if (this.peek(TokenKind.BRACE_L)) {
      return this.node(start, {
        kind: kinds_exports.OPERATION_DEFINITION,
        operation: OperationTypeNode.QUERY,
        description: void 0,
        name: void 0,
        variableDefinitions: void 0,
        directives: void 0,
        selectionSet: this.parseSelectionSet()
      });
    }
    const description = this.parseDescription();
    const operation = this.parseOperationType();
    let name;
    if (this.peek(TokenKind.NAME)) {
      name = this.parseName();
    }
    return this.node(start, {
      kind: kinds_exports.OPERATION_DEFINITION,
      operation,
      description,
      name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseOperationType() {
    const operationToken = this.expectToken(TokenKind.NAME);
    switch (operationToken.value) {
      case "query":
        return OperationTypeNode.QUERY;
      case "mutation":
        return OperationTypeNode.MUTATION;
      case "subscription":
        return OperationTypeNode.SUBSCRIPTION;
    }
    throw this.unexpected(operationToken);
  }
  parseVariableDefinitions() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseVariableDefinition, TokenKind.PAREN_R);
  }
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: kinds_exports.VARIABLE_DEFINITION,
      description: this.parseDescription(),
      variable: this.parseVariable(),
      type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  parseVariable() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.DOLLAR);
    return this.node(start, {
      kind: kinds_exports.VARIABLE,
      name: this.parseName()
    });
  }
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: kinds_exports.SELECTION_SET,
      selections: this.many(TokenKind.BRACE_L, this.parseSelection, TokenKind.BRACE_R)
    });
  }
  parseSelection() {
    return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  }
  parseField() {
    const start = this._lexer.token;
    const nameOrAlias = this.parseName();
    let alias;
    let name;
    if (this.expectOptionalToken(TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }
    return this.node(start, {
      kind: kinds_exports.FIELD,
      alias,
      name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  parseArguments(isConst) {
    const item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  parseFragmentArguments() {
    const item = this.parseFragmentArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  parseArgument(isConst = false) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: kinds_exports.ARGUMENT,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  parseConstArgument() {
    return this.parseArgument(true);
  }
  parseFragmentArgument() {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: kinds_exports.FRAGMENT_ARGUMENT,
      name,
      value: this.parseValueLiteral(false)
    });
  }
  parseFragment() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.SPREAD);
    const hasTypeCondition = this.expectOptionalKeyword("on");
    if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
      const name = this.parseFragmentName();
      if (this.peek(TokenKind.PAREN_L) && this._options.experimentalFragmentArguments) {
        return this.node(start, {
          kind: kinds_exports.FRAGMENT_SPREAD,
          name,
          arguments: this.parseFragmentArguments(),
          directives: this.parseDirectives(false)
        });
      }
      return this.node(start, {
        kind: kinds_exports.FRAGMENT_SPREAD,
        name,
        directives: this.parseDirectives(false)
      });
    }
    return this.node(start, {
      kind: kinds_exports.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseFragmentDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("fragment");
    if (this._options.experimentalFragmentArguments === true) {
      return this.node(start, {
        kind: kinds_exports.FRAGMENT_DEFINITION,
        description,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    return this.node(start, {
      kind: kinds_exports.FRAGMENT_DEFINITION,
      description,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseFragmentName() {
    if (this._lexer.token.value === "on") {
      throw this.unexpected();
    }
    return this.parseName();
  }
  parseValueLiteral(isConst) {
    const token = this._lexer.token;
    switch (token.kind) {
      case TokenKind.BRACKET_L:
        return this.parseList(isConst);
      case TokenKind.BRACE_L:
        return this.parseObject(isConst);
      case TokenKind.INT:
        this.advanceLexer();
        return this.node(token, {
          kind: kinds_exports.INT,
          value: token.value
        });
      case TokenKind.FLOAT:
        this.advanceLexer();
        return this.node(token, {
          kind: kinds_exports.FLOAT,
          value: token.value
        });
      case TokenKind.STRING:
      case TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();
      case TokenKind.NAME:
        this.advanceLexer();
        switch (token.value) {
          case "true":
            return this.node(token, {
              kind: kinds_exports.BOOLEAN,
              value: true
            });
          case "false":
            return this.node(token, {
              kind: kinds_exports.BOOLEAN,
              value: false
            });
          case "null":
            return this.node(token, { kind: kinds_exports.NULL });
          default:
            return this.node(token, {
              kind: kinds_exports.ENUM,
              value: token.value
            });
        }
      case TokenKind.DOLLAR:
        if (isConst) {
          this.expectToken(TokenKind.DOLLAR);
          if (this._lexer.token.kind === TokenKind.NAME) {
            const varName = this._lexer.token.value;
            throw syntaxError(this._lexer.source, token.start, `Unexpected variable "$${varName}" in constant value.`);
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
      kind: kinds_exports.STRING,
      value: token.value,
      block: token.kind === TokenKind.BLOCK_STRING
    });
  }
  parseList(isConst) {
    const item = () => this.parseValueLiteral(isConst);
    return this.node(this._lexer.token, {
      kind: kinds_exports.LIST,
      values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R)
    });
  }
  parseObject(isConst) {
    const item = () => this.parseObjectField(isConst);
    return this.node(this._lexer.token, {
      kind: kinds_exports.OBJECT,
      fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R)
    });
  }
  parseObjectField(isConst) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: kinds_exports.OBJECT_FIELD,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  parseDirectives(isConst) {
    const directives = [];
    while (this.peek(TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }
    if (directives.length) {
      return directives;
    }
    return void 0;
  }
  parseConstDirectives() {
    return this.parseDirectives(true);
  }
  parseDirective(isConst) {
    const start = this._lexer.token;
    this.expectToken(TokenKind.AT);
    return this.node(start, {
      kind: kinds_exports.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst)
    });
  }
  parseTypeReference() {
    const start = this._lexer.token;
    let type;
    if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
      const innerType = this.parseTypeReference();
      this.expectToken(TokenKind.BRACKET_R);
      type = this.node(start, {
        kind: kinds_exports.LIST_TYPE,
        type: innerType
      });
    } else {
      type = this.parseNamedType();
    }
    if (this.expectOptionalToken(TokenKind.BANG)) {
      return this.node(start, {
        kind: kinds_exports.NON_NULL_TYPE,
        type
      });
    }
    return type;
  }
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: kinds_exports.NAMED_TYPE,
      name: this.parseName()
    });
  }
  peekDescription() {
    return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
  }
  parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  }
  parseSchemaDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.many(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    return this.node(start, {
      kind: kinds_exports.SCHEMA_DEFINITION,
      description,
      directives,
      operationTypes
    });
  }
  parseOperationTypeDefinition() {
    const start = this._lexer.token;
    const operation = this.parseOperationType();
    this.expectToken(TokenKind.COLON);
    const type = this.parseNamedType();
    return this.node(start, {
      kind: kinds_exports.OPERATION_TYPE_DEFINITION,
      operation,
      type
    });
  }
  parseScalarTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: kinds_exports.SCALAR_TYPE_DEFINITION,
      description,
      name,
      directives
    });
  }
  parseObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: kinds_exports.OBJECT_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(TokenKind.AMP, this.parseNamedType) : void 0;
  }
  parseFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseFieldDefinition, TokenKind.BRACE_R);
  }
  parseFieldDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: kinds_exports.FIELD_DEFINITION,
      description,
      name,
      arguments: args,
      type,
      directives
    });
  }
  parseArgumentDefs() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseInputValueDef, TokenKind.PAREN_R);
  }
  parseInputValueDef() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    let defaultValue;
    if (this.expectOptionalToken(TokenKind.EQUALS)) {
      defaultValue = this.parseConstValueLiteral();
    }
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: kinds_exports.INPUT_VALUE_DEFINITION,
      description,
      name,
      type,
      defaultValue,
      directives
    });
  }
  parseInterfaceTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: kinds_exports.INTERFACE_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseUnionTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    return this.node(start, {
      kind: kinds_exports.UNION_TYPE_DEFINITION,
      description,
      name,
      directives,
      types
    });
  }
  parseUnionMemberTypes() {
    return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : void 0;
  }
  parseEnumTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    return this.node(start, {
      kind: kinds_exports.ENUM_TYPE_DEFINITION,
      description,
      name,
      directives,
      values
    });
  }
  parseEnumValuesDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseEnumValueDefinition, TokenKind.BRACE_R);
  }
  parseEnumValueDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseEnumValueName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: kinds_exports.ENUM_VALUE_DEFINITION,
      description,
      name,
      directives
    });
  }
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
      throw syntaxError(this._lexer.source, this._lexer.token.start, `${getTokenDesc(this._lexer.token)} is reserved and cannot be used for an enum value.`);
    }
    return this.parseName();
  }
  parseInputObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    return this.node(start, {
      kind: kinds_exports.INPUT_OBJECT_TYPE_DEFINITION,
      description,
      name,
      directives,
      fields
    });
  }
  parseInputFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseInputValueDef, TokenKind.BRACE_R);
  }
  parseTypeSystemExtension() {
    const keywordToken = this._lexer.lookahead();
    if (keywordToken.kind === TokenKind.NAME) {
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
          return this.parseDirectiveExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  parseSchemaExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.optionalMany(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    if (directives === void 0 && operationTypes === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.SCHEMA_EXTENSION,
      directives,
      operationTypes
    });
  }
  parseScalarTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    if (directives === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.SCALAR_TYPE_EXTENSION,
      name,
      directives
    });
  }
  parseObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces === void 0 && directives === void 0 && fields === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.OBJECT_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseInterfaceTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces === void 0 && directives === void 0 && fields === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.INTERFACE_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseUnionTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    if (directives === void 0 && types === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.UNION_TYPE_EXTENSION,
      name,
      directives,
      types
    });
  }
  parseEnumTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    if (directives === void 0 && values === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.ENUM_TYPE_EXTENSION,
      name,
      directives,
      values
    });
  }
  parseInputObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    if (directives === void 0 && fields === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.INPUT_OBJECT_TYPE_EXTENSION,
      name,
      directives,
      fields
    });
  }
  parseDirectiveExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("directive");
    this.expectToken(TokenKind.AT);
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    if (directives === void 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: kinds_exports.DIRECTIVE_EXTENSION,
      name,
      directives
    });
  }
  parseDirectiveDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("directive");
    this.expectToken(TokenKind.AT);
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    const directives = this.parseConstDirectives();
    const repeatable = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const locations = this.parseDirectiveLocations();
    return this.node(start, {
      kind: kinds_exports.DIRECTIVE_DEFINITION,
      description,
      name,
      arguments: args,
      directives,
      repeatable,
      locations
    });
  }
  parseDirectiveLocations() {
    return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
  }
  parseDirectiveLocation() {
    const start = this._lexer.token;
    const name = this.parseName();
    if (Object.hasOwn(DirectiveLocation, name.value)) {
      return name;
    }
    throw this.unexpected(start);
  }
  parseSchemaCoordinate() {
    const start = this._lexer.token;
    const ofDirective = this.expectOptionalToken(TokenKind.AT);
    const name = this.parseName();
    let memberName;
    if (!ofDirective && this.expectOptionalToken(TokenKind.DOT)) {
      memberName = this.parseName();
    }
    let argumentName;
    if ((ofDirective || memberName) && this.expectOptionalToken(TokenKind.PAREN_L)) {
      argumentName = this.parseName();
      this.expectToken(TokenKind.COLON);
      this.expectToken(TokenKind.PAREN_R);
    }
    if (ofDirective) {
      if (argumentName) {
        return this.node(start, {
          kind: kinds_exports.DIRECTIVE_ARGUMENT_COORDINATE,
          name,
          argumentName
        });
      }
      return this.node(start, {
        kind: kinds_exports.DIRECTIVE_COORDINATE,
        name
      });
    } else if (memberName) {
      if (argumentName) {
        return this.node(start, {
          kind: kinds_exports.ARGUMENT_COORDINATE,
          name,
          fieldName: memberName,
          argumentName
        });
      }
      return this.node(start, {
        kind: kinds_exports.MEMBER_COORDINATE,
        name,
        memberName
      });
    }
    return this.node(start, {
      kind: kinds_exports.TYPE_COORDINATE,
      name
    });
  }
  node(startToken, node) {
    if (this._options.noLocation !== true) {
      node.loc = new Location(startToken, this._lexer.lastToken, this._lexer.source);
    }
    return node;
  }
  peek(kind) {
    return this._lexer.token.kind === kind;
  }
  expectToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this.advanceLexer();
      return token;
    }
    throw syntaxError(this._lexer.source, token.start, `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`);
  }
  expectOptionalToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this.advanceLexer();
      return true;
    }
    return false;
  }
  expectKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this.advanceLexer();
    } else {
      throw syntaxError(this._lexer.source, token.start, `Expected "${value}", found ${getTokenDesc(token)}.`);
    }
  }
  expectOptionalKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this.advanceLexer();
      return true;
    }
    return false;
  }
  unexpected(atToken) {
    const token = atToken ?? this._lexer.token;
    return syntaxError(this._lexer.source, token.start, `Unexpected ${getTokenDesc(token)}.`);
  }
  any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }
    return nodes;
  }
  optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    return void 0;
  }
  many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));
    return nodes;
  }
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
    if (token.kind !== TokenKind.EOF) {
      ++this._tokenCounter;
      if (maxTokens !== void 0 && this._tokenCounter > maxTokens) {
        throw syntaxError(this._lexer.source, token.start, `Document contains more than ${maxTokens} tokens. Parsing aborted.`);
      }
    }
  }
};
function getTokenDesc(token) {
  const value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
}
function getTokenKindDesc(kind) {
  return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
}

// src/graphql/index.js
function parseGraphQL(source, file, lineOffset = 0) {
  const document = parse(source, { noLocation: false, maxTokens: 5e4 });
  const fragments = new Map(document.definitions.filter((d) => d.kind === kinds_exports.FRAGMENT_DEFINITION).map((d) => [d.name.value, d]));
  let visited = 0;
  const collectFields = (selectionSet, parentPath = "", stack = []) => (selectionSet?.selections ?? []).flatMap((selection) => {
    if (++visited > 5e4) throw new Error("GraphQL selection limit exceeded");
    if (selection.kind === kinds_exports.INLINE_FRAGMENT) return collectFields(selection.selectionSet, parentPath, stack);
    if (selection.kind === kinds_exports.FRAGMENT_SPREAD) {
      const name = selection.name.value;
      if (stack.includes(name) || !fragments.has(name)) throw new Error("Unresolved or cyclic GraphQL fragment");
      return collectFields(fragments.get(name).selectionSet, parentPath, [...stack, name]);
    }
    const fieldPath = parentPath ? `${parentPath}.${selection.name.value}` : selection.name.value;
    return [{ name: selection.name.value, path: fieldPath, line: (selection.loc?.startToken?.line ?? 1) + lineOffset, column: selection.loc?.startToken?.column ?? 1 }, ...collectFields(selection.selectionSet, fieldPath, stack)];
  });
  return document.definitions.filter((d) => d.kind === kinds_exports.OPERATION_DEFINITION).map((node) => ({ type: node.operation, name: node.name?.value ?? null, fields: collectFields(node.selectionSet), file, line: (node.loc?.startToken?.line ?? 1) + lineOffset }));
}
function maskComments(source) {
  let output = "", quote = "", escaped = false;
  for (let index = 0; index < source.length; index++) {
    const character = source[index], next = source[index + 1];
    if (quote) {
      output += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'" || character === String.fromCharCode(96)) {
      quote = character;
      output += character;
      continue;
    }
    if (character === "/" && next === "/") {
      output += "  ";
      index++;
      while (index + 1 < source.length && source[index + 1] !== "\n") {
        index++;
        output += " ";
      }
      continue;
    }
    if (character === "/" && next === "*") {
      output += "  ";
      index++;
      while (index + 1 < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        index++;
        output += source[index] === "\n" ? "\n" : " ";
      }
      if (index + 1 < source.length) {
        index++;
        output += " ";
      }
      continue;
    }
    output += character;
  }
  return output;
}
function extractGraphQL(text, file) {
  const documents = [];
  if (/\.(graphql|gql)$/i.test(file)) documents.push({ offset: 0, source: text, end: text.length });
  else {
    const patterns = [/#graphql\s*([\s\S]*?)(?=`)/g, /(?:graphql|gql)\s*(?:\(\s*)?`([\s\S]*?)`/g, /query\s*[:=]\s*`([\s\S]*?)`/g];
    for (const pattern of patterns) for (const match of text.matchAll(pattern)) {
      const raw = match[1], rawOffset = match.index + match[0].indexOf(raw);
      const prefix = raw.match(/^#graphql\s*/)?.[0] ?? "";
      const source = raw.slice(prefix.length), offset = rawOffset + prefix.length;
      if (!documents.some((document) => document.source === source)) documents.push({ offset, source, end: offset + source.length });
    }
  }
  const result = [];
  for (const document of documents) {
    const lineOffset = text.slice(0, document.offset).split("\n").length - 1;
    let sourceContext = "";
    if (!/\.(graphql|gql)$/i.test(file)) {
      const templateStart = text.lastIndexOf("`", document.offset);
      const templateEnd = text.indexOf("`", document.end);
      if (templateStart >= 0 && templateEnd >= 0) {
        const statementStart = Math.max(text.lastIndexOf(";", templateStart) + 1, templateStart - 180);
        const before = text.slice(statementStart, templateStart);
        sourceContext = maskComments(before);
      }
    }
    try {
      result.push(...parseGraphQL(document.source, file, lineOffset).map((operation) => ({
        ...operation,
        sourceContext
      })));
    } catch {
      result.push({ type: "unknown", name: null, fields: [], file, line: text.slice(0, document.offset).split("\n").length, parseError: true, sourceContext: "" });
    }
  }
  return result;
}

// src/evidence/registry.js
var EVIDENCE_VERSION = "2026-10";
var API_VERSION_INTELLIGENCE = Object.freeze({
  latestStable: "2026-10",
  releaseCandidate: "2027-01",
  verifiedAt: "2026-10-21",
  statuses: Object.freeze({
    "2025-04": "unsupported",
    "2025-07": "unsupported",
    "2025-10": "stable",
    "2026-01": "stable",
    "2026-04": "stable",
    "2026-07": "stable",
    "2026-10": "stable",
    "2027-01": "release-candidate",
    unstable: "unstable"
  }),
  accessibleUntil: Object.freeze({ "2025-10": "2026-10-16T15:00:00Z" }),
  source: "https://shopify.dev/docs/api/usage/versioning"
});
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
var CLASSIC_WEBHOOK_SOURCE = "https://shopify.dev/docs/api/admin-graphql/2026-10/enums/WebhookSubscriptionTopic";
var classicWebhookTopic = (scopes, note) => Object.freeze({
  ruleId: "SG-SCOPE-001",
  apiSurface: "classic-webhook",
  scopes: Object.freeze(scopes),
  apiVersions: Object.freeze(["2026-10"]),
  evidenceVersion: "2026-10",
  lastVerified: "2026-10-21",
  confidence: "high",
  source: CLASSIC_WEBHOOK_SOURCE,
  note
});
var CLASSIC_WEBHOOK_TOPIC_EVIDENCE = Object.freeze({
  "products/update": classicWebhookTopic(["read_products"], "Shopify documents read_products for this topic."),
  "orders/create": classicWebhookTopic(["read_orders", "read_marketplace_orders"], "Shopify documents either read_orders or read_marketplace_orders for this topic.")
});
var IMPLIED_SCOPES = /* @__PURE__ */ new Map([
  ["write_products", "read_products"],
  ["write_orders", "read_orders"],
  ["write_customers", "read_customers"],
  ["write_marketplace_orders", "read_marketplace_orders"],
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
function discoverAppConfigs(root, current = root, result = []) {
  for (const entry of import_node_fs2.default.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".") || DEFAULT_IGNORES.has(entry.name)) continue;
    const full = import_node_path2.default.join(current, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) discoverAppConfigs(root, full, result);
    else if (entry.isFile() && /^shopify\.app(?:\..+)?\.toml$/.test(entry.name)) result.push(full);
  }
  return result;
}
function operationSurface(operation) {
  const context = operation.sourceContext ?? "";
  const evidence = [];
  if (/\badmin\s*\.\s*graphql\s*\(|\bauthenticate\s*\.\s*admin\b|\/admin\/api\/\d{4}-\d{2}\/graphql\.json|\bcurrentAppInstallation\b/i.test(context)) evidence.push("admin-graphql");
  if (/\bstorefront\s*\.\s*graphql\s*\(|\bunauthenticated\s*\.\s*storefront\b|storefront-access-token|https?:\/\/[^/\s]+\/api\/\d{4}-\d{2}\/graphql\.json/i.test(context)) evidence.push("storefront-graphql");
  if (/\bcustomerAccount\s*\.\s*graphql\s*\(|\bunauthenticated\s*\.\s*customerAccount\b|\/customer\/api\//i.test(context)) evidence.push("customer-account-graphql");
  return evidence.length === 1 ? evidence[0] : null;
}
function apiStatus(version, now = /* @__PURE__ */ new Date()) {
  const status = API_VERSION_INTELLIGENCE.statuses[version];
  if (status === "stable") {
    const accessibleUntil = API_VERSION_INTELLIGENCE.accessibleUntil[version];
    if (accessibleUntil && now.getTime() >= Date.parse(accessibleUntil)) return "unsupported";
  }
  return status ?? "unverified";
}
function audit({ root = ".", configPath, include, exclude = [], apiVersion = API_VERSION_INTELLIGENCE.latestStable, now = /* @__PURE__ */ new Date() } = {}) {
  if (typeof apiVersion !== "string" || !/^(?:\d{4}-\d{2}|unstable)$/.test(apiVersion)) throw new Error("API version must use YYYY-MM or unstable");
  let absoluteRoot = import_node_path2.default.resolve(root);
  if (!import_node_fs2.default.lstatSync(absoluteRoot).isDirectory()) throw new Error("Scan root must be a regular directory");
  let configFile;
  if (configPath) {
    configFile = import_node_path2.default.resolve(absoluteRoot, configPath);
    regularFile(absoluteRoot, configFile);
    absoluteRoot = import_node_path2.default.dirname(configFile);
    if (discoverAppConfigs(absoluteRoot).some((file) => import_node_path2.default.dirname(file) !== absoluteRoot)) throw new Error("Nested Shopify app roots found; select one with --path or --config");
  } else {
    const candidates = import_node_fs2.default.readdirSync(absoluteRoot).filter((f) => /^shopify\.app(?:\..+)?\.toml$/.test(f)).sort();
    const nestedRoots = [...new Set(discoverAppConfigs(absoluteRoot).map((file) => import_node_path2.default.dirname(file)).filter((dir) => dir !== absoluteRoot))];
    if (nestedRoots.length) throw new Error("Nested Shopify app roots found; select one with --path or --config");
    if (candidates.length > 1 && !candidates.includes("shopify.app.toml")) throw new Error("Multiple app configurations found; select one with --config");
    const selected = candidates.includes("shopify.app.toml") ? "shopify.app.toml" : candidates[0];
    if (!selected) throw new Error("Shopify app configuration not found; select one with --config");
    configFile = import_node_path2.default.resolve(absoluteRoot, selected);
    regularFile(absoluteRoot, configFile);
  }
  const config = parseConfig(configFile);
  const skipped = [];
  const files = walk(absoluteRoot, skipped).filter((file) => !exclude.some((value) => file.includes(value)) && (!include || file.includes(include)));
  const observations = [], findings = [], unknown = [];
  const classicWebhookSummary = { evidenced: 0, notEvidenced: 0, unknown: 0 };
  for (const file of files) {
    const text = import_node_fs2.default.readFileSync(file, "utf8");
    const operations = extractGraphQL(text, file);
    if (operations.length === 0 && /(?:admin|storefront|customerAccount)\.graphql|\/admin\/api\/|\/customer\/api\//i.test(text)) {
      unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: 1, reason: "Shopify API client usage was found, but the query was not a static document." });
    }
    for (const op of operations) {
      if (op.parseError) {
        unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: op.line, reason: "GraphQL-like text could not be parsed safely." });
        continue;
      }
      const surface = operationSurface(op);
      if (!surface) {
        unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: op.line, reason: "GraphQL operation could not be assigned to one supported API surface." });
        continue;
      }
      if (surface === "storefront-graphql") continue;
      if (surface === "customer-account-graphql") {
        unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: op.line, reason: "Customer Account GraphQL is identifiable but is outside the Admin GraphQL scope evidence pack." });
        continue;
      }
      if (apiVersion !== EVIDENCE_VERSION) {
        unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: op.line, reason: `Admin GraphQL scope evidence is verified for ${EVIDENCE_VERSION} only; selected API version ${apiVersion} is ${apiStatus(apiVersion, now)}.` });
        continue;
      }
      for (const field of op.fields) {
        const rules = rulesFor(field.path, op.type);
        if (!rules.length) {
          if (!field.path.includes(".") && !["shop", "__typename"].includes(field.path)) unknown.push({ file: import_node_path2.default.relative(absoluteRoot, file), line: field.line, reason: "GraphQL root operation is outside the bundled scope registry." });
          continue;
        }
        for (const item of rules) observations.push({ ...item, apiSurface: surface, operationType: op.type, file, line: field.line, operationName: op.name });
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
  if (config.webhooks !== null) {
    const webhooks = config.webhooks;
    const configRelative = import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/");
    const addWebhookUnknown = (reason) => {
      classicWebhookSummary.unknown++;
      unknown.push({ file: configRelative, line: null, reason });
    };
    if (!webhooks || typeof webhooks !== "object" || Array.isArray(webhooks)) {
      addWebhookUnknown("Classic webhook subscriptions could not be mapped from the app configuration.");
    } else if (webhooks.subscriptions !== void 0 && !Array.isArray(webhooks.subscriptions)) {
      addWebhookUnknown("Classic webhook subscriptions could not be mapped from the app configuration.");
    } else {
      const seenTopics = /* @__PURE__ */ new Set();
      for (const subscription of webhooks.subscriptions ?? []) {
        if (!subscription || typeof subscription !== "object" || Array.isArray(subscription)) {
          addWebhookUnknown("A classic webhook subscription could not be mapped safely.");
          continue;
        }
        if (!Array.isArray(subscription.topics) || subscription.topics.length === 0) {
          addWebhookUnknown("A classic webhook subscription has no supported topic list.");
          continue;
        }
        for (const topic of subscription.topics) {
          if (typeof topic !== "string" || !topic || topic.length > 200) {
            addWebhookUnknown("A classic webhook topic could not be mapped safely.");
            continue;
          }
          if (seenTopics.has(topic)) continue;
          seenTopics.add(topic);
          const evidence = Object.hasOwn(CLASSIC_WEBHOOK_TOPIC_EVIDENCE, topic) ? CLASSIC_WEBHOOK_TOPIC_EVIDENCE[topic] : null;
          if (!evidence || !evidence.apiVersions.includes(webhooks.api_version)) {
            addWebhookUnknown("A classic webhook topic or API version has no bundled scope evidence.");
            continue;
          }
          const requiredScopeIsDeclared = evidence.scopes.some((scope) => config.required.includes(scope) || config.required.some((write) => IMPLIED_SCOPES.get(write) === scope));
          const evidenceStatus = requiredScopeIsDeclared ? "EVIDENCED" : "NOT EVIDENCED";
          classicWebhookSummary[requiredScopeIsDeclared ? "evidenced" : "notEvidenced"]++;
          observations.push({
            ruleId: evidence.ruleId,
            operation: `webhooks.subscriptions.${topic}`,
            operationType: "webhook",
            apiSurface: "classic-webhook",
            requires: { anyOf: evidence.scopes },
            source: evidence.source,
            confidence: evidence.confidence,
            evidenceStatus,
            evidenceVersion: evidence.evidenceVersion,
            file: configFile,
            line: null
          });
        }
      }
    }
  }
  const observedScopes = new Set(observations.flatMap((o) => o.requires.anyOf));
  const satisfied = (scope) => config.required.includes(scope) || [...config.required].some((s) => IMPLIED_SCOPES.get(s) === scope);
  for (const observation of observations) {
    if (observation.requires.anyOf.some(satisfied)) continue;
    const optionalScope = observation.requires.anyOf.find((s) => config.optional.includes(s) || config.optional.some((write) => IMPLIED_SCOPES.get(write) === s));
    const scope = optionalScope ?? observation.requires.anyOf[0];
    const severity = "high";
    const remediation = observation.apiSurface === "classic-webhook" ? `Declare one of ${observation.requires.anyOf.join(", ")} as required. Optional scopes are not treated as granted.` : `Declare ${scope} as required, or make the code path conditional on an optional-scope request.`;
    findings.push(finding(Boolean(optionalScope) ? "SG-SCOPE-002" : "SG-SCOPE-001", severity, observation.confidence, scope, import_node_path2.default.relative(absoluteRoot, observation.file).replaceAll(import_node_path2.default.sep, "/"), observation.line, Boolean(optionalScope) ? `The code evidences ${scope}, but it is declared optional.` : `The ${observation.operation} operation requires one of ${observation.requires.anyOf.join(", ")}, and none is declared as required.`, `${observation.operation} ${observation.operationType}`, observation.source, remediation));
  }
  for (const [write, read] of IMPLIED_SCOPES) if (config.required.includes(write) && (config.required.includes(read) || config.optional.includes(read))) findings.push(finding("SG-SCOPE-003", "medium", "high", read, import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), null, `${write} already grants read access to this resource; the separate ${read} declaration is redundant.`, `${write} implies ${read}`, EVIDENCE_SOURCES.scopes, `Remove ${read} from the declarations unless you intentionally replace ${write}.`));
  for (const scope of config.required) if (!observedScopes.has(scope) && ![...observedScopes].some((s) => IMPLIED_SCOPES.get(s) === scope) && ![...IMPLIED_SCOPES.entries()].some(([write, read]) => write === scope && observedScopes.has(read))) findings.push(finding("SG-SCOPE-004", "low", "high", scope, import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), null, `No supported usage requiring ${scope} was evidenced.`, "No matching supported operation found", EVIDENCE_SOURCES.scopes, `Review whether ${scope} is still needed; static analysis cannot prove it is unused.`));
  for (const scope of config.optional) if (!observedScopes.has(scope)) findings.push(finding("SG-SCOPE-004", "low", "high", scope, import_node_path2.default.relative(absoluteRoot, configFile).replaceAll(import_node_path2.default.sep, "/"), null, `No supported usage requiring optional scope ${scope} was evidenced.`, "No matching supported operation found", EVIDENCE_SOURCES.scopes, `Review the optional feature path; this result does not prove the scope is unused.`));
  if (unknown.length) findings.push(finding("SG-SCOPE-006", "info", "low", null, unknown[0].file, unknown[0].line, "Shopify-related code was found but could not be safely mapped to supported static evidence.", unknown.map((item) => item.reason).join("; "), EVIDENCE_SOURCES.scopes, "Review the unmapped code manually."));
  findings.sort((a, b) => `${a.severity}:${a.ruleId}:${a.file}:${a.line}`.localeCompare(`${b.severity}:${b.ruleId}:${b.file}:${b.line}`));
  return {
    tool: { name: "shopify-scope-guard", version: TOOL_VERSION },
    evidence: { api: "admin-graphql", version: EVIDENCE_VERSION, source: EVIDENCE_SOURCES.versioning },
    apiVersion: {
      selected: apiVersion,
      status: apiStatus(apiVersion, now),
      latestStable: API_VERSION_INTELLIGENCE.latestStable,
      releaseCandidate: API_VERSION_INTELLIGENCE.releaseCandidate,
      evidenceVersion: EVIDENCE_VERSION,
      evidenceApplicable: apiVersion === EVIDENCE_VERSION,
      source: API_VERSION_INTELLIGENCE.source
    },
    summary: { declaredRequired: config.required.length, declaredOptional: config.optional.length, evidenced: observedScopes.size, unknown: unknown.length, findingCount: findings.length, classicWebhooks: classicWebhookSummary },
    scopes: { required: config.required, optional: config.optional },
    observations: observations.map((o) => ({
      operation: o.operation,
      apiSurface: o.apiSurface ?? "events",
      scope: o.requires.anyOf,
      file: import_node_path2.default.relative(absoluteRoot, o.file).replaceAll(import_node_path2.default.sep, "/"),
      line: o.line,
      ...o.apiSurface === "classic-webhook" ? { evidenceStatus: o.evidenceStatus, confidence: o.confidence, source: o.source, evidenceVersion: o.evidenceVersion } : {}
    })),
    findings,
    unknown,
    skipped
  };
}

// src/output/index.js
var rank = { info: 0, low: 1, medium: 2, high: 3 };
function toJson(report) {
  return JSON.stringify(report, null, 2) + "\n";
}
function toHuman(report, { showUnmapped = false } = {}) {
  const lines = ["Shopify Scope Guard", "", "Scope audit", "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"];
  if (report.apiVersion) lines.push(`Admin GraphQL target: ${report.apiVersion.selected} (${report.apiVersion.status}); bundled evidence: ${report.apiVersion.evidenceVersion} (${report.apiVersion.evidenceApplicable ? "applicable" : "not applicable"})`);
  if (report.summary.classicWebhooks) {
    lines.push(`Classic webhooks: EVIDENCED ${report.summary.classicWebhooks.evidenced}, NOT EVIDENCED ${report.summary.classicWebhooks.notEvidenced}, UNKNOWN ${report.summary.classicWebhooks.unknown}`);
    for (const observation of (report.observations ?? []).filter((item) => item.apiSurface === "classic-webhook")) lines.push(`  ${observation.evidenceStatus} ${observation.operation} \u2014 requires one of ${observation.scope.join(", ")} (${observation.confidence} confidence)`);
  }
  lines.push(`Declared: required ${report.summary.declaredRequired}, optional ${report.summary.declaredOptional}`, `Observed: evidenced ${report.summary.evidenced}, unknown ${report.summary.unknown}`, `Findings: ${report.summary.findingCount}`, "");
  for (const f of [...report.findings].sort((a, b) => rank[b.severity] - rank[a.severity])) {
    lines.push(`${f.severity.toUpperCase()} ${f.ruleId}${f.scope ? ` \u2014 ${f.scope}` : ""}`, `  ${f.explanation}`, `  Evidence: ${f.evidence}`, `  Source: ${f.source}`, `  Location: ${f.file ?? "repository"}${f.line ? `:${f.line}` : ""}`, `  Recommendation: ${f.remediation}`, "");
  }
  if (showUnmapped) for (const item of report.unknown) lines.push(`UNKNOWN ${item.file}${item.line ? ":" + item.line : ""}: ${item.reason}`);
  if (report.skipped?.length) lines.push(`Skipped analysis: ${report.skipped.length} file(s); inspect JSON and review manually.`);
  return lines.join("\n");
}
function toSarif(report) {
  const classicWebhooks = report.summary.classicWebhooks ?? { evidenced: 0, notEvidenced: 0, unknown: 0 };
  const classicWebhookObservations = (report.observations ?? []).filter((item) => item.apiSurface === "classic-webhook");
  return JSON.stringify({
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [{
      tool: { driver: {
        name: report.tool.name,
        version: report.tool.version,
        informationUri: "https://github.com/RexCode-Digital/shopify-scope-guard",
        rules: [...new Map(report.findings.map((f) => [f.ruleId, { id: f.ruleId, shortDescription: { text: f.explanation }, helpUri: f.source }])).values()]
      } },
      properties: { apiVersion: report.apiVersion, classicWebhooks, classicWebhookObservations },
      results: report.findings.map((f) => ({
        ruleId: f.ruleId,
        level: f.severity === "high" ? "error" : f.severity === "medium" ? "warning" : "note",
        message: { text: f.explanation },
        properties: { remediation: f.remediation, confidence: f.confidence, evidence: f.evidence, source: f.source },
        locations: f.file ? [{ physicalLocation: {
          artifactLocation: { uri: f.file.split("/").map(encodeURIComponent).join("/") },
          region: f.line ? { startLine: f.line } : void 0
        } }] : void 0
      }))
    }]
  }, null, 2) + "\n";
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
  const report = audit({ root: input("path") || ".", configPath: input("config") || void 0, apiVersion: input("api-version") || void 0 });
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
  const values = { outcome: failed ? "failed" : "passed", "finding-count": report.findings.length, "high-count": counts("high"), "medium-count": counts("medium"), "low-count": counts("low"), "unknown-count": report.summary.unknown, "missing-scope-count": report.findings.filter((f) => ["SG-SCOPE-001", "SG-SCOPE-002"].includes(f.ruleId)).length, "redundant-scope-count": report.findings.filter((f) => f.ruleId === "SG-SCOPE-003").length, "webhook-evidenced-count": report.summary.classicWebhooks.evidenced, "webhook-not-evidenced-count": report.summary.classicWebhooks.notEvidenced, "webhook-unknown-count": report.summary.classicWebhooks.unknown, "api-version": report.apiVersion.selected, "api-version-status": report.apiVersion.status, "evidence-version": report.apiVersion.evidenceVersion, "evidence-applicable": report.apiVersion.evidenceApplicable, report: reportPath };
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
