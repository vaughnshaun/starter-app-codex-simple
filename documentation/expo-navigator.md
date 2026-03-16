# Expo Router – File-Based Routing

## 1. Core Concept
Expo Router uses **file-based routing**.

- Any file inside the `app/` directory automatically becomes a route.

Example:
app/profile.tsx → /profile

---

## 2. Special Files

### `_layout.tsx`
Defines shared layout and navigation for routes in that folder.

**Rules**
- Routes inherit from the **nearest `_layout.tsx`** in the directory tree.
- Commonly used for:
  - Stack navigation
  - Tab navigation
  - Shared UI wrappers

Example:
app/
  _layout.tsx
  profile.tsx

---

## 3. Index Routes

`index.tsx` represents the **default route for a folder**.

**Examples**
app/index.tsx → /  
app/profile/index.tsx → /profile  

### Index Inside Route Groups
Because route groups are ignored in the URL:

app/(auth)/index.tsx → /

⚠ Multiple `index.tsx` files across groups may resolve to the **same route (`/`)**.

---

## 4. Route Groups `( )`

Route groups are folders wrapped in parentheses.

**Purpose**
- Organization
- Layout separation

**Important rule**
- Group names **do NOT appear in the URL**.

Example:
app/(auth)/login.tsx → /login

Typical structure:

app/
  (auth)/
    login.tsx
  (tabs)/
    profile.tsx

Routes:
/login  
/profile

---

## 5. Route Conflicts

Every route must resolve to a **unique URL path**.

Example conflict:

app/(auth)/profile.tsx  
app/(tabs)/profile.tsx  

Both resolve to:
/profile

This causes a **route conflict error**.

---

## 6. Best Practices

- Use route groups to **separate layouts or flows** (auth, tabs, modals).
- Ensure **final URL paths are unique**.
- Prefer having **one clear owner of `/`**.