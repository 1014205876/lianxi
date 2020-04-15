function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.getInfo = function () {
    console.log(this.name, this.age);
}
module.exports = Person