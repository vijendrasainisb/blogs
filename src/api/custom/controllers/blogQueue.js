const Queue = require('bull');
const Redis = require('ioredis');

// Initialize Redis connection info for blogs queue process
const redis = new Redis();

// Create a queue
const blogQueue = new Queue('blogQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// Define a job processor for process output Queue
blogQueue.process(async (job) => {
  const { Title, Description, Image, Status } = job.data;

  try {
     // Check if a blog with the same title already exists in db process
     const existingBlog = await strapi.entityService.findMany('api::blog.blog', {
      filters: { Title: Title.trim() },
      limit: 1,        
    });
    console.log(`Searching for blog with title: '${Title.trim()}'`);
    console.log('Query result:', existingBlog);
    if (existingBlog.length > 0) {
      console.log('Blog with this title already exists');
    } else {
      // If not, create a new blog post in db process sawp trim title
      
      const newBlog = await strapi.entityService.create('api::blog.blog', {
        data: {
          Title: Title.trim(),
          Description,
          Status,
        },
      });
      console.log(newBlog,'newblog');
    }
  } catch (error) {
    console.error('Error processing job:', error);
    return Promise.reject(error);
  }
});

module.exports = blogQueue;