      const translations = {
        en: {
          heroMeta: "@chicojunior",
          headline: "Frontend Engineer (Angular + TypeScript) focused on modern, scalable product interfaces.",
          heroNote: "I help teams modernize legacy frontends and ship clear, reliable user experiences.",
          ctaContact: "Contact",
          ctaLinkedIn: "LinkedIn",
          ctaGitHub: "GitHub",
          ctaCV: "CV",
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
          footer: "Open to remote and hybrid opportunities across Europe.",
          themeDarkLabel: "Dark",
          themeLightLabel: "Light",
          themeToggleAria: "Toggle color theme",
          langToggleAria: "Toggle language"
        },
        pt: {
          heroMeta: "@chicojunior",
          headline: "Frontend Engineer (Angular + TypeScript) focado em interfaces modernas e escaláveis.",
          heroNote: "Ajudo times a modernizar frontends legados e entregar experiências claras e confiáveis.",
          ctaContact: "Contato",
          ctaLinkedIn: "LinkedIn",
          ctaGitHub: "GitHub",
          ctaCV: "CV",
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
      var activeLocale = "en";

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
        } catch (_) {}
      }

      function refreshThemeLabel(theme) {
        const dict = translations[activeLocale] || translations.en;
        themeToggle.textContent = theme === "light" ? dict.themeDarkLabel : dict.themeLightLabel;
        themeToggle.setAttribute("aria-label", dict.themeToggleAria);
        langToggle.setAttribute("aria-label", dict.langToggleAria);
      }

      function applyTheme(theme) {
        const selected = theme === "dark" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", selected);
        setStored("preferred-theme", selected);
        refreshThemeLabel(selected);
      }

      function applyLanguage(locale) {
        const selected = translations[locale] ? locale : "en";
        activeLocale = selected;
        document.documentElement.lang = selected;
        document.querySelectorAll("[data-i18n]").forEach((node) => {
          const key = node.getAttribute("data-i18n");
          node.textContent = translations[selected][key];
        });
        langToggle.textContent = selected === "en" ? "PT" : "EN";
        setStored("preferred-language", selected);
        refreshThemeLabel(getStored("preferred-theme") || "light");
      }

      langToggle.addEventListener("click", () => {
        const current = getStored("preferred-language") || "en";
        applyLanguage(current === "en" ? "pt" : "en");
      });

      themeToggle.addEventListener("click", () => {
        const current = getStored("preferred-theme") || "light";
        applyTheme(current === "light" ? "dark" : "light");
      });

      applyTheme(getStored("preferred-theme") || "light");
      applyLanguage(getStored("preferred-language") || "en");
