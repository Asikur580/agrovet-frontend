# Radiant Agrovet — Frontend Design System

> **Version:** 1.0.0  
> **Target:** `agrovet-frontend` (React + Tailwind CSS + Ant Design / MUI)  
> **Philosophy:** Clean, Data-Dense, High-Legibility Enterprise ERP & Inventory UI.

---

## ১. The 60-30-10 Color Rule Architecture

UI ডিজাইনে ব্যালান্স এবং প্রফেশনাল লুক নিশ্চিত করার জন্য **60-30-10 রুল** সবচেয়ে কার্যকর ফ্রেমওয়ার্ক:

```
┌────────────────────────────────────────────────────────┐
│                      60% Dominant                      │
│            Canvas, Backgrounds, Cards, Whites          │
├──────────────────────────────┬─────────────────────────┤
│         30% Secondary        │       10% Accent        │
│   Structure, Sidebar, Text   │    CTA, Action, Focus   │
└──────────────────────────────┴─────────────────────────┘
```

### ১.১ ৬০% — Dominant (Canvas & Backgrounds)
পেজের ৬০% অংশ থাকবে নিউট্রাল ও শান্ত ব্যাকগ্রাউন্ড, যা দীর্ঘক্ষণ কাজ করলেও চোখে ক্লান্তি আনবে না।

| Token Name | Hex Code | Tailwind Class | ব্যবহার ক্ষেত্র |
| :--- | :--- | :--- | :--- |
| `bg-canvas` | `#F8FAFC` (Slate-50) | `bg-slate-50` | মূল পেজ ও বডি ব্যাকগ্রাউন্ড |
| `bg-surface` | `#FFFFFF` | `bg-white` | কার্ড, টেবিল, মডাল কনটেইনার |
| `bg-subtle` | `#F1F5F9` (Slate-100) | `bg-slate-100` | টেবিল হেডার, ড্রপডাউন ব্যাকগ্রাউন্ড, ফিল্টার বার |
| `border-subtle`| `#E2E8F0` (Slate-200) | `border-slate-200`| হালকা ডিভিডার ও কার্ড বর্ডার |

### ১.২ ৩০% — Secondary (Structure, Typography & Brand Base)
ব্র্যান্ডের মূল পরিচয়, স্ট্রাকচারাল এলিমেন্ট (Sidebar, Topbar, Table Headers) এবং টেক্সটের জন্য ৩০% নির্ধারিত।

| Token Name | Hex Code | Tailwind Class | ব্যবহার ক্ষেত্র |
| :--- | :--- | :--- | :--- |
| `brand-navy` | `#1E3A8A` / `#3B5898` | `bg-blue-900` / `bg-[#3b5898]` | সাইডবার, টপ ন্যাভবার, টেবিল প্রাইমারি হেডার |
| `text-primary` | `#0F172A` (Slate-900) | `text-slate-900` | মূল শিরোনাম ও প্রাইমারি ডাটা টেক্সট |
| `text-secondary`| `#475569` (Slate-600) | `text-slate-600` | সাব-টাইটেল, লেবেল, মেটা ডাটা |
| `text-muted` | `#94A3B8` (Slate-400) | `text-slate-400` | প্লেসহোল্ডার, ইনঅ্যাক্টিভ টেক্সট |
| `border-default`| `#CBD5E1` (Slate-300) | `border-slate-300` | ইনপুট ফিল্ড ও টেবিল বর্ডার |

### ১.৩ ১০% — Accent (Focal Points & Call-To-Action)
ব্যবহারকারীর দৃষ্টি আকর্ষণ করার মতো গুরুত্বপূর্ণ বোতাম, অ্যাক্টিভ স্টেট এবং হাইলাইটের জন্য ১০% সংরক্ষিত।

| Token Name | Hex Code | Tailwind Class | ব্যবহার ক্ষেত্র |
| :--- | :--- | :--- | :--- |
| `accent-primary` | `#F48726` (Radiant Orange) | `bg-orange-500` / `bg-[#f48726]` | Save, Submit, Confirm বাটন, এক্টিভ মেনু |
| `accent-hover` | `#DD6B10` | `hover:bg-orange-600` | অ্যাক্সেন্ট বাটনের হোভার স্টেট |
| `accent-light` | `#FFEDD5` (Orange-100) | `bg-orange-100` | সিলেক্টেড রো, হাইলাইটেড ব্যাজ ব্যাকগ্রাউন্ড |

---

## ২. Semantic & Status Colors (কার্যকরী স্ট্যাটাস কালার)

Agrovet-এর মতো ইনভেন্টরি, সেলস এবং স্টক সিস্টেমে স্ট্যাটাস স্পষ্টভাবে বোঝা জরুরি:

| Status | Color Name | Hex (Solid) | Hex (Soft Badge BG) | ব্যবহার |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | Emerald / Green | `#16A34A` | `#DCFCE7` | Paid, In Stock, Approved, Active |
| **Warning** | Amber / Yellow | `#D97706` | `#FEF3C7` | Low Stock, Partial Due, Pending |
| **Danger** | Rose / Red | `#DC2626` | `#FEE2E2` | Out of Stock, Due, Cancelled, Delete |
| **Info** | Sky / Blue | `#2563EB` | `#DBEAFE` | Processing, Draft, System Info |

---

## ৩. Typography System (ফন্ট ও টাইপ স্কেল)

* **Primary Font:** `"DM Sans", "Inter", -apple-system, sans-serif`
* **Monospace / Tabular Font:** `"Roboto Mono", "Courier New", monospace` (ইনভয়েস নম্বর, কারেন্সি, বারকোড এবং পরিমাণের জন্য `font-mono tabular-nums` ব্যবহার করতে হবে)।

| Level | Size | Weight | Line Height | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | 28px (1.75rem) | Bold (700) | 1.2 | `text-2xl font-bold` | ড্যাশবোর্ড প্রধান টাইটেল |
| **H1** | 22px (1.375rem) | SemiBold (600) | 1.3 | `text-xl font-semibold` | পেজ হেডার, মডাল টাইটেল |
| **H2** | 18px (1.125rem) | SemiBold (600) | 1.4 | `text-lg font-semibold` | সেকশন টাইটেল, কার্ড টাইটেল |
| **H3** | 16px (1.000rem) | Medium (500) | 1.4 | `text-base font-medium` | টেবিল কলাম হেডার, সাব-হেডিং |
| **Body** | 14px (0.875rem) | Regular (400) | 1.5 | `text-sm font-normal` | রেগুলার টেক্সট, টেবিল ডাটা সেল |
| **Small / Caption** | 12px (0.75rem) | Regular (400) | 1.4 | `text-xs font-normal` | হেল্পার টেক্সট, টাইমস্ট্যাম্প, ব্যাজ |

---

## ৪. Spacing, Sizing & Grid System (8pt Grid)

সবকিছু ৮-পয়েন্ট গ্রিড নিয়মে বিন্যস্ত থাকবে (মাঝে মাঝে সূক্ষ্ম প্রয়োজনে ৪px):

* `4px (0.25rem)` → `p-1`, `gap-1` (ব্যাজ প্যাডিং, আইকন মার্জিন)
* `8px (0.5rem)` → `p-2`, `gap-2` (ইনপুট প্যাডিং, টাইট লিস্ট স্পেসিং)
* `12px (0.75rem)` → `p-3`, `gap-3` (কমপ্যাক্ট টেবিল সেল প্যাডিং)
* `16px (1.0rem)` → `p-4`, `gap-4` (স্ট্যান্ডার্ড কার্ড প্যাডিং, গ্রিড গ্যাপ)
* `24px (1.5rem)` → `p-6`, `gap-6` (পেজ কন্টেইনার প্যাডিং, মডাল প্যাডিং)
* `32px (2.0rem)` → `p-8`, `gap-8` (লার্জ সেকশন সেপারেশন)

### Layout Dimensions:
* **Sidebar Width:** Expanded: `260px` | Collapsed: `72px`
* **Topbar Height:** `64px`
* **Table Row Height:** Dense: `40px` | Standard: `48px`
* **Button / Input Height:** Small: `32px` | Standard: `38px` | Large: `44px`

---

## ৫. Elevation & Shadows (ছায়া ও গভীরতা)

অতিরিক্ত ড্রপ-শ্যাডো না দিয়ে সফট ও ক্লিপড শ্যাডো ব্যবহার করুন:

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-card: 0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08);
--shadow-modal: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
```

* **Border Radius:**
  * `rounded-md` (`6px`) — ইনপুট ফিল্ড, টেবিল বাটন, ব্যাজ
  * `rounded-lg` (`8px` বা `10px`) — কার্ড, ড্রপডাউন মেনু, মডাল
  * `rounded-full` (`9999px`) — অবতার, স্ট্যাটাস ডট, পিল ব্যাজ

---

## ৬. Core Component Standards (কম্পোনেন্ট গাইডলাইন)

### ৬.১ Buttons (বাটন হায়ারার্কি)
1. **Primary Action (Accent 10%):**
   * Class: `bg-[#f48726] text-white hover:bg-[#dd6b10] px-4 py-2 rounded-md font-medium shadow-sm transition-all`
   * ব্যবহার: Create Invoice, Save, Submit, Checkout
2. **Secondary Button:**
   * Class: `bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 px-4 py-2 rounded-md font-medium transition-all`
   * ব্যবহার: Cancel, Reset, Back, Filter
3. **Ghost / Tertiary Button:**
   * Class: `text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-all`
   * ব্যবহার: Table row action (View, Edit), Icon buttons
4. **Destructive Button:**
   * Class: `bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 px-4 py-2 rounded-md font-medium transition-all`
   * ব্যবহার: Delete, Cancel Order

### ৬.২ Form Inputs (ইনপুট ফিল্ড)
* **Standard Input:**
  * Background: `bg-white`
  * Border: `border border-slate-300 focus:border-[#3b5898] focus:ring-2 focus:ring-blue-100`
  * Text: `text-slate-800 placeholder:text-slate-400 text-sm`
  * Padding: `px-3 py-2 rounded-md`
* **Error State:**
  * `border-red-500 focus:ring-red-100 text-red-900` + নিচে `text-xs text-red-600` এরর মেসেজ।

### ৬.৩ Data Tables (ডাটা টেবিল নীতি)
Agrovet অ্যাপে টেবিল হলো সবচেয়ে গুরুত্বপূর্ণ অংশ:
* **Header:** `bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200`
* **Row:** `border-b border-slate-100 hover:bg-blue-50/40 transition-colors`
* **Numeric Columns:** সব সংখ্যা, প্রাইস, স্টক ডানপাশে অ্যালাইন থাকবে (`text-right font-mono`).
* **Actions Column:** সবসময় ফিক্সড উইডথ এবং স্পষ্ট আইকন থাকবে।

### ৬.৪ Status Badges (স্ট্যাটাস পিল)
ডার্ক ব্যাকগ্রাউন্ডের বদলে **Soft background + Dark text** আধুনিক ও সহজে পড়া যায়:
* **Paid / Active:** `bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium`
* **Due / Pending:** `bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium`
* **Failed / Out of Stock:** `bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-medium`

---

## ৭. Implementation Code (প্রজেক্টে ব্যবহারের কোড)

### ৭.১ `tailwind.config.js` আপডেট কনফিগারেশন:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 60% Dominant Canvas
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-muted": "#F1F5F9",

        // 30% Secondary & Structure
        brand: {
          DEFAULT: "#3B5898",
          dark: "#1E3A8A",
          light: "#E0E7FF",
        },
        slate: {
          border: "#E2E8F0",
          heading: "#0F172A",
          body: "#334155",
          muted: "#64748B",
        },

        // 10% Accent
        accent: {
          DEFAULT: "#F48726",
          hover: "#DD6B10",
          light: "#FFEDD5",
        },

        // Semantics
        status: {
          success: "#16A34A",
          "success-bg": "#DCFCE7",
          warning: "#D97706",
          "warning-bg": "#FEF3C7",
          danger: "#DC2626",
          "danger-bg": "#FEE2E2",
          info: "#2563EB",
          "info-bg": "#DBEAFE",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "Inter", "sans-serif"],
        mono: ['"Roboto Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
      },
    },
  },
  plugins: [],
};
```

### ৭.২ `variables.css` গ্লোবাল সিএসএস টোকেন:

```css
:root {
  /* 60% Dominant */
  --bg-canvas: #f8fafc;
  --bg-surface: #ffffff;
  --bg-subtle: #f1f5f9;

  /* 30% Secondary & Brand */
  --brand-primary: #3b5898;
  --brand-dark: #1e3a8a;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border-color: #e2e8f0;

  /* 10% Accent */
  --accent-color: #f48726;
  --accent-hover: #dd6b10;
  --accent-light: #ffedd5;

  /* Semantics */
  --status-success: #16a34a;
  --status-warning: #d97706;
  --status-danger: #dc2626;
  --status-info: #2563eb;

  /* Transitions & Shadows */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
  --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.08);
}
```

### ৭.৩ Ant Design `ConfigProvider` থিম ইন্টিগ্রেশন:
যদি প্রোজেক্টে Ant Design কম্পোনেন্ট ব্যবহার করা হয়, তবে `src/App.jsx` বা `main.jsx`-এ নিচের থিম টোকেন সেট করতে পারেন:

```jsx
import { ConfigProvider } from "antd";

const themeConfig = {
  token: {
    colorPrimary: "#3B5898", // 30% Brand
    colorInfo: "#3B5898",
    colorSuccess: "#16A34A",
    colorWarning: "#D97706",
    colorError: "#DC2626",
    colorBgBase: "#FFFFFF",
    colorBgLayout: "#F8FAFC", // 60% Canvas
    fontFamily: '"DM Sans", sans-serif',
    borderRadius: 6,
  },
  components: {
    Button: {
      colorPrimary: "#F48726", // Primary buttons get the 10% Accent
      colorPrimaryHover: "#DD6B10",
    },
  },
};

export default function AppWrapper({ children }) {
  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}
```

---

## ৮. Developer Golden Rules (ডেভেলপারের করণীয়)

1. **কোনো র‍্যান্ডম Hex Code নয়:** যেকোনো কালার দেওয়ার সময় `tailwind.config.js` বা `variables.css` থেকে টোকেন ব্যবহার করুন।
2. **প্রতিটি পেজে 60-30-10 অনুপাত বজায় রাখুন:** ব্যাকগ্রাউন্ড ও কার্ড ৬০%, হেডার/টেক্সট/বর্ডার ৩০%, এবং অ্যাকশন বাটন/নোটিফিকেশন ১০%।
3. **টেবিল ও ফর্মের টেক্সট কন্ট্রাস্ট:** ডাটা সবসময় `text-slate-900` বা `text-slate-800` দিয়ে রাখবেন যাতে প্রিন্ট বা রোদ্রেও স্পষ্টভাবে পড়া যায়।
4. **ট্যাবুলার ডাটা ফরম্যাট:** সব টাকার হিসাব বা পরিমাণের ঘরে `font-mono tabular-nums text-right` ব্যবহার করুন।
