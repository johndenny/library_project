import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnuu5ryOCdldd0SmBEsZh9gUiZeV0xcp8",
    authDomain: "library-78811.firebaseapp.com",
    projectId: "library-78811",
    storageBucket: "library-78811.appspot.com",
    messagingSenderId: "505914469052",
    appId: "1:505914469052:web:f14c0007d8e501ba967eb9"
};

const app = initializeApp(firebaseConfig);

myLibrary = [];

class Book {
    constructor(title, author, pages, read) {
        this.title = title
        this.author = author
        this.pages = pages
        this.read = read
    }
    
    readSwitch () {
        this.read === 'Read' ? this.read = 'Reading' : this.read = 'Read';
        bookDisplay();
    }  
}


function inputValidity(event) {
    const error = event.target.nextElementSibling;
    if (event.target.validity.valid) {
        error.innerText = ''
    } else {
        error.innerText = 'Too Short'
    }
}

[...document.querySelectorAll('.textInput')].forEach(element => element.addEventListener('blur', inputValidity));

function add() {
    if ([...document.querySelectorAll('.textInput')].every(element => element.validity.valid)) {
        title = document.getElementById('bookTitle').value;
        author = document.getElementById('bookAuthor').value;
        pages = document.getElementById('bookPages').value;
        checkbox = document.getElementById('bookRead');
        checkbox.checked === true ? read = checkbox.value : read = 'Reading';
        newBook = new Book(title, author, pages, read);
        myLibrary.push(newBook);
        document.getElementById('myForm').reset();
        bookDisplay();
        closeForm();
    } else {
        return false;
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
    for (i=0; i<myLibrary.length; i++) {
        div = document.createElement('div');
        div.setAttribute('id', `bookCards`);
        bookContainer.appendChild(div);
        text = document.createElement('P');
        text.setAttribute('id', 'bookTitle')
        text.innerHTML = `${myLibrary[i].title}`;
        div.appendChild(text);
        text = document.createElement('P');
        text.setAttribute('id', 'bookAuthor')
        text.innerHTML = `${myLibrary[i].author}`;
        div.appendChild(text);
        text = document.createElement('P');
        text.setAttribute('id', 'bookPages')
        text.innerHTML = `${myLibrary[i].pages} pages`;
        div.appendChild(text);
        readCntr = document.createElement('div');
        readCntr.setAttribute('id', 'readCntr');
        div.appendChild(readCntr);
        readText = document.createElement('P');
        readText.setAttribute('id','readText');
        readText.innerHTML = `${myLibrary[i].read}`;
        readCntr.appendChild(readText);
        readCheck = document.createElement('LABEL');
        readCheck.setAttribute('class', 'switch');
        readCntr.appendChild(readCheck);
        input = document.createElement('INPUT');
        input.setAttribute('type', 'checkbox');
        readCheck.appendChild(input);
        span = document.createElement('SPAN');
        span.setAttribute('class', 'slider round')
        span.setAttribute('onclick', `myLibrary[${i}].readSwitch()`);
        readCheck.appendChild(span);
        myLibrary[i].read === 'Read' ? input.checked = true : input.checked = false;
        button = document.createElement('button');
        button.setAttribute('id', 'eraseBtn');
        button.setAttribute('onclick', `eraseBook(${i})`);
        button.innerText = '??';
        div.prepend(button);    
    }
}

function eraseBook(index) {
    myLibrary.splice(index,1);
    bookDisplay();
}

function openForm() {
    document.getElementById('formPopUpContainer').style.display = 'flex';
}

function closeForm() {
    document.getElementById('formPopUpContainer').style.display = 'none';
}

function fillerBooks() {
    const fillerBook1 = new Book('To Kill a Mocking Bird', 'Harper Lee', '336', 'Read');
    myLibrary.push(fillerBook1);
    const fillerBook2 = new Book('Pride and Prejudice', 'Jane Austen', '279', 'Reading');
    myLibrary.push(fillerBook2);
    const fillerBook3 = new Book('The Giving Tree', 'Shel Silverstien', '64', 'Read');
    myLibrary.push(fillerBook3);
    const fillerBook4 = new Book('Fahreheit 451', 'Ray Bradbury', '194', 'Read');
    myLibrary.push(fillerBook4);
    const fillerBook5 = new Book('Lord of the Flies', 'William Golding', '182', 'Read');
    myLibrary.push(fillerBook5);
    const fillerBook6 = new Book('The Stranger', 'Albert Camus', '123', 'Read');
    myLibrary.push(fillerBook6);
    const fillerBook7 = new Book('Goodnight Moon', 'Margaret Wise Brown', '32', 'Read');
    myLibrary.push(fillerBook7);
    const fillerBook8 = new Book('A Streetcar Named Desire', 'Tenesse Williams', '107', 'Read');
    myLibrary.push(fillerBook8);
    bookDisplay();
}

fillerBooks();