/*************************
 GLOBAL VARIABLES
**************************/
let engineOn = false;
let engineStartTime = null;

let runningSeconds = 0;
let idleSeconds = 0;

let speedData = [];
let fuelData = [];
let timeLabels = [];

/*************************
 ENGINE START TIME DISPLAY
**************************/
function setEngineStartTime() {
  engineStartTime = new Date();
  document.getElementById("engineStart").innerText =
    engineStartTime.toLocaleTimeString();
}

/*************************
 ENGINE TOGGLE
**************************/
function toggleEngine() {
  engineOn = !engineOn;

  const btn = document.getElementById("engineBtn");
  if (engineOn) {
    btn.innerText = "ENGINE ON";
    btn.style.background = "#22c55e";
    setEngineStartTime();
  } else {
    btn.innerText = "ENGINE OFF";
    btn.style.background = "#ef4444";
  }
}

/*************************
 TIME FORMATTER
**************************/
function formatTime(seconds) {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = seconds % 60;

  return `${h.toString().padStart(2, "0")}:` +
         `${m.toString().padStart(2, "0")}:` +
         `${s.toString().padStart(2, "0")}`;
}

/*************************
 SPEED GRAPH
**************************/
const speedCtx = document.getElementById("speedChart").getContext("2d");
const speedChart = new Chart(speedCtx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [{
      label: "Speed (km/h)",
      data: speedData,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});

/*************************
 FUEL GRAPH
**************************/
const fuelCtx = document.getElementById("fuelChart").getContext("2d");
const fuelChart = new Chart(fuelCtx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [{
      label: "Fuel (%)",
      data: fuelData,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});

/*************************
 ENGINE USAGE GRAPH
**************************/
const engineUsageCtx = document.getElementById("engineUsageChart").getContext("2d");
const engineUsageChart = new Chart(engineUsageCtx, {
  type: "doughnut",
  data: {
    labels: ["Running Time", "Idle Time"],
    datasets: [{
      data: [0, 0]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: "bottom" } }
  }
});

/*************************
 FUEL CONSUMPTION
**************************/
function updateFuelConsumption(speed) {
  let rate = speed === 0 ? 0.6 : speed / 20;
  document.getElementById("fuelRate").innerText = rate.toFixed(2);
}

/*************************
 ENGINE TIME TRACKING
**************************/
function updateEngineTime(speed) {
  if (!engineOn) return;

  if (speed === 0) {
    idleSeconds++;
  } else {
    runningSeconds++;
  }

  document.getElementById("engineRunning").innerText =
    formatTime(runningSeconds);

  engineUsageChart.data.datasets[0].data = [
    runningSeconds,
    idleSeconds
  ];
  engineUsageChart.update();
}

/*************************
 FIRE ALERT
**************************/
function showFirePopup(show) {
  document.getElementById("firePopup").style.display =
    show ? "flex" : "none";
}

/*************************
 MAIN DATA UPDATE (DEMO)
**************************/
function updateData() {
  if (!engineOn) return;

  let speed = Math.floor(Math.random() * 120);
  let fuel = Math.floor(Math.random() * 100);
  let temp = Math.floor(Math.random() * 120);

  document.getElementById("speed").innerText = speed;
  document.getElementById("fuel").innerText = fuel;
  document.getElementById("temp").innerText = temp;
  document.getElementById("range").innerText = fuel * 5;

  document.getElementById("health").innerText =
    temp > 90 ? "Critical" : "Good";

  updateFuelConsumption(speed);
  updateEngineTime(speed);

  timeLabels.push(new Date().toLocaleTimeString());
  speedData.push(speed);
  fuelData.push(fuel);

  if (timeLabels.length > 10) {
    timeLabels.shift();
    speedData.shift();
    fuelData.shift();
  }

  speedChart.update();
  fuelChart.update();

  if (temp > 100) {
    document.getElementById("fireStatus").innerText = "🔥 FIRE";
    showFirePopup(true);
  } else {
    document.getElementById("fireStatus").innerText = "Safe";
    showFirePopup(false);
  }
}

/*************************
 GOOGLE MAP (DEMO)
**************************/
let map, marker;
function initMap() {
  const location = { lat: 11.0168, lng: 76.9558 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: location
  });
  marker = new google.maps.Marker({ position: location, map });
}
initMap();

/*************************
 TIMERS
**************************/
setInterval(updateData, 3000);

/*************************
 FIRE POPUP CLOSE
**************************/
function closePopup() {
  showFirePopup(false);
}
