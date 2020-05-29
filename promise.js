run2();

async function run2() {
  var x = await myFunction();
  console.log(x);
}


function resolveAfter() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved')
    }, 2000)
  })
}

async function myFunction() {
  try {
    console.log('Call');
    var result = await resolveAfter()
    console.log(result);
  } catch (e) {
    console.log(err)
  }
  return result;
}

function run() {
  new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1000);
  })
      .then(function (result) {
        console.log(result); // 1
        return new Promise(function (resolve, reject) {
          setTimeout(() => resolve(result * 2), 1000);
        })
      })
      .then(function (result) {
        console.log(result); // 2
        return new Promise(function (resolve, reject) {
          setTimeout(() => resolve(result * 2), 1000);
        })
      })
      .then(function (result) {
        console.log(result); // 4
        result * undef
        return new Promise(function (resolve, reject) {
          setTimeout(() => resolve(result * 2), 1000);
        })

      })
      .catch((e) => {
        console.log("Error caught: ", e)
      })
}

function run1() {
  var p1 = new Promise((resolve, reject) => {
    setTimeout((param) => {
      console.log(param)
      resolve(param)
    }, 1000, 'un');
  })
  var p2 = new Promise((resolve, reject) => {
    setTimeout((param) => {
      console.log(param)
      resolve(param)
    }, 1000, 'deux');
  })
  var p3 = new Promise((resolve, reject) => {
    setTimeout((param) => {
      console.log(param)
      resolve(param)
    }, 1000, 'trois');
  })
  var p5 = new Promise((resolve, reject) => {
    reject('reject');
  })

  Promise.all([p1, p2, p3, p5]).then((values) => {
    console.log(values)
  }).catch((e) => {
    console.log("cought")
  })
}