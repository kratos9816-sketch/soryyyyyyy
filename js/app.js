/* ==========================================================================
   KIRTHIKHA'S LOVE LETTER & APOLOGY WEBSITE - JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     0. PASSWORD LOCK SCREEN CONTROL
     -------------------------------------------------------------------------- */
  const lockScreen = document.getElementById('lockScreen');
  const passwordInput = document.getElementById('passwordInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const lockError = document.getElementById('lockError');
  const lockCard = document.getElementById('lockCard');

  function checkPassword() {
    if (!passwordInput) return;
    const val = passwordInput.value.trim().toLowerCase();
    if (val === 'wife') {
      if (lockError) lockError.classList.remove('active');
      if (lockScreen) lockScreen.classList.add('unlocked');
      if (typeof toggleAudio === 'function' && !isPlaying) {
        toggleAudio();
      }
    } else {
      if (lockError) {
        lockError.textContent = "Who are you to Aghil? 🤨";
        lockError.classList.add('active');
      }
      if (lockCard) {
        lockCard.classList.remove('shake');
        void lockCard.offsetWidth; // trigger reflow
        lockCard.classList.add('shake');
      }
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  if (unlockBtn) {
    unlockBtn.addEventListener('click', checkPassword);
  }
  if (passwordInput) {
    passwordInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        checkPassword();
      }
    });
  }

  /* --------------------------------------------------------------------------
     1. CANVAS PARTICLES (Floating Hearts & Sparkles)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class HeartParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 14 + 8;
      this.speedY = Math.random() * 1.2 + 0.5;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.color = Math.random() > 0.4 ? '#ff85a1' : '#ffd1dc';
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      // Draw Heart Shape
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
      ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 45 }, () => new HeartParticle());

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  /* --------------------------------------------------------------------------
     2. CURSOR GLOW EFFECT
     -------------------------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* --------------------------------------------------------------------------
     3. AUDIO SYSTEM & WEB AUDIO SYNTH FALLBACK
     -------------------------------------------------------------------------- */
  const audioEl = document.getElementById('bgAudio');
  const musicPill = document.getElementById('musicPill');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');
  const musicStatus = document.getElementById('musicStatus');
  const volumeSlider = document.getElementById('volumeSlider');

  let isPlaying = false;
  let audioCtx = null;
  let synthInterval = null;

  // Romantic Ambient Synth generator if audio file is not available
  function playAmbientSynth() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 349.23], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G
    ];

    let chordIdx = 0;

    function triggerChord() {
      if (!isPlaying) return;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq, i) => {
        setTimeout(() => {
          if (!isPlaying) return;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

          const volume = (volumeSlider ? volumeSlider.value : 0.5) * 0.12;
          gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.5);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 4.8);
        }, i * 350);
      });
    }

    triggerChord();
    synthInterval = setInterval(triggerChord, 5000);
  }

  function stopAmbientSynth() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function toggleAudio() {
    if (!isPlaying) {
      // Try playing MP3 first
      if (audioEl) {
        audioEl.volume = volumeSlider ? volumeSlider.value : 0.5;
        audioEl.play().then(() => {
          isPlaying = true;
          updateMusicUI(true);
        }).catch(err => {
          console.log('Audio file play failed, using ambient synth fallback:', err);
          isPlaying = true;
          playAmbientSynth();
          updateMusicUI(true);
        });
      } else {
        isPlaying = true;
        playAmbientSynth();
        updateMusicUI(true);
      }
    } else {
      isPlaying = false;
      if (audioEl) audioEl.pause();
      stopAmbientSynth();
      updateMusicUI(false);
    }
  }

  function updateMusicUI(active) {
    if (active) {
      musicPill.classList.add('playing');
      musicIcon.textContent = '🎵';
      musicStatus.textContent = 'ON';
    } else {
      musicPill.classList.remove('playing');
      musicIcon.textContent = '🔇';
      musicStatus.textContent = 'OFF';
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleAudio);
  }

  if (volumeSlider && audioEl) {
    volumeSlider.addEventListener('input', (e) => {
      audioEl.volume = e.target.value;
    });
  }

  // Hero CTA Button triggers music enable option & smooth scroll
  const heroCtaBtn = document.getElementById('heroCtaBtn');
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isPlaying) {
        toggleAudio();
      }
      const section2 = document.getElementById('crime');
      if (section2) {
        section2.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. INTERSECTION OBSERVER FOR SCROLL REVEALS
     -------------------------------------------------------------------------- */
  const observerOptions = {
    threshold: 0.2
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Handle child reveals if specified
        const children = entry.target.querySelectorAll('.reveal-child');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('active');
          }, index * 250);
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
  });

  // Section 2 Statement Reveal
  const crimeSection = document.getElementById('crime');
  if (crimeSection) {
    const crimeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statements = entry.target.querySelectorAll('.statement-item');
          statements.forEach((stmt, idx) => {
            setTimeout(() => {
              stmt.classList.add('active');
            }, idx * 600);
          });
        }
      });
    }, { threshold: 0.3 });
    crimeObserver.observe(crimeSection);
  }

  // Section 3 Timeline Observer
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  // Section 4 Love Letter Paragraphs Reveal
  const loveLetterCard = document.querySelector('.love-letter-card');
  if (loveLetterCard) {
    const letterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const paragraphs = entry.target.querySelectorAll('.letter-paragraph');
          paragraphs.forEach((p, idx) => {
            setTimeout(() => {
              p.classList.add('active');
            }, idx * 450);
          });
        }
      });
    }, { threshold: 0.2 });
    letterObserver.observe(loveLetterCard);
  }

  // Section 7 Morning Lines & Sunrise Theme Transition Observer
  const morningSection = document.getElementById('morning');
  if (morningSection) {
    const morningObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.body.classList.add('sunrise-theme');
          const lines = entry.target.querySelectorAll('.morning-line');
          lines.forEach((line, idx) => {
            setTimeout(() => {
              line.classList.add('active');
            }, idx * 700);
          });
        } else {
          document.body.classList.remove('sunrise-theme');
        }
      });
    }, { threshold: 0.3 });
    morningObserver.observe(morningSection);
  }

  // Section 9 Finale Sequence Observer
  const finaleSection = document.getElementById('finale');
  if (finaleSection) {
    const finaleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lines = entry.target.querySelectorAll('.finale-line');
          lines.forEach((line, idx) => {
            setTimeout(() => {
              line.classList.add('active');
            }, idx * 1000);
          });
        }
      });
    }, { threshold: 0.3 });
    finaleObserver.observe(finaleSection);
  }

  /* --------------------------------------------------------------------------
     5. FORGIVENESS SECTION (YES / NO INTERACTION)
     -------------------------------------------------------------------------- */
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const forgivenessQuestionBox = document.getElementById('forgivenessQuestionBox');
  const forgivenessSuccess = document.getElementById('forgivenessSuccess');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTryAgainBtn = document.getElementById('modalTryAgainBtn');

  // Playful NO button evasion on hover (mobile/desktop)
  if (btnNo) {
    let dodgeCount = 0;
    btnNo.addEventListener('mouseenter', () => {
      if (dodgeCount < 3) {
        const randomX = (Math.random() - 0.5) * 160;
        const randomY = (Math.random() - 0.5) * 80;
        btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
        dodgeCount++;
      }
    });

    btnNo.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });
  }

  if (modalTryAgainBtn) {
    modalTryAgainBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      if (btnNo) {
        btnNo.style.transform = 'translate(0, 0)';
      }
    });
  }

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      forgivenessQuestionBox.style.display = 'none';
      forgivenessSuccess.classList.add('active');
      triggerHeartExplosion();
    });
  }

  /* Heart Explosion / Confetti Canvas System */
  function triggerHeartExplosion() {
    const c = document.getElementById('confettiCanvas');
    const cx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    class ConfettiHeart {
      constructor() {
        this.x = c.width / 2;
        this.y = c.height / 2 + 50;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 5;
        this.gravity = 0.25;
        this.size = Math.random() * 16 + 10;
        this.color = `hsl(${Math.random() * 40 + 330}, 100%, 65%)`;
        this.opacity = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
      }

      update() {
        this.vx *= 0.98;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        this.opacity -= 0.012;
      }

      draw() {
        if (this.opacity <= 0) return;
        cx.save();
        cx.translate(this.x, this.y);
        cx.rotate(this.rotation);
        cx.globalAlpha = this.opacity;
        cx.fillStyle = this.color;

        cx.beginPath();
        const h = this.size * 0.3;
        cx.moveTo(0, h);
        cx.bezierCurveTo(0, 0, -this.size/2, 0, -this.size/2, h);
        cx.bezierCurveTo(-this.size/2, (this.size+h)/2, 0, this.size, 0, this.size);
        cx.bezierCurveTo(0, (this.size+h)/2, this.size/2, (this.size+h)/2, this.size/2, h);
        cx.bezierCurveTo(this.size/2, 0, 0, 0, 0, h);
        cx.closePath();
        cx.fill();

        cx.restore();
      }
    }

    const confettiList = Array.from({ length: 120 }, () => new ConfettiHeart());

    function renderConfetti() {
      cx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      confettiList.forEach(item => {
        if (item.opacity > 0) {
          alive = true;
          item.update();
          item.draw();
        }
      });
      if (alive) {
        requestAnimationFrame(renderConfetti);
      } else {
        cx.clearRect(0, 0, c.width, c.height);
      }
    }

    renderConfetti();
  }

  /* --------------------------------------------------------------------------
     6. OUR MEMORIES LIGHTBOX MODAL
     -------------------------------------------------------------------------- */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContainer = document.getElementById('lightboxContainer');
  const lightboxCaption = document.getElementById('lightboxCaption');

  document.querySelectorAll('.polaroid-card').forEach(card => {
    // Add subtle random rotation for natural polaroid stack look
    const randomRot = (Math.random() * 8 - 4).toFixed(1);
    card.style.setProperty('--rand-rot', `${randomRot}deg`);

    card.addEventListener('click', () => {
      const type = card.getAttribute('data-type');
      const src = card.getAttribute('data-src');
      const caption = card.getAttribute('data-caption');

      lightboxContainer.innerHTML = '';
      if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.className = 'lightbox-media';
        lightboxContainer.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'lightbox-media';
        lightboxContainer.appendChild(img);
      }

      lightboxCaption.textContent = caption || '';
      lightboxModal.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      lightboxContainer.innerHTML = '';
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        lightboxContainer.innerHTML = '';
      }
    });
  }

});
