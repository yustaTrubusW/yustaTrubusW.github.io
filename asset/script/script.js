// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(function() {
                console.log("Pendaftaran ServiceWorker berhasil");
            })
            .catch(function() {
                console.log("Pendaftaran ServiceWorker gagal");
            });
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const requestPermission = () => {
    navigator.serviceWorker.ready.then(() => {
        Notification.requestPermission().then((result) => {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            if ('PushManager' in window) {
                navigator.serviceWorker.getRegistration().then((registration) => {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array("BCLu6m8h9upRH6k4jvni4wG6VizEeK3QJ7ry9fGfAUARJvSAKCGd_-0BSRmwKbsXy-8fe92dP_Iw2DjJM5yw29w")
                    }).then((subscribe) => {
                        console.log("Berhasil subcribe endpoint: ", subscribe.endpoint);
                        console.log("Berhasil subcribe dengan  p256dh key: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh')))));
                        console.log("berhasil subscribe dengan authKey: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth')))));
                    }).catch(function(e) {
                        console.error('Tidak dapat melakukan subscribe ', e.message);
                    });
                })
            }
        });
    })
}

if ("Notification" in window) {
    requestPermission();
} else {
    console.error("Browser tidak mendukung notifikasi.");
}