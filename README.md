# hotKeys.js

A lightweight jQuery script for binding keyboard shortcuts to HTML elements, featuring automatic UI hints and seamless HTMX integration[cite: 1].

## Features
* Maps keyboard shortcuts to element click events using HTML attributes[cite: 1].
* Automatically appends visual hint labels directly to the bound elements[cite: 1].
* Pauses hotkey execution during active HTMX requests and automatically re-scans the DOM for new hotkeys after an `htmx:afterSwap` event[cite: 1].
* Includes built-in support for incrementing and decrementing numeric inputs using the `+` and `-` keys[cite: 1].

## HTML Attributes
* `hk-key="[KEY]"`: Defines the shortcut to listen for (e.g., `hk-key="CTRL+S"` or `hk-key="ESC"`)[cite: 1].
* `hk-always="true"`: Allows the hotkey to execute even when the user is actively focused inside an input, textarea, or contenteditable element[cite: 1].
* `hx-n="true"`: Prevents the script from automatically appending the visual hotkey hint label to the element[cite: 1].
* `class="hkplus"`: When applied to an `<input type="number">`, enables stepping the value up or down using the `+` and `-` keys based on the input's `step`, `min`, and `max` attributes[cite: 1].

## Global API

If you modify the DOM dynamically outside of HTMX, you can manually rescan and re-apply hotkey labels using the exposed global function[cite: 1]:

```javascript
// Reloads hotkeys for a specific container, or defaults to the entire document
window.rlHk(document.getElementById('my-container'));
