/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const expect = require('chai').expect;
let mongodb = require('mongodb');
let mongoose = require('mongoose');

module.exports = function (app) {
//Config 
  mongoose.connect(process.env['DB'], { useNewUrlParser: true, useUnifiedTopology: true });
  
 //Schemas 
  let bookSchema = new mongoose.Schema({
                    title: {type: String, required: true},
                    comments: [String]
                  });
  //model
  let Book = mongoose.model('Book', bookSchema);
  
  app.route('/api/books')
    
    .get(function (req, res) {      
        
        Book.find({}, (error, dataBook) =>{
            if(dataBook) {              
              const regBook = dataBook.map((book) => {
                return {
                  _id: book._id,
                  title: book.title,                  
                  commentcount: book.comments.length,
                  comments: book.comments,
                };
              });
              return res.json(regBook);
            } else {
              return res.send("no book exists");
            }                  
        });
    })
    
    .post(function (req, res) {
      if(!req.body.title) {
        return res.send("missing required field title");
      }

      let newBook = new Book({ title: req.body.title, comments:[] });
      
      newBook.save((error, savedBook) => {
        if(error || !savedBook) {
          return res.send("error saved book");
        } else {
          return res.json(savedBook);
        }
      });         
    })
    
    .delete(function(req, res) {
      Book.deleteMany({},(error, statusDelete) => {
       if(error || !statusDelete) {
         console.log("error delete book");
       } else {         
         return res.send("complete delete successful");
       }
      });     
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      Book.findById(bookid, (error, dataBook) => {
        if(!dataBook || error) {
          return res.send("no book exists");
        } else {
          return res.json(dataBook);
        }
      }); 
    })
    
    .post(function(req, res){
      let bookid = req.params.id || req.body.idinputtest;
      let comment = req.body.comment;
      
      /*if(!bookid) {
        return res.send("missing required field title");
      }*/

      if(!comment) {
        return res.send("missing required field comment");
      }

      Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true}, (error, updatedBook) => {
        if(!updatedBook || error) {
          return res.send("no book exists");
        }
        else {
          return res.json(updatedBook);
        }
      }); 
    })
    
    .delete( function(req, res) {
      let bookid = req.params.id;

      Book.findByIdAndRemove(bookid, (error, deleteBook) => {
        if(!error && deleteBook) {
          return res.send("delete successful");
        } else {
          return res.send("no book exists");
        }
      })   
    });  
};
