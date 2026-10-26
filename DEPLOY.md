# Deploy FuturePath with the chatbot (Netlify + GitHub)

## Folder structure (keep it exactly like this)
futurepath/
  index.html
  style.css
  script.js
  chat.js
  config.js            (your Supabase URL + anon/publishable key)
  netlify.toml
  netlify/
    functions/
      chat.js          (chatbot backend)

## 1. Get a free Gemini API key
1. Go to aistudio.google.com and sign in with a Google account.
2. Click **Get API key** > **Create API key**. Copy it.
3. NEVER put this key in config.js or any file. It only goes into Netlify (step 3).
Note: on the free tier Google may use what people type to improve its products, so the chat tells students not to share personal details.

## 2. Put the project on GitHub
1. Create a free account at github.com, then a **New repository** (name: futurepath).
2. Upload the whole folder (keep the netlify/functions folders). "uploading an existing file" on the repo page works for this.

## 3. Deploy on Netlify
1. Sign up at netlify.com (use "Continue with GitHub").
2. **Add new site > Import an existing project > GitHub** > choose futurepath. Leave build settings empty and click **Deploy**.
3. Open **Site configuration > Environment variables** and add:
   - GEMINI_API_KEY = your Gemini key
   - SUPABASE_URL = https://oqgclauujneyvpcukgxb.supabase.co
   - SUPABASE_ANON_KEY = your anon/publishable key
   - (optional) GEMINI_MODEL = the current free model name shown in Google AI Studio, if the default does not work
4. **Deploys > Trigger deploy > Deploy site** so the variables are picked up.
5. Open your site link, tap "Ask FuturePath" and try: "I like computers, my budget is low".

## If the chat says "Sorry, I could not answer that"
- Check the three environment variables are spelled exactly and redeployed.
- In Netlify, open **Logs > Functions > chat**. A "gemini 404" means the model name is wrong: set GEMINI_MODEL to a model listed in AI Studio. A "gemini 429" means the free limit was reached; wait a minute.
- The chat does not work in Live Server (local preview). It works on the Netlify site.
