const express = require('express');
const app = express();
const hbs = require('hbs')
const nocache = require('nocache')
const session = require('express-session')
app.use(express.static('public'));
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.use(express.json())



app.use(session({
    secret: "xyz",
    saveUninitialized: false,
    resave: true,
    cookie: {
        cookie: { secure: false }
    }
}))

app.use(nocache())

const username = 'admin'
const password = 'admin@123'



app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home')
    } else if (req.session.passwordwrong) {
        req.session.passwordwrong = false
        return res.render('login', { msg: "invalid credentials " })
    } else {
        return res.render('login',{msg:''})
    }
})

app.post('/verify', (req, res) => {
    if (req.body.username === username && req.body.password === password) {
        req.session.user = req.body.username
        req.session.passwordwrong=false
        return res.redirect('/home')
    }
    else {
        req.session.passwordwrong = true
        return res.redirect('/')
    }
})



app.get('/home', (req, res) => {
    if (req.session.user) {
        return res.render('home', { username: username })
    } else {
        if (req.session.passwordwrong) {
            req.session.passwordwrong = false
            return res.redirect('/')
        }
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    return res.render('login',{msg:'logout'})
})
app.listen(3000, () => console.log('server running - http://localhost:3000')) 