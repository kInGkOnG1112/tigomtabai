$.fn.loadModal = function(options) {
    const $modal = this;
    const $modalDialog = $modal.find("#modal_dialog");
    const $modalContent = $modal.find(".modal-content");

    const settings = $.extend({
        url: "",
        params: {},
        size: "",
        centered: true,
        show_loading: true,
        callback: function() {},
        icon: "fa-spinner",
        text: "Currently loading content, please wait a sec...",
        is_priority: false,
    }, options);

    if (!settings.url) {
        settings.callback();
        return this;
    }

    if (settings.show_loading) {
        const loader = `
            <div style="display:flex; align-items:center; height:100%; padding:3em;">
                <div style="width:100%; text-align:center; display:inline-block;">
                    <div style="color:#676767; font-size:14px;">
                        <i class="fas ${settings.icon} fa-spin fa-fw"></i>
                    </div>
                    <div style="color:#9a9a9a; font-size:12px;">${settings.text}</div>
                </div>
            </div>`;
        $modalContent.html(loader);
    }

    let dialogClass = `modal-dialog ${settings.size}`;
    if (settings.centered) dialogClass += " modal-dialog-centered";

    $modalDialog.attr("class", dialogClass);
    $modal.toggleClass("priority", !!settings.is_priority);

    $modal.modal("show");

    try {
        const baseUrl = settings.url.startsWith('http') ? settings.url : window.location.origin + settings.url;
        const urlObj = new URL(baseUrl);

        Object.entries(settings.params).forEach(([key, val]) => {
            urlObj.searchParams.append(key, val);
        });

        const finalUrl = settings.url.startsWith('http') ? urlObj.href : urlObj.pathname + urlObj.search + urlObj.hash;

        $modalContent.load(finalUrl, function() {
            settings.callback();
        });
    } catch (e) {
        console.error("Failed to parse modal URL:", e);
        settings.callback();
    }

    return this;
};

$(function() {
    $(document).on("click", "[data-open-modal]", function(e) {
        e.preventDefault();

        const $this = $(this);
        const url = $this.attr("data-modal-url") || $this.attr("href");

        if (!url) return;

        const size = $this.attr("data-modal-size") || "modal-md";
        const type = $this.attr("data-modal-type") || "modal_rounded";
        const id = $this.attr("data-modal-id") || "modal_general";
        const isPriority = $this.attr("data-priority") === "true";

        $(`#${id}`).loadModal({
            url: url,
            params: {},
            size: size,
            is_priority: isPriority,
        });
    });
});

const openNewModal = (modalObject = {}) => {
    const id = modalObject.id || modalObject.type || "modal_rounded";

    $(`#${id}`).loadModal({
        url: modalObject.url,
        params: modalObject.params || {},
        size: modalObject.size || "modal-lg",
        is_priority: modalObject.priority || false,
    });
};