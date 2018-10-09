const url = 'https://randomuser.me/api/?results=6';
const ul = document.getElementById('users');
const btnGenerate = document.querySelector('.more-users');

let createNode = el => document.createElement(el);
let append = (parent, el) => parent.appendChild(el);

;(generateUsers = () => {
  ul.innerHTML = '';
  ul.classList.add('loading');
  
  fetch(url)
    .then(res => res.json())
    .then(res => new Promise(resolve => setTimeout(() => resolve(res), 800)))
    .then(data => {
      let users = data.results;

      users.map(user => {
        let li = createNode('li'),
            img = createNode('img'),
            span = createNode('span');
        
        img.src = user.picture.large;
        span.innerHTML = `${user.name.first} ${user.name.last}`;
        
        append(li, img)
        append(li, span);
        append(ul, li);
      })

      setTimeout(() => {
        ul.classList.remove('loading');
      }, 100)
  });
})();

btnGenerate.addEventListener('click', () => window.generateUsers());