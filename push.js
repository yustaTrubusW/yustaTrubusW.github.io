const webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BCLu6m8h9upRH6k4jvni4wG6VizEeK3QJ7ry9fGfAUARJvSAKCGd_-0BSRmwKbsXy-8fe92dP_Iw2DjJM5yw29w",
    "privateKey": "iNiBfyTTdHgAaOEKF0kBtgJybRyL9j7Bzel0CO3xYHE"
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/eKTPNDvJ1-8:APA91bFApXhKn8Hz-dsGKVHyLiK3xZ6ClCc36dgrRL40rvHVTK_xLpBh_Rm99NpiOQXH7P_rYbzsS7jsPLYy4RP2E-7xuQuafmSg9k2rnxf1MJ-57OOP7w3MnUy-iqxmda2XZfw1fww_",
   "keys": {
       "p256dh": "BGtH0nmzRpKy1brG/q5NR3SBFnfWgq2eXnizh8Dyr5qiU8dgj6LeHYME8TUR5Q1IJWZYrS/9CUUGDAk9gy17oX4=",
       "auth": "p2Hm8kqvOqf/av7MI5n2Ww=="
   }
};
const payload = 'match baru sedang berlangsung';

var options = {
   gcmAPIKey: '489407451958',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);