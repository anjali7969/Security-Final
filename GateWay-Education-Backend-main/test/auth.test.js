// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const app = require("../index"); // Adjust path if needed
// const { expect } = chai;

// chai.use(chaiHttp);

// describe("Auth API Tests", () => {
//     // We'll store the JWT token and user ID (if available) for further tests if needed.
//     let userToken = "";
//     let userId = "";

//     // ✅ Test User Registration
//     it("should register a new user", async function () {
//         this.timeout(5000);
//         try {
//             const res = await chai.request(app)
//                 .post("/auth/register")
//                 .send({
//                     name: "Test User",
//                     email: "test10@example.com",
//                     password: "password123",
//                     phone: "9876543211",
//                     role: "Admin"
//                 });

//             console.log("User Registration Response:", res.body);
//             expect(res).to.have.status(201);
//             expect(res.body).to.have.property("message", "User registered successfully");
//             expect(res.body).to.have.property("token");
//             expect(res.body).to.have.property("user");

//             // Note: In your register response, the user object doesn't include _id.
//             // We therefore rely on the login endpoint to retrieve the _id.
//         } catch (error) {
//             console.error("User Registration Error:", error.response ? error.response.body : error);
//             throw error;
//         }
//     });

//     // ✅ Test User Login
//     it("should login the user and return a JWT token", async function () {
//         this.timeout(5000);
//         try {
//             const res = await chai.request(app)
//                 .post("/auth/login")
//                 .send({
//                     email: "test10@example.com",
//                     password: "password123"
//                 });

//             console.log("User Login Response:", res.body);
//             expect(res).to.have.status(200);
//             expect(res.body).to.have.property("token");
//             expect(res.body).to.have.property("user");
//             userToken = res.body.token; // Save token for further tests if needed

//             // Now, the login endpoint returns the user with _id, so we capture it here.
//             userId = res.body.user._id;
//             expect(userId).to.exist;
//         } catch (error) {
//             console.error("User Login Error:", error.response ? error.response.body : error);
//             throw error;
//         }
//     });
// });



const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Adjust path if needed
const { expect } = chai;

chai.use(chaiHttp);

describe("User API Tests", () => {
    let userToken = "";
    let userId = "";
    let userEmail = `test${Date.now()}@example.com`; // Generate a unique email
    let userPassword = "password123"; // Define the password once

    /**
     * ✅ Step 1: Register a New User
     */
    it("should register a new user", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: userEmail, // Use generated email
                password: userPassword, // Use defined password
                phone: "9876543211",
                role: "Student"
            });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "User registered successfully");
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("user");

        userToken = res.body.token; // Store the token for authentication
        userId = res.body.user._id; // Store the user ID
    });

    /**
     * ✅ Step 2: Login User to Get Token (Using Registered Credentials)
     */
    it("should log in the user and return a JWT token", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/auth/login")
            .send({
                email: userEmail, // Use registered email
                password: userPassword // Use registered password
            });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("user");

        userToken = res.body.token; // Update token (though it's already stored from register)
        userId = res.body.user._id;
    });



});
