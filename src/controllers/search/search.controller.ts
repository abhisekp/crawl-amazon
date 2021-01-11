import {
  ContextRequest,
  Return,
  QueryParam,
  Path,
  GET,
  PathParam
} from "typescript-rest";
import { Request } from "express";
import { Inject } from "typescript-ioc";
import { SearchService } from "./search.service";

@Path("")
export class SearchAPIService {
  @Inject
  searchService: SearchService;

  @ContextRequest req: Request;

  @Path("/(:asin).pdf")
  @GET
  async getPDF(
    @PathParam("asin") asin: string,
    @QueryParam('force') force: boolean,
  ): Promise<Return.DownloadResource> {
    return this.searchService.getPDF(asin, force);
  }

  @Path("/search")
  @GET
  async search(
    @QueryParam("keyword") keyword: string,
    @QueryParam("pageLimit") pageLimit: number
  ): Promise<{ [key: string]: any }> {
    try {
      return this.searchService.searchAmazon({
        pageLimit,
        keyword,
        baseUrl: this.req.protocol + "://" + this.req.get("host")
      });
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
