// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const app = require("../index"); // Adjust the path if needed
// const { expect } = chai;

// chai.use(chaiHttp);

// describe("🛒 Cart API Tests", () => {
//     let userToken = "";
//     let userId = "";
//     let courseId = "";
//     let cartId = "";

//     /**
//      * ✅ Step 1: User Login to Get Token (Required for Cart Operations)
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
//      * ✅ Step 2: Add a Course to the Cart
//      */
//     it("should add a course to the cart", async function () {
//         this.timeout(5000);

//         // Dummy course details (Ensure this course exists in your DB)
//         courseId = "67b4716b876bbd9ee5ce25d1"; // Replace with a valid courseId from your database

//         const res = await chai.request(app)
//             .post("/cart/add")
//             .set("Authorization", `Bearer ${userToken}`)
//             .send({
//                 userId,
//                 courseId,
//                 quantity: 1
//             });

//         expect(res).to.have.status(201);
//         expect(res.body).to.have.property("message", "Course added to cart");
//         cartId = res.body.cart._id; // Store the cart ID for later tests
//     });

//     /**
//      * ✅ Step 3: Get User's Cart Items
//      */
//     it("should fetch the user cart", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .get(`/cart/${userId}`)
//             .set("Authorization", `Bearer ${userToken}`);

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("success", true);
//         expect(res.body.cart.items.length).to.be.greaterThan(0);
//     });

//     /**
//      * ✅ Step 4: Update Item Quantity in Cart
//      */
//     it("should update the quantity of a cart item", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .put(`/cart/${userId}/update`)
//             .set("Authorization", `Bearer ${userToken}`)
//             .send({
//                 courseId,
//                 quantity: 2  // Increase quantity
//             });

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("message", "Cart updated");
//     });

//     /**
//      * ✅ Step 5: Remove an Item from the Cart
//      */
//     it("should remove an item from the cart", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .delete(`/cart/remove/${courseId}`)
//             .set("Authorization", `Bearer ${userToken}`)
//             .send({ userId });

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("message", "Item removed from cart");
//     });

//     /**
//      * ✅ Step 6: Clear the Cart
//      */
//     // it("should clear the user cart", async function () {
//     //     this.timeout(5000);
//     //     const res = await chai.request(app)
//     //         .delete(`/cart/clear`)
//     //         .set("Authorization", `Bearer ${userToken}`)
//     //         .send({ userId });

//     //     expect(res).to.have.status(200);
//     //     expect(res.body).to.have.property("message", "Cart cleared successfully");
//     // });

// });
