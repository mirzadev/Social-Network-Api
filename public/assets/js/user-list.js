const $userList = document.querySelector('#user-list');

const getUserList = () => {
  fetch('/api/users')
    .then(res => res.json())
    .then(userListArr => {
      console.log(userListArr);
      userListArr.forEach(printUser);
    })
    .catch(err => {
      console.log(err);
    });
};

const printUser = ({ _id, username, fullname, address, email, telephone }) => {
  const userCard = `
    <div class="col-12 col-lg-6 flex-row">
      <div class="card w-100 flex-column">
        <h3 class="card-header has-text-centered">${fullname}</h3>       
          <h4 class="text-dark">Username: ${username}</h4>
          <h4 class="text-dark">Address: ${address}</h4>
          <h4 class="text-dark">Email: ${email}</h4>
          <h4 class="text-dark">Telephone: ${telephone}</h4> 
        <div class="card-body flex-column col-auto">  
           <a class="btn display-block w-100 mt-auto" href="/user?id=${_id}">See the discussion.</a>
        </div>
      </div>
    </div>
  `;

  $userList.innerHTML += userCard;
};

getUserList();
