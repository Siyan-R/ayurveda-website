// Wait for the entire HTML document to load before running any script
document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------
    // Element selectors
    // -----------------------------
    const plantModal = document.getElementById("modal");
    const plantCloseBtn = document.querySelector(".plant-close");

    // Selectors for 'info' pop-ups (About, How-to, etc.)
    const infoModalLinks = document.querySelectorAll(".open-popup-link");
    const allModals = document.querySelectorAll(".modal"); // All modals, including plant and info
    const infoCloseBtns = document.querySelectorAll(".info-close");

    // Navigation selectors
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const allNavLinks = document.querySelectorAll('.nav-links a');

    // Search selectors
    const searchInput = document.querySelector(".nav-search input");
    const searchButton = document.querySelector(".nav-search button");
    const shopSection = document.querySelector(".shop-section");
    // const searchResults = document.getElementById("search-results"); // Note: This is selected but not used in your new search logic
    
    // -----------------------------
    // Page Navigation Handling
    // -----------------------------
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only fetch for non-popup links and non-anchor links
            if (!link.classList.contains('open-popup-link') && !link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const url = link.getAttribute('href');
                navigateToPage(url);
            }
        });
    });

    function navigateToPage(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                document.open();
                document.write(html);
                document.close();
                window.history.pushState({}, '', url);
            })
            .catch(error => {
                console.error('Navigation error:', error);
                window.location.href = url; // Fallback to regular navigation
            });
    }

    // -----------------------------
    // Plant Modal Functions
    // -----------------------------
    function openPlantModal(box) {
        // Populate the modal with data from the clicked box's 'data-' attributes
        document.getElementById("plant-name").innerText = box.dataset.name;
        document.getElementById("plant-info").innerText = box.dataset.info;
        document.getElementById("plant-advantages").innerText = box.dataset.advantages;
        document.getElementById("plant-disadvantages").innerText = box.dataset.disadvantages;
        document.getElementById("plant-uses").innerText = box.dataset.uses;
        document.getElementById("plant-benefits").innerText = box.dataset.benefits;
        
        const plantModelIframe = document.getElementById("plant-model");
        plantModelIframe.src = box.dataset.model; // Set the 3D model URL
        
        plantModal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    function closePlantModal() {
        plantModal.style.display = "none";
        document.getElementById("plant-model").src = ""; // Stop the 3D model
        document.body.style.overflow = "auto"; // Re-enable scrolling
    }

    // Close button for the main plant modal
    if (plantCloseBtn) {
        plantCloseBtn.addEventListener("click", closePlantModal);
    }
    
    // -----------------------------
    // Info Modal Functions (About, etc.)
    // -----------------------------
    
    // Function to close ALL open modals
    function closeAllModals() {
        allModals.forEach(m => {
            m.style.display = "none";
        });
        document.getElementById("plant-model").src = ""; // Also stop 3D model
        document.body.style.overflow = "auto"; // Re-enable scrolling
    }

    // Add click listeners for the 'About' link (and any other info links)
    infoModalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            navLinks.classList.remove("active"); // Close mobile menu if open
            const modalId = link.dataset.modalId;
            const targetModal = document.getElementById(modalId);
            
            if (targetModal) {
                closeAllModals(); // Close any other modal first
                targetModal.style.display = 'block';
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Add click listeners to all info modal 'close' buttons
    infoCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // -----------------------------
    // Mobile Hamburger Menu
    // -----------------------------
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // -----------------------------
    // Event Delegation for Plant Boxes
    // -----------------------------
    // This is the *only* click listener you need for the plant boxes.
    // It works for the boxes that load with the page AND for new boxes
    // added by the search function.
    if (shopSection) {
        shopSection.addEventListener("click", (e) => {
            const box = e.target.closest(".box");
            if (box) {
                openPlantModal(box);
            }
        });
    }

    // -----------------------------
    // Search Functionality
    // -----------------------------
    function performSearch() {
        const query = searchInput.value.trim();
        
        // Don't search for nothing
        if (!query) {
            // Optionally, you could restore the original plants here
            return; 
        }

        // Show loading state
        shopSection.innerHTML = "<p>Searching...</p>";

        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                shopSection.innerHTML = ""; // Clear "Searching..." message

                if (data.length === 0) {
                    shopSection.innerHTML = "<p>No plants found. Try a different search term.</p>";
                    return;
                }

                // Create a new box for each plant in the results
                data.forEach(plant => {
                    const box = document.createElement("div");
                    box.classList.add("box");

                    // Set data attributes for the modal
                    box.dataset.name = plant.name;
                    box.dataset.info = plant.info || "No information available.";
                    box.dataset.advantages = plant.advantages || "Not available.";
                    box.dataset.disadvantages = plant.disadvantages || "Not available.";
                    box.dataset.uses = plant.uses || "Not available.";
                    box.dataset.benefits = plant.benefits || "Not available.";
                    box.dataset.model = plant.model || "";

                    // **FIXED**: Matched this HTML to your original file
                    // It now creates an <iframe>, not an <img>.
                    box.innerHTML = `
                        <h2>${plant.name}</h2>
                        <iframe src="${plant.model || ''}" width="100%" height="200" frameborder="0" allowfullscreen></iframe>
                        <p>Quick View</p>
                    `;
                    
                    // No need to add a click listener here!
                    // The 'event delegation' listener on shopSection will handle it.
                    shopSection.appendChild(box);
                });
            })
            .catch(err => {
                // **FIXED**: This was the broken code at the end of your file.
                // It's now correctly placed inside the catch block.
                console.error("Error fetching plants:", err);
                shopSection.innerHTML = "<p>Error searching plants. Please try again.</p>";
            });
    }

    // Add event listeners for search
    if (searchButton) {
        searchButton.addEventListener("click", performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // Stop form submission
                performSearch();
            }
        });
    }

}); // End of DOMContentLoaded