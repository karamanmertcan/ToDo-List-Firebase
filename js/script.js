//CONSTS
const logEmail = document.getElementById('logEmail_form')
const logPass = document.getElementById('logPassword_form')
const loginButton = document.getElementById('login_button')
const loginContainer = document.querySelector('.login_container')
const todoInput = document.getElementById('todo-input--form')
const todoHeader = document.querySelector('.todo__header')
const tasks = document.querySelector('.container')
const addTask = document.getElementById('addTask__button')
const logout = document.querySelector('.logout__button')

// LOGIN
loginButton.addEventListener('click', function (e) {
  const logEmailValue = logEmail.value
  const logPassValue = logPass.value

  if (logEmailValue !== '' && logPassValue !== '') {
    logout.style.display = 'inline-block'
    firebase
      .auth()
      .signInWithEmailAndPassword(logEmailValue, logPassValue)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user
        console.log(user)
      })
      .catch((error) => {
        var errorCode = error.code
        var errorMessage = error.message
      })
  } else {
    alert('Input areas are empty!!!!')
  }
})

// CHECKING USER LOGGED IN OR OUT THEN DOING THE PROCESS IN HERE
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    loginContainer.style.display = 'none'
    todoInput.style.display = 'block'
    todoHeader.style.display = 'block'
    tasks.style.display = 'contents'
    addTask.style.display = 'block'

    logout.style.display = 'block'

    console.log(user.email)

    // GetData

    setTimeout(async () => {
      await db
        .collection('Users')
        .doc(user.uid)
        .collection('data')
        .orderBy('note')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const html = `
            <div class="task" id="${doc.id}">
              <h2>${doc.data().note}</h2>
              <i class="btn-icon trash"><ion-icon name="trash-outline"></ion-icon></i>
            </div>
          `
            tasks.insertAdjacentHTML('beforeend', html)
            // const
          })
        })
        .catch((error) => {
          console.log('Error getting documents: ', error)
        })
    }, 200)

    // Add Data
    addTask.addEventListener('click', () => {
      const todoInputValue = todoInput.value
      if (todoInputValue !== '') {
        console.log(todoInputValue)
        const addData = async () => {
          await db.collection('Users').doc(user.uid).collection('data').add({
            note: todoInputValue,
          })
          tasks.innerHTML = ''
          setTimeout(async () => {
            await db
              .collection('Users')
              .doc(user.uid)
              .collection('data')
              .orderBy('note')
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  const html = `
                <div class="task" id="${doc.id}">
                  <h2>${doc.data().note}</h2>
                  <i class="btn-icon trash"><ion-icon name="trash-outline"></ion-icon></i>
                </div>
              `
                  tasks.insertAdjacentHTML('beforeend', html)
                })
              })
              .catch((error) => {
                console.log('Error getting documents: ', error)
              })
          }, 200)
        }
        addData()
        todoInput.value = ' '
      } else {
        alert('Input Area is Empty')
      }
    })
    tasks.addEventListener('click', (e) => {
      const target = e.target
      if (target.matches('ion-icon')) {
        let id = target.parentElement.parentElement.id
        const deleteNote = async () => {
          await db
            .collection('Users')
            .doc(user.uid)
            .collection('data')
            .doc(id)
            .delete()

          tasks.innerHTML = ''
        }
        setTimeout(async () => {
          await db
            .collection('Users')
            .doc(user.uid)
            .collection('data')
            .orderBy('note')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const html = `
                    <div class="task" id="${doc.id}">
                      <h2>${doc.data().note}</h2>
                      <i class="btn-icon trash"><ion-icon name="trash-outline"></ion-icon></i>
                    </div>
                  `
                tasks.insertAdjacentHTML('beforeend', html)
              })
            })
            .catch((error) => {
              console.log('Error getting documents: ', error)
            })
        }, 200)
        deleteNote()
      }
    })
  } else {
    loginContainer.style.display = 'block'
    todoInput.style.display = 'none'
    todoHeader.style.display = 'none'
    tasks.style.display = 'none'

    console.log('user logged out')
  }
})

// LOGOUT

const logoutFunction = () => {
  loginContainer.style.display = 'block'
  todoInput.style.display = 'none'
  todoHeader.style.display = 'none'
  logout.style.display = 'none'
  tasks.style.display = 'none'
  addTask.style.display = 'none'
  firebase
    .auth()
    .signOut()
    .then(() => {})
    .catch((error) => {
      console.log(error)
    })
}

logout.addEventListener('click', logoutFunction)
