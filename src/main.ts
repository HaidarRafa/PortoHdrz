import cssLogo from '../images/skills/css.png';
import dbeaverLogo from '../images/skills/dbeaver.png';
import dockerLogo from '../images/skills/docker.png';
import htmlLogo from '../images/skills/html.png';
import mongodbLogo from '../images/skills/mongodb.png';
import pythonLogo from '../images/skills/python.png';
import sqlLogo from '../images/skills/sql.png';
import typescriptLogo from '../images/skills/typescript.png';
import viteLogo from '../images/skills/vite.png';

type ShowcaseCategory = 'Keahlian' | 'Sertifikat' | 'Proyek';

interface ShowcaseItem {
  title: string;
  category: ShowcaseCategory;
  logo?: string;
  description?: string;
  href?: string;
}

const showcaseItems: ShowcaseItem[] = [
  { title: 'Python', category: 'Keahlian', logo: pythonLogo },
  { title: 'SQL', category: 'Keahlian', logo: sqlLogo },
  { title: 'Docker', category: 'Keahlian', logo: dockerLogo },
  { title: 'MongoDB', category: 'Keahlian', logo: mongodbLogo },
  { title: 'DBeaver', category: 'Keahlian', logo: dbeaverLogo },
  { title: 'HTML', category: 'Keahlian', logo: htmlLogo },
  { title: 'CSS', category: 'Keahlian', logo: cssLogo },
  { title: 'TypeScript', category: 'Keahlian', logo: typescriptLogo },
  { title: 'Vite', category: 'Keahlian', logo: viteLogo },
];

const courses: string[] = [
  'Manajemen Basis Data',
  'Jaringan Komputer',
  'Pengembangan Aplikasi Web',
  'Interaksi Manusia dan Komputer',
  'Intelegensia Buatan',
  'Manajemen Proyek Perangkat Lunak',
  'Pengembangan Aplikasi Mobile',
];

const currentYear: number = new Date().getFullYear();
const autoplaySpeed = 34;

function renderList<T>(
  list: HTMLUListElement | HTMLOListElement,
  items: readonly T[],
  createItem: (item: T) => HTMLLIElement,
): void {
  list.replaceChildren(...items.map(createItem));
}

function createShowcaseItem(item: ShowcaseItem, isClone = false): HTMLLIElement {
  const listItem = document.createElement('li');
  listItem.className = 'showcase-item';

  if (isClone) {
    listItem.setAttribute('aria-hidden', 'true');
    listItem.setAttribute('inert', '');
  }

  const card = document.createElement('article');
  card.className = 'showcase-card';

  if (item.logo) {
    const image = document.createElement('img');
    image.src = item.logo;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.decoding = 'async';
    image.loading = 'lazy';
    card.append(image);
  }

  const label = document.createElement('span');
  label.className = 'showcase-title';
  label.textContent = item.title;
  card.append(label);

  if (item.description) {
    const description = document.createElement('p');
    description.className = 'showcase-description';
    description.textContent = item.description;
    card.append(description);
  }

  if (item.href) {
    const link = document.createElement('a');
    link.className = 'showcase-link';
    link.href = item.href;
    link.textContent = 'Lihat detail';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    card.append(link);
  }

  listItem.append(card);
  return listItem;
}

function createCourseItem(course: string): HTMLLIElement {
  const listItem = document.createElement('li');
  listItem.textContent = course;
  return listItem;
}

const yearElement = document.querySelector<HTMLElement>('#current-year');
const showcaseListElement = document.querySelector<HTMLUListElement>('#showcase-list');
const courseListElement = document.querySelector<HTMLOListElement>('#course-list');

if (!yearElement || !showcaseListElement || !courseListElement) {
  throw new Error('Elemen portfolio yang dibutuhkan tidak ditemukan di index.html.');
}

const showcaseList = showcaseListElement;

yearElement.textContent = String(currentYear);

const beforeShowcase = showcaseItems.map((item) => createShowcaseItem(item, true));
const mainShowcase = showcaseItems.map((item) => createShowcaseItem(item));
const afterShowcase = showcaseItems.map((item) => createShowcaseItem(item, true));
showcaseList.replaceChildren(...beforeShowcase, ...mainShowcase, ...afterShowcase);
renderList(courseListElement, courses, createCourseItem);

const showcaseCards: HTMLElement[] = [];
for (const item of Array.from(showcaseList.children)) {
  if (!(item instanceof HTMLElement)) {
    throw new Error('Item carousel bukan elemen HTML yang valid.');
  }
  showcaseCards.push(item);
}

const firstMainItem = showcaseList.children.item(showcaseItems.length);
const firstAfterItem = showcaseList.children.item(showcaseItems.length * 2);
if (!(firstMainItem instanceof HTMLElement) || !(firstAfterItem instanceof HTMLElement)) {
  throw new Error('Item carousel tidak dapat disiapkan untuk pengulangan.');
}

const mainCycleFirst = firstMainItem;
const afterCycleFirst = firstAfterItem;
const reducedMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let cycleWidth = 0;
let loopStart = 0;
let loopEnd = 0;
let animationFrame = 0;
let lastFrameTime = 0;
let pointerIsOver = false;
let pointerIsDown = false;
let dragStartX = 0;
let dragStartScrollLeft = 0;
let activePointerId: number | null = null;
let focusIsInside = false;
let carouselIsVisible = true;

function updateShowcaseFocus(): void {
  const viewportBounds = showcaseList.getBoundingClientRect();
  const viewportCenter = viewportBounds.left + showcaseList.clientWidth / 2;
  const focusRange = Math.max(showcaseList.clientWidth / 2, 1);
  const positions = showcaseCards.map((item) => item.getBoundingClientRect());

  showcaseCards.forEach((item, index) => {
    const position = positions[index];
    const itemCenter = position.left + position.width / 2;
    const distance = Math.abs(itemCenter - viewportCenter);
    const focus = Math.max(0, 1 - distance / focusRange);
    item.style.opacity = String(0.25 + focus * 0.75);
    item.style.filter = `blur(${((1 - focus) * 4).toFixed(2)}px)`;
  });
}

function positionShowcase(): void {
  const viewportBounds = showcaseList.getBoundingClientRect();
  const mainBounds = mainCycleFirst.getBoundingClientRect();
  const afterBounds = afterCycleFirst.getBoundingClientRect();
  cycleWidth = afterBounds.left - mainBounds.left;

  if (cycleWidth <= 0) {
    throw new Error('Lebar carousel tidak valid untuk pengulangan.');
  }

  const viewportCenter = viewportBounds.left + showcaseList.clientWidth / 2;
  const mainItemCenter = mainBounds.left + mainBounds.width / 2;
  loopStart = showcaseList.scrollLeft + mainItemCenter - viewportCenter;
  loopEnd = loopStart + cycleWidth;
  showcaseList.scrollLeft = loopStart;
  updateShowcaseFocus();
}

function normalizeLoopPosition(): void {
  if (showcaseList.scrollLeft >= loopEnd) {
    showcaseList.scrollLeft -= cycleWidth;
  } else if (showcaseList.scrollLeft < loopStart) {
    showcaseList.scrollLeft += cycleWidth;
  }
}

function shouldPauseAutoplay(): boolean {
  return (
    document.hidden ||
    reducedMotionPreference.matches ||
    pointerIsOver ||
    pointerIsDown ||
    focusIsInside ||
    !carouselIsVisible
  );
}

function animateShowcase(timestamp: number): void {
  animationFrame = 0;
  if (shouldPauseAutoplay()) {
    lastFrameTime = 0;
    return;
  }

  if (lastFrameTime > 0) {
    const elapsed = Math.min(timestamp - lastFrameTime, 50);
    showcaseList.scrollLeft += (autoplaySpeed * elapsed) / 1000;
    normalizeLoopPosition();
    updateShowcaseFocus();
  }

  lastFrameTime = timestamp;
  animationFrame = window.requestAnimationFrame(animateShowcase);
}

function updateAutoplay(): void {
  if (shouldPauseAutoplay()) {
    if (animationFrame > 0) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
    lastFrameTime = 0;
    return;
  }

  if (animationFrame === 0) {
    animationFrame = window.requestAnimationFrame(animateShowcase);
  }
}

showcaseList.addEventListener('scroll', updateShowcaseFocus, { passive: true });
showcaseList.addEventListener('pointerenter', () => {
  pointerIsOver = true;
  updateAutoplay();
});
showcaseList.addEventListener('pointerleave', () => {
  pointerIsOver = false;
  updateAutoplay();
});
showcaseList.addEventListener('pointerdown', (event) => {
  pointerIsDown = true;
  if (event.pointerType === 'mouse' && event.button === 0) {
    dragStartX = event.clientX;
    dragStartScrollLeft = showcaseList.scrollLeft;
    activePointerId = event.pointerId;
    showcaseList.setPointerCapture(event.pointerId);
  }
  updateAutoplay();
});
showcaseList.addEventListener('pointermove', (event) => {
  if (event.pointerId !== activePointerId) {
    return;
  }

  showcaseList.scrollLeft = dragStartScrollLeft - (event.clientX - dragStartX);
  normalizeLoopPosition();
});
showcaseList.addEventListener('pointerup', (event) => {
  pointerIsDown = false;
  if (event.pointerId === activePointerId) {
    activePointerId = null;
  }
  updateAutoplay();
});
showcaseList.addEventListener('pointercancel', (event) => {
  pointerIsDown = false;
  if (event.pointerId === activePointerId) {
    activePointerId = null;
  }
  updateAutoplay();
});
showcaseList.addEventListener('focusin', () => {
  focusIsInside = true;
  updateAutoplay();
});
showcaseList.addEventListener('focusout', (event) => {
  const nextTarget = event.relatedTarget;
  focusIsInside = nextTarget instanceof Node && showcaseList.contains(nextTarget);
  updateAutoplay();
});
window.addEventListener('resize', positionShowcase);
reducedMotionPreference.addEventListener('change', updateAutoplay);
document.addEventListener('visibilitychange', updateAutoplay);

const showcaseVisibility = new IntersectionObserver((entries) => {
  carouselIsVisible = entries.some((entry) => entry.isIntersecting);
  updateAutoplay();
});
showcaseVisibility.observe(showcaseList);
positionShowcase();
updateAutoplay();
