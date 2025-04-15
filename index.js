document.addEventListener('DOMContentLoaded', () => {
    const midiRow = document.getElementById('midi');
    const soirRow = document.getElementById('soir');
    const generateWeekButton = document.getElementById('generateWeek');

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
            replaceSingleMeal(rowType, index, td);
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

    generateWeekButton.addEventListener('click', generateWeekMeals);
});
