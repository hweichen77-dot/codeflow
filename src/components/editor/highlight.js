const KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "case", "catch", "class",
  "const", "continue", "def", "default", "del", "delete", "do", "elif", "else",
  "enum", "except", "export", "extends", "false", "final", "finally", "float",
  "for", "from", "function", "global", "goto", "if", "import", "in", "instanceof",
  "int", "interface", "is", "lambda", "let", "long", "namespace", "new", "None",
  "nonlocal", "not", "null", "or", "package", "pass", "private", "protected",
  "public", "raise", "return", "short", "sizeof", "static", "struct", "super",
  "switch", "template", "this", "throw", "throws", "True", "true", "try",
  "typedef", "typeof", "union", "using", "var", "virtual", "void", "while",
  "with", "yield", "bool", "char", "double", "unsigned", "signed", "auto",
  "constexpr", "override", "self", "print", "println", "cout", "cin", "std",
])

const BRACKET_COLORS = ["#ffd700", "#da70d6", "#179fff"]
const C = {
  comment: "#6a9955",
  string: "#ce9178",
  keyword: "#569cd6",
  fn: "#dcdcaa",
  type: "#4ec9b0",
  number: "#b5cea8",
  text: "#d4d4d4",
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function span(color, text) {
  return `<span style="color:${color}">${esc(text)}</span>`
}

const SCAN = /(\/\/[^\n]*|#[^\n]*)|(\/\*[\s\S]*?\*\/)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|`(?:\\.|[^`\\])*`?)|(\b\d[\d._eExXbBoA-Fa-f]*\b)|([A-Za-z_$][A-Za-z0-9_$]*)|([{}()[\]])|([\s\S])/g

export function highlight(code, _lang) {
  try {
    let out = ""
    let depth = 0
    let m
    SCAN.lastIndex = 0
    const src = String(code || "")
    while ((m = SCAN.exec(src)) !== null) {
      const [full, line, block, str, num, ident, bracket, other] = m
      if (line != null) out += span(C.comment, full)
      else if (block != null) out += span(C.comment, full)
      else if (str != null) out += span(C.string, full)
      else if (num != null) out += span(C.number, full)
      else if (ident != null) {
        if (KEYWORDS.has(ident)) out += span(C.keyword, ident)
        else {
          const rest = src.slice(m.index + ident.length)
          if (/^\s*\(/.test(rest)) out += span(C.fn, ident)
          else if (/^[A-Z]/.test(ident)) out += span(C.type, ident)
          else out += span(C.text, ident)
        }
      } else if (bracket != null) {
        if (bracket === "(" || bracket === "[" || bracket === "{") {
          const color = BRACKET_COLORS[depth % 3]
          depth++
          out += span(color, bracket)
        } else {
          depth = Math.max(0, depth - 1)
          out += span(BRACKET_COLORS[depth % 3], bracket)
        }
      } else out += esc(other)
    }
    return out
  } catch {
    return esc(String(code || ""))
  }
}

export function langFromFilename(filename = "") {
  const ext = filename.split(".").pop().toLowerCase()
  if (ext === "py") return "python"
  if (ext === "java") return "java"
  if (ext === "cpp" || ext === "cc" || ext === "cxx" || ext === "h" || ext === "hpp") return "cpp"
  return "javascript"
}
