/*
 * HSSettings
 * @author: Ilsya
 * @license: Licensed MIT
 * Copyright 2024 VELIXS
 */

const HSSettings = {
    // first index is default
    def: {
        themeMode: ['auto', 'light', 'dark'],
        themeAccent: ['emerald', 'indigo', 'info'],
    },
    localStorageKey: 'lazy-settings',
    init() {
        this.setAppearance({
            themeMode: this.getLocalStorage('themeMode') || this.def.themeMode[0],
            themeAccent: this.getLocalStorage('themeAccent') || this.def.themeAccent[0],
        })
    },
    setAppearance(settings, saveInStore = true, dispatchEvent = true) {
        const $resetStylesEl = this._resetStylesOnLoad()

        if (settings?.themeMode) {
            const themeMode = this.def.themeMode.includes(settings.themeMode) ? settings.themeMode : this.def.themeMode[0]
            document.querySelector('html').setAttribute('theme-mode', themeMode === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : themeMode)
            document.querySelector("html").classList.remove(`theme-auto`, `theme-light`, `theme-dark`)
            document.querySelector("html").classList.add(`theme-${themeMode}`)
            if (saveInStore) { this.setLocalStorage('themeMode', themeMode) }
        }

        if (settings?.themeAccent) {
            const themeAccent = settings.themeAccent
            document.querySelector('html').setAttribute('theme-accent', this.def.themeAccent.includes(themeAccent) ? themeAccent : this.def.themeAccent[0])
            if (saveInStore) { this.setLocalStorage('themeAccent', themeAccent) }
        }

        setTimeout(() => { $resetStylesEl.remove() })
        if (dispatchEvent) { window.dispatchEvent(new CustomEvent('on-hs-appearance-change', { detail: settings })) }
    },
    getAppearance() {
        // return this.def.themeMode.includes('auto') ? {...this.def, themeMode : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'} : this.def
        return this.getLocalStorage().themeMode.includes('auto') ? { ...this.getLocalStorage(), themeMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' } : this.getLocalStorage()
    },
    _resetStylesOnLoad() {
        const $resetStyles = document.createElement('style')
        $resetStyles.innerText = `*{transition: unset !important;}`
        $resetStyles.setAttribute('data-hs-appearance-onload-styles', '')
        document.head.appendChild($resetStyles)
        return $resetStyles
    },
    getLocalStorage(key = '') {
        let value;
        try {
            value = JSON.parse(localStorage.getItem(this.localStorageKey))
            if (!value) throw new Error();
        } catch {
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.def))
        }
        value = JSON.parse(localStorage.getItem(this.localStorageKey))
        if (key) return value[key]
        return value
    },
    setLocalStorage(key, value) {
        localStorage.setItem(this.localStorageKey, JSON.stringify({
            ...this.getLocalStorage(),
            [key]: value
        }))
    }
}

HSSettings.init()

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (HSSettings.getLocalStorage().themeMode === 'auto') {
        HSSettings.setAppearance({
            themeMode: 'auto'
        }, false)
    }
})

window.addEventListener('load', () => {
    const $clickableThemes = document.querySelectorAll('[data-hs-theme-click-value]')
    const $switchableThemes = document.querySelectorAll('[data-hs-theme-switch]')

    $clickableThemes.forEach($item => {
        $item.addEventListener('click', () => {
            HSSettings.setAppearance({
                themeMode: $item.getAttribute('data-hs-theme-click-value')
            }, true, $item)
        })
    })

    $switchableThemes.forEach($item => {
        $item.addEventListener('change', (e) => {
            HSSettings.setAppearance({
                themeMode: e.target.checked ? 'dark' : 'light'
            })
        })

        $item.checked = HSSettings.getAppearance().themeMode === 'dark'
    })

    window.addEventListener('on-hs-appearance-change', e => {
        $switchableThemes.forEach($item => {
            $item.checked = e.detail.themeMode === 'dark'
        })
    })

    // if ctrl + d
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault()
            HSSettings.setAppearance({
                themeMode: HSSettings.getAppearance().themeMode === 'dark' ? 'light' : 'dark'
            })
        }
    })
})