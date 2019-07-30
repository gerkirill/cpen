# CLI downloader tool for https://codepen.io/

I often start my small UI POCs at codepen. Why? It is easy to start, zero setup required, easy to share. But at some point I want to download that POC to my computer and proceed using my favorite IDE with plugins, comfortable theme, etc.

This CLI is created to perform the following:
 - download you code-pen to local drive
 - start local development server
 - open your code-pen in your browser

and everything with a single command! So idea is to have your codepen running locally instantly.

 - use typescript
 - create folder if not there
 - get _source_ code (not transpilled)
 - grab dependencies (pre-compilled)
 - setup webpack or parcel
 - start dev server, open on browser window with live reload
 - setup test code pens, maybe group by hashtag or special user
 - try to get latest pens by username
 - tests, automatic npm deployment after build
 - start small (html, pure js, css)
 - maybe really use scrappy to properly get that json from html

 npm run dev -- https://codepen.io/gerkirill/pen/MxYbBJ ./tmp

 browser-sync ./tmp -w (maybe also cwd)