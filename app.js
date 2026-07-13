const express = require('express');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:false}));
const {check, validationResult} = require('express-validator'); // ES6 standard for destructuring an object

app.get('/', (req, res) => {
res.render('form');
});

//To handle the form info
app.post('/process',[
  check('name', 'Must have a name').notEmpty(),
  check('email', 'Must have email').isEmail(),
  check('lunch', 'Should select at least one').notEmpty(),
  check('tickets', 'Should select at least one').notEmpty(),
  check('campus', 'Should select a campus').notEmpty(),
  check('postcode',"Invalid postal code").matches(/^[a-zA-Z]\d[a-zA-Z]\s\d[a-zA-Z]\d$/),
  check('phone',"Invalid phone number").matches(/^\d{3}(\s|-)\d{3}(\s|-)\d{4}$/),

  check('lunch').custom(async (value, {req})=>{
    if (value == "yes" && req-body.tickets < 2){
      throw new Error('If lunch selected, need at least 2 tickets');
    }
  })
  ],
(req, res) => {
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      //When there are errors in form
      res.render('form', {errorInfo: errors.array()} );

  }else{

      //When there's no errors
    var name = req.body.name;
    var email = req.body.email;
    var postcode = req.body.postcode;
    var phNo = req.body.phone;
    var needLunch = req.body.lunch;
    var numTickets = req.body.tickets;
    var campus = req.body.campus;

    console.log(`${needLunch} --${numTickets} -- ${campus}`);

    res.redirect('/');

  }
});


app.listen(3000, () => {
console.log('Server running on http://localhost:3000');
});