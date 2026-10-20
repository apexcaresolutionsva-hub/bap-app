# BAP lead screen

The web screen for BAP leads: county foreclosure notices, unpaid property taxes and
code complaints, scored and filterable. Data comes from the BAP Supabase database,
filled daily by the private `bap-scraper` bot.

- Sign-in uses Supabase Auth. Only signed-in users can read leads (row-level security).
- The key in `index.html` is Supabase's **publishable** key, which is meant to be public.
  Never put a secret / service-role key in this repo: the repo is public.
- Hosted by GitHub Pages from the `main` branch.
