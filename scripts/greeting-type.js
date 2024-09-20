"use strict";

/** 
 * Say hello to someone.
 * @param {string} person The person's name.
*/

function greeter(person) {
return "Hello, " + person;
}

const user1 = "Jane User";
console.log(greeter(user1)); // => Hello, Jane User

const user2 = [0, 1, 2];
console.log(greeter(user2)); // Argument of type 'number[]' is not assignable to parameter of type

