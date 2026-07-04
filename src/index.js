const DEFAULT_STORAGE_KEY = "flowlytics_tracker_state";

function createMemoryStore() {
  let state = null;
  return {
    getItem() {
      return state;
    },
    setItem(value) {
      state = value;
    },
    removeItem() {
      state = null;
    }
  };
}

function createBrowserStore(storageKey) {
  if (typeof window === "undefined" || !window.localStorage) {
    return createMemoryStore();
  }

  return {
    getItem() {
      return window.localStorage.getItem(storageKey);
    },
    setItem(value) {
      window.localStorage.setItem(storageKey, value);
    },
    removeItem() {
      window.localStorage.removeItem(storageKey);
    }
  };
}

function randomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `anon_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function sanitizeObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  );
}

function loadState(store) {
  try {
    const raw = store.getItem();
    if (!raw) {
      return { anonymousId: randomId(), userId: null, traits: {} };
    }

    const parsed = JSON.parse(raw);
    return {
      anonymousId: typeof parsed.anonymousId === "string" ? parsed.anonymousId : randomId(),
      userId: typeof parsed.userId === "string" ? parsed.userId : null,
      traits: sanitizeObject(parsed.traits)
    };
  } catch {
    return { anonymousId: randomId(), userId: null, traits: {} };
  }
}

function persistState(store, state) {
  store.setItem(JSON.stringify(state));
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function createFlowlytics(options = {}) {
  const endpoint = String(options.endpoint || "").trim();
  invariant(endpoint, "Flowlytics endpoint is required.");

  const fetchImpl = options.fetch || globalThis.fetch;
  invariant(typeof fetchImpl === "function", "A fetch implementation is required.");

  const storageKey = String(options.storageKey || DEFAULT_STORAGE_KEY);
  const store = createBrowserStore(storageKey);
  let state = loadState(store);
  persistState(store, state);

  async function send(type, name, properties = {}) {
    const payload = {
      type,
      name: name || null,
      timestamp: new Date().toISOString(),
      anonymousId: state.anonymousId,
      userId: state.userId,
      traits: sanitizeObject(state.traits),
      properties: sanitizeObject(properties),
      context: {
        site: options.site || null,
        url: typeof window !== "undefined" ? window.location.href : null,
        path: typeof window !== "undefined" ? window.location.pathname : null,
        title: typeof document !== "undefined" ? document.title : null,
        referrer: typeof document !== "undefined" ? document.referrer : null,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null
      }
    };

    const headers = {
      "Content-Type": "application/json"
    };

    if (options.apiKey) {
      headers.Authorization = `Bearer ${options.apiKey}`;
    }

    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Flowlytics request failed with status ${response.status}.`);
    }

    return response;
  }

  return {
    async track(name, properties = {}) {
      invariant(typeof name === "string" && name.trim(), "track(name) requires a non-empty event name.");
      return send("track", name.trim(), properties);
    },

    async identify(userId, traits = {}) {
      invariant(typeof userId === "string" && userId.trim(), "identify(userId) requires a non-empty user ID.");
      state = {
        ...state,
        userId: userId.trim(),
        traits: sanitizeObject(traits)
      };
      persistState(store, state);
      return send("identify", "Identify", traits);
    },

    async page(name, properties = {}) {
      const pageName =
        typeof name === "string" && name.trim()
          ? name.trim()
          : typeof document !== "undefined" && document.title
            ? document.title
            : "Page Viewed";

      return send("page", pageName, properties);
    },

    reset() {
      state = { anonymousId: randomId(), userId: null, traits: {} };
      persistState(store, state);
    }
  };
}
