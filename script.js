let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.readSwitch = function() {
        this.read === 'Read' ? this.read = 'Reading' : this.read = 'Read';
        bookDisplay();
    }
}

const fillerBook1 = new Book('To Kill a Mocking Bird', 'Harper Lee', '336', 'Read');
myLibrary.push(fillerBook1);
const fillerBook2 = new Book('Pride and Prejudice', 'Jane Austen', '279', 'Read');
myLibrary.push(fillerBook2);
const fillerBook3 = new Book('The Giving Tree', 'Shel Silverstien', '64', 'Read');
myLibrary.push(fillerBook3);
bookDisplay();

function addBookToLibrary() {
    title = document.getElementById('bookTitle').value;
    author = document.getElementById('bookAuthor').value;
    pages = document.getElementById('bookPages').value;
    read = document.getElementById('bookRead').value;
    newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    document.getElementById('myForm').reset();
    bookDisplay();
    closeForm();
    return false;
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
        div.innerHTML = `${myLibrary[i].title} ${myLibrary[i].author} ${myLibrary[i].pages}`;
        bookContainer.appendChild(div);
        button = document.createElement('button');
        button.setAttribute('id', 'readBtn');
        button.setAttribute('onclick', `myLibrary[${i}].readSwitch()`)
        button.innerText = `${myLibrary[i].read}`;
        div.appendChild(button);
        button = document.createElement('button');
        button.setAttribute('id', 'eraseBtn');
        button.setAttribute('onclick', `eraseBook(${i})`);
        button.innerText = 'Erase';
        div.appendChild(button);
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