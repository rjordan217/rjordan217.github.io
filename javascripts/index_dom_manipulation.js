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
