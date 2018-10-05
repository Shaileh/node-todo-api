const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {todo} = require('./../models/todos.js');
const {User} = require('./../models/users');
const {populateTodos, todosForTest,users,populateUsers} = require('./seed/seed');



describe('POST', () => {

  beforeEach('drop the db before each test', (done) => {

    todo.remove({}).then(() => {
      done()
    });

  });

  it('POST /saveTodo', (done) => {
    var text = "walk the dog";
    request(app).
    post('/todos').
    send({
      text
    }).
    expect(200).
    expect((res) => {
      expect(res.body.text).toBe(text)
    }).end((err, res) => {
      if (err) {
        return done(err);
      }

      todo.find({}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();

      }).catch((e) => {
        done(e)
      });

    });
  });


  it('Should not create todo with invalid body', (done) => {
    request(app).
    post('/todos').
    send({}).
    expect(400).
    end((err, res) => {
      if (err) {
        return done(err);
      }

      todo.find({}).then((todos) => {
        expect(todos.length).toBe(0);
        done();

      }).catch((e) => {
        done(e)
      });
    });
  });

});



describe('GET', () => {
  beforeEach('drop the db before each test', populateTodos);


  it('Should return all Todos form db', (done) => {
    request(app).
    get('/todos').
    expect(200).
    expect((res) => {
      expect(res.body.query[0].text).toBe(todosForTest[0].text)
    }).end((err, res) => {
      if (err) {
        return done(err);
      }

      todo.find({}).then((todos) => {
        expect(todos.length).toBe(2);
        expect(todos[0].text).toBe(todosForTest[0].text);
        expect(todos[1].text).toBe(todosForTest[1].text);
        done();

      }).catch((e) => {
        done(e)
      });

    });
  });
  describe('GET /todos/:id', () => {
    it('GET todo by ID - return the right todo with 200 code', (done) => {
      request(app).
      get(`/todos/${todosForTest[0]._id.toHexString()}`).
      expect(200).
      expect((res) => {
        expect(res.body.text).toBe(todosForTest[0].text)
      }).end((err, res) => {
        if (err) {
          return done(err);
        }
        done();

      });
    });
    it('GET todo by ID - send invalid (too long) id and return 404', (done) => {
      request(app).
      get(`/todos/${todosForTest[0]._id.toHexString()}666`).
      expect(404).
      end((err, res) => {
        if (err) {
          return done(err);
        }
        done();

      });
    });
    it('GET todo by ID - send invalid (worng) id and return 404', (done) => {
      request(app).
      get(`/todos/5b8e905f1f08ed2782516da3`).
      expect(404).
      end((err, res) => {
        if (err) {
          return done(err);
        }
        done();

      });
    });
  });
});

describe('Delete /todos/:id', () => {
  beforeEach('drop the db before each test', populateTodos);
 it('Should remove a todo', (done) => {
   request(app).
   delete(`/todos/${todosForTest[0]._id.toHexString()}`).
   expect(200).
   expect((res)=>{
     expect(res.body.text).toBe(todosForTest[0].text);
   }).
   end((err, res) => {
     if (err) {
       return done(err);
     }
      todo.find({}).then((todos) => {
        expect(todos.length).toBe(1);
        done();
      });
   });
 });
 it('Should remove a todo -ID not found',(done) => {
   request(app).
   delete(`/todos/${new ObjectID}`).
   expect(404).
   end(done);
 });
 it('Should remove a todo - bad ID',(done) => {
   request(app).
   delete(`/todos/sdfk`).
   expect(404).
   end(done);
 });
});

describe('Update /todos/:id', () => {
  beforeEach('drop the db before each test', populateTodos);
   it('Should update a todo', (done) => {
     var newTodoBody = {text:"text test after update",completed: true};
     request(app).
     patch(`/todos/${todosForTest[0]._id.toHexString()}`).
     send(newTodoBody).
     expect(200).
     expect((res) => {
       expect(res.body.text).toBe(newTodoBody.text);
       expect(res.body.completed).toBe(true);
     }).
     end(done);
   });
    it('Should update a todo - ID not found', (done) => {
      request(app).
      patch(`/todos/${new ObjectID}`).
      expect(404).
      end(done);
    });
    it('Should update a todo - bad ID',(done) => {
      request(app).
      delete(`/todos/sdfk`).
      expect(404).
      end(done);
    });

});
describe('Users tests', () => {
    beforeEach(populateUsers);
    describe('GET /users/me', () => {
      it('should return user if authenticated', (done) =>{
    request(app).
      get('/users/me').
      set('x-auth',users[0].tokens[0].token).
      expect(200).
      expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString()),
        expect(res.body.email).toBe(users[0].email)
      }).
      end(done)
  });

  it('should return 401 if not authenticated', (done) => {
    request(app).
      get('/users/me').
      expect(401).
      expect((res) =>{
        expect(res.body).toEqual({});
      }).
      end(done)
  });

  });
  describe('POSR /users', () => {
    it('should create user', (done) => {
      var newUser = {email:'superTestUser@sdf.com',password:'superTestUser'};
      request(app).
      post('/users').
      send(newUser).
      expect(200).
      expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(newUser.email);
      }).
      end((err, res) => {
        if(err){
          return done(err);
        }

        User.findOne({email: newUser.email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(newUser.passwors);
          done();

        },(e) => done);
      })
    });
    it('should return validation errors if request invalide',(done) => {
      var newUser = {email:'sdf.com',password:'bla'};
      request(app).
      post('/users').
      send(newUser).
      expect(400).
      expect((res) => {
        expect(res.body.errors.email).toBeTruthy();
        expect(res.body.errors.password).toBeTruthy();
        // done();
      }).
      end(done)
    });
    it('should not create user if email in use', (done) => {
      request(app).
      post('/users').
      send(users[1]).
      expect(400).
      end(done);
    });


  });
});
