import { useState } from 'react'
import ProductItem from '../components/ProductItem'
import useFetchProducts from '../utils/useFetchProducts'
import { useSelector } from 'react-redux'

function ProductList() {
  // Defined states
  const [categorySelected, setCategorySelected] = useState("")
  const [inStock, setInStock] = useState(false)
  const [lowStock, setLowStock] = useState(false)
  const [sortOption, setSortOption] = useState("")
  // Called custom hooks for API data/err/loading
  const { data, err, loading } = useFetchProducts("https://dummyjson.com/products?limit=60")
  // Listing categories and used Set to keep only unique inputs
  const categories = [...new Set(data?.products?.map(item => item.category))]
  // Accessing search query from search state
  const searchQuery = useSelector(store => store.search.query)
  // Formatted category for showing as header
  const formattedCategory = categorySelected.charAt(0).toUpperCase() + categorySelected.slice(1)

  // Handling filters whether it is category, stock or search query
  // Search query looks for the query in title, description, brand, category of each item
  let filteredData = (data?.products || [])
    ?.filter(item => {
      // category filter
      if (categorySelected) {
        return item.category.toLowerCase() === categorySelected.toLowerCase()
      }
      return true
    })
    ?.filter(item => {
      // inStock filter
      if (inStock) {
        return item.stock > 10
      }
      return true
    })
    ?.filter(item => {
      // lowStock filter
      if (lowStock) {
        return item.stock < 10
      }
      return true
    })
    ?.filter(item => {
      // search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.brand?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        )
      }
      return true
    })


  // function to handle category select through state
  function handleCategoryChange(e) {
    setCategorySelected(e.target.value)
  }

  // function to handle stock filter
  function handleStockFilter(e) {
    const { id } = e.target

    // check if clicked checkbox is id of.. as mentioned
    if (id === "inStock") {
      setInStock(prev => !prev)
    }

    if (id === "lowStock") {
      setLowStock(prev => !prev)
    }
  }

  // handling sort options through state
  function handleSortChange(e) {
    setSortOption(e.target.value)
  }

  // Clearing all the filters
  function handleClearFilters() {
    setCategorySelected("")
    setInStock(false)
    setLowStock(false)
    setSortOption("")
  }

  // handling sorting based on value on each option's value set to state
  if (sortOption === "price-asc") {
    filteredData.sort((a, b) => a.price - b.price)
  } else if (sortOption === "price-desc") {
    filteredData.sort((a, b) => b.price - a.price)
  } else if (sortOption === "rating") {
    filteredData.sort((a, b) => b.rating - a.rating)
  }

  // Showing error if "err" is has anything
  if (err) {
    return (<div>Error loading products.</div>)
  }

  // rendering component
  return (
    <div className="product-list">
      <h1>{categorySelected ? formattedCategory : "All Products"}</h1>
      <div className="product-sort">
        <select onChange={handleSortChange} name="sort" id="sort">
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      <div className="parent-product-filters">
        <aside className="product-filters" style={data? {display: "block"} : {display: "none"}}>
          <h1>Filters</h1>
          <div className="filter-container">
            <div className="category-filter">
              <label htmlFor="category">Filter by Category:</label>
              <select name="category" id="category" onChange={handleCategoryChange}>
                {/* listing the available categories by mutating each items of categories set to <option> of <select> */}
                <option value="">All</option>
                {categories.map((category, index) => {
                  return <option key={index} value={`${category.toLowerCase()}`}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                })}
              </select>
            </div>
            <div className="stock-filter">
              <div className="instock-filter">
                <input type="checkbox" name="inStock" id="inStock" onChange={handleStockFilter} checked={inStock} disabled={lowStock && true} />
                <label htmlFor="inStock"> In-Stock</label>
              </div>
              <div className="lowstock-filter">
                <input type="checkbox" name="lowStock" id="lowStock" onChange={handleStockFilter} checked={lowStock} disabled={inStock && true} />
                <label htmlFor="lowStock"> Low-on-Stock</label>
              </div>
            </div>
          </div>
          {categorySelected || inStock || lowStock || sortOption ? (
            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          ) : null}
        </aside>
        {/* Rendering the data only if loading is not true and data after filtering is more than 1, otherwise showing showing nothing matches and if loading..showing the same */}
        {!loading ? (
          filteredData.length !== 0 ? (
            <div className="product-grid">
              {filteredData.map(item => (
                <ProductItem
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  thumbnail={item.thumbnail}
                  warranty={item.warrantyInformation}
                  id={item.id}
                />
              ))}
            </div>
          ) : (
            <div className="nothing-available">
              Unfortunately, we could not find anything.
            </div>
          )
        ) : (
          <div className="loading-container"><div className="loading-msg"></div></div>
        )}
      </div>
    </div>
  )
}

export default ProductList