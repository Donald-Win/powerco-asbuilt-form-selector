// serviceWorkerRegistration.js
// Auto-update logic for PWA

let swRegistration = null;

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
      
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          swRegistration = registration;
          console.log('[App] Service Worker registered');
          
          // Check for updates every 60 seconds
          setInterval(() => {
            console.log('[App] Checking for updates...');
            registration.update();
          }, 60000);
          
          // Check for updates on visibility change (tab becomes visible)
          document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
              console.log('[App] Tab visible, checking for updates...');
              registration.update();
            }
          });
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[App] New service worker found!');
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('[App] New version available!');
                showUpdateNotification(newWorker);
              }
            });
          });
        })
        .catch((error) => {
          console.error('[App] Service Worker registration failed:', error);
        });
      
      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[App] Controller changed, reloading...');
        window.location.reload();
      });
    });
  }
}

function showUpdateNotification(worker) {
  // Create update notification
  const notification = document.createElement('div');
  notification.id = 'update-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #4F46E5;
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 90%;
      animation: slideDown 0.3s ease-out;
    ">
      <div style="flex: 1;">
        <div style="font-weight: bold; margin-bottom: 4px;">
          Update Available!
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          A new version of the app is ready.
        </div>
      </div>
      <button id="update-button" style="
        background: white;
        color: #4F46E5;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      ">
        Update Now
      </button>
      <button id="dismiss-button" style="
        background: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      ">
        Later
      </button>
    </div>
    <style>
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      #update-button:hover {
        transform: scale(1.05);
      }
      #dismiss-button:hover {
        background: rgba(255,255,255,0.1);
      }
    </style>
  `;
  
  document.body.appendChild(notification);
  
  // Update button click
  document.getElementById('update-button').addEventListener('click', () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
    notification.remove();
  });
  
  // Dismiss button click
  document.getElementById('dismiss-button').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-update after 10 seconds
  setTimeout(() => {
    if (document.getElementById('update-notification')) {
      console.log('[App] Auto-updating after 10 seconds...');
      worker.postMessage({ type: 'SKIP_WAITING' });
      notification.remove();
    }
  }, 10000);
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
