// ===== Configurações rápidas =====
const WHATSAPP_NUMBER = '5544999127552';
const CONTACT_EMAIL = 'alexdias0831@gmail.com';

// ===== Persistência do tema (Interatividade & UX)
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const THEME_KEY = 'theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  if (theme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');

  if (themeToggle) {
    const isLight = theme === 'light';
    themeToggle.setAttribute('aria-label', isLight ? 'Alternar para tema escuro' : 'Alternar para tema claro');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.textContent = isLight ? '🌙' : '☀️';
  }

  const themeColorMeta = document.getElementById('theme-color-meta');
  if (themeColorMeta) themeColorMeta.setAttribute('content', theme === 'light' ? '#f7f7fb' : '#121212');
}

applyTheme(getPreferredTheme());

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
function closeMenu() {
  hamburger?.classList.remove('active');
  hamburger?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('open');
}

hamburger?.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  hamburger.classList.toggle('active');
  menu?.classList.toggle('open');
});
document.querySelectorAll('.menu-link').forEach(link =>
  link.addEventListener('click', () => {
    closeMenu();
  })
);

document.addEventListener('click', (e) => {
  if (!menu || !hamburger) return;
  const isOpen = menu.classList.contains('open');
  if (!isOpen) return;
  const target = e.target;
  if (!(target instanceof Node)) return;
  const clickedInside = menu.contains(target) || hamburger.contains(target);
  if (!clickedInside) closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

const sections = ['home','experiencias','conhecimentos','projetos','contato'];
const menuLinks = Array.from(document.querySelectorAll('.menu-link'));
const obsActive = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = menuLinks.find(a => a.getAttribute('href') === '#' + id);
    if (link) {
      if (entry.isIntersecting) link.classList.add('active');
      else link.classList.remove('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) obsActive.observe(el);
});

const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15});
  revealEls.forEach(el=> io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

const typingEl = document.getElementById('typing');
const roles = [
  'Construindo soluções com React e Node.js',
  'Desenvolvedor Full Stack apaixonado por tecnologia',
  'Código limpo, boas práticas e evolução constante'
];
let r = 0, i = 0, deleting = false;
function type(){
  const current = roles[r];
  if(!deleting){
    typingEl.textContent = current.slice(0, i++);
    if(i > current.length){ deleting = true; setTimeout(type, 1200); return; }
  } else {
    typingEl.textContent = current.slice(0, i--);
    if(i === 0){ deleting = false; r = (r+1)%roles.length; }
  }
  setTimeout(type, deleting ? 35 : 60);
}
if (typingEl) {
  if (prefersReducedMotion) {
    typingEl.textContent = roles[0];
  } else {
    type();
  }
}

document.querySelectorAll(".tempo-exp").forEach((el) => {
    const inicio = new Date(el.dataset.inicio);
    const hoje = new Date();

    let anos = hoje.getFullYear() - inicio.getFullYear();
    let meses = hoje.getMonth() - inicio.getMonth();

    if (meses < 0) {
        anos--;
        meses += 12;
    }

    const partes = [];

    if (anos > 0) {
        partes.push(`${anos} ${anos === 1 ? "ano" : "anos"}`);
    }

    if (meses > 0) {
        partes.push(`${meses} ${meses === 1 ? "mês" : "meses"}`);
    }

    el.textContent = partes.join(" e ") || "menos de 1 mês";
});

const form = document.getElementById('form-contato');
const emailBtn = document.getElementById('btn-email');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const nome = document.getElementById('nome')?.value?.trim?.() ?? '';
  const assunto = document.getElementById('assunto')?.value?.trim?.() || 'Contato pelo portfólio';
  const msg = document.getElementById('mensagem')?.value?.trim?.() ?? '';
  const texto = encodeURIComponent(`Olá! Sou ${nome}. Assunto: ${assunto}.\n\n${msg}`);

  const phone = String(WHATSAPP_NUMBER).replace(/\D/g, '');
  if (!phone) return;
  window.open(`https://wa.me/${phone}?text=${texto}`, '_blank', 'noopener,noreferrer');
});
emailBtn?.addEventListener('click', ()=>{
  const nome = document.getElementById('nome')?.value?.trim?.() ?? '';
  const email = document.getElementById('email')?.value?.trim?.() ?? '';
  const assunto = document.getElementById('assunto')?.value?.trim?.() || 'Contato pelo portfólio';
  const msg = document.getElementById('mensagem')?.value?.trim?.() ?? '';
  const body = encodeURIComponent(`Olá! Sou ${nome}${email? ` (${email})` : ''}.\n\n${msg}`);
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(assunto)}&body=${body}`,
    '_blank'
  );;
});

// ===== Ano dinâmico no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();