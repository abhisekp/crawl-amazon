import {
  searchAmazon,
  getProductTechSpecByASIN,
  SearchAmazonOptions
} from "../../utils/amazon/searchAmazon";
import pMap from "p-map";
import { logger } from "../../utils/logger";
import {
  ProductModel,
  ProductPropSchema,
  ProductSchema
} from "../../models/product.model";
import * as _ from "lodash/fp";
import _nofp from "lodash";
import { getRedisClient } from "../../utils/redis";

export class SearchService {
  async getAllProducts() {
    // @ts-ignore
    return await ProductModel.paginate();
  }

  async searchAmazon({
    keyword,
    pageLimit
  }: SearchAmazonOptions): Promise<
    {
      key: string;
      pdf?: string;
      [key: string]: string;
    }[]
  > {
    const rclient = await getRedisClient();

    // @ts-ignore
    let mongoIds = await rclient.smembersAsync(keyword);

    if (mongoIds.length) {
      // fetch from db
      const dbResult = await ProductModel.find({
        _id: {
          $in: mongoIds
        }
      });
      if (dbResult.length) {
        return dbResult.map(curr => {
          return curr.props.reduce(
            (acc, item) => {
              acc[item.label] = item.value;
              return acc;
            },
            {
              key: curr.title,
              pdf: curr.pdfFile
            }
          );
        });
      }

      // @ts-ignore
      rclient.delAsync(keyword).catch(err => {
        logger.error("Could not delete from redis");
        logger.error(err);
      });
    }

    // get all results
    const asins = await searchAmazon({ keyword, pageLimit });

    const result = await pMap<string, { key: string; [key: string]: string }>(
      asins,
      async asin => {
        const productTechSpec = await getProductTechSpecByASIN(asin);
        const fetchedAt = new Date();

        const productDBTechSpec = _nofp.reduce<
          { [key: string]: string },
          Partial<ProductPropSchema>[]
        >(
          productTechSpec,
          (props, value, key) => {
            props.push({
              label: key,
              value
            });
            return props;
          },
          []
        );

        // asyncly store in db
        ProductModel.create({
          asin: asin,
          title: productTechSpec.title,
          props: productDBTechSpec,
          fetchedAt
        })
          .catch(err => {
            logger.error(`${asin}: Could not store in db`);
            logger.error(err);
          })
          .then(async (result: ProductSchema) => {
            logger.info(`Stored ${asin} (${result.id}) in db`);
            mongoIds.push(result.id);
          });

        return Object.assign(productTechSpec, { key: productTechSpec.title });
      },
      {
        concurrency: 10
      }
    ).then(
      _.tap(() => {
        // asyncly store in redis after db update
        rclient
          // @ts-ignore
          .saddAsync(keyword, mongoIds)
          .then(count => {
            logger.info(`Added ${count} ids to redis for keyword "${keyword}"`);
          })
          .catch(err => {
            logger.error(`Could not store in redis for keyword "${keyword}"`);
            logger.error(err);
          });
      })
    );

    return result;
  }
}
