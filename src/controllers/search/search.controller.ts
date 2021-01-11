import { QueryParam, Path, GET } from "typescript-rest";
import { Inject } from "typescript-ioc";
import { SearchService } from "./search.service";

@Path("")
export class SearchAPIService {
  @Inject
  searchService: SearchService;

  @Path("/search")
  @GET
  async search(
    @QueryParam("keyword") keyword: string,
    @QueryParam("pageLimit") pageLimit: number
  ): Promise<{ [key: string]: any }> {
    try {
      return this.searchService.searchAmazon({ pageLimit, keyword });
    } catch (error) {}

    // get from mongodb
    return;
  }

  @Path("amazon")
  @GET
  async getAll() {
    return this.searchService.getAllProducts();
  }
}
