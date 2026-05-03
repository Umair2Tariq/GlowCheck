import {
  SAFETY_META,
  SKIN_LABELS,
  analyzeIngredients,
  fuzzySearch,
  getIngredientByName,
  getIngredientCategory,
  getStackSafetyLevel,
} from "./ingredients.js";

const STORAGE_KEY = "glowcheck-state-v1";

const ingredientDisplay = {
  "Niacinamide": { accent: "pink", icon: "science" },
  "Hyaluronic Acid": { accent: "purple", icon: "water_drop" },
  Retinol: { accent: "blue", icon: "spa" },
  Ceramides: { accent: "pink", icon: "psychology" },
  "Vitamin C": { accent: "pink", icon: "flare" },
  "Salicylic Acid": { accent: "blue", icon: "biotech" },
  "Glycolic Acid": { accent: "purple", icon: "bubble_chart" },
  Peptides: { accent: "purple", icon: "auto_awesome" },
  Squalane: { accent: "blue", icon: "water_drop" },
  Glycerin: { accent: "blue", icon: "opacity" },
  Panthenol: { accent: "pink", icon: "favorite" },
  "Centella Asiatica": { accent: "green", icon: "eco" },
};

const defaultState = {
  saved: ["Niacinamide", "Hyaluronic Acid", "Retinol", "Ceramides"],
  stack: [],
  collections: [
    {
      id: "glow-mix",
      name: "Glow Mix",
      accent: "pink",
      icon: "wb_sunny",
      ingredients: ["Niacinamide", "Vitamin C", "Alpha Arbutin", "Tranexamic Acid"],
    },
    {
      id: "night-routine",
      name: "Night Routine",
      accent: "purple",
      icon: "dark_mode",
      ingredients: ["Retinol", "Ceramides", "Panthenol", "Hyaluronic Acid"],
    },
    {
      id: "safe-list",
      name: "Safe List",
      accent: "blue",
      icon: "verified_user",
      ingredients: ["Hyaluronic Acid", "Ceramides", "Squalane", "Glycerin", "Centella Asiatica"],
    },
  ],
  profile: {
    name: "Alex Glow",
    joinedLabel: "Joined Jan 2024",
    mainConcern: "Oily",
    reactionLevel: "Sensitive",
  },
  settings: {
    notifications: true,
    appearance: "glow",
  },
  notifications: [
    {
      id: "welcome",
      title: "GlowCheck is ready",
      message: "Your skincare actions will appear here when notifications are enabled.",
      icon: "notifications",
      time: "Now",
      unread: false,
    },
  ],
  recentScans: [
    {
      id: "scan-cream",
      name: "Moisturizing Cream",
      image: "./assets/product-cream.svg",
      score: 9.2,
      scoreTone: "calm",
      ingredients: [
        "Niacinamide",
        "Ceramides",
        "Hyaluronic Acid",
        "Glycerin",
        "Panthenol",
        "Squalane",
        "Allantoin",
        "Peptides",
        "Centella Asiatica",
      ],
    },
    {
      id: "scan-serum",
      name: "Vitamin C Serum",
      image: "./assets/product-serum.svg",
      score: 4.5,
      scoreTone: "danger",
      ingredients: [
        "Vitamin C",
        "Retinol",
        "Niacinamide",
        "Salicylic Acid",
        "Ferulic Acid",
        "Glycerin",
        "Tea Tree Oil",
        "Lactic Acid",
        "Propolis",
        "Allantoin",
        "Panthenol",
        "Centella Asiatica",
      ],
    },
    {
      id: "scan-toner",
      name: "Glow Toner",
      image: "./assets/product-toner.svg",
      score: 7.8,
      scoreTone: "warm",
      ingredients: [
        "Centella Asiatica",
        "Glycerin",
        "Panthenol",
        "Lactic Acid",
        "Allantoin",
        "Licorice Root Extract",
        "Niacinamide",
        "Tranexamic Acid",
        "Snail Mucin",
        "Alpha Arbutin",
        "Peptides",
        "Polyglutamic Acid",
        "Madecassoside",
        "Adenosine",
        "Azelaic Acid",
      ],
    },
  ],
};

const state = {
  ...loadPersistedState(),
  ui: {
    route: "home",
    homeQuery: "",
    homeResults: [],
    homeSearched: false,
    libraryQuery: "",
    librarySafety: "all",
    collectionFilter: "all",
    modal: null,
    filterOpen: false,
    pendingFocus: null,
  },
};

const app = document.querySelector("#app");
const toastRoot = document.querySelector("#toast-root");

render();
bindGlobalEvents();
applyAppearance();
registerServiceWorker();

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    return {
      saved: Array.isArray(parsed.saved) ? parsed.saved : [...defaultState.saved],
      stack: Array.isArray(parsed.stack) ? parsed.stack : [...defaultState.stack],
      collections: Array.isArray(parsed.collections) && parsed.collections.length
        ? parsed.collections
        : [...defaultState.collections],
      profile: {
        ...defaultState.profile,
        ...(parsed.profile || {}),
      },
      settings: {
        ...defaultState.settings,
        ...(parsed.settings || {}),
      },
      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : [...defaultState.notifications],
      recentScans: Array.isArray(parsed.recentScans) && parsed.recentScans.length
        ? parsed.recentScans
        : [...defaultState.recentScans],
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function persist() {
  const payload = {
    saved: state.saved,
    stack: state.stack,
    collections: state.collections,
    profile: state.profile,
    settings: state.settings,
    notifications: state.notifications,
    recentScans: state.recentScans,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  applyAppearance();
}

function bindGlobalEvents() {
  app.addEventListener("click", onClick);
  app.addEventListener("submit", onSubmit);
  app.addEventListener("input", onInput);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.ui.modal) {
      closeModal();
    }
  });
}

function onClick(event) {
  const button = event.target.closest("[data-action], [data-route]");

  if (event.target.classList.contains("modal-backdrop")) {
    closeModal();
    return;
  }

  if (!button) {
    return;
  }

  const { action, route, ingredient, collection, scan, theme } = button.dataset;

  if (route) {
    state.ui.route = route;
    state.ui.pendingFocus = null;
    render();
    return;
  }

  switch (action) {
    case "apply-trending":
      state.ui.homeQuery = ingredient || "";
      runHomeSearch();
      break;
    case "add-to-stack":
      addIngredientToStack(ingredient);
      break;
    case "remove-from-stack":
      removeIngredientFromStack(ingredient);
      break;
    case "clear-stack":
      state.stack = [];
      addNotification("Stack cleared", "Your current ingredient analysis stack was cleared.", "delete_sweep");
      persist();
      showToast("Your analysis stack has been cleared.");
      render();
      break;
    case "toggle-save":
      toggleSaveIngredient(ingredient);
      break;
    case "open-ingredient":
      openModal({ type: "ingredient", ingredient });
      break;
    case "open-scan":
      openModal({ type: "scan", scan });
      break;
    case "add-scan-stack":
      addScanToStack(scan);
      break;
    case "toggle-filter":
      state.ui.filterOpen = !state.ui.filterOpen;
      render();
      break;
    case "set-safety-filter":
      state.ui.librarySafety = theme || "all";
      render();
      break;
    case "select-collection":
      state.ui.collectionFilter =
        state.ui.collectionFilter === collection ? "all" : collection || "all";
      render();
      break;
    case "new-collection":
      createCollection();
      break;
    case "save-stack-collection":
      openStackCollectionModal();
      break;
    case "focus-search":
      state.ui.pendingFocus = state.ui.route === "library" ? "library-query" : "home-query";
      render();
      break;
    case "customize-profile":
      openModal({ type: "profile" });
      break;
    case "open-notifications":
      openModal({ type: "notifications" });
      break;
    case "mark-notifications-read":
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        unread: false,
      }));
      persist();
      render();
      break;
    case "clear-notifications":
      state.notifications = [];
      persist();
      render();
      break;
    case "toggle-notifications":
      state.settings.notifications = !state.settings.notifications;
      if (state.settings.notifications) {
        addNotification("Notifications enabled", "Important app actions will show up in your inbox.", "notifications_active");
      }
      persist();
      showToast(
        state.settings.notifications ? "Notifications are on." : "Notifications are paused."
      );
      render();
      break;
    case "toggle-appearance":
      state.settings.appearance = state.settings.appearance === "glow" ? "dusk" : "glow";
      addNotification(
        "Appearance updated",
        state.settings.appearance === "glow" ? "Glow mode is now active." : "Dusk mode is now active.",
        "palette"
      );
      persist();
      showToast(
        state.settings.appearance === "glow" ? "Glow mode enabled." : "Dusk mode enabled."
      );
      render();
      break;
    case "privacy":
      showToast("Privacy tools are demo-ready and can be connected to a backend later.");
      break;
    case "help":
      showToast("Support center coming next. Hook this button to chat, email, or FAQs.");
      break;
    case "logout":
      resetApp();
      break;
    case "close-modal":
      closeModal();
      break;
    default:
      break;
  }
}

function onSubmit(event) {
  event.preventDefault();

  const form = event.target;

  if (form.dataset.form === "home-search") {
    runHomeSearch();
    return;
  }

  if (form.dataset.form === "profile") {
    const formData = new FormData(form);
    state.profile.name = sanitizeText(formData.get("name"), 26) || defaultState.profile.name;
    state.profile.joinedLabel =
      sanitizeText(formData.get("joinedLabel"), 24) || defaultState.profile.joinedLabel;
    state.profile.mainConcern =
      sanitizeText(formData.get("mainConcern"), 16) || defaultState.profile.mainConcern;
    state.profile.reactionLevel =
      sanitizeText(formData.get("reactionLevel"), 16) || defaultState.profile.reactionLevel;
    addNotification("Profile updated", "Your skin profile changes were saved.", "face");
    persist();
    closeModal();
    showToast("Profile updated.");
    render();
    return;
  }

  if (form.dataset.form === "stack-collection") {
    const formData = new FormData(form);
    createCollectionFromStack(formData.get("name"));
  }
}

function onInput(event) {
  const input = event.target;

  if (input.dataset.bind === "home-query") {
    state.ui.homeQuery = input.value;
    state.ui.homeSearched = false;
    state.ui.homeResults = [];
    return;
  }

  if (input.dataset.bind === "library-query") {
    state.ui.libraryQuery = input.value;
    render();
  }
}

function runHomeSearch() {
  if (!state.ui.homeQuery.trim()) {
    state.ui.homeSearched = true;
    state.ui.homeResults = [];
    render();
    return;
  }

  state.ui.homeResults = fuzzySearch(state.ui.homeQuery, 5);
  state.ui.homeSearched = true;
  render();
}

function addIngredientToStack(name) {
  if (!name || state.stack.includes(name)) {
    return;
  }

  state.stack = [...state.stack, name];
  addNotification("Added to stack", `${name} is now part of your current analysis.`, "add_circle");
  persist();
  showToast(`${name} added to your analysis stack.`);
  render();
}

function removeIngredientFromStack(name) {
  state.stack = state.stack.filter((entry) => entry !== name);
  persist();
  render();
}

function toggleSaveIngredient(name) {
  if (!name) {
    return;
  }

  const exists = state.saved.includes(name);
  state.saved = exists ? state.saved.filter((entry) => entry !== name) : [...state.saved, name];
  addNotification(
    exists ? "Removed from Library" : "Saved to Library",
    exists ? `${name} was removed from your saved ingredients.` : `${name} is now in your saved ingredients.`,
    exists ? "bookmark_remove" : "bookmark_added"
  );
  persist();
  showToast(exists ? `${name} removed from Library.` : `${name} saved to Library.`);
  render();
}

function addScanToStack(scanId) {
  const scan = state.recentScans.find((entry) => entry.id === scanId);

  if (!scan) {
    return;
  }

  const nextStack = uniqueStrings([...state.stack, ...scan.ingredients]);
  state.stack = nextStack;
  addNotification("Scan added to stack", `${scan.name} ingredients were added for analysis.`, "fact_check");
  persist();
  showToast(`${scan.name} ingredients added to the analysis stack.`);
  render();
}

function createCollection() {
  const name = sanitizeText(window.prompt("Name your new collection:"), 26);

  if (!name) {
    return;
  }

  const id = `collection-${Date.now()}`;
  state.collections = [
    ...state.collections,
    { id, name, accent: "neutral", icon: "add", ingredients: [] },
  ];
  addNotification("Collection created", `${name} was added to Saved Collections.`, "create_new_folder");
  persist();
  showToast(`${name} collection created.`);
  render();
}

function openStackCollectionModal() {
  if (state.stack.length === 0) {
    showToast("Add a few ingredients to the stack first.");
    return;
  }

  openModal({ type: "stackCollection" });
}

function createCollectionFromStack(collectionName) {
  const name = sanitizeText(collectionName, 26);

  if (!name) {
    showToast("Give the collection a name first.");
    return;
  }

  const accents = ["pink", "purple", "blue"];
  const accent = accents[state.collections.length % accents.length];

  state.collections = [
    ...state.collections,
    {
      id: `collection-${Date.now()}`,
      name,
      accent,
      icon: "auto_awesome",
      ingredients: [...state.stack],
    },
  ];
  addNotification("Stack saved", `${name} was saved with ${state.stack.length} ingredients.`, "folder_special");
  persist();
  closeModal();
  showToast(`${name} saved to your Library.`);
  render();
}

function resetApp() {
  const confirmed = window.confirm("Clear saved data and reset the app?");

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  state.saved = [...defaultState.saved];
  state.stack = [...defaultState.stack];
  state.collections = [...defaultState.collections];
  state.profile = { ...defaultState.profile };
  state.settings = { ...defaultState.settings };
  state.notifications = [...defaultState.notifications];
  state.recentScans = [...defaultState.recentScans];
  state.ui = {
    route: "home",
    homeQuery: "",
    homeResults: [],
    homeSearched: false,
    libraryQuery: "",
    librarySafety: "all",
    collectionFilter: "all",
    modal: null,
    filterOpen: false,
    pendingFocus: null,
  };
  applyAppearance();
  showToast("GlowCheck has been reset.");
  render();
}

function openModal(modal) {
  state.ui.modal = modal;
  render();
}

function closeModal() {
  state.ui.modal = null;
  render();
}

function applyAppearance() {
  document.body.dataset.theme = state.settings.appearance || "glow";
}

function addNotification(title, message, icon = "notifications") {
  if (!state.settings.notifications) {
    return;
  }

  state.notifications = [
    {
      id: `notification-${Date.now()}`,
      title,
      message,
      icon,
      time: formatNotificationTime(new Date()),
      unread: true,
    },
    ...state.notifications,
  ].slice(0, 20);
}

function render() {
  const focusSnapshot = captureFocus();
  app.innerHTML = `
    <div class="app-shell">
      ${renderHeader()}
      <main class="screen-content ${state.ui.route === "profile" ? "screen-content--profile" : ""}">
        ${renderCurrentScreen()}
      </main>
      ${renderFloatingButton()}
      ${renderBottomNav()}
      ${renderModal()}
    </div>
  `;
  restoreFocus(focusSnapshot);
  applyAppearance();
}

function renderHeader() {
  if (state.ui.route === "profile") {
    return `
      <header class="topbar topbar--profile">
        <div class="brand-row">
          <h1 class="brand-title brand-title--logo">Profile</h1>
        </div>
      </header>
    `;
  }

  if (state.ui.route === "library") {
    return `
      <header class="topbar">
        <div class="brand-row">
          <span class="material-symbols-outlined brand-icon">flare</span>
          <h1 class="brand-title brand-title--logo">GlowCheck</h1>
        </div>
        <div class="topbar-actions">
          ${renderNotificationButton()}
        </div>
      </header>
    `;
  }

  return `
    <header class="topbar">
      <div class="brand-row">
        <span class="material-symbols-outlined brand-icon">flare</span>
        <h1 class="brand-title brand-title--logo">GlowCheck</h1>
      </div>
      <div class="topbar-actions">
        ${renderNotificationButton()}
        <button class="avatar-chip" data-route="profile" aria-label="Open profile">
          <img src="./assets/avatar.svg" alt="Profile avatar" />
        </button>
      </div>
    </header>
  `;
}

function renderNotificationButton() {
  const unreadCount = state.notifications.filter((notification) => notification.unread).length;

  return `
    <button class="notification-button" data-action="open-notifications" aria-label="Open notifications">
      <span class="material-symbols-outlined">notifications</span>
      ${unreadCount ? `<span class="notification-count">${unreadCount > 9 ? "9+" : unreadCount}</span>` : ""}
    </button>
  `;
}

function renderCurrentScreen() {
  switch (state.ui.route) {
    case "library":
      return renderLibraryScreen();
    case "profile":
      return renderProfileScreen();
    case "home":
    default:
      return renderHomeScreen();
  }
}

function renderHomeScreen() {
  return `
    <section class="section">
      <h2 class="hero-title">Hi, Gorgeous! <span>✨</span></h2>
      <p class="hero-copy">Time to see what's really in your bottle today.</p>
    </section>

    <section class="section">
      <form class="search-shell" data-form="home-search">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          name="query"
          data-bind="home-query"
          value="${escapeHtml(state.ui.homeQuery)}"
          placeholder="Search ingredient..."
          aria-label="Search ingredient"
        />
        <button class="search-submit" type="submit" aria-label="Search">
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </form>
      <div class="trend-row">
        <span class="eyebrow">Trending:</span>
        <button class="pill-button pill-button--trend-primary" data-action="apply-trending" data-ingredient="Retinol">Retinol</button>
        <button class="pill-button pill-button--trend-secondary" data-action="apply-trending" data-ingredient="Niacinamide">Niacinamide</button>
        <button class="pill-button pill-button--trend-tertiary" data-action="apply-trending" data-ingredient="Squalane">Squalane</button>
      </div>
      ${renderHomeResults()}
      ${renderStackPanel()}
    </section>

    <section class="section">
      <div class="section-heading">
        <h3 class="section-title">Recent Scans <span class="material-symbols-outlined" style="font-size: 20px; color: var(--secondary);">history</span></h3>
        <button class="section-link" data-route="library">View All</button>
      </div>
      <div class="horizontal-scroll">
        ${state.recentScans.map(renderScanCard).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-heading">
        <h3 class="section-title">Daily Skincare Tip <span class="material-symbols-outlined" style="font-size: 20px; color: var(--tertiary);">lightbulb</span></h3>
      </div>
      <article class="tip-card">
        <div>
          <h4 class="modal-title">Stay Hydrated!</h4>
          <p class="card-copy">
            Drinking water is the first step to a natural glow. Try to aim for 2L daily for visible results in 7 days.
          </p>
        </div>
        <div class="tip-card__icon">
          <span class="material-symbols-outlined" style="font-size: 58px;">water_drop</span>
        </div>
      </article>
    </section>
  `;
}

function renderHomeResults() {
  if (!state.ui.homeSearched && state.ui.homeResults.length === 0) {
    return "";
  }

  if (state.ui.homeResults.length === 0) {
    return `<div class="empty-box" style="margin-top: 18px;">No ingredient found. Try another name or spelling.</div>`;
  }

  return `
    <div class="results-list" style="margin-top: 18px;">
      ${state.ui.homeResults.map((ingredient) => renderIngredientCard(ingredient, "search")).join("")}
    </div>
  `;
}

function renderStackPanel() {
  if (state.stack.length === 0) {
    return `
      <div class="analysis-card stack-panel">
        <div class="eyebrow">Analysis stack</div>
        <p class="empty-copy">Search and add ingredients to see how they interact together.</p>
      </div>
    `;
  }

  const ingredients = state.stack.map(getIngredientByName).filter(Boolean);
  const analysis = analyzeIngredients(ingredients);
  const safety = getStackSafetyLevel(ingredients, analysis);
  const meta = SAFETY_META[safety];

  return `
    <section class="analysis-card stack-panel">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Your stack (${state.stack.length})</div>
          <h3 class="section-title">Ingredient analysis</h3>
        </div>
        <button class="ghost-button" style="padding: 10px 14px; min-width: auto;" data-action="clear-stack">Clear</button>
      </div>

      <div class="stack-chips" style="margin-top: 14px;">
        ${ingredients
          .map(
            (ingredient) => `
              <button class="tag tag--soft" data-action="remove-from-stack" data-ingredient="${escapeHtml(ingredient.name)}">
                ${escapeHtml(ingredient.name)} ×
              </button>
            `
          )
          .join("")}
      </div>

      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">Overall rating</div>
          <div class="metric-value">${analysis.averageRating}<span style="font-size: 1rem; color: var(--text-muted);">/10</span></div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Routine safety</div>
          <div class="safe-badge" style="${badgeStyle(meta)}; margin-top: 8px;">${escapeHtml(meta.label)}</div>
        </div>
      </div>

      ${
        analysis.conflicts.length
          ? `
            <div class="conflict-box">
              <strong>Conflicts detected</strong>
              <div style="margin-top: 8px; display: grid; gap: 6px;">
                ${analysis.conflicts
                  .map(([left, right]) => `<div>${escapeHtml(left)} + ${escapeHtml(right)} should not be layered together.</div>`)
                  .join("")}
              </div>
            </div>
          `
          : ""
      }

      ${
        analysis.concerns.length
          ? `
            <div class="warning-box">
              <strong>Things to watch</strong>
              <ul class="detail-list" style="margin-top: 8px;">
                ${analysis.concerns.map((concern) => `<li>${escapeHtml(concern)}</li>`).join("")}
              </ul>
            </div>
          `
          : ""
      }

      <div style="margin-top: 16px;">
        <div class="eyebrow">Combined benefits</div>
        <div class="benefit-grid" style="margin-top: 10px;">
          ${analysis.benefits.map((benefit) => `<span class="tag tag--soft">${escapeHtml(benefit)}</span>`).join("")}
        </div>
      </div>

      <div style="margin-top: 16px;">
        <div class="eyebrow">Best skin match</div>
        <div class="skin-tags" style="margin-top: 10px;">
          ${
            analysis.compatibleSkinTypes.length
              ? analysis.compatibleSkinTypes
                  .map((skin) => `<span class="skin-tag tag">${escapeHtml(SKIN_LABELS[skin] || skin)}</span>`)
                  .join("")
              : `<span class="tag tag--soft">Check individually</span>`
          }
        </div>
      </div>

      <div class="modal-actions">
        <button class="secondary-button" data-action="save-stack-collection">Save as Collection</button>
        <button class="primary-button" data-route="library">Open Library</button>
      </div>
    </section>
  `;
}

function renderLibraryScreen() {
  const ingredients = getLibraryIngredients();
  const activeCollection =
    state.ui.collectionFilter === "all"
      ? null
      : state.collections.find((collection) => collection.id === state.ui.collectionFilter);

  return `
    <section class="section" style="text-align: center;">
      <h2 class="screen-title">Saved Ingredients</h2>
      <p class="section-copy">Your personal vault of skincare goodness.</p>
      <div style="margin-top: 22px;">
        <div class="search-shell search-shell--soft">
          <span class="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            value="${escapeHtml(state.ui.libraryQuery)}"
            data-bind="library-query"
            placeholder="Search your favorites..."
            aria-label="Search saved ingredients"
          />
          <button type="button" class="filter-submit" data-action="toggle-filter" aria-label="Toggle filters">
            <span class="material-symbols-outlined">tune</span>
          </button>
        </div>
        ${
          state.ui.filterOpen
            ? `
              <div class="filters-row" style="margin-top: 14px; justify-content: center;">
                <button class="pill-button ${state.ui.librarySafety === "all" ? "is-active" : ""}" data-action="set-safety-filter" data-theme="all">All</button>
                <button class="pill-button ${state.ui.librarySafety === "safe" ? "is-active" : ""}" data-action="set-safety-filter" data-theme="safe">Low Risk</button>
                <button class="pill-button ${state.ui.librarySafety === "caution" ? "is-active" : ""}" data-action="set-safety-filter" data-theme="caution">Caution</button>
              </div>
            `
            : ""
        }
        ${
          activeCollection
            ? `<div style="margin-top: 14px;"><span class="tag tag--soft">Filtered by ${escapeHtml(activeCollection.name)}</span></div>`
            : ""
        }
      </div>
    </section>

    <section class="section">
      ${
        ingredients.length
          ? `<div class="library-list">${ingredients.map((ingredient) => renderIngredientBarCard(ingredient)).join("")}</div>`
          : `<div class="empty-box">No saved ingredients match this filter yet.</div>`
      }
    </section>

    <section class="section">
      <h3 class="section-title">Saved Collections</h3>
      <div class="collection-grid" style="margin-top: 18px;">
        ${state.collections.map(renderCollectionTile).join("")}
      </div>
    </section>
  `;
}

function renderProfileScreen() {
  return `
    <section class="profile-hero section">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar-ring">
          <img src="./assets/avatar.svg" alt="Alex Glow portrait" />
        </div>
        <div class="verified-badge">
          <span class="material-symbols-outlined">settings</span>
        </div>
      </div>
      <div>
        <h2 class="profile-name">${escapeHtml(state.profile.name)}</h2>
        <p class="profile-copy">Beauty Enthusiast • ${escapeHtml(state.profile.joinedLabel)}</p>
      </div>
    </section>

    <section class="section">
      <div class="split-heading">
        <h3 class="section-title">Skin Profile</h3>
        <button class="soft-action" data-action="customize-profile">Customize</button>
      </div>
      <div class="profile-grid">
        <article class="profile-panel profile-panel--lavender">
          <div class="icon-bubble icon-bubble--purple" style="background: rgba(255,255,255,0.7);">
            <span class="material-symbols-outlined">face</span>
          </div>
          <small>Main Concern</small>
          <strong>${escapeHtml(state.profile.mainConcern)}</strong>
        </article>
        <article class="profile-panel profile-panel--blue">
          <div class="icon-bubble icon-bubble--blue" style="background: rgba(255,255,255,0.7);">
            <span class="material-symbols-outlined">eco</span>
          </div>
          <small>Reaction Level</small>
          <strong>${escapeHtml(state.profile.reactionLevel)}</strong>
        </article>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">App Settings</h3>
      <div class="settings-list" style="margin-top: 18px;">
        <div class="setting-row">
          <div class="setting-leading">
            <div class="icon-bubble icon-bubble--purple"><span class="material-symbols-outlined">notifications</span></div>
            <div>
              <strong>Notifications</strong>
              <div class="metric-label">${state.settings.notifications ? "Routine reminders on" : "Routine reminders off"}</div>
            </div>
          </div>
          <button class="switch ${state.settings.notifications ? "is-on" : ""}" data-action="toggle-notifications" aria-label="Toggle notifications"></button>
        </div>
        <div class="setting-row">
          <div class="setting-leading">
            <div class="icon-bubble icon-bubble--pink"><span class="material-symbols-outlined">palette</span></div>
            <div>
              <strong>Appearance</strong>
              <div class="metric-label">${state.settings.appearance === "glow" ? "Glow mode" : "Dusk mode"}</div>
            </div>
          </div>
          <button class="soft-action" style="padding: 10px 14px;" data-action="toggle-appearance">Switch</button>
        </div>
        <div class="setting-row">
          <div class="setting-leading">
            <div class="icon-bubble icon-bubble--blue"><span class="material-symbols-outlined">security</span></div>
            <div>
              <strong>Privacy &amp; Security</strong>
              <div class="metric-label">Demo ready</div>
            </div>
          </div>
          <button class="icon-button" data-action="privacy" aria-label="Privacy and security">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">Help &amp; Support</h3>
      <div class="help-actions" style="margin-top: 18px;">
        <button class="action-button action-button--pink" data-action="help">
          <span class="material-symbols-outlined">help_center</span>
          Help Center
        </button>
        <button class="action-button action-button--blue" data-action="help">
          <span class="material-symbols-outlined">chat_bubble</span>
          Contact Support
        </button>
      </div>
    </section>

    <section class="section" style="text-align: center;">
      <button class="logout-button" data-action="logout">
        <span class="material-symbols-outlined">logout</span>
        Logout
      </button>
    </section>
  `;
}

function renderIngredientCard(ingredient, context) {
  const display = getIngredientDisplay(ingredient);
  const category = getIngredientCategory(ingredient);
  const meta = SAFETY_META[ingredient.safety];
  const saved = state.saved.includes(ingredient.name);
  const inStack = state.stack.includes(ingredient.name);
  const accentClass = `list-card--accent-${display.accent === "green" ? "blue" : display.accent}`;

  return `
    <article class="list-card ${accentClass}">
      <div class="card-top">
        <div class="ingredient-row">
          <div class="ingredient-leading">
            <div class="icon-bubble icon-bubble--${display.accent === "green" ? "blue" : display.accent}">
              <span class="material-symbols-outlined">${display.icon}</span>
            </div>
            <div style="min-width: 0;">
              <h3 class="card-title">${escapeHtml(ingredient.name)}</h3>
              <div class="safe-badge" style="${badgeStyle(meta)}; margin-top: 8px;">${escapeHtml(meta.badge)}</div>
            </div>
          </div>
        </div>
        <button
          class="save-button${saved ? " saved" : ""}"
          data-action="toggle-save"
          data-ingredient="${escapeHtml(ingredient.name)}"
          aria-label="${saved ? "Remove from library" : "Save to library"}"
        >
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${saved ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24;">
            ${context === "search" ? "bookmark" : "bookmarks"}
          </span>
        </button>
      </div>
      <p class="card-copy">${escapeHtml(buildIngredientDescription(ingredient))}</p>
      <div class="card-footer">
        <span class="tag">${escapeHtml(category)}</span>
        <div class="inline-actions">
          <button class="card-link card-action" data-action="open-ingredient" data-ingredient="${escapeHtml(ingredient.name)}">
            Details
            <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
          </button>
          <button class="secondary-button btn-small" data-action="${inStack ? "remove-from-stack" : "add-to-stack"}" data-ingredient="${escapeHtml(ingredient.name)}">
            ${inStack ? "Added" : "+ Stack"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderIngredientBarCard(ingredient) {
  const display = getIngredientDisplay(ingredient);
  const category = getIngredientCategory(ingredient);
  const meta = SAFETY_META[ingredient.safety];
  const saved = state.saved.includes(ingredient.name);
  const inStack = state.stack.includes(ingredient.name);
  const accent = display.accent === "green" ? "blue" : display.accent;

  return `
    <article class="bar-card bar-card--${accent}">
      <div class="bar-icon icon-bubble--${accent}">
        <span class="material-symbols-outlined" style="font-size: 1.25rem;">${display.icon}</span>
      </div>
      <button
        class="bar-body"
        data-action="open-ingredient"
        data-ingredient="${escapeHtml(ingredient.name)}"
        aria-label="View details for ${escapeHtml(ingredient.name)}"
      >
        <span class="bar-name">${escapeHtml(ingredient.name)}</span>
        <span class="bar-badge" style="${badgeStyle(meta)}">${escapeHtml(meta.badge)}</span>
      </button>
      <span class="bar-category">${escapeHtml(category)}</span>
      <div class="bar-actions">
        <button
          class="bar-stack-btn${inStack ? " bar-stack-btn--added" : ""}"
          data-action="${inStack ? "remove-from-stack" : "add-to-stack"}"
          data-ingredient="${escapeHtml(ingredient.name)}"
          aria-label="${inStack ? "Remove from stack" : "Add to stack"}"
        >${inStack ? "✓ Added" : "+ Stack"}</button>
        <button
          class="bar-save-btn${saved ? " saved" : ""}"
          data-action="toggle-save"
          data-ingredient="${escapeHtml(ingredient.name)}"
          aria-label="${saved ? "Remove from library" : "Save to library"}"
        >
          <span class="material-symbols-outlined" style="font-size: 1.3rem; font-variation-settings: 'FILL' ${saved ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24;">bookmarks</span>
        </button>
      </div>
    </article>
  `;
}

function renderScanCard(scan) {
  return `
    <button class="scan-card" data-action="open-scan" data-scan="${escapeHtml(scan.id)}" aria-label="Open ${escapeHtml(scan.name)} scan">
      <div class="scan-visual">
        <img src="${escapeHtml(scan.image)}" alt="${escapeHtml(scan.name)} illustration" />
      </div>
      <div class="scan-body">
        <h4 class="scan-title">${escapeHtml(scan.name)}</h4>
        <div class="scan-meta">
          <span class="eyebrow">${scan.ingredients.length} ingredients</span>
          <span class="score-badge ${scan.scoreTone === "danger" ? "score-badge--danger" : ""}">${scan.score.toFixed(1)} Score</span>
        </div>
      </div>
    </button>
  `;
}

function renderCollectionTile(collection) {
  const active = state.ui.collectionFilter === collection.id;
  const className = `collection-tile collection-tile--${collection.accent || "neutral"}`;
  const icon = collection.icon || "folder";

  return `
    <button class="${className}" data-action="select-collection" data-collection="${escapeHtml(collection.id)}" style="${active ? "outline: 3px solid rgba(255,255,255,0.55);" : ""}">
      <span class="material-symbols-outlined" style="font-size: 34px;">${escapeHtml(icon)}</span>
      <strong>${escapeHtml(collection.name)}</strong>
      <span class="collection-meta">${collection.ingredients.length} ingredients</span>
    </button>
  `;
}

function renderBottomNav() {
  const route = state.ui.route;
  const profileSoft = route === "profile" ? " is-active--soft" : "";

  return `
    <nav class="bottom-nav">
      <button class="nav-item ${route === "home" ? "is-active" : ""}" data-route="home">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${route === "home" ? 1 : 0};">home</span>
        <span class="nav-label">Home</span>
      </button>
      <button class="nav-item ${route === "library" ? "is-active" : ""}" data-route="library">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${route === "library" ? 1 : 0};">bookmarks</span>
        <span class="nav-label">Library</span>
      </button>
      <button class="nav-item ${route === "profile" ? profileSoft : ""}" data-route="profile">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' ${route === "profile" ? 1 : 0};">person</span>
        <span class="nav-label">Profile</span>
      </button>
    </nav>
  `;
}

function renderFloatingButton() {
  if (state.ui.route === "profile") {
    return "";
  }

  if (state.ui.route === "library") {
    return "";
  }

  return `
    <button class="floating-button floating-button--pink" data-action="focus-search" aria-label="Focus search">
      <span class="material-symbols-outlined" style="font-size: 34px;">add</span>
    </button>
  `;
}

function renderModal() {
  if (!state.ui.modal) {
    return "";
  }

  if (state.ui.modal.type === "ingredient") {
    return renderIngredientModal(state.ui.modal.ingredient);
  }

  if (state.ui.modal.type === "scan") {
    return renderScanModal(state.ui.modal.scan);
  }

  if (state.ui.modal.type === "profile") {
    return renderProfileModal();
  }

  if (state.ui.modal.type === "stackCollection") {
    return renderStackCollectionModal();
  }

  if (state.ui.modal.type === "notifications") {
    return renderNotificationsModal();
  }

  return "";
}

function renderIngredientModal(name) {
  const ingredient = getIngredientByName(name);

  if (!ingredient) {
    return "";
  }

  const meta = SAFETY_META[ingredient.safety];
  const saved = state.saved.includes(ingredient.name);
  const stacked = state.stack.includes(ingredient.name);

  return `
    <div class="modal-backdrop">
      <div class="modal-sheet">
        <div class="modal-heading">
          <div>
            <div class="eyebrow">Ingredient detail</div>
            <h3 class="modal-title">${escapeHtml(ingredient.name)}</h3>
          </div>
          <button class="modal-close" data-action="close-modal" aria-label="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="safe-badge" style="${badgeStyle(meta)} margin-top: 14px;">${escapeHtml(meta.label)} • ${ingredient.rating}/10</div>

        <div class="detail-grid" style="margin-top: 18px;">
          <section class="detail-card">
            <div class="eyebrow">Also known as</div>
            <p class="modal-copy">${ingredient.aliases.length ? escapeHtml(ingredient.aliases.join(", ")) : "No common aliases listed."}</p>
          </section>
          <section class="detail-card">
            <div class="eyebrow">Benefits</div>
            <div class="benefit-grid" style="margin-top: 10px;">
              ${ingredient.benefits.map((benefit) => `<span class="tag tag--soft">${escapeHtml(benefit)}</span>`).join("")}
            </div>
          </section>
          <section class="detail-card">
            <div class="eyebrow">Skin types</div>
            <div class="skin-tags" style="margin-top: 10px;">
              ${ingredient.skin_types.map((skin) => `<span class="tag">${escapeHtml(SKIN_LABELS[skin] || skin)}</span>`).join("")}
            </div>
          </section>
          <section class="detail-card">
            <div class="eyebrow">Avoid mixing with</div>
            ${
              ingredient.avoid_with.length
                ? `<div class="benefit-grid" style="margin-top: 10px;">${ingredient.avoid_with.map((item) => `<span class="tag tag--blue">${escapeHtml(item)}</span>`).join("")}</div>`
                : `<p class="modal-copy">This ingredient generally plays well with most routines.</p>`
            }
          </section>
          ${
            ingredient.concerns.length
              ? `
                <section class="detail-card">
                  <div class="eyebrow">Things to watch</div>
                  <ul class="detail-list" style="margin-top: 10px;">
                    ${ingredient.concerns.map((concern) => `<li>${escapeHtml(concern)}</li>`).join("")}
                  </ul>
                </section>
              `
              : ""
          }
        </div>

        <div class="modal-actions">
          <button class="secondary-button" data-action="toggle-save" data-ingredient="${escapeHtml(ingredient.name)}">
            ${saved ? "Remove from Library" : "Save to Library"}
          </button>
          <button class="primary-button" data-action="${stacked ? "remove-from-stack" : "add-to-stack"}" data-ingredient="${escapeHtml(ingredient.name)}">
            ${stacked ? "Remove from Stack" : "Add to Stack"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderScanModal(id) {
  const scan = state.recentScans.find((entry) => entry.id === id);

  if (!scan) {
    return "";
  }

  const ingredients = scan.ingredients.map(getIngredientByName).filter(Boolean);
  const analysis = analyzeIngredients(ingredients);
  const safety = getStackSafetyLevel(ingredients, analysis);
  const meta = SAFETY_META[safety];

  return `
    <div class="modal-backdrop">
      <div class="modal-sheet">
        <div class="modal-heading">
          <div>
            <div class="eyebrow">Recent scan</div>
            <h3 class="modal-title">${escapeHtml(scan.name)}</h3>
          </div>
          <button class="modal-close" data-action="close-modal" aria-label="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style="margin-top: 18px; border-radius: 24px; overflow: hidden;">
          <img src="${escapeHtml(scan.image)}" alt="${escapeHtml(scan.name)} illustration" />
        </div>

        <div class="metric-grid" style="margin-top: 18px;">
          <div class="metric-card">
            <div class="metric-label">Product score</div>
            <div class="metric-value">${scan.score.toFixed(1)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Routine safety</div>
            <div class="safe-badge" style="${badgeStyle(meta)}; margin-top: 8px;">${escapeHtml(meta.label)}</div>
          </div>
        </div>

        <section class="detail-card">
          <div class="eyebrow">Ingredients</div>
          <div class="benefit-grid" style="margin-top: 10px;">
            ${scan.ingredients.map((item) => `<span class="tag tag--soft">${escapeHtml(item)}</span>`).join("")}
          </div>
        </section>

        ${
          analysis.conflicts.length
            ? `
              <div class="conflict-box" style="margin-top: 16px;">
                <strong>Potential conflicts</strong>
                <div style="margin-top: 8px; display: grid; gap: 6px;">
                  ${analysis.conflicts
                    .map(([left, right]) => `<div>${escapeHtml(left)} + ${escapeHtml(right)}</div>`)
                    .join("")}
                </div>
              </div>
            `
            : ""
        }

        <div class="modal-actions">
          <button class="secondary-button" data-action="close-modal">Close</button>
          <button class="primary-button" data-action="add-scan-stack" data-scan="${escapeHtml(scan.id)}">Add All to Stack</button>
        </div>
      </div>
    </div>
  `;
}

function renderProfileModal() {
  return `
    <div class="modal-backdrop">
      <div class="modal-sheet">
        <div class="modal-heading">
          <div>
            <div class="eyebrow">Customize</div>
            <h3 class="modal-title">Update skin profile</h3>
          </div>
          <button class="modal-close" data-action="close-modal" aria-label="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form class="form-grid" data-form="profile">
          <div class="field">
            <label for="profile-name">Display name</label>
            <input id="profile-name" name="name" value="${escapeHtml(state.profile.name)}" />
          </div>
          <div class="field">
            <label for="profile-joined">Joined label</label>
            <input id="profile-joined" name="joinedLabel" value="${escapeHtml(state.profile.joinedLabel)}" />
          </div>
          <div class="field">
            <label for="profile-concern">Main concern</label>
            <select id="profile-concern" name="mainConcern">
              ${["Oily", "Dry", "Combination", "Sensitive", "Normal", "Acne-prone"]
                .map((option) => `<option value="${option}" ${option === state.profile.mainConcern ? "selected" : ""}>${option}</option>`)
                .join("")}
            </select>
          </div>
          <div class="field">
            <label for="profile-reaction">Reaction level</label>
            <select id="profile-reaction" name="reactionLevel">
              ${["Sensitive", "Balanced", "Resilient", "Reactive"]
                .map((option) => `<option value="${option}" ${option === state.profile.reactionLevel ? "selected" : ""}>${option}</option>`)
                .join("")}
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="ghost-button" data-action="close-modal">Cancel</button>
            <button type="submit" class="primary-button">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderStackCollectionModal() {
  const stackIngredients = state.stack.map(getIngredientByName).filter(Boolean);

  return `
    <div class="modal-backdrop">
      <div class="modal-sheet">
        <div class="modal-heading">
          <div>
            <div class="eyebrow">Save stack</div>
            <h3 class="modal-title">Create collection</h3>
          </div>
          <button class="modal-close" data-action="close-modal" aria-label="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <p class="modal-copy">This will save your current stack of ${stackIngredients.length} ingredients as a Library collection.</p>

        <div class="stack-chips" style="margin-bottom: 18px;">
          ${stackIngredients
            .map((ingredient) => `<span class="tag tag--soft">${escapeHtml(ingredient.name)}</span>`)
            .join("")}
        </div>

        <form class="form-grid" data-form="stack-collection">
          <div class="field">
            <label for="collection-name">Collection name</label>
            <input id="collection-name" name="name" value="My Glow Stack" maxlength="26" autocomplete="off" required />
          </div>
          <div class="modal-actions">
            <button type="button" class="ghost-button" data-action="close-modal">Cancel</button>
            <button type="submit" class="primary-button">Save Collection</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderNotificationsModal() {
  return `
    <div class="modal-backdrop">
      <div class="modal-sheet">
        <div class="modal-heading">
          <div>
            <div class="eyebrow">Inbox</div>
            <h3 class="modal-title">Notifications</h3>
          </div>
          <button class="modal-close" data-action="close-modal" aria-label="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        ${
          state.notifications.length
            ? `
              <div class="notification-list">
                ${state.notifications.map(renderNotificationItem).join("")}
              </div>
              <div class="modal-actions">
                <button class="ghost-button" data-action="clear-notifications">Clear All</button>
                <button class="primary-button" data-action="mark-notifications-read">Mark Read</button>
              </div>
            `
            : `<div class="empty-box" style="margin-top: 18px;">No notifications yet.</div>`
        }
      </div>
    </div>
  `;
}

function renderNotificationItem(notification) {
  return `
    <article class="notification-card ${notification.unread ? "is-unread" : ""}">
      <div class="icon-bubble icon-bubble--pink" style="width: 44px; height: 44px;">
        <span class="material-symbols-outlined">${escapeHtml(notification.icon)}</span>
      </div>
      <div>
        <div class="row-between" style="align-items: flex-start;">
          <strong>${escapeHtml(notification.title)}</strong>
          <span class="metric-label">${escapeHtml(notification.time)}</span>
        </div>
        <p class="modal-copy" style="margin: 6px 0 0;">${escapeHtml(notification.message)}</p>
      </div>
    </article>
  `;
}

function getLibraryIngredients() {
  let ingredients;

  if (state.ui.collectionFilter !== "all") {
    // Show all ingredients from the selected collection directly —
    // not just the ones that also happen to be individually saved.
    const selected = state.collections.find((collection) => collection.id === state.ui.collectionFilter);
    ingredients = uniqueStrings(selected ? selected.ingredients : [])
      .map(getIngredientByName)
      .filter(Boolean);
  } else {
    ingredients = uniqueStrings(state.saved)
      .map(getIngredientByName)
      .filter(Boolean);
  }

  if (state.ui.librarySafety !== "all") {
    ingredients = ingredients.filter((ingredient) => ingredient.safety === state.ui.librarySafety);
  }

  if (state.ui.libraryQuery.trim()) {
    const results = fuzzySearch(state.ui.libraryQuery, 100);
    const allowed = new Set(results.map((ingredient) => ingredient.name));
    ingredients = ingredients.filter((ingredient) => allowed.has(ingredient.name));
  }

  return ingredients;
}

function getIngredientDisplay(ingredient) {
  const known = ingredientDisplay[ingredient.name];

  if (known) {
    return known;
  }

  const category = getIngredientCategory(ingredient).toLowerCase();

  if (category.includes("hydra")) {
    return { accent: "purple", icon: "water_drop" };
  }

  if (category.includes("barrier") || category.includes("soothing")) {
    return { accent: "pink", icon: "favorite" };
  }

  return { accent: "blue", icon: "spa" };
}

function badgeStyle(meta) {
  return `background:${meta.background};color:${meta.color};border:1px solid ${meta.border};`;
}

function buildIngredientDescription(ingredient) {
  const text = ingredient.benefits.join(", ");
  const summary = `${text}. ${ingredient.concerns.length ? `Watch for ${ingredient.concerns[0].toLowerCase()}.` : "A strong all-rounder for modern routines."}`;
  return summary.length > 148 ? `${summary.slice(0, 145)}...` : summary;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastRoot.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function formatNotificationTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function captureFocus() {
  const active = document.activeElement;

  if (!active || !active.dataset || !active.dataset.bind) {
    return state.ui.pendingFocus ? { bind: state.ui.pendingFocus } : null;
  }

  return {
    bind: state.ui.pendingFocus || active.dataset.bind,
    start: typeof active.selectionStart === "number" ? active.selectionStart : null,
    end: typeof active.selectionEnd === "number" ? active.selectionEnd : null,
  };
}

function restoreFocus(snapshot) {
  const targetBind = state.ui.pendingFocus || snapshot?.bind;

  if (!targetBind) {
    return;
  }

  const input = app.querySelector(`[data-bind="${targetBind}"]`);

  if (input) {
    input.focus();

    if (
      snapshot &&
      typeof snapshot.start === "number" &&
      typeof snapshot.end === "number" &&
      typeof input.setSelectionRange === "function"
    ) {
      input.setSelectionRange(snapshot.start, snapshot.end);
    }
  }

  state.ui.pendingFocus = null;
}

function uniqueStrings(items) {
  return [...new Set(items.filter(Boolean))];
}

function sanitizeText(value, maxLength = 30) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") {
    return;
  }

  navigator.serviceWorker.register("./sw.js").catch(() => {});
}