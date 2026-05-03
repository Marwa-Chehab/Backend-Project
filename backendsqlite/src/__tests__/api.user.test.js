const app = require('../app')
const request = require('supertest')

let authToken; // Variable pour stocker le jeton 
let userId;
let groupId;

const login = async (email, password) => {
    const response = await request(app)
        .post('/login')
        .send({ email, password });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    authToken = response.body.token; 
};


//S'assure que token generer avant son usage 
beforeAll(async () => {
  await login('Sebastien.Viardot@grenoble-inp.fr', '123456');
  console.log("Generated authToken:", authToken);

  let res = await request(app)
    .get('/api/users')
    .set('x-access-token', authToken)
    userId = res.body.data.find(u => u.email === 'Sebastien.Viardot@grenoble-inp.fr')?.id;


    let res1 = await request(app)
    .get('/api/mygroups')
    .set('x-access-token', authToken)
    groupID = res1.body.data.find(u => u.name === 'Sebastien Viardot')?.gid;
  });

test('Test if user can log in and list users', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Returning users')
  expect(response.body.data.length).toBeGreaterThan(0)
})

test('Test lister tous users', async () => {
  let listerUsers = await request(app)
    .get('/api/users')
    .set('x-access-token',authToken)

    expect(listerUsers.statusCode).toBe(200)
    expect(listerUsers.body.message).toBe('Returning users')
    expect(listerUsers.body.data.length).toBeGreaterThan(0)
})

test('Test if user can update password', async () => {
  await login('Sebastien.Viardot@grenoble-inp.fr','123456');
  let passResponse = await request(app)
  .put('/api/password')
  .set('x-access-token', authToken) 
  .send({ password: 'StrongPass123!' });

console.log("Password Update Response:", passResponse.body);


  expect(passResponse.statusCode).toBe(200)
  expect(passResponse.body.message).toBe('Password updated')
})

test('Test mettre à jour les informations de l utilisateur', async () => {
  await login('Sebastien.Viardot@grenoble-inp.fr','StrongPass123!');
  let updateUserRes = await request(app)
    .put(`/api/users/${userId}`)
    .set('x-access-token',authToken)
    .send({name: "seb"})

    expect(updateUserRes.statusCode).toBe(200)
})

test('Test delete user success', async () => {
  await login('Sebastien.Viardot@grenoble-inp.fr','StrongPass123!');
  let deleteUserRes = await request(app)
  .delete('/api/users/{id}')
  .set('x-access-token', authToken) 

  expect(deleteUserRes.statusCode).toBe(200)
  expect(deleteUserRes.body.message).toBe('User deleted')
})
