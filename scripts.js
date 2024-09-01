let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    const url = "https://fakestoreapi.com/products";
    const productContainer = document.getElementById('product-container');
    const loadMoreButton = document.getElementById('load-more');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const sortOptions = document.getElementById('sort-options');
    const categoryFilter = document.getElementById('category-filter');
    const shimmerWrapper = document.getElementById('shimmer-wrapper');
    let currentPage = 1;
    const itemsPerPage = 9;

    function fetchAllProducts() {
      showShimmer();
      fetch(url)
          .then((resp) => resp.json())
          .then(function(data) {
              allProducts = data;
              document.getElementById("product-count").innerText = allProducts.length + " Results";
              // Load initial products
              fetchProducts(currentPage, itemsPerPage);
          })
          .catch(function(error) {
              console.error('Error fetching data:', error);
          })
          .finally(() => {
              hideShimmer();
          });
  }
  function showShimmer() {
    shimmerWrapper.style.display = 'flex';
}

function hideShimmer() {
    shimmerWrapper.style.display = 'none';
}

    function fetchProducts(page, limit) {
        const start = (page - 1) * limit;
        const end = page * limit;
        const productsToDisplay = allProducts.slice(start, end);
        displayProducts(productsToDisplay);
    }

    function displayProducts(products) {
        productContainer.innerHTML = ''; // Clear previous products
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-image" />
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
            `;
            productContainer.appendChild(productElement);
        });
    }

    function searchProducts(keyword) {
        const filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(keyword.toLowerCase()) ||
            product.description.toLowerCase().includes(keyword.toLowerCase())
        );
        document.getElementById("product-count").innerText = filteredProducts.length + " Results";
        displayProducts(filteredProducts);
    }

    function sortProducts(criteria) {
        let sortedProducts = [...allProducts];
        if (criteria === 'price-asc') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (criteria === 'price-desc') {
            sortedProducts.sort((a, b) => b.price - a.price);
        }
        displayProducts(sortedProducts);
    }

    function filterProducts() {
        let filteredProducts = [...allProducts];

        // Filter by category
        const selectedCategories = Array.from(categoryFilter.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        if (selectedCategories.length === 0 || selectedCategories.includes('all')) {
            // If no categories are selected or "all" is selected, show all products
            filteredProducts = allProducts;
        } else {
            filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
        }

        document.getElementById("product-count").innerText = filteredProducts.length + " Results";
        displayProducts(filteredProducts);
    }

    searchButton.addEventListener('click', () => {
        const keyword = searchInput.value;
        searchProducts(keyword);
    });

    sortOptions.addEventListener('change', () => {
        const criteria = sortOptions.value;
        sortProducts(criteria);
    });

    categoryFilter.addEventListener('change', filterProducts);

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchProducts(currentPage, itemsPerPage);
    });

    // Initial fetch of all products
    fetchAllProducts();
});