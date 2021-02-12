"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _deepFreezeEs = _interopRequireDefault(require("deep-freeze-es6"));

var _response = _interopRequireDefault(require("./lib/response.js"));

var _token_tree = _interopRequireDefault(require("./lib/token_tree.js"));

var regex = _interopRequireWildcard(require("./lib/regex.js"));

var utils = _interopRequireWildcard(require("./lib/utils.js"));

var MODES = _interopRequireWildcard(require("./lib/modes.js"));

var _mode_compiler = require("./lib/mode_compiler.js");

var packageJSON = _interopRequireWildcard(require("../package.json"));

var _vue = require("./plugins/vue.js");

var _merge_html = require("./plugins/merge_html.js");

var logger = _interopRequireWildcard(require("./lib/logger.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var escape = utils.escapeHTML;
var inherit = utils.inherit;
var NO_MATCH = Symbol("nomatch");
/**
 * @param {any} hljs - object that is extended (legacy)
 * @returns {HLJSApi}
 */

var HLJS = function HLJS(hljs) {
  // Global internal variables used within the highlight.js library.

  /** @type {Record<string, Language>} */
  var languages = Object.create(null);
  /** @type {Record<string, string>} */

  var aliases = Object.create(null);
  /** @type {HLJSPlugin[]} */

  var plugins = []; // safe/production mode - swallows more errors, tries to keep running
  // even if a single syntax or parse hits a fatal error

  var SAFE_MODE = true;
  var fixMarkupRe = /(^(<[^>]+>|\t|)+|\n)/gm;
  var LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
  /** @type {Language} */

  var PLAINTEXT_LANGUAGE = {
    disableAutodetect: true,
    name: 'Plain text',
    contains: []
  }; // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.

  /** @type HLJSOptions */

  var options = {
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: null,
    // beta configuration options, subject to change, welcome to discuss
    // https://github.com/highlightjs/highlight.js/issues/1086
    __emitter: _token_tree["default"]
  };
  /* Utility functions */

  /**
   * Tests a language name to see if highlighting should be skipped
   * @param {string} languageName
   */

  function shouldNotHighlight(languageName) {
    return options.noHighlightRe.test(languageName);
  }
  /**
   * @param {HighlightedHTMLElement} block - the HTML element to determine language for
   */


  function blockLanguage(block) {
    var classes = block.className + ' ';
    classes += block.parentNode ? block.parentNode.className : ''; // language-* takes precedence over non-prefixed class names.

    var match = options.languageDetectRe.exec(classes);

    if (match) {
      var language = getLanguage(match[1]);

      if (!language) {
        logger.warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
        logger.warn("Falling back to no-highlight mode for this block.", block);
      }

      return language ? match[1] : 'no-highlight';
    }

    return classes.split(/\s+/).find(function (_class) {
      return shouldNotHighlight(_class) || getLanguage(_class);
    });
  }
  /**
   * Core highlighting function.
   *
   * @param {string} languageName - the language to use for highlighting
   * @param {string} code - the code to highlight
   * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   * @param {CompiledMode} [continuation] - current continuation mode, if any
   *
   * @returns {HighlightResult} Result - an object that represents the result
   * @property {string} language - the language name
   * @property {number} relevance - the relevance score
   * @property {string} value - the highlighted HTML code
   * @property {string} code - the original raw code
   * @property {CompiledMode} top - top of the current mode stack
   * @property {boolean} illegal - indicates whether any illegal matches were found
  */


  function highlight(languageName, code, ignoreIllegals, continuation) {
    /** @type {BeforeHighlightContext} */
    var context = {
      code: code,
      language: languageName
    }; // the plugin can change the desired language or the code to be highlighted
    // just be changing the object it was passed

    fire("before:highlight", context); // a before plugin can usurp the result completely by providing it's own
    // in which case we don't even need to call highlight

    var result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals, continuation);
    result.code = context.code; // the plugin can change anything in result to suite it

    fire("after:highlight", result);
    return result;
  }
  /**
   * private highlight that's used internally and does not fire callbacks
   *
   * @param {string} languageName - the language to use for highlighting
   * @param {string} code - the code to highlight
   * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   * @param {CompiledMode} [continuation] - current continuation mode, if any
   * @returns {HighlightResult} - result of the highlight operation
  */


  function _highlight(languageName, code, ignoreIllegals, continuation) {
    var codeToHighlight = code;
    /**
     * Return keyword data if a match is a keyword
     * @param {CompiledMode} mode - current mode
     * @param {RegExpMatchArray} match - regexp match data
     * @returns {KeywordData | false}
     */

    function keywordData(mode, match) {
      var matchText = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return Object.prototype.hasOwnProperty.call(mode.keywords, matchText) && mode.keywords[matchText];
    }

    function processKeywords() {
      if (!top.keywords) {
        emitter.addText(modeBuffer);
        return;
      }

      var lastIndex = 0;
      top.keywordPatternRe.lastIndex = 0;
      var match = top.keywordPatternRe.exec(modeBuffer);
      var buf = "";

      while (match) {
        buf += modeBuffer.substring(lastIndex, match.index);
        var data = keywordData(top, match);

        if (data) {
          var _data = _slicedToArray(data, 2),
              kind = _data[0],
              keywordRelevance = _data[1];

          emitter.addText(buf);
          buf = "";
          relevance += keywordRelevance;
          var cssClass = language.classNameAliases[kind] || kind;
          emitter.addKeyword(match[0], cssClass);
        } else {
          buf += match[0];
        }

        lastIndex = top.keywordPatternRe.lastIndex;
        match = top.keywordPatternRe.exec(modeBuffer);
      }

      buf += modeBuffer.substr(lastIndex);
      emitter.addText(buf);
    }

    function processSubLanguage() {
      if (modeBuffer === "") return;
      /** @type HighlightResult */

      var result = null;

      if (typeof top.subLanguage === 'string') {
        if (!languages[top.subLanguage]) {
          emitter.addText(modeBuffer);
          return;
        }

        result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
        continuations[top.subLanguage] =
        /** @type {CompiledMode} */
        result.top;
      } else {
        result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
      } // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Use case in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.


      if (top.relevance > 0) {
        relevance += result.relevance;
      }

      emitter.addSublanguage(result.emitter, result.language);
    }

    function processBuffer() {
      if (top.subLanguage != null) {
        processSubLanguage();
      } else {
        processKeywords();
      }

      modeBuffer = '';
    }
    /**
     * @param {Mode} mode - new mode to start
     */


    function startNewMode(mode) {
      if (mode.className) {
        emitter.openNode(language.classNameAliases[mode.className] || mode.className);
      }

      top = Object.create(mode, {
        parent: {
          value: top
        }
      });
      return top;
    }
    /**
     * @param {CompiledMode } mode - the mode to potentially end
     * @param {RegExpMatchArray} match - the latest match
     * @param {string} matchPlusRemainder - match plus remainder of content
     * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
     */


    function endOfMode(mode, match, matchPlusRemainder) {
      var matched = regex.startsWith(mode.endRe, matchPlusRemainder);

      if (matched) {
        if (mode["on:end"]) {
          var resp = new _response["default"](mode);
          mode["on:end"](match, resp);
          if (resp.ignore) matched = false;
        }

        if (matched) {
          while (mode.endsParent && mode.parent) {
            mode = mode.parent;
          }

          return mode;
        }
      } // even if on:end fires an `ignore` it's still possible
      // that we might trigger the end node because of a parent mode


      if (mode.endsWithParent) {
        return endOfMode(mode.parent, match, matchPlusRemainder);
      }
    }
    /**
     * Handle matching but then ignoring a sequence of text
     *
     * @param {string} lexeme - string containing full match text
     */


    function doIgnore(lexeme) {
      if (top.matcher.regexIndex === 0) {
        // no more regexs to potentially match here, so we move the cursor forward one
        // space
        modeBuffer += lexeme[0];
        return 1;
      } else {
        // no need to move the cursor, we still have additional regexes to try and
        // match at this very spot
        resumeScanAtSamePosition = true;
        return 0;
      }
    }
    /**
     * Handle the start of a new potential mode match
     *
     * @param {EnhancedMatch} match - the current match
     * @returns {number} how far to advance the parse cursor
     */


    function doBeginMatch(match) {
      var lexeme = match[0];
      var newMode = match.rule;
      var resp = new _response["default"](newMode); // first internal before callbacks, then the public ones

      var beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];

      for (var _i2 = 0, _beforeCallbacks = beforeCallbacks; _i2 < _beforeCallbacks.length; _i2++) {
        var cb = _beforeCallbacks[_i2];
        if (!cb) continue;
        cb(match, resp);
        if (resp.ignore) return doIgnore(lexeme);
      }

      if (newMode && newMode.endSameAsBegin) {
        newMode.endRe = regex.escape(lexeme);
      }

      if (newMode.skip) {
        modeBuffer += lexeme;
      } else {
        if (newMode.excludeBegin) {
          modeBuffer += lexeme;
        }

        processBuffer();

        if (!newMode.returnBegin && !newMode.excludeBegin) {
          modeBuffer = lexeme;
        }
      }

      startNewMode(newMode); // if (mode["after:begin"]) {
      //   let resp = new Response(mode);
      //   mode["after:begin"](match, resp);
      // }

      return newMode.returnBegin ? 0 : lexeme.length;
    }
    /**
     * Handle the potential end of mode
     *
     * @param {RegExpMatchArray} match - the current match
     */


    function doEndMatch(match) {
      var lexeme = match[0];
      var matchPlusRemainder = codeToHighlight.substr(match.index);
      var endMode = endOfMode(top, match, matchPlusRemainder);

      if (!endMode) {
        return NO_MATCH;
      }

      var origin = top;

      if (origin.skip) {
        modeBuffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          modeBuffer += lexeme;
        }

        processBuffer();

        if (origin.excludeEnd) {
          modeBuffer = lexeme;
        }
      }

      do {
        if (top.className) {
          emitter.closeNode();
        }

        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }

        top = top.parent;
      } while (top !== endMode.parent);

      if (endMode.starts) {
        if (endMode.endSameAsBegin) {
          endMode.starts.endRe = endMode.endRe;
        }

        startNewMode(endMode.starts);
      }

      return origin.returnEnd ? 0 : lexeme.length;
    }

    function processContinuations() {
      var list = [];

      for (var current = top; current !== language; current = current.parent) {
        if (current.className) {
          list.unshift(current.className);
        }
      }

      list.forEach(function (item) {
        return emitter.openNode(item);
      });
    }
    /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */


    var lastMatch = {};
    /**
     *  Process an individual match
     *
     * @param {string} textBeforeMatch - text preceeding the match (since the last match)
     * @param {EnhancedMatch} [match] - the match itself
     */

    function processLexeme(textBeforeMatch, match) {
      var lexeme = match && match[0]; // add non-matched text to the current mode buffer

      modeBuffer += textBeforeMatch;

      if (lexeme == null) {
        processBuffer();
        return 0;
      } // we've found a 0 width match and we're stuck, so we need to advance
      // this happens when we have badly behaved rules that have optional matchers to the degree that
      // sometimes they can end up matching nothing at all
      // Ref: https://github.com/highlightjs/highlight.js/issues/2140


      if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
        // spit the "skipped" character that our regex choked on back into the output sequence
        modeBuffer += codeToHighlight.slice(match.index, match.index + 1);

        if (!SAFE_MODE) {
          /** @type {AnnotatedError} */
          var err = new Error('0 width match regex');
          err.languageName = languageName;
          err.badRule = lastMatch.rule;
          throw err;
        }

        return 1;
      }

      lastMatch = match;

      if (match.type === "begin") {
        return doBeginMatch(match);
      } else if (match.type === "illegal" && !ignoreIllegals) {
        // illegal match, we do not continue processing

        /** @type {AnnotatedError} */
        var _err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

        _err.mode = top;
        throw _err;
      } else if (match.type === "end") {
        var processed = doEndMatch(match);

        if (processed !== NO_MATCH) {
          return processed;
        }
      } // edge case for when illegal matches $ (end of line) which is technically
      // a 0 width match but not a begin/end match so it's not caught by the
      // first handler (when ignoreIllegals is true)


      if (match.type === "illegal" && lexeme === "") {
        // advance so we aren't stuck in an infinite loop
        return 1;
      } // infinite loops are BAD, this is a last ditch catch all. if we have a
      // decent number of iterations yet our index (cursor position in our
      // parsing) still 3x behind our index then something is very wrong
      // so we bail


      if (iterations > 100000 && iterations > match.index * 3) {
        var _err2 = new Error('potential infinite loop, way more iterations than matches');

        throw _err2;
      }
      /*
      Why might be find ourselves here?  Only one occasion now.  An end match that was
      triggered but could not be completed.  When might this happen?  When an `endSameasBegin`
      rule sets the end rule to a specific match.  Since the overall mode termination rule that's
      being used to scan the text isn't recompiled that means that any match that LOOKS like
      the end (but is not, because it is not an exact match to the beginning) will
      end up here.  A definite end match, but when `doEndMatch` tries to "reapply"
      the end rule and fails to match, we wind up here, and just silently ignore the end.
        This causes no real harm other than stopping a few times too many.
      */


      modeBuffer += lexeme;
      return lexeme.length;
    }

    var language = getLanguage(languageName);

    if (!language) {
      logger.error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
      throw new Error('Unknown language: "' + languageName + '"');
    }

    var md = (0, _mode_compiler.compileLanguage)(language, {
      plugins: plugins
    });
    var result = '';
    /** @type {CompiledMode} */

    var top = continuation || md;
    /** @type Record<string,CompiledMode> */

    var continuations = {}; // keep continuations for sub-languages

    var emitter = new options.__emitter(options);
    processContinuations();
    var modeBuffer = '';
    var relevance = 0;
    var index = 0;
    var iterations = 0;
    var resumeScanAtSamePosition = false;

    try {
      top.matcher.considerAll();

      for (;;) {
        iterations++;

        if (resumeScanAtSamePosition) {
          // only regexes not matched previously will now be
          // considered for a potential match
          resumeScanAtSamePosition = false;
        } else {
          top.matcher.considerAll();
        }

        top.matcher.lastIndex = index;
        var match = top.matcher.exec(codeToHighlight); // console.log("match", match[0], match.rule && match.rule.begin)

        if (!match) break;
        var beforeMatch = codeToHighlight.substring(index, match.index);
        var processedCount = processLexeme(beforeMatch, match);
        index = match.index + processedCount;
      }

      processLexeme(codeToHighlight.substr(index));
      emitter.closeAllNodes();
      emitter.finalize();
      result = emitter.toHTML();
      return {
        // avoid possible breakage with v10 clients expecting
        // this to always be an integer
        relevance: Math.floor(relevance),
        value: result,
        language: languageName,
        illegal: false,
        emitter: emitter,
        top: top
      };
    } catch (err) {
      if (err.message && err.message.includes('Illegal')) {
        return {
          illegal: true,
          illegalBy: {
            msg: err.message,
            context: codeToHighlight.slice(index - 100, index + 100),
            mode: err.mode
          },
          sofar: result,
          relevance: 0,
          value: escape(codeToHighlight),
          emitter: emitter
        };
      } else if (SAFE_MODE) {
        return {
          illegal: false,
          relevance: 0,
          value: escape(codeToHighlight),
          emitter: emitter,
          language: languageName,
          top: top,
          errorRaised: err
        };
      } else {
        throw err;
      }
    }
  }
  /**
   * returns a valid highlight result, without actually doing any actual work,
   * auto highlight starts with this and it's possible for small snippets that
   * auto-detection may not find a better match
   * @param {string} code
   * @returns {HighlightResult}
   */


  function justTextHighlightResult(code) {
    var result = {
      relevance: 0,
      emitter: new options.__emitter(options),
      value: escape(code),
      illegal: false,
      top: PLAINTEXT_LANGUAGE
    };
    result.emitter.addText(code);
    return result;
  }
  /**
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:
    - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)
      @param {string} code
    @param {Array<string>} [languageSubset]
    @returns {AutoHighlightResult}
  */


  function highlightAuto(code, languageSubset) {
    languageSubset = languageSubset || options.languages || Object.keys(languages);
    var plaintext = justTextHighlightResult(code);
    var results = languageSubset.filter(getLanguage).filter(autoDetection).map(function (name) {
      return _highlight(name, code, false);
    });
    results.unshift(plaintext); // plaintext is always an option

    var sorted = results.sort(function (a, b) {
      // sort base on relevance
      if (a.relevance !== b.relevance) return b.relevance - a.relevance; // always award the tie to the base language
      // ie if C++ and Arduino are tied, it's more likely to be C++

      if (a.language && b.language) {
        if (getLanguage(a.language).supersetOf === b.language) {
          return 1;
        } else if (getLanguage(b.language).supersetOf === a.language) {
          return -1;
        }
      } // otherwise say they are equal, which has the effect of sorting on
      // relevance while preserving the original ordering - which is how ties
      // have historically been settled, ie the language that comes first always
      // wins in the case of a tie


      return 0;
    });

    var _sorted = _slicedToArray(sorted, 2),
        best = _sorted[0],
        secondBest = _sorted[1];
    /** @type {AutoHighlightResult} */


    var result = best;
    result.second_best = secondBest;
    return result;
  }
  /**
  Post-processing of the highlighted markup:
    - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers
      @param {string} html
    @returns {string}
  */


  function fixMarkup(html) {
    if (!(options.tabReplace || options.useBR)) {
      return html;
    }

    return html.replace(fixMarkupRe, function (match) {
      if (match === '\n') {
        return options.useBR ? '<br>' : match;
      } else if (options.tabReplace) {
        return match.replace(/\t/g, options.tabReplace);
      }

      return match;
    });
  }
  /**
   * Builds new class name for block given the language name
   *
   * @param {HTMLElement} element
   * @param {string} [currentLang]
   * @param {string} [resultLang]
   */


  function updateClassName(element, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang;
    element.classList.add("hljs");
    if (language) element.classList.add(language);
  }
  /** @type {HLJSPlugin} */


  var brPlugin = {
    "before:highlightBlock": function beforeHighlightBlock(_ref) {
      var block = _ref.block;

      if (options.useBR) {
        block.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ /]*>/g, '\n');
      }
    },
    "after:highlightBlock": function afterHighlightBlock(_ref2) {
      var result = _ref2.result;

      if (options.useBR) {
        result.value = result.value.replace(/\n/g, "<br>");
      }
    }
  };
  var TAB_REPLACE_RE = /^(<[^>]+>|\t)+/gm;
  /** @type {HLJSPlugin} */

  var tabReplacePlugin = {
    "after:highlightBlock": function afterHighlightBlock(_ref3) {
      var result = _ref3.result;

      if (options.tabReplace) {
        result.value = result.value.replace(TAB_REPLACE_RE, function (m) {
          return m.replace(/\t/g, options.tabReplace);
        });
      }
    }
  };
  /**
   * Applies highlighting to a DOM node containing code. Accepts a DOM node and
   * two optional parameters for fixMarkup.
   *
   * @param {HighlightedHTMLElement} element - the HTML element to highlight
  */

  function highlightBlock(element) {
    /** @type HTMLElement */
    var node = null;
    var language = blockLanguage(element);
    if (shouldNotHighlight(language)) return;
    fire("before:highlightBlock", {
      block: element,
      language: language
    });
    node = element;
    var text = node.textContent;
    var result = language ? highlight(language, text, true) : highlightAuto(text);
    fire("after:highlightBlock", {
      block: element,
      result: result,
      text: text
    });
    element.innerHTML = result.value;
    updateClassName(element, language, result.language);
    element.result = {
      language: result.language,
      // TODO: remove with version 11.0
      re: result.relevance,
      relavance: result.relevance
    };

    if (result.second_best) {
      element.second_best = {
        language: result.second_best.language,
        // TODO: remove with version 11.0
        re: result.second_best.relevance,
        relavance: result.second_best.relevance
      };
    }
  }
  /**
   * Updates highlight.js global options with the passed options
   *
   * @param {Partial<HLJSOptions>} userOptions
   */


  function configure(userOptions) {
    if (userOptions.useBR) {
      logger.deprecated("10.3.0", "'useBR' will be removed entirely in v11.0");
      logger.deprecated("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
    }

    options = inherit(options, userOptions);
  }
  /**
   * Highlights to all <pre><code> blocks on a page
   *
   * @type {Function & {called?: boolean}}
   */
  // TODO: remove v12, deprecated


  var initHighlighting = function initHighlighting() {
    if (initHighlighting.called) return;
    initHighlighting.called = true;
    logger.deprecated("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead.");
    var blocks = document.querySelectorAll('pre code');
    blocks.forEach(highlightBlock);
  }; // Higlights all when DOMContentLoaded fires
  // TODO: remove v12, deprecated


  function initHighlightingOnLoad() {
    logger.deprecated("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead.");
    wantsHighlight = true;
  }

  var wantsHighlight = false;
  var domLoaded = false;
  /**
   * auto-highlights all pre>code elements on the page
   */

  function highlightAll() {
    // if we are called too early in the loading process
    if (!domLoaded) {
      wantsHighlight = true;
      return;
    }

    var blocks = document.querySelectorAll('pre code');
    blocks.forEach(highlightBlock);
  }

  function boot() {
    domLoaded = true; // if a highlight was requested before DOM was loaded, do now

    if (wantsHighlight) highlightAll();
  } // make sure we are in the browser environment


  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', boot, false);
  }
  /**
   * Register a language grammar module
   *
   * @param {string} languageName
   * @param {LanguageFn} languageDefinition
   */


  function registerLanguage(languageName, languageDefinition) {
    var lang = null;

    try {
      lang = languageDefinition(hljs);
    } catch (error) {
      logger.error("Language definition for '{}' could not be registered.".replace("{}", languageName)); // hard or soft error

      if (!SAFE_MODE) {
        throw error;
      } else {
        logger.error(error);
      } // languages that have serious errors are replaced with essentially a
      // "plaintext" stand-in so that the code blocks will still get normal
      // css classes applied to them - and one bad language won't break the
      // entire highlighter


      lang = PLAINTEXT_LANGUAGE;
    } // give it a temporary name if it doesn't have one in the meta-data


    if (!lang.name) lang.name = languageName;
    languages[languageName] = lang;
    lang.rawDefinition = languageDefinition.bind(null, hljs);

    if (lang.aliases) {
      registerAliases(lang.aliases, {
        languageName: languageName
      });
    }
  }
  /**
   * @returns {string[]} List of language internal names
   */


  function listLanguages() {
    return Object.keys(languages);
  }
  /**
    intended usage: When one language truly requires another
      Unlike `getLanguage`, this will throw when the requested language
    is not available.
      @param {string} name - name of the language to fetch/require
    @returns {Language | never}
  */


  function requireLanguage(name) {
    logger.deprecated("10.4.0", "requireLanguage will be removed entirely in v11.");
    logger.deprecated("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");
    var lang = getLanguage(name);

    if (lang) {
      return lang;
    }

    var err = new Error('The \'{}\' language is required, but not loaded.'.replace('{}', name));
    throw err;
  }
  /**
   * @param {string} name - name of the language to retrieve
   * @returns {Language | undefined}
   */


  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }
  /**
   *
   * @param {string|string[]} aliasList - single alias or list of aliases
   * @param {{languageName: string}} opts
   */


  function registerAliases(aliasList, _ref4) {
    var languageName = _ref4.languageName;

    if (typeof aliasList === 'string') {
      aliasList = [aliasList];
    }

    aliasList.forEach(function (alias) {
      aliases[alias] = languageName;
    });
  }
  /**
   * Determines if a given language has auto-detection enabled
   * @param {string} name - name of the language
   */


  function autoDetection(name) {
    var lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }
  /**
   * @param {HLJSPlugin} plugin
   */


  function addPlugin(plugin) {
    plugins.push(plugin);
  }
  /**
   *
   * @param {PluginEvent} event
   * @param {any} args
   */


  function fire(event, args) {
    var cb = event;
    plugins.forEach(function (plugin) {
      if (plugin[cb]) {
        plugin[cb](args);
      }
    });
  }
  /**
  Note: fixMarkup is deprecated and will be removed entirely in v11
    @param {string} arg
  @returns {string}
  */


  function deprecateFixMarkup(arg) {
    logger.deprecated("10.2.0", "fixMarkup will be removed entirely in v11.0");
    logger.deprecated("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534");
    return fixMarkup(arg);
  }
  /* Interface definition */


  Object.assign(hljs, {
    highlight: highlight,
    highlightAuto: highlightAuto,
    highlightAll: highlightAll,
    fixMarkup: deprecateFixMarkup,
    highlightBlock: highlightBlock,
    configure: configure,
    initHighlighting: initHighlighting,
    initHighlightingOnLoad: initHighlightingOnLoad,
    registerLanguage: registerLanguage,
    listLanguages: listLanguages,
    getLanguage: getLanguage,
    registerAliases: registerAliases,
    requireLanguage: requireLanguage,
    autoDetection: autoDetection,
    inherit: inherit,
    addPlugin: addPlugin,
    // plugins for frameworks
    vuePlugin: (0, _vue.BuildVuePlugin)(hljs).VuePlugin
  });

  hljs.debugMode = function () {
    SAFE_MODE = false;
  };

  hljs.safeMode = function () {
    SAFE_MODE = true;
  };

  hljs.versionString = packageJSON.version;

  for (var key in MODES) {
    // @ts-ignore
    if (_typeof(MODES[key]) === "object") {
      // @ts-ignore
      (0, _deepFreezeEs["default"])(MODES[key]);
    }
  } // merge all the modes/regexs into our main object


  Object.assign(hljs, MODES); // built-in plugins, likely to be moved out of core in the future

  hljs.addPlugin(brPlugin); // slated to be removed in v11

  hljs.addPlugin(_merge_html.mergeHTMLPlugin);
  hljs.addPlugin(tabReplacePlugin);
  return hljs;
}; // export an "instance" of the highlighter


var _default = HLJS({});

exports["default"] = _default;