// serviceWorkerRegistration.js
// Smooth auto-update logic with loading state (no white screen)

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
      
      // Handle controller change (new SW activated) - SMOOTH RELOAD
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        
        console.log('[App] New version activated, updating...');
        
        // Show loading overlay before reload
        showLoadingOverlay();
        
        // Small delay to ensure overlay is visible
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    });
  }
}

function showLoadingOverlay() {
  // Create full-screen loading overlay
  const overlay = document.createElement('div');
  overlay.id = 'update-loading-overlay';
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="
        width: 60px;
        height: 60px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 24px;
      "></div>
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">
        Updating App
      </div>
      <div style="font-size: 16px; opacity: 0.9;">
        Loading new version...
      </div>
    </div>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(overlay);
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 28px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 20px;
      max-width: 90%;
      animation: slideDown 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    ">
      <div style="
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      ">
        🔄
      </div>
      <div style="flex: 1;">
        <div style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">
          Update Available
        </div>
        <div style="font-size: 14px; opacity: 0.95;">
          A new version is ready to install
        </div>
      </div>
      <button id="update-button" style="
        background: white;
        color: #667eea;
        border: none;
        padding: 12px 24px;
        border-radius: 10px;
        font-weight: bold;
        cursor: pointer;
        font-size: 15px;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">
        Update
      </button>
      <button id="dismiss-button" style="
        background: transparent;
        color: white;
        border: 2px solid rgba(255,255,255,0.4);
        padding: 10px 20px;
        border-radius: 10px;
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
          transform: translateX(-50%) translateY(-120%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      #update-button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
      }
      #update-button:active {
        transform: scale(0.98);
      }
      #dismiss-button:hover {
        background: rgba(255,255,255,0.15);
        border-color: rgba(255,255,255,0.6);
      }
      @media (max-width: 640px) {
        #update-notification > div {
          flex-direction: column;
          text-align: center;
        }
        #update-notification button {
          width: 100%;
        }
      }
    </style>
  `;
  
  document.body.appendChild(notification);
  
  // Update button click - SMOOTH TRANSITION
  document.getElementById('update-button').addEventListener('click', () => {
    notification.remove();
    
    // Show loading overlay BEFORE activating new worker
    showLoadingOverlay();
    
    // Small delay to ensure overlay renders
    setTimeout(() => {
      worker.postMessage({ type: 'SKIP_WAITING' });
      // The controllerchange event will handle the reload with overlay visible
    }, 100);
  });
  
  // Dismiss button click
  document.getElementById('dismiss-button').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-update after 15 seconds (increased from 10)
  setTimeout(() => {
    if (document.getElementById('update-notification')) {
      console.log('[App] Auto-updating after 15 seconds...');
      notification.remove();
      
      // Show loading overlay BEFORE activating
      showLoadingOverlay();
      
      setTimeout(() => {
        worker.postMessage({ type: 'SKIP_WAITING' });
      }, 100);
    }
  }, 15000);
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

