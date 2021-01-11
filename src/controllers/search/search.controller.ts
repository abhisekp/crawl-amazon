import { searchAmazon } from "../../utils/amazon/searchAmazon";
import { QueryParam, Path, GET } from "typescript-rest";

@Path("/search")
export class SearchService {
  @Path("")
  @GET
  async search(
    @QueryParam("keyword") keyword: string,
    @QueryParam("pageLimit") pageLimit: number
  ): Promise<{ [key: string]: any }> {
    try {
      const ASINs = await searchAmazon({ keyword, pageLimit });
      // store in mongodb
      return ASINs;
    } catch (error) {}

    // get from mongodb
    return;
  }
}
