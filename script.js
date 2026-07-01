const form = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greetingMessage = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebration");
const attendeeCountElement = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");
const confettiLayer = document.getElementById("confettiLayer");
const resetButton = document.getElementById("resetBtn");

const goal = 50;
const teamIds = ["water", "zero", "power"];
const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

let goalReached = false;

let attendanceData = {
  total: 0,
  teams: {
    water: 0,
    zero: 0,
    power: 0,
  },
  attendees: [],
};

function getDefaultData() {
  return {
    total: 0,
    teams: {
      water: 0,
      zero: 0,
      power: 0,
    },
    attendees: [],
  };
}

function getSavedData() {
  const savedData = localStorage.getItem("eventCheckInData");

  if (savedData) {
    const parsedData = JSON.parse(savedData);

    if (parsedData) {
      attendanceData = parsedData;
    }
  }
}

function saveData() {
  localStorage.setItem("eventCheckInData", JSON.stringify(attendanceData));
}

function createConfetti() {
  const colors = ["#5ea4ff", "#dbe9ff", "#0f4ca0", "#2d8cff", "#cfe1ff"];

  for (let i = 0; i < 28; i = i + 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.width = Math.random() * 10 + 6 + "px";
    piece.style.height = Math.random() * 12 + 8 + "px";
    piece.style.setProperty("--drift", Math.random() * 220 - 110 + "px");
    piece.style.animationDelay = Math.random() * 0.2 + "s";
    confettiLayer.appendChild(piece);

    setTimeout(function () {
      if (piece.parentNode) {
        piece.parentNode.removeChild(piece);
      }
    }, 2400);
  }
}

function updateProgress() {
  const percent = Math.min((attendanceData.total / goal) * 100, 100);
  progressBar.style.width = percent + "%";
  attendeeCountElement.textContent = attendanceData.total;

  if (attendanceData.total >= goal) {
    if (!goalReached) {
      goalReached = true;
      createConfetti();
    }

    const winningTeam = getWinningTeam();
    celebrationMessage.textContent = `Goal reached! ${winningTeam} is leading the celebration!`;
    celebrationMessage.classList.add("show");
  } else {
    goalReached = false;
    celebrationMessage.classList.remove("show");
  }
}

function updateTeamCounts() {
  teamIds.forEach(function (teamId) {
    const countElement = document.getElementById(teamId + "Count");
    countElement.textContent = attendanceData.teams[teamId];
  });
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendanceData.attendees.length === 0) {
    attendeeList.innerHTML =
      '<li class="empty-state">No attendees checked in yet.</li>';
    return;
  }

  attendanceData.attendees.forEach(function (person) {
    const listItem = document.createElement("li");
    listItem.className = "attendee-item";

    const nameElement = document.createElement("span");
    nameElement.className = "attendee-name";
    nameElement.textContent = person.name;

    const teamElement = document.createElement("span");
    teamElement.className = "attendee-team";
    teamElement.textContent = person.teamLabel;

    listItem.appendChild(nameElement);
    listItem.appendChild(teamElement);
    attendeeList.appendChild(listItem);
  });
}

function getWinningTeam() {
  let leadingTeam = teamIds[0];

  teamIds.forEach(function (teamId) {
    if (attendanceData.teams[teamId] > attendanceData.teams[leadingTeam]) {
      leadingTeam = teamId;
    }
  });

  return teamLabels[leadingTeam];
}

function showGreeting(name, teamLabel) {
  greetingMessage.style.display = "block";
  greetingMessage.className = "success-message";
  greetingMessage.textContent =
    "Welcome, " + name + "! You are checked in for " + teamLabel + ".";
}

function resetAttendance() {
  attendanceData = getDefaultData();
  goalReached = false;
  localStorage.removeItem("eventCheckInData");
  updateTeamCounts();
  updateProgress();
  renderAttendeeList();
  greetingMessage.style.display = "none";
  greetingMessage.textContent = "";
  celebrationMessage.classList.remove("show");
}

function handleCheckIn(event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (!attendeeName || !selectedTeam) {
    return;
  }

  const teamLabel = teamLabels[selectedTeam];

  attendanceData.total = attendanceData.total + 1;
  attendanceData.teams[selectedTeam] = attendanceData.teams[selectedTeam] + 1;
  attendanceData.attendees.unshift({
    name: attendeeName,
    teamLabel: teamLabel,
  });

  saveData();
  updateTeamCounts();
  updateProgress();
  renderAttendeeList();
  showGreeting(attendeeName, teamLabel);

  form.reset();
}

function initializeApp() {
  resetAttendance();
}

form.addEventListener("submit", handleCheckIn);
resetButton.addEventListener("click", resetAttendance);
initializeApp();
