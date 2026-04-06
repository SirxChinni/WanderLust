const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing");
const path = require('path');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require('joi');
const { listingSchema } = require("./schema");

const Review = require("./models/review");


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

// Validation Function

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

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
app.get("/listings", wrapAsync( async (req, res) => {
        let allData = await Listing.find();
        res.render("listings/index", { allData }); 
    }
));

//Individual Show
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }

    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/show", { listing });
}));


//Edit route
app.get("/listings/:id/edit",wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}
));

app.put(
    "/listings/:id",
    validateListing, 
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        res.redirect("/listings");
    })
);

app.delete("/listings/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// Create Route
app.post(
    "/listings",
    validateListing, // 🔥 ADD THIS
    wrapAsync(async (req, res) => {

        let newListing = new Listing(req.body.listing); // 🔥 FIXED
        await newListing.save();

        res.redirect("/listings");
    })
);


//Reviews


//POST Route
app.post("/listings/:id/reviews", async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    // res.send("Review saved");
    res.redirect(`/listings/${listing.id}`);
});



app.get("/",(req,res)=>{
    res.render("listings/home");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error", {err});
});


