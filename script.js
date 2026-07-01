const form = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greetingMessage = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebration");
const attendeeCountElement = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");

const goal = 50;
const teamIds = ["water", "zero", "power"];
const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

let attendanceData = {
  total: 0,
  teams: {
    water: 0,
    zero: 0,
    power: 0,
  },
  attendees: [],
};

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

function updateProgress() {
  const percent = Math.min((attendanceData.total / goal) * 100, 100);
  progressBar.style.width = percent + "%";
  attendeeCountElement.textContent = attendanceData.total;

  if (attendanceData.total >= goal) {
    const winningTeam = getWinningTeam();
    celebrationMessage.textContent = `Goal reached! ${winningTeam} is leading the celebration!`;
    celebrationMessage.classList.add("show");
  } else {
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
  getSavedData();
  updateTeamCounts();
  updateProgress();
  renderAttendeeList();
}

form.addEventListener("submit", handleCheckIn);
initializeApp();
