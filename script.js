const registerBtn = document.getElementById('register-btn');
const registrationForm = document.getElementById('registration-form');
const closeBtn = document.getElementById('close-btn');
const avatarInput = document.getElementById('avatar');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const classInput = document.getElementById('class');
const userInfoDiv = document.getElementById('user-info');
const avatarDisplay = document.getElementById('avatar-display');
const userNameSpan = document.getElementById('user-name');
const userClassDiv = document.getElementById('user-class');
const dropdownMenu = document.getElementById('dropdown-menu');

registerBtn.addEventListener('click', () => {
  registrationForm.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  registrationForm.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === registrationForm) {
    registrationForm.style.display = 'none';
  }
});

registrationForm.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault(); 
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const className = classInput.value;
  const avatarFile = avatarInput.files[0];

    if (avatarFile) {
    const avatarURL = URL.createObjectURL(avatarFile);
    avatarDisplay.style.backgroundImage = `url(${avatarURL})`;
    avatarDisplay.style.backgroundSize = 'cover';
    avatarDisplay.style.backgroundPosition = 'center';
  }

    userNameSpan.textContent = `${firstName} ${lastName}`;
  
    userClassDiv.textContent = className;

  registerBtn.style.display = 'none';
  loginBtn.style.display = 'none';
  userInfoDiv.style.display = 'flex';

    registrationForm.style.display = 'none';
});

userInfoDiv.addEventListener('click', (event) => {
    if (!dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  }
});

window.addEventListener('click', (event) => {
  if (!userInfoDiv.contains(event.target) && dropdownMenu.style.display === 'block') {
    dropdownMenu.style.display = 'none';
  }
});

const logoutButton = document.getElementById('logout-btn'); if (logoutButton) {
  logoutButton.addEventListener('click', function(event) {
    dropdownMenu.style.display = 'none'; userInfoDiv.style.display = 'none'; registerBtn.style.display = 'inline-block'; loginBtn.style.display = 'inline-block';  });
}
const loginBtn = document.getElementById('login-btn');
const loginForm = document.getElementById('login-form');
const closeLoginBtn = document.getElementById('close-login-btn');

loginBtn.addEventListener('click', () => {
  loginForm.style.display = 'flex';
});

closeLoginBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === loginForm) {
    loginForm.style.display = 'none';
  }
});

document.getElementById('login-form-content').addEventListener('submit', function (event) {
  event.preventDefault();

  const loginFirstName = document.getElementById('login-first-name').value.trim();
  const loginLastName = document.getElementById('login-last-name').value.trim();
  const loginPassword = document.getElementById('login-password').value.trim();

    if (!loginFirstName || !loginLastName || !loginPassword) {
    alert('Пожалуйста, заполните все поля.');
    return;
  }

  if (loginPassword.length < 6) {
    alert('Пароль слишком короткий.');
    return;
  }

    alert(`Добро пожаловать, ${loginFirstName} ${loginLastName}!`);

    loginForm.style.display = 'none';
});


  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('UserDatabase', 1);

            request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

async function saveUser(userData) {
  const db = await openDatabase();
  const transaction = db.transaction('users', 'readwrite');
  const store = transaction.objectStore('users');
  store.add(userData);

  transaction.oncomplete = () => {
    alert('Регистрация успешно сохранена!');
  };
  transaction.onerror = () => {
    alert('Ошибка при сохранении данных!');
  };
}

async function loginUser(firstName, lastName, password) {
  const db = await openDatabase();
  const transaction = db.transaction('users', 'readonly');
  const store = transaction.objectStore('users');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const users = request.result;
      const user = users.find(
        (u) =>
          u.firstName === firstName &&
          u.lastName === lastName &&
          u.password === password
      );

      if (user) {
        resolve(user);
      } else {
        reject('Пользователь не найден или пароль неверный!');
      }
    };

    request.onerror = () => reject('Ошибка при чтении базы данных!');
  });
}

registrationForm.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const className = classInput.value;
  const avatarFile = avatarInput.files[0];
  const password = document.getElementById('password').value.trim();

  if (password.length < 6) {
    alert('Пароль должен содержать не менее 6 символов.');
    return;
  }

  if (!firstName || !lastName || !className) {
    alert('Заполните все обязательные поля.');
    return;
  }

  const userData = {
    firstName,
    lastName,
    className,
    password,
    avatar: avatarFile ? URL.createObjectURL(avatarFile) : null,
  };

  saveUser(userData);

    registrationForm.style.display = 'none';
  registrationForm.querySelector('form').reset();
});

document.getElementById('login-form-content').addEventListener('submit', function (event) {
  event.preventDefault();

  const firstName = document.getElementById('login-first-name').value.trim();
  const lastName = document.getElementById('login-last-name').value.trim();
  const password = document.getElementById('login-password').value.trim();

  loginUser(firstName, lastName, password)
    .then((user) => {
      alert(`Добро пожаловать, ${user.firstName} ${user.lastName}!`);
      loginForm.style.display = 'none';

            avatarDisplay.style.backgroundImage = user.avatar
        ? `url(${user.avatar})`
        : 'none';
      userNameSpan.textContent = `${user.firstName} ${user.lastName}`;
      userClassDiv.textContent = user.className;

      registerBtn.style.display = 'none';
      userInfoDiv.style.display = 'flex';
      loginBtn.style.display = 'none';
    })
    .catch((error) => alert(error));
});




const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;
const slideWidth = slides[0].offsetWidth; 
function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = slides.length - 4;   }
  updateSlider();
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < slides.length - 4) {
    currentIndex++;
  } else {
    currentIndex = 0;   }
  updateSlider();
});

window.addEventListener('resize', () => {
  slider.style.transition = 'none';   slider.style.transform = 'translateX(0)';
  setTimeout(() => {
    slider.style.transition = 'transform 0.5s ease-in-out';
    currentIndex = 0;
  });
});

