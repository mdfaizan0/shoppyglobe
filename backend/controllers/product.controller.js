import Product from "../models/Product.model.js"

// func to fetch all products in DB
export async function getAllProducts(req, res) {
    try {
        // fetching all products from DB and returning the number of products and whole response
        const products = await Product.find()
        res.json({
            productsLength: products.length,
            products: products
        })
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Server Error, unable to fetch product data.", error: error.message })
    }
}

// func to get details of a product
export async function getProductbyId(req, res) {
    try {
        // find product in DB, based on id received thru params
        const product = await Product.findOne({ id: req.params.id })
        // if not found, return the same info with app. message, if found, return the product details with app. message
        if (!product) return res.status(404).json({ Message: `Product with ID: ${req.params.id} not found.` })
        return res.status(200).json(product)
        // if any error, send the same with appropriate message
    } catch (error) {
        return res.status(500).json({ message: "Server Error, unable to fetch product data.", error: error.message })
    }
}