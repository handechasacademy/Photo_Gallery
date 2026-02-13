// functions

// Get current page from URL
function getCurrentPage(pathname = window.location.pathname) {
    const parts = pathname.split("/");
    const file = parts.pop();
    if (!file || file === "") return "homepage";
    return file.split(".")[0].toLowerCase();
}

// Filter images based on search term
function filterImages(images, term) {
    return images.filter(img =>
        img.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
    );
}

// Show full image in modal
function showFullImage(modal, modalImg, fullPath) {
    if (!modal || !modalImg) return;
    modal.style.display = "flex";
    modalImg.src = fullPath;
}

// Load images dynamically
async function loadImages(gallery, modal, modalImg) {
    if (!gallery) return;
    try {
        const response = await fetch('../../src/images.json');
        const images = await response.json();
        const currentPage = getCurrentPage();

        gallery.innerHTML = '';

        images.forEach(img => {
            const categoryLower = img.category.toLowerCase();
            if (categoryLower === currentPage || currentPage === "homepage") {
                const div = document.createElement('div');
                div.className = 'galleryImage';

                const imageElement = document.createElement('img');
                imageElement.src = `../../public/${img.thumb}`;
                imageElement.alt = img.tags.join(', ');
                imageElement.loading = 'lazy';

                imageElement.addEventListener('click', () =>
                    showFullImage(modal, modalImg, `../../public/${img.full}`) // No semicolon here
                );

                div.appendChild(imageElement);
                gallery.appendChild(div);
            }
        });
    } catch (err) {
        console.error("Could not load images.json", err);
    }
}

// Attach search input to filter gallery
function attachSearch(input, gallery) {
    if (!input || !gallery) return;
    input.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        const cards = gallery.querySelectorAll('.galleryImage');
        cards.forEach(card => {
            const altText = card.querySelector('img').alt.toLowerCase();
            card.style.display = altText.includes(term) ? "block" : "none";
        });
    });
}

// event listeners

document.addEventListener('click', e => {
    const modal = document.getElementById('imageModal');
    if (e.target.classList.contains('close') || e.target === modal) {
        modal.style.display = "none";
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('imageModal');
        if (modal && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    }
});

document.addEventListener('keydown', e => {
    if (modal.style.display === 'flex') {
        if (e.key === 'ArrowRight') loadNextImage();
        if (e.key === 'ArrowLeft') loadPreviousImage();
    }
});

// initialization

const gallery = document.getElementById('gallery');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('fullImage');
const searchInput = document.querySelector('.navigation input');

if (searchInput) attachSearch(searchInput, gallery);
loadImages(gallery, modal, modalImg);

// exports for jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentPage,
        filterImages,
        showFullImage,
        loadImages,
        attachSearch
    };
}
