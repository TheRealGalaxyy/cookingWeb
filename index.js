document.addEventListener('DOMContentLoaded', () => {
    const midiRow = document.getElementById('midi');
    const soirRow = document.getElementById('soir');
    const generateWeekButton = document.getElementById('generateWeek');
    const downloadButton = document.getElementById('downloadPdf');

    let allMeals = [];
    let midiMeals = [];
    let soirMeals = [];

    async function fetchMealsFromDatabase() {
        return [
            "Spaghetti Bolognese", "Poulet Curry", "Salade César", "Pizza Margherita", "Sushi",
            "Tacos", "Soupe Pho", "Ratatouille", "Lasagnes", "Burger", "Quiche Lorraine", "Pad Thaï",
            "Couscous", "Chili Con Carne", "Gratin Dauphinois", "Boeuf Bourguignon", "Blanquette de Veau",
            "Ramen", "Choucroute", "Moussaka", "Paëlla", "Risotto aux champignons", "Gnocchis à la crème",
            "Bibimbap", "Gyros", "Fish and Chips", "Steak Frites", "Gratin de courgettes", "Wok de légumes",
            "Soupe à l'oignon", "Croque-Monsieur", "Falafel", "Gaspacho", "Tajine d'agneau", "Kebab",
            "Bouillabaisse", "Ceviche", "Tartiflette", "Hachis Parmentier", "Pâtes au pesto", "Pâtes carbonara",
            "Riz cantonais", "Poulet basquaise", "Canard à l’orange", "Côte de bœuf", "Nuggets maison",
            "Pizza 4 fromages", "Clafoutis salé", "Gratin de pâtes", "Saucisse lentilles", "Gâteau de pommes de terre",
            "Omelette aux fines herbes", "Poke bowl", "Mac and cheese", "Tartare de saumon", "Cordon bleu",
            "Brochettes de poulet", "Chili sin carne", "Galette de sarrasin", "Soupe miso", "Pâtes bolo végétarienne",
            "Tarte à la tomate", "Soupe de potiron", "Curry de légumes", "Poulet rôti", "Gratin d’aubergines",
            "Tartine chèvre-miel", "Pizza orientale", "Salade grecque", "Naan au fromage", "Bruschetta",
            "Lasagnes végétariennes", "Polenta crémeuse", "Goulash", "Enchiladas", "Riz pilaf", "Tarte aux poireaux",
            "Couscous végétarien", "Riz au lait salé", "Frittata", "Soupe de lentilles", "Wok de crevettes",
            "Gratin de chou-fleur", "Poulet au miel", "Sauté de porc au caramel", "Poisson pané maison",
            "Salade de pâtes", "Pizza calzone", "Gratin de patate douce", "Tofu sauce soja", "Curry coco crevettes",
            "Burger végétarien", "Tagliatelles au saumon", "Buddha bowl", "Wraps au poulet", "Gratin savoyard",
            "Pizza aux légumes grillés", "Tian de légumes", "Soupe de pois cassés", "Curry japonais", "Raviolis chinois"
        ];
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
            allMeals = await fetchMealsFromDatabase();
            const shuffledMeals = allMeals.sort(() => 0.5 - Math.random());

            midiMeals = shuffledMeals.slice(0, 7);
            soirMeals = shuffledMeals.slice(7, 14);

            // Clear and reset rows
            midiRow.innerHTML = '<td><b>12:00</b></td>';
            soirRow.innerHTML = '<td><b>19:00</b></td>';

            midiMeals.forEach((meal, index) => {
                midiRow.appendChild(createMealCell(meal, 'midi', index));
            });

            soirMeals.forEach((meal, index) => {
                soirRow.appendChild(createMealCell(meal, 'soir', index));
            });
        } catch (error) {
            console.error("Erreur lors de la génération des repas :", error);
        }
    }

    function replaceSingleMeal(rowType, index, tdElement) {
        const currentMeals = [...midiMeals, ...soirMeals];
        const availableMeals = allMeals.filter(meal => !currentMeals.includes(meal));

        if (availableMeals.length === 0) return;

        const newMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
        tdElement.textContent = newMeal;

        if (rowType === 'midi') {
            midiMeals[index] = newMeal;
        } else {
            soirMeals[index] = newMeal;
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
            tdElement.textContent = '';
            if (rowType === 'midi') {
                midiMeals[index] = '';
            } else {
                soirMeals[index] = '';
            }
            popup.style.display = 'none';
        };
    
        closeBtn.onclick = () => {
            popup.style.display = 'none';
        };
    }

    // Fonction pour obtenir les dates de la semaine actuelle sans librairie externe
    function getCurrentWeekDates() {
        const today = new Date();
        const monday = today.getDate() - today.getDay() + 1; // Lundi de la semaine
        const week = [];
    
        for (let i = 0; i < 7; i++) {
            const day = new Date(today.setDate(monday + i));
            week.push((day.getDate() < 10 ? '0' : '') + day.getDate() + '/' + (day.getMonth() + 1 < 10 ? '0' : '') + (day.getMonth() + 1) + '/' + day.getFullYear());
        }
    
        return week;
    }

    generateWeekButton.addEventListener('click', generateWeekMeals);

    downloadButton.addEventListener('click', () => {
        const element = document.querySelector('table');
        const semaineActuelle = getCurrentWeekDates();
        const filename = "repas_"+semaineActuelle[0]+"-"+semaineActuelle[6]+".pdf";
        const opt = {
            margin:       0.5,
            filename:     filename,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    });
});
