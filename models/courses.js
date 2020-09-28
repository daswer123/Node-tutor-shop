const {Schema,model} = require("mongoose");


const options = {
    toObject : {
        virtuals : true
    },
    toJSON : {
        virtuals : true
    }
}

const courses = new Schema({
    
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    img  : String,
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
    
},options)

module.exports = model("Courses",courses)
























// const uuid = require("uuid")
// const fs   = require("fs");
// const path = require("path");

// class Courses {
//     constructor(title,price,url){
//         this.title = title;
//         this.price = price;
//         this.url = url;
//         this.id = uuid.v4();
//     }

//     toJson(){
//         return {
//             title : this.title,
//             price : this.price,
//             url   : this.url,
//             id    : this.id
//         }
//     }

//     static async update(course){
//         const courses = await Courses.getAllData();
//         const inx = courses.findIndex(elem => elem.id === course.id);
//         courses[inx] = course;

//         return new Promise((resolve,reject) => {
//             fs.writeFile(
//                 path.join(__dirname,"../data","db.json"),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) { reject(err) }
//                     resolve("complited")
//                 }
//             )
//         })

//     }

//     save = async () =>{
//         const courses = await Courses.getAllData()

//         courses.push(this.toJson())

//         return new Promise((resolve,reject) => {
//             fs.writeFile(
//                 path.join(__dirname,"../data","db.json"),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) { reject(err) }
//                     resolve("complited")
//                 }
//             )
//         })
//     }

//     static getAllData = async () =>{
//         return new Promise((resolve,reject) => {

//             fs.readFile(
//                 path.join(__dirname,"../data","db.json"),
//                 "utf-8",
//                 (err,content) => {
//                     if (err) reject(err);
//                     resolve(JSON.parse(content))
//                 }
//             )
//         })
//     }

//     static getOneItem = async (id) =>{
//         const courses = await Courses.getAllData()
//         return courses.find(elem => elem.id === id)
//     }
// }

// module.exports = Courses
