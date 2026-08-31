# VEXFOUNDRY ORDER BOT

This project receives an order from your website and automatically:

1. Sends a premium confirmation email to the customer.
2. Sends a full copy of the order to your own email.
3. Detects the selected service and shows its starting price.
4. Includes your Discord link.
5. Includes your PayPal page, while clearly saying NOT TO PAY until the final price is agreed.

## 1. Install

Open this folder in CMD:

```bash
npm install
```

## 2. Configure email

Copy:

```text
.env.example
```

Rename the copy to:

```text
.env
```

Fill in your Gmail address and a Gmail App Password.

IMPORTANT: do not use your normal Gmail password.

## 3. Start the bot

```bash
npm start
```

You should see:

```text
VEXFOUNDRY Order Bot running on http://localhost:3001
```

## 4. Connect your React website

In `src/App.jsx`, inside your `submitOrder` function, replace the EmailJS send part with a request to this bot:

```js
const response = await fetch("http://localhost:3001/api/order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: form.get("name") || "",
    email: form.get("email") || "",
    service: form.get("service") || "",
    budget: form.get("budget") || "",
    message: form.get("message") || ""
  })
});

const result = await response.json();

if (!response.ok || !result.ok) {
  throw new Error(result.error || "Order failed");
}
```

After this works, your website sends the order directly to the VEXFOUNDRY Order Bot instead of relying on EmailJS.

## Important

For a real public website, `localhost:3001` only works on your own PC. Deploy this backend to a hosting service, then replace:

```text
http://localhost:3001
```

with your real backend URL.

Never put SMTP passwords or secrets inside the React frontend.
