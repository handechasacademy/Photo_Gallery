//navigation pop animations
const currentFile = window.location.pathname.split("/").pop();

const navLinks = document.querySelectorAll('.navigation a');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    if (linkHref === currentFile || (currentFile === "" && linkHref === "index.html")) {
        link.classList.add('active');
    }
});