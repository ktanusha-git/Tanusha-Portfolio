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

      // Profile knowledge base – comprehensive coverage from Tanusha's profile
      // Each entry: { keys: [keywords], weight: number (higher = more specific), msg, scrollTo?, sectionName? }
      var responses = [
        // Greetings
        { keys: ['hi', 'hello', 'hey', 'greetings', 'howdy'], weight: 1, msg: "Hi! I'm Tanusha's profile assistant. Ask me anything about her experience, skills, projects, education, or how to get in touch. Try: 'What are her skills?' or 'Tell me about her work at Viant.'", scrollTo: null, sectionName: null },
        // About / Who – specific patterns first
        { keys: ['who is tanusha', 'who is she', 'tell me about tanusha', 'introduce tanusha', 'tell me about her background', 'give me an overview'], weight: 10, msg: "Tanusha Katepalli is a Software Engineer with 4+ years building scalable cloud-native applications. She works across frontend (React, Angular), backend (Java, Go, Python), and cloud (AWS, GCP). Currently at Viant, previously at Amazon AWS. Based in Irvine, CA.", scrollTo: 'about-content', sectionName: 'About' },
        { keys: ['about her', 'about tanusha', 'who', 'you', 'yourself', 'introduce', 'name', 'background', 'summary', 'overview', 'describe her'], weight: 5, msg: "Tanusha Katepalli is a Software Engineer with 4+ years building scalable cloud-native applications. She works across frontend (React, Angular), backend (Java, Go, Python), and cloud (AWS, GCP). Currently at Viant, previously at Amazon AWS. Based in Irvine, CA.", scrollTo: 'about-content', sectionName: 'About' },
        // Experience – years
        { keys: ['how many years', 'years of experience', 'years experience', 'years she has', 'how long', 'experience level'], weight: 8, msg: "Tanusha has 4+ years of experience.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Skills – "tanusha skills" etc.
        { keys: ['tanusha skills', 'tanusha\'s skills', 'tanushas skills', 'skills of tanusha', 'tanusha tech', 'tanusha technologies'], weight: 13, msgFn: 'skills', scrollTo: 'skills', sectionName: 'Skills' },
        // Skills – very specific question patterns (high weight for accurate intent)
        { keys: ['what are her skills', 'what is her skill', 'what skills does she', 'what technologies does she', 'what programming languages', 'what languages does she know', 'what tech does she', 'what can she code', 'what tools does she use', 'about her skills', 'about her tech'], weight: 12, msgFn: 'skills', scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['tell me about her skills', 'tell me about her tech', 'tell me about her stack', 'describe her skills'], weight: 10, msgFn: 'skills', scrollTo: 'skills', sectionName: 'Skills' },
        // Skills – broad (include compound phrases for "tell me about her X"); msg from getSkillsMsg()
        { keys: ['her skills', 'her tech', 'her stack', 'what can she do', 'skill', 'tech', 'technology', 'stack', 'language', 'proficient', 'know', 'use', 'expertise', 'tools', 'technologies', 'programming languages'], weight: 4, msgFn: 'skills', scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['does she know', 'does she use', 'has she used', 'experience with', 'knows react', 'knows java', 'knows python', 'knows go', 'knows aws'], weight: 7, msgFn: 'skillsYes', scrollTo: 'skills', sectionName: 'Skills' },
        // Current work – direct answer for "current work", "what does she do now"
        { keys: ['current work', 'current job', 'what does she do now', 'where does she work now', 'her current work', 'her current job', 'what is she doing now'], weight: 13, msg: "She currently works at Viant as a Mid–Full-Stack Software Engineer (May 2023–present). She manages the ad-tech platform, builds React dashboards with Redux, refactored Java to Go microservices, and implements OpenTelemetry for observability.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Work experience – "tanusha experience", "her experience" etc.
        { keys: ['tanusha experience', 'tanusha\'s experience', 'tanushas experience', 'experience of tanusha', 'tanusha work', 'tanusha career', 'tanusha job'], weight: 12, msg: "Tanusha has 4+ years of experience. She's a Mid–Full-Stack Software Engineer at Viant (May 2023–present)—led rebrand, refactored Java to Go microservices (42% throughput gain), built React dashboards. Before that: SDE I at Amazon AWS (Feb 2022–Apr 2023), Research Assistant and Teaching Assistant at OSU.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['what does she do for work', 'what is her job', 'where does she work', 'what companies has she worked', 'where has she worked', 'what is her work experience', 'describe her work', 'tell me about her job', 'what she does', 'about her work', 'about her experience'], weight: 11, msg: "Tanusha is a Mid–Full-Stack Software Engineer at Viant (May 2023–present). She led company rebranding, refactored monoliths to Go microservices (42% throughput gain), built React dashboards, and strengthened DevOps. Before that: SDE I at Amazon AWS (Feb 2022–Apr 2023), Research Assistant at OSU (2021), and Teaching Assistant at OSU (2020–2021).", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['tell me about her experience', 'tell me about her work', 'tell me about her career', 'tell me about her job'], weight: 10, msg: "Tanusha is a Mid–Full-Stack Software Engineer at Viant (May 2023–present). She led company rebranding, refactored monoliths to Go microservices (42% throughput gain), built React dashboards, and strengthened DevOps. Before that: SDE I at Amazon AWS (Feb 2022–Apr 2023), Research Assistant at OSU (2021), and Teaching Assistant at OSU (2020–2021).", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Work experience – general
        { keys: ['her experience', 'her work', 'her job', 'her career', 'experience', 'work', 'job', 'employed', 'company', 'companies', 'career', 'what does she do'], weight: 4, msg: "Tanusha is a Mid–Full-Stack Software Engineer at Viant (May 2023–present). She led company rebranding, refactored monoliths to Go microservices (42% throughput gain), built React dashboards, and strengthened DevOps. Before that: SDE I at Amazon AWS (Feb 2022–Apr 2023), Research Assistant at OSU (2021), and Teaching Assistant at OSU (2020–2021).", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Projects – specific project questions (Yelp, Splitwise, iOS)
        { keys: ['tell me about her yelp', 'about her yelp project', 'yelp project', 'yelp rating', 'tell me about yelp'], weight: 8, msg: "Yelp Rating Prediction: End-to-end ML pipeline with bag-of-words, TF-IDF, word embeddings → Naive Bayes & SVM classifiers. GraphQL API to expose prediction results and review insights. React interface for predicted ratings and analytics with model comparison and error analysis.", scrollTo: 'projects', sectionName: 'Projects' },
        { keys: ['tell me about her splitwise', 'about her splitwise', 'splitwise app', 'expense app', 'ios expense', 'tell me about splitwise'], weight: 8, msg: "Splitwise-style iOS Expense App: Full-featured expense-sharing app with Swift. Real-time balance tracking, simplified settlements, contact syncing. MVC architecture with view controllers for groups, transactions, and reminders. Intuitive UI for splitting bills, viewing balances, and automating reminders.", scrollTo: 'projects', sectionName: 'Projects' },
        // Projects – "tanusha projects" etc.
        { keys: ['tanusha projects', 'tanusha\'s projects', 'tanushas projects', 'tanusha project', 'projects of tanusha'], weight: 12, msg: "Tanusha's projects: 1) Splitwise-style iOS expense app (Swift, MVC)—real-time balance tracking, settlements, contact syncing. 2) Yelp Rating Prediction—ML pipeline with TF-IDF, Naive Bayes, SVM, plus GraphQL API and React interface.", scrollTo: 'projects', sectionName: 'Projects' },
        // Projects – general patterns
        { keys: ['what projects has she built', 'what has she built', 'what apps has she', 'tell me about her projects', 'tell me about her project', 'describe her projects', 'what did she build', 'about her projects', 'about her project'], weight: 10, msg: "Projects: 1) Splitwise-style iOS expense app (Swift, MVC)—real-time balance tracking, settlements, contact syncing. 2) Yelp Rating Prediction—ML pipeline with TF-IDF, Naive Bayes, SVM, plus GraphQL API and React interface.", scrollTo: 'projects', sectionName: 'Projects' },
        { keys: ['her projects', 'her project', 'project', 'built', 'app', 'portfolio', 'splitwise', 'yelp', 'ios app', 'expense app', 'ml project'], weight: 5, msg: "Projects: 1) Splitwise-style iOS expense app (Swift, MVC)—real-time balance tracking, settlements, contact syncing. 2) Yelp Rating Prediction—ML pipeline with TF-IDF, Naive Bayes, SVM, plus GraphQL API and React interface.", scrollTo: 'projects', sectionName: 'Projects' },
        // Education – "tanusha education" etc.
        { keys: ['tanusha education', 'tanusha\'s education', 'tanushas education', 'education of tanusha', 'tanusha degree', 'tanusha school'], weight: 12, msg: "Tanusha's education: MS Data Science (Lindsey Wilson University, 2024–2026), MS Computer Science (Oklahoma State University, 2020–2021), B.E. Computer Science (Pondicherry University, 2015–2019).", scrollTo: 'education', sectionName: 'Education' },
        // Education – specific patterns
        { keys: ['where did she study', 'where did she go to school', 'what is her education', 'what degree does she have', 'what degrees does she have', 'tell me about her education', 'tell me about her degree', 'where did she graduate', 'about her education', 'about her degree'], weight: 10, msg: "Education: MS Data Science (Lindsey Wilson University, 2024–2026), MS Computer Science (Oklahoma State University, 2020–2021), B.E. Computer Science (Pondicherry University, 2015–2019).", scrollTo: 'education', sectionName: 'Education' },
        { keys: ['her education', 'her degree', 'education', 'degree', 'university', 'school', 'college', 'study', 'studied', 'graduated', 'qualification', 'masters', 'bachelor'], weight: 5, msg: "Education: MS Data Science (Lindsey Wilson University, 2024–2026), MS Computer Science (Oklahoma State University, 2020–2021), B.E. Computer Science (Pondicherry University, 2015–2019).", scrollTo: 'education', sectionName: 'Education' },
        // Contact – "tanusha contact" etc.
        { keys: ['tanusha contact', 'tanusha\'s contact', 'tanushas contact', 'contact tanusha', 'tanusha email', 'tanusha phone'], weight: 12, msg: "Tanusha's contact: tanusha.katepalli@okstate.edu, (405) 385-3346. LinkedIn: linkedin.com/in/tanushakatepalli. GitHub: github.com/ktanusha-git. Located in Irvine, CA. Open to full-stack, backend, and platform engineering roles.", scrollTo: 'contact', sectionName: 'Contact' },
        // Contact – specific patterns
        { keys: ['how can i contact her', 'how can i reach her', 'how do i get in touch', 'what is her email', 'what is her phone', 'what is her linkedin', 'how to hire her', 'how to connect with her', 'tell me how to contact', 'about her contact', 'about her email', 'how to contact her'], weight: 10, msg: "Contact: tanusha.katepalli@okstate.edu, (405) 385-3346. LinkedIn: linkedin.com/in/tanushakatepalli. GitHub: github.com/ktanusha-git. Located in Irvine, CA. Open to full-stack, backend, Software Engineer, and platform engineering roles.", scrollTo: 'contact', sectionName: 'Contact' },
        { keys: ['her contact', 'her email', 'how to contact', 'contact', 'email', 'reach', 'hire', 'connect', 'phone', 'linkedin', 'location', 'irvine', 'github', 'get in touch', 'how to reach', 'where is she', 'how can i reach'], weight: 5, msg: "Contact: tanusha.katepalli@okstate.edu, (405) 385-3346. LinkedIn: linkedin.com/in/tanushakatepalli. GitHub: github.com/ktanusha-git. Located in Irvine, CA. Open to full-stack, backend, Software Engineer, and platform engineering roles.", scrollTo: 'contact', sectionName: 'Contact' },
        // AI / ML – specific
        { keys: ['naive bayes', 'svm', 'tf-idf', 'tfidf', 'word embeddings', 'classifier'], weight: 9, msg: "Tanusha's Yelp Rating Prediction project uses bag-of-words, TF-IDF, word embeddings with Naive Bayes and SVM classifiers. GraphQL API and React interface for predictions and analytics.", scrollTo: 'projects', sectionName: 'Projects' },
        { keys: ['ai', 'artificial', 'machine learning', 'ml', 'data science'], weight: 6, msg: "Tanusha uses AI daily to accelerate development and automate workflows. She also built an ML project: Yelp Rating Prediction using TF-IDF, word embeddings, Naive Bayes, and SVM classifiers. She's pursuing an MS in Data Science at Lindsey Wilson University.", scrollTo: 'projects', sectionName: 'Projects' },
        // Achievements / metrics
        { keys: ['achievement', 'metric', 'improve', 'percent', '42', '35', '50', '100', 'impact', 'results', 'accomplishment'], weight: 6, msg: "Key achievements: 42% platform throughput improvement (Java→Go), 35% infrastructure reduction, 50% UI/API efficiency gain, 30% faster incident resolution, 100% metric coverage at AWS. Deployment cycle reduced from hours to minutes.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Viant – specific "work at Viant" questions (high weight so they beat general experience)
        { keys: ['work at viant', 'her work at viant', 'about her work at viant', 'what does she do at viant', 'tell me about viant', 'about viant', 'viant experience'], weight: 12, msg: "At Viant (ad-tech), Tanusha manages the platform end-to-end. She led the Adelphic→Viant rebrand, served as Technical Project Lead for Data Integration, refactored Java to Go microservices, built React dashboards with Redux, implemented OpenTelemetry, and strengthened Jenkins CI/CD.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['viant', 'adelphic', 'ad-tech', 'ad tech'], weight: 7, msg: "At Viant (ad-tech), Tanusha manages the platform end-to-end. She led the Adelphic→Viant rebrand, served as Technical Project Lead for Data Integration, refactored Java to Go microservices, built React dashboards with Redux, implemented OpenTelemetry, and strengthened Jenkins CI/CD.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Amazon / AWS – specific "work at Amazon" questions (high weight so they beat general experience)
        { keys: ['work at amazon', 'work at aws', 'her work at amazon', 'her work at aws', 'about her work at amazon', 'about her work at aws', 'what does she do at amazon', 'what did she do at amazon', 'tell me about amazon', 'about amazon', 'amazon experience', 'aws experience'], weight: 12, msg: "At Amazon AWS (SDE I, Feb 2022–Apr 2023), Tanusha developed Java microservices, built CloudFormation-based EC2 security, designed async feature services with Lambda and S3, achieved 100% metric reporting coverage, and supported production via on-call rotations.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['aws', 'amazon', 'seattle', 'on-call', 'oncall'], weight: 7, msg: "At Amazon AWS (SDE I, Feb 2022–Apr 2023), Tanusha developed Java microservices, built CloudFormation-based EC2 security, designed async feature services with Lambda and S3, achieved 100% metric reporting coverage, and supported production via on-call rotations.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Full-stack
        { keys: ['fullstack', 'full-stack', 'full stack', 'frontend', 'backend'], weight: 6, msg: "Tanusha is a full-stack engineer. Frontend: React, Angular, Redux, TypeScript. Backend: Java, Go, Python, Spring Boot, Node.js, GraphQL. Cloud: AWS, GCP, Docker, Kubernetes. She delivers features end-to-end across the stack.", scrollTo: 'skills', sectionName: 'Skills' },
        // HR job-fit: "fit for X", "match for X", "best match for X" – uses getRoleMatchMsg for role-specific pitch
        { keys: ['best match for', 'good fit for', 'fit for', 'match for', 'suitable for', 'qualified for', 'right fit for', 'ideal for', 'best candidate for', 'good match for', 'does she fit', 'is she a good fit for', 'is she a match for', 'would she be a good fit for', 'can she do', 'is she qualified for', 'does she match the', 'match this role', 'fit this role', 'fit this profile', 'match this profile'], weight: 14, msgFn: 'roleMatch', scrollTo: 'contact', sectionName: 'Contact' },
        // HR: "why is she best match", "why is she good fit", "best match", "good fit" (generic)
        { keys: ['why is she the best match', 'why is she a good fit', 'why is she best match', 'why is she good fit', 'what makes her the best match', 'what makes her best match', 'best match', 'good fit', 'strong candidate', 'top candidate'], weight: 11, msgFn: 'roleMatch', scrollTo: 'contact', sectionName: 'Contact' },
        // Hiring / opportunities – why hire, pitch, value proposition
        { keys: ['why should we hire tanusha', 'why should we hire her', 'why hire tanusha', 'why hire her', 'why should i hire', 'reasons to hire', 'why choose tanusha', 'what makes her a good candidate', 'why recruit tanusha', 'sell me on tanusha'], weight: 12, msg: "Why hire Tanusha: 4+ years building scalable cloud-native applications. Proven impact—42% throughput improvement (Java→Go), 35% infra reduction, 50% UI/API efficiency gain, 100% metric coverage at AWS. Full-stack (React, Angular, Java, Go, Python, AWS). Led company rebrand, Technical Project Lead for Data Integration. Strong DevOps, microservices, on-call experience. MS CS (OSU), MS Data Science in progress. Uses AI daily. Open to full-stack, backend, and platform engineering roles.", scrollTo: 'contact', sectionName: 'Contact' },
        { keys: ['available', 'open', 'hiring', 'role', 'opportunity', 'looking for job', 'recruiting'], weight: 6, msg: "Tanusha is open to full-stack, backend, Software Engineer, and platform engineering opportunities. Reach out at tanusha.katepalli@okstate.edu or LinkedIn to discuss.", scrollTo: 'contact', sectionName: 'Contact' },
        // HR: requirements, recommend, compare, shortlist
        { keys: ['does she meet the requirements', 'meet the requirements', 'meets requirements', 'meet requirements', 'qualification match', 'requirements match'], weight: 11, msg: "Tanusha meets requirements for full-stack, backend, platform, and cloud engineering roles: 4+ years experience, AWS/GCP, React, Java, Go, Python, microservices, CI/CD. Amazon AWS and Viant experience. MS CS, MS Data Science in progress. Proven impact (42% throughput, 100% metric coverage).", scrollTo: 'contact', sectionName: 'Contact' },
        { keys: ['would you recommend her', 'do you recommend her', 'recommend tanusha', 'recommend her', 'shortlist', 'shortlist her', 'top pick'], weight: 10, msg: "Yes. Tanusha is a strong recommendation: 4+ years at Viant and Amazon AWS, full-stack, microservices, cloud. Key achievements: 42% throughput gain, 35% infra reduction, 100% metric coverage. Led company rebrand, Technical Project Lead. Contact: tanusha.katepalli@okstate.edu", scrollTo: 'contact', sectionName: 'Contact' },
        { keys: ['why pick her', 'why select her', 'why choose her', 'what makes her stand out', 'what sets her apart', 'differentiator'], weight: 10, msg: "What sets Tanusha apart: 4+ years at top companies (Viant, Amazon AWS). Proven impact—42% throughput, 35% infra reduction, 100% metric coverage. Led company rebrand, Technical Project Lead. Full-stack + cloud + DevOps. MS CS + MS Data Science in progress. Uses AI daily.", scrollTo: 'contact', sectionName: 'Contact' },
        // HR: job description / paste – guide to role-specific questions
        { keys: ['job description', 'paste job', 'match job description', 'analyze job', 'job requirements', 'job posting'], weight: 10, msg: "I can't analyze full job descriptions yet. Ask role-specific questions: 'Is she a good fit for Software Engineer?' or 'Does she match a Backend Engineer profile?' or 'Fit for Data Scientist?' You can also ask about skills: 'Does she know React?' or 'Experience with AWS?'", scrollTo: null, sectionName: null },
        // Research / OSU – specific questions
        { keys: ['work at osu', 'her work at osu', 'about her research', 'about her work at osu', 'tell me about osu', 'about oklahoma state', 'osu experience', 'research experience', 'teaching assistant experience'], weight: 12, msg: "At Oklahoma State University: Research Assistant (2021)—built Hadoop, MapReduce, Spark clusters; conducted distributed computing analysis. Teaching Assistant (2020–2021)—supported CS 1113 and CS 2133 labs, office hours, grading.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['research', 'osu', 'oklahoma state', 'teaching assistant', 'hadoop', 'spark', 'mapreduce'], weight: 7, msg: "At Oklahoma State University: Research Assistant (2021)—built Hadoop, MapReduce, Spark clusters; conducted distributed computing analysis. Teaching Assistant (2020–2021)—supported CS 1113 and CS 2133 labs, office hours, grading.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Highlights
        { keys: ['highlight', 'best', 'notable', 'impressive'], weight: 5, msg: "Highlights: Led Adelphic→Viant rebrand across engineering teams; refactored Java to Go microservices (42% throughput ↑); built React dashboards (50% UI/API efficiency gain); 100% metric coverage at AWS; OpenTelemetry for 30% faster incident resolution.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Location & where
        { keys: ['where does she live', 'where is she located', 'where is she based', 'what city', 'irvine', 'california', 'seattle', 'stillwater'], weight: 8, msg: "Tanusha is based in Irvine, CA. She worked in Seattle at Amazon AWS (2022–2023) and in Stillwater, OK at Oklahoma State University (2020–2021). Currently at Viant in Irvine, California.", scrollTo: 'contact', sectionName: 'Contact' },
        // Contact specifics
        { keys: ['her email', 'email address', 'what is her email'], weight: 9, msg: "Tanusha's email: tanusha.katepalli@okstate.edu", scrollTo: 'contact', sectionName: 'Contact' },
        { keys: ['her phone', 'phone number', 'what is her phone', 'call her'], weight: 9, msg: "Tanusha's phone: (405) 385-3346", scrollTo: 'contact', sectionName: 'Contact' },
        { keys: ['her linkedin', 'linkedin profile', 'linkedin url'], weight: 9, msg: "Tanusha's LinkedIn: linkedin.com/in/tanushakatepalli", scrollTo: 'contact', sectionName: 'Contact' },
        { keys: ['her github', 'github profile', 'github url'], weight: 9, msg: "Tanusha's GitHub: github.com/ktanusha-git", scrollTo: 'contact', sectionName: 'Contact' },
        // Education specifics – schools
        { keys: ['lindsey wilson', 'lindsey wilson university'], weight: 10, msg: "Lindsey Wilson University: Tanusha is pursuing MS Data Science (Oct 2024 – May 2026).", scrollTo: 'education', sectionName: 'Education' },
        { keys: ['oklahoma state', 'osu', 'okstate'], weight: 8, msg: "Oklahoma State University: MS Computer Science (Jan 2020 – Dec 2021). She was Research Assistant (2021) and Teaching Assistant (2020–2021) there.", scrollTo: 'education', sectionName: 'Education' },
        { keys: ['pondicherry', 'pondicherry university'], weight: 10, msg: "Pondicherry University: B.E. Computer Science (Aug 2015 – May 2019).", scrollTo: 'education', sectionName: 'Education' },
        // Education specifics – degrees
        { keys: ['ms data science', 'data science degree', 'masters in data science'], weight: 9, msg: "Tanusha is pursuing MS Data Science at Lindsey Wilson University (Oct 2024 – May 2026).", scrollTo: 'education', sectionName: 'Education' },
        { keys: ['ms computer science', 'masters in cs', 'ms cs'], weight: 9, msg: "Tanusha has an MS in Computer Science from Oklahoma State University (Jan 2020 – Dec 2021).", scrollTo: 'education', sectionName: 'Education' },
        { keys: ['bachelor', 'b.e.', 'b.e ', 'undergraduate', 'bachelors'], weight: 8, msg: "Tanusha has a B.E. in Computer Science from Pondicherry University (Aug 2015 – May 2019).", scrollTo: 'education', sectionName: 'Education' },
        // Timeline / when
        { keys: ['when did she join viant', 'when did she start at viant', 'when did she start viant'], weight: 10, msg: "Tanusha joined Viant in May 2023. She has been there since.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['when did she leave amazon', 'when did she work at amazon', 'how long at amazon'], weight: 10, msg: "Tanusha worked at Amazon AWS from Feb 2022 to Apr 2023 (about 14 months).", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['how long at viant', 'how long has she been at viant'], weight: 9, msg: "Tanusha has been at Viant since May 2023 (over 2 years).", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Role / title specifics
        { keys: ['technical project lead', 'project lead', 'tpl'], weight: 9, msg: "At Viant, Tanusha served as Technical Project Lead for Data Integration & Ad-Targeting—translated SRS requirements into tasks, guided engineers, collaborated with Product, and launched high-impact customer-facing releases.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['adelphic', 'rebrand', 'company rebrand'], weight: 9, msg: "Tanusha led the company-wide rebranding from Adelphic to Viant at her current company. She implemented large-scale changes across frontend, backend, and microservices, coordinating delivery across multiple engineering teams.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['sde', 'software developer engineer', 'sde i'], weight: 8, msg: "At Amazon AWS, Tanusha was SDE I (Software Developer Engineer I) from Feb 2022 to Apr 2023.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Tech-specific questions
        { keys: ['her experience with react', 'react experience', 'does she use react', 'tell me about her react'], weight: 9, msg: "Tanusha uses React extensively at Viant. She built responsive React.js dashboards with Redux for campaign analytics, improving UI speed and API efficiency by 50%. She also built a React interface for her Yelp Rating Prediction project.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['her experience with java', 'java experience', 'does she use java'], weight: 9, msg: "Tanusha has strong Java experience. At Amazon AWS she developed Java microservices. At Viant she refactored monolithic Java services into Go microservices. She uses Spring Boot, Hibernate, and Java for backend development.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['her experience with go', 'golang experience', 'go experience', 'does she use go'], weight: 9, msg: "Tanusha uses Go at Viant. She refactored monolithic Java services into Golang-based microservices, improving platform throughput by 42%. She migrated legacy workloads to serverless Go microservices and implemented OpenTelemetry in Go services.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['her experience with aws', 'aws experience', 'does she use aws'], weight: 9, msg: "Tanusha has extensive AWS experience. At Amazon AWS she used Lambda, S3, DynamoDB, CloudFormation, CloudWatch. At Viant she uses AWS Lambda, API Gateway, EventBridge for Go microservices. She also uses GCP.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['gcp', 'google cloud', 'her experience with gcp'], weight: 8, msg: "Tanusha uses GCP (Google Cloud) at Viant alongside AWS. She works with cloud-native applications across AWS and GCP, including data pipelines and distributed systems.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['graphql', 'her experience with graphql'], weight: 8, msg: "Tanusha uses GraphQL. She built a GraphQL API for her Yelp Rating Prediction project to expose prediction results and review insights. She also works with GraphQL in backend development.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['opentelemetry', 'observability'], weight: 9, msg: "At Viant, Tanusha implemented OpenTelemetry in Go services to standardize observability, cutting incident resolution time by 30% and improving system visibility for engineering teams.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['jenkins', 'ci/cd', 'devops'], weight: 8, msg: "Tanusha strengthened DevOps pipelines at Viant by integrating Jenkins-based CI/CD automation and IAM-driven access controls, reducing deployment cycle time from hours to minutes. She has experience with CI/CD deployment pipelines from Amazon AWS.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['docker', 'kubernetes', 'containers'], weight: 8, msg: "Tanusha works with Docker and Kubernetes as part of her cloud and infrastructure skills. She delivers cloud-native applications and has experience with containerization.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['swift', 'ios', 'mobile', 'mvc', 'uikit'], weight: 8, msg: "Tanusha built a Splitwise-style iOS expense app using Swift. It features real-time balance tracking, settlements, contact syncing, MVC architecture with UIKit, and an intuitive UI for splitting bills.", scrollTo: 'projects', sectionName: 'Projects' },
        { keys: ['python', 'her experience with python'], weight: 8, msg: "Tanusha uses Python. She built the Yelp Rating Prediction ML pipeline with Python (TF-IDF, word embeddings, Naive Bayes, SVM). She also uses Python for backend development.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['angular', 'her experience with angular'], weight: 8, msg: "Tanusha uses Angular. At Viant she delivers full-stack features across Angular and React. She manages the ad-tech platform with Angular/React frontends.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['redux', 'her experience with redux'], weight: 8, msg: "Tanusha uses Redux with React. At Viant she built React.js dashboards with Redux for campaign analytics, improving UI speed and API efficiency by 50%.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['terraform', 'infrastructure as code'], weight: 7, msg: "Tanusha has Terraform in her cloud and infrastructure toolkit. She works with AWS, GCP, Docker, Kubernetes, and CI/CD.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['typescript', 'javascript'], weight: 7, msg: "Tanusha uses TypeScript and JavaScript for frontend development with React and Angular.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['node.js', 'nodejs', 'express'], weight: 7, msg: "Tanusha has Node.js and Express in her backend stack. She works with Spring Boot, Node.js, GraphQL, and REST APIs.", scrollTo: 'skills', sectionName: 'Skills' },
        { keys: ['spring boot', 'springboot', 'hibernate'], weight: 7, msg: "Tanusha uses Spring Boot and Hibernate for backend development. She has experience with Java, Spring Boot, Hibernate, and microservices.", scrollTo: 'skills', sectionName: 'Skills' },
        // Metric-specific
        { keys: ['42 percent', '42%', 'throughput improvement'], weight: 9, msg: "Tanusha achieved a 42% platform throughput improvement at Viant by refactoring monolithic Java services into Golang-based microservices using AWS Lambda, API Gateway, and EventBridge.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['35 percent', '35%', 'infrastructure reduction'], weight: 9, msg: "Tanusha achieved a 35% infrastructure reduction at Viant by migrating legacy workloads to serverless Go microservices with full feature parity.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['50 percent', '50%', 'ui efficiency'], weight: 9, msg: "Tanusha improved UI speed and API communication efficiency by 50% at Viant by building responsive React.js dashboards with Redux for campaign analytics.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['30 percent', '30%', 'incident resolution'], weight: 9, msg: "Tanusha cut incident resolution time by 30% at Viant by implementing OpenTelemetry in Go services to standardize observability.", scrollTo: 'experience', sectionName: 'Work Experience' },
        { keys: ['100 percent', '100%', 'metric coverage'], weight: 9, msg: "At Amazon AWS, Tanusha achieved 100% metric reporting coverage by developing Input Metrics (Document Entity Density & Document Input Metrics) using Java and CloudWatch.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Roles she's open to
        { keys: ['what roles', 'what kind of roles', 'what positions', 'types of roles', 'job types'], weight: 8, msg: "Tanusha is open to full-stack, backend, Software Engineer, and platform engineering opportunities.", scrollTo: 'contact', sectionName: 'Contact' },
        // Ad-tech
        { keys: ['ad-tech', 'ad tech', 'advertising tech'], weight: 8, msg: "Tanusha works in ad-tech at Viant. She manages the Viant ad-tech platform, delivering full-stack features for Data Integration and Ad-Targeting. She served as Technical Project Lead for Data Integration & Ad-Targeting.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Microservices
        { keys: ['microservices', 'her experience with microservices'], weight: 8, msg: "Tanusha has extensive microservices experience. At Viant she refactored monolithic Java services into Go microservices. At Amazon she developed Java-based microservices. She works with AWS Lambda, API Gateway, EventBridge.", scrollTo: 'experience', sectionName: 'Work Experience' },
        // Testing
        { keys: ['testing', 'playwright', 'selenium', 'junit', 'jest'], weight: 7, msg: "Tanusha uses JUnit, Jest, Playwright, and Selenium for testing. She has strong focus on unit/integration testing, and her Yelp project includes model comparison and error analysis.", scrollTo: 'skills', sectionName: 'Skills' },
        // Databases
        { keys: ['dynamodb', 'postgresql', 'mysql', 'mongodb', 'database'], weight: 7, msg: "Tanusha works with MySQL, PostgreSQL, DynamoDB, MongoDB, and NoSQL. At Amazon she worked with DynamoDB and S3. She uses databases across her full-stack projects.", scrollTo: 'skills', sectionName: 'Skills' },
        // CloudFormation, Lambda, S3, EventBridge, CloudWatch, EC2
        { keys: ['cloudformation', 'lambda', 's3', 'eventbridge', 'api gateway', 'cloudwatch', 'ec2'], weight: 8, msg: "At Amazon AWS, Tanusha built CloudFormation-based EC2 security, designed async feature services with Lambda and S3, and worked with DynamoDB and CloudWatch. At Viant she uses AWS Lambda, API Gateway, and EventBridge for Go microservices.", scrollTo: 'experience', sectionName: 'Work Experience' }
      ];

      var defaultMsg = "I can help you evaluate Tanusha for a role. Try: 'Is she a good fit for Software Engineer?' or 'Does she match a Backend Engineer profile?' or 'Why hire her?' You can also ask about her skills, experience at Viant/Amazon, projects, or contact info.";

      // Normalize user query for better matching: contractions, common typos, question patterns
      function normalizeQuery(q) {
        var s = q.toLowerCase().trim();
        var map = {
          "what's": "what is", "whats": "what is", "what're": "what are", "whatre": "what are",
          "where's": "where is", "wheres": "where is", "who's": "who is", "whos": "who is",
          "how's": "how is", "hows": "how is", "that's": "that is", "thats": "that is",
          "she's": "she is", "shes": "she is", "he's": "he is", "hes": "he is",
          "it's": "it is", "its": "it is", "i'm": "i am", "im": "i am", "i'd": "i would",
          "can't": "cannot", "cant": "cannot", "don't": "do not", "dont": "do not",
          "doesn't": "does not", "doesnt": "does not", "won't": "will not", "wont": "will not",
          "experiance": "experience", "experence": "experience", "expirience": "experience",
          "skils": "skills", "skil": "skill", "sklls": "skills",
          "contat": "contact", "contct": "contact", "conatct": "contact",
          "educaton": "education", "educaiton": "education", "eduaction": "education",
          "projet": "project", "projets": "projects", "projec": "project",
          "progamming": "programming", "programing": "programming", "prog": "programming",
          "langauge": "language", "languges": "languages", "languge": "language",
          "technolgy": "technology", "technolgies": "technologies", "techology": "technology",
          "employe": "employ", "emploed": "employed", "emplyed": "employed",
          "achievment": "achievement", "achievemnt": "achievement",
          "programing languages": "programming languages", "prog languages": "programming languages",
          "amzon": "amazon", "amazom": "amazon"
        };
        for (var k in map) { if (map.hasOwnProperty(k)) s = s.replace(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), map[k]); }
        s = s.replace(/\s+/g, ' ').trim();
        var prefixes = ['can you tell me ', 'could you tell me ', 'i want to know ', 'i would like to know ', 'pls tell me ', 'please tell me ', 'tell me ', 'i need to know ', 'want to know '];
        for (var p = 0; p < prefixes.length; p++) {
          if (s.indexOf(prefixes[p]) === 0) s = s.slice(prefixes[p].length).trim();
        }
        return s;
      }

      function getSkillsMsg() {
        if (typeof resume !== 'undefined' && resume && resume.skillGroups) {
          var parts = [];
          for (var k in resume.skillGroups) {
            if (resume.skillGroups.hasOwnProperty(k)) {
              parts.push(k + ' (' + resume.skillGroups[k].join(', ') + ')');
            }
          }
          return "Tanusha's skills: " + parts.join('. ') + ".";
        }
        return "Tanusha's skills: Languages (Java, Python, Go, TypeScript, Kotlin, Swift), Frontend (React, Angular, Redux, HTML5, CSS3), Backend (Spring Boot, Node.js, Express, GraphQL, Microservices), Cloud (AWS, GCP, Lambda, Docker, Kubernetes, Terraform, Jenkins), Databases (MySQL, PostgreSQL, DynamoDB, MongoDB), and Testing (JUnit, Jest, Playwright, Selenium).";
      }

      var skillTechMap = { react: 'React', java: 'Java', python: 'Python', go: 'Go', golang: 'Go', aws: 'AWS', angular: 'Angular', typescript: 'TypeScript', javascript: 'JavaScript', docker: 'Docker', kubernetes: 'Kubernetes', graphql: 'GraphQL', redux: 'Redux', swift: 'Swift', kotlin: 'Kotlin', node: 'Node.js', nodejs: 'Node.js', express: 'Express', spring: 'Spring Boot', springboot: 'Spring Boot', terraform: 'Terraform', jenkins: 'Jenkins', gcp: 'GCP', mysql: 'MySQL', postgresql: 'PostgreSQL', mongodb: 'MongoDB', dynamodb: 'DynamoDB', playwright: 'Playwright', selenium: 'Selenium' };

      // HR-focused: role-to-pitch mapping for job-fit questions
      var roleToPitch = {
        'software engineer': "Yes. Tanusha is an excellent match for Software Engineer roles. 4+ years building scalable systems at Viant and Amazon AWS. Full-stack (React, Angular, Java, Go, Python), microservices, cloud (AWS, GCP), CI/CD. Led company rebrand, Technical Project Lead for Data Integration. Proven impact: 42% throughput gain, 100% metric coverage at AWS.",
        'full-stack engineer': "Yes. Tanusha is a strong fit for Full-Stack Engineer roles. She delivers end-to-end across React, Angular, Java, Go, Python, GraphQL, AWS. At Viant she built React dashboards (50% UI/API efficiency gain) and refactored Java→Go microservices (42% throughput). Full-stack experience at Amazon AWS and Viant.",
        'fullstack engineer': "Yes. Tanusha is a strong fit for Full-Stack Engineer roles. She delivers end-to-end across React, Angular, Java, Go, Python, GraphQL, AWS. At Viant she built React dashboards (50% UI/API efficiency gain) and refactored Java→Go microservices (42% throughput). Full-stack experience at Amazon AWS and Viant.",
        'backend engineer': "Yes. Tanusha is a strong match for Backend Engineer roles. Java, Go, Python, Spring Boot, Node.js, GraphQL, microservices. At Viant: refactored Java to Go microservices (42% throughput), serverless Go with Lambda/EventBridge. At Amazon: Java microservices, Lambda, S3, DynamoDB, CloudFormation. 100% metric coverage, on-call experience.",
        'frontend engineer': "Yes. Tanusha fits Frontend Engineer roles. React, Angular, Redux, TypeScript, HTML5, CSS3. At Viant she built React.js dashboards with Redux (50% UI/API efficiency gain). Yelp project: React interface for ML predictions. Full-stack background with strong frontend delivery.",
        'platform engineer': "Yes. Tanusha is a strong fit for Platform Engineer roles. She manages the Viant ad-tech platform end-to-end. AWS, GCP, Docker, Kubernetes, Terraform, Jenkins CI/CD. Refactored monoliths to Go microservices, OpenTelemetry for observability, deployment cycle from hours to minutes. Amazon AWS experience with CloudFormation, Lambda, S3.",
        'cloud engineer': "Yes. Tanusha matches Cloud Engineer roles. AWS (Lambda, S3, DynamoDB, CloudFormation, CloudWatch), GCP, Docker, Kubernetes, Terraform. At Amazon: CloudFormation-based EC2 security, Lambda/S3 async services. At Viant: serverless Go microservices, EventBridge, API Gateway. 35% infrastructure reduction via serverless migration.",
        'data scientist': "Yes. Tanusha is a strong fit for Data Scientist roles. MS Data Science in progress (Lindsey Wilson), MS CS (OSU). Yelp Rating Prediction: end-to-end ML pipeline (TF-IDF, word embeddings, Naive Bayes, SVM). Research at OSU: Hadoop, MapReduce, Spark, distributed computing. Python, data pipelines, analytics. Uses AI daily.",
        'ml engineer': "Yes. Tanusha fits ML Engineer roles. Yelp Rating Prediction: ML pipeline with TF-IDF, Naive Bayes, SVM, GraphQL API, React interface. MS Data Science in progress. Python, data pipelines, Hadoop/Spark at OSU. Strong software engineering (Java, Go, Python) plus ML fundamentals.",
        'machine learning engineer': "Yes. Tanusha fits ML Engineer roles. Yelp Rating Prediction: ML pipeline with TF-IDF, Naive Bayes, SVM, GraphQL API, React interface. MS Data Science in progress. Python, data pipelines, Hadoop/Spark at OSU. Strong software engineering (Java, Go, Python) plus ML fundamentals.",
        'devops engineer': "Yes. Tanusha matches DevOps Engineer roles. Jenkins CI/CD, Terraform, Docker, Kubernetes, AWS, GCP. At Viant: Jenkins-based CI/CD, IAM-driven access, deployment cycle from hours to minutes. OpenTelemetry for observability (30% faster incident resolution). Amazon: CI/CD pipelines, CloudWatch, on-call.",
        'sde': "Yes. Tanusha is an excellent match for SDE roles. She was SDE I at Amazon AWS (2022–2023). 4+ years building scalable systems. Java, Go, Python, React, microservices, AWS. Proven impact at Viant and Amazon.",
        'sde i': "Yes. Tanusha was SDE I at Amazon AWS (Feb 2022–Apr 2023). She is well-qualified for SDE I and SDE II roles: Java microservices, CloudFormation, Lambda, S3, 100% metric coverage, on-call. Now Mid–Full-Stack at Viant with 42% throughput improvement.",
        'sde ii': "Yes. Tanusha is a strong fit for SDE II roles. 4+ years, Mid–Full-Stack at Viant, SDE I at Amazon. Led company rebrand, Technical Project Lead, 42% throughput gain, 35% infra reduction. Full-stack, microservices, cloud.",
        'frontend developer': "Yes. Tanusha fits Frontend Developer roles. React, Angular, Redux, TypeScript, HTML5, CSS3. At Viant she built React.js dashboards with Redux (50% UI/API efficiency gain). Yelp project: React interface for ML predictions. Full-stack background with strong frontend delivery.",
        'backend developer': "Yes. Tanusha is a strong match for Backend Developer roles. Java, Go, Python, Spring Boot, Node.js, GraphQL, microservices. At Viant: refactored Java to Go microservices (42% throughput), serverless Go with Lambda/EventBridge. At Amazon: Java microservices, Lambda, S3, DynamoDB.",
        'full stack developer': "Yes. Tanusha is a strong fit for Full-Stack Developer roles. She delivers end-to-end across React, Angular, Java, Go, Python, GraphQL, AWS. At Viant she built React dashboards (50% UI/API efficiency gain) and refactored Java→Go microservices (42% throughput).",
        'ad-tech': "Yes. Tanusha is an ideal match for ad-tech roles. She works in ad-tech at Viant: manages the platform, Data Integration & Ad-Targeting, Technical Project Lead. Led Adelphic→Viant rebrand. React dashboards, Go microservices, AWS/GCP.",
        'this role': "Tanusha is a strong candidate: 4+ years at Viant and Amazon AWS, full-stack (React, Java, Go, Python, AWS), proven impact (42% throughput, 35% infra reduction, 100% metric coverage). Led rebrand, Technical Project Lead. MS CS, MS Data Science in progress. Contact: tanusha.katepalli@okstate.edu",
        'this profile': "Tanusha is a strong match: 4+ years building scalable cloud-native applications. Full-stack, microservices, AWS/GCP. Key achievements: 42% throughput gain, 35% infra reduction, 50% UI efficiency, 100% metric coverage at AWS. Led company rebrand, Technical Project Lead. Open to full-stack, backend, platform engineering.",
        'the role': "Tanusha is a strong candidate: 4+ years at Viant and Amazon AWS, full-stack (React, Java, Go, Python, AWS), proven impact (42% throughput, 35% infra reduction, 100% metric coverage). Led rebrand, Technical Project Lead. MS CS, MS Data Science in progress."
      };

      function getRoleMatchMsg(query) {
        var lower = query.toLowerCase().trim();
        var bestRole = null;
        var bestLen = 0;
        for (var role in roleToPitch) {
          if (roleToPitch.hasOwnProperty(role) && lower.indexOf(role) !== -1 && role.length > bestLen) {
            bestRole = role;
            bestLen = role.length;
          }
        }
        return bestRole ? roleToPitch[bestRole] : null;
      }

      function getSkillsYesMsg(query) {
        var lower = query.toLowerCase();
        var found = null;
        for (var key in skillTechMap) {
          if (skillTechMap.hasOwnProperty(key) && lower.indexOf(key) !== -1) {
            found = skillTechMap[key];
            break;
          }
        }
        return found ? "Yes, she knows " + found + "." : "Yes, she has strong technical skills.";
      }

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

      // Score-based matching: pick best response by keyword relevance and weight
      // Uses normalized query for better understanding of user intent
      function getResponse(q) {
        var raw = q.trim();
        if (!raw) return { msg: defaultMsg, scrollPrompt: null, scrollTo: null, sectionName: null };

        var lower = normalizeQuery(raw);
        var best = { score: 0, res: null };
        var words = lower.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);

        for (var i = 0; i < responses.length; i++) {
          var r = responses[i];
          var score = 0;
          for (var j = 0; j < r.keys.length; j++) {
            var key = r.keys[j];
            if (lower.indexOf(key) !== -1) {
              // Longer key = more specific match; prefer full-phrase matches
              var keyScore = key.length * (r.weight || 1);
              score += keyScore;
            }
          }
          if (score > best.score) {
            best.score = score;
            best.res = r;
          }
        }

        if (best.res) {
          var msg = best.res.msg;
          if (best.res.msgFn === 'skills') msg = getSkillsMsg();
          else if (best.res.msgFn === 'skillsYes') msg = getSkillsYesMsg(lower);
          else if (best.res.msgFn === 'roleMatch') {
            var roleMsg = getRoleMatchMsg(lower);
            msg = roleMsg || "Tanusha is a strong candidate: 4+ years at Viant and Amazon AWS. Full-stack (React, Java, Go, Python, AWS), microservices, cloud. Proven impact: 42% throughput gain, 35% infra reduction, 100% metric coverage at AWS. Led company rebrand, Technical Project Lead. MS CS, MS Data Science in progress. Open to full-stack, backend, platform engineering. Contact: tanusha.katepalli@okstate.edu";
          }
          var scrollPrompt = null;
          if (best.res.scrollTo && best.res.sectionName) {
            scrollPrompt = "Would you like me to take you to the " + best.res.sectionName + " section?";
          }
          return { msg: msg, scrollPrompt: scrollPrompt, scrollTo: best.res.scrollTo || null, sectionName: best.res.sectionName || null };
        }

        // Fallback: try partial word match for profile-related terms
        var profileWords = ['tanusha', 'she', 'her', 'engineer', 'software', 'work', 'job', 'skill', 'project', 'contact', 'experience', 'education', 'tell', 'about', 'what', 'how', 'where'];
        var hasProfileWord = words.some(function(w) { return w.length >= 2 && profileWords.indexOf(w) !== -1; });
        if (hasProfileWord && words.length >= 1) {
          return { msg: "Based on your question, here's a quick summary: Tanusha is a Software Engineer with 4+ years at Viant and Amazon AWS. She works with React, Java, Go, Python, and AWS. For specifics, try: 'What are her skills?' or 'Tell me about her work at Viant.'", scrollPrompt: null, scrollTo: null, sectionName: null };
        }

        return { msg: defaultMsg, scrollPrompt: null, scrollTo: null, sectionName: null };
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

      function addMsg(isUser, text, scrollPrompt) {
        if (typingEl) typingEl.classList.remove('visible');
        messagesEl.classList.add('active');
        var div = document.createElement('div');
        div.className = 'msg';
        var botHtml = '<div class="msg-bot">' + escapeHtml(text);
        if (scrollPrompt) {
          botHtml += '<div class="msg-scroll-prompt">' + escapeHtml(scrollPrompt) + '</div>';
        }
        botHtml += '</div>';
        div.innerHTML = '<div class="msg-user">' + (isUser ? 'You' : 'Tanusha') + '</div>' + botHtml;
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
        var lower = q.toLowerCase().trim();
        var affirmatives = ['yes', 'yeah', 'sure', 'ok', 'okay', 'yep', 'yup', 'please', 'go', 'go ahead', 'take me', 'take me there', 'show me', 'sounds good', 'absolutely', 'definitely', 'alright', 'sure thing', 'lead the way', 'why not', 'of course'];
        var isAffirmative = affirmatives.some(function(w) { return lower.indexOf(w) !== -1; });
        var negatives = ['nope', 'nah', 'no thanks', 'no thank you', 'not really', 'skip', 'skip it', "don't", 'dont', 'maybe later', 'later', 'not now', "that's ok", "thats ok", "that's fine", "thats fine", "i'm good", "im good", 'no way', 'pass', 'maybe not', "it's ok", "its ok", "that's alright", "thats alright", 'all good', 'im fine', "i'm fine"];
        var isNegative = (lower === 'no' || lower === 'no.' || lower === 'no!' || lower === 'no,' || lower === 'no?') || negatives.some(function(w) { return lower.indexOf(w) !== -1; });
        if (isAffirmative && lastBotScrollTo && lastBotSectionName) {
          var confirmMsg = scrollToSection(lastBotScrollTo, lastBotSectionName);
          lastBotScrollTo = null;
          lastBotSectionName = null;
          if (typingEl) typingEl.classList.remove('visible');
          addMsg(false, confirmMsg);
          return;
        }
        if (isNegative && lastBotScrollTo && lastBotSectionName) {
          lastBotScrollTo = null;
          lastBotSectionName = null;
          if (typingEl) typingEl.classList.remove('visible');
          addMsg(false, "No problem! Ask me anything else about Tanusha-her experience, skills, projects, education, or how to get in touch.");
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
          addMsg(false, res.msg, res.scrollPrompt);
        }, 800);
      });

      // Upload / paste job description – extract text and analyze match
      var uploadToggle = document.getElementById('aiChatUploadToggle');
      var uploadPanel = document.getElementById('aiChatUploadPanel');
      var uploadZone = document.getElementById('aiChatUploadZone');
      var fileInput = document.getElementById('aiChatFileInput');
      var pasteArea = document.getElementById('aiChatUploadPaste');
      var analyzeBtn = document.getElementById('aiChatUploadAnalyze');

      var chatPanel = document.getElementById('aiChatPanel');
      var uploadSection = document.getElementById('aiChatUpload');
      if (uploadToggle && uploadPanel) {
        uploadToggle.addEventListener('click', function() {
          var expanded = uploadToggle.getAttribute('aria-expanded') === 'true';
          uploadToggle.setAttribute('aria-expanded', !expanded);
          uploadPanel.hidden = expanded;
          if (expanded) {
            chatPanel.classList.remove('chat-focused');
            chatPanel.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            chatPanel.classList.add('chat-focused');
            if (uploadSection) {
              chatPanel.scrollTo({ top: Math.max(0, uploadSection.offsetTop), behavior: 'smooth' });
            }
          }
        });
      }

      function addMatchMsg(userLabel, summaryHtml, matchClass) {
        if (typingEl) typingEl.classList.remove('visible');
        messagesEl.classList.add('active');
        var div = document.createElement('div');
        div.className = 'msg';
        var cls = matchClass || '';
        div.innerHTML = '<div class="msg-user">' + escapeHtml(userLabel) + '</div><div class="msg-bot"><div class="msg-match ' + cls + '">' + summaryHtml + '</div></div>';
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        div.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      function extractTextFromFile(file) {
        return new Promise(function(resolve, reject) {
          var ext = (file.name || '').split('.').pop().toLowerCase();
          if (ext === 'txt') {
            var r = new FileReader();
            r.onload = function() { resolve(r.result || ''); };
            r.onerror = function() { reject(new Error('Could not read file')); };
            r.readAsText(file);
            return;
          }
          if (ext === 'pdf') {
            if (typeof pdfjsLib === 'undefined') {
              reject(new Error('PDF library not loaded'));
              return;
            }
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            var r = new FileReader();
            r.onload = function() {
              var arr = new Uint8Array(r.result);
              pdfjsLib.getDocument({ data: arr }).promise.then(function(pdf) {
                var numPages = pdf.numPages;
                var texts = [];
                function getPage(i) {
                  if (i > numPages) {
                    resolve(texts.join('\n'));
                    return;
                  }
                  pdf.getPage(i).then(function(page) {
                    return page.getTextContent();
                  }).then(function(content) {
                    texts.push(content.items.map(function(it) { return it.str; }).join(' '));
                    getPage(i + 1);
                  }).catch(reject);
                }
                getPage(1);
              }).catch(reject);
            };
            r.onerror = function() { reject(new Error('Could not read file')); };
            r.readAsArrayBuffer(file);
            return;
          }
          if (ext === 'docx') {
            if (typeof mammoth === 'undefined') {
              reject(new Error('DOCX library not loaded'));
              return;
            }
            var r = new FileReader();
            r.onload = function() {
              mammoth.extractRawText({ arrayBuffer: r.result }).then(function(result) {
                resolve(result.value || '');
              }).catch(reject);
            };
            r.onerror = function() { reject(new Error('Could not read file')); };
            r.readAsArrayBuffer(file);
            return;
          }
          reject(new Error('Unsupported format. Use .txt, .pdf, or .docx'));
        });
      }

      function getResumeKeywords() {
        var kw = new Set();
        if (typeof resume !== 'undefined' && resume) {
          if (resume.skillGroups) {
            for (var g in resume.skillGroups) {
              if (resume.skillGroups.hasOwnProperty(g)) {
                resume.skillGroups[g].forEach(function(s) {
                  kw.add(s.toLowerCase());
                  if (s.indexOf(' ') !== -1) kw.add(s.replace(/\s+/g, '').toLowerCase());
                });
              }
            }
          }
          ['react', 'angular', 'java', 'python', 'go', 'golang', 'typescript', 'javascript', 'aws', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'graphql', 'redux', 'spring', 'springboot', 'node', 'nodejs', 'express', 'mysql', 'postgresql', 'postgres', 'mongodb', 'dynamodb', 'nosql', 'microservices', 'lambda', 's3', 'cloudformation', 'cloudwatch', 'opentelemetry', 'junit', 'jest', 'playwright', 'selenium', 'hadoop', 'spark', 'mapreduce', 'swift', 'kotlin', 'html5', 'css3', 'sass', 'jquery', 'rest', 'api', 'ci/cd', 'cicd', 'git', 'maven', 'gradle', 'viant', 'amazon', 'ad-tech', 'adtech', 'full-stack', 'fullstack', 'frontend', 'backend', 'devops', 'ml', 'machine learning', 'data science', 'tf-idf', 'tfidf', 'naive bayes', 'svm', 'ios', 'mvc', 'uikit'].forEach(function(k) { kw.add(k); });
        }
        return kw;
      }

      function extractJobKeywords(text) {
        var lower = text.toLowerCase().replace(/[^\w\s\-\.\/]/g, ' ');
        var words = lower.split(/\s+/).filter(function(w) { return w.length >= 2; });
        var techTerms = ['react', 'angular', 'java', 'python', 'go', 'golang', 'typescript', 'javascript', 'aws', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'graphql', 'redux', 'spring', 'node', 'nodejs', 'express', 'mysql', 'postgresql', 'mongodb', 'dynamodb', 'microservices', 'lambda', 's3', 'cloudformation', 'junit', 'jest', 'playwright', 'selenium', 'hadoop', 'spark', 'swift', 'kotlin', 'html', 'css', 'sass', 'rest', 'api', 'cicd', 'git', 'maven', 'gradle', 'devops', 'ml', 'machine learning', 'data science', 'fullstack', 'full-stack', 'frontend', 'backend', 'ios', 'android', 'ruby', 'php', 'csharp', 'c#', 'rust', 'scala', 'terraform', 'ansible', 'kafka', 'redis', 'elasticsearch', 'grpc', 'graphql', 'redux', 'vue', 'nextjs', 'nestjs', 'django', 'flask', 'fastapi', 'postgres', 'nosql', 'sql', 'tdd', 'bdd', 'agile', 'scrum', 'leadership', 'mentoring', 'on-call', 'oncall'];
        var found = new Set();
        var textLower = ' ' + lower + ' ';
        techTerms.forEach(function(term) {
          var pat = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (new RegExp('\\b' + pat + '\\b', 'i').test(text)) found.add(term);
        });
        words.forEach(function(w) {
          if (w.length >= 3 && /^[a-z]+$/.test(w) && techTerms.indexOf(w) !== -1) found.add(w);
        });
        return found;
      }

      function analyzeJobMatch(text) {
        if (!text || text.trim().length < 20) {
          return { summary: 'Please provide a longer job description (upload a file or paste at least a few sentences).', matchPct: 0, matched: [], gaps: [], verdict: 'weak' };
        }
        var resumeKw = getResumeKeywords();
        var jobKw = extractJobKeywords(text);
        if (jobKw.size === 0) {
          return { summary: 'No clear technical requirements detected in the job description. Tanusha has 4+ years experience, full-stack (React, Java, Go, Python, AWS), Viant & Amazon. Consider reaching out to discuss fit.', matchPct: 50, matched: [], gaps: [], verdict: 'moderate' };
        }
        var aliasMap = { golang: 'go', nodejs: 'node', postgres: 'postgresql', fullstack: 'full-stack', cicd: 'ci/cd', ml: 'machine learning' };
        var matched = [];
        var gaps = [];
        jobKw.forEach(function(k) {
          var norm = k.toLowerCase().replace(/\s+/g, '');
          var kNorm = aliasMap[norm] || norm;
          var found = false;
          resumeKw.forEach(function(r) {
            var rNorm = r.replace(/\s+/g, '');
            if (r.indexOf(k) !== -1 || k.indexOf(r) !== -1 || rNorm === norm || rNorm === kNorm || (rNorm.length >= 3 && norm.indexOf(rNorm) !== -1) || (rNorm.length >= 3 && rNorm.indexOf(norm) !== -1)) found = true;
          });
          if (found) matched.push(k); else gaps.push(k);
        });
        var matchPct = jobKw.size > 0 ? Math.round((matched.length / jobKw.size) * 100) : 0;
        var verdict = matchPct >= 70 ? 'strong' : matchPct >= 45 ? 'moderate' : 'weak';
        var verdictText = verdict === 'strong' ? "Tanusha's resume matches this role well." : verdict === 'moderate' ? "Tanusha has relevant experience; some requirements may need discussion." : "There are notable gaps; consider if adjacent skills apply.";
        var summary = verdictText + ' Match: ' + matched.length + ' of ' + jobKw.size + ' detected requirements.';
        return { summary: summary, matchPct: matchPct, matched: matched, gaps: gaps, verdict: verdict };
      }

      var backBtn = document.getElementById('aiChatBackBtn');
      function runAnalyze(text, userAction) {
        if (!text || !text.trim()) return;
        if (chatPanel) {
          chatPanel.classList.add('chat-result');
          if (uploadToggle && uploadPanel) {
            uploadToggle.setAttribute('aria-expanded', 'false');
            uploadPanel.hidden = true;
          }
          if (backBtn) backBtn.hidden = false;
        }
        if (userAction) addMsg(true, userAction);
        var result = analyzeJobMatch(text.trim());
        var html = '<div class="msg-match-summary">' + escapeHtml(result.summary) + '</div>';
        if (result.matched.length > 0) {
          html += '<div class="msg-match-list"><strong>Matched:</strong> ' + escapeHtml(result.matched.slice(0, 20).join(', ')) + (result.matched.length > 20 ? '...' : '') + '</div>';
        }
        if (result.gaps.length > 0 && result.gaps.length <= 15) {
          html += '<div class="msg-match-list"><strong>Not in resume:</strong> ' + escapeHtml(result.gaps.join(', ')) + '</div>';
        } else if (result.gaps.length > 15) {
          html += '<div class="msg-match-list"><strong>Not in resume:</strong> ' + escapeHtml(result.gaps.slice(0, 12).join(', ')) + '...</div>';
        }
        html += '<div class="msg-match-resume-note">Please scroll down and review the full resume for complete details.</div>';
        html += '<div class="msg-match-contact">Contact: <a href="mailto:tanusha.katepalli@okstate.edu">tanusha.katepalli@okstate.edu</a> | <a href="tel:+14053853346">(405) 385-3346</a></div>';
        addMatchMsg('Tanusha', html, 'msg-match-' + result.verdict);
        if (chatPanel) {
          var messagesSection = document.getElementById('aiChatMessages');
          if (messagesSection) {
            setTimeout(function() {
              chatPanel.scrollTo({ top: messagesSection.offsetTop - 10, behavior: 'smooth' });
            }, 100);
          }
        }
      }

      if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', function() { fileInput.click(); });
        uploadZone.addEventListener('dragover', function(e) {
          e.preventDefault();
          uploadZone.classList.add('dragover');
        });
        uploadZone.addEventListener('dragleave', function() { uploadZone.classList.remove('dragover'); });
        uploadZone.addEventListener('drop', function(e) {
          e.preventDefault();
          uploadZone.classList.remove('dragover');
          var f = e.dataTransfer && e.dataTransfer.files[0];
          if (f) handleFile(f);
        });
        fileInput.addEventListener('change', function() {
          var f = fileInput.files && fileInput.files[0];
          if (f) handleFile(f);
          fileInput.value = '';
        });
      }

      function handleFile(file) {
        var ext = (file.name || '').split('.').pop().toLowerCase();
        if (['txt', 'pdf', 'docx'].indexOf(ext) === -1) {
          addMsg(true, 'Uploaded ' + file.name);
          addMatchMsg('Tanusha', 'Please upload .txt, .pdf, or .docx only.', '');
          return;
        }
        extractTextFromFile(file).then(function(text) {
          pasteArea.value = text;
          runAnalyze(text, 'Uploaded ' + file.name);
        }).catch(function(err) {
          addMsg(true, 'Uploaded ' + file.name);
          addMatchMsg('Error', escapeHtml(err.message || 'Could not read file'), 'msg-match-weak');
        });
      }

      if (backBtn && chatPanel) {
        backBtn.addEventListener('click', function() {
          chatPanel.classList.remove('chat-result');
          if (pasteArea) pasteArea.value = '';
          if (uploadToggle && uploadPanel) {
            uploadPanel.hidden = false;
            uploadToggle.setAttribute('aria-expanded', 'true');
          }
          backBtn.hidden = true;
          if (uploadSection) {
            chatPanel.scrollTo({ top: uploadSection.offsetTop, behavior: 'smooth' });
          }
        });
      }

      if (analyzeBtn && pasteArea) {
        analyzeBtn.addEventListener('click', function() {
          var text = pasteArea.value.trim();
          if (!text) {
            addMsg(true, 'Analyze match');
            addMatchMsg('Tanusha', 'Paste a job description above or upload a file, then click Analyze match.', '');
            return;
          }
          runAnalyze(text, 'Pasted job description');
        });
      }

    })();
