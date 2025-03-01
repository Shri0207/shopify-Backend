const express = require('express');
const app = express();

const {User} = require('./model/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');

//connect to database
mongoose.connect('mongodb://127.0.0.1:27017/shopifyEcom')
.then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log('Database is not connected');
    console.log(err);
})


//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//task 1 ->create a regerstration route
app.post('/register', async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: 'Sum fields are missing'});
        }
        //check if user already exists
        const isUserAlreadyExists = await User.findOne({email});
        if(isUserAlreadyExists){
            return res.status(400).json({message: 'User already exists'});
        }else{
            //hash password
            const salt = await bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hashSync(password, salt);

            //jwt token
            const token = jwt.sign({email},'supersecret',{expiresIn: '365d'});

            //creating new user
            await User.create({
                name,
                email,
                password: hashPassword,
                token,
                role: 'user'
            });
            return res.status(201).json({message: 'User created successfully'});
        }
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
})
//task 2 ->create a login route

app.post('/login',async(req,res)=>{
    try{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: 'Some fields are missing'});
    }

    //user exists or not
    const use=await User.findOne({email});
    if(!user){
        return res.status(400).json({message: 'User does not exists'});
    }

    //compare entered password with hashed password
    const isPasswordValid=await bcrypt.compareSync(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message: 'Invalid password'});
    }

    //successfull login
    return res.status(200).json({
        message: 'Login successful',
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: user.token
    })
}
catch(err){
    console.log(err);
    return res.status(500).json({message: 'Internal server error'});
}
})




const PORT=8080;
app.listen(PORT, () => {
    console.log(`Server is connected to port ${PORT}`);
})