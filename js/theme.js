export default changeTheme

const storedTheme = localStorage.getItem('theme')
const themeBtn = document.querySelector('.header-area__btn')

const iconTheme = document.querySelectorAll('.header-area__btn--icon')
const header = document.querySelector('.header')

if (storedTheme) {
	document.documentElement.setAttribute('data-theme', storedTheme)
}

function checkThemeImages() {
	if (storedTheme === 'light') {
		header.classList.remove('dark')
		iconTheme[0].classList.remove('hide')
		iconTheme[1].classList.add('hide')
	} else {
		header.classList.add('dark')
		iconTheme[0].classList.add('hide')
	}
}

function changeTheme() {
	const currentTheme = document.documentElement.getAttribute('data-theme')
	let targetTheme = 'light'

	if (currentTheme === 'light') {
		targetTheme = 'dark'
		header.classList.add('dark')
		iconTheme[0].classList.add('hide')
		iconTheme[1].classList.remove('hide')
	} else {
		header.classList.remove('dark')
		iconTheme[0].classList.remove('hide')
		iconTheme[1].classList.add('hide')
	}

	document.documentElement.setAttribute('data-theme', targetTheme)
	localStorage.setItem('theme', targetTheme)
}

checkThemeImages()
themeBtn.addEventListener('click', changeTheme)
