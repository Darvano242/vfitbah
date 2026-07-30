/* Captured from the verified VFitness production shell. */
// ON-SCREEN ERROR CATCHER, shows any load/parse/runtime error instead of a blank screen
        (function(){
            function showErr(msg, src){
                var root = document.getElementById('root');
                if (!root) return;
                if (document.getElementById('vfit-err')) return;
                root.innerHTML = '<div id="vfit-err" style="min-height:100vh;background:#08090a;color:#fff;padding:24px;font-family:system-ui,sans-serif;">'
                    + '<div style="max-width:520px;margin:40px auto;">'
                    + '<div style="font-weight:800;font-size:22px;margin-bottom:8px;">VFITNESS</div>'
                    + '<div style="color:#94a3b8;margin-bottom:16px;">The app hit an error while loading. Details below (screenshot this and send to support):</div>'
                    + '<pre style="background:#111418;border:1px solid #1f2937;border-radius:10px;padding:14px;white-space:pre-wrap;word-break:break-word;color:#fca5a5;font-size:13px;">' + (src?('['+src+'] '):'') + String(msg) + '</pre>'
                    + '<button onclick="location.reload()" style="margin-top:14px;background:linear-gradient(120deg,#3d7dff,#6f5bff);color:#fff;border:none;border-radius:10px;padding:12px 22px;font-weight:700;cursor:pointer;">Reload</button>'
                    + '</div></div>';
            }
            function appHasRendered(){
                var root = document.getElementById('root');
                // app rendered if root has real children that aren't our error box
                return root && root.children.length > 0 && !document.getElementById('vfit-err');
            }
            window.addEventListener('error', function(e){
                // Only surface fatal errors that happen BEFORE the app renders (script/parse failures)
                if (appHasRendered()) return;
                var msg = (e.error && e.error.stack) || e.message || '';
                // ignore noise from 3rd-party scripts / network
                if (/firebasejs|gstatic|paypal|tailwind|lucide/i.test(String(msg))) return;
                showErr(msg, 'error');
            });
            // Background promise rejections (Firestore listeners, network) must NEVER blank the app
            window.addEventListener('unhandledrejection', function(e){
                console.warn('Unhandled promise (ignored):', e.reason);
            });
            // Safety: if nothing renders within 6s, surface a hint
            setTimeout(function(){
                var root = document.getElementById('root');
                if (root && root.children.length === 0) showErr('App did not render within 6 seconds. A script (React, Babel, Firebase, or the app) likely failed to load. Check your internet/CDN access, then reload.', 'timeout');
            }, 6000);
        })();
