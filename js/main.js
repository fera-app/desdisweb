/* ==========================================================================
   DESDISWEB - Interactive Web Application Logic
   Handles Cotizador, WhatsApp Brief Generator, FAQ, Modals & Mobile Menu
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

  // --- 3. Cotizador Interactivo de Presupuesto ---
  const projectTypeOptions = document.querySelectorAll('[data-calc-type]');
  const addonOptions = document.querySelectorAll('[data-calc-addon]');
  const timelineOptions = document.querySelectorAll('[data-calc-time]');

  const estimatedPriceEl = document.getElementById('calc-total-price');
  const summaryTextEl = document.getElementById('calc-summary-text');
  const sendWhatsappBtn = document.getElementById('calc-whatsapp-btn');

  // Pricing Matrix (Estimates in USD / COP display)
  const basePrices = {
    landing: { price: 180, name: 'Landing Page de Alta Conversión' },
    corp: { price: 320, name: 'Sitio Web Corporativo Completo' },
    system: { price: 550, name: 'Sistema / App Web a Medida' },
    redesign: { price: 210, name: 'Rediseño & Optimización de Carga/SEO' }
  };

  const addonPrices = {
    whatsapp: { price: 30, name: 'Integración WhatsApp Directo & Widget' },
    seo: { price: 60, name: 'Optimización SEO Google & Carga < 1s' },
    custom_cms: { price: 80, name: 'Administrador de Contenidos Personalizado' },
    support: { price: 50, name: 'Mantenimiento & Hosting por 1 Año' }
  };

  const timelineMultipliers = {
    standard: { mult: 1.0, name: 'Tiempo Estándar (7-10 días)' },
    express: { mult: 1.25, name: 'Prioridad Express (48-72h)' }
  };

  let selectedType = 'landing';
  let selectedAddons = ['whatsapp', 'seo'];
  let selectedTimeline = 'standard';

  function updateCalculator() {
    // 1. Calculate Base
    let total = basePrices[selectedType].price;
    let selectedAddonNames = [];

    // 2. Addons
    selectedAddons.forEach(addonKey => {
      if (addonPrices[addonKey]) {
        total += addonPrices[addonKey].price;
        selectedAddonNames.push(addonPrices[addonKey].name);
      }
    });

    // 3. Timeline
    total = Math.round(total * timelineMultipliers[selectedTimeline].mult);

    // 4. Update UI
    if (estimatedPriceEl) {
      estimatedPriceEl.innerHTML = `$${total} <span style="font-size:1.1rem; color:var(--text-muted);">USD (aprox. $${(total * 4000).toLocaleString('es-CO')} COP)</span>`;
    }

    if (summaryTextEl) {
      summaryTextEl.innerHTML = `<strong>Proyecto:</strong> ${basePrices[selectedType].name}<br>` +
        `<strong>Complementos:</strong> ${selectedAddonNames.length > 0 ? selectedAddonNames.join(', ') : 'Ninguno'}<br>` +
        `<strong>Entrega:</strong> ${timelineMultipliers[selectedTimeline].name}`;
    }

    // 5. Update WhatsApp Link with pre-filled Message
    if (sendWhatsappBtn) {
      const message = `¡Hola Felix! Vi tu web en DESDISWEB y usé el cotizador interactivo:\n\n` +
        `📌 *Tipo de Proyecto:* ${basePrices[selectedType].name}\n` +
        `✨ *Complementos:* ${selectedAddonNames.join(', ') || 'Básico'}\n` +
        `⏱️ *Tiempo estimado:* ${timelineMultipliers[selectedTimeline].name}\n` +
        `💰 *Presupuesto estimado:* $${total} USD (~$${(total * 4000).toLocaleString('es-CO')} COP)\n\n` +
        `Quiero coordinar los detalles para iniciar mi proyecto.`;

      const encodedMsg = encodeURIComponent(message);
      // WhatsApp link - using user contact or placeholder number
      sendWhatsappBtn.href = `https://wa.me/573000000000?text=${encodedMsg}`;
    }
  }

  // Event Listeners for Project Types
  projectTypeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      projectTypeOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedType = opt.getAttribute('data-calc-type');
      updateCalculator();
    });
  });

  // Event Listeners for Addons (Multi-select)
  addonOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('selected');
      const addonKey = opt.getAttribute('data-calc-addon');
      if (opt.classList.contains('selected')) {
        if (!selectedAddons.includes(addonKey)) selectedAddons.push(addonKey);
      } else {
        selectedAddons = selectedAddons.filter(a => a !== addonKey);
      }
      updateCalculator();
    });
  });

  // Event Listeners for Timeline
  timelineOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      timelineOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedTimeline = opt.getAttribute('data-calc-time');
      updateCalculator();
    });
  });

  // Initial calculation run
  updateCalculator();

  // --- 4. Contact Form Handler ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || 'Cliente';
      const email = document.getElementById('form-email')?.value || '';
      const project = document.getElementById('form-project')?.value || '';
      const message = document.getElementById('form-message')?.value || '';

      const waMsg = `¡Hola Felix! Soy ${name} (${email}).\n\nQuiero cotizar el siguiente proyecto: *${project}*\n\nMensaje: ${message}`;
      window.open(`https://wa.me/573000000000?text=${encodeURIComponent(waMsg)}`, '_blank');
    });
  }

  // --- 5. Project Modal Handler ---
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalImg = document.getElementById('modal-img');
  const modalTags = document.getElementById('modal-tags');

  const projectDetailsData = {
    fera: {
      title: 'Proyecto FERA - Plataforma & Experiencia Web',
      img: 'img/fera.png',
      tags: ['UX/UI Design', 'Desarrollo Web', 'Optimización de Velocidad', 'Mobile First'],
      desc: 'Plataforma web desarrollada con arquitectura moderna enfocada en ofrecer una experiencia de usuario fluida, navegación intuitiva y máxima velocidad de carga. Diseñada para transmitir elegancia, autoridad y convertir visitas en clientes potenciales.'
    },
    columbario: {
      title: 'Proyecto COLUMBARIO - Sistema Web & Arquitectura de Información',
      img: 'img/columbario.png',
      tags: ['Sistema Web', 'Arquitectura de Datos', 'Interfaz Intuitiva', 'SEO & Seguridad'],
      desc: 'Solución web completa diseñada para el Proyecto Columbario, optimizando la consulta de información, la interacción digital de usuarios y la presentación estructurada de servicios con estándares altos de accesibilidad y seguridad.'
    }
  };

  document.querySelectorAll('[data-project-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-project-trigger');
      const data = projectDetailsData[key];

      if (data && modal) {
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalDesc) modalText = data.desc;
        if (modalDesc) modalDesc.textContent = data.desc;
        if (modalImg) modalImg.src = data.img;

        if (modalTags) {
          modalTags.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
        }

        modal.style.display = 'flex';
      }
    });
  });

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
