/**
 * @jest-environment jsdom
 */

const { getCurrentPage, filterImages, showFullImage, loadImages, attachSearch } = require('../src/scripts/script.js');


describe('Gallery Script - Logic Functions', () => {

    describe('getCurrentPage', () => {
        test('returns "homepage" for empty path', () => {
            expect(getCurrentPage('')).toBe('homepage');
        });

        test('returns correct page name for path', () => {
            expect(getCurrentPage('/folder/gallery.html')).toBe('gallery');
            expect(getCurrentPage('/index.html')).toBe('index');
        });

        test('handles paths without extensions', () => {
            expect(getCurrentPage('/folder/page')).toBe('page');
        });
    });

    describe('filterImages', () => {
        const mockImages = [
            { tags: ['cat', 'cute'] },
            { tags: ['dog', 'friendly'] },
            { tags: ['bird'] }
        ];

        test('returns images matching term', () => {
            const result = filterImages(mockImages, 'cat');
            expect(result.length).toBe(1);
            expect(result[0].tags).toContain('cat');
        });

        test('is case-insensitive', () => {
            const result = filterImages(mockImages, 'DOG');
            expect(result.length).toBe(1);
            expect(result[0].tags).toContain('dog');
        });

        test('returns empty array if no matches', () => {
            const result = filterImages(mockImages, 'lion');
            expect(result.length).toBe(0);
        });
    });
});

describe('Gallery UI Functions', () => {
    let modal, modalImg, gallery, searchInput;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="gallery"></div>
            <div id="imageModal">
                <img id="fullImage" />
                <button class="close">Close</button>
            </div>
            <nav class="navigation">
                <input />
            </nav>
        `;

        modal = document.getElementById('imageModal');
        modalImg = document.getElementById('fullImage');
        gallery = document.getElementById('gallery');
        searchInput = document.querySelector('.navigation input');
        modal.style.display = 'none';
    });

    test('showFullImage sets modal display and src', () => {
        showFullImage(modal, modalImg, 'path/to/image.jpg');
        expect(modal.style.display).toBe('flex');
        expect(modalImg.src).toContain('path/to/image.jpg');
    });

    test('attachSearch filters gallery items based on input', () => {
        gallery.innerHTML = `
            <div class="galleryImage"><img alt="cat" /></div>
            <div class="galleryImage"><img alt="dog" /></div>
        `;

        attachSearch(searchInput, gallery);

        searchInput.value = 'cat';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));

        const cards = gallery.querySelectorAll('.galleryImage');
        expect(cards[0].style.display).toBe('block');
        expect(cards[1].style.display).toBe('none');
    });

    test('loadImages fetches and populates gallery', async () => {
        const mockImages = [
            { category: 'homepage', thumb: 'thumb1.jpg', full: 'full1.jpg', tags: ['cat'] }
        ];

        global.fetch = jest.fn(() =>
            Promise.resolve({ json: () => Promise.resolve(mockImages) })
        );

        await loadImages(gallery, modal, modalImg);

        const imgs = gallery.querySelectorAll('img');
        expect(imgs.length).toBe(1);
        expect(imgs[0].src).toContain('thumb1.jpg');

        global.fetch.mockRestore();
    });

    test('clicking a dynamically loaded thumbnail opens the modal', async () => {
        const mockImages = [{ category: 'homepage', thumb: 't.jpg', full: 'f.jpg', tags: ['cat'] }];
        global.fetch = jest.fn(() => Promise.resolve({ 
            json: () => Promise.resolve(mockImages) 
        }));

        await loadImages(gallery, modal, modalImg);

        const thumbImg = gallery.querySelector('img');
        thumbImg.click();

        expect(modal.style.display).toBe('flex');
        expect(modalImg.src).toContain('f.jpg');

        global.fetch.mockRestore();
    });

    test('pressing Escape closes the modal', () => {
        modal.style.display = 'flex';
        
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
        
        expect(modal.style.display).toBe('none');
    });

    test('clicking the modal background closes it', () => {
        modal.style.display = 'flex';
        
        const event = new MouseEvent('click', { bubbles: true });
        modal.dispatchEvent(event); 
        
        expect(modal.style.display).toBe('none');
    });

    test('clicking the close button closes the modal', () => {
        const closeBtn = document.querySelector('.close');
        modal.style.display = 'flex';
        
        closeBtn.click();
        
        expect(modal.style.display).toBe('none');
    });

    test('loadImages logs error on fetch failure', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        global.fetch = jest.fn(() => Promise.reject("API Down"));

        await loadImages(gallery, modal, modalImg);

        expect(spy).toHaveBeenCalledWith("Could not load images.json", "API Down");
        spy.mockRestore();
    });

    test('showFullImage does nothing if modal is missing', () => {
        expect(showFullImage(null, null, 'img.jpg')).toBeUndefined();
    });

    test('attachSearch does nothing if input or gallery is missing', () => {
        expect(attachSearch(null, null)).toBeUndefined();
    });

    test('loadImages does nothing if gallery is missing', async () => {
        const result = await loadImages(null, modal, modalImg);
        expect(result).toBeUndefined();
    });

    test('getCurrentPage returns homepage for a trailing slash path', () => {
        expect(getCurrentPage('/folder/')).toBe('homepage');
    });

    test('pressing ArrowRight triggers loadNextImage if modal is open', () => {
        modal.style.display = 'flex';
        global.loadNextImage = jest.fn();

        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(event);

        expect(global.loadNextImage).toHaveBeenCalled();
        delete global.loadNextImage;
    });

    test('pressing ArrowLeft triggers loadPreviousImage if modal is open', () => {
        modal.style.display = 'flex';
        global.loadPreviousImage = jest.fn();

        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        document.dispatchEvent(event);

        expect(global.loadPreviousImage).toHaveBeenCalled();
        delete global.loadPreviousImage;
    });

    test('arrow keys do nothing if modal is closed', () => {
        modal.style.display = 'none';
        global.loadNextImage = jest.fn();

        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(event);

        expect(global.loadNextImage).not.toHaveBeenCalled();
        delete global.loadNextImage;
    });
});
