// Replace YOUR_USERNAME with your Buttondown username after you create the free account.
const BUTTONDOWN = "arorapriyansh";
const nl = document.getElementById("nl");
if (nl) {
  nl.className = "nl";
  nl.innerHTML = `<div class="wrap"><h2>Get the brief by email</h2>
  <p>One short, plain-English market email. No tips, no spam. Unsubscribe any time.</p>
  <form action="https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN}" method="post" target="popupwindow"
   onsubmit="window.open('https://buttondown.com/${BUTTONDOWN}','popupwindow')">
  <input type="email" name="email" required placeholder="you@example.com" aria-label="Email address">
  <input type="hidden" value="1" name="embed"><button class="btn" type="submit">Subscribe</button></form>
  <small>We use your email only to send the brief.</small></div>`;
}
