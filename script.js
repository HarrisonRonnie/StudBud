// Smooth scrolling function
// Code from: 


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
// code from: 

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

  handleClickStart() {
    if (this.state.startTimestamp) {
      // Prevent multi clicks on start
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
