// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

import { connectDB } from "./utils/db.js";
import { Faq } from "./Routes/Faq.Route.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);
app.set('trust proxy', true);
// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

// @ts-ignore
async function authenticateUser(req, res, next) {
  try {
    let shop = req.query.shop;
    let session = await shopify.config.sessionStorage.findSessionsByShop(shop);

    if (shop === session[0].shop) {
      next();
    }
    else {
      console.log("session not found")
    }
  } catch (error) {
    console.error(error);
  }
}

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/proxy/*", authenticateUser);


app.use(express.json());
connectDB();

// App Routes //
const APIRoutes = [Faq]

APIRoutes.forEach((route) => {
  app.use("/api", route);
  app.use("/proxy", route);
});


app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
