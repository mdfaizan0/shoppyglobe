import Product from "../models/Product.model.js"

export async function getAllProducts(req, res) {
    const products = await Product.find()
    res.json({
        productsLength: products.length,
        products: products
    })
}

export async function getProductbyId(req, res) {
    try {
        const product = await Product.findOne({ id: req.params.id })
        if (!product) return res.status(404).json({ Message: `Product with ID: ${req.params.id} not found.` })
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: "Server Error, unable to fetch product data.", error: error.message })
    }
}