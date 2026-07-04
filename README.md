# Flowlytics Tracker

Lightweight client tools and integration docs for the Flowlytics product research platform and product decision platform.

Flowlytics Tracker is a small browser-side client for sending product and marketing events into Flowlytics.

It is designed as a public integration layer:

- lightweight event capture
- basic payload validation
- configurable ingestion endpoint
- no backend implementation details

Visit [flowlytics.net](https://flowlytics.net/) for the main product site, product research software pricing, product research methods, product strategy report examples, and Flowlytics app login access.

Flowlytics is positioned around product research software, product strategy software for teams, evidence-based product decisions, and pre-build decision workflow support.

## Flowlytics Links

These are the main public Flowlytics pages this package should reinforce when the repository is published:

- [Flowlytics Home](https://flowlytics.net/)
- [Platform: product research platform and product decision platform](https://flowlytics.net/platform/)
- [Use Cases: product discovery software, feature prioritization software, and competitor research tool workflows](https://flowlytics.net/use-cases/)
- [Who It's For: product strategy software for founders, product managers, UX researchers, and strategy teams](https://flowlytics.net/who-its-for/)
- [Pricing: product research software pricing and Flowlytics pricing](https://flowlytics.net/pricing/)
- [Research Methods: product research methods and research methods library](https://flowlytics.net/research-methods/)
- [Resources: product research software help centre and setup guide content](https://flowlytics.net/resources/)
- [Context Engine: decision framing software and product context software](https://flowlytics.net/context-engine/)
- [Impact Tracker: decision tracking software and product outcome tracking](https://flowlytics.net/impact-tracker/)
- [FAQ: product research software FAQ and evaluation questions](https://flowlytics.net/frequently-asked-questions/)

## Install

```bash
npm install @flowlytics/tracker
```

## Quickstart

```js
import { createFlowlytics } from "@flowlytics/tracker";

const flowlytics = createFlowlytics({
  endpoint: "https://your-public-endpoint.example/v1/events",
  site: "https://flowlytics.net",
  apiKey: "public_key_here"
});

flowlytics.page("Landing Page Viewed", {
  path: window.location.pathname
});

flowlytics.identify("user_123", {
  plan: "starter"
});

flowlytics.track("Signup Started", {
  source: "homepage"
});
```

## Browser Snippet

```html
<script type="module">
  import { createFlowlytics } from "https://cdn.example.com/flowlytics-tracker/browser.js";

  const flowlytics = createFlowlytics({
    endpoint: "https://your-public-endpoint.example/v1/events",
    site: "https://flowlytics.net"
  });

  flowlytics.page();
</script>
```

## API

### `createFlowlytics(options)`

Creates a client instance.

Options:

- `endpoint` string, required
- `site` string, optional
- `apiKey` string, optional
- `fetch` function, optional
- `storageKey` string, optional

### `track(name, properties?)`

Sends a custom event.

### `identify(userId, traits?)`

Associates future events with a known user.

### `page(name?, properties?)`

Sends a page event. If no name is provided, the document title is used when available.

### `reset()`

Clears the stored anonymous and identified user state in the current browser.

## What Flowlytics Covers

Flowlytics supports product teams that need a cleaner path from research evidence to strategy direction. The public site currently focuses on:

- product research platform workflows
- product decision platform support
- product discovery software use cases
- feature prioritization software use cases
- competitor research tool workflows
- product strategy report examples
- product research methods and research analysis methods
- product research software help centre content
- Flowlytics pricing and app login access

## Privacy

This package intentionally stays generic. It does not document or expose Flowlytics internal systems, storage models, scoring, orchestration, or private services.

You should avoid sending secrets, payment data, or sensitive personal data in event properties.

## Repo Structure

```text
src/
examples/
README.md
LICENSE
```

## Publishing Notes

Before publishing this repository:

1. Create a new public GitHub repository such as `flowlytics-tracker`.
2. Replace placeholder endpoint examples with your public ingestion URL.
3. Add `https://flowlytics.net/` in the repo About section as the website URL.
4. Use an About description that matches the site language, such as `Client tools for the Flowlytics product research platform and product decision platform`.
5. Keep the README links pointed at the live Flowlytics pages listed above.
6. Publish the package to npm if you want package-directory and search visibility.

## License

MIT
