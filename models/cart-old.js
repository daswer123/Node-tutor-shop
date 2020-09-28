const path = require("path");
const fs = require("fs");
const e = require("express");

console.log(process.mainModule.path)
const p = path.join(
    process.mainModule.path,
    "data",
    "cart.json"
)

class Cart{
   static async add(course){
        const cart = await Cart.fetch();

        const index = cart.courses.findIndex(elem => elem.id === course.id)
        const isHere = cart.courses[index]

        if (isHere){
            isHere.count ++
            cart.courses[index] = isHere
        } else {
            course.count = 1;
            cart.courses.push(course)
        }

        cart.price += +course.price

        return new Promise((resolve,reject) =>{
            fs.writeFile(
                p,
                JSON.stringify(cart),
                err => {
                    if (err) reject(err)
                    resolve()
                }
            )
        })
    }

    static async remove(id){
        const cart = await Cart.fetch();
        
        const index = cart.courses.findIndex(elem => elem.id === id);
        const course = cart.courses[index];

        if(course.count === 1){
            cart.courses = cart.courses.filter(elem => elem.id !== id)
        } else {
            cart.courses[index].count--
        }

        cart.price -= course.price

        return new Promise((resolve,reject) =>{
            fs.writeFile(
                p,
                JSON.stringify(cart),
                err => {
                    if (err) reject(err)
                    resolve(cart)
                }
            )
        })
    }
    
    static async fetch(){
        return new Promise((resolve,reject) => {
            console.log(p)
            fs.readFile(
                p,
                "utf-8",
                (err,content) => {
                    if (err) { reject(err) } 
                    else {
                        resolve(JSON.parse(content))
                    }
                    
                }
            )
        })
    }
}

module.exports = Cart