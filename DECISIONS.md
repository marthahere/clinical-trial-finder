# Decisions

Three choices that would be the most work to undo.

## 1. Calling the API straight from the browser

I thought about writing a small server to sit in between. However, the API is public, needs no key, and allows browser requests, so a server would have been one more thing to build and host for no real gain.

The cost is that nothing is cached, and I'm counting on the API to keep allowing this. If it ever required a key, I'd have to add a server and rework how the app gets its data.

## 2. Cleaning up each record before showing it

The API returns big nested records where almost any field can be missing. I could have handed them straight to the card and checked for gaps there. Instead every record goes through one function, `normalizeStudy`, that turns it into a flat object with placeholders filled in.

The cost is that the app only knows about the few fields I picked, and everything else in the record is thrown away. If the API changes its shape, I have to update that one function by hand. It also hides the reason a field is empty, because "Not listed" looks the same whether the study left it blank or the API moved it somewhere I'm not looking.

## 3. Letting the API do the searching and filtering

The other option was loading one batch of studies and filtering it in the browser. That would only filter those 20 and miss nearly everything else that matches.

The cost is that every search or filter change waits on a network request.

This one turned out awkward. The dropdown searches again as soon as you change it, but the text box waits for the Search button, because searching on every keystroke would fire a request per letter. The two controls behave differently and I haven't fixed that. Making the dropdown wait for the button would be easy, but it adds a click to the most common action.