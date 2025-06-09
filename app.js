class MoodTracker {
    constructor() {
        this.selectedMood = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMoodHistory();
        this.checkTodaysMood();
    }

    bindEvents() {
        const moodButtons = document.querySelectorAll('.mood-btn');
        const saveButton = document.getElementById('save-mood');

        moodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMood(e.target.dataset.mood);
            });
        });

        saveButton.addEventListener('click', () => {
            this.saveMood();
        });
    }

    selectMood(mood) {
        this.selectedMood = parseInt(mood);
        
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
        document.getElementById('save-mood').disabled = false;
    }

    saveMood() {
        if (!this.selectedMood) return;

        const today = new Date().toDateString();
        const moodData = {
            date: today,
            mood: this.selectedMood,
            timestamp: Date.now()
        };

        let moods = this.getMoods();
        
        const existingIndex = moods.findIndex(m => m.date === today);
        if (existingIndex >= 0) {
            moods[existingIndex] = moodData;
        } else {
            moods.push(moodData);
        }

        localStorage.setItem('mood-tracker-data', JSON.stringify(moods));
        
        this.loadMoodHistory();
        this.resetMoodSelection();
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

    checkTodaysMood() {
        const today = new Date().toDateString();
        const moods = this.getMoods();
        const todaysMood = moods.find(m => m.date === today);
        
        if (todaysMood) {
            this.selectMood(todaysMood.mood);
            document.getElementById('save-mood').textContent = 'Update Today\'s Mood';
        }
    }

    resetMoodSelection() {
        this.selectedMood = null;
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('save-mood').disabled = true;
        document.getElementById('save-mood').textContent = 'Save Today\'s Mood';
    }

    getMoodEmoji(mood) {
        const emojis = ['😢', '😔', '😐', '😊', '😄'];
        return emojis[mood - 1];
    }

    getMoodLabel(mood) {
        const labels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
        return labels[mood - 1];
    }

    showSuccessMessage() {
        const saveBtn = document.getElementById('save-mood');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Saved!';
        saveBtn.style.background = '#10B981';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MoodTracker();
});