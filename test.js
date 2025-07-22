const readline = require("readline");
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://veradanicode:veradani360@cluster0.3huay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const addProducts = async (productCollection) => {
  rl.question("Enter Product Name: ", (productName) => {
    rl.question("Enter Price: ", (price) => {
      rl.question("Enter Category: ", (category) => {
        rl.question("Enter the quantity of the stock: ", (stockQuantity) => {
          rl.question("Enter a description of the product: ", (description) => {
            rl.question("Enter the brand name: ", (brand) => {
              const items = {
                productName: productName,
                price: parseInt(price),
                category: category,
                stockQuantity: parseInt(stockQuantity),
                description: description,
                brand: brand,
              };
              productCollection.insertOne(items)
              .then(() => {
                console.log("Inserted successfully");
                main()
              })
              .catch((error) => {
                console.error(" Insert failed:", error);
                rl.close();
              });
            });
          });
        });
      });
    });
  });
};

async function viewInventory() {
  const newdb = await client.db("Ecommerce_inventory_management_db");
  const productCollection = await newdb.collection("products");
  const items = await productCollection.find().toArray();
  console.log('Inventory:');
  items.forEach((item, index) => {
      console.log(
          `${index + 1}. ${item.productName} - ${item.stockQuantity} in stock - $${item.price} - ${item.category} - ${item.brand}`
      );
  });
  main()
}

const manageInventory = async(productCollection)=>{
  rl.question("Enter the Product Name to Update: ", (productName) => {
    rl.question("Enter New Price(leave blank if no change): ", (price) => {
      rl.question("Enter New Category(leave blank if no change): ", (category) => {
        rl.question("Enter New quantity (leave blank if no change): ", (stockQuantity) => {
          rl.question("Enter New description(leave blank if no change): ", (description) => {
            rl.question("Enter New brand name(leave blank if no change): ",async (brand) => {
              
              const product = await productCollection.findOne({ productName: productName });
              const update = {

                $set: {
                  price: price.trim() === '' ? product.price : parseFloat(price),
                  category:typeof category==="string" && category.trim() === '' ? product.category :category,
                  stockQuantity: stockQuantity.trim() === '' ? product.stockQuantity : parseInt(stockQuantity),
                  description:typeof description==="string" && description.trim() === '' ? product.description:description ,
                  brand: typeof brand ==="string" && brand.trim() === '' ? product.brand:brand,
                },
              };

              productCollection.updateOne(product, update)
                .then((result) => {
                  if (result.modifiedCount > 0) {
                    console.log(" Product updated successfully.");
                    main()
                  } else {
                    console.log(" No product found or no changes made.");
                    main()
                  }
                })
                .catch((err) => {
                  console.error(" Update failed:", err);
                  main()
                });
            });
          });
        });
      });
    });
  });
}

const main = async () => {
  try {
    // await client.connect();
    // console.log("Connected Succesfully");

    const newdb = await client.db("Ecommerce_inventory_management_db");
    const productCollection = await newdb.collection("products");
    // const categoriesCollection = await newdb.collection("categories");
    // const ordersCollection = await newdb.collection("orders");
    // const customersCollection = await newdb.collection("customers");
    // const suppliersCollection = await newdb.collection("suppliers");
    // const transactionsCollection = await newdb.collection("transactions");
    // console.log("Collection Sucessfully created");

    console.log(`
        ===================================================
            E-COMMERCE INVENTORY MANAGEMENT SYSTEM
        ===================================================
        _____ _____ _____ _____ _____ _____ _____ _____
        |  E  |  C  |  O  |  M  |  M  |  E  |  R  |  C  |
        |_____|_____|_____|_____|_____|_____|_____|_____|  
        |           |           |           |           |
        | Products  |  Orders   | Customers | Suppliers |
        |___________|___________|___________|___________|
            
            - Add New Product
            - Track Orders and Shipments
            - Manage Inventory Levels
            - Generate Sales Reports
            - View Customer Profiles
            - Supplier Info and Stock Updates
            
        =============================================
        [1] Add Product     [4] Delete Inventory  
        [2] View Inventory   [5] Manage Orders 
        [3] Manage Inventory [6] Process Returns
        =============================================
    `);

    const option = await new Promise((resolve) => {
      rl.question("Options: ", (answer) => {
        resolve(parseInt(answer));
      });
    });

    switch (option) {
      case 1:
        await addProducts(productCollection);
        break;
      case 2:
        await viewInventory()
        break;
      case 3:
        await manageInventory(productCollection)
        break;
      case 4:
        console.log("Managing orders...");
        rl.close();
        break;
      case 5:
        console.log("Processing returns...");
        rl.close();
        break;
      default:
        console.log("Invalid option. Exiting...");
        rl.close();
        break;
    }

  } catch (error) {
    console.log(error);
    rl.close();
  }
};

main();
