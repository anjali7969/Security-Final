// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const app = require("../index"); // Path to your server file
// const { expect } = chai;

// chai.use(chaiHttp);

// describe("Course API Tests (Admin Only)", function () {
//     this.timeout(5000); // Increase timeout if needed

//     let adminToken = "";
//     let courseId = "";

//     // Setup: Ensure an admin account exists and obtain token
//     before(async function () {
//         try {
//             // Try logging in as admin
//             let res = await chai.request(app)
//                 .post("/auth/login")
//                 .send({
//                     email: "admin7@gmail.com",
//                     password: "admin123"
//                 });
//             if (res.status === 200 && res.body.token) {
//                 adminToken = res.body.token;
//                 console.log("Admin login successful");
//             }
//         } catch (err) {
//             // If login fails, register and then log in as admin
//             try {
//                 let res = await chai.request(app)
//                     .post("/auth/register")
//                     .send({
//                         name: "Admin User",
//                         email: "admin7@gmail.com",
//                         password: "admin123",
//                         phone: "1234567890",
//                         role: "Admin"
//                     });
//                 expect(res).to.have.status(201);
//                 res = await chai.request(app)
//                     .post("/auth/login")
//                     .send({
//                         email: "admin7@gmail.com",
//                         password: "admin123"
//                     });
//                 expect(res).to.have.status(200);
//                 adminToken = res.body.token;
//                 console.log("Admin registered & logged in");
//             } catch (error) {
//                 console.error("Admin setup error:", error.response ? error.response.body : error);
//                 throw error;
//             }
//         }
//     });

//     // 1. Create a new course (Admin only)
//     it("should create a new course (Admin only)", async function () {
//         const res = await chai.request(app)
//             .post("/courses/create")
//             .set("Authorization", `Bearer ${adminToken}`)
//             .field("title", "Test Course")
//             .field("description", "This is a test course")
//             .field("videoUrl", "https://example.com/video")
//             .field("price", "99.99")
//             .attach("file", "./test/testCourseImage.jpg"); // Ensure this file exists!

//         console.log("Create Course Response:", res.body);
//         expect(res).to.have.status(201);
//         expect(res.body).to.have.property("message", "Course created successfully");
//         expect(res.body).to.have.property("course");
//         courseId = res.body.course._id;
//         expect(courseId).to.exist;
//     });

//     // 2. Get all courses (Admin only)
//     it("should get all courses", async function () {
//         const res = await chai.request(app)
//             .get("/courses/all")
//             .set("Authorization", `Bearer ${adminToken}`);
//         console.log("Get All Courses Response:", res.body);
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an("array");
//     });



//     // 4. Delete the course (Admin only)
//     it("should delete the course", async function () {
//         const res = await chai.request(app)
//             .delete(`/courses/delete/${courseId}`)
//             .set("Authorization", `Bearer ${adminToken}`);
//         console.log("Delete Course Response:", res.body);
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property("message", "Course deleted successfully");
//     });
// });



const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Ensure this points to your server entry file
const { expect } = chai;

chai.use(chaiHttp);

describe("Course API Tests", () => {
    let courseId = "";
    let userToken = "";
    let userId = "";

    /**
     * ✅ Step 1: User Login to Get Auth Token (Needed for Course Creation & Enrollment)
     */
    it("should log in a user to get token", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/auth/login")
            .send({ email: "anjali@gmail.com", password: "12345678" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        expect(res.body.user).to.have.property("_id");

        userToken = res.body.token;
        userId = res.body.user._id;
    });

    /**
     * ✅ Step 2: Create a New Course (Profile Picture as Image)
     */
    it("should create a new course", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .post("/courses/create")
            .set("Authorization", `Bearer ${userToken}`)
            .field("title", "Test Course")
            .field("description", "This is a sample course")
            .field("videoUrl", "https://example.com/video.mp4")
            .field("price", 100)
            .attach("profilePicture", Buffer.from("dummy file content"), "course.jpg"); // ✅ Using profilePicture for image upload

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "Course created successfully");
        expect(res.body.course).to.have.property("image").that.includes("/uploads/courses/");
        courseId = res.body.course._id;
    });

    /**
     * ✅ Step 3: Fetch All Courses
     */
    it("should fetch all courses", async function () {
        this.timeout(5000);
        const res = await chai.request(app).get("/courses/all");
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.greaterThan(0);
    });

    /**
     * ✅ Step 4: Fetch Course by ID
     */
    it("should fetch a course by ID", async function () {
        this.timeout(5000);
        const res = await chai.request(app).get(`/courses/${courseId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id", courseId);
    });

    /**
     * ✅ Step 5: Enroll the User in the Course
     */
    // it("should enroll the user in a course", async function () {
    //     this.timeout(5000);
    //     const res = await chai.request(app)
    //         .post(`/courses/${courseId}/enroll`)
    //         .set("Authorization", `Bearer ${userToken}`);

    //     expect(res).to.have.status(200);
    //     expect(res.body).to.have.property("message", "Successfully enrolled in course");
    // });

    /**
     * ✅ Step 6: Check if User is Already Enrolled
     */
    // it("should check if the user is enrolled", async function () {
    //     this.timeout(5000);
    //     const res = await chai.request(app)
    //         .get(`/courses/enrollment/check/${userId}/${courseId}`)
    //         .set("Authorization", `Bearer ${userToken}`);

    //     expect(res).to.have.status(200);
    //     expect(res.body).to.have.property("enrolled", true);
    //     expect(res.body).to.have.property("message", "Already enrolled in this course");
    // });

    /**
     * ✅ Step 7: Delete the Course
     */
    it("should delete the course", async function () {
        this.timeout(5000);
        const res = await chai.request(app)
            .delete(`/courses/delete/${courseId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Course deleted successfully");
    });
});
