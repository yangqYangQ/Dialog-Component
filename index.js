class Dialog {
    constructor(options) {
        this._options = options;
        this._init();
    }

    get template() {
        const {title, content} = this._options;
        return `
            <div class="my-dialog">
                <div class="dialog-wrapper">
                    <header>${title}</header>
                    <main>${content}</main>
                    <footer></footer>
                </div>
            </div>
        `;
    }

    get buttons() {
        let buttons = [];
        if (this._options.buttons) {
            buttons = this._options.buttons.map((button) => {
                const $button = $('<button></button>');
                $button.text(button.text);
                $button.on('click', button.action);
                return $button;
            });
        } else {
            const okButton = $('<button>Ok</button>');
            okButton.on('click', () => {
                const {onOk} = this._options;
                onOk && onOk();
            });
            const cancelButton = $('<button>Cancel</button>');
            cancelButton.on('click', () => {
                const {oncancel} = this._options;
                oncancel && oncancel();
            });
            buttons.push(okButton, cancelButton);
        }
        return buttons;
    }

    get closeIcon() {
        const $closeIcon = $(`<div class="close-button">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-baseline-close-px"></use>
                                </svg>
                           </div>`);
        $closeIcon.on('click', () => {
            const {oncancel} = this._options;
            oncancel && oncancel();
        });
        return $closeIcon;
    }

    _init() {
        this._dialog = $(this.template);
        this._dialog.find('footer').append(this.buttons);
        this._dialog.find('.dialog-wrapper').prepend(this.closeIcon);
    }

    open() {
        $('.page').append(this._dialog);
        this._bindEvents();
    }

    close() {
        this._dialog.detach();
    }

    _bindEvents() {
        $('.my-dialog').off('click').on('click', (e) => {
            if ($('.my-dialog > .dialog-wrapper').has(e.target).length === 0) {
                this.close();
            }
        });
    }
}

$('button').on('click', () => {
    const dialog = new Dialog({
        title: 'Basic Dialog',
        content: '<p>Some contents...</p><p>Some contents...</p><p>Some contents...</p>',
        onOk: () => {
            dialog.close();
        },
        oncancel: () => {
            dialog.close();
        }
    });
    dialog.open();
});
