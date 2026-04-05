const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing");
const path = require('path');
const ejsMate = require('ejs-mate');


const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, "/public")));

app.engine('ejs',ejsMate);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then(()=>{
        console.log("Connected successfully");
    })
    .catch((err)=>{
        console.log(err);
    });

const port = 8080;

app.listen(port,()=>{
    console.log(`Server is listening to ${port}`);
});

// app.get("/testlisting",async (req,res)=>{
//     let samplelisting = new Listing({
//         title : "Brindavan",
//         description : "A happy residency.",
//         price : 2500000,
//         location : "Ranasthalam, Andhra Pradesh",
//         country  : "India",
//     });
//     await samplelisting.save();
//     console.log("Listing saved");
//     res.send("Test successful!");
// });

//Index Route


//New route

app.get("/listings/new", (req, res) => {
    res.render("listings/newListing");
});

//Index Route
app.get("/listings", async (req, res) => {
    let allData = await Listing.find();
    res.render("listings/index", { allData });
});

//Individual Show
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid listing ID");
    }
    try {
        let listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


//Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});

});

app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
});

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.post("/listings", async (req, res) => {
    let newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
});


app.get("/",(req,res)=>{
    res.render("listings/home");
});

