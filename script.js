let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

function addBookToLibrary() {
    title = document.getElementById('bookTitle').value;
    author = document.getElementById('bookAuthor').value;
    pages = document.getElementById('bookPages').value;
    read = document.getElementById('bookRead').value;
    newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    document.getElementById('myForm').reset();
    return false;
}