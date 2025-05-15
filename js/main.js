'use strict'

import changeTheme from './theme.js'

const toDoList = document.querySelector('.tasks-box')
const newTaskInput = document.querySelector('.input-container__input')
const showError = document.querySelector('.error')
const taskButtons = document.querySelectorAll('.button-container__btn')
const emptyState = document.querySelector('.empty-state')
const clearCompletedTasksBtn = document.querySelector('.button-container__clear-btn')

let taskId = 0
let inputId = 0
let storageOfCreatedTasks = localStorage.getItem('tasks') ? parseFromLocalStorage() : []

let tasks = {
	allTasks: function () {
		return document.getElementsByClassName('task')
	},

	activeTasks: function () {
		return [...tasks.allTasks()].filter(task => !task.classList.contains('task-completed-text'))
	},

	completedTasks: function () {
		return [...tasks.allTasks()].filter(task => task.classList.contains('task-completed-text'))
	},
}

function addToLocalStorage(task) {
	localStorage.setItem('tasks', JSON.stringify(task))
}

function parseFromLocalStorage() {
	return JSON.parse(localStorage.getItem('tasks'))
}

function handleEmptyState() {
	let allTasksNumber = tasks.allTasks().length
	allTasksNumber === 0 ? emptyState.classList.remove('hide') : emptyState.classList.add('hide')
}

const newTask = text => {
	taskId++
	inputId++
	let newTask = document.createElement('li')
	newTask.className = 'task'
	newTask.setAttribute('draggable', true)
	newTask.dataset.id = taskId

	newTask.innerHTML = `
	<input id="${inputId}" type="checkbox" class="task__input">
	<span class="task__circle"><img src="./images/icon-check.svg" alt="" class="task__circle--icon" aria-hidden="true"></span>
	<label for="${inputId}" class="task__textarea">${text}</label>
	<button class="task__delete"><img src="./images/icon-cross.svg" alt="Delete task icon" class="task__delete--x-img"></button>
	`

	toDoList.insertBefore(newTask, toDoList.firstChild)

	if (!storageOfCreatedTasks.includes(text)) {
		storageOfCreatedTasks.push(text)
		addToLocalStorage(storageOfCreatedTasks)
	}
}

storageOfCreatedTasks.forEach(item => {
	newTask(item)
})

function displayError(msg) {
	const textError = document.querySelector('.error__text')

	if (!showError.classList.contains('error-display')) {
		textError.textContent = `${msg}`
		showError.classList.add('error-display')

		setTimeout(() => {
			showError.classList.add('error-hide')
		}, 2000)

		setTimeout(() => {
			showError.classList.remove('error-display')
			showError.classList.remove('error-hide')
			textError.textContent = ''
		}, 2500)
	}
}

const displayNewTask = event => {
	let emptyspace = /^\s*$/
	let inputValue = newTaskInput.value

	if (event.key !== 'Enter') {
		return
	}

	if (inputValue.match(emptyspace) || inputValue == '') {
		displayError('Please enter the content of the task')
		newTaskInput.value = ''
		return
	}

	newTask(newTaskInput.value)
	newTaskInput.value = ''
	displayNumberOfActiveTasks()
	handleEmptyState()
}

const handleTask = e => {
	if (e.target.closest('button')) {
		deleteTask(e)

		setTimeout(() => {
			handleEmptyState()
		}, 400)
	}

	if (e.target.closest('input')) {
		setTaskAsCompleted(e)
		displayNumberOfActiveTasks()
	}
}

function deleteTask(e) {
	let deleteSelectedTask = e.target.closest('li')
	deleteSelectedTask.classList.add('task-remove')

	setTimeout(() => {
		deleteSelectedTask.remove()
		displayNumberOfActiveTasks()

		let remainedTasks = storageOfCreatedTasks.filter(
			tasks => tasks !== `${e.target.closest('li').children.item(2).textContent}`
		)

		localStorage.setItem('tasks', JSON.stringify(remainedTasks))
		storageOfCreatedTasks = remainedTasks
	}, 400)
}

function setTaskAsCompleted(e) {
	const completeTask = e.target.closest('li')
	const completeTaskImg = completeTask.getElementsByClassName('task__circle')[0]

	completeTask.classList.toggle('task-completed-text')
	completeTaskImg.classList.toggle('task-completed-circle')
}

function displayNumberOfActiveTasks() {
	const currentTasksNumber = document.querySelector('.button-container__text')
	let activeArray = tasks.activeTasks()

	currentTasksNumber.textContent =
		activeArray.length === 1 ? `${activeArray.length} item left` : `${activeArray.length} items left`
}

function deleteCompletedTasks() {
	let completedArray = tasks.completedTasks()

	completedArray.forEach(task => {
		let taskValue = task.children.item(2).textContent
		task.classList.add('task-remove')

		if (storageOfCreatedTasks.includes(taskValue)) {
			storageOfCreatedTasks = storageOfCreatedTasks.filter(task => task !== taskValue)
			localStorage.setItem('tasks', JSON.stringify(storageOfCreatedTasks))
		}

		setTimeout(() => {
			task.remove()
			handleEmptyState()
		}, 400)
	})
}

function handleClearCompletedTasksBtn() {
	let completedArray = tasks.completedTasks()

	if (completedArray.length > 0) {
		deleteCompletedTasks()
	} else {
		displayError('Nothing to clear')
	}
}

function activeTaskBtn() {
	const activeBtnClass = document.querySelector('.active-btn')
	let tasksArray = [...tasks.allTasks()]

	if (activeBtnClass) {
		activeBtnClass.classList.remove('active-btn')
		tasksArray.forEach(task => {
			task.classList.remove('hide')
		})
	}
}

function addActiveClassToBtnAll() {
	let AllTasksBtn = taskButtons[0]
	AllTasksBtn.classList.add('active-btn')
}

function taskStatusView(e) {
	let completedArray = tasks.completedTasks()
	let activeArray = tasks.activeTasks()

	if (e.target.dataset.status == 'all') {
		activeTaskBtn()
		e.target.classList.add('active-btn')
	}

	if (e.target.dataset.status == 'active') {
		if (activeArray.length > 0) {
			activeTaskBtn()
			e.target.classList.add('active-btn')

			completedArray.forEach(task => {
				task.classList.add('hide')
			})
		} else {
			displayError("There aren't any active tasks")
		}
	}

	if (e.target.dataset.status == 'completed') {
		if (completedArray.length > 0) {
			activeTaskBtn()
			e.target.classList.add('active-btn')

			activeArray.forEach(task => {
				task.classList.add('hide')
			})
		} else {
			displayError("There aren't any completed tasks")
		}
	}
}

taskButtons.forEach(btn => {
	btn.addEventListener('click', e => {
		taskStatusView(e)
	})
})

document.addEventListener('DOMContentLoaded', e => {
	let sourceTaskElement

	function handleDragStart(e) {
		this.style.opacity = 0.4

		sourceTaskElement = this

		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setData('text/html', this.innerHTML)
	}

	function handleDragEnd() {
		this.style.opacity = 1
	}

	function handleDragOver(e) {
		e.preventDefault()
	}

	function handleDrop(e) {
		e.preventDefault()
		e.stopPropagation()

		if (sourceTaskElement !== this) {
			sourceTaskElement.innerHTML = this.innerHTML
			this.innerHTML = e.dataTransfer.getData('text/html')
		}
	}

	tasks.activeTasks().forEach(task => {
		task.addEventListener('dragstart', handleDragStart)
		task.addEventListener('dragover', handleDragOver)
		task.addEventListener('dragend', handleDragEnd)
		task.addEventListener('drop', handleDrop)
	})
})

newTaskInput.addEventListener('keyup', displayNewTask)
toDoList.addEventListener('click', handleTask)
clearCompletedTasksBtn.addEventListener('click', handleClearCompletedTasksBtn)
addActiveClassToBtnAll()
handleEmptyState()
displayNumberOfActiveTasks()
