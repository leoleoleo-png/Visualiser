/* UI ANIMATION */

let controllerOpened = true;

function toggleController() {
    if (controllerOpened) {
        playCloseControllerAnimation();

        controllerOpened = false;
    } else {
        playOpenControllerAnimation();

        controllerOpened = true;
    }
}


function playOpenControllerAnimation(){
    let openControllerAnim = gsap.timeline({});
    openControllerAnim.to("#controller", {
        // selector text, Array, or object
        x: 0, // any properties (not limited to CSS)
        opacity: 1,
        duration: 1, // seconds
    });
    openControllerAnim.play()
}

function playCloseControllerAnimation() {
        let closeControllerAnim = gsap.timeline({});
        closeControllerAnim.to("#controller", {
            // selector text, Array, or object
            x: -130, // any properties (not limited to CSS)
            opacity: 0.2,
            duration: 1, // seconds
        });
        closeControllerAnim.play();
}