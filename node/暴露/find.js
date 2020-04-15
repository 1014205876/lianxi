
var Person = require("./person.js");
class Find extends Person {
    constructor(name,age) {
        super (name,age);
        console.log(123)
    }
    parentInfo() {
        console.log('parent')
        this.getInfo();
    }
}
// var finds=new Find(12,23);
// finds.parentInfo();
module.exports=Find;