(function () {
  "use strict";

  var config = window.SITE_SEARCH || {};
  var toggle = document.getElementById("site-search-toggle");
  var panel = document.getElementById("site-search-panel");
  var input = document.getElementById("site-search-input");
  var results = document.getElementById("site-search-results");

  if (!toggle || !panel || !input || !results || !config.indexUrl) {
    return;
  }

  var index = null;
  var loading = false;
  var activeIndex = -1;

  function normalize(value) {
    return (value || "").toLowerCase().trim();
  }

  function loadIndex() {
    if (index || loading) {
      return Promise.resolve(index);
    }

    loading = true;
    return fetch(config.indexUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Search index unavailable");
        }
        return response.json();
      })
      .then(function (data) {
        index = Array.isArray(data) ? data : [];
        return index;
      })
      .catch(function () {
        index = [];
        return index;
      })
      .finally(function () {
        loading = false;
      });
  }

  function scoreEntry(entry, query) {
    var title = normalize(entry.title);
    var excerpt = normalize(entry.excerpt);
    var categories = normalize((entry.categories || []).join(" "));
    var libraryType = normalize(entry.library_type || "");
    var score = 0;

    if (title === query) score += 100;
    if (title.indexOf(query) !== -1) score += 40;
    if (categories.indexOf(query) !== -1) score += 20;
    if (libraryType.indexOf(query) !== -1) score += 25;
    if (excerpt.indexOf(query) !== -1) score += 10;

    return score;
  }

  function search(query) {
    if (!index || !query) {
      return [];
    }

    return index
      .map(function (entry) {
        return { entry: entry, score: scoreEntry(entry, query) };
      })
      .filter(function (item) {
        return item.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score || a.entry.title.localeCompare(b.entry.title);
      })
      .slice(0, 8)
      .map(function (item) {
        return item.entry;
      });
  }

  function clearStatus() {
    var status = panel.querySelector(".site-search__status, .site-search__empty");
    if (status) {
      status.remove();
    }
  }

  function setStatus(className, message) {
    clearStatus();
    var node = document.createElement("p");
    node.className = className;
    node.textContent = message;
    panel.appendChild(node);
  }

  function renderResults(items) {
    results.innerHTML = "";
    activeIndex = -1;
    clearStatus();

    if (!items.length) {
      setStatus("site-search__empty", "No results found.");
      return;
    }

    items.forEach(function (entry, index) {
      var item = document.createElement("li");
      item.className = "site-search__result";
      item.setAttribute("role", "option");

      var link = document.createElement("a");
      link.href = entry.url;
      link.innerHTML =
        '<span class="site-search__result-title"></span>' +
        '<span class="site-search__result-meta"></span>';

      link.querySelector(".site-search__result-title").textContent = entry.title;

      var metaParts = [];
      if (entry.library_type) {
        metaParts.push(entry.library_type.replace(/s$/, "").replace(/^./, function (c) { return c.toUpperCase(); }));
      } else if (entry.categories && entry.categories.length) {
        metaParts.push(entry.categories.join(" · "));
      }
      if (entry.excerpt) {
        metaParts.push(entry.excerpt);
      }

      link.querySelector(".site-search__result-meta").textContent = metaParts.join(" · ");
      link.addEventListener("click", closePanel);

      item.appendChild(link);
      item.dataset.index = String(index);
      results.appendChild(item);
    });
  }

  function setActiveResult(nextIndex) {
    var items = results.querySelectorAll(".site-search__result");
    if (!items.length) {
      return;
    }

    activeIndex = (nextIndex + items.length) % items.length;
    items.forEach(function (item, index) {
      item.classList.toggle("is-active", index === activeIndex);
    });

    var activeLink = items[activeIndex].querySelector("a");
    if (activeLink) {
      activeLink.focus();
    }
  }

  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");

    loadIndex().then(function () {
      input.focus();
      renderResults(search(normalize(input.value)));
    });
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    input.value = "";
    results.innerHTML = "";
    clearStatus();
    activeIndex = -1;
  }

  function togglePanel() {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  }

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    togglePanel();
  });

  input.addEventListener("input", function () {
    loadIndex().then(function () {
      renderResults(search(normalize(input.value)));
    });
  });

  input.addEventListener("keydown", function (event) {
    var items = results.querySelectorAll(".site-search__result");

    if (event.key === "Escape") {
      closePanel();
      toggle.focus();
      return;
    }

    if (event.key === "ArrowDown" && items.length) {
      event.preventDefault();
      setActiveResult(activeIndex + 1);
      return;
    }

    if (event.key === "ArrowUp" && items.length) {
      event.preventDefault();
      setActiveResult(activeIndex - 1);
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
      event.preventDefault();
      items[activeIndex].querySelector("a").click();
    }
  });

  document.addEventListener("click", function (event) {
    if (!panel.hidden && !event.target.closest("#site-search")) {
      closePanel();
    }
  });

  document.addEventListener("keydown", function (event) {
    var isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (isShortcut) {
      event.preventDefault();
      if (panel.hidden) {
        openPanel();
      } else {
        input.focus();
      }
    }
  });
})();
