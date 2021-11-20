const mongoCollections = require('../config/mongoCollections');
const restaurants = mongoCollections.restaurants;
let { ObjectId } = require('mongodb');

function checkNumFormat(phoneNumber){
   let i = phoneNumber.search(/^\d{3}-\d{3}-\d{4}$/);
   if(i === -1) throw "Invalid Phone number format";
}
function checkWebFomat(website){
    let i = website.search(/^http:\/\/www\..{5,}\.com$/);
   if(i === -1) throw "Invalid Website format";
}

function checkPricerange(priceRange){
    let i = priceRange.search(/^\${1,4}$/);
    if(i === -1) throw "priceRange is not between '$' to '$$$$";
}

function checkCuisines(cuisines){
    if(!Array.isArray(cuisines)) throw "Cuisines must be an array";
    if(cuisines.length < 1) throw "Cusines must have atleast one element";
    cuisines.forEach(element => {
        if(!(typeof element === 'string') || element == '') throw "Cuisines must have only strings and no empty strings allowed";
    });
}
function checkServiceOptions(serviceOptions){
    if(!(typeof serviceOptions === 'object')) throw "ServiceOptions should be an object";
    for(let i in serviceOptions){
        if(!(typeof serviceOptions[i] === 'boolean')) throw "serviceOptions should have boolean values";
    }
}
module.exports = {
    async get(id,flag = 0){

            if (!id) throw 'You must provide an id to search for';
            if (typeof id !== 'string') throw "Id must be a string";
            if (id == '') throw "Id must be provided";
            if(!ObjectId.isValid(id)) throw "id  provided is not a valid ObjectId";
            let parsedId = ObjectId(id);
            const restaurantCollection = await restaurants();
            const restnt = await restaurantCollection.findOne({ _id: parsedId });
            if (restnt === null) throw 'No restaurant with that id';
            restnt['_id'] = restnt['_id'].toString();
            return restnt;
     
        // const restaurantCollection = await restaurants();
        // const restnt = await restaurantCollection.findOne({ _id: id });
        // if (restnt === null) throw 'No restaurant with that id';
        // restnt['_id'] = restnt['_id'].toString();
        // return restnt;
    },
    async create (name, location, phoneNumber, website, priceRange, cuisines, serviceOptions){
        if(!name || !location || !phoneNumber || !website || !priceRange || !cuisines || !serviceOptions )
            throw "All fields need to have valid values";
        if(!(typeof name === 'string') ||  !(typeof location === 'string') || !(typeof phoneNumber === 'string') || !(typeof website === 'string')|| !(typeof priceRange === 'string') )
        throw "name, location, phoneNumber, website, priceRange should be of type string";
        if(name === ''|| location === '' ||  phoneNumber === '' ||  website === ''||  priceRange === '' )
        throw "name, location, phoneNumber, website, priceRange should not be an empty string";
        checkNumFormat(phoneNumber);
        checkWebFomat(website);
        checkPricerange(priceRange);
        checkCuisines(cuisines);
        checkServiceOptions(serviceOptions);
        const restaurantCollection = await restaurants();
        let newRestaurant = { name: name,
            location: location,
            phoneNumber: phoneNumber,
            website: website,
            priceRange: priceRange,
            cuisines: cuisines,
            overallRating: 0,
            serviceOptions: serviceOptions,
            reviews: [] };

        const insertInfo = await restaurantCollection.insertOne(newRestaurant);
        if (insertInfo.insertedCount === 0) throw 'Could not add new restaurant';
        const newId = insertInfo.insertedId; 
        const restaurant = await this.get(newId.toString());
        // restaurant['_id'] = restaurant['_id'].toString();
        return restaurant;
    },
    async getAll(){
        
        const restaurantCollection = await restaurants();

        const restaurantList = await restaurantCollection.find({},{ projection: { _id: 1, name: 1} }).toArray();
        restaurantList.forEach(element => {
            element['_id'] = element['_id'].toString();
        });

    return restaurantList;
    },
    
    async remove(id){
        if (typeof id !== 'string') throw "id must be a string";
            if (id == '') throw "Id must be provided";
            if(!ObjectId.isValid(id)) throw "id  provided is not a valid ObjectId";
            let parsedId = ObjectId(id);
            const restaurantCollection = await restaurants();
            const restnt = await restaurantCollection.findOne({ _id: parsedId });
            const deletionInfo = await restaurantCollection.deleteOne({ _id: parsedId });
            if (deletionInfo.deletedCount === 0) {
                throw `Could not delete restaurant with id of ${id}`;
              }
              
        return {restaurantId: restnt._id, deleted: true};
    },
    async update(id, name, location, phoneNumber, website, priceRange, cuisines, serviceOptions){

        if(!id || !name || !location || !phoneNumber || !website || !priceRange || !cuisines || !serviceOptions )
            throw "All fields need to have valid values";

        if(!(typeof id === 'string') || !(typeof name === 'string') ||  !(typeof location === 'string') || !(typeof phoneNumber === 'string') || !(typeof website === 'string')|| !(typeof priceRange === 'string') )
        throw "name, location, phoneNumber, website, priceRange should be of type string";

        if(id === ''||name === ''|| location === '' ||  phoneNumber === '' ||  website === ''||  priceRange === '' )
        throw "name, location, phoneNumber, website, priceRange should not be an empty string";

        checkNumFormat(phoneNumber);
        checkWebFomat(website);
        checkPricerange(priceRange);
        checkCuisines(cuisines);
        checkServiceOptions(serviceOptions);
        const restaurantCollection = await restaurants();

        const updatedRestaurantData = {
            name: name,
            location : location,
            phoneNumber : phoneNumber,
            website : website,
            priceRange : priceRange,
            cuisines : cuisines,
            serviceOptions : serviceOptions
        };
        if(!ObjectId.isValid(id)) throw "id  provided is not a valid ObjectId";
            let parsedId = ObjectId(id);
            // const restaurantCollection = await restaurants();
            
            const updateInfo = await restaurantCollection.updateOne(
                { _id: parsedId },
                { $set: updatedRestaurantData }
              );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
                 throw 'Update failed';
            return await this.get(id);
    },
    checkNumFormat,
    checkWebFomat,
    checkPricerange,
    checkCuisines,
    checkServiceOptions
};