// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  if (navMenu.classList.contains('active')) {
    document.body.classList.add('menu-open');
  } else {
    document.body.classList.remove('menu-open');
  }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// Close mobile nav when clicking outside
// (only if menu is open)
document.addEventListener('click', function(event) {
  const isMenuOpen = navMenu.classList.contains('active');
  if (
    isMenuOpen &&
    !navMenu.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
});

// Card Modal Popup Logic
const modal = document.getElementById('cardModal');
const modalImage = modal.querySelector('.modal-image');
const modalImgTag = modalImage.querySelector('img');
const modalTitle = modal.querySelector('.modal-title');
const modalDesc = modal.querySelector('.modal-description');
const modalClose = modal.querySelector('.modal-close');
const modalPrev = modal.querySelector('.modal-prev');
const modalNext = modal.querySelector('.modal-next');

// Collect all cards in all work sections
const allCards = Array.from(document.querySelectorAll('.work-section .card'));

// Store card data for modal and for restoring full description
const cardData = allCards.map(card => {
  // Try to get background image from style
  let bgImg = card.style.backgroundImage;
  let imgUrl = '';
  if (bgImg && bgImg.startsWith('url(')) {
    imgUrl = bgImg.slice(5, -2); // remove url(" and ")
  }
  const title = card.querySelector('.card__title')?.textContent || '';
  const descElem = card.querySelector('.card__description');
  const desc = descElem?.textContent || '';
  const descHTML = descElem?.innerHTML || '';
  return { imgUrl, title, desc, descHTML };
});

let currentCardIdx = 0;

function openModal(idx) {
  const data = cardData[idx];
  if (data.imgUrl) {
    modalImgTag.src = data.imgUrl;
    modalImgTag.style.display = 'block';
    modalImage.style.backgroundColor = '';
  } else {
    modalImgTag.src = '';
    modalImgTag.style.display = 'none';
    modalImage.style.backgroundColor = 'var(--card-bg)';
  }
  modalTitle.textContent = data.title;
  
  // Add description with Try Demo button for Figma works (first 4 cards)
  if (idx < 4) {
    modalDesc.innerHTML = data.desc + '<br><br><button class="demo-btn" data-card-index="' + idx + '">Try Demo</button>';
  } else {
    modalDesc.textContent = data.desc;
  }
  
  modal.style.display = 'flex';
  currentCardIdx = idx;
  // Hide prev if first, next if last
  modalPrev.style.display = idx === 0 ? 'none' : 'flex';
  modalNext.style.display = idx === cardData.length - 1 ? 'none' : 'flex';
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Set all card descriptions to truncated version with 'View More' if needed
allCards.forEach((card, idx) => {
  const descElem = card.querySelector('.card__description');
  const fullDesc = cardData[idx].desc;
  // Truncate to first sentence or 120 chars
  let truncated = fullDesc;
  let firstSentenceEnd = fullDesc.indexOf('.') + 1;
  if (firstSentenceEnd < 1 || firstSentenceEnd > 120) firstSentenceEnd = 120;
  if (fullDesc.length > firstSentenceEnd) {
    truncated = fullDesc.slice(0, firstSentenceEnd).trim();
    if (!truncated.endsWith('.')) truncated += '...';
    descElem.innerHTML = truncated + ' <span class="view-more-link" style="color:#EFF7FB;cursor:pointer;text-decoration:underline;">View More</span>';
    const viewMore = descElem.querySelector('.view-more-link');
    viewMore.addEventListener('click', ev => {
      ev.stopPropagation();
      openModal(idx);
    });
  } else {
    descElem.textContent = fullDesc;
  }
  // Open modal on card click (but not on 'View More' click)
  card.addEventListener('click', e => {
    if (!e.target.classList.contains('view-more-link')) {
      openModal(idx);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
modalPrev.addEventListener('click', () => {
  if (currentCardIdx > 0) openModal(currentCardIdx - 1);
});
modalNext.addEventListener('click', () => {
  if (currentCardIdx < cardData.length - 1) openModal(currentCardIdx + 1);
});

// Demo button click handler
modal.addEventListener('click', e => {
  if (e.target.classList.contains('demo-btn')) {
    const cardIndex = parseInt(e.target.getAttribute('data-card-index'));
    
    // Handle different demo links based on card index
    if (cardIndex === 0) {
      // Harvest2Home - Figma prototype
      window.open('https://www.figma.com/proto/pJd8mExFFa5plaIycgt7iw/Harvest2Home?page-id=0%3A1&node-id=2-4173&starting-point-node-id=2%3A5529&t=k2XRfVJSCpqL6NEB-1', '_blank');
    } else if (cardIndex === 1) {
      // Loop Analytics - Figma prototype
      window.open('https://www.figma.com/proto/TcxuoWvHcaBtqadENIIs4d/RAKK-GEARS---UI-Layout?node-id=1-85&t=jHg0616LEjuVJwv8-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A85&show-proto-sidebar=1', '_blank');
    } else if (cardIndex === 2) {
      // Portfolio Website - placeholder for now
      alert('Demo link for Portfolio Website coming soon!');
    } else if (cardIndex === 3) {
      // Brand Identity - placeholder for now
      alert('Demo link for Brand Identity coming soon!');
    }
  }
});

// Keyboard navigation
window.addEventListener('keydown', e => {
  if (modal.style.display === 'flex') {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && currentCardIdx > 0) openModal(currentCardIdx - 1);
    if (e.key === 'ArrowRight' && currentCardIdx < cardData.length - 1) openModal(currentCardIdx + 1);
  }
}); 