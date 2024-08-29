// Función para cargar el JSON
async function loadData() {
    try {
        const response = await fetch('data/api.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("No se pudo cargar el archivo JSON:", error);
    }
}

// Función para crear el carrusel
function createCarousel(data) {
    const carouselInner = document.querySelector('.carousel-inner');
    data.banner.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = "Banner de promoción";
        carouselInner.appendChild(img);
    });
}

function showCategories(data) {
    const categoriesContainer = document.querySelector('.categories');
    data.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `
            <img src="${category.image}" alt="${category.name}" class="category-image">
            <div class="category-content">
                <h3>${category.name}</h3>
                <span>${category.id}</span>
            </div>
        `;
        
        // Añadir efecto hover
        categoryDiv.addEventListener('mouseenter', () => {
            categoryDiv.style.backgroundColor = category.color;
            categoryDiv.querySelector('.category-content').style.backgroundColor = `${category.color}CC`;
        });
        
        categoryDiv.addEventListener('mouseleave', () => {
            categoryDiv.style.backgroundColor = '';
            categoryDiv.querySelector('.category-content').style.backgroundColor = 'rgba(255,255,255,0.8)';
            categoryDiv.querySelector('h3').style.color = '';
        });
        
        // Añadir funcionalidad de clic
        categoryDiv.addEventListener('click', () => {
            const sectionId = `category-${category.id}`;
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        categoriesContainer.appendChild(categoryDiv);
    });
}

function showFoodItems(data) {
    const foodContainer = document.querySelector('.food-items');
    foodContainer.innerHTML = '';

    const foodByCategory = data.food.reduce((acc, item) => {
        if (!acc[item.categorie]) {
            acc[item.categorie] = [];
        }
        acc[item.categorie].push(item);
        return acc;
    }, {});

    data.categories.forEach(category => {
        const categoryFoods = foodByCategory[category.id];
        if (categoryFoods && categoryFoods.length > 0) {
            const categorySection = document.createElement('div');
            categorySection.className = 'food-category';
            categorySection.innerHTML = `<h2 class="category-title">${category.name}</h2>`;
            categorySection.id = `category-${category.id}`;

            const foodItemsContainer = document.createElement('div');
            foodItemsContainer.className = 'food-items';

            categoryFoods.forEach(item => {
                const foodDiv = document.createElement('div');
                foodDiv.className = 'food-item';
                foodDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="food-item-content">
                <h3>${item.name}</h3>
                <p>Precio: $${item.price}</p>
            </div>
        `;
                foodItemsContainer.appendChild(foodDiv);
            });

            categorySection.appendChild(foodItemsContainer);
            foodContainer.appendChild(categorySection);
        }
    });
}

function initCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-inner img');
    const totalSlides = slides.length;

    function showSlide(index) {
        const offset = -index * 100;
        document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    document.querySelector('.carousel-next').addEventListener('click', nextSlide);
    document.querySelector('.carousel-prev').addEventListener('click', prevSlide);

    showSlide(currentSlide);

    // Auto-play del carrusel
    setInterval(nextSlide, 5000);
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadData();
    if (data) {
        createCarousel(data);
        showCategories(data);
        showFoodItems(data);
        initCarousel();
    }
});