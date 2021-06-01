const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "silksatinbyjune-server",
      version: "0.1.0",
      description:
        "E-commerce web application for nightware apparell brand and documented with Swagger",
      license: {
        name: "ISC",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Prince Akpabio",
        url: "https://apabioprince.netlify.app",
        email: "princeakpabio90@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000/",
      },
    ],
  },
  apis: ["./routes/products.js", "./products/id"],
};

module.exports = {
  options,
};
