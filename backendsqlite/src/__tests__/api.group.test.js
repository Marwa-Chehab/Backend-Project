const app = require('../app')
const request = require('supertest')

let authToken; // Variable pour stocker le jeton 
let userId;

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
  });

test('Test create new group', async() => {
    let groupRes = await request(app)
        .post('/api/mygroups')
        .set('x-access-token', authToken)
        .send({name: "Sebastein Viardot"})
        console.log("Group creation response:", groupRes.body); 
    expect(groupRes.status).toBe(200);
    expect(groupRes.body.message).toBe('Group Added')
})

test('Test fetching user groups', async () => {
    let response = await request(app)
        .get('/api/groupsmember')  // Route linked to getGroup
        .set('x-access-token', authToken);

    console.log("Group fetch response:", response.body); // Debugging log

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User groups retrieved successfully');
    expect(response.body.data).toBeInstanceOf(Array);
});

test('Test fetching group users', async () => {
    let response = await request(app)
        .get('/api/mygroups/:gid')  // Route linked to getGroup
        .set('x-access-token', authToken);

    console.log("Group fetch response:", response.body); // Debugging log

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Group users retrieved successfully');
    expect(response.body.data).toBeInstanceOf(Array);
});

test('Test delete group', async () => {
    let response = await request(app)
        .delete('/api/mygroups/1')  // Route linked to getGroup
        .set('x-access-token', authToken);

    console.log("Group fetch response:", response.body); // Debugging log

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Group deleted');
});
test ('Test delete group member ', async () => {
    let response = await request(app)
        .delete('/api/mygroups/1/1')  // Route linked to groupmenber 
        .set('x-access-token', authToken);

    console.log("Group fetch response:", response.body); // Debugging log

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Groupmenber deleted');
});


test('Test add group member', async () => {
    let response = await request(app)
        .put('/api/mygroups/2/2')  // Route linked to getGroup
        .set('x-access-token', authToken);

    console.log("Group fetch response:", response.body); // Debugging log

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User already in group');
});