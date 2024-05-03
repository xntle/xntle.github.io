window.onload = function() {
    // Scroll down the page
    window.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth' // Add smooth scrolling effect
    });
}

function scrollDown() {
    window.scrollBy(0, 1); // Scroll down by 1 pixel
}

// Scroll down every 10 milliseconds (adjust as needed)
var scrollInterval = setInterval(scrollDown, 10);