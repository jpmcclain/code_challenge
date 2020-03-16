const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema(
    {
        ID: {
            type: Number,
            unique: true
        },
        Description: String,
        lastSold: String,
        ShelfLife: String,
        Department: String,
        Price: String,
        Unit: String,
        xFor: Number,
        Cost: String,
    },
    { collection : 'products' }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("postData", DataSchema);
