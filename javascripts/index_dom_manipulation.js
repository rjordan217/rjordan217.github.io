function removeOverlay() {
  var overlay = document.getElementsByClassName('overlay');
  var underConst = document.getElementsByClassName('under-construction');
  overlay[0].remove();
  underConst[0].remove();
}

setTimeout(removeOverlay, 3000);


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

// start process
optimizedResize.add(function() {
    if (window.innerWidth <= 1100) {
      if(document.images[0].src !== './res/insta.jpg') document.images[0].src = './res/insta.jpg';
    } else {
      if(document.images[0].src !== './res/marchetti.jpg') document.images[0].src = './res/marchetti.jpg';
    }
});

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
stackable, lazy-loading queries. I did this breaking existing query code into \
module, and having the methods of that module return objects of a new Relation \
class that would only evaluate SQL queries when absolutely necessary. \
Optimizations such as this reduce bottlenecks in the server request/response \
cycle and are crucial for high-quality production-level web servers. I hope to \
work on similar backend projects in the future!</p>"
];

// var $projectDesc = $("<div class='project-description'>\
// <div class='arrow-up'></div>\
// </div>");
//
// var $projContent = $("<div class='project-content'>\
// <h2>Description: </h2>\
// </div>");
//
// var $projAnchor = $("<div id='proj-desc-anchor'></div>");
// $projContent.append($projAnchor);
// $projectDesc.append($projContent);
//
// var $projects = $(".projects-flex a");
// $projects.mouseleave(clearProjectInfo);
//
// var clearCallID;

var projAnchor = document.getElementById('proj-desc-anchor');

function displayProjectInfo(idx) {
  projAnchor.innerHTML = PROJECT_DESCRIPTIONS[idx];
  // $projectDesc.remove();
  // $projAnchor.html(PROJECT_DESCRIPTIONS[idx]);
  // $projects.eq(idx).after($projectDesc);
  // $projectDesc.mouseenter(function() {
  //   if(clearCallID) clearTimeout(clearCallID);
  // });
  // $projectDesc.mouseleave(function() {
  //   clearProjectInfo();
  // });
}

//
// function clearProjectInfo() {
//   clearCallID = setTimeout(function() {
//     $projectDesc.remove();
//   }, 500);
// }
