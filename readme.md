# HANDE'S PHOTO GALLERY 

![Jest Tests CI](https://github.com/handechasacademy/Photo_Gallery/actions/workflows/ci.yml/badge.svg) [![codecov](https://codecov.io/gh/handechasacademy/Photo_Gallery/graph/badge.svg?token=4ZOTNMOH8S)](https://codecov.io/gh/handechasacademy/Photo_Gallery)

Welcome to the my gallery. It’s clean, it’s functional, and it actually works(somehow). I built this to showcase images of animals, mushrooms, space, and nature as a school assignment.

## Key Features

* **Dynamic Content**: Uses JavaScript to fetch image metadata from a JSON file and render gallery items.
* **Category Filtering**: Automatically filters images based on the current page or user search terms.
* **Interactive Modal**: View high-resolution versions of images in a focused modal window.
* **CI/CD Integration**: Integrated with GitHub Actions to run automated tests (Jest) on every push, ensuring code stability before deployment.

## Project Structure

I moved away from my "flat and messy" look to a more professional architecture:
* `src/`: The "Brain" (Scripts, CSS, and data).
* `public/`: The "Face" (HTML and high-res assets).
* `tests/`: The "Guard Dog" (Ensuring everything stays at 100%).

## Getting Started 

1. **Clone the repository.**
2. **Install dependencies**: Run `npm install` to set up the testing environment.
3. **Run Tests**: Execute `npm test` to verify the logic and view code coverage.
4. **View the Gallery**: Open `index.html` in the root directory to launch the application.
---
*This project is not cruelty free because it tests on animals(me).*
