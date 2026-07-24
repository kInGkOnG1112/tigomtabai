class InfiniteScrollController {
    constructor({
        sentinelSelector,  // Bottom boundary element (e.g., '#sentinel')
        fetchCallback,     // Function that accepts (isAppend) and fires your AJAX
        getCursorVal,      // Function to get current cursor value
        resetCursorVal,    // Function to clear current cursor value
        threshold = '200px'
    }) {
        this.sentinel = document.querySelector(sentinelSelector);
        this.fetchCallback = fetchCallback;
        this.getCursorVal = getCursorVal;
        this.resetCursorVal = resetCursorVal;

        this.isLoading = false;
        this.hasMore = true;

        this.initObserver(threshold);
    }

    initObserver(rootMargin) {
        if (!this.sentinel) return;

        this.observer = new IntersectionObserver((entries) => {
            // Trigger fetch when user reaches sentinel, if not loading and more data exists
            if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
                this.load(true);
            }
        }, { rootMargin });

        this.observer.observe(this.sentinel);
    }

    load(isAppend = false) {
        if (this.isLoading) return;
        this.isLoading = true;

        // Execute user AJAX function (expects a Promise back)
        const request = this.fetchCallback(isAppend);

        if (request && typeof request.always === 'function') {
            request.always(() => {
                this.isLoading = false;
            });
        } else {
            this.isLoading = false;
        }
    }

    // Call when search/filter inputs change
    resetAndFetch() {
        this.resetCursorVal();
        this.hasMore = true;
        this.load(false);
    }

    // Call when the server responds with no more records
    setHasMore(hasMore) {
        this.hasMore = Boolean(hasMore);
    }
}