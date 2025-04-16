document.addEventListener('DOMContentLoaded', () => {
    const midiRow = document.getElementById('midi');
    const soirRow = document.getElementById('soir');
    const title = document.getElementById('title');
    const generateWeekButton = document.getElementById('generateWeek');
    const downloadButton = document.getElementById('downloadPdf');

    let allMeals = [];
    let midiMeals = [];
    let soirMeals = [];

    async function initializeMeals() {
        allMeals = await fetchMealsFromDatabase();
        loadMealsFromLocalStorage();
    }

    async function fetchMealsFromDatabase() {
        return [
            "Pâtes Bolognese", "Poulet Curry", "Pizza Margherita",
            "Tacos", "Ratatouille", "Lasagnes", "Burger", "Quiche Lorraine",
            "Couscous", "Chili Con Carne", "Gratin Dauphinois", "Boeuf Bourguignon", "Blanquette de Veau",
            "Gnocchis", "Steak Frites", "Tartiflette", "Hachis Parmentier", "Pâtes carbonara",
            "Riz cantonais", "Nuggets de poulet", "Gratin de pâtes", "Saucisse lentilles",
            "Mac and cheese", "Cordon bleu", "Barbecue", "Poulet rôti", "Polenta", "Riz pilaf",
            "Soupe de lentilles", "Wraps au poulet", "Ramen", "Pâtes Steak", "Riz Steak", "Patate Steak", "Raclette",
            "Barbecue"
        ];
    }

    function updateLocalStorage() {
        localStorage.setItem('midiMeals', JSON.stringify(midiMeals));
        localStorage.setItem('soirMeals', JSON.stringify(soirMeals));
    }

    function loadMealsFromLocalStorage() {
        const storedMidiMeals = localStorage.getItem('midiMeals');
        const storedSoirMeals = localStorage.getItem('soirMeals');

        midiMeals = storedMidiMeals ? JSON.parse(storedMidiMeals) : Array(7).fill('--');
        soirMeals = storedSoirMeals ? JSON.parse(storedSoirMeals) : Array(7).fill('--');

        updateMealsDisplay();
    }

    function updateMealsDisplay() {
        midiRow.innerHTML = '<td><b>12:00</b></td>';
        soirRow.innerHTML = '<td><b>19:00</b></td>';

        midiMeals.forEach((meal, index) => {
            midiRow.appendChild(createMealCell(meal, 'midi', index));
        });

        soirMeals.forEach((meal, index) => {
            soirRow.appendChild(createMealCell(meal, 'soir', index));
        });
    }

    function createMealCell(meal, rowType, index) {
        const td = document.createElement('td');
        td.textContent = meal;
        td.style.cursor = 'pointer';
        td.title = 'Clique pour changer ce plat';

        td.addEventListener('click', () => {
            showPopup(rowType, index, td);
        });

        return td;
    }

    async function generateWeekMeals() {
        try {
            const shuffledMeals = [...allMeals].sort(() => 0.5 - Math.random());

            midiMeals = shuffledMeals.slice(0, 7);
            soirMeals = shuffledMeals.slice(7, 14);

            updateMealsDisplay();
            updateLocalStorage();
        } catch (error) {
            console.error("Erreur lors de la génération des repas :", error);
        }
    }

    function showPopup(rowType, index, tdElement) {
        const popup = document.getElementById('popup');
        popup.style.display = 'flex';

        const changeBtn = document.getElementById('changeMeal');
        const removeBtn = document.getElementById('removeMeal');
        const closeBtn = document.getElementById('closePopup');

        changeBtn.onclick = () => {
            replaceSingleMeal(rowType, index, tdElement);
            popup.style.display = 'none';
        };

        removeBtn.onclick = () => {
            removeMeal(rowType, index, tdElement);
            popup.style.display = 'none';
        };

        closeBtn.onclick = () => {
            popup.style.display = 'none';
        };
    }

    function replaceSingleMeal(rowType, index, tdElement) {
        const newMeal = allMeals[Math.floor(Math.random() * allMeals.length)];
        tdElement.textContent = newMeal;

        if (rowType === 'midi') {
            midiMeals[index] = newMeal;
        } else {
            soirMeals[index] = newMeal;
        }

        updateLocalStorage();
    }

    function removeMeal(rowType, index, tdElement) {
        tdElement.textContent = '--';

        if (rowType === 'midi') {
            midiMeals[index] = '--';
        } else {
            soirMeals[index] = '--';
        }

        updateLocalStorage();
    }

    function getCurrentWeekDates() {
        const today = new Date();
        const monday = today.getDate() - today.getDay() + 1;
        const week = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(today.getFullYear(), today.getMonth(), monday + i);
            week.push((day.getDate() < 10 ? '0' : '') + day.getDate() + '/' + 
                      (day.getMonth() + 1 < 10 ? '0' : '') + (day.getMonth() + 1) + '/' + 
                      day.getFullYear());
        }

        return week;
    }

    // Initialisation
    const semaineActuelle = getCurrentWeekDates();
    title.textContent = "Menu de la semaine du " + semaineActuelle[0] + " au " + semaineActuelle[6];

    // Charger les données
    initializeMeals();

    // Événements
    generateWeekButton.addEventListener('click', generateWeekMeals);

    downloadButton.addEventListener('click', () => {
        const element = document.getElementById('pdfContent');
        const filename = "repas_" + semaineActuelle[0] + "-" + semaineActuelle[6] + ".pdf";
        const opt = {
            margin: 0.5,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    });
});