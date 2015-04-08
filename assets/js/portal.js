(function(){

    // add for bootstrap styles
    $('table').addClass('table');

    // START
    // TODO: stop gap solution to fix anchor links with fixed navbar
    // this will obviously not work if we run as a SPA, so we'll revisit later
    /**
     * Check an href for an anchor. If exists, and in document, scroll to it.
     * If href argument omitted, assumes context (this) is HTML Element,
     * which will be the case when invoked by jQuery after an event
     */
    function scroll_if_anchor(href) {
        href = typeof(href) == "string" ? href : $(this).attr("href");

        // If href missing, ignore
        if(!href) return true;

        // You could easily calculate this dynamically if you prefer
        var fromTop = 110;

        // If our Href points to a valid, non-empty anchor, and is on the same page (e.g. #foo)
        // Legacy jQuery and IE7 may have issues: http://stackoverflow.com/q/1593174
        var $target = $(href);

        // Older browsers without pushState might flicker here, as they momentarily
        // jump to the wrong position (IE < 10)
        if($target.length) {
            $('html, body').animate({ scrollTop: $target.offset().top - fromTop });
            if(history && "pushState" in history) {
                history.pushState({}, document.title, window.location.pathname + href);
                return false;
            }
        }

        return false;
    }

    // When our page loads, check to see if it contains and anchor
    scroll_if_anchor(window.location.hash);

    // Intercept all anchor clicks
    $(".content").on("click", "a[href^='#']", scroll_if_anchor);
    // STOP

})();