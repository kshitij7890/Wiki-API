//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//public for storing static files like images css codes etc

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true});

const articleschema={
  title: String,
  content: String
};

const Article =mongoose.model("Article",articleschema);

/////////////////////////////// REQUESTS TARGETING ALL ARTICLES/////////////////////////////////

app.get("/articles",function(req,res){
  Article.find(function(err,foundArticles){
    if(!err)
    {
      res.send(foundArticles);
    }
    else {
          res.send(err);
        }
  });
});


app.post("/articles",function (req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
newArticle.save(function(err){
  if(!err)
  {
    res.send("success");
  }
  else {
          res.send(err);
        }
});
});



app.delete("/articles",function (req, res){
   Article.deleteMany(function(err){
     if(!err)
     {
       res.send("successfully deleted all articles");
     }
     else{
       res.send(err);
     }
   });
});

/////////////////////////////// REQUESTS TARGETING SPRECIFIC ARTICLES/////////////////////////////////
//localhost:3000/articles/Jack-Bauer
// to test jack bauer use %20 instead of space .....check express documentation html url encode

app.route("/articles/:articleTitle")


.get(function(req, res){

  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle)
    {
      res.send(foundArticle);
    }
    else{
      res.send("no articles matching that title found");
    }
  });
})

.put(function(req, res){
  Article.update({title:req.params.articleTitle},{title: req.body.title , content: req.body.content},{overwrite:true},function(err){
    if(!err)
    {
      res.send("successfully updated article");
    }
  });
})

.patch(function(req, res){
  Article.update(
    {title:req.params.articleTitle},
    {$set : req.body },
    function (err) {
      if (!err) {res.send("successfully updated article")}
      else {
          res.send(err);
        }
      }
  );
})

.delete(function (req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function (err) {
      if (!err) {
        res.send("successfully deleted");
      }
      else{
        res.send(err);
      }
      }
  );
});




//TOdo
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
