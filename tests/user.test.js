const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app.js')
const User = require('../src/models/user.js')
const {userOneId,userOne, setUpDatabase} = require('./fixtures/db.js')

beforeEach(setUpDatabase)

// afterEach(()=>console.log(`AfterEACH`))


test('should signup a new user',async ()=>{
    const response = await request(app).post('/users').send({
        name: 'Rishabh',
        email:'2106239@kiit.ac.in',
        password: 'radharaman'
    }).expect(201)

    //Assert that db was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about response

    expect(response.body).toMatchObject({
        user:{
            name:"Rishabh",
            email:"2106239@kiit.ac.in"
        },
        token: user.tokens[0].token
    })

    //check that password is hashed
    expect(user.password).not.toBe('radharaman')
})

test('should log in existing user', async ()=>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not log in', async ()=>{
    await request(app).post('/users/login').send({
        email: userOne.email, 
        password:'hwlkedjefh'
    }).expect(400)
})


test('should get profile for user', async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile for unauth user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
    
})

test('should delete account for authenticated user', async ()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete unauthenticated user', async ()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('should upload avatar image', async ()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields',async ()=>{
     await request(app)
     .patch('/users/me')
     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
     .send({name:"Jeff"})
     .expect(200)

     const user = await User.findById(userOneId)
     expect(user.name).toEqual('Jeff')
})

test('should not update valid user fields',async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({location:"kolkata"})
    .expect(400)
})