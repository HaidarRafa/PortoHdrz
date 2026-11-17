import cssLogo from '../images/skills/css.png';
import dbeaverLogo from '../images/skills/dbeaver.png';
import dockerLogo from '../images/skills/docker.png';
import htmlLogo from '../images/skills/html.png';
import mongodbLogo from '../images/skills/mongodb.png';
import pythonLogo from '../images/skills/python.png';
import sqlLogo from '../images/skills/sql.png';
import typescriptLogo from '../images/skills/typescript.png';
import viteLogo from '../images/skills/vite.png';

type SkillLogo = string | null;

interface Skill {
  name: string;
  logo: SkillLogo;
}

const skills: Skill[] = [
  { name: 'Python', logo: pythonLogo },
  { name: 'SQL', logo: sqlLogo },
  { name: 'Docker', logo: dockerLogo },
  { name: 'MongoDB', logo: mongodbLogo },
  { name: 'DBeaver', logo: dbeaverLogo },
  { name: 'HTML', logo: htmlLogo },
  { name: 'CSS', logo: cssLogo },
  { name: 'TypeScript', logo: typescriptLogo },
  { name: 'Vite', logo: viteLogo },
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

function renderList<T>(
  list: HTMLUListElement | HTMLOListElement,
  items: readonly T[],
  createItem: (item: T) => HTMLLIElement,
): void {
  list.replaceChildren(...items.map(createItem));
}

function createSkillItem(skill: Skill): HTMLLIElement {
  const listItem = document.createElement('li');
  listItem.className = 'skill-logo-item';

  if (skill.logo) {
    const image = document.createElement('img');
    image.src = skill.logo;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.decoding = 'async';
    image.loading = 'lazy';
    listItem.append(image);
  }

  const label = document.createElement('span');
  label.textContent = skill.name;
  listItem.append(label);

  return listItem;
}

function createCourseItem(course: string): HTMLLIElement {
  const listItem = document.createElement('li');
  listItem.textContent = course;
  return listItem;
}

const yearElement = document.querySelector<HTMLElement>('#current-year');
const skillListElement = document.querySelector<HTMLUListElement>('#skill-list');
const courseListElement = document.querySelector<HTMLOListElement>('#course-list');

if (
  !yearElement ||
  !skillListElement ||
  !courseListElement
) {
  throw new Error('Elemen portfolio yang dibutuhkan tidak ditemukan di index.html.');
}

yearElement.textContent = String(currentYear);

renderList(skillListElement, skills, createSkillItem);
renderList(courseListElement, courses, createCourseItem);
