  const expect = require('expect');
  const request = require('supertest');
  const {
    ObjectID
  } = require('mongodb');

  const {
    app
  } = require('./../server.js');
  const {
    Todo
  } = require('./../models/todos.js');
  const {
    User
  } = require('./../models/users');
  const {
    populateTodos,
    todosForTest,
    users,
    populateUsers
  } = require('./seed/seed');

  describe('Todos Tests', () => {
    before('load users to the db', populateUsers);
    describe('POST', () => {
      // ------------------- before Post tests ----------------------------------
      beforeEach('drop all todos from db', (done) => {
        Todo.deleteMany({}).then(() => {
          done();
        });
      });
      // -------------------End before Post test ---------------------------------
      //------------------------Post Test 1 --------------------------------------
      it('POST /todos - Save new todo (need user)', (done) => {
        var text = "walk the dog";
        request(app).
        post('/todos').
        set('x-auth', users[0].tokens[0].token).
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

          Todo.find({}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();

          }).catch((e) => {
            done(e)
          });

        });
      });
      //------------------------END Post Test 1 -------------------------------------
      //---------------------------Post Test 2 --------------------------------------
      it('POST /todos - Should not create todo with invalid body', (done) => {
        request(app).
        post('/todos').
        set('x-auth', users[0].tokens[0].token).
        send({}).
        expect(400).
        end((err, res) => {
          if (err) {
            return done(err);
          }

          Todo.find({}).then((todos) => {
            expect(todos.length).toBe(0);
            done();

          }).catch((e) => {
            done(e)
          });
        });
      });
      //------------------------END Post Test 1 --------------------------------------

    });
    describe('Todo Tests that needs populateTodos', () => {
      beforeEach('populateTodos', populateTodos);
      describe('GET', () => {

        it('Should return all Todos form db', (done) => {
          request(app).
          get('/todos').
          set('x-auth', users[0].tokens[0].token).
          expect(200).
          expect((res) => {
            expect(res.body.query[0].text).toBe(todosForTest[0].text)
          }).end((err, res) => {
            if (err) {
              return done(err);
            }

            Todo.find({}).then((todos) => {
              expect(todos.length).toBe(2);
              expect(todos[0].text).toBe(todosForTest[0].text);
              expect(todos[1].text).toBe(todosForTest[1].text);
              done();

            }).catch((e) => {
              done(e)
            });

          });
        });
        //---------------------------
        describe('GET /todos/:id', () => {
          it('GET todo by ID - return the right todo with 200 code', (done) => {
            request(app).
            get(`/todos/${todosForTest[0]._id.toHexString()}`).
            set('x-auth', users[0].tokens[0].token).
            expect(200).
            expect((res) => {
              expect(res.body.text).toBe(todosForTest[0].text)
            }).
            end(done)
          });

          it('GET todo by ID - should not return todo that created by other user', (done) => {
            request(app).
            get(`/todos/${todosForTest[1]._id.toHexString()}`).
            set('x-auth', users[0].tokens[0].token).
            expect(404).
            end(done)
          });
          //-----------------
          it('GET todo by ID - send invalid (too long) id and return 404', (done) => {
            request(app).
            get(`/todos/${todosForTest[0]._id.toHexString()}666`).
            set('x-auth', users[0].tokens[0].token).
            expect(404).
            end(done);
          });
          it('GET todo by ID - send invalid (worng) id and return 404', (done) => {
            request(app).
            get(`/todos/5b8e905f1f08ed2782516da3`).
            set('x-auth', users[0].tokens[0].token).
            expect(404).
            end(done);
          });
        });
      });
      describe('DELETE', () => {
        it('Should remove a todo', (done) => {
          request(app).
          delete(`/todos/${todosForTest[0]._id.toHexString()}`).
          set('x-auth', users[0].tokens[0].token).
          expect(200).
          expect((res) => {
            expect(res.body.text).toBe(todosForTest[0].text);
          }).
          end((err, res) => {
            if (err) {
              return done(err);
            }
            Todo.find({}).then((todos) => {
              expect(todos.length).toBe(1);
              done();
            });
          });
        });
        it('Should not remove a todo that created by other user', (done) => {
          request(app).
          delete(`/todos/${todosForTest[1]._id.toHexString()}`).
          set('x-auth', users[0].tokens[0].token).
          expect(404).
          end((err, res) => {
            if (err) {
              return done(err);
            }
            Todo.find({}).then((todos) => {
              expect(todos.length).toBe(2);
              done();
            });
          });
        });
        it('Should remove a todo -ID not found', (done) => {
          request(app).
          delete(`/todos/${new ObjectID}`).
          set('x-auth', users[0].tokens[0].token).
          expect(404).
          end(done);
        });
        it('Should remove a todo - bad ID', (done) => {
          request(app).
          delete(`/todos/sdfk`).
          set('x-auth', users[0].tokens[0].token).
          expect(404).
          end(done);
        });
      });

      describe('PATCH', () => {
        it('Should update a todo', (done) => {
          var newTodoBody = {
            text: "text test after update",
            completed: true
          };
          request(app).
          patch(`/todos/${todosForTest[0]._id.toHexString()}`).
          set('x-auth', users[0].tokens[0].token).
          send(newTodoBody).
          expect(200).
          expect((res) => {
            expect(res.body.text).toBe(newTodoBody.text);
            expect(res.body.completed).toBe(true);
          }).
          end(done);
        });
        it('Should not update a todo that created by other user', (done) => {
          var newTodoBody = {
            text: "text test after update",
            completed: true
          };
          request(app).
          patch(`/todos/${todosForTest[1]._id.toHexString()}`).
          set('x-auth', users[0].tokens[0].token).
          send(newTodoBody).
          expect(404).
          end((err,res) => {
            if(err){
              return done(err);
            }
            Todo.find({}).then((todos) => {
              if(!todos){
                done();
              }
              expect(todos[1].text).toBe(todosForTest[1].text);
              expect(todos[1].completed).toBe(false);
              done();
            });
          });
        });
        it('Should update a todo - ID not found', (done) => {
          request(app).
          patch(`/todos/${new ObjectID}`).
          set('x-auth', users[0].tokens[0].token).
          expect(404).
          end(done);
        });
        it('Should update a todo - bad ID', (done) => {
          request(app).
          delete(`/todos/sdfk`).
          set('x-auth', users[0].tokens[0].token).
          expect(404).
          end(done);
        });
      });
    });
  });

  describe('Users Tests', () => {
    describe('POST /users', () => {
      it('should create user', (done) => {
        var newUser = {
          email: 'superTestUser@sdf.com',
          password: 'superTestUser'
        };
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
          if (err) {
            return done(err);
          }

          User.findOne({
            email: newUser.email
          }).then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(newUser.passwors);
            done();

          }, (e) => done);
        })
      });
      it('should return validation errors if request invalide', (done) => {
        var newUser = {
          email: 'sdf.com',
          password: 'bla'
        };
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
      //----------------End of POST /users block ----------------------------
    });
    describe('needs populateUsers', () => {
      beforeEach(populateUsers);
      describe('GET /users/me', () => {
        it('should return user if authenticated', (done) => {
          request(app).
          get('/users/me').
          set('x-auth', users[0].tokens[0].token).
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
          expect((res) => {
            expect(res.body).toEqual({});
          }).
          end(done)
        });
        //----------------End of GET /users/me block ----------------------------
      });
      describe('POST /users/login', () => {
        it('should login user and return auth token', (done) => {
          var userNum = 1;
          request(app).
          post('/users/login').
          send(users[userNum]).
          expect(200).
          expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBe(users[userNum]._id.toHexString());
            expect(res.body.email).toBe(users[userNum].email);
          }).
          end((err, res) => {
            if (err) {
              return done(err);
            }

            User.findById(users[1]._id.toHexString()).then((user) => {
              if (!user) {
                return done(err);
              }
              expect(user.tokens[1]).toMatchObject({
                access: 'auth',
                token: res.headers['x-auth']
              });
              done();
            }).catch((e) => done(e));
          });
        });
        it('should reject inValid login', (done) => {
          var user = {
            email: 'invlid@invalid.com',
            password: 'ivalidpass'
          };
          request(app).
          post('/users/login').
          send(user).
          expect(401).
          expect((res) => {
            expect(res.headers['x-auth']).not.toBeTruthy();
          }).
          end((err, res) => {
            if (err) {
              return done(err);
            }

            User.findById(users[1]._id.toHexString()).then((user) => {
              if (!user) {
                return done();
              }
              expect(user.tokens.length).toBe(1)
              done();
            }).catch((e) => done(e));

          })
        });
        //----------------End of POST /users/login block ----------------------------
      });
      describe('DELETE /users/me/token', () => {
        it('should remove auth token on logout', (done) => {
          request(app).
          delete('/users/me/token').
          set('x-auth', users[0].tokens[0].token).
          expect(200).
          end((err, res) => {
            if (err) {
              return done(err);
            }
            User.findById(users[0]._id.toHexString()).then((user) => {
              if (!user) {
                return done();
              }
              expect(user.tokens.length).toBe(0);
              done();
            }).catch((e) => done(e));
          })

        });
        //----------------End of DELETE /users/me/token block ----------------------------
      });
      // end of needs populateUsers describe block
    });
  });
