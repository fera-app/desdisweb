/* ==========================================================================
   DESDISWEB - Interactive Web Application Logic
   Handles Cotizador, WhatsApp Brief Generator, FAQ, Modals, FormSubmit & Live Links
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // --- 2. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // Open clicked if was not active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- 3. FERA Interactive Image Switcher ---
  const feraMainImg = document.getElementById('fera-main-img');
  const feraThumbnails = document.querySelectorAll('[data-fera-img]');

  if (feraThumbnails.length > 0 && feraMainImg) {
    feraThumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        feraThumbnails.forEach(t => t.classList.remove('active-thumb'));
        thumb.classList.add('active-thumb');
        const newSrc = thumb.getAttribute('data-fera-img');
        feraMainImg.style.opacity = '0';
        setTimeout(() => {
          feraMainImg.src = newSrc;
          feraMainImg.style.opacity = '1';
        }, 150);
      });
    });
  }

  // --- 4. COLUMBARIO Interactive Image Switcher ---
  const columbarioMainImg = document.getElementById('columbario-main-img');
  const columbarioThumbnails = document.querySelectorAll('[data-columbario-img]');

  if (columbarioThumbnails.length > 0 && columbarioMainImg) {
    columbarioThumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        columbarioThumbnails.forEach(t => t.classList.remove('active-thumb'));
        thumb.classList.add('active-thumb');
        const newSrc = thumb.getAttribute('data-columbario-img');
        columbarioMainImg.style.opacity = '0';
        setTimeout(() => {
          columbarioMainImg.src = newSrc;
          columbarioMainImg.style.opacity = '1';
        }, 150);
      });
    });
  }

  // --- 5. Cotizador Interactivo de Presupuesto ---
  const projectTypeOptions = document.querySelectorAll('[data-calc-type]');
  const addonOptions = document.querySelectorAll('[data-calc-addon]');
  const timelineOptions = document.querySelectorAll('[data-calc-time]');

  const estimatedPriceEl = document.getElementById('total-price');
  const summaryTextEl = document.getElementById('selected-summary');
  const sendWhatsappCalcBtn = document.getElementById('send-whatsapp-calc');

  const basePrices = {
    landing: { price: 250, name: 'Landing Page de Alta Conversión' },
    corporate: { price: 450, name: 'Sitio Web Corporativo Completo' },
    custom: { price: 700, name: 'Sistema / App Web a Medida (tipo FERA o SacroGest)' }
  };

  const addonPrices = {
    whatsapp: { price: 50, name: 'Widget WhatsApp Pro' },
    seo: { price: 100, name: 'SEO Avanzado Google' },
    speed: { price: 80, name: 'Carga Ultra-Rápida (< 1s)' }
  };

  const timelineMultipliers = {
    normal: { mult: 1.0, name: 'Estándar (5-10 días)' },
    express: { mult: 1.25, name: 'Express (48-72 hrs)' }
  };

  let selectedType = 'landing';
  let selectedAddons = [];
  let selectedTimeline = 'normal';

  function updateCalculator() {
    let total = basePrices[selectedType]?.price || 250;
    let addonNames = [];

    selectedAddons.forEach(addonKey => {
      if (addonPrices[addonKey]) {
        total += addonPrices[addonKey].price;
        addonNames.push(addonPrices[addonKey].name);
      }
    });

    total = Math.round(total * (timelineMultipliers[selectedTimeline]?.mult || 1.0));

    if (estimatedPriceEl) {
      estimatedPriceEl.textContent = `$${total} USD`;
    }

    if (summaryTextEl) {
      summaryTextEl.innerHTML = `• <strong>Proyecto:</strong> ${basePrices[selectedType].name}<br>` +
        `• <strong>Módulos:</strong> ${addonNames.length > 0 ? addonNames.join(', ') : 'Base'}<br>` +
        `• <strong>Tiempo:</strong> ${timelineMultipliers[selectedTimeline].name}`;
    }

    if (sendWhatsappCalcBtn) {
      const waMessage = `¡Hola Felix Rodriguez! He cotizado un proyecto en DESDISWEB:\n\n` +
        `• *Tipo:* ${basePrices[selectedType].name}\n` +
        `• *Adicionales:* ${addonNames.join(', ') || 'Ninguno'}\n` +
        `• *Tiempo:* ${timelineMultipliers[selectedTimeline].name}\n` +
        `• *Presupuesto Estimado:* $${total} USD\n\n` +
        `Me gustaría conversar para iniciar.`;

      sendWhatsappCalcBtn.onclick = () => {
        window.open(`https://wa.me/573000000000?text=${encodeURIComponent(waMessage)}`, '_blank');
      };
    }
  }

  projectTypeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      projectTypeOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedType = opt.getAttribute('data-calc-type');
      updateCalculator();
    });
  });

  addonOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('selected');
      const key = opt.getAttribute('data-calc-addon');
      if (opt.classList.contains('selected')) {
        if (!selectedAddons.includes(key)) selectedAddons.push(key);
      } else {
        selectedAddons = selectedAddons.filter(k => k !== key);
      }
      updateCalculator();
    });
  });

  timelineOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      timelineOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedTimeline = opt.getAttribute('data-calc-time');
      updateCalculator();
    });
  });

  updateCalculator();

  // --- 6. FormSubmit & WhatsApp Secondary Handler ---
  const btnWhatsappDirect = document.getElementById('btn-send-whatsapp-direct');
  if (btnWhatsappDirect) {
    btnWhatsappDirect.addEventListener('click', () => {
      const name = document.getElementById('form-name')?.value || 'Cliente';
      const email = document.getElementById('form-email')?.value || '';
      const message = document.getElementById('form-message')?.value || '';

      const waMsg = `¡Hola Felix Rodriguez! Soy ${name} (${email}).\n\nMensaje: ${message}`;
      window.open(`https://wa.me/573000000000?text=${encodeURIComponent(waMsg)}`, '_blank');
    });
  }

  // Success Notice from FormSubmit Return
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    const successMsg = document.getElementById('form-success-msg');
    if (successMsg) {
      successMsg.style.display = 'block';
    }
  }

  // --- 7. Project Modal Handler with Live URLs ---
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalImg = document.getElementById('modal-img');
  const modalTags = document.getElementById('modal-tags');
  const modalGallery = document.getElementById('modal-gallery');
  const modalLiveBtn = document.getElementById('modal-live-btn');

  const projectDetailsData = {
    fera: {
      title: 'Proyecto FERA - Gestión Agropecuaria Inteligente',
      liveUrl: 'https://fera-app.pages.dev',
      images: [
        { src: 'img/fera-dashboard.png', label: '📊 Dashboard & Finanzas' },
        { src: 'img/fera-login.png', label: '🔐 Pantalla de Inicio / Login' },
        { src: 'img/fera-bovinos.png', label: '🐄 Trazabilidad de Bovinos & Ganado' }
      ],
      tags: ['SaaS ERP Boutique', 'UI/UX Dark Theme', 'Gestión de Ganado', 'Finanzas & Alertas', 'JavaScript ES6+', 'Dashboard Interactivo'],
      desc: 'FERA es un sistema de gestión agropecuaria inteligente en vivo (disponible en fera-app.pages.dev) desarrollado por Felix Rodriguez para optimizar el control de producción láctea, trazabilidad de ganado bovino, inventarios y finanzas en tiempo real.'
    },
    columbario: {
      title: 'Proyecto COLUMBARIO - SacroGest Parroquial',
      liveUrl: 'https://columbario.pages.dev',
      images: [
        { src: 'img/columbario-dashboard.png', label: '📊 Dashboard & Métricas' },
        { src: 'img/columbario-plano.png', label: '🗺️ Plano Interactivo & Nichos' },
        { src: 'img/columbario-login.png', label: '🔐 Acceso & Credenciales' }
      ],
      tags: ['Sistema SacroGest', 'Plano Interactivo de Nichos', 'Gestión de Difuntos & Contratos', 'Alertas de Renovación', 'Sincronización Cloud', 'UI/UX Ejecutiva'],
      desc: 'COLUMBARIO (SacroGest) es una solución web funcional en vivo (disponible en columbario.pages.dev) desarrollada por Felix Rodriguez para la Parroquia Divino Redentor. Permite controlar la ocupación de nichos mediante un mapa/plano interactivo por módulos (A-E), notificaciones inteligentes e historial de difuntos.'
    }
  };

  document.querySelectorAll('[data-project-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-project-trigger');
      const data = projectDetailsData[key];

      if (data && modal) {
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalDesc) modalDesc.textContent = data.desc;
        if (modalImg) modalImg.src = data.images[0].src;

        if (modalLiveBtn) {
          modalLiveBtn.href = data.liveUrl;
          modalLiveBtn.textContent = `Probar ${key.toUpperCase()} en Vivo (${data.liveUrl.replace('https://', '')})`;
        }

        if (modalTags) {
          modalTags.innerHTML = data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');
        }

        if (modalGallery) {
          if (data.images.length > 1) {
            modalGallery.style.display = 'flex';
            modalGallery.innerHTML = data.images.map((img, idx) => `
              <div class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="changeModalImage('${img.src}', this)">
                <img src="${img.src}" alt="${img.label}">
                <span>${img.label}</span>
              </div>
            `).join('');
          } else {
            modalGallery.style.display = 'none';
          }
        }

        modal.style.display = 'flex';
      }
    });
  });

  window.changeModalImage = (src, el) => {
    if (modalImg) modalImg.src = src;
    document.querySelectorAll('.modal-thumb-btn').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
  };

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
});
