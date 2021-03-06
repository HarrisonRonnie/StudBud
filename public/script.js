// Smooth scrolling function
// https://webcodeflow.com/vertical-slider-scrolling/


$(document).ready(function () {
  var timeStart = 0;

  function wheely(e) {
    var y = e.originalEvent.deltaY;
    var timeStop = new Date().getTime();
    var timeDiff = timeStop - timeStart;
    if (timeDiff > 200) {
      if (y > 0) {
        nextSlide();
      }
      if (y < 0) {
        prevSlide();
      }
    }
    timeStart = timeStop;
  }

  function prevSlide() {
    if ($(".active").is(":first-child")) {
      if (!$(".slider").hasClass("dragging")) {
        $(".slide:first-child").addClass("bounce");
        setTimeout(function () {
          $(".slide:first-child").removeClass("bounce");
        }, 300);
      }
    } else {
      $(".active")
        .removeClass("active")
        .addClass("queue")
        .prev()
        .removeClass("prev")
        .addClass("active");
    }
  }

  function nextSlide() {
    if ($(".active").is(":last-child")) {
      if (!$(".slider").hasClass("dragging")) {
        $(".slide:last-child").addClass("bounce");
        setTimeout(function () {
          $(".slide:last-child").removeClass("bounce");
        }, 300);
      }
    } else {
      $(".active")
        .removeClass("active")
        .addClass("prev")
        .next()
        .removeClass("queue")
        .addClass("active");
    }
  }

  function hotkeys(e) {
    if (e.keyCode == 38) {
      prevSlide();
    }

    if (e.keyCode == 40) {
      e.preventDefault();
      nextSlide();
    }
  }

  $(document).on("wheel", wheely);
  $(document).on("keydown", hotkeys);
  // $(document).on("touchstart mousedown", dragStart);
  // $(document).on("touchend mouseup", dragEnd);
});


// Stopwatch

class State {
  constructor(startTimestamp, difference, suspended) {
    this.startTimestamp = startTimestamp;
    this.difference = difference;
    this.suspended = suspended;
  }

  static ready() {
    return new State(null, 0, 0);
  }
}


// dom to determine different events such as start stop and reset buttons
class Stopwatch {
  constructor(state) {
    this.state = state;
    this.requestAnimationId = null;
    this.handleClickStart = this.handleClickStart.bind(this);
    document
      .getElementById("start")
      .addEventListener("click", this.handleClickStart);
    this.handleClickStop = this.handleClickStop.bind(this);
    document
      .getElementById("stop")
      .addEventListener("click", this.handleClickStop);
    this.handleClickReset = this.handleClickReset.bind(this);
    document
      .getElementById("reset")
      .addEventListener("click", this.handleClickReset);
    this.tick = this.tick.bind(this);
    this.render();
  }


  static ready() {
    return new Stopwatch(State.ready());
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  tick() {
    this.setState({
      difference: new Date(new Date() - this.state.startTimestamp)
    });
    this.requestAnimationId = requestAnimationFrame(this.tick);
  }
// Prevent more than 1 clicks upon start
  handleClickStart() {
    if (this.state.startTimestamp) {

  
      return;
    }
    this.setState({
      startTimestamp: new Date() - this.state.suspended,
      suspended: 0
    });
    this.requestAnimationId = requestAnimationFrame(this.tick);
  }

  handleClickStop() {
    cancelAnimationFrame(this.requestAnimationId);
    this.setState({
      startTimestamp: null,
      suspended: this.state.difference
    });
  }

  handleClickReset() {
    cancelAnimationFrame(this.requestAnimationId);
    this.setState(State.ready());
  }

  render() {
    const { difference } = this.state;
    const hundredths = (difference
      ? Math.floor(difference.getMilliseconds() / 10)
      : 0
    )
      .toString()
      .padStart(2, "0");
    const seconds = (difference ? Math.floor(difference.getSeconds()) : 0)
      .toString()
      .padStart(2, "0");
    const minutes = (difference ? Math.floor(difference.getMinutes()) : 0)
      .toString()
      .padStart(2, "0");


    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    document.getElementById("hundredths").textContent = hundredths;
  }
}

const STOPWATCH = Stopwatch.ready();


// Music Player


// defining all the elements 
let previous = document.querySelector('#pre');
let play = document.querySelector('#play');
let next = document.querySelector('#next');
let title = document.querySelector('#title');
let recent_volume = document.querySelector('#volume');
let volume_show = document.querySelector('#volume_show');
let slider = document.querySelector('#duration_slider');
let show_duration = document.querySelector('#show_duration');

let auto_play = document.querySelector('#auto');
let present = document.querySelector('#present');
let total = document.querySelector('#total');
let artist = document.querySelector('#artist');



let timer;
let autoplay = 0;

let index_no = 0;
let Playing_song = false;

// Creating  an audio Element
let track = document.createElement('audio');


// All songs list
let All_song = [
  {
    name: "first song",
    path: "music/song1.mp3",
    singer: "1"
  },
  {
    name: "second song",
    path: "music/song2.mp3",
    singer: "2"
  },
  {
    name: "third song",
    path: "music/song3.mp3",
    singer: "3"
  },
  {
    name: "fourth song",
    path: "music/song4.mp3",
    singer: "4"
  },
  {
    name: "fifth song",
    path: "music/song5.mp3",
    singer: "5"
  }
];


// All functions


// Loading the track
function load_track(index_no) {
  clearInterval(timer);
  reset_slider();

  track.src = All_song[index_no].path;
  title.innerHTML = All_song[index_no].name;
  artist.innerHTML = All_song[index_no].singer;
  track.load();


  // Slider
  timer = setInterval(range_slider, 1000);
  total.innerHTML = All_song.length;
  present.innerHTML = index_no + 1;
}

load_track(index_no);


// Mute function, defining mute as '0' 
function mute_sound() {
  track.volume = 0;
  volume.value = 0;
  volume_show.innerHTML = 0;
}


// checking if the song is playing
function justplay() {
  if (Playing_song == false) {
    playsong();

  } else {
    pausesong();
  }
}


// Reset slider
function reset_slider() {
  slider.value = 0;
}

// Play song function
function playsong() {
  track.play();
  Playing_song = true;
  play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
}

// Pause song function
function pausesong() {
  track.pause();
  Playing_song = false;
  play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
}


// Next song function
function next_song() {
  if (index_no < All_song.length - 1) {
    index_no += 1;
    load_track(index_no);
    playsong();
  } else {
    index_no = 0;
    load_track(index_no);
    playsong();

  }
}


// Previous song function, same as above, just -1 to return to previous setting
function previous_song() {
  if (index_no > 0) {
    index_no -= 1;
    load_track(index_no);
    playsong();

  } else {
    index_no = All_song.length;
    load_track(index_no);
    playsong();
  }
}


// Volume slider
function volume_change() {
  volume_show.innerHTML = recent_volume.value;
  track.volume = recent_volume.value / 100;
}

// Slider position 
function change_duration() {
  slider_position = track.duration * (slider.value / 100);
  track.currentTime = slider_position;
}

// Autoplay function
function autoplay_switch() {
  if (autoplay == 1) {
    autoplay = 0;
    auto_play.style.background = "rgba(255,255,255,0.2)";
  } else {
    autoplay = 1;
    auto_play.style.background = "#FF8A65";
  }
}


function range_slider() {
  let position = 0;

  // update slider position
  if (!isNaN(track.duration)) {
    position = track.currentTime * (100 / track.duration);
    slider.value = position;
  }


  // function will run when the song is over
  if (track.ended) {
    play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    if (autoplay == 1) {
      index_no += 1;
      load_track(index_no);
      playsong();
    }
  }
}



// Tasklist 
// Variables for HTML elements (DOM selectors)
const form = document.getElementById("taskform");
const button = document.querySelector("#taskform > button") // css query
var taskInput = document.getElementById("taskInput");
var tasklist = document.getElementById("tasklist");

var dueDateInput = document.getElementById("dueDateInput");
var completionTimeInput = document.getElementById("completionTimeInput");
var estimatedTimeInput = document.getElementById("estimatedTimeInput");
var priorityInput = document.getElementById("priorityInput");


// button click event listener
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let task = taskInput.value;
  let dueDate = dueDateInput.value;
  let completionTime = completionTimeInput.value;
  let estimatedTime = estimatedTimeInput.value;
  let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
  addTask(task, dueDate, estimatedTime, priorityRating, completionTime, false);
  console.log(taskList); // Log out the new taskList
})


// Empty array for storing tasks
var taskListArray = [];

function addTask(taskDescription, dueDate, estimatedTime, priorityRating, completionTime, completionStatus) {
  let d = new Date();
  let dateCreated = d.getFullYear();
  let task = {
    taskDescription,
    dueDate,
    dateCreated,
    estimatedTime,
    completionTime,
    priorityRating,
    estimatedTime,
    completionStatus
  };
  taskListArray.push(task);
  renderTask(task);
}

function renderTask(task) {
  // Create HTML elements
  let item = document.createElement("li");
  item.innerHTML = "<p>" + task.taskDescription + "</p>";

  tasklist.appendChild(item);

  // Extra Task DOM elements
  let delButton = document.createElement("button");
  let delButtonText = document.createTextNode("Delete Task");
  delButton.appendChild(delButtonText);
  item.appendChild(delButton);


  // Event Listeners for DOM elements
  delButton.addEventListener("click", function (event) {
    event.preventDefault();
    item.remove();
  })


  // Clear the input form
  form.reset();
}

//Kanban Board

document.getElementById('add-task').addEventListener('click', function () {
  let taskValue = document.getElementById('task-value').value;
  if (taskValue) newTask(taskValue);
  document.getElementById('task-value').value = '';
});

const newTask = (taskValue) => {
  let task = document.createElement('li');
  task.classList.add('task');
  task.classList.add('fill');
  task.setAttribute("draggable", "true");
  task.addEventListener('dragstart', dragStart);
  task.addEventListener('dragend', dragEnd);

  let taskContent = document.createElement('div');
  taskContent.classList.add('task-content');
  taskContent.innerText = taskValue;

  let trash = document.createElement('div');
  trash.classList.add('trash');
  trash.innerText = "X";
  trash.addEventListener('click', removeTask);

  task.appendChild(taskContent);
  task.appendChild(trash);

  let tasks = document.getElementById('tasks-added');
  tasks.insertBefore(task, tasks.childNodes[0]);
}

const removeTask = (event) => {
  let tasks = event.target.parentNode.parentNode;
  let task = event.target.parentNode;
  tasks.removeChild(task);
}

// Drag and drop functionality 

let task

const dragStart = (event) => {
  event.target.className += ' hold';
  task = event.target;
  setTimeout(() => (event.target.className = 'invisible'), 0); // invisible if nothing happens
}

const dragEnd = (event) => {
  event.target.className = 'task fill';
}

const dropzones = document.querySelectorAll('.dropzone');

const dragEnter = (event) => {
  event.preventDefault();
  if (event.target.className === "column dropzone") {
    event.target.className += ' hovered';
  }
}

const dragOver = (event) => {
  event.preventDefault();
}

const dragLeave = (event) => {
  if (event.target.className === "column dropzone hovered") {
    event.target.className = "column dropzone"
  }
}

const dragDrop = (event) => {
  if (event.target.className === "column dropzone hovered") {
    event.target.className = "column dropzone"
  }
  event.target.append(task);
}

for (const dropzone of dropzones) {
  dropzone.addEventListener('dragenter', dragEnter);
  dropzone.addEventListener('dragover', dragOver);
  dropzone.addEventListener('dragleave', dragLeave);
  dropzone.addEventListener('drop', dragDrop);
}

// pomodoro

const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}
// Const queries for all the interacion features

const el = document.querySelector(".clock");
const bell = document.querySelector("audio");

const mindiv = document.querySelector(".mins");
const secdiv = document.querySelector(".secs");

const startBtn = document.querySelector(".start");
localStorage.setItem("btn", "focus");

let initial, totalsecs, perc, paused, mins, seconds;

startBtn.addEventListener("click", () => {
  let btn = localStorage.getItem("btn");

  if (btn === "focus") {
    mins = +localStorage.getItem("focusTime") || 1;
  } else {
    mins = +localStorage.getItem("breakTime") || 1;
  }

  seconds = mins * 60;
  totalsecs = mins * 60;
  setTimeout(decremenT(), 60);
  startBtn.style.transform = "scale(0)";
  paused = false;
});

function decremenT() {
  mindiv.textContent = Math.floor(seconds / 60);
  secdiv.textContent = seconds % 60 > 9 ? seconds % 60 : `0${seconds % 60}`;
  if (circle.classList.contains("danger")) {
    circle.classList.remove("danger");
  }

  if (seconds > 0) {
    perc = Math.ceil(((totalsecs - seconds) / totalsecs) * 100);
    setProgress(perc);
    seconds--;
    initial = window.setTimeout("decremenT()", 1000);
    if (seconds < 10) {
      circle.classList.add("danger");
    }
  } else {
    mins = 0;
    seconds = 0;
    bell.play();
    let btn = localStorage.getItem("btn");

    if (btn === "focus") {
      startBtn.textContent = "start break";
      startBtn.classList.add("break");
      localStorage.setItem("btn", "break");
    } else {
      startBtn.classList.remove("break");
      startBtn.textContent = "Start Focus";
      localStorage.setItem("btn", "focus");
    }
    startBtn.style.transform = "scale(1)";
  }
}

const focusTimeInput = document.querySelector("#focusTime");
const breakTimeInput = document.querySelector("#breakTime");
const pauseBtn = document.querySelector(".pause");

focusTimeInput.value = localStorage.getItem("focusTime");
breakTimeInput.value = localStorage.getItem("breakTime");

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("focusTime", focusTimeInput.value);
  localStorage.setItem("breakTime", breakTimeInput.value);
});

document.querySelector(".reset").addEventListener("click", () => {
  startBtn.style.transform = "scale(1)";
  clearTimeout(initial);
  setProgress(0);
  mindiv.textContent = 0;
  secdiv.textContent = 0;
});

pauseBtn.addEventListener("click", () => {
  if (paused === undefined) {
    return;
  }
  if (paused) {
    paused = false;
    initial = setTimeout("decremenT()", 60);
    pauseBtn.textContent = "Pause";
    pauseBtn.classList.remove("Resume");
  } else {
    clearTimeout(initial);
    pauseBtn.textContent = "Resume";
    pauseBtn.classList.add("Resume");
    paused = true;
  }
});

// Dictionary

function reloadPage() {
  location.reload();
}

function wordSearch() {
  document.getElementById('searchResult').style.visibility = 'visible';


  // Set variables to determine elements
  var word = document.getElementById('word');
  var definition = document.getElementById('definition');
  var example = document.getElementById('example');


  // DOM to determine search value
  var wordToSearch = document.getElementById('searchBox').value;

  var request1 = new XMLHttpRequest();
  request1.open('GET', 'https://api.wordnik.com/v4/word.json/' + wordToSearch + '/definitions?limit=10&includeRelated=false&useCanonical=false&includeTags=false&api_key=knx2dcz3y46a0645g0qqnq7e7o7xkwjnhopg7hs8n72jxz9fx', true);
  request1.onload = function () {
    var data = JSON.parse(this.response);
    if (request1.status >= 200 && request1.status < 400) {
      var i = Math.ceil(Math.random() * 10);      //  get a random number from 1 to 10
      word.innerHTML = data[i].word;      //  get a random definition
      definition.innerHTML = data[i].text;
    } else {
      word.innerHTML = "Error";
      definition.innerHTML = "Error";
    }
  }
  request1.send();

  var request2 = new XMLHttpRequest();
  request2.open('GET', 'https://api.wordnik.com/v4/word.json/' + wordToSearch + '/topExample?useCanonical=false&api_key=knx2dcz3y46a0645g0qqnq7e7o7xkwjnhopg7hs8n72jxz9fx', true);
  request2.onload = function () {
    var data2 = JSON.parse(this.response);
    if (request2.status >= 200 && request2.status < 400) {
      example.innerHTML = data2.text;
    } else {
      example.innerHTML = "Error";
    }
  }
  request2.send();
}