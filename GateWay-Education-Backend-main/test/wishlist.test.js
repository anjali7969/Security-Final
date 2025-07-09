// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const app = require("../index"); // Adjust the path if needed
// const { expect } = chai;

// chai.use(chaiHttp);

// describe("📌 Wishlist API Tests", () => {
//     let userToken = "";
//     let userId = "";
//     let courseId = "";
//     let wishlistId = "";

//     /**
//      * ✅ Step 1: User Login to Get Token (Required for Wishlist Operations)
//      */
//     it("should log in the user and return a JWT token", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .post("/auth/login")
//             .send({
//                 email: "anjali@gmail.com",  // Ensure this user exists
//                 password: "12345678"
//             });

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("token");
//         expect(res.body).to.have.property("user");

//         userToken = res.body.token;
//         userId = res.body.user._id;
//     });

//     /**
//      * ✅ Step 2: Add a Course to the Wishlist
//      */
//     it("should add a course to the wishlist", async function () {
//         this.timeout(5000);

//         // Dummy course details (Ensure this course exists in your DB)
//         courseId = "67b4716b876bbd9ee5ce25d1"; // Replace with a valid courseId from your database

//         const res = await chai.request(app)
//             .post("/wishlist/add")
//             .set("Authorization", `Bearer ${userToken}`)
//             .send({
//                 userId,
//                 courseId
//             });

//         expect(res).to.have.status(201);
//         expect(res.body).to.have.property("message", "Course added to wishlist");
//         wishlistId = res.body.wishlist._id; // Store the wishlist ID for later tests
//     });

//     /**
//      * ✅ Step 3: Get User's Wishlist
//      */
//     it("should fetch the user's wishlist", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .get(`/wishlist/${userId}`)
//             .set("Authorization", `Bearer ${userToken}`);

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("success", true);
//         expect(res.body.wishlist.length).to.be.greaterThan(0);
//     });


// });
