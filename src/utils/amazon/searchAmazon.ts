import { request } from "../http";
import * as _ from "lodash/fp";
import cheerio from "cheerio";
import pTimes from "p-times";
import cheerioTableparser from "cheerio-tableparser";
import { getUserAgent } from "../getUserAgent";

export const getSearchUrl = ({ page, keyword }) =>
  `https://www.amazon.in/s?k=${keyword}&page=${page}`;

export const fetchSearchResultPage = async ({
  keyword,
  page
}: {
  keyword: string;
  page: number;
}): Promise<HTML> => {
  const response = await request().get<string>(
    getSearchUrl({ keyword, page }),
    {
      headers: {
        "User-Agent": getUserAgent()
      }
    }
  );

  const html = response.data;
  return html;
};

export const getASIN = (product: cheerio.TagElement) => {
  return product.attribs["data-asin"];
};

export type SearchAmazonOptions = {
  keyword?: string;
  limit?: number;
  pageLimit?: number;
};
const withSearchOptions = _.defaults<SearchAmazonOptions>({
  pageLimit: 1,
  limit: 100
});
/**
 * Return an array of product ASINs
 * @param opts
 */
export const searchAmazon = async (
  opts: SearchAmazonOptions = {}
): Promise<string[]> => {
  const { keyword, limit, pageLimit } = withSearchOptions(opts);
  const results = _.flatten(
    await pTimes(
      pageLimit,
      async page => {
        const pageHTML = await fetchSearchResultPage({ keyword, page });
        const products = await getProducts(pageHTML);
        return products
          .map((i, c: cheerio.TagElement) => getASIN(c))
          .toArray()
          .map(String);
      },
      {
        concurrency: 10
      }
    )
  );

  return results;
};

export const getProducts = (html: string): cheerio.Cheerio => {
  const $ = cheerio.load(html);
  const products = $('[data-component-type="s-search-result"]');
  return products;
};

export const fetchProductInfoUrl = ({ asin }) =>
  `https://www.amazon.in/dp/${asin}`;

export const fetchProductInfoPageByASIN = async (asin: ID): Promise<HTML> => {
  const response = await request().get<HTML>(fetchProductInfoUrl({ asin }), {
    headers: {
      "User-Agent": getUserAgent()
    }
  });

  const html = response.data;
  return html;
};

export const getProductTechSpec = (html: string): { [key: string]: string } => {
  const $ = cheerio.load(html);
  const productSpecHTML = $("#productDetails_techSpec_section_1")
    .parent()
    .html()
    .trim();
  // console.log(productSpecHTML);
  const $table = cheerio.load(productSpecHTML);
  cheerioTableparser($table);
  // @ts-ignore
  const techSpecs = $table(productSpecHTML).parsetable(false, false, true);
  // console.log(techSpecs);
  // @ts-ignore
  return _.zipObject(techSpecs[0], techSpecs[1]);
};

export const getProductTitle = (html: HTML): string => {
  const $ = cheerio.load(html);
  const title = $("#productTitle").text();
  return title;
};

export const getProductTechSpecByASIN = async (
  asin: ID
): Promise<{ [key: string]: string }> => {
  const productInfoHTML: HTML = await fetchProductInfoPageByASIN(asin);
  const productTitle = getProductTitle(productInfoHTML);
  const productInfo = getProductTechSpec(productInfoHTML);
  // @ts-ignore
  return Object.assign(productInfo, { title: productTitle });
};
