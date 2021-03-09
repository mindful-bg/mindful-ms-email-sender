export default () => {
  return {
    serviceName: 'mindful-ms-email-sender',
    ms: {
      emailSender: {
        urls: [
          process.env.MS_EMAIL_SENDER_URL ||
            'amqp://guest:guest@localhost:5672',
        ],
        queue: process.env.MS_EMAIL_SENDER_QUEUE_NAME || 'email',
        queueOptions: {
          durable: false,
        },
      },
      logger: {
        urls: [
          process.env.MS_LOGGER_URL || 'amqp://guest:guest@localhost:5672',
        ],
        queue: process.env.MS_LOGGER_QUEUE_NAME || 'log',
        queueOptions: {
          durable: false,
        },
      },
      logController: {
        host: process.env.MS_LOG_CONTROLLER_HOST || 'localhost',
        port: process.env.MS_LOG_CONTROLLER_PORT || '3000',
      },
      content: {
        host: process.env.MS_CONTENT_HOST || 'localhost',
        port: process.env.MS_CONTENT_PORT || '3001',
      },
      blog: {
        host: process.env.MS_BLOG_HOST || 'localhost',
        port: process.env.MS_BLOG_PORT || '3002',
      },
    },
    email: {
      host: process.env.MS_EMAIL_SENDER_HOST || 'smtp.gmail.com',
      port: process.env.MS_EMAIL_SENDER_PORT || 465,
      secure: process.env.MS_EMAIL_SENDER_SECURE || true,
      usernames: process.env.MS_EMAIL_SENDER_HOSTS,
      passwords: process.env.MS_EMAIL_SENDER_PASSWORDS,
    },
  };
};
