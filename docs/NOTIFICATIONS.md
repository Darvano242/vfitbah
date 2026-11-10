# Notification Center (vfitbah.com)

Automated client messages over WhatsApp, SMS and email. Admin page: Business dashboard > Notifications.
Clients choose their channel and give consent on their dashboard ("Session reminders").

## Where it runs
- Engine: VFIT backend (Base44 app 6a0105785d309cbb9ad53ee3)
  - `base44/functions/siteNotify` (job + admin + client actions), `base44/functions/siteNotifyHook` (provider callbacks, unsubscribe)
  - `base44/shared/notifyEngine.js` (planning logic, unit tested in `tests/notify-engine.test.mjs`), `siteFirestore.ts`, `notifyProviders.ts`
  - Workflow "Site Notifications", every 15 minutes (America/Nassau). Works with every browser closed.
  - Entities: siteNotifyMessages, siteNotifyTemplates, siteNotifyConfig, siteNotifyPrefs, siteNotifyReplies (admin only).
- Website: `api/notify.js` relays to siteNotify with the signed-in user's Firebase token. UI in `vf26/vfit-2026.js`
  (NotificationCenter, ReminderPrefs), wired in by `vf26/apply-vfit-2026-site.js` step 6n.

## Triggers
Booking received / confirmed / changed / cancelled (appointments in Firestore; deleted future bookings count as cancelled),
reminders 24 h and 2 h before, 3 sessions left, 1 session left, package expired (within 14 days), trainer schedule change
and manual messages (Send tab). "Session completed" updates are done by the site itself (Log session, Today check-in).
Every message has a key (kind:record:stage) and is created once. Moved or cancelled bookings cancel their waiting reminders.
Quiet hours (default 21:30 to 07:00 Nassau) delay messages; a 2 h reminder inside quiet hours is skipped.
The first run seeds what exists so old bookings are not messaged.

## Safety
- Live sending is off until an admin turns it on. The server refuses unless every enabled template on every channel in use
  is approved and each of those channels has a successful test message. Until then messages are "held".
- Delivered/read only come from provider webhooks (signature checked), never from the send call.
- Retries: transient errors only, at most 3 (2, 10, 30 minutes). A row is claimed (queued -> sending) before sending.
- SMS fallback only for clients who separately agreed to SMS. STOP replies, the email unsubscribe link and spam
  complaints switch consent off. Reminders are transactional; no promotions are sent from here.

## Secrets (set in the VFIT app, Base44 > Settings > Secrets)
| Secret | What |
|---|---|
| FIREBASE_SERVICE_ACCOUNT | JSON key: Firebase console > Project settings > Service accounts > Generate new private key (paste the whole file) |
| RESEND_API_KEY, NOTIFY_EMAIL_FROM | Resend key and a sender on a verified domain, e.g. `VFITNESS <reminders@vfitbah.com>` |
| RESEND_WEBHOOK_SECRET | Resend > Webhooks, endpoint `<hook>?src=resend`, events sent/delivered/bounced/complained/opened |
| TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN | Twilio console |
| TWILIO_MESSAGING_SERVICE_SID or TWILIO_SMS_FROM | SMS sender. Twilio sends to Bahamian numbers but two-way SMS is not supported there |
| TWILIO_WHATSAPP_FROM | Approved WhatsApp sender (+1...). Business-initiated messages need Meta-approved templates: paste each Content SID on the template |
| NOTIFY_LINK_SECRET (optional) | Signs unsubscribe links (falls back to VFIT_JOB_SECRET) |

Hook address: `https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/functions/siteNotifyHook`
(`?src=twilio` status callback is set automatically per message; set `?src=twilio-in` as the incoming message webhook
on the Twilio number and WhatsApp sender).
