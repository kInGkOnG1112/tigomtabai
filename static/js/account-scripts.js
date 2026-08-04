
    function handleToggleAction({ $el, dataKey, formDataKey, valueMap, onConfirm, onUpdateComplete }) {
        const id = $el.data('id');
        const currentValue = String($el.data(dataKey)).toLowerCase() === 'true';

        const config = valueMap[currentValue ? 'active' : 'inactive'];

        const executeRequest = () => {
            const formData = new FormData();
            formData.append('id', id);
            formData.append(formDataKey, config.nextValue);

            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
            if (csrfToken) formData.append('csrfmiddlewaretoken', csrfToken);

            Ajax.postRequest(
                updateAccountURL,
                formData,
                submitBtn,
                redirectionURL
            ).then((response) => {
                if (response?.success) {
                    $el.data(dataKey, config.nextValue);
                    $el.find('.navi-text').text(config.updatedText);
                    onUpdateComplete(id, config.onComplete);
                }
            });
        };

        if (onConfirm) {
            onConfirm(config, executeRequest);
        } else {
            executeRequest();
        }
    }

    function lockUnlockAccount(element) {
        handleToggleAction({
            $el: $(element),
            dataKey: 'is_locked',
            formDataKey: 'is_lock',
            valueMap: {
                active: {
                    actionText: "Unlock Account?",
                    bodyText: "This will restore access and allow you to use this account again.",
                    nextValue: "False",
                    updatedText: "Lock Account",
                    onComplete: {
                        icon: ''
                    }
                },
                inactive: {
                    actionText: "Lock Account?",
                    bodyText: "Locking this account will disable it. You won't be able to use it until it is unlocked.",
                    nextValue: "True",
                    updatedText: "Unlock Account",
                    onComplete: {
                        icon: '<i class="icon-nm fas fa-lock text-muted ml-1"></i>'
                    }
                }
            },
            onConfirm: (config, proceed) => {
                Swal.fire(swalWarningConfig({
                    actionText: config.actionText,
                    bodyText: config.bodyText
                })).then((result) => {
                    if (result.isConfirmed) proceed();
                });
            },
            onUpdateComplete: (id, onComplete) => {
                $(`#iconLock${id}`).html(onComplete.icon);
            }
        });
    }

    function addToFavorite(element) {
        handleToggleAction({
            $el: $(element),
            dataKey: 'is_favorite',
            formDataKey: 'is_favorite',
            valueMap: {
                active: {
                    nextValue: "False",
                    updatedText: "Add to Favorite",
                    onComplete: {
                        icon: ''
                    }
                },
                inactive: {
                    nextValue: "True",
                    updatedText: "Remove from Favorite",
                    onComplete: {
                        icon: '<i class="flaticon2-correct text-success icon-md ml-2"></i>'
                    }
                }
            },
            onConfirm: null,
            onUpdateComplete: (id, onComplete) => {
                $(`#iconFavorite${id}`).html(onComplete.icon);
            }
        });
    }

    function addToArchives(element) {
        handleToggleAction({
            $el: $(element),
            dataKey: 'is_archived',
            formDataKey: 'is_archived',
            imageClass: 'archive-image',
            valueMap: {
                active: {
                    actionText: "Remove from archives?",
                    bodyText: "Removing this account from the archives will unhide it and restore full access.",
                    nextValue: "False",
                    updatedText: "Add to Archives",
                    onComplete: {
                        removeClass: "archive-image",
                        buttonAddClass: "btn-primary",
                        buttonRemoveClass: "btn-secondary"
                    }
                },
                inactive: {
                    actionText: "Add to archives?",
                    bodyText: "Archiving this account will hide it from view and disable its use until it is unarchived.",
                    nextValue: "True",
                    updatedText: "Remove from Archives",
                    onComplete: {
                        addClass: "archive-image",
                        buttonAddClass: "btn-secondary",
                        buttonRemoveClass: "btn-primary"
                    }
                }
            },
            onConfirm: (config, proceed) => {
                Swal.fire(swalWarningConfig({
                    actionText: config.actionText,
                    bodyText: config.bodyText
                })).then((result) => {
                    if (result.isConfirmed) proceed();
                });
            },
            onUpdateComplete: (id, onComplete) => {
                console.log(onComplete)
                $(`#cardAccount${id}`).removeClass(onComplete.removeClass).addClass(onComplete.addClass);
                $(`#viewDetails${id}`).removeClass(onComplete.buttonRemoveClass).addClass(onComplete.buttonAddClass);
            }
        });
    }