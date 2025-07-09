// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const app = require("../index"); // Ensure this points to your server entry file
// const { expect } = chai;

// chai.use(chaiHttp);

// describe("Order API Tests", () => {
//     let userToken = "";
//     let userId = "";
//     let orderId = "";

//     /**
//      * ✅ Step 1: User Login to Get Auth Token (Needed for Order Creation & Retrieval)
//      */
//     it("should log in a user to get token", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .post("/auth/login")
//             .send({ email: "anjali@gmail.com", password: "anjali123" });

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("token");
//         expect(res.body.user).to.have.property("_id");

//         userToken = res.body.token;
//         userId = res.body.user._id;
//     });

//     /**
//      * ✅ Step 2: Confirm a New Order
//      */
//     it("should confirm an order", async function () {
//         this.timeout(5000);
//         const orderData = {
//             cart: [
//                 { productId: "67bc9da6a849ae02117d920a", price: 50, quantity: 2 },
//                 { productId: "67bc9e60e21ddcb01b9d785f", price: 30, quantity: 1 }
//             ],
//             paymentMethod: "Credit Card",
//             phoneNumber: "9876543210"
//         };

//         const res = await chai.request(app)
//             .post("/orders/confirm")
//             .set("Authorization", `Bearer ${userToken}`)
//             .send(orderData);

//         expect(res).to.have.status(201);
//         expect(res.body).to.have.property("message", "Order confirmed successfully!");
//         expect(res.body.order).to.have.property("_id");
//         orderId = res.body.order._id;
//     });

//     /**
//      * ✅ Step 3: Fetch User Orders
//      */
//     it("should fetch user orders", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .get("/orders/user")
//             .set("Authorization", `Bearer ${userToken}`);

//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an("array");
//         expect(res.body.length).to.be.greaterThan(0);
//     });

//     /**
//      * ✅ Step 4: Fetch All Orders (Admin Only)
//      */
//     it("should fetch all orders (Admin Only)", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .get("/orders/all")
//             .set("Authorization", `Bearer ${userToken}`); // Assuming the user has admin privileges

//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an("array");
//     });

//     /**
//      * ✅ Step 5: Update Order Status (Admin)
//      */
//     it("should update order status", async function () {
//         this.timeout(5000);
//         const updateData = { status: "shipped" };

//         const res = await chai.request(app)
//             .put(`/orders/update/${orderId}`)
//             .set("Authorization", `Bearer ${userToken}`)
//             .send(updateData);

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("message", "Order status updated successfully");
//         expect(res.body.order).to.have.property("status", "shipped");
//     });

//     /**
//      * ✅ Step 6: Delete an Order
//      */
//     it("should delete an order", async function () {
//         this.timeout(5000);
//         const res = await chai.request(app)
//             .delete(`/orders/delete/${orderId}`)
//             .set("Authorization", `Bearer ${userToken}`);

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("message", "Order deleted successfully");
//     });
// });
