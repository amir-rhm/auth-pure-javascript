"use strict"

document.addEventListener("DOMContentLoaded", e => {
  const emailElement = document.querySelector("#email")
  const passwordElement = document.querySelector("#password")
  const formSubmitButton = document.querySelector(".login-submit")
  const passwordEyeIcon = document.querySelector(".login-eye")
  const formToggleLink = document.querySelector(".login-toggle")
  const formToggleText = document.querySelector(".login-toggle-text")
  const formTitle = document.querySelector(".form-title")
  const dialog = document.querySelector(".dialog")
  const dialogText = document.querySelector(".dialog-text")
  const inputsAlert = document.querySelectorAll(".input-alert")

  let isLoginMode = true
  let isHiddenPassword = true

  const users = JSON.parse(localStorage.getItem("users")) || []

  function formHandler(e) {
    const emailValue = emailElement.value.trim()
    const passwordValue = passwordElement.value.trim()
    if (isLoginMode) {
      loginHandler(emailValue, passwordValue)
    } else {
      registerHandler(emailValue, passwordValue)
    }
  }

  function showDialog(dialogTextContent, dialogClass) {
    dialog.hidden = false
    dialog.classList.add(dialogClass)
    dialogText.textContent = dialogTextContent

    setTimeout(() => {
      dialog.hidden = true
      dialog.classList.remove(dialogClass)
    }, 2000)
  }

  function toggleHandler() {
    isLoginMode = !isLoginMode

    formTitle.textContent = isLoginMode ? "Login" : "Register"
    formSubmitButton.textContent = isLoginMode ? "Login" : "Register"
    formToggleText.textContent = isLoginMode ? "Don't have an account? Register" : "Already have an account? Login"
  }

  function togglePasswordVisibility() {
    isHiddenPassword = !isHiddenPassword

    passwordElement.type = isHiddenPassword ? "password" : "text"
    passwordEyeIcon.className = isHiddenPassword ? "fa-regular fa-eye login-eye" : "fa-regular fa-eye-slash login-eye"
  }

  function isExistUser(email, password, dialogTextContent, dialogClass) {
    const user = users.find(({ userEmail, userPassword }) => userEmail.includes(email) && userPassword.includes(password))
    if (!user) {
      showDialog(dialogTextContent, dialogClass)
      return false
    }
    return true
  }

  function loginHandler(emailValue, passwordValue) {
    if (!isExistUser(emailValue, passwordValue, "you don’t have an account. Please register first ", "error")) return

    showDialog("you successfully login", "success")
    location.href = "./test.html"
    clearInputs()
  }

  function registerHandler(emailValue, passwordValue) {
    if (isExistUser(emailValue, passwordValue, "user successfully registered", "success")) return
    const newUser = { id: Date.now(), userEmail: emailValue, userPassword: passwordValue }
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    clearInputs()
  }

  function clearInputs() {
    emailElement.value = ""
    passwordElement.value = ""

    inputsAlert.forEach(element => {
      element.style.visibility = "hidden"
    })
  }

  function checkLength(e) {
    const inputTargetValue = e.target.value
    const inputTargetAlert = e.target.nextElementSibling

    inputTargetAlert.style.visibility = "visible"

    inputTargetAlert.textContent = inputTargetValue.length < 4 ? "too short length" : "good length"
    inputTargetAlert.className = inputTargetValue.length < 4 ? "input-alert" : "input-alert correct"
  }

  formSubmitButton.addEventListener("click", formHandler)
  formToggleLink.addEventListener("click", toggleHandler)
  passwordEyeIcon.addEventListener("click", togglePasswordVisibility)
  emailElement.addEventListener("input", checkLength)
  passwordElement.addEventListener("input", checkLength)
})
