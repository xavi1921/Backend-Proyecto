const {Router} = require('express');

const router = Router();

const user=require('../models/user')

const jwt=require('jsonwebtoken');

router.get('/',(req,res)=> res.send('Hello world'))

router.post('/signup', async (req,res)=> {
    //req.body muestra lo que se envia desde el json de postman es el cuerpo de lo que envia
    const {email,password}=req.body;
    console.log(email,password);

    const newUser= new user({email,password});
    console.log(newUser);

    await newUser.save();

    const token=jwt.sign({_id:newUser._id},'secretKey')
    res.status(200).json({token})
})

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    const usr= await user.findOne({email})

    if(!usr) return res.status(401).send('El correo no existe');

    if(usr.password !== password) return res.status(401).send('La contraseña no existe')

    const token = jwt.sign({_id: usr._id},'secretKey')
    return res.status(200).json({token});
});

router.get('/tasks',(req,res)=>{
    res.json([
        {
            _id:1,
            name:'Task One',
            description:'lorem ipsum',
            date: '2024-08-10T20:39:05.211Z'
        },
        {
            _id:2,
            name:'Task Two',
            description:'lorem ipsum',
            date: '2024-08-10T20:39:05.211Z'
        },
        {
            _id:3,
            name:'Task Three',
            description:'lorem ipsum',
            date: '2024-08-10T20:39:05.211Z'
        }
    ])
})


router.get('/private-tasks',verifyToken,(req,res)=>{

    res.json([
        {
            _id:1,
            name:'Task One',
            description:'lorem ipsum',
            date: '2024-08-10T20:39:05.211Z'
        },
        {
            _id:2,
            name:'Task Two',
            description:'lorem ipsum',
            date: '2024-08-10T20:39:05.211Z'
        },
        {
            _id:3,
            name:'Task Three',
            description:'lorem ipsum',
            date: '2024-08-10T20:39:05.211Z'
        }
    ])

});

module.exports=router;

function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('anUnthorize Request');
    }

    const token = req.headers.authorization.split(' ')[1]
    if(token=='null'){
        return res.status(401).send('anUnthorize Request');
    }

    const payload = jwt.verify(token,'secretKey')
    req.userId=payload._id
    next();
}