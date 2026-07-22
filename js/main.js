/* ==========================================================================
   DESDISWEB - Interactive Web Application Logic
   Handles Cotizador, WhatsApp Brief Generator, FAQ, Modals & FERA Gallery
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

  // --- 3. FERA Interactive Image Switcher (Card & Modal) ---
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

  // --- 4. Cotizador Interactivo de Presupuesto ---
  const projectTypeOptions = document.querySelectorAll('[data-calc-type]');
  const addonOptions = document.querySelectorAll('[data-calc-addon]');
  const timelineOptions = document.querySelectorAll('[data-calc-time]');

  const estimatedPriceEl = document.getElementById('total-price');
  const summaryTextEl = document.getElementById('selected-summary');
  const sendWhatsappCalcBtn = document.getElementById('send-whatsapp-calc');

  const basePrices = {
    landing: { price: 250, name: 'Landing Page de Alta Conversión' },
    corporate: { price: 450, name: 'Sitio Web Corporativo Completo' },
    custom: { price: 700, name: 'Sistema / App Web a Medida (tipo FERA)' }
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
      const waMessage = `¡Hola Felix! He cotizado un proyecto en DESDISWEB:\n\n` +
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

  // --- 5. Contact Form Handler ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const message = document.getElementById('form-message')?.value || '';

      const waMsg = `¡Hola Felix! Soy ${name} (${email}).\n\nMensaje: ${message}`;
      window.open(`https://wa.me/573000000000?text=${encodeURIComponent(waMsg)}`, '_blank');
    });
  }

  // --- 6. Project Modal Handler & Multi-Image Gallery ---
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalImg = document.getElementById('modal-img');
  const modalTags = document.getElementById('modal-tags');
  const modalGallery = document.getElementById('modal-gallery');

  const projectDetailsData = {
    fera: {
      title: 'Proyecto FERA - Gestión Agropecuaria Inteligente (SaaS ERP Boutique)',
      images: [
        { src: 'img/fera-dashboard.png', label: '📊 Dashboard & Finanzas' },
        { src: 'img/fera-login.png', label: '🔐 Pantalla de Inicio / Login' },
        { src: 'img/fera-bovinos.png', label: '🐄 Trazabilidad de Bovinos & Ganado' }
      ],
      tags: ['SaaS ERP', 'UI/UX Dark Theme', 'Gestión de Ganado', 'Finanzas & Alertas', 'JavaScript ES6+', 'Dashboard Interactivo'],
      desc: 'FERA es un sistema de gestión agropecuaria inteligente diseñado para optimizar el control de producción láctea, trazabilidad de ganado bovino, inventarios y finanzas en tiempo real. Incluye autenticación segura, notificaciones de alarmas (gestaciones, pagos) y panel de control analítico.'
    },
    columbario: {
      title: 'Proyecto COLUMBARIO - Sistema Web & Arquitectura de Información',
      images: [
        { src: 'img/columbario.png', label: '🏛️ Vista Principal Columbario' }
      ],
      tags: ['Sistema Web', 'Arquitectura de Datos', 'Interfaz Ejecutiva', 'SEO & Seguridad'],
      desc: 'Solución web avanzada diseñada para la gestión de información estructurada y experiencia de usuario sobria y ejecutiva, priorizando tiempos de carga veloces, navegación intuitiva y diseño adaptable a dispositivos móviles.'
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
