const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {todo} = require('./../models/todos.js');



describe('test post to API',() => {

  beforeEach('drop the db before each test',(done) =>{

  todo.remove({}).then(() => {done()});

  });

  it('POST /saveTodo', (done) => {
      var text = "walk the dog";
    request(app).
      post('/saveTodo').
      send({text}).
      expect(200).
      expect((res) => {
        expect(res.body.text).toBe(text)
      }).end((err,res) => {
          if(err){
            return done(err);
          }

        todo.find({}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();

        }).catch((e) => {done(e)});

      });
  });


it('Should not create todo with invalid body',(done) => {
  request(app).
  post('/saveTodo').
  send({}).
  expect(400).
  end((err,res) => {
    if(err){
      return done(err);
    }

  todo.find({}).then((todos) => {
    expect(todos.length).toBe(0);
    done();

  }).catch((e) => {done(e)});
});
});

});
