(function(){var menuIcon = document.getElementById('menu-icon'),
    isDisplayed = true,
    navBar,
    nameEl,
    restOfNav;

if(window.isMobile) {
  navBar = document.getElementsByClassName('site-header')[0]
  nameEl = document.getElementsByClassName('name')[0]
  restOfNav = document.getElementsByClassName('nav-content')[0]
  menuIcon.addEventListener('touchstart',function(e){e.stopPropagation();})
  menuIcon.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if(isDisplayed) {
      navBar.classList.remove('displayed')
      menuIcon.innerHTML = '≡';
      isDisplayed = false;
    } else {
      navBar.classList.add('displayed')
      menuIcon.innerHTML = '◀'
      isDisplayed = true;
    }
  }
} else {
  menuIcon.style.display = 'none';
}})()
