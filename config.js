/* Skill Mate — configuration */
window.SKILLMATE_CONFIG = {
  // Supabase (stores accounts, requests, applications, reports)
  SUPABASE_URL: "",          // e.g. https://xxxxxxxx.supabase.co
  SUPABASE_ANON_KEY: "",     // publishable anon key
  // Optional second Supabase project (public URL only; keep its service key on Render).
  SUPABASE_STORAGE_URL: "",

  // Render media backend (stores images/videos on disk + rehydrates after sleep/restart)
  MEDIA_API: "",             // e.g. https://skillmate-media.onrender.com

  // Optional local fallback when remote services are unavailable.
  DEMO_FALLBACK: true
};
