import { searchAmazon, getProductTechSpecByASIN } from "./searchAmazon";

describe("Scrap Amazon", () => {
  test("should get products", async () => {
    const products = await searchAmazon({ keyword: "phone", pageLimit: 2 });
    console.log(products);
    expect(products.length).toBeGreaterThanOrEqual(1);
  });

  test("should get product info", async () => {
    const productInfo = await getProductTechSpecByASIN("B089MS3GLM");
    console.log(productInfo);
    expect(productInfo).toMatchObject({});
  });
});
