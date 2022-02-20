import './style.css';
import uniqid from 'uniqid';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    query,
    getDocs,
    where,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    updateDoc,
    doc,
    deleteDoc,
    serverTimestamp,
  } from 'firebase/firestore';
import { min } from 'lodash';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnuu5ryOCdldd0SmBEsZh9gUiZeV0xcp8",
    authDomain: "library-78811.firebaseapp.com",
    projectId: "library-78811",
    storageBucket: "library-78811.appspot.com",
    messagingSenderId: "505914469052",
    appId: "1:505914469052:web:f14c0007d8e501ba967eb9"
};

// Signs-in myLibrary.
async function signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
}

// Signs-out of myLibrary.
function signOutUser() {
    removeAllChildNodes(document.querySelector('.books'));
    // Sign out of Firebase.
    signOut(getAuth());
}

// Initialize firebase auth
function initFirebaseAuth() {
    // Listen to auth state changes.
    onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
    return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}
  
  // Returns the signed-in user's display name.
  function getUserName() {
    return getAuth().currentUser.displayName;
}

// return the signed-in user's UID.
function getUID() {
    return getAuth().currentUser.uid;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
    return !!getAuth().currentUser;
}

function authStateObserver(user) {
    if (user) {
      loadMessages();
      // User is signed in!
      // Get the signed-in user's profile pic and name.
      const profilePicUrl = getProfilePicUrl();
      const userName = getUserName();
  
      // Set the user's profile pic and name.
      userPicElement.style.backgroundImage =
        'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
      userNameElement.textContent = userName;
  
      // Show user's profile and sign-out button.
      userNameElement.removeAttribute('hidden');
      userPicElement.removeAttribute('hidden');
      signOutButtonElement.removeAttribute('hidden');
  
      // Hide sign-in button.
      signInButtonElement.setAttribute('hidden', 'true');
  
      // We save the Firebase Messaging Device token and enable notifications.
      // saveMessagingDeviceToken();
    } else {
      // User is signed out!
      // Hide user's profile and sign-out button.
      userNameElement.setAttribute('hidden', 'true');
      userPicElement.setAttribute('hidden', 'true');
      signOutButtonElement.setAttribute('hidden', 'true');
  
      // Show sign-in button.
      signInButtonElement.removeAttribute('hidden');
    }
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
      return url + '?sz=150';
    }
    return url;
}

// // Loads chat messages history and listens for upcoming ones.
// function loadMessages() {
//     const UID = getUID();
//     // Create the query to load the last 12 messages and listen for new ones.
//     const recentMessagesQuery = query(collection(getFirestore(), 'messages'), where("UID", "==", UID));
    
//     // Start listening to the query.
//     onSnapshot(recentMessagesQuery, function(snapshot) {
//       snapshot.docChanges().forEach(function(change) {
//         if (change.type === 'removed') {
//         //   deleteMessage(change.doc.id);
//         } else {
//           var message = change.doc.data();
//           add(message.id, message.title, message.author, message.pages, message.read);
//           console.log(myLibrary);
//           console.log(message.id);
//         }
//       });
//     });
// }

async function loadMessages() {
    myLibrary = [];
    const UID = getUID();
    const q = query(collection(getFirestore(), "messages"), where("UID", "==", UID));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    add(doc.id, doc.data().title, doc.data().author, doc.data().pages, doc.data().read);
    });    
}


async function deleteBook(event) {
    const { id } = event.target.parentElement.parentElement;
    console.log(id);
    try {
        await deleteDoc(doc(getFirestore(), 'messages', `${id}`));
      
    } catch {
        console.log('error');
    }
    deleteMessage(id);
}

// Delete a Message from the UI.
function deleteMessage(id) {
    const div = document.getElementById(id);
    // If an element for that message exists we delete it.
    if (div) {
      div.parentNode.removeChild(div);
    }
}

// Saves a new message to Cloud Firestore.
async function saveMessage(titleText, authorText, pagesNumber, readNumber) {
    // Add a new message entry to the Firebase database.
    try {
      const docRef = await addDoc(collection(getFirestore(), 'messages'), {
        userName: getUserName(),
        UID: getUID(),
        title: titleText,
        author: authorText,
        pages: pagesNumber,
        read: readNumber,
        timestamp: serverTimestamp()
      });
      console.log("Document written with ID:", docRef.id);
    }
    catch(error) {
      console.error('Error writing new message to Firebase Database', error);
    }
    loadMessages();
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    e.preventDefault();
    closeForm();
    // Check that the user entered a message and is signed in.
    if (titleInputElement.value && authorInputElement && pageInputElement && readInputElement && checkSignedInWithMessage()) {
      saveMessage(titleInputElement.value, authorInputElement.value, pageInputElement.value, readInputElement.value).then(function () {
        // Clear message text field and re-enable the SEND button.
        titleInputElement.value = '';
        authorInputElement.value = '';
        pageInputElement.value = '';
        readInputElement.value = '';
        // toggleButton();
      });
    }
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
    if (titleInputElement.value && authorInputElement.value && pageInputElement.value) {
      submitButtonElement.removeAttribute('disabled');
    } else {
      submitButtonElement.setAttribute('disabled', 'true');
    }
  } 

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
    // Return true if the user is signed in Firebase
    if (isUserSignedIn()) {
      return true;
    }
  
    // Display a message to the user using a Toast.
    var data = {
      message: 'You must sign-in first',
      timeout: 2000,
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return false;
  }

let myLibrary = [];

class Book {
    constructor(id, title, author, pages, read) {
        this.id = id
        this.title = title
        this.author = author
        this.pages = pages
        this.read = read
    }
}

function inputValidity(event) {
    const error = event.target.nextElementSibling;
    if (event.target.validity.valid) {
        error.innerText = ''
    } else {
        error.innerText = '*this is required'
    }
}

[...document.querySelectorAll('.textInput')].forEach(element => element.addEventListener('blur', inputValidity));

function add(id, title, author, pages, read) {
        const index = myLibrary.findIndex((element) => element.id === id)
        if (index === -1) {
            const newBook = new Book(id, title, author, pages, read);
            myLibrary = [newBook,...myLibrary]
            bookDisplay();            
        }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
   
function bookDisplay() {
    const bookContainer = document.querySelector('.books');
    removeAllChildNodes(bookContainer);
    for (let i = 0; i < myLibrary.length; i++) {
        let div = document.createElement('div');
            div.id = myLibrary[i].id;
            div.className = `bookCards`;
            bookContainer.appendChild(div);
        let titleText = document.createElement('P');
            titleText.id = 'bookTitle'
            titleText.innerHTML = `${myLibrary[i].title}`;
            div.appendChild(titleText);
        let authorText = document.createElement('P');
            authorText.id = 'bookAuthor';
            authorText.innerHTML = `${myLibrary[i].author}`;
            div.appendChild(authorText);
        const pagesTextWrapper = document.createElement('div');
            pagesTextWrapper.className = 'pages-text-wrapper';
            div.appendChild(pagesTextWrapper)
        let pagesRead = document.createElement('SPAN');
            pagesRead.id = 'pagesRead';
            pagesRead.innerText = myLibrary[i].read;
            pagesTextWrapper.appendChild(pagesRead);
        let pagesText = document.createElement('SPAN');
            pagesText.id = 'bookPages';
            pagesText.innerHTML = ` of ${myLibrary[i].pages} pages`;
            pagesTextWrapper.appendChild(pagesText);
        let readRange = document.createElement('input');
            readRange.type='range';
            readRange.id = 'readRange';
            readRange.name = 'readRange';
            readRange.min = 0;
            readRange.max = myLibrary[i].pages;
            readRange.value = myLibrary[i].read;
            div.appendChild(readRange);
        let button = document.createElement('button');
            button.setAttribute('id', 'eraseBtn');
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/><path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/></svg>';
            div.prepend(button);    
    }
    [...document.querySelectorAll('#eraseBtn')].forEach((element) => element.addEventListener('click', deleteBook));
    [...document.querySelectorAll('#readRange')].forEach((element) => element.addEventListener('input', updatePages));
    [...document.querySelectorAll('#readRange')].forEach((element) => element.addEventListener('mouseup', finalPageUpdate));
}

function updatePages(event) {
    const output = event.target.previousElementSibling.firstChild;
    const slideValue = event.target.value;
    output.innerText = slideValue;
}

async function finalPageUpdate(event) {
    const { id } = event.target.parentElement;
    const value = event.target.value;
    try {
        await updateDoc(doc(getFirestore(), 'messages', `${id}`), {
            read: value
        });
    } catch {
        console.log('error with pages read update');
    }
}

function eraseBook(event) {
    const { id } = event.target.parentElement.parentElement;
    const index = myLibrary.findIndex((element) => element.id === id);
    myLibrary.splice(index, 1);
    bookDisplay();
}

function openForm() {
    document.getElementById('formPopUpContainer').style.display = 'flex';
}

document.getElementById('openFormBtn').addEventListener('click', openForm);

function closeForm() {
    document.getElementById('formPopUpContainer').style.display = 'none';
}

document.getElementById('btnClose').addEventListener('click', closeForm);

// function fillerBooks() {
//     const fillerBook1 = new Book('To Kill a Mocking Bird', 'Harper Lee', '336', 'Read');
//     myLibrary.push(fillerBook1);
//     const fillerBook2 = new Book('Pride and Prejudice', 'Jane Austen', '279', 'Reading');
//     myLibrary.push(fillerBook2);
//     const fillerBook3 = new Book('The Giving Tree', 'Shel Silverstien', '64', 'Read');
//     myLibrary.push(fillerBook3);
//     const fillerBook4 = new Book('Fahreheit 451', 'Ray Bradbury', '194', 'Read');
//     myLibrary.push(fillerBook4);
//     const fillerBook5 = new Book('Lord of the Flies', 'William Golding', '182', 'Read');
//     myLibrary.push(fillerBook5);
//     const fillerBook6 = new Book('The Stranger', 'Albert Camus', '123', 'Read');
//     myLibrary.push(fillerBook6);
//     const fillerBook7 = new Book('Goodnight Moon', 'Margaret Wise Brown', '32', 'Read');
//     myLibrary.push(fillerBook7);
//     const fillerBook8 = new Book('A Streetcar Named Desire', 'Tenesse Williams', '107', 'Read');
//     myLibrary.push(fillerBook8);
//     bookDisplay();
// }

// DOM shortCuts

const userPicElement = document.getElementById('user-pic');
const userNameElement = document.getElementById('user-name');
const signOutButtonElement = document.getElementById('sign-out');
const signInButtonElement = document.getElementById('sign-in');
const messageFormSubmit = document.getElementById('message-form');
const submitButtonElement = document.getElementById('submit');
const titleInputElement = document.getElementById('bookTitle');
const authorInputElement = document.getElementById('bookAuthor');
const pageInputElement = document.getElementById('bookPages');
const readInputElement = document.getElementById('bookRead');

// Toggle for the button.
titleInputElement.addEventListener('keyup', toggleButton);
titleInputElement.addEventListener('change', toggleButton);
authorInputElement.addEventListener('keyup', toggleButton);
authorInputElement.addEventListener('change', toggleButton);
pageInputElement.addEventListener('keyup', toggleButton);
pageInputElement.addEventListener('change', toggleButton);
readInputElement.addEventListener('keyup', toggleButton);
readInputElement.addEventListener('change', toggleButton);


// Event Listeners

signInButtonElement.addEventListener('click', signIn);
signOutButtonElement.addEventListener('click', signOutUser);
messageFormSubmit.addEventListener('submit', onMessageFormSubmit);

const app = initializeApp(firebaseConfig);

initFirebaseAuth();