"use strict";

const DEFAULT_LOCALE = "en-US";
const DEFAULT_THEME = "light";

const translations = {
  "en-US": {
    heroMeta: "@chicojunior",
    headline: "Frontend Engineer (Angular + TypeScript) focused on modern, scalable product interfaces.",
    heroNote: "I help teams modernize legacy frontends and ship clear, reliable user experiences.",
    ctaContact: "Contact",
    ctaGitHub: "GitHub",
    ctaCV: "CV",
    ctaBlog: "Articles",
    aboutTitle: "About",
    about: "Frontend engineer with 10+ years building web products across Brazil and Europe. I focus on UX clarity, maintainable architecture, and consistent delivery in product teams.",
    impactTitle: "Impact Highlights",
    impactItem1: "Modernized legacy frontends into Angular and TypeScript platforms with reusable components.",
    impactItem2: "Improved team delivery consistency by structuring scalable architecture and shared UI foundations.",
    impactItem3: "Delivered responsive and accessible interfaces for international products with clear business focus.",
    recruiterTitle: "Recruiter Snapshot",
    recruiterSummary: "Angular and TypeScript focused frontend engineer with strong delivery ownership and international product exposure. Positioning: strong mid-level / early senior, with clear growth toward senior scope.",
    stackTitle: "Tech Stack",
    stackFrontendTitle: "Frontend",
    stackBackendTitle: "Backend",
    stackToolsTitle: "Tools",
    blogTitle: "Latest Technical Writing",
    blogIntro: "Technical posts derived from the newsletter pipeline and rewritten for a broader engineering audience.",
    blogViewAll: "View all articles",
    blogAllTitle: "Technical Writing",
    blogAllIntro: "Standalone technical articles derived from the newsletter pipeline and rewritten for a broader engineering audience.",
    blogListTitle: "All articles",
    blogReadArticle: "Read article",
    blogBackHome: "Back home",
    blogBackToList: "Back to all articles",
    blogPublished: "Published",
    blogReadingTime: "min read",
    blogEmpty: "No published technical articles yet.",
    blogNotFoundTitle: "Article not found",
    blogNotFoundBody: "The requested article slug does not match any generated post.",
    footer: "Open to remote and hybrid opportunities across Europe.",
    themeDarkLabel: "Dark",
    themeLightLabel: "Light",
    themeToggleAria: "Toggle color theme",
    langToggleAria: "Toggle language"
  },
  "pt-BR": {
    heroMeta: "@chicojunior",
    headline: "Frontend Engineer (Angular + TypeScript) focado em interfaces modernas e escaláveis.",
    heroNote: "Ajudo times a modernizar frontends legados e entregar experiências claras e confiáveis.",
    ctaContact: "Contato",
    ctaGitHub: "GitHub",
    ctaCV: "CV",
    ctaBlog: "Artigos",
    aboutTitle: "Sobre",
    about: "Engenheiro Frontend com mais de 10 anos construindo produtos web no Brasil e na Europa. Foco em clareza de UX, arquitetura sustentável e entregas consistentes em times de produto.",
    impactTitle: "Destaques de Impacto",
    impactItem1: "Modernizei frontends legados em plataformas Angular e TypeScript com componentes reutilizáveis.",
    impactItem2: "Melhorei a consistência de entrega dos times ao estruturar arquitetura escalável e bases de UI compartilhadas.",
    impactItem3: "Entreguei interfaces responsivas e acessíveis para produtos internacionais com foco claro no negócio.",
    recruiterTitle: "Resumo para Recrutadores",
    recruiterSummary: "Engenheiro Frontend com foco em Angular e TypeScript, forte ownership de entrega e exposição internacional em produtos. Posicionamento: strong mid-level / early senior, com evolução clara para escopo senior.",
    stackTitle: "Stack Tecnológica",
    stackFrontendTitle: "Frontend",
    stackBackendTitle: "Backend",
    stackToolsTitle: "Ferramentas",
    blogTitle: "Escrita Técnica Recente",
    blogIntro: "Posts técnicos derivados da pipeline de newsletter e reescritos para uma audiência mais ampla de engenharia.",
    blogViewAll: "Ver todos os artigos",
    blogAllTitle: "Escrita Técnica",
    blogAllIntro: "Artigos técnicos independentes derivados da pipeline de newsletter e reescritos para uma audiência mais ampla de engenharia.",
    blogListTitle: "Todos os artigos",
    blogReadArticle: "Ler artigo",
    blogBackHome: "Voltar para a home",
    blogBackToList: "Voltar para todos os artigos",
    blogPublished: "Publicado em",
    blogReadingTime: "min de leitura",
    blogEmpty: "Ainda não há artigos técnicos publicados.",
    blogNotFoundTitle: "Artigo não encontrado",
    blogNotFoundBody: "O slug solicitado não corresponde a nenhum post gerado.",
    footer: "Disponível para oportunidades remotas e híbridas na Europa.",
    themeDarkLabel: "Escuro",
    themeLightLabel: "Claro",
    themeToggleAria: "Alternar tema de cores",
    langToggleAria: "Alternar idioma"
  }
};

const langToggle = document.getElementById("lang-toggle");
const themeToggle = document.getElementById("theme-toggle");

var _memStore = {};
var activeLocale = DEFAULT_LOCALE;

function getStored(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return _memStore[key] || null;
  }
}

function setStored(key, value) {
  _memStore[key] = value;
  try {
    localStorage.setItem(key, value);
  } catch (_) { }
}

function normalizeLocale(locale) {
  if (locale === "en") {
    return "en-US";
  }
  if (locale === "pt") {
    return "pt-BR";
  }
  return translations[locale] ? locale : DEFAULT_LOCALE;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(dateValue, locale) {
  const parsed = new Date(`${dateValue}T12:00:00Z`);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(parsed);
}

function getPosts() {
  return Array.isArray(window.__BLOG_POSTS__) ? window.__BLOG_POSTS__ : [];
}

function getPostLocale(post) {
  if (!post || !post.locales) {
    return null;
  }
  return post.locales[activeLocale] || post.locales[DEFAULT_LOCALE] || Object.values(post.locales)[0] || null;
}

function renderTags(tags) {
  if (!Array.isArray(tags) || !tags.length) {
    return "";
  }
  return `<div class="tag-list">${tags
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("")}</div>`;
}

function createBlogCard(post, linkPrefix) {
  const entry = getPostLocale(post);
  const dict = translations[activeLocale] || translations[DEFAULT_LOCALE];
  if (!entry) {
    return "";
  }

  const href = `${linkPrefix}${encodeURIComponent(post.slug)}`;
  return `
    <article class="blog-card">
      <p class="blog-card-meta">${escapeHtml(formatDate(post.date, activeLocale))}</p>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.description)}</p>
      ${renderTags(post.tags)}
      <a class="link-btn" href="${href}">${escapeHtml(dict.blogReadArticle)}</a>
    </article>
  `;
}

function renderEmptyState(container) {
  const dict = translations[activeLocale] || translations[DEFAULT_LOCALE];
  container.innerHTML = `<p class="blog-empty">${escapeHtml(dict.blogEmpty)}</p>`;
}

function renderBlogPreview() {
  const container = document.querySelector("[data-blog-preview]");
  if (!container) {
    return;
  }

  const posts = getPosts().slice(0, 3);
  if (!posts.length) {
    renderEmptyState(container);
    return;
  }

  container.innerHTML = posts.map((post) => createBlogCard(post, "blog/post/index.html?slug=")).join("");
}

function renderBlogIndex() {
  const container = document.querySelector("[data-blog-list]");
  if (!container) {
    return;
  }

  const posts = getPosts();
  if (!posts.length) {
    renderEmptyState(container);
    return;
  }

  container.innerHTML = posts.map((post) => createBlogCard(post, "post/index.html?slug=")).join("");
}

function renderBlogPost() {
  const container = document.querySelector("[data-blog-post]");
  if (!container) {
    return;
  }

  const dict = translations[activeLocale] || translations[DEFAULT_LOCALE];
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const post = getPosts().find((entry) => entry.slug === slug);
  const localized = getPostLocale(post);

  if (!post || !localized) {
    container.innerHTML = `
      <div class="blog-not-found">
        <h1>${escapeHtml(dict.blogNotFoundTitle)}</h1>
        <p>${escapeHtml(dict.blogNotFoundBody)}</p>
      </div>
    `;
    document.title = `${dict.blogNotFoundTitle} | Francisco Vale`;
    return;
  }

  const published = formatDate(post.date, activeLocale);
  document.title = `${localized.title} | Francisco Vale`;

  container.innerHTML = `
    <header class="blog-post-header">
      <p class="blog-card-meta">${escapeHtml(dict.blogPublished)} · ${escapeHtml(published)} · ${escapeHtml(String(localized.readingTimeMinutes))} ${escapeHtml(dict.blogReadingTime)}</p>
      <h1>${escapeHtml(localized.title)}</h1>
      <p class="blog-post-summary">${escapeHtml(localized.description)}</p>
      ${renderTags(post.tags)}
    </header>
    <div class="blog-body">${localized.html}</div>
  `;
}

function refreshThemeLabel(theme) {
  const dict = translations[activeLocale] || translations[DEFAULT_LOCALE];
  if (themeToggle) {
    const themeLabel = theme === "light" ? dict.themeDarkLabel : dict.themeLightLabel;
    themeToggle.textContent = themeLabel;
    themeToggle.setAttribute("aria-label", `${themeLabel}. ${dict.themeToggleAria}`);
    themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }
  if (langToggle) {
    const langLabel = activeLocale === "en-US" ? "PT" : "EN";
    langToggle.textContent = langLabel;
    langToggle.setAttribute("aria-label", `${langLabel}. ${dict.langToggleAria}`);
  }
}

function applyTheme(theme) {
  const selected = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", selected);
  setStored("preferred-theme", selected);
  refreshThemeLabel(selected);
}

function applyLanguage(locale) {
  const selected = normalizeLocale(locale);
  const dict = translations[selected] || translations[DEFAULT_LOCALE];
  activeLocale = selected;
  document.documentElement.lang = selected;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });
  setStored("preferred-language", selected);
  refreshThemeLabel(getStored("preferred-theme") || DEFAULT_THEME);
  renderBlogPreview();
  renderBlogIndex();
  renderBlogPost();
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    const current = normalizeLocale(getStored("preferred-language") || DEFAULT_LOCALE);
    applyLanguage(current === "en-US" ? "pt-BR" : "en-US");
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = getStored("preferred-theme") || DEFAULT_THEME;
    applyTheme(current === "light" ? "dark" : "light");
  });
}

applyTheme(getStored("preferred-theme") || DEFAULT_THEME);
applyLanguage(getStored("preferred-language") || DEFAULT_LOCALE);
