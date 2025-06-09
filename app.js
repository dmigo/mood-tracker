class MoodTracker {
  constructor() {
    this.selectedMood = null;
    this.currentDate = new Date();
    this.swipeStartX = null;
    this.swipeThreshold = 50;
    this.currentView = "mood";
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateDateDisplay();
    this.loadMoodHistory();
    this.checkSelectedDateMood();
    this.updateTheme();
  }

  bindEvents() {
    const moodButtons = document.querySelectorAll(".mood-btn");
    const prevDayBtn = document.getElementById("prev-day");
    const nextDayBtn = document.getElementById("next-day");
    const moodEntry = document.querySelector(".mood-entry");
    const moodViewBtn = document.getElementById("mood-view-btn");
    const historyViewBtn = document.getElementById("history-view-btn");

    moodButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.selectAndSaveMood(e.target.dataset.mood);
      });
    });

    prevDayBtn.addEventListener("click", () => {
      this.navigateDate(-1);
    });

    nextDayBtn.addEventListener("click", () => {
      this.navigateDate(1);
    });

    // Touch events for swipe
    moodEntry.addEventListener("touchstart", (e) => {
      this.swipeStartX = e.touches[0].clientX;
    });

    moodEntry.addEventListener("touchend", (e) => {
      if (this.swipeStartX === null) return;

      const swipeEndX = e.changedTouches[0].clientX;
      const swipeDistance = this.swipeStartX - swipeEndX;

      if (Math.abs(swipeDistance) > this.swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe left = next day
          this.navigateDate(1);
        } else {
          // Swipe right = previous day
          this.navigateDate(-1);
        }
      }

      this.swipeStartX = null;
    });

    // View navigation
    moodViewBtn.addEventListener("click", () => {
      this.switchView("mood");
    });

    historyViewBtn.addEventListener("click", () => {
      this.switchView("history");
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (this.currentView === "mood") {
        if (e.key === "ArrowLeft") {
          this.navigateDate(-1);
        } else if (e.key === "ArrowRight") {
          this.navigateDate(1);
        }
      }
    });
  }

  selectAndSaveMood(mood) {
    this.selectedMood = parseInt(mood);

    // Update UI
    document.querySelectorAll(".mood-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    document.querySelector(`[data-mood="${mood}"]`).classList.add("selected");

    // Auto-save immediately
    this.saveMood();

    // Update theme
    this.updateTheme();
  }

  selectMood(mood) {
    this.selectedMood = parseInt(mood);

    document.querySelectorAll(".mood-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    document.querySelector(`[data-mood="${mood}"]`).classList.add("selected");
  }

  navigateDate(direction) {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + direction);
    this.currentDate = newDate;
    this.updateDateDisplay();
    this.resetMoodSelection();
    this.checkSelectedDateMood();
    this.updateTheme();
  }

  updateDateDisplay() {
    const today = new Date();
    const isToday = this.currentDate.toDateString() === today.toDateString();
    const isYesterday =
      this.currentDate.toDateString() ===
      new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString();
    const isTomorrow =
      this.currentDate.toDateString() ===
      new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();

    let dateTitle = "";
    if (isToday) {
      dateTitle = "Today";
    } else if (isYesterday) {
      dateTitle = "Yesterday";
    } else if (isTomorrow) {
      dateTitle = "Tomorrow";
    } else {
      const daysDiff = (this.currentDate - today) / (24 * 60 * 60 * 1000);
      if (daysDiff > 0) {
        const daysFromNow = Math.ceil(daysDiff);
        dateTitle = `${daysFromNow} days from now`;
      } else {
        const daysAgo = Math.floor(Math.abs(daysDiff));
        dateTitle = `${daysAgo} days ago`;
      }
    }

    document.getElementById("selected-date").textContent = dateTitle;
    document.getElementById("date-display").textContent =
      this.currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }

  saveMood() {
    if (!this.selectedMood) return;

    const selectedDateString = this.currentDate.toDateString();
    const moodData = {
      date: selectedDateString,
      mood: this.selectedMood,
      timestamp: this.currentDate.getTime(),
    };

    let moods = this.getMoods();

    const existingIndex = moods.findIndex((m) => m.date === selectedDateString);
    if (existingIndex >= 0) {
      moods[existingIndex] = moodData;
    } else {
      moods.push(moodData);
    }

    localStorage.setItem("mood-tracker-data", JSON.stringify(moods));

    this.loadMoodHistory();
    this.showSaveIndicator();
  }

  getMoods() {
    const stored = localStorage.getItem("mood-tracker-data");
    return stored ? JSON.parse(stored) : [];
  }

  loadMoodHistory() {
    const moods = this.getMoods();
    const moodList = document.getElementById("mood-list");

    if (moods.length === 0) {
      moodList.innerHTML =
        '<p class="no-entries">No mood entries yet. Start by rating your mood above!</p>';
      return;
    }

    const sortedMoods = moods.sort((a, b) => b.timestamp - a.timestamp);

    moodList.innerHTML = sortedMoods
      .map((mood) => {
        const date = new Date(mood.timestamp).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return `
                <div class="mood-entry-item">
                    <span class="mood-entry-date">${date}</span>
                    <div class="mood-entry-value">
                        <span>${this.getMoodEmoji(mood.mood)}</span>
                        <span>${this.getMoodLabel(mood.mood)}</span>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  checkSelectedDateMood() {
    const selectedDateString = this.currentDate.toDateString();
    const moods = this.getMoods();
    const selectedDateMood = moods.find((m) => m.date === selectedDateString);

    if (selectedDateMood) {
      this.selectMood(selectedDateMood.mood);
    }
  }

  resetMoodSelection() {
    this.selectedMood = null;
    document.querySelectorAll(".mood-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });
  }

  getMoodEmoji(mood) {
    const emojis = ["🌧️", "☁️", "⛅", "🌤️", "☀️"];
    return emojis[mood - 1];
  }

  getMoodLabel(mood) {
    const labels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];
    return labels[mood - 1];
  }

  showSaveIndicator() {
    const saveIndicator = document.getElementById("save-indicator");

    // Show loading state
    saveIndicator.className = "save-indicator visible loading";

    // After short delay, show saved state
    setTimeout(() => {
      saveIndicator.className = "save-indicator visible saved";

      // Hide after 2 seconds
      setTimeout(() => {
        saveIndicator.className = "save-indicator hidden";
      }, 2000);
    }, 300);
  }

  updateTheme() {
    const selectedDateString = this.currentDate.toDateString();
    const moods = this.getMoods();
    const selectedDateMood = moods.find((m) => m.date === selectedDateString);

    let moodColor;
    let moodValue;
    if (selectedDateMood && selectedDateMood.mood) {
      // Use the mood color from the saved mood
      moodColor = `var(--mood-${selectedDateMood.mood})`;
      moodValue = selectedDateMood.mood;
    } else if (this.selectedMood) {
      // Use the currently selected mood color
      moodColor = `var(--mood-${this.selectedMood})`;
      moodValue = this.selectedMood;
    } else {
      // No mood selected, use neutral color
      moodColor = "var(--mood-unselected)";
      moodValue = 3; // Default to neutral
    }

    document.documentElement.style.setProperty(
      "--current-mood-color",
      moodColor
    );

    // Update large weather icon
    const weatherIcon = document.getElementById("weather-bg-icon");
    if (weatherIcon) {
      if (selectedDateMood && selectedDateMood.mood) {
        // Show icon for saved mood
        weatherIcon.textContent = this.getMoodEmoji(moodValue);
        weatherIcon.style.display = "block";
      } else if (this.selectedMood) {
        // Show icon for currently selected mood
        weatherIcon.textContent = this.getMoodEmoji(moodValue);
        weatherIcon.style.display = "block";
      } else {
        // Hide icon when no mood is selected
        weatherIcon.style.display = "none";
      }
    }
  }

  switchView(view) {
    this.currentView = view;

    // Update view buttons
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    if (view === "mood") {
      document.getElementById("mood-view-btn").classList.add("active");
      document.getElementById("mood-view").classList.add("active");
      document.getElementById("history-view").classList.remove("active");
    } else if (view === "history") {
      document.getElementById("history-view-btn").classList.add("active");
      document.getElementById("history-view").classList.add("active");
      document.getElementById("mood-view").classList.remove("active");
      this.loadMoodHistory(); // Refresh history when switching to it
    }

    // Update theme based on current view
    if (view === "history") {
      // In history view, show neutral theme
      document.documentElement.style.setProperty(
        "--current-mood-color",
        "var(--mood-unselected)"
      );
      // Hide bottom navigation in history view
      document.querySelector(".bottom-navigation").style.display = "none";
      // Hide weather icon in history view
      document.getElementById("weather-bg-icon").style.display = "none";
    } else {
      // In mood view, show theme based on selected date
      this.updateTheme();
      // Show bottom navigation in mood view
      document.querySelector(".bottom-navigation").style.display = "block";
      // Show weather icon in mood view
      document.getElementById("weather-bg-icon").style.display = "block";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MoodTracker();
});
