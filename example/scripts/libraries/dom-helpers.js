// get element by id helper
function get(el) {
  if (typeof el == 'string') return document.getElementById(el);
  return el;
}

// return mouse X-axis position
function mouseX(e) {
  if (e.pageX) {
    return e.pageX;
  }
  if (e.clientX) {
    return e.clientX + (document.documentElement.scrollLeft ?
      document.documentElement.scrollLeft :
      document.body.scrollLeft);
  }
  return null;
}

// return mouse Y-axis position
function mouseY(e) {
  if (e.pageY) {
    return e.pageY;
  }
  if (e.clientY) {
    return e.clientY + (document.documentElement.scrollTop ?
      document.documentElement.scrollTop :
      document.body.scrollTop);
  }
  return null;
}

// make element draggable
function dragable(clickEl,dragEl) {
    if(dragEl === undefined)
        dragEl = clickEl;
  var p = get(clickEl);
  var t = get(dragEl);
  var drag = false;
  offsetX = 0;
  offsetY = 0;
  var mousemoveTemp = null;

  if (t) {

    var move = function (x,y) {
      t.style.left = (parseInt(t.style.left) + x) + "px";
      t.style.top  = (parseInt(t.style.top) + y) + "px";
    }

    var mouseMoveHandler = function (e) {
      e = e || window.event;

      if(!drag)
          return true;

      var x = mouseX(e);
      var y = mouseY(e);

      if (x != offsetX || y != offsetY) {
        move(x-offsetX,y-offsetY);
        offsetX = x;
        offsetY = y;
      }

      return false;
    }
    var start_drag = function (e) {
      e = e || window.event;

      offsetX = mouseX(e);
      offsetY = mouseY(e);
      drag=true; // basically we're using this to detect dragging

      // save any previous mousemove event handler:
      if (document.body.onmousemove) {
        mousemoveTemp = document.body.onmousemove;
      }
      document.body.onmousemove = mouseMoveHandler;
      return false;
    }
    var stop_drag = function () {
      drag = false;

      // restore previous mousemove event handler if necessary:
      if (mousemoveTemp) {
        document.body.onmousemove = mousemoveTemp;
        mousemoveTemp = null;
      }
      return false;
    }
    p.onmousedown = start_drag;
    p.onmouseup = stop_drag;
  }
}

// center an element in the page
function centerPage(el, offsetX, offsetY){
    if(isNaN(offsetX) || offsetX === undefined)
        offsetX = 0;

    if(isNaN(offsetY) || offsetY === undefined)
        offsetY = 0;

    var element = get(el),
        elHeight = el.style.height.replace("px", "") == "" ? el.height : parseInt(el.style.height.replace("px", "")),
        elWidth = el.style.width.replace("px", "") == "" ? el.width : parseInt(el.style.width.replace("px", ""));

    var visibleHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

    el.style.top = ((visibleHeight - elHeight + offsetY) / 2) + "px" ;
    el.style.left = ((window.outerWidth - elWidth + offsetX) / 2) + "px" ;
}

// resize canvas if the loaded image is bigger than the browser window
function fitToPage(el){
    var element = get(el);
    var elW = element.width,
        elH = element.height,
        newW = 0,
        newH = 0;

    if(elW > window.outerWidth - 370){
        newW = window.outerWidth / 2;
        newH = elH / (elW / newW);
    }
    else
    if(elH > window.outerHeight - 70){
        newH = window.outerHeight / 2;
        newW = elW / (elH / newH);
    }

    if(newH != 0 && newW != 0){
        element.style.width = newW + "px";
        element.style.height = newH + "px";
    }
}

// zoom in on a given element on mouse scroll
function zoomIn(el, center){
    if(center === undefined)
        center = false;

    var element = get(el);

    var mouseWheelEvent = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";

    var scaleFactor = 0.9,
        oldW = el.style.width.replace("px", "") == "" ? el.width : parseInt(el.style.width.replace("px", "")),
        oldH = el.style.height.replace("px", "") == "" ? el.height : parseInt(el.style.height.replace("px", ""));

    element.addEventListener(mouseWheelEvent, function (e) {
        var evt = window.event || e; //equalize event object
        var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;

        var zoomIn = delta > 0;

        if(zoomIn)
            scaleFactor += 0.1;
        else
            scaleFactor -= 0.1;

        if(scaleFactor < 0)
            scaleFactor = 0;

        var scale = 1.1 * scaleFactor;

        var newWidth = oldW * scale,
            newHeight = oldH * scale;

        if(newWidth > 50 && newHeight > 50){
            element.style.width = newWidth + "px";
            element.style.height = newHeight + "px";
            if(center)
                centerPage(element, -370);
        }

        if ( evt.preventDefault ) //disable default wheel action of scrolling page
            evt.preventDefault();
        else
            return false;

    }, false);

}

Element.prototype.hasClass = function(className) {
    return this.classList.contains(className);
};

Element.prototype.addClass = function(className){
    this.className += ' ' + className;
    return this;
}

Element.prototype.removeClass = function(className){
    this.className = this.className.replace( ' ' + className , '' );
    return this;
}
