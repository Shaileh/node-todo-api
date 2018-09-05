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
    post('/todos').
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
    post('/todos').
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

describe('test GET from API',() => {
  var todosForTest = [{text:"test Text"},{text:"test Text 2"}];

  beforeEach('drop the db before each test',(done) =>{
    todo.remove({}).then(() => {
        todo.insertMany(todosForTest).then(() => done());
    });
  });


  it('Should return all Todos form db',(done) => {
    request(app).
    get('/todos').
    expect(200).
    expect((res) => {
      expect(res.body.query[0].text).toBe(todosForTest[0].text)
    }).end((err,res) => {
      if(err){
        return done(err);
      }

      todo.find({}).then((todos) => {
        expect(todos.length).toBe(2);
        expect(todos[0].text).toBe(todosForTest[0].text);
        expect(todos[1].text).toBe(todosForTest[1].text);
        done();

      }).catch((e) => {done(e)});

    });
  });

});
