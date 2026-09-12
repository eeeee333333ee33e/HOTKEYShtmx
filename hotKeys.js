(function ($) {

  let htmxBusy = false;

    $(document)
    .on("htmx:beforeRequest", function () {
      htmxBusy = true;
    })
    .on("htmx:afterRequest htmx:responseError", function () {
      htmxBusy = false;
    });

    function normalizeKey(e) {
    const keys = [];

    if (e.ctrlKey)  keys.push("CTRL");
    if (e.altKey)   keys.push("ALT");
    if (e.shiftKey) keys.push("SHIFT");

    let key = e.key.toUpperCase();
    if (key === " ") key = "SPACE";

    
    if (key === "ESCAPE" || key === "ESC") key = "ESC";

    keys.push(key);
    return keys.join("+");
  }

  function isHotkeyAlwaysEnabled(target) {
    if (!target || !target.getAttribute) return false;
    const value = target.getAttribute("hk-always");
    return value === "1" || value === "true";
  }

  function applyHotkeyLabels(root) {
    $(root).find("[hk-key]").each(function () {
      const $el = $(this);

      if ($el.attr("hx-n") === "true") return;
      if ($el.data("hk-labeled")) return;

      let hk = $el.attr("hk-key").toUpperCase().replace(/\s+/g, "");
      if (hk === "ESCAPE") hk = "ESC";

      if ($el.children(".hotkey-hint").length > 0) {
        $el.data("hk-labeled", true);
        return;
      }

      const hint = $("<span>").addClass("hotkey-hint").text(" (" + hk + ")");
      $el.append(hint);
      $el.data("hk-labeled", true);

      console.info(
        "[hotKeys] etiqueta agregada:",
        hk,
        "→",
        this
      );
    });
  }

  function reloadHotkeys(root = document) {
    const $elements = root === document ? $("[hk-key]") : $(root).find("[hk-key]");
    $elements.each(function () {
      const $el = $(this);
      $el.data("hk-labeled", false);
      $el.children(".hotkey-hint").remove();
    });
    applyHotkeyLabels(root);
  }

  window.rlHk = reloadHotkeys;

  
  $(function () {
    applyHotkeyLabels(document);
  });
  
  $(document).on("htmx:afterSwap", function (e) {
    console.info(
      "[hotKeys] htmx afterSwap → escanneando teclas de acceso rapido",
      e.target
    );
    applyHotkeyLabels(e.target);
  });

  $(document).on("keydown", function (e) {
    const $target = $(e.target);

    if (!$target.is("input[type=number].hkplus")) return;

    const key = e.key;
    if (key !== "+" && key !== "-") return;

    e.preventDefault();

    const step  = parseFloat($target.attr("step"))  || 1;
    const min   = parseFloat($target.attr("min"));
    const max   = parseFloat($target.attr("max"));
    let   val   = parseFloat($target.val()) || 0;

    if (key === "+") {
      val += step;
      if (!isNaN(max) && val > max) val = max;
    } else {
      val -= step;
      if (!isNaN(min) && val < min) val = min;
    }

    $target.val(val).trigger("change").trigger("input");

    console.info("[hotKeys] hkplus:", key, "→", val, e.target);
  });

  $(document).on("keydown", function (e) {

    if (htmxBusy) return;

    const tag = e.target.tagName;
    const isTyping =
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      e.target.isContentEditable;

    const allowAlways = isTyping && isHotkeyAlwaysEnabled(e.target);

    
    if (isTyping && !allowAlways && !/^F\d+$/.test(e.key)) {
      return;
    }
    const pressed = normalizeKey(e);
    const matches = [];
    $("[hk-key]:visible").each(function () {
      let hk = $(this)
        .attr("hk-key")
        .toUpperCase()
        .replace(/\s+/g, "");
      if (hk === "ESCAPE") hk = "ESC";

      if (hk === pressed) {
        matches.push(this);
      }
    });

    if (matches.length > 1) {
      console.warn(
        "[hotKeys] conflictos en teclas de acceso rapido:",
        pressed,
        matches
      );
    }
    if (matches.length > 0) {
      e.preventDefault();
      matches[0].click();
    }
  });
})(jQuery);
