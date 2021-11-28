const nameList = [
  'asheworth',
  'bailey',
  'bridge',
  'bright',
  'cimmerian',
  'clef',
  'crow',
  'edison',
  'elliot',
  'everwood',
  'fynegan',
  'gears',
  'glass',
  'heiden',
  'hoygull',
];
const siteList = [
  '01',
  '06-03',
  '11',
  '15',
  '17',
  '19',
  '23',
  '28',
  '36',
  '38',
  '41',
  '43',
  '45',
  '54',
  '55',
  '56',
  '62',
  '62C',
  '64',
  '65',
  '66',
  '73',
  '76',
  '77',
  '81',
  '87',
  '88',
  '91',
  '95',
  '98',
  '103',
  '104',
  '117',
];
const siteStringNumber = siteList[Math.floor(Math.random() * siteList.length)];
const name = nameList[Math.floor(Math.random() * nameList.length)];

const termwindow_ = document.querySelector('#window')!;

/**
 * Timeout but better
 * @param ms time in milliseconds
 */
const sleep = (ms: any) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Makes a styled prompt box
 * @param message the string to go inside the span
 * @returns a span with the class 'prompt-box' with a string inside
 */
const promptBox = (message: string) => {
  return '<span class="prompt-box">' + message + '</span>';
};

/**
 * Makes a styled path box
 * @param message the string to go inside the span
 * @returns a span with the class 'path-box' with a string inside
 */
const pathBox = (message: string) => {
  return '<span class="path-box">' + message + '</span>';
};

/**
 * Makes a power box. Not styled but good for typing after
 * @param prompt the prompt box
 * @param path the path box
 * @returns a span with the class 'power-box'
 */
const powerBox = (prompt: string, path: string) => {
  return '<span class="power-box">' + prompt + path + '</span>';
};

/**
 * Makes a box for page data; Ideally for displaying scp data.
 * @param content The content to be in the page data box
 * @returns
 */
const pageData = (...content: any) => {
  return '<div class="page-data">' + content + '</div>';
};

const h3 = (string: string) => {
  return `<h3 class="title3"> ${string} </h3>`;
};
const h5 = (string: string) => {
  return `<h5 class="title5"> ${string} </h5>`;
};

const listItem = (string: string) => {
  return `<li class="scp-h-item"> ${string} </li>`;
};

/**
 * Makes a span element with a custom class. Good for styling
 * @param classname the name of the class
 * @param message the string to go inside span
 * @returns a span with the set class name
 */
const span = (classname: string, message: string) => {
  return '<span class="' + classname + '">' + message + '</span>';
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

/**
 * Enables smooth scrolling down the window
 */
const scrollPage = () => {
  termwindow_.scrollBy({
    top: termwindow_.scrollHeight,
    //top: document.querySelector(".page-data")?.scrollHeight,
    behavior: 'smooth',
  });
};

const scrollToLink = () => {
  const pages = document.getElementsByClassName('page-data');
  const page = pages[pages.length - 1];
  if (page == null) {
    scrollPage();
  } else {
    termwindow_.scrollTo({
      top: termwindow_.scrollHeight - page.scrollHeight - 75,
      behavior: 'smooth',
    });
  }
};

export {
  promptBox,
  pathBox,
  powerBox,
  pageData,
  h3,
  h5,
  span,
  getRandomInt,
  scrollPage,
  listItem,
  sleep,
  scrollToLink,
  siteStringNumber,
  name,
};
