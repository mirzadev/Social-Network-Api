const $backBtn = document.querySelector('#back-btn');
const $username = document.querySelector('#user-name');
const $fullname = document.querySelector('#full-name');
const $createdAt = document.querySelector('#created-at');
const $email = document.querySelector('#email-id');
const $address = document.querySelector('#address');
const $telephone = document.querySelector('#tel-contact');
const $thoughtSection = document.querySelector('#thought-section');
const $newthoughtForm = document.querySelector('#new-thought-form');
const $reaction = document.querySelector('#thought-reaction');

let userId;

function getUser() {
  // get id of user
  const searchParams = new URLSearchParams(document.location.search.substring(1));
  const userId = searchParams.get('id');

  // get userInfo
  fetch(`/api/users/${userId}`)
    .then(response => {
      console.log(response);
      if (!response.ok) {
        console.log('hi');
        throw new Error({ message: 'Something went wrong!' });
      }

      return response.json();
    })
    .then(printUser)
    .catch(err => {
      console.log(err);
      alert('Cannot find a user with this id! Taking you back.');
      window.history.back();
    });
}

function printUser(userData) {
  console.log(userData);

  userId = userData._id;

  const { username, fullname, createdAt, email, address, thoughts, telephone, friends } = userData;

  $username.textContent = username;
  $fullname.textContent = fullname;
  $createdAt.textContent = createdAt;
  $email.textContent = email;
  $address.textContent = address;
  $telephone.textContent = telephone;
  $thoughtSection.textContent = thoughts;
  friends.textContent = friends;

  if (thoughts && thoughts.length) {
    thoughts.forEach(printthought);
  } else {
    $thoughtSection.innerHTML = '<h4 class="bg-dark p-3 rounded">No thoughts yet!</h4>';
  }
}

function printthought(thought) {
  // make div to hold comment and subcomments
  const thoughtDiv = document.createElement('div');
  thoughtDiv.classList.add('my-2', 'card', 'p-2', 'w-100', 'text-dark', 'rounded');

  const thoughtContent = `
      <h5 class="text-dark">${thought.writtenBy} commented on ${thought.createdAt}:</h5>
      <p>${thought.thoughtBody}</p>
      <div class="bg-dark ml-3 p-2 rounded" >
        ${thought.reactions && thought.reactions.length
      ? `<h5>${thought.reactions.length} ${thought.reactions.length === 1 ? 'Reaction' : 'Reactions'
      }</h5>
        ${thought.reactions.map(printReaction).join('')}`
      : '<h5 class="p-1">No replies yet!</h5>'
    }
      </div>
      <form class="reply-form mt-3" data-thoughtid='${thought._id}'>
        <div class="mb-3">
          <label for="reply-name">Leave Your Name</label>
          <input class="form-input" name="reply-name" required />
        </div>
        <div class="mb-3">
          <label for="reaction">Leave a Reaction</label>
          <textarea class="form-textarea form-input"  name="reaction" required></textarea>
        </div>

        <button class="mt-2 btn display-block w-100">Add Reaction</button>
      </form>
  `;

  thoughtDiv.innerHTML = thoughtContent;
  $thoughtSection.prepend(thoughtDiv);
}

function printReaction(reaction) {
  return `
  <div class="card p-2 rounded bg-secondary">
    <p>${reaction.writtenBy} reaction on ${reaction.createdAt}:</p>
    <p>${reaction.reactionBody}</p>
  </div>
`;
}

function handleNewThoughtSubmit(event) {
  event.preventDefault();

  const thoughtBody = $newthoughtForm.querySelector('#thought').value;
  const writtenBy = $newthoughtForm.querySelector('#written-by').value;

  if (!thoughtBody || !writtenBy) {
    return false;
  }

  const formData = { thoughtBody, writtenBy };

  fetch(`/api/thoughts/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      response.json();
    })
    .then(commentResponse => {
      console.log(commentResponse);
      // location.reload();
    })
    .catch(err => {
      console.log(err);
    });
}

function handleNewReactionSubmit(event) {
  event.preventDefault();

  if (!event.target.matches('#thought-reaction')) {
    return false;
  }

  const thoughtId = event.target.getAttribute('data-thoughtid');

  const writtenBy = event.target.querySelector('[name=reaction-name]').value;
  const reactionBody = event.target.querySelector('[name=reaction]').value;

  if (!reactionBody || !writtenBy) {
    return false;
  }

  const formData = { writtenBy, reactionBody };

  fetch(`/api/thoughts/${userId}/${thoughtId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      response.json();
    })
    .then(commentResponse => {
      console.log(commentResponse);
      location.reload();
    })
    .catch(err => {
      console.log(err);
    });
}

$backBtn.addEventListener('click', function () {
  window.history.back();
});

$newthoughtForm.addEventListener('submit', handleNewThoughtSubmit);
$thoughtSection.addEventListener('submit', handleNewReactionSubmit);

getUser();
