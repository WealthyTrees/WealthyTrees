/* Daily Edition loader: paste at the very BOTTOM of site.js. It adds the "Daily Edition" tab inside the Newsroom on the home page. */
(function () {
  if (!document.getElementById("p-live")) return;
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/edition.css?v=3"; document.head.appendChild(l);
  var s = document.createElement("script"); s.src = "/edition.js?v=3"; s.defer = true; document.body.appendChild(s);
})();
