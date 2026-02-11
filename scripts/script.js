//navigation pop animations
const currentFile = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('.navigation a');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    if (linkHref === currentFile || (currentFile === "" && linkHref === "index.html")) {
        link.classList.add('active');
    }
});


//search function
const searchInput = document.querySelector('.navigation input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.galleryImage');

        cards.forEach(card => {
            const altText = card.querySelector('img').alt.toLowerCase();
            if (altText.includes(term)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}

//to show images

function showFullImage(fullPath) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('fullImage');
    
    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = fullPath;
    }
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('imageModal');
    if (e.target.classList.contains('close') || e.target === modal) {
        modal.style.display = "none";
    }
});

//press esc to close the pic 
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('imageModal');
        if (modal && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    }
});


async function loadImages() {
    try {
        const response = await fetch('../images.json'); 
        const images = await response.json();
        const gallery = document.getElementById('gallery');
        
        if (!gallery) return;
        gallery.innerHTML = '';
    
        const pathParts = window.location.pathname.split("/");
        const currentPage = pathParts.pop().split(".")[0].toLowerCase();
        
        images.forEach(img => {
            const categoryLower = img.category.toLowerCase();

            if (categoryLower === currentPage || currentPage === "homepage") {
                
                const div = document.createElement('div');
                div.className = 'galleryImage';

                const imageElement = document.createElement('img');
                
                imageElement.src = `../${img.thumb}`; 
                imageElement.alt = img.tags.join(', ');
                imageElement.loading = "lazy";

                imageElement.addEventListener('click', () => {
                    showFullImage(`../${img.full}`);
                });

                div.appendChild(imageElement);
                gallery.appendChild(div);
            }
        });
    } catch (error) {
        console.error("Path Error: script can't find images.json at ../images.json", error);
    }
}

loadImages();

