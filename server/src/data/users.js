import bcrypt from "bcrypt";

let users= [
    {id: 1, username: 'rokas', email: 'rokas@gmail.com' , password: await bcrypt.hash('password123', 10), isAdmin: true },
    {id: 2, username: 'rimas', email: 'rimas@gmail.com' , password: await bcrypt.hash('password123', 10), isAdmin: false },
]

export default users;