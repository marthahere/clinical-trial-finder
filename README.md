# Clinical Trial Finder

A small app for searching clinical studies by condition and narrowing them down by recruitment status. The raw ClinicalTrials.gov data is big and deeply nested, so each study here is cut down to the basics: title, status, phase, location, last update, and a link to the original record.

## Running it

You need Node 20 or newer. There's no API key and no .env file, since the API is public.

```bash
git clone https://github.com/marthahere/clinical-trial-finder.git
cd clinical-trial-finder
npm install
npm run dev
```

Then open the address Vite prints, usually http://localhost:5173.

## Using it

Type a condition and press Search (it starts on "diabetes"). The status dropdown filters as soon as you change it. Open "Study summary" on a card to read the description, or tick "Show all summaries" to open them all. "View original record" goes to the full study on ClinicalTrials.gov.

If the site is down or takes longer than 10 seconds, you'll get an error message. Press Search again to retry.

## How it's put together

`App.jsx` handles the search, the filter, the request, and the loading and error states. `studyUtils.js` cleans up each record and fills in blanks. `StudyCard.jsx` displays one study. The browser talks to the API directly, with no server of my own. The reasons are in [DECISIONS.md](DECISIONS.md).

## What the data can't tell you

This shows what's registered, not what's true. A study being listed doesn't mean it's recruiting, because the status is whatever the team last reported and can be out of date, so check the last updated date. It also doesn't mean the treatment works or is safe, and finished studies may have failed. "Not listed" means the record left that field blank. Phase "N/A" is for studies that aren't drug trials in phases, like behavioral or device studies.

This is not medical advice.

## Left out

- Only the first 20 results show, with no pagination and no total count.
- Only the first three locations of each study show.
- The status dropdown has four options, so some statuses can't be picked.
- No accounts, saved searches, or recommendations.
- No automated tests. I checked the failure cases by hand, by going offline and forcing a very short timeout.