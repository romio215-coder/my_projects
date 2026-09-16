import { createHandler } from './handler.js';
Deno.serve(createHandler({
    SUPABASE_URL: Deno.env.get('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    TURNSTILE_SECRET_KEY: Deno.env.get('TURNSTILE_SECRET_KEY'),
    ALLOWED_ORIGINS: Deno.env.get('ALLOWED_ORIGINS'),
}));
