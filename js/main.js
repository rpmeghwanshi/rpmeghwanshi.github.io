/* ═══════════════════════════════════════════
   Ravi Prakash Meghwanshi | Portfolio — main.js
   ═══════════════════════════════════════════ */


/* ═══════════════════════════════════════════
   GLOBAL VARIABLES
═══════════════════════════════════════════ */

let allPublications = [];

let activeType = 'all';

let activeYear = 'all';



/* ═══════════════════════════════════════════
   INITIALIZE PAGE
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* Load publications */

    loadPublications();


    /* Initialize sidebar navigation */

    initializeNavigation();


    /* Initialize publication filters */

    initializePublicationFilters();


    /* Initialize modal */

    initializeModal();

});



/* ═══════════════════════════════════════════
   SIDEBAR NAVIGATION
═══════════════════════════════════════════ */

function initializeNavigation() {

    const sections = document.querySelectorAll(
        'section[id], div[id]'
    );


    const navLinks = document.querySelectorAll(
        '.sidebar-nav a'
    );


    /* ───────────────────────────────────────
       Highlight active navigation link
    ─────────────────────────────────────── */

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    navLinks.forEach((link) => {

                        link.classList.remove('active');


                        if (
                            link.getAttribute('href') ===
                            '#' + entry.target.id
                        ) {

                            link.classList.add('active');

                        }

                    });

                }

            });

        },

        {
            threshold: 0.35
        }

    );


    sections.forEach((section) => {

        observer.observe(section);

    });



    /* ───────────────────────────────────────
       Smooth scrolling
    ─────────────────────────────────────── */

    navLinks.forEach((link) => {

        link.addEventListener('click', (event) => {

            const href = link.getAttribute('href');


            if (
                href &&
                href.startsWith('#') &&
                href.length > 1
            ) {

                event.preventDefault();


                const target = document.querySelector(href);


                if (target) {

                    target.scrollIntoView({

                        behavior: 'smooth',

                        block: 'start'

                    });

                }

            }

        });

    });



    /* Set Home active initially */

    const homeLink = document.querySelector(
        '.sidebar-nav a[href="#home"]'
    );


    if (homeLink) {

        homeLink.classList.add('active');

    }

}



/* ═══════════════════════════════════════════
   LOAD PUBLICATIONS.JSON
═══════════════════════════════════════════ */

function loadPublications() {

    fetch('publications.json')

        .then((response) => {

            if (!response.ok) {

                throw new Error(

                    `Unable to load publications.json: ${response.status}`

                );

            }


            return response.json();

        })


        .then((data) => {

            console.log(

                'Publications loaded successfully:',

                data

            );


            allPublications = data.publications || [];


            renderPublications();

        })


        .catch((error) => {

            console.error(

                'Error loading publications:',

                error

            );


            displayPublicationError();

        });

}



/* ═══════════════════════════════════════════
   PUBLICATION ERROR
═══════════════════════════════════════════ */

function displayPublicationError() {

    const container = document.getElementById(
        'publications-container'
    );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="pub-item">

            <span class="pub-indicator"></span>

            <div class="pub-body">

                <div class="pub-title">

                    Error loading publications.

                </div>

                <div class="pub-meta">

                    Please check publications.json.

                </div>

            </div>

        </div>

    `;

}



/* ═══════════════════════════════════════════
   INITIALIZE PUBLICATION FILTERS
═══════════════════════════════════════════ */

function initializePublicationFilters() {

    const filterButtons = document.querySelectorAll(

        '.pub-filter .filter-btn'

    );


    filterButtons.forEach((button) => {

        button.addEventListener('click', () => {


            /* Remove active class */

            filterButtons.forEach((btn) => {

                btn.classList.remove('active');

            });


            /* Add active class */

            button.classList.add('active');


            /* Update filter */

            activeType = button.dataset.filter;


            /* Re-render publications */

            renderPublications();

        });

    });



    /* ───────────────────────────────────────
       YEAR FILTER
    ─────────────────────────────────────── */

    const yearSelect = document.getElementById(
        'yearFilter'
    );


    if (yearSelect) {

        yearSelect.addEventListener('change', () => {

            activeYear = yearSelect.value;


            renderPublications();

        });

    }

}



/* ═══════════════════════════════════════════
   DETERMINE PUBLICATION TYPE
═══════════════════════════════════════════ */

function getPublicationType(publication) {

    const venue = publication.venue.toLowerCase();


    /* Journal */

    if (

        venue.includes('transactions') ||

        venue.includes('journal') ||

        venue.includes('experimental brain research')

    ) {

        return 'journal';

    }


    /* Conference */

    return 'conference';

}



/* ═══════════════════════════════════════════
   DETERMINE PUBLICATION YEAR
═══════════════════════════════════════════ */

function getPublicationYear(publication) {

    const yearMatch = publication.venue.match(

        /\b(19|20)\d{2}\b/

    );


    if (yearMatch) {

        return yearMatch[0];

    }


    return '';

}



/* ═══════════════════════════════════════════
   FILTER PUBLICATIONS
═══════════════════════════════════════════ */

function getFilteredPublications() {

    return allPublications.filter((publication) => {


        const publicationType =

            getPublicationType(publication);


        const publicationYear =

            getPublicationYear(publication);



        const typeMatch =

            activeType === 'all' ||

            publicationType === activeType;



        const yearMatch =

            activeYear === 'all' ||

            publicationYear === activeYear;



        return typeMatch && yearMatch;

    });

}



/* ═══════════════════════════════════════════
   RENDER PUBLICATIONS
═══════════════════════════════════════════ */

function renderPublications() {

    const publicationsContainer =

        document.getElementById(

            'publications-container'

        );


    if (!publicationsContainer) {

        return;

    }



    /* Clear existing publications */

    publicationsContainer.innerHTML = '';



    /* Get filtered publications */

    const publicationsToShow =

        getFilteredPublications();



    /* No publications */

    if (publicationsToShow.length === 0) {

        publicationsContainer.innerHTML = `

            <div class="pub-item">

                <span class="pub-indicator"></span>

                <div class="pub-body">

                    <div class="pub-title">

                        No publications found.

                    </div>

                    <div class="pub-meta">

                        Try selecting another publication type or year.

                    </div>

                </div>

            </div>

        `;


        return;

    }



    /* Create publication cards */

    publicationsToShow.forEach((publication) => {

        const publicationElement =

            createPublicationElement(

                publication

            );


        publicationsContainer.appendChild(

            publicationElement

        );

    });

}



/* ═══════════════════════════════════════════
   CREATE PUBLICATION ELEMENT
═══════════════════════════════════════════ */

function createPublicationElement(publication) {


    /* Main publication card */

    const publicationItem =

        document.createElement('div');


    publicationItem.className =

        'publication-item';



    /* ═══════════════════════════════════════
       THUMBNAIL
    ═══════════════════════════════════════ */

    const thumbnail =

        document.createElement('div');


    thumbnail.className =

        'pub-thumbnail';



    const thumbnailImage =

        document.createElement('img');


    thumbnailImage.src =

        publication.thumbnail;


    thumbnailImage.alt =

        `${publication.title} thumbnail`;


    thumbnailImage.loading = 'lazy';



    /* Open image modal */

    thumbnail.addEventListener(

        'click',

        () => {

            openModal(

                publication.thumbnail

            );

        }

    );


    thumbnail.appendChild(

        thumbnailImage

    );



    /* ═══════════════════════════════════════
       PUBLICATION CONTENT
    ═══════════════════════════════════════ */

    const content =

        document.createElement('div');


    content.className =

        'pub-content';



    /* ───────────────────────────────────────
       TITLE
    ─────────────────────────────────────── */

    const title =

        document.createElement('div');


    title.className =

        'pub-title';


    title.textContent =

        publication.title;


    content.appendChild(title);



    /* ───────────────────────────────────────
       AUTHORS
    ─────────────────────────────────────── */

    const authors =

        document.createElement('div');


    authors.className =

        'pub-authors';



    let authorsHTML = '';



    publication.authors.forEach(

        (author, index) => {


            /* Highlight your name */

            if (

                author
                    .toLowerCase()
                    .includes('ravi') &&

                author
                    .toLowerCase()
                    .includes('meghwanshi')

            ) {

                authorsHTML +=

                    `<span class="highlight-name">${author}</span>`;

            }

            else {

                authorsHTML += author;

            }



            /* Add comma */

            if (

                index <

                publication.authors.length - 1

            ) {

                authorsHTML += ', ';

            }

        }

    );


    authors.innerHTML = authorsHTML;


    content.appendChild(authors);



    /* ───────────────────────────────────────
       VENUE
    ─────────────────────────────────────── */

    const venueContainer =

        document.createElement('div');


    venueContainer.className =

        'pub-venue-container';



    const venue =

        document.createElement('div');


    venue.className =

        'pub-venue';


    venue.textContent =

        publication.venue;


    venueContainer.appendChild(venue);



    /* ───────────────────────────────────────
       AWARD
    ─────────────────────────────────────── */

    if (

        publication.award &&

        publication.award.length > 0

    ) {

        const award =

            document.createElement('div');


        award.className =

            'pub-award';


        award.textContent =

            publication.award;


        venueContainer.appendChild(

            award

        );

    }


    content.appendChild(

        venueContainer

    );



    /* ═══════════════════════════════════════
       PUBLICATION LINKS
    ═══════════════════════════════════════ */

    if (publication.links) {


        const links =

            document.createElement('div');


        links.className =

            'pub-links';



        /* PDF */

        if (publication.links.pdf) {

            createPublicationLink(

                links,

                publication.links.pdf,

                'PDF',

                'fas fa-file-pdf'

            );

        }



        /* Slides */

        if (publication.links.slides) {

            createPublicationLink(

                links,

                publication.links.slides,

                'Slides',

                'fas fa-display'

            );

        }



        /* Poster */

        if (publication.links.poster) {

            createPublicationLink(

                links,

                publication.links.poster,

                'Poster',

                'fas fa-image'

            );

        }



        /* Certificate */

        if (publication.links.certificate) {

            createPublicationLink(

                links,

                publication.links.certificate,

                'Certificate',

                'fas fa-certificate'

            );

        }



        /* Code */

        if (publication.links.code) {

            createPublicationLink(

                links,

                publication.links.code,

                'Code',

                'fab fa-github'

            );

        }



        /* Project Page */

        if (publication.links.project) {

            createPublicationLink(

                links,

                publication.links.project,

                'Project',

                'fas fa-globe'

            );

        }



        content.appendChild(links);

    }



    /* ═══════════════════════════════════════
       ASSEMBLE PUBLICATION
    ═══════════════════════════════════════ */

    publicationItem.appendChild(

        thumbnail

    );


    publicationItem.appendChild(

        content

    );


    return publicationItem;

}



/* ═══════════════════════════════════════════
   CREATE PUBLICATION LINK
═══════════════════════════════════════════ */

function createPublicationLink(

    container,

    url,

    label,

    iconClass

) {


    const link =

        document.createElement('a');


    link.href = url;


    link.target = '_blank';


    link.rel = 'noopener noreferrer';



    /* Add icon */

    const icon =

        document.createElement('i');


    icon.className = iconClass;



    /* Add text */

    const text =

        document.createTextNode(

            ` ${label}`

        );



    link.appendChild(icon);


    link.appendChild(text);


    container.appendChild(link);

}



/* ═══════════════════════════════════════════
   INITIALIZE IMAGE MODAL
═══════════════════════════════════════════ */

function initializeModal() {

    const modal =

        document.getElementById(

            'imageModal'

        );


    if (!modal) {

        return;

    }



    /* Close when clicking background */

    modal.addEventListener(

        'click',

        (event) => {

            if (

                event.target === modal

            ) {

                closeModal();

            }

        }

    );



    /* Close modal with Escape key */

    document.addEventListener(

        'keydown',

        (event) => {

            if (

                event.key === 'Escape' &&

                modal.style.display === 'block'

            ) {

                closeModal();

            }

        }

    );

}



/* ═══════════════════════════════════════════
   OPEN IMAGE MODAL
═══════════════════════════════════════════ */

function openModal(imageSource) {

    const modal =

        document.getElementById(

            'imageModal'

        );


    const modalImage =

        document.getElementById(

            'modalImage'

        );


    if (

        !modal ||

        !modalImage

    ) {

        return;

    }



    modalImage.src = imageSource;


    modal.style.display = 'block';



    setTimeout(() => {

        modal.classList.add('show');

    }, 10);

}



/* ═══════════════════════════════════════════
   CLOSE IMAGE MODAL
═══════════════════════════════════════════ */

function closeModal() {

    const modal =

        document.getElementById(

            'imageModal'

        );


    if (!modal) {

        return;

    }


    modal.classList.remove('show');


    setTimeout(() => {

        modal.style.display = 'none';

    }, 300);

}
