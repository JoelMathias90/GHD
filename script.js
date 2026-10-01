const habits = [
    {
        id: crypto.randomUUID(),
        title: "Reunião colaborativa",
        frequency: ["0", '3', "6"],
        completedDates: []
    }
]

const listHabits = document.getElementById("listHabits")
const progressContainer = document.getElementById("progressContainer")
const progressBar = document.getElementById("progressBar")
const progressCount = document.getElementById("progressCount")
const addHabitButton = document.getElementById("addHabitButton")
const addHabitForm = document.getElementById("addHabitForm")
const habitTitleInput = document.getElementById("habitTitleInput")
const habitFrequencyInputs = document.getElementsByName("habitFrequencyInput")
const submitHabitButton = document.getElementById("submitHabitButton")
const cancelHabitButton = document.getElementById("cancelHabitButton")
const currentDate = new Date()
const currentDateFormatted = currentDate.toLocaleDateString()
const frequencyDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

function createHabitElement(habit) {
    const { id, title, frequency } = habit

    const li = document.createElement("li")
    const input = document.createElement("input")
    const p = document.createElement("p")
    const div = document.createElement("div")
    frequencyDays.forEach((value, index) => {
        const dayContainer = document.createElement("div")
        const dayPoint = document.createElement("div")
        const span = document.createElement("span")

        dayContainer.className = "dayContainer"
        dayPoint.className = "dayPoint"
        span.textContent = value.charAt(0)

        dayContainer.append(dayPoint, span)
        div.append(dayContainer)

        if (frequency.includes(index.toString())) {
            dayPoint.classList.add("onDayPoint")
            span.classList.add("onDay")
        }

    })

    li.className = "listItem"
    li.dataset.id = id
    input.type = "checkbox"
    p.className = "itemTitle"
    p.textContent = title
    div.className = "frequencyContainer"

    renderHabit(habit, li)

    li.append(input, p, div)
    return li
}

function renderListHabits() {
    listHabits.replaceChildren()
    habits.forEach((habit) => {
        const habitItem = createHabitElement(habit)
        listHabits.appendChild(habitItem)
    })
}
renderListHabits()

function toggleHabitCompletion(habit) {
    if (!habit.completedDates.includes(currentDateFormatted)) {
        habit.completedDates.push(currentDateFormatted)
    } else {
        habit.completedDates = habit.completedDates.filter((completed) => completed !== currentDateFormatted)
    }
}

function addHabit(habit) {
    habits.push(habit)
    const newHabit = createHabitElement(habit)
    listHabits.appendChild(newHabit)
    addHabitForm.reset()
    addHabitForm.classList.remove("open")
    listHabits.classList.add("open")
}

function renderHabit(habit, item) {
    if (habit.completedDates.includes(currentDateFormatted)) {
        item.classList.add("completed")
        item.checked = true
    } else item.classList.remove("completed")
}

function updateProgressBar() {
    const goal = habits.filter((habit) => habit.frequency.includes(currentDate.getDay().toString()))
    const progress = goal.filter((habit) => habit.completedDates.includes(currentDateFormatted))
    const progressRate = goal.length > 0 ? (progress.length / goal.length) * 100 : 0
    progressCount.textContent = progress.length + "  /  " + goal.length
    progressBar.style.width = `${progressRate}%`
}
updateProgressBar()

addHabitButton.addEventListener("click", () => {
    addHabitForm.classList.add("open")
})

submitHabitButton.addEventListener("click", (event) => {
    event.preventDefault()
    const title = habitTitleInput.value
    const frequency = []
    habitFrequencyInputs.forEach(item => {
        if (item.checked) frequency.push(item.value)
    })

    const habit = {
        id: crypto.randomUUID(),
        title,
        frequency,
        completedDates: []
    }

    addHabit(habit)
    updateProgressBar()
})

cancelHabitButton.addEventListener("click", () => {
    addHabitForm.classList.remove("open")
})

listHabits.addEventListener("click", (event) => {
    if (event.target.matches(('input[type="checkbox"]'))) {
        const item = event.target.closest(".listItem")
        const itemId = item.dataset.id
        const habit = habits.find((habit) => habit.id === itemId)

        toggleHabitCompletion(habit)
        renderHabit(habit, item)
        updateProgressBar()
    }
})