import anime from "animejs";

const menuButton = document.querySelector("#menu-button");
const navDrawer = document.querySelector("#mobile-nav-drawer");
const navOverlay = document.querySelector("#mobile-nav-overlay");
const navClose = document.querySelector("#mobile-nav-close");

const DRAWER_WIDTH = 230;
const TRANSITIONS_DURATION = 500;
const POSITION_EASING = "easeInOutCirc";
const OVERLAY_OPACITY = 0.2;

let navOpen = false;
let animating = false;

/**
 * Handles the opening of the mobile navigation drawer.
 */
function handleNavOpen() {
  if (navOpen || animating) {
    return;
  }
  if (navOverlay !== null && navDrawer !== null) {
    document.body.style.overflow = "hidden";

    [navOverlay, navDrawer].forEach((el) => {
      el.classList.remove("hidden");
    });

    navOverlay.classList.add("block");
    navDrawer.classList.add("flex");

    animating = true;

    anime({
      targets: navDrawer,
      translateX: `-${DRAWER_WIDTH}px`,
      duration: TRANSITIONS_DURATION,
      easing: POSITION_EASING,
    });

    anime({
      targets: navOverlay,
      opacity: OVERLAY_OPACITY,
      duration: TRANSITIONS_DURATION,
      easing: "linear",
      complete: () => {
        navOpen = true;
        animating = false;
      },
    });
  }
}

/**
 * Handles the closing of the mobile navigation drawer.
 */
function handleNavClose() {
  if (!navOpen || animating) {
    return;
  }
  if (navOverlay !== null && navDrawer !== null) {
    animating = true;

    anime({
      targets: navDrawer,
      translateX: "0px",
      duration: TRANSITIONS_DURATION,
      easing: POSITION_EASING,
    });

    anime({
      targets: navOverlay,
      opacity: 0,
      duration: TRANSITIONS_DURATION,
      easing: "linear",
      complete: () => {
        document.body.style.overflow = "auto";

        navOverlay.classList.remove("block");
        navDrawer.classList.remove("flex");

        [navOverlay, navDrawer].forEach((el) => {
          el.classList.add("hidden");
        });

        navOpen = false;
        animating = false;
      },
    });
  }
}

if (
  menuButton !== null &&
  navDrawer !== null &&
  navOverlay !== null &&
  navClose !== null
) {
  menuButton.addEventListener("click", handleNavOpen);
  navOverlay.addEventListener("click", handleNavClose);
  navClose.addEventListener("click", handleNavClose);
}
