const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const Data = require('./data');
const PostData = require('./postData');
const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb://localhost:27017/inventory';

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// this method fetches all available data in the database
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

// this method removes existing data in the database
router.delete('/deleteData', (req, res) => {
    let data = new Data();
    const { ID, Description, lastSold, ShelfLife, Department, Price, Unit, xFor, Cost} = req.body;
    data.ID = ID;
    data.Description = Description;
    data.lastSold = lastSold;
    data.ShelfLife = ShelfLife;
    data.Department = Department;
    data.Price = Price;
    data.Unit = Unit;
    data.xFor = xFor;
    data.Cost = Cost;
    console.log(req.body)
    //console.log(req)
    Data.deleteOne(data, (err) => {
        if (err) return res.send(err);
        return res.json({ success: true, data: data });
    });
});

// this method adds new data to the database
router.post('/putData', (req, res) => {
    let data = new PostData();
    const { ID, Description, lastSold, ShelfLife, Department, Price, Unit, xFor, Cost} = req.body;
    data.ID = ID;
    data.Description = Description;
    data.lastSold = lastSold;
    data.ShelfLife = ShelfLife;
    data.Department = Department;
    data.Price = Price;
    data.Unit = Unit;
    data.xFor = xFor;
    data.Cost = Cost;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, error: false });
    });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
