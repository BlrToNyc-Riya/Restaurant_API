const mongoCollections = require('../config/mongoCollections');
const restaurants = mongoCollections.restaurants;
let { ObjectId } = require('mongodb');
const restaurantData = require('./restaurants');
function checkRating(rating) {
    let r = parseInt(rating);
    if(isNaN(r)) throw "rating should be a number";
    if(rating<1 || rating>5) throw "rating should be in range of 1-5";
}
function checkDate(dateOfReview){

    if(dateOfReview.length != 10) throw "Invalid Date";
    let d = dateOfReview.split("/");
    if(!d[1] || !d[2]) throw "Invalid date";
    const x = new Date(dateOfReview);
    let dateOfRev = x.toLocaleDateString("en-US");
    if(dateOfRev === "Invalid Date") throw "Invalid Date";
    let month = parseInt(d[0]);
    let date = parseInt(d[1]);
    let year = parseInt(d[2]);
    let y = new Date();
    let Today = y.toLocaleDateString().split("/");
    let monthToday= parseInt(Today[0]);
    let dateToday = parseInt(Today[1]);
    let yearToday = parseInt(Today[2]);
    if(year<yearToday || year >yearToday) throw "Review should be of today's date";
    if(month<monthToday || month>monthToday) throw "Review should be of today's date";
    if(date<dateToday || date>dateToday) throw "Review should be of today's date";

}

async function create(restaurantId, title, reviewer, rating, dateOfReview, review) {
    if(!restaurantId || !title || !reviewer || typeof rating==undefined || !dateOfReview || !review)
        throw "All fields need to be provided";
        if(!(typeof restaurantId === 'string') ||  !(typeof title === 'string') || !(typeof reviewer === 'string') ||  !(typeof dateOfReview === 'string') || !(typeof review === "string") )
        throw "name, location, phoneNumber, website, priceRange should be of type string";
        if(restaurantId === ''|| title === '' ||  reviewer === '' ||  dateOfReview === ''||  review === '' )
        throw "name, location, phoneNumber, website, priceRange should not be an empty string";    
        if(!ObjectId.isValid(restaurantId)) throw "resturantId is not a valid ObjectId";
        const restaurantCollection = await restaurants();
        let parsedId = ObjectId(restaurantId);
        const restnt = await restaurantCollection.findOne({ _id: parsedId });
        if (restnt === null) throw 'No restaurant with that id';
        checkRating(rating);
        checkDate(dateOfReview);    
        let newReview = {
            _id: ObjectId(),
            title: title, 
            reviewer: reviewer, 
            rating: rating, 
            dateOfReview: dateOfReview, 
            review: review
        };
        const updateInfo = await restaurantCollection.updateOne(
            { _id: parsedId  },
            { $addToSet: { reviews: newReview }}
          );
          if(!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw "Could not add a new review";
            const restnt1 = await restaurantCollection.findOne({ _id: parsedId });
            let sum = 0, count = 0;
            restnt1.reviews.forEach(element => {
                sum = sum + element.rating;
                count = count +1 ;
            });
            let avg = sum/count;
          const updateInfo_O = await restaurantCollection.updateOne(
                
                    { _id: parsedId  },
                    { $set: {overallRating: avg } }
                
            );  
                if(!updateInfo_O.matchedCount && !updateInfo.modifiedCount)
                throw "Could not update overall rating";    
            return await restaurantData.get(restaurantId);
    }

async function getAll(restaurantId) {
    if(!restaurantId) throw "Restaurant id not provided";
    if(!(typeof restaurantId === "string" )) throw "Restaurant id should be of type string";
    if(restaurantId === '') throw "Restaurant id cannot be empty";
    if(!ObjectId.isValid(restaurantId)) throw "resturantId is not a valid ObjectId";
    let parsedId = ObjectId(restaurantId);
    const restaurantCollection = await restaurants();
    const restnt = await restaurantCollection.findOne({ _id: parsedId });
    if(!restnt) throw "No restaurants found with given id";
    if(restnt.reviews.length === 0) {   
        return [];
    }
    else
    return restnt.reviews;
}   

async function get(reviewId) {

    if(!ObjectId.isValid(reviewId)) throw "resturantId is not a valid ObjectId";
    let parsedId = ObjectId(reviewId);
    const restaurantCollection = await restaurants();
    const restnt = await restaurantCollection.findOne({ "reviews._id": parsedId });
    if(!restnt) throw "restaurant not found";
    // return restnt;
    let resRev;
    restnt.reviews.forEach(element => {
        if(element._id.toString() === reviewId)
            resRev = element;
    });
    if(!reviewId) throw "Review not found";
    return resRev;
}

async function remove(reviewId) {
    if(!ObjectId.isValid(reviewId)) throw "resturantId is not a valid ObjectId";
    let parsedId = ObjectId(reviewId);
    const restaurantCollection = await restaurants();
    const restaurant = await restaurantCollection.findOne({"reviews._id": parsedId});
    let newReviews = [];
    restaurant.reviews.forEach(element => {
        if(element._id.toString() != reviewId)
            newReviews.push(element);
    });
    const updateInfo = await restaurantCollection.updateOne(
        { _id: restaurant._id },
        { $set: {reviews: newReviews }}
      );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
         throw 'Update failed';
    const restnt = await restaurantCollection.findOne({ _id: restaurant._id });
    let sum = 0, count = 0;
    restnt.reviews.forEach(element => {
        sum = sum + element.rating;
        count = count +1 ;
    });
    let avg = sum/count;
    const updateInfo_O = await restaurantCollection.updateOne(
                
        { _id:  restaurant._id },
        { $set: {overallRating: avg } });  
    if(!updateInfo_O.matchedCount && !updateInfo.modifiedCount)
    throw "Could not update overall rating";
    return {reviewId: reviewId,deleted: true };
}
module.exports = {
    create,
    getAll,
    get,
    remove,
    checkDate,
    checkRating
}