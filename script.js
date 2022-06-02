const localStorageKey = ' Books-Data';
const sectionTitle = document.querySelector('#title');
const sectionAuthor = document.querySelector('#author');
const sectionYear = document.querySelector('#year');

const title = document.querySelector('#inputBookTitle');
const author = document.querySelector('#inputBookAuthor');
const year = document.querySelector('#inputBookYear');

const readed = document.querySelector('#inputBookIsComplete');
const submit = document.querySelector('#bookSubmit');

const search = document.querySelector('#searchSubmit');
const searchValue = document.querySelector('#searchBookTitle');

let checkInput = [];
let checkTitle = null;
let checkAuthor = null;
let checkYear = null;

window.addEventListener('load', function () {
	if (localStorage.getItem(localStorageKey) !== null) {
		const booksData = getData();
		showData(booksData);
	}
});

search.addEventListener('click', function (e) {
	e.preventDefault();
	if (localStorage.getItem(localStorageKey) == null) {
		return alert('Data tidak ditemukan');
	} else {
		const getByTitle = getData().filter(
			(a) => a.title == searchValue.value.trim()
		);
		if (getByTitle.length == 0) {
			const getByAuthor = getData().filter(
				(a) => a.author == searchValue.value.trim()
			);
			if (getByAuthor.length == 0) {
				const getByYear = getData().filter(
					(a) => a.year == searchValue.value.trim()
				);
				if (getByYear.length == 0) {
					alert(`Data yang diminta tidak ditemukan. Mohon periksa kembali!!`);
				} else {
					showResult(getByYear);
				}
			} else {
				showResult(getByAuthor);
			}
		} else {
			showResult(getByTitle);
		}
	}

	searchValue.value = '';
});

submit.addEventListener('click', function () {
	if (submit.value == '') {
		checkInput = [];

		title.classList.remove('error');
		author.classList.remove('error');
		year.classList.remove('error');

		errorTitle.classList.add('error-display');
		errorAuthor.classList.add('error-display');
		errorYear.classList.add('error-display');

		if (title.value == '') {
			checkTitle = false;
		} else {
			checkTitle = true;
		}

		if (author.value == '') {
			checkAuthor = false;
		} else {
			checkAuthor = true;
		}

		if (year.value == '') {
			checkYear = false;
		} else {
			checkYear = true;
		}

		checkInput.push(checkTitle, checkAuthor, checkYear);
		let resultCheck = validation(checkInput);

		if (resultCheck.includes(false)) {
			return false;
		} else {
			const newBook = {
				id: +new Date(),
				title: title.value.trim(),
				author: author.value.trim(),
				year: year.value,
				isComplete: readed.checked,
			};
			insertData(newBook);
			title.value = '';
			author.value = '';
			year.value = '';
			readed.checked = false;
		}
	} else {
		const bookData = getData().filter((a) => a.id != submit.value);
		localStorage.setItem(localStorageKey, JSON.stringify(bookData));

		const newBook = {
			id: submit.value,
			title: title.value.trim(),
			author: author.value.trim(),
			year: year.value,
			isComplete: readed.checked,
		};

		insertData(newBook);
		submit.innerHTML = 'Masukkan Buku';
		submit.value = '';
		title.value = '';
		author.value = '';
		year.value = '';
		readed.checked = false;
		alert('Buku berhasil diedit');
	}
});

function validation(check) {
	let resultCheck = [];

	check.forEach((a, i) => {
		if (a == false) {
			if (i == 0) {
				title.classList.add('error');
				errorTitle.classList.remove('error-display');
				resultCheck.push(false);
			} else if (i == 0) {
				author.classList.add('error');
				errorAuthor.classList.remove('error-dispaly');
				resultCheck.push(false);
			} else {
				year.classList.add('error');
				errorYear.classList.remove('error-display');
				resultCheck.push(false);
			}
		}
	});

	return resultCheck;
}

function insertData(book) {
	let bookData = [];

	if (localStorage.getItem(localStorageKey) === null) {
		localStorage.setItem(localStorageKey, 0);
	} else {
		bookData = JSON.parse(localStorage.getItem(localStorageKey));
	}

	bookData.unshift(book);
	localStorage.setItem(localStorageKey, JSON.stringify(bookData));

	showData(getData());
}

function getData() {
	return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

function showData(books = []) {
	const inComplete = document.querySelector('#incomplete');
	const complete = document.querySelector('#completeBookList');

	inComplete.innerHTML = '';
	complete.innerHTML = '';

	books.forEach((book) => {
		if (book.isComplete == false) {
			let el = `<article class="book-item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button onclick="readedBook('${book.id}')">Selesai</button>
                    <button onclick="editBook('${book.id}')">Edit Buku</button>
                    <button onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>`;

			inComplete.innerHTML += el;
		} else {
			let el = `
            <article class="book-item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button onclick="unreadedBook('${book.id}')">Belum selesai</button>
                    <button onclick="editBook('${book.id}')">Edit Buku</button>
                    <button onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `;
			complete.innerHTML += el;
		}
	});
}

function showResult(books) {
	const result = document.querySelector('#searchResult');

	result.innerHTML = '';

	books.forEach((book) => {
		let el = `<article class="book-item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <p>${book.isComplete ? 'Sudah dibaca' : 'Belum dibaca'}</p>
        </article>`;

		result.innerHTML += el;
	});
}

function readedBook(id) {
	let confirmation = confirm('Pindah ke selesai dibaca?');

	if (confirmation == true) {
		const bookDataDetail = getData().filter((a) => a.id == id);
		const newBook = {
			id: bookDataDetail[0].id,
			title: bookDataDetail[0].title,
			author: bookDataDetail[0].author,
			year: bookDataDetail[0].year,
			isComplete: true,
		};

		const bookData = getData().filter((a) => a.id != id);
		localStorage.setItem(localStorageKey, JSON.stringify(bookData));

		insertData(newBook);
	} else {
		return 0;
	}
}

function unreadedBook(id) {
	let confirmation = confirm('Pindahkan ke belum selesai dibaca?');

	if (confirmation == true) {
		const bookDataDetail = getData().filter((a) => a.id == id);
		const newBook = {
			id: bookDataDetail[0].id,
			title: bookDataDetail[0].title,
			author: bookDataDetail[0].author,
			year: bookDataDetail[0].year,
			isComplete: false,
		};

		const bookData = getData().filter((a) => a.id != id);
		localStorage.setItem(localStorageKey, JSON.stringify(bookData));

		insertData(newBook);
	} else {
		return 0;
	}
}

function editBook(id) {
	const bookDataDetail = getData().filter((a) => a.id == id);
	title.value = bookDataDetail[0].title;
	author.value = bookDataDetail[0].author;
	year.value = bookDataDetail[0].year;
	bookDataDetail[0].isComplete
		? (readed.checked = true)
		: (readed.checked = false);

	submit.innerHTML = 'Edit buku';
	submit.value = bookDataDetail[0].id;
}

function deleteBook(id) {
	let confirmation = confirm('Apakah anda yakin ingin menghapus?');

	if (confirmation == true) {
		const bookDataDetail = getData().filter((a) => a.id == id);
		const bookData = getData().filter((a) => a.id != id);
		localStorage.setItem(localStorageKey, JSON.stringify(bookData));
		showData(getData());
		alert(
			`Buku dengan Judul ${bookDataDetail[0].title} telah berhasil dihapus`
		);
	} else {
		return 0;
	}
}
