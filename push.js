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
   "endpoint": "https://fcm.googleapis.com/fcm/send/eIbtFG9QJZ0:APA91bE73SMPCi-ZiCcNFWyUyICaWqqmPqdrR_GH08fGGo43rzulDnpLAvzHwl7E_O9zyUm-zI9LL0dKOLz4F8W4T9oxqT3AiNXnYal2etDxXa7no7o6jBokFmGN8RSJhFJdUfJajwcj",
   "keys": {
       "p256dh": "BHNfyG2YFoJtp32UnucU3EPVZSKNjTG4X5RZHaaqGWWlumGxqKIKTrWKbGLc9K91rqkHGgsU09gTBvYPiH7j5Lc=",
       "auth": "kj+pFiSiRm/6UQanBuZkYQ=="
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