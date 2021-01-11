import { Path, GET } from "typescript-rest";

@Path("/health")
export class HealthService {
  @Path("")
  @GET
  async search(): Promise<{ [key: string]: any }> {
    return { status: "OK" };
  }
}
