const fs = require("fs");

const inputPath = process.argv[2] || "";
const outputPath = process.argv[3] || process.argv[2];

if (!outputPath) {
  throw new Error("Missing output path");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text) {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

function processInline(text) {
  const chunks = [];
  let lastIndex = 0;
  const tokenRegex = /(\$[^$\n]+\$|\*\*[^*]+\*\*|\[[^\]]+\]\([^\)]+\))/g;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      chunks.push(escapeHtml(text.slice(lastIndex, match.index)));
    }

    const token = match[0];
    if (token.startsWith("$")) {
      chunks.push(token);
    } else if (token.startsWith("**")) {
      chunks.push(`<strong>${processInline(token.slice(2, -2))}</strong>`);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const safeHref = escapeAttr(href);
        const external = /^https?:\/\//i.test(href)
          ? ' target="_blank" rel="noreferrer"'
          : "";
        chunks.push(`<a href="${safeHref}"${external}>${processInline(label)}</a>`);
      } else {
        chunks.push(escapeHtml(token));
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    chunks.push(escapeHtml(text.slice(lastIndex)));
  }

  return chunks.join("");
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const body = [];
  let paragraph = [];
  let listItems = [];
  let inCode = false;
  let codeLang = "";
  let codeLines = [];
  let inMath = false;
  let mathLines = [];

  function flushParagraph() {
    if (!paragraph.length) {
      return;
    }

    body.push(`      <p>${processInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (!listItems.length) {
      return;
    }

    body.push("      <ul>");
    for (const item of listItems) {
      body.push(`        <li>${processInline(item)}</li>`);
    }
    body.push("      </ul>");
    listItems = [];
  }

  function flushCode() {
    if (!inCode) {
      return;
    }

    const classAttr = codeLang ? ` class="language-${escapeAttr(codeLang)}"` : "";
    body.push(`      <pre><code${classAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    inCode = false;
    codeLang = "";
    codeLines = [];
  }

  function flushMath() {
    if (!inMath) {
      return;
    }

    body.push("");
    body.push("      $$");
    for (const line of mathLines) {
      body.push(`      ${line}`);
    }
    body.push("      $$");
    body.push("");
    inMath = false;
    mathLines = [];
  }

  for (const line of lines) {
    if (inCode) {
      if (line.startsWith("```")) {
        flushCode();
      } else {
        codeLines.push(line);
      }
      continue;
    }

    if (inMath) {
      if (line.trim() === "$$") {
        flushMath();
      } else {
        mathLines.push(line);
      }
      continue;
    }

    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      inCode = true;
      codeLang = line.slice(3).trim();
      continue;
    }

    if (line.trim() === "$$") {
      flushParagraph();
      flushList();
      inMath = true;
      continue;
    }

    if (/^#\s+/.test(line)) {
      flushParagraph();
      flushList();
      body.push(`      <h1>${processInline(line.replace(/^#\s+/, ""))}</h1>`);
      continue;
    }

    if (/^##\s+/.test(line)) {
      flushParagraph();
      flushList();
      body.push(`      <h2>${processInline(line.replace(/^##\s+/, ""))}</h2>`);
      continue;
    }

    if (/^-\s+/.test(line)) {
      flushParagraph();
      listItems.push(line.replace(/^-\s+/, ""));
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushCode();
  flushMath();

  return body.join("\n");
}

function writeHtml(markdown) {
  const articleBody = renderMarkdown(markdown);
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LWE | Levis blog</title>
  <meta name="description" content="关于 LWE、primal attack 与 dual attack 的学习记录。">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Levis1">
  <meta property="og:type" content="article">
  <meta property="og:title" content="LWE | Levis blog">
  <meta property="og:description" content="关于 LWE、primal attack 与 dual attack 的学习记录。">
  <meta property="og:url" content="https://koe662.github.io/blog/posts/lwe.html">
  <meta property="og:image" content="https://koe662.github.io/blog/assets/og-cover.svg">
  <link rel="canonical" href="https://koe662.github.io/blog/posts/lwe.html">
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="stylesheet" href="../styles.css?v=20260512-1705">
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    };
  </script>
  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body class="article-page">
  <div class="site-shell">
    <header class="site-header reveal">
      <a class="brand" href="../index.html">Levis blog</a>
      <nav class="site-nav">
        <a href="../index.html#modules">Modules</a>
      </nav>
    </header>

    <article class="article-shell markdown-body reveal">
      <a class="back-link" href="../index.html">返回首页</a>
      <p class="article-meta">2026.05.12 · Crypto</p>
${articleBody}
    </article>

    <footer class="site-footer reveal">
      <p>&copy; <span id="current-year"></span> Levis1</p>
      <p>Levis blog.</p>
    </footer>
  </div>

  <script src="../script.js?v=20260512-1705"></script>
</body>
</html>
`;

  fs.writeFileSync(outputPath, html, "utf8");
}

if (inputPath && inputPath !== outputPath) {
  const markdown = fs.readFileSync(inputPath, "utf8");
  writeHtml(markdown);
} else {
  let markdown = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    markdown += chunk;
  });
  process.stdin.on("end", () => {
    writeHtml(markdown);
  });
}
