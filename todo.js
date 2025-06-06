document.addEventListener("DOMContentLoaded", function () {
  let btn = document.querySelector("button");
  let ul = document.querySelector("ul");
  let inp = document.querySelector("input");

  // Function to get today's date as a string for comparison
  function getTodayDate() {
    const today = new Date();
    return today.toDateString();
  }

  // Function to select a random task as Today's Special
  function setTodaysSpecial() {
    const tasks = ul.querySelectorAll("li:not(.special)");
    if (tasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * tasks.length);
      const specialTask = tasks[randomIndex];
      specialTask.classList.add("special");
      specialTask.style.backgroundColor = "#ffeb3b";
      specialTask.style.fontWeight = "bold";
      localStorage.setItem(
        "specialTask",
        specialTask.innerText.split("delete")[0].trim()
      );
      localStorage.setItem("specialDate", getTodayDate());
    }
  }

  // Function to reset Today's Special at midnight
  function checkAndResetSpecial() {
    const savedDate = localStorage.getItem("specialDate");
    if (savedDate !== getTodayDate()) {
      const currentSpecial = ul.querySelector(".special");
      if (currentSpecial) {
        currentSpecial.classList.remove("special");
        currentSpecial.style.backgroundColor = "";
        currentSpecial.style.fontWeight = "";
      }
      localStorage.removeItem("specialTask");
      localStorage.removeItem("specialDate");
      setTodaysSpecial();
    }
  }

  // Load saved special task on page load
  const savedSpecial = localStorage.getItem("specialTask");
  const savedDate = localStorage.getItem("specialDate");
  if (savedSpecial && savedDate === getTodayDate()) {
    const tasks = ul.querySelectorAll("li");
    tasks.forEach((task) => {
      if (task.innerText.split("delete")[0].trim() === savedSpecial) {
        task.classList.add("special");
        task.style.backgroundColor = "#ffeb3b";
        task.style.fontWeight = "bold";
      }
    });
  } else {
    setTodaysSpecial();
  }
  // Check for reset every minute
  setInterval(checkAndResetSpecial, 60000);

  // Add new task
  btn.addEventListener("click", function () {
    if (inp.value.trim() !== "") {
      let item = document.createElement("li");
      item.innerText = inp.value.trim();

      let delBtn = document.createElement("button");
      delBtn.innerText = "delete";
      delBtn.classList.add("delete");

      item.appendChild(delBtn);
      ul.appendChild(item);
      inp.value = "";

      // Set new Today's Special if no special task exists
      if (!ul.querySelector(".special")) {
        setTodaysSpecial();
      }
    }
  });

  // Delete task
  ul.addEventListener("click", function (event) {
    if (event.target.nodeName === "BUTTON") {
      let listItem = event.target.parentElement;
      const wasSpecial = listItem.classList.contains("special");
      listItem.remove();
      console.log("deleted");
      if (wasSpecial) {
        localStorage.removeItem("specialTask");
        localStorage.removeItem("specialDate");
        setTodaysSpecial();
      }
    }
  });
});
