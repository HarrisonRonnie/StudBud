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
