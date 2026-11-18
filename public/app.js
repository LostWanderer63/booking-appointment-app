const API_URL = location.protocol.startsWith('http') ? `${location.origin}/user` : 'http://localhost:3000/user';

const form = document.getElementById('booking-form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phonenumber');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');
const formError = document.getElementById('form-error');
const userList = document.getElementById('user-list');
const emptyState = document.getElementById('empty');
const countBadge = document.getElementById('count');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function updateCount() {
  const count = userList.children.length;
  countBadge.textContent = count;
  emptyState.style.display = count ? 'none' : 'block';
}

function showUserOnScreen(user) {
  const li = document.createElement('li');
  li.className = 'user-item';
  li.innerHTML = `
    <div class="avatar"></div>
    <div class="user-info">
      <div class="user-name"></div>
      <div class="user-meta"></div>
    </div>
    <div class="actions">
      <button class="btn-edit" type="button">Edit</button>
      <button class="btn-delete" type="button">Delete</button>
    </div>`;

  li.querySelector('.avatar').textContent = user.name.charAt(0).toUpperCase();
  li.querySelector('.user-name').textContent = user.name;
  li.querySelector('.user-meta').textContent = `${user.email} · ${user.phonenumber}`;

  li.querySelector('.btn-delete').addEventListener('click', () => deleteUser(user.id, li));
  li.querySelector('.btn-edit').addEventListener('click', () => editUser(user, li));

  userList.prepend(li);
  updateCount();
}

async function getUsers() {
  try {
    const res = await fetch(`${API_URL}/get-users`);
    const data = await res.json();
    userList.innerHTML = '';
    data.allUsers.slice().reverse().forEach(showUserOnScreen);
    updateCount();
  } catch (err) {
    showToast('Could not load appointments. Is the server running?');
  }
}

async function deleteUser(id, li) {
  try {
    const res = await fetch(`${API_URL}/delete-user/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error((await res.json()).error);
    li.remove();
    updateCount();
    showToast('Appointment deleted');
    return true;
  } catch (err) {
    showToast(err.message || 'Could not delete appointment');
    return false;
  }
}

async function editUser(user, li) {
  if (await deleteUser(user.id, li)) {
    nameInput.value = user.name;
    phoneInput.value = user.phonenumber;
    emailInput.value = user.email;
    nameInput.focus();
    showToast('Edit the details and book again');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.textContent = '';

  if (!form.checkValidity()) {
    formError.textContent = 'Please enter a valid name, phone number and email.';
    return;
  }

  const userDetails = {
    name: nameInput.value.trim(),
    phonenumber: phoneInput.value.trim(),
    email: emailInput.value.trim(),
  };

  submitBtn.disabled = true;
  try {
    const res = await fetch(`${API_URL}/add-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showUserOnScreen(data.newUserDetail);
    form.reset();
    showToast('Appointment booked');
  } catch (err) {
    formError.textContent = err.message || 'Something went wrong. Please try again.';
  } finally {
    submitBtn.disabled = false;
  }
});

document.addEventListener('DOMContentLoaded', getUsers);
