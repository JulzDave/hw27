var express = require('express');
var router = express.Router();
var fs = require('fs')

var isUserLogin = false;
var allclients = null;


/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect("/login.html")
});

router.get('/login.html', function (req, res, next) {
  if (req.session.username != undefined) {
    res.redirect("/members")
  }
});

router.post('/saveuser', (req, res, next) => {
  if (req.body.username != "" && req.body.password != "" && req.body.budget != "") {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    req.session.budget = req.body.budget;

    fs.readFile("C:\\Users\\Public\\savedata.json", (err, data) => {
      if (err) throw err;

      var textFromFile = "" + data;
      allclients = JSON.parse(textFromFile);

      //create new client
      let client = {
        username: req.session.username,
        password: req.session.password,
        budget: req.session.budget
      }
      allclients.push(client);

      var textToWrite = JSON.stringify(allclients, null, 2);


      fs.writeFile("c:\\users\\public\\savedata.json", textToWrite, (err, data) => {
        if (err) throw err;

        res.redirect("/members")
      });
    });
  }
  else {
    res.redirect("/login.html")
  }

});

router.get('/members', (req, res, next) => {
  if (req.session.username != undefined || req.session.password != undefined || req.session.budget != undefined) {
    res.send("<h1>Hello " + req.session.username + ", <br/> your current balance is = " + req.session.budget + " ils</h1>")
  }
  else {
    res.redirect("/login.html")
  }

});



router.post('/loguser', (req, res, next) => {
  if(req.body.logUsername != "" && req.body.logPassword != ""){
  fs.readFile("C:\\Users\\Public\\savedata.json", (err, data) => {
    if (err) throw err;

    var textFromFile =  ""+data;
    allclients = JSON.parse(data);

    var foundName = allclients.find(function (saved) {
      return saved.username === req.body.logUsername;
    });
  
    if (foundName.username == req.body.logUsername && foundName.password == req.body.logPassword) {

        req.session.username = foundName.username;
        req.session.password = foundName.password;
        req.session.budget =    foundName.budget;
        res.redirect("/members");
        
    }
    else {
      res.redirect("/login.html")
    }
  });
}
else {
  res.redirect("/login.html")
}
});




module.exports = router;