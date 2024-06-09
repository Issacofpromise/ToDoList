var router = require('express').Router();
const passport = require('passport');
const MongoClient = require('mongodb').MongoClient; 
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt') 
var sani = require('sanitize-html');
const { ObjectId } = require('mongodb');

router.use((요청, 응답, next) => { 응답.setHeader("Content-Security-Policy", 
  "script-src 'self' 'unsafe-inline' https://code.jquery.com/jquery-3.6.0.min.js https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js http://localhost:9000/");
  next();  });
var db; 
require('../base.js').then(client => { db = client.db('ToDoApp')});
passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => { 
  console.log('입력한아이디',입력한아이디);
  let result = await db.collection('user').findOne({ username : 입력한아이디})
  console.log('result',result); if (!result) { 
    return cb(null, false, { message: '가입되어 있지 않은 아이디 입니다.' })  }
  if (await bcrypt.compare(입력한비번, result.password)) {
    return cb(null, result);
  } else { return cb(null, false, { message: '비번불일치' }); } 
}))
router.post('/login', (요청, 응답, next) => { console.log('/login',요청.body) 
if (!요청.body.username) {
  return 응답.status(400).json({ message: 'id 입력 누락.' });  }
if (!요청.body.password) {
  return 응답.status(400).json({ message: 'Password을 입력해주세요.' });  } 
passport.authenticate('local', (error, user, info) => { console.log('user',user)
  if (!user) return 응답.status(401).json(info.message)
    요청.logIn(user, (err) => {   if (err) return next(err)
      응답.redirect('/')  })
  })(요청, 응답, next)
  })  
passport.serializeUser((user, done) => { console.log('3 serial',user);
    done(null, { id: user._id, username: user.username, name:user.name })
})
passport.deserializeUser(async (user, done) => {
let result = await db.collection('user').findOne({_id : new ObjectId(user.id) })
if (result) {delete result.password }
done(null, result); console.log('5 result',result);
})
function checkLogin(요청, 응답, next){
    if(!요청.user){ return 응답.send(`<script>alert('로그인 후 이용가능합니다.');
    window.location="/"; </script>`); } next(); }
function del(요청, 응답, 다음) {delete 요청.session.date;delete 요청.session.content;다음();  }
router.use(del);
router.get('/write', checkLogin, (요청, 응답)=>{
  응답.render('write',{date:요청.session.date,content:요청.session.content,
    user: 요청.user, message: ''});    
  });
router.get('/list', async (요청, 응답) => {  try {    delete 요청.session.searchValue;
    delete 요청.session.page;
    const posts = await db.collection('post').find().sort({_id: -1}).limit(5).toArray();
    응답.render('list', {down: posts, user: 요청.user, page: null, searchValue: null, value: null});
  } catch (err) {    console.error(err)  }
})
router.get('/list/:page', (요청, 응답) => {  요청.session.page=parseInt(요청.params.page);
   let page = parseInt(요청.params.page);  let skip = page * 5;
  db.collection('post').find().sort({_id: -1}).skip(skip).limit(5).toArray()
.then(ret => {  console.log(ret);응답.render('list', {down: ret, user: 요청.user,page:page,searchValue:null,value:null});
        }).catch(err => { console.log(err) });
}); 
router.get('/search', async (요청, 응답) => {console.log(요청.query);
  요청.session.searchValue = 요청.query.val;
  let 검색조건 = [ {$search : { index : 'tit',
      text : { query : 요청.query.val, path : ['title','content'] }    }}  ]
  let ret1 = await db.collection('post').aggregate(검색조건).sort({_id: -1}).toArray(); console.log(ret1); 
  응답.render('list', {down: ret1, user: 요청.user,page:null,searchValue:요청.query.val,value:true});
}) 
router.get('/mypage', async (요청, 응답) => {console.log(요청.query);   let 검색조건 = [];
  if (요청.query.searched) {검색조건.push({ $match: { $and: [ { user: 요청.user._id },
        { $or: [{ title: { $regex: 요청.query.searched, $options: 'i' } },
            { content: { $regex: 요청.query.searched, $options: 'i' }}]} ] }});
  } else { 검색조건.push({ $match: { user: 요청.user._id } });  }
  let ret1 = await db.collection('post').aggregate(검색조건).sort({_id: -1}).toArray(); console.log(ret1); 
  응답.render('list', {down: ret1, user: 요청.user,page:null,searchValue:요청.session.searchValue,value:true})
})  
router.get('/detail/:id', async (요청, 응답) => { console.log('detail요청.user',요청.user);
let searchValue = 요청.session.searchValue;let page =요청.session.page;
console.log('요청.session.searchValue',searchValue,'page',page);
  let ret = await db.collection('post').findOne({ _id : parseInt(요청.params.id) })
  let result2 = await db.collection('comment').find( { parentId : 요청.params.id }).sort({time: -1}).toArray();
  console.log('result2',result2);
  응답.render('detail', {dt:ret, user: 요청.user, dt1 : result2,searchValue:searchValue,page:page})
})    
router.delete('/delete/:id', (요청, 응답)=>{  console.log('요청.query',요청.query);
    db.collection('post').deleteOne({_id:parseInt(요청.query.docid) }).then(ret => {
        응답.send(`window.location="${요청.query.referer}"</script>`);
        });}); 
router.delete('/ete', async (요청, 응답) => { console.log('요청.query.docid ',요청.query);
await db.collection('comment').deleteOne( { time : 요청.query.docid } )
  응답.send('삭제완료')
})
router.get('/', function(요청, 응답) { console.log(요청.user);delete 요청.session.searchValue;
 응답.render('index',{user: 요청.user}); 
})
router.get('/logout', (요청, 응답) => { 요청.logout(err => { if (err) {console.log(err);
}  응답.redirect('/');  });
});
router.post('/comment', async (요청, 응답)=>{ console.log(요청.body);
  let result = await db.collection('comment').insertOne({
    content : 요청.body.cmt, writerId : 요청.user._id,
    writer : 요청.user.username, parentId : 요청.body.parentId,
    time:요청.body.timestamp
  })
  응답.redirect('detail/'+요청.body.parentId)
}) 

module.exports = router;