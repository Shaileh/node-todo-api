const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {
  app
} = require('./../server.js');
const {
  todo
} = require('./../models/todos.js');

var todosForTest = [{
  text: "test Text"
}, {
  text: "test Text 2"
}];
var todoIdForTest;



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

  beforeEach('drop the db before each test', (done) => {
    todo.remove({}).then(() => {
      todo.insertMany(todosForTest).then((docs) => {
        todoIdForTest = docs[0]._id;
        // console.log(docs);
        // worngID = todoIdForTest.replace('todoIdForTest.charAt(3)','t');
        done();
      });
    });
  });



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
      get(`/todos/${todoIdForTest}`).
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
      get(`/todos/${todoIdForTest}666`).
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
  beforeEach('drop the db before each test', (done) => {
    todo.remove({}).then(() => {
      todo.insertMany(todosForTest).then((docs) => {
        todoIdForTest = docs[0]._id;
        // debugger
        // console.log(docs);
        // worngID = todoIdForTest.replace('todoIdForTest.charAt(3)','t');
        done();
      });
    });
  });
 it('Should remove a todo', (done) => {
   request(app).
   delete(`/todos/${todoIdForTest.toString()}`).
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
  beforeEach('drop the db before each test', (done) => {
    todo.remove({}).then(() => {
      todo.insertMany(todosForTest).then((docs) => {
        todoIdForTest = docs[0]._id;
        done();
      });
    });
  });
   it('Should update a todo', (done) => {
     var newTodoBody = {text:"text test after update",completed: true};
     request(app).
     patch(`/todos/${todoIdForTest.toString()}`).
     send(newTodoBody).
     expect(200).
     expect((res) => {
       expect(res.body.text).toBe(newTodoBody.text);
       expect(res.body.completed).toBe(true);
     }).
     end(done);

   });

});
