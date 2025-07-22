const { MongoClient } = require('mongodb');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const dbName = 'ecommerce';
const db = client.db(dbName);
const products = db.collection('products');

async function addProduct() {
    rl.question('Enter product name: ', async (name) => {
        rl.question('Enter product price: ', async (price) => {
            rl.question('Enter product category: ', async (category) => {
                rl.question('Enter stock quantity: ', async (stock) => {
                    rl.question('Enter product description: ', async (description) => {
                        rl.question('Enter product brand: ', async (brand) => {
                            await products.insertOne({
                                name,
                                price: parseFloat(price),
                                category,
                                stock: parseInt(stock),
                                description,
                                brand
                            });
                            console.log('Product added successfully.');
                            rl.close();
                        });
                    });
                });
            });
        });
    });
}

async function viewInventory() {
    const items = await products.find().toArray();
    console.log('Inventory:');
    items.forEach((item, index) => {
        console.log(
            `${index + 1}. ${item.name} - ${item.stock} in stock - $${item.price} - ${item.category} - ${item.brand}`
        );
    });
    rl.close();
}

async function main() {
    await client.connect();
    rl.question('Choose an option (1 - Add Product, 2 - View Inventory): ', async (option) => {
        if (option === '1') {
            await addProduct();
        } else if (option === '2') {
            await viewInventory();
        } else {
            console.log('Invalid option.');
            rl.close();
        }
    });
}

main();
