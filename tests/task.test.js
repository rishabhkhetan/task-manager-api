const request = require('supertest')
const Task = require('../src/models/task.js')
const app = require('../src/app.js')
const {userOneId,
userOne, 
setUpDatabase,
userTwoId,
userTwo, 
taskOne,
taskTwo,
taskThree} = require('./fixtures/db.js')


beforeEach(setUpDatabase)
 


test('should create task for user', async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From My test'
    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should get authenticated users task', async ()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(2)

})

test('should not allow unauth user to delete', async ()=>{
    const response = request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()

})