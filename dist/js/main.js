const timeTracker = document.querySelector('.time-tracker');

const dailyButton = document.querySelector('.daily-button');
const weeklyButton = document.querySelector('.weekly-button');
const monthlyButton = document.querySelector('.monthly-button');
const allButtons = document.querySelectorAll('.info-section__title--main');

let sectionTitles = document.querySelectorAll('.info-section__title');
let currentTimes = document.querySelectorAll('.info-section__time');
let previousTimes = document.querySelectorAll('.info-section__previous');

currentTimes = Array.from(currentTimes);
previousTimes = Array.from(previousTimes);
sectionTitles = Array.from(sectionTitles);

const getTimes = async () => {
    const response = await fetch('data.json');
    const data = await response.json();

    return data;
};

const getCurrentTime = (section) => {
    section = section.split(' ').join('-');

    const current = currentTimes.filter(time => time.classList.contains(`${section}`));

    return current[0];
}; 

const getPreviousTime = (section) => {
    section = section.split(' ').join('-');
    
    const previous = previousTimes.filter(time => time.classList.contains(`${section}`));
   
    return previous[0];
};

const setTimes = (sectionName, newCurrentTime, newPreviousTime, timeframe) => {
    const currentTime = getCurrentTime(`${sectionName.toLowerCase()}`);
    const previousTime = getPreviousTime(`${sectionName.toLowerCase()}`);

    sectionTitles.forEach(sectionTitle => {
        if (sectionTitle.textContent.includes(`${sectionName}`)) {
            currentTime.textContent = `${newCurrentTime}hrs`;

            if (timeframe != 'Yesterday') 
                previousTime.textContent = `Last ${timeframe} - ${newPreviousTime}hrs`;
            else
                previousTime.textContent = `${timeframe} - ${newPreviousTime}hrs`;
        }
    });

    return currentTime;
};

const updateUI = (timeframe) => {
    getTimes()
        .then(data => {
            data.forEach(section => {
                if (timeframe === 'daily') 
                    setTimes(section.title, 
                        section.timeframes.daily.current, 
                        section.timeframes.daily.previous,
                        'Yesterday'
                    );
                else if (timeframe === 'weekly') 
                    setTimes(section.title, 
                        section.timeframes.weekly.current, 
                        section.timeframes.weekly.previous,
                        'week'
                    );
                else
                    setTimes(section.title, 
                        section.timeframes.monthly.current, 
                        section.timeframes.monthly.previous,
                        'month'
                    );
            });
        })
        .catch(err => console.log(err));
};

const setActive = button => {
    allButtons.forEach(btn => {
        btn.classList.remove('active-button');
    });
    
    button.classList.add('active-button');
}

dailyButton.onclick = function() {
    setActive(dailyButton);
    updateUI('daily');
}

weeklyButton.onclick = function() {
    setActive(weeklyButton);
    updateUI('weekly');
}

monthlyButton.onclick = function() {
    setActive(monthlyButton);
    updateUI('monthly');
}