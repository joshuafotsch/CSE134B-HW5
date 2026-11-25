# CSE 134B Homework 5 Portfolio

## SSG Exercise

Path: `ssg-exercise/`

Builds two portfolio pages with Eleventy using a shared footer (`ssg-exercise/_includes/footer.njk`):

- **Home**: `ssg-exercise/index.html`
- **About**: `ssg-exercise/about.html`

See [`ssg-exercise/README.md`](ssg-exercise/README.md) for the install, build, and preview commands.

## Design Note

**What the visitor wants to accomplish:**
The visitor wants to laugh at a Dad joke.

**One action traced (control → API request → DOM update):**
If they click the Next joke button, it sends an API request to `https://icanhazdadjoke.com/` and receives the response. If the response is ok, and it contains a string named joke in its data, then it displays the new joke.

**While waiting:**
While waiting, the joke text changes to `Loading Joke`, and the status text changes to `Awaiting Response`.

**On success:**
On success, the joke-box paragraph text gets changed to the newly received joke. And the joke-box status text gets set to show that the joke came from an API call, and displays the responses status code.


**If the request fails:**
If the request fails, then the joke-box text gets set to a joke in the `FALLBACK_JOKES` array. It increments a index that references that array, so if it fails again, it will change the next fallback joke in that array. It then says that they can press the Next joke button again to try and send another request.