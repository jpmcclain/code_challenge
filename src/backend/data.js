const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        _id: {
          type: String
        },
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
        __v: {
            type: Number,
            select: false
        }
    },
    { collection : 'products' },
    { versionKey : false }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);
