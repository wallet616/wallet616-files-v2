function foo(arg1) {
    console.log("1");
    console.log(arg1);
}

function boo() {
    console.log("3");
}

(foo)("2");

foo => boo;

var ad1 = () => ({ a: 1, b: 2 });
var ad2 = () => { return 123; };
var ad3 = () => ad2;
var ad4 = (zz) => { return zz; };

var test = ((nez, ad) => { console.log(this); return nez + ad; });

var aaaaa = function(params) {
    console.log("dasD");
};

aaaaa();

//foo();

ad4(3)

//console.log((ad4)(3));

console.log(test(5, 4));



var myFirstPromise = new Promise(function(resolve, reject) {
    //We call resolve(...) when what we were doing async succeeded, and reject(...) when it failed.
    //In this example, we use setTimeout(...) to simulate async code. 
    //In reality, you will probabally using something like XHR or an HTML5 API.
    setTimeout(function() {
        resolve("Success!"); //Yay! Everything went well!
    }, 500);
});

myFirstPromise.then(function(successMessage) {
    //successMessage is whatever we passed in the resolve(...) function above.
    //It doesn't have to be a string, but if it is only a succeed message, it probably will be.
    console.log("Yay! " + successMessage);
});

function aaa(element) {
    element = $(element);
    element.data("m-panel-status", "inactive");
    console.log(element.data("m-panel-status"));
}



/*
var args = [1, 2, 3];

var ready = (arg1) => { console.log(arg1); };

//async function redd() {};
new Promise(() => {
    for (var z in args) {
        for (var i = 0; i < z * 10000000; i++) {
            var n = 99 * 99 * 99 * 99;
        }
        console.log(z);
    }
    ready(true);
});

redd();

console.log();


var obj = {
    i: 10,
    b: () => console.log(this.i, this),
    c: function() {
        console.log(this.i, this, this.d());
    },
    d: () => { return 8 + 9; }
}
obj.b(); // prints undefined, Window
obj.c(); // prints 10, Object {...}

var request = require('request');

*/

function createGrid(width, height, value) {
    var x = new Array(width);
    for (var i = 0; i < width; i++) {
        x[i] = new Array(height);
    }
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            x[j][i] = value;
        }
    }
    return x;
}

createGrid(2, 3, 5);