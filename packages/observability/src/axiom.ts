import { Axiom } from "@axiomhq/js";

const AXIOM_TOKEN = process.env.NEXT_PUBLIC_AXIOM_TOKEN || "";

const axiomClient = new Axiom({
  token: AXIOM_TOKEN,
});

export default axiomClient;
