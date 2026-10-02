const images = [
  {
    id: 1,
    title: "Mountain Sunrise",
    category: "nature",
    src: "assets/images/img-01.jpg",
    color: "#28d17c",
    credit: "Local gallery image",
  },
  {
    id: 2,
    title: "Forest Trail",
    category: "nature",
    src: "assets/images/img-02.jpg",
    color: "#28d17c",
    credit: "Local gallery image",
  },
  {
    id: 3,
    title: "Wild Valley",
    category: "nature",
    src: "assets/images/img-03.jpg",
    color: "#28d17c",
    credit: "Local gallery image",
  },
  {
    id: 4,
    title: "Neon Street",
    category: "city",
    src: "assets/images/img-04.jpg",
    color: "#00c2ff",
    credit: "Local gallery image",
  },
  {
    id: 5,
    title: "Urban Night",
    category: "city",
    src: "assets/images/img-05.jpg",
    color: "#00c2ff",
    credit: "Local gallery image",
  },
  {
    id: 6,
    title: "City Skyline",
    category: "city",
    src: "assets/images/img-06.jpg",
    color: "#00c2ff",
    credit: "Local gallery image",
  },
  {
    id: 7,
    title: "Modern Tower",
    category: "architecture",
    src: "assets/images/img-07.jpg",
    color: "#8b5cf6",
    credit: "Local gallery image",
  },
  {
    id: 8,
    title: "Glass Structure",
    category: "architecture",
    src: "assets/images/img-08.jpg",
    color: "#8b5cf6",
    credit: "Local gallery image",
  },
  {
    id: 9,
    title: "Color Motion",
    category: "abstract",
    src: "assets/images/img-09.jpg",
    color: "#f59e0b",
    credit: "Local gallery image",
  },
  {
    id: 10,
    title: "Digital Pattern",
    category: "abstract",
    src: "assets/images/img-10.jpg",
    color: "#f59e0b",
    credit: "Local gallery image",
  },
  {
    id: 11,
    title: "Street Portrait",
    category: "people",
    src: "assets/images/img-11.jpg",
    color: "#ef476f",
    credit: "Local gallery image",
  },
  {
    id: 12,
    title: "Creative Focus",
    category: "people",
    src: "assets/images/img-12.jpg",
    color: "#ef476f",
    credit: "Local gallery image",
  },
  {
    id: 13,
    title: "Studio Moment",
    category: "people",
    src: "assets/images/img-13.jpg",
    color: "#ef476f",
    credit: "Local gallery image",
  },
];

let filteredImages = [...images];
let currentLightboxIndex = 0;
let activeFilter = "all";
let activeSearch = "";
let isMasonry = false;

const galleryGrid = document.querySelector("#gallery-grid");
const filterButtons = document.querySelectorAll(".filter-pill");
const searchInput = document.querySelector("#search-input");
const masonryToggle = document.querySelector("#masonry-toggle");
const lightboxOverlay = document.querySelector("#lightbox-overlay");
const lightboxClose = document.querySelector("#lightbox-close");
const prevButton = document.querySelector("#prev-btn");
const nextButton = document.querySelector("#next-btn");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCredit = document.querySelector("#lightbox-credit");
const lightboxCategory = document.querySelector("#lightbox-category");
const lightboxCounter = document.querySelector("#lightbox-counter");
const fullscreenButton = document.querySelector("#fullscreen-btn");

function init() {
  renderGallery(filteredImages);

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      handleFilter(button.dataset.category);
    });
  });

  searchInput.addEventListener("input", function () {
    handleSearch(searchInput.value);
  });

  masonryToggle.addEventListener("click", toggleMasonry);
  lightboxClose.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", function () {
    navigateImage(-1);
  });
  nextButton.addEventListener("click", function () {
    navigateImage(1);
  });
  fullscreenButton.addEventListener("click", toggleFullscreen);

  lightboxOverlay.addEventListener("click", function (event) {
    if (event.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", handleKeyboard);
  document.addEventListener("fullscreenchange", updateFullscreenButton);
}

function applyFilters() {
  const normalizedSearch = activeSearch.toLowerCase();

  filteredImages = images.filter(function (image) {
    const matchesCategory =
      activeFilter === "all" || image.category === activeFilter;
    const searchableText =
      `${image.title} ${image.category} ${image.credit}`.toLowerCase();
    const matchesSearch = searchableText.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  renderGallery(filteredImages);
}

function renderGallery(imageList) {
  galleryGrid.innerHTML = "";

  if (imageList.length === 0) {
    galleryGrid.innerHTML = `
      <div class="empty-state">
        <h3>No images found</h3>
        <p>Try another search term or choose a different category.</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  imageList.forEach(function (image, index) {
    fragment.appendChild(buildImageCard(image, index));
  });

  galleryGrid.appendChild(fragment);
}

function buildImageCard(image, index) {
  const card = document.createElement("button");
  card.className = "gallery-card";
  card.type = "button";
  card.dataset.index = index;
  card.style.setProperty("--category-color", image.color);
  card.setAttribute("aria-label", `Open ${image.title}`);

  card.innerHTML = `
    <img src="${image.src}" alt="${image.title}" loading="lazy">
    <span class="gallery-overlay">
      <span class="category-badge">${image.category}</span>
      <span class="zoom-icon">View</span>
      <span class="gallery-info">
        <span class="gallery-title">${image.title}</span>
        <span class="gallery-credit">${image.credit}</span>
      </span>
    </span>
  `;

  card.addEventListener("click", function () {
    openLightbox(index);
  });

  return card;
}

function openLightbox(index) {
  currentLightboxIndex = index;
  loadLightboxImage(currentLightboxIndex);

  lightboxOverlay.hidden = false;
  requestAnimationFrame(function () {
    lightboxOverlay.classList.add("active-lightbox");
  });

  document.body.classList.add("no-scroll");
  lightboxClose.focus();
}

function closeLightbox() {
  lightboxOverlay.classList.remove("active-lightbox");
  document.body.classList.remove("no-scroll");

  window.setTimeout(function () {
    lightboxOverlay.hidden = true;
  }, 180);
}

function navigateImage(direction) {
  if (filteredImages.length === 0) {
    return;
  }

  currentLightboxIndex += direction;

  if (currentLightboxIndex >= filteredImages.length) {
    currentLightboxIndex = 0;
  }

  if (currentLightboxIndex < 0) {
    currentLightboxIndex = filteredImages.length - 1;
  }

  loadLightboxImage(currentLightboxIndex);
}

function loadLightboxImage(index) {
  const selectedImage = filteredImages[index];

  if (!selectedImage) {
    return;
  }

  lightboxImage.src = selectedImage.src;
  lightboxImage.alt = selectedImage.title;
  lightboxTitle.textContent = selectedImage.title;
  lightboxCredit.textContent = selectedImage.credit;
  lightboxCategory.textContent = selectedImage.category;
  lightboxCategory.style.setProperty("--category-color", selectedImage.color);
  lightboxCounter.textContent = `${index + 1} / ${filteredImages.length}`;

  preloadAdjacentImages(index);
}

function handleKeyboard(event) {
  if (lightboxOverlay.hidden) {
    return;
  }

  if (event.key === "ArrowLeft") {
    navigateImage(-1);
  }

  if (event.key === "ArrowRight") {
    navigateImage(1);
  }

  if (event.key === "Escape") {
    closeLightbox();
  }
}

function handleSearch(query) {
  activeSearch = query.trim();
  applyFilters();
}

function handleFilter(category) {
  activeFilter = category;

  filterButtons.forEach(function (button) {
    const isActive = button.dataset.category === category;

    button.classList.toggle("active-filter", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  applyFilters();
}

function toggleMasonry() {
  isMasonry = !isMasonry;

  galleryGrid.classList.toggle("masonry-view", isMasonry);
  masonryToggle.textContent = isMasonry ? "Grid View" : "Masonry View";
  masonryToggle.setAttribute("aria-pressed", String(isMasonry));
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    return;
  }

  document.exitFullscreen();
}

function updateFullscreenButton() {
  fullscreenButton.textContent = document.fullscreenElement
    ? "Exit Fullscreen"
    : "Fullscreen";
}

function preloadAdjacentImages(index) {
  if (filteredImages.length < 2) {
    return;
  }

  const previousIndex = index === 0 ? filteredImages.length - 1 : index - 1;
  const nextIndex = index === filteredImages.length - 1 ? 0 : index + 1;
  const previousImage = new Image();
  const nextImage = new Image();

  previousImage.src = filteredImages[previousIndex].src;
  nextImage.src = filteredImages[nextIndex].src;
}

init();
