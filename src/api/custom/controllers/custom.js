'use strict';

/**
 * A set of functions called "actions" for `custom` for blog
 */

 const blogQueue = require("./blogQueue");

module.exports = {
  GetMessage: async (ctx, next) => {
    try {
      const Body = ctx.request.body;
      // console.log(Body.Title,'sss', Body);
      if (!Body || !Body.Title) {
        ctx.throw(400, 'Title is required field');
      }

      const { Title, Description, Image, Status } = Body;

        // Loop to add 500 posts to the queue
      for (let i = 1; i <= 5000; i++) {
        const postTitle = `${Title}${i}`;
        
        // Add a job to the queue
        await blogQueue.add({
          Title: postTitle,
          Description,
          Status
        });
      }

        ctx.body = {
          message: 'New blog created successfully'
        };
      
    } catch (err) {
      ctx.throw(500, err.message);
    }
  },
};
