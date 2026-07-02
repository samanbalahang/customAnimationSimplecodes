# Simple Tailwind CSS Animation Demo

<a href="https://samanbalahang.github.io/customAnimationSimplecodes/index.html">
    live Demp
</a>

A simple HTML project showcasing basic animations built with **Tailwind CSS**.

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js
- npm (comes with Node.js)

You can verify your installation by running:

```bash
node -v
npm -v
```

## Installation

1. Clone or download this repository.

2. Open a terminal in the project folder.

3. Initialize npm (if `package.json` doesn't already exist):

```bash
npm init -y
```

4. Install the project dependencies:

```bash
npm install
```

## Build Tailwind CSS

Run the following command to compile Tailwind CSS and watch for changes:

```bash
npx @tailwindcss/cli -i ./tailwind/style.css -o ./src/style.min.css --watch --minify
```

This command will:

- Compile your Tailwind CSS
- Minify the output
- Watch for file changes and automatically rebuild

## Running the Project

After Tailwind finishes building:

1. Open `index.html` in your browser.

Or, for a better development experience, use a local server such as:

- VS Code **Live Server** extension
- Any local HTTP server

## Project Structure

```
.
├── index.html
├── package.json
├── tailwind/
│   └── style.css
└── src/
    └── style.min.css
```

## Notes

- Keep the Tailwind CLI running while editing your files.
- Any changes to your Tailwind classes will automatically regenerate `style.min.css`.
- This project is intended as a simple demonstration of HTML, CSS, and Tailwind-based animations.

## License

Feel free to use, modify, and learn from this project.


# دمو ساده انیمیشن با Tailwind CSS

این پروژه یک نمونه ساده از انیمیشن‌های HTML و CSS است که با استفاده از **Tailwind CSS** ساخته شده است.

## پیش‌نیازها

قبل از اجرای پروژه، مطمئن شوید که موارد زیر روی سیستم شما نصب شده‌اند:

- Node.js
- npm (به همراه Node.js نصب می‌شود)

برای بررسی نصب صحیح، دستورات زیر را اجرا کنید:

```bash
node -v
npm -v
```

---

## نصب پروژه

ابتدا وارد پوشه پروژه شوید، سپس دستورات زیر را اجرا کنید.

### 1. ایجاد فایل package.json

```bash
npm init -y
```

### 2. نصب وابستگی‌ها

```bash
npm install
```

---

## اجرای Tailwind CSS

برای کامپایل فایل‌های Tailwind و فعال کردن حالت Watch، دستور زیر را اجرا کنید:

```bash
npx @tailwindcss/cli -i ./tailwind/style.css -o ./src/style.min.css --watch --minify
```

این دستور:

- فایل‌های Tailwind را کامپایل می‌کند.
- خروجی را Minify می‌کند.
- با هر تغییری در فایل‌ها، خروجی را به‌صورت خودکار به‌روزرسانی می‌کند.

---

## اجرای پروژه

پس از اجرای دستور بالا، فایل **index.html** را در مرورگر باز کنید.

برای تجربه بهتر در زمان توسعه، پیشنهاد می‌شود از یکی از موارد زیر استفاده کنید:

- افزونه **Live Server** در VS Code
- یا هر وب‌سرور محلی (Local Server)

---

## ساختار پروژه

```text
.
├── index.html
├── package.json
├── tailwind/
│   └── style.css
└── src/
    └── style.min.css
```

---

## نکات

- هنگام توسعه، ترمینال مربوط به Tailwind را باز نگه دارید.
- هر تغییری در کلاس‌های Tailwind به‌صورت خودکار در فایل `style.min.css` اعمال خواهد شد.
- این پروژه صرفاً برای نمایش چند انیمیشن ساده با HTML، CSS و Tailwind CSS ساخته شده است.

---

## دموی آنلاین

<a href="https://samanbalahang.github.io/customAnimationSimplecodes/index.html" target="_blank">
مشاهده دموی آنلاین
</a>

---

## مجوز

استفاده، ویرایش و یادگیری از این پروژه برای همه آزاد است.