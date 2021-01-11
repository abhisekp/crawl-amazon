import { searchAmazon, getProductTechSpecByASIN } from "./searchAmazon";
import { logger } from "../logger";

describe("Scrap Amazon", () => {
  test("should get products", async () => {
    const products = await searchAmazon({ keyword: "phone", pageLimit: 2 });
    logger.info(products);
    expect(products.length).toBeGreaterThanOrEqual(1);
  });

  test("should get product info", async () => {
    const productInfo = await getProductTechSpecByASIN("B089MS3GLM");
    logger.info(productInfo);
    expect(productInfo).toMatchObject({});
  });
});
