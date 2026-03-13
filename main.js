    (function() {
      if (typeof resume !== 'undefined') {
        var titleEl = document.querySelector('.hero-title');
        if (titleEl) titleEl.textContent = resume.title;
        var marquee = document.getElementById('techMarquee');
        if (marquee && resume.skills && resume.skillIcons) {
          var base = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";
          var html = "";
          for (var r = 0; r < 3; r++) {
            resume.skills.forEach(function(s) {
              var path = resume.skillIcons[s];
              if (!path) return;
              html += '<span class="tech-marquee-icon" title="' + s + '"><img src="' + base + path + '.svg" alt="' + s + '"></span>';
            });
          }
          marquee.innerHTML = html;
        }
      }
    })();

    (function() {
      var wrap = document.querySelector('.tech-marquee-wrap');
      var btns = document.querySelectorAll('.tech-marquee-speed-btn');
      if (wrap && btns.length) {
        btns.forEach(function(btn) {
          btn.addEventListener('click', function() {
            btns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            wrap.style.setProperty('--marquee-duration', btn.dataset.speed + 's');
          });
        });
      }
    })();

    (function() {
      var fill = document.getElementById('scrollProgressFill');
      var thumb = document.getElementById('scrollProgressThumb');
      var track = fill ? fill.parentElement : null;
      function updateScroll() {
        if (!fill || !thumb || !track) return;
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
        fill.style.height = (progress * 100) + '%';
        thumb.style.top = (progress * 100) + '%';
      }
      window.addEventListener('scroll', updateScroll, { passive: true });
      window.addEventListener('resize', updateScroll);
      updateScroll();
    })();

    (function() {
      var btn = document.getElementById('knowMoreBtn');
      var rocket = document.getElementById('rocketLaunch');
      var panel = document.getElementById('detailsPanel');
      if (!btn || !rocket || !panel) return;

      var scrollReveal = document.getElementById('scrollRevealContent');

      function revealAndScroll() {
        clickTime = Date.now();
        document.documentElement.classList.remove('scroll-locked');
        document.body.classList.remove('scroll-locked');
        if (!panel.classList.contains('revealed')) {
          panel.classList.add('revealed');
        }
        rocket.setAttribute('aria-hidden', 'false');
        rocket.classList.remove('launching');
        rocket.offsetHeight;
        rocket.classList.add('launching');
        document.getElementById('ai-chat').scrollIntoView({ behavior: 'smooth' });
        setTimeout(function() {
          rocket.classList.remove('launching');
          rocket.setAttribute('aria-hidden', 'true');
        }, 1800);
      }

      var clickTime = 0;
      function revealOnScroll() {
        if (scrollReveal && !scrollReveal.classList.contains('revealed')) {
          scrollReveal.classList.add('revealed');
          scrollReveal.querySelectorAll('.section').forEach(function(s) { s.classList.add('has-viewed', 'in-view'); });
        }
      }
      function canRevealOnScroll() {
        return Date.now() - clickTime > 800;
      }

      if (scrollReveal) {
        window.addEventListener('wheel', function(e) {
          if (e.deltaY > 0) revealOnScroll();
        }, { passive: true });
        window.addEventListener('scroll', function() {
          if (canRevealOnScroll()) revealOnScroll();
        }, { passive: true });
      }

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        revealAndScroll();
      });

      document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        if (link.id === 'knowMoreBtn') return;
        var href = link.getAttribute('href');
        if (href === '#') return;
        var targetId = href.slice(1);
        var target = document.getElementById(targetId);
        if (!target || targetId === 'about') return;
        link.addEventListener('click', function(e) {
          if (scrollReveal && !scrollReveal.classList.contains('revealed')) {
            scrollReveal.classList.add('revealed');
            scrollReveal.querySelectorAll('.section').forEach(function(s) { s.classList.add('has-viewed', 'in-view'); });
          }
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        });
      });
    })();

    (function() {
      var sections = document.querySelectorAll('.section');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            entry.target.classList.add('has-viewed');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      }, { root: null, rootMargin: '-80px 0px -80px 0px', threshold: 0.2 });
      sections.forEach(function(section) {
        observer.observe(section);
      });
    })();

    (function() {
      var form = document.getElementById('aiChatForm');
      var input = document.getElementById('aiChatInput');
      var messagesEl = document.getElementById('aiChatMessages');
      if (!form || !input || !messagesEl) return;

      var responses = [
        { keys: ['hi', 'hello', 'hey', 'greetings'], msg: "Hi! I'm Tanusha's profile assistant. Ask me anything about her experience, skills, projects, education, or how to get in touch. For example: 'What are her skills?' or 'Tell me about her work at Viant.'" },
        { keys: ['who', 'you', 'yourself', 'about', 'introduce', 'name'], msg: "Tanusha Katepalli is a Software Engineer with 4+ years building scalable cloud-native applications. She works across frontend (React, Angular), backend (Java, Go, Python), and cloud (AWS, GCP). Currently at Viant, previously at Amazon AWS. Based in Irvine, CA.", scrollTo: 'about-content', sectionName: 'About' },
        { keys: ['how many years', 'years of experience', 'years experience', 'years she has'], msg: "Tanusha has 4+ years of experience.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['skill', 'tech', 'technology', 'stack', 'language', 'proficient', 'know', 'use'], msg: "Tanusha's skills: Languages (Java, Python, Go, TypeScript, Kotlin, Swift), Frontend (React, Angular, Redux, HTML5, CSS3), Backend (Spring Boot, Node.js, Express, GraphQL, Microservices), Cloud (AWS, GCP, Lambda, Docker, Kubernetes, Terraform, Jenkins), Databases (MySQL, PostgreSQL, DynamoDB, MongoDB), and Testing (JUnit, Jest, Playwright, Selenium).", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['experience', 'work', 'job', 'viant', 'amazon', 'employed', 'company', 'companies'], msg: "Tanusha is a Mid–Full-Stack Software Engineer at Viant (May 2023–present). She led company rebranding, refactored monoliths to Go microservices (42% throughput gain), built React dashboards, and strengthened DevOps. Before that: SDE I at Amazon AWS (Feb 2022–Apr 2023), Research Assistant at OSU (2021), and Teaching Assistant at OSU (2020–2021).", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['project', 'built', 'app', 'portfolio', 'splitwise', 'yelp'], msg: "Projects: 1) Splitwise-style iOS expense app (Swift, MVC)—real-time balance tracking, settlements, contact syncing. 2) Yelp Rating Prediction—ML pipeline with TF-IDF, Naive Bayes, SVM, plus GraphQL API and React interface.", scrollTo: 'projects', sectionName: 'Projects' },
        { keys: ['education', 'degree', 'university', 'school', 'college', 'study', 'studied'], msg: "Education: MS Data Science (Lindsey Wilson University, 2024–2026), MS Computer Science (Oklahoma State University, 2020–2021), B.E. Computer Science (Pondicherry University, 2015–2019).", scrollTo: 'education', sectionName: 'Education' },
        { keys: ['contact', 'email', 'reach', 'hire', 'connect', 'phone', 'linkedin', 'location', 'irvine'], msg: "Contact: tanusha.katepalli@okstate.edu, (405) 385-3346. LinkedIn: linkedin.com/in/tanushakatepalli. Located in Irvine, CA. Open to full-stack, backend, Software Engineer, and platform engineering roles.", scrollTo: 'contact', sectionName: 'Contact' },
        { keys: ['ai', 'artificial', 'machine learning'], msg: "Tanusha uses AI daily to accelerate development and automate workflows. She also built an ML project: Yelp Rating Prediction using TF-IDF, word embeddings, Naive Bayes, and SVM classifiers.", scrollTo: 'projects', sectionName: 'Projects' },
        { keys: ['achievement', 'metric', 'improve', 'percent', '42', '35', '50', '100'], msg: "Key achievements: 42% platform throughput improvement (Java→Go), 35% infrastructure reduction, 50% UI/API efficiency gain, 30% faster incident resolution, 100% metric coverage at AWS. Deployment cycle reduced from hours to minutes.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['viant', 'adelphic'], msg: "At Viant (ad-tech), Tanusha manages the platform end-to-end. She led the Adelphic→Viant rebrand, served as Technical Project Lead for Data Integration, refactored Java to Go microservices, built React dashboards with Redux, implemented OpenTelemetry, and strengthened Jenkins CI/CD.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['aws', 'amazon'], msg: "At Amazon AWS (SDE I, Feb 2022–Apr 2023), Tanusha developed Java microservices, built CloudFormation-based EC2 security, designed async feature services with Lambda and S3, achieved 100% metric reporting coverage, and supported production via on-call rotations.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['fullstack', 'full-stack', 'full stack'], msg: "Tanusha is a full-stack engineer. Frontend: React, Angular, Redux, TypeScript. Backend: Java, Go, Python, Spring Boot, Node.js, GraphQL. Cloud: AWS, GCP, Docker, Kubernetes. She delivers features end-to-end across the stack.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['available', 'open', 'hiring', 'role', 'opportunity'], msg: "Tanusha is open to full-stack, backend, Software Engineer, and platform engineering opportunities. Reach out at tanusha.katepalli@okstate.edu or LinkedIn to discuss.", scrollTo: 'contact', sectionName: 'Contact' }
      ];
      var defaultMsg = "I can answer questions about Tanusha's experience (Viant, Amazon AWS), skills (React, Java, Go, AWS), projects (iOS app, Yelp ML), education, and contact info. Try: 'What does she do at Viant?' or 'How can I contact her?'";

      function escapeHtml(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
      }

      var lastBotScrollTo = null;
      var lastBotSectionName = null;

      var sectionMap = [
        { keys: ['skills', 'skill'], id: 'skills', name: 'Skills' },
        { keys: ['work experience', 'experience', 'work'], id: 'experience', name: 'Work Experience' },
        { keys: ['projects', 'project'], id: 'projects', name: 'Projects' },
        { keys: ['education', 'school', 'degree'], id: 'education', name: 'Education' },
        { keys: ['contact', 'contact info'], id: 'contact', name: 'Contact' },
        { keys: ['about'], id: 'about-content', name: 'About' }
      ];

      function parseDirectSectionRequest(q) {
        var lower = q.toLowerCase().trim();
        var goPhrases = ['go to', 'take me to', 'show me', 'scroll to', 'open', 'also go to', 'also take me to', 'navigate to', 'jump to'];
        var hasGoIntent = goPhrases.some(function(p) { return lower.indexOf(p) !== -1; }) || /\b(section|please)\b/.test(lower);
        if (!hasGoIntent) return null;
        for (var i = 0; i < sectionMap.length; i++) {
          for (var j = 0; j < sectionMap[i].keys.length; j++) {
            if (lower.indexOf(sectionMap[i].keys[j]) !== -1) return { id: sectionMap[i].id, name: sectionMap[i].name };
          }
        }
        return null;
      }

      function getResponse(q) {
        var lower = q.toLowerCase().trim();
        if (!lower) return { msg: defaultMsg, scrollTo: null, sectionName: null };
        for (var i = 0; i < responses.length; i++) {
          for (var j = 0; j < responses[i].keys.length; j++) {
            if (lower.indexOf(responses[i].keys[j]) !== -1) {
              var res = { msg: responses[i].msg, scrollTo: responses[i].scrollTo || null, sectionName: responses[i].sectionName || null };
              if (res.scrollTo && res.sectionName) {
                res.msg += " Would you like me to take you to the " + res.sectionName + " section?";
              }
              return res;
            }
          }
        }
        return { msg: defaultMsg, scrollTo: null, sectionName: null };
      }

      function scrollToSection(sectionId, sectionName) {
        var scrollReveal = document.getElementById('scrollRevealContent');
        if (scrollReveal) {
          scrollReveal.classList.add('revealed');
          scrollReveal.querySelectorAll('.section').forEach(function(s) { s.classList.add('has-viewed', 'in-view'); });
        }
        var el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        return "Here you go! Scroll down to see the full " + sectionName + " section.";
      }

      var typingEl = document.getElementById('aiChatTyping');

      function addMsg(isUser, text) {
        if (typingEl) typingEl.classList.remove('visible');
        messagesEl.classList.add('active');
        var div = document.createElement('div');
        div.className = 'msg';
        div.innerHTML = '<div class="msg-user">' + (isUser ? 'You' : 'Tanusha') + '</div><div class="msg-bot">' + escapeHtml(text) + '</div>';
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        if (!isUser) {
          var btn = document.getElementById('aiChatSubmit');
          if (btn) {
            btn.classList.remove('blink');
            btn.offsetHeight;
            btn.classList.add('blink');
            setTimeout(function() { btn.classList.remove('blink'); }, 800);
          }
        }
      }

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var q = input.value.trim();
        if (!q) return;
        addMsg(true, q);
        input.value = '';
        var lower = q.toLowerCase();
        var isAffirmative = ['yes', 'yeah', 'sure', 'ok', 'yep', 'please', 'go ahead', 'take me'].some(function(w) { return lower.indexOf(w) !== -1; });
        if (isAffirmative && lastBotScrollTo && lastBotSectionName) {
          var confirmMsg = scrollToSection(lastBotScrollTo, lastBotSectionName);
          lastBotScrollTo = null;
          lastBotSectionName = null;
          if (typingEl) typingEl.classList.remove('visible');
          addMsg(false, confirmMsg);
          return;
        }
        var directSection = parseDirectSectionRequest(q);
        if (directSection) {
          var confirmMsg = scrollToSection(directSection.id, directSection.name);
          if (typingEl) typingEl.classList.remove('visible');
          addMsg(false, confirmMsg);
          return;
        }
        if (typingEl) typingEl.classList.add('visible');
        setTimeout(function() {
          var res = getResponse(q);
          lastBotScrollTo = res.scrollTo;
          lastBotSectionName = res.sectionName;
          addMsg(false, res.msg);
        }, 800);
      });

    })();
