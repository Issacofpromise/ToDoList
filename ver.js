

const express = require('express');
const app = express(); var db; 
const http=require('http');
app.use(express.urlencoded({extended: true}));
require('dotenv').config() 
const MongoClient = require('mongodb').MongoClient; 
const server = http.createServer(app)
const { ObjectId } = require('mongodb');
const MongoStore = require('connect-mongo')
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname+ '/public'));
const methodOverride = require('method-override')
const helmet = require('helmet');
app.use(helmet());
var sani = require('sanitize-html');
const bcrypt = require('bcrypt') 
app.use(methodOverride('_method'))
const session = require('express-session')
const passport = require('passport')
app.use(passport.initialize())
const LocalStrategy = require('passport-local').Strategy;
app.use(session({secret:process.env.secret, resave : false, saveUninitialized : false,
cookie : { maxAge: Number(process.env.maxAge) }, store: MongoStore.create({
  mongoUrl : process.env.DB_URL, dbName: 'ToDoApp'}) }))
app.use(passport.session()) 
const compression = require('compression');
app.use(compression({  types: null}));
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')
app.use(express.static(path.join(__dirname, 'views')));

const s3 = new S3Client({  region : 'ap-northeast-2', credentials : {  accessKeyId : process.env.s3_key,
      secretAccessKey : process.env.s3_secret  }})
      const upload = multer({ storage: multerS3({ s3: s3, bucket: 'angelinus141',
      key: function (요청, file, cb) { cb(null, Date.now().toString()) 
      }  }) })
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com");
  next();
});
app.use('/', require('./routes/one.js') );
app.post('/mb', async (요청, 응답)=>{ console.log('Membership',요청.body);
let dupl = await db.collection('user').findOne({ username : 요청.body.username})   
if(dupl){return 응답.send(`<script>alert('이미 존재하는 ID입니다.');window.location="/"</script>`)}
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$/;
if (!passwordRegex.test(요청.body.password)) {
  return 응답.send(`<script>alert('Password must be at least 8 characters long and include letters, numbers, and special characters.');
  window.location="/"</script>`)}
let 해시= await bcrypt.hash(요청.body.password,10)
  await db.collection('user').insertOne({username : 요청.body.username,
    password : 해시, name:요청.body.name});
        응답.send(`<script>alert('감사합니다. Membership 가입이 완료되었습니다.');
window.location="/"</script>`)})

require('./base.js').then(client => { db = client.db('ToDoApp');
server.listen(process.env.PORT, () => { console.log('listening on',process.env.PORT)   });
    }).catch(에러 => {  console.log(에러);
    });
app.post('/ad', upload.single('img1'), (요청, 응답)=>{  console.log('/ad',요청.file);
let imgLocation = 요청.file ? 요청.file.location : null;
  if (요청.body.title == '') { 요청.session.date = sani(요청.body.date); 
    요청.session.content = sani(요청.body.content);
  응답.render('write', {date:요청.session.date,content:요청.session.content,
    user: 요청.user, message: 'Write the title.'});  
    } else {   
db.collection('counter').findOne({name : 'countPost'}).then(ret => {var tc= ret.totalPost;
db.collection('post').insertOne({_id:tc+1,title:sani(요청.body.title),date:sani(요청.body.date),
content:sani(요청.body.content),img:imgLocation,user : 요청.user._id, username : 요청.user.username});});
db.collection('counter').updateOne({name : 'countPost'},{ $inc : { totalPost : 1 } });
  응답.send(`<script>alert('입력완료');window.location="/write"; </script>`); 
  }});  
app.get('/edit/:id', (요청,응답)=>{
    db.collection('post').findOne({_id:parseInt(요청.params.id)}).then(ret => { console.log('edit',ret);
      응답.render('edit',{upd:ret, user: 요청.user, message: ''})});
      });  
app.put('/edit/:id', upload.single('img1'), (요청, 응답) => {console.log('edit',요청.file,'/edit/요청.body',요청.body);
if (요청.file) { db.collection('post').updateOne({ _id: parseInt(요청.params.id) }, 
{ $set: { title: sani(요청.body.title),date:sani(요청.body.date),
  content:sani(요청.body.content),  img: 요청.file.location } }, (에러) => {
if (에러) {     응답.send(`<script>alert('수정 중 오류가 발생했습니다: ${에러.message}'); 
      window.location="/edit/${요청.params.id}"</script>`);}
})} 
if (!요청.file) { { db.collection('post').updateOne({ _id: parseInt(요청.params.id) },
    { $set: { title: sani(요청.body.title),date:sani(요청.body.date),content:sani(요청.body.content) } }
  )}}
if (요청.body.clear=='false') { { db.collection('post').updateOne({ _id: parseInt(요청.params.id) },
  { $set: { title: sani(요청.body.title),date:sani(요청.body.date),content:sani(요청.body.content),img:null } }
)}}
응답.send(`<script>alert('수정되었습니다');window.location="/detail/"+${요청.params.id}</script>`); 
      }); 





