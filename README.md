# Spotlight — Mobile App

App documentation for the Spotlight mobile client. The Convex backend is documented separately in [`README-backend.md`](./README-backend.md).

## Summary

Spotlight ("don't miss anything") is a cross-platform photo-sharing app built with Expo and React Native. Users sign in with Google through Clerk, browse a feed of photo posts, like, comment on and bookmark them, create their own posts by picking an image and uploading it to Convex storage, manage their profile and follow other users, and receive in-app notifications for likes, comments and follows. The app uses Convex as its backend and is written entirely in TypeScript with Expo Router file-based navigation.

`React Native, Expo, Expo Router, React, TypeScript, JavaScript, Convex, Clerk, Expo Image, Expo Image Picker, Expo File System, Expo Font, Expo Linking, Expo Navigation Bar, Expo Status Bar, Expo Web Browser, Expo Secure Store, Expo Splash Screen, React Native Safe Area Context, @expo/vector-icons, date-fns, npm, ESLint`

## Functions / Features

- 🔐 **Google sign-in via Clerk SSO** — `useSSO().startSSOFlow({ strategy: "oauth_google" })` opens the browser and the session is completed on the `sso-callback` route; the browser is pre-warmed with the `useWarmUpBrowser` hook
- 🚦 **Auth-gated navigation** — `InitialLayout` uses Expo Router `Stack.Protected` guards so signed-out users only see the `(auth)` stack and signed-in users only see `(tabs)` + `user/[id]`
- 🧾 **Home feed** — a `FlatList` of posts (image, author, caption, likes count, comment count, relative timestamp) with like, comment, bookmark and delete actions
- 📖 **Stories strip** — a horizontal stories row at the top of the feed, rendered from static mock data (`src/constants/mock-data.ts`); stories are a UI placeholder and are not persisted
- 📸 **Create post** — pick a square image with `expo-image-picker`, preview it, write a caption, upload the file directly to Convex storage (via a generated upload URL) and create the post
- ❤️ **Likes** — toggle like/unlike from the feed with optimistic local state
- 💬 **Comments** — a slide-up modal listing comments (author name, avatar, relative time) with an input to post a new comment
- 🔖 **Bookmarks** — toggle bookmarks from the feed and browse a 3-column grid of bookmarked images
- 👤 **Own profile** — avatar, name, bio, post/follower/following stats, a 3-column post grid, an image viewer modal and an "Edit Profile" modal for name and bio
- 👥 **Other user profiles** — opened from post headers and notifications; shows stats, posts grid and a Follow/Following toggle button
- 🔔 **Notifications** — list of like/comment/follow events with sender avatar, type badge, message text, timestamp and post thumbnail
- 🚪 **Sign out** — available from the feed header and the profile header
- 🌓 **Dark branded theme** — black background with green accents (`COLORS.primary` `#4ADE80`) and the JetBrains Mono font, with loading spinners and empty states throughout
- 🔌 **Real-time data** — all feed, comments, bookmarks, profile and notification data comes from Convex reactive queries (see `README-backend.md` for backend details)

## Technologies and Their Functions

Versions are the declared ranges from `package.json` / `package-lock.json` unless noted otherwise.

| Technology | Version (declared) | What it does in this app |
| --- | --- | --- |
| React Native | `0.86.3` | Core mobile UI framework (View, Text, FlatList, Modal, RefreshControl, StyleSheet, …) |
| Expo | `~57.0.26` | App runtime and SDK; provides `expo/fetch` (native fetch used for storage uploads) and bundles `expo-file-system` `~57.0.7` |
| Expo Router | `~57.0.24` | File-based navigation in `src/app/` (Stack, Tabs, `Link`, `useRouter`, `useLocalSearchParams`, `SplashScreen`) with typed routes enabled |
| React | `19.2.3` | Component model; hooks (`useState`, `useEffect`) in every screen and component |
| TypeScript | `~6.0.3` (devDependency) | Language for all app code; `strict` mode, path aliases `@/*` → `src/*` and `@/assets/*` → `assets/*` |
| JavaScript | — | `eslint.config.js`, `expo-env.d.ts` and the generated Convex JS files |
| Convex client | `convex` `^1.46.0` | Backend (database, storage, functions) plus the React client: `useQuery` / `useMutation` from `convex/react` and `ConvexProviderWithClerk` from `convex/react-clerk` |
| Clerk | `@clerk/expo` `^4.7.3` | Authentication SDK: `ClerkProvider`, `useAuth`, `useUser`, `useSSO`, and the `tokenCache` from `@clerk/expo/token-cache` (backed by Expo Secure Store) |
| Expo Image | `~57.0.5` | All app imagery, with `contentFit`, fade `transition` and `memory-disk` caching (avoids the RN `Image` in most components) |
| Expo Image Picker | `~57.0.20` | Picking the image for a new post (square crop, `quality: 0.8`) |
| Expo File System | `~57.0.7` (resolved through the `expo` package) | `File` class used to wrap the picked image URI for the upload request |
| Expo Font | `~57.0.4` | Loads `JetBrainsMono-Medium` in the root layout before the app renders |
| Expo Linking | `~57.0.11` | Builds the OAuth redirect URL (`Linking.createURL("/(auth)/sso-callback")`) |
| Expo Navigation Bar | `~57.0.3` | Sets the Android navigation bar to light style in the root layout |
| Expo Status Bar | `~57.0.1` | Renders the light status bar |
| Expo Web Browser | `~57.0.3` | Completes auth sessions (`maybeCompleteAuthSession`) and warms up / cools down the browser for SSO |
| Expo Secure Store | `~57.0.4` | Registered as a config plugin and used through Clerk's token cache to persist the session securely |
| Expo Splash Screen | `~57.0.9` | Keeps the splash visible until fonts load (`SplashScreen.preventAutoHideAsync` / `hideAsync`); configured in `app.json` |
| React Native Safe Area Context | `~5.7.0` | `SafeAreaProvider` / `SafeAreaView` wrapping the app |
| @expo/vector-icons | `^15.0.2` | Ionicons glyphs for all icons (home, bookmark, add-circle, heart, person-circle, trash, etc.) |
| date-fns | `^4.4.0` | `formatDistanceToNow` for relative timestamps on posts, comments and notifications |
| ESLint | via `eslint-config-expo/flat` (config file `eslint.config.js`; no version pinned in `package.json`) | Linting through `npm run lint` (`expo lint`) |
| npm | lockfile `package-lock.json` | Dependency management and script runner (`npm install`, `npm run start`, …) |

Additional packages declared in `package.json` that are **not imported by application code** (verified by searching all files under `src/`): `@expo/ui`, `expo-auth-session`, `expo-blob`, `expo-constants`, `expo-device`, `expo-glass-effect`, `expo-symbols`, `expo-system-ui`, `react-dom`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-screens`, `react-native-web`, `react-native-worklets`, and `svix` (used only by backend code in `convex/http.ts`). `package.json` also contains a stray entry `"undefined": "expo/fetch"`.

## 📁 Project Structure

```text
Spotlight-App/
├── src/
│   ├── app/                        # Expo Router routes (file-based)
│   │   ├── _layout.tsx             # Root layout: font loading, splash, providers, safe area
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx         # Auth stack (no headers)
│   │   │   ├── login.tsx           # Google sign-in screen
│   │   │   └── sso-callback.tsx    # OAuth callback / session completion
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx         # Bottom tab navigator (5 icon-only tabs)
│   │   │   ├── index.tsx           # Home feed (posts + stories)
│   │   │   ├── bookmarks.tsx       # Bookmarked posts grid
│   │   │   ├── create.tsx          # New-post flow (picker, caption, upload)
│   │   │   ├── notifications.tsx   # Notifications list
│   │   │   └── profile.tsx         # Own profile (stats, edit modal, post grid)
│   │   └── user/
│   │       └── [id].tsx            # Another user's profile (follow/unfollow)
│   ├── components/                 # Reusable UI components
│   │   ├── InitialLayout.tsx       # Auth-gated Stack (Stack.Protected)
│   │   ├── Post.tsx                # Feed post card
│   │   ├── Comment.tsx             # Single comment row
│   │   ├── CommentsModal.tsx       # Comments list + input modal
│   │   ├── Notification.tsx        # Notification row
│   │   ├── Stories.tsx             # Horizontal stories strip
│   │   ├── Story.tsx               # Single story bubble
│   │   └── Loader.tsx              # Centered activity indicator
│   ├── constants/
│   │   ├── theme.ts                # COLORS palette (green on black)
│   │   └── mock-data.ts            # Static STORIES array (Unsplash avatars)
│   ├── hooks/
│   │   └── useWarmUpBrowser.ts     # Browser warm-up/cool-down for SSO
│   ├── providers/
│   │   └── ClerkAndConvexProvider.tsx  # ClerkProvider + ConvexProviderWithClerk
│   └── styles/                     # One StyleSheet module per feature area
│       ├── auth.styles.ts          # login + sso-callback screens
│       ├── create.styles.ts        # new-post screen
│       ├── feed.styles.ts          # feed, post, comments modal, stories
│       ├── notifications.styles.ts # notifications screen
│       └── profile.styles.ts       # both profile screens + modals
├── assets/
│   ├── fonts/                      # JetBrainsMono-Medium.ttf (loaded), SpaceMono-Regular.ttf (not loaded)
│   └── images/                     # icon.png, splash-icon.png, auth-bg-1/2/3.png, adaptive-icon.png
├── convex/                         # Convex backend — separate docs in README-backend.md
├── app.json                        # Expo project configuration
├── package.json / package-lock.json
├── tsconfig.json                   # extends expo/tsconfig.base, strict, path aliases
├── eslint.config.js                # eslint-config-expo flat config, ignores dist/*
└── expo-env.d.ts                   # Expo type reference (auto-generated)
```

Only `auth-bg-2.png`, `icon.png` and `splash-icon.png` are referenced by code/config: `auth-bg-1.png`, `auth-bg-3.png` and `adaptive-icon.png` exist in the repo but are not referenced anywhere (the Android adaptive icon in `app.json` reuses `icon.png` for all layers). `SpaceMono-Regular.ttf` is present but only `JetBrainsMono-Medium` is loaded.

## Screens and Navigation

Routing is file-based via Expo Router, with typed routes enabled (`experiments.typedRoutes` in `app.json`). The root layout renders `InitialLayout`, which switches between two protected stacks:

- `(auth)` is mounted when the user is **not** signed in
- `(tabs)` and `user/[id]` are mounted when the user **is** signed in

| Route | File | Description |
| --- | --- | --- |
| `/` (stack) | `src/app/_layout.tsx` | Loads `JetBrainsMono-Medium` with `useFonts`, hides the splash screen once loaded, completes pending web auth sessions, and wraps the app in `ClerkAndConvexProvider` → `SafeAreaProvider` → `SafeAreaView` (black background) plus light `StatusBar` and `NavigationBar` |
| `/(auth)/login` | `src/app/(auth)/login.tsx` | Brand screen (leaf logo, "spotlight", "don't miss anything"), illustration and a "Continue with Google" button that starts Clerk's Google SSO flow and redirects to the SSO callback |
| `/(auth)/sso-callback` | `src/app/(auth)/sso-callback.tsx` | Shows a spinner while Clerk completes the session; if the user is still not signed in after an 8-second timeout it replaces the route with `/(auth)/login` |
| `/(tabs)` (layout) | `src/app/(tabs)/_layout.tsx` | Bottom tab bar with hidden labels, black background and green active tint; tabs: home (`index`), `bookmarks`, `create` (green add-circle), `notifications`, `profile` |
| `/(tabs)` home | `src/app/(tabs)/index.tsx` | Feed header with app title and sign-out button, stories strip as list header, `FlatList` of `Post` cards, "No posts yet" empty state, and a pull-to-refresh control that is UI-only (the handler just shows the spinner for 2 seconds — the code comment says "this does nothing") |
| `/(tabs)/bookmarks` | `src/app/(tabs)/bookmarks.tsx` | 3-column grid of the user's bookmarked images (33.33% width, square, `expo-image` with memory-disk cache) or an empty state |
| `/(tabs)/create` | `src/app/(tabs)/create.tsx` | Two-step flow: tap to pick a square image (`expo-image-picker`), then preview it, write a caption and press Share. Sharing calls the Convex upload-URL mutation, uploads the file with `expo/fetch`, creates the post and navigates back to the feed; buttons are disabled and a spinner is shown while sharing |
| `/(tabs)/notifications` | `src/app/(tabs)/notifications.tsx` | `FlatList` of `Notification` rows or an empty state |
| `/(tabs)/profile` | `src/app/(tabs)/profile.tsx` | Own profile: username header with sign-out, avatar, stats (posts / followers / following), name and bio, "Edit Profile" button opening a modal with name + bio inputs, a 3-column post grid, and a fullscreen image modal when a post is tapped |
| `/user/[id]` | `src/app/user/[id].tsx` | Another user's profile by Convex user id: avatar, stats, name, bio, Follow/Following toggle button, posts grid, and a back button (falls back to `/(tabs)` when there is no history) |

Navigation helpers used across the app: `Link` (post author header → profile, notification avatar/username → user profile), `useRouter` (`router.push("/(tabs)")` after creating a post, `router.back()` / `router.replace`), and `useLocalSearchParams` for the `[id]` route parameter.

## Components, Hooks, Constants and Styles

| Module | Responsibility |
| --- | --- |
| `components/InitialLayout.tsx` | Reads Clerk `isLoaded` / `isSignedIn`; renders the `Stack` with `Stack.Protected` guards (returns nothing until Clerk has loaded) |
| `components/Post.tsx` | Feed card: author avatar/username linked to the right profile, trash icon for the owner (calls delete), post image, like / comment / bookmark actions, like count, caption, "View all N comments" and relative time; keeps local `isLiked` / `isBookmarked` state in sync with the returned mutation result |
| `components/CommentsModal.tsx` + `components/Comment.tsx` | Slide-up modal that queries comments for a post, lists them with a `Loader` while pending, and posts new comments (disabled when empty) |
| `components/Notification.tsx` | Notification row: sender avatar with type badge (heart / person-add / chatbubble), message text (followed / liked / commented with the comment text), relative time, and the related post thumbnail |
| `components/Stories.tsx` + `components/Story.tsx` | Horizontal story bubbles driven entirely by the `STORIES` array in `constants/mock-data.ts` (8 hardcoded entries with Unsplash avatar URLs and a `hasStory` flag that toggles the ring style) |
| `components/Loader.tsx` | Named-export `Loader` component — full-flex centered `ActivityIndicator` in the primary green color |
| `hooks/useWarmUpBrowser.ts` | Calls `WebBrowser.warmUpAsync()` on mount and `coolDownAsync()` on unmount to make the SSO browser open faster |
| `constants/theme.ts` | `COLORS` palette: `primary` `#4ADE80`, `secondary` `#2DD4BF`, `background` `#000000`, `surface` `#1A1A1A`, `surfaceLight` `#2A2A2A`, `white`, `grey` `#9CA3AF` |
| `constants/mock-data.ts` | Static `STORIES` array (not connected to the backend) |
| `styles/*.styles.ts` | Exported `styles` `StyleSheet` objects per feature area, all built on `COLORS`; feed/profile styles use `Dimensions.get("window")` for responsive grid and modal sizing |
| `providers/ClerkAndConvexProvider.tsx` | Creates a single `ConvexReactClient` from `EXPO_PUBLIC_CONVEX_URL` (with `unsavedChangesWarning: false`), throws a descriptive error when `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing, and nests `ClerkProvider` (with `tokenCache`) → `ConvexProviderWithClerk` → `ClerkLoaded` |

## Configuration

### `app.json`

- App identity: name **Spotlight**, slug `spotlight`, version `1.0.0`, deep-link scheme `spotlight`, portrait orientation, automatic user interface style
- Icons/splash: `icon.png` for the app icon and Android adaptive icon layers, `splash-icon.png` (240 px wide) on a `#097e28` background; Android `predictiveBackGestureEnabled: false`; web output `static` with `icon.png` as favicon
- Plugins: `expo-router`, `expo-splash-screen`, `@clerk/expo`, `expo-secure-store`, `expo-web-browser`
- Experiments: `typedRoutes: true`, `reactCompiler: true`

### Environment variables

| Variable | Used by | Notes |
| --- | --- | --- |
| `EXPO_PUBLIC_CONVEX_URL` | `src/providers/ClerkAndConvexProvider.tsx` | URL of the Convex deployment the app connects to. Present in the gitignored `.env.local`; documented further in `README-backend.md` |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | `src/providers/ClerkAndConvexProvider.tsx` | Clerk publishable key. The provider throws "Missing Publishable Key…" when it is absent. Present in the gitignored `.env` |
| `EXPO_PUBLIC_CONVEX_SITE_URL` | not referenced by app code | Declared in the gitignored `.env.local` (the Convex HTTP site URL, which hosts the backend webhook route — see `README-backend.md`) |

`.env` and `.env.local` are both listed in `.gitignore`, so credentials are not committed; the values above are the variable names the code expects.

### `tsconfig.json`

Extends `expo/tsconfig.base` with `"strict": true` and path aliases `@/*` → `./src/*` and `@/assets/*` → `./assets/*`; includes all `.ts` / `.tsx` files plus `.expo/types` and `expo-env.d.ts`.

### `package.json` scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `start` | `expo start` | Start the Expo dev server |
| `android` | `expo start --android` | Start and open on Android |
| `ios` | `expo start --ios` | Start and open on iOS |
| `web` | `expo start --web` | Start and open the web target |
| `lint` | `expo lint` | Run ESLint (flat config from `eslint-config-expo`, ignoring `dist/*`) |
| `reset-project` | `node ./scripts/reset-project.js` | Declared in `package.json`, but `scripts/reset-project.js` does not exist in this repository, so the script cannot run as-is (it is leftover boilerplate from the Expo template) |

## Development Setup

```bash
npm install                      # install dependencies (npm, package-lock.json)

# The gitignored .env / .env.local must provide:
#   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=...
#   EXPO_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud

npx convex dev                   # start/connect the backend deployment (see README-backend.md)

npm run start                    # Expo dev server (or: npm run android / ios / web)
npm run lint                     # ESLint
npx tsc --noEmit                 # TypeScript typecheck
```

There is no test runner or test file in the repository, and no `eas.json`, so no EAS build/submit profile is configured. Some dependencies are native modules (for example `@clerk/expo` and `expo-secure-store`); running the full auth flow may require a development build instead of stock Expo Go. This could not be verified by running the app in this analysis.

## Backend Dependency

The app uses **Convex** as its backend and **Clerk** as its authentication provider. The Convex client is configured once in `src/providers/ClerkAndConvexProvider.tsx` (`ConvexProviderWithClerk` + Clerk `tokenCache`), and screens/components consume data with `useQuery` / `useMutation` from `convex/react` against the generated API in `convex/_generated/api`. For the schema, functions, indexes, webhook and backend environment variables, see [`README-backend.md`](./README-backend.md).

## Caveats / Not Implemented

- The feed's pull-to-refresh is a visual placeholder (handler only toggles the spinner for 2 seconds).
- The stories row uses static mock data and is not backed by the backend; story bubbles have no press action.
- The share icon on the profile screen has no `onPress` handler, and the "ellipsis" menu on other users' posts has no action.
- Profile screen state initializes the edit form from the loaded user but does not re-sync it when the user query resolves after first render.
- `package.json` contains a stray `"undefined": "expo/fetch"` dependency entry.
- Unused assets remain in the repo (`auth-bg-1.png`, `auth-bg-3.png`, `adaptive-icon.png`, `SpaceMono-Regular.ttf`).
- No tests, no CI workflows, and no EAS configuration are present in the repository.
