// import mongoose from "mongoose";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import { DB_NAME } from "../constants.js";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// import { Laptop } from "../models/laptop.model.js";
// import { LaptopListing } from "../models/laptopListing.model.js";
// import { Seller } from "../models/seller.model.js";

// dotenv.config();

// // __dirname workaround for ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const seedLaptops = async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//     console.log(`Successfully Connected to MongoDB Database`);

//     const rawPath = path.join(__dirname, "../../data/clean_laptop_data.json");
//     const laptopData = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

//     const sellers = await Seller.find();
//     if (!sellers.length) {
//       console.error("No sellers found in the database.");
//       return;
//     }

//     await LaptopListing.deleteMany();

//     for (const item of laptopData) {
//       const name = `${item.Company} ${item.Product}`;
//       const brand = item.Company;

//       let laptop = await Laptop.findOne({ name, brand });
//       if (!laptop) {
//         laptop = await Laptop.create({ name, brand });
//       }

//       const specs = {
//         processor: item.Cpu,
//         ram: item.Ram,
//         storage: item.Memory,
//         gpu: item.Gpu,
//         screen: item.ScreenResolution,
//         weight: item.Weight,
//         os: item.OpSys,
//         type: item.TypeName,
//         touch: item.Touch,
//         gpuType: item["GPU-type"]
//       };

//       const listing = new LaptopListing({
//         laptop: laptop._id,
//         seller: sellers[Math.floor(Math.random() * sellers.length)]._id,
//         price: item.Price_in_PKR,
//         condition: "Used",
//         quantityAvailable: Math.floor(Math.random() * 5) + 1,
//         specifications: specs,
//         images: [], // can add URLs later
//         isAvailable: true,
//       });

//       await listing.save();
//     }

//     console.log("✅ Laptop listings seeded successfully.");
//     process.exit();
//   } catch (err) {
//     console.error("Error during seeding:", err);
//     process.exit(1);
//   }
// };

// seedLaptops();

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { Laptop } from "../models/laptop.model.js";
import { LaptopListing } from "../models/laptopListing.model.js";
import { Seller } from "../models/seller.model.js";

dotenv.config();

// __dirname workaround for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedLaptops = async () => {
  try {
    // ✅ Use `dbName` option instead of adding it to the URI string
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME
    });

    console.log(`✅ Successfully connected to MongoDB Database`);

    const rawPath = path.join(__dirname, "../../data/clean_laptop_data.json");
    const laptopData = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

    const sellers = await Seller.find();
    if (!sellers.length) {
      console.error("❌ No sellers found in the database.");
      return;
    }

    await LaptopListing.deleteMany();

    for (const item of laptopData) {
      const name = `${item.Company} ${item.Product}`;
      const brand = item.Company;

      let laptop = await Laptop.findOne({ name, brand });
      if (!laptop) {
        laptop = await Laptop.create({ name, brand });
      }

      const specs = {
        processor: item.Cpu,
        ram: item.Ram,
        storage: item.Memory,
        gpu: item.Gpu,
        screen: item.ScreenResolution,
        weight: item.Weight,
        os: item.OpSys,
        type: item.TypeName,
        touch: item.Touch,
        gpuType: item["GPU-type"]
      };

      const listing = new LaptopListing({
        laptop: laptop._id,
        seller: sellers[Math.floor(Math.random() * sellers.length)]._id,
        price: item.Price_in_PKR,
        condition: "Used",
        quantityAvailable: Math.floor(Math.random() * 5) + 1,
        specifications: specs,
        images: [], // can add URLs later
        isAvailable: true,
      });

      await listing.save();
    }

    console.log("✅ Laptop listings seeded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
};

seedLaptops();
