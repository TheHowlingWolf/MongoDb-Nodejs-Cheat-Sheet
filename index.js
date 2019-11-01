////////////////////////////////// MongoDb For Nodejs Cheat Sheet///////////////////////////////////

                        //Remember To use :::: npm i :::: to install all node modules//

/*
///////////////////////// Handling MongoDb Using Mongoose in LocalHost/////////////////////////////
            Name:Debraj Sengupta 
            Company: Codepth
            Position: Senior Web Developer
            Type:Cheat Sheet
            Source and thanks to: Nodejs by Mosh Hamedani ('Best Teacher for Node')
///////////////////////////////////////////////////////////////////////////////////////////////////
*/


////////////////////////////////////Installing Mongodb Locally////////////////////////////
/*
                    1.Download Mongodb And install from official website
                    2.Download Mongodb compass and install from official website
                    3.Go to program files-> Mongodb -> Server -> Version (recent 4.x) -> bin
                    4.Copy the Directory path
                    5.Search for advance system settings
                    6.Go to Environment Variables -> System Variables -> Klick Path from list -> Edit -> New -> Paste the dir url -> save and ok exit 
                    7.close all command prompt and now open Cmd and type after colone ::::> md c:\data\db  <::::: press enter
                    8.again type ::::> mongod <::::: and mongodb is running
                    9.open mongodb compass click next->next continue then on get started and on reg page keep all fields as they are and connect 
                    10.sometimes mongod stops running in background then use step 8 to again start it you can check on processes in task m
*/






//////////////////Creating Schema/////////////////////

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground',{useNewUrlParser:true,useUnifiedTopology:true}) //it returns a promise so we call then when promise is fullfilled and catch if not.... 
//first property has the url of the mongodb database here we are using localhost and for real apps we get the link from MongoDb.com->login->Atlas->Sandbox->connect->Connect-Your-Application->connection-string-only->copy paste it in instead of localhost link 
//Remember to change <password> in the pasted link with the user set password and enable whitelist ips recommended to use 0.0.0.0 and the second property is object with two attributes useNewUrlParser and useUnifiedTopology 
//set them to true this is default syntax for Mongodb new release and enables to use new modules and overrules the depcricated ones!
    .then(()=> console.log('Connected to MongoDB'))//if connected then show message
    .catch(()=> console.error('Could not Connect to Mongo Database',err)); //if connection failed then show message log error

const courseSchema = new mongoose.Schema({ //makes the schema for our project
    //for instance we pass objects where we specify the keys of the schema
    name: String, //string type
    author: String,
    tags: [String], //array of strings
    date: {type: Date, // date type
        default:Date.now //initialize the field with the timestamp of creation by default::: we can have many properties to one attribute of the schema
        },
    isBoolean: Boolean //boolean
    // We can use String,Number,Date,Buffer(for storing binary numbers),Boolean,ObjectId (unique id), Array
});






////////////////////Creating Model Of Schema//////////////////////
//we need to compile this schema into a model by creating instances of the schema
//for this we need to model this schema into a class

const Course = mongoose.model('Course', courseSchema); //'Course' database name in mongodb, courseSchema is the model

//async function why? below next section
async function createCourse(){
const course = new Course({ //acts as a object of the class
    name: 'Node js Course',
    author:'Debraj',
    tags: ['Nodejs', 'Backend'], //we can have multiple values in mongo to create many-to-many relations
    isBoolean: true
});






///////////////////Saving Instance of Model///////////////////////////////////
// to save it to database we use .save() but here we deal with async operation because it will 
//take time to access the database because we are accessing the file system

//this method returns a promise we can await this till occurs i.e result is reflected
const result = await course.save();
console.log(result); 
//Remember whenever we use await we need to use async function

}

//createCourse(); to create above uncomment it to use//






//////////////////Querying Documents from Collections/////////////////////////
//retrieve docs from mongo

async function getCourses() {
   const findCourses = await Course.find({
       author:'Debraj',isBoolean:true //these are filters which will select only required ones 
   }); //this document query object is like a promise so it has a then() and catch() so we can await it to get the values
    console.log(findCourses);//find will return the array of objects
}

//getCourses(); to get above uncomment it to use//







//////////////////Querying Documents from Collections Advance/////////////////////////
//Retrieve docs from mongo with specific fields
//lets say each instance has 50 properties but we need only specific like name
async function getCourses() {
    const findCourses = await Course.find({ //since it returns document query so we can sort the objects by name and have a limit upto 10
        author:'Debraj',isBoolean:true  
    })
    .limit(10) // max docs to show
    .sort({name : 1}) //sorting these docs by name 1 is for asending order and -1 for descending order
    .select({name:1,tags:1}); // to select the properties to show set them to 1
    console.log(findCourses);
}

//getCourses(); to get above uncomment it to use//








/////////////////Querying Documents from Collections using complex filters//////////////////////////
/*
            /////Mongo Db Operators for comparisons
            1. eq (equal)
            2. ne (not equal)
            3. gt (greater than)
            4. lt (less than)
            5. gte (greater than or equal to)
            6. lte (less than or equal to)
            7. in  (presents)
            8. nin (not in)
*/
//to get courses that are more than 10$
//in js a object is basically is a key-value of pairs
async function getCourses() {
    const findCourses = await Course.find({ 
          
        //price: 10 here our key is price and our value is 10 with this filter we can only get objects which having price =10 not less or more
        
        //to put conditions we need to pass an object as an argument
        //price: { $gt: 10 } this object is again a key value pair so we can use comparators as key and values
    
        //to get objects greater than 10 and less than or equal to 20
        //price: { $gt: 10 , $lte:20}
        
        //to get objects/courses with price 10$,15$ or 20$
        price:{ $in: [10,15,20]} //use the concept of js constructs to think
        
        //to use each condition please remove comments
    });
    
    console.log(findCourses); 
} 

//getCourses(); to get above uncomment it to use//








/*
            ///////Mongo Db Logical Operators/////
            1. or
            2. and
*/

// To get courses that authored by debraj or they are published
async function getCourses() {
    const findCourses = await Course.find()
    .or([ {author: 'debraj'}, { isBoolean: true} ]) // in js we use array constructors to store multiple elements or values similarly we use it here where each object in array ' {} ' is a filter 
    /*
        similar to or method we use and([{},{}]) method
    */
    .limit(10) 
    .sort({name : 1})
    .select({name:1,tags:1});
    console.log(findCourses);
}

//getCourses(); to get above uncomment it to use//







/*
            ///////////Regular Expressions////////////
            like finding authors whose name starts with Debraj or codepth
            or ends with Sengupta
            
            ::Filter Pattern::
            /pattern/

            ::Symbols used::
            1.Starts with something:: ^
            eg: /^Debraj/
            2.Ends with something:: $
            eg: /Sengupta$/
            3.Contains Debraj:: .*%.* where % is String to search
            eg: /.*Debraj.* /

            all of them is case sensitive to make it case insensitive use /pattern/i add i at last of pattern
*/

async function getCourses() {
    const findCourses = await Course
    //.find({ author:'Debraj' }) this will return only whose authors are exactly 'Debraj' not 'Debraj Sengupta' or 'Debraj Codepth'
    //to get the result we use **For resulting objects whose authors starts with mosh
    
    // with author filter instead of string we put a regular expression whose pattern is " /pattern/ "
    .find({ author: /^Debraj/ }) //case sensitive
    //.find({author: /Sengupta$/i }) ends with example - case insenstitive
    //.find({author: /.*Debraj.*/i }) contains example -case insensitive
    .limit(10)
    .sort({name : 1})
    .select({name:1,tags:1});
    console.log(findCourses);
}

//getCourses(); to get above uncomment it to use//







/////////////////To Get Total Count of docs/////////////////////
async function getCourses() {
    const findCourses = await Course.find({ //since it returns document query so we can sort the objects by name and have a limit upto 10
        author:'Debraj',isBoolean:true  
    })
    .limit(10)
    .sort({name : 1})
    // .select({name:1,tags:1}); instead use count
    .count();  //returns count of docs that match the filters
    console.log(findCourses);
}






/////////////////Pagination////////////////////////
/*
            we use skip() with limit() to use pagination

            we need to const pageNumber which defines the number of pages
            and pageSize i.e. what each page size should be
    */


async function getCourses() {
    const pageNumber = 2;
    const pageSize =10;
    //In real world application we pass these values with each requests calls in RESTful APIs
    //eg: /api/courses?pageNumber=26&pageSize=10
    //here in order to implement we use like this
    const findCourses = await Course.find({ //since it returns document query so we can sort the objects by name and have a limit upto 10
        author:'Debraj',isBoolean:true  
    })
    .skip((pageNumber-1)*pageSize) // assuming page starts from 1 this will skip all page 1 values
    .limit(pageSize) //change limit to page size so by this we get docs in a given page
    .sort({name : 1})
    .select({name:1,tags:1});
    console.log(findCourses);
}




///////////////////////MongoDb Update/////////////////////////

async function updateCourse(id){
    /*:::::Approaches Used::::
        /////////////// 1st Approach Query First ////////////////
        ////////////// 2nd Approach Update First///////////////////////
        */

        /*      /////////////// Approach Query First ////////////////
                1.first retrieve the docs with findById()
                2.Modify its properties
                3.Call save()
            */
    
    //get course with given id
    const course = await Course.findById(id); // since find() is a promise we should use await
    if(!course) return; // if not found return or give error
    //else set updating values.... this could be done in two ways first :::
    course.isBoolean = true;
    course.author = 'New Codepth';
    /* Or we can use set method
    course.set({
        isBoolean:true,
        author: 'New Codepth'
    });
    both works the same
    */
    const result = await course.save();
    console.log(result);
}

// updateCourse('put_id') remove comment and give the id in place of put_id to use




/*      ////////////// 2nd Approach Update First///////////////////////
            1.use update() instead findById()
            2.Modify its properties
            3.Call save()
        */
async function updateCourse(id){
/*:::::Steps::::
/////////////// 1st Approach Query First ////////////////
////////////// 2nd Approach Update First///////////////////////
*/

/*      /////////////// 1st Approach Query First ////////////////
        1.first retrieve the docs with findById()
        2.Modify its properties using mongodb update operators
            
                    ///////// Update Operators/////////////
                    1. $currentDate :: sets the val of the field to current date ,either as a date or a timestamp
                    2.$inc :: increments the val of the field by specified amt
                    3.$min :: only updates the field if the specified val is less than the existing field val
                    4.$max :: only updates the field if the specified value is greater than the existing field value
                    5.$mul :: multiplies the value of the field by the specified amount
                    6.$rename :: renames a field
                    7.$set :: sets the value of a field in a document
                    8.$setOnInsert :: Sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents
                    9.$unset :: Removes the Specified field from Document
                    10.many more at mongodb document website
        3.We dont have to Call save() explicitly it will do it automatically 
    */

    const result = await Course.update({ //remember we are getting the result directly of the change so we are using const result instead const course
        //isBoolean: false to reflect changes to all files having isBoolean = false
        _id: id}, //to reflect changes to a particular id
        {
          $set: {
              author: 'Debraj',
              isBoolean:false
          }  // this will first check the id from {_id:id} and the update the values as per the {$set:values}
        });
    console.log(result);
}

// updateCourse('put_id') remove comment and give the id in place of put_id to use



//// Sometimes we need to get the record which has been updated
//// for that instead of update() we use findByIdAndUpdate()

async function updateCourse(id){
//below if we log the course we will get the object with values before updation
    const course = await Course.findByIdAndUpdate({
        _id: id}, {
            $set: {
                author: 'Debraj',
                isBoolean:false
            }});
    console.log(course);

    //to get the updated course document add another property to find function i.e. {new:true} ::::
    /*
            const course = await Course.findByIdAndUpdate({
        _id: id}, { $set: {
                author: 'Debraj',
                isBoolean:false
                            }},{new: true});
    console.log(course);
    */
}


// updateCourse('put_id') remove comment and give the id in place of put_id to use









////////////////////////////Removing a Document/////////////////////////////
/*
        Methods to delete

        ///Methods that doesnt return the deleted doc

        1. deleteOne({put_id to delete specific})

            put_filter instead of put_id which is more generic like isBoolean : false :::: there may be many records with this field 
            then this will find the first record and delete it

        2.deleteMany({put_filter})
        this will delete all records with matching field unlike deleteOne

        ///Methods that return the deleted doc

        1.findByIdAndRemove(put_id)
        this is a promise that returns the record that is deleted and we can store it and log it to see
*/

async function removeCourse(id){
    const result = await Course.deleteOne({_id:id}); // this is also a promise as above
    console.log(result);

    /*
    const result = await Course.deleteMany({isBoolean:false});
    console.log(result);
    */

    /*
    const course = await Course.findByIdAndRemove(id);
    console.log(course);
    //this will show the deleted record if there is no course with the id present then it is null
    */
}

// removeCourse('put_id') remove comment and give the id in place of put_id to use


////////////////////////////////// Mongoose Cheat Sheet Coming Next///////////////////////////////////
