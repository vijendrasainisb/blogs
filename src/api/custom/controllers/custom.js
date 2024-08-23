'use strict';

/**
 * A set of functions called "actions" for `custom`
 */

const Queue = require('bull');
const Redis = require('ioredis');

// Initialize Redis connection
const redis = new Redis();

// Create a queue
const statusQueue = new Queue('status-queue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// Define a job processor
statusQueue.process(async (job) => {
  const { id } = job.data;

  try {
    // Fetch the record from the database
    const record = await strapi.query('blog').findOne({ id });

    if (record) {
      // Check the status or perform your logic here
      const updatedStatus = checkStatus(record); // Define this function to check status

      // Update the status in the database
      await strapi.query('blog').update({ id }, { status: updatedStatus });

      return Promise.resolve(`Record with ID ${id} processed successfully`);
    } else {
      return Promise.reject(new Error(`Record with ID ${id} not found`));
    }
  } catch (error) {
    return Promise.reject(error);
  }
});

function checkStatus(record) {
  // Implement your status checking logic here
  return record.status === 'pending' ? 'completed' : 'pending';
}

// Add a job to the queue
async function addJobToQueue(id) {
  await statusQueue.add({ id });
}

module.exports = {
  GetMessage: async (ctx, next) => {
    try {
      const Body = ctx.request.body;
      // console.log(Body.Title,'sss', Body);
      if (!Body || !Body.Title) {
        ctx.throw(400, 'Title is required field');
      }

      const { Title, Description, Image, Status } = Body;

      // Check if a blog with the same title already exists
      const existingBlog = await strapi.entityService.findMany('api::blog.blog', {
        filters: { Title },
        limit: 1,        
      });
      console.log(existingBlog,'sss', Body);
      if (existingBlog.length > 0) {
        ctx.body = 'Blog with this title already exists';
      } else {
        // If not, create a new blog
        console.log('ggg');
        const newBlog = await strapi.entityService.create('api::blog.blog', {
          data: {
            Title,
            Description,
            Image,
            Status,
          },
        });
        

        ctx.body = {
          message: 'New blog created successfully',
          blog: newBlog,
        };
      }
    } catch (err) {
      ctx.throw(500, err.message);
    }
  },
};
