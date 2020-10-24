(function() {
  var time = $(".time");
  var add = $(".add");
  var sub = $(".subtract");
  var playPause = $(".play-pause");
  var reset = $(".reset");
  var state = $(".state");
  var sound = $("#sound")[0];
  var adjustVal = 1;
  var defaultSessionTime = 25;
  var defaultBreakTime = 5;
  var min = defaultSessionTime;
  var sec = 59;
  var timerOn = false;
  var timerInterval;
  var progress = 0;
  var progressInterval;
  var switchState = true;
  var sessionCountEl = $(".session-count");
  var sessionCount = 0;
  time.text(defaultSessionTime);

  //event handlers
  add.on("click", addToTime);
  sub.on("click", subtractFromTime);
  playPause.on("click", playPauseTimer);
  reset.on("click", resetTime);
  reset.on("dblclick", hardResetTime);
  $(document).on("keydown", keybindings);

  //functions
  function keybindings(e) {
    if (e.which === 107) {
      addToTime();
    } else if (e.which === 109) {
      subtractFromTime();
    } else if (e.which === 32) {
      playPauseTimer();
    } else if (e.which === 8) {
      hardResetTime();
    }
  }
  function regulateTimer() {
    timerInterval = setInterval(function() {
      if (min === 0 && sec === 0) {
        timeIsUp();
      } else {
        if (sec === 0) {
          sec = 59;
        }
        if (sec === 59) {
          min--;
        }
        if (sec < 10) {
          if (min < 10) {
            time.html("0" + min + ":0" + sec--);
          } else {
            time.html(min + ":0" + sec--);
          }
        } else {
          if (min < 10) {
            if (sec < 10) {
              time.html("0" + min + ":0" + sec--);
            } else {
              time.html("0" + min + ":" + sec--);
            }
          } else {
            time.html(min + ":" + sec--);
          }
        }
      }
    }, 1000);
  } // end of regulateTimer

  function measureProgress() {
    var progressIncrement = 100 / ((min === 0 ? 1 : min) * 60);
    progressInterval = setInterval(function() {
      $(".progress-bar").width(progress + "%");
      progress += progressIncrement;

    }, 1000);
  } // end of measureProgress

  function pauseTimer() {
    clearInterval(timerInterval);
    clearInterval(progressInterval);
  } // end of  pauseTimer

  function playPauseTimer() {
    timerOn = !timerOn;
    if (timerOn) {
      regulateTimer();
      measureProgress();
      playPause.html('<i class="icon-control-pause"></i>');
      $(".add, .subtract, .reset").hide();
    } else {
      pauseTimer();
      playPause.html('<i class="icon-control-play"></i>');
      $(".reset").show();
    }
  } // end of playPauseTimer

  function addToTime() {
    if (min < 60) {
      time.html(min + adjustVal);
      min++;
    }
  } // end of addTTime

  function subtractFromTime() {
    if (min > 1) {
      time.html(min - adjustVal);
      min--;
    }
  } // end of subtractFromTime

  function resetTime() {
    $(".add, .subtract").show();
    progress = 0;
    if (switchState) {
      min = defaultBreakTime; // default break time
      state.html("break time");
      updateSessionCount(); // updating the session count
    } else {
      state.html("session time");
      min = defaultSessionTime; // default session time
    }
    sec = 59;
    time.html(min);
    switchState = !switchState;
    setTimeout(function() {
      $(".progress-bar").width(progress);
    }, 1000);
  } // end of resetTime

  function hardResetTime() {
    $(".add, .subtract").show();
    progress = 0;
    min = defaultSessionTime;
    sec = 59;
    switchState = true;
    sessionCount = 0;
    state.html("session time");
    sessionCountEl.html("Pomodoro Timer");
    time.html(min);
    setTimeout(function() {
      $(".progress-bar").width(progress);
    }, 1000);
  } // end of hardResetTime

  function updateSessionCount() {
    sessionCount++;
    sessionCountEl.html("# of Sessions: " + sessionCount);
  } // end of updateSessionCount

  function playSound() {
    sound.play();
  } // end of timeIsUp

  function timeIsUp() {
  	playSound();
    $(".progress-bar").width(100 + "%");
    clearInterval(timerInterval);
    playPauseTimer();
    resetTime();
  } // end of timeIsUp
})(); // end of app
