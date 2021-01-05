const APIURL = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

async function getUser(username) {
  try {
    // Can also be await axios.get()
    const { data } = await axios(APIURL + username); // returns a promise
    // with Axios no need for res.json
    createUserCard(data);
    getRepos(username);
  } catch (error) {
    if (error.response.status == 404) {
      createErrorCard('No profile with this username');
    }
  }

  // version without async await
  // .then((res) => console.log(res.data))
  // .catch((err) => console.log(err));
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + '/repos?sort=created');

    addReposToCard(data);
  } catch (error) {
    createErrorCard('Problem fetching repos');
  }
}

function createUserCard(user) {
  const cardHTML = `
  <div class="card">
    <div>
      <img
        src=${user.avatar_url}
        alt=${user.name}
        class="avatar"
      />
    </div>
    <div class="user-info">
      <h2>${user.name}</h2>
      <p>
        ${user.bio}
      </p>
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>
      <div id="repos">
        
      </div>
    </div>
  </div>`;

  main.innerHTML = cardHTML;
}

function createErrorCard(message) {
  const cardHTML = `
    <div class="card">
      <h1>${message}</h1>
    </div>
  `;
  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos');

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;
  if (user) {
    getUser(user);

    search.value = '';
  }
});
