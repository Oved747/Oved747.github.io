'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// scroll down to the section--1
const sectOne = document.querySelector('#section--1');
// console.log(sectOne);
const btnScroll = document.querySelector('.btn--scroll-to');
btnScroll.addEventListener('click', function (e) {
  // console.log(sectOne);
  // const sect1coord = sectOne.getBoundingClientRect();
  // window.scrollTo({
  //   left: sect1coord.left,
  //   top: sect1coord.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  sectOne.scrollIntoView({ behavior: 'smooth' });
});

// change the scroll behavior of all 3 sections to smooth,
// using 'event bubbling', i.e. making the event listner on the parent element

document.querySelector('.nav__links').addEventListener('click', function (e) {
  const id = e.target.getAttribute('href');
  e.preventDefault(); // ignore the default behavior defined in the html.
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

// make the operations buttons go up when clicked (and others down)
// and make the proper text visible
const opsBar = document.querySelector('.operations__tab-container');
const opsTabs = document.querySelectorAll('.operations__tab');
const opsContent = document.querySelectorAll('.operations__content');

opsBar.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return; // prevent action when clicked on the bar
  opsTabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  opsContent.forEach(t => t.classList.remove('operations__content--active'));

  const visContent = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  visContent.classList.add('operations__content--active');
});

// make other options and the logo fade when hover over an option in the nav area.
// First, define a function of action, then use it for entering and exit
const nav = document.querySelector('.nav');
const logo = nav.querySelector('img');

function navHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    siblings.forEach(s => {
      if (s != link) {
        s.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}
// the bind() method returns a function, and the parameter goes to 'this'
nav.addEventListener('mouseover', navHover.bind(0.25));
nav.addEventListener('mouseout', navHover.bind(1));

// 'Sticy' navigation - bring the nav bar to the top of the viewport
// the function to handle the area entry
const obsCall = function (entries, observer) {
  // console.log('area entered...');
  if (!entries[0].isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
// the options for the IntersecionObserver object
const navHeight = nav.getBoundingClientRect().height;
const obsOptions = {
  root: null, // i.e. the whole viewport
  threshold: 0, // 0% of the vewport (i.e. exit)
  rootMagin: `-${navHeight}px`, // will appear above the target
};
// defining the observer itself
const myObserver = new IntersectionObserver(obsCall, obsOptions);
const header = document.querySelector('.header');
myObserver.observe(header);

// ---------- laod the full imgage when in view ----------------
const lazyImages = document.querySelectorAll('img[data-src]');

function lazyCall(entries, observer) {
  const myTarget = entries[0].target;
  if (!entries[0].isIntersecting) return;
  myTarget.src = myTarget.dataset.src;
  // remove blur of the full image only when the loading is complete
  myTarget.addEventListener('load', function () {
    myTarget.classList.remove('lazy-img');
  });
  // after loading, 'observe' no longer needed
  observer.unobserve(myTarget);
}

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px', // load full image before entry to viewport
};

const imgObserver = new IntersectionObserver(lazyCall, imgOptions);
lazyImages.forEach(img => imgObserver.observe(img));

// -------- handle the 3 slides at the bottom ----------------
const dotsContainer = document.querySelector('.dots');
const slides = document.querySelectorAll('.slide');
// separate the 3 slides horizontically
function goToSlide(slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
  emphDot(slide);
}
goToSlide(0);

// handle the left/right buttons
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const nSlides = slides.length;

function nextRight() {
  curSlide++;
  if (curSlide > nSlides - 1) curSlide = 0;
  goToSlide(curSlide);
}
function nextLeft() {
  curSlide--;
  if (curSlide < 0) curSlide = nSlides - 1;
  goToSlide(curSlide);
}

btnRight.addEventListener('click', nextRight);
btnLeft.addEventListener('click', nextLeft);

// now provide movong left/right by the l/r-arrow keys
document.addEventListener('keydown', function (e) {
  // console.log(e);
  if (e.key === 'ArrowLeft') nextLeft();
  if (e.key === 'ArrowRight') nextRight();
});

// -------- handle the dots in the slider -------------
// console.log(dotsContainer);

function makeDots() {
  slides.forEach((_, i) =>
    dotsContainer.insertAdjacentHTML(
      'beforeEnd',
      `<button class="dots__dot" data-slide = '${i}'></button>`
    )
  );
  emphDot(0);
}

function emphDot(dotNum) {
  console.log('dotNum =', dotNum);
  dotsContainer.querySelectorAll('.dots__dot').forEach(function (d) {
    d.classList.remove('dots__dot--active');
    if (Number(d.dataset.slide) === dotNum)
      d.classList.add('dots__dot--active');
  });
}

makeDots();

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const mySlide = e.target.dataset.slide;
    goToSlide(mySlide);
  }
});

// -------- add a listner to leaving the page ------------
window.addEventListener('beforeunload', function (e) {
  e.defaultPrevented();
  console.log(e);
  e.returnValue = '';
});

// ----------------- tetrsting --------------------------
// console.log(document.documentElement);
// console.log(document.querySelectorAll('.section'));
// console.log(document.getElementsByTagName('button'));
// const message = document.createElement('dev');
// message.classList.add('cookie-message');
// message.textContent = 'Cookeis anyone?';
// // console.log(message);
// const header = document.querySelector('.header');
// message.style.backgroundColor = 'blue';
// console.log(message.style.backgroundColor);
// header.prepend(message);
// console.log('testing...', getComputedStyle(message).color);
// // header.append(message);
// document.documentElement.style.setProperty('--color-primary', 'purple');
//
// window.scrollTo(0, 1000);

// const h1 = document.querySelector('h1'); // the header of top of page
// h1.addEventListener('mouseenter', function () {
//   alert('Hey - you entered h1...');
// });

// ------ change background color of an element (and it's parents) --------
// const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randColor = () =>
//   `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)}`;

// document.querySelector('.nav__link').addEventListener('click', function () {
//   this.style.backgroundColor = randColor();
// });

// document.querySelector('.nav__links').addEventListener('click', function () {
//   this.style.backgroundColor = randColor();
// });

// document.querySelector('.nav').addEventListener('click', function () {
//   this.style.backgroundColor = randColor();
// });
// const h1 = document.querySelector('h1');
// console.log(h1.children);
// for (const el of h1.children) console.log(el.nodeType);

// const myArr = [1, 2, 3, 4];
// myArr.forEach(i => console.log(i * i));
