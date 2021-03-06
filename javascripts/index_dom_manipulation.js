window.isMobile = false;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent)) window.isMobile = true;

if(!window.isMobile) {
  var optimizedResize = (function() {

      var callbacks = [],
          running = false;

      // fired on resize event
      function resize() {

          if (!running) {
              running = true;

              if (window.requestAnimationFrame) {
                  window.requestAnimationFrame(runCallbacks);
              } else {
                  setTimeout(runCallbacks, 66);
              }
          }

      }

      // run the actual callbacks
      function runCallbacks() {

          callbacks.forEach(function(callback) {
              callback();
          });

          running = false;
      }

      // adds callback to loop
      function addCallback(callback) {

          if (callback) {
              callbacks.push(callback);
          }

      }

      return {
          // public method to add additional callback
          add: function(callback) {
              if (!callbacks.length) {
                  window.addEventListener('resize', resize);
              }
              addCallback(callback);
          }
      }
  }());

  var aboutImg = document.getElementById('about-img');
  // start process
  optimizedResize.add(function() {
      if (window.innerWidth <= 1100) {
        if(aboutImg.src !== './res/insta.jpg') aboutImg.src = './res/insta.jpg';
      } else {
        if(aboutImg.src !== './res/marchetti.jpg') aboutImg.src = './res/marchetti.jpg';
      }
  });
}

var PROJECT_DESCRIPTIONS = [
  "<h2>Petsy</h2><hr>\
<p>This experimental mockup site gives pet lovers a marketplace \
to find specialty crafted pet items from smaller, creative vendors. The site was \
inspired by Etsy (surprisingly enough). Petsy gives consumers access to a much \
wider variety of pet toys and craftspeople, short-circuiting the homogeneity of \
a large corporate chain like PetSmart. If the idea were to take off, it may \
evolve to have many different departments, some focused on innovative ways to \
keep pets active, with others specialized in nutrition.</p><p>This was actually a \
solo project, so I did everything from setting up the backend with all its \
authentication steps and data processing logic, all the way to creating a \
ReactJS frontend that fetches content via AJAX requests and handles nearly all \
the content rendering logic. This project gave me a good deal of insight into \
how websites integrate all the facets of information input, processing, and \
storage to perform a desired task for users.</p>",
  "<h2>9 Ball Pool</h2><hr>\
<p>This is a JavaScript remake of the classic billiards game on an HTML \
canvas. It was constructed using OOP principles, with different constructor \
functions split into classes (and added to the final script through webpack). \
The project presented many challenges, like implementing elastic collisions with \
discrete logic and disabling/removing certain objects between turns. The game \
was integrated with a GameView built in jQuery, which added a fun layer of \
complexity to the coding challenge. Shadows were added to give the balls some \
dimensionality, but future directions for the project include implementing 3d \
rendering (though still using a 2d context).</p><p>I built the entire program \
(and had a lot of fun doing it!) I especially enjoyed rehashing my days in \
physics class, redoing the center of momentum calculation to determine the \
final velocities of two objects after an elastic collision. I learned a lot \
about modeling real world physical systems with the discrete logic of a \
computer. For instance, I initially had a problem with balls sticking together \
after collisions, and so I had to force additional movement to occur before the \
next animation frame. This was also a great experience in integrating a jQuery \
GameView with the actual VanillaJS logic. I hope to add some 3-dimensional \
rendering soon by a few modifications to the Ball#draw function and by adding \
two angle variables to Ball objects.</p>",
  "<h2>RailsLite</h2><hr>\
<p>This project was built in Ruby and inspired by the Rails framework \
developed by DHH. The core functionality is established in two main portions of \
the library. One chunk is dedicated to dealing with database querying and \
translating query results into Ruby objects in a manner reminiscent of Rails' \
ActiveRecord class. The other portion essentially implements the controller and \
view components of an MVC architecture. Rack middleware and ERB are integrated \
into the project to enable simple HTTP request processing and dynamic view \
generation. Features will soon be added to download RailsLite as a gem with a \
command line tool for quick creation of full projects and named models, views, \
and controllers.</p><p>I built all the logic for RailsLite, from the \
route-matching controller classes to the models that build objects directly \
from database queries to the views that interpret embedded Ruby code and \
translate it to HTML. The entry point for the Rails server is built on Rack \
middleware, as well as some customized middleware that I built to do things \
like render server error messages with a helpful stack trace and format \
responses with non-HTML content. Just one of the challenges I really enjoyed \
in this project was optimizing my model base class (SQLObject) to implement \
stackable, lazy-loading queries. I did this by breaking existing query code into \
module, and having the methods of that module return objects of a new Relation \
class that would only evaluate SQL queries when absolutely necessary. \
Optimizations such as this reduce bottlenecks in the server request/response \
cycle and are crucial for high-quality production-level web servers. I hope to \
work on similar backend projects in the future!</p>",
  "<h2>JavaScript Calligrapher</h2><hr>\
<p>My JavaScript Calligrapher is a pet project that I hope to expand into \
a full-fledged language-learning app. This tool is meant to take away one of \
the many challenges I have faced in trying to learn languages on my own: <strong>\
How do I write the letters and characters?!</strong> For now, the primary alphabet \
in my library is Arabic, but I am adding optimizations to both shrink the size of \
calligrapher letter files, and also to allow quick and easy generation of any number \
of calligraphic shapes. When I expand the project into a full app, the user will \
be able to generate and save any number of her own dynamically drawn characters.</p>\
<p>The JSCalligrapher is another solo project that I believe has a lot of promise \
for future expansion. When I expand this project into a language app, I will \
likely onboard a few friends to help make this dream a reality. Nothing compares \
to the excitement and satisfaction I feel when learning a new language and using \
it to connect with diverse people with very different experiences than my own. \
This is a feeling that I want to share with the whole world, and I know it can \
make this world a better, more understanding place!</p>",
  "<h2>Mandelbrot Visualizer</h2><hr>\
<p>The Mandelbrot generator is a project I would like to dedicate to all my fellow \
math enthusiasts out there. Even non-mathematically inclined people must marvel at the \
beauty of this amazing fractal set. The definition of the Mandelbrot is actually \
quite simple, though the final product is so complex. The <a href=\
'https://en.wikipedia.org/wiki/Mandelbrot_set' title='More information here'>\
Mandelbrot set</a> is made up of all points in the complex plane <i>c</i> for \
which the image of the complex function <i>f(z) = z</i><sup>2</sup> + <i>c</i>, \
when applied iteratively starting with <i>z</i> = 0, remains bounded (i.e., does \
not escape to infinity).</p><p>The Mandelbrot project actually began as a speed \
programming challenge that I gave myself, so I implemented the basic image generator \
in 30 minutes. After this, I took a bit of time to optimize the render speed by \
hard-coding in the main cardioid and disc portions of the image, since the rendering \
function takes longest to loop through its calculations on pixels inside the \
Mandelbrot. The next most immediate features I hope to add to this project are \
zoom functionality and a Julia set generator in a side-window.</p>",
  "<h2>RedditReactive</h2><hr>\
<p>RedditReactive supplies its users with an easy way to see the hottest posts on Reddit, \
search and view posts and subreddits, and subscribe/unsubscribe from subreddits. Due to \
the requirements of the Reddit API, a user can only see the hottest new links on Reddit \
before logging in; however, the full functionality listed above is available once the \
user logs in and gives the app permission to manage his or her account. Mobile-specific \
functionality is also fairly minimal, but includes the ability to collapse the top- and \
sidebars.</p><p>The application relies on the Reddit API to serve content. The \
simplest call to get the trending links on Reddit's main page can be made without \
user authentication, but all additional functionality requires the user to give \
RedditReactive account permissions. Reddit will then verify the user and, assuming \
the user gives the app permissions, redirect back to the application with an OAuth2 \
token encoded in the query string of the URL. Once the application is updated with \
the user's token, the Redux store triggers the application to fetch the username \
and the user's subreddit subscriptions. Once the response is parsed, the results \
are displayed in their corresponding ReactDOM components. Most of these components \
are fitted with infinite scroll functionality. I chose to build this application \
with the Redux architecture, which is a paradigm for maintaining all application \
state in a single store. This helps avoid race conditions and makes for stricter \
management of application state and event dispatching. While race conditions \
were not a major concern at such an early stage of development, should I \
choose to expand the application, this could become a major boon when keeping track of \
a more significant state load.</p><p>There is a lot that could be added and improved on \
in this application, so if you have any ideas, please feel free to reach out and help me \
improve this project! It was developed as part of a coding challenge, but I genuinely \
enjoyed the experience and would love to add some functionality and rework any features \
necessary to optimize UX. Some of the lowest hanging fruit that I could add is voting \
capabilities so that users may vote up or vote down a post. A nice, clean interface to \
add comments and scroll through replies would also be very nice, and another good area \
to differentiate this application from the somewhat aesthetically lacking Reddit UI. \
Let me know anything else you would like to see!</p>"
];

var projAnchor = document.getElementById('proj-desc-anchor');

function displayProjectInfo(idx) {
  projAnchor.innerHTML = PROJECT_DESCRIPTIONS[idx];
}
