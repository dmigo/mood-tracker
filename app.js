class MoodTracker {
    constructor() {
        this.selectedMood = null;
        this.currentDate = new Date();
        this.swipeStartX = null;
        this.swipeThreshold = 50;
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
        const moodButtons = document.querySelectorAll('.mood-btn');
        const prevDayBtn = document.getElementById('prev-day');
        const nextDayBtn = document.getElementById('next-day');
        const moodEntry = document.querySelector('.mood-entry');

        moodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAndSaveMood(e.target.dataset.mood);
            });
        });

        prevDayBtn.addEventListener('click', () => {
            this.navigateDate(-1);
        });

        nextDayBtn.addEventListener('click', () => {
            this.navigateDate(1);
        });

        // Touch events for swipe
        moodEntry.addEventListener('touchstart', (e) => {
            this.swipeStartX = e.touches[0].clientX;
        });

        moodEntry.addEventListener('touchend', (e) => {
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

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigateDate(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigateDate(1);
            }
        });
    }

    selectAndSaveMood(mood) {
        this.selectedMood = parseInt(mood);
        
        // Update UI
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
        
        // Auto-save immediately
        this.saveMood();
        
        // Update theme
        this.updateTheme();
    }

    selectMood(mood) {
        this.selectedMood = parseInt(mood);
        
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
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
        const isYesterday = this.currentDate.toDateString() === new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString();
        const isTomorrow = this.currentDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
        
        let dateTitle = '';
        if (isToday) {
            dateTitle = 'Today';
        } else if (isYesterday) {
            dateTitle = 'Yesterday';
        } else if (isTomorrow) {
            dateTitle = 'Tomorrow';
        } else {
            const daysDiff = Math.floor((this.currentDate - today) / (24 * 60 * 60 * 1000));
            if (daysDiff > 0) {
                dateTitle = `${daysDiff} days from now`;
            } else {
                dateTitle = `${Math.abs(daysDiff)} days ago`;
            }
        }

        document.getElementById('selected-date').textContent = dateTitle;
        document.getElementById('date-display').textContent = this.currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    saveMood() {
        if (!this.selectedMood) return;

        const selectedDateString = this.currentDate.toDateString();
        const moodData = {
            date: selectedDateString,
            mood: this.selectedMood,
            timestamp: this.currentDate.getTime()
        };

        let moods = this.getMoods();
        
        const existingIndex = moods.findIndex(m => m.date === selectedDateString);
        if (existingIndex >= 0) {
            moods[existingIndex] = moodData;
        } else {
            moods.push(moodData);
        }

        localStorage.setItem('mood-tracker-data', JSON.stringify(moods));
        
        this.loadMoodHistory();
        this.showSuccessMessage();
    }

    getMoods() {
        const stored = localStorage.getItem('mood-tracker-data');
        return stored ? JSON.parse(stored) : [];
    }

    loadMoodHistory() {
        const moods = this.getMoods();
        const moodList = document.getElementById('mood-list');
        
        if (moods.length === 0) {
            moodList.innerHTML = '<p class="no-entries">No mood entries yet. Start by rating your mood above!</p>';
            return;
        }

        const sortedMoods = moods.sort((a, b) => b.timestamp - a.timestamp);
        
        moodList.innerHTML = sortedMoods.map(mood => {
            const date = new Date(mood.timestamp).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
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
        }).join('');
    }

    checkSelectedDateMood() {
        const selectedDateString = this.currentDate.toDateString();
        const moods = this.getMoods();
        const selectedDateMood = moods.find(m => m.date === selectedDateString);
        
        if (selectedDateMood) {
            this.selectMood(selectedDateMood.mood);
        }
    }

    resetMoodSelection() {
        this.selectedMood = null;
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    getMoodEmoji(mood) {
        const emojis = ['🌧️', '☁️', '⛅', '🌤️', '☀️'];
        return emojis[mood - 1];
    }

    getMoodLabel(mood) {
        const labels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
        return labels[mood - 1];
    }

    showSuccessMessage() {
        // Create a temporary success indicator
        const moodScale = document.querySelector('.mood-scale');
        const successMsg = document.createElement('div');
        successMsg.textContent = '✓ Saved!';
        successMsg.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: #10B981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        moodScale.style.position = 'relative';
        moodScale.appendChild(successMsg);
        
        // Animate in
        setTimeout(() => successMsg.style.opacity = '1', 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            successMsg.style.opacity = '0';
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.parentNode.removeChild(successMsg);
                }
            }, 300);
        }, 1500);
    }

    updateTheme() {
        const selectedDateString = this.currentDate.toDateString();
        const moods = this.getMoods();
        const selectedDateMood = moods.find(m => m.date === selectedDateString);
        
        let moodColor;
        if (selectedDateMood && selectedDateMood.mood) {
            // Use the mood color from the saved mood
            moodColor = `var(--mood-${selectedDateMood.mood})`;
        } else if (this.selectedMood) {
            // Use the currently selected mood color
            moodColor = `var(--mood-${this.selectedMood})`;
        } else {
            // No mood selected, use neutral color
            moodColor = 'var(--mood-unselected)';
        }
        
        document.documentElement.style.setProperty('--current-mood-color', moodColor);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MoodTracker();
});