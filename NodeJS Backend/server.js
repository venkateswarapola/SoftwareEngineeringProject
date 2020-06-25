const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Admin = require('./models/admin');
const Questions = require('./models/questions');
const Answers = require('./models/results');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const { registerValidAdmin, loginvalid, registerValid,questionValid,answerValid } = require('./validation')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/admin/register', async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //Checking email exists
    const adminexists = await Admin.findOne({ email: req.body.email });
    if (adminexists) return res.status(400).json({
        ok: false,
        message: "User already exists"
    });
    const { error } = registerValidAdmin(req.body);
    if (error) return res.status(400).json({
        ok: false,
        message: error.details[0].message
    })
    const user = new Admin({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
    });
    try {
        await user.save();
        res.json({
            ok: true,
            message: 'admin registered'
        });
    } catch (err) {
        res.json({
            ok: false,
            message: err
        });
    }
});
app.post('/admin/login', async (req, res, next) => {
    //Validation of input
    const { error } = loginvalid(req.body);
    if (error) return res.status(400).json({
        ok: false,
        message: error.details[0].message
    });
    //Check email of user
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({
        ok: false,
        message: "Email or password is wrong"
    });
    //Password compare
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({
        ok: false,
        message: "Email or password is wrong"
    });
    //Token Generation
    const token = jwt.sign({ _id: user._id }, process.env.Secret);
    res.header('auth-token', token).json({
        ok: true,
        message: "Login Successful",
        tokens: user._id
    })
});
app.post('/user/register', async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userexists = await User.findOne({ email: req.body.email });
    if (userexists) return res.status(400).json({
        ok: false,
        message: "User already exists"
    });
    const { error } = registerValid(req.body);
    if (error) return res.status(400).json({
        ok: false,
        message: error.details[0].message
    });
    const user = new User({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
    });
    try {
        await user.save();
        res.json({
            ok: true,
            message: 'user registered'
        });
    } catch (err) {
        res.json({
            ok: false,
            message: err
        });
    }
});
app.post('/user/login', async (req, res, next) => {
    const { error } = loginvalid(req.body);
    if (error) return res.status(400).json({
        ok: false,
        message: error.details[0].message
    });
    //Check email of user
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({
        ok: false,
        message: "Email or password is wrong"
    });
    //Password compare
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({
        ok: false,
        message: "Email or password is wrong"
    });
    //Token Generation
    const token = jwt.sign({ _id: user._id }, process.env.Secret);
    res.header('auth-token', token).json({
        ok: true,
        message: "Login Successful!",
        tokens: user._id
    });
});
app.post('/posts/respond',async (req, res, next) => {
    const answerexists = await Answers.findOne({ email: req.body.userId });
    if (answerexists) return res.status(400).json({
        ok: false,
        message: "already respoded"
    });
    const { error } = answerValid(req.body);
    if (error) return res.status(400).json({
        ok: false,
        message: error.details[0].message
    })
    const answers = new Answers({
        userId: req.body.userId,
        answers: req.body.answers,
        questionName: req.body.questionName,
    });
    try {
        await answers.save();
        res.json({
            ok: true,
            message: 'response saved'
        });
    } catch (err) {
        res.json({
            ok: false,
            message: err
        });
    }
});
app.post('/posts/ask', async (req, res, next) => {
    const questionexists = await Questions.findOne({ email: req.body.questionName });
    if (questionexists) return res.status(400).json({
        ok: false,
        message: "Question already exists"
    });
    const { error } = questionValid(req.body);
    if (error) return res.status(400).json({
        ok: false,
        message: error.details[0].message
    })
    const questions = new Questions({
        adminId: req.body.adminId,
        columns: req.body.columns,
        questionName: req.body.questionName,
    });
    try {
        await questions.save();
        res.json({
            ok: true,
            message: 'question uploaded'
        });
    } catch (err) {
        res.json({
            ok: false,
            message: err
        });
    }
});
app.get('/posts/allresponses', async(req,res,next)=>{
    try{
        const arr = [];
        for await (const doc of Answers.find(req.body)) {
            arr.push(doc.answers);
          }
          res.status(200).json({
              ok:true,
              responses:arr
          });
    }
    catch(err) {
        res.status(500).json({
          ok: false,
          message: err
        });
      }
})
app.get('/posts/show', async (req, res, next) => {
    try{
        const questions = await Questions.findOne(req.body);
    res.status(200).json({
        ok: true,
        columns: questions.columns,
      });
    }
    catch(err) {
        res.status(500).json({
          ok: false,
          message: err
        });
      }
});

const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err) => {
            console.log("DBconnected", err);
            console.log(mongoose.connection.readyState);
        }
    );
};
connectDB();
port = process.env.PORT || 3000
app.listen(port);