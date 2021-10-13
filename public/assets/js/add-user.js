const $userForm = document.querySelector('#user-form');
const submit = document.querySelector('#user-submit')


const handleUserSubmit = event => {
  event.preventDefault();

  const username = $userForm.querySelector('#user-name').value;
  const fullname = $userForm.querySelector('#full-name').value;
  const address = $userForm.querySelector('#address-space').value;
  const email = $userForm.querySelector('#email-id').value;
  const telephone = $userForm.querySelector('#tel-contact').value;

  if (!username || !fullname || !address || !email || !telephone) {
    return;
  }

  const formData = { username, fullname, address, email, telephone };

  fetch('/api/users', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(postResponse => {
      alert('User account created successfully!');
      console.log(postResponse);
    })
    .catch(err => {
      console.log(err);
    });
};

$userForm.addEventListener('submit', handleUserSubmit);

