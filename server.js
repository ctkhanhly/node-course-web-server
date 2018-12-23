const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//process.env: store all environment variables as key-value pairs.
//if run locally, does not exist => default = 3000
//PORT is the variable used by heroku
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', hbs);
//how to register middleware: app.use, takes a function


//next exists so you can tell express when ur middleware function is done
//have as much middleware as you want registered to a single express app
//log sth to screen/ make a database request to make sure user is authenticated
//when do asyncronous, middleware will not move on until you call next
//e.g: empty function, req the page, it keeps loading b/c middleware
//does not call next yet, code below is not read

//middleware to keep track of how our server is working
app.use((req,res,next)=>{
    //req obj everything comes from the client: app,browser etc
    //http method: req.method and path: req.url
    //http://expressjs.com/en/4x/api.html#req
    //timeStamp
    var now = new Date().toString();
    //logger, everytime you click a new route in ur website
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    //takes a callback function at the end, not required, but will get
    //warning if dont have 1
    //.ico: icon
    fs.appendFile('server.log', log + '\n', (err)=>{
        if(err){
            console.log('Unable to append to server.log')
        }
    });
    next();
});
//if sth goes wrong, avoid calling next to next middleware
//res obj from middleware above and home below are the same
//stop everything after it from executing
//middleware is executed in the order you call app.use
//so still be able to see help.html above
app.use((req,res,next)=>{
    res.render('maintainance.hbs');
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear()
})

hbs.registerHelper('screamIt',(text, name)=>{
    return text.toUpperCase() + ', ' + name.toUpperCase()
})


/*
//no next above, this actual handler will never get executed
app.get('/',(req,res)=>{
   res.render('home.hbs',{
    pageTitle:  'Home Page',
    welcomeMessage: 'Welcome to Ly\'s first website'
   })
});
*/

//http://localhost:3000/about
app.get('/about',(req,res)=>{
    res.render('about.hbs',{
        pageTitle:  'About Page',
        //currentYear: new Date().getFullYear()
    });
});

app.get('/bad',(req,res)=>{
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.get('/project', (req,res)=>{
    res.render('project.hbs',{
        pageTitle: 'Project Page'
    })
});

//dynamic port rather than statically coded
//use an environment variable that heroku was gonna set
//change port everytime we run app/deploy
//heroku can set en variable on ur sys, ur node app can read that
//variable and use that as a port
app.listen(port, ()=>{
    console.log(`Server is up on port ${port}`);
});


//reorder app.use
//log req, check if in mantainance use
//if it's not in maintainance mode, the code for this will be commented out

//Version control: useful b/c when sth goes wrong and you need to go to
//previous state in the project where things were working, 
//also useful for backing up your work